# Adversarial first-read review 5 — Wrapline

**Reviewed:** 2026-09-02 UTC

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Candidate:** `9bc7ea993b99610f6e954521de693f678cebff65`

**Clean clone:** `/tmp/wrapline-review5-vdkzai`

## Verdict: FAIL

The cold landing and one-click demo are clear and usable. All 17 declared commands exit successfully, the clean `npm test` gate passes, and all 62 production browser checks pass. The review still fails because two declared claim tests do not prove their full statements, several visitor-facing statements remain broader than the claim ledger, and the mandatory first-screen fact set omits offline and price facts. A PASS requires zero findings and no untested claim.

## Cold first read

Both checks used fresh browser contexts at scroll position 0. No console or page error occurred.

| Viewport | What this does, in my words | For whom | What I would click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Adds intros and outros to voice tracks while keeping music, loudness, and filenames consistent. | Podcasters, radio makers, and course creators. | **Try it with sample data**; the adjacent note says it opens three ready-to-render tracks. | Confirmed before scrolling. |
| 1440 × 900 | Applies one intro, outro, music, loudness, and filename setup to many voice tracks, then exports WAV or MP3. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Confirmed before scrolling. |

The exact first-screen copy is “Add intros and outros to voice tracks,” “For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks,” and “Opens three ready-to-render voice tracks.” The three short product facts also fit in the phone viewport. Both loads returned HTTP 200 with title `Wrapline — add intros and outros to audio`, one H1, and one main landmark.

## Findings, ordered by severity

### F-5-1 — BLOCKING — The recipe export/delete claim test checks only an intro

**Exact claim and visitor copy:** `.factory/claims.json` says, “A saved recipe can be exported with its audio files and deleted from the device.” README says, “Exports a recipe with its audio files and deletes saved recipes on request.”

**Check:** `@claim:recipe-controls` adds only `portable-intro.wav`. It checks only `exported.intro`, then checks only that the recipe and intro are absent after deletion. It never adds or asserts an outro or music bed.

**Why this fails:** “Its audio files” means every audio asset held by the recipe. The green test would still pass if outro or music-bed export/deletion regressed. A manual export of the live Signal Desk demo did include all three named files and data URLs, so the observed implementation works; the declared proof does not cover the full claim. Any incompletely tested claim is blocking.

**Concrete fix:** In the tagged test, add distinct intro, outro, and music-bed fixtures. Assert all three names, MIME-prefixed data URLs, and bytes in the downloaded JSON. Delete the recipe, reload, and assert all three statuses and the saved record are gone. Update the claim sandbox description to name all three assets.

### F-5-2 — BLOCKING — The demo-isolation test does not prove the complete storage boundary

**Exact claim/location:** `.factory/claims.json`: “Demo data is separate from real Wrapline data and is discarded when leaving the demo.” Privacy says the demo does not open or copy real “recipes, receipts, or license state.” `.factory/demo.md` names both IndexedDB and license localStorage namespaces.

**Check:** `@claim:demo-isolation` saves one real recipe, opens `/demo`, checks two database names, leaves, and confirms that recipe remains. It does not seed or snapshot a real receipt, real license token/verdict, or the contents of the real IndexedDB database before and after demo rendering/reset.

**Why this fails:** The test would pass if demo rendering wrote a receipt into the real database or changed a real license key while leaving the recipe intact. The sandbox contract requires proof that nothing in demo mode persists to real storage.

**Concrete fix:** Seed a real recipe, receipt, and license token/verdict. Snapshot all real IndexedDB records and non-demo localStorage entries. Enter demo, save and render, alter demo license state, reset, and leave. Assert the real snapshot is byte-for-byte unchanged and every `demo:` database/key is deleted.

### F-5-3 — BLOCKING — The broad local-storage claim is not in the ledger

**Prior finding:** regression of `F-1-4`, which required every retained visitor promise to have a matching ledger entry and observable test.

**Exact quotes:** README: “Stores recipes, added audio, receipts, and license state in this browser.” README also says, “Adds a saved intro, outro, looping music bed, loudness target, and filename pattern.” The landing method says, “Keep added audio, loudness, output format, and filenames together in one recipe.”

**Check:** `local-recipes` promises and tests only saved recipes, **intro** audio, and receipts. `license-boundary` checks token fields after an invalid response. No ledger entry promises persistence of intro, outro, and music-bed audio together, and no tagged persistence test reloads all three.

