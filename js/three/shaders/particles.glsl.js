import { palette } from './common.glsl.js';

/**
 * Particles.
 *
 * Positions are computed ENTIRELY in the vertex shader from a seeded helix —
 * zero CPU work per frame, no attribute uploads, no position array to keep
 * in sync. The whole field costs one draw call and a handful of uniforms.
 *
 * Colour encodes the brand rule: violet far from the shaft, gold on contact.
 * That transition is the entire story told without a word of copy.
 */

export const particleVert = /* glsl */ `
  attribute float aSeed;
  attribute float aRadius;
  attribute float aSpeed;

  uniform float uTime;
  uniform float uFlow;
  uniform float uMode;      // 0 = intake (inward), 1 = output (outward)
  uniform float uImpulse;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vContact;   // 0 = free, 1 = touching the shaft
  varying float vAlpha;

  void main() {
    float t = uTime * aSpeed * (0.35 + uFlow * 0.9);

    // Travel along Z, wrapping — an endless stream.
    float z = mod(aSeed * 40.0 + t * 3.0, 28.0) - 14.0;

    // Distance from the shaft axis: particles spiral inward as they travel,
    // reaching the surface near the middle of the run.
    float journey = clamp((z + 14.0) / 28.0, 0.0, 1.0);
    float converge = mix(1.0, 0.08, smoothstep(0.0, 0.55, journey));

    // In output mode they fly apart again past the midpoint.
    float diverge = mix(0.0, 1.0, smoothstep(0.55, 1.0, journey)) * uMode;
    float radius = aRadius * (converge + diverge * 2.2);

    float angle = aSeed * 6.2831853 + t * 1.6;
    vec3 pos = vec3(cos(angle) * radius, sin(angle) * radius, z);

    // Impulse shoves the field outward briefly.
    pos.xy *= 1.0 + uImpulse * 0.35;

    vContact = 1.0 - smoothstep(0.35, 1.4, radius);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Fade at both ends of the run so nothing pops in or out.
    vAlpha = smoothstep(0.0, 0.12, journey) * (1.0 - smoothstep(0.86, 1.0, journey));

    gl_PointSize = uSize * uPixelRatio * (12.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFrag = /* glsl */ `
  precision mediump float;

  varying float vContact;
  varying float vAlpha;

  ${palette}

  void main() {
    // Round, soft-edged point.
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float falloff = 1.0 - smoothstep(0.0, 0.25, d);

    // Violet entering, gold on contact with the shaft.
    vec3 col = mix(VIOLET, GOLD_HOT, vContact);
    col = mix(col, GOLD, vContact * 0.4);

    gl_FragColor = vec4(col, falloff * vAlpha * 0.85);
  }
`;
