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

## Contact form / leads

Writes to Firestore in the **shared** project `suyash-portfolio-b9bf5`,
collection `leads`, tagged **`source: "FIRM_ENQUIRY"`** so firm enquiries
filter apart from personal-portfolio leads.

The Firebase SDK is loaded on **first interaction** with the form
(`focusin` / `pointerenter`), never at page load — unlike the personal site,
which blocks first paint on two `<script>` tags in `<head>`.

If the write fails the form hands off to `mailto:` rather than losing the
enquiry.

### Sort on `createdAt`, not `timestamp` or `sentOn`

| field | type | use |
|---|---|---|
| `createdAt` | Firestore **Timestamp**, server clock | ✅ the one to sort and filter on |
| `clientSentAtISO` | string, ISO 8601 UTC | diagnostic; compare against `createdAt` to spot client clock skew |
| `timestamp` | number (epoch ms, **client** clock) | legacy, kept for compatibility |
| `sentOn` | string, **client locale + timezone** | legacy, kept for compatibility |

`timestamp` is a plain number, so the console renders it as `1789462490863`
rather than a date, and `sentOn` is a locale string starting with the weekday
name (`"Tue Sep 15 2026 …"`), so ordering it sorts Fri → Mon → Sat → Sun.
Both are also the *visitor's* clock. `createdAt` uses `serverTimestamp()`,
which the server resolves at write time — readable, sortable, and immune to a
wrong clock on the visitor's device.

### ⚠ Security rules are not applied yet

`firestore.rules` in this repo must be published. As of 2026-09-15 the live
rules allow **any reader to download every lead and delete them**, using only
the public API key that is committed in this repo. See the header of
`firestore.rules` for the verification commands and how to publish.

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