**Why this fails:** A visitor can reasonably expect every named audio layer to persist. The current copy-audit maps these broader statements to narrower claims, hiding the gap. Because this is a regression of the earlier claim-completeness finding, it is blocking again.

**Concrete fix:** Expand `local-recipes` to name intro, outro, music-bed audio, and receipts. Save all three distinct fixtures, reload, and assert every name and byte payload. Give license-state persistence its own exact entry/test, or narrow the README sentence to the behavior already proved.

### F-5-4 — BLOCKING — “On your devices” is an unlisted cross-device license claim

**Prior finding:** regression of `F-1-4`.

**Exact quote/location:** landing pricing section: “A $29 one-time purchase unlocks unlimited tracks and saved recipes on your devices.”

**Check:** `studio-unlimited` injects one recorded valid response into one browser page. `studio-license` checks the price label and checkout URL. Neither entry nor test establishes that one purchase can be restored on multiple devices.

**Why this fails:** “Your devices” is a concrete portability entitlement a buyer may rely on. It is broader than the tested single-device state.

**Concrete fix:** Either rewrite to **“A $29 one-time purchase unlocks unlimited tracks and saved recipes on this device”**, or add a claim and two-fresh-context test that restores the same valid product license in both contexts.

### F-5-5 — BLOCKING — README implementation and license assertions are absent from claims.json

**Prior finding:** regression of `F-1-4`.

**Exact quotes:** “Wrapline uses the browser Web Audio API.” “MP3 output uses the bundled `@audio/encode-mp3` encoder.” “Wrapline is licensed under the MIT License.”

**Check:** These factual statements have no claim entry. Source imports and repository files support them, but the contract requires visitor-facing claim-like statements to be listed and tested, not merely documented elsewhere.

**Why this fails:** A reader may rely on the processing implementation, encoder provenance, and license. None is discoverable in the declared claim ledger, so the ledger is not complete.

**Concrete fix:** Add one repository-metadata claim with a tagged test that checks the Web Audio render path, bundled dependency/notice, and exact MIT `LICENSE`; or remove the implementation assertions and leave only links to the source/notice/license files.

### F-5-6 — BLOCKING — The offline banner makes an unlisted future-behavior claim

**Prior finding:** regression of `F-1-4`.

**Exact quote/location:** conditional landing banner: “Local audio processing still works; license checks will resume later.”

**Check:** `offline-demo` proves an offline demo reload and render. No claim or test proves that a stopped license check automatically resumes. The online event handler only updates the connection banner.

**Why this fails:** “Will resume later” reads as automatic retry behavior. It also combines two ideas in one sentence.

**Concrete fix:** Replace it with **“Local audio processing still works offline. License checks need a connection.”** The first sentence maps to `offline-demo`; the second is a present limitation rather than a future promise.

### F-5-7 — Major — The first screen omits the required offline and price facts

**Exact copy/location:** the three first-screen lines are “WAV and MP3 input,” “WAV or MP3 output,” and “Audio stays on this device.”

**Why this fails:** The attached plain-words contract requires three first-screen facts covering privacy, offline behavior, and price. Input and output repeat the headline’s capability while the visitor must scroll to learn offline behavior and the free/$29 boundary.

**Concrete fix:** Use **“Audio stays on this device”**, **“Demo renders offline after the first visit”**, and **“Free: 3 tracks · Studio: $29 once.”** These statements already have `local-audio`, `offline-demo`, `free-tier`, and `studio-license` coverage.

### F-5-8 — Minor — Red × marks visually negate the positive first-screen facts

**Exact location:** `src/styles.css`: `.proof-list li::before { content: "×"; color: var(--red); }`. The 390 px live screenshot shows a red × before “WAV and MP3 input,” “WAV or MP3 output,” and “Audio stays on this device.”

**Why this fails:** A red × conventionally means unavailable or failed. In a 30-second scan it can make the product appear not to support the three things listed.

**Concrete fix:** Remove the symbol or use a neutral registration dot/line that cannot be read as rejection. Keep the text and state, not color or icon alone, as the meaning.

## Copy audit

Counts treat a hyphenated term, number, placeholder, or package name as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Every flag below maps to a finding above.

