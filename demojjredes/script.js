/* =========================================================
   JJREDES — la red que casi no se ve
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const WA = '5491133980947';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const waUrl = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;

  /* ---------- WhatsApp con mensaje ---------- */
  $$('[data-wa]').forEach(a => { a.href = waUrl(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- entrada ---------- */
  const ready = () => html.classList.add('is-ready');
  if (reduce) ready();
  else {
    const t = setTimeout(ready, 700);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { clearTimeout(t); setTimeout(ready, 30); });
  }

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const waFlot = $('#waFlot');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    waFlot.classList.toggle('ver', y > window.innerHeight * .6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const menu = $('#menu');
  const cerrarMenu = () => { burger.setAttribute('aria-expanded', 'false'); menu.hidden = true; document.body.style.overflow = ''; };
  burger.addEventListener('click', () => {
    const abrir = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(abrir));
    menu.hidden = !abrir;
    document.body.style.overflow = abrir ? 'hidden' : '';
    nav.classList.add('is-scrolled');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrarMenu(); burger.focus(); } });

  /* ---------- reveal ---------- */
  const rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rvs.forEach(el => io.observe(el));
  } else rvs.forEach(el => el.classList.add('in'));

  /* =========================================================
     LA RED DEL VANO: malla romboidal con física (verlet).
     Se deforma con el cursor o el dedo y vuelve a tensarse.
     ========================================================= */
  const vano = $('#vano');
  const marco = $('.vano-marco', vano);
  const cv = $('#redCanvas');
  const tip = $('#vanoTip');
  const video = $('#heroVideo');
  if (!finePointer) tip.textContent = 'Tocá la red';
  else tip.textContent = 'Pasá el cursor por la red';

  if (video) {
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    play();
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { en.isIntersecting ? play() : video.pause(); }).observe(video);
  }

  const ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1, nodes = [], links = [], running = false, visible = true;
  const ptr = { x: -999, y: -999, on: false, r: 70 };

  function armar() {
    const r = marco.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W || !H) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ptr.r = Math.max(60, W * .19);
    // grilla girada 45°: nodo(a,b) = origen + a·(s,s) + b·(-s,s)
    const s = Math.max(16, W / 17);
    const n = Math.ceil((W + H) / s) + 2;
    const ox = W / 2, oy = -H * .5 - s;
    const map = new Map();
    nodes = []; links = [];
    for (let a = -n; a <= n; a++) {
      for (let b = -n; b <= n; b++) {
        const x = ox + (a - b) * s, y = oy + (a + b) * s;
        if (x < -s || x > W + s || y < -s || y > H + s) continue;
        const pin = x <= 2 || x >= W - 2 || y <= 2 || y >= H - 2;
        const nd = { x, y, px: x, py: y, ox: x, oy: y, pin };
        map.set(a + ',' + b, nodes.length);
        nodes.push(nd);
      }
    }
    map.forEach((i, k) => {
      const [a, b] = k.split(',').map(Number);
      [[a + 1, b], [a, b + 1]].forEach(([c, d]) => {
        const j = map.get(c + ',' + d);
        if (j === undefined) return;
        const p = nodes[i], q = nodes[j];
        if (p.pin && q.pin) return;
        links.push([i, j, Math.hypot(p.x - q.x, p.y - q.y)]);
      });
    });
    dibujar();
  }

  function paso() {
    let energia = 0;
    for (const p of nodes) {
      if (p.pin) continue;
      const vx = (p.x - p.px) * .9, vy = (p.y - p.py) * .9;
      p.px = p.x; p.py = p.y;
      // resorte suave hacia su lugar: la red está tensada
      p.x += vx + (p.ox - p.x) * .022;
      p.y += vy + (p.oy - p.y) * .022;
      if (ptr.on) {
        const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
        if (d < ptr.r && d > .01) { const f = (ptr.r - d) / ptr.r; p.x += dx / d * f * 15; p.y += dy / d * f * 15; }
      }
      energia += Math.abs(vx) + Math.abs(vy) + Math.abs(p.ox - p.x) + Math.abs(p.oy - p.y);
    }
    for (let it = 0; it < 3; it++) {
      for (const [i, j, L] of links) {
        const p = nodes[i], q = nodes[j];
        const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || .001;
        const k = (d - L) / d * .5;
        if (!p.pin) { p.x += dx * k; p.y += dy * k; }
        if (!q.pin) { q.x -= dx * k; q.y -= dy * k; }
      }
    }
    return energia;
  }

  function dibujar() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    // sombra del hilo y después el hilo
    for (const [col, off, lw] of [['rgba(10,16,24,.28)', 1, 1.6], ['rgba(255,255,255,.82)', 0, 1.15]]) {
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.beginPath();
      for (const [i, j] of links) { const p = nodes[i], q = nodes[j]; ctx.moveTo(p.x + off, p.y + off); ctx.lineTo(q.x + off, q.y + off); }
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.beginPath();
    for (const p of nodes) { if (p.pin) continue; ctx.moveTo(p.x + 1.9, p.y); ctx.arc(p.x, p.y, 1.9, 0, Math.PI * 2); }
    ctx.fill();
  }

  let quieto = 0;
  function loop() {
    if (!visible) { running = false; return; }
    const e = paso();
    dibujar();
    quieto = e < nodes.length * .02 && !ptr.on ? quieto + 1 : 0;
    if (quieto > 30) { running = false; return; }
    requestAnimationFrame(loop);
  }
  const despertar = () => { if (!running && !reduce) { running = true; quieto = 0; requestAnimationFrame(loop); } };

  let tocado = false;
  const mover = e => {
    const r = marco.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true;
    if (!tocado) { tocado = true; setTimeout(() => tip.classList.add('oculto'), 900); }
    despertar();
  };
  marco.addEventListener('pointermove', mover, { passive: true });
  marco.addEventListener('pointerdown', mover, { passive: true });
  ['pointerleave', 'pointerup', 'pointercancel'].forEach(t => marco.addEventListener(t, () => { ptr.on = false; }));

  // al entrar, una "pata" invisible empuja la red para mostrar que se puede tocar
  function intro() {
    if (reduce || !W) return;
    const t0 = performance.now(), dur = 1500;
    const f = now => {
      if (tocado) return;
      const k = Math.min(1, (now - t0) / dur);
      ptr.x = W * (.18 + .64 * k); ptr.y = H * (.62 - .18 * Math.sin(k * Math.PI)); ptr.on = k < 1; ptr.r = Math.max(52, W * .15) * Math.sin(k * Math.PI) + 10;
      despertar();
      if (k < 1) requestAnimationFrame(f); else ptr.r = Math.max(52, W * .15);
    };
    requestAnimationFrame(f);
  }

  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) despertar(); }).observe(marco);
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(armar, 150); });
  armar();
  setTimeout(intro, 1100);

  $$('.sw', vano).forEach(b => b.addEventListener('click', () => {
    const con = b.dataset.red === '1';
    vano.classList.toggle('sin-red', !con);
    $$('.sw', vano).forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
  }));

  /* ---------- tabs: qué querés cuidar ---------- */
  const tabs = $$('.cuidar-tabs [role="tab"]');
  const elegir = (t, foco) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
    if (foco) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); elegir(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- lupa sobre la red transparente ---------- */
  const lupa = $('#lupa');
  if (lupa) {
    const img = $('img', lupa), lente = $('#lupaLente');
    const Z = 3.2;
    const mira = (x, y) => {
      const r = lupa.getBoundingClientRect();
      const lx = x - r.left, ly = y - r.top;
      const src = img.currentSrc || img.src;
      lente.style.backgroundImage = `url("${src}")`;
      lente.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      lente.style.left = lx + 'px'; lente.style.top = ly + 'px';
      lente.style.backgroundPosition = `${-(lx * Z - 85)}px ${-(ly * Z - 85)}px`;
      lupa.classList.add('activa');
    };
    lupa.addEventListener('pointermove', e => mira(e.clientX, e.clientY));
    lupa.addEventListener('pointerdown', e => mira(e.clientX, e.clientY));
    lupa.addEventListener('pointerleave', () => lupa.classList.remove('activa'));
    if (!finePointer) {
      $('.lupa-tip', lupa).textContent = 'Tocá la foto para ver el hilo';
      lupa.style.cursor = 'auto';
    }
  }

  /* =========================================================
     ARMÁ TU PEDIDO → mensaje de WhatsApp listo
     ========================================================= */
  const form = $('#pedido');
  if (form) {
    const ancho = $('#ancho'), alto = $('#alto'), noSe = $('#noSe');
    const svg = $('#maqueta'), m2 = $('#m2'), reco = $('#reco'), msg = $('#msg'), enviar = $('#enviar');
    const pasoMed = $('.paso-medidas', form);
    const num = el => { const v = parseFloat(String(el.value).replace(',', '.')); return isFinite(v) && v > 0 ? v : 0; };
    const fmt = v => v.toLocaleString('es-AR', { maximumFractionDigits: 2 });
    const lista = arr => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];

    function maqueta(a, h) {
      const VW = 300, VH = 200, pad = 18;
      const k = Math.min((VW - pad * 2) / a, (VH - pad * 2 - 14) / h);
      const w = a * k, hh = h * k, x = (VW - w) / 2, y = (VH - 14 - hh) / 2 + 2;
      // malla de dibujo: un rombo cada ~"5 cm" escalado, con un mínimo para que se lea
      const paso = Math.max(7, Math.min(16, k * .25));
      let lines = '';
      for (let d = -hh; d < w + hh; d += paso) {
        lines += `M${(x + d).toFixed(1)} ${y.toFixed(1)}l${hh.toFixed(1)} ${hh.toFixed(1)}`;
        lines += `M${(x + d).toFixed(1)} ${y.toFixed(1)}l${(-hh).toFixed(1)} ${hh.toFixed(1)}`;
      }
      svg.innerHTML =
        `<defs><clipPath id="mq"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="3"/></clipPath></defs>` +
        `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="3" fill="rgba(255,255,255,.55)"/>` +
        `<path d="${lines}" clip-path="url(#mq)" stroke="#1463D8" stroke-opacity=".45" stroke-width=".9" fill="none"/>` +
        `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="3" fill="none" stroke="#0D1724" stroke-width="2.2"/>` +
        `<text x="${VW / 2}" y="${VH - 2}" text-anchor="middle" font-size="12" font-family="Geologica, sans-serif" fill="#3D4A5A">${fmt(a)} m</text>` +
        `<text x="${x - 6}" y="${y + hh / 2}" text-anchor="end" dominant-baseline="middle" font-size="12" font-family="Geologica, sans-serif" fill="#3D4A5A">${fmt(h)} m</text>`;
    }

    function actualizar() {
      const que = $$('input[name="que"]:checked', form).map(i => i.value);
      const donde = ($('input[name="donde"]:checked', form) || {}).value || 'balcón';
      const modo = ($('input[name="modo"]:checked', form) || {}).value || '';
      const sinMedir = noSe.checked;
      pasoMed.classList.toggle('sin-medidas', sinMedir);
      const a = num(ancho), h = num(alto);
      let medidas = '';
      if (!sinMedir && a && h) {
        const area = a * h;
        maqueta(a, h);
        m2.innerHTML = `Son unos <b>${fmt(area)} m²</b> de red: más o menos <b>${Math.round(area / .0025).toLocaleString('es-AR')}</b> rombos de 5×5 cm.`;
        medidas = `${fmt(a)} m de ancho por ${fmt(h)} m de alto (unos ${fmt(area)} m²)`;
      } else {
        maqueta(3, 2.4);
        m2.innerHTML = sinMedir ? 'No pasa nada: mandá una foto y te decimos cómo medir.' : 'Poné el ancho y el alto en metros.';
      }

      // qué red conviene, con lo que JJREDES ofrece
      const pelotas = que.includes('pelotas');
      const kitMulti = modo.includes('multifilamento');
      const kitTransp = modo.includes('transparente');
      let r;
      if (kitMulti) r = 'Kit con <b>red multifilamento</b>: la opción de mayor resistencia, con todo para instalarla.';
      else if (kitTransp) r = 'Kit con <b>red transparente</b>: máxima discreción, con soga, pitones, tarugos y manual.';
      else if (pelotas) r = 'Para pelotas conviene la <b>red multifilamento</b>, la de mayor resistencia.';
      else if (que.length) r = `Para ${lista(que)} va la <b>red transparente de nylon 0,8 mm</b>: protege sin tapar la vista.`;
      else r = 'Elegí qué querés proteger y te decimos qué red va.';
      if (!modo.includes('kit') && ['terraza', 'pileta', 'cancha', 'techo'].includes(donde)) r += ' Si no hay dónde sujetarla, se suma una <b>estructura metálica</b> a medida.';
      reco.innerHTML = r;

      const texto = `Hola JJREDES! Quiero presupuesto para una red en ${donde === 'escalera' ? 'una escalera' : donde === 'ventana' ? 'una ventana' : donde === 'terraza' ? 'una terraza' : donde === 'pileta' ? 'la pileta' : donde === 'techo' ? 'un techo' : donde === 'cancha' ? 'una cancha' : 'un balcón'}` +
        (que.length ? `, para proteger ${lista(que)}` : '') + '. ' +
        (medidas ? `Mide ${medidas}. ` : 'Todavía no tengo las medidas. ') +
        (modo ? `La quiero ${modo}. ` : '') + 'Les mando una foto del lugar.';
      msg.textContent = texto;
      enviar.href = waUrl(texto);
      enviar.target = '_blank'; enviar.rel = 'noopener';
    }
    form.addEventListener('input', actualizar);
    form.addEventListener('change', actualizar);
    form.addEventListener('submit', e => e.preventDefault());
    actualizar();
  }

  /* ---------- fitText: con la letra del sistema agrandada (Android) nada se corta ---------- */
  const fitSel = ['.hero h1', '.tel', '.red h2', '.contacto h2', '.serv-txt h3', '.kit h2', '.cuidar-txt h3', 'section h2'];
  function fitText() {
    fitSel.forEach(sel => $$(sel).forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 12 && n++ < 40) { fs *= .95; el.style.fontSize = fs + 'px'; }
    }));
  }
  window.__jjFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  window.addEventListener('resize', () => { clearTimeout(fitText.t); fitText.t = setTimeout(fitText, 150); });

  /* ---------- filtros de trabajos ---------- */
  const fs = $$('.filtros .f');
  const items = $$('#grilla li');
  const verMas = $('#verMas');
  let todo = false; // con "Todos" se ven 13 hasta tocar "Ver más"
  const filtrar = f => {
    items.forEach(li => li.classList.toggle('oculto',
      f === 'todos' ? (!todo && li.classList.contains('extra')) : li.dataset.t !== f));
    if (verMas) verMas.hidden = todo || f !== 'todos';
  };
  fs.forEach(b => b.addEventListener('click', () => {
    fs.forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    filtrar(b.dataset.f);
  }));
  if (verMas) verMas.addEventListener('click', () => { todo = true; filtrar('todos'); });
  filtrar('todos');
})();
