# Wrapline copy audit

Audited 2026-09-02 after polish round 5. Scope: every visitor-visible sentence, heading, control label, option, status, error, and route metadata description; every README sentence and heading; and all privacy, terms, offline, and 404 prose. Hyphenated terms count as one word. Every sentence is at most 22 words. No banned marketing word remains. Claim IDs refer to `.factory/claims.json`.

## Landing and app sentences

| Copy | Words | Claim / result |
| --- | ---: | --- |
| You’re offline. | 2 | `offline-demo` |
| Local audio processing still works offline. | 6 | `offline-demo` |
| License checks need a connection. | 5 | present limitation |
| Demo — sample data, nothing is saved to your real data. | 10 | `demo-isolation` |
| Three short sample tracks are ready to render. | 8 | `demo-sample-data` |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 | `audio-behavior`, audience named |
| Opens three ready-to-render voice tracks. | 5 | `demo-sample-data` |
| The saved Signal Desk recipe has an intro, outro, music bed, and three voice tracks. | 14 | `demo-sample-data` |
| Audio stays on this device. | 6 | first-screen privacy fact; `local-audio` |
| Demo renders offline after the first visit. | 7 | first-screen offline fact; `offline-demo` |
| Free: 3 tracks · Studio: $29 once. | 6 | first-screen price fact; `free-tier`, `studio-license` |
| Intro, voice, outro, and music bed. | 7 | clear |
| Choose the added audio once, then review and download each rendered batch. | 12 | `wav-receipt`, `mp3-output` |
| Used in filenames and receipts. | 5 | clear |
| Added to the queue next. | 6 | clear |
| Choose WAV for editing or MP3 for publishing. | 8 | clear choice guidance |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 | `audio-behavior` |
| Intro and outro files keep their original level. | 8 | `audio-behavior` |
| The music bed drops by 7 dB under voice. | 9 | `audio-behavior` |
| Sample peaks stay below −0.18 dBFS. | 6 | `audio-behavior` |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 | limitation |
| WAV output is 48 kHz, 16-bit PCM. | 7 | `audio-behavior` |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 | `mp3-output` |
| Added voice tracks appear here. | 5 | clear empty state |
| Add WAV or MP3 files to begin. | 7 | clear empty state |
| Free batches include up to 3 tracks. | 7 | `free-tier` |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 | `source-receipt` |
| No batches rendered on this device yet. | 7 | clear empty state |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 | `local-recipes`, `recipe-controls` |
| Every source gets a predictable output name and an audio player after rendering. | 12 | `wav-receipt`, `mp3-output` |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 | `wav-receipt`, `mp3-output` |
| The free tier saves one recipe and renders three tracks per batch. | 12 | `free-tier` |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on this device. | 13 | `studio-license`, `studio-unlimited` |
| Add intros, outros, and music to many voice tracks. | 9 | core workflow |
| A fresh version is ready. | 5 | clear update state |
| Sample batch ready: three short voice tracks with an intro, outro, and music bed. | 14 | `demo-sample-data` |

## Interactive messages and errors

| Copy template | Words | Result |
| --- | ---: | --- |
| Give this recipe a name. | 5 | names the problem |
| The filename recipe must include `{source}`. | 6 | names the fix |
| Start number must be a whole number from 0 through 9999. | 11 | names bounds |
| No supported audio found. | 4 | followed by recovery |
| Choose WAV or MP3 files. | 5 | recovery |
| Some files were skipped because they were not WAV or MP3. | 11 | reason included |
| `{count}` tracks added. | 3 | success |
| That is not a Wrapline recipe export. | 7 | reason included |
| The free tier holds one saved recipe. | 7 | `free-tier` |
| Load it to update it, or buy Studio for more recipes. | 11 | recovery |
| Imported “`{recipe}`” with its audio assets. | 6 | success |
| This free batch has more than 3 tracks. | 8 | `free-tier` |
| Remove extras or unlock unlimited batches. | 6 | recovery; literal license action |
| The recipe could not be read. | 6 | error |
| Review its fields and try again. | 6 | recovery |
| Audio stays on this device while the batch renders. | 9 | `local-audio` |
| This track could not be rendered. | 6 | error |
| Choose a standard WAV or MP3 file and try again. | 10 | recovery |
| `{complete}` of `{total}` tracks rendered. | 5 | progress |
| Review them above or download the batch. | 7 | next action |
| Nothing rendered. | 2 | error |
| Check the error on each track and try another WAV or MP3. | 12 | recovery |
| Could not reset the demo. | 5 | error |
| Try closing another demo tab. | 5 | recovery |
| Could not leave the demo. | 5 | error |
| Choose a WAV or MP3 intro, outro, or music bed file. | 11 | recovery |
| `{file}` added to the recipe. | 5 | success |
| Save to keep it on this device. | 7 | next action |
| `{layer}` cleared. | 2 | success |
| Save to keep this change. | 5 | next action |
| Loaded “`{recipe}`”. | 2 | success |
| A new recipe is ready. | 5 | state |
| The free tier holds one recipe. | 6 | `free-tier` |
| Saved “`{recipe}`” as version `{number}` on this device. | 8 | `local-recipes` |
| The recipe could not be saved because local storage failed. | 10 | error reason |
| Check browser storage and try again. | 6 | recovery |
| Delete “`{recipe}`” and its saved intro, outro, and music bed files from this device? | 14 | specific confirmation |
| Recipe deleted. | 2 | success |
| Portable recipe exported with its audio assets. | 7 | `recipe-controls` |
| The recipe could not be exported. | 6 | error |
| The recipe file could not be imported. | 7 | error |
| Choose a Wrapline recipe JSON file. | 6 | recovery |
| Track removed from the queue. | 5 | success |
| Unlimited batches and recipes are unlocked on this device. | 9 | `studio-unlimited` |
| License no longer active. | 4 | state |
| You can restore another license below. | 6 | recovery |
| Paste the license token from your purchase email. | 8 | recovery |
| Checking license… | 2 | progress |
| License verified. | 2 | success |
| Unlimited batches and recipes are active. | 6 | `studio-unlimited` |
| That license could not be verified. | 6 | error |
| Check the token and try again. | 6 | recovery |
| Local storage could not open. | 5 | error |
| Private browsing settings may prevent saved recipes. | 7 | reason |
| Restore a current license to unlock Studio. | 7 | recovery; literal license action |

