/* CERTAIN — interacciones */
(function () {
  'use strict';

  /* ---------- año del footer ---------- */
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav sticky + menú mobile ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var wsp = document.getElementById('wsp');

  function onScroll() {
    var sy = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-stuck', sy > 40);
    if (wsp) wsp.classList.toggle('is-on', sy > window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.classList.remove('is-on');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- reveal al scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add('is-in'); }, i * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- el pasaporte: cambio de página + sello ---------- */
  var tabs = document.querySelectorAll('.book__tabs button');
  var pages = document.querySelectorAll('.page');
  var stamp = document.getElementById('bookStamp');
  var stampTimer = null;

  function showPage(idx) {
    tabs.forEach(function (t) {
      var on = t.dataset.p === String(idx);
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    pages.forEach(function (p) {
      var on = p.dataset.p === String(idx);
      p.hidden = !on;
      p.classList.toggle('is-on', on);
    });
    if (stamp) {
      stamp.classList.remove('is-on');
      clearTimeout(stampTimer);
      // reflow para reiniciar la animación del sello
      void stamp.offsetWidth;
      stamp.classList.add('is-on');
      stampTimer = setTimeout(function () { stamp.classList.remove('is-on'); }, 2200);
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showPage(t.dataset.p); });
    t.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.preventDefault();
      var i = Number(t.dataset.p);
      var next = ev.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      showPage(next);
    });
  });

  /* ---------- FAQ: una abierta por vez ---------- */
  var qas = document.querySelectorAll('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- títulos que no se cortan con letra grande de Android ---------- */
  function fitText() {
    var sel = ['.hero h1', '.h-sec', '.page__txt h3', '.cta h2', '.hero__rail li', '.btn'];
    sel.forEach(function (s) {
      document.querySelectorAll(s).forEach(function (el) {
        el.style.fontSize = '';
        var guard = 0;
        while (el.scrollWidth > el.clientWidth + 1 && guard < 26) {
          var size = parseFloat(getComputedStyle(el).fontSize);
          el.style.fontSize = (size * 0.95) + 'px';
          guard++;
        }
      });
    });
  }
  window.__certainFit = fitText;
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
})();
