# Independent verification 11 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-11`
- **Candidate:** `5850a7ba585d6f3977f4a0bf3deb9b5a5a418050`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-09-01 UTC
- **Verdict:** **PASS**

The candidate and current deployment complete the researched audio-finishing job. All declared claims, local gates, live checks, accessibility checks, privacy boundaries, PWA checks, and deployment identity checks pass. No release-blocking defect was found.

## First-read gate

**PASS.** A cold 1440 × 900 visit returned HTTP 200 and answered the required questions in the first viewport:

- What it does: “Add intros and outros to voice tracks.”
- Who it serves: podcasters, radio makers, and course creators who reuse music, loudness, and filenames.
- What to click first: “Try it with sample data,” followed by “Opens three ready-to-render voice tracks.”

The action opens `/demo` in one click with a persistent sample-data notice, Reset demo, Start for real, a complete recipe, and three queued voice tracks. The equivalent first-screen check also passes at 390 × 844.

## Clean candidate and declared claims

A separate clean clone was checked out at the exact candidate SHA. `npm ci --include=dev` installed 65 packages and reported zero known vulnerabilities. `.factory/claims.json` exists with 17 entries.

Every listed command ran independently. Each targeted browser check ran once in desktop Chromium and once at 390 × 844, for 34 passing browser executions.

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

The landing page, legal pages, README, demo guide, and copy audit were checked against the claim ledger. No additional visitor-facing product claim was found without a corresponding check.

## Repository gates

- Confirmed `npm test`: PASS — 14 Vitest checks and 60 Playwright executions across desktop and mobile.
- Confirmed `npm run lint`: PASS — TypeScript `--noEmit`.
- Confirmed `npm run build`: PASS — the exact production command produced `dist/`.
- Confirmed `npm run verify:release`: PASS — product-scoped hosted checkout and production build.
- Confirmed `npm run test:e2e:live`: PASS — 60 current live executions across desktop and mobile.
- Confirmed `/opt/fleet/lib/verify-url.sh`: PASS in 748 ms with no page or console errors, one H1, `lang=en`, a main landmark, complete image alternatives, and labeled buttons.

## End-to-end product QA

The live sample rendered three reviewable WAV outputs with individual downloads, a batch ZIP, and a receipt. The complete suites also confirmed real WAV and MP3 input, 48 kHz WAV, 128 and 192 kbps MP3, receipt fields and source hashes, saved recipes, recipe export/import/delete, and free and Studio limits.

An additional independent live pass completed 23 of 23 checks:

- Confirmed an empty queue keeps rendering unavailable.
- Confirmed a text file states the accepted formats.
- Confirmed a mixed text/WAV selection retains the WAV and reports the skipped file.
- Confirmed empty recipe names, missing `{source}`, and start number `10000` each state the correction.
- Confirmed boundary value `9999` renders a playable `boundary-9999.wav` output.
- Confirmed an unreadable WAV gets a track-level message; removing it and adding a valid WAV completes the batch.
- Confirmed these flows produce no page or console errors.

## Accessibility, responsive behavior, and motion

- Confirmed Axe reports zero serious or critical findings for landing, demo, privacy, terms, and not-found routes in both configured viewports. A separate rendered mobile demo also reports zero.
- Confirmed keyboard-only use reaches Render batch after 29 Tab presses, Enter renders all three tracks, and arrow keys change the bed-level control.
- Confirmed focused controls use a visible 3 px registration-blue outline.
- Confirmed visible controls meet the 44 px target requirement in the browser suite.
- Confirmed no page-level horizontal overflow at 390 px or with root text set to 200%.
- Confirmed reduced-motion mode shortens transition and animation duration to `0.00001s`.
- Confirmed the documented single light treatment meets the automated contrast gate.

## Privacy, response policy, routes, and request allowance

A fresh live demo capture covered loading and a complete render. Every HTTP request used `https://audio-wrapper-batch.sociobot.in`; no analytics, advertising, third-party font, runtime CDN, or audio-upload destination appeared.

The browser document response includes CSP, HSTS, Permissions-Policy, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`. The CSP limits default content to self, prevents framing, and permits only the documented Sociobot billing origin for connections.

Confirmed current caching behavior:

- HTML: `public, must-revalidate, max-age=30`.
- Fingerprinted JavaScript: `public, max-age=31536000, immutable`.
- Service worker: `no-cache, no-store, must-revalidate`.

Confirmed `/`, `/demo`, `/demo/`, `/privacy/`, `/terms/`, manifest, robots, and sitemap return 200. A new unknown path returns the designed 404 response.

The product has no first-party server API. The documented product-scoped license verification route was checked with harmless non-license values from one client. Requests 1–30 returned 200. Request 31 returned 429 with `Retry-After: 2` and `x-ratelimit-after: 2`. The observed allowance is 30 requests per burst, followed by a two-second retry interval.

Wrapline has no sign-in flow. No identity-provider check applies.

## PWA and performance

- Confirmed the manifest uses standalone display, a versioned `/?v=3` start URL, product colors, 192 px and 512 px icons, and a maskable 512 px icon.
- Confirmed the service worker installs at product scope, reaches `activated`, completes `registration.update()`, and uses a versioned cache.
- Confirmed a fresh `/demo` reloads offline, displays the offline notice, retains three sample tracks, and renders three outputs.
- Confirmed the unavailable-service-worker regression produces no page or console error and leaves the demo usable in both viewports.
- Confirmed fresh mobile Lighthouse scores: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.92 s, LCP 1.52 s, total blocking time 0 ms, CLS 0, speed index 0.92 s.

Production size checks:

| Asset | Raw | Gzip / loading |
| --- | ---: | --- |
| Initial JavaScript | 40.72 KB | 13.71 KB gzip |
| CSS | 16.90 KB | 4.48 KB gzip |
| MP3 encoder | 183.46 KB | 86.49 KB gzip; loaded only for MP3 output |
| Hero WebP | 114.02 KB | Preloaded LCP image |
| Fonts | 0 KB | Local system stacks |

The initial JavaScript, CSS, font, hero, LCP, and layout-shift budgets pass.

## Deployment identity

The current live files match the clean candidate build byte for byte:

| File | SHA-256 | Bytes |
| --- | --- | ---: |
| `index.html` | `3446a202ba9a7fddbc909311b2550d66ae0de5cf63d5eb1851c513aaf9c606f4` | 2,634 |
| `sw.js` | `febe5638362b261946e6b4cfb19170c528642c8b238bb9acdd68f9a33343aba9` | 3,176 |
| `assets/index-Brdw30um.js` | `55dddd526faaaf03aeb70cd27490c7f81791dfa141b86b8e66cc2ee739f3ccff` | 40,717 |
| `assets/index-CqVNvYNN.css` | `2530723ed9ea256bd45781853efa518c9079084c3065d2bc2d70f571ef17aab5` | 16,903 |
| `assets/mp3-encode-B02HWg1C.js` | `40cee005f12a775e87de8e081c819a7bf8f9c55e90314fd168f2527ca1232ade` | 183,460 |

The footer reports build `1.0.0-r10`, consistent with the repaired candidate lineage.

## Product fit and findings

The deterministic recipe, portable recipe export, receipt, local storage, and offline sample cover the brief’s repeat-production need. An optional model-assisted feature would not improve the core deterministic audio job, so no missed AI feature was recorded.

### P0

None.

### P1

None.

### P2

None.

### P3

None.

No product source, deployment setting, infrastructure, or external resource was changed during verification. Existing unrelated `graphify-out/` working-tree changes were preserved.
