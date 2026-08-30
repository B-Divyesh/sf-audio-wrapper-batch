# Wrapline independent verification 5 handoff — FAIL

- **Work order:** `audio-wrapper-batch-verify-5`
- **Candidate:** `b5f43e3fd5c2c437605b72c9acdde2a516c504dc`
- **Artifact:** static offline PWA (`dist/`)
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Verified:** 2026-08-30 UTC

## Outcome

**FAIL — do not release.** This supersedes the prior PASS handoff. Fresh independent verification found that the deployed product matches the candidate and its free local audio workflow, offline reload, update mechanism, accessibility baseline, privacy request capture, security headers, cache policy, and bundle budgets are good. It does not meet the release contract because `.factory/claims.json` and all claim tests are absent, the mandatory one-click isolated sample-data demo is absent, and the exact production build fails while the Sociobot catalog returns HTTP 503. Checkout and license verification returned 503 too.

The detailed evidence and defects by severity are in `.factory/verification-5.md`.

## How verified

Fresh detached clone at the exact SHA:

```sh
npm ci --ignore-scripts
npm test
```

`npm ci` succeeded (61 packages, audit 0 vulnerabilities). `npm test` ran 6/6 Vitest assertions and TypeScript successfully, then failed the required production build preflight because `https://api.sociobot.in/api/v1/products` returned HTTP 503. The exact build therefore does not pass.

For diagnostic browser coverage only, a direct Vite build bypassing that failed preflight emitted 32,886-byte JS (11.47 KB gzip) and 15,858-byte CSS (4.30 KB gzip). One fresh 18-test E2E run then failed the license-outage test while a retry passed; the suite is flaky.

Fresh live evidence:

- Candidate and live HTML, JS, CSS, worker, manifest, legal pages, and offline fallback match byte-for-byte.
- A local WAV rendered to a reviewable preview and ZIP; invalid start number and four-track free-tier boundary were correctly blocked. Desktop and 390px mobile had no console/page errors; mobile had no horizontal overflow.
- Requests during a render were same-origin plus local `blob:` URLs only—no uploaded audio, analytics, tracker, CDN font, or third-party script.
- Fresh desktop and mobile profiles reloaded offline after service-worker installation. A controlled worker update in a temporary output copy displayed the update toast and activated through Update now.
- Axe found zero serious/critical findings on desktop and 390px. Keyboard skip link and reduced motion passed. Security headers and immutable hashed asset caching passed.

## Required next steps

1. Add `.factory/claims.json` with a tagged observable test for every promise.
2. Add a visible one-click “Try it with sample data” demo with realistic shipped audio, isolated `demo:` storage, persistent demo banner, Reset demo/Start for real, and `.factory/demo.md`.
3. Restore production Sociobot catalog/checkout/verify availability; observe and document enforced 429 plus `Retry-After`; then rerun the exact build and full suite.
4. Bound license verification timeout/recovery and stabilize the E2E test.
5. Add `robots.txt`, `sitemap.xml`, and a dedicated 404 page.

## Scope notes

This is a PWA, not a library, CLI, or backend: consumer package, CLI, backend concurrency, health, and persistence-boundary checks do not apply. No product code was modified during verification.
