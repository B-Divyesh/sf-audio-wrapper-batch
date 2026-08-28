# Independent verification 2 — FAIL

**Candidate:** `5e1e5c68ba88520f7fc0702e049774ae99f625ab` (`main`)

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not release this candidate as the contracted paid PWA.** The live deployment matches the candidate and the local-first audio workflow, live offline reload, accessibility scan, security headers, caching, and performance budgets are strong. However, the advertised one-time purchase is still unavailable, and the restore-license path fails open when verification cannot be reached: an arbitrary token activated Studio and rendered a four-track paid batch. Lower-severity input-validation, keyboard/touch accessibility, and test-flakiness defects also remain.

## Clean checkout and repository gates

Verification ran in a detached clean worktree at the exact candidate SHA. The original workspace's pre-existing `graphify-out/` changes were not used or modified.

- Environment: Node `v22.23.2`, npm `10.9.8`, repository-pinned Playwright `1.58.2`.
- `npm ci`: passed; 61 packages installed; audit reported 0 vulnerabilities.
- First clean `npm test`: **failed**. Four Vitest tests and the production build passed, but the first-install offline reload failed in both desktop Chromium and the 390 px mobile project: 8/10 Playwright tests passed. The offline document contained only the skip link because JS/CSS requests failed.
- A later unchanged retry of `npm test`: passed all 4 Vitest and 10 Playwright tests. This makes the clean gate flaky rather than consistently green.
- `npm run lint`: passed (`tsc --noEmit`).
- Exact `npm run build`: passed and produced `dist/` via `tsc --noEmit && vite build`.
- `npm audit --omit=dev`: 0 vulnerabilities.

This is a static PWA, not a library, CLI, or backend, so package-consumer, CLI, concurrency, server persistence, and health/build-identity checks do not apply.

## Deployment identity

The live deployment is the candidate, not an older build. Fresh SHA-256 comparisons matched for all 11 fetched release files: `index.html`, `sw.js`, manifest, both icons, hero artwork, privacy, terms, legal CSS, app JS, and app CSS. Key hashes:

| File | SHA-256 |
| --- | --- |
| `index.html` | `a59785a40fc130053014275e548744ab153620c44ee73bfe5d8a25b20b9c759f` |
| `assets/index-B9zlTgjm.js` | `34ca90f13bcab3fb8b77474fa8fe5b93e58df5427be6f5df2aeaa24e823525f0` |
| `assets/index-CDcS-uS6.css` | `82dcbc725dabc17ce5b0771e69fc9b8ef05070e50982c2279b99c386f33ac487` |
| `sw.js` | `6df35aaa6651e230cfc9493cab731dccef448e9ef8625a07fdaf1cc8988f276e` |

## End-to-end product evidence

Independent Playwright checks against the live product used fresh contexts and representative generated PCM WAV plus a conventional 52,079-byte MP3.

- Created a recipe with intro, outro, looping bed, `-40 dB` bed level, `-19` voice target, and a punctuation-bearing name; saved version 1 and confirmed all wrapper audio persisted in IndexedDB after reload.
- Queued three voice tracks (WAV, MP3, WAV) starting at the `9999` boundary. Rendered names advanced through `9999`, `10000`, and `10001`; all three produced playable previews.
- Downloaded and integrity-tested the ZIP. It contained three WAV files plus `wrapline-receipt.json`; the WAV header reported 48 kHz, 16-bit PCM. The receipt included codec/measurement disclosure, duration, gain, limiter state, output names, and source hashes. The MP3's receipt hash exactly matched the untouched source SHA-256.
- Exported a saved recipe with its intro audio, dismissed and then accepted the specific delete confirmation, imported the portable JSON, and confirmed its wrapper audio survived another reload.
- Recovery paths passed for a text file, missing `{source}` token, corrupt WAV, subsequent valid MP3, a fourth free-tier track, malformed recipe JSON, and an invalid online license.
- Source queue files were not persisted. Recipe assets and receipts used `wrapline-local` IndexedDB. The ordinary free workflow made only same-origin and `blob:` requests: no upload, analytics, tracker, CDN font, or third-party runtime script was observed.

## PWA, browser, accessibility, and visual checks

