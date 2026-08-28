# Wrapline

Wrapline is a local-first batch audio finishing PWA for independent podcasters, radio makers, and course creators. Save an intro, outro, music bed, loudness target, and filename pattern as a reusable recipe; then turn a queue of finished WAV/MP3 voice tracks into a reviewable WAV batch and production receipt.

Live product: <https://audio-wrapper-batch.sociobot.in>

## What it does

- Reads WAV and MP3 voice tracks without uploading or modifying the originals.
- Persists versioned recipes—including their intro, outro, and bed audio—in IndexedDB.
- Applies a disclosed RMS-based loudness adjustment, automatic bed ducking, and sample-peak protection.
- Renders 48 kHz, 16-bit PCM WAV files with in-browser previews.
- Downloads the whole batch as a ZIP with a JSON receipt containing names, gain decisions, limiter state, and SHA-256 source hashes.
- Exports/imports portable recipe JSON so users own their setup.
- Installs as a PWA and renders while offline immediately after its first installation.
- Includes a useful free tier (one saved recipe, three tracks per batch) and an optional $29 one-time Studio unlock.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the printed local URL. All audio work happens in the browser.

## Test and build

Playwright 1.58.2 is pinned. If its Chromium binary is not already present, run `npx playwright install chromium` once.

```sh
npm test          # unit + desktop/mobile browser, Axe, render, offline tests
npm run build     # reproducible static build in ./dist
npm run preview   # serve the production build locally
```

Deploy the contents of `dist/` as a static site; `dist/index.html` is the root entry point. Serve `/sw.js` without an immutable cache so updates can be discovered. The manifest, offline fallback, `/privacy/`, and `/terms/` are emitted with the build.

## Audio behavior and limits

Wrapline uses Web Audio APIs supplied by the browser. Codec decoding therefore varies by browser and operating system; conventional PCM WAV and MP3 are the supported inputs. Output is intentionally WAV only so the product does not ship or remotely call an encumbered encoder.

The loudness target is an RMS-derived integrated estimate, capped at ±12 dB. The final mix is scaled if sample peaks exceed −0.18 dBFS. It is not a broadcast-certified EBU R128 meter or true-peak limiter; this is stated next to the controls and in every receipt. Large batches are constrained by available device memory.

## Billing configuration

The app follows the Sociobot license-unlock contract and never embeds a payment provider. Production builds default to the production API, but the purchase CTA is deliberately withheld until the factory has registered this exact product slug in that environment. That prevents users being sent to an unregistered checkout. After registration, deploy with:

```sh
VITE_BILLING_BASE=https://api.sociobot.in VITE_STUDIO_CHECKOUT_ENABLED=true npm run build
```

For pilot/staging, explicitly set `VITE_BILLING_BASE=https://pilot-api.sociobot.in` and enable the CTA only after the pilot product is registered. The product slug is `audio-wrapper-batch`; no provider product ID or secret is stored in this repository. Returned tokens live under `sb_license:audio-wrapper-batch` in localStorage and are verified at most once per day. Audio and recipes are never sent during verification.

## Project notes

- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build/verification handoff: [`.factory/handoff.md`](.factory/handoff.md)
- Privacy policy: [`public/privacy/index.html`](public/privacy/index.html)
- Terms: [`public/terms/index.html`](public/terms/index.html)

Licensed under the MIT License. See [`LICENSE`](LICENSE).