### Landing and app sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| You’re offline. | 2 | Covered by `offline-demo`. |
| Local audio processing still works; license checks will resume later. | 10 | **Flag F-5-6:** split and remove the future promise. |
| Demo — sample data, nothing is saved to your real data. | 10 | Covered by `demo-isolation`; test scope gap is F-5-2. |
| Three short sample tracks are ready to render. | 8 | Covered by `demo-sample-data`. |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 | Clear audience and result. |
| Opens three ready-to-render voice tracks. | 5 | Covered by `demo-sample-data`. |
| The saved Signal Desk recipe has an intro, outro, music bed, and three voice tracks. | 14 | Covered by `demo-sample-data`. |
| Audio stays on this device. | 6 | Covered by `local-audio`. |
| Intro, voice, outro, and music bed. | 7 | Clear process caption. |
| Choose the added audio once, then review and download each rendered batch. | 12 | Clear process; output behavior is tested. |
| Used in filenames and receipts. | 5 | Clear field help. |
| Added to the queue next. | 6 | Clear sequence. |
| Choose WAV for editing or MP3 for publishing. | 8 | Useful format guidance. |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 | Covered by `audio-behavior`. |
| Intro and outro files keep their original level. | 8 | Covered by `audio-behavior`. |
| The music bed drops by 7 dB under voice. | 9 | Covered by `audio-behavior`. |
| Sample peaks stay below −0.18 dBFS. | 6 | Covered by `audio-behavior`. |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | Necessary limitation. |
| WAV output is 48 kHz, 16-bit PCM. | 7 | Covered by `audio-behavior`. |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 | Covered by `mp3-output`. |
| Added voice tracks appear here. | 5 | Clear empty state. |
| Add WAV or MP3 files to begin. | 7 | Clear next action. |
| Free batches include up to 3 tracks. | 7 | Covered by `free-tier`. |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | Covered by `source-receipt`. |
| No batches rendered on this device yet. | 7 | Clear empty state. |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 | **Flag F-5-3:** broader persistence statement than the ledger. |
| Every source gets a predictable output name and an audio player after rendering. | 12 | Covered by output claims. |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 | Covered by output claims. |
| The free tier saves one recipe and renders three tracks per batch. | 12 | Covered by `free-tier`. |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on your devices. | 12 | **Flag F-5-4:** cross-device scope is unlisted and untested. |
| Add intros, outros, and music to many voice tracks. | 9 | Clear footer description. |
| A fresh version is ready. | 5 | Clear update state. |
| Sample batch ready: three short voice tracks with an intro, outro, and music bed. | 14 | Covered by `demo-sample-data`. |

### Interactive messages and errors

| Sentence or template | Words | Result |
| --- | ---: | --- |
| Give this recipe a name. | 5 | Names the problem. |
| The filename recipe must include `{source}`. | 6 | Names the fix. |
| Start number must be a whole number from 0 through 9999. | 11 | Names the bounds. |
| No supported audio found. | 4 | Followed by recovery. |
| Choose WAV or MP3 files. | 5 | Recovery action. |
| Some files were skipped because they were not WAV or MP3. | 11 | Gives the reason. |
| `{count}` tracks added. | 3 | Clear success. |
| That is not a Wrapline recipe export. | 7 | Gives the reason. |
| The free tier holds one saved recipe. | 7 | Covered by `free-tier`. |
| Load it to update it, or buy Studio for more recipes. | 11 | Recovery action. |
| Imported “`{recipe}`” with its audio assets. | 6 | Clear success. |
| This free batch has more than 3 tracks. | 8 | Covered by `free-tier`. |
| Remove extras or unlock unlimited batches. | 6 | Recovery action. |
| The recipe could not be read. | 6 | Followed by recovery. |
| Review its fields and try again. | 6 | Recovery action. |
| Audio stays on this device while the batch renders. | 9 | Covered by `local-audio`. |
| This track could not be rendered. | 6 | Followed by recovery. |
| Choose a standard WAV or MP3 file and try again. | 10 | Recovery action. |
| `{complete}` of `{total}` tracks rendered. | 5 | Clear progress. |
| Review them above or download the batch. | 7 | Clear next action. |
| Nothing rendered. | 2 | Followed by recovery. |
| Check the error on each track and try another WAV or MP3. | 12 | Recovery action. |
| Could not reset the demo. | 5 | Followed by recovery. |
| Try closing another demo tab. | 5 | Recovery action. |
| Could not leave the demo. | 5 | Followed by recovery. |
| Choose a WAV or MP3 intro, outro, or music bed file. | 11 | Recovery action. |
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
| Delete “`{recipe}`” and its saved intro, outro, and music bed files from this device? | 14 | Clear confirmation; test gap is F-5-1. |
| Recipe deleted. | 2 | Clear success. |
| Portable recipe exported with its audio assets. | 7 | **Flag F-5-1:** the test checks only an intro. |
| The recipe could not be exported. | 6 | Paired with recovery. |
| The recipe file could not be imported. | 7 | Paired with recovery. |
| Choose a Wrapline recipe JSON file. | 6 | Recovery action. |
| Track removed from the queue. | 5 | Clear success. |
| Unlimited batches and recipes are unlocked on this device. | 9 | Covered by `studio-unlimited`. |
| License no longer active. | 4 | Followed by recovery. |
| You can restore another license below. | 6 | Recovery action. |
| Paste the license token from your purchase email. | 8 | Recovery action. |
| Checking license… | 2 | Clear progress. |
| License verified. | 2 | Clear success. |
| Unlimited batches and recipes are active. | 6 | Covered by `studio-unlimited`. |
| That license could not be verified. | 6 | Followed by recovery. |
| Check the token and try again. | 6 | Recovery action. |
| Local storage could not open. | 5 | Followed by reason. |
| Private browsing settings may prevent saved recipes. | 7 | Gives the likely reason. |
| Restore a current license to unlock Studio. | 7 | Recovery action. |

