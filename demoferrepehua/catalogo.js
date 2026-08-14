/* ══════════════════════════════════════════════════════════
   FERREPEHUA — página de catálogo completo
   Filtros + orden + paginación + ficha de producto.
   Depende de store.js (window.FP).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FP = window.FP;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = FP.money;

  var POR_PAGINA = 12;

  var estado = { cat: 'all', marca: 'all', q: '', orden: 'rel', min: null, max: null, page: 1, vista: 'grid' };
  var limites = { min: 0, max: 0 };   // rango real de precios del catálogo

  var grid = $('#grid'), empty = $('#empty'), pager = $('#pager');

  /* ══ URL ↔ estado ════════════════════════════════════════
     Permite compartir un link ya filtrado (ej. /catalogo/?cat=electricas). */
  function leerURL() {
    var p = new URLSearchParams(location.search);
    estado.cat   = p.get('cat')   || 'all';
    estado.marca = p.get('marca') || 'all';
    estado.q     = p.get('q')     || '';
    estado.orden = p.get('orden') || 'rel';
    estado.page  = Math.max(1, parseInt(p.get('pag'), 10) || 1);
    var mn = parseInt(p.get('min'), 10), mx = parseInt(p.get('max'), 10);
    estado.min = isNaN(mn) ? null : mn;
    estado.max = isNaN(mx) ? null : mx;
  }
  function escribirURL(reemplazar) {
    var p = new URLSearchParams();
    if (estado.cat !== 'all')   p.set('cat', estado.cat);
    if (estado.marca !== 'all') p.set('marca', estado.marca);
    if (estado.q)               p.set('q', estado.q);
    if (estado.orden !== 'rel') p.set('orden', estado.orden);
    if (estado.min != null)     p.set('min', estado.min);
    if (estado.max != null)     p.set('max', estado.max);
    if (estado.page > 1)        p.set('pag', estado.page);
    var url = location.pathname + (p.toString() ? '?' + p : '');
    history[reemplazar ? 'replaceState' : 'pushState']({}, '', url);
  }

  /* ══ Filtrado ════════════════════════════════════════════ */
  // Los filtros de rubro/marca se cuentan sobre el resto de los filtros
  // activos, para que los contadores del panel reflejen lo que va a pasar
  // si tocás esa opción (y no el catálogo entero).
  function pasa(p, omitir) {
    if (omitir !== 'cat' && estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (omitir !== 'marca' && estado.marca !== 'all' && p.marca !== estado.marca) return false;
    if (estado.min != null && p.precio < estado.min) return false;
    if (estado.max != null && p.precio > estado.max) return false;
    var q = estado.q.trim().toLowerCase();
    if (q) {
      var heno = (p.nombre + ' ' + (p.cod || '') + ' ' + p.marca + ' ' + p.catNom + ' ' +
                  (p.specs || []).join(' ')).toLowerCase();
      // Todas las palabras tienen que aparecer: "taladro 20v" filtra de verdad.
      if (!q.split(/\s+/).every(function (t) { return heno.indexOf(t) > -1; })) return false;
    }
    return true;
  }

  function filtrados() {
    var lista = FP.productos().filter(function (p) { return pasa(p); });
    if (estado.orden === 'precio-asc')  lista.sort(function (a, b) { return a.precio - b.precio; });
    if (estado.orden === 'precio-desc') lista.sort(function (a, b) { return b.precio - a.precio; });
    if (estado.orden === 'nombre')      lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    if (estado.orden === 'rel')         lista.sort(function (a, b) { return (b.dest ? 1 : 0) - (a.dest ? 1 : 0); });
    return lista;
  }

  /* ══ Panel de filtros ════════════════════════════════════ */
  function pintarFiltros() {
    var prods = FP.productos();

    // Rubros presentes en el catálogo real (no una lista fija inventada).
    var cats = {};
    prods.forEach(function (p) {
      if (!pasa(p, 'cat')) return;
      cats[p.cat] = cats[p.cat] || { n: 0, nom: p.catNom };
      cats[p.cat].n++;
    });
    var totalCat = Object.keys(cats).reduce(function (a, k) { return a + cats[k].n; }, 0);
    var filasCat = ['<li><button data-cat="all" class="' + (estado.cat === 'all' ? 'is-on' : '') +
      '"><span>Todos los rubros</span><b>' + totalCat + '</b></button></li>'];
    Object.keys(cats).sort(function (a, b) {
      return cats[b].n - cats[a].n || cats[a].nom.localeCompare(cats[b].nom, 'es');
    }).forEach(function (k) {
      filasCat.push('<li><button data-cat="' + k + '" class="' + (estado.cat === k ? 'is-on' : '') +
        '"><span>' + cats[k].nom + '</span><b>' + cats[k].n + '</b></button></li>');
    });
    $('#fCats').innerHTML = filasCat.join('');

    var marcas = {};
    prods.forEach(function (p) {
      if (!p.marca || !pasa(p, 'marca')) return;
      marcas[p.marca] = (marcas[p.marca] || 0) + 1;
    });
    var totalMarca = Object.keys(marcas).reduce(function (a, k) { return a + marcas[k]; }, 0);
    var filasMarca = ['<li><button data-brand="all" class="' + (estado.marca === 'all' ? 'is-on' : '') +
      '"><span>Todas</span><b>' + totalMarca + '</b></button></li>'];
    Object.keys(marcas).sort().forEach(function (k) {
      filasMarca.push('<li><button data-brand="' + k + '" class="' + (estado.marca === k ? 'is-on' : '') +
        '"><span>' + k + '</span><b>' + marcas[k] + '</b></button></li>');
    });
    $('#fBrands').innerHTML = filasMarca.join('');

    $('#factTotal').textContent = prods.length;
    $('#factRubros').textContent = Object.keys(cats).length;
  }

  function pintarRango() {
    var pMin = $('#pMin'), pMax = $('#pMax'), slider = $('#pSlider');
    pMin.placeholder = money(limites.min).replace('$', '');
    pMax.placeholder = money(limites.max).replace('$', '');
    pMin.value = estado.min != null ? estado.min : '';
    pMax.value = estado.max != null ? estado.max : '';
    slider.min = limites.min;
    slider.max = limites.max;
    slider.value = estado.max != null ? estado.max : limites.max;
    $('#pHint').textContent = 'Desde ' + money(limites.min) + ' hasta ' + money(limites.max);
  }

  /* ══ Chips de filtros activos ════════════════════════════ */
  function pintarActivos() {
    var chips = [];
    if (estado.cat !== 'all') {
      var nom = (FP.productos().filter(function (p) { return p.cat === estado.cat; })[0] || {}).catNom
                || FP.CAT_NOMBRES[estado.cat] || estado.cat;
      chips.push({ k: 'cat', txt: nom });
    }
    if (estado.marca !== 'all') chips.push({ k: 'marca', txt: estado.marca });
    if (estado.q)               chips.push({ k: 'q', txt: '“' + estado.q + '”' });
    if (estado.min != null)     chips.push({ k: 'min', txt: 'desde ' + money(estado.min) });
    if (estado.max != null)     chips.push({ k: 'max', txt: 'hasta ' + money(estado.max) });

    var badge = $('#fCountBadge');
    badge.textContent = chips.length;
    badge.hidden = !chips.length;

    if (!chips.length) { $('#activeFilters').hidden = true; return; }
    $('#activeFilters').hidden = false;
    $('#activeFilters').innerHTML =
      chips.map(function (c) {
        return '<button class="afchip" data-clear="' + c.k + '">' + c.txt +
               '<i aria-hidden="true">✕</i><span class="sr">Quitar filtro</span></button>';
      }).join('') +
      '<button class="afclear" data-clear="all">Limpiar todo</button>';
  }

  /* ══ Tarjetas ════════════════════════════════════════════ */
  function tarjeta(p) {
    var n = FP.cant(p.id);
    return '' +
      '<article class="card' + (p.dest ? ' is-dest' : '') + '" data-id="' + p.id + '">' +
        '<button class="card-img" data-ficha="' + p.id + '" aria-label="Ver ' + p.nombre + '">' +
          '<img src="' + p.img + '" alt="' + p.nombre + '" loading="lazy" width="760" height="570">' +
          (p.dest ? '<span class="card-flag">Más vendido</span>' : '') +
          (p.marca ? '<span class="card-brand">' + p.marca + '</span>' : '') +
        '</button>' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            (p.cod ? '<code class="card-sku">' + p.cod + '</code>' : '') +
            '<span class="card-cat">' + p.catNom + '</span>' +
          '</div>' +
          '<h3><button data-ficha="' + p.id + '">' + p.nombre + '</button></h3>' +
          '<div class="card-specs">' + (p.specs || []).slice(0, 3).map(function (s) {
            return '<span>' + s + '</span>';
          }).join('') + '</div>' +
          '<div class="card-foot">' +
            '<div class="card-price"><b>' + money(p.precio) + '</b><small>Precio final en ARS</small></div>' +
            '<span class="card-stock"><i></i>Disponible</span>' +
          '</div>' +
          (n
            ? '<div class="card-stepper"><button data-minus="' + p.id + '" aria-label="Quitar uno">−</button>' +
              '<span>' + n + ' en el pedido</span>' +
              '<button data-plus="' + p.id + '" aria-label="Agregar uno">+</button></div>'
            : '<button class="card-add" data-add="' + p.id + '">Agregar al pedido</button>') +
        '</div>' +
      '</article>';
  }

  /* ══ Render ══════════════════════════════════════════════ */
  function render() {
    var lista = filtrados();
    var paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    if (estado.page > paginas) estado.page = paginas;
    var desde = (estado.page - 1) * POR_PAGINA;
    var pagina = lista.slice(desde, desde + POR_PAGINA);

    grid.className = 'grid store-grid' + (estado.vista === 'list' ? ' is-list' : '');
    grid.innerHTML = pagina.map(tarjeta).join('');
    $$('.card', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 40 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    $('#resCount').innerHTML = lista.length
      ? '<b>' + lista.length + '</b> producto' + (lista.length === 1 ? '' : 's') +
        (lista.length > POR_PAGINA
          ? ' · mostrando ' + (desde + 1) + '–' + (desde + pagina.length)
          : '')
      : '';

    if (!lista.length) {
      empty.hidden = false;
      empty.innerHTML =
        '<h3>No encontramos nada con esos filtros.</h3>' +
        '<p>Probá quitando alguno, o consultanos: en el depósito tenemos mucho más de lo que está publicado.</p>' +
        '<div class="store-empty-cta">' +
          '<button class="btn btn-dark" data-clear="all">Limpiar filtros</button>' +
          '<a class="btn btn-amber" target="_blank" rel="noopener" href="' +
            FP.linkWA('Hola Ferrepehua, busco: ' + (estado.q || 'un producto que no está en la web')) +
          '">Consultar por WhatsApp</a>' +
        '</div>';
    } else {
      empty.hidden = true;
    }

    pintarPager(paginas);
    pintarActivos();
    pintarFiltros();
  }

  function pintarPager(paginas) {
    if (paginas <= 1) { pager.hidden = true; return; }
    pager.hidden = false;
    var b = ['<button class="pg pg-nav" data-page="' + (estado.page - 1) + '"' +
             (estado.page === 1 ? ' disabled' : '') + ' aria-label="Anterior">←</button>'];
    for (var i = 1; i <= paginas; i++) {
      b.push('<button class="pg' + (i === estado.page ? ' is-on' : '') + '" data-page="' + i + '"' +
             (i === estado.page ? ' aria-current="page"' : '') + '>' + i + '</button>');
    }
    b.push('<button class="pg pg-nav" data-page="' + (estado.page + 1) + '"' +
           (estado.page === paginas ? ' disabled' : '') + ' aria-label="Siguiente">→</button>');
    pager.innerHTML = b.join('');
  }

  /* ══ Ficha de producto ═══════════════════════════════════ */
  var sheet = $('#sheet'), sheetBackdrop = $('#sheetBackdrop'), sheetBody = $('#sheetBody');
  var fichaActual = null;

  function abrirFicha(id) {
    var p = FP.buscar(id);
    if (!p) return;
    fichaActual = id;
    pintarFicha();
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    sheetBackdrop.hidden = false;
    document.body.classList.add('no-scroll');
    $('#sheetClose').focus();
  }
  function cerrarFicha() {
    fichaActual = null;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    sheetBackdrop.hidden = true;
    document.body.classList.remove('no-scroll');
  }
  function pintarFicha() {
    if (!fichaActual) return;
    var p = FP.buscar(fichaActual);
    if (!p) { cerrarFicha(); return; }
    var n = FP.cant(p.id);
    sheetBody.innerHTML =
      '<div class="sheet-img"><img src="' + p.img + '" alt="' + p.nombre + '" width="900" height="675"></div>' +
      '<div class="sheet-info">' +
        '<div class="sheet-meta">' +
          (p.marca ? '<span class="sheet-brand">' + p.marca + '</span>' : '') +
          '<span class="sheet-cat">' + p.catNom + '</span>' +
        '</div>' +
        '<h2>' + p.nombre + '</h2>' +
        (p.cod ? '<code class="sheet-sku">Código ' + p.cod + '</code>' : '') +
        ((p.specs || []).length
          ? '<ul class="sheet-specs">' + p.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'
          : '') +
        '<div class="sheet-price"><b>' + money(p.precio) + '</b><small>Precio final en ARS' +
          (p.unidad ? ' · por ' + p.unidad : '') + '</small></div>' +
        '<p class="sheet-stock"><i></i>Disponible · garantía oficial de fábrica</p>' +
        (n
          ? '<div class="sheet-stepper"><button data-minus="' + p.id + '" aria-label="Quitar uno">−</button>' +
            '<span>' + n + ' en el pedido</span>' +
            '<button data-plus="' + p.id + '" aria-label="Agregar uno">+</button></div>'
          : '<button class="btn btn-amber btn-block" data-add="' + p.id + '">Agregar al pedido</button>') +
        '<a class="btn btn-dark btn-block" target="_blank" rel="noopener" href="' +
          FP.linkWA('Hola Ferrepehua, quiero consultar por: ' + p.nombre + (p.cod ? ' (' + p.cod + ')' : '')) +
        '">Consultar este producto</a>' +
        '<p class="sheet-note">Precio final en pesos. El envío se cotiza aparte según destino.</p>' +
      '</div>';
  }

  /* ══ Eventos ═════════════════════════════════════════════ */
  function aplicar(reset) {
    if (reset !== false) estado.page = 1;
    escribirURL();
    render();
  }

  document.addEventListener('click', function (e) {
    var ficha = e.target.closest('[data-ficha]');
    if (ficha) { abrirFicha(ficha.dataset.ficha); return; }

    var add = e.target.closest('[data-add]');
    if (add) {
      FP.agregar(add.dataset.add, 1);
      var nav = $('#navCart');
      if (nav) { nav.classList.add('bump'); setTimeout(function () { nav.classList.remove('bump'); }, 400); }
      return;
    }

    var cat = e.target.closest('[data-cat]');
    if (cat) { estado.cat = cat.dataset.cat; aplicar(); cerrarFiltros(); return; }

    var brand = e.target.closest('[data-brand]');
    if (brand) { estado.marca = brand.dataset.brand; aplicar(); cerrarFiltros(); return; }

    var pg = e.target.closest('[data-page]');
    if (pg && !pg.disabled) {
      estado.page = parseInt(pg.dataset.page, 10);
      escribirURL();
      render();
      $('.store-head').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    var clear = e.target.closest('[data-clear]');
    if (clear) {
      var k = clear.dataset.clear;
      if (k === 'all') {
        estado.cat = 'all'; estado.marca = 'all'; estado.q = '';
        estado.min = null; estado.max = null;
        $('#q').value = ''; $('#qClear').hidden = true;
      }
      if (k === 'cat')   estado.cat = 'all';
      if (k === 'marca') estado.marca = 'all';
      if (k === 'q')     { estado.q = ''; $('#q').value = ''; $('#qClear').hidden = true; }
      if (k === 'min')   estado.min = null;
      if (k === 'max')   estado.max = null;
      pintarRango();
      aplicar();
      return;
    }
  });

  // Buscador con debounce: no re-renderiza en cada tecla.
  var tq = null;
  $('#q').addEventListener('input', function () {
    var v = this.value;
    $('#qClear').hidden = !v;
    clearTimeout(tq);
    tq = setTimeout(function () { estado.q = v; aplicar(); }, 180);
  });
  $('#qClear').addEventListener('click', function () {
    $('#q').value = ''; estado.q = ''; this.hidden = true; aplicar(); $('#q').focus();
  });

  $('#orden').addEventListener('change', function () { estado.orden = this.value; aplicar(); });

  function leerRango() {
    var mn = parseInt($('#pMin').value, 10);
    var mx = parseInt($('#pMax').value, 10);
    estado.min = isNaN(mn) ? null : mn;
    estado.max = isNaN(mx) ? null : mx;
    // Si quedaron cruzados, los ordenamos en vez de devolver 0 resultados.
    if (estado.min != null && estado.max != null && estado.min > estado.max) {
      var t = estado.min; estado.min = estado.max; estado.max = t;
      $('#pMin').value = estado.min; $('#pMax').value = estado.max;
    }
    $('#pSlider').value = estado.max != null ? estado.max : limites.max;
    aplicar();
  }
  var tr = null;
  ['#pMin', '#pMax'].forEach(function (sel) {
    $(sel).addEventListener('input', function () {
      clearTimeout(tr); tr = setTimeout(leerRango, 300);
    });
  });
  $('#pSlider').addEventListener('input', function () {
    $('#pMax').value = this.value;
    clearTimeout(tr); tr = setTimeout(leerRango, 120);
  });

  $('#fReset').addEventListener('click', function () {
    estado.cat = 'all'; estado.marca = 'all'; estado.q = '';
    estado.min = null; estado.max = null;
    $('#q').value = ''; $('#qClear').hidden = true;
    pintarRango(); aplicar(); cerrarFiltros();
  });

  // Vista grilla / lista
  $('#viewGrid').addEventListener('click', function () {
    estado.vista = 'grid'; this.classList.add('is-on'); $('#viewList').classList.remove('is-on');
    try { localStorage.setItem('fp_vista', 'grid'); } catch (e) {}
    render();
  });
  $('#viewList').addEventListener('click', function () {
    estado.vista = 'list'; this.classList.add('is-on'); $('#viewGrid').classList.remove('is-on');
    try { localStorage.setItem('fp_vista', 'list'); } catch (e) {}
    render();
  });

  // Panel de filtros en mobile
  function abrirFiltros() { $('#filters').classList.add('open'); document.body.classList.add('no-scroll'); }
  function cerrarFiltros() { $('#filters').classList.remove('open'); document.body.classList.remove('no-scroll'); }
  $('#filtersOpen').addEventListener('click', abrirFiltros);
  $('#filtersClose').addEventListener('click', cerrarFiltros);

  $('#sheetClose').addEventListener('click', cerrarFicha);
  sheetBackdrop.addEventListener('click', cerrarFicha);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { cerrarFicha(); cerrarFiltros(); }
  });

  $('#burger').addEventListener('click', function () { $('#nav').classList.toggle('open'); });

  window.addEventListener('popstate', function () {
    leerURL();
    $('#q').value = estado.q;
    $('#qClear').hidden = !estado.q;
    $('#orden').value = estado.orden;
    pintarRango();
    render();
  });

  /* ══ Init ════════════════════════════════════════════════ */
  function calcularLimites() {
    var precios = FP.productos().map(function (p) { return p.precio; });
    limites.min = Math.floor(Math.min.apply(null, precios) / 100) * 100;
    limites.max = Math.ceil(Math.max.apply(null, precios) / 100) * 100;
  }

  $('#year').textContent = new Date().getFullYear();
  try {
    var v = localStorage.getItem('fp_vista');
    if (v === 'list') { estado.vista = 'list'; $('#viewList').classList.add('is-on'); $('#viewGrid').classList.remove('is-on'); }
  } catch (e) {}

  leerURL();
  $('#q').value = estado.q;
  $('#qClear').hidden = !estado.q;
  $('#orden').value = estado.orden;

  FP.montarCarrito();
  FP.alCambiar(function () { render(); pintarFicha(); });

  calcularLimites();
  pintarRango();
  render();

  FP.iniciar().then(function () {
    calcularLimites();
    pintarRango();
    render();
  });
})();
