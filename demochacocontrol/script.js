(function () {
  'use strict';
  var WA = '5493644376057';
  var waLink = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('toggle');
  var menu = document.getElementById('menu');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* hero: el cartel se arma */
  requestAnimationFrame(function () { setTimeout(function () { document.body.classList.add('is-ready'); }, 120); });
  var video = document.getElementById('heroVideo');
  if (video) {
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
    else {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  /* LCD del hero */
  var ticker = document.getElementById('lcdTicker');
  var msgs = ['SISTEMA LISTO · CENTRAL EN LÍNEA', 'MONITOREO 24 H · SÁENZ PEÑA', 'ZONAS 1-8 · SIN NOVEDAD'];
  var mi = 0;
  if (ticker && !reduce) setInterval(function () { mi = (mi + 1) % msgs.length; ticker.textContent = msgs[mi]; }, 3200);

  /* títulos que no se corten con letra grande (Android) */
  var fit = function () {
    document.querySelectorAll('[data-fit]').forEach(function (el) {
      el.style.fontSize = '';
      var max = el.clientWidth;
      var lines = el.querySelectorAll('span');
      var widest = 0;
      lines.forEach(function (l) { widest = Math.max(widest, l.scrollWidth); });
      if (widest > max && max > 0) {
        var size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = Math.floor(size * max / widest) + 'px';
      }
    });
  };
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();

  /* reveal */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', Math.min(sib, 5) * 0.08 + 's');
    if (io) io.observe(el); else el.classList.add('is-in');
  });
  var path = document.getElementById('signalPath');
  if (path && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { path.classList.toggle('is-live', en[0].isIntersecting); }, { threshold: 0.3 }).observe(path);
  }

  /* WhatsApp de kits */
  document.querySelectorAll('[data-kit]').forEach(function (a) {
    a.href = waLink('Hola Chaco Control, quiero consultar por el ' + a.dataset.kit + ' y las promociones vigentes.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ARMÁ TU SISTEMA: plano + teclado */
  var SPOTS = [
    { id: 'p1', kind: 'door', name: 'Puerta principal', x: 205, y: 60 },
    { id: 'v1', kind: 'window', name: 'Ventana del living', x: 60, y: 150 },
    { id: 'v2', kind: 'window', name: 'Ventana de la cocina', x: 465, y: 60 },
    { id: 'p2', kind: 'door', name: 'Puerta lateral', x: 580, y: 150 },
    { id: 'v3', kind: 'window', name: 'Ventana del dormitorio 1', x: 60, y: 325 },
    { id: 'v4', kind: 'window', name: 'Ventana del dormitorio 2', x: 355, y: 410, below: true },
    { id: 'p3', kind: 'door', name: 'Puerta al patio', x: 515, y: 410, below: true },
    { id: 's1', kind: 'pir', name: 'Living-comedor', x: 312, y: 96 },
    { id: 's2', kind: 'pir', name: 'Cocina', x: 545, y: 96 },
    { id: 's3', kind: 'pir', name: 'Dormitorio 1', x: 225, y: 276 },
    { id: 's4', kind: 'pir', name: 'Dormitorio 2', x: 415, y: 276 },
    { id: 's5', kind: 'pir', name: 'Lavadero', x: 548, y: 368 },
    { id: 'c1', kind: 'cam', name: 'Cámara al frente', x: 110, y: 30 },
    { id: 'c2', kind: 'cam', name: 'Cámara en el lateral izquierdo', x: 30, y: 240 },
    { id: 'c3', kind: 'cam', name: 'Cámara en el lateral derecho', x: 610, y: 330 },
    { id: 'c4', kind: 'cam', name: 'Cámara al patio', x: 140, y: 462 }
  ];
  var KIND = { door: 'Contacto magnético', window: 'Contacto magnético', pir: 'Sensor de movimiento', cam: 'Cámara' };
  var spotsBox = document.getElementById('spots');
  if (!spotsBox) return;
  var picked = [];
  var extras = { panico: false, monitoreo: true, guardia: false };
  var lcd1 = document.getElementById('lcd1');
  var lcd2 = document.getElementById('lcd2');
  var leds = document.getElementById('zoneLeds');
  var list = document.getElementById('pickList');
  var armed = document.getElementById('stArmed');
  var send = document.getElementById('sendPlan');
  var lastMsg = null;

  for (var i = 1; i <= 8; i++) {
    var li = document.createElement('li');
    li.textContent = i;
    leds.appendChild(li);
  }

  SPOTS.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'spot' + (s.below ? ' tag-below' : '');
    b.dataset.kind = s.kind;
    b.dataset.id = s.id;
    b.style.left = (s.x / 640 * 100) + '%';
    b.style.top = (s.y / 500 * 100) + '%';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', s.name + ' (' + KIND[s.kind].toLowerCase() + ')');
    b.title = s.name;
    b.addEventListener('click', function () { togglePick(s.id); });
    spotsBox.appendChild(b);
  });

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var labelOf = function (s, idx) {
    var sensors = picked.filter(function (p) { return byId(p).kind !== 'cam'; });
    var cams = picked.filter(function (p) { return byId(p).kind === 'cam'; });
    return s.kind === 'cam' ? 'CAM ' + (cams.indexOf(s.id) + 1) : 'Z' + pad(sensors.indexOf(s.id) + 1);
  };
  var byId = function (id) { return SPOTS.filter(function (s) { return s.id === id; })[0]; };
  var short = function (txt) { return txt.toUpperCase().replace('VENTANA DEL ', 'VENT. ').replace('VENTANA DE LA ', 'VENT. ').replace('DORMITORIO', 'DORM.').replace('CÁMARA EN EL ', '').replace('CÁMARA AL ', '').replace('PUERTA PRINCIPAL', 'PUERTA PPAL.'); };

  function togglePick(id) {
    var at = picked.indexOf(id);
    if (at >= 0) { picked.splice(at, 1); lastMsg = short(byId(id).name) + ' QUITADO'; }
    else { picked.push(id); lastMsg = null; }
    render(at < 0 ? id : null);
  }

  function render(justAdded) {
    var sensors = picked.filter(function (p) { return byId(p).kind !== 'cam'; });
    var cams = picked.filter(function (p) { return byId(p).kind === 'cam'; });
    spotsBox.querySelectorAll('.spot').forEach(function (b) {
      var on = picked.indexOf(b.dataset.id) >= 0;
      b.setAttribute('aria-pressed', String(on));
      var tag = b.querySelector('.spot__tag');
      if (on) {
        if (!tag) { tag = document.createElement('span'); tag.className = 'spot__tag'; b.appendChild(tag); }
        tag.textContent = labelOf(byId(b.dataset.id));
      } else if (tag) tag.remove();
      var cone = b.querySelector('.spot__cone');
      if (cone) cone.remove();
    });
    if (justAdded && !reduce) {
      var bt = spotsBox.querySelector('[data-id="' + justAdded + '"]');
      var c = document.createElement('span');
      c.className = 'spot__cone';
      bt.appendChild(c);
      setTimeout(function () { c.remove(); }, 1800);
    }
    leds.querySelectorAll('li').forEach(function (l, i) { l.classList.toggle('is-on', i < sensors.length); });
    armed.classList.toggle('is-on', picked.length > 0);

    if (!picked.length) { lcd1.textContent = 'MARQUE ZONAS'; lcd2.textContent = lastMsg || 'EN EL PLANO'; }
    else {
      lcd1.textContent = 'ZONAS ' + pad(sensors.length) + ' · CAM ' + pad(cams.length);
      if (justAdded) { var s = byId(justAdded); lcd2.textContent = labelOf(s) + ' ' + short(s.name); }
      else lcd2.textContent = lastMsg || 'LISTO PARA ENVIAR';
      if (sensors.length > 8) lcd2.textContent = 'MÁS DE 8 ZONAS: A MEDIDA';
    }

    list.innerHTML = '';
    if (!picked.length) {
      var e = document.createElement('li');
      e.className = 'empty';
      e.textContent = 'Todavía no marcaste nada en el plano.';
      list.appendChild(e);
    }
    sensors.concat(cams).forEach(function (id) {
      var s = byId(id);
      var li = document.createElement('li');
      var t = document.createElement('span');
      var b = document.createElement('b');
      b.textContent = labelOf(s);
      t.appendChild(b);
      t.appendChild(document.createTextNode(s.name + ' · ' + KIND[s.kind].toLowerCase()));
      var x = document.createElement('button');
      x.type = 'button';
      x.textContent = '×';
      x.setAttribute('aria-label', 'Quitar ' + s.name);
      x.addEventListener('click', function () { togglePick(id); });
      li.appendChild(t);
      li.appendChild(x);
      list.appendChild(li);
    });
    send.href = waLink(buildMessage());
  }

  function val(name) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }

  function buildMessage() {
    var lugar = val('lugar');
    var service = val('equipo') === 'service';
    var lines = ['Hola Chaco Control, ' + (service ? 'ya tengo equipos y necesito service.' : 'quiero un presupuesto de seguridad.')];
    lines.push('Lugar: ' + lugar);
    var group = function (kinds, title) {
      var names = picked.filter(function (p) { return kinds.indexOf(byId(p).kind) >= 0; }).map(function (p) { return byId(p).name; });
      if (names.length) lines.push(title + ' (' + names.length + '): ' + names.join(', '));
    };
    group(['door', 'window'], 'Aperturas a cubrir');
    group(['pir'], 'Ambientes con sensor de movimiento');
    group(['cam'], 'Cámaras');
    var ex = [];
    if (extras.monitoreo) ex.push('monitoreo 24 h');
    if (extras.panico) ex.push('botón antipánico');
    if (extras.guardia) ex.push('guardia en el lugar');
    if (ex.length) lines.push('Me interesa: ' + ex.join(', '));
    var barrio = document.getElementById('barrio').value.trim();
    var nombre = document.getElementById('nombre').value.trim();
    if (barrio) lines.push('Barrio/localidad: ' + barrio);
    if (nombre) lines.push('Soy ' + nombre + '.');
    if (!picked.length) lines.push('Todavía no marqué puntos en el plano, ¿me asesoran?');
    return lines.join('\n');
  }

  document.querySelectorAll('.fap').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.extra;
      extras[k] = !extras[k];
      b.setAttribute('aria-pressed', String(extras[k]));
      lastMsg = (k === 'panico' ? 'ANTIPÁNICO' : k === 'monitoreo' ? 'MONITOREO 24 H' : 'GUARDIA FIJA') + (extras[k] ? ' SÍ' : ' NO');
      render(null);
    });
  });
  document.querySelectorAll('.keypad__form input').forEach(function (inp) {
    inp.addEventListener('input', function () { send.href = waLink(buildMessage()); });
    inp.addEventListener('change', function () { send.href = waLink(buildMessage()); });
  });
  document.getElementById('clearPlan').addEventListener('click', function () { picked = []; lastMsg = 'PLANO BORRADO'; render(null); });
  render(null);

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
