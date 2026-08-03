/* RecyMack · Metales, mantenimiento industrial y maquinaria */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav ---- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var open = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nm.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- visor de piezas gráficas ---- */
  var lb = document.getElementById('lightbox'),
      lbImg = document.getElementById('lbImg'),
      lbClose = document.getElementById('lbClose'),
      lastFocus = null;

  function openLb(img) {
    lastFocus = document.activeElement;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (lb) {
    document.querySelectorAll('.plate img').forEach(function (img) {
      img.addEventListener('click', function () { openLb(img); });
    });
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) closeLb();
    });
  }

  /* ---- revelado al scroll ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll(
    '.rail-head, .head-2col, .kicker, .h2-wide, .metal, .metals-note, ' +
    '.plate, .frame, .split-txt, .cred, .datos, .contacto-in'
  );

  if (reduce || !('IntersectionObserver' in window)) return;

  targets.forEach(function (el) { el.classList.add('rev'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var sibs = el.parentElement ? el.parentElement.querySelectorAll(':scope > .rev') : [el];
      var idx = Array.prototype.indexOf.call(sibs, el);
      el.style.transitionDelay = (idx > 0 ? Math.min(idx, 6) * 0.055 : 0) + 's';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();
