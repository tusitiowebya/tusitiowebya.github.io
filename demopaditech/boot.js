/* PADITECH — arranque: marca el modo antes de pintar.
   ?qa = capturas (sin animaciones) · ?lite = modo liviano · ?full = fuerza el modo completo */
(function () {
  var h = document.documentElement, q = location.search, s = null;
  h.classList.add('js');
  if (/[?&]qa\b/.test(q)) h.classList.add('qa');
  try {
    if (/[?&]full\b/.test(q)) sessionStorage.removeItem('padi-lite');
    s = sessionStorage.getItem('padi-lite');
  } catch (e) { /* sin almacenamiento */ }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (/[?&]lite\b/.test(q) || s === '1' || (reduce && !/[?&]full\b/.test(q))) h.classList.add('lite');
})();
