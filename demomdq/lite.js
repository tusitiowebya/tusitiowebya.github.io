/* lite.js — se carga en el <head>, ANTES del primer render.
   Detecta equipos flojos / conexiones malas y marca <html class="lite">
   para no pedir el mp4 ni animar nada. Overrides: ?lite / ?full        */
(function () {
  var d = document.documentElement;
  var qs = location.search;
  var forceLite = /[?&]lite\b/.test(qs);
  var forceFull = /[?&]full\b/.test(qs);

  function weak() {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
      var c = navigator.connection;
      if (c && (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || ''))) return true;
      // render por software (SwiftShader / llvmpipe)
      var cv = document.createElement('canvas');
      var gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
      if (gl) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          var r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
          if (/swiftshader|llvmpipe|software/i.test(r)) return true;
        }
      }
    } catch (e) {}
    return false;
  }

  var lite = forceLite || (!forceFull && (weak() || sessionStorage.getItem('mdq_lite') === '1'));
  if (lite) d.classList.add('lite');

  // modo QA para capturas headless
  if (/[?&]qa\b/.test(qs) || /HeadlessChrome/.test(navigator.userAgent)) d.classList.add('qa');
})();
