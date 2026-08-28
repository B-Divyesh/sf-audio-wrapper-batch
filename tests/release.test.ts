import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release response policy', () => {
  const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  const staticConfig = readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8');

  it('ships restrictive browser headers and immutable fingerprinted assets', () => {
    expect(headers).toContain("Content-Security-Policy: default-src 'self'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toContain('Permissions-Policy:');
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('/assets/*\n  Cache-Control: public, max-age=31536000, immutable');
    expect(headers).toContain('/sw.js\n  Cache-Control: no-cache, no-store, must-revalidate');
    expect(staticConfig).toContain('Content-Security-Policy');
    expect(staticConfig).toContain('Permissions-Policy');
    expect(staticConfig).toContain('X-Frame-Options');
    expect(staticConfig).toContain('max-age=31536000, immutable');
  });
});
