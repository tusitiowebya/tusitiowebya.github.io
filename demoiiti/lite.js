/* Modo LITE — se ejecuta en el <head>, antes del primer render.
   Equipos flojos / sin GPU / conexión mala: sin video, sin blurs, sin animaciones. */
(function () {
  var q = location.search;
  if (/[?&]full\b/.test(q)) return;

  var lite = /[?&]lite\b/.test(q);

  if (!lite) {
    try {
      var m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cores = navigator.hardwareConcurrency || 8;
      var ram = navigator.deviceMemory || 8;
      var c = navigator.connection || {};
      var red = c.saveData === true || /(^|-)2g$/.test(c.effectiveType || '');

      var gpu = '';
      try {
        var cv = document.createElement('canvas');
        var gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
        if (gl) {
          var dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) gpu = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
        }
      } catch (e) {}
      var soft = /swiftshader|llvmpipe|software/i.test(gpu);

      lite = m || cores <= 2 || ram <= 2 || red || soft;
    } catch (e) {}
  }

  if (lite) document.documentElement.classList.add('lite');

  // Modo QA: fija el hero para capturas full-page headless
  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(navigator.userAgent)) {
    document.documentElement.classList.add('qa');
  }
})();
