/**
 * Nav — including a mobile menu that actually works.
 * (The personal site's was dead code: the markup was commented out and its
 * handler was never loaded.)
 */

export function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const progress = document.getElementById('nav-progress');
  const main = document.getElementById('main');
  if (!nav) return;

  // --- The bar materialises only after the first viewport ---------------
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:100svh;height:1px;width:1px;pointer-events:none;';
  document.body.appendChild(sentinel);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e]) => nav.classList.toggle('is-stuck', !e.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

  // --- Mobile menu -------------------------------------------------------
  let open = false;

  const setOpen = (next) => {
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Keep the rest of the page out of the a11y tree and tab order.
    if (main) main.inert = open;

    if (open) {
      links.querySelector('a')?.focus();
    } else {
      toggle.focus();
    }
  };

  toggle?.addEventListener('click', () => setOpen(!open));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // Focus trap while open.
  links?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !open) return;
    const focusable = [toggle, ...links.querySelectorAll('a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  links?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => { if (open) setOpen(false); })
  );

  // Close if the viewport grows past the mobile breakpoint.
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
    if (e.matches && open) setOpen(false);
  });

  // --- Scroll progress ---------------------------------------------------
  // Written from the shared RAF loop by main.js; this just exposes the setter.
  return {
    setProgress(p) {
      if (progress) progress.style.setProperty('--progress', p.toFixed(4));
    },
  };
}
