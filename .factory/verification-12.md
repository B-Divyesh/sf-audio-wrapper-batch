# Independent verification 12 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-12`
- **Candidate:** `fc086a11b244b8e3bdc00cd9e37921179abe9b2a`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-09-01 UTC
- **Verdict:** **PASS**

The candidate is deployed and meets the researched brief: it provides a local, recipe-driven batch finishing line for finished WAV/MP3 voice tracks. No release-blocking defect was found.

## First-read and demo gate

**PASS.** A cold desktop visit returned HTTP 200 and the first viewport stated:

- What it does: “Add intros and outros to voice tracks.”
- For whom: podcasters, radio makers, and course creators reusing music, loudness, and filenames.
- What to do first: “Try it with sample data,” with “Opens three ready-to-render voice tracks.”

That link opens `/demo` in one click. At 390 × 844 it shows a persistent “Demo — sample data, nothing is saved to your real data” banner, Reset demo, Start for real, a populated wrapper recipe, and three realistic voice tracks. The 390 px page had no horizontal overflow.

## Clean candidate and claims

A separate detached clean worktree at exactly `fc086a11b244b8e3bdc00cd9e37921179abe9b2a` was used (`/tmp/wrapline-qa-JqhgCy`). `npm ci` installed 65 packages and found zero vulnerabilities.

`.factory/claims.json` exists with 17 entries. Before other verification work, each listed `npm run build && npm run test:e2e -- --grep @claim:<id>` command was run independently through the shipped demo entry point. All passed. A clean-worktree full `npm run test:e2e` then completed with exit code 0.

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

The complete local gate passed: 14/14 Vitest checks, TypeScript lint, exact production build to `dist/`, checkout verification, and the full Playwright suite.

## End-to-end, PWA, privacy, and deployment checks

- Live `/demo` rendered the three sample WAV outputs. A fresh service worker registration reached `activated`, `registration.update()` completed, and the active cache was versioned.
- In a fresh 390 px context, the installed demo reloaded offline with its H1 and three tracks intact, then completed “Render batch” offline. No page or console error occurred.
- A fresh live demo load and render requested only `https://audio-wrapper-batch.sociobot.in` plus same-origin `blob:` preview URLs. No audio upload, analytics, tracker, runtime CDN, or third-party font request was observed.
- The landing response provides CSP, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, Permissions-Policy, and `X-Frame-Options: DENY`. HTML is revalidated; fingerprinted JS/CSS are immutable for one year; the worker is served for update discovery.
- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200 with correct route titles. An unknown URL returned the designed 404 with HTTP 404.
- The product has no first-party server API. On its documented product-scoped license verifier, requests 1–30 with harmless invalid tokens returned 200; request 31 returned `429` with `Retry-After: 0` and `x-ratelimit-after: 0`. Observed allowance: 30-request burst. There is no sign-in flow.
- Live candidate identity matched byte-for-byte for `index.html`, `demo/index.html`, main JS/CSS, lazy MP3 encoder, service worker, route shell, and manifest. Footer build ID: `1.0.0-r12`.

## Accessibility and performance

`verify-url.sh` passed: HTTP 200, no landing-page errors, a title, `lang=en`, one H1, main landmark, complete image alternatives, and labeled buttons. Keyboard focus begins at the visible skip link (3 px solid outline). Axe found zero serious or critical violations on landing, demo, privacy, terms, and not-found routes at mobile width. Reduced-motion media was honored by the live page.

Fresh live mobile Lighthouse: performance **93**, accessibility **100**, best practices **100**, SEO **100**; LCP 1.5 s, CLS 0, total transfer 140 KiB. Candidate build sizes: initial JS 40.61 kB raw / 13.65 kB gzip; CSS 16.90 kB raw / 4.48 kB gzip; lazy MP3 encoder 183.46 kB raw / 86.49 kB gzip.

## Findings

### P0

None.

### P1

None.

### P2

None.

### P3

- The demo banner is an `<aside role="status">`, which Axe flags as the minor `aria-allowed-role` advisory. Use a neutral element with `role="status"`, or retain the `aside` without that role. This does not produce a serious/critical accessibility finding and is not release-blocking.

No product code, deployment setting, infrastructure, or external resource was modified during verification. Existing unrelated `graphify-out/` working-tree changes were preserved.
