/* CEAS — modo LITE
   Corre en el <head>, antes del primer render: decide si el equipo banca
   video + glows + animaciones. Si no, marca <html class="lite"> y el resto
   del sitio se degrada solo (ver style.css y script.js).
   Overrides: ?lite fuerza liviano, ?full fuerza completo. */
(function () {
  var h = document.documentElement;
  var qs = location.search;

  if (/[?&]full\b/.test(qs)) { h.classList.add('full'); return; }
  if (/[?&]lite\b/.test(qs)) { h.classList.add('lite'); return; }

  var lite = false;

  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;

    var c = document.createElement('canvas');
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (gl) {
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      var r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software|basic render/i.test(r)) lite = true;
    }
    if (sessionStorage.getItem('ceas_lite') === '1') lite = true;
  } catch (e) { /* sin datos: seguimos en modo completo */ }

  if (lite) h.classList.add('lite');
})();
