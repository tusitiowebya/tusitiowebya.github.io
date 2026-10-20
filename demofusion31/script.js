(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '5491156676002';
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 30); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    links.classList.toggle('is-open', open);
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    });
  });

  /* ---------- fitText: una palabra nunca se corta (letra grande en Android) ---------- */
  function fitText() {
    $$('[data-fit]').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard < 80) {
        size -= 1; guard++;
        el.style.fontSize = size + 'px';
      }
    });
  }
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  var rT;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(fitText, 120); });

  /* ---------- tríptico: los tres materiales se juntan al cargar ---------- */
  var tri = $('#tri');
  if (tri && !reduce) {
    tri.classList.add('is-loading');
    $$('.tri__panel', tri).forEach(function (p, i) { p.style.transitionDelay = (i * 120) + 'ms'; });
    setTimeout(function () {
      tri.classList.remove('is-loading');
      setTimeout(function () { $$('.tri__panel', tri).forEach(function (p) { p.style.transitionDelay = ''; }); }, 1400);
    }, 250);
  }
  $$('.tri__panel video').forEach(function (v) {
    var p = v.play && v.play();
    if (p && p.catch) p.catch(function () {});
  });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          var sib = $$('.reveal', e.target.parentNode).indexOf(e.target);
          e.target.style.transitionDelay = Math.max(0, sib) * 80 + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });

    var ov = $('#obraVideo');
    if (ov) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var p = ov.play(); if (p && p.catch) p.catch(function () {}); }
          else ov.pause();
        });
      }, { threshold: 0.3 }).observe(ov);
    }
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- FAB: se esconde arriba y en el cierre ---------- */
  var fab = $('#fab'), heroCta = $('.hero__cta'), close = $('.close');
  if (fab && 'IntersectionObserver' in window) {
    var vis = { hero: true, close: false };
    var upd = function () { fab.classList.toggle('is-hidden', vis.hero || vis.close); };
    new IntersectionObserver(function (es) { vis.hero = es[0].isIntersecting; upd(); }).observe(heroCta);
    new IntersectionObserver(function (es) { vis.close = es[0].isIntersecting; upd(); }).observe(close);
  }

  /* ---------- fusión real: puntos sobre la foto ---------- */
  var photo = $('#fusionPhoto');
  var setHot = function (i) {
    $$('.hot', photo).forEach(function (h) { h.classList.toggle('is-on', +h.dataset.hot === i); });
    $$('#legend button').forEach(function (b) { b.classList.toggle('is-on', +b.dataset.hot === i); });
  };
  $$('[data-hot]').forEach(function (el) {
    el.addEventListener('click', function () {
      var i = +el.dataset.hot;
      if (photo.classList.contains('no-hots')) showPhoto($('.fusion__thumbs button'));
      setHot(i);
    });
  });
  function showPhoto(btn) {
    $$('.fusion__thumbs button').forEach(function (b) { b.classList.toggle('is-on', b === btn); });
    $('img', photo).src = btn.dataset.src;
    $('img', photo).alt = $('img', btn).alt || 'Bajo mesada de hierro y madera';
    photo.classList.toggle('no-hots', !btn.dataset.hots);
  }
  $$('.fusion__thumbs button').forEach(function (b) {
    b.addEventListener('click', function () { showPhoto(b); setHot(-1); });
  });

  /* ---------- lightbox de la cocina ---------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg');
  $$('[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      lbImg.src = b.dataset.full;
      lbImg.alt = $('img', b).alt;
      if (lb.showModal) lb.showModal(); else window.open(b.dataset.full, '_blank');
    });
  });
  $('#lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });

  /* =========================================================
     MESA DE MEDIDAS — configurador 3 en 1
     ========================================================= */
  var OFICIO = {
    mueble: { n: 'Mueble', mat: 'madera', color: 'linear-gradient(120deg,#DCA873,#9C6534)' },
    abertura: { n: 'Abertura', mat: 'aluminio', color: 'linear-gradient(180deg,#F2F4F6,#8B939B)' },
    herreria: { n: 'Herrería', mat: 'hierro', color: 'linear-gradient(135deg,#55565B,#141416)' }
  };
  var TIPOS = {
    mueble: [
      { id: 'cocina', n: 'Bajo mesada de cocina', w: 240, h: 90, p: 60 },
      { id: 'alacena', n: 'Alacena', w: 200, h: 70, p: 35 },
      { id: 'placard', n: 'Placar', w: 180, h: 240, p: 60 },
      { id: 'vestidor', n: 'Vestidor', w: 240, h: 240, p: 55 },
      { id: 'banio', n: 'Mueble de baño', w: 80, h: 85, p: 45 },
      { id: 'living', n: 'Mueble de living', w: 180, h: 60, p: 40 },
      { id: 'dormitorio', n: 'Cómoda / dormitorio', w: 120, h: 80, p: 45 },
      { id: 'oficina', n: 'Escritorio / oficina', w: 140, h: 75, p: 60 }
    ],
    abertura: [
      { id: 'ventana', n: 'Ventana', w: 150, h: 110 },
      { id: 'puerta', n: 'Puerta', w: 90, h: 205 },
      { id: 'cerramiento', n: 'Cerramiento / ventanal', w: 300, h: 220 },
      { id: 'mampara', n: 'Mampara de baño', w: 100, h: 190 }
    ],
    herreria: [
      { id: 'porton', n: 'Portón', w: 300, h: 200 },
      { id: 'reja', n: 'Reja de ventana', w: 120, h: 110 },
      { id: 'baranda', n: 'Baranda', w: 300, h: 90 },
      { id: 'estructura', n: 'Estructura metálica', w: 400, h: 260 }
    ]
  };
  function optsFor(of, tipo) {
    var o = [];
    if (of === 'mueble') {
      var tall = tipo === 'placard' || tipo === 'vestidor';
      o.push({ k: 'Frente', v: tipo === 'vestidor' ? ['Abierto', 'Corredizas', 'Puertas'] : tall ? ['Corredizas', 'Puertas'] : tipo === 'oficina' ? ['Con cajonera', 'Sin cajones'] : ['Puertas', 'Cajones', 'Mixto'] });
      o.push({ k: 'Color', v: ['Negro', 'Madera', 'Blanco', 'Gris', 'A definir'] });
      if (tipo === 'cocina') o.push({ k: 'Mesada', v: ['De madera', 'La pongo yo', 'A definir'] });
      o.push({ k: 'Hierro', v: ['Sin hierro', 'Estructura de hierro'] });
    } else if (of === 'abertura') {
      if (tipo === 'puerta') {
        o.push({ k: 'Tipo', v: ['Con vidrio', 'Mitad vidrio', 'Ciega'] });
      } else if (tipo === 'mampara') {
        o.push({ k: 'Apertura', v: ['Corrediza', 'Batiente', 'Paño fijo'] });
      } else {
        o.push({ k: 'Apertura', v: ['Corrediza', 'De abrir', 'Paño fijo'] });
        o.push({ k: 'Hojas', v: tipo === 'cerramiento' ? ['2', '3', '4'] : ['1', '2', '3'] });
      }
      if (tipo !== 'mampara') o.push({ k: 'Línea', v: ['Moderna', 'Tradicional', 'A definir'] });
      o.push({ k: 'Color', v: ['Negro', 'Blanco', 'Natural', 'A definir'] });
      if (tipo !== 'mampara') o.push({ k: 'Vidrio', v: ['DVH', 'Simple', 'A definir'] });
    } else {
      if (tipo === 'porton') o.push({ k: 'Apertura', v: ['Corredizo', 'Dos hojas', 'Una hoja'] });
      if (tipo === 'estructura') {
        o.push({ k: 'Para', v: ['Techo', 'Entrepiso', 'Escalera', 'Otro'] });
      } else {
        o.push({ k: 'Diseño', v: tipo === 'baranda' ? ['Barrotes verticales', 'Horizontales', 'Con vidrio', 'Diseño propio'] : ['Barrotes verticales', 'Horizontales', 'Chapa ciega', 'Diseño propio'] });
      }
      o.push({ k: 'Terminación', v: ['Negro', 'Gris', 'Antióxido', 'A definir'] });
    }
    return o;
  }

  var st = { of: 'mueble', tipo: 'cocina', w: 240, h: 90, p: 60, sel: {} };
  var cart = store.get('f31-proyecto');
  if (!Array.isArray(cart)) cart = [];

  var oficioPick = $('#oficioPick'), tipoChips = $('#tipoChips'), optsBox = $('#opts');
  var inA = $('#inAncho'), inH = $('#inAlto'), inP = $('#inProf'), profWrap = $('#profWrap');

  function tipoObj() { return TIPOS[st.of].filter(function (t) { return t.id === st.tipo; })[0]; }
  function radioGroup(box, items, cur, onPick) {
    box.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', it.v === cur ? 'true' : 'false');
      b.textContent = it.n;
      b.addEventListener('click', function () { onPick(it.v); });
      box.appendChild(b);
    });
  }
  function setOficio(of, keepScroll) {
    st.of = of;
    $$('button', oficioPick).forEach(function (b) { b.setAttribute('aria-checked', b.dataset.oficio === of ? 'true' : 'false'); });
    setTipo(TIPOS[of][0].id);
  }
  function setTipo(id) {
    st.tipo = id;
    var t = tipoObj();
    st.w = t.w; st.h = t.h; st.p = t.p || 0;
    inA.value = st.w; inH.value = st.h; inP.value = st.p || '';
    profWrap.hidden = st.of !== 'mueble';
    $('#dimsHint').textContent = st.of === 'abertura' ? 'Medí el vano en tres puntos y pasanos la menor. Antes de fabricar medimos nosotros.'
      : st.of === 'herreria' ? (id === 'baranda' ? 'Largo total del tramo y alto de la baranda.' : 'Ancho y alto del hueco a cubrir.')
      : 'Largo de la pared, altura disponible y profundidad. No hace falta que sean exactas.';
    st.sel = {};
    optsFor(st.of, id).forEach(function (o) { st.sel[o.k] = o.v[0]; });
    $$('.dims input').forEach(function (i) { i.classList.remove('is-bad'); });
    renderTipos(); renderOpts(); draw();
  }
  function renderTipos() {
    radioGroup(tipoChips, TIPOS[st.of].map(function (t) { return { v: t.id, n: t.n }; }), st.tipo, setTipo);
  }
  function renderOpts() {
    optsBox.innerHTML = '';
    optsFor(st.of, st.tipo).forEach(function (o) {
      var wrap = document.createElement('div'); wrap.className = 'opt';
      var p = document.createElement('p'); p.textContent = o.k; wrap.appendChild(p);
      var row = document.createElement('div'); row.setAttribute('role', 'radiogroup'); row.setAttribute('aria-label', o.k);
      wrap.appendChild(row); optsBox.appendChild(wrap);
      radioGroup(row, o.v.map(function (v) { return { v: v, n: v }; }), st.sel[o.k], function (v) {
        st.sel[o.k] = v; renderOpts(); draw();
      });
    });
  }
  $$('button', oficioPick).forEach(function (b) { b.addEventListener('click', function () { setOficio(b.dataset.oficio); }); });

  function num(v) {
    var n = parseFloat(String(v).replace(',', '.').replace(/[^\d.]/g, ''));
    return isFinite(n) ? n : NaN;
  }
  function okDim(n) { return n >= 10 && n <= 2000; }
  [[inA, 'w'], [inH, 'h'], [inP, 'p']].forEach(function (pair) {
    pair[0].addEventListener('input', function () {
      var n = num(pair[0].value);
      var bad = pair[0].value.trim() !== '' && !okDim(n);
      pair[0].classList.toggle('is-bad', bad);
      if (okDim(n)) { st[pair[1]] = Math.round(n * 10) / 10; draw(); }
    });
  });

  /* ---------- plano SVG ---------- */
  var svg = $('#planSvg'), NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  }
  function line(x1, y1, x2, y2, cls, extra) { var a = { x1: x1, y1: y1, x2: x2, y2: y2, 'class': cls || 'pz-f' }; for (var k in extra) a[k] = extra[k]; return el('line', a); }
  function rect(x, y, w, h, cls, extra) { var a = { x: x, y: y, width: Math.max(0, w), height: Math.max(0, h), 'class': cls || 'pz' }; for (var k in extra) a[k] = extra[k]; return el('rect', a); }
  function txt(x, y, s, cls, anchor) { var t = el('text', { x: x, y: y, 'class': cls || 'cota-t', 'text-anchor': anchor || 'middle' }); t.textContent = s; return t; }
  function fmt(n) { return String(n).replace('.', ',') + ' cm'; }
  function frontFill() {
    var c = st.sel.Color;
    return c === 'Madera' ? 'pz-fill-wood' : 'pz-fill-dark';
  }

  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var W = st.w, H = st.h;
    var maxW = 300, maxH = 210, x0 = 34, y0 = 26;
    var s = Math.min(maxW / W, maxH / H);
    var w = W * s, h = H * s;
    var x = x0 + (maxW - w) / 2, y = y0 + (maxH - h) / 2;
    var g = el('g', { 'class': 'piece' });
    var put = function (node) { g.appendChild(node); return node; };
    var R = function (a, b, c, d, cls, ex) { return put(rect(a, b, c, d, cls, ex)); };
    var L = function (a, b, c, d, cls, ex) { return put(line(a, b, c, d, cls, ex)); };
    var D = { pathLength: 100, 'class': 'pz draw' };

    if (st.of === 'mueble') drawMueble(x, y, w, h, s, R, L, D);
    else if (st.of === 'abertura') drawAbertura(x, y, w, h, s, R, L, D);
    else drawHerreria(x, y, w, h, s, R, L, D);

    // cotas
    var cy = Math.min(y + h + 22, 292);
    line(x, cy, x + w, cy, 'cota'); line(x, cy - 5, x, cy + 5, 'cota'); line(x + w, cy - 5, x + w, cy + 5, 'cota');
    line(x, y + h + 4, x, cy + 5, 'cota', { 'stroke-dasharray': '2 3' }); line(x + w, y + h + 4, x + w, cy + 5, 'cota', { 'stroke-dasharray': '2 3' });
    txt(x + w / 2, cy - 6, fmt(W));
    var cx = Math.min(x + w + 22, 392);
    line(cx, y, cx, y + h, 'cota'); line(cx - 5, y, cx + 5, y, 'cota'); line(cx - 5, y + h, cx + 5, y + h, 'cota');
    var vt = txt(cx + 6, y + h / 2, fmt(H), 'cota-t', 'middle');
    vt.setAttribute('transform', 'rotate(-90 ' + (cx + 6) + ' ' + (y + h / 2) + ')');
    vt.setAttribute('dy', '10');

    var t = tipoObj();
    $('#planTitle').textContent = t.n;
    $('#planScale').textContent = st.of === 'mueble' && st.p ? 'PROF. ' + fmt(st.p) : 'MEDIDAS EN CM';
    $('#planSpecs').textContent = specText();
  }

  function drawMueble(x, y, w, h, s, R, L, D) {
    var put = function (node) { svg.querySelector('.piece').appendChild(node); };
    var t = st.tipo, frente = st.sel.Frente, ff = frontFill();
    var iron = st.sel.Hierro === 'Estructura de hierro';
    var top = y, body = h;
    if (t === 'cocina') {
      var mt = Math.max(6, 4 * s);
      R(x - 4, y, w + 8, mt, st.sel.Mesada === 'De madera' ? 'pz-fill-wood' : 'pz', { pathLength: 100 });
      top = y + mt; body = h - mt;
    }
    if (t === 'oficina') {
      var tt = Math.max(5, 4 * s);
      R(x, y, w, tt, ff === 'pz-fill-wood' ? 'pz-fill-wood' : 'pz');
      var leg = Math.max(4, 5 * s);
      R(x + 4, y + tt, leg, h - tt, iron ? 'pz-fill-dark' : 'pz'); R(x + w - 4 - leg, y + tt, leg, h - tt, iron ? 'pz-fill-dark' : 'pz');
      if (frente === 'Con cajonera') {
        var cw = Math.min(w * .3, 45 * s), cx = x + w - 6 - leg - cw, ch = (h - tt) * .75;
        R(cx, y + tt, cw, ch, ff);
        for (var k = 1; k < 3; k++) L(cx, y + tt + ch * k / 3, cx + cw, y + tt + ch * k / 3);
        for (k = 0; k < 3; k++) L(cx + cw * .35, y + tt + ch * (k + .5) / 3, cx + cw * .65, y + tt + ch * (k + .5) / 3, 'pz-f', { 'stroke-width': 2.4 });
      }
      if (iron) L(x + 4, y + h - 10 * s, x + w - 4, y + h - 10 * s, 'pz', { 'stroke-width': 3 });
      return;
    }
    var zocalo = (t === 'cocina' || t === 'banio' || t === 'dormitorio') ? Math.max(4, 8 * s) : 0;
    R(x, top, w, body - zocalo, ff, D);
    if (zocalo) R(x + 4, top + body - zocalo, w - 8, zocalo, iron ? 'pz-fill-dark' : 'pz');
    if (iron) {
      R(x - 3, top - 3, w + 6, body + 3, 'pz', { 'stroke-width': 4, stroke: '#9AA3AD' });
    }
    var bh = body - zocalo;
    if (t === 'banio') {
      var bw = Math.min(w * .6, 50 * s);
      put(el('ellipse', { cx: x + w / 2, cy: top - 2, rx: bw / 2, ry: Math.max(3, 4 * s), 'class': 'pz-f' }, null));
    }
    if (frente === 'Abierto') {
      var nCol = Math.max(2, Math.round((w / s) / 80));
      for (var c = 1; c < nCol; c++) L(x + w * c / nCol, top, x + w * c / nCol, top + bh);
      for (c = 0; c < nCol; c++) {
        var cx0 = x + w * c / nCol, cw0 = w / nCol;
        if (c % 2 === 0) {
          L(cx0 + 4, top + bh * .18, cx0 + cw0 - 4, top + bh * .18, 'pz-f', { 'stroke-width': 2 });
          for (var hh = 0; hh < 5; hh++) L(cx0 + cw0 * (.2 + hh * .14), top + bh * .18, cx0 + cw0 * (.2 + hh * .14), top + bh * .5, 'pz-f', { opacity: .5 });
          for (var sh = 0; sh < 3; sh++) L(cx0, top + bh * (.62 + sh * .12), cx0 + cw0, top + bh * (.62 + sh * .12));
        } else {
          for (var sh2 = 1; sh2 < 6; sh2++) L(cx0, top + bh * sh2 / 6, cx0 + cw0, top + bh * sh2 / 6);
        }
      }
      return;
    }
    if (frente === 'Corredizas') {
      var nP = (w / s) > 200 ? 3 : 2, pw = w / nP;
      for (var i = 0; i < nP; i++) {
        var ox = x + pw * i + (i % 2 ? -3 : 3);
        R(ox + 2, top + 4, pw - 4 + (i % 2 ? 6 : 0), bh - 8, i % 2 ? 'pz-f' : 'pz-f');
        L(ox + (i % 2 ? pw - 6 : 10), top + bh * .45, ox + (i % 2 ? pw - 6 : 10), top + bh * .55, 'pz-f', { 'stroke-width': 3 });
      }
      L(x + 6, top + 2, x + w - 6, top + 2, 'pz-f', { opacity: .5 });
      return;
    }
    var mod = (t === 'placard' || t === 'vestidor') ? 50 : 60;
    var n = Math.max(1, Math.round((w / s) / mod)), mw = w / n;
    for (var m = 0; m < n; m++) {
      var mx = x + mw * m;
      if (m) L(mx, top, mx, top + bh);
      var drawers = frente === 'Cajones' || (frente === 'Mixto' && m === 0) || t === 'dormitorio';
      if (drawers) {
        var nd = bh / s > 70 ? 4 : 3;
        for (var d = 1; d < nd; d++) L(mx + 3, top + bh * d / nd, mx + mw - 3, top + bh * d / nd);
        for (d = 0; d < nd; d++) L(mx + mw * .38, top + bh * d / nd + 7, mx + mw * .62, top + bh * d / nd + 7, 'pz-f', { 'stroke-width': 2.4 });
      } else {
        var hx = m % 2 ? mx + 8 : mx + mw - 8;
        var hy = t === 'alacena' ? top + bh - 14 : top + 10;
        L(hx, hy, hx, hy + Math.min(18, bh * .25), 'pz-f', { 'stroke-width': 2.4 });
        if (t === 'living' && n > 2 && m === Math.floor(n / 2)) {
          L(mx + 4, top + bh * .5, mx + mw - 4, top + bh * .5, 'pz-f');
        }
      }
    }
  }

  function drawAbertura(x, y, w, h, s, R, L, D) {
    var t = st.tipo, dvh = st.sel.Vidrio === 'DVH';
    R(x, y, w, h, 'pz', { 'stroke-width': 4, pathLength: 100, 'class': 'pz draw' });
    var fr = Math.max(5, 5 * s);
    var ix = x + fr, iy = y + fr, iw = w - 2 * fr, ih = h - 2 * fr;
    if (t === 'puerta') {
      R(ix, iy, iw, ih + fr, 'pz-f');
      var tp = st.sel.Tipo;
      if (tp === 'Con vidrio') { R(ix + 8, iy + 8, iw - 16, ih * .72, 'pz-fill-glass'); }
      else if (tp === 'Mitad vidrio') { R(ix + 8, iy + 8, iw - 16, ih * .42, 'pz-fill-glass'); R(ix + 8, iy + ih * .5, iw - 16, ih * .44, 'pz-f'); }
      else { R(ix + 8, iy + 8, iw - 16, ih * .42, 'pz-f'); R(ix + 8, iy + ih * .5, iw - 16, ih * .44, 'pz-f'); }
      L(ix + iw - 10, iy + ih * .52, ix + iw - 10, iy + ih * .6, 'pz-f', { 'stroke-width': 3 });
      L(ix, iy, ix + iw, iy + ih / 2, 'pz-f', { 'stroke-dasharray': '4 4', opacity: .6 });
      L(ix, iy + ih + fr, ix + iw, iy + ih / 2, 'pz-f', { 'stroke-dasharray': '4 4', opacity: .6 });
      return;
    }
    var ap = st.sel.Apertura;
    var n = t === 'mampara' ? (ap === 'Paño fijo' ? 1 : 2) : parseInt(st.sel.Hojas || '2', 10);
    var hw = iw / n;
    for (var i = 0; i < n; i++) {
      var hx = ix + hw * i, off = (ap === 'Corrediza' && n > 1) ? (i % 2 ? -4 : 4) : 0;
      R(hx + off + 1, iy, hw - 2, ih, 'pz-fill-glass');
      if (dvh) R(hx + off + 6, iy + 5, hw - 12, ih - 10, 'pz-f', { opacity: .55 });
      if (ap === 'Corrediza' && n > 1) {
        var ay = iy + ih / 2, dir = i % 2 ? -1 : 1, ax = hx + hw / 2;
        L(ax - 12, ay, ax + 12, ay, 'pz-f', { opacity: .7 });
        L(ax + 12 * dir, ay, ax + 7 * dir, ay - 4, 'pz-f', { opacity: .7 });
        L(ax + 12 * dir, ay, ax + 7 * dir, ay + 4, 'pz-f', { opacity: .7 });
      } else if (ap === 'De abrir' || ap === 'Batiente') {
        var hinge = i % 2 ? hx + hw - 2 : hx + 2, far = i % 2 ? hx + 2 : hx + hw - 2;
        L(far, iy, hinge, iy + ih / 2, 'pz-f', { 'stroke-dasharray': '4 4', opacity: .65 });
        L(far, iy + ih, hinge, iy + ih / 2, 'pz-f', { 'stroke-dasharray': '4 4', opacity: .65 });
      } else if (ap === 'Paño fijo') {
        txt(hx + hw / 2, iy + ih / 2 + 4, 'FIJO', 'lbl');
      }
    }
    if (t === 'mampara') {
      put(el('circle', { cx: x + w * .8, cy: y - 2, r: 5, 'class': 'pz-f' }, null));
    }
    function put(node) { svg.querySelector('.piece').appendChild(node); }
  }

  function drawHerreria(x, y, w, h, s, R, L, D) {
    var t = st.tipo, dis = st.sel['Diseño'];
    if (t === 'estructura') {
      var colW = Math.max(5, 10 * s), beam = Math.max(6, 12 * s);
      R(x, y, colW, h, 'pz-fill-dark', { stroke: '#E8EEF4', 'stroke-width': 1.6 });
      R(x + w - colW, y, colW, h, 'pz-fill-dark', { stroke: '#E8EEF4', 'stroke-width': 1.6 });
      R(x, y, w, beam, 'pz', { pathLength: 100, 'class': 'pz draw' });
      var bays = Math.max(2, Math.round((w / s) / 80)), bw = (w - 2 * colW) / bays;
      R(x + colW, y + beam, w - 2 * colW, beam * 2.2, 'pz-f');
      for (var b = 0; b < bays; b++) {
        var bx = x + colW + bw * b;
        L(bx, y + beam, bx + bw / 2, y + beam * 3.2); L(bx + bw / 2, y + beam * 3.2, bx + bw, y + beam);
      }
      if (st.sel.Para === 'Escalera') {
        var steps = 8;
        for (var k = 0; k < steps; k++) L(x + colW + (w - 2 * colW) * k / steps, y + h - (h * .6) * k / steps, x + colW + (w - 2 * colW) * (k + 1) / steps, y + h - (h * .6) * k / steps, 'pz-fill-wood', { 'stroke-width': 4 });
      }
      return;
    }
    if (t === 'baranda') {
      var postGap = Math.max(1, Math.round((w / s) / 110)), pg = w / postGap;
      R(x, y, w, Math.max(4, 5 * s), 'pz', { pathLength: 100, 'class': 'pz draw' });
      for (var p = 0; p <= postGap; p++) R(x + pg * p - 2, y, 4, h, 'pz-fill-dark', { stroke: '#E8EEF4', 'stroke-width': 1.4 });
      fillBars(x, y + 6, w, h - 6, s, dis, L, R);
      return;
    }
    R(x, y, w, h, 'pz', { 'stroke-width': 4, pathLength: 100, 'class': 'pz draw' });
    var ap = st.sel.Apertura;
    if (t === 'porton' && ap === 'Dos hojas') {
      L(x + w / 2, y, x + w / 2, y + h, 'pz', { 'stroke-width': 3 });
      fillBars(x + 4, y + 4, w / 2 - 6, h - 8, s, dis, L, R);
      fillBars(x + w / 2 + 2, y + 4, w / 2 - 6, h - 8, s, dis, L, R);
    } else {
      fillBars(x + 4, y + 4, w - 8, h - 8, s, dis, L, R);
    }
    if (t === 'porton' && ap === 'Corredizo') {
      L(x - 14, y + h + 6, x + w + 14, y + h + 6, 'pz-f', { opacity: .7 });
      [0.15, 0.85].forEach(function (f) { put(el('circle', { cx: x + w * f, cy: y + h + 2, r: 4, 'class': 'pz-f' }, null)); });
      L(x + w * .45, y + h * .5, x + w * .58, y + h * .5, 'pz-f', { 'stroke-width': 2 });
    }
    function put(node) { svg.querySelector('.piece').appendChild(node); }
  }
  function fillBars(x, y, w, h, s, dis, L, R) {
    if (dis === 'Chapa ciega') { R(x, y, w, h, 'pz-fill-dark'); return; }
    if (dis === 'Con vidrio') { R(x + 3, y + 3, w - 6, h - 10, 'pz-fill-glass'); return; }
    if (dis === 'Diseño propio') {
      var step = Math.max(14, 25 * s);
      for (var dx = -h; dx < w; dx += step) {
        L(Math.max(x, x + dx), y + Math.max(0, -dx), Math.min(x + w, x + dx + h), y + Math.min(h, w - dx), 'pz-f', { opacity: .55 });
        L(Math.max(x, x + dx), y + h - Math.max(0, -dx), Math.min(x + w, x + dx + h), y + h - Math.min(h, w - dx), 'pz-f', { opacity: .55 });
      }
      return;
    }
    var gap = Math.max(5, 11 * s);
    if (dis === 'Horizontales') { for (var yy = y + gap; yy < y + h - 2; yy += gap) L(x, yy, x + w, yy); }
    else { for (var xx = x + gap; xx < x + w - 2; xx += gap) L(xx, y, xx, y + h); }
  }

  function specText(item) {
    var it = item || { of: st.of, tipo: st.tipo, w: st.w, h: st.h, p: st.p, sel: st.sel };
    var dims = it.w + ' × ' + it.h + (it.of === 'mueble' && it.p ? ' × ' + it.p : '') + ' cm';
    var parts = [dims.replace(/\./g, ',')];
    for (var k in it.sel) parts.push(k + ': ' + it.sel[k]);
    return parts.join(' · ');
  }

  /* ---------- proyecto (carrito) ---------- */
  var cartList = $('#cartList'), cartMeta = $('#cartMeta'), cartData = $('#cartData'), cartBox = $('#cart');
  function tipoName(of, id) { return TIPOS[of].filter(function (t) { return t.id === id; })[0].n; }
  function renderCart(justAdded) {
    cartList.innerHTML = '';
    cart.forEach(function (it, i) {
      var li = document.createElement('li');
      var sw = document.createElement('i'); sw.style.background = OFICIO[it.of].color; li.appendChild(sw);
      var d = document.createElement('div');
      var b = document.createElement('b'); b.textContent = (i + 1) + '. ' + tipoName(it.of, it.tipo);
      var sm = document.createElement('small'); sm.textContent = specText(it);
      d.appendChild(b); d.appendChild(sm); li.appendChild(d);
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×';
      x.setAttribute('aria-label', 'Quitar ' + tipoName(it.of, it.tipo));
      x.addEventListener('click', function () { cart.splice(i, 1); save(); renderCart(); });
      li.appendChild(x);
      cartList.appendChild(li);
    });
    var ofs = {};
    cart.forEach(function (it) { ofs[it.of] = true; });
    $('#cartHex .f--top').classList.toggle('on', !!ofs.mueble);
    $('#cartHex .f--l').classList.toggle('on', !!ofs.abertura);
    $('#cartHex .f--r').classList.toggle('on', !!ofs.herreria);
    var mats = Object.keys(ofs).map(function (o) { return OFICIO[o].mat; });
    var full = mats.length === 3;
    cartMeta.textContent = !cart.length ? 'Todavía no sumaste piezas.'
      : full ? '¡Proyecto 3 en 1! ' + cart.length + ' piezas de madera, aluminio y hierro.'
      : cart.length + (cart.length === 1 ? ' pieza' : ' piezas') + ' · ' + mats.join(' + ');
    if (full && justAdded) { cartBox.classList.remove('is-full'); void cartBox.offsetWidth; cartBox.classList.add('is-full'); }
    cartData.hidden = !cart.length;
    updateWa();
  }
  function save() { store.set('f31-proyecto', cart); }
  $('#addPiece').addEventListener('click', function () {
    var bad = false;
    [[inA, 'w'], [inH, 'h']].concat(st.of === 'mueble' ? [[inP, 'p']] : []).forEach(function (pair) {
      var n = num(pair[0].value);
      if (!okDim(n)) { pair[0].classList.add('is-bad'); bad = true; }
    });
    if (bad) { $('#dimsHint').textContent = 'Revisá las medidas: van en centímetros, entre 10 y 2000.'; return; }
    var sel = {}; for (var k in st.sel) sel[k] = st.sel[k];
    cart.push({ of: st.of, tipo: st.tipo, w: st.w, h: st.h, p: st.of === 'mueble' ? st.p : 0, sel: sel });
    save(); renderCart(true);
    if (window.innerWidth < 900) cartBox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  $('#resetCart').addEventListener('click', function () { cart = []; save(); renderCart(); });

  var inNombre = $('#inNombre'), inLoc = $('#inLoc'), inCuando = $('#inCuando'), inFotos = $('#inFotos'), sendWa = $('#sendWa');
  var datos = store.get('f31-datos') || {};
  if (datos.n) inNombre.value = datos.n;
  if (datos.l) inLoc.value = datos.l;
  if (datos.c) inCuando.value = datos.c;
  inFotos.checked = !!datos.f;
  function updateWa() {
    var lines = ['Hola Matías! Vengo de la web de Fusión 3-1. Quiero presupuesto para este proyecto:', ''];
    cart.forEach(function (it, i) {
      lines.push((i + 1) + ') ' + OFICIO[it.of].n.toUpperCase() + ' · ' + tipoName(it.of, it.tipo) + ' · ' + specText(it));
    });
    lines.push('');
    if (inLoc.value.trim()) lines.push('Localidad: ' + inLoc.value.trim());
    lines.push('Para cuándo: ' + inCuando.value);
    if (inFotos.checked) lines.push('Tengo fotos o un plano del lugar para mandarte.');
    if (inNombre.value.trim()) lines.push('Soy ' + inNombre.value.trim() + '.');
    sendWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
    store.set('f31-datos', { n: inNombre.value, l: inLoc.value, c: inCuando.value, f: inFotos.checked });
  }
  [inNombre, inLoc, inCuando, inFotos].forEach(function (i) { i.addEventListener('input', updateWa); i.addEventListener('change', updateWa); });

  /* atajos desde el hero y las muestras */
  $$('[data-oficio]').forEach(function (b) {
    if (b.closest('#oficioPick')) return;
    b.addEventListener('click', function (e) {
      setOficio(b.dataset.oficio);
      if (b.tagName === 'BUTTON') {
        e.preventDefault();
        $('#proyecto').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  setOficio('mueble');
  renderCart();
})();
