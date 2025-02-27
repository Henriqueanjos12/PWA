const CACHE_NAME = 'pwa-notepad-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/db.js',
    '/manifest.json',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker instalando...');
    
    // Pré-cache dos arquivos essenciais
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker ativado');
    
    // Limpar caches antigos
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estratégia de cache: Cache First, fallback para rede
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache se encontrado
                if (response) {
                    return response;
                }
                
                // Caso contrário, busca na rede
                return fetch(event.request)
                    .then(networkResponse => {
                        // Verifica se a resposta é válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone a resposta para o cache
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('Falha ao buscar recurso:', error);
                        // Poderia retornar uma página offline personalizada aqui
                    });
            })
    );
});

// Evento de sincronização em segundo plano
self.addEventListener('sync', event => {
    if (event.tag === 'sync-notes') {
        console.log('Sincronizando notas em segundo plano');
        event.waitUntil(syncNotes());
    }
});

// Função para sincronizar notas (simulada)
async function syncNotes() {
    // Em um app real, você buscaria as notas não sincronizadas do IndexedDB
    // e as enviaria para o servidor
    console.log('Sincronização em segundo plano concluída');
}