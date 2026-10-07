/* Núcleo de la tienda Luz Buena, compartido entre la portada y /tienda/.
   - Carga el catálogo desde CobrOS (GET con timeout) o, si todavía no hay slug,
     el catálogo inicial de data.js.
   - Carrito por dispositivo (localStorage) con aroma/opción por línea.
   - Checkout: en modo CobrOS registra el pedido (POST) y deja el WhatsApp armado. */
(function () {
  'use strict';
  var CFG = window.LUZ;
  var BASE = document.documentElement.getAttribute('data-base') || '';
  var KEY = 'luzbuena.cart.v1';
  var state = { mode: 'loading', productos: [], byId: {}, cart: [], enviando: false };
  var listeners = [];

  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function money(n) {
    return '$' + Math.round(Number(n) || 0).toLocaleString('es-AR');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function img(src) {
    if (!src) return '';
    return /^(data:|https?:)/.test(src) ? src : BASE + src;
  }
  function waLink(text) {
    return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  /* ---------- catálogo ---------- */
  var LOCAL_BY_NAME = {};
  window.LUZ_PRODUCTOS.forEach(function (p) { LOCAL_BY_NAME[norm(p.nombre)] = p; });
  var CAT_BY_NAME = {};
  window.LUZ_CATS.forEach(function (c) { CAT_BY_NAME[norm(c.nombre)] = c.id; CAT_BY_NAME[c.id] = c.id; });

  function fromCobros(p) {
    var local = LOCAL_BY_NAME[norm(p.nombre)] || {};
    var catKey = norm(p.categoria);
    var cat = CAT_BY_NAME[catKey];
    if (!cat && catKey) {
      cat = catKey.replace(/ /g, '-');
      window.LUZ_CATS.push({ id: cat, nombre: p.categoria });
      CAT_BY_NAME[catKey] = cat;
    }
    return {
      id: String(p._id),
      productoId: String(p._id),
      localId: local.id || null,
      nombre: p.nombre,
      categoria: cat || local.categoria || 'otros',
      precio: Number(p.precio) || 0,
      unidad: p.unidad || local.unidad || '',
      descripcion: p.descripcion || local.descripcion || '',
      foto: p.foto || local.foto || '',
      ilustracion: !p.foto && local.ilustracion,
      opciones: local.opciones || null,
      opcionLabel: local.opcionLabel || 'Opción',
      energia: local.energia || [],
      madre: !!local.madre,
      destacado: !!local.destacado,
      evento: !!local.evento
    };
  }

  function fetchTimeout(url, opts, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, ms);
    opts = opts || {};
    opts.signal = ctrl.signal;
    return fetch(url, opts).finally(function () { clearTimeout(t); });
  }

  function load() {
    setMode('loading');
    if (!CFG.slug) {
      setCatalog('preview', window.LUZ_PRODUCTOS.map(function (p) {
        var c = Object.assign({}, p); c.productoId = null; c.localId = p.id; return c;
      }));
      return;
    }
    fetchTimeout(CFG.api + '/catalogo/' + encodeURIComponent(CFG.slug), {}, CFG.timeoutMs)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var lista = (data && data.productos) || [];
        var prods = lista.filter(function (p) { return p && p.activo !== false && Number(p.precio) > 0; }).map(fromCobros);
        setCatalog(prods.length ? 'live' : 'empty', prods);
      })
      .catch(function () { setCatalog('error', []); });
  }

  function setMode(m) { state.mode = m; emit(); }
  function setCatalog(mode, prods) {
    state.mode = mode;
    state.productos = prods;
    state.byId = {};
    prods.forEach(function (p) { state.byId[p.id] = p; });
    readCart();
    emit();
  }

  /* ---------- carrito ---------- */
  function readCart() {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { saved = []; }
    if (!Array.isArray(saved)) saved = [];
    state.cart = saved.filter(function (l) {
      var p = state.byId[l.id];
      if (!p) return false;
      l.nombre = p.nombre; l.precio = p.precio;
      l.cant = Math.max(1, Math.min(99, parseInt(l.cant, 10) || 1));
      return true;
    });
  }
  function saveCart() {
    try { localStorage.setItem(KEY, JSON.stringify(state.cart)); } catch (e) { /* sin storage: el carrito vive en memoria */ }
  }
  function add(id, opcion, cant) {
    var p = state.byId[id];
    if (!p) return;
    opcion = opcion || '';
    var key = id + '|' + opcion;
    var line = state.cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.cant = Math.min(99, line.cant + (cant || 1));
    else state.cart.push({ key: key, id: id, nombre: p.nombre, precio: p.precio, opcion: opcion, cant: cant || 1 });
    saveCart(); emit(); bump();
  }
  function setQty(key, cant) {
    state.cart = state.cart.filter(function (l) {
      if (l.key !== key) return true;
      l.cant = Math.min(99, cant);
      return cant > 0;
    });
    saveCart(); emit();
  }
  function total() {
    return state.cart.reduce(function (s, l) { return s + l.precio * l.cant; }, 0);
  }
  function count() {
    return state.cart.reduce(function (s, l) { return s + l.cant; }, 0);
  }

  function emit() { listeners.forEach(function (fn) { fn(state); }); }

  /* ---------- tarjetas de producto (usadas por portada y tienda) ---------- */
  function catName(id) {
    var c = window.LUZ_CATS.filter(function (x) { return x.id === id; })[0];
    return c ? c.nombre : '';
  }
  function card(p, opts) {
    opts = opts || {};
    var sel = '';
    if (p.opciones && p.opciones.length > 1) {
      sel = '<label class="pcard__opt"><span>' + esc(p.opcionLabel) + '</span><select data-opt>' +
        p.opciones.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></label>';
    }
    var foto = p.foto
      ? '<img src="' + esc(img(p.foto)) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="640" height="800">'
      : '<span class="pcard__ph" aria-hidden="true"></span>';
    return '<article class="pcard' + (opts.compact ? ' pcard--compact' : '') + '" data-id="' + esc(p.id) + '">' +
      '<div class="pcard__media">' + foto +
      (p.ilustracion ? '<span class="pcard__tag">Ilustración</span>' : '') +
      (p.madre && !opts.noMadre ? '<span class="pcard__tag pcard__tag--rosa">Día de la Madre</span>' : '') + '</div>' +
      '<div class="pcard__body"><p class="pcard__cat">' + esc(catName(p.categoria)) + '</p>' +
      '<h3 class="pcard__name">' + esc(p.nombre) + '</h3>' +
      (opts.compact ? '' : '<p class="pcard__desc">' + esc(p.descripcion) + '</p>') +
      sel +
      '<div class="pcard__foot"><p class="pcard__price">' + money(p.precio) +
      (p.unidad ? ' <small>/ ' + esc(p.unidad) + '</small>' : '') + '</p>' +
      '<button class="pcard__add" type="button" data-add aria-label="Agregar ' + esc(p.nombre) + ' al pedido">Agregar</button></div>' +
      '</div></article>';
  }
  function consultaCard(c) {
    var msg = 'Hola Luz Buena! Quiero consultar por: ' + c.nombre + '. ¿Qué precio y disponibilidad tienen?';
    return '<article class="pcard pcard--consulta">' +
      '<div class="pcard__media">' + (c.foto ? '<img src="' + esc(img(c.foto)) + '" alt="' + esc(c.nombre) + '" loading="lazy" width="640" height="800">' : '<span class="pcard__ph pcard__ph--sal" aria-hidden="true"></span>') + '</div>' +
      '<div class="pcard__body"><p class="pcard__cat">Para consultar</p><h3 class="pcard__name">' + esc(c.nombre) + '</h3>' +
      '<p class="pcard__desc">' + esc(c.descripcion) + '</p>' +
      '<div class="pcard__foot"><p class="pcard__price pcard__price--q">Precio por WhatsApp</p>' +
      '<a class="pcard__add pcard__add--ghost" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener">Consultar</a></div></div></article>';
  }

  /* delegación: botón Agregar de cualquier tarjeta */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var cardEl = b.closest('.pcard');
    var s = cardEl.querySelector('[data-opt]');
    var p = state.byId[cardEl.getAttribute('data-id')];
    var op = s ? s.value : (p && p.opciones && p.opciones.length === 1 ? p.opciones[0] : '');
    add(cardEl.getAttribute('data-id'), op, 1);
    b.textContent = 'Sumado ✓';
    b.classList.add('is-ok');
    setTimeout(function () { b.textContent = 'Agregar'; b.classList.remove('is-ok'); }, 1400);
  });

  /* ---------- panel del pedido ---------- */
  var drawer;
  function buildDrawer() {
    drawer = document.createElement('aside');
    drawer.className = 'cart';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-label', 'Tu pedido');
    drawer.innerHTML =
      '<div class="cart__scrim" data-cart-close></div>' +
      '<div class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">' +
      '<header class="cart__head"><h2 id="cartTitle">Tu pedido</h2><button type="button" class="cart__x" data-cart-close aria-label="Cerrar">×</button></header>' +
      '<div class="cart__body">' +
      '<div class="cart__lines" data-lines></div>' +
      '<form class="cart__form" data-form novalidate>' +
      '<h3>¿A nombre de quién?</h3>' +
      '<label>Nombre<input name="nombre" autocomplete="name" required maxlength="80"></label>' +
      '<label>Teléfono / WhatsApp<input name="telefono" type="tel" inputmode="tel" autocomplete="tel" required maxlength="30"></label>' +
      '<label>Nota (entrega, color de moño, nombre para el sticker…)<textarea name="nota" rows="2" maxlength="400"></textarea></label>' +
      '<details class="cart__preview"><summary>Ver el mensaje que vas a mandar</summary><pre data-preview></pre></details>' +
      '<p class="cart__err" data-err role="alert"></p>' +
      '<p class="cart__mode" data-modenote></p>' +
      '<button class="btn btn--candle cart__go" type="submit" data-go>Confirmar pedido</button>' +
      '</form>' +
      '<div class="cart__done" data-done hidden></div>' +
      '</div>' +
      '<footer class="cart__foot"><span>Total</span><strong data-total>$0</strong></footer>' +
      '</div>';
    document.body.appendChild(drawer);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-close]')) close();
      var q = e.target.closest('[data-q]');
      if (q) {
        var l = state.cart.filter(function (x) { return x.key === q.getAttribute('data-key'); })[0];
        if (l) setQty(l.key, l.cant + Number(q.getAttribute('data-q')));
      }
    });
    var form = drawer.querySelector('[data-form]');
    form.addEventListener('input', renderPreview);
    form.addEventListener('submit', submit);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
  }

  var lastFocus;
  function open() {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
    drawer.querySelector('[data-done]').hidden = true;
    drawer.querySelector('[data-form]').hidden = !state.cart.length;
    renderDrawer();
    setTimeout(function () { drawer.querySelector('.cart__x').focus(); }, 50);
  }
  function close() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function message(f) {
    var lines = state.cart.map(function (l) {
      return '• ' + l.cant + ' x ' + l.nombre + (l.opcion ? ' (' + l.opcion + ')' : '') + ' = ' + money(l.precio * l.cant);
    });
    var t = 'Hola Luz Buena! Quiero hacer este pedido:\n' + lines.join('\n') + '\nTotal: ' + money(total());
    if (f.nombre) t += '\n\nNombre: ' + f.nombre;
    if (f.telefono) t += '\nTeléfono: ' + f.telefono;
    if (f.nota) t += '\nNota: ' + f.nota;
    if (f.pedidoOk) t += '\n\n(Pedido registrado desde la web.)';
    return t;
  }
  function formData() {
    var form = drawer.querySelector('[data-form]');
    return {
      nombre: form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      nota: form.nota.value.trim()
    };
  }
  function renderPreview() {
    drawer.querySelector('[data-preview]').textContent = message(formData());
    drawer.querySelector('[data-err]').textContent = '';
  }

  function renderDrawer() {
    if (!drawer) return;
    var box = drawer.querySelector('[data-lines]');
    if (!drawer.querySelector('[data-done]').hidden && !state.cart.length) {
      box.innerHTML = '';
    } else if (!state.cart.length) {
      box.innerHTML = '<div class="cart__empty"><p>Todavía no sumaste nada.</p><a class="btn btn--line" href="' + BASE + 'tienda/">Ir a la tienda</a></div>';
    } else {
      box.innerHTML = state.cart.map(function (l) {
        return '<div class="cline"><div><p class="cline__n">' + esc(l.nombre) + '</p>' +
          (l.opcion ? '<p class="cline__o">' + esc(l.opcion) + '</p>' : '') +
          '<p class="cline__p">' + money(l.precio) + ' c/u</p></div>' +
          '<div class="cline__q"><button type="button" data-q="-1" data-key="' + esc(l.key) + '" aria-label="Quitar uno">−</button>' +
          '<span aria-live="polite">' + l.cant + '</span>' +
          '<button type="button" data-q="1" data-key="' + esc(l.key) + '" aria-label="Sumar uno">+</button></div></div>';
      }).join('');
    }
    drawer.querySelector('[data-total]').textContent = money(total());
    var form = drawer.querySelector('[data-form]');
    if (drawer.querySelector('[data-done]').hidden) form.hidden = !state.cart.length;
    drawer.querySelector('[data-modenote]').textContent = state.mode === 'live'
      ? 'Al confirmar, el pedido queda registrado en Luz Buena y se abre WhatsApp con el detalle.'
      : 'Al confirmar se abre WhatsApp con el detalle. Luz Buena te confirma stock, entrega y forma de pago.';
    renderPreview();
  }

  function submit(e) {
    e.preventDefault();
    if (state.enviando || !state.cart.length) return;
    var f = formData();
    var err = drawer.querySelector('[data-err]');
    if (!f.nombre || f.telefono.replace(/\D/g, '').length < 8) {
      err.textContent = 'Completá tu nombre y un teléfono válido para que Luz Buena te pueda responder.';
      return;
    }
    if (state.mode !== 'live') { finish(f, null); return; }

    var items = state.cart.map(function (l) { return { productoId: state.byId[l.id].productoId, cantidad: l.cant }; });
    var nota = state.cart.filter(function (l) { return l.opcion; }).map(function (l) { return l.nombre + ': ' + l.opcion; }).join(' | ');
    if (f.nota) nota = (nota ? nota + ' | ' : '') + f.nota;
    state.enviando = true;
    var go = drawer.querySelector('[data-go]');
    go.disabled = true; go.textContent = 'Registrando pedido…';
    fetchTimeout(CFG.api + '/catalogo/' + encodeURIComponent(CFG.slug) + '/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: f.nombre, telefono: f.telefono, email: '', nota: nota, items: items })
    }, 15000)
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw d; return d; }); })
      .then(function (d) { finish(f, d || {}); })
      .catch(function (d) {
        state.enviando = false;
        go.disabled = false; go.textContent = 'Confirmar pedido';
        var m = d && (d.error || d.message);
        err.innerHTML = 'No pudimos registrar el pedido' + (m ? ' (' + esc(m) + ')' : '') +
          '. Podés mandarlo igual por <a href="' + esc(waLink(message(f))) + '" target="_blank" rel="noopener">WhatsApp</a>.';
      });
  }

  function finish(f, resp) {
    var live = !!resp;
    f.pedidoOk = live;
    var link = waLink(message(f));
    var pay = resp && (resp.init_point || resp.initPoint);
    var done = drawer.querySelector('[data-done]');
    done.innerHTML = '<p class="cart__ok">' + (live ? '¡Pedido registrado!' : '¡Listo!') + '</p>' +
      '<p>' + (live ? 'Luz Buena ya lo tiene. Mandale el detalle por WhatsApp para coordinar la entrega.' : 'Mandá el detalle por WhatsApp y Luz Buena te confirma stock, entrega y pago.') + '</p>' +
      '<a class="btn btn--wa" href="' + esc(link) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
      (pay && /^https:\/\//.test(pay) ? '<a class="btn btn--line" href="' + esc(pay) + '" target="_blank" rel="noopener">Pagar con Mercado Pago</a>' : '');
    drawer.querySelector('[data-form]').hidden = true;
    done.hidden = false;
    state.cart = []; saveCart(); state.enviando = false;
    var go = drawer.querySelector('[data-go]');
    go.disabled = false; go.textContent = 'Confirmar pedido';
    drawer.querySelector('[data-form]').reset();
    emit();
    if (!live) window.open(link, '_blank', 'noopener');
  }

  function bump() {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
    });
  }

  listeners.push(function () {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; el.hidden = !n; });
    document.querySelectorAll('[data-cart-total]').forEach(function (el) { el.textContent = money(total()); });
    document.documentElement.classList.toggle('has-cart', n > 0);
    if (drawer && drawer.classList.contains('is-open')) renderDrawer();
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); }
  });

  window.LuzStore = {
    state: state, load: load, card: card, consultaCard: consultaCard, money: money, esc: esc, img: img,
    waLink: waLink, norm: norm, catName: catName, add: add,
    on: function (fn) { listeners.push(fn); fn(state); }
  };

  buildDrawer();
  load();
})();
