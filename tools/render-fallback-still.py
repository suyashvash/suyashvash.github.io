"""
Pre-render the tier-0 fallback still.

This deliberately reuses the SAME fbm noise, domain warping, palette and
tonemap as js/three/shaders/nebula.glsl.js, so the static backdrop is a
genuine frame of the real scene rather than a different picture that happens
to be dark. That is what makes tier 0 look like the same site.
"""
import numpy as np
from PIL import Image

W, H = 1920, 1080

# ---- palette, matching common.glsl.js ---------------------------------
PLASMA_DEEP = np.array([0.169, 0.133, 0.439])
PLASMA      = np.array([0.424, 0.549, 1.000])
VIOLET      = np.array([0.482, 0.380, 1.000])
GOLD        = np.array([0.898, 0.706, 0.373])
GOLD_HOT    = np.array([0.969, 0.890, 0.737])
VOID        = np.array([0.031, 0.035, 0.047])

def hash13(x, y, z):
    px = np.modf(x * 0.1031)[0]
    py = np.modf(y * 0.1031)[0]
    pz = np.modf(z * 0.1031)[0]
    d = px * (pz + 31.32) + py * (py + 31.32) + pz * (px + 31.32)
    px, py, pz = px + d, py + d, pz + d
    return np.modf((px + py) * pz)[0]

def vnoise(x, y, z):
    ix, iy, iz = np.floor(x), np.floor(y), np.floor(z)
    fx, fy, fz = x - ix, y - iy, z - iz
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz)
    def h(dx, dy, dz): return hash13(ix + dx, iy + dy, iz + dz)
    def lerp(a, b, t): return a + (b - a) * t
    return lerp(
        lerp(lerp(h(0,0,0), h(1,0,0), fx), lerp(h(0,1,0), h(1,1,0), fx), fy),
        lerp(lerp(h(0,0,1), h(1,0,1), fx), lerp(h(0,1,1), h(1,1,1), fx), fy), fz)

def fbm(x, y, z):
    s = np.zeros_like(x); amp = 0.5
    for _ in range(4):
        s += amp * vnoise(x, y, z)
        x, y, z = x * 2.02, y * 2.02, z * 2.02
        amp *= 0.5
    return s

def aces(c):
    a, b, cc, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    return np.clip((c * (a * c + b)) / (c * (cc * c + d) + e), 0, 1)

# ---- nebula ------------------------------------------------------------
u = (np.arange(W) + 0.5) / W
v = (np.arange(H) + 0.5) / H
U, V = np.meshgrid(u, v)
px = (U - 0.5) * (W / H)
py = (V - 0.5)

t = 0.0
w1 = fbm(px * 1.6, py * 1.6, np.full_like(px, t))
w2 = fbm(px * 1.9 + w1 * 0.9, py * 1.9 + w1 * 0.9, np.full_like(px, t * 1.3 + 4.0))
density = fbm(px * 2.2 + w2 * 1.1, py * 2.2 + w2 * 1.1, np.full_like(px, t * 0.8 + 9.0))
density = np.power(np.maximum(density, 0), 1.9)

dist = np.sqrt((px - 0.18) ** 2 + (py + 0.06) ** 2)
falloff = 1 - np.clip((dist - 0.1) / (1.05 - 0.1), 0, 1) ** 2 * (3 - 2 * np.clip((dist - 0.1) / 0.95, 0, 1))
falloff = np.clip(falloff, 0, 1)
density *= falloff

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

col = np.zeros((H, W, 3))
m1 = smoothstep(0.15, 0.75, density)[..., None]
col = PLASMA_DEEP * (1 - m1) + PLASMA * m1
m2 = (smoothstep(0.55, 0.95, density) * 0.55)[..., None]
col = col * (1 - m2) + VIOLET * m2
col += GOLD * (density ** 2)[..., None] * 0.20
col *= (density * 0.92)[..., None]   # a bruise in the dark, not a wallpaper

