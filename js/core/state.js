/**
 * The state bus.
 *
 * Deliberately NOT one giant scrubbed timeline across the page. With a single
 * timeline, one bad measurement (an image loading late, an iOS toolbar
 * resize) destroys the whole page's motion with no graceful degradation.
 *
 * Instead: each beat owns an independent ScrollTrigger that WRITES targets
 * here, and one RAF loop lerps `current` toward `target` with per-property
 * damping. Inertia comes free, and a broken trigger degrades to "that beat
 * doesn't move" rather than "the page is destroyed".
 */

export const target = {
  camZ: 0,        // dolly along the shaft
  camX: 0,
  camY: 0,
  lookY: 0,
  spin: 0.15,     // shaft angular velocity, rad/s
  flow: 0,        // particle throughput
  mode: 0,        // 0 intake … 1 output
  nebula: 1,      // nebula intensity
  dim: 0,         // 0 = scene at full strength, 1 = fully dimmed behind content
  impulse: 0,     // one-shot burst, pulsed by copy reveals
};

export const current = { ...target };

/** Per-property damping. Lower = heavier, more inertia. */
const DAMPING = {
  camZ: 0.055, camX: 0.055, camY: 0.055, lookY: 0.06,
  spin: 0.04,  flow: 0.06,  mode: 0.05,
  nebula: 0.05, dim: 0.09,  impulse: 0.14,
};

export function integrate(dt) {
  // Normalise against a 60fps frame so damping is frame-rate independent.
  const scale = Math.min(3, dt / (1000 / 60));
  for (const key in target) {
    const k = Math.min(1, (DAMPING[key] ?? 0.06) * scale);
    current[key] += (target[key] - current[key]) * k;
  }
  // Impulse is a one-shot: it decays back to zero on its own.
  target.impulse *= 0.86;
  if (target.impulse < 0.001) target.impulse = 0;
}

export function pulse(amount = 1) {
  target.impulse = Math.min(1, target.impulse + amount);
}

export function reset() {
  Object.assign(current, target);
}
