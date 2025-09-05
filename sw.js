const CACHE_NAME = 'puppy-puzzle-cache-v3'; // Cache version bumped to v3
const baseUrls = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './assets/audio/puzzle.mp3',
  './assets/audio/fanfare.mp3'
];

// This list should ideally be in a shared config, but for a direct fix:
const imageManifest = [
    'PUZZLE1.png', 'PUZZLE2.png', 'PUZZLE3.png', 'PUZZLE4.png', 'PUZZLE5.png',
    'PUZZLE6.png', 'PUZZLE7.png', 'PUZZLE8.png', 'PUZZLE10.png', 'PUZZLE11.png',
    'PUZZLE12.png', 'PUZZLE13.png', 'PUZZLE14.png', 'PUZZLE15.png', 'PUZZLE16.png',
    'PUZZLE79.png'
];

const imageUrls = imageManifest.map(name => `./assets/images/${name.toLowerCase()}`);
const urlsToCache = baseUrls.concat(imageUrls);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});