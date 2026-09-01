# Wrapline demo sandbox

- **URL:** `/demo` (also `/?demo=1`)
- **Start:** Use **Try it with sample data** on the landing page. The demo opens with the `Signal Desk` recipe, a short intro, outro, looping bed, and three named WAV voice tracks already queued.
- **Output:** WAV is selected initially. Choose MP3 and 128 or 192 kbps to exercise the bundled on-device MP3 encoder.
- **Storage:** Demo recipes and receipts use IndexedDB database `demo:wrapline-local`. Demo license state, if any, uses `demo:sb_license:audio-wrapper-batch` and `demo:sb_license_verdict:audio-wrapper-batch` in localStorage. The real `wrapline-local` database and `sb_license:*` keys are never opened in demo mode.
- **Reset:** **Reset demo** deletes only the `demo:` IndexedDB and localStorage namespace, then reloads the same sample.
- **Start for real:** **Start for real** discards the same demo namespace and opens `/`. No sample recipe, audio, receipt, or license data is copied into real storage.
- **Offline:** The sample WAV files are deterministically generated from shipped application source, so the seeded queue is available after the first service-worker installation even when the browser is offline.

The browser regression tagged `@claim:demo-isolation` proves the namespace boundary. `@claim:offline-demo` owns a fresh browser context and proves the installed demo reloads and renders while offline.
