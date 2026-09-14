/* Modo LITE y QA — se carga en el <head>, antes del primer render.
   LITE: movimiento reducido, equipos flojos o ahorro de datos → sin mp4 ni loops.
   QA: ?qa o Chrome headless → fija el hero y apaga reveals para capturas. */
(function () {
  var h = document.documentElement, q = location.search, n = navigator;
  var lento = (n.hardwareConcurrency && n.hardwareConcurrency <= 2) || (n.deviceMemory && n.deviceMemory <= 2) ||
    (n.connection && (n.connection.saveData || /2g/.test(n.connection.effectiveType || '')));
  var reducido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (/[?&]full\b/.test(q)) return;
  if (/[?&]lite\b/.test(q) || lento || reducido) h.classList.add('lite');
  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(n.userAgent)) h.classList.add('qa');
})();
