import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  // Every test gets Playwright's owned context. Tests that need a different
  // service-worker policy create and close only their additional context.
  workers: 1,
  retries: 1,
  timeout: 30_000,
  use: {
    baseURL: process.env.WRAPLINE_TEST_BASE_URL ?? 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox'] },
  },
  // scripts/run-e2e.mjs owns the single preview lifecycle for every shard.
  // Keeping it outside Playwright prevents one shard from stopping a server
  // another shard still needs.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } },
  ],
});
