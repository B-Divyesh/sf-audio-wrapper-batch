# Adversarial first-read review 4 — Wrapline

**Reviewed:** 2026-09-02 UTC

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Candidate:** `87a9519d4c596bb1b97f9a0a522dd62e83265184`

**Clean clone:** `/tmp/wrapline-review4-JozvhX`

## Verdict: FAIL

The landing screen is clear, the sample data and storage isolation work, and all 17 declared claims pass. The review still fails because `/demo` does not show the working sample on the first screen after the landing action. It repeats the marketing hero and requires a second action to reach the loaded recipe and queue. Two minor wording and link-disclosure findings also remain. A PASS requires zero findings.

## Cold first read

Both checks used fresh browser contexts at scroll position 0.

| Viewport | What this does | For whom | What I would click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Adds intros and outros to voice tracks while keeping music, loudness, and filenames consistent across many tracks. | Podcasters, radio makers, and course creators. | **Try it with sample data**; the note says it opens three ready-to-render tracks. | Confirmed before scrolling. |
| 1440 × 900 | Adds a repeated intro, outro, music, loudness, and filename setup to voice tracks, then exports WAV or MP3. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Confirmed before scrolling. |

Exact first-screen copy that answers the three questions: “Add intros and outros to voice tracks”; “For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks.”; “Try it with sample data”; and “Opens three ready-to-render voice tracks.” The mobile screenshot showed the action note and all three facts before the bottom edge. Both cold loads returned 200, used the title “Wrapline — add intros and outros to audio,” had one H1 and one main landmark, and logged no console or page errors.

## Findings

### F-4-1 — BLOCKING — The demo needs a second action before the sample workspace is visible

**Location and exact copy:** after activating the landing action **“Try it with sample data,”** `/demo` opens at scroll position 0. Its first 390 × 844 screen contains the demo banner and the marketing hero, followed by **“Open the sample batch”** and **“Jumps to three ready-to-render voice tracks.”** At 390 px, the workspace begins at 1,094 px, its recipe heading at 1,382 px, and its first track at 3,286 px. At 1440 × 900, the workspace begins at 917 px and its first track at 1,483 px. Neither initial viewport shows the product in use.

**Why a first-time visitor is lost:** the first click loads sample state but does not show the product being used. The visitor sees the same landing pitch again and must infer that a second button is required. This fails the demo-sandbox requirement that one click open a first screen already showing realistic sample data.

**Concrete fix:** make `/demo` start with the persistent demo banner immediately followed by the populated audio recipe and three-track queue at scroll position 0. Remove the repeated hero from demo mode, or place it after the workspace. Keep **Reset demo** and **Start for real** visible. Add a 390 × 844 and desktop assertion that the Signal Desk recipe and at least one named queued track are inside the initial viewport after one click from `/`.

### F-4-2 — Minor — “Bed” and “music bed” name the same control inconsistently

**Locations and exact copy:** landing caption **“Intro, voice, outro, and bed.”**; section heading **“Save intro, outro, bed, and filename”**; field label **“Bed level”**; empty state **“No bed selected.”** Elsewhere the product uses **“music bed”** and **“Music bed optional.”**

**Why a first-time visitor is affected:** “bed” is production jargon, while “music bed” explains the concept. Alternating between both terms breaks the one-word-per-concept rule and makes the shorter labels less clear for course creators.

**Concrete fix:** use **“Intro, voice, outro, and music bed,” “Save intro, outro, music bed, and filename,” “Music bed level,”** and **“No music bed selected.”** Keep “music bed” everywhere visitor-facing.

### F-4-3 — Minor — The paid checkout link is external but is not identified as external

**Location and exact copy:** **“Buy studio license · $29”** links from the landing page and `/demo` to `https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout`. Unlike the two Sociobot footer/contact links, its label contains no external-site notice.

**Why a first-time visitor is affected:** activating the purchase action leaves Wrapline for a different origin without advance notice. The site-structure contract requires external links to say so.

