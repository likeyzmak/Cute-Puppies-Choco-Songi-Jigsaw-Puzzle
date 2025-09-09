const CACHE_NAME = 'puppy-puzzle-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './assets/audio/puzzle.mp3',
  './assets/audio/fanfare.mp3',
  './assets/images/PUZZLE1.png',
  './assets/images/PUZZLE2.png',
  './assets/images/PUZZLE3.png',
  './assets/images/PUZZLE4.png',
  './assets/images/PUZZLE5.png',
  './assets/images/PUZZLE6.png',
  './assets/images/PUZZLE7.png',
  './assets/images/PUZZLE8.png',
  './assets/images/PUZZLE10.png',
  './assets/images/PUZZLE11.png',
  './assets/images/PUZZLE12.png',
  './assets/images/PUZZLE13.png',
  './assets/images/PUZZLE14.png',
  './assets/images/PUZZLE15.png',
  './assets/images/PUZZLE16.png',
  './assets/images/PUZZLE79.png'
];

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