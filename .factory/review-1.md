# Adversarial first-read review 1 — Wrapline

**Reviewed:** 2026-09-01 UTC

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Candidate:** `ee89ef22342257982aa999e623af3c97fc70da47`

**Verdict:** **FAIL**

The demo and main audio flow work, all 14 declared claim commands pass, and the site has a distinct visual identity. The review still has blocking findings: the mobile first screen does not explain “wrap” in plain words, two declared claim tests do not test their full claims, several live claims are absent from the ledger, and rendered download controls miss the required touch-target size. A prior copy-audit finding also remains only partly fixed.

## 1. Cold first read

Both checks used new browser contexts at scroll position 0 with no stored site data.

| Viewport | What I think it does | For whom | What I would click first | Result |
| --- | --- | --- | --- | --- |
| 1440 × 900 | It processes several voice tracks with one repeated audio/export setup. The illustration and lower caption eventually clarify intro, voice, outro, and bed. | Independent podcasters, radio makers, and course creators. | **Try it with sample data**. | Partial pass; all three answers are recoverable before scrolling. |
| 390 × 844 | It “wraps” voice tracks and outputs WAV files, but the visible words do not say that “wrap” means adding an intro, outro, and music bed. | Independent podcasters, radio makers, and course creators. | **Try it with sample data**. | **Blocking clarity failure.** The concrete wrapper contents are below the first mobile screen, and no adjacent sentence says what the sample action opens. |

Exact first-screen text that causes the failure:

- “Wrap finished voice tracks in batches” uses the product’s own verb rather than the visitor’s job.
- “one branded export setup” does not say what is added or changed.
- “Try it with sample data” has no adjacent outcome such as “Opens three ready-to-render tracks.”

Cold loads returned HTTP 200 with no console errors. The title was “Wrapline — repeatable batch audio finishing,” and each view had one H1.

## 2. Findings, ordered by severity

### F-1-1 — BLOCKING — The 390 px first screen does not state the concrete job

**Location/quote:** landing H1 and audience line: “Wrap finished voice tracks in batches” and “one branded export setup.”

**Why this fails:** A new visitor has to infer the meaning of “wrap.” The concrete operations—intro, outro, and music bed—do not appear in visible text before the bottom of the first mobile screen. The primary action also does not state what appears after activation.

**Concrete fix:** Use:

- H1: **Add intros and outros to voice tracks**
- Audience sentence: **For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks.**
- Adjacent action note: **Opens three ready-to-render voice tracks.**

### F-1-2 — BLOCKING — The MP3 claim test never uses MP3 input

**Location/quote:** `.factory/claims.json` claim `wav-mp3-input`: “Wrapline offers WAV and MP3 voice input.” The tagged test in `tests/e2e/app.spec.ts` only supplies `episode-one.wav`.

**Why this fails:** The passing command proves the picker advertises MP3 and proves WAV rendering. It does not prove that a real MP3 decodes and renders. A visitor may rely on MP3 support.

**Concrete fix:** Add a small licensed MP3 fixture to the test, render it from `/demo` or a fresh bench, and assert a non-empty playable WAV output. Keep the WAV assertion in the same tagged test or split the claim into independently tagged WAV and MP3 claims.

### F-1-3 — BLOCKING — The loudness claim test does not test most stated behavior

**Location/quote:** landing disclosure: “applies no more than ±12 dB,” “Wrapper audio keeps its original level,” and “The bed drops by 7 dB under voice.” Claim `audio-behavior` includes “the disclosed browser loudness behavior.”

**Why this fails:** The tagged test checks that the disclosure contains “RMS,” inspects the WAV header, and checks a peak ceiling. It does not measure the ±12 dB cap, unchanged wrapper level, or 7 dB bed reduction. These remain untested claims even though the command exits successfully.

**Concrete fix:** Render deterministic tone fixtures and measure the intro, voice, bed-under-voice, and outro regions. Assert the gain cap, wrapper level, 7 dB ducking, sample-peak ceiling, sample rate, and bit depth. Split the ledger entry if separate tagged tests make failures clearer.

