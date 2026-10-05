(() => {
  'use strict';
  const cfg = window.ELTECLA;
  const $ = id => document.getElementById(id);
  const storageKey = `eltecla-lista-v1:${cfg.slug || 'pendiente'}`;
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
  const wa = message => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(message)}`;
  const element = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  let products = [], ids = [], state = 'loading', category = '', busy = false, sent = false, submitting = false, checkingOrder = false, activeLoad = null;
  let query = new URLSearchParams(location.search).get('q') || '';
  let requestedCategory = new URLSearchParams(location.search).get('cat') || '';
  $('search').value = query;
  try { const stored = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(stored)) ids = [...new Set(stored.filter(x => typeof x === 'string').slice(0, 100))]; } catch {}
  const selected = () => products.filter(p => ids.includes(p.id));
  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(ids)); } catch {} };
  const productAvailable = p => !(p.controlaStock && p.stock !== null && p.stock <= 0);
  const safeImage = value => {
    if (typeof value !== 'string') return '';
    if (/^data:image\/(jpeg|png|webp|gif);base64,/i.test(value)) return value;
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  };
  const setNotice = text => { $('catalogNotice').textContent = text; $('catalogNotice').hidden = !text; };
  const cartMessage = (ordered = false) => {
    const list = selected();
    if (!list.length) return 'Hola, El Tecla. Quiero consultar por juegos, precios y disponibilidad.';
    const lines = list.map(p => `• ${p.name}${p.cat ? ` (${p.cat})` : ''}${p.price !== null ? ` — ${money(p.price)} publicado` : ''}`);
    const total = list.every(p => p.price !== null) ? `\nTotal publicado: ${money(list.reduce((n, p) => n + p.price, 0))}.` : '';
    return `Hola, El Tecla. ${ordered ? 'Envié un pedido desde la web' : 'Me interesan estos juegos'}:\n${lines.join('\n')}${total}\nQuiero confirmar disponibilidad, pago y entrega.`;
  };
  function updateCart() {
    const list = selected();
    $('cartList').replaceChildren();
    list.forEach(p => {
      const li = element('li'), div = element('div');
      div.append(element('p', '', p.name), element('small', '', p.price === null ? 'Precio a consultar' : money(p.price)));
      const remove = element('button', '', '×'); remove.type = 'button'; remove.setAttribute('aria-label', `Quitar ${p.name} de mi lista`);
      remove.addEventListener('click', () => { if (submitting) return; ids = ids.filter(id => id !== p.id); persist(); sent = false; $('checkout').hidden = true; updateCart(); renderProducts(); });
      remove.disabled = submitting; li.append(div, remove); $('cartList').append(li);
    });
    $('cartCount').textContent = String(list.length).padStart(2, '0'); $('headerCartCount').textContent = String(list.length);
    $('cartEmpty').hidden = !!list.length;
    const priced = list.length > 0 && list.every(p => p.price !== null);
    $('cartTotal').hidden = !priced; $('totalValue').textContent = priced ? money(list.reduce((n, p) => n + p.price, 0)) : '';
    $('cartWhatsApp').href = wa(cartMessage(sent));
    $('showCheckout').hidden = !(priced && cfg.slug && state === 'ready');
    $('showCheckout').disabled = sent || submitting;
    $('showCheckout').textContent = sent ? 'PEDIDO ENVIADO' : 'PREPARAR PEDIDO';
    if (!list.length || state !== 'ready') $('checkout').hidden = true;
  }
  function setState(next, heading, body, symbol = '+') {
    state = next; $('catalogContent').setAttribute('aria-busy', String(next === 'loading'));
    $('search').disabled = next !== 'ready'; $('sort').disabled = next !== 'ready';
    if (next === 'loading') return;
    $('catalogContent').replaceChildren();
    if (next === 'ready') { renderProducts(); return; }
    $('filters').replaceChildren();
    const box = element('div', 'catalog-state');
    box.append(element('div', 'state-icon', symbol), element('span', 'state-caption', 'EL TECLA / GAME LIBRARY'), element('h2', '', heading), element('p', '', body));
    if (next === 'error') { const retry = element('button', 'button button-outline', 'VOLVER A INTENTAR ↻'); retry.type = 'button'; retry.addEventListener('click', () => load()); box.append(retry); }
    const a = element('a', 'button button-red', 'PREGUNTANOS POR UN JUEGO ↗'); a.href = wa('Hola, El Tecla. Estoy buscando un juego. ¿Me pasan los títulos y la disponibilidad?'); a.target = '_blank'; a.rel = 'noopener noreferrer'; box.append(a);
    $('catalogContent').append(box);
    $('resultsCount').textContent = next === 'error' ? 'CATÁLOGO NO DISPONIBLE' : 'CONSULTAS ABIERTAS'; updateCart();
  }
  function syncUrl() {
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (category) url.searchParams.set('cat', category); else url.searchParams.delete('cat');
    history.replaceState(null, '', url);
  }
  function renderFilters() {
    const categories = [...new Set(products.map(p => p.cat).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    if (requestedCategory && categories.includes(requestedCategory)) category = requestedCategory;
    requestedCategory = '';
    if (!categories.includes(category)) category = '';
    $('filters').replaceChildren();
    ['', ...categories].forEach(cat => {
      const b = element('button', '', cat || 'Todos los juegos'); b.type = 'button'; b.setAttribute('aria-pressed', String(cat === category));
      b.addEventListener('click', () => { category = cat; renderFilters(); syncUrl(); renderProducts(); }); $('filters').append(b);
    });
  }
  function renderProducts() {
    if (state !== 'ready') return;
    const words = norm(query).split(/\s+/).filter(Boolean);
    const visible = products.filter(p => (!category || p.cat === category) && words.every(w => norm(`${p.name} ${p.desc} ${p.cat}`).includes(w)));
    const sort = $('sort').value;
    visible.sort((a, b) => {
      if (sort !== 'name') { if (a.price === null) return b.price === null ? 0 : 1; if (b.price === null) return -1; const difference = sort === 'priceAsc' ? a.price - b.price : b.price - a.price; if (difference) return difference; }
      return a.name.localeCompare(b.name, 'es');
    });
    $('resultsCount').textContent = `${visible.length} ${visible.length === 1 ? 'JUEGO PUBLICADO' : 'JUEGOS PUBLICADOS'}${query || category ? ` / ${products.length} EN EL CATÁLOGO` : ''}`;
    $('catalogContent').replaceChildren();
    if (!visible.length) {
      const box = element('div', 'catalog-state'); box.append(element('div', 'state-icon', '?'), element('h2', '', 'Ese título no aparece acá.'), element('p', '', 'Probá con otro nombre o sacá los filtros. También podés preguntarnos por el juego que buscás.'));
      const reset = element('button', 'button button-outline', 'LIMPIAR BÚSQUEDA'); reset.type = 'button'; reset.addEventListener('click', () => { query = ''; category = ''; $('search').value = ''; renderFilters(); syncUrl(); renderProducts(); });
      const link = element('a', 'button button-red', 'CONSULTAR POR EL TÍTULO ↗'); link.href = wa(`Hola, El Tecla. Estoy buscando ${query || 'un juego'}${category ? ` (${category})` : ''}. ¿Lo tienen?`); link.target = '_blank'; link.rel = 'noopener noreferrer'; box.append(reset, link); $('catalogContent').append(box); return;
    }
    const grid = element('div', 'product-grid');
    visible.forEach(p => {
      const article = element('article', 'product-card'); article.dataset.id = p.id;
      const picture = element('div', 'product-img');
      const placeholder = () => { picture.replaceChildren(element('span', 'image-placeholder', '+')); };
      if (p.img) { const img = element('img'); img.src = p.img; img.alt = p.name; img.loading = 'lazy'; img.width = 360; img.height = 480; img.addEventListener('error', placeholder, { once: true }); picture.append(img); } else placeholder();
      const body = element('div', 'product-body');
      body.append(element('span', 'product-category', p.cat || 'VIDEOJUEGO'), element('h2', '', p.name));
      if (p.desc) body.append(element('p', 'product-description', p.desc));
      body.append(element('p', 'product-price', p.price !== null ? money(p.price) : 'Consultá precio'));
      const available = productAvailable(p);
      body.append(element('p', 'stock-label', !available ? 'SIN STOCK' : p.controlaStock && p.stock !== null ? `${p.stock} ${p.stock === 1 ? 'UNIDAD' : 'UNIDADES'}` : 'CONFIRMÁ DISPONIBILIDAD'));
      const actions = element('div', 'product-actions');
      const add = element('button', `button button-red${ids.includes(p.id) ? ' selected' : ''}`, ids.includes(p.id) ? '✓ EN TU LISTA' : available ? '+ SUMAR A MI LISTA' : 'SIN STOCK');
      add.type = 'button'; add.disabled = !available || submitting; add.setAttribute('aria-pressed', String(ids.includes(p.id))); add.setAttribute('aria-label', `${ids.includes(p.id) ? 'Quitar' : 'Sumar'} ${p.name} ${ids.includes(p.id) ? 'de' : 'a'} mi lista`);
      add.addEventListener('click', () => { ids = ids.includes(p.id) ? ids.filter(id => id !== p.id) : [...ids, p.id]; sent = false; persist(); $('checkout').hidden = true; updateCart(); renderProducts(); });
      const ask = element('a', 'button button-outline', 'CONSULTAR ↗'); ask.href = wa(`Hola, El Tecla. Quiero consultar por ${p.name}${p.cat ? ` (${p.cat})` : ''}${p.price !== null ? `, publicado a ${money(p.price)}` : ''}. ¿Está disponible?`); ask.target = '_blank'; ask.rel = 'noopener noreferrer';
      actions.append(add, ask); body.append(actions); article.append(picture, body); grid.append(article);
    });
    $('catalogContent').append(grid);
  }
  async function request(url, options = {}, timeout = 8000) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeout);
    try { const response = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'El servicio no respondió.'); return data; } finally { clearTimeout(timer); }
  }
  async function load(silent = false) {
    if (busy) return activeLoad;
    if (submitting) return;
    if (!cfg.slug) { $('refresh').disabled = true; setState('pending', 'El catálogo está en preparación.', '¿Buscás un título en particular? Mandanos el nombre del juego y tu consola por WhatsApp. Te contamos qué hay para tu próxima partida.'); return; }
    busy = true; $('refresh').disabled = true;
    if (!silent) { $('resultsCount').textContent = 'CARGANDO JUEGOS…'; $('catalogContent').setAttribute('aria-busy', 'true'); }
    activeLoad = (async () => { try {
      const data = await request(`${cfg.api}/catalogo/${encodeURIComponent(cfg.slug)}`);
      if (!data || !Array.isArray(data.productos)) throw new Error('El catálogo no tiene el formato esperado.');
      products = data.productos.filter(p => p && p._id && p.nombre && p.activo !== false).map(p => ({
        id: String(p._id), name: String(p.nombre).slice(0, 200), desc: String(p.descripcion || '').slice(0, 1500), cat: String(p.categoria || '').slice(0, 100), img: safeImage(p.foto),
        price: p.precio !== null && p.precio !== undefined && p.precio !== '' && Number.isFinite(Number(p.precio)) && Number(p.precio) >= 0 ? Number(p.precio) : null,
        stock: p.stock !== null && p.stock !== undefined && Number.isFinite(Number(p.stock)) ? Number(p.stock) : null, controlaStock: p.controlaStock === true
      }));
      const before = ids.length; ids = ids.filter(id => products.some(p => p.id === id && productAvailable(p))); persist();
      if (before !== ids.length) { $('cartNote').hidden = false; $('cartNote').textContent = 'Actualizamos tu lista: quitamos los juegos que ya no figuran o están sin stock.'; sent = false; }
      setNotice(''); $('catalogContent').setAttribute('aria-busy', 'false');
      if (!products.length) setState('empty', 'Próximos juegos, nuevas partidas.', 'Todavía no hay juegos publicados en este catálogo. Consultanos por el título que buscás y te contamos la disponibilidad.');
      else { state = 'ready'; $('search').disabled = false; $('sort').disabled = false; renderFilters(); renderProducts(); updateCart(); }
    } catch {
      setNotice(''); setState('error', 'No pudimos abrir el catálogo.', 'La conexión con el catálogo no respondió. Podés volver a intentar o consultar directamente por WhatsApp. No estamos confirmando disponibilidad.');
    } finally { busy = false; $('refresh').disabled = false; $('catalogContent').setAttribute('aria-busy', 'false'); } })();
    return activeLoad;
  }
  $('search').addEventListener('input', e => { query = e.target.value.trim(); syncUrl(); renderProducts(); });
  $('sort').addEventListener('change', renderProducts);
  $('refresh').addEventListener('click', () => load());
  $('showCheckout').addEventListener('click', () => { $('checkout').hidden = !$('checkout').hidden; if (!$('checkout').hidden) $('customerName').focus(); });
  $('checkout').addEventListener('submit', async event => {
    event.preventDefault(); if (sent || submitting || checkingOrder || state !== 'ready' || !cfg.slug) return;
    const name = $('customerName').value.trim(), phone = $('customerPhone').value.trim();
    if (name.length < 2 || phone.replace(/\D/g, '').length < 8) { $('checkoutResult').textContent = 'Completá tu nombre y un teléfono con al menos 8 dígitos.'; return; }
    // Releer el catálogo antes del POST; no registrar un producto desactivado.
    checkingOrder = true; $('submitOrder').disabled = true;
    const oldIds = ids.slice(), oldPrices = selected().map(p => `${p.id}:${p.price}`).sort().join('|'); await load(true);
    checkingOrder = false;
    if (state !== 'ready' || ids.length !== oldIds.length || !selected().length) { $('checkoutResult').textContent = 'El catálogo cambió o no pudimos comprobarlo. Revisá tu selección antes de enviar.'; $('submitOrder').disabled = false; $('checkout').hidden = false; return; }
    if (oldPrices !== selected().map(p => `${p.id}:${p.price}`).sort().join('|')) { $('checkoutResult').textContent = 'La selección o los precios publicados cambiaron. Revisá el total actualizado antes de volver a enviar.'; $('submitOrder').disabled = false; return; }
    submitting = true; $('submitOrder').disabled = true; $('showCheckout').disabled = true; $('checkoutResult').textContent = 'Enviando pedido…';
    updateCart(); renderProducts();
    try {
      const data = await request(`${cfg.api}/catalogo/${encodeURIComponent(cfg.slug)}/pedido`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: name, telefono: phone, nota: $('orderNote').value.trim(), items: selected().map(p => ({ productoId: p.id, cantidad: 1 })) }) }, 12000);
      if (!data.ok) throw new Error('No se confirmó el pedido.');
      sent = true; $('checkoutResult').replaceChildren(element('span', '', 'Pedido recibido. Coordiná los detalles con El Tecla por WhatsApp.'));
      $('submitOrder').textContent = 'PEDIDO ENVIADO ✓'; $('submitOrder').disabled = true;
      $('showCheckout').textContent = 'PEDIDO ENVIADO';
      if (data.init_point) { try { const payment = new URL(data.init_point); if (payment.protocol === 'https:') { const a = element('a', 'button button-blue', 'ABRIR LINK DE PAGO ↗'); a.href = payment.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; $('checkoutResult').append(a); } } catch {} }
      try { localStorage.setItem(storageKey, '[]'); } catch {}
      // Conservamos el resumen recibido en pantalla, limpiando la lista persistida.
      const summary = `${cartMessage(true)}\nA nombre de ${name}. Mi teléfono es ${phone}.`;
      $('cartNote').hidden = false; $('cartNote').textContent = 'Tu pedido ya se envió. Contactá a El Tecla para coordinarlo.';
      $('cartWhatsApp').href = wa(summary);
    } catch {
      // No reintentar el POST: una respuesta perdida podría haber registrado el cargo.
      $('checkoutResult').textContent = 'No pudimos confirmar si el pedido se registró. Consultá a El Tecla por WhatsApp antes de volver a enviarlo.';
      $('submitOrder').disabled = true; sent = true;
    } finally {
      submitting = false; $('showCheckout').disabled = sent;
      if (sent) { $('cartList').querySelectorAll('button').forEach(b => { b.disabled = true; }); $('catalogContent').querySelectorAll('.product-actions button').forEach(b => { b.disabled = true; }); }
    }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && cfg.slug && !sent) load(true); });
  if (cfg.slug) setInterval(() => { if (!document.hidden && !sent) load(true); }, cfg.refreshMs || 60000);
  updateCart(); load();
})();