# ---- the shaft: a fluted cylinder receding to a vanishing point --------
# Screen-space approximation of the 3D shaft, lit ONLY by rim light: a gold
# edge on one side, a hot specular streak along the top, near-black on the
# other. No ambient, no fill — that is what makes it read as machined metal
# in a vacuum rather than a grey tube.
vx, vy = 0.72, 0.545          # vanishing point, right of centre
axis_y = 0.545                # the shaft lies horizontally

# Progress from the left edge (0, nearest camera) to the vanishing point.
run = np.clip((vx - U) / vx, 0.0, 1.0)      # 1 at left edge, 0 at vanishing point
near = run ** 0.85                           # perspective foreshortening

HALF_NEAR = 0.052
half = HALF_NEAR * near                      # tapers monotonically to a point
half = np.maximum(half, 1e-5)

# The axis drifts very slightly as it recedes, so it is not a dead-flat bar.
axis = axis_y + (vy - axis_y) * (1.0 - run)
across = (V - axis) / half                   # -1 .. 1 across the cylinder
inside = (np.abs(across) < 1.0) & (U < vx)

acl = np.clip(across, -1, 1)

# Surface normal of a cylinder seen side-on.
ny = acl
nz = np.sqrt(np.maximum(1.0 - acl * acl, 0.0))

# 6 shallow longitudinal flutes. A perfectly smooth cylinder rotating is
# visually invisible; the flutes are what make the rotation legible.
theta = np.arcsin(acl)
flute = np.cos(theta * 6.0)
fshade = smoothstep(-0.35, 1.0, np.abs(flute))

# Key light upper-left, rim light lower-right, specular streak along the top.
key    = np.clip(-ny * 0.55 + nz * 0.72, 0, 1)
rim    = np.clip(ny * 0.8 + (1 - nz) * 0.6, 0, 1) ** 2.2
fres   = (1.0 - nz) ** 2.4
streak = np.exp(-((across + 0.48) ** 2) / 0.020)

shaft = np.zeros_like(col)
shaft += GOLD     * (key * 0.30)[..., None]
shaft += GOLD_HOT * (streak * 0.62)[..., None]
shaft += GOLD     * (fres * 0.34)[..., None]
shaft += PLASMA   * (rim * fres * 0.18)[..., None]

# Flute troughs darken; the far side falls to near-black.
shaft *= np.clip(0.34 + fshade * 0.66, 0, 1)[..., None]
shaft *= np.clip(0.30 + (1 - np.clip(across, 0, 1)) * 0.85, 0, 1)[..., None]

# Fade as it recedes into the nebula.
shaft *= np.clip(near * 1.15, 0, 1)[..., None]

col = np.where(inside[..., None], col * 0.22 + shaft, col)

# A tight bloom along the shaft so it sits IN the nebula rather than on it.
halo = np.exp(-((V - axis) / np.maximum(half * 4.2, 1e-6)) ** 2) * near * (U < vx)
col += GOLD * (halo * 0.085)[..., None]

# A small hot point at the vanishing end — energy leaving the machine.
tip = np.exp(-(((U - vx) ** 2) * 1600 + ((V - vy) ** 2) * 5200))
col += GOLD_HOT * (tip * 0.38)[..., None]

# ---- stars -------------------------------------------------------------
rng = np.random.default_rng(20240401)
for i in range(900):
    x = int(rng.random() * W); y = int(rng.random() * H)
    r = 0.25 + rng.random() * 1.3
    a = 0.18 + rng.random() * 0.6
    c = GOLD_HOT if rng.random() > 0.9 else np.array([0.91, 0.93, 1.0])
    rr = max(1, int(r))
    col[max(0,y-rr):y+rr+1, max(0,x-rr):x+rr+1] += c * a * 0.9

col = aces(col) + VOID

# Dither — without it this much smooth gradient bands visibly on 8-bit.
col += (rng.random((H, W, 3)) - 0.5) / 255.0
col = np.clip(col, 0, 1)

img = Image.fromarray((col * 255).astype(np.uint8), 'RGB')
img.save('/tmp/hero-still.png')
print('rendered /tmp/hero-still.png', img.size)
