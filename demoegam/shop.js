/* EGAM · tienda compartida (home + /catalogo/): pedido, ficha y WhatsApp */
(function () {
  const D = window.EGAM;
  const BASE = document.documentElement.dataset.base || './';
  const KEY = 'egam-pedido-v1';
  const MKEY = 'egam-modo';
  const byId = Object.fromEntries(D.products.map(p => [p.id, p]));
  const catName = Object.fromEntries(D.cats.map(c => [c.id, c.name]));

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  let cart = store.get(KEY, []).filter(l => byId[l.id]);
  let mode = store.get(MKEY, 'menor');
  const listeners = [];

  const presOf = (p, m) => D.pres[p.pres || 'granel'][m || mode];
  const img = p => `${BASE}img/${p.img}.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function save() { store.set(KEY, cart); paint(); listeners.forEach(f => f()); }
  function count() { return cart.reduce((a, l) => a + l.qty, 0); }

  function add(id, pres, qty, m) {
    const p = byId[id]; if (!p) return;
    m = m || mode; pres = pres || presOf(p, m)[0]; qty = Math.max(1, qty || 1);
    const ex = cart.find(l => l.id === id && l.pres === pres && l.mode === m);
    if (ex) ex.qty += qty; else cart.push({ id, pres, qty, mode: m });
    save(); toast(`<b>${esc(p.name)}</b> · ${esc(pres)} al pedido`); bump();
  }

  function setMode(m) {
    if (m !== 'menor' && m !== 'mayor') return;
    mode = m; store.set(MKEY, m);
    document.documentElement.dataset.mode = m;
    document.querySelectorAll('[data-setmode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setmode === m));
    listeners.forEach(f => f());
  }

  /* ---------- toast ---------- */
  let tEl, tT;
  function toast(html) {
    if (!tEl) { tEl = document.createElement('div'); tEl.className = 'toast'; tEl.setAttribute('role', 'status'); document.body.appendChild(tEl); }
    tEl.innerHTML = html; tEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => tEl.classList.remove('on'), 2200);
  }
  function bump() {
    document.querySelectorAll('.cart-btn').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }

  /* ---------- tarjeta de producto ---------- */
  function card(p, opts = {}) {
    const pres = presOf(p);
    const el = document.createElement('article');
    el.className = 'pcard reveal';
    el.dataset.id = p.id;
    el.innerHTML = `
      <button class="pcard-img" data-info="${p.id}" aria-label="Ver info de ${esc(p.name)}">
        <img src="${img(p)}" alt="${esc(p.name)}" loading="lazy" width="800" height="800">
        ${p.tag ? `<span class="pcard-tag">${esc(p.tag)}</span>` : ''}
        <span class="pcard-more">Ver info</span>
      </button>
      <div class="pcard-body">
        <p class="pcard-cat">${esc(catName[p.cat])}</p>
        <h3 class="pcard-name">${esc(p.name)}</h3>
        <p class="pcard-desc">${esc(p.desc)}</p>
        <div class="pcard-pres" role="radiogroup" aria-label="Presentación">
          ${pres.map((x, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-pres="${esc(x)}">${esc(x)}</button>`).join('')}
        </div>
        <div class="pcard-foot">
          <span class="pcard-price">Precio <em>a consultar</em></span>
          <button type="button" class="pcard-add" data-add="${p.id}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Agregar</span>
          </button>
        </div>
      </div>`;
    el.addEventListener('click', e => {
      const pb = e.target.closest('[data-pres]');
      if (pb) { el.querySelectorAll('[data-pres]').forEach(b => b.setAttribute('aria-checked', b === pb)); return; }
      if (e.target.closest('[data-add]')) {
        const sel = el.querySelector('[data-pres][aria-checked="true"]');
        add(p.id, sel && sel.dataset.pres);
        return;
      }
      if (e.target.closest('[data-info]')) openInfo(p.id);
    });
    return el;
  }

  /* ---------- ficha (modal) ---------- */
  let modal;
  function openInfo(id) {
    const p = byId[id]; if (!p) return;
    if (!modal) {
      modal = document.createElement('dialog'); modal.className = 'pmodal';
      document.body.appendChild(modal);
      modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
    }
    const wine = p.cat === 'vinos';
    const row = m => `
      <div class="pm-mode">
        <h4>${m === 'menor' ? 'Por menor' : 'Por mayor'}</h4>
        <div class="pm-pres">${presOf(p, m).map(x => `<button type="button" data-madd="${m}" data-p="${esc(x)}">${esc(x)} <b>+</b></button>`).join('')}</div>
      </div>`;
    modal.innerHTML = `
      <div class="pm-card">
        <button class="pm-x" data-close aria-label="Cerrar">×</button>
        <div class="pm-img"><img src="${img(p)}" alt="${esc(p.name)}"></div>
        <div class="pm-body">
          <p class="pm-cat">${esc(catName[p.cat])}${p.tag ? ' · ' + esc(p.tag) : ''}</p>
          <h3>${esc(p.name)}</h3>
          <p class="pm-desc">${esc(p.desc)}</p>
          <dl class="pm-dl">
            <div><dt>${wine ? 'Va con' : 'Ideal para'}</dt><dd>${esc(p.uso)}</dd></div>
            <div><dt>${wine ? 'Servicio' : p.cat === 'cajas' ? 'Cómo es' : 'Aporta'}</dt><dd>${esc(p.aporta)}</dd></div>
            <div><dt>Conservación</dt><dd>${esc(p.conserva)}</dd></div>
          </dl>
          ${row('menor')}${row('mayor')}
          <p class="pm-note">Precio a consultar · varía según presentación y volumen.${wine ? ' Venta solo a mayores de 18 años.' : ''}</p>
          <a class="btn btn-wa pm-wa" target="_blank" rel="noopener" href="${waLink(D.sellers[0], `Hola EGAM! Quería consultar por *${p.name}*: precio y presentaciones.`)}">
            ${WA_SVG} Consultar este producto
          </a>
        </div>
      </div>`;
    modal.querySelectorAll('[data-madd]').forEach(b => b.addEventListener('click', () => {
      add(p.id, b.dataset.p, 1, b.dataset.madd); b.classList.add('ok'); setTimeout(() => b.classList.remove('ok'), 700);
    }));
    modal.showModal();
  }

  /* ---------- drawer del pedido ---------- */
  const WA_SVG = '<svg class="ico-wa" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.9 1 3.9.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4Z"/></svg>';
  function waLink(s, text) { return `https://wa.me/${s.phone}?text=${encodeURIComponent(text)}`; }

  let drawer;
  function buildDrawer() {
    drawer = document.createElement('aside');
    drawer.className = 'drawer'; drawer.setAttribute('aria-label', 'Tu pedido'); drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="drawer-scrim" data-dclose></div>
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="dr-t">
        <header class="dr-head">
          <div><p class="dr-k">Nota de pedido</p><h2 id="dr-t">Tu pedido</h2></div>
          <button class="dr-x" data-dclose aria-label="Cerrar">×</button>
        </header>
        <div class="dr-lines"></div>
        <form class="dr-form" novalidate>
          <fieldset class="dr-seller">
            <legend>¿A quién se lo mandás?</legend>
            ${D.sellers.map((s, i) => `<label><input type="radio" name="seller" value="${s.id}" ${i === 0 ? 'checked' : ''}><span><b>${s.name}</b>${s.show}</span></label>`).join('')}
          </fieldset>
          <div class="dr-grid">
            <label>Nombre<input name="nombre" autocomplete="name" placeholder="Tu nombre"></label>
            <label>Localidad / provincia<input name="loc" placeholder="Ej: San Rafael, Mendoza"></label>
          </div>
          <div class="dr-ent">
            <label><input type="radio" name="ent" value="Envío a domicilio" checked><span>Envío</span></label>
            <label><input type="radio" name="ent" value="Retiro / coordino" ><span>Retiro / coordino</span></label>
          </div>
          <label class="dr-notes">Comentarios<textarea name="notas" rows="2" placeholder="Negocio, CUIT para mayorista, horario…"></textarea></label>
          <button class="btn btn-wa dr-send" type="submit">${WA_SVG} Enviar pedido por WhatsApp</button>
          <p class="dr-fine">Te respondemos con precios, stock y costo de envío. Sin compromiso.</p>
        </form>
      </div>`;
    document.body.appendChild(drawer);
    drawer.addEventListener('click', e => {
      if (e.target.closest('[data-dclose]')) return closeDrawer();
      const b = e.target.closest('[data-q]'); if (!b) return;
      const i = +b.dataset.i; const l = cart[i]; if (!l) return;
      if (b.dataset.q === 'del') cart.splice(i, 1); else { l.qty += +b.dataset.q; if (l.qty < 1) cart.splice(i, 1); }
      save();
    });
    drawer.querySelector('form').addEventListener('submit', e => { e.preventDefault(); send(new FormData(e.target)); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  }
  function openDrawer() { if (!drawer) buildDrawer(); paint(); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('no-scroll'); }
  function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('no-scroll'); }

  function paint() {
    const n = count();
    document.querySelectorAll('.cart-n').forEach(e => { e.textContent = n; e.parentElement.classList.toggle('has', n > 0); });
    if (!drawer) return;
    const box = drawer.querySelector('.dr-lines');
    if (!cart.length) {
      box.innerHTML = `<div class="dr-empty"><img src="${BASE}img/egam-crest-sm.webp" alt="" width="120" height="120"><p>Todavía no agregaste nada.</p><a class="btn btn-ghost" href="${BASE}catalogo/">Ir al catálogo</a></div>`;
      drawer.querySelector('.dr-send').disabled = true; return;
    }
    drawer.querySelector('.dr-send').disabled = false;
    const group = m => {
      const ls = cart.map((l, i) => ({ l, i })).filter(x => x.l.mode === m);
      if (!ls.length) return '';
      return `<section class="dr-group"><h3>${m === 'menor' ? 'Por menor' : 'Por mayor'}</h3>${ls.map(({ l, i }) => {
        const p = byId[l.id];
        return `<div class="dr-line"><img src="${img(p)}" alt="" width="56" height="56"><div class="dr-info"><b>${esc(p.name)}</b><span>${esc(l.pres)}</span></div>
          <div class="dr-qty"><button type="button" data-q="-1" data-i="${i}" aria-label="Menos">−</button><output>${l.qty}</output><button type="button" data-q="1" data-i="${i}" aria-label="Más">+</button></div>
          <button type="button" class="dr-del" data-q="del" data-i="${i}" aria-label="Quitar">×</button></div>`;
      }).join('')}</section>`;
    };
    box.innerHTML = group('menor') + group('mayor');
  }

  function send(fd) {
    const s = D.sellers.find(x => x.id === fd.get('seller')) || D.sellers[0];
    const lines = m => cart.filter(l => l.mode === m).map(l => `• ${l.qty} × ${byId[l.id].name} (${l.pres})`);
    const mn = lines('menor'), my = lines('mayor');
    let t = `Hola ${s.name}! Te hago un pedido desde la web de EGAM 🍷🥜\n`;
    if (mn.length) t += `\n*POR MENOR*\n${mn.join('\n')}\n`;
    if (my.length) t += `\n*POR MAYOR*\n${my.join('\n')}\n`;
    const nom = (fd.get('nombre') || '').trim(), loc = (fd.get('loc') || '').trim(), no = (fd.get('notas') || '').trim();
    t += `\nEntrega: ${fd.get('ent')}`;
    if (loc) t += `\nLocalidad: ${loc}`;
    if (nom) t += `\nNombre: ${nom}`;
    if (no) t += `\nComentarios: ${no}`;
    t += `\n\n¿Me pasás precios y costo de envío? Gracias!`;
    window.open(waLink(s, t), '_blank', 'noopener');
  }

  /* ---------- wiring común ---------- */
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-open-cart]'); if (c) { e.preventDefault(); openDrawer(); return; }
    const m = e.target.closest('[data-setmode]'); if (m) { setMode(m.dataset.setmode); return; }
    const i = e.target.closest('[data-open-info]'); if (i) { e.preventDefault(); openInfo(i.dataset.openInfo); }
  });
  window.addEventListener('storage', e => { if (e.key === KEY) { cart = store.get(KEY, []).filter(l => byId[l.id]); paint(); } });

  document.documentElement.dataset.mode = mode;
  document.addEventListener('DOMContentLoaded', () => { setMode(mode); paint(); });

  window.Shop = { add, card, openInfo, openDrawer, setMode, get mode() { return mode; }, onChange: f => listeners.push(f), byId, catName, presOf, img, waLink, WA_SVG, esc, toast };
})();
