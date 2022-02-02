// const cacheName = "Medical";

// const staticAssets = [
//   "./",
//   "./about",
//   "/css/",
//   "/gov",
//   "/users/login",
//   "/users/register"
// ];

// self.addEventListener("install", async e => {
//   const cache = await caches.open(cacheName);
//   await cache.addAll(staticAssets);
//   return self.skipWaiting();
// });

// self.addEventListener("activate", e => {
//   self.clients.claim();
// });

// self.addEventListener("fetch", async e => {
//   const req = e.request;
//   const url = new URL(req.url);

//   if (url.origin === location.origin) {
//     e.respondWith(cacheFirst(req));
//   } else {
//     e.respondWith(networkAndCache(req));
//   }
// });

// async function cacheFirst(req) {
//   const cache = await caches.open(cacheName);
//   const cached = await cache.match(req);
//   return cached || fetch(req);
// }

// async function networkAndCache(req) {
//   const cache = await caches.open(cacheName);
//   try {
//     const fresh = await fetch(req);
//     await cache.put(req, fresh.clone());
//     return fresh;
//   } catch (e) {
//     const cached = await cache.match(req);
//     return cached;
//   }
// }
const cacheName = "v1";

const cacheAssets = [
  "./",
  "./about",
  "/css/",
  "/gov",
  "/patient/login",
  "/users/login",
  "/users/register"
];

// Call Install Event
self.addEventListener("install", e => {
  console.log("Service Worker: Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener("activate", e => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", e => {
  console.log("Service Worker: Fetching");
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
