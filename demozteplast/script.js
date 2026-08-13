/* =========================================================
   ZTEPLAST — interacciones
   ========================================================= */
(function () {
  'use strict';

  var WA = '5491168545399';

  /* ---------- año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav: sticky + menú mobile ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var wafloat = document.querySelector('.wafloat');

  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 40);
    // el flotante entra al salir del hero, para no tapar el riel de rubros
    if (wafloat) wafloat.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- riel del hero → resalta el rubro destino ---------- */
  document.querySelectorAll('.hero__rail a').forEach(function (a) {
    a.addEventListener('click', function () {
      var card = document.getElementById('r-' + a.dataset.cat);
      if (!card) return;
      card.style.transition = 'box-shadow .4s';
      card.style.boxShadow = '0 0 0 3px var(--teal-2)';
      setTimeout(function () { card.style.boxShadow = ''; }, 1600);
    });
  });

  /* ---------- reveal on scroll ---------- */
  var targets = document.querySelectorAll(
    '.calc__head, .calc__list, .calc__panel, .why__lead, .why__cards li, ' +
    '.rubros__head, .rub, .rubros__foot, .steps__media, .steps__text, ' +
    '.zona__head, .zona__list, .testi blockquote, .faq__aside, .faq details, .cta__in'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add('is-in'); }, i * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* =========================================================
     SIMULADOR DE GANANCIA
     costo = precio mayorista del bulto
     unidades = cuántas unidades trae ese bulto
     pvp = precio sugerido de venta al público por unidad
     ========================================================= */
  var PRODUCTOS = [
    { id: 'chup', ico: '🍭', nombre: 'Chupetines surtidos', bulto: 'Bolsón x 100 u.', costo: 21000, unidades: 100, pvp: 400 },
    { id: 'gomi', ico: '🐻', nombre: 'Gomitas y ositos', bulto: 'Caja x 24 paq.', costo: 33600, unidades: 24, pvp: 2300 },
    { id: 'choc', ico: '🍫', nombre: 'Tabletas de chocolate', bulto: 'Caja x 20 u.', costo: 48000, unidades: 20, pvp: 3600 },
    { id: 'alfa', ico: '🥮', nombre: 'Alfajores triples', bulto: 'Caja x 30 u.', costo: 42000, unidades: 30, pvp: 2200 },
    { id: 'papa', ico: '🥔', nombre: 'Papas fritas y palitos', bulto: 'Caja x 24 paq.', costo: 38400, unidades: 24, pvp: 2600 },
    { id: 'gall', ico: '🍪', nombre: 'Galletitas dulces', bulto: 'Caja x 24 paq.', costo: 31200, unidades: 24, pvp: 2100 },
    { id: 'gase', ico: '🥤', nombre: 'Gaseosa 500 ml', bulto: 'Cajón x 12 u.', costo: 15600, unidades: 12, pvp: 2000 },
    { id: 'agua', ico: '💧', nombre: 'Agua mineral 500 ml', bulto: 'Cajón x 12 u.', costo: 8400, unidades: 12, pvp: 1100 },
    { id: 'vaso', ico: '🥂', nombre: 'Vasos descartables', bulto: 'Bulto x 20 paq.', costo: 24000, unidades: 20, pvp: 1900 },
    { id: 'ence', ico: '🔥', nombre: 'Encendedores', bulto: 'Caja x 50 u.', costo: 32500, unidades: 50, pvp: 1200 }
  ];

  var estado = {};
  var listEl = document.getElementById('calcList');
  var itemsEl = document.getElementById('calcItems');
  var emptyEl = document.getElementById('calcEmpty');
  var waEl = document.getElementById('calcWa');
  var resetEl = document.getElementById('calcReset');

  var money = function (n) {
    return '$' + Math.round(n).toLocaleString('es-AR');
  };

  if (listEl) {
    PRODUCTOS.forEach(function (p) {
      estado[p.id] = 0;

      var row = document.createElement('div');
      row.className = 'crow';
      row.dataset.id = p.id;

      var margen = Math.round(((p.pvp * p.unidades - p.costo) / (p.pvp * p.unidades)) * 100);

      row.innerHTML =
        '<div class="crow__ico">' + p.ico + '</div>' +
        '<div>' +
          '<div class="crow__name">' + p.nombre + '</div>' +
          '<div class="crow__meta">' + p.bulto + ' · ' + money(p.costo) +
            ' · sugerido ' + money(p.pvp) + '/u · <b>' + margen + '% margen</b></div>' +
        '</div>' +
        '<div class="crow__stepper">' +
          '<button type="button" data-op="-" aria-label="Quitar un bulto de ' + p.nombre + '" disabled>–</button>' +
          '<output aria-live="polite">0</output>' +
          '<button type="button" data-op="+" aria-label="Sumar un bulto de ' + p.nombre + '">+</button>' +
        '</div>';

      listEl.appendChild(row);
    });

    listEl.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-op]');
      if (!btn) return;
      var row = btn.closest('.crow');
      var id = row.dataset.id;
      var next = estado[id] + (btn.dataset.op === '+' ? 1 : -1);
      estado[id] = Math.max(0, Math.min(99, next));

      row.querySelector('output').textContent = estado[id];
      row.querySelector('button[data-op="-"]').disabled = estado[id] === 0;
      row.classList.toggle('is-active', estado[id] > 0);
      render();
    });

    if (resetEl) {
      resetEl.addEventListener('click', function () {
        PRODUCTOS.forEach(function (p) { estado[p.id] = 0; });
        listEl.querySelectorAll('.crow').forEach(function (row) {
          row.querySelector('output').textContent = '0';
          row.querySelector('button[data-op="-"]').disabled = true;
          row.classList.remove('is-active');
        });
        render();
      });
    }

    render();
  }

  /* --- contador animado para los totales --- */
  function anim(el, to) {
    var from = parseFloat(el.dataset.v || 0);
    if (from === to) { el.textContent = money(to); return; }
    el.dataset.v = to;
    var t0 = performance.now(), dur = 480;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = money(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function render() {
    var inv = 0, vta = 0, lineas = [];

    PRODUCTOS.forEach(function (p) {
      var q = estado[p.id];
      if (!q) return;
      inv += p.costo * q;
      vta += p.pvp * p.unidades * q;
      lineas.push({ p: p, q: q });
    });

    var gan = vta - inv;
    var pct = vta > 0 ? Math.round((gan / vta) * 100) : 0;

    if (emptyEl) emptyEl.style.display = lineas.length ? 'none' : 'block';

    itemsEl.innerHTML = lineas.map(function (l) {
      return '<li><span>' + l.q + '× ' + l.p.nombre + '</span><span>' +
             money(l.p.costo * l.q) + '</span></li>';
    }).join('');

    anim(document.getElementById('tInv'), inv);
    anim(document.getElementById('tVta'), vta);
    anim(document.getElementById('tGan'), gan);

    document.getElementById('mPct').textContent = pct + '%';
    document.getElementById('mBar').style.width = Math.min(100, pct) + '%';

    /* --- mensaje de WhatsApp --- */
    var msg;
    if (!lineas.length) {
      msg = 'Hola Zteplast! Quiero recibir la lista de precios mayorista.';
    } else {
      msg = 'Hola Zteplast! Armé este pedido desde la web:\n\n';
      lineas.forEach(function (l) {
        msg += '• ' + l.q + ' × ' + l.p.nombre + ' (' + l.p.bulto + ')\n';
      });
      msg += '\nTotal estimado: ' + money(inv) +
             '\n¿Me confirman precio del día y disponibilidad?';
    }
    waEl.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    waEl.textContent = lineas.length
      ? 'Mandar este pedido por WhatsApp'
      : 'Pedir la lista por WhatsApp';
  }
})();
