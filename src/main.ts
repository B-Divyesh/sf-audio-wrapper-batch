import './styles.css';
import { createZip, outputName, renderWrappedFile, sanitizeFilename } from './audio';
import { createDemoSeed } from './demo';
import { deleteRecipe, getReceipts, getRecipes, resetDemoStorage, saveReceipt, saveRecipe, setStorageScope } from './db';
import { captureReturnedLicense, checkoutUrl, licenseState, setLicenseStorageScope, storeLicense, studioCheckoutAvailable, verifyLicense } from './license';
import type { AudioAsset, Receipt, Recipe, RenderedFile } from './types';

type Job = { id: string; file: File; output?: RenderedFile; url?: string; error?: string };

const route = new URL(location.href);
const demoMode = route.pathname.replace(/\/+$/, '') === '/demo' || route.searchParams.get('demo') === '1';
setStorageScope(demoMode);
setLicenseStorageScope(demoMode);
if (demoMode) {
  const demoDescription = 'Try Wrapline with three sample voice tracks, an intro, outro, music bed, and a ready-to-render batch.';
  document.title = 'Demo — Wrapline';
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', 'https://audio-wrapper-batch.sociobot.in/demo');
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', demoDescription);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', 'https://audio-wrapper-batch.sociobot.in/demo');
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', 'Demo — Wrapline');
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', demoDescription);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', 'Demo — Wrapline');
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', demoDescription);
}

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root is missing.');

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="/" aria-label="Wrapline home"><span class="brand-mark" aria-hidden="true">≋</span> Wrapline</a>
    <nav aria-label="Main navigation">
      <a href="/#bench">Audio setup</a><a href="/#method">How it works</a><a href="/#unlock">License</a>
    </nav>
    <span class="connection" id="connection"><span aria-hidden="true">●</span> <span>On device</span></span>
  </header>
  <div class="offline-banner" id="offline-banner" role="status" hidden>You’re offline. Local audio processing still works; license checks will resume later.</div>
  ${demoMode ? '<div class="demo-banner" role="status"><span><strong>Demo — sample data, nothing is saved to your real data.</strong> Three short sample tracks are ready to render.</span><span class="demo-actions"><button class="text-button" id="reset-demo" type="button">Reset demo</button><button class="button quiet" id="start-real" type="button">Start for real</button></span></div>' : ''}
  <main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Intros and outros for many tracks</p>
        <h1 id="hero-title" tabindex="-1">Add intros and outros to voice tracks</h1>
        <p class="lede">For podcasters, radio makers, and course creators who need the same music, loudness, and filenames across many tracks.</p>
        <div class="hero-actions"><span class="sample-action"><a class="button primary" href="${demoMode ? '#bench' : '/demo'}">${demoMode ? 'Open the sample batch' : 'Try it with sample data'}</a><small>${demoMode ? 'Jumps to three ready-to-render voice tracks.' : 'Opens three ready-to-render voice tracks.'}</small></span><a class="button secondary" href="#bench">Set up a real batch</a><button class="button secondary" id="install-button" type="button" hidden>Install app</button></div>
        <ul class="proof-list" aria-label="Product facts"><li>WAV and MP3 input</li><li>WAV or MP3 output</li><li>Audio stays on this device</li></ul>
      </div>
      <figure class="hero-art">
        <img src="/art/wrapline-bench.webp" width="1280" height="853" fetchpriority="high" decoding="async" alt="Risograph collage of waveform strips passing through a hand-operated printing jig" />
        <figcaption>Intro, voice, outro, and bed.</figcaption>
      </figure>
    </section>

    <section class="bench" id="bench" aria-labelledby="bench-title">
      <div class="section-heading">
        <p class="eyebrow">Your batch setup</p>
        <h2 id="bench-title">Save intro, outro, bed, and filename</h2>
        <p>Choose the added audio once, then review and download each rendered batch.</p>
      </div>
      <div class="bench-grid">
        <section class="recipe-sheet" aria-labelledby="recipe-title">
          <div class="sheet-heading"><div><span class="step-number">01</span><h3 id="recipe-title">Audio recipe</h3></div><span id="version-stamp" class="stamp">Unsaved</span></div>
          <div class="saved-row">
            <label for="saved-recipes">Saved recipe</label>
            <select id="saved-recipes"><option value="">New recipe</option></select>
            <button class="text-button" id="new-recipe" type="button">Create new recipe</button>
          </div>
          <form id="recipe-form" novalidate>
            <div class="field full"><label for="recipe-name">Recipe name</label><input id="recipe-name" name="recipe-name" value="My show" maxlength="60" required /><small>Used in filenames and receipts.</small></div>
            <div class="layer-stack" aria-label="Audio layers">
              <div class="audio-layer intro-layer">
                <span class="layer-index">A</span><div><label for="intro-file">Intro <span>optional</span></label><input id="intro-file" type="file" accept="audio/wav,audio/mpeg,.wav,.mp3" /><small id="intro-status">No intro selected</small></div><button class="icon-button" type="button" data-clear="intro" aria-label="Clear intro">×</button>
              </div>
              <div class="audio-layer voice-layer" aria-hidden="true"><span class="layer-index">B</span><div><strong>Voice tracks</strong><small>Added to the queue next</small></div><span class="wave-mini">▂▅▃▇▂▆▃</span></div>
              <div class="audio-layer outro-layer">
                <span class="layer-index">C</span><div><label for="outro-file">Outro <span>optional</span></label><input id="outro-file" type="file" accept="audio/wav,audio/mpeg,.wav,.mp3" /><small id="outro-status">No outro selected</small></div><button class="icon-button" type="button" data-clear="outro" aria-label="Clear outro">×</button>
              </div>
              <div class="audio-layer bed-layer">
                <span class="layer-index">↳</span><div><label for="bed-file">Music bed <span>optional</span></label><input id="bed-file" type="file" accept="audio/wav,audio/mpeg,.wav,.mp3" /><small id="bed-status">No bed selected</small></div><button class="icon-button" type="button" data-clear="bed" aria-label="Clear music bed">×</button>
              </div>
            </div>
            <div class="two-fields">
              <div class="field"><label for="bed-volume">Bed level <output id="bed-output" for="bed-volume">−24 dB</output></label><input id="bed-volume" type="range" min="-40" max="-8" value="-24" step="1" /></div>
              <div class="field"><label for="target-loudness">Voice target</label><select id="target-loudness"><option value="-16">−16 LUFS · podcast</option><option value="-19">−19 LUFS · mono voice</option><option value="-14">−14 LUFS · course/video</option></select></div>
            </div>
            <div class="two-fields output-fields">
              <div class="field"><label for="output-format">Output format</label><select id="output-format" aria-describedby="output-help"><option value="wav">WAV · 48 kHz, 16-bit</option><option value="mp3">MP3 · 48 kHz</option></select><small id="output-help">Choose WAV for editing or MP3 for publishing.</small></div>
              <div class="field"><label for="mp3-bitrate">MP3 bitrate</label><select id="mp3-bitrate" disabled><option value="128">128 kbps</option><option value="192">192 kbps</option></select></div>
            </div>
            <details class="disclosure"><summary>How loudness and mixing work</summary><p>Wrapline estimates voice loudness from RMS and caps gain changes at ±12 dB. Intro and outro files keep their original level. The music bed drops by 7 dB under voice. Sample peaks stay below −0.18 dBFS. This browser normalization is not broadcast-certified EBU R128 or true-peak limiting. WAV output is 48 kHz, 16-bit PCM. MP3 output is 48 kHz at the selected constant bitrate.</p></details>
            <div class="field full"><label for="naming-template">Filename recipe</label><input id="naming-template" value="{recipe}-{number}-{source}" required aria-describedby="naming-help" /><small id="naming-help">Tokens: {recipe}, {number}, {source}</small></div>
            <div class="field number-field"><label for="start-number">Start number</label><input id="start-number" type="number" min="0" max="9999" value="1" inputmode="numeric" /></div>
            <div class="form-actions">
              <button class="button primary" type="submit">Save recipe</button>
              <button class="button quiet" id="export-recipe" type="button">Export recipe JSON</button>
              <button class="button quiet file-button" id="import-recipe-button" type="button">Import recipe JSON</button><input class="visually-hidden" id="import-recipe" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true" />
              <button class="text-button danger-text" id="delete-recipe" type="button" hidden>Delete recipe</button>
            </div>
            <p class="form-message" id="recipe-message" aria-live="polite"></p>
          </form>
        </section>

        <section class="queue-sheet" aria-labelledby="queue-title">
          <div class="sheet-heading"><div><span class="step-number">02</span><h3 id="queue-title">Voice queue</h3></div><span class="stamp" id="queue-count">0 tracks</span></div>
          <label class="drop-zone" id="drop-zone" for="voice-files">
            <span class="drop-icon" aria-hidden="true">↓</span><strong>Drop finished voice tracks</strong><span>or choose WAV / MP3 files</span>
            <input id="voice-files" type="file" accept="audio/wav,audio/mpeg,.wav,.mp3" multiple />
          </label>
          <div class="queue-empty" id="queue-empty"><span aria-hidden="true">≋</span><p>Added voice tracks appear here.</p></div>
          <ol class="queue-list" id="queue-list" aria-label="Voice tracks"></ol>
          <div class="render-panel">
            <div class="render-summary"><strong id="render-summary">Add WAV or MP3 files to begin.</strong><span id="tier-note">Free batches include up to 3 tracks.</span></div>
            <button class="button primary render-button" id="render-button" type="button" disabled>Render batch</button>
            <div class="progress-wrap" id="progress-wrap" hidden><progress id="render-progress" max="1" value="0"></progress><span id="progress-label">Preparing…</span></div>
            <div class="batch-download" id="batch-download" hidden></div>
            <p class="form-message" id="render-message" aria-live="polite"></p>
          </div>
        </section>
      </div>
    </section>

    <section class="receipts-section" aria-labelledby="receipts-title">
      <div><p class="eyebrow">Saved batch records</p><h2 id="receipts-title">Recent receipts</h2><p>Each receipt records recipe version, source hashes, gain, limiter activity, and output names.</p></div>
      <div id="receipt-list" class="receipt-list"><p class="muted">No batches rendered on this device yet.</p></div>
    </section>

    <section class="method" id="method" aria-labelledby="method-title">
      <p class="eyebrow">How it works</p><h2 id="method-title">Create a finished batch in three steps</h2>
      <ol><li><span>1</span><div><strong>Add intro, outro, and music</strong><p>Keep added audio, loudness, output format, and filenames together in one recipe.</p></div></li><li><span>2</span><div><strong>Review each rendered track</strong><p>Every source gets a predictable output name and an audio player after rendering.</p></div></li><li><span>3</span><div><strong>Download the batch</strong><p>Download one ZIP containing the selected audio format and a JSON receipt.</p></div></li></ol>
    </section>

    <section class="unlock" id="unlock" aria-labelledby="unlock-title">
      <div class="unlock-mark" aria-hidden="true">∞</div>
      <div><p class="eyebrow">One-time studio license</p><h2 id="unlock-title">Remove batch and recipe limits</h2><p>The free tier saves one recipe and renders three tracks per batch. A <strong>$29 one-time purchase</strong> unlocks unlimited tracks and saved recipes on your devices.</p></div>
      <div class="license-actions">
        <a class="button primary" id="buy-link"${studioCheckoutAvailable ? ` href="${checkoutUrl}"` : ' aria-disabled="true"'}>${studioCheckoutAvailable ? 'Buy studio license · $29' : 'Studio checkout is preparing'}</a>
        ${studioCheckoutAvailable ? '' : '<p class="fine-print">Already have a Studio license? Paste it below to restore it on this device.</p>'}
        <form id="license-form"><label for="license-token">Already bought? Paste license</label><div><input id="license-token" autocomplete="off" spellcheck="false" /><button class="button quiet" type="submit">Verify license</button></div></form>
        <p id="license-message" class="form-message" aria-live="polite"></p>
      </div>
    </section>
  </main>
  <footer><div><a class="brand" href="/" aria-label="Wrapline home">Wrapline</a><p>Add intros, outros, and music to many voice tracks.</p></div><div><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://sociobot.in">Built by Param Factory (external site)</a></div><p><span data-build-id>Build 1.0.0-r13</span></p></footer>
  <div class="update-toast" id="update-toast" role="status" hidden><span>A fresh version is ready.</span><button class="button quiet" id="update-button" type="button">Install update</button></div>
