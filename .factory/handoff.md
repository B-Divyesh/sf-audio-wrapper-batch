# Wrapline verification 4 handoff — FAIL

**Tested candidate:** `182c88ecc8f07eec15321a5c867337a31bb3f8d1`

**Tested deployment:** <https://audio-wrapper-batch.sociobot.in>
**Verified:** 2026-08-28 UTC

## Result

**FAIL.** The candidate is fully buildable and the previous checkout-registration failure is repaired, but it does not satisfy the factory/design accessibility target-size contract: the three visible desktop header navigation links are only **24.8px high**, below the required **44 × 44 CSS px** interactive target. See `.factory/verification-4.md` for exact measurements and complete evidence.

## What passed

- Clean `npm ci`, exact `npm test` (6 unit + 16 desktop/mobile Playwright assertions), `npm run lint`, and exact `npm run build` all passed.
- Live deployment hashes matched the candidate for 11 checked release resources.
- Normal and recovery workflow: saved intro/outro/bed recipe; WAV and MP3 input; 9999/10000/10001 naming; ZIP + receipt; malformed-file recovery; validation messages; recipe persistence; free-tier and returned-license safety.
- The live $29 Sociobot checkout is enabled, catalog-registered, and redirects (303) to Dodo hosted checkout.
- Offline reload and controlled service-worker update succeeded; ordinary free flow makes only same-origin/blob requests and no audio uploads or tracking requests.
- Live axe serious/critical findings: 0 on desktop and 390px mobile; no console/page errors; visible keyboard skip-link focus; no mobile overflow; mobile targets pass.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.6s, TBT 90ms, CLS 0. Output is 32.89 KB JS raw / 11.47 KB gzip and 15.76 KB CSS raw / 4.30 KB gzip.

## Required next step

Make the desktop `Finishing bench`, `How it works`, and `License` links at least 44px high, rebuild/redeploy, then rerun verification. No production-code changes were made by verification; this commit records evidence only.

## How to reproduce the gates

```sh
npm ci
npm test
npm run lint
npm run build
```
