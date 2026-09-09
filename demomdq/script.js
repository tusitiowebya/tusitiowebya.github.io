/* ============================================================
   MDQ Alquileres Vacacionales — script.js
   ============================================================ */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var LITE = root.classList.contains('lite');
  var QA = root.classList.contains('qa');

  /* ---------- año ---------- */
  var anio = d.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- video del hero (en LITE ni se pide) ---------- */
  var hv = d.getElementById('heroVideo');
  if (hv && !LITE) {
    var src = hv.getAttribute('data-src');
    if (src) { hv.src = src; var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
  }

  /* ---------- nav ---------- */
  var nav = d.getElementById('nav');
  var burger = d.getElementById('burger');
  function onScroll() {
    if (nav) nav.classList.toggle('solid', window.scrollY > 60);
    if (!LITE) parallax();
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- parallax de las crestas del hero ---------- */
  var ridges = [].slice.call(d.querySelectorAll('.ridges .ridge'));
  var factors = [0.24, 0.14, 0.06];
  function parallax() {
    var y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    ridges.forEach(function (r, i) {
      r.style.transform = 'translate3d(0,' + (y * factors[i]) + 'px,0)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveals ---------- */
  var targets = d.querySelectorAll('.sec-head, .fig, .cpx, .cerca-card, .pasos li, .faq details, .cta-inner, .dia-box, .g');
  if (!LITE && !QA && 'IntersectionObserver' in window) {
    targets.forEach(function (el, i) { el.classList.add('rv'); el.style.transitionDelay = (i % 5) * 70 + 'ms'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- contadores ---------- */
  var counters = d.querySelectorAll('.count');
  function runCount(el) {
    var to = +el.getAttribute('data-to');
    if (LITE || QA) { el.textContent = to; return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 900, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io2.observe(c); });
  } else {
    counters.forEach(runCount);
  }

  /* ============================================================
     SIGNATURE — "El día en la sierra"
     ============================================================ */
  var scene = d.getElementById('scene');
  var hora = d.getElementById('hora');
  if (scene && hora) {
    var skyA = d.getElementById('skyA'), skyB = d.getElementById('skyB'), skyC = d.getElementById('skyC');
    var sun = d.getElementById('sun'), glowC = d.getElementById('glowC');
    var starsG = d.getElementById('stars'), grassG = d.getElementById('grass');
    var win = d.getElementById('win');
    var ridgeEls = ['ridgeD', 'ridgeC', 'ridgeB', 'ridgeA'].map(function (id) { return d.getElementById(id); });
    var horaTxt = d.getElementById('horaTxt'), momento = d.getElementById('momentoTxt');
    var momentoSub = d.getElementById('momentoSub'), momentoTxt2 = d.getElementById('momentoTxt2');
    var recTxt = d.getElementById('recTxt'), diaWa = d.getElementById('diaWa');
    var NS = 'http://www.w3.org/2000/svg';

    /* estrellas */
    var starData = [];
    for (var i = 0; i < 80; i++) {
      var c = d.createElementNS(NS, 'circle');
      var sx = Math.random() * 1000, sy = Math.random() * 230;
      c.setAttribute('cx', sx.toFixed(1));
      c.setAttribute('cy', sy.toFixed(1));
      c.setAttribute('r', (Math.random() * 1.5 + 0.5).toFixed(2));
      c.setAttribute('fill', '#FFF8E0');
      c.setAttribute('opacity', (0.35 + Math.random() * 0.65).toFixed(2));
      starsG.appendChild(c);
      starData.push(c);
    }
    /* pastizal del primer plano */
    for (var j = 0; j < 90; j++) {
      var gx = Math.random() * 1000;
      var gh = 14 + Math.random() * 26;
      var pth = d.createElementNS(NS, 'path');
      pth.setAttribute('d', 'M' + gx.toFixed(1) + ' 470 q ' + (Math.random() * 10 - 5).toFixed(1) + ' -' + (gh / 2).toFixed(1) + ' ' + (Math.random() * 14 - 7).toFixed(1) + ' -' + gh.toFixed(1));
      pth.setAttribute('stroke', '#0E1D15');
      pth.setAttribute('stroke-width', (0.9 + Math.random()).toFixed(1));
      pth.setAttribute('fill', 'none');
      pth.setAttribute('stroke-linecap', 'round');
      grassG.appendChild(pth);
    }

    /* paleta del cielo por hora */
    var SKY = [
      { h: 5.0,  a: '#070f24', b: '#1b2a4e', c: '#4b3a5e' },
      { h: 6.6,  a: '#123058', b: '#6b6f9c', c: '#F0A56B' },
      { h: 8.2,  a: '#2c6ba6', b: '#87b4d2', c: '#DCE8DC' },
      { h: 12.5, a: '#2680c7', b: '#93c4e0', c: '#EAF1E7' },
      { h: 16.5, a: '#3787bb', b: '#AFC5C7', c: '#F3DCA8' },
      { h: 19.0, a: '#2b3f75', b: '#D1653F', c: '#F7B85C' },
      { h: 20.4, a: '#15214a', b: '#6d3f66', c: '#C9563A' },
      { h: 21.6, a: '#06122a', b: '#0d1b3a', c: '#1d2d50' },
      { h: 23.0, a: '#040b1c', b: '#071229', c: '#0e1a33' }
    ];
    function hex2rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
    function mix(h1, h2, k) {
      var A = hex2rgb(h1), B = hex2rgb(h2);
      return 'rgb(' + A.map(function (v, i2) { return Math.round(v + (B[i2] - v) * k); }).join(',') + ')';
    }
    function skyAt(h) {
      var i2 = 0;
      while (i2 < SKY.length - 2 && h > SKY[i2 + 1].h) i2++;
      var s0 = SKY[i2], s1 = SKY[i2 + 1];
      var k = Math.max(0, Math.min(1, (h - s0.h) / (s1.h - s0.h)));
      return { a: mix(s0.a, s1.a, k), b: mix(s0.b, s1.b, k), c: mix(s0.c, s1.c, k) };
    }

    /* momentos del día */
    var MOMENTOS = [
      { max: 6.5,  n: 'Antes del amanecer', s: 'Todavía se ven las estrellas',
        t: 'La sierra está negra y el aire corta. Es la hora de los que salen a caminar temprano y vuelven con la niebla pegada al buzo.',
        r: 'Refugio del Atardecer · Piscu Yaco', w: 'Quiero madrugar en la sierra' },
      { max: 9.5,  n: 'El verde', s: 'Vegetación, naturaleza y montaña',
        t: 'La niebla sigue abajo en el valle y el pasto está mojado. Mate en la galería, los chicos ya afuera y nadie con apuro de nada.',
        r: 'Complejo E.Dén · Villa Larca', w: 'Quiero mañanas tranquilas en familia' },
      { max: 13.0, n: 'Media mañana', s: 'La hora de moverse',
        t: 'Es cuando conviene salir: senderos cortos, arroyos, la feria de Merlo o una cabalgata antes de que apriete el sol.',
        r: 'Cualquiera de los tres · a minutos de Merlo', w: 'Quiero una escapada con salidas y actividades' },
      { max: 15.5, n: 'El amarillo', s: 'Riqueza de la tierra, sol y oro',
        t: 'Pleno sol, chicharras y siesta serrana. Sombra, agua fría y silencio. Acá no se hace nada y está perfecto.',
        r: 'Om Shanti · Villa Larca', w: 'Quiero silencio y privacidad' },
      { max: 18.0, n: 'Se afloja', s: 'La luz se pone dorada',
        t: 'Baja el sol, se levanta viento fresco y el cerro se pone naranja. Hora de prender el fuego con tiempo.',
        r: 'Complejo E.Dén · Villa Larca', w: 'Quiero cabaña con parrilla y fogón' },
      { max: 20.3, n: 'El rojo', s: 'Sangre y libertad',
        t: 'El momento por el que la gente vuelve. El sol se va detrás del cordón y todo el valle queda encendido durante veinte minutos.',
        r: 'Refugio del Atardecer · Piscu Yaco', w: 'Quiero la cabaña del atardecer' },
      { max: 24.0, n: 'Noche cerrada', s: 'Cielo sin luces alrededor',
        t: 'Fuego, guitarra si hay, y arriba la Vía Láctea a ojo pelado. En Piscu Yaco casi no hay luz artificial que moleste.',
        r: 'Refugio del Atardecer · Piscu Yaco', w: 'Quiero noches de fogón y estrellas' }
    ];
    function momentoAt(h) {
      for (var i3 = 0; i3 < MOMENTOS.length; i3++) if (h < MOMENTOS[i3].max) return MOMENTOS[i3];
      return MOMENTOS[MOMENTOS.length - 1];
    }

    var moon = null;
    var lastM = null;

    function render(h) {
      var s = skyAt(h);
      skyA.setAttribute('stop-color', s.a);
      skyB.setAttribute('stop-color', s.b);
      skyC.setAttribute('stop-color', s.c);

      /* sol sobre el arco */
      var t = (h - 5.6) / (20.4 - 5.6);
      var visible = t > 0 && t < 1;
      var x = 40 + t * 920;
      var y = 358 - 296 * Math.sin(Math.PI * Math.max(0, Math.min(1, t)));
      sun.setAttribute('cx', x.toFixed(1));
      sun.setAttribute('cy', y.toFixed(1));
      glowC.setAttribute('cx', x.toFixed(1));
      glowC.setAttribute('cy', y.toFixed(1));
      var bajo = Math.max(0, 1 - Math.sin(Math.PI * Math.max(0, Math.min(1, t))) * 1.4); /* 0 alto, 1 en el horizonte */
      sun.setAttribute('fill', mix('#FFE9A8', '#F0562C', bajo));
      sun.setAttribute('r', (24 + bajo * 12).toFixed(1));
      sun.setAttribute('opacity', visible ? 1 : 0);
      glowC.setAttribute('opacity', visible ? (0.55 + bajo * 0.45) : 0);
      glowC.setAttribute('r', (130 + bajo * 90).toFixed(0));

      /* luna cuando el sol ya se fue */
      if (!visible && h > 20) {
        if (!moon) {
          moon = d.createElementNS(NS, 'circle');
          moon.setAttribute('r', '15');
          moon.setAttribute('fill', '#EFEAD6');
          moon.setAttribute('opacity', '0');
          starsG.parentNode.insertBefore(moon, starsG.nextSibling);
        }
        var mt = Math.min(1, (h - 20.4) / 3);
        moon.setAttribute('cx', (140 + mt * 260).toFixed(0));
        moon.setAttribute('cy', (200 - mt * 90).toFixed(0));
        moon.setAttribute('opacity', mt.toFixed(2));
      } else if (moon) {
        moon.setAttribute('opacity', '0');
      }

      /* oscuridad general 0 (día) → 1 (noche) */
      var luz = Math.max(0, Math.min(1, Math.sin(Math.PI * Math.max(0, Math.min(1, t))) * 1.35));
      var dark = 1 - luz;
      starsG.setAttribute('opacity', Math.max(0, (dark - 0.55) / 0.45).toFixed(2));

      /* las crestas se apagan y se tiñen de rojo al atardecer */
      var calor = (h > 17.4 && h < 20.6) ? Math.max(0, 1 - Math.abs(h - 19.3) / 1.4) : 0;
      var base = ['#3a5c50', '#315143', '#263d32', '#1a2b22'];
      var noche = ['#16283a', '#101f2c', '#0b1720', '#060f16'];
      var fuego = ['#7a4436', '#5e3229', '#43241e', '#2a1613'];
      ridgeEls.forEach(function (el, i4) {
        var col = mix(noche[i4], base[i4], luz);
        if (calor > 0) col = mix(col, fuego[i4], calor * 0.8);
        el.setAttribute('fill', col);
      });

      /* ventana encendida de noche */
      var encendida = dark > 0.45 ? Math.min(1, (dark - 0.45) / 0.3) : 0;
      win.setAttribute('fill', mix('#2a2a24', '#FFC65C', encendida));

      /* panel */
      var hh = Math.floor(h), mm = (h - hh) >= 0.5 ? '30' : '00';
      horaTxt.textContent = (hh < 10 ? '0' : '') + hh + ':' + mm;
      var m = momentoAt(h);
      if (m !== lastM) {
        lastM = m;
        momento.textContent = m.n;
        momentoSub.textContent = m.s;
        momentoTxt2.textContent = m.t;
        recTxt.textContent = m.r;
        diaWa.href = 'https://wa.me/5491135245932?text=' + encodeURIComponent('Hola MDQ! ' + m.w + '. ¿Qué disponibilidad tienen?');
      }
    }

    var tocado = false;
    hora.addEventListener('input', function () { tocado = true; render(+hora.value); });
    render(+hora.value);

    /* auto-demo al entrar en viewport: recorre el día una vez */
    if (!LITE && !QA && 'IntersectionObserver' in window) {
      var demoIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          demoIO.disconnect();
          var v = 7, id = setInterval(function () {
            if (tocado) { clearInterval(id); return; }
            v += 0.5;
            if (v > 21.5) { clearInterval(id); return; }
            hora.value = v;
            render(v);
          }, 90);
        });
      }, { threshold: 0.45 });
      demoIO.observe(scene);
    }
  }

  /* ---------- watchdog de FPS: si va lento, degrada a LITE ---------- */
  if (!LITE && !QA && window.requestAnimationFrame) {
    var frames = 0, start = performance.now();
    function tick(now) {
      frames++;
      if (now - start < 2000) { requestAnimationFrame(tick); return; }
      var fps = frames / ((now - start) / 1000);
      if (fps < 28) {
        root.classList.add('lite');
        try { sessionStorage.setItem('mdq_lite', '1'); } catch (e) {}
      }
    }
    requestAnimationFrame(tick);
  }
})();