### F-1-4 — BLOCKING — Claim-like live and README statements are absent from the claim ledger

**Locations/quotes:**

- Landing: “Checkout and refunds are handled by Sociobot / Dodo, the merchant of record.”
- Privacy: “When you submit a Studio license, Wrapline sends the token—not your audio—to the Sociobot billing API.”
- Privacy: “Sociobot and Dodo process checkout data as the merchant of record. Wrapline does not receive or store card details.”
- Privacy: “Network access loads or updates the app and verifies a license.”
- Terms: “A refund, chargeback, expiry, or revocation makes a license inactive.”
- Terms: “Accessibility, data export, and core safety disclosures remain available without payment.”
- README: “Every visitor-facing promise is declared in `.factory/claims.json` with an observable tagged browser test.”
- README operational promises about Node 20 support, outage-independent/reproducible builds, release redirect verification, 404 routing, headers, cache policy, and update discovery have tests or instructions but no ledger entries.

**Why this fails:** The claims contract requires every statement a visitor can rely on to have a ledger entry and observable tagged test. The merchant/refund/card assertions are not proved by the `studio-license` test, which checks only visible price text and an exact URL. The external checkout result was not contacted because this work order prohibits access to resources outside the product service boundary.

**Concrete fix:** Remove statements that cannot be proved in the allowed sandbox. Add narrowly scoped ledger entries and fixture-backed tests for token transmission, stored fields, inactive-license reasons, free accessibility/export behavior, and each retained operational promise. Replace the absolute “Every visitor-facing promise…” sentence until the ledger is complete.

### F-1-5 — BLOCKING — Rendered download targets remain below 44 px

**Prior finding:** `verification-2.md`, P2 “Skip destination and mobile target accessibility are incomplete.”

**Location/evidence:** after rendering the live `/demo` at 390 × 844, all three **Download WAV** links measured **122.4 × 42 CSS px**. `src/styles.css` explicitly sets `.job-output .button { min-height: 42px; }`.

**Why this fails:** The attached accessibility baseline requires every interactive target to be at least 44 × 44 px. Earlier controls were repaired, but the result-state controls were not covered, so the earlier finding is only partly fixed.

**Concrete fix:** Set the result download links to at least 44 px high and extend the mobile target regression to render the sample before measuring every visible interactive element.

### F-1-6 — BLOCKING — The prior copy-audit finding remains incomplete

**Prior finding:** `verification-8.md`, P2 “The required copy audit is incomplete.”

**Location/evidence:** `.factory/copy-audit.md` now lists initial/demo/offline/update landing sentences, but it still omits README sentences, headings, controls, and interactive success/error sentences. This review found metaphor, unclear controls, and unlisted claims in those omitted groups.

**Why this fails:** The current work order explicitly requires every landing and README sentence, plus headings and buttons. Marking only selected states as the complete audit can hide regressions.

**Concrete fix:** Generate the audit from all visitor-visible source strings and README prose. Include headings, accessible control names, conditional states, word counts, terminology, and claim IDs.

### F-1-7 — Major — Processing terminology and several headings are unclear or metaphorical

**Locations/quotes:** “Finishing bench,” “Set up one wrapper recipe,” “Wrapper recipe,” “Your numbered job tickets will appear here,” “Ready when your queue is,” “Add the wrapper,” and the error “The free bench holds one recipe.” The result state also alternates among “render,” “wrap,” “wrapped,” and “output.”

**Why this matters:** A heading must identify its section without relying on the visual theme. “Bench,” “job tickets,” and “wrapper” are product lore, while inconsistent process verbs make status harder to scan.

**Concrete fix:** Use **Audio setup**, **Save intro, outro, bed, and filename**, **Added voice tracks appear here**, **Add WAV or MP3 files to begin**, and **Add intro, outro, and music**. Use **render/rendered** for the process everywhere.

### F-1-8 — Major — Route changes do not move focus or announce the new route

**Location/evidence:** navigating `/privacy/` → `/#bench` → `/demo` and then Back works and restores the URL/scroll position, but `document.activeElement` is `BODY` after each navigation. There is no route-announcement live region; existing live regions report form state only.

