import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Match the local runner: distribute this single file by test so live
  // verification uses short-lived browser processes too.
  fullyParallel: true,
  workers: 1,
  retries: 1,
  timeout: 30_000,
  use: {
    baseURL: 'https://audio-wrapper-batch.sociobot.in',
    // Keep live verification on the same pinned full Chromium binary as CI.
    channel: 'chromium',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox'] },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
