/* EGAM · home */
(function () {
  const D = window.EGAM, S = window.Shop;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (/[?&]qa\b/.test(location.search)) document.documentElement.classList.add('qa');

  /* ---------- nav + WhatsApp flotante ---------- */
  const nav = $('#nav'), waF = $('#waFloat');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    if (waF) waF.classList.toggle('on', y > innerHeight * .6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  const observe = root => $$('.reveal:not(.in)', root).forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  /* ---------- etiqueta que se inclina con el mouse ---------- */
  const label = $('#label');
  if (label && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const hero = $('.hero');
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      label.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
      label.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
    });
    hero.addEventListener('mouseleave', () => { label.style.setProperty('--ry', '0deg'); label.style.setProperty('--rx', '0deg'); });
  }

  /* ---------- despensa ---------- */
  const tabs = $('#despTabs'), grid = $('#despGrid');
  let cat = 'frutos';
  tabs.innerHTML = D.cats.map(c => {
    const n = D.list.filter(p => p.cat === c.id).length;
    return `<button class="tab" role="tab" aria-selected="${c.id === cat}" data-cat="${c.id}">${c.name}<span>${n}</span></button>`;
  }).join('');
  function renderGrid() {
    grid.innerHTML = '';
    D.list.filter(p => p.cat === cat).slice(0, 8).forEach(p => grid.appendChild(S.card(p)));
    observe(grid);
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    cat = b.dataset.cat;
    $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', t === b));
    renderGrid();
  });
  S.onChange(renderGrid);   // al cambiar menor/mayor se re-arman las presentaciones
  renderGrid();

  /* ---------- armá tu caja ---------- */
  const FMT = { picada: { slots: 4, wine: true, name: 'Caja picada' }, regalo: { slots: 6, wine: true, name: 'Caja regalo' }, despensa: { slots: 6, wine: false, name: 'Caja despensa' } };
  const frutosP = D.list.filter(p => ['frutos', 'deshi'].includes(p.cat) || ['coco', 'granola'].includes(p.id));
  const vinosP = D.list.filter(p => p.cat === 'vinos');
  const box = { fmt: 'picada', items: [], wine: null, qty: 1 };
  const crate = $('#crate'), slots = $('#crateSlots'), bottle = $('#crateBottle');
  const cF = $('#cajaFrutos'), cV = $('#cajaVinos');

  const chip = p => `<button type="button" class="chip" data-p="${p.id}" aria-pressed="false"><img src="img/${p.img}.jpg" alt="" loading="lazy" width="28" height="28">${S.esc(p.name)}</button>`;
  cF.innerHTML = frutosP.map(chip).join('');
  cV.innerHTML = vinosP.map(chip).join('');

  const wineColor = { malbec: '#4A0B1C', cabernet: '#3A0A14', blend: '#55101F', blanco: '#D9C27A', rosado: '#E79A9A' };
  const bottleSvg = c => `<svg viewBox="0 0 60 190" aria-hidden="true"><path d="M24 4h12v40c0 8 14 14 14 34v100a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V78c0-20 14-26 14-34Z" fill="${c}" stroke="rgba(0,0,0,.35)"/><rect x="22" y="2" width="16" height="16" rx="2" fill="#8E5E22"/><rect x="13" y="104" width="34" height="46" rx="2" fill="#F7F0E3"/><text x="30" y="124" text-anchor="middle" font-family="Gloock,serif" font-size="9" fill="#3E0C18">EGAM</text><path d="M18 134h24" stroke="#C28A3B"/><path d="M40 80c4 10 4 70 0 90" stroke="rgba(255,255,255,.25)" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

  function paintBox() {
    const f = FMT[box.fmt];
    crate.dataset.fmt = box.fmt;
    slots.innerHTML = Array.from({ length: f.slots }, (_, i) => {
      const p = S.byId[box.items[i]];
      return `<div class="slot">${p ? `<img src="img/${p.img}.jpg" alt=""><b>${S.esc(p.name)}</b>` : ''}</div>`;
    }).join('');
    bottle.innerHTML = box.wine ? bottleSvg(wineColor[box.wine]) : '<span>Vino</span>';
    $('#cajaCount').textContent = `${box.items.length}/${f.slots}`;
    $$('.chip', cF).forEach(c => {
      const on = box.items.includes(c.dataset.p);
      c.setAttribute('aria-pressed', on);
      c.disabled = !on && box.items.length >= f.slots;
    });
    $$('.chip', cV).forEach(c => c.setAttribute('aria-pressed', c.dataset.p === box.wine));
    cV.classList.toggle('off', !f.wine); $('#cajaVinoLab').style.opacity = f.wine ? 1 : .3;
    $('#cajaQty').textContent = box.qty;
    const ready = box.items.length > 0;
    $('#cajaAdd').disabled = !ready;
    const left = f.slots - box.items.length;
    $('#cajaHint').textContent = !ready ? 'Tocá los productos de la izquierda para llenar la caja.'
      : left > 0 ? `Te ${left === 1 ? 'queda 1 lugar' : `quedan ${left} lugares`}${f.wine && !box.wine ? ' y falta el vino' : ''}.`
      : f.wine && !box.wine ? 'Caja llena. ¿Le sumás un vino?' : '¡Caja completa! Lista para pedir.';
    $('#cajaWa').href = S.waLink(D.sellers[0], boxText());
    $('#cajaWa').innerHTML = S.WA_SVG + ' Pedir esta caja';
  }
  function boxText() {
    const f = FMT[box.fmt];
    const it = box.items.map(id => `• ${S.byId[id].name}`).join('\n') || '• (a definir)';
    return `Hola EGAM! Quiero ${box.qty > 1 ? box.qty + ' cajas' : 'una caja'} armada desde la web:\n\n*${f.name}*\n${it}${f.wine ? `\n🍷 Vino: ${box.wine ? S.byId[box.wine].name : 'a elegir'}` : ''}\n\n¿Me pasás precio y envío?`;
  }
  $('#cajaFmt').addEventListener('click', e => {
    const b = e.target.closest('[data-fmt]'); if (!b) return;
    box.fmt = b.dataset.fmt;
    $$('#cajaFmt [data-fmt]').forEach(x => x.setAttribute('aria-checked', x === b));
    box.items = box.items.slice(0, FMT[box.fmt].slots);
    if (!FMT[box.fmt].wine) box.wine = null;
    paintBox();
  });
  cF.addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
    const id = b.dataset.p, i = box.items.indexOf(id);
    if (i >= 0) box.items.splice(i, 1); else box.items.push(id);
    paintBox();
  });
  cV.addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    box.wine = box.wine === b.dataset.p ? null : b.dataset.p; paintBox();
  });
  $$('[data-cq]').forEach(b => b.addEventListener('click', () => { box.qty = Math.max(1, Math.min(500, box.qty + +b.dataset.cq)); paintBox(); }));
  $('#cajaAdd').addEventListener('click', () => {
    const m = box.qty >= 10 ? 'mayor' : 'menor';
    const pres = `${FMT[box.fmt].name}: ${box.items.map(id => S.byId[id].name).join(', ')}${box.wine ? ' + ' + S.byId[box.wine].name : ''}`;
    S.add('cajaarmada', pres, box.qty, m);
  });
  paintBox();

  /* ---------- maridaje ---------- */
  const CEPAS = [
    { id: 'malbec', name: 'Malbec', sub: 'Frutado, amable', c: '#5A0F24',
      note: 'Fruta roja madura y taninos suaves. Pide sabores tostados y dulces que no lo tapen.',
      with: ['nueces', 'higos', 'almendras'] },
    { id: 'cabernet', name: 'Cabernet', sub: 'Con cuerpo', c: '#3A0A14',
      note: 'Estructura y final largo. Le van frutos grasos y fruta oscura desecada.',
      with: ['avellanas', 'ciruelas', 'pasasmorochas'] },
    { id: 'blend', name: 'Blend', sub: 'Redondo', c: '#6B1A2E',
      note: 'Versátil, de mesa larga. Un mix bien armado lo acompaña de principio a fin.',
      with: ['mixclasico', 'datiles', 'nuecescascara'] },
    { id: 'blanco', name: 'Blanco', sub: 'Fresco, de altura', c: '#C9A94E',
      note: 'Acidez viva. Salados, verdes y frutas ácidas para mantener la frescura.',
      with: ['pistachos', 'orejones', 'castanas'] },
    { id: 'rosado', name: 'Rosado', sub: 'Liviano', c: '#D98484',
      note: 'Para el calor y la picada de verano. Frutos rojos y dulzor suave.',
      with: ['arandanos', 'almendras', 'mixfrutal'] }
  ];
  const mC = $('#marCepas'), mO = $('#marOut');
  mC.innerHTML = CEPAS.map((c, i) => `<button class="cepa" role="tab" aria-selected="${i === 0}" data-cepa="${c.id}" style="--c:${c.c}"><i></i><span><b>${c.name}</b><small>${c.sub}</small></span></button>`).join('');
  function paintCepa(id) {
    const c = CEPAS.find(x => x.id === id), w = S.byId[c.id];
    mO.style.setProperty('--c', c.c);
    mO.innerHTML = `
      <div class="mar-head"><h3>${c.name} +</h3><span>tres compañeros para la copa</span></div>
      <p class="mar-note">${c.note}</p>
      <div class="mar-list">${c.with.map(id => { const p = S.byId[id]; return `<div class="mar-item"><img src="img/${p.img}.jpg" alt="" loading="lazy"><div><b>${S.esc(p.name)}</b><button type="button" data-open-info="${p.id}">Ver info</button></div></div>`; }).join('')}</div>
      <div class="mar-acts">
        <button class="btn btn-vino" type="button" id="marAdd">Sumar los 3 + el ${c.name}</button>
        <button class="btn btn-line" type="button" data-open-info="${w.id}">Ver el vino</button>
      </div>`;
    $('#marAdd').addEventListener('click', () => { [...c.with, c.id].forEach(id => S.add(id)); S.toast(`<b>${c.name}</b> y sus 3 compañeros al pedido`); });
  }
  mC.addEventListener('click', e => {
    const b = e.target.closest('[data-cepa]'); if (!b) return;
    $$('.cepa', mC).forEach(x => x.setAttribute('aria-selected', x === b)); paintCepa(b.dataset.cepa);
  });
  paintCepa('malbec');

  /* ---------- envíos ---------- */
  const PROV = ['Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'];
  const sel = $('#envProv');
  sel.insertAdjacentHTML('beforeend', PROV.map(p => `<option>${p}</option>`).join(''));
  $('#envForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!sel.value) { sel.focus(); S.toast('Elegí tu provincia'); return; }
    window.open(S.waLink(D.sellers[0], `Hola EGAM! ¿Cuánto sale y cuánto tarda el envío a *${sel.value}*?`), '_blank', 'noopener');
  });

  /* ---------- fitText (letra grande de Android) ---------- */
  function fitText() {
    $$('.fit').forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 18 && n++ < 40) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
  }
  window.__egamFit = fitText;
  fitText(); document.fonts && document.fonts.ready.then(fitText);
  addEventListener('load', fitText); addEventListener('resize', fitText);

  observe(document);
})();
