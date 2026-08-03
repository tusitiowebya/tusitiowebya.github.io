/* Rutas Antofagasteñas — landing */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* galería: un solo video a la vez, y el de fondo se silencia solo */
  var hero = document.querySelector('.hero-vid');
  var gallery = Array.prototype.slice.call(document.querySelectorAll('.vid-card video'));
  gallery.forEach(function (v) {
    v.addEventListener('play', function () {
      gallery.forEach(function (o) { if (o !== v) o.pause(); });
      if (hero) hero.pause();
    });
  });
  document.addEventListener('pause', function () {
    if (!hero) return;
    var alguno = gallery.some(function (v) { return !v.paused; });
    if (!alguno && hero.paused) hero.play().catch(function () {});
  }, true);
})();
