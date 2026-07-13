/* LAOS — Los Andes Oil Services */
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

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .14 });
  document.querySelectorAll('.fu').forEach(function (el) { io.observe(el); });
})();
