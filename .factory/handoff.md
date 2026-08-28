# Wrapline repair handoff — ready to deploy

**Repair base:** `4171cdfc593d324f254238bacbbfa0b543dc0092` (failed candidate `176839c1033969b62a3fe7ccc91e27b912cb3fe1`)

**Release blocker repaired:** the production factory catalog now registers `audio-wrapper-batch` as **Wrapline Studio**, a USD 29 one-time product, with return URL `https://audio-wrapper-batch.sociobot.in/`. The public Sociobot catalog returns that exact product and `HEAD https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout` returns **303** to hosted `checkout.dodopayments.com`.

## Product changes

- `npm run build` now verifies the public product registration (slug, name, USD 29 price, and Sociobot checkout URL) before emitting the release bundle. It then sets `VITE_STUDIO_CHECKOUT_ENABLED=true`, so the product-specific checkout CTA is enabled only in a verified release build.
- Added the exact browser regression: the desktop and 390 px release build must show “Buy studio license · $29” linking to `https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout`, with no disabled state.
- Kept the existing privacy-safe behavior: checkout continues through Sociobot only; no provider ID, billing secret, tracker, audio upload, or runtime CDN was added to this repository.

## Verification completed before deployment

```sh
npm ci
npm test
npm run lint
npm run build
```

- Clean install: 61 packages installed; `npm audit` found 0 vulnerabilities.
- Unit/integration: 6 assertions passed (license outage safety, release headers, audio behavior).
- Production build: passed, including the public checkout-registration guard. Output is 32.89 KB raw / 11.47 KB gzip JS and 15.76 KB raw / 4.30 KB gzip CSS; hero WebP remains 114,016 bytes.
- Browser: 16 Playwright assertions passed across Chromium desktop and 390 × 844 mobile. These cover real local WAV rendering, recipe persistence, free-tier recovery, desktop/mobile checkout CTA, offline installed-shell reload, keyboard skip-link/focus, 44 px mobile controls, and axe serious/critical scans (0 violations).
- Response-policy regression test passed (CSP, Permissions-Policy, frame protection, immutable hashed assets, non-cacheable worker). The free local flow remains same-origin/blob only.
- Lighthouse was attempted with the pinned Playwright Chromium. The browser tab crashed during Lighthouse’s full-page screenshot phase, so no score is claimed; its accessibility coverage is independently supplied by the passing desktop and mobile axe scans.

## Deployment and final live verification

Deploy `dist/` as the existing static PWA using the work-order static configuration. After deployment, verify the live bundle identity, enabled checkout CTA, hosted checkout 303, desktop/390px browser smoke, headers, offline reload, and `/privacy/` and `/terms/` routes. No known product gaps remain before that final deployment check.
