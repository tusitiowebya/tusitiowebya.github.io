/* Modo LITE y QA — se carga en el <head>, antes del primer render.
   LITE: sin video del hero, sin glows ni animaciones continuas.
   Overrides: ?lite fuerza liviano, ?full fuerza completo, ?qa congela para capturas. */
(function () {
  var html = document.documentElement;
  var q = location.search;
  var lite = false;

  try {
    if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(navigator.userAgent)) html.classList.add('qa');
    if (/[?&]full\b/.test(q)) { sessionStorage.setItem('vh-mode', 'full'); }
    else if (/[?&]lite\b/.test(q)) { sessionStorage.setItem('vh-mode', 'lite'); }
    var saved = sessionStorage.getItem('vh-mode');
    if (saved === 'lite') lite = true;
    if (saved === 'full') { html.classList.add('full'); return; }
  } catch (e) {}

  if (!lite) {
    var mq = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    var conn = navigator.connection || {};
    var slowNet = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    var soft = false;
    try {
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (gl) {
        var dbg = gl.getExtension('WEBGL_debug_renderer_info');
        var r = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
        soft = /swiftshader|llvmpipe|software/i.test(r);
      }
    } catch (e) {}
    lite = mq || cores <= 2 || mem <= 2 || slowNet || soft;
  }
  if (lite) html.classList.add('lite');
})();
