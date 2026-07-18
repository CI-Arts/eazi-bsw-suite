const CACHE_NAME = "eazi-bsw-v1";
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "logo.png",
  "manifest.json"
];

// Cache all assets for this specific module locally
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercept network requests to serve app files locally instantly
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
