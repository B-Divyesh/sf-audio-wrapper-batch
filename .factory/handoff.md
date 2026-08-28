# Wrapline verification-2 handoff — FAIL

**Tested candidate:** `5e1e5c68ba88520f7fc0702e049774ae99f625ab`

**Tested deployment:** <https://audio-wrapper-batch.sociobot.in>

**Result:** **FAIL — not release-ready as the contracted paid PWA**

The live deployment exactly matches the candidate and the core local audio job works: a saved intro/outro/bed recipe rendered a WAV/MP3/WAV batch, review previews, a valid ZIP, 48 kHz 16-bit WAVs, and a detailed receipt. Recipe export/import, IndexedDB persistence, invalid-file recovery, live desktop/mobile offline reload, service-worker update, privacy request capture, response policies, and performance budgets were exercised successfully.

Release blockers remain:

- **P1:** Studio cannot be purchased. The visible control is disabled with no link, while both production and pilot checkout endpoints return 404.
- **P1:** License verification fails open. When the verification request was made unavailable, an arbitrary unverified token activated Studio and rendered a four-track batch that the free tier correctly blocks.

Additional defects:

- **P2:** `start-number=-1` is accepted and saved despite the documented 0–9999 bounds.
- **P2:** Skip-link activation leaves focus on `<body>`; multiple mobile targets are below 44 px, and the clipped recipe-import input lacks usable visible focus.
- **P2:** The first clean `npm test` run failed both offline projects (8/10 browser tests); an unchanged retry passed 10/10, so the gate is flaky.

Verification summary: `npm ci` passed (0 audit findings); lint and exact production build passed; one clean `npm test` attempt failed and a retry passed; live deployment identity matched 11 release files by SHA-256; factory URL smoke had no console/page errors; Axe had 0 serious/critical findings; Lighthouse mobile scored **99 performance / 100 accessibility / 100 best practices**, with LCP 1.6 s, TBT 80 ms, and CLS 0. Initial JS is 32.33 KB, CSS 15.49 KB, and hero WebP 114 KB.

Full commands, evidence, defects, and remediation are in [`.factory/verification-2.md`](verification-2.md). No product code was changed.
