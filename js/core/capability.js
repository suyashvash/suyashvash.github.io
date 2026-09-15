/**
 * Capability detection — the pre-flight gate.
 *
 * Decides the render tier BEFORE three.js is downloaded. There is no point
 * spending 90 KB discovering a device cannot use it.
 *
 * Tiers:
 *   3  full experience      — desktop, discrete GPU
 *   2  reduced              — desktop, integrated GPU
 *   1  mobile WebGL         — phones and tablets
 *   0  no WebGL at all      — the static fallback
 *
 * Tier 0 is NOT a punishment state. It is the site a client on hotel wi-fi
 * sees, and it must look like the same site: same palette, type, layout and
 * copy. Only motion and depth degrade.
 */

const FALLBACK_KEY = 'cs-fallback';

/** Remember, across visits, that 3D failed on this device. */
export function rememberFallback() {
  try { localStorage.setItem(FALLBACK_KEY, '1'); } catch { /* private mode */ }
}

export function hasRememberedFallback() {
  try { return localStorage.getItem(FALLBACK_KEY) === '1'; } catch { return false; }
}

export function clearRememberedFallback() {
  try { localStorage.removeItem(FALLBACK_KEY); } catch { /* ignore */ }
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

/**
 * Probe WebGL2 on a throwaway 1x1 canvas, then dispose it immediately —
 * some drivers cap live contexts at 8–16 and leaking probes is a real way
 * to break the actual scene later.
 */
function probeWebGL() {
  let canvas = null;
  let gl = null;
  try {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    gl = canvas.getContext('webgl2', {
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'high-performance',
      antialias: false,
      depth: false,
    });
    if (!gl) return { ok: false, reason: 'no-webgl2' };

    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTex < 4096) return { ok: false, reason: 'max-texture-too-small' };

    // Float render targets are required by the nebula pass.
    if (!gl.getExtension('EXT_color_buffer_float')) {
      return { ok: false, reason: 'no-float-targets' };
    }

    let renderer = '';
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      try { renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || ''); } catch { /* masked */ }
    }
    return { ok: true, renderer, maxTex };
  } catch (err) {
    return { ok: false, reason: 'threw: ' + err.message };
  } finally {
    // Explicitly drop the context rather than waiting for GC.
    try { gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* ignore */ }
    canvas = null;
  }
}

function saveDataOrSlowNetwork() {
  const c = navigator.connection;
  if (!c) return false;
  if (c.saveData === true) return true;
  return ['slow-2g', '2g', '3g'].includes(c.effectiveType);
}

/**
 * @returns {{tier:number, reason:string, touch:boolean, renderer:string}}
 */
export function detectTier() {
  const touch = isTouch();

  // --- Manual override, for testing: ?tier=0..3 -----------------------
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced !== null && /^[0-3]$/.test(forced)) {
    return { tier: Number(forced), reason: 'forced-by-query', touch, renderer: '' };
  }

  // --- Hard blocks: three.js is never requested ------------------------
  if (prefersReducedMotion())    return { tier: 0, reason: 'prefers-reduced-motion', touch, renderer: '' };
  if (hasRememberedFallback())   return { tier: 0, reason: 'remembered-failure', touch, renderer: '' };
  if (saveDataOrSlowNetwork())   return { tier: 0, reason: 'save-data-or-slow-network', touch, renderer: '' };

  const mem = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if (mem !== undefined && mem <= 2)    return { tier: 0, reason: 'low-memory', touch, renderer: '' };
  if (cores !== undefined && cores <= 2) return { tier: 0, reason: 'low-cpu', touch, renderer: '' };

  const probe = probeWebGL();
  if (!probe.ok) return { tier: 0, reason: probe.reason, touch, renderer: '' };

  // --- Grading ----------------------------------------------------------
  let tier = 3;
  let reason = 'full';

  if (window.innerWidth < 900 || touch) { tier = 1; reason = 'mobile'; }

  if (mem !== undefined && mem < 4)     { tier = Math.max(1, tier - 1); reason = 'memory<4'; }
  if (cores !== undefined && cores < 4) { tier = Math.max(1, tier - 1); reason = 'cores<4'; }

  // Weak renderer hints. Increasingly masked by browsers, so this is a hint
  // only — the live FPS sampler is what actually protects us.
  if (tier > 2 && /swiftshader|llvmpipe|software|basic render/i.test(probe.renderer)) {
    tier = 1;
    reason = 'software-renderer';
  } else if (tier > 2 && /(intel|uhd|iris)/i.test(probe.renderer)) {
    tier = 2;
    reason = 'integrated-gpu';
  }

  return { tier, reason, touch, renderer: probe.renderer };
}

/** Per-tier render settings. Tier 0 never reaches the renderer. */
export const TIER_SETTINGS = {
  3: { dpr: 2.0,  particles: 6000, stars: 2200, shaftSegments: 64, glowTaps: 12, halfResNebula: false, fpsCap: 60 },
  2: { dpr: 1.5,  particles: 3000, stars: 1200, shaftSegments: 32, glowTaps: 6,  halfResNebula: true,  fpsCap: 60 },
  1: { dpr: 1.25, particles: 1200, stars: 600,  shaftSegments: 24, glowTaps: 0,  halfResNebula: true,  fpsCap: 30 },
};
