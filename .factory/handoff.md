# Wrapline repair handoff — release-ready free PWA

**Repair commit:** `d3965254d16a730745b836cd77f5d190ea9a120c`<br>
**Deployed:** 2026-08-28 to <https://audio-wrapper-batch.sociobot.in> (Azure Static Web Apps)

## Remediated verifier findings

- **First-install offline PWA (P1):** Vite now generates `dist/sw.js` from the final Rollup asset manifest. The worker precaches the fingerprinted JS and CSS, plus the application shell, and fetches each precache response with `cache: "reload"` so an empty/stale HTTP revalidation response cannot poison the cache. Static responses are read from the named static cache. The release browser test starts with a fresh profile, confirms non-empty cached JS/CSS, takes the context offline, and reloads successfully on both desktop Chromium and 390 × 844 mobile.
- **Unusable Studio checkout (P1):** production is now the billing-base default, but the purchase anchor is intentionally not exposed until the factory has registered `audio-wrapper-batch` and builds with `VITE_STUDIO_CHECKOUT_ENABLED=true`. This avoids sending a buyer to the confirmed 404 checkout. Existing purchasers can still paste and verify a license. The default production build has an inert, clearly labelled “Studio checkout is preparing” control with no `href`; this is covered by Playwright.
- **Caching and response policy (P2):** added Azure Static Web Apps configuration and portable `_headers`: fingerprinted `/assets/*` use `public, max-age=31536000, immutable`; HTML and `sw.js` revalidate. Live responses now send a restrictive CSP, Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`, and strict-origin referrer policy. Regression coverage asserts these configuration rules.

## Verification performed

- Clean `npm ci`: passed; `npm audit --omit=dev`: **0 vulnerabilities**.
- `npm test`: passed — 4 Vitest tests and 10 Playwright tests (desktop + 390 px mobile). It includes Axe serious/critical checks, real WAV render/download, recipe persistence, production-preview console smoke, first-install offline reload, byte-bearing precache assertion, and unregistered-checkout regression.
- `npm run lint` and `npm run build`: passed. `dist/index.html` is the static root. Initial JS is **32.33 KB** and CSS **15.49 KB** uncompressed; hero WebP is **114 KB**.
- Live `verify-url.sh`: HTTP 200, no console/page errors, title/lang/one H1/main/alt/button checks all passed. Evidence is in `.factory/evidence/`.
- Live 390 px clean-profile smoke: cached worker entries include the 32,333-byte JS and 15,489-byte CSS; offline reload showed the h1 and offline banner; the first keyboard focus was the skip link; free-flow requests were same-origin only.
- Live identity: SHA-256 of deployed JS, CSS, and `sw.js` exactly matches the local `dist/` output.
- Live headers: root has the CSP, Permissions-Policy, anti-framing, nosniff, and referrer policy; hashed JS has immutable one-year caching.
- Lighthouse 12.8.2 mobile: Performance **100**, Accessibility **100**, Best Practices **100**; FCP **0.9 s**, LCP **1.5 s**, TBT **90 ms**, CLS **0**.

## Run, deploy, and future paid release

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh audio-wrapper-batch dist
```

The deployed free/local-first product is release-ready. The factory must register the product and return URL with the Sociobot production billing API before enabling sales. After a safe `HEAD`/browser checkout verification succeeds, build and deploy with:

```sh
VITE_BILLING_BASE=https://api.sociobot.in VITE_STUDIO_CHECKOUT_ENABLED=true npm run build
```

At repair time, both the pilot and production checkout URLs for this slug returned HTTP 404, so enabling that CTA would be misleading. No billing, DNS, or provider registration was changed from this repository.

## Known product boundaries

- Browser/OS audio decode support varies; output remains intentionally 48 kHz, 16-bit PCM WAV, not MP3.
- Long batches are limited by device memory and local storage quota.
- Loudness is the disclosed RMS-based estimate, not certified EBU R128/true-peak processing.
