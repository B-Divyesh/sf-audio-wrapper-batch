# Independent verification 9 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-9`
- **Candidate:** `81fb4f16c19c25d82745ca5ed2938fc8b8c63487`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Verdict:** **PASS**

## Clean checkout, claim ledger, and gates

A detached clean worktree at the exact candidate SHA (`/tmp/wrapline-verify9-clean`) was clean before `npm ci`. Install added 61 packages with zero reported vulnerabilities.

Every entry in `.factory/claims.json` passed through the demo entry point from that clean worktree. The 14 declared claims executed in both configured Chromium projects, yielding **28/28 passing executions**:

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
| `studio-unlimited` | PASS |
| `license-daily-check` | PASS |
| `recipe-controls` | PASS |

Each declared inner command is `npm run build && npm run test:e2e -- --grep @claim:<id>`; all were also run individually in this verification. The complete clean gate passed:

```text
npm test
  Vitest:     3 files, 14 tests passed
  build:      passed; emitted dist/
  Playwright: 46 tests passed
npm run lint  passed (tsc --noEmit)
npm run build passed
```

## Cold read and live end-to-end QA

A new browser context loaded the live page without stored data. Its first screen says **“Wrap finished voice tracks in batches,”** identifies independent podcasters, radio makers, and course creators, and places **Try it with sample data** visibly beside the real-batch action. One click reaches `/demo` with the persistent demo-isolation banner, Reset demo, Start for real, Signal Desk wrapper audio, and three named tracks.

Desktop and 390 × 844 mobile demo rendering produced three audio players and a “3 WAV files + receipt” download. Error recovery is clear: start number `-1` says “Start number must be a whole number from 0 through 9999”; a text upload says “No supported audio found. Choose WAV or MP3 files.”

A complete live demo-render request log contained only `audio-wrapper-batch.sociobot.in` and local `blob:` URLs. No analytics, uploads, tracking pixels, runtime CDN scripts, or third-party fonts appeared.

## Accessibility, PWA, headers, budgets

- Axe scans of `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown live URL found **0 serious/critical** issues. Each had one H1 and a main landmark; the unknown URL returned the designed HTTP 404. Its expected missing-resource console message was the only error on that route.
- Keyboard Tab focuses the skip link first. Computed focus outline: `rgb(20, 91, 115) solid 3px`; Enter moves focus to `main`. Under reduced motion, transition duration is `0.00001s`.
- The live service worker is activated at product scope; `registration.update()` completed. In a fresh context, offline reload kept the H1, offline notice, cache entries, and all three tracks.
- Live response headers include HSTS, CSP with `frame-ancestors 'none'`, Permissions-Policy, Referrer-Policy, nosniff, and X-Frame-Options. HTML is `no-cache`; fingerprinted JS is `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`.
- Budgets: JS 37,168 bytes / 12.64 kB gzip, CSS 16,681 bytes / 4.43 kB gzip, hero WebP 114,016 bytes, and no font payload.
- Deployment identity matches: live `index-DVv3qtNh.js` SHA-256 `9970bdbec4f9a80a173f49439fd483ee406046e1f697a7af5a6a9a1be7a93574`; live `sw.js` SHA-256 `144d5b51c8d065ecca41b6032ec5681a7cfcdcb2d7f17c1694f2e97054752a70`.

## Defects and scope

No P0, P1, or P2 defect was found.

Wrapline has no first-party server endpoint. The optional license verification and checkout endpoint belongs to the factory billing service, which is outside the explicitly permitted `sf-audio-wrapper-batch` resource boundary. I did not contact it, create a transaction, or probe its rate allowance. The allowance is therefore **not observed in this verification**; this is a scope restriction rather than a product-code failure. Recorded fixtures cover the client-side license contract.

No forbidden service, database, key vault, app setting, or unrelated cloud resource was accessed. No product source was modified.
