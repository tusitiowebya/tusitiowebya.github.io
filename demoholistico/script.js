/* ===========================================================
   Poder Holístico — TuPaginaYa
   =========================================================== */
(function () {
  'use strict';

  var WA = 'https://wa.me/message/HYFVRISLPN72P1';

  /* ---------- año ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('solid', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- marquee ---------- */
  var items = [
    'Péndulo hebreo', 'Karnak', 'Reiki', 'Talleres',
    'Limpieza de hogares y negocios', 'Velas aromáticas',
    'Difusores', 'Home spray', 'Souvenirs personalizados', 'Hacemos envíos'
  ];
  var row = document.getElementById('marqueeRow');
  if (row) {
    var html = items.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    row.innerHTML = html + html;
  }

  /* ---------- reveal ---------- */
  var QA = /(\?|&)qa/.test(location.search);
  var targets = document.querySelectorAll(
    '.sechead, .ter, .sanar__pic, .sanar__txt, .tal, .prod, .prods__foot, ' +
    '.revender__txt, .revender__pic, .pasos, .faq, .contacto__head, .cc, .regalo, .check'
  );
  if (QA) {
    /* modo QA: sin reveals, para capturar la pagina entera */
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          var el = en.target;
          setTimeout(function () { el.classList.add('in'); }, (i % 4) * 90);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { t.classList.add('rv'); io.observe(t); });
  }

  /* ===========================================================
     CHEQUEO DE ENERGÍA
     Las 8 señales son las que ella misma enumera en sus reels.
     =========================================================== */
  var SIGNALS = [
    { t: 'Te sentís agotada por más que descanses', g: 'cuerpo' },
    { t: 'Todo te irrita o te molesta', g: 'emocion' },
    { t: 'Sentís el ambiente pesado en tu casa o tu negocio', g: 'espacio' },
    { t: 'No dormís lo suficiente o tenés pesadillas', g: 'cuerpo' },
    { t: 'Te cuesta poner límites y decir que no', g: 'raiz' },
    { t: 'Vivís con ansiedad o el pecho apretado', g: 'emocion' },
    { t: 'Te hiciste una limpieza y volviste a sentirte igual', g: 'raiz' },
    { t: 'Se te repiten siempre las mismas situaciones', g: 'raiz' }
  ];

  var list = document.getElementById('checkList');
  var meterFg = document.getElementById('meterFg');
  var meterNum = document.getElementById('meterNum');
  var verdict = document.getElementById('verdict');
  var rec = document.getElementById('rec');
  var waBtn = document.getElementById('checkWa');
  var CIRC = 2 * Math.PI * 66;

  if (list) {
    SIGNALS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sig';
      b.setAttribute('aria-pressed', 'false');
      b.dataset.i = i;
      b.textContent = s.t;
      list.appendChild(b);
    });

    list.addEventListener('click', function (e) {
      var b = e.target.closest('.sig');
      if (!b) return;
      var on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      update();
    });
  }

  function update() {
    var picked = [].slice.call(list.querySelectorAll('.sig[aria-pressed="true"]'))
      .map(function (b) { return SIGNALS[+b.dataset.i]; });
    var n = picked.length;

    meterNum.textContent = n;
    meterFg.style.strokeDashoffset = String(CIRC - (CIRC * n / SIGNALS.length));
    meterFg.style.stroke = n >= 5 ? '#E0805F' : n >= 3 ? '#E0A244' : '#8B9A76';

    var groups = {};
    picked.forEach(function (p) { groups[p.g] = (groups[p.g] || 0) + 1; });

    var titulo, sug;
    if (n === 0) {
      titulo = 'Tocá las señales que sentís y te digo por dónde empezaría.';
      sug = '';
    } else if (n <= 2) {
      titulo = 'Estás cansada, pero todavía a tiempo.';
      sug = 'Arrancaría con una sesión de Reiki para bajar un cambio, más un home spray o un sahumado para tu espacio.';
    } else if (n <= 4) {
      titulo = 'Hay carga acumulada.';
      sug = 'Te propongo una limpieza energética con péndulo hebreo y cierre con karnak, y después vemos si conviene sostener con Reiki.';
    } else {
      titulo = 'Esto pide un trabajo profundo.';
      sug = 'Péndulo hebreo + karnak para descargar, Reiki para acompañar el proceso y, si hace falta, armonizar también tu casa o tu negocio.';
    }
    if (groups.raiz >= 2 && n >= 3) {
      sug += ' Como aparecen cosas que se repiten, además trabajamos el origen: qué hay detrás de lo que estás viviendo.';
    }
    if (groups.espacio) {
      sug += ' Tu espacio también entra en el trabajo.';
    }

    verdict.textContent = titulo;
    rec.hidden = !sug;
    rec.textContent = sug;

    var msg = n === 0
      ? 'Hola! Vengo de la web y quiero hacerte una consulta.'
      : 'Hola! Hice el chequeo de energía en tu web y marqué ' + n + ' de 8 señales:\n\n' +
        picked.map(function (p) { return '• ' + p.t; }).join('\n') +
        '\n\n¿Por dónde me recomendás empezar?';
    waBtn.href = WA + '?text=' + encodeURIComponent(msg);
    waBtn.textContent = n === 0 ? 'Escribirme por WhatsApp' : 'Mandarme estas ' + n + ' señales por WhatsApp';
  }

  if (list) update();

  /* ---------- videos: pausar los que no se ven ---------- */
  var vids = document.querySelectorAll('video');
  if ('IntersectionObserver' in window && vids.length) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.2 });
    vids.forEach(function (v) { vio.observe(v); });
  }
})();
