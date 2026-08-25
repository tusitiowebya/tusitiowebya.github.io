/* ============================================================
   DATAGROUP — comportamiento general
   ============================================================ */
(function () {
  'use strict';

  /* ---------- NAV ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var hero = document.getElementById('hero');

  function onScroll() {
    if (!nav) return;
    // en subpáginas (sin hero) la nav arranca sólida
    var umbral = hero ? window.innerHeight * 0.72 : 40;
    nav.classList.toggle('nav--solid', window.scrollY > umbral || !hero);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && links) {
    burger.addEventListener('click', function () {
      var abierto = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  var LITE = document.documentElement.classList.contains('lite');

  /* ---------- modo QA (?qa): saltea animaciones para capturas ---------- */
  var QA = /(?:\?|&)qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent);
  if (QA) document.documentElement.classList.add('qa');

  /* ---------- REVEAL ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (QA || LITE) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, (i % 6) * 80);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- HERO: el mp4 sólo se pide si NO estamos en LITE ---------- */
  var vid = document.getElementById('heroVideo');
  if (vid && !LITE && vid.dataset.src) {
    var src = document.createElement('source');
    src.type = 'video/mp4';
    src.src = vid.dataset.src;
    vid.appendChild(src);
    vid.load();
    var play = vid.play();
    if (play && play.catch) play.catch(function () { /* autoplay bloqueado: queda el poster */ });
  }

  /* ---------- HERO: barra de uptime ---------- */
  var bars = document.getElementById('uptimeBars');
  if (bars) {
    var n = 52;
    var hi = [Math.floor(n * 0.32), Math.floor(n * 0.71)];
    for (var k = 0; k < n; k++) {
      var b = document.createElement('i');
      if (hi.indexOf(k) > -1) b.className = 'is-hi';
      b.style.transitionDelay = (240 + k * 22) + 'ms';
      bars.appendChild(b);
    }
  }

  requestAnimationFrame(function () {
    setTimeout(function () { if (hero) hero.classList.add('hero--live'); }, 120);
  });

  /* ---------- CONTADORES ---------- */
  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var fin = parseFloat(el.dataset.count);
        var suf = el.dataset.suffix || '';
        var t0 = null, dur = 1400;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(fin * e) + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io2.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---------- AÑO ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- WATCHDOG DE FPS: degrada en caliente si el equipo no da ---------- */
  if (!LITE && !QA && window.requestAnimationFrame) {
    var frames = 0, t0 = performance.now();
    (function tick(now) {
      frames++;
      if (now - t0 < 2000) { requestAnimationFrame(tick); return; }
      var fps = frames / ((now - t0) / 1000);
      if (fps < 28) {
        document.documentElement.classList.add('lite');
        try { sessionStorage.setItem('dg_lite', '1'); } catch (e) {}
        var v = document.getElementById('heroVideo');
        if (v) { v.pause(); v.removeAttribute('autoplay'); }
        document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      }
    })(t0);
  }

  /* ---------- MARQUEE: duplicar filas si hace falta ---------- */
  var mq = document.getElementById('marquee');
  if (mq) {
    var row = mq.querySelector('.marquee__row');
    if (row && row.scrollWidth < window.innerWidth) {
      var extra = row.cloneNode(true);
      extra.setAttribute('aria-hidden', 'true');
      mq.appendChild(extra);
    }
  }
})();
