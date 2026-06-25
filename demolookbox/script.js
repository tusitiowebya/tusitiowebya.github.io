/* ============================================================
   LOOK BOX — interacciones
   ============================================================ */
(function () {
  'use strict';

  /* ---- año footer ---- */
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
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = (en.target.dataset.delay || 0) + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    // stagger dentro de cada grid
    document.querySelectorAll('.m-grid, .cat-grid, .lb-grid, .drop-grid, .steps').forEach(function (grid) {
      grid.querySelectorAll('.reveal').forEach(function (el, i) {
        el.dataset.delay = i * 70;
      });
    });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- crosshair cursor (solo desktop fino) ---- */
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var xhair = document.getElementById('xhair');
  if (fine && xhair) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf;
    function loop() {
      cx += (tx - cx) * 0.28;
      cy += (ty - cy) * 0.28;
      xhair.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      raf = requestAnimationFrame(loop);
    }
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    document.addEventListener('mousedown', function () { xhair.classList.add('click'); });
    document.addEventListener('mouseup', function () { xhair.classList.remove('click'); });
    document.addEventListener('mouseleave', function () { xhair.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { xhair.style.opacity = '1'; });
    loop();
  }

  /* ---- coord "vivo" en el hero (efecto cámara) ---- */
  var coord = document.getElementById('coord');
  if (coord) {
    var baseLat = 32.8908, baseLng = 68.8272; // Mendoza approx
    setInterval(function () {
      var la = (baseLat + (Math.random() - 0.5) * 0.002).toFixed(4);
      var lo = (baseLng + (Math.random() - 0.5) * 0.002).toFixed(4);
      coord.textContent = la + '°S ' + lo + '°O';
    }, 1400);
  }

})();
