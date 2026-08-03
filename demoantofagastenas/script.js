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

  /* galería de videos: visor a pantalla completa */
  var hero = document.querySelector('.hero-vid');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal-item'));
  var visor = document.getElementById('visor');
  if (items.length && visor) {
    var vid = document.getElementById('visorVid');
    var tTitulo = document.getElementById('visorTitulo');
    var tSub = document.getElementById('visorSub');
    var tN = document.getElementById('visorN');
    var idx = 0;

    function abrirEn(i) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      vid.pause();
      vid.setAttribute('poster', it.dataset.poster || '');
      vid.querySelectorAll('source').forEach(function (s) { s.remove(); });
      var src = document.createElement('source');
      src.src = it.dataset.src;
      src.type = 'video/mp4';
      vid.appendChild(src);
      vid.load();
      tTitulo.textContent = it.dataset.titulo || '';
      tSub.textContent = it.dataset.sub || '';
      tN.textContent = (idx + 1) + ' / ' + items.length;
      vid.play().catch(function () {});
    }

    function abrir(i) {
      if (hero) hero.pause();
      visor.hidden = false;
      document.body.classList.add('visor-abierto');
      requestAnimationFrame(function () { visor.classList.add('abierto'); });
      abrirEn(i);
    }

    function cerrar() {
      visor.classList.remove('abierto');
      document.body.classList.remove('visor-abierto');
      vid.pause();
      setTimeout(function () {
        visor.hidden = true;
        vid.removeAttribute('src');
        vid.querySelectorAll('source').forEach(function (s) { s.remove(); });
        vid.load();
      }, 260);
      if (hero) hero.play().catch(function () {});
    }

    items.forEach(function (it, i) {
      it.addEventListener('click', function () { abrir(i); });
    });
    visor.querySelectorAll('[data-cerrar]').forEach(function (el) {
      el.addEventListener('click', cerrar);
    });
    visor.querySelector('.visor-prev').addEventListener('click', function () { abrirEn(idx - 1); });
    visor.querySelector('.visor-next').addEventListener('click', function () { abrirEn(idx + 1); });

    document.addEventListener('keydown', function (e) {
      if (visor.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') abrirEn(idx + 1);
      if (e.key === 'ArrowLeft') abrirEn(idx - 1);
    });

    var touchX = null;
    visor.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) abrirEn(dx > 0 ? idx - 1 : idx + 1);
      touchX = null;
    }, { passive: true });
  }
})();
