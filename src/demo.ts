import type { AudioAsset, Recipe } from './types';

/**
 * The demo does not download an audio fixture.  These short, deterministic
 * PCM WAV files are made in memory from the shipped source so the demo works
 * on its first offline visit as well as on a networked one.
 */
function makeSampleWav(name: string, phrase: number[], seconds: number): File {
  const sampleRate = 12_000;
  const frames = Math.floor(sampleRate * seconds);
  const bytes = new ArrayBuffer(44 + frames * 2);
  const view = new DataView(bytes);
  const write = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + frames * 2, true);
  write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data');
  view.setUint32(40, frames * 2, true);

  for (let index = 0; index < frames; index += 1) {
    const time = index / sampleRate;
    const word = Math.min(phrase.length - 1, Math.floor((time / seconds) * phrase.length));
    const withinWord = ((time / seconds) * phrase.length) % 1;
    const frequency = phrase[word] ?? 220;
    // A voiced, syllable-like envelope makes the sample immediately useful
    // for hearing the wrapper path without claiming it is real narration.
    const envelope = Math.sin(Math.PI * withinWord) ** 1.8 * (0.68 + 0.14 * Math.sin(time * 2 * Math.PI * 4));
    const carrier = Math.sin(time * 2 * Math.PI * frequency) + 0.22 * Math.sin(time * 2 * Math.PI * frequency * 2);
    view.setInt16(44 + index * 2, Math.round(Math.max(-1, Math.min(1, carrier * envelope * 0.26)) * 0x7fff), true);
  }
  return new File([bytes], name, { type: 'audio/wav', lastModified: Date.UTC(2026, 7, 30) });
}

function asset(file: File): AudioAsset {
  return { name: file.name, type: file.type, lastModified: file.lastModified, blob: file };
}

export interface DemoSeed {
  recipe: Recipe;
  tracks: File[];
}

export function createDemoSeed(id: string, timestamp: string): DemoSeed {
  const intro = makeSampleWav('signal-desk-intro.wav', [392, 494, 587, 659], 0.42);
  const outro = makeSampleWav('signal-desk-outro.wav', [659, 587, 494, 392], 0.42);
  const bed = makeSampleWav('signal-desk-bed.wav', [110, 123, 147, 123], 0.68);
  return {
    recipe: {
      id,
      version: 0,
      name: 'Signal Desk',
      targetLufs: -16,
      bedDb: -28,
      naming: '{recipe}-{number}-{source}',
      startNumber: 12,
      outputFormat: 'wav',
      mp3Bitrate: 128,
      intro: asset(intro),
      outro: asset(outro),
      bed: asset(bed),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    tracks: [
      makeSampleWav('harbour-forecast.wav', [174, 196, 220, 196, 174], 1.05),
      makeSampleWav('library-after-dark.wav', [220, 247, 262, 247, 220], 1.12),
      makeSampleWav('maker-class-three.wav', [196, 220, 247, 220, 196], 0.98),
    ],
  };
}
