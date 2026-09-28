/* ==========================================================
   Vigor Hair — demo TuPaginaYa
   ========================================================== */
(function () {
  'use strict';

  var WA = '5491166070513';
  var html = document.documentElement;
  var isLite = function () { return html.classList.contains('lite'); };
  var isQA = html.classList.contains('qa');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waUrl = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };
  var norm = function (s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  /* ---------- NAV ---------- */
  var nav = $('#nav');
  var toggle = $('#navToggle');
  var menu = $('#menu');
  var waFloat = $('.wa-float');
  var onScroll = function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var closeMenu = function () {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', function () {
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- HERO: se prenden las luces ---------- */
  var station = $('.station');
  var heroVideo = $('#heroVideo');
  var loadVideo = function (v) {
    if (!v || v.getAttribute('src') || isLite()) return;
    v.src = v.dataset.src;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  };
  if (isQA) {
    station.classList.add('is-on');
  } else {
    loadVideo(heroVideo);
    setTimeout(function () { station.classList.add('is-on'); }, 350);
  }

  /* videos secundarios: se cargan y reproducen solo si se ven */
  var sideVideos = $$('.pro__media video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!isLite()) { loadVideo(v); if (v.getAttribute('src')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    sideVideos.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- reveals ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !isQA) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- KIT por WhatsApp ---------- */
  var seg = $$('.seg button');
  var qtyOut = $('#qty');
  var kitWa = $('#kitWa');
  var kit = { prod: 'Kit Shampoo + Loción', qty: 1 };
  var paintKit = function () {
    qtyOut.textContent = kit.qty;
    var unidad = kit.prod.indexOf('Kit') === 0 ? (kit.qty > 1 ? 'kits' : 'kit') : (kit.qty > 1 ? 'unidades' : 'unidad');
    var what = kit.prod.indexOf('Kit') === 0 ? 'de Shampoo Tratamiento + Loción Tónica' : 'de ' + kit.prod;
    kitWa.href = waUrl('Hola Vigor Hair, quiero encargar ' + kit.qty + ' ' + unidad + ' ' + what + '. ¿Me pasan precio y disponibilidad?');
  };
  seg.forEach(function (b) {
    b.addEventListener('click', function () {
      seg.forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
      kit.prod = b.dataset.prod;
      paintKit();
    });
  });
  $$('.qty__ctrl button').forEach(function (b) {
    b.addEventListener('click', function () {
      kit.qty = Math.min(20, Math.max(1, kit.qty + Number(b.dataset.q)));
      paintKit();
    });
  });
  paintKit();

  /* ---------- FOLÍCULO ---------- */
  var follicle = $('#follicle');
  var bButtons = $$('#benefits button');
  var hots = $$('.f-hot g');
  var auto = null;
  var userTouched = false;
  var setBenefit = function (n) {
    follicle.dataset.active = n;
    bButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.b === String(n))); });
    hots.forEach(function (h) { h.classList.toggle('is-on', h.dataset.go === String(n)); });
  };
  var stopAuto = function () { userTouched = true; if (auto) { clearInterval(auto); auto = null; } };
  bButtons.forEach(function (b) { b.addEventListener('click', function () { stopAuto(); setBenefit(b.dataset.b); }); });
  hots.forEach(function (h) { h.addEventListener('click', function () { stopAuto(); setBenefit(h.dataset.go); }); });
  setBenefit(1);
  if ('IntersectionObserver' in window && !isQA) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !userTouched && !auto) {
          auto = setInterval(function () {
            var n = (Number(follicle.dataset.active) % 6) + 1;
            setBenefit(n);
          }, 4200);
        } else if (!en.isIntersecting && auto) { clearInterval(auto); auto = null; }
      });
    }, { threshold: 0.35 });
    fio.observe(follicle);
  }

  /* ==========================================================
     GUÍA DE SALONES — mapa esquemático + lista
     ========================================================== */
  var SAL = (window.VH_SALONES || []).slice();
  var ZN = { caba: 'CABA', norte: 'Zona Norte', oeste: 'Zona Oeste', sur: 'Zona Sur', interior: 'Interior' };
  var ZALIAS = {
    caba: 'caba capital capital federal ciudad de buenos aires ciudad autonoma',
    norte: 'zona norte norte gba norte',
    oeste: 'zona oeste oeste gba oeste',
    sur: 'zona sur sur gba sur',
    interior: 'interior provincia'
  };
  var ZORDER = ['caba', 'norte', 'oeste', 'sur', 'interior'];
  var REGION = { caba: 'Ciudad de Buenos Aires', norte: 'Buenos Aires', oeste: 'Buenos Aires', sur: 'Buenos Aires', interior: 'Argentina' };
  SAL.forEach(function (s) {
    s.key = norm([s.n, s.a, s.l, s.p || '', ZN[s.z], ZALIAS[s.z]].join(' '));
    s.lkey = norm(s.l);
  });

  var svg = $('#mapSvg');
  var mapBox = $('#map');
  var tip = $('#mapTip');
  var listEl = $('#salonList');
  var statusEl = $('#salonStatus');
  var qInput = $('#salonQuery');
  var resetBtn = $('#mapReset');
  var NS = 'http://www.w3.org/2000/svg';

  /* proyección simple (equirectangular corregida) */
  var LON0 = -58.84, LAT0 = -34.38, KX = 822.6, KY = 1000;
  var FULL = [0, 0, 806, 590];
  var px = function (lat, lon) { return [(lon - LON0) * KX, (LAT0 - lat) * KY]; };
  var inMap = function (s) { var p = px(s.lat, s.lon); return p[0] > 0 && p[0] < 806 && p[1] > 0 && p[1] < 590; };
  var el = function (tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  var pathFrom = function (pts, close) {
    return pts.map(function (p, i) { var q = px(p[0], p[1]); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('') + (close ? 'Z' : '');
  };

  var COAST = [[-34.36, -58.585], [-34.38, -58.575], [-34.405, -58.565], [-34.43, -58.545], [-34.455, -58.515], [-34.475, -58.495], [-34.5, -58.478], [-34.518, -58.466], [-34.536, -58.448], [-34.552, -58.425], [-34.566, -58.405], [-34.584, -58.378], [-34.6, -58.357], [-34.614, -58.342], [-34.632, -58.343], [-34.646, -58.332], [-34.662, -58.31], [-34.68, -58.285], [-34.697, -58.262], [-34.712, -58.237], [-34.728, -58.205], [-34.748, -58.17], [-34.772, -58.13], [-34.795, -58.09], [-34.818, -58.045], [-34.838, -57.995], [-34.855, -57.945], [-34.87, -57.9], [-34.885, -57.84]];
  var CABA = [[-34.536, -58.448], [-34.543, -58.466], [-34.552, -58.486], [-34.566, -58.503], [-34.582, -58.522], [-34.6, -58.53], [-34.617, -58.53], [-34.634, -58.53], [-34.648, -58.528], [-34.661, -58.517], [-34.675, -58.5], [-34.69, -58.481], [-34.705, -58.462], [-34.695, -58.445], [-34.682, -58.43], [-34.67, -58.418], [-34.661, -58.402], [-34.653, -58.386], [-34.647, -58.37], [-34.64, -58.358], [-34.636, -58.348], [-34.632, -58.343], [-34.614, -58.342], [-34.6, -58.357], [-34.584, -58.378], [-34.566, -58.405], [-34.552, -58.425]];
  var RIACH = [[-34.735, -58.51], [-34.718, -58.478], [-34.705, -58.462], [-34.695, -58.445], [-34.682, -58.43], [-34.67, -58.418], [-34.661, -58.402], [-34.653, -58.386], [-34.647, -58.37], [-34.64, -58.358], [-34.636, -58.348]];

  var gPins, pinById = {}, userG = null;
  var buildMap = function () {
    el('rect', { x: -400, y: -400, width: 1606, height: 1390, fill: '#F8F6EF' }, svg);
    var grid = el('g', {}, svg);
    for (var lo = -58.8; lo <= -57.85; lo += 0.1) { var a = px(-34.3, lo), b = px(-35.0, lo); el('line', { x1: a[0], y1: -400, x2: b[0], y2: 990, class: 'm-grid' }, grid); }
    for (var la = -34.4; la >= -34.95; la -= 0.1) { var c = px(la, -59.3); el('line', { x1: -400, y1: c[1], x2: 1206, y2: c[1], class: 'm-grid' }, grid); }

    var water = COAST.concat([[-34.95, -57.4], [-34.2, -57.4], [-34.2, -58.585]]);
    el('path', { d: pathFrom(water, true), class: 'm-water' }, svg);
    var waves = el('g', {}, svg);
    [[-34.52, -58.3], [-34.6, -58.2], [-34.7, -58.1], [-34.47, -58.4], [-34.78, -57.95], [-34.62, -58.03]].forEach(function (w) {
      var p = px(w[0], w[1]);
      el('path', { d: 'M' + p[0] + ' ' + p[1] + ' q8 -6 16 0 t16 0 t16 0', class: 'm-wave' }, waves);
    });
    el('path', { d: pathFrom(COAST, false), class: 'm-coast' }, svg);
    el('path', { d: pathFrom(CABA, true), class: 'm-caba' }, svg);
    el('path', { d: pathFrom(RIACH, false), class: 'm-riach' }, svg);

    var labels = el('g', {}, svg);
    [[-34.598, -58.462, 'CABA', 17], [-34.455, -58.655, 'ZONA NORTE', 13], [-34.735, -58.74, 'ZONA OESTE', 13], [-34.835, -58.43, 'ZONA SUR', 13], [-34.955, -58.03, 'LA PLATA', 11]].forEach(function (z) {
      var p = px(z[0], z[1]);
      var t = el('text', { x: p[0], y: p[1], class: 'm-zone', 'font-size': z[3], 'data-fs': z[3] }, labels);
      t.textContent = z[2];
    });
    var rp = px(-34.56, -58.13);
    var rt = el('text', { x: rp[0], y: rp[1], class: 'm-river', 'font-size': 22, 'data-fs': 22, transform: 'rotate(-30 ' + rp[0] + ' ' + rp[1] + ')' }, labels);
    rt.textContent = 'Río de la Plata';

    /* acceso a interior */
    var ip = px(-34.405, -58.83);
    var ig = el('g', { class: 'm-interior', tabindex: '0', role: 'button', 'aria-label': 'Ver salones del interior', style: 'cursor:pointer' }, svg);
    var it = el('text', { x: ip[0] + 4, y: ip[1] + 4, class: 'm-arrow', 'font-size': 13, 'data-fs': 13 }, ig);
    it.textContent = '↖ Interior del país (' + SAL.filter(function (s) { return s.z === 'interior'; }).length + ')';
    ig.addEventListener('click', function () { setZone('interior'); });
    ig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZone('interior'); } });

    gPins = el('g', {}, svg);
    SAL.forEach(function (s) {
      if (!inMap(s)) return;
      var p = px(s.lat, s.lon);
      var g = el('g', { class: 'm-pin', 'data-id': s.id, transform: 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')', tabindex: '-1' }, gPins);
      var color = getComputedStyle(html).getPropertyValue('--z-' + s.z).trim() || '#6F7F3B';
      el('circle', { class: 'm-halo', r: 14, stroke: color }, g);
      el('circle', { class: 'm-dot', r: 6, fill: color }, g);
      g.addEventListener('click', function (e) { e.stopPropagation(); select(s.id, true); });
      g.addEventListener('mouseenter', function () { showTip(s); });
      g.addEventListener('mouseleave', function () { if (state.active !== s.id) hideTip(); else showTip(s); });
      pinById[s.id] = g;
    });
    svg.addEventListener('click', function () { hideTip(); });
  };

  /* viewBox animado + tamaño de pines constante en pantalla */
  var vb = FULL.slice();
  var setVB = function (b) {
    vb = b;
    svg.setAttribute('viewBox', b.map(function (n) { return n.toFixed(1); }).join(' '));
    sizePins();
  };
  var sizePins = function () {
    var w = svg.clientWidth || 700;
    var u = vb[2] / w;
    var small = w < 520;
    var r = (small ? 5.5 : 6.5) * u, halo = (small ? 11 : 13) * u;
    $$('.m-dot', svg).forEach(function (c) { c.setAttribute('r', r.toFixed(2)); });
    $$('.m-halo', svg).forEach(function (c) { c.setAttribute('r', halo.toFixed(2)); });
    var k = Math.max(vb[2] / 806, 0.34);
    $$('[data-fs]', svg).forEach(function (t) { t.setAttribute('font-size', (t.getAttribute('data-fs') * k).toFixed(2)); });
    if (userG) { userG.firstChild.setAttribute('r', (20 * u).toFixed(2)); userG.lastChild.setAttribute('r', (7 * u).toFixed(2)); }
    if (state.active) { var s = byId(state.active); if (s) showTip(s); }
  };
  var tween = null;
  var zoomTo = function (target) {
    if (tween) cancelAnimationFrame(tween);
    var from = vb.slice();
    if (isLite() || isQA) { setVB(target); return; }
    var t0 = performance.now(), D = 650;
    var step = function (now) {
      var k = Math.min(1, (now - t0) / D);
      var e = 1 - Math.pow(1 - k, 3);
      setVB(from.map(function (v, i) { return v + (target[i] - v) * e; }));
      if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  };
  var fitBox = function (pts) {
    if (!pts.length) return FULL.slice();
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
    var w = Math.max(x1 - x0, 140), h = Math.max(y1 - y0, 100);
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    w *= 1.3; h *= 1.3;
    var ar = 806 / 590;
    if (w / h > ar) h = w / ar; else w = h * ar;
    if (w > 806) { w = 806; h = 590; }
    var x = Math.min(Math.max(cx - w / 2, 0), 806 - w), y = Math.min(Math.max(cy - h / 2, 0), 590 - h);
    return [x, y, w, h];
  };

  /* estado */
  var state = { zone: 'all', q: '', near: null, active: null };
  var byId = function (id) { for (var i = 0; i < SAL.length; i++) if (SAL[i].id === id) return SAL[i]; return null; };
  var dist = function (a, b) {
    var R = 6371, r = Math.PI / 180;
    var x = Math.sin((b.lat - a.lat) * r / 2), y = Math.sin((b.lon - a.lon) * r / 2);
    var h = x * x + Math.cos(a.lat * r) * Math.cos(b.lat * r) * y * y;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  var fmtKm = function (k) { return k < 1 ? '< 1 km' : (k < 20 ? k.toFixed(1).replace('.', ',') : Math.round(k)) + ' km'; };

  var filtered = function () {
    var q = norm(state.q);
    var words = q ? q.split(' ') : [];
    var res = SAL.filter(function (s) {
      if (state.zone !== 'all' && s.z !== state.zone) return false;
      if (!words.length) return true;
      return words.every(function (w) { return s.key.indexOf(w) !== -1; });
    });
    if (state.near) {
      res.forEach(function (s) { s.d = dist(state.near, s); });
      res.sort(function (a, b) { return a.d - b.d; });
    } else {
      res.sort(function (a, b) {
        return ZORDER.indexOf(a.z) - ZORDER.indexOf(b.z) || a.l.localeCompare(b.l, 'es') || a.n.localeCompare(b.n, 'es');
      });
    }
    return res;
  };

  var mapsUrl = function (s) {
    var loc = s.l.replace(/\s*\(([^)]+)\)/, ', $1').replace(' / ', ', ');
    var street = s.a.replace(/, (local|PB|1\.er|entre).*$/i, '');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(street + ', ' + loc + (s.p && s.z !== 'caba' && s.z !== 'interior' && s.p !== s.l ? ', ' + s.p : '') + ', ' + REGION[s.z]);
  };
  var salonWa = function (s) {
    return waUrl('Hola Vigor Hair, vi en la web el salón ' + s.n + ' (' + s.a + ', ' + s.l + '). ¿Me confirman si tienen Shampoo y Loción?');
  };

  var render = function (opts) {
    opts = opts || {};
    var res = filtered();
    var ids = {};
    res.forEach(function (s) { ids[s.id] = 1; });

    /* pines */
    Object.keys(pinById).forEach(function (id) {
      pinById[id].classList.toggle('is-dim', !ids[id]);
    });

    /* lista */
    listEl.innerHTML = '';
    if (!res.length) {
      var li = document.createElement('li');
      li.className = 'list__empty';
      var where = state.q ? '«' + state.q + '»' : 'esta zona';
      li.innerHTML = '<p style="margin:0">No encontramos salones adheridos en ' + where.replace(/</g, '&lt;') + '. Escribinos y te decimos cuál te queda más cerca, o cómo encargar el kit.</p>';
      var a = document.createElement('a');
      a.className = 'btn btn--wa';
      a.target = '_blank'; a.rel = 'noopener';
      a.href = waUrl('Hola Vigor Hair, busco dónde comprar Vigor Hair cerca de ' + (state.q || 'mi zona') + '. ¿Qué salón me queda más cerca?');
      a.innerHTML = '<svg aria-hidden="true"><use href="#i-wa"/></svg> Consultar por WhatsApp';
      li.appendChild(a);
      listEl.appendChild(li);
    }
    var frag = document.createDocumentFragment();
    res.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'salon' + (state.active === s.id ? ' is-on' : '');
      li.dataset.id = s.id;
      li.style.setProperty('--c', 'var(--z-' + s.z + ')');
      var d = state.near && typeof s.d === 'number' ? '<span class="salon__dist">a ' + fmtKm(s.d) + '</span>' : '';
      li.innerHTML =
        '<div class="salon__top"><button type="button" class="salon__name"></button>' + d + '</div>' +
        '<p class="salon__addr"></p>' +
        '<div class="salon__acts">' +
        '<a class="maps" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg> Cómo llegar</a>' +
        '<a class="wa" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg> Consultar stock</a>' +
        '</div>';
      $('.salon__name', li).textContent = s.n;
      var addr = $('.salon__addr', li);
      addr.textContent = s.a + ' · ';
      var sp = document.createElement('span'); sp.textContent = s.l + (s.z === 'caba' || s.z === 'interior' ? '' : ' · ' + ZN[s.z]);
      addr.appendChild(sp);
      $('.maps', li).href = mapsUrl(s);
      $('.maps', li).setAttribute('aria-label', 'Cómo llegar a ' + s.n);
      $('.wa', li).href = salonWa(s);
      $('.wa', li).setAttribute('aria-label', 'Consultar stock de ' + s.n + ' por WhatsApp');
      $('.salon__name', li).addEventListener('click', function () { select(s.id, false); });
      frag.appendChild(li);
    });
    listEl.appendChild(frag);
    listEl.scrollTop = 0;

    /* estado */
    var n = res.length;
    var msg;
    if (state.near) msg = 'Ordenados por cercanía a tu ubicación (distancia aproximada, en línea recta).';
    else if (state.q) msg = n ? n + (n === 1 ? ' salón' : ' salones') + ' para «' + state.q + '»' + (state.zone !== 'all' ? ' en ' + ZN[state.zone] : '') + '.' : '';
    else if (state.zone === 'all') msg = n + ' salones adheridos en CABA, Gran Buenos Aires e interior.';
    else if (state.zone === 'interior') msg = n + ' salones en el interior: están fuera del mapa del AMBA.';
    else msg = n + ' salones en ' + ZN[state.zone] + '.';
    statusEl.textContent = msg;

    /* zoom */
    if (opts.zoom !== false) {
      var pts = res.filter(inMap).map(function (s) { return px(s.lat, s.lon); });
      if (state.near && inMap(state.near)) pts = [px(state.near.lat, state.near.lon)].concat(pts.slice(0, 4));
      else if (state.near) pts = pts.slice(0, 4);
      var target = (state.zone === 'all' && !state.q && !state.near) || !pts.length ? FULL.slice() : fitBox(pts);
      zoomTo(target);
      resetBtn.hidden = target[2] >= 805;
    }
    hideTip();
    if (state.zone === 'interior') showInteriorTip();
  };

  var select = function (id, fromMap) {
    state.active = id;
    var s = byId(id);
    $$('.salon', listEl).forEach(function (li) { li.classList.toggle('is-on', Number(li.dataset.id) === id); });
    Object.keys(pinById).forEach(function (k) { pinById[k].classList.toggle('is-on', Number(k) === id); });
    if (pinById[id]) gPins.appendChild(pinById[id]);
    if (s && inMap(s)) showTip(s); else hideTip();
    if (fromMap) {
      var li = $('.salon[data-id="' + id + '"]', listEl);
      if (li) listEl.scrollTo({ top: li.offsetTop - listEl.offsetTop - 8, behavior: isLite() ? 'auto' : 'smooth' });
    }
  };

  var showTip = function (s) {
    var g = pinById[s.id];
    if (!g || !svg.getScreenCTM()) return;
    var p = px(s.lat, s.lon);
    var pt = svg.createSVGPoint(); pt.x = p[0]; pt.y = p[1];
    var sp = pt.matrixTransform(svg.getScreenCTM());
    var box = mapBox.getBoundingClientRect();
    var x = sp.x - box.left, y = sp.y - box.top;
    if (x < 0 || y < 0 || x > box.width || y > box.height) { hideTip(); return; }
    tip.innerHTML = '';
    var b = document.createElement('b'); b.textContent = s.n; tip.appendChild(b);
    tip.appendChild(document.createTextNode(s.a + ' · ' + s.l));
    tip.hidden = false;
    var half = tip.offsetWidth / 2 + 8;
    tip.style.left = Math.min(Math.max(x, half), box.width - half) + 'px';
    tip.style.top = Math.max(y, tip.offsetHeight + 24) + 'px';
  };
  var showInteriorTip = function () {
    tip.innerHTML = '<b>Interior del país</b>Las Flores (Bs. As.), General Pico (La Pampa) y Tartagal (Salta). Mirá las direcciones en la lista.';
    tip.hidden = false;
    var box = mapBox.getBoundingClientRect();
    tip.style.left = Math.min(Math.max(150, tip.offsetWidth / 2 + 12), box.width - tip.offsetWidth / 2 - 12) + 'px';
    tip.style.top = (tip.offsetHeight + 40) + 'px';
  };
  var hideTip = function () { tip.hidden = true; };

  var zoneBtns = $$('#zones button');
  var paintZones = function () {
    zoneBtns.forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.zone === state.zone));
      var c = b.dataset.zone === 'all' ? SAL.length : SAL.filter(function (s) { return s.z === b.dataset.zone; }).length;
      $('em', b).textContent = c;
    });
  };
  var setZone = function (z) {
    state.zone = z; state.active = null;
    state.q = ''; qInput.value = '';
    if (state.near) { state.near = null; clearUser(); }
    paintZones(); render();
  };
  zoneBtns.forEach(function (b) { b.addEventListener('click', function () { setZone(b.dataset.zone); }); });
  resetBtn.addEventListener('click', function () {
    state.zone = 'all'; state.q = ''; state.near = null; state.active = null; qInput.value = '';
    clearUser(); paintZones(); render();
  });

  /* búsqueda */
  var qTimer;
  var runQuery = function (q, zoom) {
    state.q = (q || '').trim(); state.active = null;
    if (state.near) { state.near = null; clearUser(); }
    state.zone = 'all'; paintZones();
    render({ zoom: zoom });
  };
  qInput.addEventListener('input', function () {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { runQuery(qInput.value); }, 220);
  });
  $('#salonSearch').addEventListener('submit', function (e) { e.preventDefault(); runQuery(qInput.value); });

  /* geolocalización */
  var clearUser = function () { if (userG) { userG.remove(); userG = null; } };
  var locate = function (btn) {
    if (!navigator.geolocation) { statusEl.textContent = 'Tu navegador no permite ubicarte. Escribí tu barrio o localidad.'; return; }
    btn && btn.classList.add('is-busy');
    statusEl.textContent = 'Buscando tu ubicación…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      btn && btn.classList.remove('is-busy');
      state.near = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      state.q = ''; qInput.value = ''; state.zone = 'all'; state.active = null; paintZones();
      clearUser();
      if (inMap(state.near)) {
        var p = px(state.near.lat, state.near.lon);
        userG = el('g', { class: 'm-user', transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, svg);
        el('circle', { r: 18 }, userG); el('circle', { r: 7 }, userG);
      }
      render();
      sizePins();
      var first = $('.salon', listEl);
      if (first) select(Number(first.dataset.id), false);
    }, function () {
      btn && btn.classList.remove('is-busy');
      statusEl.textContent = 'No pudimos acceder a tu ubicación. Escribí tu barrio o localidad en el buscador.';
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
  };
  $('#salonNear').addEventListener('click', function () { locate(this); });

  /* datalist de localidades */
  var dl = $('#localidades');
  var seen = {};
  SAL.map(function (s) { return s.l.replace(/\s*\(.*\)$/, '').split(' / ')[0]; })
    .concat(['CABA', 'Zona Norte', 'Zona Oeste', 'Zona Sur'])
    .sort(function (a, b) { return a.localeCompare(b, 'es'); })
    .forEach(function (l) { if (seen[l]) return; seen[l] = 1; var o = document.createElement('option'); o.value = l; dl.appendChild(o); });

  /* buscador del hero → guía */
  var goSalons = function () {
    var target = $('#salones');
    target.scrollIntoView({ behavior: isLite() ? 'auto' : 'smooth', block: 'start' });
  };
  $('#heroFinder').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = $('#heroQuery').value;
    qInput.value = q;
    runQuery(q, false);
    goSalons();
    setTimeout(function () { render(); }, isLite() ? 0 : 650);
  });
  $('#heroNear').addEventListener('click', function () {
    goSalons();
    locate($('#salonNear'));
  });

  buildMap();
  paintZones();
  setVB(FULL.slice());
  render({ zoom: false });

  /* enlaces compartibles: ?zona=sur o ?q=quilmes */
  (function () {
    var sp = new URLSearchParams(location.search);
    var z = (sp.get('zona') || '').toLowerCase();
    var q = sp.get('q');
    if (ZN[z]) { setZone(z); }
    else if (q) { qInput.value = q; runQuery(q); }
  })();
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(sizePins, 120); });

  /* ==========================================================
     MASAJE GUIADO — 60 s en 3 tramos
     ========================================================== */
  var mDots = $('#mDots');
  var mRing = $('#mRing');
  var mTime = $('#mTime');
  var mPhase = $('#mPhase');
  var mHint = $('#mHint');
  var mStart = $('#mStart');
  var mBars = $$('.massage__bar i');
  var PH = [
    ['1 · La nuca', 'Yemas de los dedos en la base de la nuca: presión suave y movimientos giratorios, sin refregar.'],
    ['2 · Subí', 'Con los mismos giros, subí de a poco hasta masajear todo el cuero cabelludo.'],
    ['3 · Vaivén', 'Manos arriba, dedos entrelazados: movimiento de vaivén hacia atrás y adelante, desplazando el cuero cabelludo.']
  ];
  var dots = [];
  for (var i = 0; i < 8; i++) dots.push(el('circle', { r: 7.5, class: 'massage__dot' }, mDots));
  var placeDots = function (t) {
    var w = 2 * Math.PI * 0.9;
    for (var k = 0; k < 8; k++) {
      var left = k < 4, j = k % 4, x, y;
      if (t < 40) {
        var s = t < 20 ? 0 : (t - 20) / 20;
        var cy = 238 - s * 122;
        var spread = 28 + 22 * Math.sin(Math.PI * s);
        var cx = left ? 150 - spread : 150 + spread;
        var fx = (j - 1.5) * 10 * (left ? -1 : 1);
        var fy = (j - 1.5) * (s > 0 ? 9 : 2);
        x = cx + fx * (s > 0 ? 0.35 : 1) + 5 * Math.cos(w * t + k);
        y = cy + fy + 5 * Math.sin(w * t + k);
      } else {
        x = 150 + (k - 3.5) * 10;
        y = 150 + 16 * Math.sin(2 * Math.PI * 0.6 * (t - 40)) + (k % 2 ? 5 : -5);
      }
      dots[k].setAttribute('cx', x.toFixed(1));
      dots[k].setAttribute('cy', y.toFixed(1));
    }
  };
  placeDots(0);
  var mRaf = null, mT0 = 0;
  var mSet = function (t) {
    var ph = t >= 60 ? 2 : Math.floor(t / 20);
    mRing.style.strokeDashoffset = String(1 - Math.min(t, 60) / 60);
    mTime.textContent = Math.max(0, Math.ceil(60 - t)) + '″';
    mBars.forEach(function (b, n) { b.style.setProperty('--p', Math.max(0, Math.min(1, (t - n * 20) / 20)).toFixed(3)); });
    if (t < 60) { mPhase.textContent = PH[ph][0]; mHint.textContent = PH[ph][1]; }
  };
  var mLoop = function (now) {
    var t = (now - mT0) / 1000;
    if (t >= 60) {
      mSet(60); placeDots(0);
      mPhase.textContent = '¡Listo!';
      mHint.textContent = 'Repetilo mañana y noche, después de aplicar la loción. La constancia es lo que da resultado.';
      mStart.textContent = 'Repetir el masaje';
      mRaf = null;
      return;
    }
    mSet(t);
    placeDots(t);
    mRaf = requestAnimationFrame(mLoop);
  };
  mStart.addEventListener('click', function () {
    if (mRaf) cancelAnimationFrame(mRaf);
    mT0 = performance.now();
    mStart.textContent = 'Empezar de nuevo';
    mRaf = requestAnimationFrame(mLoop);
  });

  /* ---------- sumar salón ---------- */
  $('#joinForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#jName'), loc = $('#jLoc'), err = $('#jErr');
    var ok = true;
    [name, loc].forEach(function (f) {
      var bad = !f.value.trim();
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) { (name.value.trim() ? loc : name).focus(); return; }
    var trat = ($('input[name="jTrat"]:checked') || {}).value || '';
    var msg = 'Hola Vigor Hair, tengo un salón y quiero sumar la línea.\n' +
      '• Salón: ' + name.value.trim() + '\n' +
      '• Localidad: ' + loc.value.trim() + '\n' +
      '• Tratamientos capilares: ' + trat;
    window.open(waUrl(msg), '_blank', 'noopener');
  });

  /* ---------- watchdog de FPS → LITE en caliente ---------- */
  if (!isLite() && !isQA && !html.classList.contains('full')) {
    var frames = 0, t0 = 0, tries = 0;
    var measure = function (now) {
      if (!t0) t0 = now;
      frames++;
      if (now - t0 < 2000) { requestAnimationFrame(measure); return; }
      var fps = frames * 1000 / (now - t0);
      if (fps < 12 && tries < 2) { tries++; frames = 0; t0 = 0; setTimeout(function () { requestAnimationFrame(measure); }, 1500); return; }
      if (fps >= 12 && fps < 28) {
        html.classList.add('lite');
        try { sessionStorage.setItem('vh-mode', 'lite'); } catch (e) {}
      }
    };
    setTimeout(function () { requestAnimationFrame(measure); }, 2500);
  }
})();
