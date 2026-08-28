# Wrapline repair-2 handoff — deployed, billing registration blocked

**Repair commit:** `94ccec9` (`fix: harden Wrapline release regressions`)

**Deployment:** <https://audio-wrapper-batch.sociobot.in> (Azure Static Web Apps deployment `61084451-c74e-4aee-826c-85df5ca8f0cb`)

## What changed

- Closed the fail-open Studio path. A pasted or returned token is locked until it has a cached positive Sociobot verification verdict. A prior valid cached verdict remains usable offline; an outage cannot grant Studio or bypass the three-track free limit.
- Enforced `start-number` as a whole number from `0` through `9999` before both save and render. The existing `9999` start value remains valid and subsequent rendered filenames may advance to `10000+`.
- Made the skip link move keyboard focus to the programmatically focusable main landmark, with an immediate orientation jump.
- Brought wrapper pickers, the queue chooser, disclosure summary, brands, and footer links to the 44 × 44 px target baseline. Replaced the clipped focusable JSON source input with a visible keyboard-operable Import JSON button.
- Hardened cache-first asset lookup with a canonical-path fallback and an explicit offline response; the first-install test waits for an activated controller and byte-bearing JS/CSS cache entries before disconnecting. The browser projects run serially to avoid concurrent service-worker lifecycle work on the shared preview origin.
- Added exact regressions: unit tests for unverified/cached-valid outage verdicts, and desktop + 390 px browser tests for outage-blocked four-track render, start-number save/render rejection, skip-link focus, target geometry, hidden import source, and fresh-install offline reload.

## Verification

Clean dependency install and local gates on 2026-08-28 UTC:

- `npm ci`: passed; 61 packages installed; `npm audit --omit=dev`: **0 vulnerabilities**.
- `npm test`: passed: **6 Vitest tests** and **16 Playwright tests** (8 desktop Chromium + 8 at 390 × 844). It includes Axe serious/critical scanning, real local WAV rendering, IndexedDB recipe persistence, fresh first-install offline reload, verification outage protection, and mobile keyboard/touch checks.
- `npm run lint` and `npm run build`: passed. `dist/` has `index.html` at its root.
- Production build budgets: JS **32.93 KB** raw / **11.45 KB** gzip; CSS **15.76 KB** raw / **4.30 KB** gzip; no shipped font payload; hero WebP remains **114,016 bytes**.
- Live factory smoke (`verify-url.sh`): HTTP 200; 725 ms observed load; no console/page errors; title, `lang=en`, one H1, main landmark, image alt text, and labelled controls confirmed.
- Live mobile Axe: **0 violations**, including **0 serious/critical**.
- Live Lighthouse 13.4.1 mobile: **100 performance / 100 accessibility / 100 best practices**; FCP 0.9 s, LCP 1.6 s, TBT 40 ms, CLS 0.
- Live fresh 390 px service-worker check: active controller, offline reload retained the H1 and visible offline banner.
- Live privacy request capture on a free-flow load recorded 4 same-origin requests and **no third-party requests**. There are no analytics, trackers, uploads, or CDN scripts/fonts.
- Live response policy: root `Cache-Control: no-cache`; hashed assets `public, max-age=31536000, immutable`; restrictive CSP, Permissions-Policy, `X-Frame-Options: DENY`, HSTS, and strict-origin referrer policy all present.
- Live identity: SHA-256 matched local `dist/` for `index.html`, `sw.js`, manifest, both icons, hero art, privacy, terms, and both fingerprinted JS/CSS assets.

This is a static PWA, not a package, CLI, or backend; package-consumer, server-concurrency, persistence-server, and health endpoint checks do not apply. The service-worker update protocol remains `skipWaiting` + `clientsClaim` with the in-app update toast; its existing implementation was retained, and the fresh-install/offline regression was rerun after the repair.

## Remaining external blocker

The application is intentionally safe, but it is **not release-ready as the contracted paid product** until factory billing registration is completed:

- Production catalog `GET https://api.sociobot.in/api/v1/products` still does not list `audio-wrapper-batch`.
- Safe checkout `HEAD https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout` still returns **404** after this deployment.
- Accordingly, the deployed CTA remains disabled and labelled “Studio checkout is preparing”; it does not send users to a dead checkout. The valid production billing base and restore/verify path are retained.

The missing factory command referenced by the paid-unlock work order (`fleet/new-paid-product.sh`) is not present in this worker image, and no registration endpoint/credential was supplied. Register the slug with product name **Wrapline Studio**, price **USD 29.00**, and return URL `https://audio-wrapper-batch.sociobot.in/`; verify that checkout redirects to the hosted Sociobot/Dodo page; then build with `VITE_STUDIO_CHECKOUT_ENABLED=true` and redeploy. No payment-provider secret belongs in this repository.
