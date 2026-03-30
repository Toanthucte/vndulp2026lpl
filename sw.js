const CACHE_NAME = 'vndulp-app-v3' // Đổi tên cache để làm mới
const urlsToCache = [
  './',
  './index.html',
  './theme.css',
  './main.css',
  './responsive.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
]

self.addEventListener('install', (event) => {
  // Buộc service worker mới nhậm chức ngay lập tức
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', (event) => {
  // Chiến lược: Network-First, fall back to Cache (Luôn lấy mạng trước, lỗi mạng mới dùng cache)
  // Như vậy app sẽ luôn lấy giao diện/bệnh mới nhất nếu có internet
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Nếu lấy từ mạng thành công, lưu bản mới vào cache và trả về cho user
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        // Nếu rớt mạng (offline), mới lôi file cũ từ cache ra xài
        return caches.match(event.request)
      }),
  )
})

self.addEventListener('activate', (event) => {
  // Xóa sạch các bộ nhớ đệm của phiên bản cũ
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => {
        // Báo cho các trang đang mở biết để reload lại code mới
        return clients.claim()
      }),
  )
})
