/* Mueblería Express — núcleo compartido (home ↔ /catalogo/)
   Planes de pago diario y mensajes de WhatsApp por producto. Sin carrito: la consulta va directo al WhatsApp.

   Catálogo: se pide en vivo a CobrOS (lo que el negocio carga en su panel) y, si no responde a tiempo,
   se usa el respaldo local de productos.js. Convención en CobrOS:
   - precio      = cuota por día del plan de 85 días (0 = "consultar")
   - descripcion = specs separadas por " · " y una línea "Planes: 85 días $X · 155 días $Y · 250 días $Z"
   - categoria   = nombre del rubro (ver RUBROS; uno nuevo aparece solo como rubro extra)
   - codigo      = id del producto en la web (con eso usa la foto y el flyer locales) */
(function () {
  'use strict';

  const WA = '5493412773692';
  const API = 'https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico';
  const SLUG = 'muebleria-express';
  const TIMEOUT = 4000;
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
    herramientas: 'Herramientas y más',
    liquidacion: 'Liquidación y outlet'
  };
  const ORDEN = ['frio', 'mostradores', 'gastro', 'combos', 'carteleria', 'hogar', 'electro', 'tecno', 'herramientas', 'liquidacion'];
  const LS_PLAN = 'me_plan_v1';
  const B = window.ME_BASE || '';

  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');

  const respaldo = window.ME_PRODUCTOS || [];
  const locales = new Set(respaldo.map(p => p.id));
  const productos = respaldo.slice();
  const porId = {};
  const reindex = () => { Object.keys(porId).forEach(k => delete porId[k]); productos.forEach(p => { porId[p.id] = p; }); };
  reindex();

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

  /* ---------- CobrOS → formato de la web ---------- */
  const RE_PLAN = /(85|155|250)\s*d[ií]as?\s*:?\s*\$?\s*([\d.,]+)/gi;
  function rubroDe(cat) {
    const n = norm(cat);
    if (!n) return 'herramientas';
    const k = Object.keys(RUBROS).find(r => norm(RUBROS[r]) === n || r === n);
    if (k) return k;
    const nuevo = slug(cat);
    if (!RUBROS[nuevo]) { RUBROS[nuevo] = String(cat).trim(); ORDEN.push(nuevo); }
    return nuevo;
  }
  function desdeCobros(x) {
    const desc = String(x.descripcion || '');
    const p = {};
    let m;
    RE_PLAN.lastIndex = 0;
    while ((m = RE_PLAN.exec(desc))) { const v = +m[2].replace(/[.,]/g, ''); if (v > 0) p[m[1]] = v; }
    if (!Object.keys(p).length && x.precio > 0) p[85] = x.precio;
    const spec = desc.split('\n').filter(l => !/^\s*(planes?|precio)\s*:/i.test(l)).join(' · ').replace(/\s*·\s*$/, '').trim();
    const cod = String(x.codigo || '').trim();
    const id = cod || String(x._id);
    return {
      id, n: String(x.nombre || '').trim(), s: spec, c: rubroDe(x.categoria), p, q: !Object.keys(p).length,
      foto: locales.has(id) ? '' : (x.foto || '')
    };
  }

  function cargar() {
    const ctl = 'AbortController' in window ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), TIMEOUT);
    return fetch(`${API}/catalogo/${SLUG}`, ctl ? { signal: ctl.signal } : {})
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => {
        const lista = (d.productos || []).map(desdeCobros).filter(p => p.n);
        if (!lista.length) return;          // cuenta vacía o recién creada: queda el respaldo
        productos.length = 0; productos.push(...lista); reindex();
      })
      .catch(() => { /* sin conexión / timeout: queda el respaldo */ })
      .finally(() => clearTimeout(t));
  }

  const waLink = texto => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);

  window.ME = {
    WA, PLANES, RUBROS, productos, porId, fmt, cuota, waLink,
    get ORDEN() { return ORDEN.filter(r => productos.some(p => p.c === r)); },
    ready: cargar(),
    img(p) { return p.foto || `${B}img/p/${p.id}.jpg`; },
    flyer(p) { return p.foto || `${B}img/f/${p.id}.jpg`; },
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
