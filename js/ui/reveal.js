/**
 * Reveals — IntersectionObserver, no library, runs at EVERY tier.
 *
 * These are the site's baseline motion. Because they are pure CSS
 * transitions driven by one class, tier 0 gets the full text choreography
 * for free — which is why the fallback still feels premium.
 */

import { pulse } from '../core/state.js';

let observer = null;

/** Failsafe window. If IntersectionObserver has not fired ONCE by now, it is
 *  broken or unsupported in a way feature detection missed — so reveal
 *  everything and stop pretending. Animation is a nicety; readable text is
 *  not negotiable. */
const FAILSAFE_MS = 2200;

export function initReveals(root = document) {
  const targets = root.querySelectorAll('.reveal, .wipe, .line-mask, .card');
  if (!targets.length) return;

  const revealAll = () => targets.forEach((el) => el.classList.add('is-in'));

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  let hasFired = false;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        hasFired = true;
        entry.target.classList.add('is-in');

        // Copy reveals pulse the particle field — coupling the words to the
        // physics is what separates direction from decoration.
        if (entry.target.hasAttribute('data-pulse')) pulse(0.7);

        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));

  setTimeout(() => {
    if (hasFired) {
      // IO works. Just make sure nothing above the fold was missed — an
      // element can sit in view yet never cross the threshold if the page
      // is shorter than the rootMargin implies.
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
      return;
    }
    revealAll();
    observer.disconnect();
  }, FAILSAFE_MS);
}

/**
 * Word-by-word brightening. Colour only, no transform — a restrained take
 * on the familiar effect.
 */
export function initBrighten(root = document) {
  const blocks = root.querySelectorAll('.brighten');
  if (!blocks.length || !('IntersectionObserver' in window)) {
    blocks.forEach((b) => b.querySelectorAll('span').forEach((s) => s.classList.add('is-lit')));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const spans = entry.target.querySelectorAll('span');
        spans.forEach((s, i) => setTimeout(() => s.classList.add('is-lit'), i * 140));
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.4 }
  );

  blocks.forEach((b) => io.observe(b));
}

export function destroyReveals() {
  observer?.disconnect();
  observer = null;
}

/**
 * Make work cards clickable without nesting anchors (which is invalid HTML
 * and breaks the store-badge links inside them). The real <a> elements on
 * the title and CTA remain the accessible route; this is convenience only.
 */
export function initCardLinks(root = document) {
  root.querySelectorAll('[data-href]').forEach((card) => {
    card.addEventListener('click', (e) => {
      // Never hijack a click that landed on a real link or control.
      if (e.target.closest('a, button, input, label')) return;
      if (window.getSelection()?.toString()) return;   // let people select text
      window.location.href = card.dataset.href;
    });
  });
}
