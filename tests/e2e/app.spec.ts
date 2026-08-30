import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

function wavBuffer(duration = 0.08): Buffer {
  const sampleRate = 8_000;
  const samples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples * 2, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(samples * 2, 40);
  for (let index = 0; index < samples; index += 1) buffer.writeInt16LE(Math.sin(index / 8) * 6000, 44 + index * 2);
  return buffer;
}

test('loads a clear, accessible empty bench', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Wrapline/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/demo');
  await expect(page.getByText('Your numbered job tickets will appear here.')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('release artifact returns the designed 404 document for an unknown URL', async ({ page }) => {
  const response = await page.goto('/missing-qa-404-repair-6');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Wrapline');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This Wrapline page was not found.');
  await expect(page.getByRole('link', { name: 'Return to Wrapline' })).toHaveAttribute('href', '/');
});

test('every public route has the shared keyboard shell and route metadata', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  const routes = [
    {
      path: '/', status: 200, title: 'Wrapline — repeatable batch audio finishing',
      canonical: 'https://audio-wrapper-batch.sociobot.in/', ogTitle: 'Wrapline — batch audio finishing',
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
    await expect(page.locator('header nav a'), route.path).toHaveText(['Finishing bench', 'How it works', 'License']);
    expect(await page.locator('header nav a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), route.path)
      .toEqual(['/#bench', '/#method', '/#unlock']);
    await expect(page.locator('footer'), route.path).toContainText('Local batch finishing for independent audio makers.');
    await expect(page.locator('footer'), route.path).toContainText('Built by Param Factory');
    await expect(page.locator('footer [data-build-id]'), route.path).toHaveText('Build 1.0.0-r7');

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
  expect(consoleErrors.filter((message) => message !== 'Failed to load resource: the server responded with a status of 404 (Not Found)')).toEqual([]);
  expect(consoleErrors.length).toBeLessThanOrEqual(1);
  expect(pageErrors).toEqual([]);
});

test('release artifact keeps the trailing demo URL in the sample sandbox', async ({ page }) => {
  const response = await page.goto('/demo/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('Demo — Wrapline');
  await expect(page.getByText(/Demo — sample data, nothing is saved to your real data/)).toBeVisible();
});

test('release artifact publishes the required social preview and app icons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Wrapline — batch audio finishing');
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
  await expect(links).toHaveText(['Finishing bench', 'How it works', 'License']);

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
  await page.locator('#voice-files').setInputFiles({ name: 'episode-one.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await expect(page.getByText('episode-one.wav', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/1 of 1 tracks wrapped/)).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(1);
});

test('@claim:local-recipes Saved recipes and wrapper audio persist on this device', async ({ page }) => {
  await page.goto('/');
  await page.locator('#recipe-name').fill('Field notes');
  await page.locator('#intro-file').setInputFiles({ name: 'theme.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.getByText(/Saved “Field notes” as version 1/)).toBeVisible();
  await page.reload();
  await expect(page.locator('#recipe-name')).toHaveValue('Field notes');
  await expect(page.locator('#intro-status')).toHaveText('theme.wav');
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Wrap finished voice tracks');
    await expect(page.getByText(/You’re offline/)).toBeVisible();
    await expect(page.locator('#queue-list .job-ticket')).toHaveCount(3);
  } finally {
    await context.close();
  }
});

test('@claim:demo-sample-data One click opens a useful three-track sample batch', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Wrapline');
  await expect(page.getByText(/Demo — sample data, nothing is saved to your real data/)).toBeVisible();
  await expect(page.locator('#queue-list .job-ticket')).toHaveCount(3);
  await expect(page.locator('#queue-list')).toContainText('harbour-forecast.wav');
  await expect(page.locator('#intro-status')).toHaveText('signal-desk-intro.wav');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
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
  await expect(page.locator('#batch-download')).toContainText('3 WAV files + receipt');
});

test('@claim:audio-behavior Output is disclosed as 48 kHz, 16-bit PCM WAV', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.disclosure')).toContainText('RMS');
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.locator('audio').first()).toBeVisible({ timeout: 20_000 });
  const header = await page.locator('audio').first().evaluate(async (audio) => {
    const bytes = await fetch(audio.src).then((response) => response.arrayBuffer());
    const view = new DataView(bytes);
    return { riff: String.fromCharCode(...new Uint8Array(bytes.slice(0, 4))), rate: view.getUint32(24, true), bits: view.getUint16(34, true) };
  });
  expect(header).toEqual({ riff: 'RIFF', rate: 48_000, bits: 16 });
});

test('@claim:source-receipt A receipt records the supplied source hash', async ({ page }) => {
  const input = wavBuffer();
  const expectedHash = createHash('sha256').update(input).digest('hex');
  await page.goto('/demo');
  while (await page.locator('[data-remove-job]').count()) await page.locator('[data-remove-job]').first().click();
  await page.locator('#voice-files').setInputFiles({ name: 'untouched-source.wav', mimeType: 'audio/wav', buffer: input });
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download batch ZIP' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  expect(readFileSync(path as string).toString('utf8')).toContain(expectedHash);
});

test('@claim:studio-license The Studio call to action names the registered $29 one-time license', async ({ page }) => {
  await page.goto('/demo');
  const link = page.locator('#buy-link');
  await expect(link).toHaveText('Buy studio license · $29');
  await expect(link).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout');
  await expect(page.locator('#unlock')).toContainText('one-time purchase');
});

test('@claim:free-tier An unverified license keeps the three-track free limit', async ({ page }) => {
  await page.route('**/api/v1/products/audio-wrapper-batch/verify?license=*', (route) => route.abort('failed'));
  await page.goto('/');
  await page.locator('#recipe-name').fill('First free recipe');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toContainText('First free recipe');
  await page.getByRole('button', { name: 'Start fresh' }).click();
  await page.locator('#recipe-name').fill('Second free recipe');
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.locator('#recipe-message')).toContainText('The free bench holds one recipe');
  await page.locator('#license-token').fill('arbitrary-unverified-token');
  await page.getByRole('button', { name: 'Verify' }).click();
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
});

test('release build exposes the registered hosted Studio checkout', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('#buy-link');
  await expect(link).toHaveText('Buy studio license · $29');
  await expect(link).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/audio-wrapper-batch/checkout');
  await expect(link).not.toHaveAttribute('aria-disabled');
});
