# Wrapline independent verification 8 — FAIL

- **Candidate:** `df27a76efb9ad31c4c913ae62bd02b984ad016bf`
- **Live URL:** <https://audio-wrapper-batch.sociobot.in>
- **Date:** 2026-08-30 UTC
- **Result:** **FAIL — do not accept or release this candidate.**

## Release blockers

1. `npm test` fails reproducibly in a detached clean checkout. The nested
   production-build regression exceeds Vitest's 5,000 ms test timeout, so the
   required command exits 1 before its build and browser stages.
2. Visitor-facing claims are missing from `.factory/claims.json`. The paid
   unlimited behavior has no successful-license claim test, and the privacy
   promise that license verification occurs “at most once per day” is false as
   written: two consecutive Verify actions sent two verification requests.

There is also a lower-severity documentation defect: `.factory/copy-audit.md`
audits only six selected sentences and omits a 32-word live disclosure, despite
the required every-sentence audit and 22-word cap.

## What passed

- All 11 declared claim commands passed exactly as written from a detached
  clean worktree at the candidate SHA (22 browser executions).
- `npm run lint`, exact `npm run build`, and a separately run
  `npm run test:e2e` passed; the browser suite reported 40/40.
- Live assets and service worker exactly match the clean build.
- The sample and real MP3 flows rendered reviewable WAVs and receipt ZIPs;
  boundary, invalid-file, corrupt-codec, recovery, and invalid-license paths
  behaved correctly.
- Desktop/390 px, keyboard, focus, reduced motion, touch targets, route
  metadata, real 404, and serious/critical Axe checks passed.
- Fresh offline reload and an isolated waiting-worker/Update now flow passed.
- Render traffic stayed same-origin; security and caching headers passed.
- Mobile Lighthouse: Performance 95, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.5 s, CLS 0.
- Product-scoped license verification allowed 30 requests, then returned 429
  on request 31 with `Retry-After: 3`.

Full evidence, hashes, defects, and re-run instructions are in
[`.factory/verification-8.md`](verification-8.md). Browser evidence is in
`.factory/evidence/verification-8/`.

No product source was modified. No forbidden or unrelated service, database,
key vault, app setting, secret, or cloud resource was accessed.
