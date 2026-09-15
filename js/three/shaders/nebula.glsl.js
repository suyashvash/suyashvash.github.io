import { noise, palette, tonemap } from './common.glsl.js';

export const nebulaVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * A bruise in the dark, not a wallpaper. Deliberately low contrast: the
 * nebula must never compete with the copy sitting on top of it.
 *
 * Bloom is baked in here rather than through EffectComposer — the stock
 * postprocessing chain costs a second full-resolution render target for
 * roughly a 2x fill-rate hit, and this gets the same look for a fraction.
 */
export const nebulaFrag = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uImpulse;
  uniform vec2  uResolution;

  ${noise}
  ${palette}
  ${tonemap}

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.02;

    // Two domain-warp passes.
    vec3 q = vec3(p * 1.6, t);
    float w1 = fbm(q);
    vec3 r = vec3(p * 1.9 + w1 * 0.9, t * 1.3 + 4.0);
    float w2 = fbm(r);
    float density = fbm(vec3(p * 2.2 + w2 * 1.1, t * 0.8 + 9.0));

    density = pow(max(density, 0.0), 1.9);

    // Off-centre falloff so the composition has a light source rather than
    // a symmetric vignette.
    float falloff = 1.0 - smoothstep(0.1, 1.05, length(p - vec2(0.18, -0.06)));
    density *= falloff;

    vec3 col = mix(PLASMA_DEEP, PLASMA, smoothstep(0.15, 0.75, density));
    col = mix(col, VIOLET, smoothstep(0.55, 0.95, density) * 0.55);

    // A faint gold wash where energy has already been transmitted.
    col += GOLD * density * density * 0.14;

    col *= density * 1.5 * uIntensity;
    col += GOLD_HOT * uImpulse * density * 0.28;

    col = aces(col);

    // Dithering. Without it, this much smooth gradient bands visibly on
    // 8-bit displays, which instantly reads as cheap.
    float dither = (hash13(vec3(gl_FragCoord.xy, uTime)) - 0.5) / 255.0;
    col += dither;

    gl_FragColor = vec4(col + VOID_COL, 1.0);
  }
`;
