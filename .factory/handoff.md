# Wrapline repair handoff

- **Work order:** `audio-wrapper-batch-repair-5`
- **Repaired verifier candidate:** `b5f43e3fd5c2c437605b72c9acdde2a516c504dc`
- **Repair commit:** `06279748a2ac3258c7ac27c8ac42dcf08b2310bb`
- **Artifact:** static offline PWA; `dist/index.html` is the deployment root
- **Deployment:** `swa deploy dist --app-name sf-audio-wrapper-batch --resource-group sociobot --env production`; live URL is <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC

## What changed

1. Added the required one-click `/demo` sandbox. It loads the `Signal Desk` recipe with a deterministic intro, outro, bed, and three short named WAV tracks. The first screen now names independent podcasters, radio makers, and course creators and exposes **Try it with sample data**.
2. Isolated demo storage from real storage. Demo IndexedDB is `demo:wrapline-local`; demo license keys are `demo:sb_license:audio-wrapper-batch` and `demo:sb_license_verdict:audio-wrapper-batch`. Reset and Start for real delete only that namespace; no demo data is transferred to the real bench.
3. Added `.factory/claims.json`, `.factory/demo.md`, and a copy audit. Eleven observable claims have exactly one `@claim:<id>` Playwright regression, including same-origin request capture, offline reload in its own browser context, receipt hash, and purchase-link identity.
4. Removed the transient live-catalog dependency from `npm run build`. `npm run verify:checkout` remains the explicit live identity guard; `npm run verify:release` runs that guard before building. This preserves a deterministic static build while still preventing a release process from ignoring a bad registration.
5. Bounded license verification with a 4-second abort. A unit regression covers a fetch that never resolves; an E2E outage regression proves an unverified token stays locked and cannot bypass the free limit.
6. Added `robots.txt`, `sitemap.xml`, a dedicated `404.html`, and the Static Web Apps 404 rewrite. Added regression coverage for those release artifacts.
7. Preserved the existing local WAV batch workflow, saved recipes, free-tier guard, worker precache, update toast, header target sizes, keyboard skip target, privacy policy, and risograph visual system. Plain-language copy was tightened without changing the product scope.

## Verification evidence

Clean install and quality gates:

```text
npm ci --ignore-scripts        passed; 61 packages; audit 0 vulnerabilities
npm test                       passed; 9 Vitest assertions and 32 Playwright assertions
npm run lint                   passed (tsc --noEmit)
npm run build                  passed; emitted dist/
npm run verify:release         passed; catalog identity then build
npm audit --omit=dev           passed; 0 vulnerabilities
```

- All eleven commands named in `.factory/claims.json` passed during the repair audit; every tagged test runs on desktop and 390 × 844 mobile. The final complete `npm test` also passed after the last code change.
- Production output: JS **36,390 bytes raw / 12.48 KB gzip**; CSS **16,472 bytes raw / 4.39 KB gzip**; hero WebP **114,016 bytes**. These are within the static PWA budgets.
- Browser coverage: desktop Chromium and Pixel 5 at **390 × 844**; no horizontal overflow, keyboard skip link focuses `main`, desktop nav and visible mobile controls meet the 44 px checks, and reduced-motion coverage remains in the suite.
- Accessibility: repository Playwright Axe scans passed with **0 serious/critical violations** on desktop and mobile. `/opt/fleet/lib/verify-url.sh` passed locally: title, `lang=en`, one H1, main landmark, image alt, labelled buttons, and no console/page errors. The standalone `@axe-core/cli` could not launch its Selenium Chrome binary in this container; this does not replace the passing Playwright Axe integration.
- Privacy: `@claim:local-audio` records requests through a full demo render and permits only same-origin HTTP requests. Audio previews and downloads use browser `blob:` URLs. No analytics, audio upload, tracker, CDN font, or runtime third-party script is present.
- Offline and update: `@claim:offline-demo` uses a dedicated browser context, verifies byte-bearing JS/CSS cache entries, sets the context offline, and reloads `/demo` with its H1, offline banner, and three queued tracks. A separate controlled test against a temporary copy of `dist/` changed only `sw.js`; the update toast appeared, **Update now** activated the waiting worker, reloaded, and ended with `{ waiting: false, active: "activated", toastHidden: true }`.
- Response policy: source tests confirm the Static Web Apps CSP, frame protection, permissions policy, no-cache worker policy, immutable fingerprinted assets, crawl metadata, and 404 rewrite. Local production preview returned 200 for `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, and `/404.html`.
- Live identity: `https://api.sociobot.in/api/v1/products` returned the registered `Wrapline Studio`, USD **29.00**, with the expected production checkout URL. A safe HEAD request to `/api/v1/products/audio-wrapper-batch/checkout` returned **303** to hosted Dodo checkout.
- Live deployment: Azure Static Web Apps accepted the production deployment and returned `https://kind-dune-07185b90f.7.azurestaticapps.net`. The custom-domain shell now references `assets/index-D50TPNPT.js`, and `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, and `/404.html` each return 200. The deployed root retains no-cache HTML, restrictive CSP, Permissions-Policy, X-Frame-Options, nosniff, and strict referrer policy. A fresh live 390 × 844 Playwright/Axe smoke found one H1, the demo banner, three sample tracks, no console errors, zero serious/critical violations, and no horizontal overflow.

## Known gap

Lighthouse 13 was attempted twice with the repository-pinned Chromium. Its automatic launch could not connect, and a manually launched remote-debugging instance crashed the Lighthouse tab. No score is claimed from this container. The production bundle budgets, browser performance smoke checks, and independent desktop/mobile tests pass; rerun Lighthouse in the deployment runner before publishing a numeric score.

## Run and deploy

```sh
npm ci --ignore-scripts
npm test
npm run verify:release
# deploy dist/ as the static artifact
```

`npm run build` remains available during a temporary catalog outage; use `npm run verify:release` for the release-time identity check. No infrastructure, DNS, billing registration, or secret was changed in this repository.
