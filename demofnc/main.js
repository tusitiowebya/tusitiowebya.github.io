/* =====================================================
   FERNANDO NIETO CARRANZA — main.js v=20260522
   IIFE — sin ES modules
===================================================== */
(function () {
  'use strict';
  window.__FNC__ = {};

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('FNC[' + name + ']', e); }
  }

  /* ── Navbar scroll ── */
  safe(function () {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function tick() { nav.classList.toggle('scrolled', window.scrollY > 48); }
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

    window.__FNC__.closeMob = window.closeMob = closeMob;
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
        if (window.__FNC__.closeMob) window.__FNC__.closeMob();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 80,
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
        }, Math.min(i, 6) * 75);
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
      ['.servicio-card',  0.06],
      ['.prop-card',      0.07],
      ['.dif-item',       0.06],
      ['.proceso-step',   0.09],
      ['.galeria-item',   0.05],
      ['.conf-item',      0.05]
    ].forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.style.transitionDelay = (i * g[1]).toFixed(2) + 's';
      });
    });
  }, 'stagger');

  /* ── FAQ accordion ── */
  safe(function () {
    document.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item').forEach(function (it) {
          it.classList.remove('open');
          var q = it.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }, 'faq');

  /* ── Formulario → redirige a WhatsApp con datos ── */
  safe(function () {
    var form    = document.getElementById('frmContacto');
    var success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre    = (form.elements['nombre']   && form.elements['nombre'].value.trim())   || '';
      var telefono  = (form.elements['telefono'] && form.elements['telefono'].value.trim()) || '';
      var operacion = (form.elements['operacion'] && form.elements['operacion'].value)      || '';
      var mensaje   = (form.elements['mensaje']  && form.elements['mensaje'].value.trim())  || '';

      if (!nombre || !telefono || !operacion) {
        var firstEmpty = form.querySelector('[required]:invalid, [required]:placeholder-shown');
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      var opLabel = {
        comprar:       'Quiero comprar una propiedad',
        vender:        'Quiero vender una propiedad',
        alquilar:      'Quiero alquilar',
        tasar:         'Solicito una tasación',
        asesoramiento: 'Busco asesoramiento general'
      }[operacion] || operacion;

      var texto = 'Hola Fernando, me contacto desde tu página web.\n\n'
        + 'Nombre: ' + nombre + '\n'
        + 'Teléfono: ' + telefono + '\n'
        + 'Consulta: ' + opLabel + '\n'
        + (mensaje ? 'Mensaje: ' + mensaje : '');

      var waUrl = 'https://wa.me/5493516698170?text=' + encodeURIComponent(texto);

      if (success) {
        form.style.display = 'none';
        success.hidden = false;
        var waBtn = success.querySelector('a');
        if (waBtn) waBtn.href = waUrl;
      }

      setTimeout(function () { window.open(waUrl, '_blank', 'noopener'); }, 400);
    });
  }, 'form');

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
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
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

    document.querySelectorAll('.servicio-card, .prop-card, .dif-item, .galeria-item, .faq-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-card');    ring.classList.add('is-card');    });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-card'); ring.classList.remove('is-card'); });
    });

    document.querySelectorAll('a:not([href*="wa.me"]):not(.float-wa), button, .faq-q').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-link');    ring.classList.add('is-link');    });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-link'); ring.classList.remove('is-link'); });
    });
  }, 'cursor');

})();
