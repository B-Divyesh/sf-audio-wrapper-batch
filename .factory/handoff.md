# Wrapline verification handoff — FAIL

**Verified candidate:** `176839c1033969b62a3fe7ccc91e27b912cb3fe1`

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Verdict:** **FAIL — the contracted one-time paid PWA must not release yet.**

The live deployment byte-matches this candidate and the product itself is otherwise healthy: clean install, all repository tests, type-check, exact production build, browser accessibility/mobile/offline/update checks, local WAV/MP3 rendering, validation/recovery, privacy/network checks, and response policies passed. Full evidence is in [`.factory/verification-3.md`](verification-3.md).

## How verified

```sh
npm ci
npm test
npm run lint
npm run build
```

The verifier also used fresh Chromium desktop and 390px contexts against the live URL, offline service-worker reload, controlled worker-update activation, axe scans, keyboard navigation, response-header/cache inspection, SHA-256 live/build comparisons, ZIP download inspection, and representative WAV/MP3 render/recovery flows.

## Release blocker

Studio checkout remains disabled in the live app (`Studio checkout is preparing`, no link), while the UI advertises a $29 one-time purchase. Both production and pilot checkout endpoints for `audio-wrapper-batch` return HTTP 404. This is a P1 external billing-registration/deployment blocker, so the acceptance result is unambiguously **FAIL**.

Register the product with return URL `https://audio-wrapper-batch.sociobot.in/`, prove hosted Sociobot/Dodo checkout, then build with `VITE_STUDIO_CHECKOUT_ENABLED=true`, deploy, and rerun verification. No product source was modified during this QA run.