`;

const $ = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};
const escapeHtml = (text: string) => text.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const validAudio = (file: File) => /\.(wav|mp3)$/i.test(file.name) || ['audio/wav', 'audio/x-wav', 'audio/mpeg'].includes(file.type);
const assetFrom = (file: File): AudioAsset => ({ name: file.name, type: file.type, lastModified: file.lastModified, blob: file });

let recipes: Recipe[] = [];
let receipts: Receipt[] = [];
let jobs: Job[] = [];
let current: Recipe = freshRecipe();
let unlocked = false;
let rendering = false;
let batchUrl: string | undefined;
let deferredInstall: Event | undefined;

function freshRecipe(): Recipe {
  const timestamp = now();
  return { id: uid(), version: 0, name: 'My show', targetLufs: -16, bedDb: -24, naming: '{recipe}-{number}-{source}', startNumber: 1, outputFormat: 'wav', mp3Bitrate: 128, createdAt: timestamp, updatedAt: timestamp };
}

function message(selector: string, text: string, error = false): void {
  const element = $<HTMLElement>(selector);
  element.textContent = text;
  element.classList.toggle('error', error);
}

function syncConnection(): void {
  const online = navigator.onLine;
  $('#offline-banner').toggleAttribute('hidden', online);
  $('#connection').innerHTML = `<span aria-hidden="true">●</span> <span>${online ? 'On device' : 'Offline ready'}</span>`;
}

function fillRecipeForm(): void {
  $<HTMLInputElement>('#recipe-name').value = current.name;
  $<HTMLSelectElement>('#target-loudness').value = String(current.targetLufs);
  $<HTMLInputElement>('#bed-volume').value = String(current.bedDb);
  $('#bed-output').textContent = `${String(current.bedDb).replace('-', '−')} dB`;
  $<HTMLInputElement>('#naming-template').value = current.naming;
  $<HTMLInputElement>('#start-number').value = String(current.startNumber);
  $<HTMLSelectElement>('#output-format').value = current.outputFormat ?? 'wav';
  $<HTMLSelectElement>('#mp3-bitrate').value = String(current.mp3Bitrate ?? 128);
  $<HTMLSelectElement>('#mp3-bitrate').disabled = (current.outputFormat ?? 'wav') !== 'mp3';
  (['intro', 'outro', 'bed'] as const).forEach((key) => {
    const status = $(`#${key}-status`);
    const asset = current[key];
    status.textContent = asset ? asset.name : `No ${key === 'bed' ? 'bed' : key} selected`;
  });
  $('#version-stamp').textContent = current.version ? `v${current.version}` : 'Unsaved';
  $<HTMLButtonElement>('#delete-recipe').hidden = !recipes.some((recipe) => recipe.id === current.id);
}

