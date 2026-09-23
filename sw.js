// ════════════════════════════════════════════════════════════════════════════
// CAPY ENGLISH SERVICE WORKER v2
// ════════════════════════════════════════════════════════════════════════════
// Design notes (aprendido com o SW antigo que servia conteúdo velho):
//  - HTML NUNCA é cacheado. Navegações vão sempre à rede; se offline → offline.html.
//  - JS/CSS NUNCA são cacheados aqui (o site usa ?v= + headers do Vercel).
//  - Só IMAGENS/mídia usam cache-first (seguras: mudam de nome quando mudam).
//  - /api/ passa direto, sempre.
//  - Push notifications: handlers de push e notificationclick.
// ════════════════════════════════════════════════════════════════════════════

// v3: troca do ícone do app. As imagens são cache-first partindo do princípio
// de que "mudam de nome quando mudam" — o icon-192 é a exceção, tem nome fixo.
// Sem subir a versão aqui, quem já instalou ficaria com o ícone antigo.
const CACHE = 'capy-v3';
const PRECACHE = ['/offline.html', '/icon-192.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/api/')) return; // API: sempre rede, nunca interceptar

    // Navegações (HTML): rede sempre; offline → página offline
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).catch(() => caches.match('/offline.html'))
        );
        return;
    }

    // Imagens e mídia: cache-first (seguro — assets trocam de nome/versão)
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico|mp3|mp4)$/.test(url.pathname)) {
        event.respondWith((async () => {
            const cached = await caches.match(req);
            if (cached) return cached;
            try {
                const res = await fetch(req);
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(req, clone));
                }
                return res;
            } catch (e) {
                return cached || Response.error();
            }
        })());
        return;
    }
    // Todo o resto (JS/CSS/JSON): passa direto pra rede — zero risco de stale
});

// ── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
    const title = data.title || 'Capy English 🐾';
    const options = {
        body: data.body || 'A Yara está esperando você para praticar!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: data.tag || 'capy-reminder',
        data: { url: data.url || '/learn.html' },
        renotify: true
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const requestedUrl = (event.notification.data && event.notification.data.url) || '/learn.html';
    let url = '/learn.html';
    try {
        const parsed = new URL(requestedUrl, self.location.origin);
        if (parsed.origin === self.location.origin) url = parsed.pathname + parsed.search;
    } catch (_) {}
    event.waitUntil((async () => {
        const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clientList) {
            if ('focus' in client) { await client.focus(); client.navigate(url); return; }
        }
        await self.clients.openWindow(url);
    })());
});
