/**
 * Pointer tilt — cards floating in space.
 *
 * Writes --rx / --ry / --mx / --my on the card and lets CSS do the transform.
 * Deliberately NOT a per-element rAF loop: pointermove already fires at
 * roughly frame rate, and the single RAF loop in core/raf.js is reserved for
 * the WebGL scene.
 *
 * Reads layout ONCE per pointerenter and caches the rect, so the hot
 * pointermove path never touches getBoundingClientRect — a forced reflow
 * there is a classic INP killer.
 */

const MAX_TILT = 7;   // degrees. Past ~9 it stops reading as "floating"
                      // and starts reading as "broken perspective".

export function initTilt(selector = '.cap') {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // The deal animation owns the transform until it finishes. Only then does
  // the card become tiltable — otherwise the two fight and the card snaps.
  const settle = (card) => {
    if (card.classList.contains('is-settled')) return;
    card.classList.add('is-settled');
  };

  cards.forEach((card) => {
    // Hand over once the deal transition ends. transitionend can fire per
    // property, so filter to the one we care about.
    card.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform' && card.classList.contains('is-in')) settle(card);
    });
    // Belt and braces: if the card was revealed without a transition (the
    // reveal failsafe, or a cached instant paint) settle it anyway.
    setTimeout(() => { if (card.classList.contains('is-in')) settle(card); }, 2600);

    let rect = null;
    let raf = 0;
    let pending = null;

    /* Gate on the ACTUAL pointer, not a media query. `(pointer: fine)`
       reports the PRIMARY input, so a touchscreen laptop with a mouse
       plugged in evaluates false and would lose the tilt entirely. The
       event itself tells us exactly what is hovering. */
    const isHoverPointer = (event) => event.pointerType !== 'touch';

    const write = () => {
      raf = 0;
      if (!rect || !pending) return;

      // -0.5 … 0.5 across each axis, from the card's centre.
      const px = (pending.x - rect.left) / rect.width - 0.5;
      const py = (pending.y - rect.top) / rect.height - 0.5;

      // Y tilt follows horizontal movement, X tilt follows vertical, and
      // X is inverted so the card leans *toward* the pointer.
      card.style.setProperty('--ry', `${(px * MAX_TILT * 2).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-py * MAX_TILT * 2).toFixed(2)}deg`);

      // Sheen follows the pointer across the surface.
      card.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
    };

    const onEnter = (event) => {
      if (reduced.matches || !isHoverPointer(event)) return;
      rect = card.getBoundingClientRect();   // measured once, not per move
      card.classList.add('is-tilting');
    };

    const onMove = (event) => {
      if (reduced.matches || !isHoverPointer(event)) return;
      // pointerenter can be missed (a pointer that enters during a scroll,
      // or a synthetic event); recover rather than silently doing nothing.
      if (!rect) {
        rect = card.getBoundingClientRect();
        card.classList.add('is-tilting');
      }
      // Store coordinates now — the event object is not safe to read later.
      pending = { x: event.clientX, y: event.clientY };
      if (raf) return;                       // coalesce to one write per frame
      raf = requestAnimationFrame(write);
    };

    const onLeave = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      pending = null;
      card.classList.remove('is-tilting');   // restore the slower ease home
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);

    // A card can be focused by keyboard; never leave it stuck mid-tilt.
    card.addEventListener('focusout', onLeave);
  });

  // Honour a mid-session change to the reduced-motion setting.
  reduced.addEventListener('change', (e) => {
    if (!e.matches) return;
    cards.forEach((c) => {
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  });
}
