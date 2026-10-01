/* Óptima Soluciones Integrales — demo TuPaginaYa */
(function () {
  'use strict';

  var WA = '5491156653123';
  var params = new URLSearchParams(location.search);
  if (params.has('qa')) document.documentElement.classList.add('qa');

  /* ---------- Servicios (orden = rueda, empezando arriba y en sentido horario) ---------- */
  var SERVICES = [
    { id: 'electricidad', name: 'Electricidad', fam: 'Electricidad', grp: 'inst', c: '#E5A800', light: true,
      desc: 'Instalaciones, tableros, cableado y mantenimiento general.',
      text: 'Montaje, reparación y mantenimiento de instalaciones eléctricas residenciales y comerciales: tableros, cableado, bocas y circuitos nuevos.' },
    { id: 'plomeria', name: 'Plomería', fam: 'Agua', grp: 'inst', c: '#3DA34A',
      desc: 'Instalación, reparación y mantenimiento de agua y desagües.',
      text: 'Instalación, reparación y mantenimiento de sistemas de agua y desagües, para que todo funcione como corresponde.' },
    { id: 'soldadura', name: 'Soldadura', fam: 'Metal', grp: 'inst', c: '#1B2433',
      desc: 'Trabajos en distintos materiales y estructuras.',
      text: 'Trabajos de soldadura en distintos materiales y estructuras, para hogares, comercios e industrias.' },
    { id: 'mantenimiento', name: 'Mantenimiento integral', fam: 'Mantenimiento', grp: 'inst', c: '#6E819C',
      desc: 'Para el hogar, comercios e industrias.',
      text: 'Servicio de mantenimiento para hogares, comercios e industrias, con contratos a medida para empresas.' },
    { id: 'porcelanato', name: 'Colocación de porcelanato', short: 'Porcelanato', fam: 'Refacción y obra', grp: 'obra', c: '#13285A',
      desc: 'Pisos y paredes con terminaciones prolijas.',
      text: 'Instalación profesional de porcelanato en pisos y paredes, con terminaciones prolijas y duraderas en todo tipo de espacios.' },
    { id: 'refacciones', name: 'Refacciones en general', short: 'Refacciones', fam: 'Refacción y obra', grp: 'obra', c: '#1F3D80',
      desc: 'Reformas completas o parciales de casas y deptos.',
      text: 'Reformas completas o parciales que mejoran la funcionalidad y la estética de casas y departamentos.' },
    { id: 'albanileria', name: 'Albañilería', fam: 'Refacción y obra', grp: 'obra', c: '#2D55A3',
      desc: 'Construcción, reparaciones y ampliaciones.',
      text: 'Trabajos de albañilería para construcción, reparaciones, ampliaciones y mantenimiento de estructuras en hogares y comercios.' },
    { id: 'pintura', name: 'Pintura', fam: 'Refacción y obra', grp: 'obra', c: '#4A6496',
      desc: 'Interiores y exteriores con materiales de primera.',
      text: 'Pintura de alta calidad para embellecer y proteger tus ambientes, con materiales de primera línea.' },
    { id: 'refrigeracion', name: 'Refrigeración', sub: 'Comercial e industrial', fam: 'Climatización', grp: 'inst', c: '#1D63B8',
      desc: 'Instalación, reparación y mantenimiento.',
      text: 'Refrigeración comercial e industrial: instalación, reparación y mantenimiento de equipos.' },
    { id: 'aire', name: 'Aire acondicionado', fam: 'Climatización', grp: 'inst', c: '#2E7BD6',
      desc: 'Instalación, reparación y mantenimiento.',
      text: 'Instalación, reparación y mantenimiento de equipos de aire acondicionado para casas, comercios y oficinas.' }
  ];
  var byId = {};
  SERVICES.forEach(function (s) { byId[s.id] = s; });
  var TILE_ORDER = { obra: ['porcelanato', 'refacciones', 'albanileria', 'pintura'], inst: ['refrigeracion', 'aire', 'electricidad', 'plomeria', 'soldadura', 'mantenimiento'] };

  var selected = [];
  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function svgUse(id, cls) { return '<svg class="' + cls + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }

  /* ---------- Tira de servicios ---------- */
  var tiles = {};
  ['obra', 'inst'].forEach(function (g) {
    var ul = document.getElementById(g === 'obra' ? 'gridObra' : 'gridInst');
    TILE_ORDER[g].forEach(function (id) {
      var s = byId[id];
      var li = el('li');
      var b = el('button', { type: 'button', class: 'stile', 'aria-pressed': 'false', style: '--c:' + s.c },
        '<span class="stile__add" aria-hidden="true">+</span>' + svgUse(id, 'stile__ico') +
        '<span class="stile__name">' + s.name + (s.sub ? '<span class="stile__sub">' + s.sub + '</span>' : '') + '</span>' +
        '<span class="stile__desc">' + s.desc + '</span>');
      b.addEventListener('click', function () { toggle(id, true); });
      li.appendChild(b); ul.appendChild(li); tiles[id] = b;
    });
  });

  /* ---------- Rueda ---------- */
  var wheel = document.getElementById('wheel');
  var CX = 200, CY = 200, R = 178, r = 74, N = SERVICES.length, STEP = 360 / N;
  function pt(rad, deg) { var a = (deg - 90) * Math.PI / 180; return [CX + rad * Math.cos(a), CY + rad * Math.sin(a)]; }
  function f(n) { return n.toFixed(2); }

  // engranaje detrás (guiño al logo)
  var gear = document.createElementNS(SVGNS, 'g');
  gear.setAttribute('class', 'wheel__gear');
  var teeth = '';
  for (var t = 0; t < 24; t++) teeth += '<rect x="192" y="0" width="16" height="16" rx="3" transform="rotate(' + (t * 15) + ' 200 200)"/>';
  gear.innerHTML = teeth + '<circle cx="200" cy="200" r="190"/>';
  wheel.appendChild(gear);
  var ring = document.createElementNS(SVGNS, 'circle');
  ring.setAttribute('cx', 200); ring.setAttribute('cy', 200); ring.setAttribute('r', 183); ring.setAttribute('fill', '#F4F7FB');
  wheel.appendChild(ring);

  var segs = {};
  SERVICES.forEach(function (s, i) {
    var a0 = i * STEP, a1 = a0 + STEP, am = a0 + STEP / 2;
    var p0 = pt(R, a0), p1 = pt(R, a1), q1 = pt(r, a1), q0 = pt(r, a0);
    var d = 'M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + R + ' ' + R + ' 0 0 1 ' + f(p1[0]) + ' ' + f(p1[1]) +
      'L' + f(q1[0]) + ' ' + f(q1[1]) + 'A' + r + ' ' + r + ' 0 0 0 ' + f(q0[0]) + ' ' + f(q0[1]) + 'Z';
    var ic = pt(128, am);
    var g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'wseg');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'checkbox');
    g.setAttribute('aria-checked', 'false');
    g.setAttribute('aria-label', s.name);
    g.setAttribute('style', '--c:' + s.c);
    g.innerHTML = '<title>' + s.name + '</title><path d="' + d + '"/>' +
      '<use href="#i-' + s.id + '" x="' + f(ic[0] - 17) + '" y="' + f(ic[1] - 17) + '" width="34" height="34"/>';
    g.addEventListener('click', function () { toggle(s.id); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(s.id); } });
    wheel.appendChild(g);
    segs[s.id] = g;
  });

  /* ---------- Chips de la ficha ---------- */
  var chipsUl = document.getElementById('chips');
  var chips = {};
  TILE_ORDER.obra.concat(TILE_ORDER.inst).forEach(function (id) {
    var s = byId[id];
    var li = el('li');
    var b = el('button', { type: 'button', class: 'chip' + (s.light ? ' is-light' : ''), 'aria-pressed': 'false', style: '--c:' + s.c },
      svgUse(id, '') + (s.short || s.name));
    b.addEventListener('click', function () { toggle(id); });
    li.appendChild(b); chipsUl.appendChild(li); chips[id] = b;
  });

  /* ---------- Estado ---------- */
  var countEl = document.getElementById('wheelCount');
  var labelEl = document.getElementById('wheelLabel');
  var fichaFam = document.getElementById('fichaFam');
  var fichaTitle = document.getElementById('fichaTitle');
  var fichaText = document.getElementById('fichaText');
  var ficha = document.getElementById('ficha');
  var btn = document.getElementById('pedidoBtn');
  var btnTxt = document.getElementById('pedidoBtnTxt');
  var detalle = document.getElementById('detalle');
  var ctaLinks = document.querySelectorAll('.topbar__cta, .menu__cta');
  var spin = 0;

  function toggle(id, fromTile) {
    var i = selected.indexOf(id);
    if (i === -1) selected.push(id); else selected.splice(i, 1);
    var s = byId[id];
    if (i === -1) {
      fichaFam.textContent = s.fam;
      fichaTitle.textContent = s.name + (s.sub ? ' · ' + s.sub.toLowerCase() : '');
      fichaText.textContent = s.text;
      ficha.style.setProperty('--fc', s.light ? '#B98700' : s.c);
    }
    // gira el engranaje hacia el gajo tocado
    spin += (i === -1 ? 1 : -1) * STEP;
    gear.style.transform = 'rotate(' + spin + 'deg)';
    render();
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    if (fromTile && i === -1 && !params.has('qa')) flash(tiles[id]);
  }

  function flash(tile) {
    var add = tile.querySelector('.stile__add');
    if (add && add.animate) add.animate([{ transform: 'rotate(45deg) scale(1.5)' }, { transform: 'rotate(45deg) scale(1)' }], { duration: 350 });
  }

  function val(name) {
    var on = document.querySelector('.seg[data-name="' + name + '"] .is-on');
    return on ? on.getAttribute('data-v') : '';
  }

  function message() {
    var names = selected.map(function (id) { var s = byId[id]; return s.name + (s.sub ? ' (' + s.sub.toLowerCase() + ')' : ''); });
    var lines = ['Hola Óptima! Quiero pedir un presupuesto.', '',
      '• Servicios: ' + names.join(', '),
      '• Lugar: ' + val('lugar'),
      '• Zona: ' + val('zona'),
      '• Para cuándo: ' + val('cuando')];
    var d = detalle.value.trim();
    if (d) lines.push('• Detalle: ' + d);
    lines.push('', 'Gracias!');
    return lines.join('\n');
  }

  function render() {
    SERVICES.forEach(function (s) {
      var on = selected.indexOf(s.id) !== -1;
      segs[s.id].classList.toggle('is-on', on);
      segs[s.id].setAttribute('aria-checked', on ? 'true' : 'false');
      chips[s.id].classList.toggle('is-on', on);
      chips[s.id].setAttribute('aria-pressed', on ? 'true' : 'false');
      tiles[s.id].classList.toggle('is-on', on);
      tiles[s.id].setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var n = selected.length;
    countEl.textContent = n;
    labelEl.textContent = n === 1 ? 'servicio' : 'servicios';
    if (!n) {
      btn.classList.add('is-disabled');
      btn.setAttribute('aria-disabled', 'true');
      btn.href = 'https://wa.me/' + WA;
      btnTxt.textContent = 'Elegí al menos un servicio';
    } else {
      btn.classList.remove('is-disabled');
      btn.removeAttribute('aria-disabled');
      btn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message());
      btnTxt.textContent = 'Pedir presupuesto (' + n + ')';
    }
    ctaLinks.forEach(function (a) {
      a.textContent = n ? 'Mi presupuesto (' + n + ')' : (a.classList.contains('menu__cta') ? 'Armar mi presupuesto' : 'Solicitar presupuesto');
    });
  }

  document.querySelectorAll('.seg').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      render();
    });
  });
  detalle.addEventListener('input', render);

  // preselección por URL: ?servicio=aire,plomeria
  (params.get('servicio') || '').split(',').forEach(function (id) { id = id.trim(); if (byId[id] && selected.indexOf(id) === -1) selected.push(id); });
  render();

  /* ---------- Hero: rótulo sincronizado con el montaje ---------- */
  var video = document.getElementById('heroVideo');
  var nowEl = document.getElementById('heroNow');
  var CLIPS = [[0, 'Colocación de porcelanato'], [2.95, 'Aire acondicionado'], [5.35, 'Electricidad y tableros'], [8.05, 'Soldadura']];
  var lastLabel = CLIPS[0][1];
  if (video && nowEl) {
    video.addEventListener('timeupdate', function () {
      var t = video.currentTime, label = CLIPS[0][1];
      CLIPS.forEach(function (c) { if (t >= c[0]) label = c[1]; });
      if (label !== lastLabel) {
        lastLabel = label;
        nowEl.classList.add('is-fading');
        setTimeout(function () { nowEl.textContent = label; nowEl.classList.remove('is-fading'); }, 250);
      }
    });
    var p = video.play && video.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Nav, menú, scroll ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var waFloat = document.getElementById('waFloat');
  var heroGear = document.querySelector('.hero__gear');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  burger.addEventListener('click', function () {
    var open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeLb(); } });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    if (heroGear && !reduce) heroGear.style.setProperty('--gear', (y * 0.12) + 'deg');
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // sección activa en el menú
  var links = menu.querySelectorAll('a[href^="#"]:not(.menu__cta)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'servicios', 'nosotros', 'empresas', 'social', 'trabajos', 'contacto'].forEach(function (id) {
      var s = document.getElementById(id); if (s) spy.observe(s);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (n) {
      var sib = Array.prototype.indexOf.call(n.parentNode.children, n);
      n.style.setProperty('--d', Math.min(sib, 6) * 0.07 + 's');
      io.observe(n);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('is-in'); });
  }

  /* ---------- Galería: filtros + lightbox ---------- */
  var gal = document.getElementById('galeria');
  var items = Array.prototype.slice.call(gal.children);
  document.querySelector('.filtros').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var fsel = b.getAttribute('data-f');
    this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
    items.forEach(function (li) { li.classList.toggle('is-hidden', fsel !== 'todos' && li.getAttribute('data-c') !== fsel); });
  });

  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var cur = 0;
  function visible() { return items.filter(function (li) { return !li.classList.contains('is-hidden'); }); }
  function showLb(i) {
    var v = visible(); if (!v.length) return;
    cur = (i + v.length) % v.length;
    var img = v[cur].querySelector('img');
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
  }
  function closeLb() { if (!lb.hidden) { lb.hidden = true; document.body.style.overflow = ''; } }
  gal.addEventListener('click', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    showLb(visible().indexOf(li)); lb.hidden = false; document.body.style.overflow = 'hidden';
  });
  lb.addEventListener('click', function (e) {
    if (e.target.closest('.lightbox__close') || e.target === lb) closeLb();
    else if (e.target.closest('.lightbox__nav--prev')) showLb(cur - 1);
    else if (e.target.closest('.lightbox__nav--next')) showLb(cur + 1);
  });

  /* ---------- Títulos que no deben cortarse (letra grande en Android) ---------- */
  function fitText() {
    document.querySelectorAll('.hero__l1, .brand__name, .cta__phone').forEach(function (n) {
      n.style.fontSize = '';
      var size = parseFloat(getComputedStyle(n).fontSize), guard = 0;
      while (n.scrollWidth > n.clientWidth + 1 && size > 12 && guard++ < 40) { size -= 1; n.style.fontSize = size + 'px'; }
    });
  }
  window.__optFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('resize', fitText);

  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();
})();
