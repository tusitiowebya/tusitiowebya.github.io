(function () {
  var d = document.documentElement, q = location.search;
  d.classList.add('js');
  if (/[?&]qa\b/.test(q)) d.classList.add('qa');
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('calma');
})();
