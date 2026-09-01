# Adversarial first-read review 3 — Wrapline

**Reviewed:** 2026-09-01 UTC  
**Live URL:** <https://audio-wrapper-batch.sociobot.in>  
**Clean clone:** `/tmp/wrapline-review-3-OHKyyl`

## Verdict: FAIL

The product is clear and tryable, and all declared claims pass. Two minor findings remain. This review requires zero findings for PASS, so the verdict is **FAIL**.

## Cold first read

Fresh browser contexts had no stored site data.

| Viewport | What it does before scrolling | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 1440 × 900 | Adds a repeated intro, outro, music, loudness, and filename setup to voice tracks, then renders WAV or MP3. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Confirmed. |
| 390 × 844 | Adds intros and outros to voice tracks while keeping music, loudness, and filenames consistent. | Podcasters, radio makers, and course creators. | **Try it with sample data**; it says it opens three ready-to-render tracks. | Confirmed. |

The first phone screen says “Add intros and outros to voice tracks”; “For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks.”; and “Opens three ready-to-render voice tracks.” The action note ends within 844 px. No cold-read clarity finding applies.

## Findings

### F-3-1 — Minor — Demo banner uses an invalid ARIA role

**Location/quote:** `/demo`: `<aside class="demo-banner" role="status">`.

**Check:** A fresh live 390 px Axe scan reports `aria-allowed-role` (minor) on that element: “ARIA role should be appropriate for the element.”

**Why a visitor is affected:** The persistent demo state notice has invalid semantics, leaving a known accessibility defect on the product’s first usable screen.

**Concrete fix:** Use `<div class="demo-banner" role="status">`, or keep the `aside` and put a valid nested status element around the announced text. Add an Axe assertion for zero violations, rather than only zero serious/critical violations.

### F-3-2 — Minor — Privacy page makes an unlisted future promise

**Location/quote:** `/privacy/`, Contact: “This policy will be updated if Wrapline’s data behavior changes.”

**Why a visitor is affected:** This is a promise about future data-policy behavior. It has no `.factory/claims.json` entry or observable sandbox test, despite the claim rule for visitor-facing claim-like statements.

**Concrete fix:** Remove the sentence. If it must remain, define a public versioning artifact and a reproducible check before presenting it as a promise.

## Copy audit

Counts treat a hyphenated term, number, and placeholder as one word. No landing or README sentence exceeds 22 words. No jargon, marketing adjective, inconsistent product term, mood heading, or non-result-naming button was found. The full source inventory, including error and legal copy, is in `.factory/copy-audit.md`.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Intros and outros for many tracks | 5 | Literal context heading. |
| Add intros and outros to voice tracks | 7 | Plain H1. |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 | Clear audience/outcome. |
| Opens three ready-to-render voice tracks. | 5 | `demo-sample-data`. |
| WAV and MP3 input | 4 | `wav-mp3-input`. |
| WAV or MP3 output | 5 | Output claims. |
| Audio stays on this device | 6 | `local-audio`. |
| Intro, voice, outro, and bed. | 5 | Concrete process caption. |
| Choose the added audio once, then review and download each rendered batch. | 12 | Clear process. |
| Used in filenames and receipts. | 5 | Clear label help. |
| Added to the queue next. | 6 | Clear sequence. |
| Choose WAV for editing or MP3 for publishing. | 8 | Clear output guidance. |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 | `audio-behavior`. |
| Intro and outro files keep their original level. | 8 | `audio-behavior`. |
| The music bed drops by 7 dB under voice. | 9 | `audio-behavior`. |
| Sample peaks stay below −0.18 dBFS. | 6 | `audio-behavior`. |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | Useful limit. |
| WAV output is 48 kHz, 16-bit PCM. | 7 | `audio-behavior`. |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 | `mp3-output`. |
| Added voice tracks appear here. | 5 | Clear empty state. |
| Add WAV or MP3 files to begin. | 7 | Clear next action. |
| Free batches include up to 3 tracks. | 7 | `free-tier`. |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | `source-receipt`. |
| No batches rendered on this device yet. | 7 | Clear empty state. |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 | Clear method. |
| Every source gets a predictable output name and an audio player after rendering. | 12 | Output claims. |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 | Output claims. |
| The free tier saves one recipe and renders three tracks per batch. | 12 | `free-tier`. |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on your devices. | 12 | Studio claims. |
| Add intros, outros, and music to many voice tracks. | 9 | Clear footer description. |
| You’re offline. | 2 | `offline-demo`. |
| Local audio processing still works; license checks will resume later. | 10 | `offline-demo`. |
| Demo — sample data, nothing is saved to your real data. | 10 | `demo-isolation`. |
| Three short sample tracks are ready to render. | 8 | `demo-sample-data`. |
| A fresh version is ready. | 5 | Clear update state. |

