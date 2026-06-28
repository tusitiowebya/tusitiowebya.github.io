/* Fer Chu Baby's — catálogo + carrito + pedido (conectado a cobros) */
(function () {
  'use strict';
  var C = window.FERCHU || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  var PRODUCTOS = [];          // catálogo completo desde cobros
  var CART = {};               // { productoId: {producto, cantidad} }
  var filtro = 'TODOS', q = '';

  var LS = 'ferchu_cart';
  try { CART = JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { CART = {}; }

  function money(n) { return '$' + Number(n || 0).toLocaleString('es-AR'); }
  function slug(s) { return (s || 'otros').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function altBg(cat) { var z = slug(cat); return (z.charCodeAt(0) || 0) % 2 === 0; } // alterna fondo de tarjeta
  function save() { try { localStorage.setItem(LS, JSON.stringify(CART)); } catch (e) {} }

  // ---------- carga catálogo ----------
  fetch(C.API + '/catalogo/' + C.SLUG)
    .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
    .then(function (d) {
      PRODUCTOS = d.productos || [];
      buildFilters();
      render();
      pruneCart();
      if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(function () { el.scrollIntoView(); }, 120); }
    })
    .catch(function () {
      $('#catalogo').innerHTML = '<div class="cat-error">No pudimos cargar el catálogo ahora mismo.<br>Escribinos por WhatsApp al ' + (C.WA_HUMANO || '') + ' y te ayudamos. 🤍</div>';
    });

  // ---------- filtros ----------
  function categorias() {
    var set = {}; PRODUCTOS.forEach(function (p) { if (p.categoria) set[p.categoria] = 1; });
    return Object.keys(set).sort();
  }
  function buildFilters() {
    var cats = categorias();
    if (!cats.length) return;
    var html = '<button class="filt active" data-f="TODOS">Todas</button>';
    cats.forEach(function (c) { html += '<button class="filt" data-f="' + c + '">' + c + '</button>'; });
    var fc = $('#filters'); fc.innerHTML = html;
    fc.querySelectorAll('.filt').forEach(function (b) {
      b.addEventListener('click', function () {
        fc.querySelectorAll('.filt').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); filtro = b.dataset.f; render();
      });
    });
  }

  var search = $('#search');
  if (search) search.addEventListener('input', function () { q = this.value.trim().toLowerCase(); render(); });

  // ---------- render lista ----------
  function matches(p) {
    if (filtro !== 'TODOS' && p.categoria !== filtro) return false;
    if (q && (p.nombre + ' ' + (p.descripcion || '') + ' ' + (p.categoria || '')).toLowerCase().indexOf(q) === -1) return false;
    return true;
  }
  function cardHTML(p) {
    var inCart = !!CART[p._id], alt = altBg(p.categoria);
    var media = p.foto ? '<img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy">' : '🧺';
    return '<article class="card">'
      + '<div class="card-top' + (alt ? ' alt' : '') + '">' + media + '</div>'
      + '<div class="card-body"><h3>' + p.nombre + '</h3>'
      + '<p class="card-desc">' + (p.descripcion || '') + '</p>'
      + '<div class="card-foot"><span class="card-price">' + money(p.precio) + '</span>'
      + '<button class="add-btn' + (inCart ? ' added' : '') + '" data-id="' + p._id + '">' + (inCart ? '✓ Agregado' : 'Agregar') + '</button></div>'
      + '</div></article>';
  }
  function render() {
    var cont = $('#catalogo');
    var vis = PRODUCTOS.filter(matches);
    if (!vis.length) { cont.innerHTML = '<p class="no-res">No encontramos prendas con ese filtro. 🤍</p>'; return; }
    var groups = {};
    vis.forEach(function (p) { var k = p.categoria || 'Otros'; (groups[k] = groups[k] || []).push(p); });
    var html = '';
    Object.keys(groups).sort().forEach(function (cat) {
      html += '<section class="cat-group"><h2 class="cat-group-title" id="' + slug(cat) + '">' + cat + ' <span class="badge">' + groups[cat].length + '</span></h2><div class="grid">';
      html += groups[cat].map(cardHTML).join('');
      html += '</div></section>';
    });
    cont.innerHTML = html;
    cont.querySelectorAll('.add-btn').forEach(function (b) {
      b.addEventListener('click', function () { addToCart(b.dataset.id); });
    });
  }

  // ---------- carrito ----------
  function addToCart(id) {
    var p = PRODUCTOS.find(function (x) { return x._id === id; }); if (!p) return;
    if (CART[id]) CART[id].cantidad++; else CART[id] = { producto: p, cantidad: 1 };
    save(); render(); renderCart(); openCart();
  }
  function setQty(id, delta) {
    if (!CART[id]) return;
    CART[id].cantidad += delta;
    if (CART[id].cantidad <= 0) delete CART[id];
    save(); render(); renderCart();
  }
  function pruneCart() {
    var ids = {}; PRODUCTOS.forEach(function (p) { ids[p._id] = 1; });
    Object.keys(CART).forEach(function (id) { if (!ids[id]) delete CART[id]; });
    save(); renderCart();
  }
  function cartArr() { return Object.keys(CART).map(function (id) { return CART[id]; }); }
  function cartTotal() { return cartArr().reduce(function (s, it) { return s + it.producto.precio * it.cantidad; }, 0); }
  function cartCount() { return cartArr().reduce(function (s, it) { return s + it.cantidad; }, 0); }

  function renderCart() {
    var arr = cartArr();
    $('#cartCount').textContent = cartCount();
    var empty = $('#cartEmpty'), foot = $('#cartFoot'), items = $('#cartItems');
    if (!arr.length) { empty.hidden = false; foot.hidden = true; items.innerHTML = ''; return; }
    empty.hidden = true; foot.hidden = false;
    items.innerHTML = arr.map(function (it) {
      var p = it.producto, alt = altBg(p.categoria);
      var media = p.foto ? '<img src="' + p.foto + '" alt="' + p.nombre + '">' : '🧺';
      return '<div class="ci"><div class="ci-emoji' + (alt ? ' alt' : '') + '">' + media + '</div>'
        + '<div class="ci-info"><h4>' + p.nombre + '</h4><span>' + money(p.precio) + ' c/u</span></div>'
        + '<div class="ci-qty"><button data-m="' + p._id + '" aria-label="Restar">−</button><b>' + it.cantidad + '</b><button data-p="' + p._id + '" aria-label="Sumar">+</button></div></div>';
    }).join('');
    $('#cartTotal').textContent = money(cartTotal());
    items.querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { setQty(b.dataset.m, -1); }); });
    items.querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { setQty(b.dataset.p, 1); }); });
  }

  function openCart() { $('#cart').classList.add('open'); $('#cartBackdrop').classList.add('open'); }
  function closeCart() { $('#cart').classList.remove('open'); $('#cartBackdrop').classList.remove('open'); }
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartBackdrop').addEventListener('click', closeCart);

  // ---------- checkout ----------
  function waText(nombre, nota) {
    var lines = ['Hola *Fer Chu Baby\'s*! 🤍 Quiero hacer este pedido:', ''];
    cartArr().forEach(function (it) { lines.push('• ' + it.cantidad + 'x ' + it.producto.nombre + (it.producto.descripcion ? ' (' + it.producto.descripcion + ')' : '') + ' — ' + money(it.producto.precio * it.cantidad)); });
    lines.push('', '*Total: ' + money(cartTotal()) + '*');
    lines.push('', 'Nombre: ' + nombre);
    if (nota) lines.push('Nota: ' + nota);
    return 'https://wa.me/' + C.WA + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  $('#cartForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!cartArr().length) return;
    var nombre = $('#fNombre').value.trim(), tel = $('#fTel').value.trim(), nota = $('#fNota').value.trim();
    if (!nombre || !tel) return;
    var btn = $('#cartSubmit'); btn.disabled = true; btn.textContent = 'Enviando…';
    var url = waText(nombre, nota);

    // 1) registrar el pedido en cobros (cae como cargo + notifica al panel)
    var payload = { nombre: nombre, telefono: tel, nota: nota, items: cartArr().map(function (it) { return { productoId: it.producto._id, cantidad: it.cantidad }; }) };
    fetch(C.API + '/catalogo/' + C.SLUG + '/pedido', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .catch(function () {})
      .finally(function () {
        // 2) abrir WhatsApp con el resumen (checkout por WhatsApp)
        window.open(url, '_blank');
        $('#okWa').href = url;
        $('#okModal').classList.add('open');
        closeCart();
        CART = {}; save(); render(); renderCart();
        btn.disabled = false; btn.textContent = 'Enviar pedido por WhatsApp';
      });
  });

  $('#okClose').addEventListener('click', function () { $('#okModal').classList.remove('open'); });

  renderCart();
})();
