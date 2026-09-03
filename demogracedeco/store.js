/* ══════════════════════════════════════════════════════════
   Grace Deco — núcleo compartido de catálogo y pedido
   Lo usan el home (script.js) y la página de catálogo (catalogo.js).
   Expone window.GD.

   Fuente de verdad: CobrOS (config.js → SLUG). Mientras no haya
   cuenta, o mientras el panel responde, se muestra el catálogo de
   muestra de acá abajo para que la web nunca quede vacía.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA = CFG.WA || '5491122334455';
  var AMBIENTES = CFG.AMBIENTES || [];

  /* ── Catálogo de muestra ─────────────────────────────────
     Precios y piezas de ejemplo: los reales salen del panel. */
  var FALLBACK = [
    { id:'FL-01', cat:'floreros',    nombre:'Florero de cerámica arenisca',      precio:38900, medida:'32 cm de alto',   material:'Cerámica esmaltada', amb:['living','comedor'],              img:'img/p-florero-ceramica.jpg', dest:true },
    { id:'FL-02', cat:'floreros',    nombre:'Vasija de gres tostado',            precio:46500, medida:'26 cm de alto',   material:'Gres',               amb:['living','entrada'],              img:'img/p-vasija-gres.jpg' },
    { id:'FL-03', cat:'floreros',    nombre:'Pampas seca en jarrón de vidrio',   precio:29900, medida:'70 cm con ramas', material:'Vidrio soplado',     amb:['living','entrada'],              img:'img/p-pampas.jpg' },
    { id:'FL-04', cat:'floreros',    nombre:'Ramo de flores secas naturales',    precio:21500, medida:'55 cm',           material:'Flor preservada',    amb:['comedor','dormitorio'],          img:'img/p-eucalipto.jpg' },

    { id:'ES-01', cat:'espejos',     nombre:'Espejo redondo marco de roble',     precio:112000, medida:'80 cm de diámetro', material:'Roble macizo',     amb:['entrada','living'],              img:'img/p-espejo-redondo.jpg', dest:true },
    { id:'ES-02', cat:'espejos',     nombre:'Espejo arco de pie',                precio:189000, medida:'160 x 60 cm',      material:'Metal y cristal',   amb:['dormitorio','living'],           img:'img/p-espejo-arco.jpg' },

    { id:'CU-01', cat:'cuadros',     nombre:'Set de 3 láminas enmarcadas',       precio:64900, medida:'40 x 50 cm c/u',   material:'Marco de madera',    amb:['living','dormitorio'],           img:'img/p-laminas-botanicas.jpg' },
    { id:'CU-02', cat:'cuadros',     nombre:'Cuadro abstracto sobre lino',       precio:87500, medida:'70 x 100 cm',      material:'Lino y bastidor',    amb:['living','comedor'],              img:'img/p-cuadro-abstracto.jpg', dest:true },

    { id:'TX-01', cat:'textiles',    nombre:'Almohadón de lino lavado',          precio:18900, medida:'45 x 45 cm',       material:'Lino lavado',        amb:['living','dormitorio'],           img:'img/p-almohadon-lino.jpg' },
    { id:'TX-02', cat:'textiles',    nombre:'Almohadón texturado bouclé',        precio:22400, medida:'50 x 50 cm',       material:'Bouclé',             amb:['living','dormitorio'],           img:'img/p-almohadon-boucle.jpg' },
    { id:'TX-03', cat:'textiles',    nombre:'Manta de algodón trenzado',         precio:44900, medida:'130 x 170 cm',     material:'Algodón',            amb:['living','dormitorio'],           img:'img/p-manta.jpg', dest:true },

    { id:'IL-01', cat:'iluminacion', nombre:'Lámpara de mesa de cerámica',       precio:76900, medida:'42 cm de alto',    material:'Cerámica y lino',    amb:['living','dormitorio'],           img:'img/p-lampara-mesa.jpg', dest:true },
    { id:'IL-02', cat:'iluminacion', nombre:'Colgante de ratán tejido',          precio:69500, medida:'45 cm de diámetro', material:'Ratán natural',     amb:['comedor','living'],              img:'img/p-lampara-ratan.jpg' },
    { id:'IL-03', cat:'iluminacion', nombre:'Lámpara de pie pantalla de lino',   precio:124000, medida:'155 cm de alto',  material:'Metal y lino',       amb:['living','dormitorio'],           img:'img/p-lampara-pie.jpg' },

    { id:'AL-01', cat:'alfombras',   nombre:'Alfombra de yute trenzado',         precio:158000, medida:'160 x 230 cm',    material:'Yute natural',       amb:['living','comedor'],              img:'img/p-alfombra-yute.jpg' },
    { id:'AL-02', cat:'alfombras',   nombre:'Alfombra beige de pelo corto',      precio:186000, medida:'200 x 290 cm',    material:'Polipropileno',      amb:['dormitorio','living'],           img:'img/p-alfombra-beige.jpg' },

    { id:'AR-01', cat:'aromas',      nombre:'Vela de soja aroma sándalo',        precio:14900, medida:'45 hs de encendido', material:'Cera de soja',     amb:['living','dormitorio','entrada'], img:'img/p-vela-soja.jpg' },
    { id:'AR-02', cat:'aromas',      nombre:'Difusor de varillas 200 ml',        precio:19500, medida:'200 ml',           material:'Esencia y ratán',    amb:['entrada','dormitorio'],          img:'img/p-difusor.jpg' },
    { id:'AR-03', cat:'aromas',      nombre:'Trío de portavelas de vidrio',      precio:16800, medida:'3 alturas',        material:'Vidrio ahumado',     amb:['comedor','living'],              img:'img/p-portavelas.jpg' },

    { id:'VE-01', cat:'verde',       nombre:'Planta artificial en maceta',       precio:58900, medida:'120 cm de alto',   material:'Follaje sintético',  amb:['living','entrada'],              img:'img/p-olivo.jpg' },

    { id:'OR-01', cat:'organizacion', nombre:'Bandeja de madera de paraíso',     precio:24900, medida:'40 x 28 cm',       material:'Madera de paraíso',  amb:['comedor','living','entrada'],    img:'img/p-bandeja.jpg' },
    { id:'OR-02', cat:'organizacion', nombre:'Canasto de fibra natural',         precio:31500, medida:'40 cm de alto',    material:'Fibra trenzada',     amb:['living','dormitorio'],           img:'img/p-canasto.jpg' }
  ];

  var CAT_NOMBRES = {
    floreros:'Floreros y vasijas', espejos:'Espejos', cuadros:'Cuadros y láminas',
    textiles:'Textiles', iluminacion:'Iluminación', alfombras:'Alfombras',
    aromas:'Velas y aromas', verde:'Plantas y follaje', organizacion:'Bandejas y organización'
  };

  // Formas de pago de muestra: con CobrOS conectado salen de cada producto.
  var MEDIOS_MUESTRA = [{ medio:'Transferencia', pct:10 }, { medio:'Efectivo', pct:15 }];

  // Prefijo para resolver las imágenes de muestra desde una subpágina.
  var BASE = /\/catalogo\/(index\.html)?$/.test(location.pathname) ? '../' : '';

  function imagen(src) {
    if (!src) return BASE + 'img/p-florero-ceramica.jpg';
    return /^https?:|^data:|^\//.test(src) ? src : BASE + src;
  }

  FALLBACK.forEach(function (p) {
    p.cod = p.id;
    p.catNom = CAT_NOMBRES[p.cat] || 'General';
    p.img = imagen(p.img);
    p.medios = MEDIOS_MUESTRA.slice();
    p.cuotas = p.precio >= 60000 ? 6 : (p.precio >= 30000 ? 3 : 0);
    p.specs = [p.medida, p.material].filter(Boolean);
  });

  var productos = FALLBACK.slice();
  var conectado = false;              // true cuando el catálogo vino de CobrOS
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('gd_cart') || '{}'); } catch (e) { carrito = {}; }
  var oyentes = [];

  function money(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
  function sinAcentos(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  // Las categorías del panel vienen con acento ("Iluminación"); los filtros
  // usan el slug sin acentos ni espacios ("iluminacion").
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

  /* ── Ambientes ───────────────────────────────────────────
     Del panel llegan como palabras sueltas en la descripción. */
  function ambienteDe(txt) {
    var t = sinAcentos(txt);
    for (var i = 0; i < AMBIENTES.length; i++) {
      var m = AMBIENTES[i].match || [];
      for (var j = 0; j < m.length; j++) { if (t === sinAcentos(m[j])) return AMBIENTES[i].id; }
    }
    return null;
  }
  function nombreAmbiente(id) {
    for (var i = 0; i < AMBIENTES.length; i++) { if (AMBIENTES[i].id === id) return AMBIENTES[i].nombre; }
    return '';
  }
  function porAmbiente(id) {
    return productos.filter(function (p) { return (p.amb || []).indexOf(id) >= 0; });
  }
  function porCategoria(cat) {
    return productos.filter(function (p) { return p.cat === cat; });
  }

  // "32 cm de alto", "160 x 230 cm", "200 ml", "45 hs de encendido"
  var RE_MEDIDA = /^\s*\d+([.,]\d+)?\s*(x\s*\d+([.,]\d+)?\s*)?(cm|mm|m|ml|hs|h)\b/i;

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
          var amb = [], medida = '', specs = [];
          partes.forEach(function (parte) {
            var a = ambienteDe(parte);
            if (a) { if (amb.indexOf(a) < 0) amb.push(a); return; }
            if (!medida && RE_MEDIDA.test(parte)) { medida = parte; return; }
            specs.push(parte);
          });
          var medios = normalizarMedios(p.mediosPago);
          return {
            id: p._id || p.id, cod: p.codigo || p._id || p.id,
            nombre: p.nombre || 'Producto',
            cat: slugCat(p.categoria), catNom: p.categoria || 'General',
            precio: Number(p.precio) || 0,
            medida: medida, material: specs[0] || '',
            specs: [medida].concat(specs).filter(Boolean),
            amb: amb, img: imagen(p.foto),
            stock: p.controlaStock ? Number(p.stock) || 0 : null,
            medios: medios, cuotas: Number(p.cuotasSinInteres) || 0,
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

  /* ── Carrito ─────────────────────────────────────────────── */
  function buscar(id) {
    for (var i = 0; i < productos.length; i++) { if (productos[i].id === id) return productos[i]; }
    return null;
  }
  function itemsCarrito() {
    return Object.keys(carrito).filter(function (k) { return !!buscar(k) && carrito[k] > 0; });
  }
  function totalItems() { return itemsCarrito().reduce(function (a, k) { return a + carrito[k]; }, 0); }
  function totalPesos() { return itemsCarrito().reduce(function (a, k) { return a + buscar(k).precio * carrito[k]; }, 0); }
  function guardar() { try { localStorage.setItem('gd_cart', JSON.stringify(carrito)); } catch (e) {} }
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
      return '• ' + p.nombre + (p.medida ? ' (' + p.medida + ')' : '') +
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
          '<strong>Tu pedido está vacío</strong>' +
          '<span>Sumá piezas del catálogo y las juntamos acá.</span></div>';
        if (foot) foot.innerHTML = '';
        return;
      }
      body.innerHTML = keys.map(function (k) {
        var p = buscar(k);
        return '<article class="cart-item">' +
          '<img src="' + esc(p.img) + '" alt="" loading="lazy">' +
          '<div class="cart-item-txt"><h4>' + esc(p.nombre) + '</h4>' +
          (p.medida ? '<span class="cart-item-med">' + esc(p.medida) + '</span>' : '') +
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
          '<label>WhatsApp<input name="telefono" required inputmode="tel" autocomplete="tel" placeholder="11 2233 4455"></label>' +
          '<label>Email <i>(opcional)</i><input name="email" type="email" autocomplete="email" placeholder="vos@mail.com"></label>' +
          '<label>Forma de pago<select name="medio">' + opciones + '</select></label>' +
          '<label>Nota <i>(opcional)</i><textarea name="nota" rows="2" placeholder="Zona de entrega, medidas del ambiente, lo que quieras."></textarea></label>' +
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
        texto = 'Ya quedó cargado en el sistema de Grace Deco. Mandanos el detalle por WhatsApp y coordinamos la entrega.';
      } else if (d.fallo) {
        titulo = 'No pudimos registrarlo';
        texto = 'El sistema no respondió' + (d.mensaje ? ' (' + d.mensaje + ')' : '') +
                '. Igual podés mandarnos el pedido por WhatsApp y lo cargamos nosotras.';
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
    window.GD.abrirCarrito = function () { abrir(true); };
  }

  window.GD = {
    cfg: CFG, money: money, esc: esc, sinAcentos: sinAcentos, slugCat: slugCat,
    catNombres: CAT_NOMBRES, ambientes: AMBIENTES,
    productos: function () { return productos; },
    conectado: function () { return conectado; },
    buscar: buscar, porAmbiente: porAmbiente, porCategoria: porCategoria,
    nombreAmbiente: nombreAmbiente, mejorMedio: mejorMedio, precioCon: precioCon,
    agregar: agregar, setCant: setCant, cant: cant, vaciar: vaciar,
    totalItems: totalItems, totalPesos: totalPesos, totalesPorMedio: totalesPorMedio,
    linkWA: linkWA, mensajeWA: mensajeWA, sincronizar: sincronizar,
    onCambio: function (fn) { oyentes.push(fn); },
    montarCarrito: montarCarrito, base: BASE
  };
})();