### Headings, buttons, labels, and terminology

| Group | Exact copy | Result |
| --- | --- | --- |
| Navigation | Audio setup; How it works; License; Privacy; Terms | Clear destinations. |
| H1s | Add intros and outros to voice tracks; Signal Desk sample workspace | Literal and under nine words. |
| Section headings | Save intro, outro, music bed, and filename; Audio recipe; Voice queue; Recent receipts; Create a finished batch in three steps; Remove batch and recipe limits | Clear and ordered. |
| Step headings | Add intro, outro, and music; Review each rendered track; Download the batch | Verb-led. |
| Primary actions | Try it with sample data; Set up a real batch; Save recipe; Render batch; Download WAV; Download MP3; Download batch ZIP | Result-naming verbs. |
| Demo/install actions | Reset demo; Start for real; Install app; Install update | Result-naming verbs. |
| Recipe actions | Create new recipe; Export recipe JSON; Import recipe JSON; Delete recipe; Download receipt JSON | Result-naming verbs. |
| License actions | Buy Studio license · $29 (external checkout); Verify license | Result, price, and destination named. |
| File actions | Clear intro; Clear outro; Clear music bed; Remove `{filename}` | Specific accessible names. |
| Field labels | Saved recipe; Recipe name; Intro optional; Outro optional; Music bed optional; Music bed level; Voice target; Output format; MP3 bitrate; Filename recipe; Start number; Already bought? Paste license | Clear and bound. |
| First-screen facts | WAV and MP3 input; WAV or MP3 output; Audio stays on this device | **Flag F-5-7:** missing offline and price. **Flag F-5-8:** red × marks look negative. |