function renderRecipeOptions(): void {
  const select = $<HTMLSelectElement>('#saved-recipes');
  select.innerHTML = `<option value="">New recipe</option>${recipes
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((recipe) => `<option value="${recipe.id}">${escapeHtml(recipe.name)} · v${recipe.version}</option>`).join('')}`;
  select.value = recipes.some((recipe) => recipe.id === current.id) ? current.id : '';
}

function readRecipe(): Recipe {
  const name = $<HTMLInputElement>('#recipe-name').value.trim();
  const naming = $<HTMLInputElement>('#naming-template').value.trim();
  const startNumberText = $<HTMLInputElement>('#start-number').value.trim();
  if (!name) throw new Error('Give this recipe a name.');
  if (!naming || !naming.includes('{source}')) throw new Error('The filename recipe must include {source}.');
  if (!/^\d+$/.test(startNumberText)) throw new Error('Start number must be a whole number from 0 through 9999.');
  const startNumber = Number(startNumberText);
  if (!Number.isSafeInteger(startNumber) || startNumber < 0 || startNumber > 9999) throw new Error('Start number must be a whole number from 0 through 9999.');
  return {
    ...current,
    name,
    naming,
    targetLufs: Number($<HTMLSelectElement>('#target-loudness').value),
    bedDb: Number($<HTMLInputElement>('#bed-volume').value),
    startNumber,
    outputFormat: $<HTMLSelectElement>('#output-format').value as 'wav' | 'mp3',
    mp3Bitrate: Number($<HTMLSelectElement>('#mp3-bitrate').value) as 128 | 192,
    updatedAt: now(),
  };
}

