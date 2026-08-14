/* ══════════════════════════════════════════════════════════
   FERREPEHUA — página de catálogo completo
   Marcas + rubros + orden + paginación + ficha de producto.
   Depende de store.js (window.FP).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FP = window.FP;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = FP.money;

  var POR_PAGINA = 12;

  // Color de las marcas que trabaja la ferretería; cualquier otra que se cargue
  // en el panel recibe uno propio.
  var COLOR_MARCA = { INGCO:'#F0A400', TOTAL:'#00A19A', EMTOP:'#E11B22', WADFOW:'#0F4C9B' };
  var PALETA = ['#0F4C9B', '#B0431E', '#00726B', '#6B3FA0', '#A3121B', '#1F6F3F'];

  // Color estable para una marca nueva: mismo nombre → siempre el mismo color.
  function colorMarca(m) {
    if (COLOR_MARCA[m]) return COLOR_MARCA[m];
    var h = 0;
    for (var i = 0; i < m.length; i++) h = (h * 31 + m.charCodeAt(i)) % 9973;
    return PALETA[h % PALETA.length];
  }

  var ICONO = {
    electricas:   '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
    inalambricas: '<rect x="9" y="2" width="6" height="4" rx="1"/><path d="M7 6h10v14H7z"/><path d="M11 10h2"/>',
    manuales:     '<path d="M14.5 3.5a4.5 4.5 0 0 0-6 5.9L3 15v5h5l5.6-5.5a4.5 4.5 0 0 0 5.9-6l-3 3-2.9-2.9z"/>',
    accesorios:   '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    construccion: '<path d="M3 21h18M6 21V9l6-4 6 4v12"/><path d="M10 21v-6h4v6"/>',
    medicion:     '<path d="M2 8h20v8H2z"/><path d="M6 8v4M10 8v3M14 8v4M18 8v3"/>',
    jardineria:   '<path d="M12 21c0-6 3-9 8-9-1 5-4 8-8 9z"/><path d="M12 21c0-6-3-9-8-9 1 5 4 8 8 9z"/><path d="M12 21v-6"/>',
    iluminacion:  '<path d="M9 18h6M10 22h4"/><path d="M12 2a6 6 0 0 0-3.5 10.9V15h7v-2.1A6 6 0 0 0 12 2z"/>',
    seguridad:    '<path d="M12 3l7 3v5.5c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6z"/>',
    organizacion: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M10 7.5h4M10 16.5h4"/>'
  };
  var ICONO_DEFAULT = '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>';

  var estado = { cat: 'all', marca: 'all', medio: 'all', q: '', orden: 'rel', page: 1, vista: 'grid' };

  var favoritos = {};
  try { favoritos = JSON.parse(localStorage.getItem('fp_fav') || '{}'); } catch (e) { favoritos = {}; }

  var grid = $('#grid'), empty = $('#empty'), pager = $('#pager');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ══ URL ↔ estado ════════════════════════════════════════
     Permite compartir un link ya filtrado (ej. /catalogo/?cat=electricas). */
  function leerURL() {
    var p = new URLSearchParams(location.search);
    estado.cat   = p.get('cat')   || 'all';
    estado.marca = p.get('marca') || 'all';
    estado.medio = p.get('pago')  || 'all';
    estado.q     = p.get('q')     || '';
    estado.orden = p.get('orden') || 'rel';
    estado.page  = Math.max(1, parseInt(p.get('pag'), 10) || 1);
  }
  function escribirURL(reemplazar) {
    var p = new URLSearchParams();
    if (estado.cat !== 'all')   p.set('cat', estado.cat);
    if (estado.marca !== 'all') p.set('marca', estado.marca);
    if (estado.medio !== 'all') p.set('pago', estado.medio);
    if (estado.q)               p.set('q', estado.q);
    if (estado.orden !== 'rel') p.set('orden', estado.orden);
    if (estado.page > 1)        p.set('pag', estado.page);
    var url = location.pathname + (p.toString() ? '?' + p : '');
    history[reemplazar ? 'replaceState' : 'pushState']({}, '', url);
  }

  /* ══ Filtrado ════════════════════════════════════════════ */
  // Los contadores de rubro se calculan omitiendo el filtro de rubro, para
  // que reflejen lo que va a pasar si tocás esa opción.
  function pasa(p, omitir) {
    if (omitir !== 'cat' && estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (omitir !== 'marca' && estado.marca !== 'all' && p.marca !== estado.marca) return false;
    if (omitir !== 'medio' && estado.medio !== 'all' &&
        !(p.medios || []).some(function (m) { return m.medio === estado.medio; })) return false;
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

  /* ══ Solapas de marca ════════════════════════════════════
     Las marcas salen de los productos cargados en el panel: si una marca no
     tiene productos no se muestra, y una marca nueva aparece sola. */
  function pintarMarcas() {
    var marcas = [];
    FP.productos().forEach(function (p) {
      if (p.marca && marcas.indexOf(p.marca) < 0) marcas.push(p.marca);
    });
    marcas.sort(function (a, b) { return a.localeCompare(b, 'es'); });

    // Sin marcas cargadas no hay nada que filtrar: la barra queda solo con el
    // botón de categorías en vez de mostrar solapas vacías.
    if (!marcas.length) {
      $$('[data-brands]').forEach(function (n) { n.innerHTML = ''; });
      $('#sideMark').textContent = 'Catálogo';
      $('#sideMark').style.color = '';
      return;
    }

    var html = ['<button class="brandtab brandtab-all' + (estado.marca === 'all' ? ' is-on' : '') +
                '" data-brand="all">Todas las marcas</button>'];
    marcas.forEach(function (m) {
        html.push('<button class="brandtab' + (estado.marca === m ? ' is-on' : '') +
          '" data-brand="' + esc(m) + '" style="color:' + colorMarca(m) + '">' +
          esc(m) + '</button>');
      });
    $$('[data-brands]').forEach(function (n) { n.innerHTML = html.join(''); });

    var mark = $('#sideMark');
    mark.textContent = estado.marca === 'all' ? 'Catálogo' : estado.marca;
    mark.style.color = estado.marca === 'all' ? '' : colorMarca(estado.marca);
  }

  /* ══ Formas de pago ══════════════════════════════════════
     Solo aparece si el panel tiene cargada alguna forma de pago; el
     descuento que se muestra es el mejor de los productos que la aceptan. */
  function pintarMedios() {
    var caja = $('#payBox');
    if (!caja) return;
    var medios = FP.mediosCatalogo();
    if (!medios.length) { caja.hidden = true; return; }
    caja.hidden = false;

    var conteo = {};
    FP.productos().forEach(function (p) {
      if (!pasa(p, 'medio')) return;
      (p.medios || []).forEach(function (m) {
        var c = conteo[m.medio] || (conteo[m.medio] = { n: 0, pct: 0 });
        c.n++;
        if (m.pct > c.pct) c.pct = m.pct;
      });
    });

    var html = ['<li><button data-medio="all" class="' + (estado.medio === 'all' ? 'is-on' : '') + '">' +
                '<span>Todas las formas de pago</span></button></li>'];
    medios.forEach(function (m) {
      var c = conteo[m] || { n: 0, pct: 0 };
      html.push('<li><button data-medio="' + esc(m) + '" class="' + (estado.medio === m ? 'is-on' : '') + '">' +
        '<span>' + esc(m) + '</span>' +
        (c.pct > 0 ? '<em>−' + c.pct + '%</em>' : '') +
        '<b>' + c.n + '</b></button></li>');
    });
    $$('[data-medios]').forEach(function (n) { n.innerHTML = html.join(''); });
  }

  /* ══ Rubros ══════════════════════════════════════════════ */
  function pintarCategorias() {
    var cats = {};
    FP.productos().forEach(function (p) {
      if (!pasa(p, 'cat')) return;
      cats[p.cat] = cats[p.cat] || { n: 0, nom: p.catNom };
      cats[p.cat].n++;
    });
    var total = Object.keys(cats).reduce(function (a, k) { return a + cats[k].n; }, 0);

    function fila(slug, nom, n) {
      return '<li><button data-cat="' + esc(slug) + '" class="' + (estado.cat === slug ? 'is-on' : '') + '">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" ' +
        'stroke-linecap="round" stroke-linejoin="round">' + (ICONO[slug] || ICONO_DEFAULT) + '</svg>' +
        '<span>' + esc(nom) + '</span><b>' + n + '</b></button></li>';
    }

    var html = [fila('all', 'Todas las categorías', total)];
    Object.keys(cats).sort(function (a, b) {
      return cats[b].n - cats[a].n || cats[a].nom.localeCompare(cats[b].nom, 'es');
    }).forEach(function (k) { html.push(fila(k, cats[k].nom, cats[k].n)); });

    $$('[data-cats]').forEach(function (n) { n.innerHTML = html.join(''); });
  }

  /* ══ Precio: lista + mejor forma de pago + cuotas ════════ */
  function bloquePrecio(p) {
    // Si hay un filtro de forma de pago activo, la tarjeta muestra el precio de
    // ESA forma; si no, el mejor precio del producto.
    var mejor = FP.mejorMedio(p);
    if (estado.medio !== 'all') {
      var m = (p.medios || []).filter(function (x) { return x.medio === estado.medio; })[0];
      mejor = (m && m.pct > 0) ? { medio: m.medio, pct: m.pct, precioFinal: FP.precioCon(p.precio, m.pct) } : null;
    }
    var cuotas = p.cuotas || 0;
    return '<div class="pcard-price">' + money(p.precio) + '</div>' +
      (mejor
        ? '<p class="pcard-pay"><b>' + money(mejor.precioFinal) + '</b> con ' + esc(mejor.medio) + '</p>'
        : '<p class="pcard-note">Precio final en ARS</p>') +
      (cuotas > 1
        ? '<p class="pcard-cuotas">' + cuotas + 'x ' + money(p.precio / cuotas) + ' sin interés</p>'
        : '');
  }

  /* ══ Tarjetas ════════════════════════════════════════════ */
  function tarjeta(p) {
    var n = FP.cant(p.id);
    var badge = (p.specs || [])[0];
    return '' +
      '<article class="pcard" data-id="' + esc(p.id) + '">' +
        (badge ? '<span class="pcard-badge">' + esc(badge) + '</span>' : '') +
        '<button class="pcard-fav' + (favoritos[p.id] ? ' is-on' : '') + '" data-fav="' + esc(p.id) + '" ' +
          'aria-label="Guardar ' + esc(p.nombre) + ' en favoritos" aria-pressed="' + (favoritos[p.id] ? 'true' : 'false') + '">' +
          '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9">' +
          '<path d="M12 20.3l-1.4-1.3C5.4 14.3 2.5 11.7 2.5 8.5 2.5 6 4.5 4 7 4c1.7 0 3.3.8 4.2 2.1l.8 1 .8-1C13.7 4.8 15.3 4 17 4c2.5 0 4.5 2 4.5 4.5 0 3.2-2.9 5.8-8.1 10.5z"/></svg>' +
        '</button>' +
        '<button class="pcard-img" data-ficha="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' +
          '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="420" height="360">' +
        '</button>' +
        '<div class="pcard-body">' +
          (p.cod ? '<span class="pcard-sku">' + esc(p.cod) + '</span>' : '') +
          '<h3 class="pcard-name"><button data-ficha="' + esc(p.id) + '">' + esc(p.nombre) + '</button></h3>' +
          bloquePrecio(p) +
          '<p class="pcard-stock"><i></i>Disponible</p>' +
          (n
            ? '<div class="pcard-btn"><div class="pcard-qty">' +
                '<button data-minus="' + esc(p.id) + '" aria-label="Quitar uno">−</button>' +
                '<span>' + n + ' en el pedido</span>' +
                '<button data-plus="' + esc(p.id) + '" aria-label="Agregar uno">+</button></div></div>'
            : '<div class="pcard-btn"><button data-ficha="' + esc(p.id) + '">' +
                '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.1">' +
                '<path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.55L21 8H6.2"/>' +
                '<circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>' +
                'Ver detalle</button></div>') +
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

    grid.className = 'pgrid' + (estado.vista === 'list' ? ' is-list' : '');
    grid.innerHTML = pagina.map(tarjeta).join('');
    $$('.pcard', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 35 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    var de = (estado.marca !== 'all' ? ' de <b>' + esc(estado.marca) + '</b>' : '') +
             (estado.medio !== 'all' ? ' con <b>' + esc(estado.medio) + '</b>' : '');
    $('#resCount').innerHTML = lista.length
      ? 'Mostrando <b>' + lista.length + '</b> producto' + (lista.length === 1 ? '' : 's') + de +
        (lista.length > POR_PAGINA ? ' · página ' + estado.page + ' de ' + paginas : '')
      : 'Sin resultados' + de;

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
    pintarCategorias();
    pintarMarcas();
    pintarMedios();
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

  /* ══ Ficha: formas de pago del producto ══════════════════ */
  function bloquePago(p) {
    var medios = p.medios || [], cuotas = p.cuotas || 0;
    if (!medios.length && cuotas < 2) return '';
    var filas = medios.map(function (m) {
      return '<li><span>' + esc(m.medio) + '</span>' +
        (m.pct > 0 ? '<em>−' + m.pct + '%</em>' : '') +
        '<b>' + money(FP.precioCon(p.precio, m.pct)) + '</b></li>';
    });
    if (cuotas > 1) {
      filas.push('<li><span>' + cuotas + ' cuotas sin interés</span><em>por mes</em><b>' +
        money(p.precio / cuotas) + '</b></li>');
    }
    return '<div class="sheet-pay"><h3>Formas de pago</h3><ul>' + filas.join('') + '</ul></div>';
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
      '<div class="sheet-img"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" width="900" height="675"></div>' +
      '<div class="sheet-info">' +
        '<div class="sheet-meta">' +
          (p.marca ? '<span class="sheet-brand">' + esc(p.marca) + '</span>' : '') +
          '<span class="sheet-cat">' + esc(p.catNom) + '</span>' +
        '</div>' +
        '<h2>' + esc(p.nombre) + '</h2>' +
        (p.cod ? '<code class="sheet-sku">Código ' + esc(p.cod) + '</code>' : '') +
        ((p.specs || []).length
          ? '<ul class="sheet-specs">' + p.specs.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'
          : '') +
        '<div class="sheet-price"><b>' + money(p.precio) + '</b><small>Precio final en ARS' +
          (p.unidad ? ' · por ' + esc(p.unidad) : '') + '</small></div>' +
        bloquePago(p) +
        '<p class="sheet-stock"><i></i>Disponible · garantía oficial de fábrica</p>' +
        (n
          ? '<div class="sheet-stepper"><button data-minus="' + esc(p.id) + '" aria-label="Quitar uno">−</button>' +
            '<span>' + n + ' en el pedido</span>' +
            '<button data-plus="' + esc(p.id) + '" aria-label="Agregar uno">+</button></div>'
          : '<button class="btn btn-amber btn-block" data-add="' + esc(p.id) + '">Agregar al pedido</button>') +
        '<a class="btn btn-dark btn-block" target="_blank" rel="noopener" href="' +
          FP.linkWA('Hola Ferrepehua, quiero consultar por: ' + p.nombre + (p.cod ? ' (' + p.cod + ')' : '')) +
        '">Consultar este producto</a>' +
        '<p class="sheet-note">Precio final en pesos. El envío se cotiza aparte según destino.</p>' +
      '</div>';
  }

  /* ══ Panel de categorías (mobile) ════════════════════════ */
  // El panel es un cajón deslizable solo hasta 900px; más ancho que eso vive
  // fijo en la columna izquierda.
  function esCajon() { return window.matchMedia('(max-width:900px)').matches; }

  function abrirLateral(open) {
    // En desktop no hay nada que abrir: hacerlo solo dejaba el fondo oscuro
    // encima de todo y la página trabada sin scroll.
    if (open && !esCajon()) return;
    $('#filters').classList.toggle('open', open);
    $('#sideBackdrop').hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  }

  // Si se agranda la ventana con el cajón abierto, hay que soltar el scroll.
  window.addEventListener('resize', function () {
    if (!esCajon() && $('#filters').classList.contains('open')) abrirLateral(false);
  });

  /* ══ Eventos ═════════════════════════════════════════════ */
  function aplicar() {
    estado.page = 1;
    escribirURL();
    render();
  }

  document.addEventListener('click', function (e) {
    var ficha = e.target.closest('[data-ficha]');
    if (ficha) { abrirFicha(ficha.dataset.ficha); return; }

    var fav = e.target.closest('[data-fav]');
    if (fav) {
      var fid = fav.dataset.fav;
      if (favoritos[fid]) delete favoritos[fid]; else favoritos[fid] = 1;
      try { localStorage.setItem('fp_fav', JSON.stringify(favoritos)); } catch (err) {}
      fav.classList.toggle('is-on', !!favoritos[fid]);
      fav.setAttribute('aria-pressed', favoritos[fid] ? 'true' : 'false');
      return;
    }

    var add = e.target.closest('[data-add]');
    if (add) {
      FP.agregar(add.dataset.add, 1);
      var nav = $('#navCart');
      if (nav) { nav.classList.add('bump'); setTimeout(function () { nav.classList.remove('bump'); }, 400); }
      return;
    }

    var cat = e.target.closest('[data-cat]');
    if (cat) { estado.cat = cat.dataset.cat; aplicar(); abrirLateral(false); return; }

    var brand = e.target.closest('[data-brand]');
    if (brand) { estado.marca = brand.dataset.brand; aplicar(); abrirLateral(false); return; }

    var medio = e.target.closest('[data-medio]');
    if (medio) { estado.medio = medio.dataset.medio; aplicar(); abrirLateral(false); return; }

    var pg = e.target.closest('[data-page]');
    if (pg && !pg.disabled) {
      estado.page = parseInt(pg.dataset.page, 10);
      escribirURL();
      render();
      $('.shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    var clear = e.target.closest('[data-clear]');
    if (clear) {
      estado.cat = 'all'; estado.marca = 'all'; estado.medio = 'all'; estado.q = '';
      $('#q').value = '';
      aplicar();
      return;
    }
  });

  // Buscador con debounce: no re-renderiza en cada tecla.
  var tq = null;
  $('#q').addEventListener('input', function () {
    var v = this.value;
    clearTimeout(tq);
    tq = setTimeout(function () { estado.q = v; aplicar(); }, 180);
  });
  $('#searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    clearTimeout(tq);
    estado.q = $('#q').value;
    aplicar();
  });

  $('#orden').addEventListener('change', function () { estado.orden = this.value; aplicar(); });

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

  // En mobile abre el cajón; en desktop hace lo que dice el botón: mostrar
  // todas las categorías y llevar la vista a la grilla.
  $('#filtersOpen').addEventListener('click', function () {
    if (esCajon()) { abrirLateral(true); return; }
    estado.cat = 'all';
    aplicar();
    $('.shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#filtersClose').addEventListener('click', function () { abrirLateral(false); });
  $('#sideBackdrop').addEventListener('click', function () { abrirLateral(false); });

  $('#sheetClose').addEventListener('click', cerrarFicha);
  sheetBackdrop.addEventListener('click', cerrarFicha);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { cerrarFicha(); abrirLateral(false); }
  });

  window.addEventListener('popstate', function () {
    leerURL();
    $('#q').value = estado.q;
    $('#orden').value = estado.orden;
    render();
  });

  /* ══ Init ════════════════════════════════════════════════ */
  $('#year').textContent = new Date().getFullYear();
  try {
    var v = localStorage.getItem('fp_vista');
    if (v === 'list') { estado.vista = 'list'; $('#viewList').classList.add('is-on'); $('#viewGrid').classList.remove('is-on'); }
  } catch (e) {}

  leerURL();
  $('#q').value = estado.q;
  $('#orden').value = estado.orden;

  FP.montarCarrito();
  FP.alCambiar(function () { render(); pintarFicha(); });

  render();
  FP.iniciar().then(render);
})();
