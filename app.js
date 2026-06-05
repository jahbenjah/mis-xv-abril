const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'styles.min.css',
  'script.min.js',
  'app.min.js',
  'og-imagen.png'
];

// Evento de instalación: guarda los archivos esenciales en la caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento fetch: intercepta peticiones para servir contenido desde la caché si no hay red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve el recurso indexado o realiza la petición normal a internet
      return response || fetch(event.request);
    })
  );
});
