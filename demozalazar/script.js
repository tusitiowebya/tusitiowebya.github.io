/* ===========================================================
   Zalazar — Pulidos y Plastificados
   1) Nav / burger / dock / reveals
   2) Hero "el reflejo": carga diferida de los dos videos + sync
   3) Signature: La mesa de trabajo (piso dibujado en SVG)
   4) El corte: capas del piso, capa por capa
   =========================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var LITE = root.classList.contains('lite');
  var QA = root.classList.contains('qa');
  var WA = 'https://wa.me/5491151044405?text=';

  /* ---------------------------------------------------------
     1) Nav, burger, dock, año, reveals
     --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var dock = document.getElementById('dock');
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle('stuck', y > 40);
    if (dock && !QA) dock.classList.toggle('show', y > window.innerHeight * 0.75);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var navlinks = document.getElementById('navlinks');
  if (burger && navlinks) {
    burger.addEventListener('click', function () {
      var open = navlinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navlinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navlinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var yy = document.getElementById('yy');
  if (yy) yy.textContent = new Date().getFullYear();

  var reveals = document.querySelectorAll('.reveal');
  if (!LITE && !QA && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add('in'); }, i * 90);
          ro.unobserve(el);
        }
      });
    }, { threshold: 0.16 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------
     1b) El reflejo del copy: clon espejado del bloque del hero
     --------------------------------------------------------- */
  var heroCopy = document.querySelector('.hero-copy');
  var floorCopy = document.getElementById('floorCopy');
  if (heroCopy && floorCopy) {
    var clon = heroCopy.cloneNode(true);
    clon.removeAttribute('id');
    clon.setAttribute('aria-hidden', 'true');
    clon.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    clon.querySelectorAll('a,button,input').forEach(function (n) { n.setAttribute('tabindex', '-1'); });
    floorCopy.appendChild(clon);

    var medir = function () { floorCopy.style.height = heroCopy.offsetHeight + 'px'; };
    medir();
    window.addEventListener('resize', medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
    setTimeout(medir, 600);
  }

  /* ---------------------------------------------------------
     2) Hero: los dos videos (imagen + reflejo) en sync
     --------------------------------------------------------- */
  var vidA = document.getElementById('vidA');
  var vidB = document.getElementById('vidB');
  if (!LITE && vidA && vidB) {
    [vidA, vidB].forEach(function (v) {
      v.src = v.getAttribute('data-src');
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
    // el reflejo sigue al video de arriba
    vidA.addEventListener('timeupdate', function () {
      if (Math.abs(vidB.currentTime - vidA.currentTime) > 0.25) {
        try { vidB.currentTime = vidA.currentTime; } catch (e) {}
      }
    });
    // watchdog de FPS: si el equipo no da, pasa a LITE
    if (!QA) {
      var frames = 0, t0 = performance.now();
      var tick = function (t) {
        frames++;
        if (t - t0 < 2600) { requestAnimationFrame(tick); return; }
        var fps = frames / ((t - t0) / 1000);
        if (fps < 28) {
          root.classList.add('lite');
          try { sessionStorage.setItem('zz-lite', '1'); } catch (e) {}
        }
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------------------------------------------------------
     3) LA MESA DE TRABAJO
     --------------------------------------------------------- */
  var svgNS = 'http://www.w3.org/2000/svg';
  var piso = document.getElementById('piso');
  var specsEl = document.getElementById('specs');
  var notaEl = document.getElementById('pisoNota');
  var m2El = document.getElementById('m2');
  var m2Out = document.getElementById('m2out');
  var mesaWa = document.getElementById('mesaWa');

  var ctlTerm = document.getElementById('ctlTerm');
  var lblM2 = document.getElementById('lblM2');

  var state = { piso: 'tablas', patron: 'listones', tono: 'claro', term: 'brillante', m2: 45 };

  // tonos: mismos para vinilico y madera, el vinilico es simil madera
  var TONOS = {
    claro:   ['#C6A57C', '#BB9A70', '#D0B089', '#B49267', '#C9A87F'],
    natural: ['#96633A', '#8C5B33', '#A06E42', '#84532D', '#9A6739'],
    nogal:   ['#5E3A22', '#54331D', '#6A4429', '#4C2D19', '#603C24'],
    grafito: ['#5A5F66', '#52575E', '#646A72', '#4A4F56', '#5D6269']
  };

  var NOMBRES = {
    tablas: 'vinílico en tablas', rollo: 'vinílico en rollo',
    parquet: 'parquet', tablado: 'tablado / pinotea',
    espiga: 'espiga', damero: 'damero', listones: 'listones rectos',
    claro: 'roble claro', natural: 'natural', nogal: 'nogal', grafito: 'grafito',
    brillante: 'plastificado brillante', satinado: 'plastificado semi mate', hidro: 'hidrolaqueado mate'
  };

  var GLOSS = { brillante: 1, satinado: 0.5, hidro: 0.2 };

  function esVinilico() { return state.piso === 'tablas' || state.piso === 'rollo'; }
  function nivelBrillo() { return esVinilico() ? 0.55 : GLOSS[state.term]; }

  function el(tag, attrs) {
    var n = document.createElementNS(svgNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function tono(pal, i) { return pal[(i % pal.length + pal.length) % pal.length]; }

  /* --- patrones --- */
  function espiga(g, pal) {
    var W = 600, H = 380, col = 74, T = 26, c = 0;
    for (var x = -col; x < W + col; x += col, c++) {
      var up = c % 2 === 0;
      for (var y = -col; y < H + col + T; y += T) {
        var p;
        if (up) p = [[x, y], [x + col, y - col], [x + col, y - col + T], [x, y + T]];
        else    p = [[x, y - col], [x + col, y], [x + col, y + T], [x, y - col + T]];
        g.appendChild(el('polygon', {
          points: p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '),
          fill: tono(pal, (c * 3 + Math.round(y / T)) % pal.length),
          stroke: 'rgba(30,16,6,.45)', 'stroke-width': 1
        }));
      }
    }
  }

  function damero(g, pal) {
    var S = 66, i = 0;
    for (var y = 0; y < 380; y += S) {
      for (var x = 0; x < 600; x += S, i++) {
        var vert = (Math.floor(x / S) + Math.floor(y / S)) % 2 === 0;
        var n = 4, s = S / n;
        for (var k = 0; k < n; k++) {
          g.appendChild(el('rect', {
            x: vert ? x + k * s : x,
            y: vert ? y : y + k * s,
            width: vert ? s : S,
            height: vert ? S : s,
            fill: tono(pal, i + k),
            stroke: 'rgba(30,16,6,.4)', 'stroke-width': 1
          }));
        }
        g.appendChild(el('rect', { x: x, y: y, width: S, height: S, fill: 'none', stroke: 'rgba(30,16,6,.6)', 'stroke-width': 1.4 }));
      }
    }
  }

  function listones(g, pal) {
    var h = 32, r = 0;
    for (var y = -h; y < 380 + h; y += h, r++) {
      var off = (r % 3) * 62;
      for (var x = -180 + off; x < 600 + 180; x += 178) {
        var w = 178 - 2;
        g.appendChild(el('rect', {
          x: x, y: y, width: w, height: h - 2, rx: 1,
          fill: tono(pal, r * 2 + Math.round(x / 90)),
          stroke: 'rgba(30,16,6,.42)', 'stroke-width': 1
        }));
        // veta
        g.appendChild(el('path', {
          d: 'M' + (x + 12) + ' ' + (y + h * 0.42) + ' q ' + (w * 0.4) + ' -5 ' + (w * 0.8) + ' 2',
          fill: 'none', stroke: 'rgba(40,20,8,.22)', 'stroke-width': 1.2
        }));
      }
    }
  }

  function escaleraNoUsada(g, pal) {
    // escalera en perspectiva simple: 6 escalones
    var pasos = 6, baseY = 360, h = 42, prof = 26, x0 = 70, w0 = 470;
    for (var i = 0; i < pasos; i++) {
      var y = baseY - i * h;
      var inset = i * 14;
      var x = x0 + inset, w = w0 - inset * 2;
      // pedada (horizontal)
      g.appendChild(el('polygon', {
        points: [
          [x, y], [x + w, y], [x + w - 16, y - prof], [x + 16, y - prof]
        ].map(function (q) { return q[0] + ',' + q[1]; }).join(' '),
        fill: tono(pal, i * 2), stroke: 'rgba(30,16,6,.5)', 'stroke-width': 1.2
      }));
      // alzada (vertical)
      g.appendChild(el('rect', {
        x: x + 16, y: y - prof - (h - prof), width: w - 32, height: h - prof,
        fill: tono(pal, i * 2 + 3), stroke: 'rgba(30,16,6,.5)', 'stroke-width': 1.2
      }));
    }
  }

  /* --- brillo / reflejo sobre el piso --- */
  function brillo(svg, g, nivel) {
    var defs = el('defs', {});
    var lg = el('linearGradient', { id: 'sheenG', x1: '0', y1: '0', x2: '1', y2: '1' });
    [['0%', 'rgba(255,248,232,0)'], ['45%', 'rgba(255,248,232,.85)'], ['55%', 'rgba(214,236,245,.7)'], ['100%', 'rgba(255,248,232,0)']]
      .forEach(function (s) { lg.appendChild(el('stop', { offset: s[0], 'stop-color': s[1] })); });
    var rg = el('radialGradient', { id: 'ambG', cx: '.5', cy: '.06', r: '.9' });
    [['0%', 'rgba(255,246,228,.65)'], ['60%', 'rgba(255,246,228,.12)'], ['100%', 'rgba(255,246,228,0)']]
      .forEach(function (s) { rg.appendChild(el('stop', { offset: s[0], 'stop-color': s[1] })); });
    var bl = el('filter', { id: 'blurF', x: '-30%', y: '-30%', width: '160%', height: '160%' });
    bl.appendChild(el('feGaussianBlur', { stdDeviation: nivel >= 1 ? 9 : (nivel >= 0.5 ? 18 : 30) }));
    defs.appendChild(lg); defs.appendChild(rg); defs.appendChild(bl);
    svg.appendChild(defs);

    // luz ambiente
    g.appendChild(el('rect', { x: 0, y: 0, width: 600, height: 380, fill: 'url(#ambG)', opacity: 0.14 + nivel * 0.20 }));

    // luces reflejadas: manchas suaves y alargadas (lo que hace ver el brillo)
    var ven = el('g', { opacity: nivel * 0.42, filter: 'url(#blurF)' });
    [[420, 96, 118, 34, -34], [312, 214, 88, 22, -34], [138, 128, 66, 16, -34]].forEach(function (l) {
      ven.appendChild(el('ellipse', {
        cx: l[0], cy: l[1], rx: l[2], ry: l[3],
        transform: 'rotate(' + l[4] + ' ' + l[0] + ' ' + l[1] + ')',
        fill: 'rgba(255,250,238,.85)'
      }));
    });
    g.appendChild(ven);

    // franja especular
    g.appendChild(el('polygon', {
      points: '0,380 240,0 350,0 60,380',
      fill: 'url(#sheenG)', opacity: nivel * 0.22
    }));
  }

  function dibujarPiso() {
    if (!piso) return;
    while (piso.firstChild) piso.removeChild(piso.firstChild);
    var pal = TONOS[state.tono];

    piso.appendChild(el('rect', { x: 0, y: 0, width: 600, height: 380, fill: '#20242E' }));

    var g = el('g', {});
    if (state.patron === 'espiga') espiga(g, pal);
    else if (state.patron === 'damero') damero(g, pal);
    else listones(g, pal);
    // el rollo es una sola pieza: se ve el dibujo pero casi sin juntas
    if (state.piso === 'rollo') {
      g.setAttribute('opacity', '.96');
      g.querySelectorAll('[stroke]').forEach(function (n) {
        if (n.getAttribute('stroke').indexOf('rgba(30,16,6') === 0) n.setAttribute('stroke', 'rgba(30,16,6,.08)');
      });
    }
    piso.appendChild(g);

    var gl = el('g', { 'pointer-events': 'none' });
    brillo(piso, gl, nivelBrillo());
    piso.appendChild(gl);

    piso.appendChild(el('rect', { x: 0.5, y: 0.5, width: 599, height: 379, fill: 'none', stroke: 'rgba(38,44,58,1)', 'stroke-width': 2 }));

    var term = esVinilico() ? NOMBRES[state.tono] : NOMBRES[state.term];
    if (notaEl) notaEl.textContent = NOMBRES[state.piso] + ' · ' + NOMBRES[state.patron] + ' · ' + term;
  }

  function dias() {
    var m = state.m2;
    if (esVinilico()) return m <= 45 ? 1 : 1 + Math.ceil((m - 45) / 60);
    var base = state.term === 'hidro' ? 2 : 3;
    return base + Math.ceil(Math.max(0, m - 40) / 45);
  }

  var PISABLE = {
    brillante: '24 h con medias · muebles a las 72 h',
    satinado: '24 h con medias · muebles a las 48 h',
    hidro: '4 a 6 h con medias · muebles al día siguiente'
  };
  var OLOR = { brillante: 'Fuerte los primeros días', satinado: 'Moderado', hidro: 'Casi nulo' };
  var BRILLO = { brillante: 'Alto (efecto espejo)', satinado: 'Medio, sin encandilar', hidro: 'Bajo, aspecto natural' };

  function pintarSpecs() {
    if (!specsEl) return;
    var filas;
    if (esVinilico()) {
      filas = [
        ['Trabajo', 'Colocación de <b>' + NOMBRES[state.piso] + '</b>'],
        ['Dibujo y tono', NOMBRES[state.patron] + ' en <b>' + NOMBRES[state.tono] + '</b>'],
        ['Se coloca sobre', 'Cerámico, calcáreo, carpeta o madera, si está firme y parejo'],
        ['En obra', '<b>' + dias() + (dias() === 1 ? ' día' : ' días') + '</b> aprox. para ' + state.m2 + ' m²'],
        ['Se puede pisar', 'Apenas terminamos'],
        ['Olor y polvo', 'Prácticamente nada'],
        ['Mantenimiento', 'Trapo apenas húmedo. Sin cera ni lavandina.']
      ];
    } else {
      filas = [
        ['Trabajo', 'Pulido de <b>' + NOMBRES[state.piso] + '</b> + ' + NOMBRES[state.term]],
        ['Dibujo y tono', NOMBRES[state.patron] + ' en <b>' + NOMBRES[state.tono] + '</b>'],
        ['Brillo final', BRILLO[state.term]],
        ['En obra', '<b>' + dias() + (dias() === 1 ? ' día' : ' días') + '</b> aprox. para ' + state.m2 + ' m²'],
        ['Se puede pisar', PISABLE[state.term]],
        ['Olor', OLOR[state.term]],
        ['Mantenimiento', 'Trapo apenas húmedo. Nunca cera ni lavandina.']
      ];
    }
    specsEl.innerHTML = filas.map(function (f) {
      return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>';
    }).join('');
  }

  function armarWa() {
    if (!mesaWa) return;
    var t = esVinilico()
      ? 'Hola Zalazar, quiero un presupuesto de ' + NOMBRES[state.piso] + ', dibujo ' + NOMBRES[state.patron] +
        ', tono ' + NOMBRES[state.tono] + ', aproximadamente ' + state.m2 + ' m².'
      : 'Hola Zalazar, quiero un presupuesto para pulir mi ' + NOMBRES[state.piso] + ' (' + NOMBRES[state.patron] +
        '), terminación ' + NOMBRES[state.term] + ', aproximadamente ' + state.m2 + ' m².';
    mesaWa.href = WA + encodeURIComponent(t);
  }

  function sincronizarControles() {
    var madera = !esVinilico();
    if (ctlTerm) ctlTerm.hidden = !madera;
    if (lblM2) lblM2.textContent = madera ? '5' : '4';
  }

  function actualizar() { sincronizarControles(); dibujarPiso(); pintarSpecs(); armarWa(); }

  document.querySelectorAll('.chips').forEach(function (grupo) {
    grupo.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      grupo.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      state[grupo.getAttribute('data-group')] = b.getAttribute('data-v');
      actualizar();
    });
  });

  if (m2El) {
    m2El.addEventListener('input', function () {
      state.m2 = parseInt(m2El.value, 10);
      if (m2Out) m2Out.textContent = state.m2 + ' m²';
      pintarSpecs(); armarWa();
    });
  }

  actualizar();

  /* ---------------------------------------------------------
     4) EL CORTE — capas del piso
     --------------------------------------------------------- */
  var cut = document.getElementById('cut');
  var capas = document.getElementById('capas');

  function dibujarCorte(k) {
    if (!cut) return;
    while (cut.firstChild) cut.removeChild(cut.firstChild);
    var X = 24, W = 196, baseY = 400;

    var defs = el('defs', {});
    var lac = el('linearGradient', { id: 'lacG', x1: '0', y1: '0', x2: '1', y2: '0' });
    [['0%', 'rgba(143,160,188,.15)'], ['40%', 'rgba(255,255,255,.8)'], ['60%', 'rgba(191,217,224,.55)'], ['100%', 'rgba(143,160,188,.15)']]
      .forEach(function (s) { lac.appendChild(el('stop', { offset: s[0], 'stop-color': s[1] })); });
    defs.appendChild(lac);
    cut.appendChild(defs);

    // contrapiso
    cut.appendChild(el('rect', { x: X, y: baseY - 40, width: W, height: 40, fill: '#1A1F2B' }));
    cut.appendChild(el('text', { x: X + W + 8, y: baseY - 16, fill: '#79839A', 'font-size': 11, 'font-family': 'Karla, sans-serif' })).textContent = 'contrapiso';

    // madera
    var maderaH = 150, maderaY = baseY - 40 - maderaH;
    cut.appendChild(el('rect', { x: X, y: maderaY, width: W, height: maderaH, fill: '#8B5A2B' }));
    for (var i = 1; i < 5; i++) {
      cut.appendChild(el('path', {
        d: 'M' + X + ' ' + (maderaY + i * 30) + ' q 65 -9 130 0 t 130 0',
        fill: 'none', stroke: 'rgba(45,24,10,.26)', 'stroke-width': 1.2
      }));
    }
    var tl = el('text', { x: X + W + 8, y: maderaY + 26, fill: '#79839A', 'font-size': 11, 'font-family': 'Karla, sans-serif' });
    tl.textContent = 'madera'; cut.appendChild(tl);

    // superficie según etapa
    var supY = maderaY;
    if (k === 0) {
      // piso viejo: laca gastada + manchas
      cut.appendChild(el('rect', { x: X, y: supY - 10, width: W, height: 10, fill: '#4E3A22' }));
      [[34, 4], [96, 4.5], [156, 3.5]].forEach(function (m) {
        cut.appendChild(el('ellipse', { cx: X + m[0], cy: supY - 5, rx: 20, ry: m[1], fill: 'rgba(20,12,6,.6)' }));
      });
      etiqueta(cut, X, supY - 26, 'laca vieja + manchas', '#8FA0BC');
    }
    if (k === 1) {
      // lija gruesa: sierra irregular
      var d = 'M' + X + ' ' + supY;
      for (var x1 = 0; x1 <= W; x1 += 16) d += ' L' + (X + x1) + ' ' + (supY - (x1 % 40 === 0 ? 9 : 2));
      d += ' L' + (X + W) + ' ' + (supY + 10) + ' L' + X + ' ' + (supY + 10) + ' Z';
      cut.appendChild(el('path', { d: d, fill: '#A2743C' }));
      polvo(cut, X, supY - 40, 30);
      etiqueta(cut, X, supY - 40, 'grano 16 · saca todo', '#FFFFFF');
    }
    if (k === 2) {
      cut.appendChild(el('rect', { x: X, y: supY - 3, width: W, height: 6, fill: '#A2743C' }));
      polvo(cut, X, supY - 34, 16);
      etiqueta(cut, X, supY - 34, 'grano 36 → 100 · queda liso', '#FFFFFF');
    }
    if (k >= 3) {
      cut.appendChild(el('rect', { x: X, y: supY - 7, width: W, height: 7, fill: '#B8834A', opacity: .95 }));
      if (k === 3) etiqueta(cut, X, supY - 24, 'sellador de fondo', '#FFFFFF');
    }
    if (k === 4) {
      for (var m = 0; m < 3; m++) {
        cut.appendChild(el('rect', { x: X, y: supY - 14 - m * 6, width: W, height: 6, fill: 'url(#lacG)', opacity: .55 + m * .12 }));
      }
      cut.appendChild(el('rect', { x: X, y: supY - 34, width: W, height: 3, fill: '#EAF4F7', opacity: .85 }));
      etiqueta(cut, X, supY - 52, '3 manos de laca · brillo', '#BFD9E0');
    }

    // cota lateral
    cut.appendChild(el('line', { x1: X - 12, y1: maderaY, x2: X - 12, y2: baseY, stroke: '#4A3826', 'stroke-width': 1 }));
  }

  function etiqueta(svg, x, y, txt, color) {
    var t = el('text', { x: x, y: y, fill: color, 'font-size': 12.5, 'font-family': 'Karla, sans-serif', 'font-weight': 600 });
    t.textContent = txt;
    svg.appendChild(t);
  }
  function polvo(svg, x, y, n) {
    for (var i = 0; i < n; i++) {
      svg.appendChild(el('circle', {
        cx: x + Math.random() * 196, cy: y + Math.random() * 46,
        r: Math.random() * 1.9 + 0.5, fill: '#AEB8C9', opacity: (Math.random() * 0.5 + 0.15).toFixed(2)
      }));
    }
  }

  var kActual = 0, timer = null;
  function setCapa(k) {
    kActual = k;
    dibujarCorte(k);
    if (capas) {
      capas.querySelectorAll('li').forEach(function (li) {
        li.classList.toggle('on', parseInt(li.getAttribute('data-k'), 10) === k);
      });
    }
  }
  setCapa(0);

  if (capas) {
    capas.addEventListener('mouseover', function (e) {
      var li = e.target.closest('li');
      if (!li) return;
      if (timer) { clearInterval(timer); timer = null; }
      setCapa(parseInt(li.getAttribute('data-k'), 10));
    });
    capas.addEventListener('click', function (e) {
      var li = e.target.closest('li');
      if (!li) return;
      if (timer) { clearInterval(timer); timer = null; }
      setCapa(parseInt(li.getAttribute('data-k'), 10));
    });
  }

  if (!QA && 'IntersectionObserver' in window && cut) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !timer) {
          timer = setInterval(function () { setCapa((kActual + 1) % 5); }, 2600);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    co.observe(cut);
  }
})();