**Concrete fix:** label it **“Buy Studio license · $29 (external checkout)”** or add adjacent, programmatically associated text saying **“Opens Sociobot checkout.”** Add a route test that checks the disclosure and exact product-scoped URL without following the purchase link.

## Copy audit

Counts treat a hyphenated term, number, placeholder, or package name as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Findings are marked below.

### Landing and app sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| You’re offline. | 2 | Covered by `offline-demo`. |
| Local audio processing still works; license checks will resume later. | 10 | Covered by `offline-demo`. |
| Demo — sample data, nothing is saved to your real data. | 10 | Covered by `demo-isolation`. |
| Three short sample tracks are ready to render. | 8 | Covered by `demo-sample-data`. |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 | Clear audience and result. |
| Opens three ready-to-render voice tracks. | 5 | Clear landing-action result. |
| Jumps to three ready-to-render voice tracks. | 5 | Clear wording, but the extra action is F-4-1. |
| Audio stays on this device. | 6 | Covered by `local-audio`. |
| Intro, voice, outro, and bed. | 5 | **Flag F-4-2:** use “music bed.” |
| Choose the added audio once, then review and download each rendered batch. | 12 | Clear process. |
| Used in filenames and receipts. | 5 | Clear help text. |
| Added to the queue next. | 6 | Clear sequence. |
| Choose WAV for editing or MP3 for publishing. | 8 | Clear format guidance. |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 | Covered by `audio-behavior`. |
| Intro and outro files keep their original level. | 8 | Covered by `audio-behavior`. |
| The music bed drops by 7 dB under voice. | 9 | Covered by `audio-behavior`. |
| Sample peaks stay below −0.18 dBFS. | 6 | Covered by `audio-behavior`. |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | Useful limitation. |
| WAV output is 48 kHz, 16-bit PCM. | 7 | Covered by `audio-behavior`. |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 | Covered by `mp3-output`. |
| Added voice tracks appear here. | 5 | Clear empty state. |
| Add WAV or MP3 files to begin. | 7 | Clear next action. |
| Free batches include up to 3 tracks. | 7 | Covered by `free-tier`. |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | Covered by `source-receipt`. |
| No batches rendered on this device yet. | 7 | Clear empty state. |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 | Clear explanation. |
| Every source gets a predictable output name and an audio player after rendering. | 12 | Covered by output claims. |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 | Covered by output claims. |
| The free tier saves one recipe and renders three tracks per batch. | 12 | Covered by `free-tier`. |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on your devices. | 12 | Covered by Studio claims. |
| Add intros, outros, and music to many voice tracks. | 9 | Clear footer description. |
| A fresh version is ready. | 5 | Clear update state. |
| Sample batch ready: three short voice tracks with an intro, outro, and music bed. | 14 | Covered by `demo-sample-data`. |

### Interactive messages and errors

