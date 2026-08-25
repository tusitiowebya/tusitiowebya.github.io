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

  /* ---------- modo QA (?qa): saltea animaciones para capturas ---------- */
  var QA = /(?:\?|&)qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent);
  if (QA) document.documentElement.classList.add('qa');

  /* ---------- REVEAL ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (QA) {
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

  /* ---------- HERO: grilla que se abre celda por celda ---------- */
  var cells = document.getElementById('heroCells');
  if (cells && hero) {
    var cols = window.innerWidth < 900 ? 4 : 8;
    var rows = window.innerWidth < 900 ? 6 : 5;
    cells.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
    cells.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
    var total = cols * rows;
    var orden = [];
    for (var i = 0; i < total; i++) orden.push(i);
    // se abre desde la esquina inferior izquierda hacia afuera
    orden.sort(function (a, b) {
      var ax = a % cols, ay = Math.floor(a / cols);
      var bx = b % cols, by = Math.floor(b / cols);
      var da = ax + (rows - 1 - ay), db = bx + (rows - 1 - by);
      return da - db || Math.random() - 0.5;
    });
    var frag = document.createDocumentFragment();
    var nodos = [];
    for (var j = 0; j < total; j++) { var n = document.createElement('i'); nodos.push(n); frag.appendChild(n); }
    orden.forEach(function (idx, pos) { nodos[idx].style.transitionDelay = (pos * 26) + 'ms'; });
    cells.appendChild(frag);
  }

  /* ---------- HERO: barra de uptime ---------- */
  var bars = document.getElementById('uptimeBars');
  if (bars) {
    var n = 52;
    var warn = [Math.floor(n * 0.32), Math.floor(n * 0.71)];
    for (var k = 0; k < n; k++) {
      var b = document.createElement('i');
      if (warn.indexOf(k) > -1) b.className = 'is-warn';
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
