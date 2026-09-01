# Wrapline perfection loop — polish round 1

Completed 2026-09-01. Source review: `.factory/review-1.md`. No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed at the start of this round.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the H1 with “Add intros and outros to voice tracks,” used the requested audience sentence, added the adjacent sample outcome, and kept all three facts in the 390 px first screen. | `the 390px first screen states the concrete job and sample result`; `.factory/evidence/polish-1/mobile-first-screen.png`; live `.factory/evidence/polish-1/live/screenshot-mobile.png`; live URL `/`. |
| F-1-2 | Added a committed, valid 440 Hz MP3 fixture and render assertions for both a WAV and the real MP3. | `@claim:wav-mp3-input Wrapline offers WAV and MP3 voice input`; `tests/fixtures/synthetic-tone-440hz.mp3`; live claim passed. |
| F-1-3 | Added deterministic PCM-region measurements for unchanged intro/outro level, ±12 dB voice gain cap, 7 dB bed ducking, −0.18 dBFS peak ceiling, 48 kHz rate, and 16-bit WAV output. | `@claim:audio-behavior Loudness, mixing, peak, rate, and bit depth match the disclosure`; clean-clone and live runs passed. |
| F-1-4 | Removed unprovable merchant, refund, card, and broad operational promises. Expanded the ledger to 17 claims for every retained product promise, each with exactly one tagged test. | `.factory/claims.json`; 17 independent clean-clone claim commands passed; `@claim:license-boundary`; `@claim:route-shell`. |
| F-1-5 | Set result download and audio controls to a 44 px minimum target and extended the rendered-state size audit. | `moves focus to main and preserves usable mobile-sized controls`; measured every visible post-render interactive control at 390 px. |
| F-1-6 | Rebuilt the copy audit to include all app states, errors, headings, buttons, labels, options, README prose, legal routes, and terminology. | `.factory/copy-audit.md`; banned-word scan returned no matches in visitor-facing sources, README, or catalog copy. |
| F-1-7 | Replaced “bench,” “wrapper,” “job tickets,” and other product lore in functional copy. Standardized the process verb as render/rendered. | `controls use labels that name their result`; `.factory/copy-audit.md` terminology table; live screenshot. |
| F-1-8 | Added the shared `route-shell.js` navigation handler. Forward and back navigation focus the destination H1 and announce its text through a polite live region. | `route navigation focuses and announces the page heading`; `@claim:route-shell`; both passed locally and live. |
| F-1-9 | Added WAV/MP3 output choice, 128/192 kbps MP3 choice, a lazy bundled encoder, MP3 downloads, browser decoding checks, and receipt codec/bitrate fields. | `@claim:mp3-output MP3 output uses the selected bitrate and remains playable`; `.factory/evidence/polish-1/desktop-demo-mp3.png`; live `/demo`. |
| F-1-10 | Renamed every cited control: Create new recipe, Delete recipe, Verify license, Download receipt JSON, and Install update. Added specific accessible names for file removal controls. | `controls use labels that name their result`; live accessibility suite passed. |

## Controller evidence checklist

- Mobile first-screen clarity: exact wording and 390 × 844 assertion passed.
- MP3/loudness claim tests: real encoded input, two MP3 output bitrates, browser decode, receipt inspection, and deterministic signal measurement passed.
- Unlisted claims: 17-entry ledger audited against live, README, legal, and state copy; every tag occurs once.
- Download target: rendered controls are at least 44 × 44 CSS px.
- Complete copy audit: `.factory/copy-audit.md` covers all requested string groups.
- Route focus: forward and Back focus and announce the H1.
- Labels: all cited controls use result-specific names.
- Actual MP3: each demo file downloaded as a playable MP3 with the selected constant bitrate and 48 kHz header.
- Demo isolation: `@claim:demo-isolation` proves separate databases and discards demo state on exit.
- Routing/legal/404: `@claim:route-shell` checks statuses, titles, metadata, legal links, landmarks, and console state.

## Aggregate evidence

- Clean clone: `npm test` passed 14 unit/integration tests and 58 browser checks; all 17 claim commands then passed separately.
- Live: `npm run test:e2e:live` passed all 58 browser checks after a cold production deployment.
- Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.0 s; CLS 0; TBT 0 ms.
- Verifier: no console errors, one H1, valid title/lang/main, no missing image alt, and no unlabeled buttons.
- Catalog copy: 99 characters, verb-first, and stored in `.factory/catalog-description.txt`.
