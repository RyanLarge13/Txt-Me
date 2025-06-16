const CACHE_NAME = "static-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// === INSTALL ===
self.addEventListener("install", (event) => {
  console.log("SW Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// === ACTIVATE ===
self.addEventListener("activate", (event) => {
  console.log("SW Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
      )
  );
  self.clients.claim();
});

// === FETCH ===
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't cache API calls
  if (url.pathname.startsWith("/api/")) return;

  // Cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          // If the main HTML file is updated, notify client(s)
          if (
            event.request.mode === "navigate" ||
            event.request.url.endsWith("index.html")
          ) {
            notifyClientsAboutUpdate();
          }
          return response;
        })
        .catch(() => cached); // fallback to cached on error

      return cached || networkFetch;
    })
  );
});

// === PUSH NOTIFICATIONS ===
self.addEventListener("push", (event) => {
  console.log("SW Push received");
  const data = event.data?.json() || {};

  const title = data.title || "Notification";
  const options = {
    body: data.body || "New content available!",
    icon: data.icon || "/icons/icon-192.png",
    badge: data.badge || "/icons/icon-192.png",
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// === NOTIFICATION CLICK ===
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsList) => {
      const visibleClient = clientsList.find(
        (c) => c.url === "/" && "focus" in c
      );
      return visibleClient
        ? visibleClient.focus()
        : self.clients.openWindow("/");
    })
  );
});

// === BACKGROUND SYNC ===
self.addEventListener("sync", (event) => {
  console.log("SW Background sync:", event.tag);
  if (event.tag === "sync-tag-example") {
    event.waitUntil(
      fetch("/api/sync")
        .then((res) => console.log("Sync done", res))
        .catch(console.error)
    );
  }
});

// === PERIODIC SYNC ===
self.addEventListener("periodicsync", (event) => {
  console.log("SW Periodic sync:", event.tag);
  if (event.tag === "periodic-sync-example") {
    event.waitUntil(
      fetch("/api/check-updates")
        .then((res) => console.log("Periodic check done", res))
        .catch(console.error)
    );
  }
});

// === VERSION UPDATE NOTIFICATION ===
async function notifyClientsAboutUpdate() {
  const allClients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
  }
}

/*
CLIENT SIDE SERVICE WORKER LOGIC 



// === REQUEST NOTIFICATION PERMISSION ===
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then((permission) => {
    console.log('Notification permission:', permission);
  });
}

// === LISTEN FOR SW MESSAGES ===
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data?.type === 'NEW_VERSION_AVAILABLE') {
    // Notify user in-app (custom logic/UI here)
    const shouldRefresh = confirm('A new version of this app is available. Reload now?');
    if (shouldRefresh) {
      window.location.reload();
    }
  }
});

** PERIODIC SYNC ** 
navigator.serviceWorker.ready.then(async (reg) => {
  try {
    await reg.periodicSync.register('periodic-sync-example', {
      minInterval: 24 * 60 * 60 * 1000, // once per day
    });
  } catch (e) {
    console.error('Periodic Sync not supported or permission denied:', e);
  }
});

** BACKGROUND SYNC **
navigator.serviceWorker.ready.then((reg) => {
  reg.sync.register('sync-tag-example');
});

** IN MANIFEST **
"permissions": ["periodic-background-sync"]

*/
