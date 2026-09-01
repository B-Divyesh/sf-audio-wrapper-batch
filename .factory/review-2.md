# Adversarial first-read review 2 — Wrapline

**Reviewed:** 2026-09-01 UTC
**Live URL:** <https://audio-wrapper-batch.sociobot.in>
**Candidate checked from a clean clone:** `48ca02f774277851b86c289d19d566950a34d834`

## Verdict: FAIL

The core product is clear, usable, and tryable. All 17 declared claim commands pass from a clean clone, and live desktop and phone checks pass. Two copy and claim-ledger findings remain. The acceptance rule requires zero findings, so this review is **FAIL**.

## Cold first read

Fresh browser contexts were used at 1440 × 900 and 390 × 844, with no stored site data.

| Viewport | What this does | For whom | First action | Check result |
| --- | --- | --- | --- | --- |
| Desktop | Adds the same intro, outro, music, loudness, and filename setup to several voice tracks, then renders WAV or MP3 files. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Confirmed before scrolling. |
| 390 px phone | Adds intros and outros to voice tracks and keeps music, loudness, and filenames consistent across many tracks. | Podcasters, radio makers, and course creators. | **Try it with sample data**; it says it opens three ready-to-render tracks. | Confirmed before scrolling. |

The exact first-screen wording is clear: “Add intros and outros to voice tracks”; “For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks.”; and “Opens three ready-to-render voice tracks.” The action note ended within the 844 px phone viewport. No first-screen clarity finding is recorded.

## Findings

### F-2-1 — Major — Artwork provenance is a live claim without a claim-ledger entry

**Location and exact copy:** Footer on `/`, `/demo`, `/privacy/`, `/terms/`, and the not-found page: “Bench artwork generated for Wrapline with Azure AI Foundry.”

**Check result:** The repository contains artwork prompt and source sidecars, which support the statement internally. `.factory/claims.json` has no entry for the visible provenance statement and no sandbox test for it.

**Why this needs attention:** A visitor is asked to rely on a factual origin statement that is outside the claim ledger. The review contract requires every claim-like visitor statement to be declared and checked.

**Concrete fix:** Remove this footer sentence and retain provenance in `.factory/design.md` and the asset sidecars. If it must remain visitor-visible, add a narrowly scoped claim entry and a reproducible check of the shipped artwork-to-provenance record.

### F-2-2 — Minor — The 192 kbps option uses an unmeasured quality adjective

**Location and exact copy:** Output-format control: “192 kbps · higher quality”.

**Check result:** `mp3-output` confirms the selected constant bitrate and playability. It does not measure subjective quality, and “higher quality” is a marketing adjective rather than a concrete result.

**Why this needs attention:** A visitor selecting an output format may read the label as a tested quality promise. The label does not tell the visitor a directly observable choice beyond the bitrate already shown.

**Concrete fix:** Change the option to **“192 kbps”**. Keep selected bitrate and codec details in the receipt, where the existing claim test confirms them.

## Copy audit

Word counts treat hyphenated terms, numbers, and placeholders as one word. No landing or README sentence exceeds 22 words. The two flags above are the only copy findings.

### Landing-page sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Intros and outros for many tracks | 5 | Clear context heading. |
| Add intros and outros to voice tracks | 7 | Clear H1. |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 | Clear audience and outcome. |
| Opens three ready-to-render voice tracks. | 5 | Clear sample outcome. |
| WAV and MP3 input | 4 | Covered by `wav-mp3-input`. |
| WAV or MP3 output | 5 | Covered by output tests. |
| Audio stays on this device | 6 | Covered by `local-audio`. |
| Intro, voice, outro, and bed. | 5 | Concrete process caption. |
| Choose the added audio once, then review and download each rendered batch. | 12 | Clear. |
| Used in filenames and receipts. | 5 | Clear. |
| Added to the queue next | 6 | Clear. |
| Choose WAV for editing or MP3 for publishing. | 8 | Concrete choice guidance. |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 | `audio-behavior`. |
| Intro and outro files keep their original level. | 8 | `audio-behavior`. |
| The music bed drops by 7 dB under voice. | 9 | `audio-behavior`. |
| Sample peaks stay below −0.18 dBFS. | 6 | `audio-behavior`. |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | Necessary limitation. |
| WAV output is 48 kHz, 16-bit PCM. | 7 | `audio-behavior`. |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 | `mp3-output`. |
| Drop finished voice tracks | 4 | Clear queue instruction. |
| or choose WAV / MP3 files | 5 | Clear recovery choice. |
| Added voice tracks appear here. | 5 | Clear empty state. |
| Add WAV or MP3 files to begin. | 7 | Clear next action. |
| Free batches include up to 3 tracks. | 7 | `free-tier`. |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | `source-receipt`. |
| No batches rendered on this device yet. | 7 | Clear empty state. |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 | Clear. |
| Every source gets a predictable output name and an audio player after rendering. | 12 | Output claim tests. |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 | Output claim tests. |
| The free tier saves one recipe and renders three tracks per batch. | 12 | `free-tier`. |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on your devices. | 12 | Studio claim tests. |
| Add intros, outros, and music to many voice tracks. | 9 | Clear footer description. |
| Bench artwork generated for Wrapline with Azure AI Foundry. | 9 | **Flag F-2-1.** |
| A fresh version is ready. | 5 | Clear update state. |