- Fresh **live** profiles cached byte-bearing HTML, JS (32,333 bytes), CSS (15,489 bytes), icons, hero, manifest, and legal routes. The first offline reload passed on desktop and 390 × 844 mobile and showed the offline state.
- A controlled local worker revision exposed the update toast, created a waiting worker, accepted **Update now**, activated, and reloaded successfully.
- The factory `verify-url.sh` passed: HTTP 200, 592 ms observed load, no console/page errors, title, `lang="en"`, one H1, main landmark, image alt text, labelled buttons, and substantial page text.
- Independent `@axe-core/playwright` scans found zero serious or critical violations. Reduced-motion emulation reduced transitions to `0.01 ms`. The first Tab reached a visible 3 px focus ring on the skip link.
- Desktop and 390 px screenshots were reviewed. The product-specific risograph finishing-bench system is coherent and the mobile layout stacks without horizontal overflow or fixed-bar obstruction.
- The skip link changes the URL to `#main`, but Chromium leaves focus on `<body>` rather than moving it to the main landmark. Several mobile targets are under 44 px tall, and the 1 × 1 px focusable import input has no usable visible focus treatment (defect below).

## Performance, budgets, caching, and policies

Fresh Lighthouse 12.8.2 mobile results for the live URL:

| Category/metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| FCP | 0.9 s |
| LCP | 1.6 s |
| TBT | 80 ms |
| CLS | 0 |

Bundle budgets pass: initial JS 32.33 KB uncompressed (11.28 KB gzip), CSS 15.49 KB (4.27 KB gzip), no font payload, hero WebP 114,016 bytes. These are below the 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB hero budgets.

Live hashed JS/CSS return `Cache-Control: public, max-age=31536000, immutable`; root HTML returns `no-cache`; `sw.js` returns `no-cache, no-store, must-revalidate`. Responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`, and strict-origin referrer policy. Privacy and terms return 200. The manifest has standalone display, versioned start URL, matching theme/background colors, and 192/512 PNG icons (the 512 icon is maskable).

## Defects

### P1 — Studio purchase remains unavailable

The live product advertises a `$29 one-time purchase`, but `#buy-link` has no `href`, is `aria-disabled="true"`, and says “Studio checkout is preparing.” Fresh safe `HEAD` requests to both production and pilot checkout endpoints returned HTTP 404:

```text
https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout       404
https://pilot-api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout 404
```

This is still an external registration/deployment blocker, but it is part of the acceptance result: users cannot buy the contracted one-time unlock.

### P1 — License verification fails open and bypasses the paid limit

`licenseState()` treats any stored token without a cached negative verdict as unlocked. If the verification fetch throws, `verifyLicense()` catches the error and returns that optimistic state. With service workers blocked and the production verification request deliberately failed, entering `arbitrary-unverified-token` immediately showed “Studio license active,” changed the tier to unlimited, and successfully rendered four of four tracks. No valid or previously verified license was present.

The paid-unlock contract permits offline optimism only from a cached valid verdict, not from an arbitrary unverified token. Network failure must retain the last verified state and must not grant Studio.

### P2 — Start-number bounds are displayed but not enforced

The UI declares `min="0" max="9999"`, but the form uses `novalidate` and `readRecipe()` does not check the range. Filling `-1` on the live page and selecting **Save recipe** produced `Saved “My show” as version 1 on this device.` instead of an error. Render uses the same unchecked value. Reject non-integers and values outside 0–9999 with an announced recovery message.

### P2 — Skip destination and mobile target accessibility are incomplete

Activating the visible skip link sets `#main` but leaves `document.activeElement` as `<body>` because `<main>` is not programmatically focusable. On 390 px mobile, measured visible controls below the 44 px target baseline include three wrapper file inputs (34 px), the disclosure summary (30 px), the voice chooser (40 px), and footer links (~25 px). The focusable import input is visually clipped to 1 × 1 px, so its focus ring is not usefully visible. Axe reports no serious/critical violations, but these manual keyboard/touch checks fail the attached baseline.

### P2 — Clean offline test is flaky

The first clean `npm test` failed the same first-install offline assertion on desktop and mobile despite cache enumeration finding the shell entries. The offline page then lacked the H1 and failed to load JS/CSS. An unchanged later retry passed all 10 browser tests, and the equivalent live check passed twice. Treat this as a nondeterministic release gate/server-worker race and make the test reliable before relying on it.

## Required remediation

1. Register the product/return URL and expose the production Sociobot checkout only after it returns a valid hosted checkout.
2. Unlock optimistically only from a cached **valid** verdict; an unverified token or transport failure must remain locked. Add an outage regression that proves four-track rendering remains blocked.
3. Validate start number as an integer from 0 through 9999 in both save and render paths.
4. Move keyboard focus to the skip target and bring all touch/focus targets up to the 44 px/visible-focus baseline.
5. Stabilize the fresh-install offline browser test, then rerun the complete clean suite and this verification.
