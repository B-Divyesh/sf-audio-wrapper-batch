# Wrapline perfection loop — polish round 2 retry 1

Completed 2026-09-01. Sources read in full: `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/review-2.md`, and the prior `.factory/polish-2.md`. Implementation commit: `81bf403`. Production URL: <https://audio-wrapper-batch.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the concrete H1, audience sentence, three product facts, and adjacent sample outcome inside the 390 × 844 first screen. | `the 390px first screen states the concrete job and sample result`; `.factory/evidence/polish-2-retry1/live/screenshot-mobile.png`; cold live `/`. |
| F-1-2 | Kept the committed real MP3 fixture in the WAV/MP3 render path. | `@claim:wav-mp3-input`; clean-clone claim command passed in `/tmp/wrapline-polish2-retry1-uyqsEy`; live browser suite passed. |
| F-1-3 | Kept deterministic PCM checks for ±12 dB gain, unchanged intro/outro, 7 dB bed ducking, −0.18 dBFS ceiling, 48 kHz, and 16-bit WAV. | `@claim:audio-behavior`; independent clean-clone claim command passed. |
| F-1-4 | Retained 17 ledger entries with one matching tag each, removed the remaining unproved “refunds” topic from Terms metadata, and extended the route regression to reject it. | `.factory/claims.json`; all 17 commands passed independently; `@claim:route-shell`; live `/terms/` contains no refund statement. |
| F-1-5 | Kept rendered links, audio controls, and all visible phone controls at least 44 px. | `moves focus to main and preserves usable mobile-sized controls`; 62/62 live browser checks passed; `.factory/evidence/polish-2-retry1/live/demo-mobile.png`. |
| F-1-6 | Re-audited app states, errors, controls, README, catalog, legal copy, and route metadata. | `.factory/copy-audit.md`; banned-word scan returned no matches; catalog is 102 characters. |
| F-1-7 | Functional copy consistently uses recipe, voice track, music bed, batch, receipt, and render/rendered. | `controls use labels that name their result`; `.factory/copy-audit.md`; cold live `/demo`. |
| F-1-8 | Kept shared forward/Back focus on the H1 and the polite route announcement. | `route navigation focuses and announces the page heading`; live 12-shard suite passed. |
| F-1-9 | Kept on-device WAV/MP3 output, factual 128/192 kbps choices, codec receipt fields, and playable-output checks. | `@claim:mp3-output`; independent clean-clone claim command passed; `.factory/evidence/polish-2-retry1/live/demo-desktop.png`. |
| F-1-10 | Kept result-specific action labels and file-specific accessible names. | `controls use labels that name their result`; Axe-backed route checks and live URL verifier passed. |
| F-2-1 | Kept artwork provenance in repository records only and checked every public footer for the removed visitor claim. | `footer provenance is kept in repository records, not made as a visitor claim`; `@claim:route-shell`; live screenshots. |
| F-2-2 | Kept the option text as the factual “192 kbps,” without a subjective quality adjective. | `footer provenance is kept in repository records, not made as a visitor claim`; `@claim:mp3-output`; live `/demo`. |
| CTRL-2-1 | Rebuilt the browser harness around one worker and one owned preview lifecycle. Each ordinary test uses Playwright’s per-test context; the offline claim alone creates and closes its owned context. The service-worker-unavailable regression now uses an init script instead of Playwright’s Chromium-crashing `serviceWorkers: 'block'` context. Every shard has one automatic browser-crash retry, while the acceptance runs completed without using it. | `scripts/run-e2e.mjs`; `keeps the demo usable without a service-worker registration`; `@claim:offline-demo`; clean-clone and live 12-shard runs both passed 62/62 without retries or SIGSEGV. |

## Verification evidence

- Clean clone: `/tmp/wrapline-polish2-retry1-uyqsEy`, made with `git clone --no-local /work/repo`; `npm ci --include=dev` reported zero vulnerabilities.
- Full clean gate: `npm test` passed 14 unit/integration tests, built `dist/`, and passed 62 browser checks across all 12 shards with one worker.
- Claims: all 17 exact commands in `.factory/claims.json` passed independently from the clean clone; summary: `.factory/evidence/polish-2-retry1/claims-summary.txt`.
- Local verifier: no console errors; title, `lang=en`, one H1, main landmark, image alt text, and button names passed. Local Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.0 s, CLS 0, TBT 0 ms.
- Deployment: `56927a78-8e06-4307-8774-3db60e90e8a5` uploaded the static `dist/` artifact to the existing `sf-audio-wrapper-batch` Static Web App.
- Cold production verifier: HTTP 200, no console errors, and every accessibility smoke check passed. `/`, `/demo`, `/?demo=1`, `/privacy/`, and `/terms/` return 200; an unknown route returns the designed 404.
- Full production browser gate: `npm run test:e2e:live` passed all 62 checks across every shard without retry. Its route check runs Axe on landing, demo, privacy, terms, and not-found pages and found no serious or critical violations.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 20 ms. Evidence lives in `.factory/evidence/polish-2-retry1/live/`.

No review finding, controller finding, or newly discovered claim/copy defect remains open.
