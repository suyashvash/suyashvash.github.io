import { palette, tonemap, noise } from './common.glsl.js';

/**
 * The shaft.
 *
 * Lit ONLY by rim light: a gold edge on one side, a hot specular streak
 * along the top, near-black on the other. No ambient, no fill — that is what
 * makes it read as machined metal in a vacuum rather than a grey tube.
 *
 * The 6 shallow longitudinal flutes matter more than they sound: a perfectly
 * smooth cylinder rotating is visually invisible. The flutes are what make
 * the rotation legible.
 */

export const shaftVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vFlute;

  uniform float uFlutes;

  void main() {
    vUv = uv;

    // Angular position around the cylinder drives the flute pattern.
    float ang = atan(position.x, position.z);
    vFlute = cos(ang * uFlutes);

    // Displace inward slightly at each flute trough.
    vec3 displaced = position;
    float depth = (1.0 - abs(vFlute)) * 0.035;
    displaced.xz *= (1.0 - depth);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPos = mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const shaftFrag = /* glsl */ `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vFlute;

  uniform float uTime;
  uniform float uGlowTaps;
  uniform float uImpulse;
  uniform float uFlow;

  ${palette}
  ${tonemap}
  ${noise}

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPos);

    // Key light from upper left, cool. Rim from the right, gold.
    vec3 keyDir = normalize(vec3(-0.6, 0.75, 0.35));
    vec3 rimDir = normalize(vec3(0.85, 0.15, 0.2));

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    float key = max(dot(N, keyDir), 0.0);
    float rim = max(dot(N, rimDir), 0.0);

    // Anisotropic streak along the shaft's length — the signature of a
    // turned metal surface.
    float streak = pow(max(dot(N, normalize(keyDir + V)), 0.0), 64.0);

    vec3 col = vec3(0.0);

    col += GOLD * key * 0.34;
    col += GOLD_HOT * streak * 0.9;
    col += GOLD * fresnel * 0.55;
    col += PLASMA * rim * fresnel * 0.28;

    // Flute shading — darken the troughs so rotation is readable.
    float fluteShade = smoothstep(-0.2, 1.0, abs(vFlute));
    col *= mix(0.42, 1.0, fluteShade);

    // Machining micro-grain. Subtle; removes the plastic look.
    float grain = vnoise(vec3(vUv * vec2(240.0, 16.0), 0.0));
    col *= 0.94 + grain * 0.12;

    // Energy travelling along the shaft toward the output end.
    float pulseWave = sin(vUv.y * 22.0 - uTime * 2.4) * 0.5 + 0.5;
    col += GOLD_HOT * pow(pulseWave, 8.0) * uFlow * 0.5;
    col += GOLD_HOT * uImpulse * 0.35 * fresnel;

    // Baked glow: a few radial taps around the specular ridge rather than a
    // full bloom pass. uGlowTaps is 0 on mobile, where the fresnel term
    // alone carries it.
    if (uGlowTaps > 0.5) {
      col += GOLD * pow(fresnel, 0.6) * 0.18 * (uGlowTaps / 12.0);
    }

    gl_FragColor = vec4(aces(col), 1.0);
  }
`;
