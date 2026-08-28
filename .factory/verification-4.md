# Independent verification 4 — FAIL

**Candidate:** `182c88ecc8f07eec15321a5c867337a31bb3f8d1` (`factory: repair audio-wrapper-batch-repair-3`)

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not mark the candidate complete until its desktop header navigation meets the required 44 × 44 CSS-pixel interactive-target minimum.** All other exercised product, deployment, PWA, privacy, performance, checkout, and serious/critical accessibility checks passed. The former deployment-only billing failure is repaired and is not a blocker on this candidate.

## Clean checkout and automated gates

Verification used a new detached worktree at `/tmp/audio-wrapper-batch-verify-4` on the exact candidate SHA. The original `/work/repo` worktree's pre-existing `graphify-out/` changes were neither used nor changed.

- `npm ci` passed (61 packages); audit reported 0 vulnerabilities.
- Exact `npm test` passed: 6 Vitest assertions, production build, and 16 Playwright assertions (8 desktop Chromium and 8 390 × 844 mobile) in 35.0 seconds.
- `npm run lint` passed (`tsc --noEmit`); a separate exact `npm run build` passed, including the live product-catalog guard.
- Build output: JS 32.89 KB raw / 11.47 KB gzip; CSS 15.76 KB raw / 4.30 KB gzip; no font payload; hero WebP 114,016 bytes. Each is within the stated static-PWA budgets.
- Fresh mobile Lighthouse on the live URL: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.6 s, TBT 90 ms, CLS 0.

This is a static PWA, not a library, CLI, or backend; package-consumer, CLI, concurrency, server-persistence, health, and build-identity endpoint checks do not apply.

## Deployment and checkout identity

The deployment is the candidate rather than a stale build. SHA-256 matched for all 11 checked release files: root HTML, worker, manifest, both icons, hero art, legal pages/CSS, and the fingerprinted JS/CSS. Examples:

| File | SHA-256 |
| --- | --- |
| `index.html` | `726f59cf068012044855c076ac800a59032ed30ef3046db3f71ebe18a879e768` |
| `sw.js` | `3ef19a2761848d017e75a87feb8fbe71e71b343b7e60cb087174e5c6faad1d42` |
| `assets/index-Dyc02NVd.js` | `d6c84172348f49c5bba923adb20d8c84dd72c2fe3e9010cb5b86dc7cb6c6a6f1` |
| `assets/index-c-caCpYL.css` | `be6f036d4a3c381448ccc3695079fe746ad639e6d5185745c5e8ad5fb61e8575` |

Fresh `GET /api/v1/products` returned `Wrapline Studio`, USD 29.00, and the exact checkout URL. `HEAD https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout` returned HTTP 303 to hosted `checkout.dodopayments.com`. The deployed buy link has that same URL and no disabled state.

## End-to-end evidence

- On the live build, saved a recipe named `Season zéro!` with intro, outro, looping bed at −40 dB, −19 LUFS, and start number 9999. Reload retained the recipe and wrapper audio in IndexedDB.
- Rendered a representative 0.1 s PCM WAV, a conventional ID3/MP3 source, and a second WAV. All three previewed successfully; names advanced `9999`, `10000`, and `10001`; the MP3 yielded a 2.9-second WAV preview. The batch download started with the ZIP `PK` signature and included the batch receipt.
- A `.txt` source was rejected with a WAV/MP3 recovery message. A corrupt WAV showed a per-ticket decode error while a following valid WAV still completed (`1 of 2 tracks wrapped`). Start number `10000` and a filename recipe lacking `{source}` were rejected with clear recovery text.
- A returned arbitrary `?license=` token was saved locally, stripped from the URL, remained locked, and preserved the three-track free tier. The production purchase link and catalog registration are live.
- In the ordinary free flow, captured browser requests were only same-origin shell assets and `blob:` preview/download URLs: no audio upload, analytics, tracker, runtime CDN, or third-party font/script.

## PWA, accessibility, responsive, and policy evidence

- A fresh live mobile session installed an activated worker, then reloaded while `context.setOffline(true)` with the H1 and offline banner intact.
- Service-worker update was independently simulated against an unmodified copy of the exact generated `dist/` worker: an existing install detected the changed worker, showed the update toast, and **Update now** activated it. Cache names changed to the update version and the toast closed. Product source was not modified.
- Fresh axe scans on live desktop and 390 × 844 mobile found **0 serious or critical violations**; no console or page errors were observed. `lang=en`, title, exactly one H1, main landmark, alt text, legal routes, and the skip link are present.
- Keyboard verification reached the visible skip link first; its focus was a 3px `#145B73` outline with 3px offset, and Enter moved focus to `main`. At 390px there was no horizontal overflow and every measured visible interactive target met 44 × 44 px. Reduced-motion emulation replaced movement with 0.00001s durations.
- Live headers: HTML `no-cache`; fingerprinted JS/CSS `public, max-age=31536000, immutable`; worker `no-cache, no-store, must-revalidate`; HSTS, restrictive self/Sociobot-only CSP, Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`, and strict-origin referrer policy are present. `/privacy/` and `/terms/` return 200 and accurately describe the local storage and license-verification behavior.

## Defects

### P2 — Desktop header navigation misses the product's 44px target-size contract

At the live URL in a 1366 × 900 desktop viewport, the visible `Finishing bench`, `How it works`, and `License` header links measured 122.7 × **24.8**, 98.7 × **24.8**, and 59.6 × **24.8** CSS pixels. The visual thesis and factory accessibility requirements say all interactive targets must be at least 44 × 44 px. This affects touch-enabled desktop/laptop use and prevents the candidate from satisfying the stated definition of done. (The same navigation is hidden on the 390px layout; mobile visible controls pass.)

## Required follow-up

1. Increase the desktop header-nav links' interactive boxes to at least 44px high without disrupting the compact bench layout, then rebuild and deploy.
2. Rerun this verification, including a fresh desktop target-size measurement. No billing-registration follow-up is required for this candidate.
