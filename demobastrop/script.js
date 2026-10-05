(function () {
  'use strict';
  const S = window.BastropStore, C = window.BASTROP_CONFIG;
  const $ = selector => document.querySelector(selector);
  const assets = document.body.dataset.assets;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const params = new URLSearchParams(location.search);
  let category = params.get('cat') || '', query = params.get('q') || '', sort = params.get('sort') || 'default';
  let pageSize = 12, productReference = null, statusReference = '', rowSignature = '', toastTimer, uncertainSubmission = false;
  const dialog = $('#orderDialog');
  $('#search').value = query;
  $('#sort').value = ['default', 'name', 'price-asc', 'price-desc'].includes(sort) ? sort : 'default';
  sort = $('#sort').value;
  const safeImage = url => {
    if (/^https:\/\//i.test(url) || /^data:image\/(png|jpe?g|webp);base64,/i.test(url)) return url;
    return assets + 'placeholder.svg';
  };
  function notify(message) {
    $('#toast').textContent = message; $('#toast').classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2000);
  }
  function updateURL() {
    const url = new URL(location.href);
    [['q', query], ['cat', category], ['sort', sort === 'default' ? '' : sort]].forEach(([name, value]) => value ? url.searchParams.set(name, value) : url.searchParams.delete(name));
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  function getFiltered() {
    const list = S.getState().products.filter(p => (!category || S.normalize(p.category) === category) && S.normalize(p.name + ' ' + p.description + ' ' + (p.code || '')).includes(S.normalize(query)));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (sort.startsWith('price')) list.sort((a, b) => a.price === null ? (b.price === null ? 0 : 1) : b.price === null ? -1 : sort === 'price-asc' ? a.price - b.price : b.price - a.price);
    return list;
  }
  function drawCategories() {
    const cats = [...new Set(S.getState().products.map(p => p.category))];
    if (category && !cats.some(c => S.normalize(c) === category)) category = '';
    $('#categories').innerHTML = [{ name: 'Todas', id: '' }, ...cats.map(c => ({ name: c, id: S.normalize(c) }))].map(c => `<button type="button" data-category="${esc(c.id)}" aria-pressed="${category === c.id}">${esc(c.name)}</button>`).join('');
  }
  function productHTML(p, index) {
    const name = p.example ? p.name + ' de ejemplo' : p.name;
    return `<article class="product-card" data-product="${esc(p.id)}">
      <div class="product-image"><img src="${esc(p.example ? assets + p.image : safeImage(p.image))}" alt="${esc(p.example ? 'Ilustración de ' + p.name.toLowerCase() + ', no es un producto real de Bastrop' : p.name)}" width="400" height="440" loading="lazy"><span class="product-code">${esc(p.example ? 'EJEMPLO / 0' + (index + 1) : p.code || 'BASTROP')}</span><span class="product-count" data-product-count="${esc(p.id)}" hidden>0 un.</span></div>
      <div class="product-info"><p class="product-category">${esc(p.category)}</p><h3>${esc(p.name)}</h3><p class="product-description">${esc(p.example ? p.color + ' · modelo ilustrativo' : p.description || 'Consultá los detalles de esta prenda.')}</p><p class="product-price">${p.price === null ? 'Precio a confirmar' : esc(S.money(p.price))}</p><div class="variant-label"><span>${p.example ? 'CANTIDAD POR TALLE' : 'CANTIDAD'}</span><span>UN.</span></div><div class="quantity-grid">${p.sizes.map(size => `<label class="quantity-field"><span>${esc(size)}</span><input type="number" inputmode="numeric" min="0" max="999" step="1" value="0" data-quantity="${esc(p.id)}" data-size="${esc(size)}" aria-label="Cantidad de ${esc(name)}${size === 'Unidad' ? '' : ', talle ' + esc(size)}"></label>`).join('')}</div><button type="button" class="quick-add" data-quick="${esc(p.id)}"><span>${p.example ? 'Sumar 1 de cada talle' : 'Sumar una unidad'}</span><span aria-hidden="true">+</span></button></div>
    </article>`;
  }
  function renderCatalog() {
    const state = S.getState(), ready = state.status === 'ready';
    $('#catalogNotice').innerHTML = `<div><strong>${state.mode === 'demo' ? 'Vista de ejemplo' : 'Catálogo de Bastrop'}</strong><span>${state.mode === 'demo' ? 'Prendas, colores y talles ilustrativos. Sin precios ni disponibilidad real.' : state.status === 'ready' ? 'Precios del catálogo. Confirmá condiciones y disponibilidad con Bastrop.' : 'Los productos reales se publican al habilitar el catálogo del negocio.'}</span></div><button class="text-button" id="modeButton">${state.mode === 'demo' ? 'Ver catálogo real ↗' : 'Probar vista de ejemplo ↗'}</button>`;
    $('#modeButton').addEventListener('click', () => {
      if (S.isSubmitting()) return;
      category = ''; query = ''; sort = 'default'; pageSize = 12; $('#search').value = ''; $('#sort').value = 'default'; updateURL();
      uncertainSubmission = false; $('#submitStatus').textContent = ''; $('#orderForm').reset(); S.load(state.mode === 'demo' ? 'live' : 'demo');
    });
    $('#search').disabled = !ready; $('#sort').disabled = !ready;
    [...$('#sort').options].filter(o => o.value.startsWith('price')).forEach(o => { o.disabled = state.mode === 'demo'; });
    $('#categories').hidden = !ready;
    $('#catalogState').hidden = ready;
    $('#moreButton').hidden = true;
    if (!ready) {
      $('#resultsCount').textContent = '';
      $('#products').innerHTML = state.status === 'loading' ? '<div class="skeleton"></div>'.repeat(4) : '';
      const content = {
        loading: ['Estamos preparando el catálogo…', 'En un momento vas a poder ver las prendas.'],
        unconfigured: ['El catálogo real está en preparación.', 'Mientras tanto, consultá las prendas y el mínimo de compra por WhatsApp. Podés probar el armado de pedido en la vista de ejemplo.'],
        empty: ['Todavía no hay prendas publicadas.', 'Consultá por el catálogo disponible y el mínimo de compra. Las prendas aparecerán acá cuando Bastrop las publique.'],
        error: ['No pudimos cargar el catálogo.', 'Probá de nuevo o consultá por WhatsApp. Tu selección guardada se recupera cuando vuelva el catálogo.']
      }[state.status];
      $('#catalogState').innerHTML = `<h3>${content[0]}</h3><p>${content[1]}</p>${state.status === 'error' ? '<button class="button button-dark" id="retryCatalog">Volver a intentar ↗</button>' : ''}${state.status !== 'loading' ? `<a class="button ${state.status === 'error' ? 'button-lime' : 'button-dark'}" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent('Hola, Bastrop. Quiero conocer el catálogo de indumentaria mayorista y el monto mínimo de compra.')}" target="_blank" rel="noopener noreferrer">Consultar catálogo ↗</a>` : ''}`;
      if ($('#retryCatalog')) $('#retryCatalog').addEventListener('click', () => S.load('live'));
      return;
    }
    drawCategories();
    const list = getFiltered();
    $('#resultsCount').textContent = list.length + (state.mode === 'demo' ? ' ejemplos' : ' prendas');
    $('#products').innerHTML = list.slice(0, pageSize).map(productHTML).join('');
    $('#catalogState').hidden = list.length > 0;
    if (!list.length) $('#catalogState').innerHTML = '<h3>No encontramos esa prenda.</h3><p>Probá con otro nombre o categoría.</p><button class="text-button" id="resetFilters">Limpiar filtros ↗</button>';
    if ($('#resetFilters')) $('#resetFilters').addEventListener('click', () => { category = ''; query = ''; $('#search').value = ''; updateURL(); renderCatalog(); updateOrder(); });
    $('#moreButton').hidden = list.length <= pageSize;
    $('#products').querySelectorAll('img').forEach(img => img.addEventListener('error', () => { if (!img.dataset.fallback) { img.dataset.fallback = 'true'; img.src = assets + 'placeholder.svg'; } }));
    updateQuantities();
  }
  function updateQuantities() {
    const state = S.getState(), locked = !!state.receipt || S.isSubmitting();
    const rows = S.getRows();
    document.querySelectorAll('[data-quantity]').forEach(input => {
      const q = rows.find(r => r.id === input.dataset.quantity && r.size === input.dataset.size)?.quantity || 0;
      if (document.activeElement !== input) input.value = q;
      input.disabled = locked;
    });
    document.querySelectorAll('[data-quick]').forEach(b => { b.disabled = locked; });
    document.querySelectorAll('[data-product-count]').forEach(el => {
      const q = rows.filter(r => r.id === el.dataset.productCount).reduce((sum, r) => sum + r.quantity, 0);
      el.textContent = q + ' un.'; el.hidden = !q;
    });
  }
  const customer = () => S.getState().mode === 'demo' ? {} : ({ name: $('#customerName').value.trim(), phone: $('#customerPhone').value.trim(), note: $('#customerNote').value.trim() });
  function updateMessage() {
    const text = S.message(customer());
    $('#messagePreview').textContent = text;
    $('#whatsappOrder').href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text);
  }
  function updateOrder() {
    const state = S.getState(), t = S.totals(), min = S.minimum(), rows = S.getRows(), busy = S.isSubmitting();
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = t.units; });
    document.querySelectorAll('[data-open-order]').forEach(el => { el.setAttribute('aria-label', 'Abrir mi pedido: ' + t.units + ' unidades'); });
    $('#dockSummary').textContent = t.units ? `${t.units} un. / ${t.models} ${t.models === 1 ? 'prenda' : 'prendas'}${t.total !== null ? ' / ' + S.money(t.total) : ''}` : 'Todavía no sumaste prendas';
    $('[data-dock-label]').textContent = state.mode === 'demo' ? 'VISTA DE EJEMPLO / MI SELECCIÓN' : 'BASTROP / MI PEDIDO';
    $('#orderStatus').textContent = state.receipt ? 'Pedido registrado. Mandá el resumen por WhatsApp para seguir con Bastrop.' : state.mode === 'demo' ? 'Estás probando una demo. Las prendas y talles son ejemplos; esta selección no genera una compra real.' : 'Revisá prendas y cantidades antes de confirmar.';
    const signature = rows.map(r => JSON.stringify([r.id, r.size])).join('|');
    if (signature !== rowSignature || !$('#orderRows').children.length) {
      $('#orderRows').innerHTML = rows.length ? rows.map((r, i) => `<article class="order-row"><div><h3>${esc(r.name)}</h3><p>${esc([r.color, r.size !== 'Unidad' ? 'Talle ' + r.size : '', r.example ? 'Ejemplo' : ''].filter(Boolean).join(' / '))}</p></div><div class="row-stepper"><button type="button" data-row-index="${i}" data-step="-1" aria-label="Quitar una unidad de ${esc(r.name)}, ${esc(r.size)}">−</button><span data-row-count="${i}">${r.quantity}</span><button type="button" data-row-index="${i}" data-step="1" aria-label="Sumar una unidad de ${esc(r.name)}, ${esc(r.size)}">+</button></div></article>`).join('') : '<p class="order-empty">Tu próxima reposición empieza con una prenda. Cerrá esta nota y sumá lo que te interesa.</p>';
      rowSignature = signature;
    }
    rows.forEach((r, i) => { const el = $(`[data-row-count="${i}"]`); if (el) el.textContent = r.quantity; });
    $('#orderRows').querySelectorAll('button').forEach(b => { b.disabled = busy || !!state.receipt; });
    $('#totalUnits').textContent = t.units;
    $('#totalPrice').textContent = state.receipt && Number.isFinite(Number(state.receipt.total)) ? S.money(Number(state.receipt.total)) : t.total !== null ? S.money(t.total) : 'A confirmar';
    $('#minimumNote').innerHTML = min.known && state.mode === 'live' ? `<strong>Mínimo de compra: ${esc(S.money(min.amount))}</strong>${min.remaining === 0 ? 'Tu selección alcanza el mínimo.' : min.remaining !== null ? 'Te faltan ' + esc(S.money(min.remaining)) + ' para alcanzar el mínimo.' : 'Sumá prendas para calcular tu selección.'}<progress max="${min.amount}" value="${Math.min(t.total || 0, min.amount)}" aria-label="Progreso hacia el mínimo de compra"></progress>` : '<strong>Compra mayorista con monto mínimo.</strong>Consultá el importe vigente con Bastrop antes de confirmar.';
    $('#customerFields').hidden = state.mode === 'demo' || !!state.receipt;
    $('#submitOrder').hidden = state.mode === 'demo' || !!state.receipt || state.status !== 'ready';
    $('#submitOrder').disabled = !t.units || !min.eligible || busy || uncertainSubmission;
    $('#submitOrder').textContent = busy ? 'Registrando pedido…' : 'Registrar pedido →';
    $('#customerName').required = state.mode === 'live'; $('#customerPhone').required = state.mode === 'live';
    $('#whatsappOrder').textContent = state.receipt ? 'Enviar resumen por WhatsApp ↗' : state.mode === 'demo' ? 'Consultar cómo comprar ↗' : 'Consultar selección por WhatsApp ↗';
    $('#paymentLink').hidden = !state.receipt?.payment;
    if (state.receipt?.payment) $('#paymentLink').href = state.receipt.payment;
    $('#clearOrder').hidden = !t.units || !!state.receipt; $('#clearOrder').disabled = busy;
    $('#newOrder').hidden = !state.receipt;
    if (!min.known && state.mode === 'live' && !uncertainSubmission) $('#submitStatus').textContent = 'El mínimo de compra está a confirmar. Por ahora, consultá tu selección por WhatsApp.';
    updateQuantities(); updateMessage();
  }
  S.subscribe(() => {
    const state = S.getState();
    if (productReference !== state.products || statusReference !== state.status) { productReference = state.products; statusReference = state.status; renderCatalog(); }
    updateOrder();
  });
  $('#products').addEventListener('input', e => {
    const input = e.target.closest('[data-quantity]');
    if (input) S.setQuantity(input.dataset.quantity, input.dataset.size, input.value);
  });
  $('#products').addEventListener('change', e => {
    const input = e.target.closest('[data-quantity]');
    if (input) { input.value = S.quantity(input.value); S.setQuantity(input.dataset.quantity, input.dataset.size, input.value); }
  });
  $('#products').addEventListener('click', e => {
    const button = e.target.closest('[data-quick]');
    if (!button) return;
    const p = S.getState().products.find(p => p.id === button.dataset.quick), rows = S.getRows();
    p.sizes.forEach(size => S.setQuantity(p.id, size, (rows.find(r => r.id === p.id && r.size === size)?.quantity || 0) + 1));
    notify(p.example ? 'Sumaste 1 de cada talle al ejemplo' : 'Sumaste una unidad a tu pedido');
  });
  $('#categories').addEventListener('click', e => { const button = e.target.closest('[data-category]'); if (button) { category = button.dataset.category; pageSize = 12; updateURL(); renderCatalog(); updateOrder(); } });
  $('#search').addEventListener('input', e => { query = e.target.value; pageSize = 12; updateURL(); renderCatalog(); updateOrder(); });
  $('#sort').addEventListener('change', e => { sort = e.target.value; pageSize = 12; updateURL(); renderCatalog(); updateOrder(); });
  $('#moreButton').addEventListener('click', () => { pageSize += 12; renderCatalog(); updateOrder(); });
  document.querySelectorAll('[data-open-order]').forEach(button => button.addEventListener('click', () => { updateOrder(); dialog.showModal(); }));
  $('#closeOrder').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog && e.clientX < dialog.getBoundingClientRect().left) dialog.close(); });
  $('#orderRows').addEventListener('click', e => { const button = e.target.closest('[data-step]'); if (button) { const r = S.getRows()[Number(button.dataset.rowIndex)]; if (r) S.setQuantity(r.id, r.size, r.quantity + Number(button.dataset.step)); } });
  $('#clearOrder').addEventListener('click', () => { S.clear(); notify('Vaciaste la selección'); });
  $('#newOrder').addEventListener('click', () => { uncertainSubmission = false; $('#submitStatus').textContent = ''; S.startNew(); $('#orderForm').reset(); updateOrder(); });
  $('#orderForm').addEventListener('input', updateMessage);
  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (uncertainSubmission || !S.minimum().eligible || S.isSubmitting()) return;
    const data = customer();
    if (data.phone.replace(/\D/g, '').length < 8) { $('#submitStatus').textContent = 'Revisá tu WhatsApp: incluí código de área y número.'; $('#customerPhone').focus(); return; }
    $('#submitStatus').textContent = '';
    try { await S.submit(data); $('#submitStatus').textContent = 'Tu pedido quedó registrado. Seguí la conversación por WhatsApp.'; }
    catch (_) { uncertainSubmission = true; $('#submitStatus').textContent = 'No pudimos confirmar el registro. Consultá por WhatsApp antes de reintentar para evitar un pedido duplicado.'; }
    updateOrder();
  });
  const menu = $('#menuButton');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', open); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); $('#nav').classList.toggle('open', open); });
  $('#nav').addEventListener('click', e => { if (e.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); $('#nav').classList.remove('open'); } });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !dialog.open) { e.preventDefault(); $('#search').focus(); } if (e.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); $('#nav').classList.remove('open'); } });
  const video = $('#heroVideo'), videoButton = $('#videoButton');
  if (video) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)'); let userPaused = reduced.matches;
    const setButton = () => { videoButton.textContent = video.paused ? '▷' : 'Ⅱ'; videoButton.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video'); };
    video.addEventListener('play', setButton); video.addEventListener('pause', setButton);
    if (reduced.matches) { video.pause(); video.autoplay = false; } else video.play().catch(() => {});
    videoButton.addEventListener('click', () => { userPaused = !video.paused; if (video.paused) video.play().catch(() => {}); else video.pause(); });
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting) video.pause(); else if (!userPaused) video.play().catch(() => {}); }, { threshold: .1 }).observe(video);
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else if (!userPaused && video.getBoundingClientRect().bottom > 0) video.play().catch(() => {}); });
    setButton();
  }
  if (!params.has('qa') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.buying-title,.buying-steps article,.questions-layout,.closing').forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--delay', (i % 3) * 70 + 'ms'); observer.observe(el); });
  }
  S.load();
})();
