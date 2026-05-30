// ════════════════════════════════════════════════════════════════════════════
// SELF-DESTRUCTING SERVICE WORKER
// ════════════════════════════════════════════════════════════════════════════
// The previous SW used cache-first strategy, which caused stale JS/HTML to
// be served indefinitely. To fix existing installs that still have it cached,
// this SW takes over, deletes all caches, unregisters itself, and reloads.
// After this runs once per visitor, the SW is gone for good.
// ════════════════════════════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // 1. Delete every cache this origin ever stored
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));

        // 2. Unregister self
        await self.registration.unregister();

        // 3. Force all open tabs to reload from network (fresh content)
        const clientList = await self.clients.matchAll({ type: 'window' });
        clientList.forEach(client => client.navigate(client.url));
    })());
});

// While alive (briefly), don't intercept any fetch — pass through to network.
self.addEventListener('fetch', (event) => {
    // intentionally empty: no respondWith() means browser handles request normally
});
