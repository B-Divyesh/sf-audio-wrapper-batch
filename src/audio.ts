import type { Recipe, RenderedFile } from './types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function sanitizeFilename(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/-+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '')
    .trim()
    .slice(0, 160) || 'wrapped-audio';
}

export function outputName(
  template: string,
  recipe: string,
  source: string,
  number: number,
  format: 'wav' | 'mp3' = 'wav',
): string {
  const sourceStem = source.replace(/\.[^.]+$/, '');
  const rendered = template
    .replaceAll('{recipe}', recipe)
    .replaceAll('{source}', sourceStem)
    .replaceAll('{number}', String(number).padStart(2, '0'));
  return `${sanitizeFilename(rendered)}.${format}`;
}

export function estimatedGainDb(rms: number, targetLufs: number): number {
  if (!Number.isFinite(rms) || rms <= 0) return 0;
  const approximateLufs = 20 * Math.log10(rms) - 0.691;
  return clamp(targetLufs - approximateLufs, -12, 12);
}

function rmsOf(buffer: AudioBuffer): number {
  let sum = 0;
  let samples = 0;
  const step = Math.max(1, Math.floor(buffer.length / 1_000_000));
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += step) {
      const sample = data[index] ?? 0;
      sum += sample * sample;
      samples += 1;
    }
  }
  return samples ? Math.sqrt(sum / samples) : 0;
}

function peakOf(buffer: AudioBuffer): number {
  let peak = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += 1) peak = Math.max(peak, Math.abs(data[index] ?? 0));
  }
  return peak;
}

function connectSource(
  context: OfflineAudioContext,
  buffer: AudioBuffer,
  start: number,
  gainValue: number,
): AudioBufferSourceNode {
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  gain.gain.value = gainValue;
  source.connect(gain).connect(context.destination);
  source.start(start);
  return source;
}

async function decode(context: BaseAudioContext, blob?: Blob): Promise<AudioBuffer | undefined> {
  if (!blob) return undefined;
  return context.decodeAudioData(await blob.arrayBuffer());
}

export async function sha256(blob: Blob): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function renderWrappedFile(
  input: File,
  recipe: Recipe,
  sequence: number,
): Promise<RenderedFile> {
  const decodeContext = new AudioContext({ sampleRate: 48_000 });
  try {
    const [voice, intro, outro, bed] = await Promise.all([
      decode(decodeContext, input),
      decode(decodeContext, recipe.intro?.blob),
      decode(decodeContext, recipe.outro?.blob),
      decode(decodeContext, recipe.bed?.blob),
    ]);
    if (!voice) throw new Error('The voice track could not be decoded. Try a standard WAV or MP3 file.');

    const introDuration = intro?.duration ?? 0;
    const voiceStart = introDuration;
    const outroStart = voiceStart + voice.duration;
    const duration = Math.max(0.1, outroStart + (outro?.duration ?? 0));
    const channels = Math.min(2, Math.max(1, voice.numberOfChannels, intro?.numberOfChannels ?? 1, outro?.numberOfChannels ?? 1));
    const frames = Math.ceil(duration * decodeContext.sampleRate);
    const offline = new OfflineAudioContext(channels, frames, decodeContext.sampleRate);

    const gainDb = estimatedGainDb(rmsOf(voice), recipe.targetLufs);
    const voiceGain = 10 ** (gainDb / 20);
    if (intro) connectSource(offline, intro, 0, 1);
    connectSource(offline, voice, voiceStart, voiceGain);
    if (outro) connectSource(offline, outro, outroStart, 1);

    if (bed) {
      const source = offline.createBufferSource();
      const gain = offline.createGain();
      source.buffer = bed;
      source.loop = true;
      const baseGain = 10 ** (recipe.bedDb / 20);
      gain.gain.setValueAtTime(baseGain, 0);
      const duckedGain = baseGain * 10 ** (-7 / 20);
      gain.gain.linearRampToValueAtTime(duckedGain, Math.min(voiceStart + 0.25, duration));
      gain.gain.setValueAtTime(duckedGain, Math.max(voiceStart, outroStart - 0.25));
      gain.gain.linearRampToValueAtTime(baseGain, Math.min(outroStart + 0.15, duration));
      source.connect(gain).connect(offline.destination);
      source.start(0);
      source.stop(duration);
    }

    const rendered = await offline.startRendering();
    const peak = peakOf(rendered);
    const peakCeiling = 10 ** (-0.18 / 20);
    const outputScale = peak > peakCeiling ? peakCeiling / peak : 1;
    const format = recipe.outputFormat ?? 'wav';
    const bitrateKbps = recipe.mp3Bitrate ?? 128;
    const blob = format === 'mp3'
      ? await encodeMp3(rendered, outputScale, bitrateKbps)
      : encodeWav(rendered, outputScale);
    return {
      name: outputName(recipe.naming, recipe.name, input.name, sequence, format),
      blob,
      durationSeconds: rendered.duration,
      gainDb,
      peakLimited: outputScale < 1,
      sourceHash: await sha256(input),
      format,
      ...(format === 'mp3' ? { bitrateKbps } : {}),
    };
  } catch (error) {
    if (error instanceof DOMException) {
      throw new Error(`“${input.name}” could not be decoded. Try a PCM WAV or standard MP3.`);
    }
    throw error;
  } finally {
    await decodeContext.close();
  }
}

