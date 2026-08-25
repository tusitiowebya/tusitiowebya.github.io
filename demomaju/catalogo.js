/* ══════════════════════════════════════════════════════════
   MAju — catálogo completo
   Filtros por ocasión, rubro y talle + buscador + orden + ficha
   lateral. Comparte carrito y productos con el home vía store.js.
   Los filtros viajan en la URL (?cat= ?plan= ?talle= ?q= ?p=).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MJ = window.MJ;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = MJ.money, esc = MJ.esc;

  var params = new URLSearchParams(location.search);
  var filtro = {
    cat:   params.get('cat')   || '',
    plan:  params.get('plan')  || '',
    talle: params.get('talle') || '',
    q:     params.get('q')     || '',
    orden: 'dest'
  };
  var abrirFicha = params.get('p') || '';
  var talleElegido = {};

  /* ══ Filtrado ════════════════════════════════════════════ */
  function visibles() {
    var q = MJ.sinAcentos(filtro.q.trim());
    return MJ.productos().filter(function (p) {
      if (filtro.cat && p.cat !== filtro.cat) return false;
      if (filtro.plan && (p.planes || []).indexOf(filtro.plan) < 0) return false;
      if (filtro.talle && (p.talles || []).indexOf(filtro.talle) < 0) return false;
      if (q) {
        var texto = MJ.sinAcentos([p.nombre, p.catNom, p.tela, (p.specs || []).join(' ')].join(' '));
        if (texto.indexOf(q) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      if (filtro.orden === 'precio-asc')  return a.precio - b.precio;
      if (filtro.orden === 'precio-desc') return b.precio - a.precio;
      if (filtro.orden === 'nombre')      return a.nombre.localeCompare(b.nombre, 'es');
      return (b.dest ? 1 : 0) - (a.dest ? 1 : 0) || a.nombre.localeCompare(b.nombre, 'es');
    });
  }

  function urlFiltros() {
    var u = new URLSearchParams();
    if (filtro.cat) u.set('cat', filtro.cat);
    if (filtro.plan) u.set('plan', filtro.plan);
    if (filtro.talle) u.set('talle', filtro.talle);
    if (filtro.q) u.set('q', filtro.q);
    var s = u.toString();
    history.replaceState(null, '', s ? '?' + s : location.pathname);
  }

  /* ══ Barra lateral ═══════════════════════════════════════ */
  function pintarFiltros() {
    var prods = MJ.productos();

    // Rubros con contadores reales.
    var cats = {}, orden = [];
    prods.forEach(function (p) {
      if (!cats[p.cat]) { cats[p.cat] = { n: 0, nombre: p.catNom || p.cat }; orden.push(p.cat); }
      cats[p.cat].n++;
    });
    orden.sort(function (a, b) { return cats[a].nombre.localeCompare(cats[b].nombre, 'es'); });

    $('#fCats').innerHTML =
      '<li data-cat=""' + (filtro.cat ? '' : ' class="on"') + '><span class="n">Todas</span>' +
        '<span>' + prods.length + '</span></li>' +
      orden.map(function (c) {
        return '<li data-cat="' + esc(c) + '"' + (filtro.cat === c ? ' class="on"' : '') + '>' +
          '<span class="n">' + esc(cats[c].nombre) + '</span><span>' + cats[c].n + '</span></li>';
      }).join('');

    // Ocasiones: solo las que tienen prendas.
    var planes = (MJ.PLANES || []).filter(function (pl) { return MJ.porPlan(pl.id).length; });
    $('#fPlanes').innerHTML = planes.map(function (pl) {
      return '<button type="button" data-plan="' + esc(pl.id) + '"' +
             (filtro.plan === pl.id ? ' class="on"' : '') + ' aria-pressed="' + (filtro.plan === pl.id) + '">' +
             esc(pl.nombre) + '</button>';
    }).join('') || '<p class="cat-count">Sin ocasiones cargadas</p>';

    // Talles existentes en el catálogo.
    var talles = [];
    prods.forEach(function (p) {
      (p.talles || []).forEach(function (t) { if (talles.indexOf(t) < 0) talles.push(t); });
    });
    talles.sort(function (a, b) {
      var na = parseInt(a, 10), nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a).localeCompare(String(b), 'es');
    });
    $('#fTalles').innerHTML = talles.map(function (t) {
      return '<button type="button" data-talle="' + esc(t) + '"' +
             (filtro.talle === t ? ' class="on"' : '') + ' aria-pressed="' + (filtro.talle === t) + '">' +
             esc(t) + '</button>';
    }).join('') || '<p class="cat-count">Talle único</p>';
  }

  /* ══ Grilla ══════════════════════════════════════════════ */
  function talleDefault(p) {
    if (!p.talles || !p.talles.length) return '';
    if (filtro.talle && p.talles.indexOf(filtro.talle) >= 0) return filtro.talle;
    if (talleElegido[p.id] && p.talles.indexOf(talleElegido[p.id]) >= 0) return talleElegido[p.id];
    return p.talles[Math.floor((p.talles.length - 1) / 2)];
  }

  function tarjeta(p) {
    var n = MJ.cantProducto(p.id);
    var mejor = MJ.mejorMedio(p);
    return '' +
      '<article class="card" data-id="' + esc(p.id) + '">' +
        '<button class="card-img" data-ficha="' + esc(p.id) + '" aria-label="Ver detalle de ' + esc(p.nombre) + '">' +
          '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="800" height="1066">' +
          (p.dest ? '<span class="card-flag">Más pedido</span>' : '') +
        '</button>' +
        '<div class="card-body">' +
          '<span class="card-cat">' + esc(p.catNom || '') + '</span>' +
          '<h3>' + esc(p.nombre) + '</h3>' +
          (p.tela ? '<p class="card-tela">' + esc(p.tela) + '</p>' : '') +
          '<div class="card-price"><b>' + money(p.precio) + '</b><small>precio final</small></div>' +
          (mejor ? '<p class="card-pay">' + money(mejor.precioFinal) + ' con ' + esc(mejor.medio) + '</p>' : '') +
          (p.cuotas > 1 ? '<p class="card-cuotas">' + p.cuotas + 'x ' + money(p.precio / p.cuotas) + ' sin interés</p>' : '') +
          tallesHTML(p) +
          '<button class="card-add' + (n ? ' is-ok' : '') + '" data-add="' + esc(p.id) + '">' +
            (n ? n + ' en el pedido' : 'Sumar al pedido') + '</button>' +
        '</div>' +
      '</article>';
  }

  function tallesHTML(p) {
    if (!p.talles || !p.talles.length) return '<p class="card-tela">Talle único</p>';
    var sel = talleDefault(p);
    return '<div class="card-talles" role="group" aria-label="Talles disponibles">' +
      p.talles.map(function (t) {
        return '<button type="button" data-talle-card="' + esc(p.id) + '|' + esc(t) + '"' +
               (t === sel ? ' class="on"' : '') + ' aria-pressed="' + (t === sel) + '">' + esc(t) + '</button>';
      }).join('') + '</div>';
  }

  function render() {
    var lista = visibles();
    var grid = $('#catGrid'), vacio = $('#vacio');

    grid.innerHTML = lista.map(tarjeta).join('');
    $$('.card', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 10) * 32 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    vacio.hidden = lista.length > 0;
    grid.hidden = lista.length === 0;

    var total = MJ.productos().length;
    $('#conteo').textContent = lista.length === total
      ? total + ' prendas en el catálogo'
      : lista.length + ' de ' + total + ' prendas';

    pintarFiltros();
  }

  /* ══ Ficha lateral ═══════════════════════════════════════ */
  var ficha = $('#ficha'), fichaBd = $('#fichaBackdrop'), fichaBody = $('#fichaBody');
  var fichaId = '';

  function verFicha(id) {
    var p = MJ.buscar(id);
    if (!p) return;
    fichaId = id;
    var mejor = MJ.mejorMedio(p);
    var sel = talleDefault(p);

    fichaBody.innerHTML = '' +
      '<img class="fi-img" src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" width="800" height="1066">' +
      '<div class="fi-body">' +
        '<span class="fi-cat">' + esc(p.catNom || '') + '</span>' +
        '<h3>' + esc(p.nombre) + '</h3>' +
        '<div class="fi-price"><b>' + money(p.precio) + '</b><small>precio final en pesos</small></div>' +
        (mejor ? '<p class="fi-pay">' + money(mejor.precioFinal) + ' pagando con ' + esc(mejor.medio) + '</p>' : '') +
        (p.cuotas > 1 ? '<p class="fi-cuotas">' + p.cuotas + ' cuotas sin interés de ' + money(p.precio / p.cuotas) + '</p>' : '') +
        '<div class="fi-sep" aria-hidden="true"></div>' +
        '<dl class="fi-dl">' +
          (p.tela ? '<dt>Tela</dt><dd>' + esc(p.tela) + '</dd>' : '') +
          ((p.specs || []).length > 1 ? '<dt>Detalle</dt><dd>' + esc(p.specs.slice(1).join(' · ')) + '</dd>' : '') +
          ((p.planes || []).length
            ? '<dt>Ideal para</dt><dd><div class="fi-planes">' + p.planes.map(function (id) {
                return '<span>' + esc(MJ.nombrePlan(id)) + '</span>';
              }).join('') + '</div></dd>'
            : '') +
          (p.cod ? '<dt>Código</dt><dd>' + esc(p.cod) + '</dd>' : '') +
        '</dl>' +
        (p.talles && p.talles.length
          ? '<p class="fi-cat" style="margin-bottom:9px">Elegí tu talle</p>' +
            '<div class="fi-talles">' + p.talles.map(function (t) {
              return '<button type="button" data-talle-ficha="' + esc(t) + '"' +
                     (t === sel ? ' class="on"' : '') + ' aria-pressed="' + (t === sel) + '">' + esc(t) + '</button>';
            }).join('') + '</div>'
          : '') +
        '<div class="fi-actions">' +
          '<button class="btn btn-ink btn-block" data-add="' + esc(p.id) + '">Sumar al pedido</button>' +
          '<a class="btn btn-line btn-block" href="' + MJ.linkWA(
              'Hola MAju! Me interesa ' + p.nombre + (sel ? ' (talle ' + sel + ')' : '') +
              ' — ' + money(p.precio) + '. ¿Tienen stock?') +
            '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        '</div>' +
        '<p class="fi-nota">Si dudás entre dos talles, escribinos con tus medidas: te decimos cuál pedir para esta prenda.</p>' +
      '</div>';

    ficha.classList.add('open');
    ficha.setAttribute('aria-hidden', 'false');
    fichaBd.hidden = false;
    document.body.classList.add('no-scroll');
  }

  function cerrarFicha() {
    fichaId = '';
    ficha.classList.remove('open');
    ficha.setAttribute('aria-hidden', 'true');
    fichaBd.hidden = true;
    if (!$('#cart').classList.contains('open')) document.body.classList.remove('no-scroll');
  }

  $('#fichaClose').addEventListener('click', cerrarFicha);
  fichaBd.addEventListener('click', cerrarFicha);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarFicha(); });

  /* ══ Eventos ═════════════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-ficha]');
    if (f) { verFicha(f.dataset.ficha); return; }

    var tc = e.target.closest('[data-talle-card]');
    if (tc) {
      var partes = tc.dataset.talleCard.split('|');
      talleElegido[partes[0]] = partes[1];
      $$('button', tc.parentNode).forEach(function (b) {
        var on = b === tc;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      return;
    }

    var tf = e.target.closest('[data-talle-ficha]');
    if (tf) {
      talleElegido[fichaId] = tf.dataset.talleFicha;
      $$('button', tf.parentNode).forEach(function (b) {
        var on = b === tf;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      return;
    }

    var add = e.target.closest('[data-add]');
    if (add) {
      var p = MJ.buscar(add.dataset.add);
      if (!p) return;
      MJ.agregar(p.id, talleDefault(p), 1);
      var nav = $('#navCart');
      if (nav) { nav.classList.add('bump'); setTimeout(function () { nav.classList.remove('bump'); }, 420); }
      if (add.closest('.fi-actions')) { add.textContent = 'Listo, está en tu pedido'; }
      return;
    }

    var li = e.target.closest('#fCats li');
    if (li) { filtro.cat = li.dataset.cat || ''; urlFiltros(); render(); cerrarPanel(); return; }

    var bp = e.target.closest('[data-plan]');
    if (bp) { filtro.plan = filtro.plan === bp.dataset.plan ? '' : bp.dataset.plan; urlFiltros(); render(); return; }

    var bt = e.target.closest('#fTalles [data-talle]');
    if (bt) { filtro.talle = filtro.talle === bt.dataset.talle ? '' : bt.dataset.talle; urlFiltros(); render(); return; }
  });

  var buscador = $('#q');
  buscador.value = filtro.q;
  var tBusq;
  buscador.addEventListener('input', function () {
    clearTimeout(tBusq);
    tBusq = setTimeout(function () { filtro.q = buscador.value; urlFiltros(); render(); }, 180);
  });

  $('#orden').addEventListener('change', function () { filtro.orden = this.value; render(); });

  $('#limpiar').addEventListener('click', function () {
    filtro.cat = ''; filtro.plan = ''; filtro.talle = ''; filtro.q = '';
    buscador.value = '';
    urlFiltros(); render(); cerrarPanel();
  });

  // Panel de filtros en mobile
  var side = $('#catSide');
  function cerrarPanel() { if (window.innerWidth <= 900) side.classList.remove('open'); }
  $('#filtrosBtn').addEventListener('click', function () { side.classList.toggle('open'); });

  /* ══ Nav ═════════════════════════════════════════════════ */
  var nav = $('#nav');
  $('#burger').addEventListener('click', function () { nav.classList.toggle('open'); });
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  var waVacio = $('#waVacio');
  if (waVacio) waVacio.href = MJ.linkWA('Hola MAju! Estaba mirando el catálogo y no encontré lo que buscaba. ¿Me ayudan?');

  /* ══ Init ════════════════════════════════════════════════ */
  $('#year').textContent = new Date().getFullYear();

  MJ.montarCarrito();
  MJ.alCambiar(render);

  render();
  MJ.iniciar().then(function () {
    render();
    if (abrirFicha) { verFicha(abrirFicha); abrirFicha = ''; }
  });
  if (abrirFicha && MJ.buscar(abrirFicha)) { verFicha(abrirFicha); abrirFicha = ''; }
})();
