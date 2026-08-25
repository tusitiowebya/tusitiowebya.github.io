/* ============================================================
   DATAGROUP — modo LITE
   Se carga en el <head>, ANTES del primer render, para que el
   equipo lento nunca llegue a pedir el mp4 ni a pintar blurs.
   Decide por: preferencia del usuario, CPU/RAM, conexión,
   render por software (SwiftShader / llvmpipe) y la marca que
   dejó el watchdog de FPS en una visita anterior.
   Overrides manuales: ?lite  /  ?full
   ============================================================ */
(function () {
  'use strict';

  var doc = document.documentElement;
  var q = location.search;

  if (/(?:\?|&)full\b/.test(q)) { doc.className += ' full'; return; }

  var lite = /(?:\?|&)lite\b/.test(q);

  if (!lite) {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;

      var con = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (con && (con.saveData || /(^|-)2g$/.test(con.effectiveType || ''))) lite = true;

      if (window.sessionStorage && sessionStorage.getItem('dg_lite') === '1') lite = true;

      if (!lite) {
        var c = document.createElement('canvas');
        var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
        if (!gl) {
          lite = true;
        } else {
          var dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) {
            var r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
            if (/swiftshader|llvmpipe|software|basic render/i.test(r)) lite = true;
          }
        }
      }
    } catch (e) { /* si algo falla, se queda en full */ }
  }

  if (lite) doc.className += ' lite';
})();
