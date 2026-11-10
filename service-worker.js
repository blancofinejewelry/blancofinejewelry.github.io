'use strict';

const CACHE_NAME = 'blanco-portfolio-v1';
const SCOPE = new URL(self.registration.scope);
const SHELL = ['index.html', 'styles.css', 'app.js', 'site.json', 'offline.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const SHELL_URLS = new Set(SHELL.map((file) => new URL(file, SCOPE).href));
const MAX_CACHED_IMAGES = 80;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([...SHELL_URLS])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('blanco-portfolio-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function trimImages(cache) {
  const keys = await cache.keys();
  const imagePrefix = new URL('images/', SCOPE).href;
  const images = keys.filter((request) => request.url.startsWith(imagePrefix));
  await Promise.all(images.slice(0, Math.max(0, images.length - MAX_CACHED_IMAGES)).map((request) => cache.delete(request)));
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== SCOPE.origin) return;
  const isImage = url.pathname.startsWith(new URL('images/', SCOPE).pathname) && /\.(avif|webp|jpe?g|png)$/i.test(url.pathname);
  const isShell = SHELL_URLS.has(url.href);
  const isPortfolioNavigation = request.mode === 'navigate' && (url.pathname === SCOPE.pathname || url.pathname === new URL('index.html', SCOPE).pathname);
  if (!isImage && !isShell && !isPortfolioNavigation) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        if (isImage) await trimImages(cache);
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (isPortfolioNavigation) {
        return (await cache.match(new URL('index.html', SCOPE).href)) || (await cache.match(new URL('offline.html', SCOPE).href));
      }
      return Response.error();
    }
  })());
});
