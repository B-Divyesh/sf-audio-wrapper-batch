# Independent verification 7 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-7`
- **Candidate:** `a34d9b2fa83b71e58230506cff783bb1bc3b01da`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Verdict:** **FAIL — do not accept until the route-shell/accessibility defects below are repaired.**

The product's real audio job is functional and the live deployment is the tested candidate. The failure is a mandatory site-structure and keyboard-accessibility contract gap on the legal and 404 routes.

## First read (cold live visit)

The first screen clearly says **“Wrap finished voice tracks in batches”** and names independent podcasters, radio makers, and course creators. The first action is the visible one-click **“Try it with sample data”** link to `/demo`; it immediately opens a persistent demo banner, Signal Desk wrapper recipe, and three named tracks. It passes the plain-words and demo first-read requirements.

## Clean local gates and all declared claims

`npm ci` completed from the candidate lockfile (61 packages; audit reported 0 vulnerabilities). Before wider QA, every command declared in `.factory/claims.json` was run exactly as written, against the production-built demo entry point. All passed on both configured Chromium projects:

| Claim | Result |
| --- | --- |
| `demo-sample-data` | PASS |
| `demo-isolation` | PASS |
| `local-audio` | PASS |
| `offline-demo` | PASS |
| `wav-mp3-input` | PASS |
| `wav-receipt` | PASS |
| `audio-behavior` | PASS |
| `source-receipt` | PASS |
| `local-recipes` | PASS |
| `free-tier` | PASS |
| `studio-license` | PASS |

Further gates:

```text
npm test                 PASS — 10 Vitest tests and 38 Playwright tests
npm run lint             PASS — tsc --noEmit
npm run build            PASS — production dist/ emitted
npm run verify:release   PASS — registered Studio product identity (USD 29), then production build
```

The fresh build emitted JS `index-D50TPNPT.js` (36,392 bytes raw / 12.48 KB gzip) and CSS `index-BB_2wC2W.css` (16,472 bytes raw / 4.39 KB gzip). Hero WebP is 114,016 bytes. These are within the static-PWA budgets. SHA-256 of each live JS/CSS asset exactly equals the freshly built candidate: `4ef44dfc…7561515` and `a9dcbe42…09e015` respectively.

## Live behavior, privacy, PWA, and accessibility evidence

- Fresh `/demo` render: three queued sample tracks rendered to three previewable WAVs and a download labeled **“3 WAV files + receipt.”** A `-1` start number reports the exact validation error; a text file reports “No supported audio found”; restoring start number `0` then renders all three outputs (`Signal Desk-00-harbour-forecast.wav` first).
- Full live demo render request log contained only `audio-wrapper-batch.sociobot.in` HTTP requests and browser-local `blob:` audio URLs. No upload, analytics, tracking pixel, font CDN, runtime CDN, console error, or page error occurred.
- Fresh service-worker offline reload passed after installation: `/demo` retained its H1, offline notice, and all three sample tickets. `registration.update()` completed on the active worker (`active` and `controller` both `activated`); the emitted worker handles `SKIP_WAITING`, and the app exposes its **Update now** waiting-worker UI. The worker is served `no-cache, no-store, must-revalidate`.
- Fresh desktop axe scan of live `/demo` found zero serious/critical violations. At 390 × 844 with reduced motion, there was no horizontal overflow (390 px scroll/client widths), navigation correctly collapsed, and no console/page errors. Keyboard-only smoke: first Tab focused the 44.8 px high skip link with a visible `rgb(20, 91, 115) solid 3px` outline; Enter moved focus to `#main`.
- Live headers include HSTS, `frame-ancestors 'none'`, restrictive CSP, `nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, and permissions policy. Hashed JS/CSS are `public, max-age=31536000, immutable`; `sw.js` is no-cache/no-store. An unknown URL returns the designed document with HTTP 404.
- Live same-origin link crawl returned 200 for `/`, `/demo`, `/privacy/`, `/terms/`, and every in-page anchor target. No external link was followed.

## License endpoint allowance

The product has no first-party backend. Its documented Sociobot license verification endpoint was tested only with one harmless invalid token for this product. Requests 1–30 returned `200` with `{"valid":false,"reason":"invalid"}`; request 31 and the next four returned **429** with both `Retry-After: 4` and `x-ratelimit-after: 4`. Observed allowance: **30 requests per burst**, then retry after four seconds.

## Defects

### P1 — Required route shell and keyboard skip path are absent outside the app route

**Evidence:** Fresh live inspection found `/privacy/`, `/terms/`, and `/missing-qa-wrapline-7` return one `<h1>` and `<main>`, but all three have **no skip link** and **no `<header><nav>`**. Their headers contain only a home link. Their footers are not the required shared footer (they omit the product one-liner, Param Factory attribution, and a version/build id). The landing footer also has no version/build id.

This violates the supplied accessibility requirement for a keyboard skip link and the mandatory site-structure rule that the header/footer be consistent on every route. It makes keyboard orientation and route navigation materially worse on the mandatory privacy, terms, and recovery pages.

**Repair:** Use one shared route shell for app, privacy, terms, and 404: visible skip-to-`main`, wordmark/home, the small common nav, and the complete footer including a stable build id. Add release-browser assertions for those elements on every route.

### P1 — Required per-route metadata is missing on privacy, terms, and 404

**Evidence:** Fresh live DOM inspection:

| Route | Canonical | Open Graph | Twitter card |
| --- | --- | --- | --- |
| `/` | present | present | present |
| `/demo` | present | present | present |
| `/privacy/` | missing | missing | missing |
| `/terms/` | missing | missing | missing |
| unknown-route 404 | missing | missing | missing |

The pages do have correct titles, `lang=en`, one H1, and main landmarks, but this still violates the supplied mandatory per-route metadata contract.

**Repair:** Add route-specific canonical and social metadata (or explicitly document and test the intended 404 exception if the contract is changed) to the static legal and 404 documents. Add a release test covering every route.

## Re-run after repair

```sh
npm ci
npm test
npm run verify:release
```

Then run every command in `.factory/claims.json` and repeat the live route-shell/metadata, demo render, offline reload, axe, and header checks.
