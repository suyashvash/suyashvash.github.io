/**
 * The ONE animation frame loop.
 *
 * There must never be a second requestAnimationFrame anywhere in this
 * codebase. Every animated module subscribes here.
 *
 * The loop gates itself on document visibility and on whether the stage is
 * actually on screen — a background tab rendering a nebula is battery theft,
 * and for a firm whose pitch includes "+80% app performance" that would be
 * the artefact refuting the claim.
 */

const subscribers = new Set();

let rafId = null;
let last = 0;
let running = false;
let visible = true;
let fpsCap = 60;
let minFrameMs = 0;
let accumulator = 0;

/** @param {(dt:number, now:number)=>void} fn */
export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function setFpsCap(cap) {
  fpsCap = cap;
  minFrameMs = cap >= 60 ? 0 : 1000 / cap - 1;
}

function tick(now) {
  rafId = requestAnimationFrame(tick);

  const dt = last ? now - last : 16.7;
  last = now;

  // Frame pacing for capped tiers.
  if (minFrameMs > 0) {
    accumulator += dt;
    if (accumulator < minFrameMs) return;
    accumulator = 0;
  }

  // Clamp: a backgrounded tab or a long task can produce a huge dt that
  // would make everything jump on return.
  const clamped = Math.min(dt, 50);

  for (const fn of subscribers) {
    try {
      fn(clamped, now);
    } catch (err) {
      // One broken subscriber must never kill the loop for everything else.
      console.error('[raf] subscriber failed, removing:', err);
      subscribers.delete(fn);
    }
  }
}

export function start() {
  if (running || !visible) return;
  running = true;
  last = 0;
  rafId = requestAnimationFrame(tick);
}

export function stop() {
  running = false;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
}

document.addEventListener('visibilitychange', () => {
  visible = !document.hidden;
  if (visible) start();
  else stop();
});

export const isRunning = () => running;
