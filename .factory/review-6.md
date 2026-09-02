# Adversarial first-read review 6 — Wrapline

**Reviewed:** 2026-09-02 UTC  
**Candidate:** `d203fbdab007ea34b213ec62182ea06e262ef0cd`  
**Live URL:** <https://audio-wrapper-batch.sociobot.in>

## Verdict: PASS

There are zero findings. The product was checked as a cold visitor, not as a diff-only review. All 17 declared claims passed independently from a clean clone, and the live product is clear, tryable, local-first, and specific about its limits.

## 1. Cold first read

New browser contexts were used at scroll position zero with 390 × 844 and 1440 × 900 viewports.

| Viewport | What it does | Who it is for | First action | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Adds the same intro, outro, music bed, loudness, and filenames to voice tracks in a batch. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Pass. The result, “Opens three ready-to-render voice tracks,” and privacy, offline, and price facts are visible before scrolling. |
| 1440 × 900 | Adds intros and outros to many voice tracks, then renders a consistent batch. | Podcasters, radio makers, and course creators. | **Try it with sample data**. | Pass. The same job, audience, result, and facts are visible. |

The first mobile screen states: “Add intros and outros to voice tracks”; “For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks”; and “Opens three ready-to-render voice tracks.” These answer the three cold-read questions without relying on the visual metaphor.

## 2. Copy audit

Counts treat hyphenated terms and numbers as one word. The landing and README inventories below were checked against the current live text and source. No sentence exceeds 22 words. No jargon, unsupported marketing adjective, vague/mood heading, inconsistent term, or non-result-naming button was found.

### Landing sentences

| Sentence | Words |
| --- | ---: |
| Add intros and outros to voice tracks. | 7 |
| For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks. | 18 |
| Opens three ready-to-render voice tracks. | 5 |
| Audio stays on this device. | 6 |
| Demo renders offline after the first visit. | 7 |
| Free: 3 tracks · Studio: $29 once. | 6 |
| Intro, voice, outro, and music bed. | 7 |
| Choose the added audio once, then review and download each rendered batch. | 12 |
| Used in filenames and receipts. | 5 |
| Added to the queue next. | 6 |
| Choose WAV for editing or MP3 for publishing. | 8 |
| Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. | 13 |
| Intro and outro files keep their original level. | 8 |
| The music bed drops by 7 dB under voice. | 9 |
| Sample peaks stay below −0.18 dBFS. | 6 |
| This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. | 11 |
| WAV output is 48 kHz, 16-bit PCM. | 7 |
| MP3 output is 48 kHz at the selected constant bitrate. | 10 |
| Added voice tracks appear here. | 5 |
| Add WAV or MP3 files to begin. | 7 |
| Free batches include up to 3 tracks. | 7 |
| Each receipt records recipe version, source hashes, gain, limiter activity, and output names. | 13 |
| No batches rendered on this device yet. | 7 |
| Keep added audio, loudness, output format, and filenames together in one recipe. | 12 |
| Every source gets a predictable output name and an audio player after rendering. | 12 |
| Download one ZIP containing the selected audio format and a JSON receipt. | 12 |
| The free tier saves one recipe and renders three tracks per batch. | 12 |
| A $29 one-time purchase unlocks unlimited tracks and saved recipes on this device. | 13 |
| Add intros, outros, and music to many voice tracks. | 9 |
| A fresh version is ready. | 5 |
| Sample batch ready: three short voice tracks with an intro, outro, and music bed. | 14 |
| You’re offline. | 2 |
| Local audio processing still works offline. | 6 |
| License checks need a connection. | 5 |
| Demo — sample data, nothing is saved to your real data. | 10 |
| Three short sample tracks are ready to render. | 8 |
| The saved Signal Desk recipe has an intro, outro, music bed, and three voice tracks. | 14 |

The conditional validation, success, error, and output messages were also checked in `.factory/copy-audit.md`; all name the condition and next action where one is needed. Its terminology table consistently uses **recipe**, **voice track**, **intro/outro/music bed**, **render**, **batch**, **receipt**, **demo**, and **Studio license**.

### README sentences

