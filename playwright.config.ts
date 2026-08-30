import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // The first-install test exercises a service-worker lifecycle.  Running the
  // two device projects one at a time avoids competing install/cache work on
  // the shared preview origin and makes the release gate deterministic.
  workers: 1,
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  // Exercise the emitted artifact through the same explicit-route/404 policy
  // that Static Web Apps receives in dist/staticwebapp.config.json. Vite's
  // development fallback would incorrectly turn unknown release URLs into 200.
  webServer: { command: 'node scripts/static-server.mjs --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } },
  ],
});
