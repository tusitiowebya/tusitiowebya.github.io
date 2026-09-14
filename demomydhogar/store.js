/* ══════════════════════════════════════════════════════════
   MyD HOGAR — núcleo compartido de catálogo y pedido (window.MYD)
   Lo usan el home (script.js) y el catálogo (catalogo.js).

   Fuente de verdad: CobrOS (config.js → SLUG "myd-hogar").
   1) Arranca al instante con catalogo-snapshot.js (datos reales).
   2) Pide el catálogo en vivo a /catalogo/:slug/web y lo reemplaza.
   3) Los pedidos se registran en CobrOS y siguen por WhatsApp.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var RUBROS = CFG.RUBROS || [];
  var DEF = CFG.RUBRO_DEFAULT || { id: 'varios', nombre: 'Hogar y varios', sala: 'living' };
  var BASE = /\/catalogo\/(index\.html)?$/.test(location.pathname) ? '../' : '';

  function money(n) { return '$' + Math.round(n || 0).toLocaleString('es-AR'); }
  function sinAcentos(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function palabras(s) { return ' ' + sinAcentos(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' '; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── Rubro por nombre ─────────────────────────────────────── */
  function tiene(txt, k) {
    return txt.indexOf(' ' + k + ' ') >= 0 || txt.indexOf(' ' + k + 's ') >= 0 || txt.indexOf(' ' + k + 'es ') >= 0;
  }
  function rubroDe(nombre, categoria) {
    var n = palabras(nombre), i, j;
    for (i = 0; i < RUBROS.length; i++) {
      var r = RUBROS[i];
      if ((r.excluir || []).some(function (k) { return tiene(n, k); })) continue;
      for (j = 0; j < r.match.length; j++) if (tiene(n, r.match[j])) return r;
    }
    var c = palabras(categoria).trim();
    for (i = 0; i < RUBROS.length; i++) if ((RUBROS[i].cats || []).indexOf(c) >= 0) return RUBROS[i];
    return DEF;
  }
  function rubroPorId(id) {
    for (var i = 0; i < RUBROS.length; i++) if (RUBROS[i].id === id) return RUBROS[i];
    return id === DEF.id ? DEF : null;
  }

  /* ── Nombres del panel: muchos vienen en MAYÚSCULAS ───────── */
  var SIGLAS = /^(LED|RGB|USB|BT|TV|HD|IP|LG|JBL|PS4|OTG|BTU|GB|MYD|RC|BBQ|XL|II|III|8K|4K|MJ30|PVC)$/;
  function prolijo(nombre) {
    var s = String(nombre || '').replace(/\s+/g, ' ').trim();
    var letras = s.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '');
    var mayus = letras.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
    if (!letras.length || mayus / letras.length < 0.6) return s.charAt(0).toUpperCase() + s.slice(1);
    return s.split(' ').map(function (w, i) {
      if (/\d/.test(w) || SIGLAS.test(w.replace(/[^A-Z0-9]/gi, '').toUpperCase())) return w.toUpperCase();
      var low = w.toLowerCase();
      if (i > 0 && /^(de|del|la|el|con|y|a|para|en|x|o|c\/)$/.test(low)) return low;
      return low.charAt(0).toUpperCase() + low.slice(1);
    }).join(' ').replace(/^Myd\b/, 'MyD');
  }

  /* ── Formas de pago (mediosPago del panel) ─────────────────── */
  function normalizarMedios(arr) {
    return (Array.isArray(arr) ? arr : []).map(function (m) {
      return { medio: String((m && m.medio) || '').trim(), pct: Number((m && m.descuentoPct) || 0) };
    }).filter(function (m) { return !!m.medio; });
  }
  function precioCon(precio, pct) { return Math.round((precio || 0) * (1 - (pct || 0) / 100) * 100) / 100; }
  function mejorMedio(p) {
    var c = (p.medios || []).filter(function (m) { return m.pct > 0; });
    if (!c.length) return null;
    var b = c.reduce(function (a, x) { return x.pct > a.pct ? x : a; });
    return { medio: b.medio, pct: b.pct, precioFinal: precioCon(p.precio, b.pct) };
  }

  function imagen(src) {
    if (!src) return '';
    return /^https?:|^data:|^\//.test(src) ? src : BASE + src;
  }

  function mapear(p) {
    var r = rubroDe(p.nombre, p.categoria);
    return {
      id: p._id || p.id, cod: p.codigo || '',
      nombre: prolijo(p.nombre), nombreOriginal: p.nombre,
      desc: String(p.descripcion || '').replace(/\s+/g, ' ').trim(),
      marca: String(p.marca || '').trim(),
      rubro: r.id, rubroNom: r.nombre, sala: r.sala,
      precio: Number(p.precio) || 0,
      img: imagen(p.foto),
      medios: normalizarMedios(p.mediosPago),
      cuotas: Number(p.cuotasSinInteres) || 0,
      usado: /\busad[oa]\b/i.test(p.nombre)
    };
  }
  function limpiar(lista) {
    return lista.filter(function (p) {
      return p && p.nombre && Number(p.precio) > 1 && !/env[ií]os|producto migrado/i.test(p.nombre);
    }).map(mapear);
  }

  var productos = limpiar(window.MYD_SNAPSHOT || []);
  var fuente = 'copia';           // 'copia' | 'vivo'
  var oyentes = [];
  function avisar() { oyentes.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* ── Catálogo en vivo ──────────────────────────────────────── */
  var sync = null;
  function sincronizar() {
    if (sync) return sync;
    if (!CFG.SLUG || /[?&]copia\b/.test(location.search)) return (sync = Promise.resolve({ fuente: fuente }));
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_MS || 8000);
    sync = fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/web', { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(t);
        if (d && Array.isArray(d.productos)) {
          var lista = limpiar(d.productos);
          if (lista.length) { productos = lista; fuente = 'vivo'; avisar(); }
        }
        return { fuente: fuente };
      })
      .catch(function () { clearTimeout(t); return { fuente: fuente }; });
    return sync;
  }

  function resenas() {
    if (!CFG.SLUG) return Promise.resolve(null);
    var ctrl = new AbortController();
    setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_MS || 8000);
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/resenas', { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /* ── Carrito ───────────────────────────────────────────────── */
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('myd_cart') || '{}'); } catch (e) { carrito = {}; }
  function buscar(id) {
    for (var i = 0; i < productos.length; i++) if (productos[i].id === id) return productos[i];
    return null;
  }
  function itemsCarrito() { return Object.keys(carrito).filter(function (k) { return !!buscar(k) && carrito[k] > 0; }); }
  function totalItems() { return itemsCarrito().reduce(function (a, k) { return a + carrito[k]; }, 0); }
  function totalPesos() { return itemsCarrito().reduce(function (a, k) { return a + buscar(k).precio * carrito[k]; }, 0); }
  function guardar() { try { localStorage.setItem('myd_cart', JSON.stringify(carrito)); } catch (e) {} }
  function setCant(id, n) { if (n <= 0) delete carrito[id]; else carrito[id] = Math.min(n, 99); guardar(); avisar(); }
  function agregar(id, n) { setCant(id, (carrito[id] || 0) + (n || 1)); }
  function cant(id) { return carrito[id] || 0; }
  function vaciar() { carrito = {}; guardar(); avisar(); }

  function totalConMedio(medio) {
    return itemsCarrito().reduce(function (a, k) {
      var p = buscar(k), m = (p.medios || []).filter(function (x) { return x.medio === medio; })[0];
      return a + precioCon(p.precio, m ? m.pct : 0) * carrito[k];
    }, 0);
  }
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

  /* ── WhatsApp + pedido en CobrOS ───────────────────────────── */
  function linkWA(texto) {
    return 'https://wa.me/' + CFG.WA + '?text=' + encodeURIComponent(texto || 'Hola MyD HOGAR!');
  }
  function mensajeWA(datos) {
    var lineas = itemsCarrito().map(function (k) {
      var p = buscar(k);
      return '• ' + p.nombre + ' x' + carrito[k] + ' — ' + money(p.precio * carrito[k]);
    }).join('\n');
    var base = (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas + '\n\nTotal de lista: ' + money(totalPesos());
    if (!datos) {
      var alt = totalesPorMedio().map(function (t) { return t.medio + ': ' + money(t.total); }).join(' · ');
      return base + (alt ? '\n(' + alt + ')' : '');
    }
    var medio = datos.medio === 'cuotas' ? 'En cuotas con cobrador a domicilio'
      : datos.medio ? datos.medio + ' — ' + money(totalConMedio(datos.medio)) : '';
    return base +
      (medio ? '\nForma de pago: ' + medio : '') +
      '\n\nNombre: ' + (datos.nombre || '') +
      '\nTeléfono: ' + (datos.telefono || '') +
      (datos.localidad ? '\nLocalidad: ' + datos.localidad : '') +
      (datos.nota ? '\nNota: ' + datos.nota : '') +
      (datos.registrado ? '\n\n(El pedido ya quedó cargado en su sistema)' : '');
  }

  function crearPedido(datos) {
    if (!CFG.SLUG) return Promise.resolve(null);
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_PEDIDO_MS || 15000);
    var medio = datos.medio === 'cuotas' ? 'En cuotas con cobrador a domicilio' : datos.medio;
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG + '/pedido', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
      body: JSON.stringify({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email || '',
        nota: ['Pedido web', medio ? 'Forma de pago: ' + medio : '', datos.localidad ? 'Localidad: ' + datos.localidad : '', datos.nota || '']
          .filter(Boolean).join(' — '),
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

  /* ── Imagen de producto con respaldo ───────────────────────── */
  var SIN_FOTO = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#EFEDE6"/>' +
    '<path transform="translate(128 128) scale(.5)" fill="none" stroke="#C9C5B8" stroke-width="26" stroke-linejoin="round" ' +
    'd="M121,120 L121,65 L162,65 L162,120 L256,50 L470,262 L400,262 L400,440 L112,440 L112,262 L42,262 Z"/></svg>');
  function imgTag(p, cls) {
    return '<img class="' + (cls || '') + '" src="' + esc(p.img || SIN_FOTO) + '" alt="' + esc(p.nombre) + '" loading="lazy" ' +
      'onerror="this.onerror=null;this.src=\'' + SIN_FOTO + '\'">';
  }

  /* ── Cajón de pedido (3 pasos) ─────────────────────────────── */
  function montarCarrito() {
    var $ = function (s) { return document.querySelector(s); };
    var drawer = $('#cart'), body = $('#cartBody'), foot = $('#cartFoot'), panel = $('#cartPanel'), scrim = $('#cartScrim');
    var paso = 'pedido', enviando = false, resultado = null, error = '', ultimo = {};

    function abrir(open) {
      if (!drawer) return;
      drawer.classList.toggle('open', open);
      if (scrim) scrim.classList.toggle('on', open);
      document.body.classList.toggle('no-scroll', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) pintarPanel();
    }
    function irA(p) { paso = p; pintarPanel(); }

    function pintar() {
      var keys = itemsCarrito(), n = totalItems();
      Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
        el.textContent = n; el.classList.toggle('on', n > 0);
      });
      if (!body) return;
      if (!keys.length) {
        body.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 512 512" aria-hidden="true"><use href="#casa"/></svg>' +
          '<strong>Tu pedido está vacío</strong><span>Sumá productos del catálogo y los juntamos acá.</span></div>';
        if (foot) foot.innerHTML = '';
        return;
      }
      body.innerHTML = keys.map(function (k) {
        var p = buscar(k);
        return '<article class="cart-item">' + imgTag(p) +
          '<div class="cart-item-txt"><h4>' + esc(p.nombre) + '</h4>' +
          '<span class="cart-item-precio">' + money(p.precio) + '</span></div>' +
          '<div class="qty"><button type="button" data-menos="' + esc(k) + '" aria-label="Quitar uno">−</button>' +
          '<span>' + carrito[k] + '</span><button type="button" data-mas="' + esc(k) + '" aria-label="Sumar uno">+</button></div></article>';
      }).join('');
      if (foot) foot.innerHTML = resumenHTML() +
        '<button type="button" class="btn btn-verde btn-block" data-ir="datos">Continuar</button>' +
        '<button type="button" class="cart-clear" data-vaciar>Vaciar pedido</button>';
    }
    function resumenHTML() {
      var alt = totalesPorMedio().map(function (t) { return '<li><span>' + esc(t.medio) + '</span><b>' + money(t.total) + '</b></li>'; }).join('');
      return '<div class="cart-total"><span>Total de lista</span><b>' + money(totalPesos()) + '</b></div>' +
        (alt ? '<p class="cart-alt-t">Pagando con</p><ul class="cart-alt">' + alt + '</ul>' : '');
    }
    function pintarPanel() {
      if (paso === 'pedido') { if (panel) { panel.hidden = true; panel.innerHTML = ''; } pintar(); return; }
      if (!panel) return;
      panel.hidden = false;
      panel.innerHTML = paso === 'datos' ? formHTML() : listoHTML();
      var f = panel.querySelector('form');
      if (f) f.addEventListener('submit', enviar);
    }
    function formHTML() {
      var vistos = {}, medios = [];
      itemsCarrito().forEach(function (k) {
        (buscar(k).medios || []).forEach(function (m) { if (!vistos[m.medio]) { vistos[m.medio] = 1; medios.push(m); } });
      });
      var opciones = ['<option value="">A convenir</option>', '<option value="cuotas">En cuotas con cobrador a domicilio</option>']
        .concat(medios.map(function (m) {
          return '<option value="' + esc(m.medio) + '">' + esc(m.medio) + (m.pct > 0 ? ' (−' + m.pct + '%)' : '') + '</option>';
        })).join('');
      var zonas = (CFG.ZONAS || []).map(function (z) { return '<option>' + esc(z) + '</option>'; }).join('');
      return '<div class="cart-step"><button type="button" class="cs-back" data-volver aria-label="Volver al pedido">←</button>' +
        '<h3>Tus datos</h3><p class="cs-sub">Te escribimos por WhatsApp para coordinar entrega y forma de pago.</p>' +
        '<form novalidate>' +
        '<label>Nombre y apellido<input name="nombre" required autocomplete="name" value="' + esc(ultimo.nombre || '') + '"></label>' +
        '<label>WhatsApp<input name="telefono" required inputmode="tel" autocomplete="tel" placeholder="381 000-0000" value="' + esc(ultimo.telefono || '') + '"></label>' +
        '<label>Localidad<input name="localidad" list="zonasList" autocomplete="address-level2" value="' + esc(ultimo.localidad || '') + '"><datalist id="zonasList">' + zonas + '</datalist></label>' +
        '<label>¿Cómo querés pagar?<select name="medio">' + opciones + '</select></label>' +
        '<label>Nota <i>(opcional)</i><textarea name="nota" rows="2" placeholder="Dirección, horario, color, lo que necesites."></textarea></label>' +
        (error ? '<p class="cs-error">' + esc(error) + '</p>' : '') +
        '<div class="cart-total"><span>Total de lista</span><b>' + money(totalPesos()) + '</b></div>' +
        '<button class="btn btn-verde btn-block" type="submit"' + (enviando ? ' disabled' : '') + '>' + (enviando ? 'Enviando…' : 'Enviar pedido') + '</button>' +
        '<p class="cart-note">Tus datos se usan solo para preparar este pedido.</p></form></div>';
    }
    function listoHTML() {
      var d = resultado || {}, titulo, texto;
      if (d.ok) { titulo = 'Pedido registrado'; texto = 'Ya quedó cargado en el sistema de MyD HOGAR. Mandanos el detalle por WhatsApp y te confirmamos stock, entrega y pago.'; }
      else { titulo = 'Tu pedido está listo'; texto = 'No pudimos registrarlo en el sistema' + (d.mensaje ? ' (' + d.mensaje + ')' : '') + ', pero mandándolo por WhatsApp lo cargamos nosotros.'; }
      var datos = Object.assign({}, d.datos || {}, { registrado: !!d.ok });
      return '<div class="cart-step cart-ok"><span class="ok-mark" aria-hidden="true">✓</span>' +
        '<h3>' + titulo + '</h3><p class="cs-sub">' + texto + '</p>' +
        '<a class="btn btn-verde btn-block" href="' + esc(linkWA(mensajeWA(datos))) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
        (d.pago ? '<a class="btn btn-line btn-block" href="' + esc(d.pago) + '" target="_blank" rel="noopener">Pagar online</a>' : '') +
        '<button type="button" class="cart-clear" data-cerrar-ok>Cerrar y vaciar</button></div>';
    }
    function enviar(e) {
      e.preventDefault();
      if (enviando) return;
      var f = e.target, datos = {
        nombre: f.nombre.value.trim(), telefono: f.telefono.value.trim(), localidad: f.localidad.value.trim(),
        medio: f.medio.value, nota: f.nota.value.trim()
      };
      ultimo = datos;
      if (!datos.nombre || datos.telefono.replace(/\D/g, '').length < 8) { error = 'Necesitamos tu nombre y un WhatsApp válido.'; pintarPanel(); return; }
      error = ''; enviando = true; pintarPanel();
      crearPedido(datos).then(function (d) { resultado = { ok: !!d, datos: datos, pago: d && d.init_point }; })
        .catch(function (err) { resultado = { ok: false, datos: datos, mensaje: err && err.message }; })
        .then(function () { enviando = false; irA('listo'); });
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cart-open],[data-cart-close],[data-mas],[data-menos],[data-vaciar],[data-ir],[data-volver],[data-cerrar-ok]');
      if (!t) return;
      if (t.hasAttribute('data-cart-open')) { e.preventDefault(); abrir(true); }
      else if (t.hasAttribute('data-cart-close')) abrir(false);
      else if (t.hasAttribute('data-mas')) agregar(t.getAttribute('data-mas'), 1);
      else if (t.hasAttribute('data-menos')) { var k = t.getAttribute('data-menos'); setCant(k, cant(k) - 1); }
      else if (t.hasAttribute('data-vaciar')) vaciar();
      else if (t.hasAttribute('data-ir')) irA(t.getAttribute('data-ir'));
      else if (t.hasAttribute('data-volver')) irA('pedido');
      else if (t.hasAttribute('data-cerrar-ok')) { paso = 'pedido'; resultado = null; vaciar(); abrir(false); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) abrir(false); });
    oyentes.push(function () { if (paso === 'pedido') pintar(); });
    pintar();
    window.MYD.abrirCarrito = function () { abrir(true); };
  }

  /* ── Aviso flotante al sumar ───────────────────────────────── */
  var toastT;
  function toast(txt) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = txt; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2200);
  }

  /* ── Tarjeta de producto (home y catálogo) ─────────────────── */
  function cardHTML(p) {
    var mm = mejorMedio(p), n = cant(p.id);
    return '<article class="card" data-id="' + esc(p.id) + '">' +
      '<button type="button" class="card-foto" data-ficha="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' + imgTag(p) +
        (mm ? '<span class="card-dto">−' + mm.pct + '%</span>' : '') + '</button>' +
      '<div class="card-body">' +
        '<h3>' + (p.usado ? '<span class="tag-usado">Usado</span>' : '') + esc(p.nombre) + '</h3>' +
        '<div class="card-precio">' + money(p.precio) + '</div>' +
        (mm ? '<div class="card-final"><b>' + money(mm.precioFinal) + '</b> con ' + esc(mm.medio.toLowerCase()) + '</div>' : '') +
        (p.cuotas > 1 ? '<div class="card-cuotas">' + p.cuotas + ' cuotas sin interés de ' + money(p.precio / p.cuotas) + '</div>' : '') +
        '<div class="card-add"><button type="button" data-sumar="' + esc(p.id) + '" class="' + (n ? 'en' : '') + '">' +
          (n ? '✓ En tu pedido (' + n + ')' : 'Sumar al pedido') + '</button></div>' +
      '</div></article>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sumar]');
    if (!b) return;
    var p = buscar(b.getAttribute('data-sumar'));
    if (!p) return;
    agregar(p.id, 1);
    toast('Sumaste ' + (p.nombre.length > 38 ? p.nombre.slice(0, 36) + '…' : p.nombre));
  });

  oyentes.push(function () {
    Array.prototype.forEach.call(document.querySelectorAll('button[data-sumar]'), function (b) {
      var n = cant(b.getAttribute('data-sumar'));
      b.classList.toggle('en', n > 0);
      b.textContent = n ? '✓ En tu pedido (' + n + ')' : 'Sumar al pedido';
    });
  });

  window.MYD = {
    cardHTML: cardHTML,
    cfg: CFG, base: BASE, money: money, esc: esc, sinAcentos: sinAcentos, palabras: palabras,
    rubros: RUBROS.concat([DEF]), rubroPorId: rubroPorId,
    productos: function () { return productos; },
    fuente: function () { return fuente; },
    buscar: buscar, mejorMedio: mejorMedio, precioCon: precioCon, imgTag: imgTag,
    agregar: agregar, setCant: setCant, cant: cant, vaciar: vaciar,
    itemsCarrito: itemsCarrito, totalItems: totalItems, totalPesos: totalPesos, totalesPorMedio: totalesPorMedio,
    linkWA: linkWA, mensajeWA: mensajeWA, sincronizar: sincronizar, resenas: resenas,
    onCambio: function (fn) { oyentes.push(fn); }, montarCarrito: montarCarrito, toast: toast
  };
})();