| Sentence | Words |
| --- | ---: |
| Add intros, outros, and music beds to WAV or MP3 voice tracks. | 11 |
| Render each batch as WAV or MP3 without uploading audio. | 10 |
| Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks. | 18 |
| Try it with sample data opens the Signal Desk workspace with three ready-to-render voice tracks at `/demo`. | 15 |
| The same isolated sample opens at `/?demo=1`. | 7 |
| Demo recipes, receipts, and license state use `demo:` storage names. | 10 |
| The demo never reads or changes real Wrapline data. | 9 |
| Reset demo clears and reloads the sample. | 7 |
| Start for real clears the demo namespace and opens an empty setup. | 11 |
| See `.factory/demo.md` for the sample contents and storage boundary. | 9 |
| Accepts WAV and MP3 voice tracks. | 6 |
| Adds a saved intro, outro, looping music bed, loudness target, and filename pattern. | 13 |
| Exports 48 kHz WAV or MP3 at 128 or 192 kbps. | 11 |
| Creates a ZIP with every rendered track and a JSON receipt. | 10 |
| Stores recipes with their added audio and receipts in this browser. | 10 |
| Exports a recipe with its audio files and deletes saved recipes on request. | 13 |
| Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests. | 11 |
| Reloads the installed demo offline after its first visit. | 9 |
| Saves one recipe and renders three tracks per batch for free. | 11 |
| Offers a $29 one-time Studio license for unlimited recipes and tracks per batch. | 13 |
| The purchase link opens the external Sociobot checkout. | 8 |
| Open the printed local URL. | 5 |
| Use `/demo` for the isolated sample or `/` for your own audio. | 11 |
| Deploy `dist/` as the static output. | 6 |
| Browser and operating-system codec support can vary. | 7 |
| Voice loudness uses an RMS estimate with a ±12 dB gain cap. | 12 |
| Intro and outro levels remain unchanged. | 6 |
| The music bed drops 7 dB under voice. | 8 |
| Sample peaks remain below −0.18 dBFS. | 6 |
| This is not a broadcast-certified EBU R128 meter or true-peak limiter. | 11 |
| Review each rendered track before publishing. | 6 |
| See `THIRD_PARTY_NOTICES.md` for dependency provenance and licenses. | 8 |
| See `LICENSE`. | 2 |

Headings name their sections: **Try it safely**, **What it does**, **Run locally**, **Test and build**, **Audio behavior**, and **Privacy and legal**. Result-naming controls include **Try it with sample data**, **Set up a real batch**, **Save recipe**, **Export recipe JSON**, **Import recipe JSON**, **Render batch**, **Download WAV/MP3**, **Download batch ZIP**, **Reset demo**, **Start for real**, and **Buy Studio license · $29 (external checkout)**.

## 3. Demo and sandbox

- A single press of **Try it with sample data** opens `/demo`. A direct cold `/demo` load also opens the seeded Signal Desk workspace—not a second marketing screen.
- At 390 px, the initial demo viewport shows the persistent “Demo — sample data, nothing is saved to your real data” banner, **Reset demo**, **Start for real**, the named recipe, its intro/outro/music bed, and named queued voice tracks.
- An independent live demo render produced three audio previews and three **Download WAV** actions. The request log contained no cross-origin request.
- `@claim:demo-isolation` passed from a clean clone. It snapshots real IndexedDB and non-demo local storage, mutates/render/resets/leaves demo, then verifies the real snapshot is unchanged and the demo namespace is removed.
- `@claim:offline-demo` passed in its own browser context after service-worker installation and offline reload/render. `@claim:local-audio` passed with same-origin-only HTTP requests during the whole demo render.

## 4. Claims

Each exact command in `.factory/claims.json` was run independently in `/tmp/wrapline-review6-LPFm4D/repo`, a clean `git clone --no-local` with `npm ci --include=dev`. Each command builds first and its two browser projects passed.

| Claim ID | Result |
| --- | --- |
| `demo-sample-data` | PASS (2) |
| `demo-isolation` | PASS (2) |
| `local-audio` | PASS (2) |
| `offline-demo` | PASS (2) |
| `wav-mp3-input` | PASS (2) |
| `wav-receipt` | PASS (2) |
| `mp3-output` | PASS (2) |
| `audio-behavior` | PASS (2) |
| `source-receipt` | PASS (2) |
| `local-recipes` | PASS (2) |
| `free-tier` | PASS (2) |
| `studio-license` | PASS (2) |
| `studio-unlimited` | PASS (2) |
| `license-daily-check` | PASS (2) |
| `license-boundary` | PASS (2) |
| `recipe-controls` | PASS (2) |
| `route-shell` | PASS (2) |

