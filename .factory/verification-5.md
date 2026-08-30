# Independent verification 5 — FAIL

**Candidate:** `b5f43e3fd5c2c437605b72c9acdde2a516c504dc`  
**Live URL:** <https://audio-wrapper-batch.sociobot.in>  
**Verified:** 2026-08-30 UTC

## Verdict

**FAIL — do not release.** The live deployment byte-matches the candidate and the free local audio workflow, offline reload, accessibility baseline, privacy request capture, headers, and bundle budgets passed. The candidate still fails three explicit release gates: there is no required claims manifest or claim-test suite, there is no one-click isolated sample-data demo, and the exact production build fails because the Sociobot product catalog currently returns HTTP 503. The paid checkout and verification endpoints are also unavailable.

This is fresh evidence, not reliance on the earlier deployment-only report.

## Claims and cold first read (performed first)

Verification used a fresh detached clone at `/tmp/wrapline-verify-Knc4yO`, checked out at the exact SHA.

- `.factory/claims.json` is absent (`test -f .factory/claims.json` exited 1). No declared claim test exists to run from a demo entry point. Under the supplied claims contract this is release-blocking.
- `.factory/demo.md` is absent. `/demo` returns the ordinary landing page and does not supply sample data or an isolated demo namespace.
- Cold live read: the page says it is a local finishing line for spoken audio, asks the visitor to add intro/outro/bed and tracks, and offers “Set up a batch.” It does not name independent podcasters, radio makers, or course creators on the first screen. Crucially, it has no “Try it with sample data” action, no seeded sample, no persistent “Demo — sample data, nothing is saved” banner, Reset demo, or Start for real. The visitor must bring their own audio. This independently fails the first-read/demo-sandbox gate.
- Landing and README claims such as “Works offline,” “without uploading a byte,” originals never changing, and receipt/export behavior have no required corresponding claims tests.

## Clean install, tests, and build

```text
git clone … && git checkout b5f43e3…   clean detached checkout
npm ci --ignore-scripts                  passed; 61 packages, 0 vulnerabilities
npm test
  Vitest: 6/6 assertions passed
  tsc --noEmit: passed
  production verify:checkout: FAILED
  https://api.sociobot.in/api/v1/products returned HTTP 503
```

Therefore the exact `npm test` and `npm run build` do not pass, a release blocker under the required local quality gate.

For diagnostic browser coverage only, `VITE_STUDIO_CHECKOUT_ENABLED=true npx vite build` bypassed the failed preflight. It produced 32,886 bytes JS (11.47 KB gzip) and 15,858 bytes CSS (4.30 KB gzip), both within budget and with no font payload. This does **not** make the required production build pass.

Against that diagnostic output, `npm run test:e2e` was flaky: one initial 18-test invocation passed; a fresh second full invocation failed 1/18, `keeps an unverified license locked during a verification outage`. It timed out waiting for “could not be verified” while the UI remained “Checking license…”. An isolated retry passed. This leaves a nondeterministic gate and an unbounded license-verification wait.

## Deployment identity and functional exercise

The deployment is current, not stale. Local diagnostic-build and live SHA-256 values match for HTML, JS, CSS, worker, manifest, privacy, terms, and offline fallback.

| File | SHA-256 |
| --- | --- |
| `index.html` | `b3ff38d985e9e94cc96ad7191c3322aae4f0d149df937e85b68a9778d0061155` |
| `sw.js` | `46caa8eaddac07fd70be9dc56909c190eed446a3e60bc16624a2eaa32f41c2db` |
| `assets/index-fTzAIC3J.js` | `d6c84172348f49c5bba923adb20d8c84dd72c2fe3e9010cb5b86dc7cb6c6a6f1` |
| `assets/index-D3Lv3FUM.css` | `a5bd4ea02e423c82aca560def8815227301315a5b41267fe0639da10885dbbd7` |

