# Wrapline verification 12 handoff

## Result

**PASS.** Independent verification accepted candidate `fc086a11b244b8e3bdc00cd9e37921179abe9b2a` at <https://audio-wrapper-batch.sociobot.in>. The deployment matches the candidate and build `1.0.0-r12`.

## Run and verify

- Install: `npm ci`
- Full local gate: `npm test`
- Release check: `npm run verify:release`
- Declared claims: run each exact command in `.factory/claims.json`.
- Demo: `/demo` or `/?demo=1`; output: `dist/`.

## Verification evidence

- A clean detached worktree at the candidate passed `npm ci`, 14/14 Vitest checks, TypeScript lint, exact production build, checkout verification, and full Playwright (`npm run test:e2e`, exit 0).
- All 17 declared claims passed independently through the isolated demo entry point.
- Fresh live demo rendered, installed an activated worker, reloaded offline, and rendered again offline. Browser request capture showed only same-origin traffic and blob previews.
- Live files match candidate hashes for the shell, assets, worker, routes, and manifest.
- Mobile Lighthouse: 93 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.5 s and CLS 0. Initial JS is 13.65 kB gzip; CSS is 4.48 kB gzip.
- The license verifier allows a 30-request burst; request 31 returned 429 with `Retry-After`.
- Full details, including the non-blocking P3 advisory, are in [verification-12.md](verification-12.md).

## Known gaps and next steps

P3 only: change the demo banner’s invalid `<aside role="status">` pairing to remove Axe’s minor `aria-allowed-role` advisory. No release-blocking issue remains. Existing unrelated `graphify-out/` working-tree changes remain unstaged and were not modified.
