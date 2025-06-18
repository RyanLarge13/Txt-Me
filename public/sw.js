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
  const apiUrl = "https://txt-me-server-production.up.railway.app/";

  // Don't cache API calls
  if (url.pathname.startsWith(apiUrl)) return;

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

const M_AddMessageToIndexedDB = async (data) => {
  try {
    const db = await openExistingDB("app", "messages");
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");

    const key = "messages"; // or whatever fixed key you use
    const getRequest = store.get(key);

    getRequest.onsuccess = () => {
      const existingMessages = getRequest.result || [];
      existingMessages.push(data.message);

      store.put(existingMessages, key); // update the array at that key
    };

    getRequest.onerror = () => {
      console.warn("Failed to get messages array");
    };

    return new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
  } catch (err) {
    console.log(
      "Will not add message to IndexedDB. DB does not exist or could not be opened"
    );
  }
};

// === PUSH NOTIFICATIONS ===
self.addEventListener("push", async (event) => {
  console.log("SW Push received");
  const data = event.data?.json() || {};

  const title = data.title || "New Message";
  const options = {
    body: data.body || "New message waiting",
    icon: data.icon || "/assets/icons/Txt-Me-Logo_192x192.png",
    badge: data.badge || "/assets/badges/txt-me-mail-badge_1024x1024.png",
    data: data.data || {},
  };

  try {
    event.waitUntil(M_AddMessageToIndexedDB(data));
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.log(
      "Error adding message to indexedDB from service worker or showing notification"
    );
  }
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

// IndexedDB Methods-------------------------------------------------------------------
/*
  NOTE:
    If the database does not exist then forget storing messages
*/
function openExistingDB(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onupgradeneeded = () => {
      // If this fires, the DB doesn't exist yet — abort
      request.transaction.abort();
      reject(new Error("Database does not exist yet"));
    };

    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.close();
        reject(new Error("Object store not found"));
        return;
      }
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// IndexedDB Methods-------------------------------------------------------------------