function preserveDraftFields(): void {
  current = {
    ...current,
    name: $<HTMLInputElement>('#recipe-name').value,
    naming: $<HTMLInputElement>('#naming-template').value,
    targetLufs: Number($<HTMLSelectElement>('#target-loudness').value),
    bedDb: Number($<HTMLInputElement>('#bed-volume').value),
    startNumber: Number($<HTMLInputElement>('#start-number').value),
    outputFormat: $<HTMLSelectElement>('#output-format').value as 'wav' | 'mp3',
    mp3Bitrate: Number($<HTMLSelectElement>('#mp3-bitrate').value) as 128 | 192,
  };
}

function renderQueue(): void {
  $('#queue-count').textContent = `${jobs.length} ${jobs.length === 1 ? 'track' : 'tracks'}`;
  $<HTMLElement>('#queue-empty').hidden = jobs.length > 0;
  const list = $('#queue-list');
  list.innerHTML = jobs.map((job, index) => {
    const state = job.error ? `<span class="job-state error">Error · ${escapeHtml(job.error)}</span>` : job.output
      ? `<span class="job-state success">Rendered · ${job.output.durationSeconds.toFixed(1)} s</span>`
      : '<span class="job-state">Waiting</span>';
    const output = job.output && job.url ? `<div class="job-output"><audio controls preload="none" src="${job.url}" aria-label="Preview ${escapeHtml(job.output.name)}"></audio><a class="button quiet" download="${escapeHtml(job.output.name)}" href="${job.url}">Download ${job.output.format.toUpperCase()}</a></div>` : '';
    const format = $<HTMLSelectElement>('#output-format').value as 'wav' | 'mp3';
    return `<li class="job-ticket ${job.output ? 'complete' : ''}"><div class="ticket-number">${String(index + 1).padStart(2, '0')}</div><div class="job-copy"><strong>${escapeHtml(job.file.name)}</strong><span>${(job.file.size / 1024 / 1024).toFixed(1)} MB → ${escapeHtml(outputName($<HTMLInputElement>('#naming-template').value, $<HTMLInputElement>('#recipe-name').value, job.file.name, Number($<HTMLInputElement>('#start-number').value) + index, format))}</span>${state}${output}</div><button class="icon-button" type="button" data-remove-job="${job.id}" aria-label="Remove ${escapeHtml(job.file.name)}">×</button></li>`;
  }).join('');
  $<HTMLButtonElement>('#render-button').disabled = !jobs.length || rendering;
  $('#render-summary').textContent = jobs.length ? `${jobs.length} output ${jobs.length === 1 ? 'file' : 'files'} queued.` : 'Add WAV or MP3 files to begin.';
  $('#tier-note').textContent = unlocked ? 'Studio license · unlimited batch' : 'Free batches include up to 3 tracks.';
}