Landing headings are literal and understandable out of context: **Save intro, outro, bed, and filename** (7), **Audio recipe** (2), **Voice queue** (2), **Recent receipts** (2), **Create a finished batch in three steps** (7), and **Remove batch and recipe limits** (5). The three method headings are **Add intro, outro, and music** (6), **Review each rendered track** (4), and **Download the batch** (3).

All landing actions name a result: **Try it with sample data**, **Open the sample batch**, **Set up a real batch**, **Create new recipe**, **Save recipe**, **Export recipe JSON**, **Import recipe JSON**, **Delete recipe**, **Render batch**, **Download WAV**, **Download MP3**, **Download batch ZIP**, **Buy studio license · $29**, **Verify license**, **Reset demo**, **Start for real**, **Install app**, and **Install update**. The only flagged option is **192 kbps · higher quality** (4), F-2-2.

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 | Core audio claim tests. |
| Render each batch as WAV or MP3 without uploading audio. | 10 | Output and `local-audio` tests. |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 | Clear audience. |
| Try it with sample data opens three ready-to-render voice tracks at `/demo`. | 11 | `demo-sample-data`. |
| The same isolated sample opens at `/?demo=1`. | 7 | `demo-sample-data`. |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 | `demo-isolation`. |
| The demo never reads or changes real Wrapline data. | 9 | `demo-isolation`. |
| Reset demo clears and reloads the sample. | 7 | `demo-sample-data`. |
| Start for real clears the demo namespace and opens an empty setup. | 11 | `demo-isolation`. |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 | Documentation pointer. |
| Accepts WAV and MP3 voice tracks. | 6 | `wav-mp3-input`. |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 | Audio and recipe tests. |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 | `audio-behavior`, `mp3-output`. |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 | Output claim tests. |
| Stores recipes, added audio, receipts, and license state in this browser. | 11 | Storage and license-boundary tests. |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 | `recipe-controls`. |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 | `local-audio`. |
| Reloads the installed demo offline after its first visit. | 9 | `offline-demo`. |
| Saves one recipe and renders three tracks per batch for free. | 11 | `free-tier`. |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 | Studio claim tests. |
| Open the printed local URL. | 5 | Clear instruction. |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 | Clear instruction. |
| Deploy `dist/` as the static output. | 6 | Clear instruction. |
| Wrapline uses the browser Web Audio API. | 7 | Implementation disclosure. |
| Browser and operating-system codec support can vary. | 7 | Necessary limitation. |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 | `audio-behavior`. |
| Intro and outro levels remain unchanged. | 6 | `audio-behavior`. |
| The music bed drops 7 dB under voice. | 8 | `audio-behavior`. |
| Sample peaks remain below −0.18 dBFS. | 6 | `audio-behavior`. |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 | Necessary limitation. |
| Review each rendered track before publishing. | 6 | Clear instruction. |
| MP3 output uses the bundled `@audio/encode-mp3` encoder. | 7 | `mp3-output`; notice is present. |
| See `THIRD_PARTY_NOTICES.md` for provenance and licenses. | 7 | Documentation pointer. |
| Wrapline is licensed under the MIT License. | 7 | License file is present. |
| See `LICENSE`. | 2 | Documentation pointer. |

README headings — **Wrapline**, **Try it safely**, **What it does**, **Run locally**, **Test and build**, **Audio behavior**, and **Privacy and legal** — all identify their sections.

## Demo and privacy checks

