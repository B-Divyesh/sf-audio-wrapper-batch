import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  await expect(page.getByText('Your numbered job tickets will appear here.')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('renders a real local WAV into a reviewable batch', async ({ page }) => {
  await page.goto('/');
  await page.locator('#voice-files').setInputFiles({ name: 'episode-one.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await expect(page.getByText('episode-one.wav', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Render batch' }).click();
  await expect(page.getByRole('link', { name: 'Download batch ZIP' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/1 of 1 tracks wrapped/)).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(1);
});

test('keeps a saved recipe and wrapper audio across reloads', async ({ page }) => {
  await page.goto('/');
  await page.locator('#recipe-name').fill('Field notes');
  await page.locator('#intro-file').setInputFiles({ name: 'theme.wav', mimeType: 'audio/wav', buffer: wavBuffer() });
  await page.getByRole('button', { name: 'Save recipe' }).click();
  await expect(page.getByText(/Saved “Field notes” as version 1/)).toBeVisible();
  await page.reload();
  await expect(page.locator('#recipe-name')).toHaveValue('Field notes');
  await expect(page.locator('#intro-status')).toHaveText('theme.wav');
});

test('installed shell reloads while offline', async ({ page, context }) => {
  await page.goto('/');
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
  const cachedAssets = await page.evaluate(async () => {
    const assets: Array<{ path: string; bytes: number }> = [];
    for (const cacheName of await caches.keys()) {
      const cache = await caches.open(cacheName);
      for (const request of await cache.keys()) {
        const response = await cache.match(request);
        assets.push({ path: new URL(request.url).pathname, bytes: (await response?.arrayBuffer())?.byteLength ?? 0 });
      }
    }
    return assets;
  });
  expect(expectedShellAssets).not.toEqual([]);
  expect(expectedShellAssets.every((asset) => cachedAssets.some((cached) => cached.path === asset && cached.bytes > 0))).toBe(true);
  // A new install must survive without relying on the browser's HTTP cache.
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Batch the wrapper');
  await expect(page.getByText(/offline/i).first()).toBeVisible();
});

test('keeps an unverified license locked during a verification outage', async ({ page }) => {
  await page.route('**/api/v1/products/audio-wrapper-batch/verify?license=*', (route) => route.abort('failed'));
  await page.goto('/');
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