**Why this matters:** The supplied site-structure contract requires focus on the new H1 and a polite route announcement. Keyboard and screen-reader users receive no programmatic route context beyond normal document loading.

**Concrete fix:** Add a shared route-change handler that updates the title, focuses a programmatically focusable H1, and writes its text to a dedicated `aria-live="polite"` region. Add forward/back tests.

### F-1-9 — Major — Podcasters cannot export an MP3 deliverable

**Location:** brief audience and current output controls. Wrapline accepts MP3 but always exports 48 kHz PCM WAV.

**Why this matters:** The brief targets podcasters and asks for consistently branded deliverables. A normal podcast workflow commonly needs an MP3 delivery file, so requiring another conversion step leaves an obvious part of the stated job unfinished.

**Concrete feature:** Add an output-format choice for WAV or MP3, with a plain bitrate choice and codec disclosure. Use an appropriately licensed, bundled on-device encoder, record format/bitrate in the receipt, and add demo claim tests that inspect the encoded output. No AI feature is warranted for deterministic audio assembly.

### F-1-10 — Minor — Several controls do not name their result

**Location/quote and rewrite:**

| Current control | Rewrite |
| --- | --- |
| Start fresh | Create new recipe |
| Delete | Delete recipe |
| Verify | Verify license |
| Download JSON | Download receipt JSON |
| Update now | Install update |

The × controls have specific accessible names and pass. **Try it with sample data**, **Save recipe**, **Render batch**, **Export JSON**, **Import JSON**, **Download WAV**, **Download batch ZIP**, and **Buy studio license · $29** name their results.

## 3. Landing-page copy audit

Counting treats a hyphenated term, number, or placeholder as one word. No landing sentence exceeds 22 words. “Flag” points to a finding above.

### Initial, demo, offline, and update states

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | You’re offline. | 2 | Pass |
| 2 | Local audio processing still works; license checks will resume later. | 10 | Pass |
| 3 | Demo — sample data, nothing is saved to your real data. | 10 | Pass |
| 4 | Three short sample tracks are ready to render. | 8 | Pass |
| 5 | For independent podcasters, radio makers, and course creators who need one branded export setup for every finished voice track. | 18 | Flag F-1-1: “branded export setup” is vague. |
| 6 | Intro, voice, outro, and bed. | 5 | Pass, but it is below the first mobile screen. |
| 7 | Choose wrapper audio once, then review and download each finished batch. | 11 | Flag F-1-7: “wrapper audio” is internal terminology. |
| 8 | Used in filenames and receipts. | 5 | Pass |
| 9 | Wrapline estimates voice loudness from RMS and applies no more than ±12 dB. | 13 | Flag F-1-3: incompletely tested. |
| 10 | Wrapper audio keeps its original level. | 6 | Flag F-1-3 and F-1-7. |
| 11 | The bed drops by 7 dB under voice. | 8 | Flag F-1-3. |
| 12 | Sample peaks stay below −0.18 dBFS. | 6 | Pass; peak threshold is tested. |
| 13 | This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | Pass as a necessary disclosure. |
| 14 | Output is 48 kHz, 16-bit PCM WAV. | 7 | Pass; format is tested. |
| 15 | Your numbered job tickets will appear here. | 7 | Flag F-1-7: metaphor. Rewrite “Added voice tracks appear here.” |
| 16 | Ready when your queue is. | 5 | Flag F-1-7: mood line. Rewrite “Add WAV or MP3 files to begin.” |
| 17 | Free batches include up to 3 tracks. | 7 | Pass; tested. |
| 18 | Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | Pass; tested. |
| 19 | No batches rendered on this device yet. | 7 | Pass |
| 20 | Keep intro, outro, bed, loudness, and naming together as a portable recipe. | 12 | Pass; export test covers portability. |
| 21 | Every source gets a predictable output name and an audio player after rendering. | 12 | Pass; tested. |
| 22 | Download one ZIP containing WAV files and a JSON receipt. | 10 | Pass; tested. |
| 23 | Wrapline is useful for free: save one recipe and render three tracks per batch. | 14 | Flag F-1-7: “useful” is promotional. State the free limit directly. |
| 24 | A $29 one-time purchase unlocks unlimited tracks and unlimited saved recipes on your devices. | 13 | Pass; fixture-backed behavior is tested. |
| 25 | Checkout and refunds are handled by Sociobot / Dodo, the merchant of record. | 12 | Flag F-1-4: unlisted and unproved. |
| 26 | Local batch finishing for independent audio makers. | 7 | Pass |
| 27 | Bench artwork generated for Wrapline with Azure AI Foundry. | 9 | Pass; provenance is useful. |
| 28 | A fresh version is ready. | 5 | Pass |
| 29 | Sample batch ready: three short voice tracks with an intro, outro, and music bed. | 14 | Pass |

