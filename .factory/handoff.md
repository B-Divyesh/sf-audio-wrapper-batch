# Wrapline repair handoff — PASS

- **Work order:** `audio-wrapper-batch-repair-7`
- **Verifier report:** `9e272697188ec26d47f1cb55436c0d01482755c2`
- **Repaired candidate:** `a34d9b2fa83b71e58230506cff783bb1bc3b01da`
- **Repair implementation:** `0b8d6a5`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Date:** 2026-08-30 UTC

## Result

**PASS.** Both P1 findings in `.factory/verification-7.md` are repaired. Privacy, terms, and the real 404 now use the same accessible header/footer shell as the app and publish complete route-specific metadata. No previously passing audio, demo, storage, privacy, offline, licensing, or response-policy behavior regressed.

## Failure reproduction

The candidate was built before implementation and served through `scripts/static-server.mjs`. A Playwright probe against `/privacy/`, `/terms/`, and `/missing-qa-wrapline-7` reproduced the report exactly. Each response had zero skip links, zero header navigation landmarks, zero footer build IDs, and no canonical, Open Graph title, or Twitter card. The unknown route correctly returned HTTP 404 while exhibiting the same shell/metadata omissions.

The new browser regression, `every public route has the shared keyboard shell and route metadata`, was then run against that broken artifact and failed before the implementation changed.

## Repairs

- Added the shared Wrapline wordmark, three-link production navigation, visible-on-focus skip link, complete footer, Param Factory attribution, and `Build 1.0.0-r7` to landing, demo, privacy, terms, and 404.
- Added a small static route-shell script so the legal and 404 skip links move keyboard focus to `main`, not just scroll to it.
- Added route-specific descriptions, canonicals, Open Graph data, Twitter card data, icons, and manifest links to privacy, terms, and 404.
- Made `/demo` update description, canonical, Open Graph URL/title/description, and Twitter title/description at runtime.
- Kept the 404 as a real HTTP 404, replaced its metaphorical heading with a direct recovery message, and retained the product-specific risograph waveform treatment.
- Added `legal.css` and `route-shell.js` to the versioned offline shell.
- Added exact desktop and 390 px regression coverage for all five routes: status, title, description length, canonical, Open Graph, Twitter card, one H1, main landmark, shared navigation/footer/build ID, visible focus, skip activation, horizontal overflow, serious/critical Axe findings, console errors, and page errors.
- Recorded the legal/404 visual treatment in `.factory/design.md` and updated the landing copy audit for the shared footer.

## Local verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run lint
npm run build
npm run verify:release
```

Observed results:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- `npm test`: 10 Vitest unit/release tests and 40 Playwright tests passed across desktop Chromium and 390 × 844 mobile.
- Every one of the 11 commands in `.factory/claims.json` passed exactly as written on both Playwright projects.
- `npm run lint`: TypeScript check passed.
- `npm run build`: `dist/index.html` emitted at the required root. Initial JS is 37,192 bytes raw / 12.64 KB gzip; CSS is 16,681 bytes raw / 4.43 KB gzip; hero WebP is 114,016 bytes.
- `npm run verify:release`: registered `audio-wrapper-batch` Studio identity verified at USD 29, followed by a successful production build.
- Reduced-motion desktop and mobile screenshots of privacy, terms, and 404 were inspected. Each had zero horizontal overflow at 390 px.
- Local Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100.

## Deployment and live evidence

The built `dist/` artifact was deployed only to the existing `sf-audio-wrapper-batch` Azure Static Web App. No shared service, database, key vault, DNS resource, or unrelated app was read or changed.

- Factory `verify-url.sh`: HTTP 200; 726 ms load; no console errors; `lang=en`; one H1; main present; no missing alt text; no unnamed buttons. Evidence is in `.factory/evidence/`.
- Live routes: `/`, `/demo`, `/demo/`, `/privacy/`, and `/terms/` return 200; an unknown route returns the designed document with HTTP 404.
- Live desktop and 390 px route audit: all five pages passed shell, metadata, skip-focus, overflow, and serious/critical Axe checks. Address-bar navigation and Back returned to the correct route.
- Live demo: rendered three sample tracks into three playable WAV previews and the receipt ZIP; every observed HTTP request stayed on the product origin.
- Live offline check: after service-worker activation, an offline `/demo` reload retained the H1, offline status, and three sample tickets.
- Update path: emitted worker handles `SKIP_WAITING`; the app exposes the waiting-worker `Update now` status action and reloads after `controllerchange`.
- Response policy: HSTS, restrictive CSP with `frame-ancestors 'none'`, `nosniff`, frame denial, strict-origin referrer policy, and permissions policy all present.
- Cache policy: hashed JS/CSS are immutable for one year; `sw.js` is `no-cache, no-store, must-revalidate`.
- Identity: live `index-DiXxLO4S.js` and `index-CM7P_j1e.css` SHA-256 values exactly match the fresh local build (`4fed84bc435e…` and `935b01aa0ee4…`).
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; FCP 1.0 s, LCP 1.6 s, total blocking time 20 ms, CLS 0.

## Known gaps and next step

No release-blocking gap is known. Chromium reports the intentional top-level 404 response as a network resource error; the route regression permits only that expected browser message and still requires zero script or page errors.

Next: independently verify the pushed repair commit and deployed candidate.
