const CACHE_NAME = 'puppy-puzzle-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './assets/audio/puzzle.mp3',
  './assets/audio/fanfare.mp3',
  './assets/images/puzzle1.png',
  './assets/images/puzzle2.png',
  './assets/images/puzzle3.png',
  './assets/images/puzzle4.png',
  './assets/images/puzzle5.png',
  './assets/images/puzzle6.png',
  './assets/images/puzzle7.png',
  './assets/images/puzzle8.png',
  './assets/images/puzzle10.png',
  './assets/images/puzzle11.png',
  './assets/images/puzzle12.png',
  './assets/images/puzzle13.png',
  './assets/images/puzzle14.png',
  './assets/images/puzzle15.png',
  './assets/images/puzzle16.png',
  './assets/images/puzzle79.png'
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