### Interactive success and error states

| # | Sentence template | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Give this recipe a name. | 5 | Pass |
| 2 | The filename recipe must include {source}. | 6 | Pass |
| 3 | Start number must be a whole number from 0 through 9999. | 11 | Pass |
| 4 | No supported audio found. | 4 | Pass |
| 5 | Choose WAV or MP3 files. | 5 | Pass |
| 6 | Some files were skipped because they were not WAV or MP3. | 11 | Pass |
| 7 | {count} tracks added. | 3 | Pass |
| 8 | That is not a Wrapline recipe export. | 7 | Pass |
| 9 | The free bench holds one saved recipe. | 7 | Flag F-1-7: metaphor. |
| 10 | Unlock Studio or replace your current recipe. | 7 | Pass; “unlock” is literal license behavior. |
| 11 | Imported “{recipe}” with its audio assets. | 6 | Pass |
| 12 | This free batch has more than 3 tracks. | 8 | Pass |
| 13 | Remove extras or unlock unlimited batches. | 6 | Pass |
| 14 | Check the recipe. | 3 | Flag: generic fallback; say which field failed when possible. |
| 15 | Audio stays on this device while the batch renders. | 9 | Pass; tested. |
| 16 | This file could not be rendered. | 6 | Flag: missing reason. Preserve the decode error where available. |
| 17 | {complete} of {total} tracks wrapped. | 5 | Flag F-1-7: use “rendered.” |
| 18 | Review them above or download the batch. | 7 | Pass |
| 19 | Nothing rendered. | 2 | Pass with the following recovery sentence. |
| 20 | Check the error on each track and try another WAV or MP3. | 12 | Pass |
| 21 | Could not reset the demo. | 5 | Pass with the following recovery sentence. |
| 22 | Try closing another demo tab. | 5 | Pass |
| 23 | Could not leave the demo. | 5 | Pass with the following recovery sentence. |
| 24 | Choose a WAV or MP3 wrapper file. | 7 | Flag F-1-7: use “intro, outro, or music-bed file.” |
| 25 | {file} added to the recipe. | 5 | Pass |
| 26 | Save to keep it on this device. | 7 | Pass |
| 27 | {layer} cleared. | 2 | Pass |
| 28 | Save to keep this change. | 5 | Pass |
| 29 | Loaded “{recipe}”. | 2 | Pass |
| 30 | Fresh recipe ready. | 3 | Flag F-1-7: rewrite “A new recipe is ready.” |
| 31 | The free bench holds one recipe. | 6 | Flag F-1-7: metaphor. |
| 32 | Load it to update it, or unlock unlimited recipes. | 9 | Pass |
| 33 | Saved “{recipe}” as version {number} on this device. | 8 | Pass |
| 34 | Could not save the recipe. | 5 | Flag: missing reason in fallback path. |
| 35 | Delete “{recipe}” and its saved wrapper audio from this device? | 10 | Flag F-1-7: define the named intro/outro/bed files instead of “wrapper audio.” |
| 36 | Recipe deleted. | 2 | Pass |
| 37 | Portable recipe exported with its audio assets. | 7 | Pass |
| 38 | Could not export the recipe. | 5 | Flag: missing reason in fallback path. |
| 39 | Could not import that recipe. | 5 | Flag: missing reason in fallback path. |
| 40 | Track removed from the queue. | 5 | Pass |
| 41 | Unlimited batches and recipes are unlocked on this device. | 9 | Pass; tested with a fixture. |
| 42 | License no longer active. | 4 | Pass with the following recovery sentence. |
| 43 | You can restore another license below. | 6 | Pass |
| 44 | Paste the license token from your purchase email. | 8 | Pass |
| 45 | Checking license… | 2 | Pass |
| 46 | License verified. | 2 | Pass |
| 47 | Unlimited batches and recipes are active. | 6 | Pass |
| 48 | That license could not be verified. | 6 | Pass with the following recovery sentence. |
| 49 | Check the token and try again. | 6 | Pass |
| 50 | Local storage could not open. | 5 | Pass with the following reason. |
| 51 | Private browsing settings may prevent saved recipes. | 7 | Pass |
| 52 | Restore a current license to unlock Studio. | 7 | Pass |

