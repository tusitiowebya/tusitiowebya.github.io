/* Opción Viajes — landing */
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

  var items = Array.prototype.slice.call(document.querySelectorAll('.gal-item'));
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'),
      lbClose = document.getElementById('lbClose'), lbPrev = document.getElementById('lbPrev'),
      lbNext = document.getElementById('lbNext');
  var current = -1;

  function openLb(i) {
    current = i;
    lbImg.src = items[i].getAttribute('data-full');
    lbImg.alt = items[i].querySelector('img').alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }
  function step(dir) {
    if (current < 0) return;
    current = (current + dir + items.length) % items.length;
    openLb(current);
  }

  if (lb && items.length) {
    items.forEach(function (btn, i) {
      btn.addEventListener('click', function () { openLb(i); });
    });
    lbClose.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', function () { step(-1); });
    lbNext.addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
})();