| Sentence or template | Words | Result |
| --- | ---: | --- |
| Give this recipe a name. | 5 | Names the problem. |
| The filename recipe must include `{source}`. | 6 | Names the fix. |
| Start number must be a whole number from 0 through 9999. | 11 | Names the bounds. |
| No supported audio found. | 4 | Followed by the recovery below. |
| Choose WAV or MP3 files. | 5 | Recovery action. |
| Some files were skipped because they were not WAV or MP3. | 11 | Gives the reason. |
| `{count}` tracks added. | 3 | Clear success. |
| That is not a Wrapline recipe export. | 7 | Gives the reason. |
| The free tier holds one saved recipe. | 7 | Covered by `free-tier`. |
| Load it to update it, or buy Studio for more recipes. | 11 | Recovery action. |
| Imported “`{recipe}`” with its audio assets. | 6 | Clear success. |
| This free batch has more than 3 tracks. | 8 | Covered by `free-tier`. |
| Remove extras or unlock unlimited batches. | 6 | Recovery action. |
| The recipe could not be read. | 6 | Followed by the recovery below. |
| Review its fields and try again. | 6 | Recovery action. |
| Audio stays on this device while the batch renders. | 9 | Covered by `local-audio`. |
| This track could not be rendered. | 6 | Followed by the recovery below. |
| Choose a standard WAV or MP3 file and try again. | 10 | Recovery action. |
| `{complete}` of `{total}` tracks rendered. | 5 | Clear progress. |
| Review them above or download the batch. | 7 | Clear next action. |
| Nothing rendered. | 2 | Followed by the recovery below. |
| Check the error on each track and try another WAV or MP3. | 12 | Recovery action. |
| Could not reset the demo. | 5 | Followed by “Try closing another demo tab.” |
| Try closing another demo tab. | 5 | Recovery action. |
| Could not leave the demo. | 5 | Followed by “Try closing another demo tab.” |
| Choose a WAV or MP3 intro, outro, or music-bed file. | 10 | Recovery action. |
| `{file}` added to the recipe. | 5 | Clear success. |
| Save to keep it on this device. | 7 | Clear next action. |
| `{layer}` cleared. | 2 | Clear success. |
| Save to keep this change. | 5 | Clear next action. |
| Loaded “`{recipe}`”. | 2 | Clear success. |
| A new recipe is ready. | 5 | Clear state. |
| The free tier holds one recipe. | 6 | Covered by `free-tier`. |
| Saved “`{recipe}`” as version `{number}` on this device. | 8 | Covered by `local-recipes`. |
| The recipe could not be saved because local storage failed. | 10 | Gives the reason. |
| Check browser storage and try again. | 6 | Recovery action. |
| Delete “`{recipe}`” and its saved intro, outro, and music-bed files from this device? | 13 | Specific confirmation. |
| Recipe deleted. | 2 | Clear success. |
| Portable recipe exported with its audio assets. | 7 | Covered by `recipe-controls`. |
| The recipe could not be exported. | 6 | Paired with “Review its fields and try again.” in the fallback. |
| The recipe file could not be imported. | 7 | Paired with the recovery below. |
| Choose a Wrapline recipe JSON file. | 6 | Recovery action. |
| Track removed from the queue. | 5 | Clear success. |
| Unlimited batches and recipes are unlocked on this device. | 9 | Covered by `studio-unlimited`. |
| License no longer active. | 4 | Followed by the recovery below. |
| You can restore another license below. | 6 | Recovery action. |
| Paste the license token from your purchase email. | 8 | Recovery action. |
| Checking license… | 2 | Clear progress. |
| License verified. | 2 | Clear success. |
| Unlimited batches and recipes are active. | 6 | Covered by `studio-unlimited`. |
| That license could not be verified. | 6 | Followed by the recovery below. |
| Check the token and try again. | 6 | Recovery action. |
| Local storage could not open. | 5 | Followed by the reason below. |
| Private browsing settings may prevent saved recipes. | 7 | Gives the likely reason. |
| Restore a current license to unlock Studio. | 7 | Recovery action. |

### Headings, buttons, labels, and terminology

