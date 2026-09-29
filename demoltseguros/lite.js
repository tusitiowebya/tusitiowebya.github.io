/* LT Seguros — modo LITE y QA. Corre en el <head>, antes del primer render.
   LITE: sin video (queda el póster), sin animaciones ni sombras pesadas.
   QA: hero de alto fijo y reveals visibles para capturas headless. */
(function () {
  var html = document.documentElement;
  var q = location.search;
  var ua = navigator.userAgent || '';
  var lite = false;

  html.classList.add('js');

  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(ua)) html.classList.add('qa');

  try { if (sessionStorage.getItem('lt-lite') === '1') lite = true; } catch (e) {}
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;
  var c = navigator.connection;
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) lite = true;

  if (/[?&]lite\b/.test(q)) lite = true;
  if (/[?&]full\b/.test(q)) { lite = false; try { sessionStorage.removeItem('lt-lite'); } catch (e) {} }

  if (lite) html.classList.add('lite');
})();
