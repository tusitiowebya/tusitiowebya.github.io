/* César · Construcción & Mantenimiento — landing */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  var targets = document.querySelectorAll('.head, .serv-card, .gal-i, .why, .zona-text, .barrios, .cta-in, .strip-i');
  targets.forEach(function (el) { el.classList.add('rev'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentElement ? el.parentElement.querySelectorAll('.rev') : [el];
        var idx = Array.prototype.indexOf.call(sibs, el);
        el.style.transitionDelay = (idx > 0 ? Math.min(idx, 5) * 0.08 : 0) + 's';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }
})();
