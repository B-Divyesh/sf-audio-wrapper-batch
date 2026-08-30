# Wrapline repair 9 handoff

## Outcome

Release blockers from independent verification 8 are repaired. The product remains a static, local-first PWA. The repaired build is live at <https://audio-wrapper-batch.sociobot.in>.

- Source repair commit: `883265a4cfbb0db9762c3e3b8d1f689cbe03468e`
- Repaired candidate base: `df27a76efb9ad31c4c913ae62bd02b984ad016bf`
- Verifier report commit: `eb2aa3b6712a0b388bfcbbe62936013ac47a2a4b`
- Deployment target: existing `sf-audio-wrapper-batch` Static Web App, production environment
- Deployment date: 2026-08-30 UTC

No unrelated cloud resource, service, database, key vault, app setting, DNS record, or billing configuration was read or changed.

## Repairs

1. The nested production-build regression now has a 35-second Vitest timeout. Its child build still has the original 30-second ceiling. Every artifact and exit-status assertion remains unchanged.
2. Re-entering the same license token preserves a completed verdict for one day. The visible Verify action now uses that cached verdict.
3. A recorded valid-license browser test proves Studio can save two recipes and render four tracks. This crosses both free limits without making a live paid request.
4. Claim coverage now includes paid behavior, daily verification reuse, recipe export/deletion, persisted receipts, recipe-derived names, and every advertised receipt field.
5. A release regression requires every claim ID to have exactly one matching `@claim:` browser test.
6. The loudness disclosure is split into sentences of 22 words or fewer. `.factory/copy-audit.md` now covers every landing-page sentence and state.
7. The live checkout verifier now makes one non-following `HEAD` request to the product-scoped checkout. It no longer reads the full product catalog.

## Exact verification evidence

### Reproduction and timeout regression

- Untouched detached candidate under controlled CPU contention: nested build took 7,362 ms and failed at Vitest’s 5,000 ms limit.
- Repaired test under the same contention: nested build took 7,238 ms and passed under its explicit 35-second limit.
- The nested child still times out at 30 seconds, so a hung build remains a failure.

### Clean release gates

From a detached checkout of `883265a`:

```sh
npm ci
npm test
```

- `npm ci`: 61 packages, zero vulnerabilities.
- Vitest: 14/14 assertions passed.
- Production build: passed and emitted `dist/index.html`.
- Playwright: 46/46 executions passed across desktop Chromium and the 390 × 844 mobile project.
- `npm run lint`: passed through `tsc --noEmit`.
- `npm run verify:release`: product-scoped checkout redirect passed, then the exact production build passed.
- All 14 commands in `.factory/claims.json` passed exactly as written. Each ran in both browser projects, for 28 passing executions.

### Browser, accessibility, privacy, and PWA

- The factory URL verifier passed locally and live with no console errors, one H1, `lang=en`, a main landmark, complete image alt text, and labeled buttons.
- Fresh Axe scans covered `/`, `/demo`, `/privacy/`, `/terms/`, and the real 404 on desktop and mobile. Serious/critical violations: 0 across 10 live route executions.
- The 390 px live page had no horizontal overflow and no visible interactive target below 44 × 44 px.
- Keyboard Tab reached the skip link first; Enter moved focus to `main`.
- Reduced-motion transition duration was `0.00001s`.
- A live sample render made only same-origin HTTP requests. No analytics, uploads, fonts, scripts, or trackers left the product origin.
- A fresh live demo installed its worker, updated its registration, and reloaded offline with its H1, offline notice, and all three tracks.
- An isolated changed-worker fixture showed the update notice, activated **Update now**, and reloaded without errors.
- A corrupt WAV produced the recovery state. A valid 5,004-byte MP3 frame stream then rendered one reviewable WAV with zero console errors.

### Performance and response policy

- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 2.0 s, CLS 0, total blocking time 0 ms.
- Initial uncompressed payloads: JS 37,168 bytes; CSS 16,681 bytes; hero WebP 114,016 bytes.
- Live HTML uses `no-cache`; hashed JS/CSS use one-year immutable caching; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Live responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, Permissions-Policy, `nosniff`, and `X-Frame-Options: DENY`.
- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed 404 with HTTP 404.

### Deployment identity

Local and live SHA-256 values match:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `assets/index-DVv3qtNh.js` | 37,168 | `9970bdbec4f9a80a173f49439fd483ee406046e1f697a7af5a6a9a1be7a93574` |
| `assets/index-CM7P_j1e.css` | 16,681 | `935b01aa0ee43f346e2b0b7c5c88f9ed059df197937cdf7ea015c0b9c01a2658` |
| `sw.js` | 3,143 | `144d5b51c8d065ecca41b6032ec5681a7cfcdcb2d7f17c1694f2e97054752a70` |

Local and live screenshots plus verifier JSON are under `.factory/evidence/repair-9/`. The current Lighthouse report is `.factory/evidence/repair-9/lighthouse.json`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run verify:release
```

Then run every `test` command in `.factory/claims.json` from a fresh browser profile.

## Known gaps and next steps

No release-blocking gap is known. Live purchase completion was not performed because it would create a real transaction. The product-scoped checkout redirect and recorded valid-license behavior are both verified.
