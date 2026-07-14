/* Full Time Relojes — dial funcional + interacciones */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

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

  /* ---- generar ticks del dial (60 marcas, 12 mayores) ---- */
  var ticksGroup = document.getElementById('dTicks');
  if (ticksGroup) {
    var cx = 150, cy = 150, rOuter = 112, rInnerMinor = 104, rInnerMajor = 96;
    for (var i = 0; i < 60; i++) {
      var isMajor = i % 5 === 0;
      var angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
      var rInner = isMajor ? rInnerMajor : rInnerMinor;
      var x1 = cx + Math.cos(angle) * rOuter;
      var y1 = cy + Math.sin(angle) * rOuter;
      var x2 = cx + Math.cos(angle) * rInner;
      var y2 = cy + Math.sin(angle) * rInner;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toFixed(2));
      line.setAttribute('y1', y1.toFixed(2));
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      if (isMajor) line.setAttribute('class', 'tick-major');
      ticksGroup.appendChild(line);
    }
  }

  /* ---- reloj funcional en hora real de Buenos Aires ---- */
  var hHour = document.getElementById('hHour');
  var hMin = document.getElementById('hMin');
  var hSec = document.getElementById('hSec');
  var dialClock = document.getElementById('dialClock');
  var TZ = 'America/Argentina/Buenos_Aires';

  function setHand(el, deg, len, cx, cy) {
    var rad = (deg - 90) * Math.PI / 180;
    var x2 = cx + Math.cos(rad) * len;
    var y2 = cy + Math.sin(rad) * len;
    el.setAttribute('x2', x2.toFixed(2));
    el.setAttribute('y2', y2.toFixed(2));
  }

  function tick() {
    var now = new Date();
    var parts = new Intl.DateTimeFormat('es-AR', {
      timeZone: TZ, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).formatToParts(now);
    var h = 0, m = 0, s = 0;
    parts.forEach(function (p) {
      if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
      if (p.type === 'minute') m = parseInt(p.value, 10);
      if (p.type === 'second') s = parseInt(p.value, 10);
    });

    if (hHour) setHand(hHour, ((h % 12) + m / 60) * 30, 55, 150, 150);
    if (hMin) setHand(hMin, (m + s / 60) * 6, 80, 150, 150);
    if (hSec) setHand(hSec, s * 6, 92, 150, 150);
    if (dialClock) {
      dialClock.textContent =
        String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('.cat-card, .show-item, .buy-step, .head');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 4) * 60) + 'ms';
      io.observe(el);
    });
  }
})();
