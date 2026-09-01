import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

function wavBuffer(duration = 0.08, amplitude = 6000 / 32767, frequency = 1_000, sampleRate = 8_000): Buffer {
  const samples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples * 2, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(samples * 2, 40);
  for (let index = 0; index < samples; index += 1) {
    buffer.writeInt16LE(Math.round(Math.sin(2 * Math.PI * frequency * index / sampleRate) * amplitude * 32767), 44 + index * 2);
  }
  return buffer;
}

const mp3Fixture = readFileSync(new URL('../fixtures/synthetic-tone-440hz.mp3', import.meta.url));

test('loads a clear, accessible empty bench', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Wrapline/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/demo');
  await expect(page.getByText('Added voice tracks appear here.')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('keeps the demo usable without a service-worker registration', async ({ browser }) => {
  // This owns its context because the browser policy intentionally suppresses
  // registration. It reproduces browsers where register() resolves without a
  // ServiceWorkerRegistration, which must not reach registration.waiting.
  const context = await browser.newContext({ serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

    await page.goto('/demo', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-remove-job]')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Render batch' })).toBeEnabled();
    expect(await page.evaluate(() => navigator.serviceWorker.getRegistration())).toBeUndefined();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await context.close();
  }
});

test('release artifact returns the designed 404 document for an unknown URL', async ({ page }) => {
  const response = await page.goto('/missing-qa-404-repair-6');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Wrapline');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This Wrapline page was not found.');
  await expect(page.getByRole('link', { name: 'Return to Wrapline' })).toHaveAttribute('href', '/');
});

test('@claim:route-shell Every public route has metadata, legal links, and a real 404', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const routes = [
    {
      path: '/', status: 200, title: 'Wrapline — add intros and outros to audio',
      canonical: 'https://audio-wrapper-batch.sociobot.in/', ogTitle: 'Wrapline — add intros and outros to audio',
    },
    {
      path: '/demo', status: 200, title: 'Demo — Wrapline',
      canonical: 'https://audio-wrapper-batch.sociobot.in/demo', ogTitle: 'Demo — Wrapline',
    },
    {
      path: '/privacy/', status: 200, title: 'Privacy — Wrapline',
      canonical: 'https://audio-wrapper-batch.sociobot.in/privacy/', ogTitle: 'Privacy — Wrapline',
    },
    {
      path: '/terms/', status: 200, title: 'Terms — Wrapline',
      canonical: 'https://audio-wrapper-batch.sociobot.in/terms/', ogTitle: 'Terms — Wrapline',
    },
    {
      path: '/missing-qa-wrapline-7', status: 404, title: 'Page not found — Wrapline',
      canonical: 'https://audio-wrapper-batch.sociobot.in/404.html', ogTitle: 'Page not found — Wrapline',
    },
  ];

  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(route.status);
    await expect(page, route.path).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]'), route.path).toHaveAttribute('href', route.canonical);
    await expect(page.locator('meta[name="description"]'), route.path).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:url"]'), route.path).toHaveAttribute('content', route.canonical);
    await expect(page.locator('meta[property="og:title"]'), route.path).toHaveAttribute('content', route.ogTitle);
    await expect(page.locator('meta[property="og:description"]'), route.path).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:image"]'), route.path).toHaveAttribute('content', 'https://audio-wrapper-batch.sociobot.in/art/wrapline-social.jpg');
    await expect(page.locator('meta[name="twitter:card"]'), route.path).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]'), route.path).toHaveAttribute('content', route.ogTitle);
    await expect(page.locator('meta[name="twitter:description"]'), route.path).toHaveAttribute('content', /\S/);
    const descriptions = await page.locator('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').evaluateAll(
      (elements) => elements.map((element) => element.getAttribute('content')?.length ?? 0),
    );
    expect(descriptions.every((length) => length >= 20 && length <= 155), `${route.path}: ${descriptions.join(', ')}`).toBe(true);

    await expect(page.getByRole('heading', { level: 1 }), route.path).toHaveCount(1);
    await expect(page.locator('main#main'), route.path).toHaveCount(1);
    await expect(page.locator('header.site-header'), route.path).toHaveCount(1);
    await expect(page.locator('header').getByRole('link', { name: 'Wrapline home' }), route.path).toHaveAttribute('href', '/');
    await expect(page.locator('header nav a'), route.path).toHaveText(['Audio setup', 'How it works', 'License']);
    expect(await page.locator('header nav a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), route.path)
      .toEqual(['/#bench', '/#method', '/#unlock']);
    await expect(page.locator('footer'), route.path).toContainText('Add intros, outros, and music to many voice tracks.');
    await expect(page.locator('footer'), route.path).toContainText('Built by Param Factory');
    await expect(page.locator('footer [data-build-id]'), route.path).toHaveText('Build 1.0.0-r11');
    await expect(page.locator('footer'), route.path).not.toContainText('Bench artwork generated for Wrapline with Azure AI Foundry.');
    await expect(page.locator('footer a[href="/privacy/"]'), route.path).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms/"]'), route.path).toHaveCount(1);

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' }), route.path).toBeFocused();
    expect(await page.getByRole('link', { name: 'Skip to main content' }).evaluate((link) => getComputedStyle(link).outlineStyle), route.path).not.toBe('none');
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id), { message: route.path }).toBe('main');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route.path).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), route.path).toBe(true);
  }
  // Chromium reports the intentionally missing top-level document as a
  // console resource error even though its designed 404 shell loads fully.
  expect(
    consoleErrors.filter(
      (message) => !/^Failed to load resource: the server responded with a status of 404 \((?:Not Found)?\)$/.test(message),
    ),
  ).toEqual([]);
  expect(consoleErrors.length).toBeLessThanOrEqual(1);
  expect(pageErrors).toEqual([]);
});

