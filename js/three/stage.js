/**
 * The WebGL stage.
 *
 * createStage() resolves only once a first frame has actually been drawn —
 * that promise is what main.js races against FIRST_FRAME_MS. A scene that
 * constructs but never renders is exactly the "stuck loading" case this
 * whole architecture exists to prevent.
 */

import * as THREE from '../../vendor/three.module.min.js';
import { nebulaVert, nebulaFrag } from './shaders/nebula.glsl.js';
import { shaftVert, shaftFrag } from './shaders/shaft.glsl.js';
import { particleVert, particleFrag } from './shaders/particles.glsl.js';

export async function createStage({ canvas, settings, tier }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,          // fresnel edges hide aliasing; MSAA is not worth the fill rate
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, settings.dpr));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  /* ---- Nebula: a full-screen triangle behind everything ---------------- */

  const nebulaUniforms = {
    uTime:       { value: 0 },
    uIntensity:  { value: 1 },
    uImpulse:    { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };

  const nebulaScene = new THREE.Scene();
  const nebulaCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const nebulaMat = new THREE.ShaderMaterial({
    vertexShader: nebulaVert,
    fragmentShader: nebulaFrag,
    uniforms: nebulaUniforms,
    depthWrite: false,
    depthTest: false,
  });
  nebulaScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), nebulaMat));

  // Half-res render target below tier 3 — the single biggest fill-rate win.
  let nebulaTarget = null;
  const makeTarget = () => {
    nebulaTarget?.dispose();
    if (!settings.halfResNebula) { nebulaTarget = null; return; }
    const w = Math.max(2, Math.floor(canvas.clientWidth * 0.5));
    const h = Math.max(2, Math.floor(canvas.clientHeight * 0.5));
    nebulaTarget = new THREE.WebGLRenderTarget(w, h, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
  };

  const blitMat = new THREE.MeshBasicMaterial({ map: null, depthTest: false, depthWrite: false });
  const blitScene = new THREE.Scene();
  blitScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat));

  /* ---- The shaft -------------------------------------------------------- */

  const shaftUniforms = {
    uTime:     { value: 0 },
    uFlutes:   { value: 6 },
    uGlowTaps: { value: settings.glowTaps },
    uImpulse:  { value: 0 },
    uFlow:     { value: 0 },
  };

  let shaftGeo = new THREE.CylinderGeometry(0.35, 0.35, 14, settings.shaftSegments, 1, true);
  const shaftMat = new THREE.ShaderMaterial({
    vertexShader: shaftVert,
    fragmentShader: shaftFrag,
    uniforms: shaftUniforms,
    side: THREE.DoubleSide,
  });
  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.rotation.x = Math.PI / 2;   // lie it along Z, receding from camera
  shaft.position.x = 0.9;           // vanishing point slightly right of centre
  scene.add(shaft);

  /* ---- Particles -------------------------------------------------------- */

  const particleUniforms = {
    uTime:       { value: 0 },
    uFlow:       { value: 0 },
    uMode:       { value: 0 },
    uImpulse:    { value: 0 },
    uSize:       { value: 2.2 },
    uPixelRatio: { value: renderer.getPixelRatio() },
  };

  let particleGeo = null;
  let particles = null;

  const buildParticles = (count) => {
    if (particles) { scene.remove(particles); particleGeo.dispose(); }
    particleGeo = new THREE.BufferGeometry();

    const seeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    // A dummy position attribute keeps three.js happy; real positions come
    // from the vertex shader.
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      radii[i] = 1.2 + Math.random() * 3.4;
      speeds[i] = 0.5 + Math.random() * 1.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    particleGeo.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    particleGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    particles = new THREE.Points(particleGeo, new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    particles.position.x = shaft.position.x;
    particles.frustumCulled = false;
    scene.add(particles);
  };

  buildParticles(settings.particles);

  /* ---- Resize ----------------------------------------------------------- */

  // Size from visualViewport, not innerHeight: iOS Safari's collapsing
  // address bar changes innerHeight constantly, and reacting to it makes
  // everything jump.
  let lastW = 0;
  const resize = () => {
    const vv = window.visualViewport;
    const w = Math.round(vv?.width ?? window.innerWidth);
    const h = Math.round(vv?.height ?? window.innerHeight);

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    nebulaUniforms.uResolution.value.set(w, h);
    particleUniforms.uPixelRatio.value = renderer.getPixelRatio();

    // Only rebuild the render target on a real width change.
    if (Math.abs(w - lastW) > 4) { lastW = w; makeTarget(); }
  };

  resize();
  makeTarget();
  window.addEventListener('resize', resize, { passive: true });
  window.visualViewport?.addEventListener('resize', resize, { passive: true });

  /* ---- Render ----------------------------------------------------------- */

  let elapsed = 0;

  const render = (state, dt) => {
    elapsed += dt * 0.001;

    nebulaUniforms.uTime.value = elapsed;
    nebulaUniforms.uIntensity.value = state.nebula * (1 - state.dim * 0.7);
    nebulaUniforms.uImpulse.value = state.impulse;

    shaftUniforms.uTime.value = elapsed;
    shaftUniforms.uImpulse.value = state.impulse;
    shaftUniforms.uFlow.value = state.flow;

    particleUniforms.uTime.value = elapsed;
    particleUniforms.uFlow.value = state.flow;
    particleUniforms.uMode.value = state.mode;
    particleUniforms.uImpulse.value = state.impulse;

    // The shaft never stops turning, for the whole page.
    shaft.rotation.y += state.spin * dt * 0.001;

    camera.position.z = 9 - state.camZ;
    camera.position.x = state.camX;
    camera.position.y = 0.4 + state.camY;
    camera.lookAt(shaft.position.x, state.lookY, -2);

    renderer.autoClear = true;

    if (nebulaTarget) {
      renderer.setRenderTarget(nebulaTarget);
      renderer.render(nebulaScene, nebulaCamera);
      renderer.setRenderTarget(null);
      blitMat.map = nebulaTarget.texture;
      renderer.render(blitScene, nebulaCamera);
    } else {
      renderer.render(nebulaScene, nebulaCamera);
    }

    renderer.autoClear = false;
    renderer.render(scene, camera);
  };

  /** Runtime downgrade — rebuild only what got cheaper. */
  const applySettings = (next, nextTier) => {
    settings = next;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, next.dpr));
    shaftUniforms.uGlowTaps.value = next.glowTaps;
    particleUniforms.uPixelRatio.value = renderer.getPixelRatio();

    buildParticles(next.particles);

    shaftGeo.dispose();
    shaftGeo = new THREE.CylinderGeometry(0.35, 0.35, 14, next.shaftSegments, 1, true);
    shaft.geometry = shaftGeo;

    makeTarget();
    void nextTier;
  };

  const dispose = () => {
    window.removeEventListener('resize', resize);
    window.visualViewport?.removeEventListener('resize', resize);
    nebulaTarget?.dispose();
    shaftGeo.dispose();
    shaftMat.dispose();
    nebulaMat.dispose();
    blitMat.dispose();
    particleGeo?.dispose();
    particles?.material.dispose();
    renderer.dispose();
    // Actively release the GPU context rather than waiting for GC.
    renderer.forceContextLoss?.();
  };

  /* ---- Prove it can actually draw before resolving ---------------------- */

  const seed = { nebula: 1, dim: 0, impulse: 0, flow: 0, mode: 0, spin: 0,
                 camZ: 0, camX: 0, camY: 0, lookY: 0 };

  await new Promise((resolve, reject) => {
    requestAnimationFrame(() => {
      try {
        render(seed, 16.7);
        // A lost context here means the device could not honour the scene.
        if (renderer.getContext().isContextLost?.()) {
          reject(new Error('context-lost-on-first-frame'));
          return;
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });

  return { render, applySettings, dispose, renderer, scene, camera, tier };
}
