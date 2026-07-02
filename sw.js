// ✅ Changer ce numéro à chaque mise à jour du site
const CACHE = 'pride-v' + Date.now();

const FILES = [
  '/pride/',
  '/pride/index.html',
  '/pride/manifest.json',
  '/pride/icon-192.png',
  '/pride/icon-512.png'
];

// Installation : mise en cache des fichiers
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  // Force l'activation immédiate sans attendre
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  // Prend le contrôle immédiatement
  self.clients.claim();
});

// Fetch : réseau d'abord, cache en fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Met à jour le cache avec la nouvelle version
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
