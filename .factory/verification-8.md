# Independent verification 8 — Wrapline

- **Work order:** `audio-wrapper-batch-verify-8`
- **Candidate:** `df27a76efb9ad31c4c913ae62bd02b984ad016bf`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Verdict:** **FAIL — do not accept this candidate.**

The live audio workflow, deployment, accessibility, privacy-by-default render
path, PWA behavior, and performance are strong. Release is blocked because the
required clean `npm test` gate fails reproducibly and the visitor-facing claims
ledger is incomplete. One unlisted privacy promise is also contradicted by the
live behavior.

No forbidden service, database, key vault, app setting, or unrelated cloud
resource was accessed. Verification was limited to this repository, the
`audio-wrapper-batch` deployment, and its product-scoped Sociobot checkout and
license-verification URLs.

## First-read and demo gate

The cold live first screen passes. It says **“Wrap finished voice tracks in
batches,”** names independent podcasters, radio makers, and course creators,
and presents **“Try it with sample data”** as the first action. One click opens
`/demo` with a persistent **“Demo — sample data, nothing is saved to your real
data”** banner, Reset demo, Start for real, the Signal Desk wrapper, and three
named tracks.

The initial cold-page request log contained only the product origin.

## Clean checkout, claims, and repository gates

The supplied workspace already had unrelated modified `graphify-out` files, so
release commands were repeated in a detached clean worktree at the exact SHA:
`/tmp/wrapline-qa8-clean`. `npm ci` installed 61 packages with zero audit
vulnerabilities.

Before broader tests, every command in `.factory/claims.json` was run exactly as
declared from that clean worktree. Each grep ran in both configured Chromium
projects, for 22 passing browser executions:

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

Repository gates:

```text
npm test          FAIL — 10 Vitest assertions passed, 1 timed out; build/e2e not reached
npm run lint      PASS — tsc --noEmit
npm run build     PASS — exact production dist/ emitted
npm run test:e2e  PASS — 40 tests after a fresh exact production build
verify:release    PASS — Studio registered at USD 29, then exact build passed
```

The failing test is `tests/release.test.ts` → **“runs the exact production build
during a checkout-catalog outage.”** It has Vitest's 5,000 ms test limit while
its child `spawnSync` allows 30,000 ms. The clean run timed out at 5,289 ms. The
same required gate failed twice more in the supplied workspace at 5,144 ms and
9,805 ms. A standalone production build completes normally.

## Deployment identity and budgets

The live deployment matches the clean candidate build byte for byte:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `index-DiXxLO4S.js` | 37,192 | `4fed84bc435e7ece53b19f252772470ee032edbfa9246262819964d4be51a5f0` |
| `index-CM7P_j1e.css` | 16,681 | `935b01aa0ee43f346e2b0b7c5c88f9ed059df197937cdf7ea015c0b9c01a2658` |
| `sw.js` | 3,143 | `bb0b70a85587e47793af948f4f8617ab1ad1a744aae731befbeb37220597dd60` |

The hero WebP is 114,016 bytes and there is no font payload. JS, CSS, font, and
hero budgets pass. Independent mobile Lighthouse scores were Performance 95,
Accessibility 100, Best Practices 100, and SEO 100; LCP was 1.5 s and CLS was
0. Evidence is under `.factory/evidence/verification-8/`.

## End-to-end product evidence

- Live `/demo` rendered three tracks to three audio previews and a ZIP with
  three WAV files plus `wrapline-receipt.json`. The first output was 48 kHz,
  16-bit mono PCM, 1.89 seconds, with non-zero intro, voice, and outro segments.
- The receipt contained three SHA-256 source hashes, output names, durations,
  applied gain, limiter state, codec, and the RMS/peak disclosure.
- Start numbers `-1` and `10000`, a filename recipe without `{source}`, a text
  file, and a corrupt WAV all produced specific recovery text. Restoring start
  number `0` rendered the expected `Signal Desk-00-…` output.
- A real 52,079-byte MP3 rendered successfully after the corrupt-WAV failure,
  proving recovery and actual MP3 decoding rather than only the picker label.
