import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));
const forwarded = process.argv.slice(2);
const targeted = forwarded.some((argument) => argument === '--grep' || argument.startsWith('--grep='));
const shards = targeted ? [undefined] : Array.from({ length: 12 }, (_, index) => `${index + 1}/12`);

for (const project of ['chromium', 'mobile']) {
  for (const shard of shards) {
    const result = spawnSync(
      process.execPath,
      [cli, 'test', `--project=${project}`, ...forwarded, ...(shard ? [`--shard=${shard}`] : [])],
      { stdio: 'inherit', env: process.env },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
