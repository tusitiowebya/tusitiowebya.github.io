/* ==========================================================================
   FRIGOAR — interacciones
   1. nav sticky + menú mobile
   2. display digital del hero (34° -> 24°)
   3. reveals por IntersectionObserver
   4. calculadora de frigorías con dial arrastrable (signature)
   5. WhatsApp flotante
   ========================================================================== */
(function () {
  'use strict';

  var WA = 'https://wa.me/5492213566871';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');

    var waf = document.getElementById('waFloat');
    if (waf) waf.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---------- 2. display digital del hero ---------- */
  var tempNum = document.getElementById('tempNum');
  if (tempNum) {
    var from = 34, to = 24, dur = 2600;
    if (reduce) {
      tempNum.textContent = to.toFixed(1);
    } else {
      setTimeout(function () {
        var t0 = Date.now();
        var tick = setInterval(function () {
          var p = Math.min((Date.now() - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          tempNum.textContent = (from - (from - to) * e).toFixed(1);
          if (p >= 1) clearInterval(tick);
        }, 40);
      }, 600);
    }
  }

  /* ---------- 3. reveals ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, (i % 4) * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 4. calculadora de frigorías ---------- */
  var dial = document.getElementById('dial');
  if (dial) {
    var MIN = 6, MAX = 60, SPAN = 270, START = 135;   // arco de 270° con el hueco abajo
    var R = 96, C = 2 * Math.PI * R;                   // circunferencia del path
    var m2 = 20;

    var prog = document.getElementById('dialProg');
    var knob = document.getElementById('dialKnob');
    var out = document.getElementById('m2');
    var resFg = document.getElementById('resFg');
    var resBtu = document.getElementById('resBtu');
    var resEq = document.getElementById('resEquipo');
    var resNota = document.getElementById('resNota');
    var calcWa = document.getElementById('calcWa');
    var opts = {
      sol: document.getElementById('o_sol'),
      techo: document.getElementById('o_techo'),
      gente: document.getElementById('o_gente'),
      alto: document.getElementById('o_alto')
    };

    // ticks decorativos dentro del arco
    var ticks = document.getElementById('dialTicks');
    var svgNS = 'http://www.w3.org/2000/svg';
    for (var i = 0; i <= 10; i++) {
      var a = (i / 10) * SPAN * Math.PI / 180;
      var ln = document.createElementNS(svgNS, 'line');
      ln.setAttribute('x1', 120 + Math.cos(a) * 78);
      ln.setAttribute('y1', 120 + Math.sin(a) * 78);
      ln.setAttribute('x2', 120 + Math.cos(a) * 85);
      ln.setAttribute('y2', 120 + Math.sin(a) * 85);
      ticks.appendChild(ln);
    }

    var EQUIPOS = [
      { fg: 2250, btu: 9000 },
      { fg: 3000, btu: 12000 },
      { fg: 4500, btu: 18000 },
      { fg: 6000, btu: 24000 }
    ];

    function calcular() {
      var fg = m2 * 100;
      if (opts.sol.checked) fg *= 1.15;
      if (opts.techo.checked) fg *= 1.15;
      if (opts.gente.checked) fg *= 1.10;
      if (opts.alto.checked) fg *= 1.10;
      fg = Math.round(fg / 50) * 50;

      var eq = null;
      for (var i = 0; i < EQUIPOS.length; i++) {
        if (EQUIPOS[i].fg >= fg) { eq = EQUIPOS[i]; break; }
      }
      var nota;
      if (!eq) {
        eq = EQUIPOS[EQUIPOS.length - 1];
        nota = 'Para este ambiente conviene un equipo de mayor porte o dividirlo en dos splits. Lo vemos juntos.';
      } else if (eq.fg - fg > eq.fg * 0.28) {
        nota = 'Te queda holgado: es el más chico del mercado y sobra un poco.';
      } else if (eq.fg - fg < eq.fg * 0.06) {
        nota = 'Está justo. Si el ambiente es muy soleado, conviene ir al tamaño siguiente.';
      } else {
        nota = 'Alcanza cómodo para un ambiente así.';
      }

      resFg.textContent = fg.toLocaleString('es-AR');
      resBtu.textContent = (Math.round(fg * 3.968 / 100) * 100).toLocaleString('es-AR');
      resEq.textContent = eq.fg.toLocaleString('es-AR') + ' frigorías (' + eq.btu.toLocaleString('es-AR') + ' BTU)';
      resNota.textContent = nota;

      var extras = [];
      if (opts.sol.checked) extras.push('recibe sol fuerte');
      if (opts.techo.checked) extras.push('última planta o techo de chapa');
      if (opts.gente.checked) extras.push('mucha gente o electrónica');
      if (opts.alto.checked) extras.push('techo alto');

      var msg = 'Hola Frigoar! Usé la calculadora de la web.\n\n' +
        '• Ambiente: ' + m2 + ' m²\n' +
        (extras.length ? '• Detalles: ' + extras.join(', ') + '\n' : '') +
        '• Estimación: ' + fg.toLocaleString('es-AR') + ' frigorías\n' +
        '• Equipo sugerido: ' + eq.fg.toLocaleString('es-AR') + ' fg (' + eq.btu.toLocaleString('es-AR') + ' BTU)\n\n' +
        'Quiero un presupuesto.';
      calcWa.href = WA + '?text=' + encodeURIComponent(msg);
    }

    function pintar() {
      var t = (m2 - MIN) / (MAX - MIN);
      // por style, no por atributo: la regla CSS le gana al presentation attribute
      prog.style.strokeDasharray = (C * SPAN / 360 * t) + ' ' + C;
      var ang = (START + t * SPAN) * Math.PI / 180;
      knob.style.left = (50 + Math.cos(ang) * 40) + '%';
      knob.style.top = (50 + Math.sin(ang) * 40) + '%';
      out.textContent = m2;
      dial.setAttribute('aria-valuenow', m2);
      dial.setAttribute('aria-valuetext', m2 + ' metros cuadrados');
      calcular();
    }

    function setM2(v) {
      m2 = Math.max(MIN, Math.min(MAX, Math.round(v)));
      pintar();
    }

    // arrastre
    var dragging = false;
    function angleToM2(ev) {
      var r = dial.getBoundingClientRect();
      var dx = ev.clientX - (r.left + r.width / 2);
      var dy = ev.clientY - (r.top + r.height / 2);
      var a = Math.atan2(dy, dx) * 180 / Math.PI;      // 0° = 3 en punto, positivo hacia abajo
      var rel = (a - START + 360) % 360;                // 0..360 desde el inicio del arco
      if (rel > SPAN) rel = (rel - SPAN < (360 - rel)) ? SPAN : 0;  // hueco inferior -> extremo más cercano
      setM2(MIN + (rel / SPAN) * (MAX - MIN));
    }
    dial.addEventListener('pointerdown', function (e) {
      dragging = true;
      dial.setPointerCapture(e.pointerId);
      angleToM2(e);
    });
    dial.addEventListener('pointermove', function (e) { if (dragging) angleToM2(e); });
    dial.addEventListener('pointerup', function () { dragging = false; });
    dial.addEventListener('pointercancel', function () { dragging = false; });

    dial.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowUp') { setM2(m2 + 1); e.preventDefault(); }
      if (k === 'ArrowLeft' || k === 'ArrowDown') { setM2(m2 - 1); e.preventDefault(); }
      if (k === 'PageUp') { setM2(m2 + 5); e.preventDefault(); }
      if (k === 'PageDown') { setM2(m2 - 5); e.preventDefault(); }
      if (k === 'Home') { setM2(MIN); e.preventDefault(); }
      if (k === 'End') { setM2(MAX); e.preventDefault(); }
    });

    Array.prototype.forEach.call(document.querySelectorAll('.stepper'), function (b) {
      b.addEventListener('click', function () { setM2(m2 + parseInt(b.dataset.step, 10)); });
    });
    Object.keys(opts).forEach(function (k) { opts[k].addEventListener('change', calcular); });

    pintar();
  }

  /* ---------- 5. año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
