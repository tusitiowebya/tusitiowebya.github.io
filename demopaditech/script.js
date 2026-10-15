/* =========================================================
   PADITECH — cámaras IP Imou y EZVIZ · interacciones
   ========================================================= */
(function () {
  'use strict';

  const html = document.documentElement;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const WA = '5491164477756';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const params = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } }
  };

  /* ---------- modo liviano: sin aceleración por hardware ---------- */
  let webglOK = false;
  (function detectSoftwareRender() {
    const forceFull = params.has('full');
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) { if (!forceFull) html.classList.add('lite'); return; }
      webglOK = true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      if (!forceFull && /swiftshader|llvmpipe|software|basic render/i.test(r)) html.classList.add('lite');
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    } catch (e) { /* sin datos: seguimos en modo completo */ }
  })();

  const QA = html.classList.contains('qa');
  const isLite = () => html.classList.contains('lite');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobileQ = matchMedia('(max-width: 768px)');
  const navH = () => ($('#nav') ? $('#nav').offsetHeight : 68);

  /* ---------- enlaces de WhatsApp con mensaje propio ---------- */
  $$('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- relojes: hora de Buenos Aires y tiempo de grabación ---------- */
  const fmt = (() => {
    try {
      return new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    } catch (e) { return null; }
  })();
  const pad = n => String(n).padStart(2, '0');
  const t0 = Date.now();
  const clocks = $$('[data-clock]'), fulls = $$('[data-clock-full]'), recs = $$('[data-rec]');
  function tick() {
    const now = new Date();
    let p = {};
    if (fmt) fmt.formatToParts(now).forEach(x => { p[x.type] = x.value; });
    else p = { day: pad(now.getDate()), month: pad(now.getMonth() + 1), year: now.getFullYear(), hour: pad(now.getHours()), minute: pad(now.getMinutes()), second: pad(now.getSeconds()) };
    const hms = `${p.hour}:${p.minute}:${p.second}`;
    clocks.forEach(el => { el.textContent = hms; });
    fulls.forEach(el => { el.textContent = `${p.day}·${p.month}·${p.year} ${hms}`; });
    const s = Math.floor((Date.now() - t0) / 1000);
    const rec = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
    recs.forEach(el => { el.textContent = rec; });
  }
  tick();
  if (!QA) setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));

  /* ---------- video: object-fit cover → coordenadas del recuadro ---------- */
  function coverBox(box, cont, vw, vh) {
    const W = cont.clientWidth, H = cont.clientHeight;
    if (!W || !H) return null;
    const s = Math.max(W / vw, H / vh);
    const dw = vw * s, dh = vh * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
    return [
      (ox + box[0] * dw) / W * 100, (oy + box[1] * dh) / H * 100,
      (ox + box[2] * dw) / W * 100, (oy + box[3] * dh) / H * 100
    ];
  }
  function setBox(el, b) {
    if (!b) return;
    el.style.setProperty('--x0', b[0].toFixed(2) + '%');
    el.style.setProperty('--y0', b[1].toFixed(2) + '%');
    el.style.setProperty('--x1', b[2].toFixed(2) + '%');
    el.style.setProperty('--y1', b[3].toFixed(2) + '%');
  }
  // el perro del living (coordenadas del cuadro 16:9) — respira un poco
  const DOG = [0.28, 0.31, 0.60, 0.99];
  const dogBox = t => {
    const a = Math.sin(t * 1.7) * 0.004, b = Math.sin(t * 2.3 + 1) * 0.004;
    return [DOG[0] + a, DOG[1] + b, DOG[2] + a * 0.5, DOG[3]];
  };
  // el auto de la entrada: keyframes medidos sobre el video (boomerang de 15 s)
  const CAR = [
    [0, [0.424, 0.46, 0.595, 0.615]], [1, [0.395, 0.455, 0.59, 0.63]], [2, [0.345, 0.45, 0.535, 0.64]],
    [3, [0.298, 0.44, 0.51, 0.645]], [4, [0.25, 0.435, 0.46, 0.665]], [5, [0.215, 0.415, 0.40, 0.70]],
    [6, [0.205, 0.405, 0.405, 0.725]], [6.75, [0.175, 0.395, 0.43, 0.75]], [7.5, [0.165, 0.385, 0.455, 0.77]]
  ];
  function carBox(t, dur) {
    const D = dur && isFinite(dur) ? dur : 15, half = D / 2;
    t = ((t % D) + D) % D;
    if (t > half) t = D - t;
    t = t * 7.5 / half;
    for (let i = 0; i < CAR.length - 1; i++) {
      const [a, A] = CAR[i], [b, B] = CAR[i + 1];
      if (t >= a && t <= b) { const u = (t - a) / (b - a); return A.map((v, k) => v + (B[k] - v) * u); }
    }
    return CAR[CAR.length - 1][1];
  }

  /* ---------- inicio: la cámara se conecta ---------- */
  const heroVideo = $('#heroVideo');
  const feed = $('#feed'), feedPan = $('#feedPan'), heroDet = $('#heroDet');
  const pickSrc = v => (mobileQ.matches && v.dataset.srcM ? v.dataset.srcM : v.dataset.src);
  const playSafe = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  let heroVisible = true;

  if (heroVideo && !isLite()) {
    heroVideo.muted = true;
    heroVideo.src = pickSrc(heroVideo);
    playSafe(heroVideo);
    document.addEventListener('pointerdown', () => { if (heroVisible && heroVideo.paused && !feed.classList.contains('is-private')) playSafe(heroVideo); }, { once: true, passive: true });
  }

  const ready = () => html.classList.add('is-ready');
  const live = () => { html.classList.remove('booting'); html.classList.add('feed-live'); };
  if (QA || isLite()) { ready(); live(); }
  else {
    html.classList.add('booting');
    const tReady = setTimeout(ready, 700);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { clearTimeout(tReady); setTimeout(ready, 60); });
    let done = false;
    const go = () => { if (done) return; done = true; live(); };
    const minT = new Promise(r => setTimeout(r, 1100));
    const vid = new Promise(r => {
      if (!heroVideo) return r();
      if (heroVideo.readyState >= 2) return r();
      heroVideo.addEventListener('loadeddata', r, { once: true });
      heroVideo.addEventListener('playing', r, { once: true });
    });
    Promise.all([minT, Promise.race([vid, new Promise(r => setTimeout(r, 2400))])]).then(go);
    setTimeout(go, 3200);
  }

  // recuadro del inicio: sigue al perro y cambia la confianza
  if (heroDet && feedPan) {
    const tag = $('.det-tag b', heroDet);
    let conf = 97;
    const upd = () => {
      if (!heroVisible) return;
      const vw = heroVideo && heroVideo.videoWidth ? heroVideo.videoWidth : 16;
      const vh = heroVideo && heroVideo.videoHeight ? heroVideo.videoHeight : 9;
      setBox(heroDet, coverBox(dogBox(performance.now() / 1000), feedPan, vw, vh));
    };
    upd();
    if (!QA) {
      setInterval(upd, 240);
      setInterval(() => {
        if (!heroVisible) return;
        conf = clamp(conf + Math.round(Math.random() * 2 - 1), 95, 98);
        if (tag) tag.textContent = conf + '%';
      }, 1300);
    }
    window.addEventListener('resize', upd);
  }

  if ('IntersectionObserver' in window && feed) {
    new IntersectionObserver(([en]) => {
      heroVisible = en.isIntersecting;
      if (!heroVideo || isLite() || !heroVideo.src) return;
      if (heroVisible && !feed.classList.contains('is-private')) playSafe(heroVideo); else heroVideo.pause();
    }, { threshold: 0 }).observe(feed);
  }

  /* ---------- modo privacidad (la lente se guarda) ---------- */
  const privBtn = $('#privBtn');
  if (privBtn && feed) {
    const lbl = $('span', privBtn);
    privBtn.addEventListener('click', () => {
      const on = !feed.classList.contains('is-private');
      feed.classList.toggle('is-private', on);
      privBtn.setAttribute('aria-pressed', String(on));
      if (lbl) lbl.textContent = on ? 'Volver a ver' : 'Modo privacidad';
      window.dispatchEvent(new CustomEvent('cam:privacy', { detail: on }));
      html.classList.toggle('cam-private', on);
      if (heroVideo && heroVideo.src) { if (on) heroVideo.pause(); else if (heroVisible) playSafe(heroVideo); }
    });
  }

  /* ---------- la cámara 3D (Three.js, solo con GPU) ---------- */
  const camLite = $('#camLite');
  function camFallback() { html.classList.add('cam-fallback'); }
  window.addEventListener('cam:fail', camFallback);
  function loadCam3d() {
    if (isLite() || !webglOK) { camFallback(); return; }
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'cam3d.js?v=1';
    s.onerror = camFallback;
    document.head.appendChild(s);
    setTimeout(() => { if (!html.classList.contains('cam-ready')) camFallback(); }, 9000);
  }
  if (document.getElementById('cam3d')) {
    if (mobileQ.matches && document.readyState !== 'complete') window.addEventListener('load', loadCam3d, { once: true });
    else loadCam3d();
  }

  // sin 3D: la foto de la cámara y la imagen en vivo acompañan al puntero
  if (finePointer && feedPan) {
    let tx = 0, ty = 0, cx = 0, cy = 0, rafP = 0;
    const stepP = () => {
      rafP = 0;
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      if (html.classList.contains('cam-ready') && !isLite()) return; // la 3D maneja el encuadre
      feedPan.style.setProperty('--px', cx.toFixed(3));
      feedPan.style.setProperty('--py', cy.toFixed(3));
      if (camLite) { camLite.style.setProperty('--ly', (cx * 14).toFixed(2) + 'deg'); camLite.style.setProperty('--lx', (-cy * 8).toFixed(2) + 'deg'); }
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) rafP = requestAnimationFrame(stepP);
    };
    window.addEventListener('pointermove', e => {
      if (QA || !heroVisible) return;
      tx = clamp((e.clientX / innerWidth - 0.5) * 2, -1, 1);
      ty = clamp((e.clientY / innerHeight - 0.5) * 2, -1, 1);
      if (!rafP) rafP = requestAnimationFrame(stepP);
    }, { passive: true });
  }

  /* ---------- scroll suave (escritorio) ---------- */
  let lenis = null, lenisRAF = 0;
  if (!isLite() && !QA && finePointer && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const loop = t => { if (!lenis) return; lenis.raf(t); lenisRAF = requestAnimationFrame(loop); };
    lenisRAF = requestAnimationFrame(loop);
  }
  function scrollToY(y) {
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: QA ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    setMenu(false);
    scrollToY(el.getBoundingClientRect().top + window.scrollY - navH() - 8);
    if (a.classList.contains('skip')) { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
  }));

  /* ---------- menú ---------- */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  if (burger) burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- entradas ---------- */
  const rvs = $$('[data-rv]');
  $$('.cam-grid [data-rv], .marcas-split [data-rv]').forEach(el => {
    const sibs = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-rv'));
    el.style.transitionDelay = (sibs.indexOf(el) * 90) + 'ms';
  });
  if (QA || !('IntersectionObserver' in window)) rvs.forEach(el => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    rvs.forEach(el => io.observe(el));
  }

  /* =========================================================
     PROBADOR
     ========================================================= */
  const form = $('#probForm');
  const screen = $('#screen');
  if (form && screen) initProbador();

  function initProbador() {
    const pVideo = $('#pVideo');
    const pDet = $('#pDet'), pDetTag = $('#pDetTag');
    const osdCam = $('#pOsdCam'), osdSpec = $('#pOsdSpec'), osdMode = $('#pOsdMode');
    const zoomCv = $('#zoomCanvas'), zoomRes = $('#zoomRes'), zoomX = $('#zoomX');
    const zctx = zoomCv.getContext('2d');
    const off = document.createElement('canvas');
    const octx = off.getContext('2d');
    const zsrc = document.createElement('i');
    zsrc.className = 'zoom-src';
    zsrc.setAttribute('aria-hidden', 'true');
    screen.appendChild(zsrc);
    const dias = $('#dias'), diasOut = $('#diasOut'), grabHint = $('#grabHint');
    const rImg = $('#rImg'), rTitle = $('#rTitle'), rList = $('#rList'), rCard = $('#rCard'), rDays = $('#rDays');
    const memBars = $('#memBars'), memWarn = $('#memWarn'), rWa = $('#rWa'), rReset = $('#rReset');
    const segBtns = $$('.seg-b[data-modo]');

    const RES = {
      '2mp': { label: '1080p', mp: 2, mbps: 1.0, f: 0.3 },
      '3mp': { label: '2K', mp: 3, mbps: 1.4, f: 0.42 },
      '4mp': { label: '2K+', mp: 4, mbps: 1.8, f: 0.58 },
      '5mp': { label: '3K', mp: 5, mbps: 2.2, f: 0.86 }
    };
    const CARDS = [32, 64, 128, 256];
    const USABLE = 0.93; // lo que queda libre después de formatear
    const SCENES = {
      adentro: { src: 'media/feed-casa.mp4', srcM: 'media/feed-casa-m.mp4', poster: 'media/feed-casa.jpg', cam: 'CAM 01 · ADENTRO', tag: 'MASCOTA' },
      afuera: { src: 'media/feed-entrada.mp4', srcM: 'media/feed-entrada.mp4', poster: 'media/feed-entrada.jpg', cam: 'CAM 02 · AFUERA', tag: 'VEHÍCULO' }
    };
    const CAMS = {
      interior: { img: 'media/cam-interior.webp', w: 700, h: 1087, alt: 'Cámara WiFi de interior blanca con cabezal que gira' },
      exterior: { img: 'media/cam-exterior.webp', w: 900, h: 481, alt: 'Cámara WiFi de exterior blanca y negra con soporte de pared' },
      bateria: { img: 'media/cam-bateria.webp', w: 640, h: 711, alt: 'Cámara a batería blanca, vista de frente' }
    };
    const DEF = { lugar: 'adentro', energia: 'enchufe', res: '3mp', noche: 'ir', dias: 7, grab: 'continua' };
    const OK = { lugar: ['adentro', 'afuera'], energia: ['enchufe', 'bateria'], res: Object.keys(RES), noche: ['ir', 'color'], grab: ['continua', 'eventos'] };
    const sanitize = o => {
      const r = {};
      if (!o || typeof o !== 'object') return r;
      Object.keys(OK).forEach(k => { if (OK[k].includes(o[k])) r[k] = o[k]; });
      const d = parseInt(o.dias, 10);
      if (d >= 3 && d <= 30) r.dias = d;
      return r;
    };
    const fromUrl = sanitize({ lugar: params.get('lugar'), energia: params.get('energia'), res: params.get('res'), noche: params.get('noche'), grab: params.get('grab'), dias: params.get('dias') });
    let st = Object.assign({}, DEF, sanitize(store.get('padi-probador')), fromUrl);
    let modo = params.get('modo') === 'noche' ? 'noche' : 'dia';
    let userGrab = st.energia === 'bateria' ? 'continua' : st.grab; // lo que eligió antes de pasar a batería

    /* -- video del visor: se pide recién cuando se acerca -- */
    let loaded = false, visible = false, raf = 0, curScene = '';
    const posterImg = new Image();
    function setScene(force) {
      const sc = SCENES[st.lugar];
      if (!force && curScene === st.lugar) return;
      curScene = st.lugar;
      pVideo.poster = sc.poster;
      posterImg.src = sc.poster;
      if (loaded && !isLite()) {
        screen.classList.add('is-cut');
        setTimeout(() => screen.classList.remove('is-cut'), 380);
        pVideo.src = mobileQ.matches ? sc.srcM : sc.src;
        if (visible) playSafe(pVideo);
      }
    }
    function load() {
      if (loaded) return;
      loaded = true;
      if (isLite()) return;
      pVideo.muted = true;
      pVideo.src = mobileQ.matches ? SCENES[st.lugar].srcM : SCENES[st.lugar].src;
      if (visible) playSafe(pVideo);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting) load(); }, { rootMargin: '400px 0px' }).observe(screen);
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible) { if (pVideo.src && !isLite()) playSafe(pVideo); if (!raf) raf = requestAnimationFrame(frame); }
        else pVideo.pause();
      }, { threshold: 0 }).observe(screen);
    } else { load(); visible = true; }

    /* -- recuadro + zoom, sincronizados con el video -- */
    const srcReady = () => pVideo.readyState >= 2 && pVideo.videoWidth > 0 && !isLite() && pVideo.src;
    function zoomTarget(box) {
      if (st.lugar === 'afuera') {
        const w = Math.max(0.17, (box[2] - box[0]) * 0.78);
        return [(box[0] + box[2]) / 2, box[1] + (box[3] - box[1]) * 0.6, w];
      }
      return [0.548, 0.44, 0.2];
    }
    let offF = 0;
    function drawZoom(box) {
      const src = srcReady() ? pVideo : posterImg;
      const SW = src.videoWidth || src.naturalWidth, SH = src.videoHeight || src.naturalHeight;
      if (!SW || !SH) return;
      const [cx, cy, wf] = zoomTarget(box);
      const cw = wf * SW, ch = cw * zoomCv.height / zoomCv.width;
      const sx = clamp(cx * SW - cw / 2, 0, SW - cw), sy = clamp(cy * SH - ch / 2, 0, SH - ch);
      const f = RES[st.res].f;
      if (f !== offF) {
        offF = f;
        off.width = Math.max(8, Math.round(zoomCv.width * f));
        off.height = Math.max(5, Math.round(zoomCv.height * f));
      }
      try {
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = 'high';
        octx.drawImage(src, sx, sy, cw, ch, 0, 0, off.width, off.height);
        zctx.imageSmoothingEnabled = f > 0.7;
        zctx.imageSmoothingQuality = 'high';
        zctx.drawImage(off, 0, 0, zoomCv.width, zoomCv.height);
      } catch (e) { return; }
      const r = coverBox([sx / SW, sy / SH, (sx + cw) / SW, (sy + ch) / SH], screen, SW, SH);
      if (r) {
        zsrc.style.left = r[0].toFixed(2) + '%';
        zsrc.style.top = r[1].toFixed(2) + '%';
        zsrc.style.width = (r[2] - r[0]).toFixed(2) + '%';
        zsrc.style.height = (r[3] - r[1]).toFixed(2) + '%';
      }
      if (zoomX) zoomX.textContent = '×' + Math.round(1 / wf);
    }
    function boxNow() {
      const t = pVideo.currentTime || 0;
      return st.lugar === 'afuera' ? carBox(srcReady() ? t : 2.2, pVideo.duration) : dogBox(performance.now() / 1000);
    }
    function frame() {
      raf = 0;
      const box = boxNow();
      const SW = (srcReady() ? pVideo.videoWidth : posterImg.naturalWidth) || 16;
      const SH = (srcReady() ? pVideo.videoHeight : posterImg.naturalHeight) || 9;
      setBox(pDet, coverBox(box, screen, SW, SH));
      drawZoom(box);
      if (visible && !QA) raf = requestAnimationFrame(frame);
    }
    posterImg.addEventListener('load', () => { if (!raf) raf = requestAnimationFrame(frame); });
    pVideo.addEventListener('loadeddata', () => { if (!raf) raf = requestAnimationFrame(frame); });
    window.addEventListener('resize', () => { if (!raf) raf = requestAnimationFrame(frame); });

    /* -- memoria microSD -- */
    const fmtDays = d => (d < 1 ? 'menos de 1 día' : d >= 99.5 ? 'más de 99 días' : `≈ ${Math.round(d)} ${Math.round(d) === 1 ? 'día' : 'días'}`);
    function memoria() {
      const r = RES[st.res];
      const hours = st.grab === 'eventos' ? 2 : 24;
      const gbDay = r.mbps * 0.45 * hours; // Mbps × 3600 s ÷ 8 ÷ 1000 = GB por hora
      const rows = CARDS.map(gb => ({ gb, days: gb * USABLE / gbDay }));
      const rec = rows.find(x => x.days >= st.dias) || rows[rows.length - 1];
      return { rows, rec, enough: rec.days >= st.dias };
    }

    /* -- resultado -- */
    function camKind() {
      if (st.energia === 'bateria') return 'bateria';
      return st.lugar === 'adentro' ? 'interior' : 'exterior';
    }
    function textos() {
      const r = RES[st.res];
      const kind = camKind();
      const title = {
        interior: 'Cámara WiFi de interior con giro 360°',
        exterior: 'Cámara WiFi de exterior',
        bateria: st.lugar === 'afuera' ? 'Cámara a batería para exterior' : 'Cámara a batería, sin cables'
      }[kind];
      const list = [
        `${r.label} · ${r.mp} MP`,
        st.noche === 'ir' ? 'Visión nocturna infrarroja' : 'Visión nocturna a color',
        st.grab === 'eventos' ? 'Graba cuando detecta movimiento' : 'Graba todo el día',
        { interior: 'Gira y tiene audio de ida y vuelta', exterior: 'Preparada para lluvia y polvo', bateria: 'Batería recargable · admite panel solar' }[kind]
      ];
      return { kind, title, list };
    }
    function mensaje(m) {
      const r = RES[st.res];
      return [
        'Hola PADITECH, armé esta combinación en el probador de la web:',
        `• Lugar: ${st.lugar === 'adentro' ? 'adentro' : 'afuera'}`,
        `• Energía: ${st.energia === 'enchufe' ? 'con enchufe cerca' : 'a batería, sin cables'}`,
        `• Detalle: ${r.label} (${r.mp} MP)`,
        `• De noche: ${st.noche === 'ir' ? 'infrarrojo (blanco y negro)' : 'a color'}`,
        `• Grabación: ${st.grab === 'eventos' ? 'con movimiento' : 'todo el día'}, quiero guardar ${st.dias} días`,
        `• Memoria sugerida: microSD de ${m.rec.gb} GB`,
        '',
        '¿Qué modelos Imou o EZVIZ tienen para esto y a qué precio?'
      ].join('\n');
    }

    function render() {
      // la batería solo graba con movimiento
      const bat = st.energia === 'bateria';
      const cont = form.querySelector('input[name="grab"][value="continua"]');
      if (cont) cont.disabled = bat;
      if (bat) st.grab = 'eventos';
      if (grabHint) grabHint.hidden = !bat;
      ['lugar', 'energia', 'res', 'noche', 'grab'].forEach(k => {
        const inp = form.querySelector(`input[name="${k}"][value="${st[k]}"]`);
        if (inp) inp.checked = true;
      });
      dias.value = st.dias;
      dias.style.setProperty('--fill', ((st.dias - 3) / 27 * 100).toFixed(1) + '%');
      diasOut.innerHTML = `<b>${st.dias}</b> ${st.dias === 1 ? 'día' : 'días'}`;

      // visor
      screen.dataset.lugar = st.lugar;
      screen.dataset.noche = st.noche;
      screen.dataset.modo = modo;
      setScene(false);
      const r = RES[st.res];
      osdCam.textContent = SCENES[st.lugar].cam;
      osdSpec.textContent = `${r.label} · ${r.mp} MP`;
      osdMode.textContent = modo === 'dia' ? 'DÍA' : (st.noche === 'ir' ? 'NOCHE · IR' : 'NOCHE · COLOR');
      pDetTag.innerHTML = `${SCENES[st.lugar].tag} <b>${st.lugar === 'afuera' ? 94 : 96}%</b>`;
      if (zoomRes) zoomRes.textContent = `${r.mp} MP`;
      segBtns.forEach(b => { const on = b.dataset.modo === modo; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); });
      offF = 0;

      // resultado
      const tx = textos();
      const cam = CAMS[tx.kind];
      if (!rImg.src.endsWith(cam.img)) {
        rImg.classList.add('swap');
        setTimeout(() => {
          rImg.src = cam.img; rImg.width = cam.w; rImg.height = cam.h; rImg.alt = cam.alt;
          const done = () => rImg.classList.remove('swap');
          if (rImg.complete) requestAnimationFrame(done); else rImg.addEventListener('load', done, { once: true });
        }, 180);
      }
      rTitle.textContent = tx.title;
      rList.innerHTML = tx.list.map(t => `<li>${t}</li>`).join('');

      const m = memoria();
      rCard.textContent = m.rec.gb;
      rDays.textContent = fmtDays(m.rec.days);
      const S = Math.max(st.dias * 2, 6);
      memBars.innerHTML = m.rows.map(x => `<li class="${x === m.rec ? 'is-rec' : ''}"><span>${x.gb} GB</span><span class="bar"><i style="--w:${(Math.min(x.days / S, 1) * 100).toFixed(1)}%"></i><u style="--t:${(st.dias / S * 100).toFixed(1)}%"></u></span><em>${fmtDays(x.days).replace('menos de 1 día', '< 1 día').replace('más de 99 días', '+99 días')}</em></li>`).join('');
      if (memWarn) {
        memWarn.hidden = m.enough;
        if (!m.enough) memWarn.textContent = `Con ${st.dias} días grabando todo el día no alcanza ni la de 256 GB: la cámara graba en bucle y pisa lo más viejo. Para guardar más, conviene grabar solo con movimiento o sumar la nube de la marca.`;
      }
      rWa.href = waLink(mensaje(m));
      rWa.target = '_blank';
      rWa.rel = 'noopener';

      store.set('padi-probador', st);
      if (!raf) raf = requestAnimationFrame(frame);
    }

    form.addEventListener('change', e => {
      const t = e.target;
      if (!t.name || !(t.name in OK)) return;
      st[t.name] = t.value;
      if (t.name === 'noche') modo = 'noche';
      if (t.name === 'grab') userGrab = t.value;
      if (t.name === 'energia' && t.value === 'enchufe') st.grab = userGrab;
      render();
    });
    dias.addEventListener('input', () => { st.dias = clamp(parseInt(dias.value, 10) || 7, 3, 30); render(); });
    form.addEventListener('submit', e => e.preventDefault());
    segBtns.forEach(b => b.addEventListener('click', () => { modo = b.dataset.modo; render(); }));
    segBtns.forEach((b, i) => b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = segBtns[(i + (e.key === 'ArrowRight' ? 1 : -1) + segBtns.length) % segBtns.length];
      n.focus(); n.click();
    }));
    rReset.addEventListener('click', () => {
      st = Object.assign({}, DEF);
      modo = 'dia';
      userGrab = DEF.grab;
      store.del('padi-probador');
      render();
      store.del('padi-probador');
    });

    posterImg.src = SCENES[st.lugar].poster;
    pVideo.poster = SCENES[st.lugar].poster;
    curScene = st.lugar;
    render();
    if (params.has('lugar') || params.has('modo')) store.del('padi-probador');
  }

  /* ---------- cámaras: inclinación al pasar el mouse ---------- */
  if (finePointer && !isLite()) {
    $$('[data-tilt]').forEach(card => {
      const img = $('.cc-fig img', card);
      if (!img) return;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        img.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg');
        img.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { img.style.setProperty('--ry', '0deg'); img.style.setProperty('--rx', '0deg'); });
    });
  }

  /* ---------- marcas: en el celular se encienden al pasar ---------- */
  if (!finePointer && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-lit', e.isIntersecting)), { rootMargin: '-38% 0px -38% 0px' });
    $$('.marca').forEach(m => io.observe(m));
  }

  /* ---------- barra de reproducción + estados del scroll ---------- */
  const tl = $('#tl'), tlFill = $('#tlFill'), tlEvs = $$('.tl-ev');
  const hero = $('#inicio');
  const events = $('.events'), etFill = $('.et-fill');
  let tlPos = [], ticking = false;
  function layoutTl() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    tlPos = tlEvs.map(a => {
      const sec = document.getElementById(a.dataset.sec);
      const y = sec ? sec.getBoundingClientRect().top + window.scrollY - navH() - 8 : 0;
      const x = clamp(y / max, 0, 1);
      a.style.setProperty('--x', (x * 100).toFixed(2) + '%');
      return x;
    });
  }
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 16);
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(y / max, 0, 1);
    if (tl) {
      const hh = hero ? hero.offsetHeight : innerHeight;
      tl.classList.toggle('is-on', y > hh * 0.6 || QA);
      if (tlFill) tlFill.style.setProperty('--p', (p * 100).toFixed(2) + '%');
      let cur = -1;
      tlPos.forEach((x, i) => { const past = p >= x - 0.004; tlEvs[i].classList.toggle('is-past', past); if (past) cur = i; });
      tlEvs.forEach((a, i) => a.classList.toggle('is-cur', i === cur));
    }
    if (events && etFill && etFill.offsetParent) {
      const r = events.getBoundingClientRect();
      const q = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
      etFill.style.setProperty('--p', (q * 100).toFixed(1) + '%');
      $$('.events-track i').forEach((m, i) => m.classList.toggle('is-on', q >= [0.166, 0.5, 0.833][i] - 0.02));
      $$('.ev', events).forEach((ev, i) => ev.classList.toggle('is-on', q >= [0.166, 0.5, 0.833][i] - 0.02));
    }
  }
  const reqScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', reqScroll, { passive: true });
  if (lenis) lenis.on('scroll', reqScroll);
  window.addEventListener('resize', () => { layoutTl(); reqScroll(); });
  window.addEventListener('load', () => { layoutTl(); reqScroll(); });
  layoutTl();
  onScroll();

  /* ---------- letra grande en Android: achicar lo que no entra ---------- */
  const FIT = ['.h1-main', '.marca-name', '.cierre h2', '.prob-head h2', '.cam-head h2', '.mem-big'];
  function fitText() {
    $$(FIT.join(',')).forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 14 && n < 60) { fs -= 1; el.style.fontSize = fs + 'px'; n++; }
    });
  }
  window.__padiFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitText(); layoutTl(); });
  window.addEventListener('load', fitText);
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(fitText, 150); });

  /* ---------- watchdog de FPS: si el equipo no da, modo liviano ---------- */
  function goLite(reason) {
    if (isLite()) return;
    html.classList.add('lite');
    try { sessionStorage.setItem('padi-lite', '1'); } catch (e) { /* sin almacenamiento */ }
    if (lenis) { cancelAnimationFrame(lenisRAF); lenis.destroy(); lenis = null; }
    html.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
    window.dispatchEvent(new Event('padi:lite'));
    if (camLite) { camLite.style.removeProperty('--ly'); camLite.style.removeProperty('--lx'); }
    rvs.forEach(el => el.classList.add('in'));
    if (window.console) console.info('[paditech] modo liviano:', reason);
  }
  if (!isLite() && !QA && !params.has('full')) {
    let frames = 0, slow = 0, last = 0, start = 0, sampling = false, retries = 0;
    const sample = now => {
      if (!sampling) return;
      if (document.visibilityState !== 'visible') { last = 0; requestAnimationFrame(sample); return; }
      if (last) { frames++; if (now - last > 50) slow++; } else start = now;
      last = now;
      if (now - start > 2500 && frames > 0) {
        sampling = false;
        const fps = frames / ((now - start) / 1000);
        // < 12 fps no es un equipo lento: el navegador no está pintando (ventana tapada) → volver a medir
        if (fps < 12) { if (++retries < 4) setTimeout(begin, 3000); return; }
        if (fps < 34 || slow / frames > 0.25) goLite(`fps ${fps.toFixed(0)}`);
        return;
      }
      requestAnimationFrame(sample);
    };
    const begin = () => { if (sampling || isLite()) return; sampling = true; frames = slow = last = 0; requestAnimationFrame(sample); };
    window.addEventListener('cam:ready', () => setTimeout(begin, 1600), { once: true });
    setTimeout(begin, 3600);
    let scrolledOnce = false;
    window.addEventListener('scroll', () => { if (!scrolledOnce && window.scrollY > 160) { scrolledOnce = true; setTimeout(begin, 2200); } }, { passive: true });
  }
})();
