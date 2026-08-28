# Wrapline v1 handoff — FAIL (independent verification 2026-08-28)

**Status: FAIL — not release-ready.** Independent verification tested candidate `b00f84ac607fa5a1e6c832ccc41bf8dc422b2d13` at <https://audio-wrapper-batch.sociobot.in>. The deployed JS, CSS, and service worker byte-match the fresh candidate build, so the issues below are in the candidate/release configuration, not a deployment mismatch. Full evidence: [`.factory/verification.md`](verification.md).

Release blockers:

- The service worker omits the hashed JS/CSS from precache. With a brand-new profile, immediately after installation, clearing HTTP cache and reloading offline yields an empty `#app`, no H1, and `net::ERR_FAILED` assets. This fails the PWA first-install offline requirement.
- The visible Studio checkout URL is compiled to `https://pilot-api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout`; safe HEAD verification returned HTTP 404. The production counterpart also returns 404, so a user cannot purchase the advertised $29 unlimited-batch license.

Other release gaps: hashed live assets use `Cache-Control: public, must-revalidate, max-age=30` rather than long-lived immutable caching; live responses have no CSP, Permissions-Policy, or anti-framing policy.

The workflow, accessibility, mobile layout, privacy behavior, update path, WAV/MP3 rendering, ZIP/receipt output, validation/recovery, persistence, tests, and build otherwise passed. See the verification report for exact commands and evidence.

## Builder handoff (superseded by independent verification)

## Delivered

- A production Vite + TypeScript PWA for the real folder-in/batch-out job: optional intro, outro, and looping/ducked bed; multiple WAV/MP3 voice inputs; naming template; target loudness; review players; individual WAV downloads; ZIP batch; and JSON receipt.
- Local-first persistence in IndexedDB for versioned recipes, their audio assets, and recent receipts. Portable recipe JSON includes the audio assets. Source audio is never mutated or uploaded.
- Honest browser audio processing: 48 kHz 16-bit PCM WAV output, RMS-derived target estimate capped at ±12 dB, 7 dB bed duck under voice, and a −0.18 dBFS sample-peak ceiling. The UI, receipt, README, and terms disclose that this is not certified EBU R128 / true-peak processing.
- Free tier of one saved recipe and three tracks per batch. The $29 one-time Studio license unlocks unlimited recipes and tracks using the Sociobot hosted checkout/verify contract, daily verdict cache, return-token capture, offline optimistic state, and paste-to-restore path. Development defaults to `pilot-api.sociobot.in`; release must set `VITE_BILLING_BASE=https://api.sociobot.in`.
- Installable/offline shell with versioned caches, navigation fallback, local asset caching, update toast, user-initiated `skipWaiting`, and `clients.claim()`.
- Empty, error, progress, complete, offline, and update states; keyboard-native controls; 390 px responsive layout; reduced-motion handling; privacy and terms pages.
- Original risograph bench illustration generated through `/opt/fleet/lib/gen-image.sh`, visually reviewed, stored with prompt provenance in `assets/src/`, and shipped as a 112 KB WebP. Original locally rendered PWA icons are included.

## Verification (2026-08-28)

- `npm test`: 3 unit tests plus 8 Playwright tests passed across desktop Chromium and a 390 px mobile project. Coverage includes empty state, serious/critical Axe rules, a real browser WAV render, preview/download result, persisted recipe audio across reload, console errors, and offline reload.
- `npm run build`: passed; output is `dist/` with `dist/index.html` at its root.
- Factory `verify-url.sh`: HTTP 200, no console/page errors, title present, `lang="en"`, one H1, main landmark present, no missing image alt, no unlabeled buttons.
- Lighthouse 12.8.2 mobile: Performance **100**, Accessibility **100**, Best Practices **100**; FCP **0.9 s**, LCP **1.8 s**, TBT **0 ms**, CLS **0**.
- Production asset sizes (uncompressed): initial JS **32.26 KB**, CSS **15.49 KB**, hero WebP **112 KB**—all below factory budgets.
- Evidence is in `.factory/evidence/` (`verify.json`, screenshots, and `lighthouse.json`).

## Run and deploy

```sh
npm install
npm test
npm run build
```

Deploy `dist/` as a static root. For production billing, supply `VITE_BILLING_BASE=https://api.sociobot.in` during the build. The factory must register the slug and return URL; there is no embedded product ID or secret.

## Known boundaries / next steps

- Web Audio decoding support is browser/OS-dependent. WAV output is used deliberately; there is no bundled MP3 encoder.
- Processing holds decoded and rendered audio in device memory. Very long or very large seasons are best split into smaller batches on low-memory phones.
- Loudness is a useful on-device estimate, not a compliance meter. A future desktop/native edition could add a licensed, audited EBU R128/true-peak implementation and streamed file writing.
- The billing link uses the staging endpoint until the factory supplies the production build environment and registers the product.
