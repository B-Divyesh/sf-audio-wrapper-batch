# Wrapline

Wrapline batches finished voice tracks for independent podcasters, radio makers, and course creators. Add an intro, outro, music bed, loudness target, and filename recipe once; then render a reviewable WAV batch locally.

Live product: <https://audio-wrapper-batch.sociobot.in> · [Try the sample batch](https://audio-wrapper-batch.sociobot.in/demo)

## Try it safely

**Try it with sample data** opens a three-track `Signal Desk` batch at `/demo`. Demo recipes, receipts, and license state use `demo:` storage names, so the real bench is never read or changed. **Reset demo** and **Start for real** discard that demo namespace.

See [`.factory/demo.md`](.factory/demo.md) for the exact sample, URL, reset behavior, and storage boundary.

## What it does

- Offers WAV and MP3 voice input, then creates reviewable WAV outputs and a ZIP receipt.
- Records recipe version, source hash, output name, duration, gain, limiter state, codec, and measurement method.
- Saves wrapper recipes, wrapper audio, and receipts on the device.
- Exports a saved recipe with its wrapper audio and lets you delete it.
- Keeps demo rendering requests on the device; it has no analytics, trackers, third-party fonts, or runtime CDN scripts.
- Lets an installed demo reload offline after its first visit.
- Includes a free tier of one saved recipe and three tracks per batch.
- Offers a $29 one-time Studio license through Sociobot / Dodo for unlimited recipes and tracks per batch.
- Reuses a completed license check for the same token for one day.

Every visitor-facing promise is declared in [`.factory/claims.json`](.factory/claims.json) with an observable tagged browser test.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open the printed local URL. Visit `/demo` for an immediate sample batch or `/` to work with your own audio.

## Test, verify, and build

Playwright 1.58.2 is pinned. If Chromium is missing, run `npx playwright install chromium` once.

```sh
npm test                 # unit + production build + desktop/mobile Playwright + Axe
npm run lint             # TypeScript check
npm run build            # emit static production artifact to ./dist
npm run verify:checkout  # product-scoped hosted-checkout redirect check
npm run verify:release   # live checkout identity check, then production build
npm run preview          # serve ./dist locally
```

`npm run build` stays independent of a temporary catalog outage. It can always produce a reproducible static artifact.

Run `npm run verify:release` immediately before a release. It confirms that the product-scoped URL redirects to the hosted production checkout. The browser claim test checks the displayed $29 price and exact URL.

Deploy `dist/` as a static site with `dist/index.html` at its root. `staticwebapp.config.json` rewrites `/demo` and returns the dedicated 404 page for unknown URLs. It also supplies security headers and cache policy. Serve `sw.js` without immutable caching so updates can be discovered.

## Audio behavior

Wrapline uses Web Audio APIs supplied by the browser. WAV and MP3 decoding can vary by browser and operating system. Output is 48 kHz, 16-bit PCM WAV. Loudness uses an RMS-derived estimate capped at ±12 dB. Peak protection is sample-based, not a broadcast-certified EBU R128 meter or true-peak limiter. The same disclosure appears beside the controls and in every receipt.

## Privacy and legal

- [Privacy policy](public/privacy/index.html)
- [Terms](public/terms/index.html)
- [Visual thesis and art provenance](.factory/design.md)
- [Release handoff](.factory/handoff.md)

Licensed under the MIT License. See [LICENSE](LICENSE).
