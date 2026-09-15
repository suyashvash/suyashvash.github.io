/**
 * Metric counters.
 *
 * The final value is already in the DOM as text, so with JS off — or if this
 * never runs — the numbers are simply correct and static. We only animate
 * from zero once, on first intersection.
 */

export function initCounters(root = document) {
  const els = root.querySelectorAll('[data-count]');
  if (!els.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return; // leave the static text

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.6 }
  );

  els.forEach((el) => io.observe(el));

  function run(el) {
    const end = Number(el.dataset.count);
    if (!Number.isFinite(end)) return;
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const duration = 1200;
    const start = performance.now();

    // Counters are short-lived and self-terminating, so this is the one
    // place a local rAF is acceptable — it is not a persistent loop.
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(end * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + end + suffix;
    };
    requestAnimationFrame(step);
  }
}
