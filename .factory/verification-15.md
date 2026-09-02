# Independent verification 15 — PASS

**Candidate:** `ac0bd3437eb27f230a2a87d8ead7c988b37afa99`  
**Live URL:** <https://audio-wrapper-batch.sociobot.in>  
**Verified:** 2026-09-02 UTC

## Verdict

**PASS.** Wrapline satisfies the researched job: independent podcasters, radio makers, and course creators can save a local wrapper recipe (intro, outro, bed, loudness, and naming), render a batch of WAV/MP3 voice tracks, review/download the results, and retain a receipt. No P0–P3 defect was found.

## Required first-read and demo check

A cold production visit returned HTTP 200 with no console or page errors. The first screen says **“Add intros and outros to voice tracks”**, names **podcasters, radio makers, and course creators**, and exposes the one-click **“Try it with sample data”** action with its outcome, **“Opens three ready-to-render voice tracks.”** The action/direct `/demo` entry opens the isolated Signal Desk sample workspace.

## Clean-candidate quality gate

A detached clean worktree at `/tmp/wrapline-verify15-clean-0ISFB6` was checked out at the exact candidate SHA. `npm ci` installed 65 packages and reported zero vulnerabilities.

- `npm test`: **PASS** — 15 Vitest unit/release assertions, production build, and all 12 local Playwright shards passed.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run build`: **PASS**; generated `dist/`.
- `npm run verify:release`: **PASS**; the registered product-scoped hosted-checkout redirect verified and the production build completed.
- `npm run test:e2e:live`: **PASS** — all 12 production Playwright shards passed.

## Claims

Every exact command listed in `.factory/claims.json` was run from the clean worktree against the local demo entry point. All 17 passed (each configured desktop/mobile execution):

`demo-sample-data`, `demo-isolation`, `local-audio`, `offline-demo`, `wav-mp3-input`, `wav-receipt`, `mp3-output`, `audio-behavior`, `source-receipt`, `local-recipes`, `free-tier`, `studio-license`, `studio-unlimited`, `license-daily-check`, `license-boundary`, `recipe-controls`, and `route-shell`.

The individual command logs and result table are retained in the clean-worktree evidence directory: `/tmp/wrapline-verify15-clean-0ISFB6/.factory/evidence/verification-15/`.

## Independent live QA

- Desktop cold read, 390 px mobile, keyboard, and reduced-motion checks passed. At 390 px there was no horizontal overflow (`390/390`); first Tab focused the visible skip link (`3px` blue outline); reduced-motion mode reported no running animations.
- Axe scans on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404 found **zero serious or critical violations**. Each normal route had one H1, one main landmark, route-specific title, `lang=en`, and no console/page errors. The browser’s expected failed-resource console message for the direct 404 did not occur on normal routes.
- A fresh live demo render produced its sample outputs with only `https://audio-wrapper-batch.sociobot.in` requests observed. No audio upload, analytics, tracker, font CDN, or runtime CDN request was observed.
- The PWA worker controlled the page at product scope, was activated after `registration.update()`, had no waiting update, and an independently fresh installed `/demo` context reloaded offline with the sample workspace and three queued tracks. The required offline render claim also passed in its own browser context.
- `/opt/fleet/lib/verify-url.sh` passed against production: HTTP 200, title, `lang`, one H1, main landmark, complete image alternatives, labeled buttons, and no browser errors.

## Deployment identity, security, and performance

Fresh candidate and live SHA-256 values matched for `index.html`, `sw.js`, `manifest.webmanifest`, entry JS, and entry CSS.

- Shell: `no-cache`; service worker: `no-cache, no-store, must-revalidate`; fingerprinted JS/CSS: `public, max-age=31536000, immutable`.
- Production sends HSTS, CSP (self plus the explicit Sociobot license origin), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive Permissions-Policy.
- Initial entry JS is 13,648 bytes gzip; CSS is 4,598 bytes gzip. The lazy MP3 encoder is 87,565 bytes gzip. The mobile hero is 114,016 bytes. All are within the stated static/PWA budgets.

## Rate-limit and authentication boundary

There is no product server or sign-in flow. The external product license verifier was tested with harmless invalid tokens from one client: requests 1–31 returned `200`; request 32 returned **429** with `Retry-After: 4`. Observed allowance: **31 requests per burst**. This meets the documented allowance-enforcement check.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |
