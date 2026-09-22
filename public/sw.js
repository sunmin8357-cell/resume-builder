const CACHE_NAME = 'resume-builder-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/static/css/style.css',
  '/static/js/app.js',
  '/static/manifest.json',
  '/static/icons/icon-192.png',
  '/static/icons/icon-512.png'
];

// 서비스 워커 설치: 정적 자원 사전 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 서비스 워커 활성화: 구버전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 가로채기 (API 호출은 제외하고 정적 자원 캐시 우선 제공)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // POST 요청이나 AI 생성 API(/generate)는 캐싱하지 않음
  if (event.request.method !== 'GET' || requestUrl.pathname.startsWith('/generate')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 캐시 데이터가 있으면 즉시 반환하고 백그라운드에서 최신 버전 갱신
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
