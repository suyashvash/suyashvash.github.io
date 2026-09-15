/**
 * Shared GLSL chunks.
 *
 * GLSL lives in .js as exported template strings rather than .glsl files
 * fetched at runtime: no fetch waterfall, no MIME configuration, no CORS
 * surprise, and it all arrives in one module request.
 */

export const noise = /* glsl */ `
  // Hash without sine — stable across drivers, unlike sin-based hashes
  // which diverge badly on some mobile GPUs.
  vec3 hash33(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123);
  }

  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash13(i + vec3(0,0,0)), hash13(i + vec3(1,0,0)), f.x),
          mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x),
          mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  // 4 octaves. Two domain-warp passes are applied by the caller so the
  // result never reads as tiling noise.
  float fbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      sum += amp * vnoise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return sum;
  }
`;

export const palette = /* glsl */ `
  // The brand rule, encoded: plasma is raw energy, gold is transmitted
  // output. Particles enter violet and leave gold.
  const vec3 PLASMA_DEEP = vec3(0.169, 0.133, 0.439);
  const vec3 PLASMA      = vec3(0.424, 0.549, 1.000);
  const vec3 VIOLET      = vec3(0.482, 0.380, 1.000);
  const vec3 GOLD        = vec3(0.898, 0.706, 0.373);
  const vec3 GOLD_HOT    = vec3(0.969, 0.890, 0.737);
  const vec3 VOID_COL    = vec3(0.031, 0.035, 0.047);
`;

export const tonemap = /* glsl */ `
  // ACES approximation. Keeps the gold specular from clipping to white,
  // which is what makes it read as metal rather than as a glow.
  vec3 aces(vec3 x) {
    const float a = 2.51; const float b = 0.03;
    const float c = 2.43; const float d = 0.59; const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }
`;
