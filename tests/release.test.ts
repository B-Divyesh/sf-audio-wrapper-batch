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

  it('uses an explicit demo rewrite so unknown routes reach the real 404 response', () => {
    const config = JSON.parse(staticConfig) as {
      navigationFallback?: unknown;
      responseOverrides?: { '404'?: { rewrite?: string } };
      routes?: Array<{ route?: string; rewrite?: string }>;
    };
    const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
    const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
    const notFound = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes).toEqual(expect.arrayContaining([
      { route: '/demo', rewrite: '/index.html' },
      { route: '/demo/', rewrite: '/index.html' },
    ]));
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
    expect(robots).toContain('Sitemap: https://audio-wrapper-batch.sociobot.in/sitemap.xml');
    expect(sitemap).toContain('https://audio-wrapper-batch.sociobot.in/demo');
    expect(notFound).toContain('<h1>This page is not on the finishing bench.</h1>');
  });

  it('declares product-specific social metadata and local icon assets', () => {
    const document = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    expect(document).toContain('<meta property="og:title" content="Wrapline — batch audio finishing" />');
    expect(document).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(document).toContain('https://audio-wrapper-batch.sociobot.in/art/wrapline-social.jpg');
    expect(document).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
    expect(document).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />');
  });
});