test('footer provenance is kept in repository records, not made as a visitor claim', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).not.toContainText(/generated for Wrapline|Azure AI Foundry/i);
  await expect(page.locator('#mp3-bitrate option[value="192"]')).toHaveText('192 kbps');
});

test('route navigation focuses and announces the page heading', async ({ page }) => {
  await page.goto('/privacy/');
  await page.locator('header').getByRole('link', { name: 'Wrapline home' }).click();
  await page.waitForURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Add intros and outros to voice tracks');

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Add intros and outros to voice tracks');

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('the 390px first screen states the concrete job and sample result', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Add intros and outros to voice tracks');
  await expect(page.getByText(/same music, loudness, and filenames/)).toBeVisible();
  await expect(page.getByText('Opens three ready-to-render voice tracks.')).toBeVisible();
  const bottom = await page.getByText('Opens three ready-to-render voice tracks.').evaluate((element) => element.getBoundingClientRect().bottom);
  expect(bottom).toBeLessThanOrEqual(844);
});

test('release artifact keeps the trailing demo URL in the sample sandbox', async ({ page }) => {
  const response = await page.goto('/demo/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Demo — Wrapline');
  await expect(page.getByText(/Demo — sample data, nothing is saved to your real data/)).toBeVisible();
});

test('release artifact publishes the required social preview and app icons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Wrapline — add intros and outros to audio');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://audio-wrapper-batch.sociobot.in/art/wrapline-social.jpg');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  const dimensions = await page.evaluate(async () => new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error('The Open Graph image did not load.'));
    image.src = '/art/wrapline-social.jpg';
  }));
  expect(dimensions).toEqual({ width: 1200, height: 630 });
});

