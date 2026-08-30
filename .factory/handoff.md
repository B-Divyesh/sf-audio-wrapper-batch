# Wrapline repair handoff — PASS

- **Work order:** `audio-wrapper-batch-repair-6`
- **Verifier candidate repaired:** `b3b1a9ddadc2315d992154480a23c4f53c7ae738`
- **Repair commits:** `c2ec200` and `b10bce3`
- **Artifact:** static offline PWA; deploy `dist/` with `dist/index.html` at its root
- **Production:** <https://audio-wrapper-batch.sociobot.in>
- **Deployed:** 2026-08-30 UTC with `swa deploy dist --app-name sf-audio-wrapper-batch --resource-group sociobot --env production`; Azure returned <https://kind-dune-07185b90f.7.azurestaticapps.net>

## What was repaired

1. Replaced the catch-all Static Web Apps `navigationFallback` with the one known app rewrite, `/demo` → `/index.html`. Unknown paths now reach the configured 404 response override instead of returning the app shell with HTTP 200.
2. Preserved the previously accepted `/demo/` spelling without adding a duplicate Static Web Apps route: the build emits `dist/demo/index.html`, while `/demo` remains the canonical rewrite. Azure's deploy validator accepts this configuration.
3. Added release-artifact regressions for an arbitrary missing route (status **404**, 404 title, heading, and recovery link), `/demo/`, and the emitted social/icon metadata.
4. Added product-specific Open Graph and Twitter metadata, a hand-authored SVG favicon, a 180 px Apple touch icon, and a **1200 × 630** `wrapline-social.jpg`. The social image is a crop composed from Wrapline's existing original Azure-generated finishing-bench artwork; its provenance is recorded in `.factory/design.md`.
5. Added the dependency-free production artifact server used by Playwright to exercise the same explicit-route/404 policy in `dist/staticwebapp.config.json`. Existing audio, demo, privacy, offline, license, accessibility, and visual behavior were preserved.

## Verification evidence

```text
npm ci                         PASS — 61 packages installed; audit reported 0 vulnerabilities
npm run lint                   PASS — tsc --noEmit
npm test                       PASS — 10 Vitest assertions and 38 Playwright checks
npm run build                  PASS — dist/ emitted
npm audit --omit=dev           PASS — 0 vulnerabilities
npm run verify:release         PASS — Wrapline Studio catalog identity, then production build
```

Every command declared in `.factory/claims.json` passed exactly as written, on both desktop Chromium and the 390 × 844 mobile project: `demo-sample-data`, `demo-isolation`, `local-audio`, `offline-demo`, `wav-mp3-input`, `wav-receipt`, `audio-behavior`, `source-receipt`, `local-recipes`, `free-tier`, and `studio-license`.

- **Routing / response policy:** the Azure Static Web Apps emulator served `/demo` **200**, `/demo/` **200**, and `/missing-qa-404-repair-6` **404** with `This page is not on the finishing bench.` Live production returned the same 200/200/404 statuses after deployment. The live 404 response has the expected CSP, HSTS, frame protection, referrer policy, permissions policy, and `nosniff` headers.
- **Metadata / assets:** live root HTML contains Open Graph title, description, URL, image, dimensions, and alt text; Twitter large-image metadata; `/favicon.svg`; and `/apple-touch-icon.png`. Live image checks returned `wrapline-social.jpg` **200**, **1200 × 630**, 195,804 bytes; Apple icon **200**, **180 × 180**; favicon **200**.
- **Desktop, mobile, keyboard, and accessibility:** `/opt/fleet/lib/verify-url.sh` passed on the live root in **616 ms** with no console/page errors, `lang=en`, one H1, main landmark, image alt text, and labeled buttons. Fresh live Playwright/Axe checks on `/demo` passed at 1366 × 900 and 390 × 844 with zero serious/critical violations, no console errors, three sample tracks, one H1, no horizontal overflow, and the demo banner. Desktop Tab reaches the skip link and Enter moves focus to `#main`.
- **Privacy:** the declared `@claim:local-audio` test records the full demo render and permits only same-origin HTTP requests; preview media uses browser `blob:` URLs. No analytics, trackers, CDN fonts, or runtime scripts were added.
- **PWA:** `@claim:offline-demo` uses a dedicated browser context, waits for byte-bearing shell assets, sets offline mode, reloads `/demo`, and passed with the heading, offline notice, and three sample tracks. A separate temporary-copy update test changed only `sw.js`; its UI showed the update toast, **Update now** activated the worker, and ended as `{"waiting":false,"active":"activated","controller":"activated","toastHidden":true}`.
- **Performance:** production JS is **36,392 bytes raw / 12.48 KB gzip** and CSS is **16,472 bytes raw / 4.39 KB gzip**; the 114,016-byte hero WebP and non-preloaded social image stay within the static-PWA budgets. Lighthouse was retried, but this container's Chromium 120 is rejected as too old by Lighthouse 13 and Lighthouse 12 could not establish a debugging connection. No Lighthouse score is claimed.
- **Live product identity:** `npm run verify:release` verified `Wrapline Studio`, USD **29.00**, at the registered production checkout URL. A final `HEAD https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout` returned **303** to hosted Dodo checkout.

## Run and deploy

```sh
npm ci
npm test
npm run verify:release
swa deploy dist --app-name sf-audio-wrapper-batch --resource-group sociobot --env production
```

## Known gap

No product or deployment gaps remain from verifier report 6. A numeric Lighthouse score should be collected in a runner with a supported Chrome version; the local bundle budgets and browser performance smoke checks pass.
