/* ═══════════════════════════════════════════════════════════
   Detección de modo LITE — se carga en el <head>, antes del
   primer render, para que la página nunca llegue a pintar el
   canvas / los blur / el video en un equipo que no los banca.

   Overrides manuales:  ?lite  fuerza liviano · ?full  fuerza completo
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var html = document.documentElement;
  var qs = location.search;

  function lite(motivo) {
    html.classList.add('lite');
    html.setAttribute('data-lite', motivo);
  }

  /* 1 — override explícito por URL */
  if (qs.indexOf('full') > -1) { html.classList.add('full'); return; }
  if (qs.indexOf('lite') > -1) { lite('url'); return; }

  /* 2 — el navegador ya nos dijo que quiere menos movimiento */
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return lite('reduced-motion');
    }
  } catch (e) {}

  /* 3 — veredicto de una sesión anterior (el watchdog de FPS lo grabó) */
  try {
    if (sessionStorage.getItem('sg-lite') === '1') return lite('watchdog');
  } catch (e) {}

  /* 4 — equipo flaco: pocos núcleos o poca RAM */
  var cores = navigator.hardwareConcurrency || 8;
  var ram = navigator.deviceMemory || 8;
  if (cores <= 2 || ram <= 2) return lite('hardware');

  /* 5 — sin aceleración por GPU: render por software (SwiftShader /
     llvmpipe / Mesa genérico). Es el caso que realmente tilda todo. */
  try {
    var cv = document.createElement('canvas');
    var gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
    if (!gl) return lite('sin-webgl');

    var dbg = gl.getExtension('WEBGL_debug_renderer_info');
    var r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(r)) {
      return lite('render-software');
    }
    var lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
  } catch (e) {
    return lite('webgl-error');
  }
})();
