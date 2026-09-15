/* Mueblería Express — núcleo de la tienda (compartido home ↔ /catalogo/)
   Planes de pago diario, carrito en localStorage y pedido armado para WhatsApp. */
(function () {
  'use strict';

  const WA = '5493412773692';
  const PLANES = [85, 155, 250];
  const RUBROS = {
    frio: 'Línea frío',
    gastro: 'Gastronomía',
    mostradores: 'Mostradores y exhibición',
    combos: 'Combos comerciales',
    carteleria: 'Cartelería',
    hogar: 'Muebles y hogar',
    electro: 'Electro y climatización',
    tecno: 'Tecnología',
    herramientas: 'Herramientas y más'
  };
  const LS_CART = 'me_cart_v1';
  const LS_PLAN = 'me_plan_v1';
  const productos = window.ME_PRODUCTOS || [];
  const porId = Object.fromEntries(productos.map(p => [p.id, p]));

  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');

  function leer(k, def) {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; }
  }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado */ } }

  let plan = leer(LS_PLAN, 250);
  if (!PLANES.includes(plan)) plan = 250;
  let cart = leer(LS_CART, []).filter(it => porId[it.id]);
  const subs = new Set();
  const emitir = () => subs.forEach(fn => fn());

  /* Cuota de un producto en un plan. Si ese plan no está publicado en el flyer,
     devuelve el plan más largo disponible que no supere al elegido (o el más corto). */
  function cuota(p, d = plan) {
    if (p.q) return null;
    if (p.p[d]) return { d, v: p.p[d], exacto: true };
    const disp = PLANES.filter(x => p.p[x]);
    if (!disp.length) return null;
    const menor = disp.filter(x => x < d);
    const alt = menor.length ? menor[menor.length - 1] : disp[0];
    return { d: alt, v: p.p[alt], exacto: false };
  }

  const Store = {
    WA, PLANES, RUBROS, productos, porId, fmt, cuota,
    get plan() { return plan; },
    setPlan(d) { if (PLANES.includes(d) && d !== plan) { plan = d; guardar(LS_PLAN, d); emitir(); } },
    get cart() { return cart; },
    add(id, qty = 1) {
      const it = cart.find(x => x.id === id);
      if (it) it.qty = Math.min(20, it.qty + qty); else cart.push({ id, qty });
      guardar(LS_CART, cart); emitir();
    },
    setQty(id, qty) {
      cart = qty <= 0 ? cart.filter(x => x.id !== id) : cart.map(x => x.id === id ? { id, qty: Math.min(20, qty) } : x);
      guardar(LS_CART, cart); emitir();
    },
    clear() { cart = []; guardar(LS_CART, cart); emitir(); },
    count() { return cart.reduce((a, x) => a + x.qty, 0); },
    /* Total por día del carrito. Cada línea usa su cuota real (puede caer a otro plan). */
    resumen(d = plan) {
      let dia = 0, consultar = 0, ajustados = 0;
      const lineas = cart.map(it => {
        const p = porId[it.id]; const c = cuota(p, d);
        if (!c) consultar++; else { dia += c.v * it.qty; if (!c.exacto) ajustados++; }
        return { p, qty: it.qty, c };
      });
      return { lineas, dia, consultar, ajustados };
    },
    on(fn) { subs.add(fn); return () => subs.delete(fn); },
    waLink(texto) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto); },
    mensajePedido(datos = {}) {
      const r = Store.resumen();
      const l = ['Hola Mueblería Express! Quiero hacer este pedido 🚚', ''];
      r.lineas.forEach(({ p, qty, c }) => {
        const precio = c ? `${fmt(c.v)}/día × ${c.d} días` : 'a consultar';
        l.push(`• ${qty} × ${p.n} — ${precio}`);
      });
      l.push('');
      if (r.dia) l.push(`Total estimado: ${fmt(r.dia)} por día (plan ${plan} días)`);
      if (r.consultar) l.push(`(${r.consultar} producto/s a consultar precio)`);
      if (datos.negocio) l.push(`Negocio: ${datos.negocio}`);
      if (datos.rubro) l.push(`Rubro: ${datos.rubro}`);
      if (datos.zona) l.push(`Localidad: ${datos.zona}`);
      return l.join('\n');
    },
    mensajeProducto(p) {
      const c = cuota(p);
      return `Hola! Me interesa: ${p.n}${c ? ` — ${fmt(c.v)} por día en ${c.d} días` : ' (consultar precio)'}. ¿Está disponible?`;
    }
  };

  window.ME = Store;
})();
