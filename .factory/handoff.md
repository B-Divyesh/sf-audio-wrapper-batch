# Wrapline repair handoff — PASS

- **Work order:** `audio-wrapper-batch-repair-8`
- **Base candidate:** `757b58059ef496837a6ad8cbd2b8226a78d75156`
- **Artifact class:** static, offline-capable PWA (`dist/` with `index.html` at its root)
- **Date:** 2026-08-30 UTC

## Failure reproduction and root cause

The historical failing builder command was not a Vite failure. It put the live
Studio catalog preflight inside `npm run build`:

```sh
npm run lint && npm run verify:checkout && VITE_STUDIO_CHECKOUT_ENABLED=true vite build
```

In a disposable clean clone at the source revision that introduced that command
(`85061e38909e39f34525510edd50ff27063f4f97`), this exact outage simulation
reproduced the failure:

```sh
npm ci
VITE_BILLING_BASE=http://127.0.0.1:9 npm run build
# Error: Studio product catalog could not be reached at
# http://127.0.0.1:9/api/v1/products: fetch failed
# exit 1
```

The failed candidate already contained the source-level repair: `build` runs
the TypeScript check and Vite only, while `verify:release` retains the explicit
live checkout-identity preflight. What was missing was executable coverage of
that boundary, so an accidental re-coupling could return the same outage
failure without a test catching it.

## Repair

- Added the focused release regression `runs the exact production build during
  a checkout-catalog outage`.
- It invokes the real `npm run build` with the catalog deliberately pointed at
  unreachable loopback, requires exit code 0, and asserts that `dist/index.html`,
  `dist/sw.js`, and `dist/staticwebapp.config.json` were emitted.
- Live checkout identity remains an intentional separate command:
  `npm run verify:release`.

## Local verification

All checks were run from the repair worktree after `npm ci` (61 packages; zero
audit vulnerabilities):

- `npm run test:unit` — 11 assertions passed, including the outage regression.
- `npm run build` — passed; emitted the required static artifact.
- `npm test` — 11 Vitest assertions and 40 Playwright desktop/mobile checks
  passed. This covers WAV rendering, demo isolation, keyboard skip/focus,
  390 × 844 layout, serious/critical Axe findings, route metadata, privacy
  request capture, and a fresh-context offline reload.
- Every one of the 11 commands declared in `.factory/claims.json` passed
  exactly as written, each after a production build.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4175/ …` passed locally:
  535 ms load; no console errors; `lang=en`; one H1; main landmark; no missing
  image alt text or unlabeled buttons. Local route statuses were 200 for `/`,
  `/demo`, `/demo/`, `/privacy/`, and `/terms/`, with a designed 404 for an
  unknown URL.

The final build emitted 37,192 bytes of JavaScript (12.64 KB gzip), 16,681
bytes of CSS (4.43 KB gzip), a 3,143-byte service worker, and a 114,016-byte
hero WebP.

## Deployment

Commit `f351470` was pushed to `main`, rebuilt, and deployed only to the
existing `sf-audio-wrapper-batch` Static Web App. The deployment used its
target-scoped deployment token directly; no DNS, database, key vault, billing,
or unrelated resource was read or changed.

- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- The Static Web Apps deployment CLI completed successfully to the existing
  production app.
- Factory `verify-url.sh` passed: HTTP 200; 787 ms load; no console errors;
  `lang=en`; one H1; main landmark; no missing alt text or unlabeled buttons.
- Live `/`, `/demo`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An
  arbitrary missing URL returned the designed document with HTTP 404.
- Fresh live desktop and 390 × 844 Chromium checks passed on all five routes:
  keyboard skip-to-main focus, no horizontal overflow, and zero serious or
  critical Axe violations. The only console message was Chromium's expected
  top-level 404 resource message.
- The live demo rendered three sample tracks without a cross-origin HTTP
  request, then reloaded offline with the offline notice and all three tickets.
- The live JS and CSS SHA-256 values exactly match the fresh local build:
  `index-DiXxLO4S.js` `4fed84bc435e7ece53b19f252772470ee032edbfa9246262819964d4be51a5f0`
  and `index-CM7P_j1e.css` `935b01aa0ee43f346e2b0b7c5c88f9ed059df197937cdf7ea015c0b9c01a2658`.
- The live worker declares `SKIP_WAITING`, `skipWaiting()`, and
  `clients.claim()`. It is served `no-cache, no-store, must-revalidate`; the
  fingerprinted application assets are immutable for one year.
- HSTS, restrictive CSP including `frame-ancestors 'none'`, permissions policy,
  `nosniff`, frame denial, and strict-origin referrer policy were all present.

## Known gaps

No local release-blocking gap is known. The production catalog remains a
separate release-identity dependency by design; an outage cannot prevent a
reproducible local static build.
