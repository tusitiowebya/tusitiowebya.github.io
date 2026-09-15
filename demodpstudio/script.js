(() => {
  const html = document.documentElement;
  const isLite = () => html.classList.contains('lite');
  const WA = '5491130784813';

  /* ---------- nav + floating WhatsApp ---------- */
  const nav = document.getElementById('nav');
  const wa = document.getElementById('waFloat');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 30);
    wa.classList.toggle('show', y > hero.offsetHeight * 0.7);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  const setMenu = open => {
    mnav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
  mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- fit text: Android text scaling enlarges px fonts but not vw widths ---------- */
  const FIT = '.hero__title, .hero__kicker, .brushlabel span, .h2, .btn, .result__name, .htag h3, .case h3, .step h3, .steps b, .mnav a, .foot__claim, .sticker';
  const fitEls = [...document.querySelectorAll(FIT)];
  const overflows = el => el.scrollWidth > el.clientWidth + 1;
  const fitText = () => {
    fitEls.forEach(el => { el.style.fontSize = ''; });
    fitEls.forEach(el => {
      if (!el.getClientRects().length) return;
      let size = parseFloat(getComputedStyle(el).fontSize);
      const min = Math.max(12, size * .45);
      let guard = 30;
      while (overflows(el) && size > min && guard--) {
        size = Math.max(min, size * Math.min(.96, el.clientWidth / el.scrollWidth + .01));
        el.style.fontSize = size.toFixed(1) + 'px';
      }
    });
  };
  window.__dpFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  addEventListener('load', fitText);
  let fitT;
  addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(fitText, 120); });

  /* ---------- reveal ---------- */
  const rvIO = new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      setTimeout(() => el.classList.add('in'), (i++) * 90);
      rvIO.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => rvIO.observe(el));

  /* ---------- videos (lazy, only the visible ones, never in LITE) ---------- */
  const videos = [...document.querySelectorAll('video[data-src]')];
  const shown = v => v.getClientRects().length > 0;
  const vIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && shown(v) && !isLite()) {
        if (!v.dataset.loaded) { v.src = v.dataset.src; v.dataset.loaded = '1'; }
        v.play().catch(() => {});
      } else if (v.dataset.loaded) {
        v.pause();
      }
    });
  }, { threshold: 0.15 });
  const watchVideos = () => videos.forEach(v => { vIO.unobserve(v); vIO.observe(v); });
  watchVideos();
  matchMedia('(max-width: 900px)').addEventListener('change', watchVideos);

  /* ---------- spray paint on the hero ---------- */
  const cv = document.getElementById('spray');
  const ctx = cv.getContext('2d');
  let seed;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const bez = (p, t) => {
    const m = 1 - t;
    return [m * m * m * p[0][0] + 3 * m * m * t * p[1][0] + 3 * m * t * t * p[2][0] + t * t * t * p[3][0],
            m * m * m * p[0][1] + 3 * m * m * t * p[1][1] + 3 * m * t * t * p[2][1] + t * t * t * p[3][1]];
  };
  let strokes = [], drips = [];

  const plan = () => {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    cv.width = Math.round(r.width * dpr);
    cv.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = r.width, H = r.height;
    const wall = document.getElementById('wall').getBoundingClientRect();
    const mobile = wall.width === 0;
    strokes = mobile
      ? [{ p: [[W * .38, H * .2], [W * .6, H * .05], [W * .85, H * .22], [W * 1.02, H * .1]], r: 34, d: 110 }]
      : [
          { p: [[wall.left - r.left + wall.width * .05, H * .78], [wall.left - r.left + wall.width * .35, H * .98], [wall.left - r.left + wall.width * .72, H * .1], [wall.right - r.left + 20, H * .2]], r: 58, d: 190 },
          { p: [[W * .05, H * .24], [W * .16, H * .14], [W * .26, H * .3], [W * .34, H * .2]], r: 20, d: 60 }
        ];
    cv.style.opacity = mobile ? .5 : .9;
  };

  const sprayAt = (x, y, rad, n) => {
    for (let i = 0; i < n; i++) {
      const g = Math.abs(gauss());
      const a = rnd() * Math.PI * 2;
      const d = g * rad * .5;
      const s = rnd() < .04 ? 1.6 + rnd() * 3.4 : .5 + rnd() * 1.6;
      ctx.globalAlpha = Math.max(.08, 1 - g * .45) * (.35 + rnd() * .65);
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawDrip = (dr, len) => {
    ctx.globalAlpha = .9;
    ctx.lineWidth = dr.w;
    ctx.beginPath();
    ctx.moveTo(dr.x, dr.y);
    ctx.lineTo(dr.x, dr.y + len);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(dr.x, dr.y + len, dr.w * .9, 0, Math.PI * 2);
    ctx.fill();
  };

  const paint = animated => {
    seed = 20250614;
    plan();
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = ctx.strokeStyle = '#B5FF2E';
    ctx.lineCap = 'round';
    drips = [];
    const STEPS = 90;
    const doStep = k => {
      const t = k / STEPS;
      strokes.forEach(s => {
        const [x, y] = bez(s.p, t);
        sprayAt(x, y, s.r, s.d);
        if (rnd() < .06) {
          const b = s.r * .3 * (.5 + rnd());
          ctx.globalAlpha = .95;
          ctx.beginPath(); ctx.arc(x + gauss() * s.r * .15, y + gauss() * s.r * .15, b * .5, 0, Math.PI * 2); ctx.fill();
          if (rnd() < .55) drips.push({ x: x + gauss() * s.r * .12, y, w: 1.4 + rnd() * 2.2, L: 20 + rnd() * 90 });
        }
      });
    };
    if (!animated) {
      for (let k = 0; k <= STEPS; k++) doStep(k);
      drips.forEach(dr => drawDrip(dr, dr.L));
      return;
    }
    const t0 = performance.now(), DUR = 1100;
    let done = 0;
    const tick = now => {
      const target = Math.min(STEPS, Math.floor(((now - t0) / DUR) * STEPS));
      while (done <= target) doStep(done++);
      if (done <= STEPS) return requestAnimationFrame(tick);
      const d0 = performance.now();
      const grow = now2 => {
        const p = Math.min(1, (now2 - d0) / 900);
        const e = 1 - Math.pow(1 - p, 3);
        drips.forEach(dr => drawDrip(dr, dr.L * e));
        if (p < 1) requestAnimationFrame(grow);
      };
      requestAnimationFrame(grow);
    };
    setTimeout(() => requestAnimationFrame(tick), 250);
  };
  const startSpray = () => paint(!isLite());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(startSpray); else addEventListener('load', startSpray);
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => paint(false), 200); });

  /* ---------- wall tilt ---------- */
  const wall = document.getElementById('wall');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', e => {
      if (isLite() || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        wall.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        wall.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      });
    });
    hero.addEventListener('pointerleave', () => { wall.style.setProperty('--rx', '0deg'); wall.style.setProperty('--ry', '0deg'); });
  }

  /* ---------- parallax on photos ---------- */
  const parEls = [...document.querySelectorAll('[data-par]')];
  let parRaf = 0;
  const parallax = () => {
    parRaf = 0;
    if (isLite()) return;
    const vh = innerHeight;
    parEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.par);
      el.style.setProperty('--py', off.toFixed(1) + 'px');
    });
  };
  addEventListener('scroll', () => { if (!parRaf) parRaf = requestAnimationFrame(parallax); }, { passive: true });
  parallax();

  /* ---------- técnica picker ---------- */
  const TEC = {
    sublimacion: {
      name: 'Sublimación', alias: 'tinta termo-transferible', img: 'img/tecnica-4.jpg', cap: 'Así lo explicamos en nuestro Instagram',
      why: 'Se imprime con tintas sublimables sobre papel y, con calor, el diseño pasa a la prenda o al objeto. Es la técnica de las camisetas deportivas.',
      list: ['Camisetas deportivas con escudo, nombres y números', 'Sublimación total o parcial', 'Buzos, remeras, tazas, llaveros, gorras y almohadones']
    },
    dtf: {
      name: 'DTF', alias: 'estampado DTF', img: 'img/tecnica-7.jpg', cap: 'Así lo explicamos en nuestro Instagram',
      why: 'Se imprime con tinta textil elástica sobre film y se transfiere con calor. Banca muy bien los diseños con muchos colores y detalle.',
      list: ['Diseños full color, fotos y degradés', 'Logos con mucho detalle', 'Lo hacemos por metro o en hojas A4']
    },
    vinilo: {
      name: 'Vinilo', alias: 'vinilo termo-adhesivo', img: 'img/tecnica-5.jpg', cap: 'Así lo explicamos en nuestro Instagram',
      why: 'Se corta en plotter y se aplica con calor. Se trabaja mayormente con diseños geométricos: letras, números y logos simples.',
      list: ['Nombres, números y frases', 'Logos de uno o dos colores', 'Va en muchas telas: algodón 100%, algodón peinado, modal, frizza y grafa']
    },
    bordado: {
      name: 'Bordado', alias: 'tu logo cosido en la prenda', img: 'img/trabajo-distecna.jpg', cap: 'Así salió el pedido de Distecna',
      why: 'El logo queda cosido, con relieve. Ideal para uniformes y ropa de trabajo que se usa todos los días.',
      list: ['Logos en chombas, buzos y polar', 'Uniformes y ropa de staff', 'Distecna llevó su diseño a bordado y viajó a Mendoza en tiempo récord']
    }
  };
  const MATRIX = {
    camisetas: { full: ['sublimacion'], logo: ['sublimacion'], numeros: ['sublimacion'] },
    algodon:   { full: ['dtf'], logo: ['vinilo', 'Si el logo tiene muchos colores o detalle, conviene DTF.'], numeros: ['vinilo'] },
    empresa:   { full: ['dtf'], logo: ['bordado', 'Si preferís estampado, el logo también puede ir en DTF o vinilo.'], numeros: ['vinilo'] },
    egresados: { full: ['sublimacion'], logo: ['sublimacion'], numeros: ['sublimacion', 'Si las prendas son de algodón, los nombres van en vinilo o DTF.'] },
    marca:     { full: ['dtf'], logo: ['dtf', 'Para logos de una o dos tintas también sirve el vinilo.'], numeros: ['vinilo'] },
    merch:     { full: ['sublimacion'], logo: ['sublimacion'], numeros: ['sublimacion'] }
  };
  const QUE = { camisetas: 'camisetas deportivas', algodon: 'remeras o buzos de algodón', empresa: 'ropa para mi empresa', egresados: 'prendas de egresados', marca: 'prendas para mi marca', merch: 'tazas, gorras o regalos' };
  const DIS = { full: 'un diseño full color', logo: 'un logo o texto simple', numeros: 'nombres y números' };

  const state = { que: 'camisetas', diseno: 'full', qty: 15 };
  const $ = id => document.getElementById(id);
  const els = { name: $('rName'), alias: $('rAlias'), why: $('rWhy'), list: $('rList'), alt: $('rAlt'), send: $('rSend'), img: $('rImg'), post: $('rPost'), cap: $('rPost').querySelector('figcaption'), qty: $('qty') };
  let lastTec = null;

  const render = () => {
    const [key, alt] = MATRIX[state.que][state.diseno];
    const t = TEC[key];
    const img = key === 'sublimacion' && state.que === 'merch' ? 'img/tecnica-3.jpg' : t.img;
    if (key + img !== lastTec) {
      els.name.textContent = t.name;
      els.alias.textContent = t.alias;
      els.why.textContent = t.why;
      els.list.innerHTML = '';
      t.list.forEach(s => { const li = document.createElement('li'); li.textContent = s; els.list.appendChild(li); });
      els.img.src = img;
      els.img.alt = 'Placa de DPSTUDIO: ' + t.name;
      els.cap.textContent = t.cap;
      [els.name, els.post].forEach(el => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
      lastTec = key + img;
    }
    els.alt.textContent = alt || '';
    els.qty.textContent = state.qty;
    const unidad = state.que === 'merch' ? 'unidades' : 'prendas';
    const msg = `Hola DP! Quiero personalizar ${QUE[state.que]} con ${DIS[state.diseno]}, unas ${state.qty} ${unidad}. Vi en la web que convendría ${t.name}. ¿Me pasan presupuesto?`;
    els.send.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  };

  document.querySelectorAll('.chips').forEach(group => {
    const chips = [...group.querySelectorAll('.chip')];
    const select = chip => {
      chips.forEach(c => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-checked', on); c.tabIndex = on ? 0 : -1; });
      state[group.dataset.group] = chip.dataset.v;
      render();
    };
    chips.forEach((chip, i) => {
      chip.tabIndex = chip.classList.contains('is-on') ? 0 : -1;
      chip.addEventListener('click', () => select(chip));
      chip.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        const next = chips[(i + d + chips.length) % chips.length];
        next.focus(); select(next);
      });
    });
  });

  const stepQty = (q, d) => {
    const inc = q < 10 || (q === 10 && d < 0) ? 1 : q < 50 || (q === 50 && d < 0) ? 5 : 10;
    return Math.min(500, Math.max(1, q + d * inc));
  };
  document.querySelectorAll('.qty__btn').forEach(b => b.addEventListener('click', () => { state.qty = stepQty(state.qty, +b.dataset.d); render(); }));
  render();

  /* ---------- FPS watchdog: degrade to LITE if the device can't keep up ---------- */
  if (!isLite() && !/[?&]full\b/.test(location.search)) {
    let frames = 0, t0 = 0;
    const count = now => {
      if (document.hidden) { frames = 0; t0 = 0; return setTimeout(() => requestAnimationFrame(count), 1000); }
      if (!t0) t0 = now;
      frames++;
      if (now - t0 < 2000) return requestAnimationFrame(count);
      const fps = frames * 1000 / (now - t0);
      if (now - t0 > 4000) { frames = 0; t0 = 0; return requestAnimationFrame(count); }
      if (fps < 28) {
        html.classList.add('lite');
        try { sessionStorage.setItem('dp-lite', '1'); } catch (e) {}
        videos.forEach(v => v.pause());
      }
    };
    setTimeout(() => requestAnimationFrame(count), 1800);
  }
})();
