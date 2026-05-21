/* ==============================================
   CLIMAN LIVE — main.js
   IIFE pattern — no ES modules
   v=20260520
============================================== */
(function () {
  'use strict';

  window.__CLIMANLIVE__ = {};

  /* Helper: wrap each init in try/catch so one failure doesn't break the rest */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('CL[' + name + ']', e); }
  }

  /* ── Navbar scroll effect ── */
  safe(function () {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }, 'navbar');

  /* ── Mobile menu ── */
  safe(function () {
    var ham  = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!ham || !menu) return;

    function closeMob() {
      ham.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
    function openMob() {
      ham.classList.add('open');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    ham.addEventListener('click', function () {
      if (menu.classList.contains('open')) { closeMob(); } else { openMob(); }
    });

    /* Close on any anchor inside mobile menu */
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeMob);
    });

    /* Expose for inline onclick fallback */
    window.closeMob = closeMob;
    window.__CLIMANLIVE__.closeMob = closeMob;
  }, 'mobile');

  /* ── Fade-in IntersectionObserver ── */
  safe(function () {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        /* Small stagger per batch */
        var delay = Math.min(i, 5) * 70;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    els.forEach(function (el) { obs.observe(el); });

    /* Safety net: reveal anything still hidden after 6 s */
    setTimeout(function () {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 6000);
  }, 'observer');

  /* ── Smooth scroll for anchor links ── */
  safe(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (window.__CLIMANLIVE__.closeMob) { window.__CLIMANLIVE__.closeMob(); }
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }, 'smoothscroll');

  /* ── Ice particles in hero ── */
  safe(function () {
    var container = document.getElementById('heroParticles');
    if (!container) return;

    for (var i = 0; i < 18; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = (Math.random() * 3 + 2).toFixed(1);
      p.style.cssText = [
        'left:'               + (Math.random() * 100).toFixed(1) + '%',
        'top:'                + (Math.random() * 100).toFixed(1) + '%',
        'width:'              + size + 'px',
        'height:'             + size + 'px',
        'animation-delay:'    + (Math.random() * 7).toFixed(2) + 's',
        'animation-duration:' + (Math.random() * 5 + 5).toFixed(1) + 's'
      ].join(';');
      container.appendChild(p);
    }
  }, 'particles');

  /* ── Stagger delays on card groups ── */
  safe(function () {
    var groups = [
      { sel: '.serv-card',    step: 0.06 },
      { sel: '.why-card',     step: 0.07 },
      { sel: '.stat-card',    step: 0.09 },
      { sel: '.gallery-item', step: 0.08 },
      { sel: '.contact-card', step: 0.08 },
      { sel: '.rep-item',     step: 0.05 },
      { sel: '.equipo-card',  step: 0.06 }
    ];
    groups.forEach(function (g) {
      document.querySelectorAll(g.sel).forEach(function (el, i) {
        el.style.transitionDelay = (i * g.step).toFixed(2) + 's';
      });
    });
  }, 'stagger');

  /* ── WhatsApp floating pulse (optional UX touch) ── */
  safe(function () {
    var ctaBtns = document.querySelectorAll('.btn-wa');
    ctaBtns.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.03)';
      });
      btn.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }, 'wapulse');

})();
