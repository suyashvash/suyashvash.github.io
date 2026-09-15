/**
 * Contact form.
 *
 * Writes to Firestore via ./core/leads.js, tagged `source: "FIRM_ENQUIRY"`.
 * The Firebase SDK is loaded on first interaction with the form, never at
 * page load, so it stays off the critical path.
 *
 * If the write fails for any reason the form falls back to a mailto: handoff
 * rather than swallowing the enquiry — a lead lost to a network blip is the
 * most expensive possible failure on this page.
 */

import { submitLead, warmUp } from '../core/leads.js';

const FALLBACK_EMAIL = 'suyashvashishtha@gmail.com';

const setError = (input, msgEl, message) => {
  const has = Boolean(message);
  input.setAttribute('aria-invalid', String(has));
  msgEl.textContent = message ?? '';
  msgEl.hidden = !has;
  return !has;
};

/** Hand off to the user's mail client so the enquiry is never simply lost. */
function mailtoHandoff(data) {
  const subject = encodeURIComponent(`Project enquiry — ${data.name}`);
  const body = encodeURIComponent(
    `${data.message}\n\n— ${data.name} (${data.email})\nNeeds: ${data.need}`
  );
  window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submit = form.querySelector('.contact-submit');
  const name = form.querySelector('#f-name');
  const email = form.querySelector('#f-email');
  const message = form.querySelector('#f-message');

  // Fetch the SDK the moment someone shows intent, so the eventual submit
  // feels instant. Idempotent, and a failure here is not surfaced — the
  // submit path retries and falls back on its own.
  let warmed = false;
  const warm = () => {
    if (warmed) return;
    warmed = true;
    warmUp().catch(() => { /* submit handles it */ });
  };
  form.addEventListener('focusin', warm, { once: true });
  form.addEventListener('pointerenter', warm, { once: true });

  const validate = () => {
    let ok = true;
    ok = setError(name, document.getElementById('e-name'),
      name.value.trim() ? null : 'Please tell us your name.') && ok;
    ok = setError(email, document.getElementById('e-email'),
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? null : 'A valid email, so we can reply.') && ok;
    ok = setError(message, document.getElementById('e-message'),
      message.value.trim().length >= 10 ? null : 'A sentence or two about what you are building.') && ok;
    return ok;
  };

  [name, email, message].forEach((el) =>
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate();
    })
  );

  const setBusy = (busy) => {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submit.textContent = busy ? 'Sending…' : 'Send it';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) {
      status.dataset.state = 'error';
      status.textContent = 'Please check the highlighted fields.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    setBusy(true);
    status.dataset.state = '';
    status.textContent = 'Sending…';

    try {
      await submitLead(data);
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = 'Received. You will hear back within two working days.';
      if (typeof gtag === 'function') gtag('event', 'firm_enquiry_sent');
    } catch (err) {
      console.error('[leads] write failed:', err);
      if (typeof gtag === 'function') {
        gtag('event', 'firm_enquiry_error', { error_code: err?.code ?? 'unknown' });
      }
      status.dataset.state = 'error';
      status.textContent = 'That did not send. Opening your email client instead…';
      mailtoHandoff(data);
    } finally {
      setBusy(false);
    }
  });
}
