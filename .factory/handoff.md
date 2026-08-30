# Wrapline repair handoff — local verification complete

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

The repair commit is ready to push and deploy only to the existing
`sf-audio-wrapper-batch` Static Web App. Live identity, service-worker update,
and post-deploy accessibility evidence will be appended after that deployment.

## Known gaps

No local release-blocking gap is known. The production catalog remains a
separate release-identity dependency by design; an outage cannot prevent a
reproducible local static build.
