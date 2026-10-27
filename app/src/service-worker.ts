/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = globalThis.self as unknown as ServiceWorkerGlobalScope;
const CACHE = 'burn-e-shell-v1';
const SHELL = ['/snap', '/manifest.webmanifest', '/favicon.svg'];
sw.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); sw.skipWaiting(); });
sw.addEventListener('activate', (e) => { e.waitUntil(sw.clients.claim()); });
sw.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then((r) => r ?? caches.match('/snap'))));
});