export async function encodeMp3(buffer: AudioBuffer, scale = 1, bitrate: 128 | 192 = 128): Promise<Blob> {
  const { default: createEncoder } = await import('@audio/encode-mp3');
  const channels = Math.min(2, buffer.numberOfChannels);
  const encoder = await createEncoder({ sampleRate: buffer.sampleRate, channels, bitrate });
  try {
    const channelData = Array.from({ length: channels }, (_, channel) => {
      const source = buffer.getChannelData(channel);
      if (scale === 1) return source;
      const scaled = new Float32Array(source.length);
      for (let index = 0; index < source.length; index += 1) scaled[index] = (source[index] ?? 0) * scale;
      return scaled;
    });
    const body = encoder.encode(channelData);
    const tail = encoder.flush();
    const bytes = new Uint8Array(body.length + tail.length);
    bytes.set(body);
    bytes.set(tail, body.length);
    return new Blob([bytes.buffer], { type: 'audio/mpeg' });
  } finally {
    encoder.free();
  }
}

export function encodeWav(buffer: AudioBuffer, scale = 1): Blob {
  const channels = Math.min(2, buffer.numberOfChannels);
  const bytesPerSample = 2;
  const dataLength = buffer.length * channels * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(arrayBuffer);
  const writeText = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };
  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, dataLength, true);
  let offset = 44;
  for (let frame = 0; frame < buffer.length; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = clamp((buffer.getChannelData(channel)[frame] ?? 0) * scale, -1, 1);
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

const crcTable = new Uint32Array(256).map((_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = (crc >>> 8) ^ (crcTable[(crc ^ byte) & 0xff] ?? 0);
  return (crc ^ 0xffffffff) >>> 0;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const joined = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    joined.set(part, offset);
    offset += part.length;
  }
  return joined;
}

export async function createZip(files: Array<{ name: string; blob: Blob }>): Promise<Blob> {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const directoryParts: Uint8Array[] = [];
  let localOffset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);
    localParts.push(local, data);

    const directory = new Uint8Array(46 + name.length);
    const dv = new DataView(directory.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 20, true);
    dv.setUint16(8, 0x0800, true);
    dv.setUint32(16, crc, true);
    dv.setUint32(20, data.length, true);
    dv.setUint32(24, data.length, true);
    dv.setUint16(28, name.length, true);
    dv.setUint32(42, localOffset, true);
    directory.set(name, 46);
    directoryParts.push(directory);
    localOffset += local.length + data.length;
  }
  const directory = concat(directoryParts);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, directory.length, true);
  ev.setUint32(16, localOffset, true);
  const zipped = concat([...localParts, directory, end]);
  return new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
}
