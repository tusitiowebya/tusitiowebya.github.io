/* Mueblería Express — home: hero góndola, tienda destacada, ruta, almanaque, kits y promos. */
(function () {
  'use strict';
  const ME = window.ME, U = window.MEUI;
  const { $, $$, esc } = U;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const find = n => ME.productos.find(p => norm(p.n).startsWith(norm(n)));

  /* ---------- Nav ---------- */
  const nav = $('.nav'), burger = $('.burger');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(o));
    document.documentElement.classList.toggle('no-scroll', o);
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('no-scroll');
  }));

  /* ---------- Video del hero (no se pide en LITE) ---------- */
  const video = $('.hero__video');
  if (document.documentElement.classList.contains('lite')) video.remove();
  else { video.src = video.dataset.src; const pl = video.play(); if (pl) pl.catch(() => {}); }

  /* El catálogo llega de CobrOS (o del respaldo local): todo lo que sigue espera a ME.ready. */
  ME.ready.then(function () {

  /* ---------- Góndola: productos reales rotando ---------- */
  const HERO = ['Exhibidora Briket M3000', 'Balanza digital Systel', 'Horno pizzero 12 moldes',
    'Tribuna caramelera con cigarrera 1,50', 'Heladera mostrador 1,70', 'Cortadora de fiambres Bianchi']
    .map(find).filter(Boolean);
  HERO.forEach(p => { const i = new Image(); i.src = ME.img(p); });
  const gCard = $('.gondola__card'), gDots = $('.gondola__dots');
  let gi = 0, gT;
  gDots.innerHTML = HERO.map(p => `<button type="button" aria-label="${esc(p.n)}"></button>`).join('');
  function paintHero() {
    const p = HERO[gi], c = ME.cuota(p);
    const img = $('.gondola__img img');
    img.src = ME.img(p); img.alt = p.n;
    $('.gondola__img').dataset.ficha = p.id;
    $('.gondola__add').href = ME.linkProducto(p);
    $('.gondola__add').setAttribute('aria-label', 'Consultar ' + p.n + ' por WhatsApp');
    $('[data-g-rubro]').textContent = ME.RUBROS[p.c];
    $('[data-g-name]').textContent = p.n;
    $('[data-g-precio]').innerHTML = c ? `${ME.fmt(c.v)}<small>por día</small>` : 'Consultar';
    $('[data-g-plan]').innerHTML = c ? `<b>${c.d}</b>días` : '';
    [...gDots.children].forEach((b, k) => b.setAttribute('aria-current', String(k === gi)));
    U.fitText();
  }
  function showHero(i) {
    gi = (i + HERO.length) % HERO.length;
    gCard.classList.remove('swap'); void gCard.offsetWidth; gCard.classList.add('swap');
    paintHero();
  }
  const loopHero = () => { clearInterval(gT); gT = setInterval(() => showHero(gi + 1), 3800); };
  gDots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { showHero([...gDots.children].indexOf(b)); loopHero(); } });
  if (HERO.length) { showHero(0); loopHero(); }

  /* ---------- Cinta de rubros ---------- */
  const rubrosCinta = ['Heladeras', 'Exhibidoras', 'Balanzas', 'Freezers', 'Hornos', 'Mostradores', 'Tribunas carameleras', 'Cartelería', 'Muebles', 'Colchones', 'Smart TV', 'Herramientas'];
  const tramo = rubrosCinta.map(r => `<span>${r}<svg viewBox="0 0 120 64"><use href="#truck"/></svg></span>`).join('');
  $('[data-cinta]').innerHTML = tramo + tramo;

  /* ---------- Tienda destacada ---------- */
  const DESTACADOS = ['Exhibidora Briket M5000', 'Heladera mostrador 2 m', 'Balanza digital Kretz Aura', 'Tribuna caramelera 1,50',
    'Freezer Briket FR4500', 'Horno convector Morelli', 'Combo Comercial 2', 'Cartel luminoso horizontal',
    'Sommier 2 plazas', 'Smart TV Enova 43', 'Aire acondicionado split Hisense', 'Termotanque eléctrico Señorial Zafiro'].map(find).filter(Boolean);
  const ORDEN_RUBROS = ME.ORDEN;
  let rubro = 'todos', query = '';
  const chips = $('[data-chips]'), grid = $('[data-grid]'), more = $('[data-more]');
  const cuenta = r => ME.productos.filter(p => p.c === r).length;
  chips.innerHTML = `<button class="chip" type="button" data-r="todos" aria-pressed="true">Destacados</button>` +
    ORDEN_RUBROS.map(r => `<button class="chip" type="button" data-r="${r}" aria-pressed="false">${ME.RUBROS[r]}<small>${cuenta(r)}</small></button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-r]'); if (!b) return;
    rubro = b.dataset.r;
    $$('[data-r]', chips).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderTienda();
  });
  let sT;
  $('[data-search]').addEventListener('input', e => { clearTimeout(sT); sT = setTimeout(() => { query = e.target.value.trim(); renderTienda(); }, 160); });

  function renderTienda() {
    let lista;
    const q = norm(query);
    if (q) lista = ME.productos.filter(p => norm(p.n + ' ' + p.s).includes(q) && (rubro === 'todos' || p.c === rubro));
    else if (rubro === 'todos') lista = DESTACADOS;
    else lista = ME.productos.filter(p => p.c === rubro);
    const total = lista.length;
    grid.innerHTML = total ? lista.slice(0, 12).map(U.card).join('') :
      `<p class="vacio">No encontramos “${esc(query)}”. Probá con otra palabra o <a href="${ME.waLink('Hola! Busco: ' + query)}" target="_blank" rel="noopener">preguntanos por WhatsApp</a>.</p>`;
    const params = new URLSearchParams();
    if (rubro !== 'todos') params.set('r', rubro);
    if (query) params.set('q', query);
    more.href = 'catalogo/' + (params.toString() ? '?' + params : '');
    more.textContent = total > 12 ? `Ver los ${total} productos →` : 'Ver el catálogo completo →';
  }
  renderTienda();

  /* ---------- Ruta del camión (progreso de scroll) ---------- */
  const ruta = $('[data-ruta]');
  let rq = false;
  function rutaProg() {
    rq = false;
    const r = ruta.getBoundingClientRect(), vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    ruta.style.setProperty('--prog', p.toFixed(3));
  }
  window.addEventListener('scroll', () => { if (!rq) { rq = true; requestAnimationFrame(rutaProg); } }, { passive: true });
  rutaProg();

  /* ---------- Almanaque de cuotas ---------- */
  const ALM = ['Exhibidora Briket M3000', 'Heladera mostrador 1,70', 'Balanza digital Systel', 'Horno pizzero 12 moldes',
    'Tribuna caramelera con cigarrera 1,50', 'Freezer Bambi FH2500', 'Cortadora de fiambres Bianchi', 'Amasadora 20 kg', 'Cartel luminoso horizontal']
    .map(find).filter(Boolean);
  const selProd = $('[data-alm-prod]'), rango = $('[data-alm-extra]'), cal = $('[data-cal]');
  let almPlan = 250, almAnim;
  function opcionesAlm() {
    selProd.innerHTML = ALM.map(p => `<option value="${p.id}">${esc(p.n)}</option>`).join('');
  }
  function cuotaAlm() {
    const p = ME.porId[selProd.value]; const c = p && ME.cuota(p, almPlan);
    return c ? { v: c.v, d: c.d } : { v: 0, d: almPlan };
  }
  function renderAlm(animar = true) {
    $$('[data-ad]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.ad === almPlan)));
    const extra = +rango.value, c = cuotaAlm(), d = c.d;
    const queda = extra - c.v;
    $('[data-alm-extra-out]').textContent = ME.fmt(extra);
    $('[data-st-cuota]').textContent = ME.fmt(c.v);
    $('[data-st-queda]').textContent = queda >= 0 ? ME.fmt(queda) : '−' + ME.fmt(-queda);
    $('[data-st-dia]').textContent = 'N° ' + (d + 1);
    $('[data-cal-t]').textContent = `${d} días de cuota`;
    const pc = Math.min(100, c.v / Math.max(extra, 1) * 100);
    $('[data-split-c]').style.width = pc + '%';
    $('[data-split-g]').style.width = (100 - pc) + '%';
    const v = $('[data-verdict]');
    if (queda >= 0) {
      v.classList.remove('warn');
      v.innerHTML = `Vendiendo <b>${ME.fmt(extra)}</b> más por día, pagás la cuota de <b>${ME.fmt(c.v)}</b> y te quedan <b>${ME.fmt(queda)}</b> en caja todos los días. Al terminar los ${d} días el equipo es tuyo y desde ahí <b>te queda todo</b>.`;
    } else {
      v.classList.add('warn');
      v.innerHTML = `Con ${ME.fmt(extra)} extra por día no llegás a cubrir la cuota de ${ME.fmt(c.v)}. Probá con un plan más largo o con otro equipo.`;
    }
    // grilla de días: se tachan en secuencia
    cal.style.gridTemplateColumns = `repeat(${d <= 85 ? 17 : d <= 155 ? 20 : 25}, minmax(0, 1fr))`;
    if (cal.children.length !== d + 1) cal.innerHTML = '<i></i>'.repeat(d) + '<i class="fin" title="Es tuyo"></i>';
    const celdas = [...cal.children].slice(0, d);
    cancelAnimationFrame(almAnim);
    if (!animar || document.documentElement.classList.contains('lite')) { celdas.forEach(x => x.classList.add('on')); return; }
    celdas.forEach(x => x.classList.remove('on'));
    const t0 = performance.now(), dur = 1400;
    (function paso(t) {
      const n = Math.min(d, Math.round((t - t0) / dur * d));
      for (let k = 0; k < n; k++) celdas[k].classList.add('on');
      if (n < d) almAnim = requestAnimationFrame(paso);
    })(t0);
  }
  opcionesAlm();
  selProd.addEventListener('change', () => renderAlm());
  $('[data-alm-plan]').addEventListener('click', e => { const b = e.target.closest('[data-ad]'); if (b) { almPlan = +b.dataset.ad; renderAlm(); } });
  let rT;
  rango.addEventListener('input', () => { renderAlm(false); clearTimeout(rT); rT = setTimeout(() => renderAlm(), 350); });
  const almSec = $('#almanaque');
  let almVisto = false;
  renderAlm(false);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es, o) => es.forEach(en => { if (en.isIntersecting && !almVisto) { almVisto = true; renderAlm(); o.disconnect(); } }), { threshold: .35 }).observe(almSec);
  }

  /* ---------- Kits por rubro ---------- */
  const KITS = [
    { t: 'Kiosco', txt: 'Golosinas a la vista, bebidas frías y un cartel que se vea de lejos.', ids: ['Tribuna caramelera con cigarrera 1,50', 'Exhibidora Briket M3000', 'Cartel luminoso vertical'] },
    { t: 'Almacén', txt: 'Fiambres y lácteos al frío, balanza con ticket y estantes para la mercadería.', ids: ['Heladera mostrador 1,70', 'Balanza digital Kretz Aura', 'Estantería de chapa'] },
    { t: 'Verdulería', txt: 'Cajones a la vista, canastos que aguantan peso y balanza a batería.', ids: ['Mueble verdulero', 'Exhibidor de alambre 12', 'Balanza digital Kretz Novel'] },
    { t: 'Panadería', txt: 'Horno de convección, amasadora y panera para exhibir.', ids: ['Horno convector Morelli', 'Amasadora 20 kg', 'Panera 2 divisiones'] },
    { t: 'Rotisería y pizzería', txt: 'Horno pizzero, freidora a gas y cocina con plancha.', ids: ['Horno pizzero 12 moldes', 'Freidora a gas 18', 'Cocina 4 hornallas con plancha'] },
    { t: 'Carnicería y fiambrería', txt: 'Sierra, cortadora de fiambres y envasadora al vacío.', ids: ['Sierra carnicera', 'Cortadora de fiambres Bianchi', 'Termoselladora'] }
  ].map(k => ({ ...k, items: k.ids.map(find).filter(Boolean) }));
  const kitsEl = $('[data-kits]');
  function renderKits() {
    kitsEl.innerHTML = KITS.map((k, i) => {
      let tot = 0, cons = false;
      const lis = k.items.map(p => {
        const c = ME.cuota(p); if (c) tot += c.v; if (!c || !c.exacto) cons = true;
        return `<li><button type="button" data-ficha="${p.id}"><img src="${ME.img(p)}" alt="" loading="lazy" width="52" height="52"><span>${esc(p.n)}${c && !c.exacto ? ` <small>(plan ${c.d} días)</small>` : ''}</span><em>${c ? ME.fmt(c.v) : 'Consultar'}</em></button></li>`;
      }).join('');
      return `<article class="kit rv ${i % 3 ? 'rv-d' + (i % 3) : ''}">
        <div class="kit__head"><h3>${k.t}</h3></div>
        <p class="kit__txt">${k.txt}</p>
        <ul class="kit__items">${lis}</ul>
        <div class="kit__foot">
          <div class="kit__total"><small>Kit en ${ME.plan} días</small><b>${ME.fmt(tot)}/día${cons ? '*' : ''}</b></div>
          <a class="btn btn--wa" href="${ME.waLink(`Hola Mueblería Express! Me interesa el kit para ${k.t.toLowerCase()}: ${k.items.map(p => p.n).join(', ')} (plan de ${ME.plan} días). ¿Me pasan info?`)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Consultar kit</a>
        </div>
      </article>`;
    }).join('');
    U.reveal(kitsEl);
    $$('.kit', kitsEl).forEach(el => el.classList.add('in'));
  }
  renderKits();
  // los kits entran con reveal la primera vez
  $$('.kit', kitsEl).forEach(el => el.classList.remove('in')); U.reveal(kitsEl);

  /* ---------- Promos reales ---------- */
  const PROMOS = 13;
  const promos = $('[data-promos]'), lb = $('[data-lightbox]');
  promos.innerHTML = Array.from({ length: PROMOS }, (_, i) => {
    const n = String(i).padStart(2, '0');
    return `<button class="promo" type="button" data-promo="${n}" aria-label="Ver oferta ${i + 1}"><img src="img/promo/promo-${n}.jpg" alt="Oferta de Mueblería Express ${i + 1}" loading="lazy"></button>`;
  }).join('');
  promos.addEventListener('click', e => {
    const b = e.target.closest('[data-promo]'); if (!b) return;
    const img = $('img', lb); img.src = `img/promo/promo-${b.dataset.promo}.jpg`; img.alt = 'Oferta ampliada';
    $('[data-lb-wa]', lb).href = ME.waLink(`Hola! Vi en la web la oferta N° ${+b.dataset.promo + 1} y quiero consultarla.`);
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  });
  $('[data-lb-close]').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  $$('[data-pr]').forEach(b => b.addEventListener('click', () => promos.scrollBy({ left: +b.dataset.pr * promos.clientWidth * .8, behavior: 'smooth' })));

  /* ---------- Reacciones a plan ---------- */
  ME.on(() => { paintHero(); renderTienda(); opcionesAlm(); renderAlm(false); renderKits(); });
  });
})();
