/* GVL Perfume — interacciones */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var WA_NUMBER = '5492975161852';

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

  /* ---- "encontrá tu aroma": selector de ocasión -> WhatsApp ---- */
  var occGrid = document.getElementById('occGrid');
  var occHint = document.getElementById('occHint');
  if (occGrid) {
    var buttons = occGrid.querySelectorAll('.occ');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var txt = btn.getAttribute('data-txt');
        if (occHint) occHint.textContent = 'Abriendo WhatsApp para asesorarte sobre "' + btn.querySelector('h3').textContent + '"...';
        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(txt);
        window.open(url, '_blank', 'noopener');
      });
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.occ, .col-item, .why-card, .buy-step, .head');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 6) * 60) + 'ms';
      io.observe(el);
    });
  }
})();
