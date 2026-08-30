import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const workerTemplatePath = fileURLToPath(new URL('./src/sw-template.js', import.meta.url));

/**
 * The worker has to know Vite's final fingerprinted entry names.  Generating
 * it from Rollup's output keeps the first installed offline shell complete
 * instead of relying on a later online reload to fill its cache.
 */
function offlineShell(): Plugin {
  return {
    name: 'wrapline-offline-shell',
    apply: 'build',
    generateBundle(_, bundle) {
      const generatedFiles = Object.values(bundle)
        .map((item) => `/${item.fileName}`)
        .filter((file) => /\.(?:js|css)$/.test(file));
      const shell = [
        '/', '/index.html', '/offline.html', '/manifest.webmanifest',
        '/icon-192.png', '/icon-512.png', '/art/wrapline-bench.webp',
        '/privacy/', '/terms/', '/404.html', '/legal.css', '/route-shell.js',
        '/robots.txt', '/sitemap.xml', ...generatedFiles,
      ];
      const version = `wrapline-${generatedFiles.join('|').replace(/[^a-z0-9]/gi, '').slice(-20) || 'shell'}`;
      const template = readFileSync(workerTemplatePath, 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replace('__WRAPLINE_VERSION__', version)
          .replace('__WRAPLINE_SHELL__', JSON.stringify([...new Set(shell)])),
      });
    },
    writeBundle(options) {
      // Static Web Apps treats /demo and /demo/ as the same route when
      // validating rules. Keep the configured rewrite for /demo and emit a
      // real directory document for the trailing-slash URL instead of adding
      // a duplicate route that the deploy validator rejects.
      const outputDir = options.dir ?? 'dist';
      const demoDirectory = join(outputDir, 'demo');
      mkdirSync(demoDirectory, { recursive: true });
      copyFileSync(join(outputDir, 'index.html'), join(demoDirectory, 'index.html'));
    },
  };
}

export default defineConfig({
  plugins: [offlineShell()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
});
