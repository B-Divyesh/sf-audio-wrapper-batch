export interface AudioAsset {
  name: string;
  type: string;
  lastModified: number;
  blob: Blob;
}

export interface Recipe {
  id: string;
  version: number;
  name: string;
  targetLufs: number;
  bedDb: number;
  naming: string;
  startNumber: number;
  outputFormat: 'wav' | 'mp3';
  mp3Bitrate: 128 | 192;
  intro?: AudioAsset;
  outro?: AudioAsset;
  bed?: AudioAsset;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  source: string;
  output: string;
  sourceSha256: string;
  durationSeconds: number;
  appliedGainDb: number;
  peakLimited: boolean;
}

export interface Receipt {
  id: string;
  renderedAt: string;
  recipeId: string;
  recipeName: string;
  recipeVersion: number;
  targetLufs: number;
  codec: 'WAV PCM 16-bit' | 'MP3 CBR';
  bitrateKbps?: 128 | 192;
  measurement: string;
  items: ReceiptItem[];
}

export interface RenderedFile {
  name: string;
  blob: Blob;
  durationSeconds: number;
  gainDb: number;
  peakLimited: boolean;
  sourceHash: string;
  format: 'wav' | 'mp3';
  bitrateKbps?: 128 | 192;
}
