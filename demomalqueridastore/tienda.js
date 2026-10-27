/* Lógica compartida por la portada y /catalogo/: datos, elegidas, WhatsApp. */
(() => {
  'use strict';
  const cfg = window.MALQUERIDA;
  const script = document.currentScript;
  const base = new URL('./', script.src);
  const PUBLIC_BASE = 'https://tusitiowebya.github.io/demomalqueridastore/';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fallbackImage = new URL('media/emblem.png', base).href;
  const safeImage = value => {
    if (typeof value !== 'string' || !value) return fallbackImage;
    if (/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(value)) return value;
    try { const url = new URL(value, base); return ['http:', 'https:'].includes(url.protocol) ? url.href : fallbackImage; }
    catch { return fallbackImage; }
  };
  const dateLabel = iso => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return d && m ? `${Number(d)}/${Number(m)}` : '';
  };
  const money = p => p.price === null || p.price <= 0 ? 'A consultar'
    : new Intl.NumberFormat('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0}).format(p.price);

  const local = (window.MALQUERIDA_PRENDAS || []).map(p => ({
    ...p, image: new URL(p.image, base).href, publicImage: new URL(p.image, PUBLIC_BASE).href,
    price: null, unavailable: false, preview: true
  }));

  const storeKey = 'malquerida-elegidas-v2-' + (cfg.slug || 'vidriera');
  let selected = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || '[]');
    if (Array.isArray(saved)) selected = new Set(saved.filter(x => typeof x === 'string').slice(0, 60));
  } catch {}
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn());
  const persist = () => { try { localStorage.setItem(storeKey, JSON.stringify([...selected])); } catch {} };

  const MQ = {
    cfg, base, $, $$, esc, normalize, money, dateLabel,
    products: [],
    selected,
    onChange(fn) { listeners.add(fn); },
    has: id => selected.has(id),
    toggle(id) {
      const p = MQ.products.find(x => x.id === id);
      if (!p || p.unavailable) return null;
      const had = selected.has(id);
      if (had) selected.delete(id); else selected.add(id);
      persist(); notify();
      return !had;
    },
    remove(id) { selected.delete(id); persist(); notify(); },
    clear() { selected.clear(); persist(); notify(); },
    chosen: () => MQ.products.filter(p => selected.has(p.id)),
    wa: text => 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(text),

    message(list, extra = {}) {
      let text = 'Hola, MalqueridaStore. ' + (list.length ? 'Me gustaron estas prendas:' : 'Quiero consultar por las prendas disponibles.');
      list.forEach((p, i) => {
        text += '\n\n' + (i + 1) + '. ' + p.name;
        if (p.preview) text += '\nVista en Instagram' + (p.seen ? ' el ' + dateLabel(p.seen) : '') + ': ' + p.source + '\nFoto: ' + p.publicImage;
        else text += '\nReferencia: ' + p.id + '\nPrecio publicado: ' + money(p);
      });
      if (list.length) text += '\n\n¿Me confirman si siguen disponibles, el precio, el talle y el estado?';
      if (extra.width || extra.length) {
        text += '\n\nMedidas de una prenda mía que me queda bien (extendida sobre una mesa):';
        if (extra.width) text += '\nAncho de axila a axila: ' + extra.width + ' cm.';
        if (extra.length) text += '\nLargo de hombro a ruedo: ' + extra.length + ' cm.';
      }
      if (extra.note) text += '\n\nMi consulta: ' + extra.note;
      return text;
    },

    async load() {
      if (!cfg.slug) { MQ.products = local; return {kind: 'ready', source: 'instagram'}; }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
      try {
        const res = await fetch(cfg.api + '/catalogo/' + encodeURIComponent(cfg.slug), {signal: controller.signal, credentials: 'omit'});
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!Array.isArray(data.productos)) throw new Error('Respuesta inválida');
        MQ.products = data.productos.filter(p => p && p._id && p.nombre && p.activo !== false).map(p => {
          const image = safeImage(p.foto);
          const price = p.precio !== null && p.precio !== undefined && p.precio !== '' && Number.isFinite(Number(p.precio)) && Number(p.precio) > 0 ? Number(p.precio) : null;
          return {
            id: String(p._id), name: String(p.nombre), category: String(p.categoria || 'Prendas'),
            description: String(p.descripcion || 'Consultanos por las medidas, el talle y el estado de esta prenda.'),
            image, publicImage: image, price, preview: false, source: '', seen: '',
            unavailable: p.controlaStock === true && p.stock !== null && p.stock !== undefined && Number.isFinite(Number(p.stock)) && Number(p.stock) <= 0
          };
        });
        const ids = new Set(MQ.products.map(p => p.id));
        [...selected].forEach(id => { if (!ids.has(id)) selected.delete(id); });
        persist();
        return {kind: MQ.products.length ? 'ready' : 'empty', source: 'cobros'};
      } catch (error) {
        MQ.products = [];
        return {kind: 'error', timeout: error.name === 'AbortError'};
      } finally { clearTimeout(timer); notify(); }
    },

    toast(text) {
      const el = $('#toast'); if (!el) return;
      clearTimeout(MQ._t); el.textContent = text; el.hidden = false;
      MQ._t = setTimeout(() => { el.hidden = true; }, 2600);
    },
    openDialog(dialog) { MQ._last = document.activeElement; if (!dialog.open) dialog.showModal(); },
    closeDialog(dialog) { dialog.close(); if (MQ._last?.isConnected) MQ._last.focus(); }
  };

  /* "Avisame cuando entre": lista de espera por WhatsApp */
  MQ.initWaitlist = root => {
    if (!root) return;
    const form = $('form', root), preview = $('[data-wait-preview]', root), link = $('[data-wait-send]', root), status = $('[data-wait-status]', root);
    const pick = name => $$(`[name="${name}"]:checked`, form).map(i => i.value);
    const build = () => {
      const kinds = pick('prenda'), sizes = pick('talle');
      const style = $('[name="estilo"]', form).value.trim(), zone = $('[name="zona"]', form).value.trim();
      let text = 'Hola, MalqueridaStore. Quiero que me avisen cuando entre algo así:';
      text += '\n\nPrenda: ' + (kinds.length ? kinds.join(', ') : 'lo que sea, me sorprenden');
      text += '\nTalle: ' + (sizes.length ? sizes.join(', ') : 'a definir');
      if (style) text += '\nColores o estilo: ' + style;
      if (zone) text += '\nRetiro / envío: ' + zone;
      text += '\n\n¿Me escriben cuando ingrese algo que vaya conmigo?';
      return {text, ok: kinds.length || sizes.length || style};
    };
    const update = () => {
      const {text, ok} = build();
      preview.textContent = text; link.href = MQ.wa(text);
      link.setAttribute('aria-disabled', String(!ok));
      status.textContent = ok ? '' : 'Elegí al menos una prenda, un talle o contanos qué buscás.';
    };
    form.addEventListener('submit', e => e.preventDefault());
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    link.addEventListener('click', e => {
      if (link.getAttribute('aria-disabled') === 'true') { e.preventDefault(); status.textContent = 'Elegí al menos una prenda, un talle o contanos qué buscás.'; $('input', form).focus(); }
    });
    update();
    status.textContent = '';
  };

  /* Menú, año, reveal, sincronización entre pestañas */
  document.addEventListener('DOMContentLoaded', () => {
    const menu = $('.menu-button'), nav = $('#navigation');
    if (menu && nav) {
      const close = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('is-open'); };
      menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        nav.classList.toggle('is-open', open);
      });
      nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      document.addEventListener('click', e => { if (!e.target.closest('.header')) close(); });
    }
    $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }), {threshold: .08});
      $$('[data-reveal]').forEach(el => { el.classList.add('reveal'); io.observe(el); });
    }
    $$('dialog').forEach(d => d.addEventListener('click', e => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) MQ.closeDialog(d);
    }));
    $$('[data-close]').forEach(b => b.addEventListener('click', () => MQ.closeDialog(b.closest('dialog'))));
  });
  window.addEventListener('storage', e => {
    if (e.key !== storeKey) return;
    try {
      const s = JSON.parse(e.newValue || '[]');
      if (Array.isArray(s)) { selected.clear(); s.forEach(id => selected.add(id)); notify(); }
    } catch {}
  });

  /* Tarjeta con etiqueta colgante */
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.2 12.9C.4 9 3.6 2.8 8.6 4.6c1.4.5 2.6 1.6 3.4 2.9.8-1.3 2-2.4 3.4-2.9 5-1.8 8.2 4.4 4.4 8.3Z"/></svg>';
  MQ.heart = heart;
  MQ.card = (p, i, opts = {}) => `
    <article class="prenda${p.unavailable ? ' is-out' : ''}" data-id="${esc(p.id)}">
      <span class="prenda-hook" aria-hidden="true"></span>
      <button class="prenda-photo" type="button" data-detail="${esc(p.id)}" aria-label="Ver ficha: ${esc(p.name)}">
        <img src="${esc(p.image)}" width="600" height="800" loading="${opts.eager ? 'eager' : 'lazy'}" alt="${esc(p.name)}${p.preview ? ', en la vidriera de MalqueridaStore' : ''}">
      </button>
      <span class="prenda-tag" aria-hidden="true"><i></i>Nº ${String(i + 1).padStart(2, '0')}</span>
      <button class="prenda-heart" type="button" data-fav="${esc(p.id)}" aria-pressed="${selected.has(p.id)}" aria-label="${selected.has(p.id) ? 'Quitar' : 'Guardar'} ${esc(p.name)} en mis elegidas" ${p.unavailable ? 'disabled' : ''}>${heart}</button>
      <div class="prenda-meta">
        <p class="prenda-cat">${esc(p.category)}</p>
        <h3>${esc(p.name)}</h3>
        <p class="prenda-price">${p.unavailable ? 'Ya se fue' : esc(money(p))}${p.preview && p.seen ? ` <small>· vidriera ${dateLabel(p.seen)}</small>` : ''}</p>
      </div>
    </article>`;

  MQ.syncHearts = () => {
    $$('[data-fav]').forEach(b => {
      const p = MQ.products.find(x => x.id === b.dataset.fav); if (!p) return;
      const on = selected.has(p.id);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', (on ? 'Quitar ' : 'Guardar ') + p.name + ' en mis elegidas');
    });
    $$('[data-count]').forEach(e => { e.textContent = selected.size ? MQ.chosen().length : 0; });
    $$('[data-bag-open]').forEach(b => b.classList.toggle('has-items', MQ.chosen().length > 0));
  };

  /* Ficha */
  MQ.detail = id => {
    const p = MQ.products.find(x => x.id === id), dialog = $('#fichaDialog'); if (!p || !dialog) return;
    const on = selected.has(p.id);
    $('#fichaBody').innerHTML = `
      <div class="ficha">
        <figure class="ficha-photo"><img src="${esc(p.image)}" width="600" height="800" alt="${esc(p.name)}"></figure>
        <div class="ficha-copy">
          <p class="kicker">${p.preview ? 'Vidriera · Av. de Mayo 817' : 'Catálogo MalqueridaStore'}</p>
          <h2 id="fichaTitle">${esc(p.name)}</h2>
          <p>${esc(p.description)}</p>
          <dl class="ficha-data">
            <div><dt>Precio</dt><dd>${p.unavailable ? 'Ya se fue' : esc(money(p))}</dd></div>
            <div><dt>Talle y medidas</dt><dd>Te las pasamos por WhatsApp</dd></div>
            <div><dt>Categoría</dt><dd>${esc(p.category)}</dd></div>
            ${p.seen ? `<div><dt>En vidriera</dt><dd>${dateLabel(p.seen)}</dd></div>` : ''}
          </dl>
          <p class="ficha-note">${p.preview ? 'Es una pieza única que mostramos en Instagram: puede haberse vendido. Te confirmamos si sigue antes de que vengas o pagues.' : 'Guardarla en tus elegidas no la reserva. Te confirmamos disponibilidad al consultar.'}</p>
          <div class="ficha-actions">
            <a class="btn btn-bordo" href="${esc(MQ.wa(MQ.message([p])))}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
            <button class="btn btn-line" type="button" data-fav="${esc(p.id)}" aria-pressed="${on}" ${p.unavailable ? 'disabled' : ''}>${heart}<span>${on ? 'En tus elegidas' : 'Guardar en elegidas'}</span></button>
          </div>
          ${p.source ? `<a class="ficha-source" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Ver la publicación en Instagram ↗</a>` : ''}
        </div>
      </div>`;
    MQ.openDialog(dialog);
  };

  /* Mis elegidas */
  MQ.initBag = () => {
    const dialog = $('#bagDialog'); if (!dialog) return;
    const rows = $('#bagRows'), send = $('#bagSend'), pre = $('#bagPreview'), status = $('#bagStatus');
    const w = $('#bagWidth'), l = $('#bagLength'), note = $('#bagNote'), clear = $('#bagClear');
    const valid = i => !i.value || (i.validity.valid && Number(i.value) > 0);
    const render = () => {
      const list = MQ.chosen();
      rows.innerHTML = list.length ? list.map(p => `
        <li class="bag-row"><img src="${esc(p.image)}" width="60" height="80" alt=""><div><strong>${esc(p.name)}</strong><span>${p.preview ? 'Vista en vidriera · a confirmar' : esc(money(p))}</span></div>
        <button type="button" data-remove="${esc(p.id)}" aria-label="Quitar ${esc(p.name)}">×</button></li>`).join('')
        : '<li class="bag-empty">Todavía no guardaste ninguna. Tocá el corazón de las prendas que te gusten y consultá por todas juntas.</li>';
      clear.hidden = !list.length;
      const text = MQ.message(list, {width: valid(w) ? w.value : '', length: valid(l) ? l.value : '', note: note.value.trim()});
      pre.textContent = text; send.href = MQ.wa(text);
      send.querySelector('span').textContent = list.length ? `Consultar ${list.length === 1 ? 'mi elegida' : 'mis ' + list.length + ' elegidas'}` : 'Consultar qué hay disponible';
      status.textContent = [w, l].some(i => !valid(i)) ? 'Revisá las medidas: centímetros positivos, en pasos de 0,5.' : '';
    };
    rows.addEventListener('click', e => { const b = e.target.closest('[data-remove]'); if (b) MQ.remove(b.dataset.remove); });
    [w, l, note].forEach(i => i.addEventListener('input', render));
    clear.addEventListener('click', () => { MQ.clear(); MQ.toast('Vaciaste tus elegidas.'); });
    send.addEventListener('click', e => { const bad = [w, l].find(i => !valid(i)); if (bad) { e.preventDefault(); bad.reportValidity(); } });
    MQ.onChange(render);
    MQ.onChange(MQ.syncHearts);
    document.addEventListener('click', e => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.hasAttribute('data-bag-open')) { render(); MQ.openDialog(dialog); }
      if (t.hasAttribute('data-detail')) MQ.detail(t.dataset.detail);
      if (t.hasAttribute('data-fav')) {
        const p = MQ.products.find(x => x.id === t.dataset.fav);
        const now = MQ.toggle(t.dataset.fav);
        if (now === null) return;
        MQ.toast(now ? 'Guardada en tus elegidas ♥' : 'La sacaste de tus elegidas.');
        const label = t.querySelector('span');
        if (label && p) label.textContent = now ? 'En tus elegidas' : 'Guardar en elegidas';
        if (now) { t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); }
      }
    });
    render();
  };

  window.MQ = MQ;
})();
