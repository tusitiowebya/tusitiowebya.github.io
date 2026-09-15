/* Mueblería Express — UI compartida: tarjetas, ficha de producto, planes y reveal.
   Cada producto consulta directo por WhatsApp (sin carrito). */
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
          <a class="wa-mini" href="${ME.linkProducto(p)}" target="_blank" rel="noopener" aria-label="Consultar ${esc(p.n)} por WhatsApp">
            <svg aria-hidden="true"><use href="#i-wa"/></svg></a>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Ficha (dialog inyectado) ---------- */
  const ficha = document.createElement('dialog');
  ficha.className = 'ficha'; ficha.id = 'ficha'; ficha.setAttribute('aria-label', 'Ficha de producto');
  ficha.innerHTML = '<button class="ficha__x" type="button" data-close-ficha aria-label="Cerrar">×</button><div class="ficha__grid" data-ficha-body></div>';
  document.body.append(ficha);
  let fichaId = null;

  function renderFicha() {
    const p = ME.porId[fichaId]; if (!p) return;
    const filas = p.q ? '<p class="planes__q">Precio a consultar por WhatsApp.</p>' :
      `<table class="planes"><thead><tr><th>Plan</th><th>Cuota por día</th></tr></thead><tbody>${
        ME.PLANES.map(d => p.p[d]
          ? `<tr class="${d === ME.plan ? 'is-on' : ''}" data-setplan="${d}" tabindex="0"><td>${d} días</td><td><b>${ME.fmt(p.p[d])}</b></td></tr>`
          : `<tr class="is-na"><td>${d} días</td><td>no disponible</td></tr>`).join('')
      }</tbody></table>`;
    $('[data-ficha-body]', ficha).innerHTML = `
      <figure class="ficha__flyer"><img src="${B}img/f/${p.id}.jpg" alt="Flyer de ${esc(p.n)}" width="760" height="760"></figure>
      <div class="ficha__info">
        <small class="card__rubro">${ME.RUBROS[p.c]}</small>
        <h2>${esc(p.n)}</h2>
        <p class="ficha__spec">${esc(p.s)}</p>
        ${filas}
        <a class="btn btn--wa btn--block" href="${ME.linkProducto(p)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Consultar o pedir por WhatsApp</a>
        <p class="nota">Tocá un plan para elegirlo: el mensaje sale con ese plan. Precios de septiembre 2026, se confirman por WhatsApp.</p>
      </div>`;
  }
  function openFicha(id) {
    fichaId = id; renderFicha();
    if (typeof ficha.showModal === 'function') ficha.showModal(); else ficha.setAttribute('open', '');
  }
  ficha.addEventListener('click', e => { if (e.target === ficha) ficha.close(); });

  /* ---------- Planes ---------- */
  function syncPlan() {
    $$('[data-plansel] [data-d]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === ME.plan)));
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-ficha],[data-close-ficha],[data-plansel] [data-d],[data-setplan]');
    if (!t) return;
    if (t.matches('[data-plansel] [data-d]')) return ME.setPlan(+t.dataset.d);
    if (t.dataset.setplan) return ME.setPlan(+t.dataset.setplan);
    if (t.dataset.ficha) return openFicha(t.dataset.ficha);
    if (t.hasAttribute('data-close-ficha')) return ficha.close();
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.setplan) { e.preventDefault(); ME.setPlan(+e.target.dataset.setplan); }
  });

  ME.on(() => { syncPlan(); if (ficha.open) renderFicha(); });
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

  window.MEUI = { card, precioHTML, openFicha, reveal, fitText, esc, $, $$ };
})();
