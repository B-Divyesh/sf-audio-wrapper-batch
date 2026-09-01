import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const serverScript = fileURLToPath(new URL('./static-server.mjs', import.meta.url));
const forwarded = process.argv.slice(2);
const targeted = forwarded.some((argument) => argument === '--grep' || argument.startsWith('--grep='));
const shards = targeted ? [undefined] : Array.from({ length: 12 }, (_, index) => `${index + 1}/12`);
const live = forwarded.some((argument) => argument.includes('playwright.live.config.ts'));
let preview;

async function waitForPreview() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Owned preview did not become ready.')), 5_000);
    preview.once('message', (message) => {
      if (message?.type !== 'ready' || !Number.isInteger(message.port)) return;
      clearTimeout(timeout);
      resolve(message.port);
    });
    preview.once('exit', (code, signal) => {
      clearTimeout(timeout);
      reject(new Error(`Owned preview exited before it was ready (${signal ?? code ?? 'unknown'}).`));
    });
  });
}

async function stopPreview() {
  if (!preview || preview.exitCode !== null) return;
  preview.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => preview.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  if (preview.exitCode === null) preview.kill('SIGKILL');
}

function runShard(shard, testBaseUrl) {
  const result = spawnSync(
    process.execPath,
    [cli, 'test', '--workers=1', ...forwarded, ...(shard ? [`--shard=${shard}`] : [])],
    { stdio: 'inherit', env: { ...process.env, ...(testBaseUrl ? { WRAPLINE_TEST_BASE_URL: testBaseUrl } : {}) } },
  );
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`Playwright shard ${shard ?? 'targeted'} stopped by ${result.signal}.`);
  if (result.status !== 0) throw new Error(`Playwright shard ${shard ?? 'targeted'} failed with status ${result.status ?? 1}.`);
}

try {
  let testBaseUrl;
  if (!live) {
    preview = spawn(process.execPath, [serverScript, '--port', '0'], { stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
    const port = await waitForPreview();
    testBaseUrl = `http://127.0.0.1:${port}`;
    const response = await fetch(testBaseUrl);
    if (!response.ok) throw new Error(`Owned preview returned ${response.status}.`);
  }
  for (const shard of shards) {
    runShard(shard, testBaseUrl);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await stopPreview();
}
