/**
 * Contact form.
 *
 * Deliberately NOT wired to the personal portfolio's Firebase project
 * (suyash-portfolio-b9bf5). Mixing firm leads into a personal Firestore and
 * shipping a personal config on a business domain is wrong on both counts.
 *
 * Set ENDPOINT to a Formspree/Web3Forms URL (no keys in the repo, no SDK on
 * the critical path) or to a dedicated Cosmic Shaft project. Until it is set,
 * the form falls back to a mailto: handoff so it is never a dead end.
 */

const ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'
const FALLBACK_EMAIL = 'suyashvashishtha@gmail.com';

const setError = (input, msgEl, message) => {
  const has = Boolean(message);
  input.setAttribute('aria-invalid', String(has));
  msgEl.textContent = message ?? '';
  msgEl.hidden = !has;
  return !has;
};

export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const name = form.querySelector('#f-name');
  const email = form.querySelector('#f-email');
  const message = form.querySelector('#f-message');

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

  // Clear an error as soon as the field is corrected.
  [name, email, message].forEach((el) =>
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validate();
    })
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) {
      status.dataset.state = 'error';
      status.textContent = 'Please check the highlighted fields.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    status.dataset.state = '';
    status.textContent = 'Sending…';

    if (!ENDPOINT) {
      // No backend configured yet — hand off rather than silently fail.
      const subject = encodeURIComponent(`Project enquiry — ${data.name}`);
      const body = encodeURIComponent(
        `${data.message}\n\n— ${data.name} (${data.email})\nNeeds: ${data.need}`
      );
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      status.dataset.state = 'ok';
      status.textContent = 'Opening your email client…';
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.dataset.state = 'ok';
      status.textContent = 'Received. You will hear back within two working days.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = `Something went wrong. Email us directly at ${FALLBACK_EMAIL}.`;
    }
  });
}