### Headings and controls

No heading exceeds nine words. The exact heading flags are covered by F-1-1 and F-1-7.

| Type | Text | Words | Result |
| --- | --- | ---: | --- |
| Nav | Finishing bench | 2 | Flag: metaphor; use “Audio setup.” |
| Nav | How it works | 3 | Pass |
| Nav | License | 1 | Pass |
| Heading | Batch audio finishing | 3 | Flag: trade jargon; use “Intros and outros for many tracks.” |
| H1 | Wrap finished voice tracks in batches | 6 | Flag F-1-1. |
| Heading | Your batch setup | 3 | Pass |
| H2 | Set up one wrapper recipe | 5 | Flag F-1-7. |
| H3 | Wrapper recipe | 2 | Flag F-1-7. |
| H3 | Voice queue | 2 | Pass |
| Heading | Saved batch records | 3 | Pass |
| H2 | Recent receipts | 2 | Pass |
| Heading | How it works | 3 | Pass |
| H2 | Create a finished batch in three steps | 7 | Pass |
| Step heading | Add the wrapper | 3 | Flag F-1-7. |
| Step heading | Review each output | 3 | Pass |
| Step heading | Download the batch | 3 | Pass |
| Heading | One-time studio license | 3 | Pass |
| H2 | Remove batch and recipe limits | 5 | Pass |

Control labels are audited in F-1-10. The remaining visible actions are result-naming verbs and pass: **Reset demo**, **Start for real**, **Open the sample batch**, **Try it with sample data**, **Set up a real batch**, **Save recipe**, **Export JSON**, **Import JSON**, **Render batch**, **Download WAV**, **Download batch ZIP**, and **Buy studio license · $29**. Clear/remove × controls also pass because each has a specific accessible name.

## 4. README sentence audit

Markdown headings, link-only navigation items, and command blocks are not sentences. No README sentence exceeds 22 words.

