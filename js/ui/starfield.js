/**
 * Canvas starfield for tier 0 and 1.
 *
 * Painted ONCE from a seeded PRNG, then never touched by JS again. Drift
 * comes from a CSS transform animation, which runs on the compositor — so
 * the steady-state cost is 0% main thread and no rAF loop at all.
 *
 * This is the single most important craft decision in the fallback: it looks
 * alive and costs nothing.
 */

/** Mulberry32 — deterministic, so the sky is identical across reloads. */
function seeded(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function paintStarfield(canvas, { count = 700, seed = 20240401 } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Cap DPR — a phone at DPR 3 painting a fullscreen canvas is pure waste
  // for something this soft.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Measure the element itself. If it has not been laid out yet (zero box),
  // fall back to the viewport — a backing store that disagrees with the CSS
  // box gets upscaled by the compositor and the stars render as blocks.
  const rect = canvas.getBoundingClientRect();
  const w = Math.round(rect.width || window.innerWidth * 1.2);
  const h = Math.round(rect.height || window.innerHeight * 1.2);

  // Hard ceiling on total pixels. A very tall viewport would otherwise
  // allocate an enormous backing store for something barely visible.
  const MAX_PX = 4_000_000;
  const scale = Math.min(1, Math.sqrt(MAX_PX / (w * h * dpr * dpr)));
  const bw = Math.max(2, Math.round(w * dpr * scale));
  const bh = Math.max(2, Math.round(h * dpr * scale));

  canvas.width = bw;
  canvas.height = bh;
  // Map drawing coordinates onto the CSS box regardless of the backing size,
  // so a clamped canvas still lands its stars in the right places.
  ctx.setTransform(bw / w, 0, 0, bh / h, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Density follows area, so a tall viewport is not sparser than a short one.
  count = Math.round(count * Math.min(2.5, (w * h) / (1600 * 900)));

  const rand = seeded(seed);

  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.25 + rand() * 1.15;
    const a = 0.18 + rand() * 0.62;

    // 10% gold, matching the particle rule: gold is the transmitted output.
    const gold = rand() > 0.9;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = gold
      ? `rgba(229, 180, 95, ${a})`
      : `rgba(232, 238, 255, ${a})`;
    ctx.fill();

    // A few brighter stars get a soft halo — cheap depth.
    if (r > 1.15 && rand() > 0.72) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
      g.addColorStop(0, gold ? 'rgba(229,180,95,.16)' : 'rgba(169,188,255,.14)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
    }
  }

  canvas.classList.add('drift-a');
}

/** Repaint on a genuine resize only — never on an iOS toolbar collapse. */
export function watchStarfieldResize(canvas, opts) {
  let lastW = window.innerWidth;
  let timer = null;

  window.addEventListener('resize', () => {
    // Width-only: iOS address-bar collapse changes height constantly and
    // repainting on that would thrash.
    if (Math.abs(window.innerWidth - lastW) < 40) return;
    lastW = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => paintStarfield(canvas, opts), 200);
  }, { passive: true });
}