- An invalid returned license was removed from the URL, retained only in local
  storage, verified as invalid, and did not activate Studio.
- The scoped checkout returned HTTP 303 to hosted Dodo checkout.

## Browser, accessibility, privacy, and PWA evidence

- The factory `verify-url.sh` passed live: HTTP 200, 689 ms load, no console
  errors, `lang=en`, one H1, main landmark, complete image alt text, and labeled
  buttons.
- Fresh live Axe scans found zero serious/critical violations on `/`, `/demo`,
  `/privacy/`, `/terms/`, and the real 404, on desktop and 390 px mobile.
- At 390 × 844 with reduced motion, document width was exactly 390 px, no
  visible interactive target was below 44 px, and transition duration reduced
  to 0.01 ms.
- Keyboard-only use reached the visible 3 px focus-ring skip link first, moved
  focus to `main`, opened the demo with Enter, reached Render batch without a
  trap, and rendered with Space.
- The full live render and recovery request log used only the product origin
  plus local `blob:` URLs. There were no analytics, uploads, CDN scripts/fonts,
  console errors, or page errors.
- The service worker precache contained byte-bearing HTML, JS, CSS, legal
  pages, icons, and hero art. A fresh installed demo reloaded offline with its
  H1, offline notice, and all three tracks. `registration.update()` completed.
  An isolated response-only worker revision produced a waiting worker, showed
  **“A fresh version is ready,”** and Update now activated it and reloaded.
- Same-origin links returned 200; an unknown route returned the designed page
  with HTTP 404. The product-scoped checkout returned 303.
- Live headers include HSTS, restrictive CSP with `frame-ancestors 'none'`,
  Permissions-Policy, `nosniff`, `X-Frame-Options: DENY`, and strict-origin
  referrer policy. Hashed JS/CSS are immutable for one year; `sw.js` is
  `no-cache, no-store, must-revalidate`.

The product has no first-party backend. Its documented product-scoped license
endpoint allowed 30 invalid verification requests from one client; request 31
returned HTTP 429 with `Retry-After: 3`.

## Defects

### P1 — Required `npm test` gate fails reproducibly

The candidate cannot meet the definition of done while its documented required
test command exits 1. Increase the Vitest timeout for the nested-build test (or
make that test complete below the suite limit), then prove a clean `npm test`
runs the unit, production-build, and all browser stages.

### P1 — Claims ledger is incomplete, and a privacy promise is false as written

`.factory/claims.json` covers its 11 entries, but it does not cover all claims a
visitor can rely on. Examples include the paid promise of unlimited tracks and
saved recipes, exporting a recipe and assets “at any time,” deleting saved
recipes, and several receipt fields. The `studio-license` claim only proves the
price/copy/URL; no claim test proves a valid license activates unlimited batch
and recipe behavior.

More seriously, `/privacy/` says a restored or purchased license token is sent
to the billing API **“at most once per day.”** In the live app, two consecutive
Verify actions generated two product-verification requests because the handler
uses the force-verification path. This is both unlisted and contradicted by
observable behavior. Either qualify the privacy copy to explain manual retries
or enforce the stated limit, then list and test the promise.

The README statement that every visitor-facing promise is declared in
`.factory/claims.json` is therefore also inaccurate. Under the supplied claims
contract, an unlisted claim fails review.

### P2 — The required copy audit is incomplete

`.factory/copy-audit.md` lists only six selected landing sentences, not every
sentence as required. It misses, for example, the 32-word loudness/mixing
sentence in the live landing disclosure, which exceeds the 22-word hard cap.
Complete the extraction and split or rewrite every flagged sentence.

## Re-run after repair

```sh
npm ci
# Run every .factory/claims.json command first.
npm test
npm run lint
npm run build
npm run verify:release
```

Then repeat the claims/copy cross-check, valid-license unlimited-path test,
live render/privacy capture, offline/update checks, Axe, headers, rate limit,
and candidate-to-live hash comparison.
