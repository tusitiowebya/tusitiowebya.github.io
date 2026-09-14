/* MyD HOGAR — home. Todo lo numérico sale del catálogo real (window.MYD). */
(function () {
  'use strict';
  var M = window.MYD, CFG = M.cfg, esc = M.esc, money = M.money;
  var $ = function (s) { return document.querySelector(s); };

  /* ── Nav, flotantes, video ─────────────────────────────────── */
  var nav = $('#nav'), wa = $('.wa-float'), fab = $('.cart-fab');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('solid', y > 30);
    var pasado = y > window.innerHeight * 0.6;
    wa.classList.toggle('on', pasado);
    fab.classList.toggle('on', pasado && M.totalItems() > 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  M.onCambio(onScroll);

  var video = $('#heroVideo');
  if (video && !document.documentElement.classList.contains('lite')) {
    video.src = video.getAttribute('data-src');
    video.play().catch(function () {});
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add(en.target.classList.contains('pagos') ? 'visto' : 'in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  requestAnimationFrame(function () {
    Array.prototype.forEach.call(document.querySelectorAll('.hero .reveal'), function (el) { el.classList.add('in'); });
  });
  function observar() { Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.in), .pagos'), function (el) { io.observe(el); }); }

  /* ── Datos del hero y formas de pago ───────────────────────── */
  function nombreMedio(m) {
    var s = M.sinAcentos(m);
    if (/efectivo/.test(s)) return { k: 'efectivo', t: 'Efectivo en el local', d: '' };
    if (/transfer/.test(s)) return { k: 'transferencia', t: 'Transferencia', d: '' };
    if (/debito/.test(s)) return { k: 'debito', t: 'Tarjeta de débito', d: '' };
    if (/credito/.test(s)) return { k: 'credito', t: 'Tarjeta de crédito', d: '' };
    if (/mercado ?pago/.test(s)) return { k: 'mp', t: 'Mercado Pago', d: '' };
    return { k: s, t: m, d: '' };
  }
  function pintarDatos() {
    var ps = M.productos(), porMedio = {};
    ps.forEach(function (p) {
      p.medios.forEach(function (m) {
        if (m.pct <= 0) return;
        var n = nombreMedio(m.medio), o = porMedio[n.k] || (porMedio[n.k] = { n: n, max: 0, cant: 0 });
        o.max = Math.max(o.max, m.pct); o.cant++;
      });
    });
    var lista = Object.keys(porMedio).map(function (k) { return porMedio[k]; }).sort(function (a, b) { return b.max - a.max; });
    var el = document.querySelector('[data-dato="productos"]');
    if (el) el.textContent = ps.length;
    var ef = porMedio.efectivo;
    el = document.querySelector('[data-dato="dto"]');
    if (el && ef) el.textContent = '−' + ef.max + '%';
    var top = lista.length ? lista[0].max : 1;
    $('#pagosGrid').innerHTML = lista.slice(0, 5).map(function (o) {
      return '<article class="pago"><div class="pago-pct"><small>hasta</small>−' + o.max + '%</div>' +
        '<h3>' + esc(o.n.t) + '</h3><p>' + (o.n.d ? esc(o.n.d) + ' · ' : '') + o.cant + ' productos con descuento</p>' +
        '<div class="pago-barra"><i style="--w:' + Math.round(o.max / top * 100) + '%"></i></div></article>';
    }).join('');
  }

  /* ── Rubros ────────────────────────────────────────────────── */
  function pintarRubros() {
    var ps = M.productos(), g = {};
    ps.forEach(function (p) { (g[p.rubro] = g[p.rubro] || []).push(p); });
    var lista = M.rubros.filter(function (r) { return r.id !== 'varios' && g[r.id]; })
      .sort(function (a, b) {
        var va = g[a.id].reduce(function (s, p) { return s + p.precio; }, 0), vb = g[b.id].reduce(function (s, p) { return s + p.precio; }, 0);
        return vb - va;
      }).slice(0, 10);
    $('#rubrosGrid').innerHTML = lista.map(function (r) {
      var conFoto = g[r.id].filter(function (p) { return p.img && !p.usado; }).sort(function (a, b) { return b.precio - a.precio; });
      var p = conFoto[0];
      return '<a class="rubro reveal" href="catalogo/?cat=' + r.id + '">' + (p ? M.imgTag(p) : '') +
        '<h3>' + esc(r.nombre) + '</h3><span>' + g[r.id].length + ' productos · desde ' +
        money(Math.min.apply(null, g[r.id].map(function (x) { return x.precio; }))) + '</span></a>';
    }).join('');
  }

  /* ── Destacados: lo más grande de cada rubro ───────────────── */
  function pintarDestacados() {
    var orden = ['electro', 'clima', 'dormitorio', 'muebles', 'tecno', 'aberturas', 'electro', 'dormitorio'];
    var usados = {}, sel = [];
    orden.forEach(function (rid) {
      var c = M.productos().filter(function (p) { return p.rubro === rid && p.img && !p.usado && !usados[p.id]; })
        .sort(function (a, b) { return b.precio - a.precio; })[0];
      if (c) { usados[c.id] = 1; sel.push(c); }
    });
    $('#destRail').innerHTML = sel.map(M.cardHTML).join('');
  }

  /* ── Signature: Armá tu casa ───────────────────────────────── */
  var SALAS = CFG.SALAS || [];
  var GEO = {
    chicos:     { x: 150, y: 112, w: 108, h: 74, ico: 'M-12,6 a12,12 0 1,1 24,0 M-6,-4 h0 M6,-4 h0' },
    bano:       { x: 262, y: 112, w: 108, h: 74, ico: 'M-13,-2 h26 v4 a13,11 0 0,1 -26,0 z M-8,-2 v-10 h6' },
    cocina:     { x: 48,  y: 196, w: 136, h: 148, ico: 'M-12,-12 h24 v26 h-24 z M-12,-2 h24 M6,-8 v3' },
    living:     { x: 190, y: 196, w: 140, h: 148, ico: 'M-15,4 v-8 a4,4 0 0,1 8,0 v4 h14 v-4 a4,4 0 0,1 8,0 v8 z M-12,4 v5 M12,4 v5' },
    dormitorio: { x: 336, y: 196, w: 136, h: 148, ico: 'M-16,8 v-14 M-16,2 h32 v6 M-12,-2 h8 a3,3 0 0,1 0,4' },
    patio:      { x: 48,  y: 350, w: 212, h: 96,  ico: 'M-12,10 l14,-22 M2,-12 l8,4 -4,6 -8,-4 z' },
    puerta:     { x: 266, y: 350, w: 206, h: 96,  ico: 'M-9,12 v-24 h18 v24 M4,1 h0' }
  };
  var salaActiva = 'cocina';

  function productosDeSala(id) {
    return M.productos().filter(function (p) { return p.sala === id; })
      .sort(function (a, b) { return (b.img ? 1 : 0) - (a.img ? 1 : 0) || (a.usado ? 1 : 0) - (b.usado ? 1 : 0) || b.precio - a.precio; });
  }
  function enCarritoPorSala() {
    var r = {};
    M.itemsCarrito().forEach(function (k) { var p = M.buscar(k); r[p.sala] = (r[p.sala] || 0) + M.cant(k); });
    return r;
  }

  function pintarPlano() {
    var cnt = enCarritoPorSala();
    $('#salas').innerHTML = SALAS.map(function (s) {
      var g = GEO[s.id]; if (!g) return '';
      var n = cnt[s.id] || 0, lleno = Math.min(1, n / 3), cx = g.x + g.w / 2;
      var hLleno = g.h * lleno;
      return '<g class="sala' + (s.id === salaActiva ? ' activa' : '') + (n ? ' llena' : '') + '" data-sala="' + s.id + '" tabindex="0" role="button" aria-label="' + esc(s.nombre) + (n ? ', ' + n + ' productos' : '') + '">' +
        '<rect class="s-caja" x="' + g.x + '" y="' + g.y + '" width="' + g.w + '" height="' + g.h + '" rx="10"/>' +
        '<rect class="s-llenado" x="' + g.x + '" y="' + (g.y + g.h - hLleno) + '" width="' + g.w + '" height="' + hLleno + '" rx="10" style="opacity:' + (n ? 0.22 + lleno * 0.5 : 0) + '"/>' +
        '<path class="s-ico" transform="translate(' + cx + ' ' + (g.y + g.h / 2 - (g.h > 90 ? 16 : 10)) + ')" d="' + g.ico + '"/>' +
        '<text x="' + cx + '" y="' + (g.y + g.h - (g.h > 90 ? 22 : 12)) + '" text-anchor="middle">' + esc(s.nombre.replace('Cuarto de los chicos', 'Chicos')) + '</text>' +
        (n ? '<text class="s-cant" x="' + (g.x + g.w - 16) + '" y="' + (g.y + 26) + '" text-anchor="end">' + n + '</text>' : '') +
        '</g>';
    }).join('');
  }

  function pintarTabs() {
    $('#apTabs').innerHTML = SALAS.map(function (s) {
      return '<button type="button" class="ap-tab" role="tab" data-sala="' + s.id + '" aria-selected="' + (s.id === salaActiva) + '">' + esc(s.nombre) + '</button>';
    }).join('');
  }

  function pintarRail() {
    var s = SALAS.filter(function (x) { return x.id === salaActiva; })[0];
    $('#apTitulo').textContent = s.nombre;
    $('#apCopy').textContent = s.copy;
    var todos = productosDeSala(salaActiva), lista = todos.slice(0, 6);
    $('#apRail').innerHTML = lista.map(function (p) {
      var mm = M.mejorMedio(p), n = M.cant(p.id);
      return '<div class="mini">' + M.imgTag(p) + '<div style="min-width:0"><h4>' + esc(p.nombre) + '</h4>' +
        '<div class="mini-precio">' + money(p.precio) + (mm ? '<small>−' + mm.pct + '% ' + esc(mm.medio.toLowerCase()) + '</small>' : '') + '</div>' +
        '<div class="mini-accion">' + (n
          ? '<button type="button" data-menos="' + esc(p.id) + '" aria-label="Quitar uno">−</button><span>' + n + '</span><button type="button" data-mas="' + esc(p.id) + '" aria-label="Sumar uno">+</button>'
          : '<button type="button" class="sumar" data-sumar-sala="' + esc(p.id) + '">+ Sumar</button>') +
        '</div></div></div>';
    }).join('') + (todos.length > lista.length
      ? '<a class="ap-mas" href="catalogo/?sala=' + salaActiva + '">Ver los ' + todos.length + ' productos de ' + esc(s.nombre.toLowerCase()) + ' →</a>' : '');
  }

  function pintarResumen() {
    var cnt = enCarritoPorSala(), equipados = SALAS.filter(function (s) { return cnt[s.id]; }).length;
    var total = M.totalPesos(), items = M.totalItems();
    var el = $('#apResumen');
    if (!items) {
      el.innerHTML = '<div class="apr-top"><strong>Tu casa todavía está vacía</strong><span>0 de ' + SALAS.length + ' ambientes</span></div>' +
        '<div class="apr-barra"><i style="width:0"></i></div><p class="apr-vacio">Sumá productos y acá vas a ver cuánto sale pagando en efectivo, con transferencia o con tarjeta.</p>';
      return;
    }
    var alt = M.totalesPorMedio();
    el.innerHTML = '<div class="apr-top"><strong>' + items + ' producto' + (items > 1 ? 's' : '') + ' en tu casa</strong><span>' + equipados + ' de ' + SALAS.length + ' ambientes</span></div>' +
      '<div class="apr-barra"><i style="width:' + Math.round(equipados / SALAS.length * 100) + '%"></i></div>' +
      '<ul class="apr-lista"><li class="lista"><span>Precio de lista</span><b>' + money(total) + '</b></li>' +
      alt.map(function (t, i) { return '<li class="' + (i === 0 ? 'mejor' : '') + '"><span>' + esc(t.medio) + '</span><b>' + money(t.total) + '</b></li>'; }).join('') +
      '<li><span>En cuotas con cobrador</span><b>Por WhatsApp</b></li></ul>' +
      '<div class="apr-botones"><button type="button" class="btn btn-verde" data-cart-open>Ver mi pedido</button>' +
      '<a class="btn btn-line" href="' + esc(M.linkWA(M.mensajeWA() + '\n\n¿Cómo me queda en cuotas?')) + '" target="_blank" rel="noopener">Consultar cuotas</a></div>';
  }

  function pintarArmar() { pintarPlano(); pintarTabs(); pintarRail(); pintarResumen(); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-sala]');
    if (t && t.closest('.armar')) {
      salaActiva = t.getAttribute('data-sala'); pintarArmar();
      if (t.closest('.plano') && window.innerWidth <= 900) $('.armar-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var s = e.target.closest('[data-sumar-sala]');
    if (s) { var p = M.buscar(s.getAttribute('data-sumar-sala')); M.agregar(p.id, 1); M.toast('Sumaste ' + p.nombre.slice(0, 40)); return; }
    var f = e.target.closest('[data-ficha]');
    if (f) location.href = 'catalogo/?p=' + encodeURIComponent(f.getAttribute('data-ficha'));
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target.closest && e.target.closest('g[data-sala]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });

  /* ── Zonas y reseñas ───────────────────────────────────────── */
  var zonas = CFG.ZONAS || [];
  $('#zonasTrack').innerHTML = zonas.concat(zonas).map(function (z) { return '<span>' + esc(z) + '</span>'; }).join('');
  $('#zonasLista').innerHTML = zonas.map(function (z) { return '<li>' + esc(z) + '</li>'; }).join('');

  M.resenas().then(function (d) {
    if (!d || !d.cantidad) return;
    $('#resenas').hidden = false;
    $('#resProm').textContent = '★ ' + String(d.promedio).replace('.', ',') + ' de 5 · ' + d.cantidad + (d.cantidad === 1 ? ' opinión' : ' opiniones');
    $('#resGrid').innerHTML = d.resenas.slice(0, 6).map(function (r) {
      return '<figure class="res"><div class="res-est">' + '★★★★★'.slice(0, r.estrellas) + '<span style="opacity:.25">' + '★★★★★'.slice(r.estrellas) + '</span></div>' +
        (r.comentario ? '<blockquote>“' + esc(r.comentario) + '”</blockquote>' : '') +
        '<figcaption>' + esc(r.nombreCliente) + '</figcaption></figure>';
    }).join('');
  });

  /* ── Pintado inicial + catálogo en vivo ────────────────────── */
  function pintarTodo() { pintarDatos(); pintarRubros(); pintarDestacados(); pintarArmar(); observar(); }
  pintarTodo();
  M.montarCarrito();
  M.onCambio(function () { pintarPlano(); pintarRail(); pintarResumen(); });
  M.sincronizar().then(function (r) {
    $('#fuente').textContent = r.fuente === 'vivo'
      ? 'Precios en vivo desde el sistema de MyD HOGAR. Se confirman al momento de la compra.'
      : 'Precios del sistema de MyD HOGAR al ' + CFG.SNAPSHOT_FECHA + '. Se confirman al momento de la compra.';
    if (r.fuente === 'vivo') pintarTodo();
  });
  onScroll();
})();
