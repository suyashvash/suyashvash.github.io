/**
 * Cosmic Shaft — entry point.
 *
 * Order of operations matters enormously here:
 *
 *   1. Decide the tier synchronously, BEFORE anything heavy is requested.
 *   2. Boot the whole site at tier 0 — every word readable, every reveal
 *      running. This is the complete, shippable experience.
 *   3. Only then, and only after LCP, consider layering 3D on top.
 *
 * The WebGL scene is a decorative background. It is never on the critical
 * path, and the page never waits for it.
 */

import { detectTier, TIER_SETTINGS, rememberFallback, isTouch } from './core/capability.js';
import { setFpsCap, subscribe, start as startRaf } from './core/raf.js';
import { target, current, integrate } from './core/state.js';
import { withTimeout, BOOT_TIMEOUT_MS, FIRST_FRAME_MS, FpsSampler, guardContextLoss } from './core/watchdog.js';

import { initPreloader } from './ui/preloader.js';
import { initNav } from './ui/nav.js';
import { initReveals, initBrighten, initCardLinks } from './ui/reveal.js';
import { initCounters } from './ui/counters.js';
import { initForm } from './ui/form.js';
import { paintStarfield, watchStarfieldResize } from './ui/starfield.js';
import { initJourney } from './beats/journey.js';

const html = document.documentElement;

/* ---------------------------------------------------------------------- */
/* 1. Pre-flight                                                          */
/* ---------------------------------------------------------------------- */

const detection = detectTier();
let tier = detection.tier;

const applyTier = (t, why) => {
  tier = t;
  html.dataset.tier = String(t);
  html.dataset.tierReason = why;
  if (t > 0) setFpsCap(TIER_SETTINGS[t]?.fpsCap ?? 60);
};

applyTier(tier, detection.reason);

/* ---------------------------------------------------------------------- */
/* 2. Baseline — the complete site, at every tier                         */
/* ---------------------------------------------------------------------- */

const preloader = initPreloader();
const nav = initNav();

initReveals();
initBrighten();
initCardLinks();
initCounters();
initForm();

// Starfield: the compositor-driven fallback sky. Below tier 2 it IS the
// depth; at tier 2+ it sits behind the WebGL scene and adds nothing costly.
const starCanvas = document.getElementById('starfield');
if (starCanvas) {
  const count = tier === 0 ? 700 : tier === 1 ? 500 : 900;
  paintStarfield(starCanvas, { count });
  watchStarfieldResize(starCanvas, { count });
}

// Scroll progress + the state-bus integration. One RAF loop, always.
let scrollProgress = 0;
const readScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
};
readScroll();
window.addEventListener('scroll', readScroll, { passive: true });
window.addEventListener('resize', readScroll, { passive: true });

// The camera journey writes targets; the loop damps toward them. Only
// active above tier 0 — with no scene to move, it would be pure cost.
const updateJourney = tier > 0 ? initJourney() : null;

subscribe((dt) => {
  updateJourney?.();
  integrate(dt);
  nav?.setProgress(scrollProgress);
});
startRaf();

// Dim the scene through the work section — the work has to win.
const workSection = document.getElementById('work');
if (workSection && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => { target.dim = entry.isIntersecting ? 1 : 0; },
    { threshold: 0.12 }
  ).observe(workSection);
}

/* ---------------------------------------------------------------------- */
/* 3. The 3D layer — strictly optional, strictly after LCP                */
/* ---------------------------------------------------------------------- */

/** Wait for load → a paint → idle. Never compete with first paint. */
function afterLcp() {
  return new Promise((resolve) => {
    const go = () => requestAnimationFrame(() =>
      ('requestIdleCallback' in window)
        ? requestIdleCallback(resolve, { timeout: 1200 })
        : setTimeout(resolve, 120)
    );
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  });
}

/** Silently give up on 3D and stay on the fallback. Never shows an error. */
function fallBack(reason, { persist = false } = {}) {
  console.info('[cosmic-shaft] falling back to tier 0:', reason);
  if (persist) rememberFallback();
  applyTier(0, reason);
  document.getElementById('stage')?.classList.remove('is-live');
}

async function bootScene() {
  if (tier === 0) return;

  await afterLcp();

  const canvas = document.getElementById('stage');
  if (!canvas) return;

  let stage;
  try {
    // Boot watchdog: if the bundle has not fetched and parsed in time, the
    // device is too slow to deserve it. Abandon quietly.
    const mod = await withTimeout(import('./three/stage.js'), BOOT_TIMEOUT_MS, 'three-import');

    stage = await withTimeout(
      mod.createStage({ canvas, settings: TIER_SETTINGS[tier], tier }),
      FIRST_FRAME_MS,
      'first-frame'
    );
  } catch (err) {
    fallBack(err.message);
    return;
  }

  // Context loss is real on memory-pressured devices. Swap to the still,
  // and on a second loss remember it so the next visit is instant.
  guardContextLoss(canvas, {
    onLost: (count) => {
      stage.dispose?.();
      fallBack('context-lost', { persist: count >= 2 });
    },
  });

  // Live FPS sampling. Static detection WILL be wrong on some device nobody
  // has heard of; this is what actually protects the experience.
  const sampler = new FpsSampler({
    onDowngrade: (p75) => {
      if (tier <= 1) return;
      const next = tier - 1;
      applyTier(next, `fps-downgrade(${p75.toFixed(1)}ms)`);
      stage.applySettings?.(TIER_SETTINGS[next], next);
    },
    onFloor: (p75) => {
      stage.dispose?.();
      fallBack(`fps-floor(${p75.toFixed(1)}ms)`);
    },
  });
  sampler.start();

  subscribe((dt) => {
    sampler.record(dt);
    stage.render(current, dt);
  });

  canvas.classList.add('is-live');

  // Pause rendering whenever the canvas is off screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e]) => (e.isIntersecting ? sampler.start() : sampler.pause()),
      { threshold: 0 }
    ).observe(canvas);
  }
}

// Fire and forget. The preloader is NOT waiting on this — it resolves on
// load + fonts with its own hard ceiling, so the page is revealed whether
// the scene ever arrives or not.
bootScene();

// Expose a little state for debugging without shipping a console panel.
window.__cosmic = { get tier() { return tier; }, detection, target, current, isTouch: isTouch() };
