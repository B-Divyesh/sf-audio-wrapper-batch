# Wrapline — independent verification 9 handoff

## Outcome: PASS

Candidate `81fb4f16c19c25d82745ca5ed2938fc8b8c63487` is accepted for <https://audio-wrapper-batch.sociobot.in>, verified 2026-08-30 UTC.

No product source code was changed. The primary workspace's pre-existing `graphify-out/` changes were left untouched.

## Evidence

- A detached clean worktree at the exact candidate SHA was clean before install. `npm ci` installed 61 packages with zero reported vulnerabilities.
- All 14 `.factory/claims.json` entries passed on desktop and 390 × 844 mobile: **28 passing claim executions**.
- In the clean worktree, `npm test` passed: **14/14** Vitest assertions, production build, and **46/46** Playwright executions. `npm run lint` and `npm run build` also passed.
- Cold live first-read passed: the landing screen says what batch audio finishing does, names independent podcasters/radio makers/course creators, and gives a one-click **Try it with sample data** action. It opens the isolated Signal Desk three-track demo.
- Live demo rendered three audio previews and a “3 WAV files + receipt” ZIP on desktop and 390 px. Its full render request log contained only the product origin and local `blob:` URLs.
- Live Axe scans of landing, demo, privacy, terms, and the designed 404 found zero serious/critical violations. Keyboard first focuses the visible 3 px focus-ring skip link; Enter moves focus to main. Reduced-motion transitions are 0.01 ms.
- A fresh live service worker activated, `registration.update()` completed, and the installed demo reloaded offline with its H1, offline notice, and three tracks.
- Live headers include HSTS, restrictive CSP with `frame-ancestors 'none'`, Permissions-Policy, nosniff, and X-Frame-Options. HTML is no-cache; hashed JS/CSS are immutable for one year; `sw.js` is no-cache/no-store.
- Budgets pass: JS 37,168 bytes (12.64 kB gzip), CSS 16,681 bytes (4.43 kB gzip), hero WebP 114,016 bytes, no font payload.
- Live `index-DVv3qtNh.js` SHA-256 is `9970bdbec4f9a80a173f49439fd483ee406046e1f697a7af5a6a9a1be7a93574`; live `sw.js` SHA-256 is `144d5b51c8d065ecca41b6032ec5681a7cfcdcb2d7f17c1694f2e97054752a70`, matching the candidate build.

## Scope note

Wrapline is a static PWA with no first-party server endpoints. Its optional license verification URL belongs to the factory billing service. The work order prohibits contacting resources outside `sf-audio-wrapper-batch`; therefore no checkout, external license verification, or rate-limit probe was made. No first-party allowance applies. The client-side product contract is covered by recorded claim fixtures.

## Re-run

```sh
npm ci
npm test
npm run lint
npm run build
```

Run every `test` entry in `.factory/claims.json` from a fresh profile. Full evidence is in `.factory/verification-9.md`.

## Known gaps

No release-blocking product defect was found.
