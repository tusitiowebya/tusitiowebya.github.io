(function () {
  var html = document.documentElement;
  html.classList.add('js');
  var q = location.search;
  if (/[?&]qa\b/.test(q)) html.classList.add('qa');
  if (/[?&]full\b/.test(q)) return;
  var lite = /[?&](lite|qa)\b/.test(q);
  try { if (sessionStorage.getItem('dp-lite') === '1') lite = true; } catch (e) {}
  if (!lite && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) lite = true;
  if (!lite && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) lite = true;
  if (!lite && navigator.deviceMemory && navigator.deviceMemory <= 2) lite = true;
  if (!lite) {
    try {
      var gl = document.createElement('canvas').getContext('webgl');
      var ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
      var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
      if (!gl || /swiftshader|llvmpipe|software|basic render/i.test(r)) lite = true;
    } catch (e) {}
  }
  if (lite) html.classList.add('lite');
})();
