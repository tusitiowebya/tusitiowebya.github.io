/* Mueblería Express — UI compartida: tarjetas, ficha, ticket de pedido, planes y toast. */
(function () {
  'use strict';
  const ME = window.ME;
  const B = window.ME_BASE || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function precioHTML(p) {
    const c = ME.cuota(p);
    if (!c) return '<div class="precio precio--q"><b>Consultar</b><span>precio por WhatsApp</span></div>';
    return `<div class="precio"><b>${ME.fmt(c.v)}</b><i>/día</i><span>${c.exacto ? 'plan' : 'solo en'} ${c.d} días</span></div>`;
  }

  function card(p) {
    return `<article class="card" data-id="${p.id}">
      <button class="card__img" type="button" data-ficha="${p.id}" aria-label="Ver ${esc(p.n)}">
        <img src="${B}img/p/${p.id}.jpg" alt="${esc(p.n)}" loading="lazy" width="560" height="560">
      </button>
      <div class="card__body">
        <small class="card__rubro">${ME.RUBROS[p.c]}</small>
        <h3 class="card__name"><button type="button" data-ficha="${p.id}">${esc(p.n)}</button></h3>
        <p class="card__spec">${esc(p.s)}</p>
        <div class="card__foot">${precioHTML(p)}
          <button class="add" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.n)} al pedido">
            <svg aria-hidden="true"><use href="#i-plus"/></svg></button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Markup inyectado (ficha + ticket + toast) ---------- */
  const shell = document.createElement('div');
  shell.innerHTML = `
  <dialog class="ficha" id="ficha" aria-label="Ficha de producto">
    <button class="ficha__x" type="button" data-close-ficha aria-label="Cerrar">×</button>
    <div class="ficha__grid" data-ficha-body></div>
  </dialog>
  <div class="scrim" data-close-cart hidden></div>
  <aside class="ticket" id="ticket" aria-label="Tu pedido" hidden>
    <div class="ticket__paper">
      <button class="ticket__x" type="button" data-close-cart aria-label="Cerrar pedido">×</button>
      <header class="ticket__head">
        <svg class="ticket__logo" aria-hidden="true"><use href="#truck"/></svg>
        <strong>MUEBLERÍA EXPRESS</strong>
        <span>PEDIDO · EXCLUSIVO NEGOCIOS</span>
        <span data-fecha></span>
      </header>
      <div class="ticket__plan"><span>PLAN DE PAGO</span>
        <div class="seg seg--ticket" data-plansel>
          ${ME.PLANES.map(d => `<button type="button" data-d="${d}">${d} días</button>`).join('')}
        </div>
      </div>
      <ol class="ticket__lines" data-lines></ol>
      <div class="ticket__total" data-total></div>
      <form class="ticket__form" data-pedido>
        <label>Nombre del negocio<input name="negocio" autocomplete="organization" placeholder="Ej: Kiosco Lo de Tito"></label>
        <label>Rubro<input name="rubro" placeholder="Kiosco, almacén, panadería…"></label>
        <label>Localidad<input name="zona" autocomplete="address-level2" placeholder="Rosario, Funes, VGG…"></label>
        <button class="btn btn--wa btn--block" type="submit"><svg aria-hidden="true"><use href="#i-wa"/></svg>Enviar pedido por WhatsApp</button>
      </form>
      <button class="ticket__vaciar" type="button" data-vaciar>Vaciar ticket</button>
      <p class="ticket__gracias">*** GRACIAS POR EQUIPAR TU NEGOCIO ***</p>
    </div>
  </aside>
  <div class="toast" role="status" aria-live="polite"><span class="toast__lines" aria-hidden="true"></span><svg aria-hidden="true"><use href="#truck"/></svg><b data-toast></b></div>`;
  document.body.append(...shell.children);

  const ficha = $('#ficha');
  const ticket = $('#ticket');
  const scrim = $('.scrim');
  const toastEl = $('.toast');
  let fichaId = null, fichaQty = 1, toastT;

  function toast(msg) {
    $('[data-toast]').textContent = msg;
    toastEl.classList.remove('is-on'); void toastEl.offsetWidth; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }

  /* ---------- Ficha ---------- */
  function renderFicha() {
    const p = ME.porId[fichaId]; if (!p) return;
    const filas = p.q ? '<p class="planes__q">Precio a consultar por WhatsApp.</p>' :
      `<table class="planes"><thead><tr><th>Plan</th><th>Cuota por día</th></tr></thead><tbody>${
        ME.PLANES.map(d => p.p[d]
          ? `<tr class="${d === ME.plan ? 'is-on' : ''}" data-setplan="${d}" tabindex="0"><td>${d} días</td><td><b>${ME.fmt(p.p[d])}</b></td></tr>`
          : `<tr class="is-na"><td>${d} días</td><td>no disponible</td></tr>`).join('')
      }</tbody></table>`;
    $('[data-ficha-body]').innerHTML = `
      <figure class="ficha__flyer"><img src="${B}img/f/${p.id}.jpg" alt="Flyer de ${esc(p.n)}" width="760" height="760"></figure>
      <div class="ficha__info">
        <small class="card__rubro">${ME.RUBROS[p.c]}</small>
        <h2>${esc(p.n)}</h2>
        <p class="ficha__spec">${esc(p.s)}</p>
        ${filas}
        <div class="ficha__acc">
          <div class="stepper"><button type="button" data-fq="-1" aria-label="Menos">−</button><output>${fichaQty}</output><button type="button" data-fq="1" aria-label="Más">+</button></div>
          <button class="btn btn--grad" type="button" data-ficha-add>Agregar al pedido</button>
        </div>
        <a class="btn btn--wa btn--block" href="${ME.waLink(ME.mensajeProducto(p))}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Consultar este producto</a>
        <p class="nota">Precios publicados por Mueblería Express (septiembre 2026). Se confirman al cerrar el pedido.</p>
      </div>`;
  }
  function openFicha(id) {
    fichaId = id; fichaQty = 1; renderFicha();
    if (typeof ficha.showModal === 'function') ficha.showModal(); else ficha.setAttribute('open', '');
  }
  function closeFicha() { if (ficha.open) ficha.close(); }
  ficha.addEventListener('click', e => { if (e.target === ficha) closeFicha(); });

  /* ---------- Ticket ---------- */
  function fecha() {
    const d = new Date();
    return d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
  function renderTicket() {
    $('[data-fecha]').textContent = fecha();
    const r = ME.resumen();
    const lines = $('[data-lines]');
    if (!r.lineas.length) {
      lines.innerHTML = '<li class="ticket__vacio">Tu ticket está vacío.<br>Sumá productos desde la tienda.</li>';
    } else {
      lines.innerHTML = r.lineas.map(({ p, qty, c }) => `
        <li class="tline">
          <div class="tline__top"><span class="tline__n">${esc(p.n)}</span><span class="tline__v">${c ? ME.fmt(c.v * qty) : 'CONSULTAR'}</span></div>
          <div class="tline__sub">
            <span class="tline__qty"><button type="button" data-qty="${p.id}" data-dq="-1" aria-label="Quitar uno">−</button>${qty}<button type="button" data-qty="${p.id}" data-dq="1" aria-label="Sumar uno">+</button></span>
            <span>${c ? `${ME.fmt(c.v)}/día${c.exacto ? '' : ` · en ${c.d} días`}` : 'precio a consultar'}</span>
          </div>
        </li>`).join('');
    }
    $('[data-total]').innerHTML = r.lineas.length ? `
      <div><span>ARTÍCULOS</span><span>${ME.count()}</span></div>
      <div class="ticket__big"><span>TOTAL POR DÍA</span><span>${ME.fmt(r.dia)}</span></div>
      ${r.ajustados ? `<p>* ${r.ajustados} producto/s no tienen plan de ${ME.plan} días: se toma el plan disponible.</p>` : ''}
      ${r.consultar ? `<p>* ${r.consultar} producto/s con precio a consultar.</p>` : ''}` : '';
    $('[data-pedido]').hidden = !r.lineas.length;
    $('[data-vaciar]').hidden = !r.lineas.length;
  }
  function openCart() {
    renderTicket();
    ticket.hidden = false; scrim.hidden = false;
    requestAnimationFrame(() => { ticket.classList.add('is-open'); scrim.classList.add('is-open'); });
    document.documentElement.classList.add('no-scroll');
  }
  function closeCart() {
    ticket.classList.remove('is-open'); scrim.classList.remove('is-open');
    document.documentElement.classList.remove('no-scroll');
    setTimeout(() => { if (!ticket.classList.contains('is-open')) { ticket.hidden = true; scrim.hidden = true; } }, 420);
  }

  $('[data-pedido]').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const datos = Object.fromEntries([...f.entries()].map(([k, v]) => [k, String(v).trim()]));
    window.open(ME.waLink(ME.mensajePedido(datos)), '_blank', 'noopener');
  });

  /* ---------- Sincronía de planes y contadores ---------- */
  function syncPlan() {
    $$('[data-plansel] [data-d]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === ME.plan)));
    $$('[data-count]').forEach(el => { const n = ME.count(); el.textContent = n; el.hidden = !n; });
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-ficha],[data-open-cart],[data-close-cart],[data-close-ficha],[data-qty],[data-fq],[data-ficha-add],[data-vaciar],[data-plansel] [data-d],[data-setplan]');
    if (!t) return;
    if (t.matches('[data-plansel] [data-d]')) return ME.setPlan(+t.dataset.d);
    if (t.dataset.setplan) return ME.setPlan(+t.dataset.setplan);
    if (t.dataset.add) {
      ME.add(t.dataset.add);
      t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
      return toast('Sumado al ticket · ' + ME.porId[t.dataset.add].n);
    }
    if (t.dataset.ficha) return openFicha(t.dataset.ficha);
    if (t.hasAttribute('data-open-cart')) return openCart();
    if (t.hasAttribute('data-close-cart')) return closeCart();
    if (t.hasAttribute('data-close-ficha')) return closeFicha();
    if (t.dataset.qty) { const it = ME.cart.find(x => x.id === t.dataset.qty); return ME.setQty(t.dataset.qty, (it ? it.qty : 0) + (+t.dataset.dq)); }
    if (t.dataset.fq) { fichaQty = Math.max(1, Math.min(20, fichaQty + (+t.dataset.fq))); const o = $('.stepper output', ficha); if (o) o.textContent = fichaQty; return; }
    if (t.hasAttribute('data-ficha-add')) { ME.add(fichaId, fichaQty); closeFicha(); return toast(`Sumado al ticket · ${fichaQty} × ${ME.porId[fichaId].n}`); }
    if (t.hasAttribute('data-vaciar')) return ME.clear();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && ticket.classList.contains('is-open')) closeCart();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.setplan) { e.preventDefault(); ME.setPlan(+e.target.dataset.setplan); }
  });

  ME.on(() => { syncPlan(); if (!ticket.hidden) renderTicket(); if (ficha.open) renderFicha(); });
  syncPlan();

  /* Títulos que no entran (Android con letra del sistema agrandada): se achican hasta entrar. */
  function fitText() {
    $$('[data-fit]').forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 12 && n++ < 40) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
  }
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);

  /* Aparición al scrollear */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal(root = document) { $$('.rv:not(.in)', root).forEach(el => io ? io.observe(el) : el.classList.add('in')); }
  reveal();

  window.MEUI = { card, precioHTML, openFicha, openCart, toast, reveal, fitText, esc, $, $$ };
})();