- Confirmed the one-click action opens `/demo`.
- Confirmed the first demo screen already has the **Signal Desk** recipe, named intro/outro/music-bed files, three voice tracks, active controls, and the persistent notice: “Demo — sample data, nothing is saved to your real data.”
- Confirmed **Reset demo** and **Start for real** are present. Clean-clone checks confirm reset behavior and separate demo storage.
- Checked the live demo through a complete render. It produced three output areas, emitted no console errors, and made only same-origin HTTP requests; media used local `blob:` URLs.
- Confirmed no AI feature is needed for this deterministic local audio assembly job. The brief already implies and the product supplies import, export, receipts, and MP3 delivery.

## Claim execution from a clean clone

Each exact command in `.factory/claims.json` was run independently in `/tmp/wrapline-review-2-HWpC4T` after `npm ci --include=dev`. Every command passed in desktop and 390 px browser projects.

| Claim id | Result | Claim id | Result |
| --- | --- | --- | --- |
| `demo-sample-data` | PASS | `demo-isolation` | PASS |
| `local-audio` | PASS | `offline-demo` | PASS |
| `wav-mp3-input` | PASS | `wav-receipt` | PASS |
| `mp3-output` | PASS | `audio-behavior` | PASS |
| `source-receipt` | PASS | `local-recipes` | PASS |
| `free-tier` | PASS | `studio-license` | PASS |
| `studio-unlimited` | PASS | `license-daily-check` | PASS |
| `license-boundary` | PASS | `recipe-controls` | PASS |
| `route-shell` | PASS |  |  |

The clean build repeatedly completed with 13.71 kB gzip initial JavaScript, 4.48 kB gzip CSS, and a lazy 86.49 kB gzip MP3 encoder chunk.

## History recheck

Every finding in `review-1.md` was checked against live behavior and current code.

| Earlier finding | Current check |
| --- | --- |
| F-1-1, concrete phone first screen | Fixed: H1, audience sentence, sample outcome, and facts are visible at 390 px. |
| F-1-2, real MP3 input | Fixed: the committed MP3 fixture is rendered by the passing `wav-mp3-input` check. |
| F-1-3, loudness coverage | Fixed: the deterministic audio check measures the disclosed values. |
| F-1-4, missing claim entries | Fixed for the cited operational and billing statements: removed copy or declared coverage. F-2-1 is a new provenance-ledger finding. |
| F-1-5, 44 px rendered controls | Fixed: rendered output controls use a 44 px minimum and current checks pass. |
| F-1-6, incomplete copy audit | Fixed: `.factory/copy-audit.md` includes app, README, legal, state, error, heading, and control copy. |
| F-1-7, unclear processing terms | Fixed: live functional copy consistently uses recipe, voice track, music bed, batch, receipt, and render. |
| F-1-8, route focus and announcement | Fixed: live forward navigation and Back focus the H1 and announce it. |
| F-1-9, MP3 delivery | Fixed: the output choice and 128/192 kbps MP3 render pass. |
| F-1-10, generic action labels | Fixed: current actions name their results. |

## Structure, accessibility, and visual checks

- Confirmed 200 responses for `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, `robots.txt`, `sitemap.xml`, the manifest, favicon, and social image. An unknown route returned the designed not-found page with HTTP 404.
- Confirmed route-specific title, description, canonical, Open Graph, Twitter, favicon, language, one H1, main landmark, shared header/footer, Privacy, and Terms on each public route through the passing `route-shell` check.
- Confirmed route titles: `Wrapline — add intros and outros to audio`, `Demo — Wrapline`, `Privacy — Wrapline`, `Terms — Wrapline`, and `Page not found — Wrapline`.
- Confirmed internal links resolve to `/`, `/demo`, `/privacy/`, `/terms/`, or `/404.html`. External links are visibly marked and were not followed.
- Checked live route navigation from Privacy to Home, Home to Demo, and Back. Each result focused `h1#hero-title`, announced “Add intros and outros to voice tracks,” restored the expected URL, and produced no console errors.
- Confirmed the live `route-shell` accessibility check passes serious and critical Axe checks on all public route types. Keyboard skip navigation, focus visibility, responsive width, and 44 px controls are covered there.
- Confirmed the risograph finishing-bench visual system is distinct from a generic product template: warm paper, flat ink colors, compact job-sheet geometry, and original product-specific finishing-jig art all match `.factory/design.md`.

## What would make this perfect

Remove or formally check the footer provenance sentence, and replace the subjective 192 kbps label with its factual bitrate. Then repeat the clean-clone claim commands and live phone check. With those two items resolved, this review would have no remaining findings.
