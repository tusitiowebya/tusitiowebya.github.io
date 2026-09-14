/* SDSeguridad — landing */
(function () {
  'use strict';

  var WSP = '5491128702373'; // 15 2870-2373 (se asume característica 11)
  var html = document.documentElement;
  var isQA = html.classList.contains('qa');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function waUrl(msg) { return 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg); }

  /* ---------- WhatsApp ---------- */
  $$('.js-wa').forEach(function (a) {
    a.href = waUrl(a.getAttribute('data-msg') || 'Hola SDSeguridad!');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- reveals ---------- */
  var reveals = $$('.reveal');
  if (isQA || html.classList.contains('lite') || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = $$('.reveal', e.target.parentElement);
        var i = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero: video + reloj + notificaciones ---------- */
  var video = $('#heroVideo');
  if (video && !html.classList.contains('lite')) {
    video.src = video.getAttribute('data-src');
    video.autoplay = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  var fmtHM = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
  var fmtFull = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
  function tick() {
    var now = new Date();
    var hm = fmtHM.format(now);
    $$('.js-clock').forEach(function (el) { el.textContent = hm; });
    $$('.js-stamp').forEach(function (el) { el.textContent = fmtFull.format(now).replace(',', ''); });
  }
  tick();
  if (!isQA) setInterval(tick, 1000);

  var toast = $('#toast'), tT = $('#toastT'), tS = $('#toastS'), tH = $('#toastH');
  var toasts = [
    ['Movimiento detectado', 'Cochera · CAM 02 · vehículo'],
    ['Puerta principal abierta', 'Sensor magnético · Zona 1'],
    ['Alarma armada', 'Modo noche · solo perímetro'],
    ['Persona detectada', 'Frente · CAM 01']
  ];
  var tIdx = 0, tTimer = null;
  function showToast(t, s) {
    tT.textContent = t; tS.textContent = s; tH.textContent = 'ahora';
    toast.classList.add('is-in');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toast.classList.remove('is-in'); }, 3600);
  }
  if (isQA || html.classList.contains('lite')) {
    toast.classList.add('is-in');
  } else {
    setTimeout(function loop() {
      showToast(toasts[tIdx][0], toasts[tIdx][1]);
      tIdx = (tIdx + 1) % toasts.length;
      setTimeout(loop, 5600);
    }, 1400);
  }

  var armed = $('#armed');
  armed.addEventListener('click', function () {
    var on = armed.getAttribute('aria-pressed') !== 'true';
    armed.setAttribute('aria-pressed', on ? 'true' : 'false');
    armed.querySelector('span').textContent = on ? 'ARMADA' : 'DESARMADA';
    showToast(on ? 'Alarma armada' : 'Alarma desarmada', on ? 'Desde la app · todas las zonas' : 'Desde la app · bienvenido');
  });

  /* ---------- línea de tiempo de pasos ---------- */
  var tl = $('.tl');
  if (tl) {
    var tlUpd = function () {
      var r = tl.getBoundingClientRect();
      var pct = Math.min(100, Math.max(0, ((window.innerHeight * 0.65 - r.top) / r.height) * 100));
      tl.style.setProperty('--tlp', (isQA ? 100 : pct) + '%');
    };
    window.addEventListener('scroll', tlUpd, { passive: true });
    tlUpd();
  }

  /* ================================================================
     EL PLANO — cámaras con campo de visión real (raycasting)
     ================================================================ */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var svg = $('#planSvg');
  if (!svg) return;

  var TYPES = {
    bala: { fov: 90, range: 300, name: 'Cámara bala' },
    domo: { fov: 120, range: 220, name: 'Cámara domo' },
    ojo:  { fov: 180, range: 170, name: 'Ojo de pez' }
  };
  var MAX_CAMS = 8;
  var BOUND = [[20, 20, 620, 20], [620, 20, 620, 420], [620, 420, 20, 420], [20, 420, 20, 20]];

  function rect(x, y, w, h) { return [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]]; }

  var PLANS = {
    casa: {
      label: 'casa',
      fence: [[20, 20, 620, 20], [620, 20, 620, 420], [20, 420, 20, 20], [20, 420, 250, 420], [300, 420, 440, 420], [600, 420, 620, 420]],
      walls: [
        [60, 110, 250, 110], [290, 110, 420, 110],
        [60, 110, 60, 330],
        [420, 110, 420, 250], [420, 290, 420, 330],
        [60, 330, 130, 330], [175, 330, 420, 330],
        [210, 110, 210, 200], [210, 245, 210, 330],
        [250, 215, 420, 215],
        [420, 150, 610, 150], [610, 150, 610, 330]
      ],
      shelves: [],
      soft: [[60, 110, 360, 220], [420, 150, 190, 180]],
      labels: [[320, 62, 'Patio'], [135, 225, 'Living'], [315, 168, 'Dormitorio'], [315, 278, 'Cocina'], [515, 245, 'Cochera'], [220, 385, 'Frente']],
      openings: [[152, 330, 'h'], [270, 110, 'h'], [420, 270, 'v'], [60, 220, 'v'], [350, 110, 'h'], [120, 110, 'h']],
      pirs: [[72, 122, 45], [408, 122, 135], [408, 318, 225], [598, 162, 135]],
      suggested: [
        { x: 604, y: 412, a: 225, t: 'bala' },
        { x: 76, y: 124, a: 60, t: 'bala' },
        { x: 232, y: 28, a: 30, t: 'bala' },
        { x: 304, y: 28, a: 150, t: 'bala' },
        { x: 28, y: 412, a: 315, t: 'bala' },
        { x: 208, y: 208, a: 15, t: 'domo' },
        { x: 604, y: 28, a: 135, t: 'domo' },
        { x: 200, y: 262, a: 270, t: 'ojo' }
      ]
    },
    local: {
      label: 'local comercial',
      fence: [],
      walls: [
        [20, 20, 620, 20], [620, 20, 620, 420], [20, 20, 20, 420],
        [20, 420, 260, 420], [380, 420, 620, 420],
        [440, 20, 440, 120], [440, 170, 620, 170],
        [150, 20, 150, 90], [20, 130, 150, 130]
      ],
      shelves: [rect(200, 180, 16, 150), rect(290, 180, 16, 150), rect(380, 220, 16, 110)],
      soft: [[470, 300, 130, 34]],
      labels: [[85, 80, 'Oficina'], [530, 100, 'Depósito'], [300, 150, 'Salón'], [535, 322, 'Caja'], [320, 406, 'Entrada']],
      openings: [[320, 420, 'h'], [440, 145, 'v'], [150, 110, 'v'], [530, 20, 'h']],
      pirs: [[32, 32, 45], [608, 32, 135], [608, 182, 135], [32, 408, -45]],
      suggested: [
        { x: 604, y: 412, a: 225, t: 'bala' },
        { x: 184, y: 28, a: 60, t: 'bala' },
        { x: 28, y: 412, a: 315, t: 'bala' },
        { x: 448, y: 160, a: 300, t: 'ojo' },
        { x: 160, y: 124, a: 255, t: 'ojo' },
        { x: 352, y: 412, a: 225, t: 'domo' },
        { x: 424, y: 412, a: 345, t: 'bala' },
        { x: 428, y: 190, a: 285, t: 'domo' }
      ]
    }
  };

  var gZones = $('#gZones'), gBlind = $('#gBlind'), gCones = $('#gCones'), gWalls = $('#gWalls'), gAlarm = $('#gAlarm'), gCams = $('#gCams');
  var covNum = $('#covNum'), gaugeArc = $('#gaugeArc'), verdict = $('#verdict');
  var stCams = $('#stCams'), stBlind = $('#stBlind'), stRec = $('#stRec');
  var kitList = $('#kitList'), planWa = $('#planWa'), hint = $('#hint');
  var camTools = $('#camTools'), camName = $('#camName'), camType = $('#camType');
  var alarmToggle = $('#alarmToggle'), alarmInfo = $('#alarmInfo');

  var CIRC = 2 * Math.PI * 50;
  gaugeArc.style.strokeDasharray = CIRC;
  gaugeArc.style.strokeDashoffset = CIRC;

  var state = { plan: 'casa', cams: [], sel: -1, alarm: false };
  var segs = [], shelfRects = [], samples = [];
  var shownCov = 0, covAnim = null, userTouched = false, demoTimer = null;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function buildPlan() {
    var P = PLANS[state.plan];
    gZones.innerHTML = ''; gWalls.innerHTML = '';
    segs = BOUND.slice();
    shelfRects = [];

    P.soft.forEach(function (r) { el('rect', { x: r[0], y: r[1], width: r[2], height: r[3], class: 'zone-soft' }, gZones); });
    P.labels.forEach(function (l) {
      var t = el('text', { x: l[0], y: l[1], 'text-anchor': 'middle', class: 'zone-label' }, gZones);
      t.textContent = l[2];
    });
    P.fence.forEach(function (s) { el('line', { x1: s[0], y1: s[1], x2: s[2], y2: s[3], class: 'wall wall--fence' }, gWalls); });
    P.walls.forEach(function (s) {
      segs.push(s);
      el('line', { x1: s[0], y1: s[1], x2: s[2], y2: s[3], class: 'wall' }, gWalls);
    });
    P.shelves.forEach(function (r) {
      r.forEach(function (s) { segs.push(s); });
      var x = r[0][0], y0 = r[0][1], w = r[0][2] - x, h = r[1][3] - y0;
      shelfRects.push([x, y0, w, h]);
      el('rect', { x: x, y: y0, width: w, height: h, rx: 2, fill: '#2a2d31', class: 'wall--shelf', stroke: '#b7bbbf', 'stroke-width': 2 }, gWalls);
    });
    P.openings.forEach(function (o) {
      var d = o[2] === 'h' ? { x1: o[0] - 14, y1: o[1], x2: o[0] + 14, y2: o[1] } : { x1: o[0], y1: o[1] - 14, x2: o[0], y2: o[1] + 14 };
      d.stroke = '#0b0c0e'; d['stroke-width'] = 3; d['stroke-dasharray'] = '0';
      el('line', d, gWalls);
      d.stroke = '#6d7176'; d['stroke-width'] = 1.5; d['stroke-dasharray'] = '3 3';
      el('line', d, gWalls);
    });

    // muestras para medir la cobertura (grilla de 10 px, sin contar góndolas)
    samples = [];
    for (var yy = 25; yy < 420; yy += 10) {
      for (var xx = 25; xx < 620; xx += 10) {
        if (insideShelf(xx, yy)) continue;
        samples.push([xx, yy, (xx - 25) % 20 === 0 && (yy - 25) % 20 === 0]);
      }
    }
  }

  function insideShelf(x, y) {
    for (var i = 0; i < shelfRects.length; i++) {
      var r = shelfRects[i];
      if (x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]) return true;
    }
    return false;
  }

  function cast(c) {
    var T = TYPES[c.t], half = T.fov / 2, n = Math.max(30, Math.round(T.fov / 1.5));
    var pts = [[c.x, c.y]];
    for (var i = 0; i <= n; i++) {
      var ang = (c.a - half + (T.fov * i) / n) * Math.PI / 180;
      var dx = Math.cos(ang), dy = Math.sin(ang), best = T.range;
      for (var j = 0; j < segs.length; j++) {
        var s = segs[j];
        var sx = s[2] - s[0], sy = s[3] - s[1];
        var den = dx * sy - dy * sx;
        if (Math.abs(den) < 1e-9) continue;
        var qx = s[0] - c.x, qy = s[1] - c.y;
        var t = (qx * sy - qy * sx) / den;
        var u = (qx * dy - qy * dx) / den;
        if (t > 0.001 && t < best && u >= 0 && u <= 1) best = t;
      }
      pts.push([c.x + dx * best, c.y + dy * best]);
    }
    return pts;
  }

  function inPoly(x, y, poly, bb) {
    if (x < bb[0] || x > bb[2] || y < bb[1] || y > bb[3]) return false;
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  var raf = 0;
  function render() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; draw(); }); }

  function draw() {
    gCones.innerHTML = ''; gCams.innerHTML = ''; gBlind.innerHTML = '';
    // en pantallas chicas el plano se achica: agrandamos cámaras y manijas para el dedo
    var K = svg.getBoundingClientRect().width < 520 ? 1.55 : 1;

    var polys = state.cams.map(function (c, i) {
      var poly = cast(c);
      var bb = [1e9, 1e9, -1e9, -1e9];
      poly.forEach(function (p) { bb[0] = Math.min(bb[0], p[0]); bb[1] = Math.min(bb[1], p[1]); bb[2] = Math.max(bb[2], p[0]); bb[3] = Math.max(bb[3], p[1]); });
      el('path', { d: 'M' + poly.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z', class: 'cone-p' + (i === state.sel ? ' is-sel' : '') }, gCones);
      return { poly: poly, bb: bb };
    });

    var covered = 0, blindShown = 0, blindFrag = document.createDocumentFragment();
    for (var k = 0; k < samples.length; k++) {
      var s = samples[k], hit = false;
      for (var m = 0; m < polys.length && !hit; m++) hit = inPoly(s[0], s[1], polys[m].poly, polys[m].bb);
      if (hit) covered++;
      else if (s[2]) {
        blindShown++;
        var d = document.createElementNS(SVGNS, 'circle');
        d.setAttribute('cx', s[0]); d.setAttribute('cy', s[1]); d.setAttribute('r', 1.6); d.setAttribute('class', 'blind');
        blindFrag.appendChild(d);
      }
    }
    gBlind.appendChild(blindFrag);

    state.cams.forEach(function (c, i) {
      var g = el('g', { class: 'cam' + (i === state.sel ? ' is-sel' : ''), 'data-i': i, transform: 'translate(' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ')' }, gCams);
      var rad = c.a * Math.PI / 180, hx = Math.cos(rad) * 44 * K, hy = Math.sin(rad) * 44 * K;
      if (i === state.sel) {
        el('line', { x1: 0, y1: 0, x2: hx, y2: hy, class: 'cam__stick' }, g);
      }
      el('circle', { r: 24 * K, fill: 'transparent', 'data-role': 'body' }, g);
      el('circle', { r: 17 * K, class: 'cam__ring' }, g);
      el('circle', { r: 11 * K, class: 'cam__body', 'data-role': 'body' }, g);
      el('circle', { cx: Math.cos(rad) * 5 * K, cy: Math.sin(rad) * 5 * K, r: 4 * K, class: 'cam__lens', 'data-role': 'body' }, g);
      var lbl = el('text', { x: 0, y: -18 * K, 'text-anchor': 'middle', class: 'cam__lbl' }, g);
      lbl.textContent = String(i + 1).padStart(2, '0');
      if (i === state.sel) {
        el('circle', { cx: hx, cy: hy, r: 16 * K, fill: 'transparent', 'data-role': 'handle' }, g);
        el('circle', { cx: hx, cy: hy, r: 7 * K, class: 'cam__handle', 'data-role': 'handle' }, g);
      }
    });

    drawAlarm();

    var pct = samples.length ? Math.round((covered / samples.length) * 100) : 0;
    if (!state.cams.length) pct = 0;
    updateReadout(pct, blindShown);
  }

  function drawAlarm() {
    gAlarm.innerHTML = '';
    if (!state.alarm) return;
    var P = PLANS[state.plan];
    P.openings.forEach(function (o) {
      el('rect', { x: o[0] - 5, y: o[1] - 5, width: 10, height: 10, rx: 2, class: 'al-mag' }, gAlarm);
    });
    P.pirs.forEach(function (p) {
      var g = el('g', { transform: 'translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')' }, gAlarm);
      el('circle', { r: 3.5, class: 'al-dot' }, g);
      [14, 24, 34].forEach(function (r) {
        var a = 32 * Math.PI / 180;
        el('path', { d: 'M' + (Math.cos(-a) * r).toFixed(1) + ' ' + (Math.sin(-a) * r).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1), class: 'al-pir', opacity: (1 - r / 50).toFixed(2) }, g);
      });
    });
  }

  function recorderFor(n) { return n === 0 ? null : n <= 4 ? { ch: 4, hd: '1 TB' } : n <= 8 ? { ch: 8, hd: '2 TB' } : { ch: 16, hd: '4 TB' }; }

  function verdictFor(pct) {
    if (!state.cams.length) return 'Poné la primera cámara.';
    if (pct < 35) return 'Quedan muchos lugares por donde pasar sin que se vea.';
    if (pct < 60) return 'Vas bien, pero hay zonas enteras sin mirar.';
    if (pct < 80) return 'Buena cobertura. Revisá los puntos ciegos que quedan.';
    if (pct < 92) return 'Muy buena: casi no quedan puntos ciegos.';
    return 'Cobertura completa. Así lo dejaríamos nosotros.';
  }

  function updateReadout(pct, blind) {
    // contador animado
    cancelAnimationFrame(covAnim);
    var from = shownCov, t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 450);
      var v = Math.round(from + (pct - from) * (1 - Math.pow(1 - k, 3)));
      covNum.textContent = v;
      if (k < 1) covAnim = requestAnimationFrame(step); else shownCov = pct;
    })(isQA ? t0 + 1000 : t0);
    gaugeArc.style.strokeDashoffset = CIRC * (1 - pct / 100);
    verdict.textContent = verdictFor(pct);

    var n = state.cams.length, rec = recorderFor(n), P = PLANS[state.plan];
    stCams.textContent = n + '/' + MAX_CAMS;
    stBlind.textContent = n ? blind : '—';
    stRec.textContent = rec ? rec.ch + ' can.' : '—';
    alarmInfo.textContent = P.openings.length + ' aberturas y ' + P.pirs.length + ' sensores de movimiento';

    var counts = {};
    state.cams.forEach(function (c) { counts[c.t] = (counts[c.t] || 0) + 1; });
    var items = [];
    Object.keys(TYPES).forEach(function (t) { if (counts[t]) items.push([TYPES[t].name, '× ' + counts[t]]); });
    if (rec) { items.push(['Grabador ' + rec.ch + ' canales', rec.hd]); items.push(['App en tus celulares', '✓']); }
    if (state.alarm) {
      items.push(['Central + teclado', '× 1']);
      items.push(['Contactos magnéticos', '× ' + P.openings.length]);
      items.push(['Sensores de movimiento', '× ' + P.pirs.length]);
      items.push(['Sirena exterior', '× 1']);
    }
    kitList.innerHTML = items.length
      ? items.map(function (it) { return '<li><span>' + it[0] + '</span><b>' + it[1] + '</b></li>'; }).join('')
      : '<li class="kit__empty">Todavía no hay equipos.</li>';

    var msg = 'Hola SDSeguridad! Armé un plan en la web para mi ' + P.label + ':\n';
    if (n) {
      msg += '• ' + items.filter(function (it) { return /Cámara|Ojo/.test(it[0]); }).map(function (it) { return it[0] + ' ' + it[1]; }).join(', ') + '\n';
      msg += '• Cobertura simulada: ' + pct + '%\n';
    } else {
      msg += '• Todavía no ubiqué cámaras\n';
    }
    if (state.alarm) msg += '• Con alarma: ' + P.openings.length + ' contactos y ' + P.pirs.length + ' sensores de movimiento\n';
    msg += 'Quiero coordinar una visita sin cargo.';
    planWa.href = waUrl(msg);
    planWa.target = '_blank';
    planWa.rel = 'noopener';

    // barra de la cámara elegida
    if (state.sel >= 0 && state.cams[state.sel]) {
      camTools.hidden = false;
      camName.textContent = 'CAM ' + String(state.sel + 1).padStart(2, '0');
      $$('button', camType).forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-type') === state.cams[state.sel].t); });
    } else {
      camTools.hidden = true;
    }
  }

  /* ---- interacción ---- */
  function toSvg(e) {
    var pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: Math.min(615, Math.max(25, p.x)), y: Math.min(415, Math.max(25, p.y)) };
  }

  function stopDemo() {
    userTouched = true;
    clearTimeout(demoTimer);
  }

  var drag = null;
  svg.addEventListener('pointerdown', function (e) {
    stopDemo();
    hint.classList.add('is-off');
    var target = e.target, g = target.closest ? target.closest('.cam') : null;
    var p = toSvg(e);
    if (g) {
      var i = +g.getAttribute('data-i');
      var role = target.getAttribute('data-role');
      state.sel = i;
      drag = { i: i, mode: role === 'handle' ? 'rot' : 'move', ox: p.x - state.cams[i].x, oy: p.y - state.cams[i].y };
    } else {
      if (state.cams.length >= MAX_CAMS) { state.sel = -1; render(); return; }
      if (insideShelf(p.x, p.y)) return;
      // por defecto mira hacia el centro del plano
      var a = Math.atan2(220 - p.y, 320 - p.x) * 180 / Math.PI;
      state.cams.push({ x: p.x, y: p.y, a: Math.round(a / 5) * 5, t: 'domo' });
      state.sel = state.cams.length - 1;
      drag = { i: state.sel, mode: 'move', ox: 0, oy: 0 };
    }
    try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
    render();
  });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var p = toSvg(e), c = state.cams[drag.i];
    if (!c) return;
    if (drag.mode === 'move') {
      var nx = p.x - drag.ox, ny = p.y - drag.oy;
      if (!insideShelf(nx, ny)) { c.x = nx; c.y = ny; }
    } else {
      c.a = Math.atan2(p.y - c.y, p.x - c.x) * 180 / Math.PI;
    }
    render();
  });
  function endDrag() { drag = null; }
  svg.addEventListener('pointerup', endDrag);
  window.addEventListener('resize', render);
  svg.addEventListener('pointercancel', endDrag);

  camType.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || state.sel < 0) return;
    stopDemo();
    state.cams[state.sel].t = b.getAttribute('data-type');
    render();
  });
  $('#rotL').addEventListener('click', function () { if (state.sel < 0) return; stopDemo(); state.cams[state.sel].a -= 15; render(); });
  $('#rotR').addEventListener('click', function () { if (state.sel < 0) return; stopDemo(); state.cams[state.sel].a += 15; render(); });
  $('#camDel').addEventListener('click', function () {
    if (state.sel < 0) return;
    stopDemo();
    state.cams.splice(state.sel, 1);
    state.sel = -1;
    render();
  });

  document.addEventListener('keydown', function (e) {
    if (state.sel < 0 || !svg.closest('.board').contains(document.activeElement)) return;
    var c = state.cams[state.sel];
    if (!c) return;
    var used = true;
    if (e.key === 'ArrowLeft') c.x = Math.max(25, c.x - 5);
    else if (e.key === 'ArrowRight') c.x = Math.min(615, c.x + 5);
    else if (e.key === 'ArrowUp') c.y = Math.max(25, c.y - 5);
    else if (e.key === 'ArrowDown') c.y = Math.min(415, c.y + 5);
    else if (e.key === 'q' || e.key === 'Q') c.a -= 15;
    else if (e.key === 'e' || e.key === 'E') c.a += 15;
    else used = false;
    if (used) { e.preventDefault(); stopDemo(); render(); }
  });

  $$('.seg[role="tablist"] button').forEach(function (b) {
    b.addEventListener('click', function () {
      stopDemo();
      $$('.seg[role="tablist"] button').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('is-on'); b.setAttribute('aria-selected', 'true');
      state.plan = b.getAttribute('data-plan');
      state.cams = [JSON.parse(JSON.stringify(PLANS[state.plan].suggested[0]))];
      state.sel = -1;
      buildPlan();
      render();
    });
  });

  function playSuggested(stepMs) {
    clearTimeout(demoTimer);
    var list = PLANS[state.plan].suggested;
    state.cams = []; state.sel = -1;
    var i = 0;
    (function add() {
      state.cams.push(JSON.parse(JSON.stringify(list[i])));
      i++;
      render();
      if (i < list.length) demoTimer = setTimeout(add, stepMs);
    })();
  }

  $('#btnSug').addEventListener('click', function () { userTouched = true; hint.classList.add('is-off'); playSuggested(260); });
  $('#btnClear').addEventListener('click', function () { stopDemo(); state.cams = []; state.sel = -1; hint.classList.remove('is-off'); render(); });
  alarmToggle.addEventListener('change', function () { state.alarm = alarmToggle.checked; render(); });

  // arranque: una cámara puesta; al entrar en pantalla se completa sola la sugerencia
  buildPlan();
  state.cams = [JSON.parse(JSON.stringify(PLANS.casa.suggested[0]))];
  if (isQA) {
    // ?qa&plano=local&todas → para revisar cada plano con la sugerencia completa
    if (/[?&]plano=local/.test(location.search)) {
      state.plan = 'local';
      $$('.seg[role="tablist"] button').forEach(function (x) { x.classList.toggle('is-on', x.getAttribute('data-plan') === 'local'); });
      buildPlan();
    }
    state.cams = JSON.parse(JSON.stringify(PLANS[state.plan].suggested.slice(0, /[?&]todas/.test(location.search) ? 8 : 5)));
    state.sel = 1;
    state.alarm = true; alarmToggle.checked = true;
    hint.classList.add('is-off');
  }
  render();

  if (!isQA && 'IntersectionObserver' in window) {
    var demoIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      demoIO.disconnect();
      if (userTouched) return;
      demoTimer = setTimeout(function () {
        if (userTouched) return;
        var list = PLANS[state.plan].suggested, i = state.cams.length;
        (function add() {
          if (userTouched || i >= 5) { if (!userTouched) hint.classList.remove('is-off'); return; }
          state.cams.push(JSON.parse(JSON.stringify(list[i])));
          i++;
          render();
          demoTimer = setTimeout(add, 750);
        })();
      }, 500);
    }, { threshold: 0.35 });
    demoIO.observe($('.board'));
  }

  /* ---------- watchdog de FPS: si el equipo no da, pasa a LITE ---------- */
  if (!/[?&]full\b/.test(location.search) && !html.classList.contains('lite') && !isQA) {
    var frames = 0, start = 0;
    setTimeout(function () {
      requestAnimationFrame(function f(ts) {
        if (!start) start = ts;
        frames++;
        if (ts - start < 2000) return requestAnimationFrame(f);
        var fps = frames * 1000 / (ts - start);
        if (fps < 28) {
          html.classList.add('lite');
          try { sessionStorage.setItem('sd-lite', '1'); } catch (e) {}
        }
      });
    }, 2500);
  }
})();
