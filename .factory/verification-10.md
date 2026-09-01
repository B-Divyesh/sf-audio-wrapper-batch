# Independent verification 10 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-10`
- **Candidate:** `b5a6a64099468acd117c63eb08c3aa8d466451c6`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-09-01 UTC
- **Verdict:** **FAIL**

The candidate and live deployment complete the audio batch job, and every declared claim passes. One P1 quality defect remains: a fresh load reports an uncaught page error when service workers are unavailable. The explicit release contract requires no console or page errors on load.

## First-read gate

**PASS.** A cold desktop visit returned HTTP 200 and answered all three required questions in the first viewport:

- What it does: “Add intros and outros to voice tracks.”
- Who it is for: podcasters, radio makers, and course creators who reuse music, loudness, and filenames.
- What to do first: “Try it with sample data,” with “Opens three ready-to-render voice tracks” beside it.

One click opened `/demo` with a persistent sample-data notice, Reset demo, Start for real, a complete Signal Desk recipe, and three queued tracks.

## Clean checkout and declared claims

A detached worktree at the exact candidate SHA was clean before `npm ci`. The install added 65 packages and reported zero vulnerabilities.

`.factory/claims.json` exists and contains 17 entries. Every listed command ran independently from that worktree. Each targeted browser check ran in desktop Chromium and at 390 × 844: **34 of 34 executions passed**. The durable output summary is [claims-summary.txt](evidence/verification-10/claims-summary.txt).

| Claim | Result |
| --- | --- |
| `demo-sample-data` | PASS |
| `demo-isolation` | PASS |
| `local-audio` | PASS |
| `offline-demo` | PASS |
| `wav-mp3-input` | PASS |
| `wav-receipt` | PASS |
| `mp3-output` | PASS |
| `audio-behavior` | PASS |
| `source-receipt` | PASS |
| `local-recipes` | PASS |
| `free-tier` | PASS |
| `studio-license` | PASS |
| `studio-unlimited` | PASS |
| `license-daily-check` | PASS |
| `license-boundary` | PASS |
| `recipe-controls` | PASS |
| `route-shell` | PASS |

The live product and README claims are represented in the ledger. No additional product claim was found without a corresponding check.

## Repository quality gates

- `npm test`: PASS — 14 Vitest checks and 58 Playwright executions across desktop and mobile.
- `npm run lint`: PASS — TypeScript `--noEmit`.
- `npm run build`: PASS — exact production build emitted `dist/`.
- `npm run verify:release`: PASS.
- `npm run test:e2e:live`: PASS — 58 live desktop/mobile executions.
- `/opt/fleet/lib/verify-url.sh`: PASS — 570 ms load, title present, `lang=en`, one H1, main landmark present, no missing alt text, no unlabeled buttons, and no errors in the normal browser configuration.

Production build sizes:

- Initial JavaScript: 40,687 bytes raw, 13.70 KB gzip.
- CSS: 16,903 bytes raw, 4.48 KB gzip.
- MP3 encoder: 183,460 bytes raw, 86.49 KB gzip, loaded only for MP3 output.
- Hero WebP: 114,016 bytes.

All are within the stated budgets.

## End-to-end product QA

Confirmed on the live desktop and 390 px mobile layouts:

- The demo starts with an intro, outro, music bed, recipe, and three realistic voice tracks.
- WAV rendering creates three playable audio previews, predictable names, individual downloads, a batch ZIP, and a JSON receipt.
- MP3 rendering at both 128 and 192 kbps produces decodable 48 kHz files with the selected constant bitrate.
- Deterministic audio checks confirm 48 kHz 16-bit WAV, ±12 dB voice-gain limits, unchanged intro/outro levels, 7 dB bed reduction under voice, and the disclosed peak ceiling.
- Saving, reloading, exporting, importing, and deleting recipes preserve the documented local-storage boundary.
- An empty queue keeps Render batch disabled. An empty recipe name, a filename recipe without `{source}`, and start number `10000` each show a specific correction.
- A text file is rejected with the accepted formats stated. A mixed valid/invalid selection keeps the WAV and reports the skipped file.
- A malformed WAV shows a per-track decode message. Removing it, adding a valid WAV, and rendering again succeeds with one playable output.
- Free mode keeps the one-recipe and three-track limits. Recorded valid and inactive license responses confirm the client behavior without using real purchase data.

## Accessibility and responsive behavior

