/**
 * The journey — one continuous camera move from deep space, onto the shaft,
 * along it, and out the far end into shipped products. Scrolling IS the
 * dolly.
 *
 * Each beat writes TARGETS into the state bus; the RAF loop damps toward
 * them. Nothing here reads layout during scroll, so it cannot cause INP
 * problems, and if a beat's element is missing the rest still work.
 */

import { target } from '../core/state.js';

/** Map x from [a,b] into [0,1], clamped. */
const norm = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));

/** Smoothstep for beat blending. */
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * Beats are defined by section, each with the camera state it wants when
 * that section fills the viewport.
 */
const BEATS = [
  { id: 'top',          camZ: 0,   camX: 0,    camY: 0,    lookY: 0,     spin: 0.15, flow: 0.15, mode: 0, nebula: 1.0 },
  { sel: '.thesis',     camZ: 2.2, camX: 0.15, camY: 0.05, lookY: 0,     spin: 0.18, flow: 0.35, mode: 0, nebula: 0.9 },
  { sel: '.intake',     camZ: 3.4, camX: 1.5,  camY: 0.35, lookY: 0.1,   spin: 0.24, flow: 0.85, mode: 0, nebula: 0.75 },
  { id: 'capabilities', camZ: 4.6, camX: 2.2,  camY: 0.1,  lookY: 0,     spin: 0.3,  flow: 0.6,  mode: 0.3, nebula: 0.6 },
  { id: 'work',         camZ: 6.2, camX: 0.4,  camY: -0.2, lookY: -0.1,  spin: 0.22, flow: 0.9,  mode: 1, nebula: 0.5 },
  { sel: '.proof',      camZ: 4.0, camX: -1.2, camY: 0.3,  lookY: 0.05,  spin: 0.16, flow: 0.4,  mode: 1, nebula: 0.85 },
  { id: 'firm',         camZ: -2.5, camX: 0,   camY: 0.6,  lookY: 0,     spin: 0.12, flow: 0.2,  mode: 0.5, nebula: 1.0 },
  { id: 'contact',      camZ: 7.4, camX: 0.9,  camY: 0,    lookY: 0,     spin: 0.4,  flow: 1.0,  mode: 1, nebula: 1.1 },
];

const KEYS = ['camZ', 'camX', 'camY', 'lookY', 'spin', 'flow', 'mode', 'nebula'];

export function initJourney() {
  // Resolve each beat to a live element once, up front.
  const resolved = BEATS
    .map((beat) => {
      const el = beat.id ? document.getElementById(beat.id) : document.querySelector(beat.sel);
      return el ? { ...beat, el } : null;
    })
    .filter(Boolean);

  if (resolved.length < 2) return () => {};

  // Cached geometry. Recomputed on resize, never during scroll.
  let bounds = [];
  const measure = () => {
    bounds = resolved.map(({ el }) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return { top, height: rect.height || 1, center: top + rect.height / 2 };
    });
  };

  measure();

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  };
  window.addEventListener('resize', onResize, { passive: true });
  // Late-loading images change section heights.
  window.addEventListener('load', measure, { once: true });

  /**
   * Called from the single RAF loop. Finds the two beats the viewport
   * currently sits between and blends their camera states.
   */
  return function updateJourney() {
    if (!bounds.length) return;

    const focus = window.scrollY + window.innerHeight * 0.5;

    // Before the first beat, or after the last.
    if (focus <= bounds[0].center) { assign(resolved[0]); return; }
    const lastIdx = bounds.length - 1;
    if (focus >= bounds[lastIdx].center) { assign(resolved[lastIdx]); return; }

    for (let i = 0; i < lastIdx; i++) {
      const a = bounds[i];
      const b = bounds[i + 1];
      if (focus < a.center || focus > b.center) continue;

      const t = smooth(norm(focus, a.center, b.center));
      const from = resolved[i];
      const to = resolved[i + 1];

      for (const key of KEYS) {
        target[key] = from[key] + (to[key] - from[key]) * t;
      }
      return;
    }
  };

  function assign(beat) {
    for (const key of KEYS) target[key] = beat[key];
  }
}