README headings are **Wrapline**, **Try it safely**, **What it does**, **Run locally**, **Test, verify, and build**, **Audio behavior**, and **Privacy and legal**. Each names its section and passes.

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Wrapline batches finished voice tracks for independent podcasters, radio makers, and course creators. | 13 | Flag F-1-1/F-1-7: “batches” is clear, but the operation remains vague. |
| 2 | Add an intro, outro, music bed, loudness target, and filename recipe once; then render a reviewable WAV batch locally. | 19 | Pass |
| 3 | Try it with sample data opens a three-track Signal Desk batch at `/demo`. | 13 | Pass |
| 4 | Demo recipes, receipts, and license state use `demo:` storage names, so the real bench is never read or changed. | 19 | Pass; tested. |
| 5 | Reset demo and Start for real discard that demo namespace. | 10 | Pass; manually confirmed. |
| 6 | See `.factory/demo.md` for the exact sample, URL, reset behavior, and storage boundary. | 13 | Pass |
| 7 | Offers WAV and MP3 voice input, then creates reviewable WAV outputs and a ZIP receipt. | 15 | Flag F-1-2: MP3 outcome is not tested. |
| 8 | Records recipe version, source hash, output name, duration, gain, limiter state, codec, and measurement method. | 15 | Pass; tested. |
| 9 | Saves wrapper recipes, wrapper audio, and receipts on the device. | 10 | Pass; tested. |
| 10 | Exports a saved recipe with its wrapper audio and lets you delete it. | 13 | Pass; tested. |
| 11 | Keeps demo rendering requests on the device; it has no analytics, trackers, third-party fonts, or runtime CDN scripts. | 18 | Pass; request log confirmed. |
| 12 | Lets an installed demo reload offline after its first visit. | 10 | Pass; tested live and locally. |
| 13 | Includes a free tier of one saved recipe and three tracks per batch. | 13 | Pass; tested. |
| 14 | Offers a $29 one-time Studio license through Sociobot / Dodo for unlimited recipes and tracks per batch. | 16 | Flag F-1-4: the provider portion is not proved. |
| 15 | Reuses a completed license check for the same token for one day. | 12 | Pass; fixture-backed test. |
| 16 | Every visitor-facing promise is declared in `.factory/claims.json` with an observable tagged browser test. | 14 | Flag F-1-4: inaccurate. |
| 17 | Requires Node.js 20 or newer. | 6 | Flag F-1-4: no ledger entry or Node 20 matrix evidence. |
| 18 | Open the printed local URL. | 5 | Pass |
| 19 | Visit `/demo` for an immediate sample batch or `/` to work with your own audio. | 14 | Pass |
| 20 | Playwright 1.58.2 is pinned. | 6 | Pass; package manifest confirms it. |
| 21 | If Chromium is missing, run `npx playwright install chromium` once. | 10 | Pass |
| 22 | `npm run build` stays independent of a temporary catalog outage. | 10 | Flag F-1-4: tested outside the claim ledger. |
| 23 | It can always produce a reproducible static artifact. | 8 | Flag F-1-4: absolute and no repeat-build comparison. Rewrite “The build does not query the product catalog.” |
| 24 | Run `npm run verify:release` immediately before a release. | 9 | Pass as an instruction. |
| 25 | It confirms that the product-scoped URL redirects to the hosted production checkout. | 12 | Flag F-1-4: outside the ledger and not run in this restricted review. |
| 26 | The browser claim test checks the displayed $29 price and exact URL. | 12 | Pass as an accurate description of the limited test. |
| 27 | Deploy `dist/` as a static site with `dist/index.html` at its root. | 11 | Pass |
| 28 | `staticwebapp.config.json` rewrites `/demo` and returns the dedicated 404 page for unknown URLs. | 11 | Flag F-1-4: tested outside the ledger. |
| 29 | It also supplies security headers and cache policy. | 8 | Flag F-1-4: tested outside the ledger. |
| 30 | Serve `sw.js` without immutable caching so updates can be discovered. | 11 | Pass as deployment guidance. |
| 31 | Wrapline uses Web Audio APIs supplied by the browser. | 9 | Pass |
| 32 | WAV and MP3 decoding can vary by browser and operating system. | 11 | Pass as a limitation. |
| 33 | Output is 48 kHz, 16-bit PCM WAV. | 7 | Pass; tested. |
| 34 | Loudness uses an RMS-derived estimate capped at ±12 dB. | 9 | Flag F-1-3: cap not tested. |
| 35 | Peak protection is sample-based, not a broadcast-certified EBU R128 meter or true-peak limiter. | 13 | Pass as a limitation; sample peak is tested. |
| 36 | The same disclosure appears beside the controls and in every receipt. | 11 | Pass; receipt test checks measurement text. |
| 37 | Licensed under the MIT License. | 5 | Pass; `LICENSE` exists. |
| 38 | See `LICENSE`. | 2 | Pass |

## 5. Demo and sandbox evidence

- One click from `/` opens `/demo`.
- The first demo screen already contains the `Signal Desk` recipe, `signal-desk-intro.wav`, `signal-desk-outro.wav`, `signal-desk-bed.wav`, and three named voice tracks.
- The persistent banner says “Demo — sample data, nothing is saved to your real data” and includes **Reset demo** and **Start for real**.
- Saving “Changed demo recipe,” then activating Reset and waiting for navigation restored `Signal Desk` and three tracks.
- A real recipe named “Real visitor recipe” remained intact after entering and leaving the demo.
- During live rendering, the request log contained only local `blob:` media requests. No HTTP request left the product origin.
- The live demo rendered three previews and “3 WAV files + receipt,” then reloaded offline with the H1, offline notice, and three tracks.

