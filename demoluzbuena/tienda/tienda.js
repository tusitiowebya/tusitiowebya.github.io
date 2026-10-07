/* /tienda/: búsqueda sin acentos, rubros, energías y orden, con filtros en la URL. */
(function () {
  'use strict';
  var S = window.LuzStore;
  var qs = function (s) { return document.querySelector(s); };
  var params = new URLSearchParams(location.search);
  var f = { q: params.get('q') || '', cat: params.get('cat') || '', energia: params.get('energia') || '', sort: params.get('sort') || '' };

  var qIn = qs('[data-q]'), sortIn = qs('[data-sort]');
  var grid = qs('[data-grid]'), statusEl = qs('[data-status]');
  qIn.value = f.q; sortIn.value = f.sort;

  function syncUrl() {
    var p = new URLSearchParams();
    Object.keys(f).forEach(function (k) { if (f[k]) p.set(k, f[k]); });
    var s = p.toString();
    history.replaceState(null, '', s ? '?' + s : location.pathname);
  }

  function chips() {
    var prods = S.state.productos;
    var cats = window.LUZ_CATS.filter(function (c) { return prods.some(function (p) { return p.categoria === c.id; }); });
    qs('[data-cats]').innerHTML = '<button type="button" class="chip" data-cat="" aria-pressed="' + (!f.cat) + '">Todo <i>' + prods.length + '</i></button>' +
      cats.map(function (c) {
        var n = prods.filter(function (p) { return p.categoria === c.id; }).length;
        return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (f.cat === c.id) + '">' + S.esc(c.nombre) + ' <i>' + n + '</i></button>';
      }).join('');
    qs('[data-energias]').innerHTML = window.LUZ_ENERGIAS.map(function (e) {
      return '<button type="button" class="chip chip--e" data-en="' + e.id + '" aria-pressed="' + (f.energia === e.id) + '">✦ ' + S.esc(e.nombre) + '</button>';
    }).join('');
  }

  function render() {
    var st = S.state;
    qs('[data-mode]').textContent = st.mode === 'live' ? 'Precios y stock desde el sistema de Luz Buena' : st.mode === 'preview' ? 'Precios publicados por Luz Buena' : '';
    if (st.mode === 'loading') {
      statusEl.innerHTML = '<p class="status__msg">Cargando productos…</p>';
      grid.innerHTML = '<div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div>';
      qs('[data-count]').textContent = '';
      return;
    }
    if (st.mode === 'error') {
      statusEl.innerHTML = '<p class="status__msg">No pudimos cargar la tienda. <button type="button" class="linkbtn" data-retry>Reintentar</button> o pedí por <a href="' + S.waLink('Hola Luz Buena! Quiero hacer un pedido.') + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';
      grid.innerHTML = ''; qs('[data-count]').textContent = ''; chips(); return;
    }
    if (st.mode === 'empty') {
      statusEl.innerHTML = '<p class="status__msg">Todavía no hay productos cargados. Volvé pronto o pedí por <a href="' + S.waLink('Hola Luz Buena! Quiero hacer un pedido.') + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';
      grid.innerHTML = ''; qs('[data-count]').textContent = ''; chips(); return;
    }
    statusEl.innerHTML = '';
    chips();
    var q = S.norm(f.q);
    var list = st.productos.filter(function (p) {
      if (f.cat && p.categoria !== f.cat) return false;
      if (f.energia && p.energia.indexOf(f.energia) < 0) return false;
      if (q) {
        var hay = S.norm([p.nombre, p.descripcion, S.catName(p.categoria), (p.opciones || []).join(' ')].join(' '));
        if (!q.split(' ').every(function (w) { return hay.indexOf(w) >= 0; })) return false;
      }
      return true;
    });
    if (f.sort === 'asc') list.sort(function (a, b) { return a.precio - b.precio; });
    else if (f.sort === 'desc') list.sort(function (a, b) { return b.precio - a.precio; });
    else if (f.sort === 'az') list.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    else list.sort(function (a, b) { return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0); });

    qs('[data-count]').textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
    grid.innerHTML = list.length ? list.map(function (p) { return S.card(p); }).join('') :
      '<p class="status__msg">No encontramos productos con esa búsqueda. <button type="button" class="linkbtn" data-clear>Ver todo</button> o consultá por <a href="' + S.waLink('Hola Luz Buena! Estoy buscando: ' + f.q) + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';

    var cons = window.LUZ_CONSULTAS.filter(function (c) {
      if (f.energia && c.energia.indexOf(f.energia) < 0) return false;
      return !q || q.split(' ').every(function (w) { return S.norm(c.nombre + ' ' + c.descripcion).indexOf(w) >= 0; });
    });
    qs('[data-consultas]').innerHTML = cons.map(S.consultaCard).join('');
    qs('.shop__consultas').hidden = !cons.length;
  }

  var painted = '';
  S.on(function (st) {
    var key = st.mode + st.productos.length;
    if (key === painted) return;
    painted = key; render();
  });

  var t;
  qIn.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { f.q = qIn.value.trim(); syncUrl(); render(); }, 160); });
  sortIn.addEventListener('change', function () { f.sort = sortIn.value; syncUrl(); render(); });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-cat]');
    if (c) { f.cat = c.getAttribute('data-cat'); syncUrl(); render(); return; }
    var en = e.target.closest('[data-en]');
    if (en) { var id = en.getAttribute('data-en'); f.energia = f.energia === id ? '' : id; syncUrl(); render(); return; }
    if (e.target.closest('[data-clear]')) { f = { q: '', cat: '', energia: '', sort: '' }; qIn.value = ''; sortIn.value = ''; syncUrl(); render(); return; }
    if (e.target.closest('[data-retry]')) S.load();
  });
})();