- Axe found 0 serious or critical findings on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404 route in both browser projects.
- Each route has one H1, a main landmark, ordered headings, route-specific metadata, shared navigation, legal links, and a keyboard skip path.
- The first Tab reaches “Skip to main content.” Its visible focus outline is 3 px solid `rgb(20, 91, 115)`.
- Keyboard-only traversal reached Render batch after 29 Tab presses; Enter rendered all three sample tracks. The range control responds to arrow keys.
- Visible controls checked by the suite meet the 44 px target minimum. Neither desktop nor 390 px layouts have horizontal overflow.
- A 200% root text-size check retained the layout without horizontal overflow.
- Reduced-motion mode reports `0.00001s` transition and animation durations.
- The documented single light treatment has no serious or critical contrast finding.

## Privacy, requests, headers, and routes

A fresh full demo render recorded 14 requests on each viewport. Every HTTP request used only `https://audio-wrapper-batch.sociobot.in`; no analytics, tracker, third-party font, runtime CDN, or audio upload request appeared.

Playwright confirmed the live document response includes:

- CSP with `default-src 'self'`, `frame-ancestors 'none'`, and the documented billing connection origin.
- HSTS, Permissions-Policy, strict-origin referrer policy, nosniff, and `X-Frame-Options: DENY`.
- `Cache-Control: no-cache` for HTML.
- `public, max-age=31536000, immutable` for fingerprinted assets.
- `no-cache, no-store, must-revalidate` for `sw.js`.

Landing, demo, privacy, terms, manifest, robots, and sitemap returned 200. The unknown route returned the designed 404. All same-origin links checked returned their expected status. External destinations were identified from markup and were not followed during browser QA.

## PWA and performance

- The manifest has a versioned start URL, standalone display, product colors, and valid 192 × 192 and 512 × 512 icons; the 512 icon is maskable.
- The service worker installed at product scope, reached `activated`, completed `registration.update()`, and used a versioned cache.
- After switching the fresh context offline, `/demo` reloaded with its offline notice and rendered all three tracks.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100.
- Lighthouse metrics: FCP 0.96 s, LCP 1.51 s, total blocking time 27 ms, CLS 0.
- The largest observed browser event duration during a keyboard-triggered render was 80 ms.

## Deployment identity

The live artifact matches the candidate byte for byte:

| File | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `fec663f45054d82d20882696859a2f660f73374373478769b49ffeecc717e1e3` |
| `sw.js` | `c87ea4a5e1d81c0812c3cf2370ed5b0f72ba0a9ae99e4abaac878f13250e8f59` |
| `assets/index-CqVNvYNN.css` | `2530723ed9ea256bd45781853efa518c9079084c3065d2bc2d70f571ef17aab5` |
| `assets/index-VokUFUn6.js` | `07b35342a78cb8873e316d693770196926b72fe0fa2a7c0d612a6ebb917c8de0` |
| `assets/mp3-encode-B02HWg1C.js` | `40cee005f12a775e87de8e081c819a7bf8f9c55e90314fd168f2527ca1232ade` |

The visible footer reports build `1.0.0-r10`.

## Findings by severity

### P0

None.

### P1 — release-blocking

**V10-1: The page reports an uncaught error when service workers are unavailable.**

Reproduction:

1. Open `/` or `/demo` in a fresh Chromium context with service workers disabled by browser policy.
2. Wait for initial loading to complete.
3. Read the page-error log.

Observed:

```text
TypeError: Cannot read properties of undefined (reading 'waiting')
at assets/index-VokUFUn6.js:117:14982
```

The same result occurred on the live deployment and the candidate build. `navigator.serviceWorker.register()` resolves without a registration in this configuration, and the update setup reads `registration.waiting`. The interface remains visible and a three-track render still completes, but the load does not meet the required zero-error gate.

Expected: treat a missing registration as an unavailable offline feature, keep local rendering usable, and finish initial loading without an uncaught error. Add a regression check using a fresh context with `serviceWorkers: 'block'`.

### P2 / P3

None found.

## Scope notes

Wrapline is a static PWA with no product-owned server API, persistence service, health route, concurrency boundary, or sign-in. The purchase and license URLs point to the shared Sociobot billing service. Its request allowance was not measured because that service is outside the authorized `sf-audio-wrapper-batch` resource boundary; no allowance was observed. Client-side license behavior is covered with recorded responses.

No AI-assisted step is expected for this deterministic audio-finishing job. The brief’s useful import/export and repeat-use needs are present through portable recipes and receipts.

No product source was modified during verification.