function addFiles(fileList: FileList | File[]): void {
  const incoming = Array.from(fileList);
  const accepted = incoming.filter(validAudio);
  if (!accepted.length) {
    message('#render-message', 'No supported audio found. Choose WAV or MP3 files.', true);
    return;
  }
  for (const file of accepted) jobs.push({ id: uid(), file });
  if (accepted.length !== incoming.length) message('#render-message', 'Some files were skipped because they were not WAV or MP3.', true);
  else message('#render-message', `${accepted.length} ${accepted.length === 1 ? 'track' : 'tracks'} added.`);
  clearBatchDownload();
  renderQueue();
}

function clearBatchDownload(): void {
  if (batchUrl) URL.revokeObjectURL(batchUrl);
  batchUrl = undefined;
  const container = $<HTMLElement>('#batch-download');
  container.hidden = true;
  container.innerHTML = '';
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderReceipts(): void {
  const container = $('#receipt-list');
  if (!receipts.length) {
    container.innerHTML = '<p class="muted">No batches rendered on this device yet.</p>';
    return;
  }
  container.innerHTML = receipts.sort((a, b) => b.renderedAt.localeCompare(a.renderedAt)).slice(0, 6).map((receipt) => `<article class="receipt"><div><strong>${escapeHtml(receipt.recipeName)} · v${receipt.recipeVersion}</strong><span>${new Date(receipt.renderedAt).toLocaleString()} · ${receipt.items.length} files</span></div><button class="text-button" type="button" data-receipt="${receipt.id}">Download receipt JSON</button></article>`).join('');
}

function updateLicenseUi(note?: string): void {
  const state = licenseState();
  unlocked = state.unlocked;
  $('#unlock').classList.toggle('is-unlocked', unlocked);
  const link = $<HTMLAnchorElement>('#buy-link');
  link.textContent = unlocked ? 'Studio license active' : studioCheckoutAvailable ? 'Buy studio license · $29' : 'Studio checkout is preparing';
  link.toggleAttribute('aria-disabled', unlocked || !studioCheckoutAvailable);
  if (!unlocked && studioCheckoutAvailable) link.href = checkoutUrl;
  else link.removeAttribute('href');
  message('#license-message', note ?? (unlocked ? 'Unlimited batches and recipes are unlocked on this device.' : state.reason ? 'License no longer active. You can restore another license below.' : ''));
  renderQueue();
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function exportedRecipe(recipe: Recipe): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = { ...recipe, format: 'wrapline-recipe-v1' };
  for (const key of ['intro', 'outro', 'bed'] as const) {
    const asset = recipe[key];
    if (asset) result[key] = { ...asset, blob: await blobToDataUrl(asset.blob) };
  }
  return result;
}

function dataUrlBlob(value: string): Blob {
  const [header = '', body = ''] = value.split(',');
  const type = header.match(/data:([^;]+)/)?.[1] ?? 'application/octet-stream';
  const bytes = Uint8Array.from(atob(body), (character) => character.charCodeAt(0));
  return new Blob([bytes], { type });
}

async function importRecipe(file: File): Promise<void> {
  const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
  if (parsed.format !== 'wrapline-recipe-v1' || typeof parsed.name !== 'string') throw new Error('That is not a Wrapline recipe export.');
  if (!unlocked && recipes.length >= 1 && !recipes.some((recipe) => recipe.id === parsed.id)) throw new Error('The free tier holds one saved recipe. Load it to update it, or buy Studio for more recipes.');
  for (const key of ['intro', 'outro', 'bed'] as const) {
    const asset = parsed[key] as (AudioAsset & { blob: string }) | undefined;
    if (asset?.blob) parsed[key] = { ...asset, blob: dataUrlBlob(asset.blob) };
  }
  current = { ...(parsed as unknown as Recipe), id: typeof parsed.id === 'string' ? parsed.id : uid(), updatedAt: now() };
  await saveRecipe(current);
  recipes = await getRecipes();
  renderRecipeOptions();
  fillRecipeForm();
  message('#recipe-message', `Imported “${current.name}” with its audio assets.`);
}

async function renderBatch(): Promise<void> {
  if (rendering || !jobs.length) return;
  if (!unlocked && jobs.length > 3) {
    message('#render-message', 'This free batch has more than 3 tracks. Remove extras or unlock unlimited batches.', true);
    $('#unlock').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return;
  }
  try {
    current = readRecipe();
  } catch (error) {
    message('#render-message', error instanceof Error ? error.message : 'The recipe could not be read. Review its fields and try again.', true);
    return;
  }
  rendering = true;
  clearBatchDownload();
  jobs.forEach((job) => { if (job.url) URL.revokeObjectURL(job.url); job.output = undefined; job.url = undefined; job.error = undefined; });
  const button = $<HTMLButtonElement>('#render-button');
  button.disabled = true;
  button.textContent = 'Rendering…';
  $<HTMLElement>('#progress-wrap').hidden = false;
  const progress = $<HTMLProgressElement>('#render-progress');
  progress.max = jobs.length;
  progress.value = 0;
  message('#render-message', 'Audio stays on this device while the batch renders.');
  const successful: Array<{ job: Job; output: RenderedFile }> = [];
  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    if (!job) continue;
    $('#progress-label').textContent = `Rendering ${index + 1} of ${jobs.length}: ${job.file.name}`;
    try {
      const output = await renderWrappedFile(job.file, current, current.startNumber + index);
      job.output = output;
      job.url = URL.createObjectURL(output.blob);
      successful.push({ job, output });
    } catch (error) {
      job.error = error instanceof Error ? error.message : 'This track could not be rendered. Choose a standard WAV or MP3 file and try again.';
    }
    progress.value = index + 1;
    renderQueue();
  }
  if (successful.length) {
    const receipt: Receipt = {
      id: uid(), renderedAt: now(), recipeId: current.id, recipeName: current.name, recipeVersion: current.version,
      targetLufs: current.targetLufs,
      codec: current.outputFormat === 'mp3' ? 'MP3 CBR' : 'WAV PCM 16-bit',
      ...(current.outputFormat === 'mp3' ? { bitrateKbps: current.mp3Bitrate } : {}),
      measurement: 'RMS-based LUFS estimate, ±12 dB gain cap; intro/outro unchanged; bed −7 dB under voice; sample-peak ceiling −0.18 dBFS',
      items: successful.map(({ job, output }) => ({ source: job.file.name, output: output.name, sourceSha256: output.sourceHash, durationSeconds: output.durationSeconds, appliedGainDb: output.gainDb, peakLimited: output.peakLimited })),
    };
    await saveReceipt(receipt);
    receipts.unshift(receipt);
    renderReceipts();
    const receiptBlob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const zip = await createZip([...successful.map(({ output }) => ({ name: output.name, blob: output.blob })), { name: 'wrapline-receipt.json', blob: receiptBlob }]);
    batchUrl = URL.createObjectURL(zip);
    const container = $<HTMLElement>('#batch-download');
    const formatLabel = current.outputFormat.toUpperCase();
    container.innerHTML = `<a class="button primary" href="${batchUrl}" download="${sanitizeFilename(current.name)}-rendered.zip">Download batch ZIP</a><span>${successful.length} ${formatLabel} ${successful.length === 1 ? 'file' : 'files'} + receipt</span>`;
    container.hidden = false;
    message('#render-message', `${successful.length} of ${jobs.length} tracks rendered. Review them above or download the batch.`);
  } else message('#render-message', 'Nothing rendered. Check the error on each track and try another WAV or MP3.', true);
  rendering = false;
  button.textContent = 'Render batch';
  $('#progress-label').textContent = 'Batch complete';
  renderQueue();
}

