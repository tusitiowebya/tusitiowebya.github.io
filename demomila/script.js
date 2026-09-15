/* =========================================================
   Gestoría Mila — interacciones
   ========================================================= */
(function () {
  'use strict';

  const html = document.documentElement;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const WA = '5491176077358';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  /* ---------- modo liviano: sin aceleración por hardware ---------- */
  (function detectSoftwareRender() {
    if (html.classList.contains('lite') || /[?&]full\b/.test(location.search)) return;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) { html.classList.add('lite'); return; }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software|basic render/i.test(r)) html.classList.add('lite');
    } catch (e) { /* sin datos: seguimos en modo completo */ }
  })();

  const QA = html.classList.contains('qa');
  const LITE = html.classList.contains('lite');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const isDesktop = () => innerWidth > 900;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const FULL = !LITE && !QA && hasGSAP;

  /* ---------- intro ---------- */
  const ready = () => html.classList.add('is-ready');
  if (QA || LITE) ready();
  else {
    const t = setTimeout(ready, 1500);
    window.addEventListener('load', () => { clearTimeout(t); setTimeout(ready, 350); }, { once: true });
  }

  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (FULL && finePointer && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.4 });
    else target.scrollIntoView({ behavior: LITE ? 'auto' : 'smooth' });
  }));

  /* ---------- nav + menú ---------- */
  const nav = $('#nav');
  const burger = $('.nav-burger');
  const drawer = $('.drawer');
  function closeMenu() {
    html.classList.remove('menu-open');
    burger && burger.setAttribute('aria-expanded', 'false');
    drawer && drawer.setAttribute('aria-hidden', 'true');
  }
  burger && burger.addEventListener('click', () => {
    const open = !html.classList.contains('menu-open');
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });

  /* ---------- HERO: ventanilla ---------- */
  const hero = $('.hero');
  const sky = $('.hero-sky');
  const win = $('.window');
  const copy = $('.hero-copy');
  const cards = $$('.hero-window-slot [data-depth]');
  const flight = $('.flight-text');
  const route = $('.hero-route');
  const scrollCue = $('.hero-scroll');
  const video = $('.hero-video');
  let winBox = null;
  let heroP = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function measureWindow() {
    if (!hero || !win) return;
    const prev = sky.style.clipPath;
    const h = hero.getBoundingClientRect();
    // medimos sin transformaciones del slot
    const r = win.getBoundingClientRect();
    winBox = {
      t: r.top - h.top, l: r.left - h.left,
      r: h.width - (r.right - h.left), b: h.height - (r.bottom - h.top),
      rx: r.width * .46, ry: r.height * .34
    };
    sky.style.clipPath = prev;
    renderHero();
  }

  function renderHero() {
    if (!winBox) return;
    const p = ease(clamp(heroP / .78, 0, 1));
    const k = 1 - p;
    sky.style.clipPath = `inset(${winBox.t * k}px ${winBox.r * k}px ${winBox.b * k}px ${winBox.l * k}px round ${winBox.rx * k}px / ${winBox.ry * k}px)`;
    sky.style.setProperty('--tint', String(lerp(.4, 1, clamp(heroP * 1.4, 0, 1))));

    const pc = clamp(heroP / .35, 0, 1);
    copy.style.opacity = String(1 - pc);
    copy.style.transform = `translate3d(0, ${-70 * pc}px, 0)`;
    win.style.opacity = String(1 - clamp(heroP / .12, 0, 1));
    if (route) route.style.opacity = String(1 - pc);
    if (scrollCue) scrollCue.style.opacity = String(1 - clamp(heroP / .1, 0, 1));

    const out = clamp(heroP / .5, 0, 1);
    cards.forEach((el, i) => {
      const d = parseFloat(el.dataset.depth) || 10;
      const dirX = [-1, -1.2, 1.3, 1][i] || 1;
      const dirY = [-1, 1, .2, -1.2][i] || 1;
      const mx = mouse.x * d, my = mouse.y * d;
      el.style.transform = `translate3d(${mx + dirX * 520 * ease(out)}px, ${my + dirY * 260 * ease(out)}px, 0)`;
      el.style.opacity = String(1 - out);
    });

    if (flight) {
      const f = clamp((heroP - .62) / .25, 0, 1);
      flight.style.opacity = String(f);
      flight.style.transform = `translate3d(0, ${30 * (1 - f)}px, 0)`;
    }
  }

  if (hero && win) {
    measureWindow();
    window.addEventListener('resize', () => { measureWindow(); });
    document.fonts && document.fonts.ready.then(measureWindow);
    window.addEventListener('load', measureWindow);

    if (FULL && isDesktop()) {
      ScrollTrigger.create({
        trigger: hero, start: 'top top', end: '+=120%', pin: true, scrub: true,
        onUpdate: self => { heroP = self.progress; renderHero(); },
        onRefresh: () => { heroP = 0; measureWindow(); }
      });
    }

    if (finePointer && !LITE && !QA) {
      hero.addEventListener('pointermove', e => {
        mouse.tx = (e.clientX / innerWidth - .5) * 1.2;
        mouse.ty = (e.clientY / innerHeight - .5) * 1.2;
      });
      (function loop() {
        mouse.x = lerp(mouse.x, mouse.tx, .06);
        mouse.y = lerp(mouse.y, mouse.ty, .06);
        if (Math.abs(mouse.x - mouse.tx) > .001 || Math.abs(mouse.y - mouse.ty) > .001) renderHero();
        requestAnimationFrame(loop);
      })();
    }

    // pausar el video cuando no se ve
    if (video && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { en.isIntersecting ? video.play().catch(() => {}) : video.pause(); }).observe(hero);
    }
  }

  /* ---------- cinta: duplicar para loop continuo ---------- */
  const track = $('.ribbon-track');
  if (track) track.appendChild(track.firstElementChild.cloneNode(true));

  /* ---------- servicios: imagen flotante ---------- */
  const float = $('.svc-float');
  if (float && finePointer) {
    const img = $('img', float);
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let active = false;
    $$('.svc').forEach(li => {
      li.addEventListener('pointerenter', () => { img.src = li.dataset.img; float.classList.add('on'); active = true; });
      li.addEventListener('pointerleave', () => { float.classList.remove('on'); active = false; });
    });
    window.addEventListener('pointermove', e => { pos.tx = e.clientX + 150; pos.ty = e.clientY; if (!active) { pos.x = pos.tx; pos.y = pos.ty; } });
    (function loop() {
      pos.x = lerp(pos.x, pos.tx, .14); pos.y = lerp(pos.y, pos.ty, .14);
      float.style.left = pos.x + 'px'; float.style.top = pos.y + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- nacionalidades ---------- */
  const NATIONS = {
    espanola: { name: 'Nacionalidad española', short: 'la española', stamp: 'ESPAÑA', via: 'Por residencia y por descendencia',
      text: 'Si tenés antepasados españoles o residencia legal en España, analizamos tu caso y ordenamos cada partida, legalización y turno consular.',
      checks: ['Análisis de tu árbol familiar y documentación', 'Búsqueda y pedido de partidas', 'Traducción, legalización y apostilla', 'Presentación y seguimiento hasta la resolución'] },
    italiana: { name: 'Nacionalidad italiana', short: 'la italiana', stamp: 'ITALIA', via: 'Por descendencia',
      text: 'Tu historia también es Italia. Un legado que te conecta con tus raíces: reconstruimos la línea familiar y armamos la carpeta completa.',
      checks: ['Reconstrucción de la línea de ascendencia', 'Búsqueda de actas en Italia y Argentina', 'Rectificaciones, traducciones y apostillas', 'Acompañamiento en la presentación'] },
    polaca: { name: 'Nacionalidad polaca', short: 'la polaca', stamp: 'POLSKA', via: 'Por descendencia',
      text: 'Si tus abuelos o bisabuelos vinieron de Polonia, revisamos qué documentos existen y cómo acreditar la ciudadanía que te corresponde.',
      checks: ['Evaluación de tu caso familiar', 'Búsqueda de registros polacos', 'Traducción jurada y legalizaciones', 'Seguimiento del trámite'] },
    croata: { name: 'Nacionalidad croata', short: 'la croata', stamp: 'HRVATSKA', via: 'Por descendencia',
      text: 'Del Adriático a tu familia: analizamos tu ascendencia croata y te guiamos en la documentación para iniciar el reconocimiento.',
      checks: ['Análisis de ascendencia', 'Documentación de origen', 'Traducciones y apostillas', 'Presentación y seguimiento'] },
    francesa: { name: 'Nacionalidad francesa', short: 'la francesa', stamp: 'FRANCE', via: 'Por descendencia',
      text: 'Actas de état civil, partidas antiguas y papeles de familia: te ayudamos a ordenarlos para acceder a la nacionalidad francesa.',
      checks: ['Revisión de documentación familiar', 'Pedido de actas de état civil', 'Traducción oficial y legalización', 'Acompañamiento en cada etapa'] },
    alemana: { name: 'Nacionalidad alemana', short: 'la alemana', stamp: 'DEUTSCHLAND', via: 'Según tu caso',
      text: 'Cada caso alemán tiene sus particularidades. Evaluamos tu situación y la de tu familia antes de indicarte el camino posible.',
      checks: ['Evaluación inicial del caso', 'Búsqueda de documentación de origen', 'Traducciones y legalizaciones', 'Guía paso a paso'] },
    portuguesa: { name: 'Nacionalidad portuguesa', short: 'la portuguesa', stamp: 'PORTUGAL', via: 'Por descendencia',
      text: 'Si tu familia tiene raíces portuguesas, analizamos tu caso y te acompañamos con las partidas, traducciones y presentaciones.',
      checks: ['Análisis de ascendencia portuguesa', 'Pedido de certidões y partidas', 'Traducción y apostilla', 'Presentación y seguimiento'] },
    argentina: { name: 'Nacionalidad argentina', short: 'la argentina', stamp: 'ARGENTINA', via: 'Por residencia · DNI',
      text: 'Residencia, radicación, DNI vencido o nacionalidad por residencia: te orientamos para regularizar tu situación en Argentina.',
      checks: ['Residencia temporaria y permanente', 'Recuperación de DNI', 'Carta de ciudadanía por residencia', 'Turnos y seguimiento'] }
  };

  const photoWrap = $('.nation-photo');
  const info = $('.nation-info');
  const nPhoto = $('#nPhoto'), nName = $('#nName'), nVia = $('#nVia'), nText = $('#nText'), nChecks = $('#nChecks'), nCta = $('#nCta'), nStamp = $('#nStamp'), nStampTxt = $('#nStampTxt');
  const pps = $$('.pp');

  function setNation(key, animate) {
    const d = NATIONS[key]; if (!d) return;
    pps.forEach(b => { const on = b.dataset.n === key; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
    const apply = () => {
      nPhoto.src = `img/${key}.jpg`;
      nPhoto.alt = `Pieza de Gestoría Mila sobre ${d.name.toLowerCase()}`;
      nName.textContent = d.name; nVia.textContent = d.via; nText.textContent = d.text;
      nChecks.innerHTML = d.checks.map(c => `<li>${c}</li>`).join('');
      nCta.textContent = `Consultar por ${d.short}`;
      nCta.href = waLink(`Hola Mila, quiero consultar por la ${d.name.toLowerCase()}.`);
      nStampTxt.textContent = d.stamp;
      photoWrap.classList.remove('swap'); info.classList.remove('swap');
      nStamp.classList.remove('slam'); void nStamp.offsetWidth; nStamp.classList.add('slam');
    };
    if (!animate || LITE) { apply(); return; }
    photoWrap.classList.add('swap'); info.classList.add('swap');
    setTimeout(apply, 320);
  }
  pps.forEach(b => b.addEventListener('click', () => setNation(b.dataset.n, true)));
  if (nCta) nCta.href = waLink('Hola Mila, quiero consultar por la nacionalidad española.');
  // precarga
  Object.keys(NATIONS).forEach(k => { const i = new Image(); i.src = `img/${k}.jpg`; });

  /* ---------- destinos: scroll horizontal ---------- */
  const dest = $('.dest'), destPin = $('.dest-pin'), destTrack = $('.dest-track'), destBar = $('.dest-progress span');
  if (FULL && dest && isDesktop()) {
    const dist = () => Math.max(0, destTrack.scrollWidth - innerWidth);
    gsap.to(destTrack, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: dest, start: 'top top', end: () => '+=' + dist(), pin: destPin, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => { if (destBar) destBar.style.transform = `scaleX(${self.progress})`; }
      }
    });
  }

  /* ---------- tilt en cards ---------- */
  if (finePointer && !LITE) {
    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- itinerario + parallax ---------- */
  const itin = $('.itinerary');
  const whyImg = $('.why-bg');
  const why = $('.why');
  const waFloat = $('.wa-float');
  let lastY = 0;

  function onScroll() {
    const y = window.scrollY;
    const vh = innerHeight;
    if (nav) {
      nav.classList.toggle('is-solid', y > 40);
      const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (y > vh * 1.6 && goingDown && !html.classList.contains('menu-open')) nav.classList.add('is-hidden');
      else if (goingUp || y < vh) nav.classList.remove('is-hidden');
    }
    lastY = y;

    if (waFloat && hero) {
      const hb = hero.getBoundingClientRect().bottom;
      waFloat.classList.toggle('on', hb < vh * .4);
    }
    if (itin) {
      const r = itin.getBoundingClientRect();
      const p = clamp((vh * .55 - r.top) / r.height, 0, 1);
      itin.style.setProperty('--p', p.toFixed(4));
    }
    if (why && whyImg && !LITE) {
      const r = why.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        whyImg.style.transform = `translate3d(0, ${p * -60}px, 0)`;
      }
    }
  }
  if (lenis) lenis.on('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveals ---------- */
  const revealSel = ['.services-head > *', '.svc', '.nations-head', '.passports', '.nation-stage', '.dest-head', '.programs-head > *', '.b-card', '.alliance-photos', '.alliance-copy > *', '.process-head', '.step', '.why-copy', '.why-list', '.reviews-head', '.rv', '.faq-aside', '.qa', '.faq-group', '.contact-left', '.form', '.footer-grid > *'];
  const revealEls = $$(revealSel.join(','));
  if (!QA && !LITE && 'IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('rv-up'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('rv-up'));
        const idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- tarjeta ---------- */
  const card = $('.card-flip');
  if (card) {
    const flip = e => { if (e.target.closest('a')) return; card.classList.toggle('flipped'); };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); } });
  }

  /* ---------- formulario → WhatsApp ---------- */
  const form = $('#form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(form);
      const nombre = String(f.get('nombre') || '').trim();
      const input = form.elements.nombre;
      if (!nombre) { input.classList.add('err'); input.focus(); return; }
      input.classList.remove('err');
      const tema = f.get('tema') || 'una consulta';
      const destino = String(f.get('destino') || '').trim();
      const mensaje = String(f.get('mensaje') || '').trim();
      let txt = `Hola Mila, soy ${nombre}. Quiero consultar por: ${tema}`;
      if (destino) txt += ` (${destino})`;
      txt += '.';
      if (mensaje) txt += `\n\n${mensaje}`;
      window.open(waLink(txt), '_blank', 'noopener');
    });
  }

  /* refrescar medidas cuando cargan fuentes e imágenes */
  if (hasGSAP) window.addEventListener('load', () => ScrollTrigger.refresh());
})();