The live landing, demo, privacy, terms, and README claim-like statements match entries in the ledger. No unlisted visitor-facing claim was found.

## 5. Earlier finding closure

Every finding in `review-1.md` through `review-5.md`, every polish record, and the prior handoff was read. The following confirms the original condition is fixed in current source and on the live site.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Phone first screen now gives the concrete job, audience, sample result, and three plain facts. |
| F-1-2 | The real MP3 fixture is decoded and rendered by `wav-mp3-input`. |
| F-1-3 | `audio-behavior` measures the disclosed gain cap, wrapper levels, ducking, peaks, rate, and depth. |
| F-1-4 | Current visitor claims map to the 17-entry ledger; unsupported merchant/refund assertions are absent. |
| F-1-5 | Rendered download controls remain at least 44 px high in the mobile test coverage. |
| F-1-6 | `.factory/copy-audit.md` inventories app, README, legal, state, control, and metadata copy. |
| F-1-7 | Live terminology consistently uses recipe, music bed, voice track, batch, receipt, and render. |
| F-1-8 | Live forward and Back navigation focuses and announces the H1. |
| F-1-9 | Demo renders both WAV and selected-bitrate MP3 with preview, download, and receipt evidence. |
| F-1-10 | Current controls name their results and destructive/file controls have specific accessible names. |
| F-2-1 | Artwork provenance remains repository documentation, not visitor-facing product copy. |
| F-2-2 | The bitrate choice says the factual “192 kbps,” without a quality assertion. |
| CTRL-2-1 | The full clean suite completes its 12 browser shards; the offline test owns a context. |
| F-3-1 | The demo banner is valid `div[role=status]`; the route test includes zero Axe violations. |
| F-3-2 | The untestable future privacy-policy statement is absent from live privacy copy. |
| F-4-1 | `/demo` directly opens the seeded workspace in its first viewport. |
| F-4-2 | Current visitor copy uses “music bed” consistently. |
| F-4-3 | The purchase action explicitly says “external checkout.” |
| F-5-1 | Recipe export/delete coverage uses intro, outro, and music-bed assets and verifies their bytes/statuses. |
| F-5-2 | Demo isolation now snapshots and preserves real recipe/assets/receipt/license state and deletes demo state. |
| F-5-3 | The storage statement is narrowed and verified for recipe assets and receipts. |
| F-5-4 | The cross-device wording is removed; the live copy correctly says “on this device.” |
| F-5-5 | Unverified implementation/license promises were removed from README. |
| F-5-6 | Offline copy only promises the verified current behavior. |
| F-5-7 | Phone first screen includes privacy, offline, and price facts. |
| F-5-8 | The fact markers are neutral outlined registration squares, not red negation marks. |

## 6. Structure, accessibility, and links

- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200. An unknown URL returned the designed 404 document with HTTP 404.
- Every route has the expected route-specific title, description, canonical, OG/Twitter metadata, favicon, one H1, `main`, consistent header/footer, Privacy and Terms links, and no load error on normal routes.
- `robots.txt` and `sitemap.xml` are present. All crawled internal links returned 200; the product-scoped checkout redirects as the explicitly labeled external action.
- Keyboard route navigation and Back focus the H1 and populate the polite route announcer. The 390 px layout has no horizontal overflow.
- The risograph audio-finishing bench is visibly product-specific rather than a generic SaaS layout. The original bench art and restrained flat-ink system match the recorded design thesis.

## 7. Missed leverage

No missing obvious capability was found. The brief’s useful workflow—local WAV/MP3 input, reusable intro/outro/music-bed recipe, loudness/naming, WAV/MP3 delivery, receipt, and portable recipe import/export—is present. An AI step would be decorative here; deterministic audio assembly is the correct core workflow.

## What would make this perfect

Keep this exact acceptance bar in future changes: rerun every claim from a clean clone, retain the directly populated demo first viewport, and do not add a capability or promise unless its sandbox test and plain-language disclosure ship with it. No current change is required.
