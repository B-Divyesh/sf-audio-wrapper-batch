# Independent verification 6 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-6`
- **Candidate commit:** `b3b1a9ddadc2315d992154480a23c4f53c7ae738`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Verdict:** **FAIL — do not accept this candidate as fully contract-complete.**

The real local audio workflow, one-click sandbox, claims, deployment identity, privacy behavior, PWA offline/update path, accessibility baseline, paid-product integration, and release gates all passed. The candidate still misses the mandatory site-structure acceptance requirements listed below: an unknown URL does not produce a real 404 response, and required social/icon metadata is absent. These are release-contract defects even though they do not block a normal batch render.

## First-read result

Cold desktop and 390 px mobile visits gave the same clear answer: Wrapline wraps finished voice tracks in batches; it is for independent podcasters, radio makers, and course creators; the first action is **Try it with sample data**. The visible action opens `/demo` in one click. The demo immediately shows the isolated Signal Desk recipe, three named tracks, a persistent “Demo — sample data, nothing is saved to your real data” banner, **Reset demo**, and **Start for real**. This requirement passes.

## Clean-checkout and claim evidence

A new clone of this exact commit was used at `/tmp/wrapline-qa.Hj5ifd`; `npm ci` installed 61 packages with zero audit vulnerabilities. Before any wider product tests, every command in `.factory/claims.json` was run exactly as declared (each production build followed by the tagged demo entry-point test). All eleven passed:

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

Further local gates also passed:

```text
npm test                PASS — 9 Vitest tests; 32 Playwright tests (desktop + 390 × 844)
npm run lint            PASS — tsc --noEmit
npm run build           PASS — dist/ emitted
npm run verify:release  PASS — registered Studio product identity, then production build
```

The exact build emitted `index-D50TPNPT.js` (36,392 bytes raw / 12.48 KB gzip) and `index-BB_2wC2W.css` (16,472 bytes raw / 4.39 KB gzip); the 114,016-byte hero WebP and these bundles are within the stated static-PWA budgets.

## Product, browser, privacy, and PWA evidence

- The normal `/demo` flow rendered all three tracks, produced three audio previews and a ZIP labeled “3 WAV files + receipt.” The offline reload retained the H1, offline notice, and all three queued samples after service-worker installation.
- Independent boundary/recovery checks on the live demo rejected `-1` and `10000` start numbers, rejected a filename recipe without `{source}`, and rejected a text file with a clear error. Restoring valid values then rendered all three WAVs; start number `0` produced `Signal Desk-00-harbour-forecast.wav`.
- A live render request log contained only the product origin plus browser-local `blob:` media URLs. There were no analytics, upload, font CDN, runtime script CDN, console errors, or page errors. Live headers provide HSTS, CSP restricted to self plus `https://api.sociobot.in`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, immutable hashed asset caching, and no-cache/no-store worker caching.
- The supplied `verify-url.sh` passed against the live root: title, `lang=en`, one H1, main landmark, image alt text, labeled buttons, and zero console/page errors. Independent Playwright Axe scans found zero serious or critical violations on desktop and 390 px mobile. Keyboard-only live smoke: the first Tab lands on the visible 3 px-outline skip link; Enter moves focus to `main`.
- The temporary-copy service-worker update check changed only that copy’s `sw.js`: the page showed “A fresh version is ready,” **Update now** activated the waiting worker and reloaded to `{ active: "activated", waiting: false, controller: "activated", toast: true }`. Product source was not changed.
- Live deployment matches the candidate: live HTML names `/assets/index-D50TPNPT.js` and `/assets/index-BB_2wC2W.css`, exactly the freshly built candidate assets.

## Billing and request allowance

`npm run verify:release` confirmed `Wrapline Studio`, USD 29.00, and the registered production checkout URL. Live `HEAD https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout` returned `303` to hosted Dodo checkout. A harmless invalid license returned `200 {"valid":false,"reason":"invalid"}` and remained locked in the product.

The product has no first-party server endpoints. Its documented Sociobot license-verification dependency was exercised from one client with 80 harmless invalid-token requests: 30 returned `200`, then 50 returned `429`; the first observed throttled request was request 30 in the issued sequence and included both `Retry-After: 2` and `x-ratelimit-after: 2`. The observed allowance is therefore 30 requests per burst (the exact rolling-window semantics are not documented by the product).

## Defects

### P1 — Unknown routes return the app shell with HTTP 200, not the required real 404

`GET https://audio-wrapper-batch.sociobot.in/missing-qa-404` returned **200** and the 1,128-byte landing-page shell, rather than the designed `404.html` with a 404 status. `/404.html` itself returns 200, but it is not used for an unknown address. This conflicts with the required real 404 route and makes a mistyped or dead internal URL indistinguishable from a valid page. Fix the Static Web Apps navigation fallback/response-override routing and add a regression that requests an arbitrary unknown URL and asserts status 404 plus the 404-page content.

### P2 — Required Open Graph, Twitter, SVG favicon, and Apple touch-icon metadata are missing

The candidate `index.html` contains no `og:*` properties, no Twitter card metadata, no SVG favicon link, and no `apple-touch-icon` link. This violates the required site metadata/icon contract. Add product-specific OG/Twitter title, description, and a 1200 × 630 Wrapline image; add authored SVG favicon and 180 px Apple touch icon links, then test them in the release artifact.

## Re-run

```sh
npm ci
npm test
npm run verify:release
```

Then rerun the eleven `.factory/claims.json` commands and live deployment checks above after correcting the two defects.