Headings are literal: **Save intro, outro, bed, and filename**, **Audio recipe**, **Voice queue**, **Recent receipts**, **Create a finished batch in three steps**, and **Remove batch and recipe limits**. Actions name results: **Try it with sample data**, **Open the sample batch**, **Set up a real batch**, **Save recipe**, **Render batch**, **Download WAV**, **Download MP3**, **Download batch ZIP**, **Reset demo**, **Start for real**, **Create new recipe**, **Export recipe JSON**, **Import recipe JSON**, **Delete recipe**, **Buy studio license · $29**, and **Verify license**.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 | `wav-mp3-input`. |
| Render each batch as WAV or MP3 without uploading audio. | 10 | Output/privacy claims. |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 | Clear audience. |
| Try it with sample data opens three ready-to-render voice tracks at `/demo`. | 11 | `demo-sample-data`. |
| The same isolated sample opens at `/?demo=1`. | 7 | `demo-sample-data`. |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 | `demo-isolation`. |
| The demo never reads or changes real Wrapline data. | 9 | `demo-isolation`. |
| Reset demo clears and reloads the sample. | 7 | `demo-sample-data`. |
| Start for real clears the demo namespace and opens an empty setup. | 11 | `demo-isolation`. |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 | Documentation pointer. |
| Accepts WAV and MP3 voice tracks. | 6 | `wav-mp3-input`. |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 | Audio/recipe checks. |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 | `audio-behavior`, `mp3-output`. |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 | `wav-receipt`. |
| Stores recipes, added audio, receipts, and license state in this browser. | 11 | Storage checks. |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 | `recipe-controls`. |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 | `local-audio`. |
| Reloads the installed demo offline after its first visit. | 9 | `offline-demo`. |
| Saves one recipe and renders three tracks per batch for free. | 11 | `free-tier`. |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 | Studio claims. |
| Open the printed local URL. | 5 | Direct instruction. |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 | Direct instruction. |
| Deploy `dist/` as the static output. | 6 | Direct instruction. |
| Wrapline uses the browser Web Audio API. | 7 | Implementation disclosure. |
| Browser and operating-system codec support can vary. | 7 | Useful limit. |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 | `audio-behavior`. |
| Intro and outro levels remain unchanged. | 6 | `audio-behavior`. |
| The music bed drops 7 dB under voice. | 8 | `audio-behavior`. |
| Sample peaks remain below −0.18 dBFS. | 6 | `audio-behavior`. |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 | Useful limit. |
| Review each rendered track before publishing. | 6 | Direct instruction. |
| MP3 output uses the bundled `@audio/encode-mp3` encoder. | 7 | `mp3-output`. |
| See `THIRD_PARTY_NOTICES.md` for provenance and licenses. | 7 | Documentation pointer. |
| Wrapline is licensed under the MIT License. | 7 | License fact. |
| See `LICENSE`. | 2 | Documentation pointer. |

README headings—**Wrapline**, **Try it safely**, **What it does**, **Run locally**, **Test and build**, **Audio behavior**, and **Privacy and legal**—name their sections.

## Demo, claims, and sandbox checks

- One click opens `/demo`. Its initial screen contains the Signal Desk recipe, named intro/outro/music-bed files, three named voice tracks, active controls, and the persistent demo notice.
- **Reset demo** restores the sample. **Start for real** deletes demo state and opens `/`. The clean-clone isolation test confirms real storage remains separate.
- A complete live demo render produced three output areas and a batch download without console errors. The declared request-log test records only same-origin HTTP requests; previews use `blob:` URLs.
- No AI addition is implied by this deterministic local audio assembly job. The brief’s useful leverage—recipe import/export, receipts, and WAV/MP3 delivery—is present.
- `npm ci --include=dev`, `npm run build`, and `npm test` passed in the clean clone. All 17 exact claim commands passed independently: `demo-sample-data`, `demo-isolation`, `local-audio`, `offline-demo`, `wav-mp3-input`, `wav-receipt`, `mp3-output`, `audio-behavior`, `source-receipt`, `local-recipes`, `free-tier`, `studio-license`, `studio-unlimited`, `license-daily-check`, `license-boundary`, `recipe-controls`, and `route-shell`.
- Each claim tag occurs once. `npm run test:e2e:live` passed in desktop and 390 px projects.

## History recheck

| Earlier finding | Current check |
| --- | --- |
| F-1-1 | Fixed: the 390 px first screen states concrete job, audience, and sample result. |
| F-1-2 | Fixed: the committed real MP3 fixture renders with WAV input. |
| F-1-3 | Fixed: deterministic checks cover disclosed mixing, gain, peak, sample rate, and bit depth. |
| F-1-4 | Fixed: retained operational claims are ledger entries; visitor artwork provenance was removed. |
| F-1-5 | Fixed: rendered controls meet the 44 px test. |
| F-1-6 | Fixed: the copy audit covers app, README, legal, states, errors, headings, and controls. |
| F-1-7 | Fixed: functional copy uses recipe, voice track, music bed, batch, receipt, and render consistently. |
| F-1-8 | Fixed: forward navigation and Back focus and announce the H1. |
| F-1-9 | Fixed: WAV and selected-bitrate MP3 delivery pass. |
| F-1-10 | Fixed: controls name their result. |
| F-2-1 | Fixed: provenance is repository-only rather than a visitor claim. |
| F-2-2 | Fixed: the option is factual “192 kbps”. |

## Structure and identity checks

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown URL returns the designed 404 with HTTP 404. The sitemap lists public routes.
- Checked routes have route-specific titles, description, canonical URL, Open Graph/Twitter data, favicon, one H1, `main`, shared header/footer, and Privacy/Terms links. Titles are `Wrapline — add intros and outros to audio`, `Demo — Wrapline`, `Privacy — Wrapline`, `Terms — Wrapline`, and `Page not found — Wrapline`.
- Forward navigation and Back focus/announce the H1. Internal routes and assets resolve; the external Sociobot link is marked external.
- The warm paper, flat ink, job-sheet geometry, and original risograph jig art match `.factory/design.md` and are distinct from a generic SaaS template.

## What would make this perfect

Use valid demo live-region markup, remove the untestable privacy promise, and repeat the clean-clone claims plus the live Axe scan. No additional product capability is implied by the brief.
