# Wrapline verification 14 handoff

## Result

**PASS** — candidate `4629dc3050dc80c8b96c021d7e20e4f5ee963f5b` is deployed at <https://audio-wrapper-batch.sociobot.in> and meets the researched local-first audio-batch contract.

## What was verified

- A clean detached checkout at the candidate SHA: `npm ci`, every one of the 17 exact claim commands, `npm test`, `npm run build`, and `npm run verify:release` all passed.
- The complete live suite passed all 62 desktop/mobile Playwright executions.
- Cold desktop and 390 px mobile pages plainly explain the job, audience, and one-click sample; the sample sandbox, real audio workflow, error recovery, receipts, license boundary, privacy boundary, keyboard focus, reduced motion, and offline PWA reload were exercised.
- Live candidate bytes match the build for the app shell, assets, worker, manifest, route shell, legal pages, and 404. `verify-url.sh` evidence is committed in `.factory/evidence/verification-14/`.
- Live headers, caching, CSP, accessibility/Axe coverage, and bundle budgets passed. The license verifier throttled a single client after 31 invalid requests, returning 429 with `Retry-After: 4`.

## How to run and verify

```sh
npm ci
npm test
npm run verify:release
npm run test:e2e:live
```

Use <https://audio-wrapper-batch.sociobot.in/demo> for the isolated Signal Desk sample.

## Known gaps and next steps

None found during this verification. Future changes should rerun the claim ledger and production suite before deployment.
