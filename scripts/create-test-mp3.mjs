import encodeMp3 from '@audio/encode-mp3';
import { mkdir, writeFile } from 'node:fs/promises';

const sampleRate = 48_000;
const durationSeconds = 0.4;
const samples = new Float32Array(Math.floor(sampleRate * durationSeconds));
for (let index = 0; index < samples.length; index += 1) {
  samples[index] = Math.sin(2 * Math.PI * 440 * index / sampleRate) * 0.24;
}

const encoder = await encodeMp3({ sampleRate, channels: 1, bitrate: 128 });
const body = encoder.encode([samples]);
const tail = encoder.flush();
encoder.free();
const output = new Uint8Array(body.length + tail.length);
output.set(body);
output.set(tail, body.length);
await mkdir(new URL('../tests/fixtures/', import.meta.url), { recursive: true });
await writeFile(new URL('../tests/fixtures/synthetic-tone-440hz.mp3', import.meta.url), output);