Terminology is otherwise consistent: **recipe**, **voice track**, **intro**, **outro**, **music bed**, **render/rendered**, **batch**, **receipt**, **demo**, and **Studio license**.

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 | Covered by input/audio claims. |
| Render each batch as WAV or MP3 without uploading audio. | 10 | Covered by output/privacy claims. |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 | Clear audience. |
| Try it with sample data opens the Signal Desk workspace with three ready-to-render voice tracks at `/demo`. | 15 | Covered by `demo-sample-data`. |
| The same isolated sample opens at `/?demo=1`. | 7 | Covered by `demo-sample-data`. |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 | Covered in intent by `demo-isolation`; full proof gap is F-5-2. |
| The demo never reads or changes real Wrapline data. | 9 | Covered in intent by `demo-isolation`; full proof gap is F-5-2. |
| Reset demo clears and reloads the sample. | 7 | Covered by `demo-sample-data`. |
| Start for real clears the demo namespace and opens an empty setup. | 11 | Covered in intent by `demo-isolation`; full proof gap is F-5-2. |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 | Documentation pointer. |
| Accepts WAV and MP3 voice tracks. | 6 | Covered by `wav-mp3-input`. |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 | **Flag F-5-3:** persistence of all three audio assets is not ledgered/tested. |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 | Covered by output claims. |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 | Covered by output claims. |
| Stores recipes, added audio, receipts, and license state in this browser. | 11 | **Flag F-5-3:** broader than `local-recipes`. |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 | **Flag F-5-1:** tagged test checks only an intro. |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 | Covered by `local-audio`. |
| Reloads the installed demo offline after its first visit. | 9 | Covered by `offline-demo`. |
| Saves one recipe and renders three tracks per batch for free. | 11 | Covered by `free-tier`. |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 | Covered by Studio claims. |
| The purchase link opens the external Sociobot checkout. | 8 | Covered by `studio-license`. |
| Open the printed local URL. | 5 | Clear instruction. |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 | Clear instruction. |
| Deploy `dist/` as the static output. | 6 | Clear instruction. |
| Wrapline uses the browser Web Audio API. | 7 | **Flag F-5-5:** unlisted implementation claim. |
| Browser and operating-system codec support can vary. | 7 | Necessary limitation. |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 | Covered by `audio-behavior`. |
| Intro and outro levels remain unchanged. | 6 | Covered by `audio-behavior`. |
| The music bed drops 7 dB under voice. | 8 | Covered by `audio-behavior`. |
| Sample peaks remain below −0.18 dBFS. | 6 | Covered by `audio-behavior`. |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 | Necessary limitation. |
| Review each rendered track before publishing. | 6 | Clear safety instruction. |
| MP3 output uses the bundled `@audio/encode-mp3` encoder. | 7 | **Flag F-5-5:** unlisted implementation/provenance claim. |
| See `THIRD_PARTY_NOTICES.md` for provenance and licenses. | 7 | Documentation pointer. |
| Wrapline is licensed under the MIT License. | 7 | **Flag F-5-5:** unlisted license assertion. |
| See `LICENSE`. | 2 | Documentation pointer. |

README headings—**Wrapline**, **Try it safely**, **What it does**, **Run locally**, **Test and build**, **Audio behavior**, and **Privacy and legal**—identify their sections. No heading or button uses a mood slogan.

## Demo and sandbox checks

- One click from `/` opens `/demo` at scroll position 0. At 390 × 844 and 1440 × 900, the Signal Desk H1 and first named track are inside the initial viewport.
- The persistent banner says, “Demo — sample data, nothing is saved to your real data.” **Reset demo** restores Signal Desk and three tracks. **Start for real** is present.
- A fresh `/?demo=1` opens the same sample.
- A complete production render made only same-origin HTTP requests; audio previews used local blob URLs. `offline-demo` reloaded and rendered in its own offline context.
- A manual live demo export contained `signal-desk-intro.wav`, `signal-desk-outro.wav`, and `signal-desk-bed.wav`, each with an embedded audio data URL. This confirms current export behavior but does not repair F-5-1’s incomplete regression test.
- F-5-2 records the remaining proof gap for the full real-storage boundary.

## Declared claim results

Every exact `test` command in `.factory/claims.json` ran independently from the clean clone. Every process exited 0, and each claim tag occurs exactly once. “Command result” does not override the semantic coverage findings above.

| Claim ID | Command result | Coverage review |
| --- | --- | --- |
| `demo-sample-data` | PASS | One-click viewport, banner, three tracks, reset checked. |
| `demo-isolation` | PASS | **Incomplete: F-5-2.** |
| `local-audio` | PASS | Same-origin request log through render checked. |
| `offline-demo` | PASS | Owned context reloaded and rendered offline. |
| `wav-mp3-input` | PASS | Real WAV and committed MP3 both rendered. |
| `wav-receipt` | PASS | Three playable WAV outputs and ZIP receipt checked. |
| `mp3-output` | PASS | Both bitrates, frame headers, decode, names, and receipt checked. |
| `audio-behavior` | PASS | Gain caps, wrapper levels, ducking, peak, rate, and depth measured. |
| `source-receipt` | PASS | Hash and named production fields checked. |
| `local-recipes` | PASS | Exact narrow intro/recipe/receipt claim passes; broader copy is F-5-3. |
| `free-tier` | PASS | One-recipe and three-track limits checked. |
| `studio-license` | PASS | Price, external label, and exact product URL checked without following it. |
| `studio-unlimited` | PASS | Recorded response allowed two recipes and four tracks in one context. |
| `license-daily-check` | PASS | Same-token verdict made one request. |
| `license-boundary` | PASS | Exact token URL and invalid-state boundary checked. |
| `recipe-controls` | PASS | **Incomplete: F-5-1.** |
| `route-shell` | PASS | Status, metadata, landmarks, links, build ID, Axe, and console checked. |

