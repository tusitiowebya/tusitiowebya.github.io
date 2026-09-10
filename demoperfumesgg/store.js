/* ══════════════════════════════════════════════════════════
   Perfumes GG — núcleo compartido de catálogo y pedido
   Lo usan el home (script.js) y la página de catálogo (catalogo.js).
   Expone window.GG.

   Fuente de verdad: CobrOS (config.js → SLUG). Mientras no haya
   cuenta, o mientras el panel responde, se muestra el catálogo de
   muestra de acá abajo para que la web nunca quede vacía.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA = CFG.WA || '5492235696084';
  var FAMILIAS = CFG.FAMILIAS || [];
  var MOMENTOS = CFG.MOMENTOS || [];

  /* ── Catálogo de muestra ─────────────────────────────────
     Nombres, notas y precios son de ejemplo, escritos para la demo:
     los reales salen del panel de CobrOS. */
  var FALLBACK = [
    { id:'CI-01', cat:'citricos',   nombre:'Bergamota Blanca',   precio:92500,  ml:'100 ml', gen:'unisex', notas:['Bergamota','Neroli','Cedro blanco'],      mom:['diario','verano'],            img:'img/p-bergamota.jpg', dest:true },
    { id:'CI-02', cat:'citricos',   nombre:'Verde Cítrico',      precio:86900,  ml:'100 ml', gen:'unisex', notas:['Lima','Albahaca','Vetiver'],              mom:['diario','verano'],            img:'img/p-citrico.jpg' },

    { id:'FL-01', cat:'florales',   nombre:'Bouquet de Jazmín',  precio:96500,  ml:'100 ml', gen:'ella',   notas:['Jazmín','Pera','Almizcle blanco'],        mom:['noche','regalo'],             img:'img/p-jazmin.jpg', dest:true },
    { id:'FL-02', cat:'florales',   nombre:'Rosa de Invierno',   precio:104000, ml:'90 ml',  gen:'ella',   notas:['Rosa turca','Lichi','Pachulí'],           mom:['noche','invierno'],           img:'img/p-rosa.jpg' },
    { id:'FL-03', cat:'florales',   nombre:'Peonía Suave',       precio:62900,  ml:'50 ml',  gen:'ella',   notas:['Peonía','Frambuesa','Cedro'],             mom:['diario','regalo'],            img:'img/p-peonia.jpg' },

    { id:'AM-01', cat:'amaderados', nombre:'Cedro Ahumado',      precio:118000, ml:'100 ml', gen:'el',     notas:['Cedro','Cardamomo','Cuero'],              mom:['noche','invierno'],           img:'img/p-cedro.jpg', dest:true },
    { id:'AM-02', cat:'amaderados', nombre:'Sándalo Nocturno',   precio:124500, ml:'100 ml', gen:'el',     notas:['Sándalo','Café','Haba tonka'],            mom:['noche','invierno'],           img:'img/p-sandalo.jpg' },
    { id:'AM-03', cat:'amaderados', nombre:'Vetiver Puro',       precio:109000, ml:'100 ml', gen:'unisex', notas:['Vetiver','Pomelo','Incienso'],            mom:['diario','noche'],             img:'img/p-vetiver.jpg' },

    { id:'DU-01', cat:'dulces',     nombre:'Caramelo Salado',    precio:98900,  ml:'90 ml',  gen:'ella',   notas:['Caramelo','Sal marina','Vainilla'],       mom:['noche','invierno','regalo'],  img:'img/p-caramelo.jpg' },
    { id:'DU-02', cat:'dulces',     nombre:'Vainilla Praliné',   precio:112000, ml:'100 ml', gen:'ella',   notas:['Vainilla bourbon','Almendra','Ámbar'],    mom:['invierno','regalo'],          img:'img/p-vainilla.jpg', dest:true },
    { id:'DU-03', cat:'dulces',     nombre:'Frutos Rojos',       precio:58900,  ml:'60 ml',  gen:'ella',   notas:['Frutilla','Grosella','Almizcle'],         mom:['diario','verano'],            img:'img/p-frutos.jpg' },

    { id:'OR-01', cat:'orientales', nombre:'Ámbar de Oriente',   precio:132000, ml:'100 ml', gen:'unisex', notas:['Ámbar','Incienso','Mirra'],               mom:['noche','invierno'],           img:'img/p-ambar.jpg' },
    { id:'OR-02', cat:'orientales', nombre:'Oud Dorado',         precio:148000, ml:'50 ml',  gen:'unisex', notas:['Oud','Azafrán','Rosa'],                   mom:['noche','regalo'],             img:'img/p-oud.jpg', dest:true },

    { id:'FR-01', cat:'frescos',    nombre:'Brisa Acuática',     precio:89900,  ml:'100 ml', gen:'el',     notas:['Notas marinas','Menta','Ámbar gris'],     mom:['diario','verano'],            img:'img/p-acuatica.jpg' },
    { id:'FR-02', cat:'frescos',    nombre:'Algodón y Almizcle', precio:84500,  ml:'100 ml', gen:'unisex', notas:['Almizcle blanco','Lavanda','Musgo'],      mom:['diario','regalo'],            img:'img/p-almizcle.jpg' },
    { id:'FR-03', cat:'frescos',    nombre:'Sal y Vetiver',      precio:94000,  ml:'90 ml',  gen:'el',     notas:['Sal marina','Vetiver','Bergamota'],       mom:['verano','diario'],            img:'img/p-marina.jpg' },

    { id:'SE-01', cat:'sets',       nombre:'Set descubrimiento', precio:38900,  ml:'5 × 5 ml', gen:'unisex', notas:['Elegís vos las cinco','Ideal para probar','Va con caja'], mom:['regalo','diario'], img:'img/p-estuche.jpg', dest:true }
  ];

  var CAT_NOMBRES = {
    citricos:'Cítricos', florales:'Florales', amaderados:'Amaderados',
    dulces:'Dulces', orientales:'Orientales', frescos:'Frescos',
    sets:'Sets y decants'
  };
  var GEN_NOMBRES = { ella:'Para ella', el:'Para él', unisex:'Unisex' };

  // Formas de pago de muestra: con CobrOS conectado salen de cada producto.
  var MEDIOS_MUESTRA = [{ medio:'Transferencia', pct:10 }, { medio:'Efectivo', pct:15 }];

  // Prefijo para resolver las imágenes de muestra desde una subpágina.
  var BASE = /\/catalogo\/(index\.html)?$/.test(location.pathname) ? '../' : '';

  function imagen(src) {
    if (!src) return BASE + 'img/p-bergamota.jpg';
    return /^https?:|^data:|^\//.test(src) ? src : BASE + src;
  }

  FALLBACK.forEach(function (p) {
    p.cod = p.id;
    p.catNom = CAT_NOMBRES[p.cat] || 'General';
    p.genNom = GEN_NOMBRES[p.gen] || '';
    p.img = imagen(p.img);
    p.medios = MEDIOS_MUESTRA.slice();
    p.cuotas = p.precio >= 90000 ? 6 : (p.precio >= 50000 ? 3 : 0);
    p.specs = [p.ml, p.genNom].filter(Boolean);
  });

  var productos = FALLBACK.slice();
  var conectado = false;              // true cuando el catálogo vino de CobrOS
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('gg_cart') || '{}'); } catch (e) { carrito = {}; }
  var oyentes = [];

  function money(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
  function sinAcentos(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  // Las categorías del panel vienen con acento ("Cítricos"); los filtros
  // usan el slug sin acentos ni espacios ("citricos").
  function slugCat(s) { return sinAcentos(s).replace(/[^a-z0-9]+/g, ''); }

  /* ── Formas de pago ──────────────────────────────────────
     El panel guarda mediosPago: [{ medio, descuentoPct }]. */
  function normalizarMedios(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(function (m) {
      return { medio: String((m && m.medio) || '').trim(), pct: Number((m && m.descuentoPct) || 0) };
    }).filter(function (m) { return !!m.medio; });
  }
  function precioCon(precio, pct) {
    return Math.round((precio || 0) * (1 - (pct || 0) / 100) * 100) / 100;
  }
  function mejorMedio(p) {
    var conDto = (p.medios || []).filter(function (m) { return m.pct > 0; });
    if (!conDto.length) return null;
    var best = conDto.reduce(function (a, b) { return b.pct > a.pct ? b : a; });
    return { medio: best.medio, pct: best.pct, precioFinal: precioCon(p.precio, best.pct) };
  }

  /* ── Familias, géneros y momentos ────────────────────────
     Del panel llegan como palabras sueltas en la descripción. */
  function familiaDe(cat) {
    var c = slugCat(cat);
    for (var i = 0; i < FAMILIAS.length; i++) {
      var m = FAMILIAS[i].match || [];
      if (slugCat(FAMILIAS[i].id) === c) return FAMILIAS[i].id;
      for (var j = 0; j < m.length; j++) { if (slugCat(m[j]) === c) return FAMILIAS[i].id; }
    }
    return c;
  }
  function nombreFamilia(id) {
    for (var i = 0; i < FAMILIAS.length; i++) { if (FAMILIAS[i].id === id) return FAMILIAS[i].nombre; }
    return CAT_NOMBRES[id] || 'Otros';
  }
  function generoDe(txt) {
    var t = sinAcentos(txt);
    if (t === 'para ella' || t === 'ella' || t === 'femenino' || t === 'mujer') return 'ella';
    if (t === 'para el' || t === 'el' || t === 'masculino' || t === 'hombre') return 'el';
    if (t === 'unisex' || t === 'para todos') return 'unisex';
    return null;
  }
  function momentoDe(txt) {
    var t = sinAcentos(txt);
    for (var i = 0; i < MOMENTOS.length; i++) {
      var m = MOMENTOS[i].match || [];
      for (var j = 0; j < m.length; j++) { if (t === sinAcentos(m[j])) return MOMENTOS[i].id; }
    }
    return null;
  }
  function nombreMomento(id) {
    for (var i = 0; i < MOMENTOS.length; i++) { if (MOMENTOS[i].id === id) return MOMENTOS[i].nombre; }
    return '';
  }
  function porMomento(id) {
    return productos.filter(function (p) { return (p.mom || []).indexOf(id) >= 0; });
  }
  function porCategoria(cat) {
    return productos.filter(function (p) { return p.cat === cat; });
  }
  function destacados(n) {
    n = n || 8;
    var d = productos.filter(function (p) { return p.dest; });
    // Si no alcanzan los destacados, se completa con el resto para que la
    // grilla no quede con una fila coja.
    productos.forEach(function (p) { if (d.length < n && d.indexOf(p) < 0) d.push(p); });
    return d.slice(0, n);
  }

  // "100 ml", "90ml", "5 × 5 ml"
  var RE_ML = /(\d+\s*[×x]\s*)?\d+([.,]\d+)?\s*ml\b/i;

  /* ── Catálogo real desde CobrOS ──────────────────────────
     Timeout duro: si el panel no contesta, se queda el de muestra. */
  function cargar() {
    if (!CFG.SLUG) return Promise.resolve(null);
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_MS || 8000);
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(t);
        if (!d || !Array.isArray(d.productos)) return null;
        return d.productos.map(function (p) {
          var partes = (p.descripcion || '').split('·').map(function (s) { return s.trim(); }).filter(Boolean);
          var mom = [], ml = '', gen = '', notas = [];
          partes.forEach(function (parte) {
            var g = generoDe(parte);
            if (g && !gen) { gen = g; return; }
            var m = momentoDe(parte);
            if (m) { if (mom.indexOf(m) < 0) mom.push(m); return; }
            if (!ml && RE_ML.test(parte)) { ml = parte; return; }
            // Las notas pueden venir juntas: "Jazmín, pera, almizcle"
            parte.split(',').forEach(function (n) { n = n.trim(); if (n) notas.push(n); });
          });
          var cat = familiaDe(p.categoria);
          return {
            id: p._id || p.id, cod: p.codigo || p._id || p.id,
            nombre: p.nombre || 'Perfume',
            cat: cat, catNom: nombreFamilia(cat),
            precio: Number(p.precio) || 0,
            ml: ml, gen: gen || 'unisex', genNom: GEN_NOMBRES[gen || 'unisex'],
            notas: notas,
            specs: [ml, GEN_NOMBRES[gen || 'unisex']].filter(Boolean),
            mom: mom, img: imagen(p.foto),
            stock: p.controlaStock ? Number(p.stock) || 0 : null,
            medios: normalizarMedios(p.mediosPago),
            cuotas: Number(p.cuotasSinInteres) || 0,
            dest: !!p.destacado
          };
        }).filter(function (p) { return p.nombre && p.precio >= 0; });
      })
      .catch(function () { clearTimeout(t); return null; });
  }

  function sincronizar() {
    return cargar().then(function (lista) {
      if (lista && lista.length) { productos = lista; conectado = true; avisar(); }
      return { conectado: conectado, vacio: !!(lista && !lista.length) };
    });
  }

  /* ── Pedido ──────────────────────────────────────────────── */
  function buscar(id) {
    for (var i = 0; i < productos.length; i++) { if (productos[i].id === id) return productos[i]; }
    return null;
  }
  function itemsCarrito() {
    return Object.keys(carrito).filter(function (k) { return !!buscar(k) && carrito[k] > 0; });
  }
  function totalItems() { return itemsCarrito().reduce(function (a, k) { return a + carrito[k]; }, 0); }
  function totalPesos() { return itemsCarrito().reduce(function (a, k) { return a + buscar(k).precio * carrito[k]; }, 0); }
  function guardar() { try { localStorage.setItem('gg_cart', JSON.stringify(carrito)); } catch (e) {} }
  function setCant(id, n) {
    if (n <= 0) delete carrito[id]; else carrito[id] = n;
    guardar(); avisar();
  }
  function agregar(id, n) { setCant(id, (carrito[id] || 0) + (n || 1)); }
  function cant(id) { return carrito[id] || 0; }
  function vaciar() { carrito = {}; guardar(); avisar(); }

  function totalesPorMedio() {
    var total = totalPesos(), vistos = {}, orden = [];
    itemsCarrito().forEach(function (k) {
      (buscar(k).medios || []).forEach(function (m) {
        if (m.pct > 0 && !vistos[m.medio]) { vistos[m.medio] = 1; orden.push(m.medio); }
      });
    });
    return orden.map(function (medio) { return { medio: medio, total: totalConMedio(medio) }; })
      .filter(function (t) { return t.total < total - 0.01; })
      .sort(function (a, b) { return a.total - b.total; });
  }
  function totalConMedio(medio) {
    return itemsCarrito().reduce(function (a, k) {
      var p = buscar(k);
      var m = (p.medios || []).filter(function (x) { return x.medio === medio; })[0];
      return a + precioCon(p.precio, m ? m.pct : 0) * carrito[k];
    }, 0);
  }

  /* ── WhatsApp + pedido en CobrOS ─────────────────────────── */
  function mensajeWA(datos) {
    var lineas = itemsCarrito().map(function (k) {
      var p = buscar(k);
      return '• ' + p.nombre + (p.ml ? ' (' + p.ml + ')' : '') +
             ' x' + carrito[k] + ' — ' + money(p.precio * carrito[k]);
    }).join('\n');
    var base = (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
               '\n\nTotal: ' + money(totalPesos());
    if (!datos) {
      var alt = totalesPorMedio().map(function (t) { return t.medio + ': ' + money(t.total); }).join(' · ');
      return base + (alt ? '\n(' + alt + ')' : '');
    }
    return base +
      (datos.medio ? '\nForma de pago: ' + datos.medio + ' — ' + money(totalConMedio(datos.medio)) : '') +
      '\n\nNombre: ' + (datos.nombre || '') +
      '\nTeléfono: ' + (datos.telefono || '') +
      (datos.nota ? '\nNota: ' + datos.nota : '') +
      (conectado ? '\n\n(El pedido ya quedó cargado en su sistema)' : '');
  }
  function linkWA(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto || (CFG.WA_TEXTO || 'Hola!'));
  }

  function crearPedido(datos) {
    if (!CFG.SLUG) return Promise.resolve(null);   // sin panel: se cierra por WhatsApp
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_PEDIDO_MS || 15000);
    var items = itemsCarrito().map(function (k) { return { productoId: k, cantidad: carrito[k] }; });
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/pedido', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
      body: JSON.stringify({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email || '',
        nota: [datos.medio ? 'Forma de pago: ' + datos.medio : '', datos.nota || ''].filter(Boolean).join(' — '),
        items: items
      })
    }).then(function (r) {
      clearTimeout(t);
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || 'No se pudo registrar el pedido');
        return d;
      });
    }, function (e) { clearTimeout(t); throw e; });
  }

  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) {} }); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── Cajón de pedido (compartido por las dos páginas) ─────
     Tres pasos: (1) el pedido, (2) los datos, (3) confirmación. */
  function montarCarrito() {
    var $ = function (s) { return document.querySelector(s); };
    var drawer = $('#cart'), body = $('#cartBody'), foot = $('#cartFoot'),
        panel = $('#cartPanel'), scrim = $('#cartScrim');

    var paso = 'pedido', enviando = false, resultado = null, error = '';

    function abrir(open) {
      if (!drawer) return;
      drawer.classList.toggle('open', open);
      if (scrim) scrim.classList.toggle('on', open);
      document.body.classList.toggle('no-scroll', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) pintarPanel();
    }
    function cerrarPedido() {
      paso = 'pedido'; resultado = null; error = '';
      vaciar(); abrir(false); pintarPanel();
    }
    function irA(p) { paso = p; pintarPanel(); }

    /* Paso 1 — el pedido */
    function pintar() {
      var keys = itemsCarrito();
      var n = totalItems();
      Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
        el.textContent = n; el.classList.toggle('on', n > 0);
      });
      if (!body) return;
      if (!keys.length) {
        body.innerHTML = '<div class="cart-empty"><span class="cart-empty-mark" aria-hidden="true"></span>' +
          '<strong>Todavía no elegiste nada</strong>' +
          '<span>Sumá frascos del catálogo y los juntamos acá.</span></div>';
        if (foot) foot.innerHTML = '';
        return;
      }
      body.innerHTML = keys.map(function (k) {
        var p = buscar(k);
        return '<article class="cart-item">' +
          '<img src="' + esc(p.img) + '" alt="" loading="lazy">' +
          '<div class="cart-item-txt"><h4>' + esc(p.nombre) + '</h4>' +
          (p.ml ? '<span class="cart-item-med">' + esc(p.ml) + '</span>' : '') +
          '<span class="cart-item-precio">' + money(p.precio) + '</span></div>' +
          '<div class="qty"><button data-menos="' + esc(k) + '" aria-label="Quitar uno">−</button>' +
          '<span>' + carrito[k] + '</span>' +
          '<button data-mas="' + esc(k) + '" aria-label="Sumar uno">+</button></div>' +
          '</article>';
      }).join('');
      if (foot) foot.innerHTML = resumenHTML() +
        '<button class="btn btn-dark btn-block" data-ir="datos">Confirmar pedido</button>' +
        '<button class="cart-clear" data-vaciar>Vaciar</button>';
    }
    function resumenHTML() {
      var alt = totalesPorMedio().map(function (t) {
        return '<li><span>' + esc(t.medio) + '</span><b>' + money(t.total) + '</b></li>';
      }).join('');
      return '<div class="cart-total"><span>Total</span><b>' + money(totalPesos()) + '</b></div>' +
             (alt ? '<ul class="cart-alt">' + alt + '</ul>' : '');
    }

    function pintarPanel() {
      if (paso === 'pedido') { if (panel) { panel.hidden = true; panel.innerHTML = ''; } pintar(); return; }
      if (!panel) return;
      panel.hidden = false;
      panel.innerHTML = paso === 'datos' ? formHTML() : listoHTML();
      var f = panel.querySelector('form');
      if (f) f.addEventListener('submit', enviar);
    }

    /* Paso 2 — los datos */
    function formHTML() {
      var vistos = {}, medios = [];
      itemsCarrito().forEach(function (k) {
        (buscar(k).medios || []).forEach(function (m) {
          if (!vistos[m.medio]) { vistos[m.medio] = 1; medios.push(m); }
        });
      });
      var opciones = ['<option value="">A convenir</option>'].concat(medios.map(function (m) {
        return '<option value="' + esc(m.medio) + '">' + esc(m.medio) +
               (m.pct > 0 ? ' (−' + m.pct + '%)' : '') + '</option>';
      })).join('');
      return '<div class="cart-step">' +
        '<button class="cs-back" data-volver aria-label="Volver al pedido">←</button>' +
        '<h3>Tus datos</h3>' +
        '<p class="cs-sub">Te escribimos por WhatsApp para coordinar entrega y pago.</p>' +
        '<form novalidate>' +
          '<label>Nombre y apellido<input name="nombre" required autocomplete="name" placeholder="Tu nombre"></label>' +
          '<label>WhatsApp<input name="telefono" required inputmode="tel" autocomplete="tel" placeholder="223 456 7890"></label>' +
          '<label>Email <i>(opcional)</i><input name="email" type="email" autocomplete="email" placeholder="vos@mail.com"></label>' +
          '<label>Forma de pago<select name="medio">' + opciones + '</select></label>' +
          '<label>Nota <i>(opcional)</i><textarea name="nota" rows="2" placeholder="Barrio para el envío, si es para regalo, lo que quieras."></textarea></label>' +
          (error ? '<p class="cs-error">' + esc(error) + '</p>' : '') +
          '<div class="cart-total"><span>Total</span><b>' + money(totalPesos()) + '</b></div>' +
          '<button class="btn btn-dark btn-block" type="submit"' + (enviando ? ' disabled' : '') + '>' +
            (enviando ? 'Enviando…' : 'Enviar pedido') + '</button>' +
          '<p class="cart-note">Tus datos se usan solo para preparar este pedido.</p>' +
        '</form></div>';
    }

    /* Paso 3 — confirmación */
    function listoHTML() {
      var d = resultado || {}, datos = d.datos || {};
      var titulo, texto;
      if (d.ok && conectado) {
        titulo = 'Pedido registrado';
        texto = 'Ya quedó cargado en el sistema de Perfumes GG. Mandanos el detalle por WhatsApp y coordinamos la entrega.';
      } else if (d.fallo) {
        titulo = 'No pudimos registrarlo';
        texto = 'El sistema no respondió' + (d.mensaje ? ' (' + d.mensaje + ')' : '') +
                '. Igual podés mandarnos el pedido por WhatsApp y lo cargamos nosotros.';
      } else {
        titulo = 'Tu pedido está listo';
        texto = 'Mandanos el detalle por WhatsApp y te confirmamos stock, envío y forma de pago.';
      }
      return '<div class="cart-step cart-ok">' +
        '<span class="ok-mark" aria-hidden="true">✓</span>' +
        '<h3>' + titulo + '</h3><p class="cs-sub">' + texto + '</p>' +
        '<a class="btn btn-wa btn-block" href="' + esc(linkWA(mensajeWA(datos))) + '" target="_blank" rel="noopener">' +
        'Enviar por WhatsApp</a>' +
        (d.pago ? '<a class="btn btn-line btn-block" href="' + esc(d.pago) + '" target="_blank" rel="noopener">Pagar online</a>' : '') +
        '<button class="cart-clear" data-cerrar-ok>Cerrar</button></div>';
    }

    function enviar(e) {
      e.preventDefault();
      if (enviando) return;
      var f = e.target, datos = {
        nombre: (f.nombre.value || '').trim(), telefono: (f.telefono.value || '').trim(),
        email: (f.email.value || '').trim(), medio: f.medio.value, nota: (f.nota.value || '').trim()
      };
      if (!datos.nombre || datos.telefono.replace(/\D/g, '').length < 8) {
        error = 'Necesitamos tu nombre y un WhatsApp válido.'; pintarPanel(); return;
      }
      error = ''; enviando = true; pintarPanel();
      crearPedido(datos).then(function (d) {
        resultado = { ok: true, datos: datos, pago: d && (d.init_point || d.pago) };
      }).catch(function (err) {
        resultado = { fallo: true, datos: datos, mensaje: err && err.message };
      }).then(function () {
        enviando = false; irA('listo');
      });
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cart-open],[data-cart-close],[data-mas],[data-menos],[data-vaciar],[data-ir],[data-volver],[data-cerrar-ok]');
      if (!t) return;
      if (t.hasAttribute('data-cart-open')) { e.preventDefault(); abrir(true); }
      else if (t.hasAttribute('data-cart-close')) { abrir(false); }
      else if (t.hasAttribute('data-mas')) { agregar(t.getAttribute('data-mas'), 1); }
      else if (t.hasAttribute('data-menos')) { var k = t.getAttribute('data-menos'); setCant(k, cant(k) - 1); }
      else if (t.hasAttribute('data-vaciar')) { vaciar(); }
      else if (t.hasAttribute('data-ir')) { irA(t.getAttribute('data-ir')); }
      else if (t.hasAttribute('data-volver')) { irA('pedido'); }
      else if (t.hasAttribute('data-cerrar-ok')) { cerrarPedido(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) abrir(false);
    });

    oyentes.push(function () { if (paso === 'pedido') pintar(); });
    pintar();
    window.GG.abrirCarrito = function () { abrir(true); };
  }

  window.GG = {
    cfg: CFG, money: money, esc: esc, sinAcentos: sinAcentos, slugCat: slugCat,
    catNombres: CAT_NOMBRES, genNombres: GEN_NOMBRES,
    familias: FAMILIAS, momentos: MOMENTOS,
    productos: function () { return productos; },
    conectado: function () { return conectado; },
    buscar: buscar, porMomento: porMomento, porCategoria: porCategoria,
    destacados: destacados,
    nombreFamilia: nombreFamilia, nombreMomento: nombreMomento,
    mejorMedio: mejorMedio, precioCon: precioCon,
    agregar: agregar, setCant: setCant, cant: cant, vaciar: vaciar,
    totalItems: totalItems, totalPesos: totalPesos, totalesPorMedio: totalesPorMedio,
    linkWA: linkWA, mensajeWA: mensajeWA, sincronizar: sincronizar,
    onCambio: function (fn) { oyentes.push(fn); },
    montarCarrito: montarCarrito, base: BASE
  };
})();
