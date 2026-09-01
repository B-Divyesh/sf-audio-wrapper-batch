# Wrapline polish round 1 handoff

## Outcome

PASS. Findings F-1-1 through F-1-10 in `.factory/review-1.md` are resolved. The deployed product completes the brief workflow with WAV or MP3 input and genuine WAV or MP3 output. No finding is deferred.

Live URL: <https://audio-wrapper-batch.sociobot.in>

Verified product commit: `653c59f` (the later handoff commit contains documentation and evidence only).

## What changed

- Replaced the first-screen metaphor with the exact audio job, audience, sample outcome, and three tested facts.
- Kept the risograph audio-bench identity while making the 390 px first screen readable and actionable.
- Added one-click `/demo` and `?demo=1` sample entry, a persistent demo banner, reset, and a clean return to real data.
- Added bundled on-device MP3 encoding at 128 or 192 kbps. Receipts now record codec and bitrate.
- Added a real MP3 input fixture and deterministic audio measurements for gain limits, unchanged intro/outro level, 7 dB bed ducking, peak ceiling, sample rate, and bit depth.
- Expanded `.factory/claims.json` to 17 observable claims with exactly one tagged test per claim.
- Rewrote unclear labels and metaphorical interface copy. `.factory/copy-audit.md` now inventories app, README, legal, state, error, heading, button, option, and label text.
- Added route-specific titles and metadata, real route/404 policy, shared legal links, route focus, and polite announcements.
- Raised rendered download controls and audio controls to at least 44 px.
- Added third-party encoder notices and recorded its provenance in the design thesis.

## Verification

Fresh clone `/tmp/wrapline-verified-clean-D65wef`:

- `npm ci`: 0 vulnerabilities.
- `npm test`: 14 Vitest tests and 58 Playwright checks passed across desktop Chromium and a 390 × 844 mobile viewport.
- Every command in `.factory/claims.json` was then run separately: 17 of 17 passed in desktop and mobile projects.
- `npm run build`: passed; `dist/` contains the production app.
- Production bundle: 13.70 kB gzip initial JS, 4.48 kB gzip CSS, and an 86.49 kB gzip MP3 encoder loaded only when MP3 output is chosen.

Local browser evidence:

- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100.
- LCP 2.0 s, CLS 0, total blocking time 0 ms.
- `verify-url.sh`: title present, `lang=en`, one H1, main landmark present, no missing alt text, no unlabeled buttons, and no console errors.
- Reports and screenshots: `.factory/evidence/polish-1/`.

Post-deploy evidence:

- Cold GET returned 200 with title `Wrapline — add intros and outros to audio` and bundle `index-VokUFUn6.js`.
- `npm run test:e2e:live`: all 58 checks passed against the public URL in fresh desktop and mobile browser processes.
- Live `verify-url.sh`: 559 ms load, one H1, `lang=en`, main landmark present, no missing alt text, no unlabeled buttons, and no console errors.
- Live screenshots and verifier output: `.factory/evidence/polish-1/live/`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e:live
```

To exercise one claim, use its exact command from `.factory/claims.json`.

## Deployment and resource boundary

The `dist/` artifact was deployed to the production `sf-audio-wrapper-batch` Static Web App using only that app's deployment token. No shared database, key vault, DNS zone, other service settings, or unrelated Azure resource was read or changed. The external checkout was not opened; its product-scoped URL, price copy, and recorded license responses are covered without leaving the allowed boundary.

## Known gaps

None within the requested product scope.
