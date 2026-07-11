/* C y C — Reparación de Celulares */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- menú móvil ---- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  function close() {
    navMobile.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      var open = navMobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---- ticket: estados que se tildan sincronizados con la pantalla ---- */
  var steps = document.querySelectorAll('.tk-step');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (steps.length) {
    if (reduce) {
      steps.forEach(function (s) { s.classList.add('done'); });
    } else {
      var delays = [500, 1300, 2100, 3000];
      steps.forEach(function (s, i) {
        setTimeout(function () { s.classList.add('done'); }, delays[i] || 500);
      });
    }
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.serv-card, .flow-step, .acc-list li, .t-card, .head, .local-card, .cta-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 3) * 60) + 'ms';
      io.observe(el);
    });
  }
})();
