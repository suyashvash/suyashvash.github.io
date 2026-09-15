/**
 * Watchdogs — what prevents "stuck loading" on a low-end device.
 *
 * The WebGL scene is a decorative BACKGROUND LAYER. The page is fully
 * readable, scrollable and convertible before three.js is even requested,
 * and stays that way if it never arrives. Nothing here ever shows the user
 * an error: every downgrade is silent.
 */

import { rememberFallback } from './capability.js';

export const BOOT_TIMEOUT_MS = 2500;   // bundle fetched + parsed
export const FIRST_FRAME_MS  = 1500;   // scene created → first frame drawn
export const SAMPLE_FRAMES   = 90;     // live FPS window
export const P75_BUDGET_MS   = 22;     // ~45fps at p75
export const HARD_FLOOR_MS   = 41.7;   // 24fps

/** Reject after `ms` so a slow device is never left waiting. */
export function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout: ${label} (${ms}ms)`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Samples frame time and reports when the device cannot keep up.
 * Static detection WILL be wrong on some device nobody has heard of;
 * this is what actually protects the experience.
 */
export class FpsSampler {
  constructor({ onDowngrade, onFloor }) {
    this.onDowngrade = onDowngrade;
    this.onFloor = onFloor;
    this.samples = [];
    this.enabled = false;
    this.settleFrames = 30;   // ignore the first frames while things warm up
  }

  start() { this.enabled = true; this.samples.length = 0; }
  pause() { this.enabled = false; }

  record(dt) {
    if (!this.enabled) return;
    if (this.settleFrames > 0) { this.settleFrames--; return; }

    this.samples.push(dt);
    if (this.samples.length < SAMPLE_FRAMES) return;

    const sorted = [...this.samples].sort((a, b) => a - b);
    const p75 = sorted[Math.floor(sorted.length * 0.75)];
    this.samples.length = 0;

    if (p75 > HARD_FLOOR_MS) this.onFloor?.(p75);
    else if (p75 > P75_BUDGET_MS) this.onDowngrade?.(p75);
  }
}

/**
 * Context loss is real on memory-pressured devices — the browser simply
 * reclaims the GPU context mid-session.
 *
 * We call preventDefault() to stop the default "context is gone forever"
 * behaviour, but we deliberately do NOT attempt to restore: a device that
 * already proved constrained will most likely just lose it again. Swap to
 * the static backdrop and, on a second loss, remember it across visits so
 * the next load skips 3D entirely and is instant.
 */
export function guardContextLoss(canvas, { onLost }) {
  let losses = 0;

  const handler = (event) => {
    event.preventDefault();
    losses += 1;
    if (losses >= 2) rememberFallback();
    onLost?.(losses);
  };

  canvas.addEventListener('webglcontextlost', handler, false);
  return () => canvas.removeEventListener('webglcontextlost', handler);
}

/**
 * Coarse memory-pressure signal. performance.memory is Chromium-only and
 * non-standard, so this is advisory — never the sole trigger.
 */
export function memoryPressure() {
  const m = performance.memory;
  if (!m || !m.jsHeapSizeLimit) return false;
  return m.usedJSHeapSize / m.jsHeapSizeLimit > 0.92;
}
