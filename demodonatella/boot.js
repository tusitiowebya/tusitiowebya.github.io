/* Fragancias Donatella — arranque: decide el modo antes de pintar.
   ?qa = capturas (sin animaciones) · ?lite = modo liviano · ?full = fuerza el modo completo */
(function () {
  var h = document.documentElement, q = location.search, saved = null;
  h.classList.add('js');
  if (/[?&]qa\b/.test(q)) h.classList.add('qa');
  var force = /[?&]full\b/.test(q);
  try {
    if (force) sessionStorage.removeItem('donatella-lite');
    saved = sessionStorage.getItem('donatella-lite');
  } catch (e) {}
  var lite = /[?&]lite\b/.test(q) || saved === '1';
  if (!force && !lite) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var weak = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
    lite = reduce || weak;
    if (!lite) {
      // sin aceleración por hardware (SwiftShader / llvmpipe) el vidrio 3D tilda todo el navegador
      try {
        var c = document.createElement('canvas');
        var gl = c.getContext('webgl2') || c.getContext('webgl');
        if (!gl) lite = true;
        else {
          var ext = gl.getExtension('WEBGL_debug_renderer_info');
          var r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
          if (/swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(r)) lite = true;
          var lose = gl.getExtension('WEBGL_lose_context');
          if (lose) lose.loseContext();
        }
      } catch (e) { lite = true; }
    }
  }
  h.classList.add(lite ? 'lite' : 'full');
})();
