(() => {
  'use strict';
  const WA = '5491126169382';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const fmt = n => (Math.round(n * 10) / 10).toLocaleString('es-AR');

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  const menu = $('#menu');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }));

  /* ---------- Video del hero según pantalla ---------- */
  const video = $('.hero__video');
  if (video) {
    const mobile = matchMedia('(max-width: 768px)').matches;
    if (mobile) video.poster = video.dataset.posterMobile;
    video.src = mobile ? video.dataset.srcMobile : video.dataset.srcDesktop;
    video.play().catch(() => {});
  }

  /* ---------- Servicios: tablas que se abren ---------- */
  const planks = $$('.plank');
  const openPlank = p => planks.forEach(x => {
    const on = x === p;
    x.classList.toggle('is-open', on);
    $('.plank__head', x).setAttribute('aria-expanded', on);
  });
  planks.forEach((p, i) => {
    if (i === 0) p.classList.add('is-open');
    $('.plank__head', p).addEventListener('click', () => {
      if (p.classList.contains('is-open')) {
        p.classList.remove('is-open');
        $('.plank__head', p).setAttribute('aria-expanded', 'false');
      } else openPlank(p);
    });
  });

  /* ---------- Muestra para pulir ---------- */
  const sample = $('#sample');
  const canvas = $('#worn');
  const disc = $('#disc');
  const img = $('.sample__clean', sample);
  const pctEl = $('#pct');
  const bar = $('#meterBar');
  let ctx, W = 0, H = 0, polished = 0, drawing = false, last = null, checkT = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  function paintWorn() {
    const r = sample.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
    canvas.width = W; canvas.height = H;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.globalCompositeOperation = 'source-over';
    if ('filter' in ctx) ctx.filter = 'grayscale(.6) sepia(.25) brightness(.72) contrast(.8)';
    ctx.drawImage(img, 0, 0, W, H);
    ctx.filter = 'none';
    // velo gris de desgaste
    ctx.fillStyle = 'rgba(120,110,98,.38)';
    ctx.fillRect(0, 0, W, H);
    // manchas
    for (let i = 0; i < 9; i++) {
      const x = rand(0, W), y = rand(0, H), rr = rand(30, 110) * dpr;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
      g.addColorStop(0, 'rgba(40,28,18,.45)'); g.addColorStop(.7, 'rgba(40,28,18,.12)'); g.addColorStop(1, 'rgba(40,28,18,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * rand(.5, .9), rand(0, 3), 0, 7); ctx.fill();
    }
    // rayas
    ctx.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const x = rand(0, W), y = rand(0, H), len = rand(20, 160) * dpr, a = rand(-.5, .5) + (Math.random() < .5 ? 0 : Math.PI / 2);
      ctx.strokeStyle = `rgba(230,220,205,${rand(.18, .45)})`;
      ctx.lineWidth = rand(.6, 1.8) * dpr;
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a) * len / 2 + rand(-6, 6), y + Math.sin(a) * len / 2 + rand(-6, 6), x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    polished = 0; updateMeter(0);
    sample.classList.remove('is-done');
  }
  function updateMeter(p) {
    pctEl.textContent = Math.round(p);
    bar.style.width = p + '%';
  }
  function measure() {
    const step = 16;
    const data = ctx.getImageData(0, 0, W, H).data;
    let clear = 0, total = 0;
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
      total++;
      if (data[(y * W + x) * 4 + 3] < 40) clear++;
    }
    polished = Math.min(100, clear / total * 100 * 1.04);
    updateMeter(polished);
    if (polished >= 96) finish();
  }
  function finish() {
    updateMeter(100);
    sample.classList.add('is-done', 'is-touched');
  }
  function point(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H, cx: e.clientX - r.left, cy: e.clientY - r.top, rw: r.width };
  }
  function scrub(p) {
    const rad = Math.max(34, p.rw * .07) * (W / p.rw);
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(p.x, p.y, rad * .55, p.x, p.y, rad);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    const stamp = (x, y) => { ctx.fillStyle = g; ctx.save(); ctx.translate(x - p.x, y - p.y); ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 7); ctx.fill(); ctx.restore(); };
    if (last) {
      const d = Math.hypot(p.x - last.x, p.y - last.y), n = Math.ceil(d / (rad * .3));
      for (let i = 1; i <= n; i++) stamp(last.x + (p.x - last.x) * i / n, last.y + (p.y - last.y) * i / n);
    } else stamp(p.x, p.y);
    last = p;
    const now = performance.now();
    if (now - checkT > 180) { checkT = now; measure(); }
  }
  function moveDisc(p) {
    const d = Math.max(34, p.rw * .07) * 2;
    disc.style.setProperty('--d', d + 'px');
    disc.style.transform = `translate(${p.cx}px, ${p.cy}px)`;
  }
  if (sample && canvas) {
    const start = () => { if (img.complete && img.naturalWidth) paintWorn(); else img.addEventListener('load', paintWorn, { once: true }); };
    start();
    let rw = sample.clientWidth;
    new ResizeObserver(() => { if (Math.abs(sample.clientWidth - rw) > 2) { rw = sample.clientWidth; if (polished < 96) paintWorn(); } }).observe(sample);

    canvas.addEventListener('pointerdown', e => {
      drawing = true; last = null;
      canvas.setPointerCapture(e.pointerId);
      sample.classList.add('is-touched', 'is-hover');
      const p = point(e); moveDisc(p); scrub(p);
    });
    canvas.addEventListener('pointermove', e => {
      const p = point(e); moveDisc(p);
      sample.classList.add('is-hover');
      if (drawing) scrub(p);
    });
    const end = () => { drawing = false; last = null; if (ctx) measure(); };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') sample.classList.remove('is-hover'); });

    // Pulir todo: barrido automático en franjas
    $('#autoPolish').addEventListener('click', () => {
      if (sample.classList.contains('is-done')) { paintWorn(); return; }
      const r = canvas.getBoundingClientRect();
      const rows = 6; let t = 0; const dur = 1600;
      sample.classList.add('is-touched', 'is-hover');
      last = null;
      const t0 = performance.now();
      const tick = now => {
        t = Math.min(1, (now - t0) / dur);
        const row = Math.min(rows - 1, Math.floor(t * rows));
        const k = (t * rows) % 1;
        const dir = row % 2 ? 1 - k : k;
        const p = { cx: dir * r.width, cy: (row + .5) / rows * r.height, rw: r.width };
        p.x = p.cx / r.width * W; p.y = p.cy / r.height * H;
        if (last && Math.abs(last.y - p.y) > 1) last = null;
        moveDisc(p); scrub(p);
        if (t < 1) requestAnimationFrame(tick);
        else { last = null; sample.classList.remove('is-hover'); finish(); $('#autoPolish').textContent = 'Volver a empezar'; }
      };
      requestAnimationFrame(tick);
    });
  }

  // Acabados
  const finishes = $$('.finish__opt');
  const FINISH_TO_QUOTE = { brillante: 'plastificado brillante', mate: 'plastificado mate', hidro: 'hidrolaqueado' };
  let currentFinish = 'brillante';
  sample.dataset.finish = currentFinish;
  finishes.forEach(b => b.addEventListener('click', () => {
    currentFinish = b.dataset.finish;
    finishes.forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', on); });
    sample.dataset.finish = currentFinish;
  }));
  $('#useFinish').addEventListener('click', () => {
    const r = $(`input[name="acabado"][value="${FINISH_TO_QUOTE[currentFinish]}"]`);
    if (r) { r.checked = true; }
    const serv = currentFinish === 'hidro' ? 'Hidrolaqueado' : 'Plastificado';
    const c = $(`[data-group="serv"] input[value="${serv}"]`);
    if (c) c.checked = true;
    save(); render();
  });

  /* ---------- Presupuesto ---------- */
  const KEY = 'pulimax-consulta-v1';
  const form = $('#quote');
  const roomsEl = $('#rooms');
  const roomsEmpty = $('#roomsEmpty');
  let rooms = [];

  function roomRow(r, i) {
    const li = document.createElement('li');
    li.className = 'room' + (r.steps !== undefined ? ' room--steps' : '');
    li.dataset.i = i;
    if (r.steps !== undefined) {
      li.innerHTML = `<span class="room__name">${r.name}</span>
        <label><span class="sr">Cantidad de escalones</span><input type="number" inputmode="numeric" min="1" step="1" placeholder="Cant. de escalones" value="${r.steps || ''}" data-k="steps" aria-label="Cantidad de escalones"></label>
        <button type="button" class="room__del" aria-label="Quitar ${r.name}">×</button>`;
    } else {
      li.innerHTML = `<span class="room__name">${r.name}</span>
        <input type="text" inputmode="decimal" placeholder="Largo m" value="${r.l || ''}" data-k="l" aria-label="Largo de ${r.name} en metros">
        <span class="room__x">×</span>
        <input type="text" inputmode="decimal" placeholder="Ancho m" value="${r.a || ''}" data-k="a" aria-label="Ancho de ${r.name} en metros">
        <span class="room__m2"></span>
        <button type="button" class="room__del" aria-label="Quitar ${r.name}">×</button>`;
    }
    return li;
  }
  const num = v => { const n = parseFloat(String(v || '').replace(',', '.')); return isFinite(n) && n > 0 ? n : 0; };
  const area = r => num(r.l) * num(r.a);
  function drawRooms() {
    roomsEl.innerHTML = '';
    rooms.forEach((r, i) => roomsEl.appendChild(roomRow(r, i)));
    roomsEmpty.hidden = rooms.length > 0;
    updateRoomM2();
  }
  function updateRoomM2() {
    $$('.room', roomsEl).forEach(li => {
      const r = rooms[li.dataset.i]; const m = $('.room__m2', li);
      if (m) m.textContent = area(r) ? fmt(area(r)) + ' m²' : '— m²';
    });
  }
  function nameFor(base) {
    const n = rooms.filter(r => r.base === base).length;
    return n ? `${base} ${n + 1}` : base;
  }
  $$('.rooms-add button').forEach(b => b.addEventListener('click', () => {
    const base = b.dataset.room;
    const r = base === 'Escalera' ? { base, name: nameFor(base), steps: '' } : { base, name: nameFor(base), l: '', a: '' };
    rooms.push(r);
    drawRooms(); save(); render();
    const inp = $$('.room input', roomsEl).slice(-2)[0];
    if (inp && matchMedia('(pointer:fine)').matches) inp.focus();
  }));
  roomsEl.addEventListener('input', e => {
    const li = e.target.closest('.room'); if (!li) return;
    rooms[li.dataset.i][e.target.dataset.k] = e.target.value;
    updateRoomM2(); save(); render();
  });
  roomsEl.addEventListener('click', e => {
    const del = e.target.closest('.room__del'); if (!del) return;
    rooms.splice(del.closest('.room').dataset.i, 1);
    drawRooms(); save(); render();
  });

  const checked = g => $$(`[data-group="${g}"] input:checked`).map(i => i.value);
  function state() {
    return {
      serv: checked('serv'), piso: checked('piso')[0] || '', estado: checked('estado'), acabado: checked('acabado')[0] || '',
      zona: $('#zona').value.trim(), nombre: $('#nombre').value.trim(), cuando: $('#cuando').value, rooms
    };
  }
  function save() { store.set(KEY, state()); }
  function load() {
    const s = store.get(KEY); if (!s) return;
    (s.serv || []).forEach(v => { const i = $(`[data-group="serv"] input[value="${v}"]`); if (i) i.checked = true; });
    (s.estado || []).forEach(v => { const i = $(`[data-group="estado"] input[value="${v}"]`); if (i) i.checked = true; });
    if (s.piso) { const i = $(`input[name="piso"][value="${s.piso}"]`); if (i) i.checked = true; }
    if (s.acabado) { const i = $(`input[name="acabado"][value="${s.acabado}"]`); if (i) i.checked = true; }
    $('#zona').value = s.zona || ''; $('#nombre').value = s.nombre || ''; $('#cuando').value = s.cuando || '';
    rooms = Array.isArray(s.rooms) ? s.rooms.filter(r => r && r.name) : [];
  }
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
  function message(s, total) {
    const L = [];
    L.push(`Hola Pulimax! ${s.nombre ? 'Soy ' + s.nombre + '. ' : ''}Quiero pedir un presupuesto.`);
    if (s.serv.length) L.push(`• Necesito: ${list(s.serv.map(v => v.toLowerCase()))}`);
    if (s.piso) L.push(`• Piso: ${s.piso.toLowerCase()}`);
    if (s.rooms.length) {
      L.push('• Ambientes:');
      s.rooms.forEach(r => {
        if (r.steps !== undefined) L.push(`   - ${r.name}: ${num(r.steps) ? Math.round(num(r.steps)) + ' escalones' : 'cantidad a confirmar'}`);
        else L.push(`   - ${r.name}: ${area(r) ? `${fmt(num(r.l))} × ${fmt(num(r.a))} m = ${fmt(area(r))} m²` : 'medidas a confirmar'}`);
      });
      if (total) L.push(`• Total aprox.: ${fmt(total)} m²`);
    }
    if (s.estado.length) L.push(`• Estado: ${list(s.estado)}`);
    if (s.acabado) L.push(`• Acabado: ${s.acabado}`);
    if (s.zona) L.push(`• Zona: ${s.zona}`);
    if (s.cuando) L.push(`• Para: ${s.cuando.toLowerCase()}`);
    L.push('Les mando fotos del piso por acá.');
    return L.join('\n');
  }
  function render() {
    const s = state();
    const total = rooms.reduce((t, r) => t + (r.steps === undefined ? area(r) : 0), 0);
    $('#totalM2').textContent = fmt(total);
    const steps = rooms.filter(r => r.steps !== undefined).reduce((t, r) => t + Math.round(num(r.steps)), 0);
    $('#cardSub').textContent = rooms.length
      ? `${rooms.length} ${rooms.length === 1 ? 'ambiente' : 'ambientes'}${steps ? ` + ${steps} escalones` : ''}`
      : 'Sumá ambientes para calcular la superficie.';
    const rows = [
      ['Trabajo', s.serv.length ? list(s.serv) : '—'],
      ['Piso', s.piso || '—'],
      ['Estado', s.estado.length ? list(s.estado) : '—'],
      ['Acabado', s.acabado || '—'],
      ['Zona', s.zona || '—']
    ];
    $('#cardList').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd></dd></div>`).join('');
    $$('#cardList dd').forEach((dd, i) => { dd.textContent = rows[i][1]; });
    const msg = message(s, total);
    $('#msgPreview').textContent = msg;
    $('#sendWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }
  form.addEventListener('input', e => { if (!e.target.closest('.rooms')) { save(); render(); } });
  form.addEventListener('change', e => { if (!e.target.closest('.rooms')) { save(); render(); } });
  form.addEventListener('submit', e => e.preventDefault());
  $('#resetQuote').addEventListener('click', () => {
    form.reset(); rooms = []; drawRooms(); save(); render();
  });

  // Presets desde los servicios
  $$('[data-preset]').forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.preset;
    const i = $(`[data-group="serv"] input[value="${v}"]`);
    if (i) i.checked = true;
    if (v === 'Colocación de deck') { const p = $('input[name="piso"][value="Deck exterior"]'); if (p) p.checked = true; }
    save(); render();
  }));

  load(); drawRooms(); render();

  /* ---------- FAB: se oculta con CTAs a la vista ---------- */
  const fab = $('.fab');
  const ctaZones = $$('.hero__ctas, .cierre__phone, #sendWa');
  const visible = new Set();
  const fio = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    fab.classList.toggle('is-hidden', visible.size > 0);
  });
  ctaZones.forEach(z => fio.observe(z));

  /* ---------- Reveal ---------- */
  const rv = $$('.sec-head, .plank, .muestra__copy, .muestra__stage, fieldset, .steps li, .porque__media, .porque__list li, .deck__box, .faq details, .cierre__logo, .cierre__copy');
  rv.forEach(el => el.classList.add('rv'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...e.target.parentElement.children].filter(x => x.classList.contains('rv'));
    e.target.style.transitionDelay = Math.min(sibs.indexOf(e.target), 5) * 70 + 'ms';
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  rv.forEach(el => io.observe(el));
})();
