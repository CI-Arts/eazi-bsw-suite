// UPDATE ONLY THE TOP SECTION OF SW.JS IN YOUR BSW REPOSITORY
const CACHE_NAME = "eazi-bsw-v3"; // Incremented to v3 to completely destroy old phone memory cache!
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "logo.png",
  "manifest.json"
];
// ... leave the rest of your install/fetch listeners exactly as they were

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
