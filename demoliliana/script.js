/* Liliana Nasuti · Terapéuta Holística — landing */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* año footer */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* entrada del hero */
  function reveal() { document.body.classList.add('loaded'); }
  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);
  setTimeout(reveal, 700); // fallback si el video tarda

  /* barra de progreso de scroll */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  /* nav: fondo al hacer scroll */
  var nav = document.getElementById('nav');

  /* elementos con parallax: [elemento, velocidad] */
  var band = document.querySelector('.band img');

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  function update() {
    var y = window.scrollY || window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;

    /* progreso */
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

    /* nav */
    if (y > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    /* parallax del band (solo cuando está en viewport) */
    if (band && !reduce) {
      var b = band.closest('.band').getBoundingClientRect();
      if (b.bottom > 0 && b.top < window.innerHeight) {
        var prog = (window.innerHeight - b.top) / (window.innerHeight + b.height); // 0..1
        band.style.transform = 'translate3d(0,' + (prog * 90 - 45) + 'px,0)';
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* menú mobile */
  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nm.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* reveals al scrollear (scroll-driven, robusto ante saltos de scroll) */
  var fadeSel = '.head, .ter-card, .sobre-text, .band-in, .step, .benef-text, .zona-in, .ter-foot';
  var imgSel = '.sobre-photo, .benef-photo';
  var fades = [].slice.call(document.querySelectorAll(fadeSel));
  var imgs = [].slice.call(document.querySelectorAll(imgSel));

  fades.forEach(function (el) {
    el.classList.add('rev');
    var sibs = el.parentElement ? el.parentElement.querySelectorAll('.rev, .ter-card, .step') : [el];
    var idx = Array.prototype.indexOf.call(sibs, el);
    el._delay = idx > 0 ? Math.min(idx, 5) * 0.1 : 0;
  });
  imgs.forEach(function (el) { el.classList.add('rev-img'); });

  var pending = fades.concat(imgs);

  if (reduce) {
    pending.forEach(function (el) { el.classList.add('in'); });
    pending = [];
  }

  function checkReveals() {
    if (!pending.length) return;
    var line = window.innerHeight * 0.86;
    var still = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      if (el.getBoundingClientRect().top < line) {
        if (el._delay) el.style.transitionDelay = el._delay + 's';
        el.classList.add('in');
      } else {
        still.push(el);
      }
    }
    pending = still;
  }

  /* engancha checkReveals al loop de scroll ya existente */
  var _upd = update;
  update = function () { _upd(); checkReveals(); };
  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  checkReveals();
})();
