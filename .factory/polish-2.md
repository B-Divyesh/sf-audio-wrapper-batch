# Wrapline perfection loop — polish round 2

Completed 2026-09-01. Source reviews: `.factory/review-1.md` and `.factory/review-2.md`; prior repair record: `.factory/polish-1.md`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the vague first-screen copy with the concrete intro/outro job, named the audience, and stated that the sample opens three ready-to-render tracks. | `the 390px first screen states the concrete job and sample result`; live `/` at 390 × 844 passed; `evidence/polish-2/live/screenshot-mobile.png`. |
| F-1-2 | Added and rendered a committed real MP3 fixture alongside WAV input. | `@claim:wav-mp3-input`; every ledger command passed from clean clone `/tmp/wrapline-polish-2.cors07`. |
| F-1-3 | Measured gain cap, unchanged wrapper levels, bed ducking, peak ceiling, WAV rate, and bit depth with deterministic fixture regions. | `@claim:audio-behavior`; clean-clone claim command passed. |
| F-1-4 | Removed unprovable billing and operations copy; retained visitor promises are declared in the 17-entry ledger with one tagged test each. | Every command in `.factory/claims.json` passed serially from the clean clone. |
| F-1-5 | Set rendered controls to a 44 px minimum and measure result-state controls at phone width. | `moves focus to main and preserves usable mobile-sized controls`; live full browser suite passed. |
| F-1-6 | Audited app, README, legal, state, error, heading, control, and option copy, then updated the round marker and bitrate entries. | `.factory/copy-audit.md`; clean-clone `npm test` passed. |
| F-1-7 | Replaced functional metaphor/lore labels and standardized processing language as render/rendered. | `.factory/copy-audit.md` terminology table; live `/` and `/demo` checks passed. |
| F-1-8 | Added route focus and a polite heading announcement for forward and Back navigation. | `route navigation focuses and announces the page heading`; live full browser suite passed. |
| F-1-9 | Added local WAV/MP3 output, 128/192 kbps encoding, receipt fields, and playable output checks. | `@claim:mp3-output`; clean-clone claim command passed. |
| F-1-10 | Renamed generic controls to result-specific actions and retained specific accessible names for removal controls. | `controls use labels that name their result`; live Axe-backed suite passed. |
| F-2-1 | Removed the footer statement “Bench artwork generated for Wrapline with Azure AI Foundry.” Provenance remains in `.factory/design.md` and original asset sidecars, where it is documentation rather than a visitor claim. Added a browser regression covering every public footer. | `footer provenance is kept in repository records, not made as a visitor claim`; live `/`, `/demo`, `/privacy/`, `/terms/`, and 404 route-shell assertions passed; `evidence/polish-2/live/screenshot-desktop.png`. |
| F-2-2 | Replaced “192 kbps · higher quality” with the factual label “192 kbps”; 128 kbps is likewise bitrate-only. | Same browser regression checks exact option text; `@claim:mp3-output` proves selected bitrate and playability from the clean clone. |

## Release evidence

- Clean clone: `/tmp/wrapline-polish-2.cors07` was made with `git clone --no-local /work/repo`; `npm ci --include=dev`, `npm test`, and all 17 exact `.factory/claims.json` commands passed. The full suite contains 14 unit/integration tests and 58 browser checks across desktop and mobile.
- Live cold check: `https://audio-wrapper-batch.sociobot.in/` returned 200. `verify-url.sh` found title, `lang=en`, one H1, main landmark, no missing image alt text, no unlabeled buttons, and no console errors. Screenshots and JSON are in `.factory/evidence/polish-2/live/`.
- Live browser check: `npm run test:e2e:live` passed all 58 checks across desktop and mobile after deployment. Its route-shell test uses Axe and found no serious or critical violations on landing, demo, privacy, terms, and not-found routes.
- Lighthouse on the live cold page: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms. Report: `.factory/evidence/polish-2/live/lighthouse.json`.
