# Independent verification 3 — FAIL

**Candidate:** `176839c1033969b62a3fe7ccc91e27b912cb3fe1` (`factory: repair audio-wrapper-batch-repair-2`)

**Live URL:** <https://audio-wrapper-batch.sociobot.in>

**Verified:** 2026-08-28 UTC

## Verdict

**FAIL — do not release as the contracted one-time paid PWA.** Fresh evidence shows that the deployed site is exactly this candidate, the local-first free workflow and all repaired functional/accessibility/PWA checks pass, but a customer cannot purchase the advertised Studio license. This is an external billing-registration/deployment blocker, not a reason to ship a disabled paid offering.

## Clean candidate and local gates

Verification used a new detached clean worktree at `/tmp/wrapline-qa-176839c` on the exact SHA above. The original workspace's pre-existing `graphify-out/` modifications were not used or changed.

- Node `v22.23.2`, npm `10.9.8`, repository-pinned Playwright `1.58.2`.
- `npm ci` passed: 61 packages installed; `npm audit --omit=dev` found **0 vulnerabilities**.
- `npm test` passed: **6 Vitest assertions** and **16 Playwright assertions** (8 Chromium desktop + 8 390 × 844 mobile). This includes an axe serious/critical scan, local WAV rendering, recipe persistence, offline reload, outage-locked license, start-number bounds, keyboard focus, and mobile control size.
- Explicit `npm run lint` passed (`tsc --noEmit`). Exact `npm run build` passed and emitted `dist/`.
- Production output: JS **32.93 KB raw / 11.45 KB gzip**; CSS **15.76 KB raw / 4.30 KB gzip**; no font payload; hero WebP **114,016 bytes**. All are within the static-PWA budgets.
- A fresh Lighthouse CLI run could not produce scores because its Chromium target crashed while capturing the full-page screenshot. This does not mask a release defect: independent desktop/mobile browser checks and the output-size budgets above completed successfully. It should be rerun in the deployment environment before a final performance score is claimed.

This is a static PWA, not a library, CLI, or backend; package-consumer, CLI, server-concurrency, server-persistence, health, and build-identity endpoint checks do not apply.

## Deployment identity

The live deployment matches the candidate build, not a stale deployment. Fresh SHA-256 comparisons matched for all 11 release resources checked: root `index.html`, `sw.js`, manifest, both icons, hero art, privacy page, terms page, legal CSS, and the fingerprinted JS/CSS bundles. Examples:

| File | SHA-256 |
| --- | --- |
| `index.html` | `22c86b4b8ade2d9a451471b3ca25e62c32dc8c920eccac869f125915916feacb` |
| `sw.js` | `aa27078be0e22685f1d249eabe4589670d5b1a2acfb07593ebba322c6420efca` |
| `assets/index-87PT_odk.js` | `c188dd8e31b13aa72fa4842d0f567adc4101ecdf830481edd3340ae2c0cbb8a0` |
| `assets/index-c-caCpYL.css` | `be6f036d4a3c381448ccc3695079fe746ad639e6d5185745c5e8ad5fb61e8575` |

## End-to-end product evidence

Independent Chromium checks exercised the actual production build locally and the deployed equivalent.

- Saved a recipe containing intro, outro, looping bed, `−40 dB` bed, `−19 LUFS`, punctuation/Unicode in the recipe name, and a start number of `9999`. Reload confirmed the recipe and all three wrapper assets persisted in IndexedDB.
- Rendered normal WAV and conventional MP3 inputs. Three rendered previews were created; boundary output names advanced `9999`, `10000`, `10001`. The MP3 input was a conventional 37,206-byte ID3/MP3 file and rendered to a 1.2-second WAV preview.
- Downloaded a rendered batch: it had a valid ZIP `PK` signature and contained the wrapped WAV plus `wrapline-receipt.json`. The UI discloses 48 kHz, 16-bit PCM WAV output, RMS-based approximate loudness, peak protection, and browser codec limits.
- Invalid text input is skipped with an announced WAV/MP3 recovery message. A corrupt `.wav` reports a decode error while a following valid WAV renders successfully in the same batch (one error ticket, one preview).
- Rejected `-1`, `1.5`, `10000`, and blank start numbers on save, and rejected a naming recipe without `{source}`. Entering an arbitrary license during a verification failure remained locked and retained the three-track free limit.
- The ordinary free flow made no outbound requests: only same-origin shell assets and `blob:` preview/download URLs. There is no audio upload, analytics, tracker, third-party font, or runtime CDN script.

## PWA, usability, accessibility, and policies

- A fresh live 390 × 844 profile installed an active service worker, byte-cached HTML, JS, CSS, manifest, icons, art, privacy, and terms, then reloaded offline with the H1 and visible offline banner intact.
- A controlled QA-only copy of the generated worker was given a harmless revision marker. The existing install detected it, displayed the in-app update toast, and **Update now** activated the waiting worker successfully. Product source was not altered.
- Fresh axe scans on both desktop and 390px mobile found **0 violations** (therefore 0 serious/critical). No console errors or page errors occurred. Screenshots showed a coherent product-specific risograph bench and a stacked, non-overflowing mobile layout.
- Keyboard-only verification: first Tab reaches the visible skip link (3px `#145B73` ring); Enter moves focus to `main` and `#main`. On 390px, wrapper pickers, queue chooser, disclosure, and all footer links measured at least 44px high. Reduced-motion emulation reduced nonzero transitions to `0.00001s`.
- The live document has `lang="en"`, one H1, `main`, title, alternate text, privacy and terms routes. Both legal routes returned 200 and describe local storage, license-token verification, and no analytics.
- Live policies: HTML `Cache-Control: no-cache`; hashed assets `public, max-age=31536000, immutable`; worker `no-cache, no-store, must-revalidate`. HSTS, restrictive CSP (`default-src 'self'`; connect only to Sociobot API), Permissions-Policy, `X-Frame-Options: DENY`, `nosniff`, and strict-origin referrer policy are present.

## Defects

### P1 — One-time Studio purchase cannot be made

The product advertises a **$29 one-time purchase**, but the deployed `#buy-link` is `aria-disabled="true"`, has no `href`, and reads **“Studio checkout is preparing.”** A fresh attempted arbitrary-token restore stayed correctly locked, so there is no hidden paid path either.

Safe HEAD requests independently confirmed the deployment registration is absent:

```text
https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout       404
https://pilot-api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout 404
```

This fails the researched brief's one-time monetization acceptance and the supplied paid-unlock contract. Register the production product and return URL, confirm the hosted Sociobot/Dodo checkout opens, build with `VITE_STUDIO_CHECKOUT_ENABLED=true`, deploy, then rerun this verification.

## Required follow-up

1. Factory: register `audio-wrapper-batch` in production with the `https://audio-wrapper-batch.sociobot.in/` return URL and USD 29 one-time Studio license.
2. Rebuild/redeploy with the checkout explicitly enabled only after an end-to-end hosted checkout succeeds.
3. Rerun clean verification and Lighthouse once the deployment environment can complete a stable Lighthouse run.
