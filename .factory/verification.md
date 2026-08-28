# Independent verification — FAIL

**Tested candidate:** `b00f84ac607fa5a1e6c832ccc41bf8dc422b2d13` (`b00f84a`, `main`)

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Verification date:** 2026-08-28

## Verdict

**FAIL — do not release this candidate.** The local product workflow is strong, and the deployed bytes match the candidate, but two release-blocking acceptance requirements are not met: a true first-install offline PWA reload fails, and the public Studio-purchase link points at an unregistered staging endpoint that returns 404.

## Environment and reproducibility

- Created a detached clean worktree at `/tmp/wrapline-qa-b00f84a` at the exact SHA. The original workspace had unrelated untracked `graphify-out/`, which was not used or changed.
- `npm ci`: passed; 61 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test`: passed — 3 Vitest tests plus 8 Playwright tests (desktop Chromium and 390 px mobile).
- `npm run build`: passed. `dist/` was produced by `tsc --noEmit && vite build`.
- No lint script exists in `package.json`; the build's TypeScript check is the available static check.
- This is a PWA, not a library/CLI/backend, so consumer-package, server concurrency, health, and persistence-server checks do not apply.

## Deployment identity

The deployed candidate is not a deployment-only failure. The live root references `index-CTipJMkJ.js` and `index-CDcS-uS6.css`; SHA-256 comparisons against the fresh `dist/` output matched exactly:

| File | SHA-256 |
| --- | --- |
| `assets/index-CTipJMkJ.js` | `6200b576d3d4a0da48d4eb640a1255674f28972ed2bc66401865af9a08058f2d` |
| `assets/index-CDcS-uS6.css` | `82dcbc725dabc17ce5b0771e69fc9b8ef05070e50982c2279b99c386f33ac487` |
| `sw.js` | `549fad235d62f27bf850b854e863870d4598523e73a47375972e4ad673a82a60` |

## Product and browser checks that passed

- Desktop production-build and live-site flow: added a valid WAV voice queue, intro, outro, and looping bed; rendered three reviewed WAV outputs; downloaded a ZIP containing all output files plus `wrapline-receipt.json`; verified names at the 9,999 boundary (`9999`, `10000`, `10001`); saved/reloaded the wrapper asset from IndexedDB.
- MP3 flow: rendered a real 51 KB MP3 in Chromium to a reviewable WAV batch, with no page errors.
- Invalid/recovery paths: non-audio files are rejected; a naming template without `{source}` blocks rendering with clear recovery guidance; a corrupt `.wav` produces the per-job error/"Nothing rendered" state and a subsequent valid MP3 renders successfully; free-tier four-track boundary is blocked with the unlock/removal guidance.
- Recipe persistence: confirmed `wrapline-local` IndexedDB exists and saved wrapper audio persists across reload. Free-flow request capture contained only same-origin app assets and `blob:` preview/download URLs—no analytics, trackers, CDN fonts, or audio uploads.
- Desktop keyboard: Tab first reaches the visible Skip to main-content link. Native controls were operable. Reduced-motion emulation changed transition duration to the reduced value. No console errors or `pageerror` events were observed.
- 390 × 844 mobile: no horizontal overflow (`390 == 390` CSS px); visual review showed an intentional stacked layout, readable primary actions, and no fixed-bar obstruction.
- Accessibility: fresh independent `@axe-core/playwright` scan reported zero serious/critical violations. Live/local pages have `lang="en"`, title, exactly one H1, main landmark, skip link, labels, alt text, and visible 3 px focus styling.
- PWA update: an isolated static-server test changed only the served worker revision after installation. The candidate showed its update toast, exposed a waiting worker, accepted **Update now**, and reloaded successfully.
- Offline after the app shell has already been controlled/cached: passed.
- Output budget: fresh uncompressed initial JS is 32,264 bytes; CSS 15,489 bytes; hero WebP 114,016 bytes. Each is within the stated 200 KB / 50 KB / 300 KB budgets.

## Defects

### P1 / release blocker — first-install offline reload is not functional

The worker's precache (`wrapline-v2-static`) contains only HTML/manifest/icons/hero/legal routes. It omits the versioned app JS and CSS that constitute the application shell.

Fresh production-build evidence immediately after `navigator.serviceWorker.ready`:

```json
{"key":"wrapline-v2-static","urls":["/","/index.html","/offline.html","/manifest.webmanifest","/icon-192.png","/icon-512.png","/art/wrapline-bench.webp","/privacy/","/terms/"]}
```

With a brand-new profile, first worker installation, browser HTTP cache cleared/disabled, then offline reload, both local production build and live deployment returned an HTML page with `#app` empty, no H1, and two `net::ERR_FAILED` asset failures. This violates the PWA contract to precache the app shell and the product claim that it works offline. The supplied offline test reloads once online before going offline, which dynamically caches the missing assets and therefore misses this first-install case.

### P1 / release blocker — live Studio purchase is unusable

The deployed app's visible purchase anchor is:

```text
https://pilot-api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout
```

This is the pilot/staging base, not the required production `https://api.sociobot.in` base. A safe `HEAD` request to the exact visible pilot URL returned **HTTP 404** (2026-08-28). The production counterpart also returned 404, so the product registration/deployment environment has not been completed. Users cannot buy the advertised $29 one-time Studio license; this blocks the paid unlimited-batch path.

### P2 — live static caching does not meet the immutable hashed-asset policy

Live JS, CSS, and hero assets all return `Cache-Control: public, must-revalidate, max-age=30`, including hashed filenames. The factory performance contract calls for long-lived immutable caching for hashed assets. This also masks the first-install offline defect for up to 30 seconds in ordinary browser cache conditions; clearing the HTTP cache reproduces it deterministically.

### P2 — missing browser hardening headers

The live response includes HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, but does not send a Content-Security-Policy, Permissions-Policy, or frame-ancestors/X-Frame-Options policy. For a local-audio app, add an explicit restrictive CSP and anti-framing policy before release. `X-XSS-Protection` is present but is obsolete and is not a CSP replacement.

## Response-policy evidence

Live root and asset responses were HTTP/2 200 with HSTS, strict-origin referrer policy, nosniff, and `max-age=30`. Privacy/terms both returned HTTP 200. No third-party resource was requested in the free flow. No production payment attempt was made; only safe HEAD checks were used for the broken checkout endpoint.

## Required remediation and re-verification

1. Generate the asset manifest during build and precache the hashed JS/CSS (and necessary app shell assets) with a new worker cache version. Re-test first-install offline reload with a clean browser profile and cleared HTTP cache.
2. Register the product in the appropriate billing environment and make the release build with `VITE_BILLING_BASE=https://api.sociobot.in`; verify the public checkout URL returns a valid hosted checkout before exposing the paid CTA.
3. Configure immutable long-lived caching for fingerprinted assets and no-cache/revalidation appropriate to `sw.js`/HTML.
4. Add CSP, Permissions-Policy, and anti-framing response headers at deployment.
5. Re-run this entire verification, including clean install, build, WAV + MP3 batch, offline first-install, update flow, and live checkout-link validation.
