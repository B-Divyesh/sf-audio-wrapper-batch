import { describe, expect, it } from 'vitest';
import { createZip, estimatedGainDb, outputName, sanitizeFilename } from '../src/audio';

describe('audio utilities', () => {
  it('builds stable, safe output names', () => {
    expect(outputName('{recipe}-{number}-{source}', 'Daily / News', 'take:one.mp3', 7)).toBe('Daily - News-07-take-one.wav');
    expect(sanitizeFilename('  <>  ')).toBe('-');
  });

  it('caps loudness correction to protect unexpected sources', () => {
    expect(estimatedGainDb(0.00001, -16)).toBe(12);
    expect(estimatedGainDb(1, -30)).toBe(-12);
    expect(estimatedGainDb(0, -16)).toBe(0);
  });

  it('creates a standards-shaped zip with a central directory', async () => {
    const zip = await createZip([{ name: 'receipt.json', blob: new Blob(['{}']) }]);
    const bytes = new Uint8Array(await zip.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
    expect(new TextDecoder().decode(bytes)).toContain('receipt.json');
    expect(zip.type).toBe('application/zip');
  });
});
