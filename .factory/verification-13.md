# Independent verification 13 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-13`
- **Candidate:** `f6ceaf317a73066e2f85a88a6e3e4ef4e8209c3b`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-09-02 UTC
- **Verdict:** **PASS**

The candidate is deployed and completes the researched job: it turns multiple finished WAV/MP3 voice tracks into consistently named, reviewable WAV/MP3 batches using a reusable intro, outro, music bed, loudness setting, and receipt. No release-blocking or lower-severity product defect was found.

## First-read and demo gate

**PASS.** A cold 390 × 844 visit returned HTTP 200. The first screen states:

- What it does: “Add intros and outros to voice tracks.”
- For whom: podcasters, radio makers, and course creators who reuse music, loudness, and filenames.
- What to click: “Try it with sample data,” followed by “Opens three ready-to-render voice tracks.”

The action is visible without scrolling and opens `/demo` in one click. The demo shows its “sample data, nothing is saved to your real data” banner, Reset demo, Start for real, a populated recipe, and three ready tracks. Evidence: [`verification-13-first-read.png`](evidence/verification-13-first-read.png).

## Clean candidate and claims

A detached clean worktree at exactly `f6ceaf317a73066e2f85a88a6e3e4ef4e8209c3b` was used at `/tmp/wrapline-qa13-LFfTJn/checkout`. `npm ci` installed 65 packages with zero vulnerabilities. The worktree remained clean after verification.

`.factory/claims.json` exists with 17 entries. Every listed command was run independently against the shipped demo entry point after installation. All 17 commands passed, covering 34 desktop/mobile executions:

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

The landing page, legal pages, README, and copy audit contain no functional claim missing from the manifest.

## Local and production gates

- `npm test`: exit 0; 14/14 Vitest checks, TypeScript, exact production build, and all 62 Playwright cases passed.
- `npm run verify:release`: checkout registration probe, TypeScript, and production build passed.
- `npm run test:e2e:live`: all 62 production desktop/mobile cases passed with no retry.
- `dist/` exists. Build sizes: initial JS 40.60 kB raw / 13.64 kB gzip; CSS 16.90 kB raw / 4.48 kB gzip; lazy MP3 encoder 183.46 kB raw / 86.49 kB gzip.
- One Chromium process segfaulted while launching a clean-worktree route-focus test; Playwright retried it successfully. The same case then passed 2/2 in an immediate isolated rerun, and both the earlier local suite and production suite ran without retries. This was a browser-process event, not a product assertion failure.

## End-to-end and recovery checks

- The demo rendered three playable WAV outputs and a downloadable ZIP/receipt. WAV and committed synthetic MP3 inputs also rendered successfully in the claim suite.
- Both offered MP3 settings, 128 and 192 kbps CBR at 48 kHz, were rendered, decoded, and frame-inspected by the claim test.
- A manual boundary run used start number 9997 and produced three successful outputs numbered through 9999. Evidence: [`verification-13-demo-rendered-desktop.png`](evidence/verification-13-demo-rendered-desktop.png).
- An unsupported text file produced “No supported audio found. Choose WAV or MP3 files.” Start number 10000 produced the documented 0–9999 error. Correcting it to 9997 recovered without reload and rendered 3/3.
- Free limits, valid recorded Studio behavior, invalid/revoked license behavior, recipe export/import/delete, persistence, reset, and demo isolation passed automated end-to-end checks.
- The product has no sign-in flow and no first-party server API. Entra validation is therefore not applicable.
- The brief does not benefit from an AI runtime step. Recipe import/export, receipts, and the requested local batch workflow are present; no missed-leverage finding was identified.

## Privacy, network, and rate limit

A fresh Playwright production `/demo` load, invalid-input recovery, render, service-worker update, offline reload, and second render produced no off-origin HTTP request. Observed traffic was same-origin app/art/asset requests and same-origin `blob:` audio/ZIP URLs. There were no analytics, trackers, CDN fonts/scripts, audio uploads, console errors, or page errors.

The only documented external runtime boundary is the user-triggered, product-scoped Sociobot license verification URL. From one client, harmless invalid-token requests 1–30 returned 200; request 31 returned **429** with `Retry-After: 4`. Observed allowance: **30 requests per burst**. The checkout HEAD probe also confirmed the registered product-scoped hosted checkout.

## PWA and offline behavior

- The manifest has standalone display, versioned start URL, 192/512 icons, and a maskable icon.
- A fresh worker reached `activated`; `registration.update()` completed; the controller stayed active; and a versioned `wrapline-…-static` cache existed.
- After switching the fresh context offline, `/demo` reloaded with the offline notice and all three sample tracks, then rendered all three outputs again.
- The worker is served `no-cache, no-store, must-revalidate`, so update discovery is not blocked. Its waiting-worker path exposes an “Install update” action and uses `SKIP_WAITING` plus `controllerchange` reload.

## Accessibility and responsive use

- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 609 ms load, correct title, `lang=en`, one H1, main landmark, complete image alternatives, labeled buttons, and no errors. Evidence: [`verification-13-url/verify.json`](evidence/verification-13-url/verify.json).
- Playwright Axe reported zero violations, including zero serious/critical findings, across landing, demo, privacy, terms, and not-found routes in desktop and mobile projects.
- Keyboard-only at 390 px reached the sample link on the third Tab, opened the demo with Enter, reached Render batch through the tab order, and activated it with Space. Both actions had a 3 px visible focus outline. Three outputs rendered and no horizontal overflow occurred. Evidence: [`verification-13-keyboard-mobile-render.png`](evidence/verification-13-keyboard-mobile-render.png).
- The skip link focuses main content. Route changes focus and announce the H1. Tested visible controls and downloads meet the 44 px target baseline.
- Reduced-motion emulation matched the media query; transitions/animations reduce to 0.01 ms and the hero transform is removed.
- Desktop and 390 px screenshots were visually reviewed. Copy, controls, queue state, output players, and download actions remain readable and usable.

## Headers, caching, identity, and performance

The browser response includes CSP with `frame-ancestors 'none'`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, Permissions-Policy, and `X-Frame-Options: DENY`. `/` is `no-cache`; `/demo` is revalidated with a 30-second maximum age; fingerprinted JS/CSS are immutable for one year; the worker is no-store. No CSP error occurred.

The locally built candidate and production matched byte-for-byte for **21/21** public artifacts: landing/demo/404/privacy/terms documents, main JS/CSS, lazy encoder, service worker, manifest, offline shell, legal CSS, route script, robots, sitemap, icons, and both art assets. The live footer says `Build 1.0.0-r13`.

Fresh mobile Lighthouse: performance **100**, accessibility **100**, best practices **100**, SEO **100**; FCP 0.9 s, LCP 1.5 s, TBT 0 ms, CLS 0, total transfer 140 KiB, and zero third-party requests. Evidence: [`verification-13-lighthouse.json`](evidence/verification-13-lighthouse.json).

## Findings by severity

### P0

None.

### P1

None.

### P2

None.

### P3

None.

No product code, deployment setting, infrastructure, external data, or out-of-scope resource was modified. Pre-existing unrelated `graphify-out/` working-tree changes were preserved.
