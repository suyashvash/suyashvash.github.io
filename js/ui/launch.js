/**
 * Launch — the send confirmation.
 *
 * The enquiry is already saved before this runs. Nothing here gates the
 * outcome: the form's aria-live status announces success independently, so a
 * screen-reader user never waits on an animation, and if this module fails
 * the lead is still captured.
 *
 * Built once, on first use, then reused.
 */

const DURATION = 3400;
const SPARKS = 9;

let el = null;

function build() {
  if (el) return el;

  el = document.createElement('div');
  el.className = 'launch';
  // Decorative: the real announcement lives in the form's status region.
  el.setAttribute('aria-hidden', 'true');

  const sparks = Array.from({ length: SPARKS }, (_, i) => {
    // Fan outward and mostly upward, in the rocket's wake.
    const angle = (-90 + (i - SPARKS / 2) * 13) * (Math.PI / 180);
    const dist = 70 + Math.random() * 90;
    const dx = Math.round(Math.cos(angle) * dist);
    const dy = Math.round(Math.sin(angle) * dist);
    const delay = 300 + i * 55;
    return `<i class="launch-spark" style="--dx:${dx}px;--dy:${dy}px;--d:${delay}ms"></i>`;
  }).join('');

  el.innerHTML = `
    <div class="launch-stage">
      <i class="launch-comet"></i>
      ${sparks}
      <i class="launch-trail"></i>
      <svg class="launch-rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.5c3.1 2.4 5 6 5 9.9L12 17l-5-4.6c0-3.9 1.9-7.5 5-9.9Z"/>
        <circle cx="12" cy="9.5" r="1.9"/>
        <path d="M7 12.4 4.2 14l1.2 3.6 2.6-1.3M17 12.4l2.8 1.6-1.2 3.6-2.6-1.3"/>
        <path d="M10.4 18.6 12 21.5l1.6-2.9"/>
      </svg>
      <div class="launch-copy">
        <h2 class="gold-flat">Away it goes.</h2>
        <p>Your enquiry is with us. You will hear back from the person who would run the work, within two working days.</p>
        <span class="mono">COSMIC SHAFT · JAIPUR, INDIA</span>
      </div>
    </div>`;

  document.body.appendChild(el);
  return el;
}

/**
 * Play the launch. Resolves when it has cleared.
 * @returns {Promise<void>}
 */
export function playLaunch() {
  const node = build();

  // Restart cleanly if fired twice: removing and re-adding the class in the
  // same frame is coalesced and the animations would not replay.
  node.classList.remove('is-live');
  void node.offsetWidth;   // force reflow so the restart actually takes

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hold = reduced ? 2000 : DURATION;

  node.classList.add('is-live');
  // Lock scrolling so the page cannot move underneath the launch.
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  return new Promise((resolve) => {
    const end = () => {
      node.classList.remove('is-live');
      document.body.style.overflow = prevOverflow;
      resolve();
    };

    const timer = setTimeout(end, hold);

    // Let people dismiss it early — a confirmation should never feel like
    // a wait they are trapped in.
    const skip = () => { clearTimeout(timer); end(); };
    node.addEventListener('click', skip, { once: true });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key !== 'Escape') return;
      document.removeEventListener('keydown', onKey);
      skip();
    });
  });
}
