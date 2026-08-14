/* ══════════════════════════════════════════════════════════
   FERREPEHUA — núcleo compartido de catálogo y pedido
   Lo usan el home (script.js) y la página de catálogo.
   Expone window.FP.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA = CFG.WA || '5492396616927';

  /* ── Catálogo de respaldo ────────────────────────────────
     Se muestra mientras responde CobrOS y si el panel no está
     disponible, para que la web nunca quede vacía.            */
  var FALLBACK = [
    { id:'ID8008',      cat:'electricas',   catNom:'Herramientas eléctricas',    marca:'INGCO',  nombre:'Taladro percutor 13mm 800W',                 specs:['800W','13mm','Reversible'],             precio:30500,  img:'img/p-taladro-percutor.jpg',    dest:true },
    { id:'AG11508-5',   cat:'electricas',   catNom:'Herramientas eléctricas',    marca:'INGCO',  nombre:'Amoladora angular 115mm 800W',               specs:['800W','115mm','11.000 rpm'],            precio:38900,  img:'img/p-amoladora.jpg' },
    { id:'RH12008',     cat:'electricas',   catNom:'Herramientas eléctricas',    marca:'INGCO',  nombre:'Rotomartillo SDS Plus 1050W 3.5J',           specs:['1050W','3.5J','SDS Plus'],              precio:94500,  img:'img/p-rotomartillo.jpg' },
    { id:'HGL12003',    cat:'electricas',   catNom:'Herramientas eléctricas',    marca:'INGCO',  nombre:'Pistola de calor 1800W industrial',          specs:['1800W','2 temperaturas','4 boquillas'], precio:26900,  img:'img/p-pistola-calor.jpg' },
    { id:'CDLI205581',  cat:'inalambricas', catNom:'Herramientas inalámbricas',  marca:'INGCO',  nombre:'Taladro inalámbrico compacto 20V 55Nm',      specs:['20V','55 Nm','Brushless'],              precio:84500,  img:'img/p-taladro-inalambrico.jpg', dest:true },
    { id:'CIWLI205581', cat:'inalambricas', catNom:'Herramientas inalámbricas',  marca:'INGCO',  nombre:'Llave de impacto inalámbrica 20V 300Nm',     specs:['20V','300 Nm','Brushless'],             precio:106900, img:'img/p-llave-impacto.jpg' },
    { id:'CSLI1401',    cat:'inalambricas', catNom:'Herramientas inalámbricas',  marca:'INGCO',  nombre:'Sierra circular inalámbrica 20V 140mm',      specs:['20V','140mm','4.500 rpm'],              precio:78900,  img:'img/p-sierra-circular.jpg' },
    { id:'THT102256',   cat:'manuales',     catNom:'Herramientas manuales',      marca:'TOTAL',  nombre:'Juego de llaves combinadas 8–22mm · 12 pzas',specs:['12 piezas','8–22mm','Cr-V'],            precio:34900,  img:'img/p-llaves-combinadas.jpg' },
    { id:'THT73166',    cat:'manuales',     catNom:'Herramientas manuales',      marca:'TOTAL',  nombre:'Martillo de uña 16oz mango de fibra',        specs:['16 oz','Fibra','Antideslizante'],       precio:8400,   img:'img/p-martillo.jpg' },
    { id:'WSS1K06',     cat:'manuales',     catNom:'Herramientas manuales',      marca:'WADFOW', nombre:'Juego de destornilladores 6 piezas',         specs:['6 piezas','Cr-V','Imantados'],          precio:12700,  img:'img/p-destornilladores.jpg' },
    { id:'HSMT08519',   cat:'medicion',     catNom:'Medición y nivelación',      marca:'INGCO',  nombre:'Cinta métrica 5m x 19mm magnética',          specs:['5 m','19 mm','Punta magnética'],        precio:2850,   img:'img/p-cinta-metrica.jpg', dest:true },
    { id:'ELLR2001',    cat:'medicion',     catNom:'Medición y nivelación',      marca:'EMTOP',  nombre:'Nivel láser autonivelante verde 2 líneas',   specs:['Láser verde','2 líneas','±0,3 mm/m'],   precio:79900,  img:'img/p-nivel-laser.jpg' },
    { id:'AKD11901',    cat:'accesorios',   catNom:'Accesorios y consumibles',   marca:'INGCO',  nombre:'Set de mechas HSS 19 piezas 1–10mm',         specs:['19 piezas','HSS','1–10 mm'],            precio:9900,   img:'img/p-mechas.jpg' },
    { id:'TAC2201151',  cat:'accesorios',   catNom:'Accesorios y consumibles',   marca:'TOTAL',  nombre:'Discos de corte 115mm · pack x10',           specs:['115 mm','Pack x10','Metal'],            precio:6200,   img:'img/p-discos-corte.jpg' },
    { id:'WLDA1207',    cat:'construccion', catNom:'Construcción',               marca:'WADFOW', nombre:'Escalera de aluminio 7 escalones reforzada', specs:['7 escalones','Aluminio','150 kg'],      precio:89900,  img:'img/p-escalera.jpg' },
    { id:'TGT51012',    cat:'jardineria',   catNom:'Jardinería',                 marca:'TOTAL',  nombre:'Bordeadora eléctrica 1000W 300mm',           specs:['1000W','300 mm','Hilo de nylon'],       precio:52900,  img:'img/p-jardineria.jpg' },
    { id:'EFLL3001',    cat:'iluminacion',  catNom:'Iluminación',                marca:'EMTOP',  nombre:'Reflector LED recargable 30W con trípode',   specs:['30W','Recargable','IP65'],              precio:24900,  img:'img/p-reflector.jpg' },
    { id:'HSKSPK01',    cat:'seguridad',    catNom:'Seguridad y protección',     marca:'INGCO',  nombre:'Kit de seguridad: casco, guantes y antiparras', specs:['Casco','Guantes','Antiparras'],       precio:18500,  img:'img/p-seguridad.jpg' }
  ];
  FALLBACK.forEach(function (p) { p.cod = p.id; });

  var CAT_NOMBRES = {
    electricas:'Herramientas eléctricas', inalambricas:'Herramientas inalámbricas',
    manuales:'Herramientas manuales', accesorios:'Accesorios y consumibles',
    construccion:'Construcción', medicion:'Medición y nivelación',
    jardineria:'Jardinería', iluminacion:'Iluminación',
    seguridad:'Seguridad y protección', organizacion:'Organización'
  };

  // Prefijo para resolver las imágenes de respaldo desde una subpágina.
  var BASE = /\/catalogo\/?$/.test(location.pathname) ? '../' : '';

  FALLBACK.forEach(function (p) { p.img = imagen(p.img); });

  var productos = FALLBACK.slice();
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('fp_cart') || '{}'); } catch (e) { carrito = {}; }

  var oyentes = [];

  function money(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }

  /* ── Formas de pago del producto ─────────────────────────
     El panel guarda `mediosPago: [{ medio, descuentoPct }]` y
     `cuotasSinInteres`. El descuento se aplica sobre el precio de lista.  */
  function normalizarMedios(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (m) {
      return { medio: String((m && m.medio) || '').trim(), pct: Number((m && m.descuentoPct) || 0) };
    }).filter(function (m) { return !!m.medio; });
  }
  // Mismo redondeo que usa CobrOS para el precio con descuento.
  function precioCon(precio, pct) {
    return Math.round((precio || 0) * (1 - (pct || 0) / 100) * 100) / 100;
  }
  // Forma de pago más conveniente de un producto (la de mayor descuento), o null.
  function mejorMedio(p) {
    var conDto = (p.medios || []).filter(function (m) { return m.pct > 0; });
    if (!conDto.length) return null;
    var best = conDto.reduce(function (a, b) { return b.pct > a.pct ? b : a; });
    return { medio: best.medio, pct: best.pct, precioFinal: precioCon(p.precio, best.pct) };
  }
  // Todas las formas de pago que aparecen en el catálogo (para el filtro).
  function mediosCatalogo() {
    var vistos = {}, out = [];
    productos.forEach(function (p) {
      (p.medios || []).forEach(function (m) {
        if (vistos[m.medio]) return;
        vistos[m.medio] = 1; out.push(m.medio);
      });
    });
    return out.sort(function (a, b) { return a.localeCompare(b, 'es'); });
  }

  // Las categorías del panel vienen con acento ("Eléctricas"); los filtros
  // usan el slug sin acentos ("electricas").
  function slugCat(s) {
    return (s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function imagen(src) {
    if (!src) return BASE + 'img/p-mechas.jpg';
    return /^https?:|^data:|^\//.test(src) ? src : BASE + src;
  }

  /* ── Catálogo en vivo desde CobrOS ─────────────────────── */
  function cargar() {
    if (!CFG.SLUG) return Promise.resolve(null);
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_MS || 8000);
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(t);
        if (!d || !d.productos || !d.productos.length) return null;
        return d.productos.map(function (p) {
          // La marca es un campo propio del panel (`marca`). Los productos
          // cargados antes de que existiera venían como "MARCA - Producto" en
          // el nombre, así que ese formato se sigue leyendo como respaldo.
          var m = /^([A-Za-z0-9]+)\s*[-–]\s*(.+)$/.exec(p.nombre || '');
          var marcaApi = String(p.marca || '').trim().toUpperCase();
          var marca = marcaApi || (m ? m[1].toUpperCase() : '');
          // El prefijo se saca del nombre solo si es efectivamente la marca:
          // así "INGCO - Taladro" queda "Taladro" y "Kit 3 - piezas" no se rompe.
          var nombre = (m && m[1].toUpperCase() === marca) ? m[2] : (p.nombre || '');
          return {
            id: p._id || '',
            cod: p.codigo || '',
            cat: slugCat(p.categoria),
            catNom: p.categoria || 'General',
            marca: marca,
            nombre: nombre,
            specs: (p.descripcion || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean),
            precio: p.precio || 0,
            medios: normalizarMedios(p.mediosPago),
            cuotas: Math.max(0, parseInt(p.cuotasSinInteres, 10) || 0),
            img: imagen(p.foto),
            stock: p.stock,
            unidad: p.unidad || ''
          };
        });
      })
      .catch(function () { clearTimeout(t); return null; });
  }

  /* ── Carrito ───────────────────────────────────────────── */
  function buscar(id) {
    for (var i = 0; i < productos.length; i++) if (productos[i].id === id) return productos[i];
    return null;
  }
  // Solo ítems que existan en el catálogo actual: un carrito guardado de una
  // visita anterior puede tener IDs que ya no están.
  function itemsCarrito() {
    return Object.keys(carrito).filter(function (k) { return !!buscar(k); });
  }
  function totalItems() {
    return itemsCarrito().reduce(function (a, k) { return a + carrito[k]; }, 0);
  }
  function totalPesos() {
    return itemsCarrito().reduce(function (a, k) { return a + buscar(k).precio * carrito[k]; }, 0);
  }
  function guardar() {
    try { localStorage.setItem('fp_cart', JSON.stringify(carrito)); } catch (e) {}
  }
  function setCant(id, n) {
    if (n > 0) carrito[id] = n; else delete carrito[id];
    guardar(); avisar();
  }
  function agregar(id, n) { setCant(id, (carrito[id] || 0) + (n || 1)); }
  function cant(id) { return carrito[id] || 0; }
  function vaciar() { carrito = {}; guardar(); avisar(); }

  // Total del pedido con cada forma de pago que dé descuento: cada ítem aplica
  // el suyo y los que no aceptan ese medio quedan al precio de lista.
  function totalesPorMedio() {
    var total = totalPesos();
    var medios = {}, orden = [];
    itemsCarrito().forEach(function (k) {
      (buscar(k).medios || []).forEach(function (m) {
        if (m.pct > 0 && !medios[m.medio]) { medios[m.medio] = 1; orden.push(m.medio); }
      });
    });
    return orden.map(function (medio) {
      return {
        medio: medio,
        total: itemsCarrito().reduce(function (a, k) {
          var p = buscar(k);
          var m = (p.medios || []).filter(function (x) { return x.medio === medio; })[0];
          return a + precioCon(p.precio, m ? m.pct : 0) * carrito[k];
        }, 0)
      };
    }).filter(function (t) { return t.total < total - 0.01; })
      .sort(function (a, b) { return a.total - b.total; });
  }

  function mensajeWA() {
    var lineas = itemsCarrito().map(function (k) {
      var p = buscar(k);
      return '• ' + carrito[k] + 'x ' + p.nombre + (p.cod ? ' (' + p.cod + ')' : '') +
             ' — ' + money(p.precio * carrito[k]);
    }).join('\n');
    var alt = totalesPorMedio().map(function (t) {
      return '\nPagando con ' + t.medio + ': ' + money(t.total);
    }).join('');
    return (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
           '\n\nTotal estimado: ' + money(totalPesos()) + alt +
           '\n\n¿Me confirmás stock y forma de envío?';
  }
  function linkWA(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }

  function avisar() { oyentes.forEach(function (fn) { fn(); }); }

  /* ── Cajón de pedido (compartido por las dos páginas) ──── */
  function montarCarrito() {
    var $ = function (s) { return document.querySelector(s); };
    var cart = $('#cart'), backdrop = $('#cartBackdrop'), body = $('#cartBody');
    if (!cart || !body) return;

    function abrir(open) {
      cart.classList.toggle('open', open);
      cart.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.hidden = !open;
      document.body.classList.toggle('no-scroll', open);
    }

    function pintar() {
      var keys = itemsCarrito();
      var badge = $('#cartCount'), navCart = $('#navCart'), send = $('#cartSend');
      if (badge) badge.textContent = totalItems();
      if (navCart) navCart.classList.toggle('has', keys.length > 0);
      var tot = $('#cartTotal'); if (tot) tot.textContent = money(totalPesos());

      // Precio del pedido con las formas de pago que dan descuento.
      var alt = $('#cartAlt');
      if (alt) {
        var tarifas = keys.length ? totalesPorMedio() : [];
        alt.hidden = !tarifas.length;
        alt.innerHTML = tarifas.map(function (t) {
          return '<span><i>' + t.medio + '</i><b>' + money(t.total) + '</b></span>';
        }).join('');
      }

      if (!keys.length) {
        body.innerHTML = '<div class="cart-empty"><p>Todavía no agregaste nada.</p>' +
          '<span>Sumá productos del catálogo y armamos el pedido acá.</span></div>';
        if (send) send.classList.add('is-off');
        return;
      }
      if (send) {
        send.classList.remove('is-off');
        send.href = linkWA(mensajeWA());
      }
      body.innerHTML = keys.map(function (k) {
        var p = buscar(k);
        return '<div class="cart-item">' +
          '<img src="' + p.img + '" alt="" width="80" height="60" loading="lazy">' +
          '<div class="ci-txt">' + (p.cod ? '<code>' + p.cod + '</code>' : '') +
          '<h4>' + p.nombre + '</h4><b>' + money(p.precio * carrito[k]) + '</b></div>' +
          '<div class="ci-qty">' +
            '<button data-minus="' + k + '" aria-label="Quitar uno">−</button>' +
            '<span>' + carrito[k] + '</span>' +
            '<button data-plus="' + k + '" aria-label="Agregar uno">+</button>' +
          '</div></div>';
      }).join('');
    }

    document.addEventListener('click', function (e) {
      var plus = e.target.closest('[data-plus]');
      if (plus) { agregar(plus.dataset.plus, 1); return; }
      var minus = e.target.closest('[data-minus]');
      if (minus) { setCant(minus.dataset.minus, cant(minus.dataset.minus) - 1); return; }
    });

    var navCart = $('#navCart');
    if (navCart) navCart.addEventListener('click', function () { abrir(true); });
    var close = $('#cartClose');
    if (close) close.addEventListener('click', function () { abrir(false); });
    if (backdrop) backdrop.addEventListener('click', function () { abrir(false); });
    var send = $('#cartSend');
    if (send) send.addEventListener('click', function (e) {
      if (this.classList.contains('is-off')) e.preventDefault();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });

    oyentes.push(pintar);
    pintar();
    return { abrir: abrir, pintar: pintar };
  }

  /* ── Init: arranca con el respaldo y refresca con CobrOS ─ */
  function iniciar() {
    return cargar().then(function (prods) {
      if (prods && prods.length) { productos = prods; avisar(); }
      return productos;
    });
  }

  window.FP = {
    CAT_NOMBRES: CAT_NOMBRES,
    WA: WA,
    base: BASE,
    productos: function () { return productos; },
    buscar: buscar,
    money: money,
    slugCat: slugCat,
    cant: cant, agregar: agregar, setCant: setCant, vaciar: vaciar,
    precioCon: precioCon, mejorMedio: mejorMedio, mediosCatalogo: mediosCatalogo,
    itemsCarrito: itemsCarrito, totalItems: totalItems, totalPesos: totalPesos,
    totalesPorMedio: totalesPorMedio,
    mensajeWA: mensajeWA, linkWA: linkWA,
    alCambiar: function (fn) { oyentes.push(fn); },
    montarCarrito: montarCarrito,
    iniciar: iniciar
  };
})();
