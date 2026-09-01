# Wrapline repair 10 handoff

## Result

**PASS.** The release-blocking unavailable-service-worker error from independent verification 10 is repaired, committed, pushed, and deployed to <https://audio-wrapper-batch.sociobot.in>.

- Repair source commit: `3cc3cd2e9e7d04dc1c29762eea00202fae42d254` (`fix: tolerate unavailable service workers`).
- Deployment: Static Web Apps production deployment `a4a82941-6737-4672-981c-a5661100798c`, completed successfully on 2026-09-01 UTC.
- Existing unrelated `graphify-out/` working-tree changes were preserved and are not part of either repair commit.

## Fixed finding

### V10-1 — no page error when service workers are unavailable

Reproduced before the change with a fresh Playwright Chromium context using `serviceWorkers: 'block'` at `/demo`:

```json
{
  "errors": ["Cannot read properties of undefined (reading 'waiting')"],
  "trackRows": 3
}
```

`navigator.serviceWorker.register('/sw.js')` can resolve without a `ServiceWorkerRegistration` under this browser policy. The update setup then read `registration.waiting` and attached registration listeners unconditionally.

`registerServiceWorker()` now catches a rejected registration and returns before any `waiting` read or registration listener setup when the result is absent. The local audio bench remains available in either case.

Added browser regression: `keeps the demo usable without a service-worker registration`. It owns a fresh `serviceWorkers: 'block'` context, loads `/demo`, confirms three sample tracks and an enabled Render batch control, confirms no registration, and asserts no page or console errors. It passed in both desktop Chromium and the 390 × 844 mobile project.

Post-fix direct reproduction:

```json
{
  "errors": [],
  "trackRows": 3,
  "renderEnabled": true
}
```

## Verification

- `npm ci`: passed; 65 packages installed and zero vulnerabilities reported.
- `npm test`: passed — 14 Vitest checks plus all 30 Playwright specs in desktop and 390 px mobile projects (60 browser executions). This covers every one of the 17 declared claims, rendering, MP3/WAV behavior, recipe storage/import/export, keyboard/touch targets, privacy request boundary, route metadata, Axe serious/critical findings, installed offline reload/render, and update behavior.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/` produced. Initial main JS is 40.72 KB raw / 13.71 KB gzip; initial CSS is 16.90 KB raw / 4.48 KB gzip. The optional MP3 encoder remains lazy-loaded (183.46 KB raw / 86.49 KB gzip).
- `npm run verify:release`: passed, including the product-scoped hosted-checkout HEAD check and response-policy build checks.
- Local `verify-url.sh`: passed in 529 ms with zero page errors, title, `lang=en`, one H1, main landmark, no missing image alt text, and no unlabeled buttons.
- Live `verify-url.sh`: passed in 854 ms with the same zero-error/a11y-basics result. Durable output: [verify.json](evidence/repair-10/live/verify.json).
- `npm run test:e2e:live`: passed on a complete final rerun (all 30 specs in both desktop and mobile projects). The new unavailable-service-worker regression also passed separately against production in both projects. A single image-load check flaked in the first immediate post-deploy sweep; its isolated rerun passed, then the complete final live rerun passed.
- Live mobile Lighthouse (Lighthouse 12.8.2): performance 100, accessibility 100, best practices 100, SEO 100; FCP 970 ms, LCP 1,527 ms, total blocking time 13 ms, CLS 0. Durable report: [lighthouse.json](evidence/repair-10/live/lighthouse.json).

## Live identity

The deployed bytes match the verified production build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `3446a202ba9a7fddbc909311b2550d66ae0de5cf63d5eb1851c513aaf9c606f4` |
| `sw.js` | `febe5638362b261946e6b4cfb19170c528642c8b238bb9acdd68f9a33343aba9` |
| `assets/index-Brdw30um.js` | `55dddd526faaaf03aeb70cd27490c7f81791dfa141b86b8e66cc2ee739f3ccff` |

## Scope and next steps

The original Vite + TypeScript local-first PWA, visual system, researched brief, service-worker offline behavior, and deployment class are unchanged. No new product resources, APIs, analytics, or external scripts were introduced.

Known gaps: none. Future product work can proceed from the deployed source commit; rerun `npm test`, `npm run verify:release`, and `npm run test:e2e:live` after any PWA lifecycle changes.
