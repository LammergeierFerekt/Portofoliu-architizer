const CACHE_NAME = 'my-cache-v3';
const REPO_NAME = '/Portofoliu-architizer';

const FILES_TO_CACHE = [
  `${REPO_NAME}/`,
  `${REPO_NAME}/index.html`,
  `${REPO_NAME}/public/images/CV_Furdu_Mihael-Ionut.pdf`,
  `${REPO_NAME}/public/alte_lucrari.pdf`,
  `${REPO_NAME}/public/cv.pdf`,
  `${REPO_NAME}/public/proiect_tipic.pdf`,
  `${REPO_NAME}/public/tehnic_tipic.pdf`,
  `${REPO_NAME}/src/CASA_BACAU.gltf`,
];

// Install event – cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing and caching static files...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});




// Activate event – delete old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating and clearing old caches...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch event – serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[ServiceWorker] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch((error) => {
        console.error('[ServiceWorker] Fetch failed:', event.request.url, error);
        throw error;
      });
    })
  );
});
