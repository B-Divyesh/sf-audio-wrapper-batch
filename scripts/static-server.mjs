import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1] ?? fallback;
};

const root = resolve(argument('--root', 'dist'));
const port = Number(argument('--port', '4173'));
const config = JSON.parse(await readFile(resolve(root, 'staticwebapp.config.json'), 'utf8'));
const types = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8',
};

function localPath(pathname) {
  const candidate = resolve(root, `.${pathname}`);
  return candidate === root || candidate.startsWith(`${root}${sep}`) ? candidate : undefined;
}

async function fileAt(pathname) {
  const path = localPath(pathname);
  if (!path) return undefined;
  try {
    const info = await stat(path);
    if (info.isFile()) return path;
    if (info.isDirectory()) {
      const index = resolve(path, 'index.html');
      return (await stat(index)).isFile() ? index : undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function routeRewrite(pathname) {
  return config.routes?.find((route) => route.route === pathname && route.rewrite)?.rewrite;
}

async function sendFile(response, file, statusCode) {
  const body = await readFile(file);
  response.writeHead(statusCode, {
    ...config.globalHeaders,
    'Content-Length': body.byteLength,
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) {
    response.writeHead(405).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://wrapline.local').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const rewritten = routeRewrite(pathname);
  const file = await fileAt(rewritten ?? pathname);
  if (file) {
    if (request.method === 'HEAD') {
      response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end();
      return;
    }
    await sendFile(response, file, 200);
    return;
  }

  const notFound = await fileAt(config.responseOverrides?.['404']?.rewrite ?? '/404.html');
  if (notFound) {
    if (request.method === 'HEAD') {
      response.writeHead(404, { 'Content-Type': types[extname(notFound)] ?? 'text/html; charset=utf-8' }).end();
      return;
    }
    await sendFile(response, notFound, 404);
    return;
  }
  response.writeHead(404).end();
});

server.listen(port, '127.0.0.1');