function bindEvents(): void {
  window.addEventListener('online', syncConnection);
  window.addEventListener('offline', syncConnection);
  if (demoMode) {
    $('#reset-demo').addEventListener('click', async () => {
      try {
        await resetDemoStorage();
        localStorage.removeItem('demo:sb_license:audio-wrapper-batch');
        localStorage.removeItem('demo:sb_license_verdict:audio-wrapper-batch');
        location.assign('/demo');
      } catch (error) {
        message('#render-message', error instanceof Error ? error.message : 'Could not reset the demo. Try closing another demo tab.', true);
      }
    });
    $('#start-real').addEventListener('click', async () => {
      try {
        await resetDemoStorage();
        localStorage.removeItem('demo:sb_license:audio-wrapper-batch');
        localStorage.removeItem('demo:sb_license_verdict:audio-wrapper-batch');
        location.assign('/');
      } catch (error) {
        message('#render-message', error instanceof Error ? error.message : 'Could not leave the demo. Try closing another demo tab.', true);
      }
    });
  }
  window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstall = event; $<HTMLButtonElement>('#install-button').hidden = false; });
  $('#install-button').addEventListener('click', async () => {
    if (!deferredInstall) return;
    (deferredInstall as Event & { prompt: () => Promise<void> }).prompt();
    deferredInstall = undefined;
    $<HTMLButtonElement>('#install-button').hidden = true;
  });
  $('#bed-volume').addEventListener('input', () => { const value = $<HTMLInputElement>('#bed-volume').value; $('#bed-output').textContent = `${value.replace('-', '−')} dB`; });
  $('#naming-template').addEventListener('input', renderQueue);
  $('#recipe-name').addEventListener('input', renderQueue);
  $('#start-number').addEventListener('input', renderQueue);
  $('#output-format').addEventListener('change', () => {
    const mp3 = $<HTMLSelectElement>('#output-format').value === 'mp3';
    $<HTMLSelectElement>('#mp3-bitrate').disabled = !mp3;
    clearBatchDownload();
    renderQueue();
  });
  for (const key of ['intro', 'outro', 'bed'] as const) {
    $<HTMLInputElement>(`#${key}-file`).addEventListener('change', (event) => {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (!file || !validAudio(file)) return message('#recipe-message', 'Choose a WAV or MP3 intro, outro, or music-bed file.', true);
      preserveDraftFields();
      current[key] = assetFrom(file);
      fillRecipeForm();
      message('#recipe-message', `${file.name} added to the recipe. Save to keep it on this device.`);
    });
  }
  document.querySelectorAll<HTMLButtonElement>('[data-clear]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.clear as 'intro' | 'outro' | 'bed';
    preserveDraftFields();
    delete current[key];
    $<HTMLInputElement>(`#${key}-file`).value = '';
    fillRecipeForm();
    message('#recipe-message', `${key === 'bed' ? 'Music bed' : key} cleared. Save to keep this change.`);
  }));
  $('#saved-recipes').addEventListener('change', (event) => {
    const id = (event.currentTarget as HTMLSelectElement).value;
    current = recipes.find((recipe) => recipe.id === id) ?? freshRecipe();
    fillRecipeForm();
    message('#recipe-message', id ? `Loaded “${current.name}”.` : 'A new recipe is ready.');
    renderQueue();
  });
  $('#new-recipe').addEventListener('click', () => { current = freshRecipe(); renderRecipeOptions(); fillRecipeForm(); message('#recipe-message', 'A new recipe is ready.'); renderQueue(); });
  $('#recipe-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const existing = recipes.find((recipe) => recipe.id === current.id);
      if (!unlocked && !existing && recipes.length >= 1) throw new Error('The free tier holds one recipe. Load it to update it, or buy Studio for more recipes.');
      current = { ...readRecipe(), version: current.version + 1 };
      await saveRecipe(current);
      void navigator.storage?.persist?.();
      recipes = await getRecipes();
      renderRecipeOptions(); fillRecipeForm();
      message('#recipe-message', `Saved “${current.name}” as version ${current.version} on this device.`);
    } catch (error) { message('#recipe-message', error instanceof Error ? error.message : 'The recipe could not be saved because local storage failed. Check browser storage and try again.', true); }
  });
  $('#delete-recipe').addEventListener('click', async () => {
    if (!confirm(`Delete “${current.name}” and its saved intro, outro, and music-bed files from this device?`)) return;
    await deleteRecipe(current.id);
    recipes = await getRecipes(); current = freshRecipe(); renderRecipeOptions(); fillRecipeForm(); message('#recipe-message', 'Recipe deleted.');
  });
  $('#export-recipe').addEventListener('click', async () => {
    try { current = readRecipe(); download(new Blob([JSON.stringify(await exportedRecipe(current), null, 2)], { type: 'application/json' }), `${sanitizeFilename(current.name)}.wrapline.json`); message('#recipe-message', 'Portable recipe exported with its audio assets.'); }
    catch (error) { message('#recipe-message', error instanceof Error ? error.message : 'The recipe could not be exported. Review its fields and try again.', true); }
  });
  $('#import-recipe').addEventListener('change', async (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (!file) return;
    try { await importRecipe(file); } catch (error) { message('#recipe-message', error instanceof Error ? error.message : 'The recipe file could not be imported. Choose a Wrapline recipe JSON file.', true); }
    (event.currentTarget as HTMLInputElement).value = '';
  });
  $('#import-recipe-button').addEventListener('click', () => $<HTMLInputElement>('#import-recipe').click());
  $('#voice-files').addEventListener('change', (event) => { const input = event.currentTarget as HTMLInputElement; if (input.files) addFiles(input.files); input.value = ''; });
  const dropZone = $('#drop-zone');
  dropZone.addEventListener('dragover', (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'));
  dropZone.addEventListener('drop', (event) => { event.preventDefault(); dropZone.classList.remove('is-dragging'); if ((event as DragEvent).dataTransfer?.files) addFiles((event as DragEvent).dataTransfer!.files); });
  $('#queue-list').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-remove-job]');
    if (!button) return;
    const job = jobs.find((item) => item.id === button.dataset.removeJob); if (job?.url) URL.revokeObjectURL(job.url);
    jobs = jobs.filter((item) => item.id !== button.dataset.removeJob); clearBatchDownload(); renderQueue(); message('#render-message', 'Track removed from the queue.');
  });
  $('#render-button').addEventListener('click', renderBatch);
  $('#receipt-list').addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-receipt]');
    const receipt = receipts.find((item) => item.id === button?.dataset.receipt);
    if (receipt) download(new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' }), `${sanitizeFilename(receipt.recipeName)}-${receipt.id.slice(0, 8)}-receipt.json`);
  });
  $('#license-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = $<HTMLInputElement>('#license-token').value.trim();
    if (!token) return message('#license-message', 'Paste the license token from your purchase email.', true);
    storeLicense(token); message('#license-message', 'Checking license…');
    const result = await verifyLicense(); updateLicenseUi(result.unlocked ? 'License verified. Unlimited batches and recipes are active.' : 'That license could not be verified. Check the token and try again.');
  });
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  // A browser policy can expose navigator.serviceWorker while declining the
  // registration request. In that case there is no update feature to wire up,
  // but the local audio bench must remain usable.
  let registration: ServiceWorkerRegistration | undefined;
  try {
    registration = await navigator.serviceWorker.register('/sw.js');
  } catch {
    return;
  }
  if (!registration) return;
  let updateRequested = false;
  const showUpdate = () => { $<HTMLElement>('#update-toast').hidden = false; };
  if (registration.waiting) showUpdate();
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(); });
  });
  $('#update-button').addEventListener('click', () => {
    updateRequested = true;
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (updateRequested) location.reload(); });
}

async function init(): Promise<void> {
  if (!demoMode) captureReturnedLicense();
  syncConnection();
  bindEvents();
  try {
    [recipes, receipts] = await Promise.all([getRecipes(), getReceipts()]);
    if (demoMode) {
      const sample = createDemoSeed(current.id, current.createdAt);
      current = sample.recipe;
      jobs = sample.tracks.map((file) => ({ id: uid(), file }));
      // The visible demo always begins with the same useful queue. Existing
      // demo-only storage is ignored until it is reset or the visitor starts
      // for real, so it cannot leak into the real bench.
      recipes = [];
      receipts = [];
    } else if (recipes[0]) current = recipes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? current;
  } catch { message('#recipe-message', 'Local storage could not open. Private browsing settings may prevent saved recipes.', true); }
  renderRecipeOptions(); fillRecipeForm(); renderQueue(); renderReceipts(); updateLicenseUi();
  if (demoMode) message('#render-message', 'Sample batch ready: three short voice tracks with an intro, outro, and music bed.');
  else void verifyLicense().then((result) => updateLicenseUi(result.unlocked ? undefined : result.reason ? 'License no longer active. Restore a current license to unlock Studio.' : undefined));
  void registerServiceWorker();
}

void init();