test('desktop header navigation has 44px targets without changing the mobile header', async ({ page }, testInfo) => {
  await page.goto('/');
  const links = page.locator('header nav a');
  await expect(links).toHaveText(['Audio setup', 'How it works', 'License']);

  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('header nav')).toBeHidden();
    await expect(page.locator('.site-header')).toHaveCSS('min-height', '64px');
    return;
  }

  await page.setViewportSize({ width: 1366, height: 900 });
  const targets = await links.evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(targets).toHaveLength(3);
  for (const target of targets) {
    expect(target.width, `${target.label} width`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${target.label} height`).toBeGreaterThanOrEqual(44);
  }

  await links.first().focus();
  await expect(links.first()).toBeFocused();
  expect(await links.first().evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
});

test('@claim:wav-mp3-input Wrapline offers WAV and MP3 voice input', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#voice-files')).toHaveAttribute('accept', /audio\/wav.*audio\/mpeg/);
  await page.locator('#voice-files').setInputFiles([
    { name: 'episode-one.wav', mimeType: 'audio/wav', buffer: wavBuffer() },
    { name: 'episode-two.mp3', mimeType: 'audio/mpeg', buffer: mp3Fixture },
  ]);
  await expect(page.getByText('episode-one.wav', { exact: true })).toBeVisible();
  await expect(page.getByText('episode-two.mp3', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/2 of 2 tracks rendered/)).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(2);
  const outputs = await page.locator('audio').evaluateAll(async (audio) => Promise.all(audio.map(async (element) => {
    const bytes = new Uint8Array(await fetch((element as HTMLAudioElement).src).then((response) => response.arrayBuffer()));
    return { riff: new TextDecoder().decode(bytes.slice(0, 4)), bytes: bytes.length };
  })));
  expect(outputs.every((output) => output.riff === 'RIFF' && output.bytes > 44)).toBe(true);
});

test('@claim:local-recipes Saved recipes, intro audio, and receipts persist on this device', async ({ page }) => {
  await page.goto('/');
  await page.locator('#recipe-name').fill('Field notes');
  await page.locator('#intro-file').setInputFiles({ name: 'theme.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.getByText(/Saved “Field notes” as version 1/)).toBeVisible();
  await page.locator('#voice-files').setInputFiles({ name: 'field-take.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  await page.reload();
  await expect(page.locator('#recipe-name')).toHaveValue('Field notes');
  await expect(page.locator('#intro-status')).toHaveText('theme.wav');
  await expect(page.locator('#receipt-list .receipt')).toHaveCount(1);
});

test('@claim:offline-demo The demo works offline after its first visit', async ({ browser }) => {
  // This claim owns a context. It must not reuse or close Playwright's shared
  // page/context because service-worker state is part of the assertion.
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('/demo');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.state)).toBe('activated');
    const expectedShellAssets = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src], link[rel="stylesheet"][href]'))
        .map((element) => new URL(element instanceof HTMLScriptElement ? element.src : element.href).pathname),
    );
    await expect.poll(() => page.evaluate(async (expectedAssets) => {
      const assets: Array<{ path: string; bytes: number }> = [];
      for (const cacheName of await caches.keys()) {
        const cache = await caches.open(cacheName);
        for (const request of await cache.keys()) {
          const response = await cache.match(request);
          assets.push({ path: new URL(request.url).pathname, bytes: (await response?.arrayBuffer())?.byteLength ?? 0 });
        }
      }
      return expectedAssets.filter((asset) => assets.some((cached) => cached.path === asset && cached.bytes > 0)).length;
    }, expectedShellAssets)).toBe(expectedShellAssets.length);
    expect(expectedShellAssets).not.toEqual([]);
    // A new install must survive without relying on the browser's HTTP cache.
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Add intros and outros');
    await expect(page.getByText(/You’re offline/)).toBeVisible();
    await expect(page.locator('#queue-list .job-ticket')).toHaveCount(3);
    await page.getByRole('button', { name: 'Render batch' }).click();
    await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('audio')).toHaveCount(3);
  } finally {
    await context.close();
  }
});

test('@claim:demo-sample-data One click opens a useful three-track sample batch', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Wrapline');
  await expect(page.getByText(/Demo — sample data, nothing is saved to your real data/)).toBeVisible();
  await expect(page.locator('#queue-list .job-ticket')).toHaveCount(3);
  await expect(page.locator('#queue-list')).toContainText('harbour-forecast.wav');
  await expect(page.locator('#intro-status')).toHaveText('signal-desk-intro.wav');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  await page.locator('#recipe-name').fill('Changed sample');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.waitForURL('/demo');
  await expect(page.locator('#recipe-name')).toHaveValue('Signal Desk');
  await expect(page.locator('#queue-list .job-ticket')).toHaveCount(3);
});

test('@claim:demo-isolation Demo storage never reads the real bench', async ({ page }) => {
  await page.goto('/');
  await page.locator('#recipe-name').fill('Private production recipe');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toContainText('Private production recipe');

  await page.goto('/demo');
  await expect(page.locator('#recipe-name')).toHaveValue('Signal Desk');
  const databaseNames = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databaseNames).toContain('wrapline-local');
  expect(databaseNames).toContain('demo:wrapline-local');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL('/');
  await expect(page.locator('#recipe-name')).toHaveValue('Private production recipe');
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).not.toContain('demo:wrapline-local');
});

test('@claim:local-audio Demo rendering sends no audio or analytics off-device', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  const origin = new URL(page.url()).origin;
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => ['http:', 'https:'].includes(new URL(url).protocol) ? new URL(url).origin === origin : true)).toBe(true);
});

test('@claim:wav-receipt Demo output provides reviewable WAV files and a receipt', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('audio')).toHaveCount(3);
  const decodedDuration = await page.locator('audio').first().evaluate(async (audio) => {
    const bytes = await fetch((audio as HTMLAudioElement).src).then((response) => response.arrayBuffer());
    const context = new AudioContext();
    const decoded = await context.decodeAudioData(bytes.slice(0));
    await context.close();
    return decoded.duration;
  });
  expect(decodedDuration).toBeGreaterThan(1.5);
  expect(await page.locator('.job-output a[download]').evaluateAll((links) => links.map((link) => link.getAttribute('download')))).toEqual([
    'Signal Desk-12-harbour-forecast.wav',
    'Signal Desk-13-library-after-dark.wav',
    'Signal Desk-14-maker-class-three.wav',
  ]);
  await expect(page.locator('#batch-download')).toContainText('3 WAV files + receipt');
});

test('@claim:mp3-output MP3 output uses the selected bitrate and remains playable', async ({ page }) => {
  for (const bitrate of [128, 192]) {
    await page.goto('/demo');
    while (await page.locator('[data-remove-job]').count() > 1) await page.locator('[data-remove-job]').last().click();
    await page.locator('#output-format').selectOption('mp3');
    await page.locator('#mp3-bitrate').selectOption(String(bitrate));
    await page.getByRole('button', { name: 'Render batch' }).click();
    await expect(page.getByRole('link', { name: 'Download MP3' })).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('#batch-download')).toContainText('1 MP3 file + receipt');
    const info = await page.locator('audio').evaluate(async (audio) => {
      const bytes = new Uint8Array(await fetch((audio as HTMLAudioElement).src).then((response) => response.arrayBuffer()));
      let offset = 0;
      while (offset + 4 < bytes.length && !(bytes[offset] === 0xff && ((bytes[offset + 1] ?? 0) & 0xe0) === 0xe0)) offset += 1;
      const header = ((bytes[offset] ?? 0) << 24) | ((bytes[offset + 1] ?? 0) << 16) | ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);
      const bitrateIndex = (header >>> 12) & 0x0f;
      const sampleRateIndex = (header >>> 10) & 0x03;
      const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
      const sampleRates = [44_100, 48_000, 32_000];
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(bytes.buffer.slice(0));
      await context.close();
      return { bytes: bytes.length, bitrate: bitrates[bitrateIndex], sampleRate: sampleRates[sampleRateIndex], duration: decoded.duration };
    });
    expect(info.bytes).toBeGreaterThan(500);
    expect(info.bitrate).toBe(bitrate);
    expect(info.sampleRate).toBe(48_000);
    expect(info.duration).toBeGreaterThan(0.8);
    await expect(page.locator('.job-output a[download]')).toHaveAttribute('download', /\.mp3$/);
    const receiptDownload = page.waitForEvent('download');
    await page.locator('#receipt-list [data-receipt]').click();
    const receiptPath = await (await receiptDownload).path();
    const receipt = JSON.parse(readFileSync(receiptPath as string, 'utf8')) as { codec: string; bitrateKbps: number; items: Array<{ output: string }> };
    expect(receipt).toMatchObject({ codec: 'MP3 CBR', bitrateKbps: bitrate });
    expect(receipt.items[0]?.output).toMatch(/\.mp3$/);
  }
});

test('@claim:audio-behavior Loudness, mixing, peak, rate, and bit depth match the disclosure', async ({ page }) => {
  const resetDemoAudio = async () => {
    await page.goto('/demo');
    while (await page.locator('[data-remove-job]').count()) await page.locator('[data-remove-job]').first().click();
    for (const name of ['Clear intro', 'Clear outro', 'Clear music bed']) await page.getByRole('button', { name }).click();
  };
  const wavStats = async (ranges: Array<[number, number]>, index = 0) => page.locator('audio').nth(index).evaluate(async (audio, sampleRanges) => {
    const bytes = await fetch((audio as HTMLAudioElement).src).then((response) => response.arrayBuffer());
    const view = new DataView(bytes);
    const rate = view.getUint32(24, true);
    const channels = view.getUint16(22, true);
    const bits = view.getUint16(34, true);
    const frames = view.getUint32(40, true) / (channels * bits / 8);
    let peak = 0;
    for (let offset = 44; offset < bytes.byteLength; offset += 2) peak = Math.max(peak, Math.abs(view.getInt16(offset, true)) / 32768);
    const rms = sampleRanges.map(([start, end]) => {
      let sum = 0;
      let count = 0;
      const first = Math.floor(start * rate);
      const last = Math.min(frames, Math.floor(end * rate));
      for (let frame = first; frame < last; frame += 1) {
        const sample = view.getInt16(44 + frame * channels * 2, true) / 32768;
        sum += sample * sample;
        count += 1;
      }
      return Math.sqrt(sum / count);
    });
    return { riff: String.fromCharCode(...new Uint8Array(bytes.slice(0, 4))), rate, bits, peak, rms };
  }, ranges);

  await resetDemoAudio();
  await page.locator('#intro-file').setInputFiles({ name: 'level-intro.wav', mimeType: 'audio/wav', buffer: wavBuffer(0.5, 0.1, 440, 48_000) });
  await page.locator('#outro-file').setInputFiles({ name: 'level-outro.wav', mimeType: 'audio/wav', buffer: wavBuffer(0.5, 0.1, 660, 48_000) });
  await page.locator('#voice-files').setInputFiles({ name: 'silent-voice.wav', mimeType: 'audio/wav', buffer: wavBuffer(1, 0, 440, 48_000) });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('audio')).toBeVisible({ timeout: 20_000 });
  const wrapperStats = await wavStats([[0.1, 0.4], [1.6, 1.9]]);
  expect(wrapperStats.riff).toBe('RIFF');
  expect(wrapperStats.rate).toBe(48_000);
  expect(wrapperStats.bits).toBe(16);
  expect(wrapperStats.rms[0]).toBeCloseTo(0.1 / Math.sqrt(2), 2);
  expect(wrapperStats.rms[1]).toBeCloseTo(0.1 / Math.sqrt(2), 2);

  await resetDemoAudio();
  await page.locator('#intro-file').setInputFiles({ name: 'silent-intro.wav', mimeType: 'audio/wav', buffer: wavBuffer(1, 0, 440, 48_000) });
  await page.locator('#bed-file').setInputFiles({ name: 'bed-tone.wav', mimeType: 'audio/wav', buffer: wavBuffer(0.4, 0.5, 1_000, 48_000) });
  await page.locator('#voice-files').setInputFiles({ name: 'silent-voice.wav', mimeType: 'audio/wav', buffer: wavBuffer(1, 0, 440, 48_000) });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('audio')).toBeVisible({ timeout: 20_000 });
  const bedStats = await wavStats([[0.01, 0.04], [1.4, 1.7]]);
  const duckDb = 20 * Math.log10((bedStats.rms[1] ?? 0) / (bedStats.rms[0] ?? 1));
  expect(duckDb).toBeGreaterThan(-7.2);
  expect(duckDb).toBeLessThan(-6.8);

  await resetDemoAudio();
  await page.locator('#voice-files').setInputFiles([
    { name: 'quiet.wav', mimeType: 'audio/wav', buffer: wavBuffer(0.5, 0.001, 440, 48_000) },
    { name: 'loud.wav', mimeType: 'audio/wav', buffer: wavBuffer(0.5, 0.99, 440, 48_000) },
  ]);
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('audio')).toHaveCount(2, { timeout: 20_000 });
  const loudStats = await wavStats([[0, 0.5]], 1);
  expect(loudStats.peak).toBeGreaterThan(0);
  expect(loudStats.peak).toBeLessThanOrEqual(0.9796);
  const receiptDownload = page.waitForEvent('download');
  await page.locator('#receipt-list [data-receipt]').first().click();
  const receiptPath = await (await receiptDownload).path();
  const receipt = JSON.parse(readFileSync(receiptPath as string, 'utf8')) as { items: Array<{ appliedGainDb: number }>; measurement: string };
  expect(receipt.items.map((item) => item.appliedGainDb)).toEqual([12, -12]);
  expect(receipt.measurement).toContain('intro/outro unchanged');
  expect(receipt.measurement).toContain('bed −7 dB under voice');
});

test('WAV output header and sample peak remain valid', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.disclosure')).toContainText('RMS');
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('audio').first()).toBeVisible({ timeout: 20_000 });
  const header = await page.locator('audio').first().evaluate(async (audio) => {
    const bytes = await fetch(audio.src).then((response) => response.arrayBuffer());
    const view = new DataView(bytes);
    const rate = view.getUint32(24, true);
    const channels = view.getUint16(22, true);
    const bits = view.getUint16(34, true);
    const duration = view.getUint32(40, true) / (rate * channels * bits / 8);
    let peak = 0;
    for (let offset = 44; offset < bytes.byteLength; offset += 2) peak = Math.max(peak, Math.abs(view.getInt16(offset, true)) / 32768);
    return { riff: String.fromCharCode(...new Uint8Array(bytes.slice(0, 4))), rate, bits, duration, peak };
  });
  expect(header).toMatchObject({ riff: 'RIFF', rate: 48_000, bits: 16 });
  expect(header.duration).toBeGreaterThan(1.8);
  expect(header.peak).toBeGreaterThan(0);
  expect(header.peak).toBeLessThanOrEqual(0.9796);
});

test('@claim:source-receipt A receipt records the source hash and production fields', async ({ page }) => {
  const input = wavBuffer();
  const expectedHash = createHash('sha256').update(input).digest('hex');
  await page.goto('/demo');
  while (await page.locator('[data-remove-job]').count()) await page.locator('[data-remove-job]').first().click();
  await page.locator('#voice-files').setInputFiles({ name: 'untouched-source.wav', mimeType: 'audio/wav', buffer: input });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#receipt-list [data-receipt]').click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const receipt = JSON.parse(readFileSync(path as string, 'utf8')) as {
    recipeVersion: number;
    codec: string;
    measurement: string;
    items: Array<Record<string, unknown>>;
  };
  expect(receipt.recipeVersion).toBe(0);
  expect(receipt.codec).toBe('WAV PCM 16-bit');
  expect(receipt.measurement).toContain('RMS-based LUFS estimate');
  expect(receipt.items).toHaveLength(1);
  expect(receipt.items[0]).toMatchObject({
    source: 'untouched-source.wav',
    sourceSha256: expectedHash,
    peakLimited: expect.any(Boolean),
    appliedGainDb: expect.any(Number),
    durationSeconds: expect.any(Number),
    output: expect.stringMatching(/\.wav$/),
  });
});

test('@claim:studio-license The Studio call to action names the registered $29 one-time license', async ({ page }) => {
  await page.goto('/demo');
  const link = page.locator('#buy-link');
  await expect(link).toHaveText('Buy studio license · $29');
  await expect(link).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout');
  await expect(page.locator('#unlock')).toContainText('one-time purchase');
});

test('@claim:studio-unlimited A valid Studio license permits more recipes and tracks', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => String(input).includes('/api/v1/products/audio-wrapper-batch/verify?license=')
      ? Promise.resolve(new Response(JSON.stringify({ valid: true, reason: 'ok' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }))
      : nativeFetch(input, init);
  });
  await page.goto('/');
  await page.locator('#license-token').fill('valid-studio-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-message')).toContainText('Unlimited batches and recipes are active');

  await page.locator('#recipe-name').fill('Studio recipe one');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await page.getByRole('button', { name: 'Create new recipe' }).click();
  await page.locator('#recipe-name').fill('Studio recipe two');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#saved-recipes option')).toHaveCount(3);

  await page.locator('#voice-files').setInputFiles([1, 2, 3, 4].map((index) => ({
    name: `studio-${index}.wav`, mimeType: 'audio/wav', buffer: wavBuffer(),
  })));
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByText('4 of 4 tracks rendered. Review them above or download the batch.')).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('audio')).toHaveCount(4);
});

test('@claim:license-daily-check A completed license check is reused for one day', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { __wraplineVerificationRequests?: number };
    const nativeFetch = window.fetch.bind(window);
    state.__wraplineVerificationRequests = 0;
    window.fetch = (input, init) => {
      if (!String(input).includes('/api/v1/products/audio-wrapper-batch/verify?license=')) return nativeFetch(input, init);
      state.__wraplineVerificationRequests = (state.__wraplineVerificationRequests ?? 0) + 1;
      return Promise.resolve(new Response(JSON.stringify({ valid: false, reason: 'invalid' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }));
    };
  });
  await page.goto('/');
  await page.locator('#license-token').fill('same-invalid-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-message')).toContainText('could not be verified');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-message')).toContainText('could not be verified');
  expect(await page.evaluate(() => (window as typeof window & { __wraplineVerificationRequests?: number }).__wraplineVerificationRequests)).toBe(1);
});

test('@claim:license-boundary Verification sends only the license token and invalid responses stay locked', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { __wraplineVerificationUrl?: string };
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      if (!String(input).includes('/api/v1/products/audio-wrapper-batch/verify?license=')) return nativeFetch(input, init);
      state.__wraplineVerificationUrl = String(input);
      return Promise.resolve(new Response(JSON.stringify({ valid: false, reason: 'revoked' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }));
    };
  });
  await page.goto('/');
  await page.locator('#license-token').fill('token with spaces');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-message')).toContainText('could not be verified');
  expect(await page.evaluate(() => (window as typeof window & { __wraplineVerificationUrl?: string }).__wraplineVerificationUrl))
    .toBe('https://api.sociobot.in/api/v1/products/audio-wrapper-batch/verify?license=token%20with%20spaces');
  const stored = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])));
  expect(Object.keys(stored).sort()).toEqual([
    'sb_license:audio-wrapper-batch',
    'sb_license_verdict:audio-wrapper-batch',
  ]);
  expect(Object.values(stored).join(' ')).not.toMatch(/card|recipe|\.wav|\.mp3/i);
  await expect(page.locator('#tier-note')).toContainText('Free batches');
});

test('@claim:recipe-controls A recipe can be exported with audio and deleted', async ({ page }) => {
  await page.goto('/');
  await page.locator('#recipe-name').fill('Portable show');
  await page.locator('#intro-file').setInputFiles({ name: 'portable-intro.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Save recipe' }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export recipe JSON' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(readFileSync(path as string, 'utf8')) as { format: string; name: string; intro?: { name: string; blob: string } };
  expect(exported).toMatchObject({ format: 'wrapline-recipe-v1', name: 'Portable show', intro: { name: 'portable-intro.wav' } });
  expect(exported.intro?.blob).toMatch(/^data:audio\/wav;base64,/);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete recipe', exact: true }).click();
  await expect(page.locator('#recipe-message')).toHaveText('Recipe deleted.');
  await expect(page.locator('#saved-recipes option')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#recipe-name')).toHaveValue('My show');
  await expect(page.locator('#intro-status')).toHaveText('No intro selected');
});

test('@claim:free-tier An unverified license keeps the three-track free limit', async ({ page }) => {
  await page.route('**/api/v1/products/audio-wrapper-batch/verify?license=*', (route) => route.abort('failed'));
  await page.goto('/');
  await page.locator('#recipe-name').fill('First free recipe');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toContainText('First free recipe');
  await page.getByRole('button', { name: 'Create new recipe' }).click();
  await page.locator('#recipe-name').fill('Second free recipe');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toContainText('The free tier holds one recipe');
  await page.locator('#license-token').fill('arbitrary-unverified-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText(/could not be verified/)).toBeVisible();
  await expect(page.locator('#buy-link')).toHaveText('Buy studio license · $29');

  await page.locator('#voice-files').setInputFiles([1, 2, 3, 4].map((index) => ({
    name: `outage-${index}.wav`, mimeType: 'audio/wav', buffer: wavBuffer(),
  })));
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByText(/more than 3 tracks/)).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(0);
});

test('enforces start-number bounds before saving or rendering', async ({ page }) => {
  await page.goto('/');
  await page.locator('#start-number').fill('-1');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toHaveText('Start number must be a whole number from 0 through 9999.');

  await page.locator('#voice-files').setInputFiles({ name: 'bounded.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('#render-message')).toHaveText('Start number must be a whole number from 0 through 9999.');
  await expect(page.locator('audio')).toHaveCount(0);
});

test('moves focus to main and preserves usable mobile-sized controls', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main');

  for (const selector of ['#intro-file', '#outro-file', '#bed-file', '.disclosure summary', '#voice-files', 'footer a']) {
    const boxes = await page.locator(selector).evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
    expect(boxes.length).toBeGreaterThan(0);
    expect(boxes.every((box) => box.width >= 44 && box.height >= 44), `${selector}: ${JSON.stringify(boxes)}`).toBe(true);
  }
  await expect(page.locator('#import-recipe')).toBeHidden();
  await page.locator('#import-recipe-button').focus();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('import-recipe-button');

  await page.goto('/demo');
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  const downloadTargets = await page.locator('.job-output a[download], #batch-download a[download]').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(downloadTargets.length).toBe(4);
  for (const target of downloadTargets) {
    expect(target.width, `${target.label} width`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${target.label} height`).toBeGreaterThanOrEqual(44);
  }
  const visibleTargets = await page.locator('a[href], button, input:not([type="hidden"]), select, summary, audio').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && !element.hasAttribute('hidden') && box.width > 0 && box.height > 0;
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { label: element.getAttribute('aria-label') ?? element.textContent?.trim() ?? element.id, width: box.width, height: box.height };
    }));
  for (const target of visibleTargets) {
    expect(target.width, `${target.label} width`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${target.label} height`).toBeGreaterThanOrEqual(44);
  }
});

test('controls use labels that name their result', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Create new recipe', 'Export recipe JSON', 'Import recipe JSON', 'Verify license']) {
    await expect(page.getByRole('button', { name })).toBeVisible();
  }
  await page.locator('#recipe-name').fill('Named controls');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.getByRole('button', { name: 'Delete recipe' })).toBeVisible();
  await page.locator('#voice-files').setInputFiles({ name: 'labels.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download WAV' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Download receipt JSON' })).toBeVisible();
  await expect(page.locator('#update-button')).toHaveText('Install update');
});

test('release build exposes the registered hosted Studio checkout', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('#buy-link');
  await expect(link).toHaveText('Buy studio license · $29');
  await expect(link).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout');
  await expect(link).not.toHaveAttribute('aria-disabled');
});
