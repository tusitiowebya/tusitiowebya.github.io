/* =====================================================
   TermoElian TECH — main.js v=20260522
   IIFE — sin ES modules
===================================================== */
(function () {
  'use strict';
  window.__TET__ = {};

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('TET[' + name + ']', e); }
  }

  /* ── Navbar scroll ── */
  safe(function () {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function tick() { nav.classList.toggle('scrolled', window.scrollY > 44); }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }, 'nav');

  /* ── Mobile menu ── */
  safe(function () {
    var ham    = document.getElementById('hamburger');
    var menu   = document.getElementById('mobileMenu');
    var closer = document.getElementById('mobClose');
    if (!ham || !menu) return;

    function closeMob() {
      ham.classList.remove('open');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      ham.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    function openMob() {
      ham.classList.add('open');
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      ham.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    ham.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMob() : openMob();
    });
    if (closer) closer.addEventListener('click', closeMob);

    window.__TET__.closeMob = window.closeMob = closeMob;
  }, 'mobile');

  /* ── Smooth scroll ── */
  safe(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = this.getAttribute('href');
        if (!h || h === '#') return;
        var target = document.querySelector(h);
        if (!target) return;
        e.preventDefault();
        if (window.__TET__.closeMob) window.__TET__.closeMob();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 76,
          behavior: 'smooth'
        });
      });
    });
  }, 'scroll');

  /* ── Fade-in observer (threshold 0.05 + 6s safety) ── */
  safe(function () {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, Math.min(i, 6) * 70);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -16px 0px' });

    els.forEach(function (el) { obs.observe(el); });

    setTimeout(function () {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 6000);
  }, 'fadein');

  /* ── Stagger delays ── */
  safe(function () {
    [
      ['.cat-card',   0.06],
      ['.prod-card',  0.05],
      ['.ben-item',   0.07],
      ['.gal-item',   0.05],
      ['.red-card',   0.08]
    ].forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.style.transitionDelay = (i * g[1]).toFixed(2) + 's';
      });
    });
  }, 'stagger');

  /* ── Custom cursor ── */
  safe(function () {
    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      dot.style.display = ring.style.display = 'none';
      return;
    }

    var mx = -300, my = -300;
    var rx = -300, ry = -300;

    function lerp(a, b, t) { return a + (b - a) * t; }
    function setDot(x, y)  { dot.style.left  = x + 'px'; dot.style.top  = y + 'px'; }
    function setRing(x, y) { ring.style.left = x + 'px'; ring.style.top = y + 'px'; }

    (function loop() {
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      setRing(rx, ry);
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      setDot(mx, my);
      dot.classList.remove('is-out');
      ring.classList.remove('is-out');
    });
    document.addEventListener('mouseleave',  function () { dot.classList.add('is-out');    ring.classList.add('is-out');    });
    document.addEventListener('mouseenter',  function () { dot.classList.remove('is-out'); ring.classList.remove('is-out'); });
    document.addEventListener('mousedown',   function () { dot.classList.add('is-down');   ring.classList.add('is-down');   });
    document.addEventListener('mouseup',     function () { dot.classList.remove('is-down');ring.classList.remove('is-down');});

    document.querySelectorAll('.float-wa, a[href*="wa.me"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-wa');    ring.classList.add('is-wa');    });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-wa'); ring.classList.remove('is-wa'); });
    });

    document.querySelectorAll('.cat-card, .prod-card, .ben-item, .gal-item, .red-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-card');    ring.classList.add('is-card');    });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-card'); ring.classList.remove('is-card'); });
    });

    document.querySelectorAll('a:not([href*="wa.me"]):not(.float-wa), button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-link');    ring.classList.add('is-link');    });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-link'); ring.classList.remove('is-link'); });
    });
  }, 'cursor');

})();
