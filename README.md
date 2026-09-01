# Wrapline

Add intros, outros, and music beds to WAV or MP3 voice tracks. Render each batch as WAV or MP3 without uploading audio.

Wrapline is for podcasters, radio makers, and course creators who repeat the same audio setup across many tracks.

Live product: <https://audio-wrapper-batch.sociobot.in> · [Try the sample batch](https://audio-wrapper-batch.sociobot.in/demo)

## Try it safely

**Try it with sample data** opens three ready-to-render voice tracks at `/demo`. The same isolated sample opens at `/?demo=1`.

Demo recipes, receipts, and license state use `demo:` storage names. The demo never reads or changes real Wrapline data.

**Reset demo** clears and reloads the sample. **Start for real** clears the demo namespace and opens an empty setup.

See [`.factory/demo.md`](.factory/demo.md) for the sample contents and storage boundary.

## What it does

- Accepts WAV and MP3 voice tracks.
- Adds a saved intro, outro, looping music bed, loudness target, and filename pattern.
- Exports 48 kHz WAV or MP3 at 128 or 192 kbps.
- Creates a ZIP with every rendered track and a JSON receipt.
- Stores recipes, added audio, receipts, and license state in this browser.
- Exports a recipe with its audio files and deletes saved recipes on request.
- Renders without analytics, trackers, runtime CDN scripts, or off-site audio requests.
- Reloads the installed demo offline after its first visit.
- Saves one recipe and renders three tracks per batch for free.
- Offers a $29 one-time Studio license for unlimited recipes and tracks per batch.

## Run locally

```sh
npm ci
npm run dev
```

Open the printed local URL. Use `/demo` for the isolated sample or `/` for your own audio.

## Test and build

```sh
npm test
npm run lint
npm run build
npm run verify:checkout
npm run verify:release
npm run preview
```

Deploy `dist/` as the static output.

## Audio behavior

Wrapline uses the browser Web Audio API. Browser and operating-system codec support can vary.

Voice loudness uses an RMS estimate with a ±12 dB gain cap. Intro and outro levels remain unchanged. The music bed drops 7 dB under voice. Sample peaks remain below −0.18 dBFS.

This is not a broadcast-certified EBU R128 meter or true-peak limiter. Review each rendered track before publishing.

MP3 output uses the bundled `@audio/encode-mp3` encoder. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for provenance and licenses.

## Privacy and legal

- [Privacy policy](public/privacy/index.html)
- [Terms](public/terms/index.html)
- [Visual thesis and art provenance](.factory/design.md)
- [Release handoff](.factory/handoff.md)

Wrapline is licensed under the MIT License. See [LICENSE](LICENSE).
