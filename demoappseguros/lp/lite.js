/* Modo LITE: se carga en el <head> antes del primer render.
   Sin aceleración por hardware (SwiftShader/llvmpipe), pocos núcleos o poca memoria,
   reduced-motion o save-data → clase .lite en <html>: no se pide el mp4, sin loops ni glows.
   Overrides: ?lite fuerza liviano, ?full fuerza completo. ?qa congela animaciones para capturas. */
(function () {
  var html = document.documentElement;
  var q = location.search;
  html.classList.add("js");
  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(navigator.userAgent)) html.classList.add("qa");
  if (/[?&]full\b/.test(q)) return;

  var lite = /[?&]lite\b/.test(q);
  try { if (sessionStorage.getItem("as-lite") === "1") lite = true; } catch (e) {}

  if (!lite) {
    try {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) lite = true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;
      var c = navigator.connection;
      if (c && (c.saveData || /2g/.test(c.effectiveType || ""))) lite = true;
    } catch (e) {}
  }

  if (!lite) {
    try {
      var cv = document.createElement("canvas");
      var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
      if (gl) {
        var ext = gl.getExtension("WEBGL_debug_renderer_info");
        var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "";
        if (/swiftshader|llvmpipe|software|basic render/i.test(r)) lite = true;
        var lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
      }
    } catch (e) {}
  }

  if (lite) html.classList.add("lite");
})();
