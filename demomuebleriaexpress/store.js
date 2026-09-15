/* Mueblería Express — núcleo compartido (home ↔ /catalogo/)
   Planes de pago diario y mensajes de WhatsApp por producto. Sin carrito: la consulta va directo al WhatsApp. */
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
  const LS_PLAN = 'me_plan_v1';
  const productos = window.ME_PRODUCTOS || [];
  const porId = Object.fromEntries(productos.map(p => [p.id, p]));

  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');

  let plan = 250;
  try { const v = +localStorage.getItem(LS_PLAN); if (PLANES.includes(v)) plan = v; } catch (e) { /* modo privado */ }
  const subs = new Set();

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

  const waLink = texto => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);

  window.ME = {
    WA, PLANES, RUBROS, productos, porId, fmt, cuota, waLink,
    get plan() { return plan; },
    setPlan(d) {
      if (!PLANES.includes(d) || d === plan) return;
      plan = d;
      try { localStorage.setItem(LS_PLAN, String(d)); } catch (e) { /* modo privado */ }
      subs.forEach(fn => fn());
    },
    on(fn) { subs.add(fn); return () => subs.delete(fn); },
    mensajeProducto(p) {
      const c = cuota(p);
      return `Hola Mueblería Express! Me interesa: ${p.n}${c ? ` — ${fmt(c.v)} por día en el plan de ${c.d} días` : ' (consultar precio)'}. ¿Está disponible?`;
    },
    linkProducto(p) { return waLink(this.mensajeProducto(p)); }
  };
})();
