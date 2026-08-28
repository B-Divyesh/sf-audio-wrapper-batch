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
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Batch the wrapper');
  await expect(page.getByText(/offline/i).first()).toBeVisible();
});
