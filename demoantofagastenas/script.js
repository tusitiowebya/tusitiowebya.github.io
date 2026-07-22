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
})();