## Earlier-finding recheck

Every prior `review-*.md`, `polish-*.md`, and current pre-review handoff was read. Each earlier finding was checked in current source and production.

| Earlier ID | Current result |
| --- | --- |
| `F-1-1` | Fixed: both cold viewports state the job, audience, action, and sample outcome. |
| `F-1-2` | Fixed: the committed MP3 fixture renders beside WAV input. |
| `F-1-3` | Fixed: deterministic measurements cover every stated audio value. |
| `F-1-4` | **Regressed:** F-5-3 through F-5-6 identify current unlisted or broader claims. |
| `F-1-5` | Fixed: post-render mobile controls meet 44 px checks. |
| `F-1-6` | Fixed for inventory completeness: app, README, legal, state, error, heading, and control copy are listed. Its claim mappings need the corrections above. |
| `F-1-7` | Fixed: functional copy uses recipe, voice track, music bed, batch, receipt, and render consistently. |
| `F-1-8` | Fixed: forward and Back navigation focus and announce the H1. |
| `F-1-9` | Fixed: WAV and selected-bitrate MP3 output render and decode. |
| `F-1-10` | Fixed: cited controls now name their results. |
| `F-2-1` | Fixed: artwork provenance is repository-only. |
| `F-2-2` | Fixed: the bitrate option says only “192 kbps.” |
| `CTRL-2-1` | Fixed: local and live 12-shard suites completed without browser teardown failures. |
| `F-3-1` | Fixed: the demo banner is a `div[role=status]`; current Axe runs have zero violations. |
| `F-3-2` | Fixed: the future privacy-policy promise is absent. |
| `F-4-1` | Fixed: the one-click demo opens directly on the populated workspace. |
| `F-4-2` | Fixed: visitor copy consistently says “music bed.” |
| `F-4-3` | Fixed: the purchase action says “external checkout.” |

## Structure, accessibility, privacy, and visual identity

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed Wrapline 404 with HTTP 404.
- Titles are route-specific: `Wrapline — add intros and outros to audio`, `Demo — Wrapline`, `Privacy — Wrapline`, `Terms — Wrapline`, and `Page not found — Wrapline`.
- Every checked route has `lang=en`, one H1, one main landmark, description, canonical, Open Graph/Twitter metadata, local favicon and social image, shared header/footer, Privacy, Terms, and build ID.
- Same-origin anchor crawling found no dead real destination. External Sociobot checkout/contact URLs are explicitly labeled; they were not followed outside this product’s authorized scope.
- Deep links, trailing `/demo/`, forward/Back focus, route announcement, skip links, keyboard rendering, reduced motion, mobile width, and 44 px controls pass the production suite.
- The URL verifier reports HTTP 200, 573 ms load, no console errors, one H1, `lang=en`, a main landmark, zero missing image alternatives, and zero unlabeled buttons.
- Axe integration reports zero violations on landing, demo, privacy, terms, and not-found routes.
- Production headers include CSP, Permissions-Policy, Referrer-Policy, HSTS, frame denial, and content-type protection. No third-party font/script request appeared.
- The warm paper, flat blue/red/ochre inks, square job-sheet geometry, risograph artwork, and printing-jig forms match `.factory/design.md` and are not a generic SaaS template. F-5-8 is the one visual-semantic exception.
- Clean `npm test` passed 14 unit/release tests and 62 browser checks. `npm run build` produced `dist/`; initial JavaScript is 13.73 kB gzip, CSS 4.59 kB gzip, and the 86.49 kB gzip MP3 encoder is lazy-loaded.

## Missed leverage

No AI feature is warranted for deterministic local audio assembly. The brief’s obvious adjacent needs—WAV/MP3 import and export, reusable recipe import/export, batch ZIP delivery, receipts, and offline demo use—are present. Cloud sync would conflict with the local-first scope unless it were an explicit opt-in product expansion.

## What would make this perfect

Expand the export/delete and isolation tests to prove every named storage boundary. Bring every retained visitor assertion into the ledger or narrow the copy. Replace the first-screen facts with privacy/offline/price and remove the red × marks. Then rerun all 17 exact commands, `npm test`, the full production suite, and the cold phone/desktop audit. There is still work left; this round is not PASS-adjacent under the zero-finding standard.