| Group | Exact copy | Result |
| --- | --- | --- |
| Navigation | Audio setup (2); How it works (3); License (1); Privacy (1); Terms (1) | Clear destinations. |
| Main headings | Add intros and outros to voice tracks (7); Save intro, outro, bed, and filename (7); Audio recipe (2); Voice queue (2); Recent receipts (2); Create a finished batch in three steps (7); Remove batch and recipe limits (5) | **Flag F-4-2** on “bed”; the others are literal and ordered. |
| Step headings | Add intro, outro, and music (6); Review each rendered track (4); Download the batch (3) | Clear, verb-led headings. |
| Primary actions | Try it with sample data (5); Open the sample batch (4); Set up a real batch (5); Save recipe (2); Render batch (2); Download WAV (2); Download MP3 (2); Download batch ZIP (3) | Result-naming verbs. **F-4-1** concerns the extra demo step, not the wording alone. |
| Demo/install actions | Reset demo (2); Start for real (3); Install app (2); Install update (2) | Result-naming verbs. |
| Recipe actions | Create new recipe (3); Export recipe JSON (3); Import recipe JSON (3); Delete recipe (2); Download receipt JSON (3) | Result-naming verbs. |
| License actions | Buy studio license · $29 (4); Verify license (2) | Result-naming verbs. **F-4-3** applies to the missing external-checkout notice. |
| File actions | Clear intro (2); Clear outro (2); Clear music bed (3); Remove `{filename}` (2) | Specific accessible names. |
| Field labels | Saved recipe (2); Recipe name (2); Intro optional (2); Outro optional (2); Music bed optional (3); Bed level (2); Voice target (2); Output format (2); MP3 bitrate (2); Filename recipe (2); Start number (2); Already bought? Paste license (4) | **Flag F-4-2** on “Bed level”; the rest are clear and bound. |
| Options | New recipe (2); −16 LUFS · podcast (3); −19 LUFS · mono voice (4); −14 LUFS · course/video (3); WAV · 48 kHz, 16-bit (4); MP3 · 48 kHz (3); 128 kbps (2); 192 kbps (2) | Factual labels. |
| Status/empty fragments | On device (2); Offline ready (2); Unsaved (1); Waiting (1); No intro selected (3); No outro selected (3); No bed selected (3); `{count}` output files queued (4); Rendered · `{seconds}` s (2); Rendering… (1); Preparing… (1); Batch complete (2); Studio license active (3) | **Flag F-4-2** on “No bed selected”; other states are direct. |

Terminology is otherwise consistent: **recipe**, **voice track**, **render/rendered**, **batch**, **receipt**, **demo**, and **Studio license**. The added background audio is inconsistently called both **bed** and **music bed** (F-4-2).

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 | Clear; covered by input/workflow checks. |
| Render each batch as WAV or MP3 without uploading audio. | 10 | Covered by output and privacy claims. |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 | Clear audience. |
| Try it with sample data opens three ready-to-render voice tracks at `/demo`. | 11 | Covered by `demo-sample-data`; F-4-1 concerns viewport presentation. |
| The same isolated sample opens at `/?demo=1`. | 7 | Covered by `demo-sample-data`. |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 | Covered by `demo-isolation`. |
| The demo never reads or changes real Wrapline data. | 9 | Covered by `demo-isolation`. |
| Reset demo clears and reloads the sample. | 7 | Covered by `demo-sample-data`. |
| Start for real clears the demo namespace and opens an empty setup. | 11 | Covered by `demo-isolation`. |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 | Documentation pointer. |
| Accepts WAV and MP3 voice tracks. | 6 | Covered by `wav-mp3-input`. |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 | Covered by audio and storage tests. |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 | Covered by `audio-behavior` and `mp3-output`. |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 | Covered by output claims. |
| Stores recipes, added audio, receipts, and license state in this browser. | 11 | Covered by storage and license tests. |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 | Covered by `recipe-controls`. |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 | Covered by `local-audio`. |
| Reloads the installed demo offline after its first visit. | 9 | Covered by `offline-demo`. |
| Saves one recipe and renders three tracks per batch for free. | 11 | Covered by `free-tier`. |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 | Covered by Studio claims. |
| Open the printed local URL. | 5 | Clear instruction. |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 | Clear instruction. |
| Deploy `dist/` as the static output. | 6 | Clear instruction. |
| Wrapline uses the browser Web Audio API. | 7 | Accurate implementation disclosure. |
| Browser and operating-system codec support can vary. | 7 | Useful limitation. |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 | Covered by `audio-behavior`. |
| Intro and outro levels remain unchanged. | 6 | Covered by `audio-behavior`. |
| The music bed drops 7 dB under voice. | 8 | Covered by `audio-behavior`. |
| Sample peaks remain below −0.18 dBFS. | 6 | Covered by `audio-behavior`. |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 | Useful limitation. |
| Review each rendered track before publishing. | 6 | Clear safety instruction. |
| MP3 output uses the bundled `@audio/encode-mp3` encoder. | 7 | Confirmed in source, dependency lock, and notices; output behavior is covered by `mp3-output`. |
| See `THIRD_PARTY_NOTICES.md` for provenance and licenses. | 7 | Documentation pointer. |
| Wrapline is licensed under the MIT License. | 7 | Confirmed by `LICENSE`. |
| See `LICENSE`. | 2 | Documentation pointer. |

