/* SECMET · Soluciones en metalurgia */
(() => {
  'use strict';
  const WA = '5491163580741';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesk = () => innerWidth >= 1100;
  const waUrl = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  const openWa = (t) => {
    const a = document.createElement('a');
    a.href = waUrl(t); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  };

  $('#yr').textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  const nav = $('#nav'), burger = $('#burger'), drawer = $('#drawer'), waFloat = $('#waFloat');
  const hero = $('.hero');
  const onScroll = () => {
    nav.classList.toggle('is-solid', scrollY > 30);
    waFloat.classList.toggle('show', scrollY > hero.offsetHeight * 0.75);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setDrawer = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    drawer.classList.toggle('is-open', open);
    nav.classList.toggle('is-solid', open || scrollY > 30);
  };
  burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if (!en.isIntersecting) return;
      const sibs = $$('.rv', en.target.parentElement);
      en.target.style.transitionDelay = `${Math.min(sibs.indexOf(en.target), 6) * 70}ms`;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- fitText: con letra grande en Android no se corta el H1 ---------- */
  const fit = () => {
    $$('.fit').forEach(el => {
      el.style.fontSize = '';
      const max = el.parentElement.clientWidth;
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > max + 1 && fs > 18 && n++ < 40) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('resize', fit);

  /* ---------- láminas del hero ---------- */
  const blades = $$('.blade');
  const loadVid = (b) => {
    const v = $('video', b);
    if (v.dataset.loaded) return v;
    const src = isDesk() ? v.dataset.desk : (v.dataset.mob || (b.classList.contains('is-open') ? v.dataset.desk : null));
    if (!src) return v;
    v.src = src; v.dataset.loaded = '1'; v.load();
    return v;
  };
  const openBlade = (b) => {
    blades.forEach(x => {
      const on = x === b;
      x.classList.toggle('is-open', on);
      const v = $('video', x);
      if (on) { const vv = loadVid(x); if (!reduce) vv.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    });
    sparkSource = b;
  };
  let userTouched = false;
  blades.forEach(b => {
    b.addEventListener('click', (e) => {
      userTouched = true;
      if (!b.classList.contains('is-open')) { e.preventDefault(); openBlade(b); }
    });
    b.addEventListener('mouseenter', () => { if (isDesk()) { userTouched = true; openBlade(b); } });
  });
  // en desktop las láminas rotan solas hasta que el usuario interactúa
  let rot = 0;
  setInterval(() => {
    if (userTouched || reduce || !isDesk() || document.hidden || scrollY > 300) return;
    rot = (rot + 1) % blades.length; openBlade(blades[rot]);
  }, 5200);

  /* ---------- chispas ---------- */
  const sc = $('#sparks'), sx = sc.getContext('2d');
  let sparkSource = blades[0], parts = [], heroOn = true, dpr = 1;
  const sizeSparks = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    sc.width = hero.clientWidth * dpr; sc.height = hero.clientHeight * dpr;
  };
  sizeSparks(); addEventListener('resize', sizeSparks);
  new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; }).observe(hero);
  // punto de la antorcha dentro de cada video (proporción del cuadro)
  const torch = { corte: [0.5, 0.62], herreria: [0.82, 0.3], torneria: [0.42, 0.55], pintura: [0.3, 0.3] };
  const emit = (x, y, n, hot) => {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6;
      const s = (hot ? 3 : 1) + Math.random() * (hot ? 7 : 2);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (hot ? 1 : 0), life: 1, d: 0.008 + Math.random() * 0.02, hot });
    }
  };
  const tick = () => {
    requestAnimationFrame(tick);
    if (!heroOn || document.hidden || reduce) return;
    const hr = hero.getBoundingClientRect();
    sx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sx.clearRect(0, 0, sc.width, sc.height);
    if (sparkSource) {
      const r = sparkSource.getBoundingClientRect();
      const t = torch[sparkSource.dataset.oficio] || [0.5, 0.5];
      if (sparkSource.dataset.oficio !== 'pintura' && sparkSource.dataset.oficio !== 'torneria') {
        emit(r.left - hr.left + r.width * t[0], r.top - hr.top + r.height * t[1], 3, true);
      }
    }
    if (Math.random() < 0.35) emit(Math.random() * hr.width, hr.height + 4, 1, false);
    sx.globalCompositeOperation = 'lighter';
    parts = parts.filter(p => p.life > 0);
    if (parts.length > 420) parts.splice(0, parts.length - 420);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.hot) { p.vy += 0.22; p.vx *= 0.985; } else { p.vy -= 0.004; p.vx += (Math.random() - 0.5) * 0.08; }
      p.life -= p.d;
      const al = Math.max(p.life, 0);
      sx.strokeStyle = `rgba(255,${120 + 100 * al | 0},${30 * al | 0},${al})`;
      sx.lineWidth = p.hot ? 1.6 : 1.2;
      sx.beginPath(); sx.moveTo(p.x, p.y); sx.lineTo(p.x - p.vx * (p.hot ? 2.2 : 3), p.y - p.vy * (p.hot ? 2.2 : 3)); sx.stroke();
    }
    sx.globalCompositeOperation = 'source-over';
  };
  requestAnimationFrame(tick);
  openBlade(blades[0]);

  /* ---------- pantógrafo ---------- */
  const cv = $('#plate'), cx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const ui = {
    text: $('#pText'), w: $('#pW'), h: $('#pH'), form: $('#pForm'), cut: $('#pCut'), wa: $('#pWa'),
    led: $('#pLed'), st: $('#pStatus'), pct: $('#pPct'), ruler: $('#rulerW')
  };
  const FONT = '"Russo One", "Arial Black", sans-serif';
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const table = mk(W, H), plateL = mk(W, H), mask = mk(W, H), kerf = mk(W, H), glow = mk(W, H);
  let job = null, raf = 0, sparksP = [], paintT = 0, state = 'idle';

  // mesa de corte: listones en zigzag que se ven a través de los calados
  (() => {
    const t = table.getContext('2d');
    t.fillStyle = '#060607'; t.fillRect(0, 0, W, H);
    for (let x = 18; x < W; x += 36) {
      t.strokeStyle = '#1a1b1e'; t.lineWidth = 4;
      t.beginPath();
      for (let y = 0; y <= H; y += 12) t.lineTo(x + ((y / 12) % 2 ? 5 : -5), y);
      t.stroke();
    }
    const g = t.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.6);
    g.addColorStop(0, 'rgba(255,106,19,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    t.fillStyle = g; t.fillRect(0, 0, W, H);
  })();

  const opts = () => {
    const shape = $('input[name=shape]:checked').value;
    const col = $('input[name=color]:checked');
    let w = Math.min(Math.max(+ui.w.value || 60, 10), 400);
    let h = Math.min(Math.max(+ui.h.value || 30, 5), 300);
    return { text: (ui.text.value.trim() || 'SECMET').toUpperCase(), shape, w, h, color: col.dataset.c, colorName: col.value };
  };

  const geom = (o) => {
    const ar = Math.min(Math.max(o.w / o.h, 0.35), 3.2);
    let pw = W * 0.86, ph = pw / ar;
    if (ph > H * 0.82) { ph = H * 0.82; pw = ph * ar; }
    return { x: (W - pw) / 2, y: (H - ph) / 2, w: pw, h: ph };
  };

  const platePath = (c, g, shape) => {
    c.beginPath();
    if (shape === 'ovalo') c.ellipse(g.x + g.w / 2, g.y + g.h / 2, g.w / 2, g.h / 2, 0, 0, Math.PI * 2);
    else c.rect(g.x, g.y, g.w, g.h);
  };

  // reparte el texto en 1 a 3 líneas buscando la letra más grande posible
  const layout = (c, text, g, shape) => {
    const words = text.split(/\s+/);
    const inset = shape === 'marco' ? 0.72 : shape === 'ovalo' ? 0.66 : 0.82;
    const bw = g.w * inset, bh = g.h * (shape === 'ovalo' ? 0.56 : inset * 0.86);
    let best = null;
    for (let n = 1; n <= Math.min(3, words.length); n++) {
      const per = Math.ceil(words.length / n), lines = [];
      for (let i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per).join(' '));
      c.font = `100px ${FONT}`;
      const widest = Math.max(...lines.map(l => c.measureText(l).width));
      const fs = Math.min(bw / widest * 100, bh / (lines.length * 1.12));
      if (!best || fs > best.fs) best = { lines, fs };
    }
    return best;
  };

  const drawText = (c, o, g, mode) => {
    const L = layout(c, o.text, g, o.shape);
    c.font = `${L.fs}px ${FONT}`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const lh = L.fs * 1.12, y0 = g.y + g.h / 2 - (L.lines.length - 1) * lh / 2;
    L.lines.forEach((l, i) => {
      const y = y0 + i * lh + L.fs * 0.04;
      if (mode === 'fill') c.fillText(l, g.x + g.w / 2, y);
      else c.strokeText(l, g.x + g.w / 2, y);
    });
  };

  const drawFrame = (c, o, g) => {
    if (o.shape !== 'marco') return;
    const m = Math.min(g.w, g.h) * 0.07, t = Math.max(Math.min(g.w, g.h) * 0.025, 4);
    c.beginPath();
    c.rect(g.x + m, g.y + m, g.w - 2 * m, g.h - 2 * m);
    c.rect(g.x + m + t, g.y + m + t, g.w - 2 * (m + t), g.h - 2 * (m + t));
    c.fill('evenodd');
  };

  const steel = (c, g, shape) => {
    const gr = c.createLinearGradient(g.x, g.y, g.x + g.w, g.y + g.h);
    gr.addColorStop(0, '#8f969e'); gr.addColorStop(0.45, '#5a6067'); gr.addColorStop(0.6, '#9ba2aa'); gr.addColorStop(1, '#646a71');
    c.save(); platePath(c, g, shape); c.clip();
    c.fillStyle = gr; c.fillRect(g.x, g.y, g.w, g.h);
    c.globalAlpha = 0.09; c.strokeStyle = '#fff';
    for (let y = g.y; y < g.y + g.h; y += 3) { c.beginPath(); c.moveTo(g.x, y + Math.random()); c.lineTo(g.x + g.w, y + Math.random() * 2); c.stroke(); }
    c.restore();
  };

  const paint = (c, g, shape, color, t) => {
    if (!color || t <= 0) return;
    c.save(); platePath(c, g, shape); c.clip();
    const top = g.y + g.h * (1 - t);
    c.fillStyle = color; c.fillRect(g.x, top, g.w, g.y + g.h - top);
    const sh = c.createLinearGradient(g.x, g.y, g.x + g.w, g.y + g.h);
    sh.addColorStop(0, 'rgba(255,255,255,.10)'); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.18)');
    c.fillStyle = sh; c.fillRect(g.x, top, g.w, g.y + g.h - top);
    c.restore();
  };

  // borde del calado → recorrido ordenado de la antorcha
  const tracePath = (o, g) => {
    const s = 2, mw = W / s | 0, mh = H / s | 0;
    const m = mk(mw, mh), mc = m.getContext('2d');
    mc.scale(1 / s, 1 / s); mc.fillStyle = '#fff';
    drawText(mc, o, g, 'fill'); drawFrame(mc, o, g);
    const d = mc.getImageData(0, 0, mw, mh).data;
    const on = (x, y) => x >= 0 && y >= 0 && x < mw && y < mh && d[(y * mw + x) * 4 + 3] > 127;
    const pts = [];
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      if (on(x, y) && (!on(x - 1, y) || !on(x + 1, y) || !on(x, y - 1) || !on(x, y + 1))) pts.push([x * s, y * s]);
    }
    // vecino más cercano con grilla de cubetas
    const B = 12, bx = Math.ceil(W / B), buckets = new Map();
    pts.forEach((p, i) => { const k = (p[1] / B | 0) * bx + (p[0] / B | 0); (buckets.get(k) || buckets.set(k, []).get(k)).push(i); });
    const used = new Uint8Array(pts.length), out = [];
    let cur = pts.length ? 0 : -1;
    while (cur >= 0) {
      used[cur] = 1; out.push(pts[cur]);
      const [x, y] = pts[cur], gx = x / B | 0, gy = y / B | 0;
      let best = -1, bd = Infinity;
      for (let r = 1; r <= 3 && best < 0; r++) {
        for (let j = gy - r; j <= gy + r; j++) for (let i = gx - r; i <= gx + r; i++) {
          const arr = buckets.get(j * bx + i); if (!arr) continue;
          for (const q of arr) if (!used[q]) { const dd = (pts[q][0] - x) ** 2 + (pts[q][1] - y) ** 2; if (dd < bd) { bd = dd; best = q; } }
        }
      }
      if (best < 0) { // salto: próximo contorno sin cortar
        for (let q = 0; q < pts.length; q++) if (!used[q]) { const dd = (pts[q][0] - x) ** 2 + (pts[q][1] - y) ** 2; if (dd < bd) { bd = dd; best = q; } }
      }
      cur = best;
    }
    return out;
  };

  const render = () => {
    const o = job.o, g = job.g;
    cx.clearRect(0, 0, W, H);
    cx.drawImage(table, 0, 0);
    const p = plateL.getContext('2d');
    p.clearRect(0, 0, W, H);
    steel(p, g, o.shape);
    if (state === 'done') {
      paint(p, g, o.shape, o.color, paintT);
      p.globalCompositeOperation = 'destination-out';
      p.drawImage(mask, 0, 0);
      p.globalCompositeOperation = 'source-over';
    }
    // sombra de la placa sobre la mesa
    if (state === 'done') { // luz detrás de los calados, como cartel retroiluminado
      cx.save(); cx.globalAlpha = Math.min(1, 0.35 + paintT * 0.65); cx.drawImage(glow, 0, 0); cx.restore();
    }
    cx.save(); cx.shadowColor = 'rgba(0,0,0,.7)'; cx.shadowBlur = 30; cx.shadowOffsetY = 10;
    cx.drawImage(plateL, 0, 0); cx.restore();
    cx.save(); cx.strokeStyle = 'rgba(255,255,255,.28)'; cx.lineWidth = 1.5; platePath(cx, g, o.shape); cx.stroke(); cx.restore();
    if (state === 'idle') {
      cx.save(); cx.setLineDash([7, 6]); cx.lineWidth = 2; cx.strokeStyle = 'rgba(255,255,255,.75)';
      drawText(cx, o, g, 'stroke');
      if (o.shape === 'marco') { cx.fillStyle = 'rgba(255,255,255,.18)'; drawFrame(cx, o, g); }
      cx.restore();
    }
    if (state === 'cutting') cx.drawImage(kerf, 0, 0);
    if (state === 'done' && paintT < 1 && o.color) {
      // brillo del horno mientras se pinta
      cx.save(); cx.globalCompositeOperation = 'lighter'; cx.globalAlpha = 0.35 * (1 - paintT);
      cx.fillStyle = '#ff5a10'; platePath(cx, g, o.shape); cx.fill(); cx.restore();
    }
  };

  const prep = () => {
    cancelAnimationFrame(raf);
    const o = opts(), g = geom(o);
    job = { o, g };
    const m = mask.getContext('2d');
    m.clearRect(0, 0, W, H); m.fillStyle = '#000';
    drawText(m, o, g, 'fill'); drawFrame(m, o, g);
    kerf.getContext('2d').clearRect(0, 0, W, H);
    const gl = glow.getContext('2d');
    gl.clearRect(0, 0, W, H);
    gl.save(); gl.shadowColor = '#ff6a13'; gl.shadowBlur = 38;
    for (let k = 0; k < 2; k++) gl.drawImage(mask, 0, 0);
    gl.restore();
    gl.globalCompositeOperation = 'source-in';
    const lg = gl.createLinearGradient(0, g.y, 0, g.y + g.h);
    lg.addColorStop(0, '#ffc46b'); lg.addColorStop(0.5, '#ff7a1a'); lg.addColorStop(1, '#e2500c');
    gl.fillStyle = lg; gl.fillRect(0, 0, W, H);
    gl.globalCompositeOperation = 'source-over';
    state = 'idle'; paintT = 0; sparksP = [];
    ui.ruler.textContent = `${o.w} × ${o.h} cm`;
    ui.st.textContent = 'Diseño marcado · listo para cortar';
    ui.pct.textContent = '0%';
    ui.led.className = 'led';
    ui.cut.disabled = false; ui.cut.textContent = 'Cortar';
    ui.wa.setAttribute('aria-disabled', 'true');
    render();
  };

  const msg = (o) => [
    'Hola SECMET, quiero cotizar un corte por pantógrafo:',
    `• Texto/diseño: ${o.text}`,
    `• Forma: ${{ rect: 'Cartel', marco: 'Cartel con marco', ovalo: 'Óvalo' }[o.shape]}`,
    `• Medida aproximada: ${o.w} × ${o.h} cm`,
    `• Terminación: ${o.color ? 'pintura electrostática ' + o.colorName.toLowerCase() : 'sin pintar'}`,
    '¿Me pasan presupuesto?'
  ].join('\n');

  const finish = () => {
    state = 'done'; ui.pct.textContent = '100%';
    ui.st.textContent = job.o.color ? 'Cortado · pintando al horno…' : 'Cortado';
    ui.led.className = 'led on';
    const t0 = performance.now();
    const step = (now) => {
      paintT = job.o.color && !reduce ? Math.min((now - t0) / 1100, 1) : 1;
      render();
      if (paintT < 1) raf = requestAnimationFrame(step);
      else {
        ui.led.className = 'led ok';
        ui.st.textContent = job.o.color ? `Listo · ${job.o.colorName}` : 'Listo · chapa sin pintar';
        ui.cut.disabled = false; ui.cut.textContent = 'Otra vez';
        ui.wa.href = waUrl(msg(job.o));
        ui.wa.setAttribute('aria-disabled', 'false');
      }
    };
    raf = requestAnimationFrame(step);
  };

  const cut = () => {
    prep();
    const path = tracePath(job.o, job.g);
    if (!path.length) return;
    state = 'cutting'; ui.cut.disabled = true; ui.cut.textContent = 'Cortando…';
    ui.led.className = 'led on'; ui.st.textContent = 'Cortando';
    if (reduce) { finish(); return; }
    const k = kerf.getContext('2d');
    const total = path.length, dur = Math.min(2600 + total * 0.35, 5200);
    let i = 0; const t0 = performance.now();
    const step = (now) => {
      const target = Math.min(total, Math.floor((now - t0) / dur * total));
      k.lineCap = 'round';
      for (; i < target; i++) {
        const a = path[i - 1], b = path[i];
        if (a && (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 < 40) {
          k.strokeStyle = '#0a0a0a'; k.lineWidth = 3;
          k.beginPath(); k.moveTo(a[0], a[1]); k.lineTo(b[0], b[1]); k.stroke();
        }
      }
      render();
      // brasa del corte reciente
      cx.save(); cx.globalCompositeOperation = 'lighter'; cx.lineCap = 'round';
      for (let j = Math.max(1, i - 70); j < i; j++) {
        const a = path[j - 1], b = path[j];
        if ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 >= 40) continue;
        const f = (j - (i - 70)) / 70;
        cx.strokeStyle = `rgba(255,${90 + 120 * f | 0},20,${f})`; cx.lineWidth = 2 + 2 * f;
        cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke();
      }
      const tp = path[Math.max(0, i - 1)];
      const gl = cx.createRadialGradient(tp[0], tp[1], 0, tp[0], tp[1], 46);
      gl.addColorStop(0, 'rgba(255,255,255,1)'); gl.addColorStop(0.15, 'rgba(190,210,255,.9)'); gl.addColorStop(0.4, 'rgba(255,120,30,.35)'); gl.addColorStop(1, 'rgba(255,90,10,0)');
      cx.fillStyle = gl; cx.beginPath(); cx.arc(tp[0], tp[1], 46, 0, Math.PI * 2); cx.fill();
      for (let n = 0; n < 4; n++) {
        const a = Math.PI / 2 + (Math.random() - 0.5) * 2.4, s = 2 + Math.random() * 6;
        sparksP.push({ x: tp[0], y: tp[1], vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.6 - 2, l: 1 });
      }
      sparksP = sparksP.filter(p => (p.l -= 0.035) > 0).slice(-260);
      for (const p of sparksP) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.35;
        cx.strokeStyle = `rgba(255,${150 + 90 * p.l | 0},60,${p.l})`; cx.lineWidth = 1.5;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8); cx.stroke();
      }
      cx.restore();
      // cabezal del pantógrafo
      cx.fillStyle = 'rgba(40,42,46,.9)'; cx.fillRect(tp[0] - 9, 0, 18, tp[1] - 16);
      cx.fillStyle = '#ff6a13'; cx.fillRect(tp[0] - 13, tp[1] - 30, 26, 12);
      ui.pct.textContent = Math.round(i / total * 100) + '%';
      if (i < total) raf = requestAnimationFrame(step); else finish();
    };
    raf = requestAnimationFrame(step);
  };

  ui.form.addEventListener('submit', (e) => { e.preventDefault(); cut(); });
  ui.form.addEventListener('input', (e) => { if (e.target.name !== 'color' || state !== 'done') prep(); else { job.o = opts(); paintT = 0; finish(); } });
  $$('.presets button').forEach(b => b.addEventListener('click', () => {
    ui.text.value = b.dataset.t;
    if (/^\d+$/.test(b.dataset.t)) { ui.w.value = 40; ui.h.value = 15; }
    else if (b.dataset.t.length > 14) { ui.w.value = 90; ui.h.value = 60; }
    else { ui.w.value = 60; ui.h.value = 30; }
    prep();
  }));
  (document.fonts ? document.fonts.load(`80px ${FONT}`) : Promise.resolve()).then(prep, prep);
  // primer corte automático cuando la mesa entra en pantalla
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { obs.disconnect(); setTimeout(() => { if (state === 'idle') cut(); }, 400); }
  }, { threshold: 0.5 }).observe(cv);

  /* ---------- pedido ---------- */
  const ped = $('#ped'), pedErr = $('#pedErr');
  const NAMES = { herreria: 'Herrería', torneria: 'Tornería', corte: 'Corte por pantógrafo', pintura: 'Pintura electrostática al horno' };
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => {
    const cb = $(`#pedSvc input[value="${a.dataset.pick}"]`);
    if (cb) cb.checked = true;
    if (a.dataset.who) $('#pedWho').value = a.dataset.who;
    pedErr.hidden = true;
  }));
  ped.addEventListener('change', () => { if ($$('#pedSvc input:checked').length) pedErr.hidden = true; });
  ped.addEventListener('submit', (e) => {
    e.preventDefault();
    const svcs = $$('#pedSvc input:checked').map(i => NAMES[i.value]);
    if (!svcs.length) { pedErr.hidden = false; $('#pedSvc input').focus(); return; }
    const name = $('#pedName').value.trim(), det = $('#pedMsg').value.trim();
    openWa([
      `Hola SECMET${name ? ', soy ' + name : ''}. Quiero un presupuesto sin cargo.`,
      `• Servicio: ${svcs.join(', ')}`,
      `• Soy: ${$('#pedWho').value}`,
      det ? `• Trabajo: ${det}` : '• Les mando fotos/medidas por acá.'
    ].join('\n'));
  });

  /* ---------- placas ---------- */
  const lb = $('#lb'), lbImg = $('#lbImg');
  $$('.pl').forEach(b => b.addEventListener('click', () => {
    lbImg.src = b.dataset.src; lbImg.alt = $('img', b).alt;
    $('#lbShare').href = waUrl('Mirá SECMET: herrería, tornería, pintura electrostática y corte por pantógrafo en Rafael Calzada → https://secmet.tupaginaya.com.ar/');
    if (lb.showModal) lb.showModal(); else window.open(b.dataset.src);
  }));
  $('#lbX').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
})();
