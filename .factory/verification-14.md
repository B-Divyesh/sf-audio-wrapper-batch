# Independent verification 14 — PASS

**Candidate:** `4629dc3050dc80c8b96c021d7e20e4f5ee963f5b`

**Live URL:** <https://audio-wrapper-batch.sociobot.in>
**Verified:** 2026-09-02 UTC

## Verdict

**PASS.** The deployed PWA matches the candidate and completes the researched job: a podcaster, radio maker, or course creator can reuse an intro, outro, music bed, loudness target, and naming recipe to render several local WAV/MP3 voice tracks, review the outputs, download a batch, and retain a receipt. No release-blocking defect was found.

## Clean candidate gate

A detached clean worktree at `/tmp/wrapline-verify14-clean` was checked out at the exact SHA, had no `git status` output, and used `npm ci` (65 packages installed; audit reported 0 vulnerabilities).

- `npm test`: **PASS** — 14 Vitest assertions, exact production build, and 62 local Playwright desktop/mobile executions.
- `npm run lint`: **PASS** through the exact production build (`tsc --noEmit`).
- `npm run build`: **PASS**; `dist/` produced.
- `npm run verify:release`: **PASS**; verified the registered product-scoped hosted-checkout redirect and rebuilt `dist/`.
- `npm run test:e2e:live`: **PASS** — 62 production desktop/mobile executions.

## Required claim tests

Every command in `.factory/claims.json` was run exactly as declared, from the clean worktree and its local demo entry point. Each test ran in both configured browser projects and passed.

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

## Live experience and product checks

- Cold desktop and 390 × 844 mobile reads plainly answer the required questions: **“Add intros and outros to voice tracks,”** name podcasters/radio makers/course creators, and provide the visible one-click **“Try it with sample data”** action with the result, “Opens three ready-to-render voice tracks.” The action opens the isolated Signal Desk demo.
- The production regression suite exercised normal WAV/MP3 input and WAV/MP3 output, saved recipes, receipts/source hashes, the free limit, the recorded valid-license path, invalid-license recovery, import/export/delete, boundary validation, keyboard controls, and 404/legal routes.
- A fresh live demo render produced three reviewable outputs plus the ZIP/receipt. The claim test request capture found only same-origin HTTP requests during rendering; no audio upload, analytics, tracker, font CDN, or runtime CDN request occurred.
- The PWA worker was active at product scope. `registration.update()` completed with an activated worker and no waiting update; a fresh `/demo` context then reloaded offline with the Signal Desk heading, offline notice, and all three sample tracks. The offline render is covered by `@claim:offline-demo`.
- `/opt/fleet/lib/verify-url.sh` passed for the live root: HTTP 200, no console/page errors, title, `lang=en`, one H1, main landmark, image alternatives, and labeled buttons. Its report and screenshots are in `.factory/evidence/verification-14/`.
- The live suite's Axe scans found zero violations on the tested public routes; independent keyboard smoke at 390 px put the first Tab on the skip link with a `3px` visible focus outline, and Enter moved focus to `#main`. Reduced-motion mode had no active animations and no horizontal overflow (`390/390`).

## Deployment identity, headers, and budgets

- Live `index.html`, `/demo`, service worker, manifest, route shell, privacy, terms, 404, main JS, and CSS SHA-256 values matched the fresh candidate build. Main JS: `1101e88f…e1599da8`; CSS: `4cb42c39…4521d26cc`.
- HTML is `no-cache`; fingerprinted JS/CSS are `public, max-age=31536000, immutable`; the worker is `no-cache, no-store, must-revalidate`. HSTS, restrictive self/Sociobot CSP, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and Permissions-Policy are present. Unknown routes return the designed HTTP 404.
- Initial app JS is 13,731 bytes gzip and CSS is 4,585 bytes gzip; the lazy MP3 encoder is 86,489 bytes gzip. The 114,016-byte hero is below the 300 KB mobile image budget.

## Billing boundary and allowance

Wrapline has no first-party server endpoint and no sign-in flow. Its documented external boundary is the product-scoped Sociobot license verifier. From one client using harmless invalid tokens, requests 1–31 returned `200` with an invalid result; request 32 returned **429** with `Retry-After: 4` and `x-ratelimit-after: 4`. Observed burst allowance: **31 requests** in this fresh run. The registered checkout redirect also passed the repository release check.

## Defects

No P0, P1, P2, or P3 defects found.