README headings—**Wrapline**, **Try it safely**, **What it does**, **Run locally**, **Test and build**, **Audio behavior**, and **Privacy and legal**—all name their sections. No README wording finding remains.

## Demo and sandbox checks

- One landing click opens `/demo`, and its DOM is already seeded with the **Signal Desk** recipe, `signal-desk-intro.wav`, `signal-desk-outro.wav`, `signal-desk-bed.wav`, and three named voice tracks.
- The first viewport does not show that working sample; F-4-1 is blocking.
- The persistent banner says **“Demo — sample data, nothing is saved to your real data.”** It includes **Reset demo** and **Start for real**.
- Reset restored Signal Desk and all three tracks.
- `demo-isolation` saved real data, entered demo mode, confirmed separate `wrapline-local` and `demo:wrapline-local` databases, left demo mode, confirmed the demo database was deleted, and confirmed the real recipe remained.
- `local-audio` recorded the complete render flow and allowed only same-origin HTTP requests. The full live suite repeated the production render/request check. Preview media used local `blob:` URLs.
- `offline-demo` installed the worker, switched an owned browser context offline, reloaded `/demo`, and rendered the sample successfully.

## Declared claim results

Every exact `test` command from `.factory/claims.json` ran independently in the clean clone. Each grep ran its tagged claim in both desktop and 390 px projects.

| Claim | Result | Observable coverage checked |
| --- | --- | --- |
| `demo-sample-data` | PASS | Banner, added audio, three tracks, controls, reset. |
| `demo-isolation` | PASS | Separate demo database, deletion on exit, real recipe preserved. |
| `local-audio` | PASS | Complete demo render made only same-origin HTTP requests. |
| `offline-demo` | PASS | Cached demo reloaded and rendered offline in its own context. |
| `wav-mp3-input` | PASS | Real WAV and committed MP3 inputs both rendered. |
| `wav-receipt` | PASS | Three playable recipe-named WAV files and receipt ZIP. |
| `mp3-output` | PASS | Playable 48 kHz MP3 at both 128 and 192 kbps; receipt fields checked. |
| `audio-behavior` | PASS | Gain cap, unchanged wrapper levels, 7 dB ducking, peak ceiling, sample rate, and bit depth measured. |
| `source-receipt` | PASS | Source SHA-256 and every listed receipt field checked. |
| `local-recipes` | PASS | Recipe, intro audio, and receipt survived reload. |
| `free-tier` | PASS | One-recipe and three-track limits enforced. |
| `studio-license` | PASS | Visible price and exact product-scoped checkout URL checked without purchase navigation. |
| `studio-unlimited` | PASS | Recorded valid response allowed two recipes and four outputs. |
| `license-daily-check` | PASS | Same-token verdict reused with one verification request. |
| `license-boundary` | PASS | Only encoded token sent; revoked response remained locked. |
| `recipe-controls` | PASS | Export included audio; delete removed the recipe after reload. |
| `route-shell` | PASS | Route status, metadata, landmarks, links, build ID, focus, Axe, and console checked. |

No claim-like landing, README, privacy, or terms sentence was found without applicable ledger coverage or direct repository evidence. No declared claim is untested.

## Earlier-finding recheck

Every earlier review and polish report, plus the current handoff, was read. Each earlier finding was checked against both current code and the deployed site.