Fresh live desktop Playwright exercise rejected start number `-1` with the stated 0–9999 recovery message. A representative local PCM WAV rendered successfully: “1 of 1 tracks wrapped. Review them above or download the batch.” One preview and a ZIP download link appeared. A fresh 390 × 844 mobile context had no horizontal overflow (all measured widths 390); a four-WAV free batch was correctly blocked with no output audio. No console or page errors occurred.

## Privacy, PWA, accessibility, responsive and headers

- Request capture across cold load and a render contained only same-origin shell assets and `blob:` preview URLs. No audio upload, analytics, tracker, runtime CDN font, or third-party script occurred. This supports local processing but cannot replace the missing privacy claim test.
- Fresh desktop and 390px contexts installed an activated live service worker, went offline, and reloaded with the H1 and visible offline banner.
- Against a temporary copy of the exact generated `dist/` (product source untouched), a worker revision change caused the update toast to appear. “Update now” activated the waiting worker and reloaded; reopening the profile showed the updated cache names, activated worker, no waiting worker, and hidden toast.
- Live Axe scans found 0 serious or critical findings at desktop and 390 × 844. First Tab reached the visibly outlined skip link and Enter focused `main`. Reduced-motion emulation set `scroll-behavior: auto` and 0.00001s transitions. No console errors occurred.
- Live HTML has `lang=en`, title, one H1, main landmark, alt text, privacy and terms. `/privacy/` and `/terms/` return 200.
- HTML is `no-cache`; fingerprinted JS/CSS are `public, max-age=31536000, immutable`; the worker is `no-cache, no-store, must-revalidate`. HSTS, restrictive self/Sociobot CSP, Permissions-Policy, `DENY` framing, `nosniff`, and strict-origin referrer policy are present.
- `/robots.txt` and `/sitemap.xml` return 404; `/404.html` is the normal app shell rather than a dedicated recovery page.

## Billing availability and rate-limit requirement

All safe production billing checks returned HTTP 503 with no `Retry-After`:

```text
GET /api/v1/products                                                    503
GET /api/v1/products/audio-wrapper-batch/checkout                       503
GET /api/v1/products/audio-wrapper-batch/verify?license=qa-invalid-token 503
```

No documented per-client allowance could be exercised and no 429 was observed because the service was unavailable first. The advertised paid purchase and license-restore flows are unavailable while this persists.

## Defects

### P0 — Required claims contract absent

No `.factory/claims.json`, no tagged observable claim tests, and no claim-capable demo sandbox. This is explicitly release-blocking.

### P0 — No one-click isolated sample demo; cold first screen fails

The required sample CTA, realistic sample batch, demo storage namespace, banner, reset/start-real controls, and demo documentation are absent. The first screen also does not identify the brief’s intended makers.

### P0 — Exact production build and paid endpoints unavailable

Fresh `npm test`/build fails on the 503 catalog dependency. Checkout and verification are also 503, so the advertised paid path is not available.

### P1 — License-outage E2E test is flaky; UI can remain “Checking license…”

One fresh full 18-test run failed this test while isolated retry passed. The production fetch has no timeout/abort recovery for a hanging endpoint.

### P2 — Crawl and 404 deliverables missing

`robots.txt`, `sitemap.xml`, and a dedicated recovery 404 page are required but absent.

## Required follow-up

1. Add `.factory/claims.json` and a tagged observable demo-entry test for every claim.
2. Implement `/demo` or `?demo=1` with realistic sample audio, `demo:`-isolated storage, banner/reset/start-real controls, and `.factory/demo.md`; make the first screen name the intended users and expose the prescribed CTA.
3. Restore Sociobot catalog/checkout/verify availability, prove client rate limiting with a 429 and `Retry-After`, then rerun the exact build.
4. Bound license verification and make the full E2E suite deterministic.
5. Add `robots.txt`, `sitemap.xml`, and a real 404 page, then rerun this verification.