## 6. Claim execution

Each command was run separately from the clean clone `/tmp/wrapline-review-1-VgCclD`.

| Claim | Command result | Coverage result |
| --- | --- | --- |
| `demo-sample-data` | PASS | Adequate; Reset behavior was checked separately live. |
| `demo-isolation` | PASS | Adequate; real recipe remained intact. |
| `local-audio` | PASS | Adequate; live render log also passed. |
| `offline-demo` | PASS | Adequate; live offline reload also passed. |
| `wav-mp3-input` | PASS | **Incomplete; F-1-2.** |
| `wav-receipt` | PASS | Adequate. |
| `audio-behavior` | PASS | **Incomplete; F-1-3.** |
| `source-receipt` | PASS | Adequate. |
| `local-recipes` | PASS | Adequate. |
| `free-tier` | PASS | Adequate. |
| `studio-license` | PASS | URL/price only; external provider/refund statements remain unproved in F-1-4. |
| `studio-unlimited` | PASS | Adequate recorded response. |
| `license-daily-check` | PASS | Adequate recorded response. |
| `recipe-controls` | PASS | Adequate. |

The clean full gate also passed: 14 Vitest tests, production build, 46 Playwright tests, `npm run lint`, and a second `npm run build`. Built JS is 37.17 kB raw / 12.64 kB gzip; CSS is 16.68 kB raw / 4.43 kB gzip.

## 7. History recheck

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The prior handoff and all nine verification reports were read. Recheck status:

| Earlier issue | Current evidence |
| --- | --- |
| First-install offline failure | Fixed: clean claim and live offline reload pass. |
| Wrong/disabled checkout URL | Visible live link is enabled and uses the production product-scoped URL. External redirect was not contacted under the resource restriction; provider/refund claims remain F-1-4. |
| Missing cache and browser headers | Fixed live. |
| License verification failed open | Fixed in code and fixture tests: only a cached valid verdict unlocks Studio. |
| Start-number bounds | Fixed and tested. |
| Skip focus and undersized controls | **Partly fixed; rendered Download WAV links remain 42 px. F-1-5 reopens the prior P2.** |
| Flaky offline test | Passed repeatedly in this review. |
| Missing claims/demo files and one-click sample | Fixed. |
| Missing robots, sitemap, and designed 404 | Fixed live. |
| Missing social/icon metadata | Fixed live. |
| Missing legal/404 route shell and metadata | Fixed live. |
| `npm test` timeout | Fixed; full clean gate passed. |
| Incomplete copy audit | **Partly fixed; F-1-6 reopens the prior P2.** |

## 8. Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route have `lang=en`, one H1, one main landmark, route-specific titles/descriptions/canonicals/OG/Twitter data, local favicons, shared header/footer, Privacy, Terms, and build ID.
- Unknown paths return the designed Wrapline 404 document with HTTP 404. The expected browser resource message for the missing top-level document is the only console error on that route.
- Every same-origin page, metadata image, icon, manifest, robots file, sitemap, and explicit `404.html` returned 200.
- Deep links and Back restore the correct URL and section. Focus/announcement remains F-1-8.
- The supplied URL verifier passed with no root-page console errors. Live Axe scans of all five route types found zero serious/critical violations.
- Reduced-motion styles are present. The after-render touch target failure is F-1-5.
- The risograph finishing-bench identity is distinct and consistent with `.factory/design.md`: flat paper/ink palette, cut-paper geometry, product-specific art, compact production marks, and no generic gradient-card template.

## 9. What would make this perfect

Resolve every finding above, then rerun the review from a fresh context. A perfect round would make the concrete intro/outro/music-bed job explicit in the first mobile screen, prove actual MP3 input and every loudness statement, remove or test every unlisted claim, bring rendered controls to 44 px, replace metaphorical/inconsistent copy, announce route changes, and offer MP3 delivery or document why the brief intentionally ends at WAV. The acceptance target is zero remaining findings and no untested claim.