## Headings, controls, labels, and options

All are sentence-case action labels or short nouns. Counts include visible words only.

| Group | Exact copy (word count) | Result |
| --- | --- | --- |
| Navigation | Audio setup (2); How it works (3); License (1); Privacy (1); Terms (1) | clear destinations |
| Main headings | Add intros and outros to voice tracks (7); Signal Desk sample workspace (4); Save intro, outro, music bed, and filename (9); Audio recipe (2); Voice queue (2); Recent receipts (2); Create a finished batch in three steps (7); Remove batch and recipe limits (5) | clear, ordered H1→H2→H3 |
| Step headings | Add intro, outro, and music (6); Review each rendered track (4); Download the batch (3) | verb-led |
| Primary actions | Try it with sample data (5); Set up a real batch (5); Save recipe (2); Render batch (2); Download WAV (2); Download MP3 (2); Download batch ZIP (3) | result named |
| Demo and install | Reset demo (2); Start for real (3); Install app (2); Install update (2) | result named |
| Recipe actions | Create new recipe (3); Export recipe JSON (3); Import recipe JSON (3); Delete recipe (2); Download receipt JSON (3) | result named |
| License actions | Buy Studio license · $29 (external checkout) (6); Verify license (2) | result, price, and external destination named |
| File actions | Clear intro (2); Clear outro (2); Clear music bed (3); Remove `{filename}` (2) | accessible names are specific |
| Field labels | Saved recipe (2); Recipe name (2); Intro optional (2); Outro optional (2); Music bed optional (3); Music bed level (3); Voice target (2); Output format (2); MP3 bitrate (2); Filename recipe (2); Start number (2); Already bought? Paste license (4) | every input has a bound label |
| Options | New recipe (2); −16 LUFS · podcast (3); −19 LUFS · mono voice (4); −14 LUFS · course/video (3); WAV · 48 kHz, 16-bit (4); MP3 · 48 kHz (3); 128 kbps (2); 192 kbps (2) | factual bitrate labels; `mp3-output` checks the selected constant bitrate |
| Status fragments | On device (2); Offline ready (2); Unsaved (1); Waiting (1); Rendered · `{seconds}` s (2); Rendering… (1); Preparing… (1); Batch complete (2); Studio license active (3) | one term, “render,” is used for processing |

## README sentences

| Sentence | Words | Claim / result |
| --- | ---: | --- |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 | core workflow, `wav-mp3-input` |
| Render each batch as WAV or MP3 without uploading audio. | 10 | `wav-receipt`, `mp3-output`, `local-audio` |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 | audience |
| Try it with sample data opens the Signal Desk workspace with three ready-to-render voice tracks at `/demo`. | 15 | `demo-sample-data` |
| The same isolated sample opens at `/?demo=1`. | 7 | `demo-sample-data` |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 | `demo-isolation` |
| The demo never reads or changes real Wrapline data. | 9 | `demo-isolation` |
| Reset demo clears and reloads the sample. | 7 | `demo-sample-data` |
| Start for real clears the demo namespace and opens an empty setup. | 11 | `demo-isolation` |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 | documentation pointer |
| Accepts WAV and MP3 voice tracks. | 6 | `wav-mp3-input` |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 | `audio-behavior`, `local-recipes` |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 | `audio-behavior`, `mp3-output` |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 | `wav-receipt`, `mp3-output` |
| Stores recipes with their added audio and receipts in this browser. | 10 | `local-recipes` |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 | `recipe-controls` |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 | `local-audio` |
| Reloads the installed demo offline after its first visit. | 9 | `offline-demo` |
| Saves one recipe and renders three tracks per batch for free. | 11 | `free-tier` |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 | `studio-license`, `studio-unlimited` |
| The purchase link opens the external Sociobot checkout. | 8 | `studio-license` |
| Open the printed local URL. | 5 | instruction |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 | instruction |
| Deploy `dist/` as the static output. | 6 | instruction |
| Browser and operating-system codec support can vary. | 7 | limitation |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 | `audio-behavior` |
| Intro and outro levels remain unchanged. | 6 | `audio-behavior` |
| The music bed drops 7 dB under voice. | 8 | `audio-behavior` |
| Sample peaks remain below −0.18 dBFS. | 6 | `audio-behavior` |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 | limitation |
| Review each rendered track before publishing. | 6 | safety instruction |
| See `THIRD_PARTY_NOTICES.md` for dependency provenance and licenses. | 8 | documentation pointer |
| See `LICENSE`. | 2 | documentation pointer |

