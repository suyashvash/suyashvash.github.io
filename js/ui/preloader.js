/**
 * Preloader.
 *
 * Resolves on DOMContentLoaded + fonts — NEVER on the 3D scene — and has its
 * own hard ceiling on top of that. A low-end device must never sit here.
 * Worst case the visitor gets the finished page with a static backdrop,
 * which is a good outcome rather than a broken one.
 */

const CEILING_MS = 3000;

export function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return { done: () => {} };

  const line = el.querySelector('.preloader-line');
  let progress = 0;
  let finished = false;

  const set = (v) => {
    progress = Math.max(progress, Math.min(1, v));
    line?.style.setProperty('--load', progress.toFixed(3));
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    set(1);
    // Let the line reach full height before it rotates away.
    setTimeout(() => {
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
    }, 260);
  };

  set(0.15);

  document.addEventListener('DOMContentLoaded', () => set(0.5), { once: true });

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady.then(() => set(0.8)).catch(() => set(0.8));

  Promise.all([
    new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true }))),
    fontsReady.catch(() => {}),
  ]).then(finish);

  // The ceiling. Whatever else happens, the page is revealed.
  setTimeout(finish, CEILING_MS);

  return { done: finish, set };
}
