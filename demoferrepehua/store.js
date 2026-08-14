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

  // Total pagando con un medio puntual (los ítems que no lo aceptan van a lista).
  function totalConMedio(medio) {
    return itemsCarrito().reduce(function (a, k) {
      var p = buscar(k);
      var m = (p.medios || []).filter(function (x) { return x.medio === medio; })[0];
      return a + precioCon(p.precio, m ? m.pct : 0) * carrito[k];
    }, 0);
  }

  // `datos` es opcional: sin él arma la consulta suelta; con él, el mensaje del
  // pedido ya confirmado (se manda después del checkout).
  function mensajeWA(datos) {
    var lineas = itemsCarrito().map(function (k) {
      var p = buscar(k);
      return '• ' + carrito[k] + 'x ' + p.nombre + (p.cod ? ' (' + p.cod + ')' : '') +
             ' — ' + money(p.precio * carrito[k]);
    }).join('\n');

    if (!datos) {
      var alt = totalesPorMedio().map(function (t) {
        return '\nPagando con ' + t.medio + ': ' + money(t.total);
      }).join('');
      return (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
             '\n\nTotal estimado: ' + money(totalPesos()) + alt +
             '\n\n¿Me confirmás stock y forma de envío?';
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

  /* ── Pedido en CobrOS ────────────────────────────────────
     Crea la orden en el panel del negocio (queda como cargo pendiente del
     cliente en /admin/ordenes y descuenta stock). El precio lo pone el
     servidor con el catálogo real, no la web.                              */
  function crearPedido(datos) {
    if (!CFG.SLUG) return Promise.reject(new Error('Catálogo no conectado'));
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_PEDIDO_MS || 15000);
    var nota = [datos.medio ? 'Forma de pago: ' + datos.medio : '', datos.nota || '']
      .filter(Boolean).join(' — ');
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email, nota: nota,
        items: itemsCarrito().map(function (k) { return { productoId: k, cantidad: carrito[k] }; })
      })
    }).then(function (r) {
      clearTimeout(t);
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || 'No se pudo registrar el pedido');
        return d;
      });
    }, function (e) { clearTimeout(t); throw e; });
  }
  function linkWA(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }

  function avisar() { oyentes.forEach(function (fn) { fn(); }); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Cajón de pedido (compartido por las dos páginas) ────
     Tres pasos: (1) el pedido, (2) los datos del cliente, (3) confirmación.
     El pedido se registra en CobrOS y recién ahí aparece el botón de
     WhatsApp, con el detalle y los datos ya cargados.                      */
  function montarCarrito() {
    var $ = function (s) { return document.querySelector(s); };
    var cart = $('#cart'), backdrop = $('#cartBackdrop'), body = $('#cartBody');
    if (!cart || !body) return;

    var paso = 'pedido';
    var datos = { nombre: '', telefono: '', email: '', medio: '', nota: '' };
    var enviando = false, error = '', resultado = null;

    // Los datos del comprador se recuerdan para no volver a tipearlos.
    try { datos = Object.assign(datos, JSON.parse(localStorage.getItem('fp_datos') || '{}')); } catch (e) {}

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

    // Al cerrar la confirmación el carrito se vacía: el pedido ya está hecho y
    // dejarlo cargado haría que el próximo se duplique.
    function cerrarPedido() {
      paso = 'pedido'; resultado = null; error = '';
      vaciar();
      pintarPanel();
    }

    // No limpia `error`: el paso "listo" lo necesita para contar por qué falló.
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
        body.innerHTML = '<div class="cart-empty"><p>Todavía no agregaste nada.</p>' +
          '<span>Sumá productos del catálogo y armamos el pedido acá.</span></div>';
        return;
      }
      body.innerHTML = keys.map(function (k) {
        var p = buscar(k);
        return '<div class="cart-item">' +
          '<img src="' + esc(p.img) + '" alt="" width="80" height="60" loading="lazy">' +
          '<div class="ci-txt">' + (p.cod ? '<code>' + esc(p.cod) + '</code>' : '') +
          '<h4>' + esc(p.nombre) + '</h4><b>' + money(p.precio * carrito[k]) + '</b></div>' +
          '<div class="ci-qty">' +
            '<button data-minus="' + esc(k) + '" aria-label="Quitar uno">−</button>' +
            '<span>' + carrito[k] + '</span>' +
            '<button data-plus="' + esc(k) + '" aria-label="Agregar uno">+</button>' +
          '</div></div>';
      }).join('');
    }

    // Subtotal + una línea por forma de pago con descuento.
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
        (buscar(k).medios || []).forEach(function (m) {
          if (medios.indexOf(m.medio) < 0) medios.push(m.medio);
        });
      });
      var opciones = ['<option value="">A convenir</option>'].concat(medios.map(function (m) {
        var t = totalConMedio(m);
        return '<option value="' + esc(m) + '"' + (datos.medio === m ? ' selected' : '') + '>' +
               esc(m) + ' — ' + money(t) + '</option>';
      })).join('');

      return '' +
        '<header class="cs-head">' +
          '<button class="cs-back" data-volver aria-label="Volver al pedido">←</button>' +
          '<div><h3>Tus datos</h3><p>Confirmamos stock, envío y pago por WhatsApp.</p></div>' +
        '</header>' +
        '<div class="cs-body">' +
          (error ? '<p class="cs-error">' + esc(error) + '</p>' : '') +
          '<label class="cs-field"><span>Nombre y apellido *</span>' +
            '<input id="fNombre" type="text" autocomplete="name" value="' + esc(datos.nombre) + '" placeholder="Juan Pérez"></label>' +
          '<label class="cs-field"><span>WhatsApp / teléfono *</span>' +
            '<input id="fTel" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(datos.telefono) + '" placeholder="2396 55-1234"></label>' +
          '<label class="cs-field"><span>Email <i>(opcional)</i></span>' +
            '<input id="fMail" type="email" autocomplete="email" value="' + esc(datos.email) + '" placeholder="juan@correo.com"></label>' +
          (medios.length
            ? '<label class="cs-field"><span>Forma de pago</span><select id="fMedio">' + opciones + '</select></label>'
            : '') +
          '<label class="cs-field"><span>Dirección de entrega o comentario <i>(opcional)</i></span>' +
            '<textarea id="fNota" rows="2" placeholder="Calle 123, Pehuajó — o retiro en el local">' + esc(datos.nota) + '</textarea></label>' +
          '<div class="cs-resume">' + resumenHTML() + '</div>' +
        '</div>' +
        '<footer class="cs-foot">' +
          '<button class="btn btn-amber btn-block" data-confirmar' + (enviando ? ' disabled' : '') + '>' +
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
      return '' +
        '<div class="cs-done">' +
          '<div class="cs-mark' + (ok ? '' : ' is-warn') + '">' + (ok ? '✓' : '!') + '</div>' +
          (ok
            ? '<h3>Pedido registrado</h3><p>Ya quedó cargado a nombre de <b>' + esc(datos.nombre) +
              '</b>. Mandanos el detalle por WhatsApp y te confirmamos stock y envío.</p>'
            : '<h3>No pudimos registrarlo</h3><p>' + esc(error || 'El sistema no respondió') +
              '. Igual podés mandarnos el pedido por WhatsApp y lo cargamos nosotros.</p>') +
          '<div class="cs-resume">' + resumenHTML() + '</div>' +
          (resultado && resultado.init_point
            ? '<a class="btn btn-dark btn-block" href="' + esc(resultado.init_point) + '" target="_blank" rel="noopener">Pagar online</a>'
            : '') +
          '<a class="btn btn-wa btn-block" href="' + linkWA(texto) + '" target="_blank" rel="noopener" data-enviado>' +
            'Enviar pedido por WhatsApp</a>' +
          '<button class="cs-later" data-cerrar>Seguir comprando</button>' +
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
      if (datos.telefono.replace(/\D/g, '').length < 6) { error = 'Necesitamos un teléfono para responderte'; pintarPanel(); return; }
      try { localStorage.setItem('fp_datos', JSON.stringify(datos)); } catch (e) {}

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
      if (plus) { agregar(plus.dataset.plus, 1); return; }
      var minus = e.target.closest('[data-minus]');
      if (minus) { setCant(minus.dataset.minus, cant(minus.dataset.minus) - 1); return; }
      if (e.target.closest('[data-volver]')) { error = ''; irA('pedido'); return; }
      if (e.target.closest('[data-confirmar]')) { confirmar(); return; }
      if (e.target.closest('[data-cerrar]')) { abrir(false); cerrarPedido(); return; }
      // El link de WhatsApp abre en otra pestaña; el cajón se cierra atrás.
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
    totalesPorMedio: totalesPorMedio, totalConMedio: totalConMedio, crearPedido: crearPedido,
    mensajeWA: mensajeWA, linkWA: linkWA,
    alCambiar: function (fn) { oyentes.push(fn); },
    montarCarrito: montarCarrito,
    iniciar: iniciar
  };
})();
