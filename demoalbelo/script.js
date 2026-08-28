/* ==========================================================
   Cecilia Albelo · Arquitectura — interacciones
   ========================================================== */
(function () {
  'use strict';

  var nav      = document.getElementById('nav');
  var links    = document.getElementById('navLinks');
  var burger   = document.getElementById('burger');
  var planoTgl = document.getElementById('planoTgl');

  /* ---------- año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav sticky + burbuja de WhatsApp ---------- */
  var wa = document.querySelector('.wa-float');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
    /* el botón flotante aparece recién pasado el hero, para no
       chocar con el rótulo del plano */
    if (wa) wa.classList.toggle('show', window.scrollY > window.innerHeight * 0.72);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menú mobile ---------- */
  function closeMenu() {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- modo plano (signature) ---------- */
  var hint = document.createElement('div');
  hint.className = 'plano-hint';
  document.body.appendChild(hint);
  var hintTimer;

  function flashHint(txt) {
    hint.textContent = txt;
    hint.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { hint.classList.remove('show'); }, 2200);
  }

  planoTgl.addEventListener('click', function () {
    var on = document.body.classList.toggle('plano');
    planoTgl.setAttribute('aria-pressed', on ? 'true' : 'false');
    flashHint(on ? 'Modo plano activado' : 'Modo plano desactivado');
  });

  /* invitación discreta la primera vez que se llega a "Obras" */
  var invited = false;
  var obras = document.getElementById('obras');
  if (obras && 'IntersectionObserver' in window) {
    var io0 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !invited && !document.body.classList.contains('plano')) {
          invited = true;
          flashHint('Probá el modo plano ↗');
          io0.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io0.observe(obras);
  }

  /* ---------- reveal escalonado ---------- */
  /* ?qa=1 → todo visible de una (capturas headless / auditorías) */
  var QA = /[?&]qa=1/.test(location.search);
  if (QA) {
    document.documentElement.classList.add('qa');
    if (/[?&]plano=1/.test(location.search)) planoTgl.click();
  }
  var items = document.querySelectorAll('.reveal');
  if (QA || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (n) {
          return n.classList && n.classList.contains('reveal');
        }) : [el];
        var i = siblings.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 70 : 0) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ: una abierta por vez ---------- */
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- video hero: reintento si el autoplay falla ---------- */
  var v = document.querySelector('.hero__video');
  if (v) {
    var play = function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    play();
    document.addEventListener('touchstart', play, { once: true, passive: true });
    document.addEventListener('click', play, { once: true });
  }
})();
