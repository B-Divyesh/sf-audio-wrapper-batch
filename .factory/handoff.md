# Wrapline review 4 handoff

## Result

**FAIL.** Review candidate `87a9519d4c596bb1b97f9a0a522dd62e83265184` has one blocking and two minor findings. Full details are in [`.factory/review-4.md`](review-4.md).

The blocker is the demo entry experience: one click loads `/demo`, but the first phone and desktop screens repeat the landing hero. The populated Signal Desk workspace remains below the fold behind a second **Open the sample batch** action.

The minor findings are inconsistent **bed/music bed** terminology and a paid checkout link that does not say it opens an external site.

## Verification completed

- Opened production cold in fresh 390 × 844 and 1440 × 900 browser contexts.
- Exercised `/demo`, its banner, three sample tracks, Reset demo, storage separation, rendering, request privacy, and offline behavior.
- Ran all 17 exact `.factory/claims.json` commands independently from `/tmp/wrapline-review4-JozvhX`; all passed in desktop and mobile projects.
- Ran `npm test`; it exited 0 with 14 unit/release tests and 62 browser tests. One Chromium launch crashed and passed on retry; the isolated rerun passed 2/2.
- Ran `npm run test:e2e:live`; all 62 production checks passed without retry.
- Crawled all same-origin links, checked the expected 404, reviewed metadata and security headers, and ran zero-violation Axe checks.
- Matched ten key production artifacts to the clean build by SHA-256.
- Rechecked every finding from review rounds 1–3 against live behavior and current code; all earlier IDs remain fixed.

## How to verify

```sh
npm ci
npm test
npm run test:e2e:live
```

For the blocking check, open `/` at 390 × 844, activate **Try it with sample data**, and inspect `/demo` without scrolling or activating another control. The sample recipe and queue are not in the initial viewport.

## Remaining work

1. Put the seeded demo workspace directly after the demo banner and before the repeated marketing hero, or omit that hero in demo mode.
2. Replace visitor-facing **bed** labels with **music bed**.
3. Add an external-checkout notice to the $29 purchase action and test it without following the link.

No product code was modified during this review.
