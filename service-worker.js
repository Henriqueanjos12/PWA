const CACHE_NAME = "pwa-cache-v1";
const FILES_TO_CACHE = [
    "index.html",
    "style.css",
    "script.js",
    "manifest.json",
    "icon-192.png",
    "icon-512.png"
];

// Instala o Service Worker e faz cache dos arquivos essenciais
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Intercepta requisições e retorna do cache quando possível
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Atualiza o cache quando há mudanças
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
