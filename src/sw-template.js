const VERSION = '__WRAPLINE_VERSION__';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const SHELL = __WRAPLINE_SHELL__;

async function precacheShell() {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.all(SHELL.map(async (url) => {
    // Do not accept a stale/revalidated empty response from the HTTP cache.
    // The byte-bearing response is what makes the *first* offline reload work.
    const response = await fetch(url, { cache: 'reload' });
    if (!response.ok) throw new Error(`Could not precache ${url}: ${response.status}`);
    await cache.put(url, response);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => ![STATIC_CACHE, PAGE_CACHE].includes(key))
      .map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const staticCache = await caches.open(STATIC_CACHE);
    return (await cache.match(request)) || (await staticCache.match('/index.html')) || staticCache.match('/offline.html');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  // Browser requests may include a version query while the precache uses the
  // canonical pathname.  Prefer the exact response, then the canonical shell
  // entry so a first offline navigation cannot lose its JS or CSS to a cache
  // key mismatch.
  const cached = await cache.match(request) || await cache.match(new URL(request.url).pathname, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    if (url.hostname.endsWith('sociobot.in')) {
      event.respondWith(fetch(request).catch(() => new Response('{"valid":false,"reason":"offline"}', {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })));
    }
    return;
  }
  if (request.mode === 'navigate') event.respondWith(networkFirst(request));
  else event.respondWith(cacheFirst(request));
});