README headings—Wrapline (1), Try it safely (3), What it does (3), Run locally (2), Test and build (3), Audio behavior (2), Privacy and legal (3)—all name their section. Command lines and link-only lines are not prose sentences.

## Catalog description

| Copy | Words | Result |
| --- | ---: | --- |
| Add intros, outros, and music to voice tracks, then export WAV or MP3 batches without uploads. | 17 | Verb-first, under 120 characters, plain wording; `wav-mp3-input`, output claims, and `local-audio` cover it. |

## Legal, offline, and not-found routes

| Route | Sentence inventory | Result |
| --- | --- | --- |
| Privacy | Your audio does not leave your device during a render. (10) · Wrapline decodes, mixes, previews, and packages files inside your browser. (10) · Recipe settings, intro, outro, music bed files, and receipts use local browser storage. (13) · Export recipe JSON downloads the current recipe and its audio files. (10) | `local-audio`, `local-recipes`, `recipe-controls` |
| Privacy demo | The sample demo uses separate names beginning with `demo:`. (9) · Reset demo and Start for real delete that demo namespace. (10) · The demo does not open or copy real Wrapline recipes, receipts, or license state. (14) | `demo-isolation` |
| Privacy license | When you verify a Studio license, Wrapline sends the token—not your audio—to the product verification URL. (16) · A completed check for the same token is reused for one day. (12) | `license-boundary`, `license-daily-check` |
| Privacy network | This version has no analytics, advertising, tracking pixels, third-party fonts, or runtime CDN scripts. (14) · A render sends no network requests outside Wrapline. (8) · The installed demo can render offline after its first visit. (10) | `local-audio`, `offline-demo` |
| Privacy choices | Delete an individual saved recipe in the app. (8) · Remove all local data using your browser’s site-data controls. (9) · Export recipes and receipts before clearing data if you want a copy. (11) | instructions |
| Privacy contact | Privacy questions can be sent through Sociobot (external site). (9) | contact instruction; the untestable future-policy promise was removed in round 3 |
| Terms use | You may use Wrapline to process audio you own or have permission to use. (14) · Check each output before publication and keep backups of source files and exported recipes. (13) | instruction |
| Terms audio | Wrapline accepts browser-decodable WAV and MP3 inputs. (7) · It exports 48 kHz WAV or MP3 at 128 or 192 kbps. (12) · Loudness uses an RMS-based estimate with a ±12 dB gain cap. (11) · Peak control is sample-based, not broadcast-certified EBU R128 or true-peak measurement. (11) · Browser codec support varies by operating system. (7) | `wav-mp3-input`, `mp3-output`, `audio-behavior` |
| Terms purchase | The free tier saves one recipe and renders up to three tracks per batch. (13) · A $29 one-time Studio license permits unlimited saved recipes and tracks per batch. (13) · Wrapline enables Studio only after a valid product-scoped license response. (10) | `free-tier`, `studio-license`, `studio-unlimited`, `license-boundary` |
| Terms limits | The software is provided “as is,” without warranties. (8) · Local processing can be limited by device memory, browser storage quotas, or unsupported or corrupt codecs. (14) | limitation |
| Terms conduct | Do not attempt to bypass license verification, misuse the billing service, or use the software unlawfully. (14) | instruction |
| Offline | Return to Wrapline to use saved recipes and render audio on this device. (12) · First-time visitors must reconnect once to install the app. (9) | `offline-demo`, recovery |
| Not found | This Wrapline page was not found. (6) · The address may be incomplete, or the page may have moved. (10) | clear error and recovery |
| Terms metadata | Read Wrapline’s terms for audio processing, output checks, free limits, Studio licensing, and availability. (13) | factual route summary; the stale unproved “refunds” topic was removed |

Legal headings and actions—Privacy for Wrapline, What stays local, Demo mode, License verification, Analytics and network use, Your choices, Contact, Terms for using Wrapline, Using Wrapline, Audio behavior, Studio purchase, Availability, Fair use, Privacy, Open your saved audio setup, Page not found, Return to Wrapline—are literal and under nine words.

## Terminology

| Concept | Required term |
| --- | --- |
| Saved setup | recipe |
| Input | voice track |
| Added audio | intro, outro, music bed |
| Processing verb | render / rendered |
| Group of outputs | batch |
| Production record | receipt |
| Isolated sample | demo |
| Paid license | Studio license |

The “risograph finishing bench” phrase remains only in the internal visual thesis and asset provenance. It is not used to explain product behavior or label navigation.
