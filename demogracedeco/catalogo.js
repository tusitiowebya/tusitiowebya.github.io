/* ══════════════════════════════════════════════════════════
   Grace Deco — catálogo completo
   Comparte carrito y datos con el home a través de window.GD.
   Filtros en la URL: ?cat= ?amb= ?q= ?orden= ?p=
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = GD.esc, money = GD.money, sinAcentos = GD.sinAcentos;

  if (/[?&]qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent)) {
    document.documentElement.classList.add('qa');
  }

  var qs = new URLSearchParams(location.search);
  var estado = {
    cat: qs.get('cat') || '',
    amb: qs.get('amb') || '',
    q: qs.get('q') || '',
    orden: qs.get('orden') || 'destacado'
  };

  /* ── Nav ─────────────────────────────────────────────── */
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var burger = $('#burger');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  var waHome = GD.linkWA('Hola Grace Deco! Estoy mirando el catálogo y quiero consultar por una pieza.');
  ['#waFooter', '#waFloat'].forEach(function (s) { var el = $(s); if (el) el.href = waHome; });
  var anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();

  /* ── URL ─────────────────────────────────────────────── */
  function sincronizarURL(p) {
    var u = new URLSearchParams();
    if (estado.cat) u.set('cat', estado.cat);
    if (estado.amb) u.set('amb', estado.amb);
    if (estado.q) u.set('q', estado.q);
    if (estado.orden !== 'destacado') u.set('orden', estado.orden);
    if (p) u.set('p', p);
    var s = u.toString();
    history.replaceState(null, '', s ? '?' + s : location.pathname);
  }

  /* ── Filtrado ────────────────────────────────────────── */
  function filtrados() {
    var q = sinAcentos(estado.q).trim();
    return GD.productos().filter(function (p) {
      if (estado.cat && p.cat !== estado.cat) return false;
      if (estado.amb && (p.amb || []).indexOf(estado.amb) < 0) return false;
      if (q) {
        var heno = sinAcentos([p.nombre, p.catNom, p.medida, p.material].join(' '));
        if (heno.indexOf(q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      if (estado.orden === 'precio-asc') return a.precio - b.precio;
      if (estado.orden === 'precio-desc') return b.precio - a.precio;
      if (estado.orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es');
      return (b.dest ? 1 : 0) - (a.dest ? 1 : 0) || a.catNom.localeCompare(b.catNom, 'es');
    });
  }

  /* ── Sidebar ─────────────────────────────────────────── */
  function pintarSidebar() {
    var todos = GD.productos();
    var cats = {};
    todos.forEach(function (p) { cats[p.cat] = (cats[p.cat] || 0) + 1; });

    var lista = Object.keys(cats).sort(function (a, b) {
      return (GD.catNombres[a] || a).localeCompare(GD.catNombres[b] || b, 'es');
    });

    $('#sideCats').innerHTML =
      '<button class="' + (estado.cat ? '' : 'on') + '" data-cat="">Todo el catálogo <i>' + todos.length + '</i></button>' +
      lista.map(function (c) {
        var nom = GD.catNombres[c] || (todos.filter(function (p) { return p.cat === c; })[0] || {}).catNom || c;
        return '<button class="' + (estado.cat === c ? 'on' : '') + '" data-cat="' + esc(c) + '">' +
          esc(nom) + ' <i>' + cats[c] + '</i></button>';
      }).join('');

    $('#sideAmb').innerHTML =
      '<button class="' + (estado.amb ? '' : 'on') + '" data-amb="">Cualquiera</button>' +
      GD.ambientes.map(function (a) {
        return '<button class="' + (estado.amb === a.id ? 'on' : '') + '" data-amb="' + esc(a.id) + '">' +
          esc(a.nombre) + ' <i>' + GD.porAmbiente(a.id).length + '</i></button>';
      }).join('');
  }

  /* ── Grilla ──────────────────────────────────────────── */
  function cardHTML(p) {
    var en = GD.cant(p.id) > 0;
    var mm = GD.mejorMedio(p);
    return '<article class="card" data-id="' + esc(p.id) + '">' +
      (p.dest ? '<span class="card-flag">Más elegido</span>' : '') +
      '<div class="card-img"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" data-ver="' + esc(p.id) + '" style="cursor:zoom-in">' +
      '<button class="card-add' + (en ? ' in' : '') + '" data-add="' + esc(p.id) + '">' +
      (en ? 'En tu pedido (' + GD.cant(p.id) + ')' : 'Sumar al pedido') + '</button></div>' +
      '<span class="card-cat">' + esc(p.catNom) + '</span>' +
      '<h3><a href="#" data-ver="' + esc(p.id) + '">' + esc(p.nombre) + '</a></h3>' +
      (p.medida ? '<span class="card-med">' + esc(p.medida) + '</span>' : '') +
      '<div class="card-precio"><b>' + money(p.precio) + '</b>' +
      (mm ? '<span>' + money(mm.precioFinal) + ' con ' + esc(mm.medio.toLowerCase()) + '</span>' :
        (p.cuotas ? '<span>' + p.cuotas + ' cuotas sin interés</span>' : '')) +
      '</div></article>';
  }

  function pintar() {
    var lista = filtrados();
    var cont = $('#grid');
    cont.innerHTML = lista.length
      ? lista.map(cardHTML).join('')
      : '<div class="vacio"><strong>No encontramos esa pieza</strong>' +
        '<span>Probá con otra palabra o sacá algún filtro.</span></div>';
    $('#count').textContent = lista.length + (lista.length === 1 ? ' pieza' : ' piezas');

    var chips = [];
    if (estado.cat) chips.push(['cat', GD.catNombres[estado.cat] || estado.cat]);
    if (estado.amb) chips.push(['amb', GD.nombreAmbiente(estado.amb)]);
    if (estado.q) chips.push(['q', '“' + estado.q + '”']);
    $('#chips').innerHTML = chips.map(function (c) {
      return '<button class="chip-act" data-quitar="' + c[0] + '">' + esc(c[1]) + ' <b>×</b></button>';
    }).join('');

    pintarSidebar();
    sincronizarURL();
  }

  /* ── Ficha lateral ───────────────────────────────────── */
  var ficha = $('#ficha');
  function abrirFicha(id) {
    var p = GD.buscar(id); if (!p) return;
    var mm = (p.medios || []).filter(function (m) { return m.pct > 0; });
    var en = GD.cant(p.id);
    ficha.innerHTML =
      '<button class="ficha-close" data-ficha-close aria-label="Cerrar">×</button>' +
      '<div class="ficha-img"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '"></div>' +
      '<div class="ficha-txt">' +
        '<span class="card-cat">' + esc(p.catNom) + '</span>' +
        '<h2>' + esc(p.nombre) + '</h2>' +
        '<div class="ficha-precio"><b>' + money(p.precio) + '</b>' +
        (p.cuotas ? '<span class="card-precio"><span>' + p.cuotas + ' cuotas sin interés</span></span>' : '') + '</div>' +
        (mm.length ? '<ul class="ficha-medios">' + mm.map(function (m) {
          return '<li><span>' + esc(m.medio) + ' (−' + m.pct + '%)</span><b>' +
            money(GD.precioCon(p.precio, m.pct)) + '</b></li>';
        }).join('') + '</ul>' : '') +
        '<div class="ficha-specs">' + (p.specs || []).map(function (s) {
          return '<span>' + esc(s) + '</span>';
        }).join('') + '</div>' +
        '<div class="ficha-acc">' +
          '<button class="btn btn-dark btn-block" data-add="' + esc(p.id) + '">' +
          (en ? 'Sumar otra (' + en + ' en tu pedido)' : 'Sumar al pedido') + '</button>' +
          '<a class="btn btn-line btn-block" href="' + esc(GD.linkWA('Hola Grace Deco! Quiero consultar por: ' + p.nombre + (p.medida ? ' (' + p.medida + ')' : ''))) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        '</div>' +
        ((p.amb || []).length ? '<p class="ficha-amb">Queda bien en: ' + p.amb.map(function (a) {
          return '<a href="#" data-amb-link="' + esc(a) + '">' + esc(GD.nombreAmbiente(a)) + '</a>';
        }).join(' · ') + '</p>' : '') +
      '</div>';
    ficha.classList.add('open');
    document.body.classList.add('no-scroll');
    ficha.setAttribute('aria-hidden', 'false');
    sincronizarURL(id);
  }
  function cerrarFicha() {
    ficha.classList.remove('open');
    document.body.classList.remove('no-scroll');
    ficha.setAttribute('aria-hidden', 'true');
    sincronizarURL();
  }

  /* ── Eventos ─────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cat],[data-amb],[data-add],[data-ver],[data-quitar],[data-ficha-close],[data-amb-link],#sideToggle');
    if (!t) return;

    if (t.id === 'sideToggle') { $('#side').classList.toggle('open'); return; }
    if (t.hasAttribute('data-add')) {
      GD.agregar(t.getAttribute('data-add'), 1);
      GD.abrirCarrito && GD.abrirCarrito();
      return;
    }
    if (t.hasAttribute('data-ver')) { e.preventDefault(); abrirFicha(t.getAttribute('data-ver')); return; }
    if (t.hasAttribute('data-ficha-close')) { cerrarFicha(); return; }
    if (t.hasAttribute('data-amb-link')) {
      e.preventDefault(); estado.amb = t.getAttribute('data-amb-link'); estado.cat = '';
      cerrarFicha(); pintar(); window.scrollTo({ top: 260, behavior: 'smooth' }); return;
    }
    if (t.hasAttribute('data-cat')) { estado.cat = t.getAttribute('data-cat'); pintar(); return; }
    if (t.hasAttribute('data-amb')) { estado.amb = t.getAttribute('data-amb'); pintar(); return; }
    if (t.hasAttribute('data-quitar')) {
      estado[t.getAttribute('data-quitar')] = '';
      if (t.getAttribute('data-quitar') === 'q') $('#q').value = '';
      pintar(); return;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ficha.classList.contains('open')) cerrarFicha();
  });

  var inputQ = $('#q');
  inputQ.value = estado.q;
  var deb;
  inputQ.addEventListener('input', function () {
    clearTimeout(deb);
    deb = setTimeout(function () { estado.q = inputQ.value.trim(); pintar(); }, 180);
  });
  var selOrden = $('#orden');
  selOrden.value = estado.orden;
  selOrden.addEventListener('change', function () { estado.orden = selOrden.value; pintar(); });
  $('#reset').addEventListener('click', function () {
    estado.cat = ''; estado.amb = ''; estado.q = ''; inputQ.value = ''; pintar();
  });

  /* ── Arranque ────────────────────────────────────────── */
  GD.montarCarrito();
  pintar();
  GD.onCambio(pintar);

  var pIni = qs.get('p');
  if (pIni) setTimeout(function () { abrirFicha(pIni); }, 60);

  GD.sincronizar().then(function (r) {
    if (r && r.vacio) {
      $('#grid').innerHTML = '<div class="vacio"><strong>Todavía no hay productos cargados</strong>' +
        '<span>Entrá a tu app CobrOS y cargá el catálogo: aparecen acá al instante.</span></div>';
      return;
    }
    if (r && r.conectado) pintar();
  });
})();
