/* Nexo TV · service worker mínimo
   - Network-first SOLO para el mismo origen y GET (HTML, CSS, JS, imágenes).
   - Nunca toca iframes/players externos (Kick, YouTube, TikTok), el stream de radio
     ni pedidos con Range (audio/video): esos van directo a la red.
   - Si no hay conexión, sirve la última copia guardada para que la app abra. */
var CACHE = 'nexotv-v1';
var BASICOS = ['./', './style.css', './script.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASICOS); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('nexotv-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                 // players, stream de radio, fuentes, wa.me
  if (req.headers.has('range')) return;                             // audio/video por rangos
  var d = req.destination;
  if (d === 'iframe' || d === 'frame' || d === 'audio' || d === 'video' || d === 'track') return;
  if (/\.(mp4|webm|m3u8|ts|mp3|aac|ogg)(\?|$)/i.test(url.pathname)) return;

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copia = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copia); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (r) {
        return r || (req.mode === 'navigate' ? caches.match('./') : undefined) || Response.error();
      });
    })
  );
});
