const CACHE_NAME = 'khtn7-app-v26'
const urlsToCache = [
  './',
  './index.html',
  './theme.css',
  './main.css',
  './responsive.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Montserrat:wght@500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // If offline and request fails
      })
    }),
  )
})
