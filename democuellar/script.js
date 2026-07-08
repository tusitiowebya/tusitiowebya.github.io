/* ============================================================
   Jesús Cuellar — CM para Abogados — interacciones
   ============================================================ */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav scrolled ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- menú móvil ---- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  function closeMenu() {
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
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('section > .wrap, section > .hero-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---- contador "en vivo" del badge del hero ---- */
  var liveNum = document.getElementById('liveNum');
  if (liveNum) {
    var base = 4312;
    setInterval(function () {
      base += Math.floor(Math.random() * 3) + 1;
      liveNum.textContent = base.toLocaleString('es-AR');
    }, 2600);
  }

})();
