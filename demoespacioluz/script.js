/* =========================================================
   Espacio Luz de Conciencia — interacciones
   ========================================================= */
(function () {
  'use strict';

  const html = document.documentElement;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const WA = '5492995575927';
  const MAIL = 'espacio.luz.de.conciencia@gmail.com';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } }
  };

  /* ---------- modo liviano: sin aceleración por hardware ---------- */
  let webglOK = false;
  (function detectSoftwareRender() {
    const forceFull = /[?&]full\b/.test(location.search);
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
  const LITE = html.classList.contains('lite');
  const isLite = () => html.classList.contains('lite');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktopQ = matchMedia('(min-width: 901px)');
  const wideQ = matchMedia('(min-width: 1101px)');
  const mobileQ = matchMedia('(max-width: 768px), (max-aspect-ratio: 4/5)'); // video vertical: celular y tablet parada
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const FULL = !LITE && !QA && hasGSAP;
  const navH = () => ($('#nav') ? $('#nav').offsetHeight : 70);

  /* ---------- enlaces de WhatsApp con mensaje propio ---------- */
  $$('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- video del inicio ---------- */
  const heroVideo = $('#heroVideo');
  if (heroVideo) {
    heroVideo.poster = mobileQ.matches ? 'media/hero-m-poster.jpg' : 'media/hero-1600-poster.jpg';
    heroVideo.muted = true;
    const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };
    tryPlay();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting) tryPlay(); else heroVideo.pause(); }, { threshold: 0 }).observe(heroVideo);
    }
  }

  /* ---------- entrada ---------- */
  const ready = () => html.classList.add('is-ready');
  if (QA || LITE) ready();
  else {
    const t = setTimeout(ready, 900);
    const go = () => { clearTimeout(t); setTimeout(ready, 120); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else window.addEventListener('load', go, { once: true });
  }

  /* ---------- scroll suave ---------- */
  let lenis = null;
  const lenisTick = time => { if (lenis) lenis.raf(time * 1000); };
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (FULL && finePointer && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y, dur = 1.3) => {
    if (lenis) lenis.scrollTo(y, { duration: dur });
    else window.scrollTo({ top: y, behavior: (isLite() || QA) ? 'auto' : 'smooth' });
  };
  const goTo = target => {
    if (!target) return;
    const y = target.id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY - navH() - 6;
    scrollToY(Math.max(0, y));
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    goTo(target);
  }));

  /* ---------- nav + menú ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  let lastY = window.scrollY;
  function setMenu(open) {
    if (!burger) return;
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  if (burger) burger.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const waFloat = $('#waFloat');
  let contactoVisible = false;
  const contacto = $('#contacto');
  if (contacto && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { contactoVisible = en.isIntersecting; onScroll(); }, { threshold: .15 }).observe(contacto);
  }
  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 24);
      if (!html.classList.contains('menu-open')) {
        if (y > window.innerHeight * .9 && y > lastY + 6) nav.classList.add('is-hidden');
        else if (y < lastY - 6 || y < window.innerHeight * .9) nav.classList.remove('is-hidden');
      }
    }
    if (waFloat) waFloat.classList.toggle('is-on', y > window.innerHeight * .6 && !contactoVisible);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- luz que sigue al cursor ---------- */
  if (FULL && finePointer) {
    html.classList.add('has-cursor');
    const cur = $('#cursorLuz');
    const geo = $('.hero-geo');
    let mx = window.innerWidth / 2, my = window.innerHeight * .4;
    let cx = mx, cy = my, gx = 0, gy = 0;
    window.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (!html.classList.contains('cursor-on')) { cx = mx; cy = my; html.classList.add('cursor-on'); }
    }, { passive: true });
    gsap.ticker.add(() => {
      if (isLite()) return;
      cx += (mx - cx) * .22; cy += (my - cy) * .22;
      if (cur) cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (window.scrollY < window.innerHeight * 1.1) {
        gx += ((mx / window.innerWidth - .5) * -24 - gx) * .05;
        gy += ((my / window.innerHeight - .5) * -18 - gy) * .05;
        if (geo) geo.style.translate = `${gx}px ${gy}px`;
      }
    });
    const big = el => {
      el.addEventListener('pointerenter', () => cur && cur.classList.add('is-big'));
      el.addEventListener('pointerleave', () => cur && cur.classList.remove('is-big'));
    };
    $$('a, button, label, summary').forEach(big);
  }

  /* =========================================================
     EL CUARZO-LENTE — flota sobre el título y lo refracta:
     entra un haz blanco por la izquierda y sale el espectro
     ========================================================= */
  const lenteBox = $('#lente');
  const front = $('#heroFront');
  if (lenteBox && front) {
    const cristal = $('#lenteCristal');
    const haz = $('#lenteHaz');
    const mundo = $('#lenteMundo');
    const h1L = $('#heroCopy .h1-l');
    const palabra = $('#heroCopy .prisma-txt');
    const lead = $('#heroCopy .hero-lead');
    const cta = $('#heroCopy .hero-cta');
    // lo que se ve "adentro" del cristal: el mismo texto, ampliado y con dispersión, más la geometría en colores
    const clon = $('#heroCopy').cloneNode(true);
    clon.removeAttribute('id');
    clon.setAttribute('inert', '');
    $$('[id]', clon).forEach(el => el.removeAttribute('id'));
    $$('[data-in]', clon).forEach(el => el.removeAttribute('data-in'));
    const geoSrc = $('.hero-geo');
    if (geoSrc) {
      const g2 = geoSrc.cloneNode(true);
      g2.setAttribute('class', 'lente-geo');
      g2.removeAttribute('style');
      mundo.appendChild(g2);
    }
    mundo.appendChild(clon);

    const MAG = 1.1;
    const st = { x: 0, y: 0, tx: 0, ty: 0, r: 0, vx: 0, intro: 0, beam: 0, follow: false, lastMove: 0, ready: false };
    let W = 0, H = 0, lw = 0, lh = 0, box = { l: 0, r: 0, t: 0, b: 0 }, rest = { x: 0, y: 0 }, h1r = null, compacto = false;

    // posiciones de layout (sin los transforms de la entrada) relativas al frente del hero
    const rel = el => {
      let l = 0, t = 0, n = el;
      while (n && n !== front) { l += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; }
      return { l, t, w: el.offsetWidth, h: el.offsetHeight };
    };
    function medir() {
      W = front.offsetWidth; H = front.offsetHeight;
      mundo.style.width = W + 'px';
      mundo.style.height = H + 'px';
      lw = cristal.offsetWidth; lh = cristal.offsetHeight;
      const a = rel(h1L), p = rel(palabra), ld = rel(lead);
      const izq = Math.min(a.l, p.l);
      h1r = { l: izq, t: a.t, w: Math.max(a.l + a.w, p.l + p.w) - izq, h: p.t + p.h - a.t };
      // el cristal viaja sobre el título: entre el centro de la primera línea y el de la segunda.
      // En pantallas angostas flota sobre el video y proyecta el espectro hacia las manos.
      compacto = W < 640;
      lenteBox.classList.toggle('compacto', compacto);
      const c = rel(cta);
      rest = compacto
        ? { x: Math.max(lw * .7, W * .24), y: c.t + c.h + lh * .68 }
        : { x: p.l + p.w * .66, y: Math.min(p.t + p.h * .4, ld.t - lh * .5 - 6) };
      box = {
        l: Math.max(lw * .6, h1r.l + lw * .15),
        r: Math.min(W - lw * .6, h1r.l + h1r.w - lw * .15),
        t: a.t + a.h * .5,
        b: Math.min(p.t + p.h * .5, ld.t - lh * .5 - 6)
      };
      if (box.b < box.t) box.b = box.t;
      if (!st.ready) { st.x = st.tx = rest.x; st.y = st.ty = rest.y; st.ready = true; }
    }
    const clampX = v => Math.min(box.r, Math.max(box.l, v));
    const clampY = v => Math.min(box.b, Math.max(box.t, v));

    function pintar() {
      const s = .9 + .1 * st.intro;
      cristal.style.opacity = st.intro.toFixed(3);
      cristal.style.transform = `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(1)}px, 0) rotate(${st.r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      if (!compacto) {
        const tx = lw / 2 - MAG * st.x, ty = lh / 2 - MAG * st.y;
        mundo.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${MAG})`;
      }
      // el haz entra por la cara izquierda del cristal, bajando apenas desde el borde
      const ex = st.x - lw * .44, ey = st.y + lh * .03;
      const sy = ey - Math.max(ex, 0) * Math.tan(4.5 * Math.PI / 180);
      const len = Math.hypot(ex, ey - sy);
      const ang = Math.atan2(ey - sy, ex);
      haz.style.transform = `translate3d(0, ${sy.toFixed(1)}px, 0) rotate(${ang.toFixed(4)}rad) scaleX(${(len / W * st.beam).toFixed(4)})`;
    }

    const estatico = () => { st.intro = 1; st.beam = 1; lenteBox.classList.add('fan-on'); pintar(); };
    medir();
    if (QA || isLite()) {
      estatico();
    } else {
      // entrada: el cristal aparece, el haz lo alcanza y se abre el abanico
      const t0 = performance.now() + 650;
      let fanDone = false;
      const touch = !finePointer;
      if (finePointer) {
        front.closest('.hero').addEventListener('pointermove', e => {
          if (compacto) return;
          const f = front.getBoundingClientRect();
          st.tx = clampX(e.clientX - f.left); st.ty = clampY(e.clientY - f.top);
          st.follow = true; st.lastMove = performance.now();
          html.classList.add('en-hero');
        }, { passive: true });
        front.closest('.hero').addEventListener('pointerleave', () => { st.follow = false; html.classList.remove('en-hero'); });
      }
      let last = performance.now(), visible = true;
      if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(front);
      const loop = now => {
        if (isLite()) { estatico(); return; }
        requestAnimationFrame(loop);
        const dt = Math.min(64, now - last) / 1000; last = now;
        if (!visible) return;
        const e = Math.max(0, now - t0) / 1000;
        st.intro = Math.min(1, e / .9);
        st.beam = Math.min(1, Math.max(0, (e - .25) / .85));
        st.beam = 1 - Math.pow(1 - st.beam, 3);
        if (!fanDone && e > 1.05) { fanDone = true; lenteBox.classList.add('fan-on'); }
        if (st.follow && now - st.lastMove > (touch ? 2200 : 3200)) st.follow = false;
        if (!st.follow && e > 1.6 && h1r) {
          const k = (e - 1.6);
          const amp = Math.min(1, k / 3);
          if (compacto) {
            // en el celular: flota en su lugar
            st.tx = rest.x + Math.sin(k * .7) * 4 * amp;
            st.ty = rest.y + Math.sin(k * .9 + .5) * 6 * amp;
          } else {
            // deriva lenta sobre el título cuando nadie lo mueve
            st.tx = clampX(rest.x + Math.sin(k * .23) * h1r.w * .3 * amp - h1r.w * .08 * amp);
            st.ty = clampY(rest.y + Math.sin(k * .41 + .6) * h1r.h * .2 * amp);
          }
        }
        const kx = st.follow ? .1 : .035;
        const nx = st.x + (st.tx - st.x) * Math.min(1, kx * dt * 60);
        st.vx = (nx - st.x) / Math.max(dt, .001);
        st.x = nx;
        st.y += (st.ty - st.y) * Math.min(1, kx * dt * 60);
        const rT = Math.max(-9, Math.min(9, st.vx * .012));
        st.r += (rT - st.r) * Math.min(1, .12 * dt * 60);
        pintar();
      };
      requestAnimationFrame(loop);
    }
    // con la tipografía cargada (o fitText) cambian las medidas: si nadie movió el cristal, vuelve a su lugar
    const remedir = () => { if (!st.follow) st.ready = false; medir(); pintar(); };
    window.addEventListener('resize', () => { clearTimeout(remedir.t); remedir.t = setTimeout(remedir, 160); });
    window.__lente = { medir, pintar, remedir, st };
  }

  /* ---------- reveals ---------- */
  const rvs = $$('.rv');
  if (QA || !('IntersectionObserver' in window)) rvs.forEach(el => el.classList.add('in'));
  else {
    let batch = 0, batchT = 0;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const now = performance.now();
        if (now - batchT > 140) batch = 0;
        batchT = now;
        el.style.transitionDelay = `${Math.min(batch, 6) * 90}ms`;
        batch++;
        el.classList.add('in');
        io.unobserve(el);
        setTimeout(() => { el.style.transitionDelay = ''; }, 1600);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rvs.forEach(el => io.observe(el));
  }

  /* ---------- parallax y salida del hero (modo completo) ---------- */
  if (FULL) {
    const geo = $('.hero-geo');
    gsap.timeline({ scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true } })
      .to('#heroFront', { yPercent: -16, opacity: .2, ease: 'none' }, 0)
      .to('#heroVideo', { scale: 1.07, ease: 'none' }, 0)
      .to(geo, { rotate: 22, scale: 1.12, ease: 'none' }, 0);
    const fimg = $('.facet img');
    if (fimg) {
      gsap.fromTo(fimg, { '--py': '-10%' }, { '--py': '2%', ease: 'none', scrollTrigger: { trigger: '.quien', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.facet-luz', { '--fx': '-36%' }, { '--fx': '36%', ease: 'none', scrollTrigger: { trigger: '.quien-foto', start: 'top 90%', end: 'bottom 10%', scrub: true } });
    }
  }

  /* =========================================================
     CAMINOS — siete consultas
     ========================================================= */
  const SERV = {
    tarot: 'Tarot (pronóstico o terapéutico)',
    constelacion: 'Constelación familiar',
    natal: 'Carta natal',
    reiki: 'Reiki con cuencos tibetanos',
    limpieza: 'Limpieza energética',
    bach: 'Flores de Bach',
    reflexologia: 'Reflexología podal',
    orientame: 'No sé cuál, quiero que me orientes',
    clases: 'Capacitaciones o clases'
  };
  const stage = $('#caminosStage');
  const rayBtns = $$('#rayos button');
  const caminoCards = $$('.camino');
  const prog = $('#caminosProg');
  let active = -1;
  let pinST = null;
  const STEPS = caminoCards.length || 7;

  function setActive(i) {
    if (i === active) return;
    active = i;
    rayBtns.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', String(k === i)); });
    caminoCards.forEach((c, k) => c.classList.toggle('is-on', k === i));
    if (window.__prisma) window.__prisma.setActive(i);
  }

  const useGL = FULL && wideQ.matches && webglOK && !!stage;
  if (useGL) {
    html.classList.add('webgl');
    setActive(0);
    pinST = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * .62 * STEPS),
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: self => {
        const p = self.progress;
        if (prog) prog.style.setProperty('--p', p.toFixed(4));
        setActive(Math.min(STEPS - 1, Math.floor(p * STEPS * .9999)));
        if (window.__prisma) window.__prisma.setProgress(p);
      }
    });
    rayBtns.forEach((b, k) => b.addEventListener('click', () => {
      if (!pinST) return setActive(k);
      scrollToY(pinST.start + (pinST.end - pinST.start) * ((k + .5) / STEPS), 1.1);
    }));
    window.addEventListener('prisma:ready', () => {
      html.classList.add('prisma-ok');
      if (window.__prisma) window.__prisma.setActive(active);
    });
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'prisma.js?v=3';
    document.body.appendChild(s);
  } else {
    // sin escena 3D: acordeón con las siete consultas (una abierta a la vez)
    armarAcordeon();
  }

  function armarAcordeon() {
    const det = $('#detalles');
    if (!det || det.classList.contains('acordeon')) return;
    det.classList.add('acordeon');
    html.classList.add('acordeon-on');
    const btns = caminoCards.map(c => {
      const h3 = $('h3', c), cuerpo = $('.camino-cuerpo', c);
      cuerpo.id = 'cuerpo-' + c.dataset.key;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'camino-btn';
      b.setAttribute('aria-controls', cuerpo.id);
      b.textContent = h3.textContent;
      h3.textContent = '';
      h3.appendChild(b);
      return b;
    });
    const abrir = (k, open) => {
      caminoCards.forEach((c, j) => {
        const on = j === k ? open : false;
        c.classList.toggle('is-open', on);
        btns[j].setAttribute('aria-expanded', String(on));
      });
      if (open) setActive(k);
    };
    btns.forEach((b, k) => b.addEventListener('click', () => {
      const open = !caminoCards[k].classList.contains('is-open');
      abrir(k, open);
      // si al abrirla la tarjeta queda arriba de la pantalla, la acomodamos
      if (open) setTimeout(() => {
        const r = caminoCards[k].getBoundingClientRect();
        if (r.top < navH() + 8 || r.top > window.innerHeight * .7) goTo(caminoCards[k]);
      }, 380);
    }));
    abrir(0, true);
  }

  /* =========================================================
     TIRADA — reservar en 3 cartas
     ========================================================= */
  const form = $('#tiradaForm');
  const KEY = 'eldc-tirada-v1';
  const FRANJA = { temprano: 'de 14:30 a 16:30', tarde: 'de 16:30 a 18:30', cualquiera: 'en cualquier horario' };
  const DIAS_CORTOS = { lunes: 'Lun', martes: 'Mar', 'miércoles': 'Mié', jueves: 'Jue', viernes: 'Vie' };
  const promoBox = $('#promo');
  const promoHasta = promoBox ? Date.parse(promoBox.dataset.hasta) : NaN;
  const promoOn = !isNaN(promoHasta) && Date.now() < promoHasta;
  if (promoOn) {
    promoBox.hidden = false;
    const pc = $('#promoCheck'); if (pc) pc.hidden = false;
    $$('[data-promo]').forEach(el => { el.hidden = false; });
  }

  const listaY = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' o ' + arr[arr.length - 1];
  const fechaAR = v => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); return m ? `${m[3]}/${m[2]}/${m[1]}` : v; };

  function leer() {
    if (!form) return {};
    const fd = new FormData(form);
    return {
      servicio: fd.get('servicio') || '',
      dias: fd.getAll('dias'),
      franja: fd.get('franja') || '',
      pronto: fd.get('pronto') === 'si',
      nombre: (fd.get('nombre') || '').trim(),
      nac_fecha: fd.get('nac_fecha') || '',
      nac_hora: fd.get('nac_hora') || '',
      nac_lugar: (fd.get('nac_lugar') || '').trim(),
      mensaje: (fd.get('mensaje') || '').trim(),
      codigo: promoOn && fd.get('codigo') === 'TEAMOMAMI'
    };
  }

  function armarMensaje(d) {
    const l = ['Hola Paula! Te escribo desde la web de Espacio Luz de Conciencia.', ''];
    l.push('• Consulta: ' + (SERV[d.servicio] || 'a definir'));
    let cuando = d.dias.length ? listaY(d.dias) : '';
    if (d.franja) cuando += (cuando ? ', ' : '') + FRANJA[d.franja];
    if (d.pronto) cuando += (cuando ? ' · ' : '') + 'lo antes posible';
    l.push('• Cuándo: ' + (cuando || 'a coordinar'));
    l.push('• Nombre: ' + (d.nombre || '—'));
    if (d.servicio === 'natal' && (d.nac_fecha || d.nac_hora || d.nac_lugar)) {
      l.push('• Nacimiento: ' + [fechaAR(d.nac_fecha), d.nac_hora && d.nac_hora + ' h', d.nac_lugar].filter(Boolean).join(' · '));
    }
    if (d.mensaje) l.push('• Te cuento: ' + d.mensaje);
    if (d.codigo) l.push('• Código: TEAMOMAMI (15% Día de la Madre)');
    l.push('', '¿Me pasás disponibilidad y el valor? Gracias!');
    return l.join('\n');
  }

  function render() {
    if (!form) return;
    const d = leer();
    const natal = $('#natalDatos');
    if (natal) natal.hidden = d.servicio !== 'natal';
    const r1 = $('#rev1'), r2 = $('#rev2'), r3 = $('#rev3');
    if (r1) r1.textContent = d.servicio ? '✦ ' + (SERV[d.servicio] || '') : '';
    let c2 = d.dias.map(x => DIAS_CORTOS[x] || x).join(' · ');
    if (d.franja) c2 += (c2 ? ' — ' : '') + FRANJA[d.franja];
    if (d.pronto) c2 += (c2 ? ' — ' : '') + 'lo antes posible';
    if (r2) r2.textContent = c2 ? '✦ ' + c2 : '';
    if (r3) r3.textContent = d.nombre ? '✦ ' + d.nombre : '';
    const msg = armarMensaje(d);
    const pre = $('#msgPreview');
    if (pre) pre.textContent = msg;
    const mail = $('#enviarMail');
    if (mail) {
      const asunto = 'Turno · ' + (SERV[d.servicio] || 'consulta') + (d.nombre ? ' · ' + d.nombre : '');
      mail.href = `mailto:${MAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(msg)}`;
    }
    if (d.servicio) limpiarError('servicio');
    if (d.nombre) limpiarError('nombre');
    store.set(KEY, d);
    return d;
  }

  function limpiarError(campo) {
    const err = $(`[data-err="${campo}"]`);
    if (err) { err.hidden = true; const c = err.closest('.carta'); if (c) c.classList.remove('is-err'); }
  }
  function validar(d) {
    const faltan = [];
    if (!d.servicio) faltan.push('servicio');
    if (!d.nombre) faltan.push('nombre');
    faltan.forEach(campo => {
      const err = $(`[data-err="${campo}"]`);
      if (err) { err.hidden = false; const c = err.closest('.carta'); if (c) c.classList.add('is-err'); }
    });
    if (faltan.length) {
      const first = $(`[data-err="${faltan[0]}"]`).closest('.carta');
      goTo(first);
      const f = faltan[0] === 'nombre' ? form.elements.nombre : form.querySelector('input[name="servicio"]');
      if (f) setTimeout(() => f.focus({ preventScroll: true }), 650);
    }
    return !faltan.length;
  }

  function restaurar() {
    const d = store.get(KEY);
    if (!form || !d || typeof d !== 'object') return;
    const set = (name, val) => {
      $$(`[name="${name}"]`, form).forEach(inp => {
        if (inp.type === 'radio') inp.checked = inp.value === val;
        else if (inp.type === 'checkbox') inp.checked = Array.isArray(val) ? val.includes(inp.value) : !!val;
        else inp.value = val || '';
      });
    };
    set('servicio', d.servicio); set('dias', d.dias || []); set('franja', d.franja);
    set('pronto', d.pronto); set('nombre', d.nombre); set('nac_fecha', d.nac_fecha);
    set('nac_hora', d.nac_hora); set('nac_lugar', d.nac_lugar); set('mensaje', d.mensaje);
    if (promoOn) set('codigo', d.codigo);
  }

  function elegirServicio(key) {
    if (!form || !key) return;
    const inp = form.querySelector(`input[name="servicio"][value="${key}"]`);
    if (inp) { inp.checked = true; render(); }
  }

  if (form) {
    restaurar();
    render();
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = render();
      if (!validar(d)) return;
      const w = window.open(waLink(armarMensaje(d)), '_blank', 'noopener');
      if (!w) window.location.href = waLink(armarMensaje(d));
    });
    const mail = $('#enviarMail');
    if (mail) mail.addEventListener('click', e => { if (!validar(leer())) e.preventDefault(); });
    const reset = $('#tiradaReset');
    if (reset) reset.addEventListener('click', () => {
      form.reset();
      store.del(KEY);
      ['servicio', 'nombre'].forEach(limpiarError);
      render();
    });
  }

  $$('[data-reservar]').forEach(b => b.addEventListener('click', () => elegirServicio(b.dataset.reservar)));

  // las cartas se reparten boca abajo y se dan vuelta al llegar
  const tirada = $('#reservar');
  if (tirada && !QA && !LITE && 'IntersectionObserver' in window) {
    tirada.classList.add('tirada-pre');
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { tirada.classList.remove('tirada-pre'); io.disconnect(); }
    }, { threshold: .18 });
    io.observe($('#tiradaForm') || tirada);
  }

  /* =========================================================
     EL ESPACIO — galería, horario y dirección
     ========================================================= */
  const galeria = $('#galeria');
  const track = $('#galeriaTrack');
  if (FULL && desktopQ.matches && galeria && track) {
    html.classList.add('hscroll');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: galeria, start: 'center center', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$('.g-media img, .g-media video', track).forEach(m => {
      gsap.fromTo(m, { '--gx': '4%' }, { '--gx': '-4%', ease: 'none', scrollTrigger: { trigger: m.closest('.g-item'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
  }
  const gVids = $$('.galeria video');
  if (gVids.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) { v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    }), { threshold: .35 });
    gVids.forEach(v => io.observe(v));
  }

  // horario en vivo (hora de Neuquén = hora argentina)
  const estado = $('#estado');
  const diaBar = $('#diaBar');
  function ahoraAR() {
    const parts = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(p => { parts[p.type] = p.value; });
    const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dia: dias[parts.weekday], min: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10) };
  }
  function pintarHorario() {
    if (!estado) return;
    const { dia, min } = ahoraAR();
    const ABRE = 870, CIERRA = 1110;
    const habil = dia >= 1 && dia <= 5;
    const abierto = habil && min >= ABRE && min < CIERRA;
    let txt;
    if (abierto) txt = 'Abierto ahora · hasta las 18:30';
    else if (habil && min < ABRE) txt = 'Cerrado ahora · abre hoy a las 14:30';
    else if (dia >= 1 && dia <= 4) txt = 'Cerrado ahora · abre mañana a las 14:30';
    else txt = 'Cerrado ahora · abre el lunes a las 14:30';
    estado.classList.toggle('abierto', abierto);
    const span = $('span', estado);
    if (span) span.textContent = txt;
    if (diaBar) diaBar.style.setProperty('--t', (min / 1440).toFixed(4));
  }
  pintarHorario();
  setInterval(pintarHorario, 60000);

  const copiar = $('#copiarDir');
  if (copiar) copiar.addEventListener('click', () => {
    const txt = copiar.dataset.dir;
    const span = $('span', copiar);
    const ok = () => { if (span) { span.textContent = 'Dirección copiada'; setTimeout(() => { span.textContent = 'Copiar dirección'; }, 2200); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, () => {});
  });

  /* =========================================================
     INTERACTIVOS
     ========================================================= */
  const interRes = $('#interRes');
  const interEleg = $('#interElegiste');
  const interPost = $('#interPost');
  $$('.post').forEach(post => {
    $$('.post-ops button', post).forEach(b => b.addEventListener('click', () => {
      $$('.post-ops button').forEach(x => { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      $$('.post').forEach(p => p.classList.remove('is-sel'));
      b.classList.add('is-on');
      b.setAttribute('aria-pressed', 'true');
      post.classList.add('is-sel');
      const q = $('.post-q', post).textContent.trim();
      if (interEleg) interEleg.textContent = `Elegiste la ${b.dataset.op} en “${q}”.`;
      if (interPost) interPost.href = post.dataset.url;
      if (interRes) interRes.hidden = false;
    }));
  });

  /* =========================================================
     PREGUNTAS — apertura suave
     ========================================================= */
  $$('.faq-list details').forEach(d => {
    const sum = $('summary', d);
    const body = $('.faq-a', d);
    if (!sum || !body) return;
    sum.addEventListener('click', e => {
      if (isLite() || QA || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        const a = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.65,.05,.25,1)' });
        a.onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    });
  });

  /* ---------- textos que no pueden cortarse (letra grande de Android) ---------- */
  function fitText() {
    $$('.h1-l, .tel-xl, .cifras dt, .tirada-head .nums, .marca-txt b').forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      let guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 11 && guard++ < 60) {
        fs -= 1;
        el.style.fontSize = fs + 'px';
      }
    });
    if (window.__lente) window.__lente.remedir();
  }
  window.__eldcFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', () => { fitText(); if (hasGSAP) ScrollTrigger.refresh(); });
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(fitText, 150); });

  /* ---------- watchdog de FPS: si el equipo no da, pasamos a modo liviano ---------- */
  function goLite(reason) {
    if (isLite()) return;
    html.classList.add('lite');
    try { sessionStorage.setItem('eldc-lite', '1'); } catch (e) { /* sin almacenamiento */ }
    const y = window.scrollY;
    if (lenis) { lenis.destroy(); lenis = null; if (hasGSAP) gsap.ticker.remove(lenisTick); }
    html.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'has-cursor');
    if (window.__prisma) window.__prisma.destroy();
    if (hasGSAP) {
      ScrollTrigger.getAll().forEach(t => t.kill(true));
      gsap.set(['#heroFront', '#heroVideo', '.hero-geo', '#galeriaTrack'], { clearProps: 'all' });
      $$('.facet img, .facet-luz, .g-media img, .g-media video').forEach(el => gsap.set(el, { clearProps: 'all' }));
    }
    html.classList.remove('webgl', 'prisma-ok', 'hscroll');
    pinST = null;
    armarAcordeon();
    if (tirada) tirada.classList.remove('tirada-pre');
    rvs.forEach(el => el.classList.add('in'));
    window.scrollTo(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
    if (window.console) console.info('[luz] modo liviano:', reason);
  }

  const FORCE_FULL = /[?&]full\b/.test(location.search);
  if (FULL && !FORCE_FULL) {
    let frames = 0, slow = 0, last = 0, start = 0, sampling = false, retries = 0;
    const sample = now => {
      if (!sampling) return;
      if (document.visibilityState !== 'visible') { last = 0; requestAnimationFrame(sample); return; }
      if (last) { frames++; if (now - last > 50) slow++; } else start = now;
      last = now;
      if (now - start > 2500 && frames > 0) {
        sampling = false;
        const fps = frames / ((now - start) / 1000);
        // < 12 fps no es un equipo lento: el navegador no está pintando (ventana tapada) → volvemos a medir
        if (fps < 12) { if (++retries < 4) setTimeout(begin, 3000); return; }
        if (fps < 36 || slow / frames > .25) goLite(`fps ${fps.toFixed(0)}`);
        return;
      }
      requestAnimationFrame(sample);
    };
    const begin = () => { if (sampling || isLite()) return; sampling = true; frames = slow = last = 0; requestAnimationFrame(sample); };
    setTimeout(begin, 2400);
    let scrolledOnce = false;
    window.addEventListener('scroll', () => { if (!scrolledOnce && window.scrollY > 140) { scrolledOnce = true; setTimeout(begin, 2600); } }, { passive: true });
    window.addEventListener('prisma:ready', () => setTimeout(begin, 1200), { once: true });
  }
})();
