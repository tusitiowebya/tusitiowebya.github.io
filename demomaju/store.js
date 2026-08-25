/* ══════════════════════════════════════════════════════════
   MAju — núcleo compartido de catálogo y pedido
   Lo usan el home (script.js) y la página de catálogo (catalogo.js).
   Expone window.MJ.

   El pedido guarda talle: la clave del carrito es "id|talle", no el id
   solo, así una misma prenda puede ir en dos talles distintos.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA = CFG.WA || '5492216824635';
  var PLANES = CFG.PLANES || [];

  /* ── Catálogo de muestra ─────────────────────────────────
     Se muestra mientras responde CobrOS y si el panel no está
     conectado todavía, para que la web nunca quede vacía.
     Precios y prendas son de ejemplo: los reales salen del panel. */
  var FALLBACK = [
    { id:'V-01', cat:'vestidos',   nombre:'Vestido midi de punto',            precio:76900,  talles:['1','2','3','4'],     tela:'Morley',        planes:['noche','evento','juntada'], img:'img/p-vestido-negro.jpg',   dest:true },
    { id:'V-02', cat:'vestidos',   nombre:'Vestido largo satinado',           precio:112000, talles:['1','2','3'],         tela:'Satén',         planes:['evento','noche'],           img:'img/p-vestido-fiesta.jpg' },
    { id:'V-03', cat:'vestidos',   nombre:'Vestido floreado manga corta',     precio:68500,  talles:['1','2','3','4'],     tela:'Viscosa',       planes:['juntada','finde'],          img:'img/p-vestido-floral.jpg' },
    { id:'V-04', cat:'vestidos',   nombre:'Vestido cruzado de lino',          precio:71900,  talles:['1','2','3','4'],     tela:'Lino',          planes:['finde','juntada'],          img:'img/p-vestido-verano.jpg' },

    { id:'T-01', cat:'tops',       nombre:'Blusa oversize',                   precio:46900,  talles:['1','2','3','4'],     tela:'Gasa',          planes:['oficina','juntada'],        img:'img/p-blusa-blanca.jpg',    dest:true },
    { id:'T-02', cat:'tops',       nombre:'Camisa de lino manga larga',       precio:52400,  talles:['1','2','3','4'],     tela:'Lino',          planes:['oficina','finde','juntada'],img:'img/p-camisa-lino.jpg' },
    { id:'T-03', cat:'tops',       nombre:'Remera oversize de algodón',       precio:24900,  talles:['1','2','3','4'],     tela:'Algodón peinado',planes:['finde'],                   img:'img/p-remera-oversize.jpg' },
    { id:'T-04', cat:'tops',       nombre:'Top cuello redondo',               precio:21500,  talles:['1','2','3'],         tela:'Algodón',       planes:['finde','juntada'],          img:'img/p-top-rosa.jpg' },

    { id:'P-01', cat:'pantalones', nombre:'Pantalón sastrero tiro alto',      precio:67900,  talles:['1','2','3','4'],     tela:'Bengalina',     planes:['oficina','evento'],         img:'img/p-pantalon-sastrero.jpg', dest:true },
    { id:'P-02', cat:'pantalones', nombre:'Pantalón palazzo',                 precio:63500,  talles:['1','2','3','4'],     tela:'Crepe',         planes:['oficina','noche'],          img:'img/p-pantalon-negro.jpg' },
    { id:'P-03', cat:'pantalones', nombre:'Jean wide leg tiro alto',          precio:72900,  talles:['1','2','3','4','5'], tela:'Denim rígido',  planes:['finde','juntada'],          img:'img/p-jean.jpg' },

    { id:'F-01', cat:'faldas',     nombre:'Falda midi plisada',               precio:54900,  talles:['1','2','3','4'],     tela:'Poliéster',     planes:['oficina','juntada'],        img:'img/p-falda-midi.jpg' },
    { id:'F-02', cat:'faldas',     nombre:'Falda larga estampada',            precio:58900,  talles:['1','2','3','4'],     tela:'Viscosa',       planes:['finde','evento'],           img:'img/p-falda-larga.jpg' },

    { id:'A-01', cat:'abrigos',    nombre:'Trench de gabardina',              precio:128000, talles:['1','2','3','4'],     tela:'Gabardina',     planes:['oficina','juntada'],        img:'img/p-trench.jpg',          dest:true },
    { id:'A-02', cat:'abrigos',    nombre:'Campera de eco cuero',             precio:139000, talles:['1','2','3','4'],     tela:'Eco cuero',     planes:['noche','finde'],            img:'img/p-campera-cuero.jpg' },
    { id:'A-03', cat:'abrigos',    nombre:'Cardigan tejido',                  precio:61900,  talles:['1','2','3','4'],     tela:'Tejido',        planes:['oficina','finde'],          img:'img/p-cardigan.jpg' },
    { id:'A-04', cat:'abrigos',    nombre:'Sweater trenzado de lana',         precio:67500,  talles:['1','2','3','4'],     tela:'Lana',          planes:['finde','juntada'],          img:'img/p-sweater.jpg' },
    { id:'A-05', cat:'abrigos',    nombre:'Buzo de frisa oversize',           precio:44900,  talles:['1','2','3','4'],     tela:'Frisa',         planes:['finde'],                    img:'img/p-buzo.jpg' },

    { id:'C-01', cat:'conjuntos',  nombre:'Enterizo rayado manga larga',      precio:84900,  talles:['1','2','3'],         tela:'Viscosa',       planes:['juntada','evento'],         img:'img/p-enterito.jpg' },
    { id:'C-02', cat:'conjuntos',  nombre:'Enterizo de jean',                 precio:89900,  talles:['1','2','3','4'],     tela:'Denim',         planes:['finde','juntada'],          img:'img/p-enterito-jean.jpg' },
    { id:'C-03', cat:'conjuntos',  nombre:'Conjunto blazer + pantalón',       precio:148000, talles:['1','2','3','4'],     tela:'Bengalina',     planes:['oficina','evento'],         img:'img/p-traje.jpg',           dest:true },
    { id:'C-04', cat:'conjuntos',  nombre:'Blazer cuadrillé entallado',       precio:89900,  talles:['1','2','3','4'],     tela:'Paño',          planes:['oficina','juntada'],        img:'img/p-blazer.jpg' },

    { id:'X-01', cat:'accesorios', nombre:'Bolso de mano tejido',             precio:38900,  talles:[],                    tela:'Rafia',         planes:['juntada','finde'],          img:'img/p-bolso.jpg' },
    { id:'X-02', cat:'accesorios', nombre:'Pañuelo de seda estampado',        precio:18500,  talles:[],                    tela:'Seda',          planes:['oficina','evento'],         img:'img/p-panuelo.jpg' }
  ];

  var CAT_NOMBRES = {
    vestidos:'Vestidos', tops:'Tops y camisas', pantalones:'Pantalones y jeans',
    faldas:'Faldas', abrigos:'Abrigos y sweaters', conjuntos:'Conjuntos y enterizos',
    accesorios:'Accesorios', ropadeportiva:'Ropa deportiva', pijamas:'Pijamas y homewear'
  };

  // Formas de pago de muestra: cuando el catálogo venga de CobrOS, las
  // reales salen de `mediosPago` de cada producto.
  var MEDIOS_MUESTRA = [{ medio:'Transferencia', pct:10 }, { medio:'Efectivo', pct:15 }];

  // Prefijo para resolver las imágenes de muestra desde una subpágina.
  var BASE = /\/catalogo\/(index\.html)?$/.test(location.pathname) ? '../' : '';

  FALLBACK.forEach(function (p) {
    p.cod = p.id;
    p.catNom = CAT_NOMBRES[p.cat] || 'General';
    p.img = imagen(p.img);
    p.medios = MEDIOS_MUESTRA.slice();
    p.cuotas = p.precio >= 60000 ? 3 : 0;
    p.specs = [p.tela].filter(Boolean);
  });

  var productos = FALLBACK.slice();
  var conectado = false;              // true cuando el catálogo vino de CobrOS
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('maju_cart') || '{}'); } catch (e) { carrito = {}; }

  var oyentes = [];

  function money(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }

  function imagen(src) {
    if (!src) return BASE + 'img/p-blusa-blanca.jpg';
    return /^https?:|^data:|^\//.test(src) ? src : BASE + src;
  }

  // Las categorías del panel vienen con acento ("Pantalones y jeans"); los
  // filtros usan el slug sin acentos ni espacios ("pantalonesyjeans").
  function slugCat(s) {
    return (s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function sinAcentos(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* ── Formas de pago del producto ─────────────────────────
     El panel guarda `mediosPago: [{ medio, descuentoPct }]` y
     `cuotasSinInteres`. El descuento se aplica sobre el precio de lista. */
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

  /* ── Ocasiones ("vestir con propósito") ──────────────────
     Del panel llegan como palabras sueltas en la descripción; acá se
     traducen al id del plan configurado en config.js.                */
  function planDe(txt) {
    var t = sinAcentos(txt);
    for (var i = 0; i < PLANES.length; i++) {
      var m = PLANES[i].match || [];
      for (var j = 0; j < m.length; j++) {
        if (t === sinAcentos(m[j])) return PLANES[i].id;
      }
    }
    return null;
  }
  function nombrePlan(id) {
    for (var i = 0; i < PLANES.length; i++) if (PLANES[i].id === id) return PLANES[i].nombre;
    return id;
  }
  // Productos que sirven para un plan, del más caro al más barato
  // (para armar el look con la prenda principal primero).
  function porPlan(id) {
    return productos.filter(function (p) { return (p.planes || []).indexOf(id) >= 0; });
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
          // `descripcion` del panel: "Talles 1 al 4 · Lino · Oficina · Noche".
          var partes = (p.descripcion || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean);
          var talles = [], planes = [], specs = [];
          partes.forEach(function (parte) {
            var plan = planDe(parte);
            if (plan) { if (planes.indexOf(plan) < 0) planes.push(plan); return; }
            if (/^talles?\b/i.test(parte)) { talles = leerTalles(parte); return; }
            specs.push(parte);
          });
          var cat = slugCat(p.categoria);
          return {
            id: p._id || '',
            cod: p.codigo || '',
            cat: cat,
            catNom: p.categoria || 'General',
            nombre: p.nombre || '',
            talles: talles,
            planes: planes,
            tela: specs[0] || '',
            specs: specs,
            precio: p.precio || 0,
            medios: normalizarMedios(p.mediosPago),
            cuotas: Math.max(0, parseInt(p.cuotasSinInteres, 10) || 0),
            img: imagen(p.foto),
            stock: p.stock,
            dest: false
          };
        });
      })
      .catch(function () { clearTimeout(t); return null; });
  }

  // "Talles 1 al 4" → ['1','2','3','4'];  "Talles S M L" → ['S','M','L'];
  // "Talle único" → [].
  function leerTalles(txt) {
    var rango = /(\d+)\s*(?:al|a|-|–)\s*(\d+)/i.exec(txt);
    if (rango) {
      var out = [], a = +rango[1], b = +rango[2];
      for (var i = a; i <= b && out.length < 20; i++) out.push(String(i));
      return out;
    }
    var sueltos = txt.replace(/^talles?\s*/i, '').split(/[\s,/]+/).filter(function (s) {
      return /^(xxs|xs|s|m|l|xl|xxl|xxxl|\d{1,2})$/i.test(s);
    });
    return sueltos.map(function (s) { return s.toUpperCase(); });
  }

  /* ── Carrito ─────────────────────────────────────────────
     Clave = "id|talle". Una prenda en dos talles son dos líneas.       */
  function clave(id, talle) { return id + '|' + (talle || ''); }
  function idDe(k) { return String(k).split('|')[0]; }
  function talleDe(k) { return String(k).split('|')[1] || ''; }

  function buscar(id) {
    for (var i = 0; i < productos.length; i++) if (productos[i].id === id) return productos[i];
    return null;
  }
  function producto(k) { return buscar(idDe(k)); }

  // Solo líneas que existan en el catálogo actual: un carrito guardado de
  // una visita anterior puede tener IDs que ya no están.
  function itemsCarrito() {
    return Object.keys(carrito).filter(function (k) { return !!producto(k); });
  }
  function totalItems() {
    return itemsCarrito().reduce(function (a, k) { return a + carrito[k]; }, 0);
  }
  function totalPesos() {
    return itemsCarrito().reduce(function (a, k) { return a + producto(k).precio * carrito[k]; }, 0);
  }
  function guardar() {
    try { localStorage.setItem('maju_cart', JSON.stringify(carrito)); } catch (e) {}
  }
  function setCant(k, n) {
    if (n > 0) carrito[k] = n; else delete carrito[k];
    guardar(); avisar();
  }
  function agregar(id, talle, n) {
    var k = clave(id, talle);
    setCant(k, (carrito[k] || 0) + (n || 1));
    return k;
  }
  function cant(k) { return carrito[k] || 0; }
  // Cuántas unidades de un producto hay en el pedido, sumando todos los talles.
  function cantProducto(id) {
    return itemsCarrito().reduce(function (a, k) {
      return idDe(k) === id ? a + carrito[k] : a;
    }, 0);
  }
  function vaciar() { carrito = {}; guardar(); avisar(); }

  // Total del pedido con cada forma de pago que dé descuento.
  function totalesPorMedio() {
    var total = totalPesos();
    var vistos = {}, orden = [];
    itemsCarrito().forEach(function (k) {
      (producto(k).medios || []).forEach(function (m) {
        if (m.pct > 0 && !vistos[m.medio]) { vistos[m.medio] = 1; orden.push(m.medio); }
      });
    });
    return orden.map(function (medio) {
      return { medio: medio, total: totalConMedio(medio) };
    }).filter(function (t) { return t.total < total - 0.01; })
      .sort(function (a, b) { return a.total - b.total; });
  }

  function totalConMedio(medio) {
    return itemsCarrito().reduce(function (a, k) {
      var p = producto(k);
      var m = (p.medios || []).filter(function (x) { return x.medio === medio; })[0];
      return a + precioCon(p.precio, m ? m.pct : 0) * carrito[k];
    }, 0);
  }

  function detalleTalles() {
    return itemsCarrito().filter(function (k) { return !!talleDe(k); })
      .map(function (k) { return producto(k).nombre + ': talle ' + talleDe(k) + ' x' + carrito[k]; })
      .join(' — ');
  }

  // `datos` es opcional: sin él arma la consulta suelta; con él, el mensaje
  // del pedido ya confirmado (se manda después del checkout).
  function mensajeWA(datos) {
    var lineas = itemsCarrito().map(function (k) {
      var p = producto(k), t = talleDe(k);
      return '• ' + carrito[k] + 'x ' + p.nombre + (t ? ' — talle ' + t : '') +
             ' — ' + money(p.precio * carrito[k]);
    }).join('\n');

    if (!datos) {
      var alt = totalesPorMedio().map(function (t) {
        return '\nPagando con ' + t.medio + ': ' + money(t.total);
      }).join('');
      return (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
             '\n\nTotal estimado: ' + money(totalPesos()) + alt +
             '\n\n¿Me confirmás stock y envío?';
    }

    var txt = (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
              '\n\nTotal: ' + money(totalPesos());
    if (datos.medio) txt += '\nForma de pago: ' + datos.medio + ' → ' + money(totalConMedio(datos.medio));
    txt += '\n\nMis datos:\n' + datos.nombre + (datos.telefono ? '\nTel: ' + datos.telefono : '') +
           (datos.email ? '\n' + datos.email : '');
    if (datos.nota) txt += '\n' + datos.nota;
    txt += datos.registrado
      ? '\n\n(El pedido ya quedó cargado en su sistema)'
      : '\n\n¿Me confirmás stock y envío?';
    return txt;
  }

  function linkWA(texto) {
    return 'https://wa.me/' + WA + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  /* ── Pedido en CobrOS ────────────────────────────────────
     Crea la orden en el panel del negocio (queda como cargo pendiente del
     cliente y descuenta stock). El precio lo pone el servidor con el
     catálogo real, no la web. Los talles viajan en la nota porque el
     modelo Producto de CobrOS no tiene variantes.                        */
  function crearPedido(datos) {
    if (!CFG.SLUG) return Promise.reject(new Error('Catálogo no conectado'));
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_PEDIDO_MS || 15000);
    var nota = [
      datos.medio ? 'Forma de pago: ' + datos.medio : '',
      detalleTalles() ? 'Talles: ' + detalleTalles() : '',
      datos.nota || ''
    ].filter(Boolean).join(' — ');

    // Dos talles de la misma prenda se suman en un solo ítem del pedido:
    // CobrOS descuenta stock por producto, el talle queda en la nota.
    var porProducto = {};
    itemsCarrito().forEach(function (k) {
      var id = idDe(k);
      porProducto[id] = (porProducto[id] || 0) + carrito[k];
    });

    return fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email, nota: nota,
        items: Object.keys(porProducto).map(function (id) {
          return { productoId: id, cantidad: porProducto[id] };
        })
      })
    }).then(function (r) {
      clearTimeout(t);
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || 'No se pudo registrar el pedido');
        return d;
      });
    }, function (e) { clearTimeout(t); throw e; });
  }

  function avisar() { oyentes.forEach(function (fn) { fn(); }); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Cajón de pedido (compartido por las dos páginas) ────
     Tres pasos: (1) el pedido, (2) los datos, (3) confirmación.
     Con CobrOS conectado el pedido se registra y recién ahí aparece el
     botón de WhatsApp. Sin conectar, va derecho a WhatsApp.             */
  function montarCarrito() {
    var $ = function (s) { return document.querySelector(s); };
    var cart = $('#cart'), backdrop = $('#cartBackdrop'), body = $('#cartBody');
    if (!cart || !body) return;

    var paso = 'pedido';
    var datos = { nombre: '', telefono: '', email: '', medio: '', nota: '' };
    var enviando = false, error = '', resultado = null;

    try { datos = Object.assign(datos, JSON.parse(localStorage.getItem('maju_datos') || '{}')); } catch (e) {}

    var panel = document.createElement('div');
    panel.className = 'cart-step';
    panel.hidden = true;
    cart.appendChild(panel);

    function abrir(open) {
      cart.classList.toggle('open', open);
      cart.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.hidden = !open;
      document.body.classList.toggle('no-scroll', open);
      if (!open && paso === 'listo') cerrarPedido();
    }

    // Al cerrar la confirmación el carrito se vacía: el pedido ya se mandó y
    // dejarlo cargado haría que el próximo se duplique.
    function cerrarPedido() {
      paso = 'pedido'; resultado = null; error = '';
      vaciar();
      pintarPanel();
    }
    function irA(p) { paso = p; pintarPanel(); }

    /* ── Paso 1: el pedido ── */
    function pintar() {
      var keys = itemsCarrito();
      var badge = $('#cartCount'), navCart = $('#navCart');
      if (badge) badge.textContent = totalItems();
      if (navCart) navCart.classList.toggle('has', keys.length > 0);

      var sum = $('#cartSum'), next = $('#cartNext'), note = $('#cartNote');
      if (sum) sum.innerHTML = resumenHTML();
      if (next) next.disabled = !keys.length;
      if (note) note.hidden = !keys.length;

      if (!keys.length) {
        body.innerHTML = '<div class="cart-empty"><p>Todavía no elegiste nada.</p>' +
          '<span>Sumá prendas del catálogo y armamos el pedido acá.</span></div>';
        return;
      }
      body.innerHTML = keys.map(function (k) {
        var p = producto(k), t = talleDe(k);
        return '<div class="cart-item">' +
          '<img src="' + esc(p.img) + '" alt="" width="72" height="96" loading="lazy">' +
          '<div class="ci-txt">' +
            '<h4>' + esc(p.nombre) + '</h4>' +
            (t ? '<span class="ci-talle">Talle ' + esc(t) + '</span>' : '') +
            '<b>' + money(p.precio * carrito[k]) + '</b>' +
          '</div>' +
          '<div class="ci-qty">' +
            '<button data-minus="' + esc(k) + '" aria-label="Quitar uno">−</button>' +
            '<span>' + carrito[k] + '</span>' +
            '<button data-plus="' + esc(k) + '" aria-label="Agregar uno">+</button>' +
          '</div></div>';
      }).join('');
    }

    function resumenHTML() {
      var filas = ['<div class="cs-row cs-total"><span>Total</span><b>' + money(totalPesos()) + '</b></div>'];
      totalesPorMedio().forEach(function (t) {
        filas.push('<div class="cs-row cs-off"><span>Con ' + esc(t.medio) + '</span><b>' +
                   money(t.total) + '</b></div>');
      });
      return filas.join('');
    }

    /* ── Pasos 2 y 3 ── */
    function pintarPanel() {
      if (paso === 'pedido') { panel.hidden = true; panel.innerHTML = ''; pintar(); return; }
      var head = cart.querySelector('.cart-head');
      if (head) panel.style.top = head.offsetHeight + 'px';
      panel.hidden = false;
      panel.innerHTML = paso === 'datos' ? formHTML() : listoHTML();
      var foco = panel.querySelector('input');
      if (foco && paso === 'datos') foco.focus();
    }

    function formHTML() {
      var medios = [];
      itemsCarrito().forEach(function (k) {
        (producto(k).medios || []).forEach(function (m) {
          if (medios.indexOf(m.medio) < 0) medios.push(m.medio);
        });
      });
      var opciones = ['<option value="">A convenir</option>'].concat(medios.map(function (m) {
        return '<option value="' + esc(m) + '"' + (datos.medio === m ? ' selected' : '') + '>' +
               esc(m) + ' — ' + money(totalConMedio(m)) + '</option>';
      })).join('');

      return '' +
        '<header class="cs-head">' +
          '<button class="cs-back" data-volver aria-label="Volver al pedido">←</button>' +
          '<div><h3>Tus datos</h3><p>Confirmamos stock, talle y envío por WhatsApp.</p></div>' +
        '</header>' +
        '<div class="cs-body">' +
          (error ? '<p class="cs-error">' + esc(error) + '</p>' : '') +
          '<label class="cs-field"><span>Nombre y apellido *</span>' +
            '<input id="fNombre" type="text" autocomplete="name" value="' + esc(datos.nombre) + '" placeholder="Juana Pérez"></label>' +
          '<label class="cs-field"><span>WhatsApp *</span>' +
            '<input id="fTel" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(datos.telefono) + '" placeholder="221 682-4635"></label>' +
          '<label class="cs-field"><span>Email <i>(opcional)</i></span>' +
            '<input id="fMail" type="email" autocomplete="email" value="' + esc(datos.email) + '" placeholder="juana@correo.com"></label>' +
          (medios.length
            ? '<label class="cs-field"><span>Forma de pago</span><select id="fMedio">' + opciones + '</select></label>'
            : '') +
          '<label class="cs-field"><span>Dirección de envío o comentario <i>(opcional)</i></span>' +
            '<textarea id="fNota" rows="2" placeholder="Calle 12 e/ 50 y 51, La Plata — o retiro por el showroom">' + esc(datos.nota) + '</textarea></label>' +
          '<div class="cs-resume">' + resumenHTML() + '</div>' +
        '</div>' +
        '<footer class="cs-foot">' +
          '<button class="btn btn-ink btn-block" data-confirmar' + (enviando ? ' disabled' : '') + '>' +
            (enviando ? 'Enviando…' : 'Confirmar pedido') + '</button>' +
          '<p class="cart-note">Tus datos se usan solo para preparar este pedido.</p>' +
        '</footer>';
    }

    function listoHTML() {
      var ok = !!(resultado && resultado.ok);
      var texto = mensajeWA({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email,
        medio: datos.medio, nota: datos.nota, registrado: ok
      });
      var titulo, bajada;
      if (ok) {
        titulo = 'Pedido registrado';
        bajada = 'Ya quedó cargado a nombre de <b>' + esc(datos.nombre) +
                 '</b>. Mandanos el detalle por WhatsApp y te confirmamos talles y envío.';
      } else if (!conectado) {
        // Todavía sin panel CobrOS: el pedido se cierra por WhatsApp y punto.
        titulo = 'Tu pedido está listo';
        bajada = 'Mandanos el detalle por WhatsApp y te confirmamos talles, stock y envío.';
      } else {
        titulo = 'No pudimos registrarlo';
        bajada = esc(error || 'El sistema no respondió') +
                 '. Igual podés mandarnos el pedido por WhatsApp y lo cargamos nosotras.';
      }
      return '' +
        '<div class="cs-done">' +
          '<div class="cs-mark' + (ok || !conectado ? '' : ' is-warn') + '">' + (ok || !conectado ? '✓' : '!') + '</div>' +
          '<h3>' + titulo + '</h3><p>' + bajada + '</p>' +
          '<div class="cs-resume">' + resumenHTML() + '</div>' +
          (resultado && resultado.init_point
            ? '<a class="btn btn-ink btn-block" href="' + esc(resultado.init_point) + '" target="_blank" rel="noopener">Pagar online</a>'
            : '') +
          '<a class="btn btn-wa btn-block" href="' + linkWA(texto) + '" target="_blank" rel="noopener" data-enviado>' +
            'Enviar pedido por WhatsApp</a>' +
          '<button class="cs-later" data-cerrar>Seguir mirando</button>' +
        '</div>';
    }

    /* ── Envío ── */
    function confirmar() {
      if (enviando) return;
      datos.nombre = (panel.querySelector('#fNombre') || {}).value || '';
      datos.telefono = (panel.querySelector('#fTel') || {}).value || '';
      datos.email = (panel.querySelector('#fMail') || {}).value || '';
      datos.medio = (panel.querySelector('#fMedio') || {}).value || '';
      datos.nota = (panel.querySelector('#fNota') || {}).value || '';

      if (datos.nombre.trim().length < 3) { error = 'Escribí tu nombre y apellido'; pintarPanel(); return; }
      if (datos.telefono.replace(/\D/g, '').length < 6) { error = 'Necesitamos un WhatsApp para responderte'; pintarPanel(); return; }
      try { localStorage.setItem('maju_datos', JSON.stringify(datos)); } catch (e) {}

      // Sin cuenta CobrOS conectada no hay a dónde registrar: se pasa
      // directo a la confirmación con el mensaje de WhatsApp armado.
      if (!CFG.SLUG) { error = ''; resultado = null; irA('listo'); return; }

      enviando = true; error = ''; pintarPanel();
      crearPedido(datos).then(function (d) {
        enviando = false; resultado = d; irA('listo');
      }, function (e) {
        enviando = false; resultado = null;
        error = e && e.name === 'AbortError' ? 'El sistema tardó demasiado' : (e.message || 'Error de conexión');
        irA('listo');
      });
    }

    document.addEventListener('click', function (e) {
      var plus = e.target.closest('[data-plus]');
      if (plus) { setCant(plus.dataset.plus, cant(plus.dataset.plus) + 1); return; }
      var minus = e.target.closest('[data-minus]');
      if (minus) { setCant(minus.dataset.minus, cant(minus.dataset.minus) - 1); return; }
      if (e.target.closest('[data-volver]')) { error = ''; irA('pedido'); return; }
      if (e.target.closest('[data-confirmar]')) { confirmar(); return; }
      if (e.target.closest('[data-cerrar]')) { abrir(false); cerrarPedido(); return; }
      if (e.target.closest('[data-enviado]')) { setTimeout(function () { abrir(false); }, 300); }
    });

    var navCart = $('#navCart');
    if (navCart) navCart.addEventListener('click', function () { abrir(true); });
    var close = $('#cartClose');
    if (close) close.addEventListener('click', function () { abrir(false); });
    if (backdrop) backdrop.addEventListener('click', function () { abrir(false); });
    var next = $('#cartNext');
    if (next) next.addEventListener('click', function () {
      if (itemsCarrito().length) { error = ''; irA('datos'); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });

    oyentes.push(pintar);
    pintar();
    return { abrir: abrir, pintar: pintar };
  }

  /* ── Init: arranca con el catálogo de muestra y refresca con CobrOS ─ */
  function iniciar() {
    return cargar().then(function (prods) {
      if (prods && prods.length) { productos = prods; conectado = true; avisar(); }
      return productos;
    });
  }

  window.MJ = {
    CFG: CFG, PLANES: PLANES, CAT_NOMBRES: CAT_NOMBRES, WA: WA, base: BASE,
    productos: function () { return productos; },
    conectado: function () { return conectado; },
    buscar: buscar, producto: producto, clave: clave, idDe: idDe, talleDe: talleDe,
    money: money, slugCat: slugCat, sinAcentos: sinAcentos, esc: esc,
    nombrePlan: nombrePlan, porPlan: porPlan,
    cant: cant, cantProducto: cantProducto, agregar: agregar, setCant: setCant, vaciar: vaciar,
    precioCon: precioCon, mejorMedio: mejorMedio, mediosCatalogo: mediosCatalogo,
    itemsCarrito: itemsCarrito, totalItems: totalItems, totalPesos: totalPesos,
    totalesPorMedio: totalesPorMedio, totalConMedio: totalConMedio,
    crearPedido: crearPedido, mensajeWA: mensajeWA, linkWA: linkWA,
    alCambiar: function (fn) { oyentes.push(fn); },
    montarCarrito: montarCarrito,
    iniciar: iniciar
  };
})();
