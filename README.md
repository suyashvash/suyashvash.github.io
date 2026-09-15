# Cosmic Shaft — company website

Product engineering firm. Jaipur, India. Est. 2024.
Udyam registration `UDYAM-RJ-17-0684883`.

---

## ⚠️ NEVER MERGE THIS BRANCH INTO `main`

`main` is the **personal portfolio** and deploys to **suyashvashishtha.com**.
This branch replaces the repo root and sets `CNAME` to `cosmicshaft.com`.

Merging it into `main` would repoint the personal domain and delete the personal site.

- ❌ Never `git merge cs-v1` into `main`
- ❌ Never open a **pull request** targeting `main` — `.github/workflows/azure-static-web-apps-*.yml`
  triggers on `pull_request` against `main` and would build a preview
- ✅ Pushing the `cs-v1` branch itself is safe; neither workflow fires on non-`main` branches

**To ship:** push this branch as `main` of a **separate** repository, then add that repo's own
`CNAME` and a copy of `.github/workflows/static.yml`.

---

## Local development

ES modules will not load over `file://`. Serve it:

```sh
python3 -m http.server 8080
# http://localhost:8080
```

### Forcing a render tier

```
?tier=0   no WebGL at all — the static fallback
?tier=1   mobile-grade WebGL
?tier=2   integrated GPU
?tier=3   full experience
```

Tier 0 must always look like the same site — same palette, type, layout and copy.
Only motion and depth degrade.

---

## Stack

No build step. No framework. No package manager. Vanilla ES modules, served as-is.

Libraries are **vendored** in `vendor/` (pinned versions in each file header) rather than
CDN-loaded: same-origin gzip, no third-party outage, no privacy leak, frozen versions.
Upgrading means re-downloading the file deliberately.

| | |
|---|---|
| three.js | 0.186.0 |
| GSAP + ScrollTrigger + SplitText | 3.15.0 |
| Lenis (desktop only) | 1.3.26 |

## Layout

```
index.html          one-page scroll journey
styles/             numbered, linked as separate <link> tags — never @import
js/core/            capability detection, state bus, the single RAF loop, scroll
js/three/           scene modules + shaders (GLSL as exported template strings)
js/beats/           one module per scroll beat
js/ui/              nav, preloader, reveals, counters, form
js/data/            work, testimonials, capabilities
vendor/             pinned libraries
assets/             fonts (variable WOFF2), images, favicon
work/               case studies — static, no WebGL
legal/              privacy, terms
```

All asset paths are **relative** (`./assets/…`), never root-absolute, so this tree works
unchanged as the root of the new repo.
