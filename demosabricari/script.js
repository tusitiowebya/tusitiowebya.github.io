(() => {
  'use strict';
  if (/[?&]qa(&|=|$)/.test(location.search)) document.documentElement.classList.add('qa');

  const WA = '5491134710303';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  /* ---------- catálogo (fotos reales del IG @sabricari; precio a consultar) ---------- */
  const PRODUCTS = [
    // por menor
    { id: 'mochila-blanca', mode: 'menor', cat: 'Carteras y mochilas', name: 'Mochila blanca con herrajes dorados', img: 'img/p-mochila-blanca.jpg', tag: 'Nuevo', desc: 'Mochila chica de cuerina blanca texturada, cierres y logo metálico dorado. Ideal para el día a día.' },
    { id: 'mochila-gris', mode: 'menor', cat: 'Carteras y mochilas', name: 'Mochila monograma gris', img: 'img/p-mochila-gris.jpg', desc: 'Mochila con estampa monograma en gris y negro, bolsillo frontal con cierre dorado.' },
    { id: 'mochila-suela', mode: 'menor', cat: 'Carteras y mochilas', name: 'Mochila gamuzada color suela', img: 'img/p-mochila-suela.jpg', tag: 'Nuevo', desc: 'Mochila en textura gamuzada tono suela con monograma en relieve y herrajes dorados.' },
    { id: 'tote-negra', mode: 'menor', cat: 'Carteras y mochilas', name: 'Cartera tote negra con tarjetero', img: 'img/p-tote-negra.jpg', desc: 'Tote amplia negra con monograma en relieve y tarjetero colgante de regalo.' },
    { id: 'baguette', mode: 'menor', cat: 'Carteras y mochilas', name: 'Bandolera negra + monedero', img: 'img/p-baguette.jpg', desc: 'Cartera baguette negra con correa larga y monedero redondo enganchado.' },
    { id: 'bolso-denim', mode: 'menor', cat: 'Carteras y mochilas', name: 'Bolso de mano denim monograma', img: 'img/p-bolso-denim.jpg', tag: 'Con etiqueta', desc: 'Bolso tipo baúl en jean con estampa monograma. Vienen varios modelos en la misma línea.' },
    { id: 'bolso-negro', mode: 'menor', cat: 'Carteras y mochilas', name: 'Bolso de mano negro monograma', img: 'img/p-bolso-negro.jpg', tag: 'Con etiqueta', desc: 'Bolso negro con monograma en relieve, manijas y cierre dorado.' },
    { id: 'saco-crochet', mode: 'menor', cat: 'Abrigo', name: 'Saco tejido crochet crudo', img: 'img/p-saco-crochet.jpg', desc: 'Saquito tejido al crochet en color crudo, con motivos hexagonales. Pieza única.' },
    { id: 'sweater-rosa', mode: 'menor', cat: 'Abrigo', name: 'Suéter tejido rosa', img: 'img/p-sweater-rosa.jpg', desc: 'Suéter de punto grueso en rosa viejo. Entraron varios colores del fardo de suéter.' },
    { id: 'gorra-roja', mode: 'menor', cat: 'Gorras', name: 'Gorra béisbol roja', img: 'img/p-gorra-roja.jpg', tag: 'Últimas', desc: 'Gorra de béisbol roja con logo bordado de equipo de las ligas americanas.' },
    { id: 'gorra-celeste', mode: 'menor', cat: 'Gorras', name: 'Gorra deportiva celeste', img: 'img/p-gorra-celeste.jpg', desc: 'Gorra deportiva celeste de visera curva. Hay más modelos en el local.' },
    { id: 'vestido-bordo', mode: 'menor', cat: 'Fiesta', name: 'Vestido largo terciopelo bordó', img: 'img/p-vestido-bordo.jpg', tag: 'Fiesta', desc: 'Vestido largo de terciopelo bordó, caída amplia. Para fiesta o evento.' },
    { id: 'vestido-verde', mode: 'menor', cat: 'Fiesta', name: 'Vestido satinado verde agua', img: 'img/p-vestido-verde.jpg', tag: 'Fiesta', desc: 'Vestido largo satinado verde agua con fruncido al costado.' },
    { id: 'vestido-rosa', mode: 'menor', cat: 'Fiesta', name: 'Vestido satinado rosa viejo', img: 'img/p-vestido-rosa.jpg', desc: 'Vestido largo de breteles finos en satén rosa viejo.' },
    { id: 'body-rosa', mode: 'menor', cat: 'Juvenil', name: 'Body rosa sin mangas', img: 'img/p-body-rosa.jpg', tag: 'Juvenil', desc: 'Body entallado rosa, cuello alto. De la línea de prendas juveniles.' },
    { id: 'chombas-nino', mode: 'menor', cat: 'Niños', name: 'Chombas y remeras de nene', img: 'img/p-chombas-nino.jpg', tag: 'Con etiqueta', desc: 'Chombas y remeras de nene, varias con etiqueta. Consultá talles disponibles.' },
    // por mayor
    { id: 'fardo-sueter', mode: 'mayor', cat: 'Fardos', name: 'Fardo de suéter', img: 'img/m-fardo-sueter.jpg', tag: 'Promo', hot: true, desc: 'Fardo cerrado de suéteres y tejidos. Cuando lo abrimos en el local, lo que queda va en promo.' },
    { id: 'fardo-buzos', mode: 'mayor', cat: 'Fardos', name: 'Fardo buzos niños y juvenil', img: 'img/m-fardo-buzos.jpg', tag: '3 en promo', hot: true, desc: 'Fardos de buzos para niños y juvenil. Promo llevando 3 fardos.' },
    { id: 'fardo-bebe', mode: 'mayor', cat: 'Fardos', name: 'Fardo bebé y niños', img: 'img/m-fardo-bebe.jpg', desc: 'Fardo de prendas de bebé y niños: bodies, pijamas, mantitas y accesorios.' },
    { id: 'retorno-300', mode: 'mayor', cat: 'Retornos', name: 'Retorno caja 300 unidades', img: 'img/m-retorno-300.jpg', tag: 'Se va completo', hot: true, desc: 'Caja de retorno americano de 300 unidades, surtida. Se vende la caja completa.' },
    { id: 'retorno-ninos', mode: 'mayor', cat: 'Retornos', name: 'Retorno de niños', img: 'img/m-retorno-ninos.jpg', desc: 'Retorno con prenda de niños y niñas, mucha con etiqueta. Consultá la partida disponible.' }
  ];

  const STORIES = [
    { key: 'fardo', label: 'Abrimos fardo', video: 'video/s-fardo.mp4', thumb: 'img/s-fardo.jpg', mode: 'mayor', cat: 'Retornos' },
    { key: 'fiesta', label: 'Fiesta', video: 'video/s-fiesta.mp4', thumb: 'img/p-vestido-verde.jpg', mode: 'menor', cat: 'Fiesta' },
    { key: 'carteras', label: 'Carteras', video: 'video/s-carteras.mp4', thumb: 'img/p-mochila-suela.jpg', mode: 'menor', cat: 'Carteras y mochilas' },
    { key: 'gorras', label: 'Gorras', video: 'video/s-gorras.mp4', thumb: 'img/p-gorra-roja.jpg', mode: 'menor', cat: 'Gorras' },
    { key: 'abrigo', label: 'Abrigo', video: 'video/s-abrigo.mp4', thumb: 'img/p-saco-crochet.jpg', mode: 'menor', cat: 'Abrigo' },
    { key: 'juvenil', label: 'Juvenil', video: 'video/s-juvenil.mp4', thumb: 'img/p-body-rosa.jpg', mode: 'menor', cat: 'Juvenil' },
    { key: 'bebes', label: 'Bebés', video: 'video/s-bebes.mp4', thumb: 'img/m-fardo-bebe2.jpg', mode: 'mayor', cat: 'Fardos' }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- estado ---------- */
  let mode = 'menor';
  let cat = 'Todo';
  let query = '';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('sabricari-cart') || '[]'); } catch (e) { cart = []; }
  cart = cart.filter(l => PRODUCTS.some(p => p.id === l.id));

  const saveCart = () => { try { localStorage.setItem('sabricari-cart', JSON.stringify(cart)); } catch (e) {} };

  /* ---------- WhatsApp genérico ---------- */
  $$('.js-wa').forEach(a => { a.href = waLink('Hola Sabri! Vi la web y quería hacer una consulta.'); a.target = '_blank'; a.rel = 'noopener'; });
  $('#waMayor').href = waLink('Hola Sabri! Vendo ropa y quería la lista de fardos y retornos disponibles con precios por mayor.');
  $('#year').textContent = new Date().getFullYear();

  /* ---------- tienda ---------- */
  const grid = $('#grid');
  const chips = $('#chips');
  const modeText = $('#modeText');
  const MODE_COPY = {
    menor: 'Prendas sueltas, para vos. Sumá lo que te guste y mandá el pedido.',
    mayor: 'Fardos y retornos cerrados para revender. Consultá la partida del día.'
  };

  function renderChips() {
    const cats = ['Todo', ...new Set(PRODUCTS.filter(p => p.mode === mode).map(p => p.cat))];
    if (!cats.includes(cat)) cat = 'Todo';
    chips.innerHTML = cats.map(c => `<button class="chip${c === cat ? ' is-on' : ''}" data-cat="${c}">${c}</button>`).join('');
  }

  function renderGrid() {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(p => p.mode === mode && (cat === 'Todo' || p.cat === cat) &&
      (!q || (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(q)));
    if (!list.length) {
      grid.innerHTML = `<p class="empty">No encontramos eso en la tienda, pero puede estar en el local.<br><a class="btn btn--dark" style="margin-top:14px" target="_blank" rel="noopener" href="${waLink('Hola Sabri! ¿Tienen ' + (q || cat) + '?')}">Preguntar por WhatsApp</a></p>`;
      return;
    }
    grid.innerHTML = list.map((p, i) => `
      <article class="card" style="transition-delay:${Math.min(i, 8) * 45}ms">
        <div class="card__img">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="600" height="750">
          ${p.tag ? `<span class="card__tag${p.hot ? ' card__tag--hot' : ''}">${p.tag}</span>` : ''}
          <button class="card__open" data-open="${p.id}" aria-label="Ver ${p.name}"></button>
        </div>
        <div class="card__body">
          <p class="card__cat">${p.cat}</p>
          <h3 class="card__name">${p.name}</h3>
          <p class="card__price">Precio: <b>consultar</b></p>
          <button class="card__add" data-add="${p.id}">${inCart(p.id) ? '✓ En tu pedido' : '+ Agregar al pedido'}</button>
        </div>
      </article>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.card', grid).forEach(c => c.classList.add('in'))));
  }

  function setMode(m, scroll) {
    mode = m;
    $('.mode').dataset.mode = m;
    $$('.mode__btn').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    modeText.textContent = MODE_COPY[m];
    renderChips(); renderGrid();
    if (scroll) $('#tienda').scrollIntoView({ behavior: 'smooth' });
  }

  $$('.mode__btn').forEach(b => b.addEventListener('click', () => { cat = 'Todo'; setMode(b.dataset.mode); }));
  $$('[data-mode-link]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); cat = 'Todo'; setMode(a.dataset.modeLink, true); }));
  chips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; renderChips(); renderGrid(); });
  $('#search').addEventListener('input', e => { query = e.target.value; renderGrid(); });

  grid.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add, 1); return; }
    const open = e.target.closest('[data-open]');
    if (open) openQuick(open.dataset.open);
  });

  /* ---------- carrito ---------- */
  const inCart = id => cart.some(l => l.id === id);
  const byId = id => PRODUCTS.find(p => p.id === id);

  function addToCart(id, qty) {
    const l = cart.find(x => x.id === id);
    if (l) l.qty += qty; else cart.push({ id, qty });
    saveCart(); updateCart(true);
    toast(`Sumaste: ${byId(id).name}`);
    renderGrid();
  }

  function updateCart(bump) {
    const n = cart.reduce((a, l) => a + l.qty, 0);
    $('#cartCount').textContent = n;
    const btn = $('#cartOpen');
    if (bump) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
    const list = $('#cartList');
    if (!cart.length) {
      list.innerHTML = `<div class="cart-empty"><b>Vacío por ahora</b>Sumá prendas desde la tienda y mandá el pedido armado por WhatsApp.</div>`;
    } else {
      list.innerHTML = cart.map(l => {
        const p = byId(l.id);
        return `<div class="line">
          <img src="${p.img}" alt="">
          <div><p class="line__mode">${p.mode === 'mayor' ? 'Por mayor' : 'Por menor'} · ${p.cat}</p><p class="line__name">${p.name}</p>
            <div class="line__qty"><button data-dec="${l.id}" aria-label="Menos">−</button><b>${l.qty}</b><button data-inc="${l.id}" aria-label="Más">+</button></div></div>
          <button class="line__del" data-del="${l.id}">Quitar</button>
        </div>`;
      }).join('');
    }
    $('#sendOrder').disabled = !cart.length;
  }

  $('#cartList').addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const id = t.dataset.inc || t.dataset.dec || t.dataset.del;
    const l = cart.find(x => x.id === id); if (!l) return;
    if (t.dataset.inc) l.qty++;
    if (t.dataset.dec) l.qty--;
    if (t.dataset.del || l.qty < 1) cart = cart.filter(x => x.id !== id);
    saveCart(); updateCart(); renderGrid();
  });

  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length) return;
    const name = $('#oName').value.trim();
    const ship = ($('input[name=ship]:checked') || {}).value || '';
    const note = $('#oNote').value.trim();
    const menor = cart.filter(l => byId(l.id).mode === 'menor');
    const mayor = cart.filter(l => byId(l.id).mode === 'mayor');
    const fmt = arr => arr.map(l => `• ${l.qty} x ${byId(l.id).name}`).join('\n');
    let msg = `Hola Sabri! ${name ? 'Soy ' + name + '. ' : ''}Te hago este pedido desde la web:\n`;
    if (menor.length) msg += `\n*Por menor*\n${fmt(menor)}\n`;
    if (mayor.length) msg += `\n*Por mayor*\n${fmt(mayor)}\n`;
    msg += `\nEntrega: ${ship}`;
    if (note) msg += `\nComentario: ${note}`;
    msg += `\n\n¿Me confirmás precio y disponibilidad? Gracias!`;
    window.open(waLink(msg), '_blank', 'noopener');
  });

  /* ---------- drawer / modal / story: apertura ---------- */
  const drawer = $('#drawer'), quick = $('#quick'), story = $('#story');
  let lastFocus = null;
  function openLayer(el) { lastFocus = document.activeElement; el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); const f = el.querySelector('[data-close]:not([class*=scrim])'); if (f) f.focus({ preventScroll: true }); }
  function closeLayer(el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); if (!$$('.drawer.open,.modal.open,.story.open').length) document.body.classList.remove('lock'); if (el === story) stopStory(); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  [drawer, quick, story].forEach(el => el.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeLayer(el); }));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    [story, quick, drawer].some(el => el.classList.contains('open') && (closeLayer(el), true));
  });
  $('#cartOpen').addEventListener('click', () => { updateCart(); openLayer(drawer); });

  /* vista rápida */
  let qId = null, qQty = 1;
  function openQuick(id) {
    const p = byId(id); qId = id; qQty = 1;
    $('#qImg').src = p.img; $('#qImg').alt = p.name;
    $('#qCat').textContent = `${p.mode === 'mayor' ? 'Por mayor' : 'Por menor'} · ${p.cat}`;
    $('#qName').textContent = p.name; $('#qDesc').textContent = p.desc; $('#qQty').textContent = 1;
    $('#qAsk').href = waLink(`Hola Sabri! Me interesa "${p.name}". ¿Está disponible y qué precio tiene?`);
    openLayer(quick);
  }
  $('#qMinus').addEventListener('click', () => { qQty = Math.max(1, qQty - 1); $('#qQty').textContent = qQty; });
  $('#qPlus').addEventListener('click', () => { qQty++; $('#qQty').textContent = qQty; });
  $('#qAdd').addEventListener('click', () => { addToCart(qId, qQty); closeLayer(quick); });

  /* ---------- historias ---------- */
  const hlRow = $('#highlights');
  hlRow.innerHTML = STORIES.map((s, i) => `<button class="hl" data-story="${i}"><span class="hl__ring"><img src="${s.thumb}" alt="" loading="lazy"></span><span>${s.label}</span></button>`).join('')
    + `<a class="hl" href="#local"><span class="hl__ring"><img src="img/local.jpg" alt="" loading="lazy"></span><span>Dónde estamos</span></a>`;
  const sv = $('#storyVideo'), bars = $('#storyBars');
  let sIdx = 0, raf = 0;
  bars.innerHTML = STORIES.map(() => '<i><b></b></i>').join('');

  function playStory(i) {
    if (i < 0) i = 0;
    if (i >= STORIES.length) { closeLayer(story); return; }
    sIdx = i;
    const s = STORIES[i];
    $$('i', bars).forEach((b, k) => { b.classList.toggle('done', k < i); b.firstChild.style.width = k < i ? '100%' : '0'; });
    $('#storyName').textContent = '· ' + s.label;
    const cta = $('#storyCta');
    cta.textContent = s.mode === 'mayor' ? 'Ver fardos y retornos' : `Ver ${s.label.toLowerCase()} en la tienda`;
    cta.onclick = e => { e.preventDefault(); closeLayer(story); cat = s.cat; setMode(s.mode, true); };
    const hl = $(`[data-story="${i}"]`); if (hl) hl.classList.add('seen');
    sv.src = s.video; sv.currentTime = 0;
    const p = sv.play(); if (p && p.catch) p.catch(() => {});
    cancelAnimationFrame(raf);
    const tick = () => {
      if (sv.duration) bars.children[sIdx].firstChild.style.width = (sv.currentTime / sv.duration * 100) + '%';
      raf = requestAnimationFrame(tick);
    };
    tick();
  }
  function stopStory() { cancelAnimationFrame(raf); sv.pause(); sv.removeAttribute('src'); sv.load(); }
  sv.addEventListener('ended', () => playStory(sIdx + 1));
  $('#storyNext').addEventListener('click', () => playStory(sIdx + 1));
  $('#storyPrev').addEventListener('click', () => playStory(sIdx - 1));
  hlRow.addEventListener('click', e => { const b = e.target.closest('[data-story]'); if (!b) return; openLayer(story); playStory(+b.dataset.story); });

  /* ---------- toast ---------- */
  let tt;
  function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2200); }

  /* ---------- WA flotante tras el hero ---------- */
  const wf = $('.wa-float');
  const onScroll = () => wf.classList.toggle('show', scrollY > innerHeight * 0.6);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal ---------- */
  const rvEls = $$('.highlights__head, .shop__top, .whole__intro, .bale, .steps li, .whole__cta, .store__photo, .store__info, .faq h2, .faq details');
  rvEls.forEach(el => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
    rvEls.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else rvEls.forEach(el => el.classList.add('in'));

  /* ---------- fitText: títulos gigantes que no se corten con letra grande de Android ---------- */
  function fitText() {
    $$('.hero__title .fit').forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 20 && n++ < 60) { fs -= 2; el.style.fontSize = fs + 'px'; }
    });
  }
  window.__sabriFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  addEventListener('load', fitText);
  addEventListener('resize', fitText);

  /* ---------- init ---------- */
  setMode('menor');
  updateCart();
})();
