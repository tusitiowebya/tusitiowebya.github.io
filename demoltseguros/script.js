/* LT Seguros · Lorena Tria — interacción de la landing */
(function () {
  'use strict';

  var WA = '5491127384751';
  var html = document.documentElement;
  var isLite = function () { return html.classList.contains('lite'); };
  var isQA = html.classList.contains('qa');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waLink = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };

  /* ---------- enlaces de WhatsApp con mensaje ---------- */
  $$('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); });

  /* ---------- nav ---------- */
  var nav = $('#nav');
  var burger = $('.nav__burger');
  var menu = $('#menu');
  var fab = $('#fab');
  function onScroll() {
    var y = window.scrollY || 0;
    nav.classList.toggle('is-solid', y > 24);
    fab.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); burger.focus(); } });

  /* ---------- hero: video del medallón + rótulo sincronizado ---------- */
  var video = $('.crest__video');
  var label = $('#crestLabel');
  var tu = $('.crest__tu', label);
  var ramoTxt = $('.crest__ramo', label);
  // cortes del montaje (s): auto, moto, casa, familia, retiro, vuelve a auto
  var SEG = [
    { t: 0, id: 'auto', tu: 'Tu auto', ramo: 'Automotor' },
    { t: 2.1, id: 'moto', tu: 'Tu moto', ramo: 'Motos' },
    { t: 4.5, id: 'hogar', tu: 'Tu casa', ramo: 'Hogar' },
    { t: 6.9, id: 'vida', tu: 'Tu familia', ramo: 'Vida' },
    { t: 9.3, id: 'retiro', tu: 'Tu retiro', ramo: 'Retiro' },
    { t: 11.7, id: 'auto', tu: 'Tu auto', ramo: 'Automotor' }
  ];
  var segIdx = 0;
  function setLabel(s, animate) {
    var apply = function () {
      tu.textContent = s.tu;
      ramoTxt.textContent = s.ramo + ' · sumar a mi consulta';
      label.setAttribute('data-rama', s.id);
      label.setAttribute('aria-label', 'Sumar ' + s.ramo + ' a mi consulta');
    };
    if (!animate) { apply(); return; }
    label.classList.add('swap');
    setTimeout(function () { apply(); label.classList.remove('swap'); }, 280);
  }
  function startVideo() {
    if (!video || isLite() || video.getAttribute('src')) return;
    video.src = video.getAttribute('data-src');
    video.load();
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    video.addEventListener('timeupdate', function () {
      var t = video.currentTime, i = 0;
      for (var k = 0; k < SEG.length; k++) if (t >= SEG[k].t) i = k;
      if (SEG[i].tu !== SEG[segIdx].tu) setLabel(SEG[i], true);
      segIdx = i;
    });
  }
  if (isLite()) {
    setLabel({ id: '', tu: 'Todo lo tuyo', ramo: 'Armá tu consulta' }, false);
  } else {
    startVideo();
  }
  label.addEventListener('click', function () {
    var id = label.getAttribute('data-rama');
    if (id) addRama(id);
    goTo('#consulta');
  });

  function goTo(sel) {
    var el = $(sel);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(html).getPropertyValue('--nav'), 10) || 70) + 1;
    window.scrollTo({ top: y, behavior: isLite() ? 'auto' : 'smooth' });
  }

  /* ---------- tiles: brillo que sigue al puntero + sumar rama ---------- */
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  $$('.tile').forEach(function (t) {
    if (finePointer) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }
  });
  $$('[data-add]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      addRama(a.getAttribute('data-add'));
      goTo('#consulta');
    });
  });

  /* ---------- tarjeta: inclinación + guardar contacto ---------- */
  var card = $('#card');
  if (card && finePointer) {
    card.addEventListener('pointermove', function (e) {
      if (isLite() || window.innerWidth <= 860) return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }
  var save = $('#saveContact');
  if (save) {
    save.addEventListener('click', function () {
      var v = [
        'BEGIN:VCARD', 'VERSION:3.0',
        'N:Tria;Lorena;;;', 'FN:Lorena Tria',
        'ORG:LT Seguros', 'TITLE:Productora Asesora de Seguros',
        'TEL;TYPE=CELL:+5491127384751',
        'EMAIL;TYPE=INTERNET:segurostria@gmail.com',
        'ADR;TYPE=WORK:;;Jean Jaurès 5854;Isidro Casanova;Buenos Aires;1765;Argentina',
        'URL:https://ltseguros.tupaginaya.com.ar/',
        'NOTE:Seguros de todas las ramas',
        'END:VCARD'
      ].join('\r\n');
      var blob = new Blob([v], { type: 'text/vcard;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'Lorena-Tria-LT-Seguros.vcf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      save.lastChild.textContent = ' Listo: abrí el archivo para guardarlo';
    });
  }

  /* =========================================================
     ARMÁ TU CONSULTA
     ========================================================= */
  var RAMOS = [
    { id: 'auto', name: 'Automotor', short: 'Auto', fields: [
      { k: 'vehiculo', label: 'Marca, modelo y versión', type: 'text', ph: 'Ej.: Chevrolet Onix 1.4 LT', req: true, wide: true },
      { k: 'anio', label: 'Año', type: 'number', ph: 'Ej.: 2019', req: true, min: 1950, max: 2027 },
      { k: 'gnc', label: '¿Tiene GNC?', type: 'chips', opts: ['No', 'Sí'] },
      { k: 'uso', label: 'Uso', type: 'chips', opts: ['Particular', 'Trabajo o comercial', 'App de viajes'], req: true, wide: true },
      { k: 'cobertura', label: 'Cobertura que buscás', type: 'chips', opts: ['Responsabilidad civil', 'Terceros completo', 'Todo riesgo', 'Asesorame'], wide: true }
    ] },
    { id: 'moto', name: 'Moto', short: 'Moto', fields: [
      { k: 'vehiculo', label: 'Marca y modelo', type: 'text', ph: 'Ej.: Honda Wave 110', req: true, wide: true },
      { k: 'anio', label: 'Año', type: 'number', ph: 'Ej.: 2021', req: true, min: 1950, max: 2027 },
      { k: 'cc', label: 'Cilindrada', type: 'chips', opts: ['Hasta 150 cc', '150 a 300 cc', 'Más de 300 cc'] },
      { k: 'uso', label: 'Uso', type: 'chips', opts: ['Particular', 'Delivery o trabajo'], wide: true }
    ] },
    { id: 'hogar', name: 'Hogar', short: 'Hogar', fields: [
      { k: 'tipo', label: 'Vivienda', type: 'chips', opts: ['Casa', 'Departamento', 'PH'], req: true },
      { k: 'situacion', label: 'Sos', type: 'chips', opts: ['Propietario/a', 'Inquilino/a'], req: true },
      { k: 'detalle', label: 'Algo que quieras cubrir en especial', type: 'text', ph: 'Ej.: electrodomésticos, notebook', wide: true }
    ] },
    { id: 'bici', name: 'Bicicleta', short: 'Bici', fields: [
      { k: 'tipo', label: 'Tipo', type: 'chips', opts: ['Urbana', 'Mountain bike', 'Ruta', 'Eléctrica'], req: true, wide: true },
      { k: 'detalle', label: 'Marca y modelo', type: 'text', ph: 'Si lo sabés', wide: true }
    ] },
    { id: 'celular', name: 'Celular', short: 'Celular', fields: [
      { k: 'modelo', label: 'Marca y modelo', type: 'text', ph: 'Ej.: Samsung A55', req: true, wide: true },
      { k: 'antig', label: 'Antigüedad', type: 'chips', opts: ['Nuevo', 'Menos de un año', 'Más de un año'], wide: true }
    ] },
    { id: 'vida', name: 'Vida', short: 'Vida', fields: [
      { k: 'para', label: '¿Para quién?', type: 'chips', opts: ['Para mí', 'Para mi familia', 'Para mi equipo de trabajo'], req: true, wide: true },
      { k: 'edad', label: 'Edad del titular', type: 'number', ph: 'Ej.: 42', req: true, min: 18, max: 90 }
    ] },
    { id: 'retiro', name: 'Retiro', short: 'Retiro', fields: [
      { k: 'edad', label: 'Tu edad', type: 'number', ph: 'Ej.: 38', req: true, min: 18, max: 80 },
      { k: 'objetivo', label: 'Objetivo', type: 'chips', opts: ['Complementar la jubilación', 'Ahorro a largo plazo', 'Asesorame'], wide: true }
    ] },
    { id: 'ap', name: 'Accidentes personales', short: 'Acc. personales', fields: [
      { k: 'actividad', label: 'Actividad', type: 'text', ph: 'Ej.: albañil, profe de gimnasia, delivery', req: true, wide: true },
      { k: 'personas', label: 'Cantidad de personas', type: 'number', ph: 'Ej.: 1', min: 1, max: 999 },
      { k: 'periodo', label: 'Período', type: 'chips', opts: ['Por un día o evento', 'Por mes', 'Por año'], req: true, wide: true }
    ] },
    { id: 'caucion', name: 'Caución', short: 'Caución', fields: [
      { k: 'tipo', label: '¿Para qué la necesitás?', type: 'chips', opts: ['Alquiler', 'Obra o contrato', 'Aduana', 'Trámite judicial', 'Otra'], req: true, wide: true },
      { k: 'monto', label: 'Monto o valor del contrato (aprox.)', type: 'text', ph: 'Ej.: alquiler de $450.000 por mes', wide: true }
    ] },
    { id: 'otra', name: 'Otra rama', short: 'Otra', fields: [
      { k: 'detalle', label: 'Contame qué necesitás asegurar', type: 'textarea', ph: 'Ej.: el local de mi negocio', req: true, wide: true }
    ] }
  ];
  var BY = {};
  RAMOS.forEach(function (r) { BY[r.id] = r; });

  var state = { sel: [], data: {}, contacto: 'WhatsApp', horario: '' };

  var picks = $('#picks');
  var rforms = $('#rforms');
  var fNombre = $('#fNombre');
  var fLocalidad = $('#fLocalidad');
  var preview = $('#preview');
  var send = $('#send');
  var sendStatus = $('#sendStatus');
  var wreathBox = $('#wreathBox');

  // chips de una sola opción (reutilizable)
  function makeChips(container, opts, current, onPick) {
    container.innerHTML = '';
    opts.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = o;
      b.setAttribute('aria-pressed', String(o === current));
      b.addEventListener('click', function () {
        var now = b.getAttribute('aria-pressed') === 'true' ? '' : o;
        $$('.chip', container).forEach(function (x) { x.setAttribute('aria-pressed', String(x.textContent === now)); });
        onPick(now);
      });
      container.appendChild(b);
    });
  }

  // selector de ramas
  RAMOS.forEach(function (r) {
    var lab = document.createElement('label');
    lab.className = 'pick';
    lab.innerHTML = '<input type="checkbox" value="' + r.id + '"><span><svg aria-hidden="true"><use href="#r-' + r.id + '"/></svg>' + r.name + '</span>';
    var input = $('input', lab);
    input.addEventListener('change', function () {
      if (input.checked) addRama(r.id, true); else removeRama(r.id);
    });
    picks.appendChild(lab);
  });

  function addRama(id, fromPick) {
    if (!BY[id]) return;
    if (state.sel.indexOf(id) === -1) {
      state.sel.push(id);
      state.data[id] = state.data[id] || {};
      renderCard(id);
    }
    var cb = $('input[value="' + id + '"]', picks);
    if (cb && !cb.checked) cb.checked = true;
    update();
  }
  function removeRama(id) {
    state.sel = state.sel.filter(function (x) { return x !== id; });
    var c = $('.rcard[data-id="' + id + '"]', rforms);
    if (c) c.remove();
    var cb = $('input[value="' + id + '"]', picks);
    if (cb) cb.checked = false;
    update();
  }

  function renderCard(id) {
    var r = BY[id];
    var d = state.data[id];
    var fs = document.createElement('fieldset');
    fs.className = 'rcard';
    fs.setAttribute('data-id', id);
    fs.innerHTML = '<legend><svg aria-hidden="true"><use href="#r-' + id + '"/></svg>' + r.name +
      ' <span class="rcard__ok">Lista</span><button type="button" class="rcard__x">Quitar</button></legend>' +
      '<div class="rcard__fields"></div>';
    var box = $('.rcard__fields', fs);
    r.fields.forEach(function (f) {
      var opt = f.req ? '' : ' <em>(opcional)</em>';
      var uid = 'f-' + id + '-' + f.k;
      var wrap;
      if (f.type === 'chips') {
        wrap = document.createElement('div');
        wrap.className = 'field' + (f.wide ? ' field--wide' : '');
        wrap.innerHTML = '<span class="field__lab" id="' + uid + '">' + f.label + opt + '</span><div class="chips" role="group" aria-labelledby="' + uid + '"></div>';
        makeChips($('.chips', wrap), f.opts, d[f.k] || '', function (v) { d[f.k] = v; update(); });
      } else {
        wrap = document.createElement('label');
        wrap.className = 'field' + (f.wide ? ' field--wide' : '');
        var tag = f.type === 'textarea' ? 'textarea' : 'input';
        wrap.innerHTML = '<span>' + f.label + opt + '</span>';
        var inp = document.createElement(tag);
        if (tag === 'input') {
          inp.type = f.type === 'number' ? 'number' : 'text';
          if (f.type === 'number') { inp.inputMode = 'numeric'; inp.min = f.min; inp.max = f.max; }
        } else { inp.rows = 3; }
        inp.id = uid;
        inp.placeholder = f.ph || '';
        inp.value = d[f.k] || '';
        inp.addEventListener('input', function () { d[f.k] = inp.value.trim(); update(); });
        wrap.appendChild(inp);
      }
      box.appendChild(wrap);
    });
    $('.rcard__x', fs).addEventListener('click', function () { removeRama(id); });
    // mantener el orden de elección
    rforms.appendChild(fs);
  }

  function fieldOk(f, v) {
    if (!v) return false;
    if (f.type === 'number') { var n = Number(v); return isFinite(n) && n >= f.min && n <= f.max; }
    return true;
  }
  function ramoDone(id) {
    var d = state.data[id] || {};
    return BY[id].fields.every(function (f) { return !f.req || fieldOk(f, d[f.k]); });
  }
  function missing(id) {
    var d = state.data[id] || {};
    return BY[id].fields.filter(function (f) { return f.req && !fieldOk(f, d[f.k]); }).map(function (f) { return f.label.replace(/^¿|\?$/g, '').toLowerCase(); });
  }

  var low = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
  function describe(id) {
    var d = state.data[id] || {};
    var p = [];
    switch (id) {
      case 'auto':
        p = [d.vehiculo, d.anio && 'año ' + d.anio, d.gnc && (d.gnc === 'Sí' ? 'con GNC' : 'sin GNC'), d.uso && 'uso ' + low(d.uso),
          d.cobertura && (d.cobertura === 'Asesorame' ? 'quiero que me asesores con la cobertura' : 'busco ' + low(d.cobertura))]; break;
      case 'moto':
        p = [d.vehiculo, d.anio && 'año ' + d.anio, d.cc && low(d.cc), d.uso && 'uso ' + low(d.uso)]; break;
      case 'hogar':
        p = [d.tipo && low(d.tipo), d.situacion && 'soy ' + low(d.situacion), d.detalle && 'me interesa cubrir: ' + d.detalle]; break;
      case 'bici':
        p = [d.tipo && 'bici ' + low(d.tipo), d.detalle]; break;
      case 'celular':
        p = [d.modelo, d.antig && low(d.antig)]; break;
      case 'vida':
        p = [d.para && low(d.para), d.edad && 'titular de ' + d.edad + ' años']; break;
      case 'retiro':
        p = [d.edad && 'tengo ' + d.edad + ' años', d.objetivo && (d.objetivo === 'Asesorame' ? 'quiero que me asesores' : low(d.objetivo))]; break;
      case 'ap':
        p = [d.actividad, d.personas && d.personas + (Number(d.personas) === 1 ? ' persona' : ' personas'), d.periodo && 'cobertura ' + low(d.periodo)]; break;
      case 'caucion':
        p = [d.tipo && 'para ' + low(d.tipo), d.monto && 'monto aprox.: ' + d.monto]; break;
      case 'otra':
        p = [d.detalle]; break;
    }
    p = p.filter(Boolean);
    return p.length ? p.join(', ') : 'te paso los datos por acá';
  }

  function buildMsg() {
    var nombre = fNombre.value.trim();
    var loc = fLocalidad.value.trim();
    var n = state.sel.length;
    var lines = [];
    lines.push('Hola Lorena, soy ' + (nombre || '…') + (loc ? ', de ' + loc : '') + '. Te escribo desde tu web.');
    if (n === 1) {
      lines.push('Quiero cotizar un seguro de ' + low(BY[state.sel[0]].name) + ': ' + describe(state.sel[0]) + '.');
    } else {
      lines.push('Quiero consultar por ' + n + ' seguros:');
      state.sel.forEach(function (id) { lines.push('• ' + BY[id].name + ': ' + describe(id) + '.'); });
    }
    var via = state.contacto === 'Llamada' ? 'por llamada' : state.contacto === 'Mail' ? 'por mail' : 'por WhatsApp';
    lines.push('Prefiero que me contestes ' + via + (state.horario ? ', ' + low(state.horario) : '') + '. ¡Gracias!');
    return lines.join('\n');
  }

  /* laurel SVG */
  var NS = 'http://www.w3.org/2000/svg';
  var svg = $('#wreath');
  var C = { x: 180, y: 230 }, R = 128;
  var slots = [];
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function buildWreath() {
    el('circle', { cx: C.x, cy: C.y, r: R, class: 'w-ring' }, svg);
    el('circle', { cx: C.x + 3, cy: C.y - 2, r: R + 5, class: 'w-ring w-ring--b' }, svg);
    var cg = el('g', { transform: 'translate(112 18) scale(3.4)' }, svg);
    el('path', { class: 'w-crown', 'vector-effect': 'non-scaling-stroke', d: 'M5 22.5 2.2 7.5l9 7.6L15.4 5l4.6 8.6L24.6 5l4.2 10.1 9-7.6L35 22.5c-10-1.8-20-1.8-30 0z' }, cg);
    [[20, 2.4, 1.6], [15.4, 2.2, 1], [24.6, 2.2, 1], [2.2, 5.6, .9], [37.8, 5.6, .9]].forEach(function (g) { el('circle', { class: 'w-gem', cx: g[0], cy: g[1], r: g[2] }, cg); });

    var left = [118, 142, 166, 190, 214], right = [62, 38, 14, -10, -34];
    var order = [];
    for (var i = 0; i < 5; i++) { order.push({ a: left[i], side: -1 }); order.push({ a: right[i], side: 1 }); }
    var leaf = 'M0 0C6 -8 20 -10.5 33 0C20 10.5 6 8 0 0Z';
    order.forEach(function (o) {
      var th = o.a * Math.PI / 180;
      var px = C.x + R * Math.cos(th), py = C.y + R * Math.sin(th);
      var d = o.side < 0 ? [-Math.sin(th), Math.cos(th)] : [Math.sin(th), -Math.cos(th)];
      var n = [Math.cos(th), Math.sin(th)];
      var g = el('g', { class: 'w-slot', transform: 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ')' }, svg);
      [40, -40].forEach(function (sgn) {
        var s = Math.sin(Math.abs(sgn) * Math.PI / 180) * (sgn > 0 ? 1 : -1), c = Math.cos(40 * Math.PI / 180);
        var vx = d[0] * c + n[0] * s, vy = d[1] * c + n[1] * s;
        var ang = Math.atan2(vy, vx) * 180 / Math.PI;
        var rg = el('g', { transform: 'rotate(' + ang.toFixed(1) + ')' }, g);
        var p = el('path', { class: 'w-leaf', d: leaf }, rg);
        p.style.transformOrigin = '0 0';
        p.style.transformBox = 'view-box';
      });
      slots.push(g);
    });
  }
  buildWreath();

  var ready = false;
  function update() {
    var n = state.sel.length;
    var nombre = fNombre.value.trim();
    var allDone = n > 0 && state.sel.every(ramoDone);

    // cards
    $$('.rcard', rforms).forEach(function (c) { c.classList.toggle('is-done', ramoDone(c.getAttribute('data-id'))); });

    // laurel
    slots.forEach(function (g, i) {
      var id = state.sel[i];
      g.classList.toggle('is-on', !!id);
      g.classList.toggle('is-done', !!id && ramoDone(id));
    });
    $('#wCount').textContent = n;
    $('#wLabel').textContent = n === 1 ? 'rama elegida' : 'ramas elegidas';
    var names = state.sel.map(function (id) { return BY[id].short; });
    $('#wList').textContent = names.length > 4 ? names.slice(0, 4).join(' · ') + ' +' + (names.length - 4) : names.join(' · ');
    wreathBox.classList.toggle('is-ready', allDone && !!nombre);

    // numeración de pasos
    $('#stepDatosN').textContent = n ? '3' : '2';

    // mensaje
    ready = n > 0 && !!nombre;
    if (n === 0 && !nombre) {
      preview.textContent = 'Elegí una rama y escribí tu nombre: acá vas a ver el mensaje antes de mandarlo.';
      preview.style.color = '#77767C';
    } else {
      preview.textContent = buildMsg();
      preview.style.color = '';
    }
    send.classList.toggle('is-off', !ready);
    send.setAttribute('aria-disabled', String(!ready));
    send.href = ready ? waLink(buildMsg()) : 'https://wa.me/' + WA;

    if (!ready) {
      var falta = [];
      if (!n) falta.push('elegir una rama');
      if (!nombre) falta.push('escribir tu nombre');
      sendStatus.textContent = 'Falta: ' + falta.join(' y ') + '.';
    } else if (!allDone) {
      var id = state.sel.filter(function (x) { return !ramoDone(x); })[0];
      sendStatus.textContent = 'Ya podés enviarla. Si sumás ' + missing(id).join(' y ') + ' en ' + BY[id].name + ', te cotizo más rápido.';
    } else {
      sendStatus.textContent = 'Todo listo: se abre WhatsApp con este mensaje y lo podés editar antes de mandarlo.';
    }
    updateDock();
  }

  send.addEventListener('click', function (e) {
    if (ready) return;
    e.preventDefault();
    if (!state.sel.length) { var first = $('input', picks); if (first) first.focus(); }
    else fNombre.focus();
  });
  fNombre.addEventListener('input', update);
  fLocalidad.addEventListener('input', update);
  makeChips($('[data-k="contacto"]'), ['WhatsApp', 'Llamada', 'Mail'], state.contacto, function (v) { state.contacto = v || 'WhatsApp'; update(); });
  makeChips($('[data-k="horario"]'), ['A la mañana', 'A la tarde', 'Cualquier horario'], '', function (v) { state.horario = v; update(); });

  /* dock móvil */
  var dock = $('#dock'), dockTxt = $('#dockTxt');
  var inConsulta = false, sendVisible = false;
  function updateDock() {
    var n = state.sel.length;
    dockTxt.textContent = n + (n === 1 ? ' rama en tu consulta' : ' ramas en tu consulta');
    var show = inConsulta && !sendVisible && n > 0;
    dock.classList.toggle('show', show);
    dock.setAttribute('aria-hidden', String(!show));
    document.body.classList.toggle('dock-on', show);
  }
  $('#dockBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var p = $('.preview');
    window.scrollTo({ top: p.getBoundingClientRect().top + window.scrollY - 90, behavior: isLite() ? 'auto' : 'smooth' });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { inConsulta = en[0].isIntersecting; updateDock(); }, { rootMargin: '-30% 0px -30% 0px' }).observe($('#consulta'));
    new IntersectionObserver(function (en) { sendVisible = en[0].isIntersecting; updateDock(); }).observe($('.send'));
  }

  // deep link ?rama=auto,caucion
  var qs = new URLSearchParams(location.search);
  if (qs.get('rama')) {
    qs.get('rama').split(',').forEach(function (id) { addRama(id.trim()); });
    if (!isQA) setTimeout(function () { goTo('#consulta'); }, 300);
  }
  update();

  /* ---------- horario: hoy y abierto ahora (hora de Buenos Aires) ---------- */
  (function () {
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
    var dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    var H = { 1: [[570, 780], [990, 1170]], 2: [[570, 780], [990, 1170]], 3: [[570, 780], [990, 1170]], 4: [[570, 780], [990, 1170]], 5: [[570, 780], [990, 1170]], 6: [[570, 810]], 0: [] };
    var fmt = function (m) { var h = Math.floor(m / 60), mm = m % 60; return h + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + ' h'; };
    var DAYS = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
    $$('#hours tr').forEach(function (tr) {
      if (tr.getAttribute('data-d').split(',').indexOf(String(dow)) > -1) tr.classList.add('is-today');
    });
    var st = $('#openStatus'), txt = $('span', st);
    var open = (H[dow] || []).filter(function (r) { return mins >= r[0] && mins < r[1]; })[0];
    if (open) {
      st.classList.add('is-open');
      txt.textContent = 'Abierto ahora · hasta las ' + fmt(open[1]);
      return;
    }
    var later = (H[dow] || []).filter(function (r) { return mins < r[0]; })[0];
    if (later) { txt.textContent = 'Cerrado ahora · abre hoy a las ' + fmt(later[0]); return; }
    for (var k = 1; k <= 7; k++) {
      var dd = (dow + k) % 7;
      if (H[dd] && H[dd].length) { txt.textContent = 'Cerrado ahora · abre ' + (k === 1 ? 'mañana' : DAYS[dd]) + ' a las ' + fmt(H[dd][0][0]); break; }
    }
  })();

  /* ---------- reveals, rama del proceso y mapa diferido ---------- */
  var rv = $$('.rv');
  var branch = $('#branch');
  var mapFrame = $('.map iframe');
  if ('IntersectionObserver' in window && !isQA) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (x) { io.observe(x); });
    io.observe(branch);
    var mo = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { mapFrame.src = mapFrame.getAttribute('data-src'); mo.disconnect(); }
    }, { rootMargin: '400px 0px' });
    mo.observe(mapFrame);
  } else {
    rv.forEach(function (x) { x.classList.add('in'); });
    branch.classList.add('in');
    mapFrame.src = mapFrame.getAttribute('data-src');
  }

  /* ---------- títulos que no entran (letra grande de Android) ---------- */
  function fitText() {
    $$('.hero__title .ln > span').forEach(function (s) {
      s.style.fontSize = '';
      var size = parseFloat(getComputedStyle(s).fontSize), guard = 0;
      while (s.scrollWidth > s.clientWidth + 1 && size > 18 && guard++ < 40) {
        size -= 1; s.style.fontSize = size + 'px';
      }
    });
  }
  window.__ltFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitText, 120); });

  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- watchdog de FPS: si el equipo no da, pasa a LITE ---------- */
  function goLite() {
    html.classList.add('lite');
    try { sessionStorage.setItem('lt-lite', '1'); } catch (e) {}
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    setLabel({ id: '', tu: 'Todo lo tuyo', ramo: 'Armá tu consulta' }, false);
  }
  if (!isLite() && !isQA && !/[?&]full\b/.test(location.search) && 'requestAnimationFrame' in window) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (document.hidden) return;
        var frames = 0, t0 = performance.now();
        (function tick(t) {
          frames++;
          if (t - t0 < 2000) { requestAnimationFrame(tick); return; }
          var fps = frames * 1000 / (t - t0);
          if (fps < 28 && fps > 12 && !document.hidden) goLite();
        })(t0);
        requestAnimationFrame(function () {});
      }, 1200);
    });
  }
})();
