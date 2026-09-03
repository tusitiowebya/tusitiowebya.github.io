/* ══════════════════════════════════════════════════════════
   Grace Deco — home
   Depende de config.js + store.js (window.GD).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };

  // Modo QA: capturas headless reproducibles (?qa=1 o UA HeadlessChrome).
  if (/[?&]qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent)) {
    document.documentElement.classList.add('qa');
  }
  var esc = GD.esc, money = GD.money;

  /* ── Nav ─────────────────────────────────────────────── */
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = $('#burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  Array.prototype.forEach.call(document.querySelectorAll('#navLinks a'), function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── WhatsApp ────────────────────────────────────────── */
  var waHome = GD.linkWA('Hola Grace Deco! Vi la web y quiero consultarles por un ambiente.');
  ['#waCta', '#waFooter', '#waFloat'].forEach(function (sel) {
    var el = $(sel); if (el) el.href = waHome;
  });
  var anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();

  /* ── Reveal ──────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        setTimeout(function () { e.target.classList.add('in'); }, i * 80);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.rev'), function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll('.rev'), function (el) { el.classList.add('in'); });
  }

  /* ── Ambientes ───────────────────────────────────────── */
  function pintarAmbientes() {
    var cont = $('#ambGrid'); if (!cont) return;
    cont.innerHTML = GD.ambientes.map(function (a) {
      var n = GD.porAmbiente(a.id).length;
      return '<a class="amb" href="catalogo/?amb=' + esc(a.id) + '">' +
        '<img src="' + esc(a.foto) + '" alt="' + esc(a.nombre) + '" loading="lazy">' +
        '<span class="amb-cap"><b>' + esc(a.nombre) + '</b>' +
        '<span>' + esc(a.copy) + '</span>' +
        '<i>' + n + ' piezas →</i></span></a>';
    }).join('');
  }

  /* ── Vidriera ────────────────────────────────────────── */
  function cardHTML(p) {
    var en = GD.cant(p.id) > 0;
    var mm = GD.mejorMedio(p);
    return '<article class="card" data-id="' + esc(p.id) + '">' +
      (p.dest ? '<span class="card-flag">Más elegido</span>' : '') +
      '<div class="card-img"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
      '<button class="card-add' + (en ? ' in' : '') + '" data-add="' + esc(p.id) + '">' +
      (en ? 'En tu pedido (' + GD.cant(p.id) + ')' : 'Sumar al pedido') + '</button></div>' +
      '<span class="card-cat">' + esc(p.catNom) + '</span>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      (p.medida ? '<span class="card-med">' + esc(p.medida) + '</span>' : '') +
      '<div class="card-precio"><b>' + money(p.precio) + '</b>' +
      (mm ? '<span>' + money(mm.precioFinal) + ' con ' + esc(mm.medio.toLowerCase()) + '</span>' :
        (p.cuotas ? '<span>' + p.cuotas + ' cuotas sin interés</span>' : '')) +
      '</div></article>';
  }

  function pintarDestacados() {
    var cont = $('#destacados'); if (!cont) return;
    var todos = GD.productos();
    var dest = todos.filter(function (p) { return p.dest; });
    if (dest.length < 8) {
      todos.forEach(function (p) { if (dest.length < 8 && dest.indexOf(p) < 0) dest.push(p); });
    }
    cont.innerHTML = dest.slice(0, 8).map(cardHTML).join('');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    GD.agregar(b.getAttribute('data-add'), 1);
    GD.abrirCarrito && GD.abrirCarrito();
  });

  /* ══ SIGNATURE — Las medidas justas ══════════════════════
     Reglas de proporción que usamos en cada asesoría, aplicadas
     a las medidas reales del ambiente de quien está mirando.    */
  var ALFOMBRAS = [
    [120, 170], [160, 230], [200, 250], [200, 290], [240, 340], [300, 400]
  ];
  var estado = { amb: 'living' };

  function num(id, def) {
    var v = parseFloat(($('#' + id) || {}).value);
    return isNaN(v) || v <= 0 ? def : v;
  }

  function calcular() {
    var a = Math.min(Math.max(num('mAncho', 3.6), 1.5), 12);
    var l = Math.min(Math.max(num('mLargo', 4.8), 1.5), 14);
    var h = Math.min(Math.max(num('mAlto', 2.6), 2), 5);
    if (l < a) { var t = a; a = l; l = t; }          // ancho siempre el lado corto

    // Alfombra: 45 cm de piso libre por lado (mínimo cómodo de circulación).
    var maxA = (a - 0.9) * 100, maxL = (l - 0.9) * 100;
    var alf = null;
    ALFOMBRAS.forEach(function (m) { if (m[0] <= maxA && m[1] <= maxL) alf = m; });
    if (!alf) alf = ALFOMBRAS[0];

    var centroCuadro = h >= 2.8 ? 150 : 145;
    var cortina = Math.round(h * 100 - 13);          // riel 12 cm bajo el techo + 1 cm del piso
    var m2 = a * l;
    var luces = Math.max(2, Math.ceil(m2 / 6));

    return { a: a, l: l, h: h, alf: alf, centroCuadro: centroCuadro, cortina: cortina, m2: m2, luces: luces };
  }

  function extra(r) {
    if (estado.amb === 'comedor') {
      var diam = Math.round(Math.min(r.a * 100 * 0.35, 60));
      return { t: 'Colgante sobre la mesa', v: 'a 150 cm del piso · Ø ' + diam + ' cm' };
    }
    if (estado.amb === 'dormitorio') {
      return { t: 'Alfombra a los pies', v: 'que salga 60 cm de la cama' };
    }
    if (estado.amb === 'entrada') {
      return { t: 'Espejo sobre la consola', v: 'Ø 70 a 80 cm, a 20 cm del mueble' };
    }
    return { t: 'Circulación libre', v: Math.round(Math.max(75, (r.a * 100 - r.alf[0]) / 2)) + ' cm entre muebles' };
  }

  function pintarMedidas() {
    var r = calcular(), ex = extra(r);
    var filas = [
      ['Alfombra recomendada', r.alf[0] + ' x ' + r.alf[1] + ' cm'],
      ['Centro del cuadro', r.centroCuadro + ' cm del piso'],
      ['Largo de cortina', r.cortina + ' cm'],
      ['Puntos de luz', r.luces + (r.luces === 2 ? ' (además del techo)' : ' repartidos')],
      [ex.t, ex.v]
    ];
    $('#medOut').innerHTML = filas.map(function (f) {
      return '<div class="med-item"><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></div>';
    }).join('');
    plano(r);
    sugerencias(r);
  }

  /* Plano cenital a escala: el ambiente, la alfombra y el mueble. */
  function plano(r) {
    var svg = $('#medPlano'); if (!svg) return;
    var W = 460, H = 360, pad = 46;
    var esc0 = Math.min((W - pad * 2) / r.a, (H - pad * 2) / r.l);
    var w = r.a * esc0, hh = r.l * esc0;
    var x = (W - w) / 2, y = (H - hh) / 2;
    var aw = (r.alf[0] / 100) * esc0, ah = (r.alf[1] / 100) * esc0;
    var ax = x + (w - aw) / 2, ay = y + (hh - ah) / 2;

    var mueble = '';
    if (estado.amb === 'dormitorio') {
      var cw = Math.min(1.6, r.a * 0.6) * esc0, ch = 2 * esc0;
      mueble = '<rect x="' + (x + (w - cw) / 2) + '" y="' + (y + 10) + '" width="' + cw + '" height="' + ch +
        '" fill="#C4A484" fill-opacity=".28" stroke="#C4A484" stroke-width="1"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 10 + ch / 2) + '" text-anchor="middle" fill="#F4EDE7" font-size="11" font-family="Manrope, sans-serif" opacity=".8">cama</text>';
    } else if (estado.amb === 'comedor') {
      var mw = Math.min(1.0, r.a * 0.35) * esc0, mh = Math.min(2.0, r.l * 0.4) * esc0;
      mueble = '<rect x="' + (x + (w - mw) / 2) + '" y="' + (y + (hh - mh) / 2) + '" width="' + mw + '" height="' + mh +
        '" rx="6" fill="#C4A484" fill-opacity=".28" stroke="#C4A484" stroke-width="1"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + hh / 2 + 4) + '" text-anchor="middle" fill="#F4EDE7" font-size="11" font-family="Manrope, sans-serif" opacity=".8">mesa</text>';
    } else if (estado.amb === 'living') {
      var sw = Math.min(2.2, r.a * 0.65) * esc0, sh = 0.9 * esc0;
      mueble = '<rect x="' + (x + (w - sw) / 2) + '" y="' + (y + hh - sh - 8) + '" width="' + sw + '" height="' + sh +
        '" rx="5" fill="#C4A484" fill-opacity=".28" stroke="#C4A484" stroke-width="1"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + hh - sh / 2 - 4) + '" text-anchor="middle" fill="#F4EDE7" font-size="11" font-family="Manrope, sans-serif" opacity=".8">sillón</text>';
    } else {
      var kw = Math.min(1.2, r.a * 0.5) * esc0, kh = 0.4 * esc0;
      mueble = '<rect x="' + (x + (w - kw) / 2) + '" y="' + (y + 8) + '" width="' + kw + '" height="' + kh +
        '" rx="3" fill="#C4A484" fill-opacity=".28" stroke="#C4A484" stroke-width="1"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 8 + kh / 2 + 4) + '" text-anchor="middle" fill="#F4EDE7" font-size="11" font-family="Manrope, sans-serif" opacity=".8">consola</text>';
    }

    svg.innerHTML =
      '<defs><pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">' +
      '<path d="M14 0H0V14" fill="none" stroke="#F4EDE7" stroke-opacity=".07" stroke-width="1"/></pattern></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#grid)"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="none" stroke="#F4EDE7" stroke-opacity=".55" stroke-width="1.5"/>' +
      '<rect x="' + ax + '" y="' + ay + '" width="' + aw + '" height="' + ah + '" fill="#C4A484" fill-opacity=".16" stroke="#C4A484" stroke-width="1" stroke-dasharray="5 4"/>' +
      '<text x="' + (ax + aw / 2) + '" y="' + (ay + ah / 2 + 4) + '" text-anchor="middle" fill="#C4A484" font-size="12" font-family="Marcellus, serif">' +
      r.alf[0] + ' x ' + r.alf[1] + '</text>' +
      mueble +
      // cotas
      '<line x1="' + x + '" y1="' + (y - 16) + '" x2="' + (x + w) + '" y2="' + (y - 16) + '" stroke="#F4EDE7" stroke-opacity=".4"/>' +
      '<line x1="' + x + '" y1="' + (y - 21) + '" x2="' + x + '" y2="' + (y - 11) + '" stroke="#F4EDE7" stroke-opacity=".4"/>' +
      '<line x1="' + (x + w) + '" y1="' + (y - 21) + '" x2="' + (x + w) + '" y2="' + (y - 11) + '" stroke="#F4EDE7" stroke-opacity=".4"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y - 22) + '" text-anchor="middle" fill="#F4EDE7" fill-opacity=".7" font-size="11" font-family="Manrope, sans-serif">' + r.a.toFixed(1) + ' m</text>' +
      '<line x1="' + (x + w + 16) + '" y1="' + y + '" x2="' + (x + w + 16) + '" y2="' + (y + hh) + '" stroke="#F4EDE7" stroke-opacity=".4"/>' +
      '<text x="' + (x + w + 22) + '" y="' + (y + hh / 2) + '" fill="#F4EDE7" fill-opacity=".7" font-size="11" font-family="Manrope, sans-serif">' + r.l.toFixed(1) + ' m</text>' +
      '<text x="' + x + '" y="' + (y + hh + 22) + '" fill="#C4A484" font-size="11" font-family="Manrope, sans-serif">' + r.m2.toFixed(1) + ' m² · techo ' + r.h.toFixed(2) + ' m</text>';
  }

  /* Piezas del catálogo que entran en esas medidas. */
  function sugerencias(r) {
    var cont = $('#medSug'); if (!cont) return;
    var lista = GD.porAmbiente(estado.amb);
    if (!lista.length) lista = GD.productos();

    // La alfombra que más se acerca a la recomendada va siempre primera.
    var alfombras = lista.filter(function (p) { return p.cat === 'alfombras'; });
    var mejorAlf = null, mejorDif = 1e9;
    alfombras.forEach(function (p) {
      var m = (p.medida || '').match(/(\d+)\s*x\s*(\d+)/);
      if (!m) return;
      var dif = Math.abs(+m[1] - r.alf[0]) + Math.abs(+m[2] - r.alf[1]);
      if (dif < mejorDif) { mejorDif = dif; mejorAlf = p; }
    });

    var sel = [];
    if (mejorAlf) sel.push(mejorAlf);
    lista.forEach(function (p) {
      if (sel.length < 4 && sel.indexOf(p) < 0 && p.cat !== 'alfombras') sel.push(p);
    });

    var tit = $('#medSugTit');
    if (tit) tit.textContent = 'Piezas para tu ' + GD.nombreAmbiente(estado.amb).toLowerCase() +
      ' de ' + r.a.toFixed(1) + ' x ' + r.l.toFixed(1) + ' m';

    cont.innerHTML = sel.map(function (p) {
      var en = GD.cant(p.id) > 0;
      return '<div class="med-sug-it">' +
        '<img src="' + esc(p.img) + '" alt="" loading="lazy">' +
        '<div><b>' + esc(p.nombre) + '</b><span>' + esc(p.medida || p.catNom) + ' · ' + money(p.precio) + '</span></div>' +
        '<button class="' + (en ? 'in' : '') + '" data-add="' + esc(p.id) + '" aria-label="Sumar ' + esc(p.nombre) + ' al pedido">' +
        (en ? '✓' : '+') + '</button></div>';
    }).join('');
  }

  function montarMedidas() {
    var chips = $('#medChips');
    if (chips) {
      chips.innerHTML = GD.ambientes.map(function (a) {
        return '<button type="button" class="med-chip' + (a.id === estado.amb ? ' on' : '') +
          '" data-amb="' + esc(a.id) + '">' + esc(a.nombre) + '</button>';
      }).join('');
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('[data-amb]'); if (!b) return;
        estado.amb = b.getAttribute('data-amb');
        Array.prototype.forEach.call(chips.children, function (c) {
          c.classList.toggle('on', c === b);
        });
        pintarMedidas();
      });
    }
    ['mAncho', 'mLargo', 'mAlto'].forEach(function (id) {
      var el = $('#' + id); if (el) el.addEventListener('input', pintarMedidas);
    });
    var f = $('#medForm');
    if (f) f.addEventListener('submit', function (e) { e.preventDefault(); });
    pintarMedidas();
  }

  /* ── Arranque ────────────────────────────────────────── */
  GD.montarCarrito();
  pintarAmbientes();
  pintarDestacados();
  montarMedidas();

  GD.onCambio(function () { pintarDestacados(); pintarMedidas(); });

  // Catálogo real de CobrOS: reemplaza el de muestra cuando llega.
  GD.sincronizar().then(function (r) {
    var aviso = $('#estadoCatalogo');
    if (r && r.vacio && aviso) {
      aviso.hidden = false;
      aviso.textContent = 'Todavía no hay productos cargados en el panel. Entrá a tu app CobrOS y cargá el catálogo: aparecen acá al instante.';
      return;
    }
    if (r && r.conectado) { pintarAmbientes(); pintarDestacados(); pintarMedidas(); }
  });
})();
