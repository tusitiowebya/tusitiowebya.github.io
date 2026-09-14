/* MyD HOGAR — catálogo completo. Filtros reflejados en la URL:
   ?cat= ?sala= ?q= ?pago= ?precio= ?cuotas=1 ?foto=1 ?orden= ?p=<id> */
(function () {
  'use strict';
  var M = window.MYD, CFG = M.cfg, esc = M.esc, money = M.money;
  var $ = function (s) { return document.querySelector(s); };
  var PASO = 24;

  var PRECIOS = [
    { id: 'a', t: 'Hasta $25.000', min: 0, max: 25000 },
    { id: 'b', t: '$25.000 a $100.000', min: 25000, max: 100000 },
    { id: 'c', t: '$100.000 a $300.000', min: 100000, max: 300000 },
    { id: 'd', t: 'Más de $300.000', min: 300000, max: Infinity }
  ];

  var qs = new URLSearchParams(location.search);
  var st = {
    cat: qs.get('cat') || '', sala: qs.get('sala') || '', q: qs.get('q') || '', pago: qs.get('pago') || '',
    precio: qs.get('precio') || '', cuotas: qs.get('cuotas') === '1', foto: qs.get('foto') === '1',
    orden: qs.get('orden') || 'rel', p: qs.get('p') || ''
  };
  var visibles = PASO;

  function medioKey(m) { return M.sinAcentos(m).replace(/[^a-z]/g, ''); }

  /* ── Filtrado ──────────────────────────────────────────────── */
  function pasa(p, sin) {
    sin = sin || '';
    if (sin !== 'cat' && st.cat && p.rubro !== st.cat) return false;
    if (sin !== 'cat' && st.sala && p.sala !== st.sala) return false;
    if (sin !== 'pago' && st.pago && !p.medios.some(function (m) { return m.pct > 0 && medioKey(m.medio) === st.pago; })) return false;
    if (sin !== 'precio' && st.precio) {
      var r = PRECIOS.filter(function (x) { return x.id === st.precio; })[0];
      if (r && (p.precio < r.min || p.precio >= r.max)) return false;
    }
    if (st.cuotas && !(p.cuotas > 1)) return false;
    if (st.foto && !p.img) return false;
    if (st.q) {
      var txt = M.palabras(p.nombre + ' ' + p.rubroNom + ' ' + p.marca + ' ' + p.nombreOriginal);
      var ok = M.palabras(st.q).trim().split(' ').every(function (w) { return !w || txt.indexOf(' ' + w) >= 0; });
      if (!ok) return false;
    }
    return true;
  }
  function ordenar(lista) {
    var dto = function (p) { var m = M.mejorMedio(p); return m ? m.pct : 0; };
    var f = {
      rel: function (a, b) { return ((b.img ? 2 : 0) + (b.usado ? 0 : 1)) - ((a.img ? 2 : 0) + (a.usado ? 0 : 1)) || dto(b) - dto(a) || b.precio - a.precio; },
      menor: function (a, b) { return a.precio - b.precio; },
      mayor: function (a, b) { return b.precio - a.precio; },
      dto: function (a, b) { return dto(b) - dto(a) || a.precio - b.precio; },
      az: function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); }
    }[st.orden] || function () { return 0; };
    var orden = lista.slice().sort(f);
    if (st.orden !== 'rel' || st.cat || st.sala || st.q) return orden;
    // Destacados sin filtro: se intercalan los rubros para que no arranque todo con puertas.
    var baldes = {}, claves = [];
    orden.forEach(function (p) { if (!baldes[p.rubro]) { baldes[p.rubro] = []; claves.push(p.rubro); } baldes[p.rubro].push(p); });
    var mezcla = [];
    for (var i = 0; mezcla.length < orden.length; i++) claves.forEach(function (k) { if (baldes[k][i]) mezcla.push(baldes[k][i]); });
    return mezcla;
  }

  /* ── URL ───────────────────────────────────────────────────── */
  function urlSync() {
    var u = new URLSearchParams();
    ['cat', 'sala', 'q', 'pago', 'precio', 'p'].forEach(function (k) { if (st[k]) u.set(k, st[k]); });
    if (st.cuotas) u.set('cuotas', '1');
    if (st.foto) u.set('foto', '1');
    if (st.orden !== 'rel') u.set('orden', st.orden);
    var s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }

  /* ── Pintado ───────────────────────────────────────────────── */
  function pintarFiltros() {
    var ps = M.productos();
    var base = ps.filter(function (p) { return pasa(p, 'cat'); }), cuentas = {};
    base.forEach(function (p) { cuentas[p.rubro] = (cuentas[p.rubro] || 0) + 1; });
    var rubros = M.rubros.filter(function (r) { return ps.some(function (p) { return p.rubro === r.id; }); })
      .sort(function (a, b) { return (cuentas[b.id] || 0) - (cuentas[a.id] || 0); });

    var todos = base.length;
    $('#fRubros').innerHTML = '<li><button type="button" data-f="cat" data-v="" class="' + (!st.cat && !st.sala ? 'on' : '') + '">Todos<span>' + todos + '</span></button></li>' +
      rubros.map(function (r) {
        return '<li><button type="button" data-f="cat" data-v="' + r.id + '" class="' + (st.cat === r.id ? 'on' : '') + '"' + (cuentas[r.id] ? '' : ' disabled') + '>' +
          esc(r.nombre) + '<span>' + (cuentas[r.id] || 0) + '</span></button></li>';
      }).join('');
    $('#catChips').innerHTML = '<button type="button" role="tab" data-f="cat" data-v="" aria-selected="' + (!st.cat && !st.sala) + '">Todo</button>' +
      rubros.map(function (r) { return '<button type="button" role="tab" data-f="cat" data-v="' + r.id + '" aria-selected="' + (st.cat === r.id) + '">' + esc(r.nombre) + '</button>'; }).join('');

    var pagos = {}, basePago = ps.filter(function (p) { return pasa(p, 'pago'); });
    basePago.forEach(function (p) {
      p.medios.forEach(function (m) {
        if (m.pct <= 0) return;
        var k = medioKey(m.medio), o = pagos[k] || (pagos[k] = { t: m.medio, n: 0, max: 0 });
        o.n++; o.max = Math.max(o.max, m.pct);
      });
    });
    $('#fPagos').innerHTML = Object.keys(pagos).sort(function (a, b) { return pagos[b].n - pagos[a].n; }).map(function (k) {
      var o = pagos[k];
      return '<li><button type="button" data-f="pago" data-v="' + k + '" class="' + (st.pago === k ? 'on' : '') + '">' + esc(o.t) +
        ' <em>hasta −' + o.max + '%</em><span>' + o.n + '</span></button></li>';
    }).join('') || '<li class="side-nada">Ninguno con estos filtros</li>';

    var basePrecio = ps.filter(function (p) { return pasa(p, 'precio'); });
    $('#fPrecio').innerHTML = PRECIOS.map(function (r) {
      var n = basePrecio.filter(function (p) { return p.precio >= r.min && p.precio < r.max; }).length;
      return '<li><button type="button" data-f="precio" data-v="' + r.id + '" class="' + (st.precio === r.id ? 'on' : '') + '"' + (n ? '' : ' disabled') + '>' + r.t + '<span>' + n + '</span></button></li>';
    }).join('');
    $('#fCuotas').checked = st.cuotas;
    $('#fFoto').checked = st.foto;
    $('#orden').value = st.orden;
    if ($('#q').value !== st.q) $('#q').value = st.q;
  }

  function nombreFiltro() {
    if (st.cat) { var r = M.rubroPorId(st.cat); return r ? r.nombre : 'Catálogo'; }
    if (st.sala) { var s = (CFG.SALAS || []).filter(function (x) { return x.id === st.sala; })[0]; return s ? s.nombre : 'Catálogo'; }
    return 'Todo el catálogo';
  }

  function pintarActivos() {
    var chips = [];
    if (st.sala) chips.push(['sala', 'Ambiente: ' + nombreFiltro()]);
    if (st.q) chips.push(['q', '“' + st.q + '”']);
    if (st.pago) { var p = M.productos().reduce(function (a, x) { return a || x.medios.filter(function (m) { return medioKey(m.medio) === st.pago; })[0]; }, null); chips.push(['pago', p ? p.medio : st.pago]); }
    if (st.precio) chips.push(['precio', PRECIOS.filter(function (x) { return x.id === st.precio; })[0].t]);
    if (st.cuotas) chips.push(['cuotas', 'Cuotas sin interés']);
    if (st.foto) chips.push(['foto', 'Con foto']);
    $('#catActivos').innerHTML = chips.map(function (c) {
      return '<button type="button" data-quitar="' + c[0] + '">' + esc(c[1]) + ' <b>×</b></button>';
    }).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    var n = chips.length + (st.cat ? 1 : 0);
    $('#nFiltros').textContent = n ? '(' + n + ')' : '';
  }

  function pintarGrid() {
    var lista = ordenar(M.productos().filter(function (p) { return pasa(p); }));
    $('#catTitulo').textContent = nombreFiltro();
    $('#catCuenta').textContent = lista.length + (lista.length === 1 ? ' producto' : ' productos');
    if (!lista.length) {
      $('#catGrid').innerHTML = '<div class="cat-vacio"><svg aria-hidden="true"><use href="#casa"/></svg>' +
        '<strong>No encontramos productos con esos filtros</strong>' +
        '<p>Puede que lo tengamos en el local y no esté publicado.</p>' +
        '<a class="btn btn-verde" href="' + esc(M.linkWA('Hola MyD HOGAR, estoy buscando: ' + (st.q || nombreFiltro()))) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>';
      $('#verMas').hidden = true;
      return;
    }
    $('#catGrid').innerHTML = lista.slice(0, visibles).map(M.cardHTML).join('');
    $('#verMas').hidden = lista.length <= visibles;
    $('#verMas').textContent = 'Ver ' + Math.min(PASO, lista.length - visibles) + ' productos más';
  }

  function pintar() { pintarFiltros(); pintarActivos(); pintarGrid(); urlSync(); }

  /* ── Ficha lateral ─────────────────────────────────────────── */
  var ficha = $('#ficha'), fichaScrim = $('#fichaScrim'), cantFicha = 1;
  function abrirFicha(id) {
    var p = M.buscar(id);
    if (!p) return;
    st.p = id; cantFicha = 1; urlSync();
    var filas = p.medios.slice().sort(function (a, b) { return b.pct - a.pct; }).map(function (m) {
      return '<tr' + (m.pct > 0 ? '' : ' class="sin"') + '><td>' + esc(m.medio) + '</td><td>' + (m.pct > 0 ? '−' + m.pct + '%' : '—') + '</td><td>' + money(M.precioCon(p.precio, m.pct)) + '</td></tr>';
    }).join('');
    ficha.innerHTML = '<button type="button" class="ficha-x" data-ficha-close aria-label="Cerrar">×</button>' +
      '<div class="ficha-foto">' + M.imgTag(p) + '</div>' +
      '<div class="ficha-body">' +
        '<p class="ficha-rubro">' + esc(p.rubroNom) + (p.marca ? ' · ' + esc(p.marca) : '') + '</p>' +
        '<h2>' + (p.usado ? '<span class="tag-usado">Usado</span>' : '') + esc(p.nombre) + '</h2>' +
        '<div class="ficha-precio"><span>Precio de lista</span><b>' + money(p.precio) + '</b></div>' +
        (filas ? '<table class="ficha-tabla"><thead><tr><th>Pagando con</th><th>Dto.</th><th>Final</th></tr></thead><tbody>' + filas + '</tbody></table>' : '') +
        (p.cuotas > 1 ? '<p class="ficha-cuotas"><b>' + p.cuotas + ' cuotas sin interés</b> de ' + money(p.precio / p.cuotas) + '</p>' : '') +
        '<p class="ficha-cobrador">¿Lo querés en cuotas semanales o mensuales con cobrador a domicilio? Lo armamos por WhatsApp.</p>' +
        (p.desc && p.desc.length > 3 ? '<p class="ficha-desc">' + esc(p.desc) + '</p>' : '') +
        '<div class="ficha-accion"><div class="qty"><button type="button" data-fq="-1" aria-label="Menos">−</button><span id="fq">1</span><button type="button" data-fq="1" aria-label="Más">+</button></div>' +
        '<button type="button" class="btn btn-verde" data-ficha-sumar="' + esc(p.id) + '">Sumar al pedido</button></div>' +
        '<a class="btn btn-line btn-block" href="' + esc(M.linkWA('Hola MyD HOGAR, quiero consultar por: ' + p.nombre + ' (' + money(p.precio) + ')' + (p.cod && !/^treinta-/.test(p.cod) ? ' · cód. ' + p.cod : ''))) + '" target="_blank" rel="noopener"><svg><use href="#wa"/></svg> Consultar este producto</a>' +
      '</div>';
    ficha.classList.add('open'); fichaScrim.classList.add('on');
    ficha.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll');
    ficha.scrollTop = 0;
  }
  function cerrarFicha() {
    ficha.classList.remove('open'); fichaScrim.classList.remove('on');
    ficha.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll');
    st.p = ''; urlSync();
  }

  /* ── Eventos ───────────────────────────────────────────────── */
  var side = $('#catSide'), sideScrim = $('#sideScrim');
  function lado(open) { side.classList.toggle('open', open); sideScrim.classList.toggle('on', open); document.body.classList.toggle('no-scroll', open); }

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-f]'))) {
      var f = t.getAttribute('data-f'), v = t.getAttribute('data-v');
      if (f === 'cat') { st.cat = v; st.sala = ''; } else st[f] = st[f] === v ? '' : v;
      visibles = PASO; pintar();
      if (t.closest('.cat-rubros')) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      return;
    }
    if ((t = e.target.closest('[data-quitar]'))) { var k = t.getAttribute('data-quitar'); st[k] = (k === 'cuotas' || k === 'foto') ? false : ''; visibles = PASO; pintar(); return; }
    if (e.target.closest('[data-limpiar]')) { st.sala = st.q = st.pago = st.precio = ''; st.cuotas = st.foto = false; visibles = PASO; pintar(); return; }
    if ((t = e.target.closest('[data-ficha]'))) { abrirFicha(t.getAttribute('data-ficha')); return; }
    if (e.target.closest('[data-ficha-close]')) { cerrarFicha(); return; }
    if ((t = e.target.closest('[data-fq]'))) { cantFicha = Math.max(1, Math.min(20, cantFicha + Number(t.getAttribute('data-fq')))); $('#fq').textContent = cantFicha; return; }
    if ((t = e.target.closest('[data-ficha-sumar]'))) {
      var p = M.buscar(t.getAttribute('data-ficha-sumar'));
      M.agregar(p.id, cantFicha); cerrarFicha(); M.toast('Sumaste ' + cantFicha + ' × ' + p.nombre.slice(0, 34)); return;
    }
    if (e.target.closest('[data-side-open]')) { lado(true); return; }
    if (e.target.closest('[data-side-close]')) { lado(false); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (ficha.classList.contains('open')) cerrarFicha();
    else if (side.classList.contains('open')) lado(false);
  });
  $('#verMas').addEventListener('click', function () { visibles += PASO; pintarGrid(); });
  $('#orden').addEventListener('change', function () { st.orden = this.value; pintar(); });
  $('#fCuotas').addEventListener('change', function () { st.cuotas = this.checked; visibles = PASO; pintar(); });
  $('#fFoto').addEventListener('change', function () { st.foto = this.checked; visibles = PASO; pintar(); });
  var deb;
  $('#q').addEventListener('input', function () {
    var v = this.value; clearTimeout(deb);
    deb = setTimeout(function () { st.q = v.trim(); visibles = PASO; pintar(); }, 220);
  });

  /* ── Arranque ──────────────────────────────────────────────── */
  function estado(fuente) {
    var txt = fuente === 'vivo' ? 'Precios en vivo desde el sistema de MyD HOGAR' : 'Precios del sistema de MyD HOGAR al ' + CFG.SNAPSHOT_FECHA;
    $('#catEstado').innerHTML = '<i class="dot ' + (fuente === 'vivo' ? 'vivo' : '') + '"></i>' + txt + ' · se confirman al comprar';
    $('#fuente').textContent = txt + '.';
  }
  estado('copia');
  pintar();
  if (st.p) abrirFicha(st.p);
  M.montarCarrito();
  M.sincronizar().then(function (r) { estado(r.fuente); if (r.fuente === 'vivo') pintar(); });
})();
