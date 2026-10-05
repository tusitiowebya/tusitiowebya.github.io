(function (root) {
  'use strict';
  const config = root.BASTROP_CONFIG;
  const demoProducts = [
    { id: 'example-remera', name: 'Remera', category: 'Remeras', image: 'remera.svg', color: 'Crudo', sizes: ['S', 'M', 'L'] },
    { id: 'example-buzo', name: 'Buzo', category: 'Buzos', image: 'buzo.svg', color: 'Grafito', sizes: ['S', 'M', 'L'] },
    { id: 'example-camisa', name: 'Camisa', category: 'Camisas', image: 'camisa.svg', color: 'Azul claro', sizes: ['S', 'M', 'L'] },
    { id: 'example-pantalon', name: 'Pantalón', category: 'Pantalones', image: 'pantalon.svg', color: 'Arena', sizes: ['38', '40', '42'] }
  ].map(p => ({ ...p, price: null, example: true }));
  const listeners = new Set();
  let state = { mode: config.slug ? 'live' : 'demo', status: 'loading', products: [], cart: {}, receipt: null };
  let loadVersion = 0;
  let submission = false;
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const key = (id, size) => JSON.stringify([id, size]);
  const quantity = value => Math.min(999, Math.max(0, Math.floor(Number(value) || 0)));
  const emit = () => listeners.forEach(fn => fn());
  const storageKey = () => 'bastrop-order-v1-' + (state.mode === 'demo' ? 'demo' : config.slug);
  const persist = () => { try { root.localStorage.setItem(storageKey(), JSON.stringify(state.cart)); } catch (_) {} };
  const restore = () => {
    let saved = {};
    try { saved = JSON.parse(root.localStorage.getItem(storageKey()) || '{}'); } catch (_) {}
    state.cart = {};
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
    state.products.forEach(p => p.sizes.forEach(size => {
      const entry = key(p.id, size), q = quantity(saved[entry]);
      if (q) state.cart[entry] = q;
    }));
  };
  const getRows = () => state.products.flatMap(p => p.sizes.map(size => ({ ...p, size, quantity: state.cart[key(p.id, size)] || 0 })).filter(p => p.quantity > 0));
  const totals = () => {
    const rows = getRows();
    const priced = state.mode === 'live' && rows.length > 0 && rows.every(r => Number.isFinite(r.price));
    return { units: rows.reduce((s, r) => s + r.quantity, 0), models: new Set(rows.map(r => r.id)).size, total: priced ? Math.round(rows.reduce((s, r) => s + r.quantity * r.price, 0) * 100) / 100 : null };
  };
  const minimum = () => {
    const amount = config.minimumPurchase;
    const known = typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
    const total = totals().total;
    return { known, amount: known ? amount : null, remaining: known && total !== null ? Math.max(0, Math.round((amount - total) * 100) / 100) : null, eligible: known && total !== null && total >= amount };
  };
  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      const response = await root.fetch(config.api + path, { ...options, signal: controller.signal });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } finally { clearTimeout(timeout); }
  }
  async function load(mode = state.mode) {
    if (submission) return;
    const version = ++loadVersion;
    state = { mode, status: 'loading', products: [], cart: {}, receipt: null };
    emit();
    if (mode === 'demo') {
      state.products = demoProducts;
      state.status = 'ready'; restore(); emit(); return;
    }
    if (!config.slug) { state.status = 'unconfigured'; emit(); return; }
    try {
      const data = await request('/catalogo/' + encodeURIComponent(config.slug));
      if (version !== loadVersion) return;
      if (!data.negocio || !Array.isArray(data.productos)) throw new Error('Catálogo inválido');
      state.products = data.productos.filter(p => p && p._id && p.nombre && p.activo !== false).map(p => ({
        id: String(p._id), name: String(p.nombre), category: String(p.categoria || 'Indumentaria'),
        description: String(p.descripcion || ''), image: p.foto || '', code: String(p.codigo || ''),
        price: p.precio !== null && p.precio !== undefined && String(p.precio).trim() !== '' && Number.isFinite(Number(p.precio)) && Number(p.precio) >= 0 ? Number(p.precio) : null,
        sizes: ['Unidad'], example: false
      }));
      state.status = state.products.length ? 'ready' : 'empty'; restore(); emit();
    } catch (_) {
      if (version !== loadVersion) return;
      state.status = 'error'; emit();
    }
  }
  function setQuantity(id, size, value) {
    if (submission || state.receipt) return;
    const p = state.products.find(product => product.id === id && product.sizes.includes(size));
    if (!p) return;
    const entry = key(id, size), q = quantity(value);
    if (q) state.cart[entry] = q; else delete state.cart[entry];
    persist(); emit();
  }
  function message(customer = {}) {
    const rows = getRows(), t = totals();
    const parts = [state.mode === 'demo' ? 'Hola, Bastrop. Probé la demo del catálogo y quiero consultar por una compra mayorista. Estas prendas y talles son ejemplos, no un pedido real:' : 'Hola, Bastrop. Quiero consultar mi pedido mayorista:'];
    rows.forEach(r => parts.push('• ' + r.name + (r.color ? ' / ' + r.color : '') + (r.size !== 'Unidad' ? ' / talle ' + r.size : '') + ': ' + r.quantity + ' un.'));
    parts.push('Total de unidades: ' + t.units);
    if (t.total !== null) parts.push('Total de catálogo: ' + money(t.total));
    if (customer.name) parts.push('Nombre: ' + customer.name);
    if (customer.phone) parts.push('WhatsApp: ' + customer.phone);
    if (customer.note) parts.push('Nota: ' + customer.note);
    if (!minimum().known) parts.push('¿Me confirmás el monto mínimo de compra?');
    if (state.receipt) parts.push('Ya registré este pedido desde la web.');
    return parts.join('\n');
  }
  function money(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(value); }
  async function submit(customer) {
    if (submission || state.receipt) throw new Error('Este pedido ya se está registrando o fue registrado.');
    if (state.mode !== 'live' || !config.slug) throw new Error('El ejemplo no genera pedidos reales.');
    if (!minimum().eligible) throw new Error('Primero confirmá el mínimo y completá el pedido.');
    if (!String(customer.name || '').trim() || String(customer.phone || '').replace(/\D/g, '').length < 8) throw new Error('Completá tu nombre y un teléfono válido.');
    const items = getRows().map(r => ({ productoId: r.id, cantidad: r.quantity }));
    if (!items.length) throw new Error('Sumá al menos una prenda.');
    submission = true; emit();
    try {
      const data = await request('/catalogo/' + encodeURIComponent(config.slug) + '/pedido', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: customer.name.trim(), telefono: customer.phone.trim(), nota: customer.note || '', items })
      });
      if (data.ok !== true) throw new Error('No se confirmó el pedido.');
      state.receipt = { total: data.total, payment: safePayment(data.init_point) };
      // Se conserva el resumen para WhatsApp, pero se borra el borrador persistido al recibir éxito.
      try { root.localStorage.removeItem(storageKey()); } catch (_) {}
      emit(); return state.receipt;
    } finally { submission = false; emit(); }
  }
  function safePayment(url) {
    try { const u = new URL(url); return u.protocol === 'https:' && /(^|\.)mercadopago\.(com|com\.ar)$/.test(u.hostname) ? u.href : ''; } catch (_) { return ''; }
  }
  root.BastropStore = { subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, getState: () => state, getRows, totals, minimum, load, setQuantity, money, message, normalize, isSubmitting: () => submission, quantity, safePayment, submit,
    clear() { if (submission || state.receipt) return; state.cart = {}; persist(); emit(); },
    startNew() { if (submission) return; state.cart = {}; state.receipt = null; persist(); emit(); }
  };
})(typeof window === 'undefined' ? globalThis : window);
