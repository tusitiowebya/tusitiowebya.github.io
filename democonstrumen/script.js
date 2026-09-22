/* CONSTRU MEN — script de la landing */
(() => {
  const WA = '5492213191410';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const QA = /[?&]qa\b/.test(location.search);
  if (QA) document.documentElement.classList.add('qa');
  const waUrl = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* ---------- links de WhatsApp ---------- */
  $$('[data-wa]').forEach(a => { a.href = waUrl(a.dataset.wa); });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $('#navLinks');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    links.classList.toggle('is-open', open);
    if (open) nav.classList.add('is-solid');
    else onScroll();
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  }));

  /* ---------- hero: la grúa ---------- */
  const hero = $('#hero');
  const video = $('#heroVideo');
  const frame = $('.load-frame');
  const heroBg = $('#heroBg');
  const trolley = $('#trolley');
  const mqMobile = matchMedia('(max-width:900px)');
  const placeVideo = () => {
    const target = mqMobile.matches ? heroBg : frame;
    if (video.parentNode !== target) {
      target.appendChild(video);
      video.play().catch(() => {});
    }
  };
  placeVideo();
  mqMobile.addEventListener('change', placeVideo);
  // tensores: del ápice de la torre a dos puntos de la pluma
  const ties = $('#craneTies');
  const drawTies = () => {
    if (mqMobile.matches) return;
    const hr = hero.getBoundingClientRect();
    const ap = $('.crane-apex').getBoundingClientRect();
    const jb = $('.crane-jib').getBoundingClientRect();
    const ax = ap.left + ap.width / 2 - hr.left, ay = ap.top + 4 - hr.top, jy = jb.top - hr.top;
    const pts = [jb.left - hr.left + 6, jb.left - hr.left + jb.width * 0.5, jb.right - hr.left - 4];
    ties.innerHTML = pts.map(x => `<line x1="${ax}" y1="${ay}" x2="${x}" y2="${jy}"/>`).join('');
  };
  drawTies();
  addEventListener('resize', drawTies);
  document.fonts && document.fonts.ready.then(drawTies);
  const start = () => hero.classList.add('is-in');
  if (QA) start(); else requestAnimationFrame(() => setTimeout(start, 120));

  // etiqueta de la carga según el tramo del video
  const tagTxt = $('#loadTagTxt');
  const tramos = [
    [0, 'Losa · malla de hierro'],
    [10.6, 'Pileta · terminación'],
    [14.2, 'Pileta de material · lista'],
    [18.1, 'Escalera · peldaños de madera']
  ];
  let tagNow = '';
  video.addEventListener('timeupdate', () => {
    let t = tramos[0][1];
    for (const [s, txt] of tramos) if (video.currentTime >= s) t = txt;
    if (t !== tagNow) {
      tagNow = t;
      tagTxt.style.opacity = 0;
      setTimeout(() => { tagTxt.textContent = t; tagTxt.style.opacity = 1; }, 250);
    }
  });

  /* ---------- scroll: nav sólido, carro, botón flotante ---------- */
  const waFloat = $('#waFloat');
  function onScroll() {
    const y = scrollY;
    if (!links.classList.contains('is-open')) nav.classList.toggle('is-solid', y > 40);
    waFloat.classList.toggle('is-on', y > innerHeight * 0.6);
    if (y < innerHeight * 1.2) trolley.style.setProperty('--tx-scroll', `${-y * 0.22}px`);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 01 planilla de rubros ---------- */
  const rubros = [
    ['Obras llave en mano', 'Casas, departamentos y locales, de la base a la entrega'],
    ['Piletas de material', 'Diseños a medida, con Marbella Piscinas'],
    ['Planos y dirección de obra', 'Proyecto, planos y dirección técnica'],
    ['Albañilería general', 'Revoques, reformas y ampliaciones'],
    ['Cielorrasos y tabiques', 'Durlock y mamparería'],
    ['Colocación de cerámicos', 'Pisos y revestimientos'],
    ['Instalaciones eléctricas', 'Luces, tomacorrientes y tableros'],
    ['Instalaciones sanitarias', 'Pozos y arreglo de cañerías'],
    ['Cloacas y desagües', 'Todos los sistemas'],
    ['Impermeabilización', 'Techos y superficies expuestas al agua'],
    ['Pintura y acabados', 'Terminaciones de obra'],
    ['Colocación de aberturas', 'Puertas y ventanas']
  ];
  const plBody = $('#plBody');
  rubros.forEach(([n, d], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pl-row';
    b.setAttribute('role', 'checkbox');
    b.setAttribute('aria-checked', 'false');
    b.dataset.name = n;
    b.innerHTML = `<span class="pl-item">${String(i + 1).padStart(2, '0')}.0</span><span class="pl-name">${n}</span><span class="pl-inc">${d}</span><span class="pl-chk"><i></i></span>`;
    plBody.appendChild(b);
  });
  const plCount = $('#plCount'), plList = $('#plList'), plSend = $('#plSend');
  const updPlanilla = () => {
    const sel = $$('.pl-row[aria-checked="true"]', plBody).map(r => r.dataset.name);
    plCount.textContent = sel.length;
    plList.textContent = sel.length ? sel.join(' · ') : 'Tocá una fila para sumarla';
    const msg = sel.length
      ? `Hola Constru Men! Quiero presupuesto sin cargo para estos rubros:\n${sel.map(s => '• ' + s).join('\n')}\n\nMi zona es: `
      : 'Hola Constru Men! Quiero pedir un presupuesto sin cargo.';
    plSend.href = waUrl(msg);
  };
  plBody.addEventListener('click', e => {
    const r = e.target.closest('.pl-row');
    if (!r) return;
    r.setAttribute('aria-checked', r.getAttribute('aria-checked') !== 'true');
    updPlanilla();
  });
  updPlanilla();

  /* ---------- 02 riel de carteles ---------- */
  const rail = $('#rail');
  const railTrolley = $('#railTrolley');
  const updRail = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    railTrolley.style.left = `${max > 0 ? (rail.scrollLeft / max) * 100 : 0}%`;
  };
  rail.addEventListener('scroll', updRail, { passive: true });
  addEventListener('resize', updRail);
  updRail();
  // arrastrar con el mouse
  let drag = null;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.target.closest('button,a')) return;
    drag = { x: e.clientX, s: rail.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; rail.classList.add('is-drag'); }
    rail.scrollLeft = drag.s - dx;
  });
  addEventListener('pointerup', () => { drag = null; rail.classList.remove('is-drag'); });

  // videos de obra: play solo en pantalla
  const vio = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.35 });
  $$('video[data-autoplay]').forEach(v => vio.observe(v));

  // etapas (escalera / pileta)
  const etapas = [
    ['Zanca soldada en obra', 'Presentación de la estructura', 'Zanca instalada', 'Peldaños de madera colocados', 'Peldaños vistos desde arriba'],
    ['Terminación y limpieza', 'Revestimiento terminado', 'Llena y funcionando']
  ];
  $$('.cartel[data-steps]').forEach((c, ci) => {
    const imgs = $$('.cartel-media img', c);
    const dots = $('.st-dots', c);
    const label = $('.st-label', c);
    let i = 0, hover = false, visible = false;
    imgs.forEach(() => dots.appendChild(document.createElement('li')));
    const go = n => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
      $$('li', dots).forEach((d, k) => d.classList.toggle('is-on', k === i));
      if (etapas[ci]) label.textContent = etapas[ci][i];
    };
    $('.st-prev', c).addEventListener('click', () => go(i - 1));
    $('.st-next', c).addEventListener('click', () => go(i + 1));
    c.addEventListener('pointerenter', () => hover = true);
    c.addEventListener('pointerleave', () => hover = false);
    new IntersectionObserver(([en]) => visible = en.isIntersecting, { threshold: .5 }).observe(c);
    setInterval(() => { if (visible && !hover && !QA) go(i + 1); }, 3400);
    go(0);
  });

  /* ---------- 03 configurador de pileta ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const plan = $('#planSvg'), corte = $('#corteSvg');
  const sL = $('#sL'), sA = $('#sA'), sP1 = $('#sP1'), sP2 = $('#sP2');
  const fmt = (n, d = 2) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  let shape = 'rect';
  const shapeName = { rect: 'Rectangular', romana: 'Con escalera romana', playa: 'Con playa húmeda' };

  $$('.cfg-shapes button').forEach(b => b.addEventListener('click', () => {
    $$('.cfg-shapes button').forEach(x => x.setAttribute('aria-checked', x === b));
    shape = b.dataset.shape;
    drawPool();
  }));
  [sL, sA, sP1, sP2].forEach(s => s.addEventListener('input', () => {
    if (s === sP1 && +sP2.value < +sP1.value + 0.1) sP2.value = (+sP1.value + 0.1).toFixed(2);
    if (s === sP2 && +sP2.value < +sP1.value + 0.1) sP1.value = Math.max(+sP1.min, +sP2.value - 0.1).toFixed(2);
    drawPool();
  }));

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const cota = (g, x1, y1, x2, y2, txt, vertical) => {
    el('line', { x1, y1, x2, y2, class: 'pl-cota' }, g);
    const t = 4;
    if (!vertical) {
      el('line', { x1, y1: y1 - t, x2: x1, y2: y1 + t, class: 'pl-cota' }, g);
      el('line', { x1: x2, y1: y2 - t, x2, y2: y2 + t, class: 'pl-cota' }, g);
      const tx = el('text', { x: (x1 + x2) / 2, y: y1 - 6, 'text-anchor': 'middle', class: 'pl-cota-t' }, g);
      tx.textContent = txt;
    } else {
      el('line', { x1: x1 - t, y1, x2: x1 + t, y2: y1, class: 'pl-cota' }, g);
      el('line', { x1: x2 - t, y1: y2, x2: x2 + t, y2, class: 'pl-cota' }, g);
      const tx = el('text', { x: x1 + 8, y: (y1 + y2) / 2 + 3, class: 'pl-cota-t' }, g);
      tx.textContent = txt;
    }
  };

  function drawPool() {
    const L = +sL.value, A = +sA.value, p1 = +sP1.value, p2 = +sP2.value;
    [sL, sA, sP1, sP2].forEach(s => s.style.setProperty('--p', `${((s.value - s.min) / (s.max - s.min)) * 100}%`));
    $('#oL').textContent = `${fmt(L, 1)} m`;
    $('#oA').textContent = `${fmt(A, 1)} m`;
    $('#oP1').textContent = `${fmt(p1)} m`;
    $('#oP2').textContent = `${fmt(p2)} m`;

    const romR = Math.min(A / 2 * 0.62, 1.2);
    const playaL = Math.min(1.2, L * 0.22);
    const extraL = shape === 'romana' ? romR : 0;

    // escala para que entre en la planta
    const s = Math.min(290 / (L + extraL), 150 / A);
    const w = L * s, h = A * s;
    const x0 = (400 - w + extraL * s) / 2 - 26, y0 = 44 + (150 - h) / 2;

    plan.innerHTML = '';
    const defs = el('defs', {}, plan);
    const gr = el('linearGradient', { id: 'waterGrad', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    el('stop', { offset: '0', 'stop-color': '#5fd0ea' }, gr);
    el('stop', { offset: '1', 'stop-color': '#1a86b8' }, gr);
    const cp = el('clipPath', { id: 'poolClip' }, defs);

    const lbl = el('text', { x: 14, y: 20, class: 'pl-lbl' }, plan);
    lbl.textContent = 'PLANTA · ESC. APROX.';

    // contorno
    let d = `M${x0} ${y0} H${x0 + w} V${y0 + h} H${x0} Z`;
    if (shape === 'romana') {
      const r = romR * s, cy = y0 + h / 2;
      d = `M${x0} ${y0} H${x0 + w} V${y0 + h} H${x0} V${cy + r} A${r} ${r} 0 0 1 ${x0} ${cy - r} Z`;
    }
    el('path', { d, class: 'pl-edge' }, plan);
    el('path', { d, class: 'pl-water' }, plan);
    el('path', { d }, cp);
    const rip = el('g', { 'clip-path': 'url(#poolClip)' }, plan);
    for (let k = 0; k < 4; k++) {
      const yy = y0 + h * (0.2 + k * 0.2);
      let pth = `M${x0 - 60} ${yy}`;
      for (let xx = x0 - 60; xx < x0 + w + 60; xx += 30) pth += ` q 7.5 -4 15 0 t 15 0`;
      el('path', { d: pth, class: 'pl-ripple', style: `animation-delay:${-k * 1.3}s` }, rip);
    }
    if (shape === 'playa') {
      el('rect', { x: x0, y: y0, width: playaL * s, height: h, class: 'pl-beach' }, plan);
      const t = el('text', { x: x0 + playaL * s / 2, y: y0 + h / 2 + 3, 'text-anchor': 'middle', class: 'pl-lbl' }, plan);
      t.textContent = 'PLAYA';
    }
    if (shape === 'romana') {
      const r = romR * s, cy = y0 + h / 2;
      [0.66, 0.33].forEach(f => el('path', { d: `M${x0} ${cy + r * f} A${r * f} ${r * f} 0 0 1 ${x0} ${cy - r * f}`, class: 'pl-steps' }, plan));
    }
    el('path', { d, class: 'pl-stroke' }, plan);
    cota(plan, x0, y0 - 16, x0 + w, y0 - 16, `${fmt(L)} m`);
    cota(plan, x0 + w + 16, y0, x0 + w + 16, y0 + h, `${fmt(A)} m`, true);

    // corte longitudinal
    corte.innerHTML = '';
    const lc = el('text', { x: 14, y: 16, class: 'pl-lbl' }, corte);
    lc.textContent = 'CORTE A-A';
    const ds = 30; // px por metro de profundidad
    const top = 22;
    const bx0 = x0, bx1 = x0 + w;
    let cd;
    if (shape === 'playa') {
      const px = bx0 + playaL * s;
      cd = `M${bx0} ${top} H${bx1} V${top + p2 * ds} L${px + (bx1 - px) * 0.35} ${top + p2 * ds} L${px} ${top + p1 * ds} V${top + 0.3 * ds} H${bx0} Z`;
    } else {
      cd = `M${bx0} ${top} H${bx1} V${top + p2 * ds} L${bx0 + w * 0.55} ${top + p2 * ds} L${bx0 + w * 0.35} ${top + p1 * ds} H${bx0} Z`;
    }
    el('path', { d: cd, fill: 'url(#waterGrad2)', stroke: '#0B2540', 'stroke-width': 1.6 }, corte);
    const defs2 = el('defs', {}, corte);
    const g2 = el('linearGradient', { id: 'waterGrad2', x1: 0, y1: 0, x2: 0, y2: 1 }, defs2);
    el('stop', { offset: '0', 'stop-color': '#7fd9ee' }, g2);
    el('stop', { offset: '1', 'stop-color': '#1a86b8' }, g2);
    const t1 = el('text', { x: bx0 + 4, y: top + (shape === 'playa' ? 0.3 : p1) * ds + 12, class: 'pl-cota-t' }, corte);
    t1.textContent = shape === 'playa' ? '0,30' : fmt(p1);
    const t2 = el('text', { x: bx1 - 4, y: top + p2 * ds + 12, 'text-anchor': 'end', class: 'pl-cota-t' }, corte);
    t2.textContent = fmt(p2);

    // cálculos
    const media = (p1 + p2) / 2;
    let vol = L * A * media;
    if (shape === 'playa') vol = (L - playaL) * A * media + playaL * A * 0.3;
    if (shape === 'romana') vol += Math.PI * romR * romR / 2 * 0.55;
    const litros = Math.round(vol * 1000 / 100) * 100;
    const espejo = L * A + (shape === 'romana' ? Math.PI * romR * romR / 2 : 0);
    const borde = 2 * (L + A) + (shape === 'romana' ? Math.PI * romR - 2 * romR : 0);
    const horas = litros / (20 * 60);
    $('#rVol').textContent = litros.toLocaleString('es-AR');
    $('#rEsp').textContent = fmt(espejo, 1);
    $('#rBorde').textContent = fmt(borde, 1);
    $('#rFill').textContent = horas >= 48 ? `${fmt(horas / 24, 1)} días` : `${Math.round(horas)} h`;

    $('#cfgSend').href = waUrl(
      `Hola Constru Men! Quiero presupuesto de una pileta de material (Marbella Piscinas):\n` +
      `• Forma: ${shapeName[shape]}\n• Medidas: ${fmt(L, 1)} x ${fmt(A, 1)} m\n` +
      `• Profundidad: ${fmt(p1)} a ${fmt(p2)} m\n• Volumen aprox.: ${litros.toLocaleString('es-AR')} litros\n\nMi zona es: `
    );
  }
  drawPool();

  /* ---------- 04 la casa se levanta ---------- */
  const pasos = $$('.pasos-list li');
  const layers = $$('#casa .c-layer');
  const cap = $('#casaCap');
  const capTxt = ['01 · Visita', '02 · Planos', '03 · Presupuesto', '04 · Dirección de obra', '05 · Llave en mano'];
  const setStep = n => {
    layers.forEach(l => l.classList.toggle('on', +l.dataset.l <= n));
    pasos.forEach(p => {
      const k = +p.dataset.step;
      p.classList.toggle('is-active', k === n);
      p.classList.toggle('is-done', k < n);
    });
    cap.textContent = capTxt[n - 1];
  };
  if (QA) setStep(5);
  else {
    setStep(1);
    const pio = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) setStep(+en.target.dataset.step);
    }), { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(p => pio.observe(p));
  }

  /* ---------- reveal ---------- */
  const rio = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(r => rio.observe(r));

  $('#year').textContent = new Date().getFullYear();

  /* ---------- fitText: títulos de una línea nunca se cortan (letra grande de Android) ---------- */
  const fitSel = ['.ht-word', '.hero-corner span', '.btn'];
  const fitText = () => {
    $$(fitSel.join(',')).forEach(n => {
      n.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(n).fontSize), guard = 40;
      while (n.scrollWidth > n.clientWidth + 1 && fs > 11 && guard--) {
        fs -= 1;
        n.style.fontSize = fs + 'px';
      }
    });
  };
  window.__cmFit = fitText;
  fitText();
  document.fonts && document.fonts.ready.then(fitText);
  addEventListener('load', fitText);
  addEventListener('resize', fitText);
})();
