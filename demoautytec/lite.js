/* Modo LITE y modo QA — corre en el <head>, antes del primer render.
   LITE: reduced-motion, equipos flojos, ahorro de datos o render por software.
   Overrides: ?lite fuerza liviano, ?full fuerza completo. QA: ?qa (capturas headless). */
(function () {
  var html = document.documentElement;
  var q = location.search;
  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(navigator.userAgent)) html.classList.add('qa');
  if (/[?&]full\b/.test(q)) return;

  var lite = /[?&]lite\b/.test(q);
  try { if (sessionStorage.getItem('aut-lite') === '1') lite = true; } catch (e) {}
  if (!lite && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
  if (!lite && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
  if (!lite && navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;
  var c = navigator.connection;
  if (!lite && c && (c.saveData || /2g/.test(c.effectiveType || ''))) lite = true;
  if (!lite) {
    try {
      var gl = document.createElement('canvas').getContext('webgl');
      var ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      var r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software/i.test(r)) lite = true;
    } catch (e) {}
  }
  if (lite) html.classList.add('lite');
})();