| Earlier ID | Current result |
| --- | --- |
| `F-1-1` | Fixed: phone and desktop first screens state the job, audience, action, outcome, and three facts. |
| `F-1-2` | Fixed: the claim test supplies and renders a committed MP3 fixture beside WAV. |
| `F-1-3` | Fixed: deterministic PCM tests measure every disclosed gain, wrapper, ducking, peak, rate, and depth value. |
| `F-1-4` | Fixed: previously cited merchant/refund/card/operational copy was removed or replaced with tested statements; all 17 current entries passed. |
| `F-1-5` | Fixed: source CSS gives rendered audio/download controls a 44 px minimum; live mobile tests passed after render. |
| `F-1-6` | Fixed: `.factory/copy-audit.md` covers app states, errors, controls, README, legal copy, metadata, and terminology. |
| `F-1-7` | Fixed for its cited “bench,” “wrapper,” “job ticket,” and render/output inconsistencies. The narrower bed/music-bed inconsistency is recorded separately as F-4-2. |
| `F-1-8` | Fixed: source route handler focuses and announces the H1; live forward/Back tests passed. |
| `F-1-9` | Fixed: WAV and selected-bitrate MP3 output render and decode. |
| `F-1-10` | Fixed: cited generic controls now name their results. |
| `F-2-1` | Fixed: artwork provenance is absent from visitor-facing footers and remains in repository records. |
| `F-2-2` | Fixed: the option says only “192 kbps.” |
| `F-3-1` | Fixed: the demo banner is a `DIV` with `role=status`; fresh live Axe scans found zero violations. |
| `F-3-2` | Fixed: the future privacy-policy promise is absent from live copy and current source. |

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown path returns the designed Wrapline 404 with HTTP 404.
- Titles are route-specific: `Wrapline — add intros and outros to audio`, `Demo — Wrapline`, `Privacy — Wrapline`, `Terms — Wrapline`, and `Page not found — Wrapline`.
- Every checked route has `lang=en`, one H1, one main landmark, a description, canonical URL, Open Graph/Twitter metadata, local favicon and social image, shared header/footer, and Privacy/Terms links.
- The full live browser suite confirms deep links, Back/forward behavior, H1 focus and announcement, visible focus, keyboard-only rendering, reduced motion, no mobile overflow, and 44 px controls.
- Fresh Axe checks found zero violations on landing, demo, legal, and not-found routes. No console or page errors occurred in the cold checks.
- Every same-origin link found on the public routes returned 200, except the intentional missing-route link within the 404 document, which returned the expected 404 shell. The checkout link was not followed; F-4-3 covers its missing external-site disclosure.
- Ten key deployed artifacts, including HTML, JavaScript, CSS, service worker, legal pages, manifest, sitemap, and favicon, matched the clean build byte-for-byte by SHA-256.
- The live response includes CSP, Permissions-Policy, Referrer-Policy, HSTS, frame denial, and content-type protection headers.
- The warm paper palette, flat red/blue/ochre inks, square job-sheet geometry, and original risograph audio jig are specific to this workflow and do not resemble a generic SaaS card-and-gradient template.

## Missed leverage

No additional AI feature is warranted. Audio assembly, deterministic loudness handling, naming, and receipts should remain local and predictable. The brief’s obvious adjacent needs—WAV/MP3 import and export, reusable recipe import/export, batch ZIP delivery, and receipts—are present. Cloud sync would conflict with the local-first scope unless offered as a separate, explicit opt-in feature.

## Verification summary

- All 17 exact claim commands: PASS, 34 browser executions total.
- `npm test`: exit 0; 14 unit/release tests and 62 browser tests completed. One Chromium launch crashed during the route-focus case, the configured retry passed, and an immediate isolated rerun passed 2/2. This was a browser-process failure, not an application assertion failure.
- `npm run test:e2e:live`: PASS, all 62 production checks without retry.
- Repeated builds produced `dist/`; initial JavaScript was 13.64 kB gzip, CSS 4.48 kB gzip, and the lazy MP3 encoder 86.49 kB gzip.
- Fresh live request and console capture: only product-origin requests during demo entry, zero console errors, zero page errors.

## What would make this perfect

Show the populated sample workspace immediately after the single landing-page demo click. Standardize “music bed” everywhere and identify the paid action as an external checkout. Then repeat the cold 390 px/desktop demo check, link crawl, claim commands, and live suite. A perfect round has no second demo step and no copy or structure exceptions.
