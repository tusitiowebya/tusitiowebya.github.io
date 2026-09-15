/* Modo LITE: sin video ni animaciones continuas si el equipo no acompaña.
   ?lite fuerza liviano, ?full fuerza completo. Se carga en el <head>. */
(function () {
  var q = location.search, h = document.documentElement;
  if (/[?&]full\b/.test(q)) return;
  var lite = /[?&]lite\b/.test(q);
  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
    if (navigator.connection && navigator.connection.saveData) lite = true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
    var c = document.createElement('canvas'), g = c.getContext('webgl');
    if (g) {
      var e = g.getExtension('WEBGL_debug_renderer_info');
      var r = e ? String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software/i.test(r)) lite = true;
    }
  } catch (err) { /* sin datos: queda completo */ }
  if (lite) h.classList.add('lite');
})();
