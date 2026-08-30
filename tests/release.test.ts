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

  it('keeps a production artifact buildable while the live catalog is temporarily unavailable', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { scripts: Record<string, string> };
    expect(packageJson.scripts.build).not.toContain('verify:checkout');
    expect(packageJson.scripts['verify:release']).toContain('verify:checkout');
    expect(packageJson.scripts.build).toContain('VITE_STUDIO_CHECKOUT_ENABLED=true vite build');
  });

  it('ships crawl metadata and a dedicated static-web-app 404 recovery page', () => {
    const config = JSON.parse(staticConfig) as { responseOverrides?: { '404'?: { rewrite?: string } } };
    const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
    const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
    const notFound = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
    expect(robots).toContain('Sitemap: https://audio-wrapper-batch.sociobot.in/sitemap.xml');
    expect(sitemap).toContain('https://audio-wrapper-batch.sociobot.in/demo');
    expect(notFound).toContain('<h1>This page is not on the finishing bench.</h1>');
  });
});
