/* =========================================================
   SC ESTUDIO — script.js
   ========================================================= */
(function () {
  'use strict';

  var LITE = document.documentElement.classList.contains('lite');
  var WA = '5491125508221';

  /* ---------------------------------------------------------
     Hero: el video solo se pide si NO estamos en modo LITE
     (en LITE queda el poster.jpg y no se descarga el mp4)
     --------------------------------------------------------- */
  var video = document.querySelector('.hero__video');
  if (video && !LITE) {
    var src = video.getAttribute('data-src');
    if (src) {
      video.setAttribute('src', src);
      video.setAttribute('preload', 'auto');
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: queda el poster */ });
    }
  }

  /* ---------------------------------------------------------
     Nav
     --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  document.querySelectorAll('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     Reveal al scrollear
     --------------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !LITE) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, (i % 6) * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     Separador "mecha": onda que se va planchando hacia la derecha
     --------------------------------------------------------- */
  var mecha = document.getElementById('mechaPath');
  if (mecha) {
    var d = '';
    for (var x = 0; x <= 1200; x += 8) {
      var t = x / 1200;
      var amp = 15 * (1 - t) * (1 - t);
      var y = 30 + Math.sin(x / 46) * amp;
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(2) + ' ';
    }
    mecha.setAttribute('d', d.trim());
  }

  /* =========================================================
     SIGNATURE — simulador de alisado
     ========================================================= */
  var svgGroup = document.getElementById('strandGroup');
  if (!svgGroup) return;

  var TRAT = {
    progresivo: {
      nombre: 'Alisado progresivo',
      lvl: 86,
      desc: 'Baja el frizz y el volumen sin sacarte el movimiento. El pelo queda liviano y con caída natural.',
      dur: '3 a 4 meses',
      min: 150,
      mant: 'Shampoo sin sal SC'
    },
    organico: {
      nombre: 'Alisado orgánico',
      lvl: 97,
      desc: 'Lacio marcado y brillo espejo. Sella la cutícula, así que el resultado se sostiene varios meses.',
      dur: '4 a 5 meses',
      min: 185,
      mant: 'Shampoo sin sal + máscara SC'
    },
    botox: {
      nombre: 'Nutrición / botox capilar',
      lvl: 58,
      desc: 'No alisa: hidrata en profundidad. Le devuelve peso, suavidad y brillo al pelo poroso o sin cuerpo.',
      dur: '2 meses aprox.',
      min: 85,
      mant: 'Máscara SC cada 7 días'
    },
    recon: {
      nombre: 'Reconstrucción capilar',
      lvl: 36,
      desc: 'Para pelo quebrado, decolorado o con puntas abiertas. Repone masa desde adentro: se hace antes de cualquier alisado.',
      dur: 'Se suma sesión a sesión',
      min: 75,
      mant: 'Máscara + sérum SC'
    }
  };

  var LARGO = {
    corto: { nombre: 'Corto', f: 0.8 },
    medio: { nombre: 'Media melena', f: 1 },
    largo: { nombre: 'Largo', f: 1.35 }
  };

  var state = { t: 'progresivo', largo: 'medio', lvl: 86 };

  /* --- generación de las mechas (SVG) --- */
  var N = 54;
  var seeds = [];
  for (var i = 0; i < N; i++) {
    seeds.push({
      phase: Math.random() * Math.PI * 2,
      wl: 52 + Math.random() * 46,
      k: 0.55 + Math.random() * 0.9,
      len: 0.82 + Math.random() * 0.18,
      spread: (i - (N - 1) / 2) / ((N - 1) / 2)
    });
  }

  var paths = [];
  for (var j = 0; j < N; j++) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', 'url(#gHair)');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-width', (1 + Math.random() * 2.4).toFixed(2));
    el.setAttribute('opacity', (0.55 + Math.random() * 0.45).toFixed(2));
    svgGroup.appendChild(el);
    paths.push(el);
  }

  var gloss = document.getElementById('glossBar');

  function drawStrands(lvl) {
    var l = lvl / 100;
    var frizz = 1 - l;

    for (var i = 0; i < N; i++) {
      var s = seeds[i];
      var x0 = 210 + s.spread * 60 + (Math.sin(s.phase) * 4);
      var xEnd = 210 + s.spread * (72 + frizz * 92);
      var amp = frizz * 24 * s.k;
      var d = '';

      var yMax = 6 + 452 * s.len;
      for (var y = 6; y <= yMax; y += 11) {
        var t = (y - 6) / 452;
        var ease = t * t;                              // el frizz crece hacia las puntas
        var x = x0 + (xEnd - x0) * ease
              + Math.sin(y / s.wl + s.phase) * amp * ease
              + Math.sin(y / (s.wl * 2.7) + s.phase) * amp * 0.45 * ease;
        d += (y === 6 ? 'M' : 'L') + x.toFixed(1) + ' ' + y + ' ';
      }
      paths[i].setAttribute('d', d.trim());
    }

    if (gloss) gloss.setAttribute('opacity', (0.08 + l * 0.55).toFixed(2));
  }

  /* --- animación suave del nivel al cambiar de tratamiento --- */
  var anim = null;
  function animateTo(target) {
    if (anim) cancelAnimationFrame(anim);
    if (LITE) { setLvl(target); return; }
    var from = state.lvl;
    var t0 = performance.now();
    var dur = 620;

    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      setLvl(Math.round(from + (target - from) * e));
      if (p < 1) anim = requestAnimationFrame(step);
    })(t0);
  }

  var slider = document.getElementById('lvl');
  var out = document.getElementById('lvlOut');

  function setLvl(v) {
    state.lvl = v;
    slider.value = v;
    slider.style.setProperty('--fill', v + '%');
    out.textContent = v + '%';
    drawStrands(v);
    updateWa();
  }

  /* --- ficha de salida --- */
  function fmtMin(m) {
    var h = Math.floor(m / 60), mm = Math.round((m % 60) / 5) * 5;
    if (mm === 60) { h++; mm = 0; }
    return h + ' h' + (mm ? ' ' + (mm < 10 ? '0' : '') + mm : '');
  }

  function renderFicha() {
    var t = TRAT[state.t];
    document.getElementById('simTitle').textContent = t.nombre;
    document.getElementById('simDesc').textContent = t.desc;
    document.getElementById('simDur').textContent = t.dur;
    document.getElementById('simTime').textContent = fmtMin(t.min * LARGO[state.largo].f);
    document.getElementById('simMant').textContent = t.mant;
    updateWa();
  }

  var waBtn = document.getElementById('simWa');
  function updateWa() {
    var t = TRAT[state.t];
    var msg =
      'Hola SC Estudio! Vengo de la web.\n' +
      '• Tratamiento: ' + t.nombre + '\n' +
      '• Largo de pelo: ' + LARGO[state.largo].nombre + '\n' +
      '• Nivel de lacio que busco: ' + state.lvl + '%\n' +
      'Te mando una foto para el diagnóstico. ¿Cómo estás de turnos?';
    waBtn.setAttribute('href', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg));
  }

  /* --- eventos --- */
  slider.addEventListener('input', function () {
    if (anim) cancelAnimationFrame(anim);
    setLvl(parseInt(slider.value, 10));
  });

  document.querySelectorAll('.sim__tabs .chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.sim__tabs .chip').forEach(function (b) {
        b.classList.remove('is-on');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-on');
      btn.setAttribute('aria-selected', 'true');
      state.t = btn.getAttribute('data-t');
      renderFicha();
      animateTo(TRAT[state.t].lvl);
    });
  });

  document.querySelectorAll('#largo .seg').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#largo .seg').forEach(function (b) { b.classList.remove('is-on'); });
      btn.classList.add('is-on');
      state.largo = btn.getAttribute('data-l');
      renderFicha();
    });
  });

  /* --- arranque: recorre de frizz a lacio al entrar en viewport --- */
  setLvl(6);
  renderFicha();

  var stage = document.querySelector('.sim__stage');
  if ('IntersectionObserver' in window && !LITE) {
    var io2 = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        animateTo(TRAT[state.t].lvl);
        io2.disconnect();
      }
    }, { threshold: 0.3 });
    io2.observe(stage);
  } else {
    setLvl(TRAT[state.t].lvl);
  }

  /* ---------------------------------------------------------
     Watchdog de FPS: si el equipo no da, pasa a LITE en caliente
     --------------------------------------------------------- */
  if (!LITE && !/[?&]full\b/.test(location.search)) {
    var frames = 0, start = performance.now();
    var tick = function (now) {
      frames++;
      if (now - start < 2000) { requestAnimationFrame(tick); return; }
      var fps = frames / ((now - start) / 1000);
      if (fps < 28) {
        document.documentElement.classList.add('lite');
        try { sessionStorage.setItem('sc_lite', '1'); } catch (e) {}
      }
    };
    requestAnimationFrame(tick);
  }
})();
