/* Modo LITE — corre en el <head>, antes del primer render.
   Detecta equipos sin aceleración / con poca capacidad y evita
   video, blur y animaciones. Overrides: ?lite fuerza liviano, ?full fuerza completo. */
(function () {
  var qs = location.search;
  var root = document.documentElement;

  if (/[?&]full\b/.test(qs)) { try { sessionStorage.removeItem('zz-lite'); } catch (e) {} return; }
  if (/[?&]lite\b/.test(qs)) { root.classList.add('lite'); return; }

  try { if (sessionStorage.getItem('zz-lite') === '1') { root.classList.add('lite'); return; } } catch (e) {}

  var lite = false;
  try {
    var m = matchMedia('(prefers-reduced-motion: reduce)');
    if (m && m.matches) lite = true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) lite = true;

    var cv = document.createElement('canvas');
    var gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
    if (gl) {
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        var r = (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') + '';
        if (/swiftshader|llvmpipe|software|basic render/i.test(r)) lite = true;
      }
    } else { lite = true; }
  } catch (e) {}

  if (lite) root.classList.add('lite');

  // Modo QA para capturas headless
  if (/[?&]qa\b/.test(qs) || /HeadlessChrome/.test(navigator.userAgent)) root.classList.add('qa');
})();
