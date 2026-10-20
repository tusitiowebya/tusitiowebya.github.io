/* =========================================================
   Fragancias Donatella — perfumes tester
   Intro del sello → frasco de vidrio (3D), historia del tester
   con la caja que cambia, consulta armada en una caja tester,
   menú, botón flotante y modo liviano automático.
   ========================================================= */
(function () {
  'use strict';

  const html = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const NEG = window.NEGOCIO || {};
  const WA = NEG.WA || '5491124729304';
  const waLink = txt => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const QA = html.classList.contains('qa');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLite = () => html.classList.contains('lite');
  const narrow = () => innerWidth <= 768;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  const anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* estado de la consulta (se guarda en el navegador: si volvés, tu caja sigue armada) */
  const KEY = 'donatella-consulta-v1';
  const MAX_ITEMS = 12;
  const consulta = { modo: 'se', items: [], para: '', aromas: [], usa: '', nombre: '', zona: '' };
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && typeof s === 'object') {
      if (s.modo === 'se' || s.modo === 'ayuda') consulta.modo = s.modo;
      if (Array.isArray(s.items)) consulta.items = s.items.filter(i => i && typeof i.n === 'string').slice(0, MAX_ITEMS).map(i => ({ n: i.n.slice(0, 70), c: Math.min(9, Math.max(1, i.c | 0 || 1)) }));
      ['para', 'usa', 'nombre', 'zona'].forEach(k => { if (typeof s[k] === 'string') consulta[k] = s[k].slice(0, 240); });
      if (Array.isArray(s.aromas)) consulta.aromas = s.aromas.filter(a => typeof a === 'string').slice(0, 7);
    }
  } catch (e) { /* sin almacenamiento */ }
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(consulta)); } catch (e) { /* nada */ } };

  /* ---------- video del encabezado (también es la textura de la pared 3D) ---------- */
  const video = $('#heroVideo');
  function startVideo() {
    if (!video || video.dataset.ok) return;
    video.dataset.ok = '1';
    const m = narrow();
    if (m && video.dataset.posterM) video.poster = video.dataset.posterM;
    video.muted = true;
    video.setAttribute('muted', '');
    video.preload = 'auto';
    video.src = m ? video.dataset.srcM : video.dataset.src;
    const p = video.play();
    if (p && p.catch) p.catch(() => { /* ahorro de energía: queda el póster */ });
  }
  startVideo();

  /* ---------- intro: el sello se dibuja ---------- */
  let readyAt = 0;
  function ready() {
    if (html.classList.contains('is-ready')) return;
    fitText();
    placeTag();
    html.classList.add('is-ready');
    readyAt = performance.now();
    maybeGlass();
    // sin 3D: aparece la foto del frasco cuando termina el trazo
    if (!html.classList.contains('full')) setTimeout(() => html.classList.add('img-in', 'glass-in'), QA ? 0 : 1150);
  }
  Promise.race([document.fonts ? document.fonts.ready : wait(0), wait(1400)]).then(() => requestAnimationFrame(ready));

  /* ---------- texto que no entra (letra grande del sistema en Android) ---------- */
  const FIT = ['.hw', '.cierre__tel'];
  function fitText() {
    FIT.forEach(sel => $$(sel).forEach(el => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize), guard = 40;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 12 && guard--) {
        fs *= .95;
        el.style.fontSize = fs.toFixed(1) + 'px';
      }
    }));
  }
  window.__donatellaFit = fitText;
  let tFit = 0;
  addEventListener('resize', () => { clearTimeout(tFit); tFit = setTimeout(() => { fitText(); placeTag(); }, 120); });
  addEventListener('load', fitText);

  /* ---------- escena 3D: solo en modo completo ---------- */
  let F = null;
  let glassDone = false;
  function maybeGlass() {
    if (glassDone || !F || !html.classList.contains('is-ready')) return;
    glassDone = true;
    // el vidrio se materializa cuando el contorno del sello ya está dibujado
    const delay = QA ? 0 : Math.max(0, 720 - (performance.now() - readyAt));
    setTimeout(() => { F.intro(); html.classList.add('glass-in'); }, delay);
  }
  function webglFail(why) {
    if (html.classList.contains('webgl-off')) return;
    html.classList.remove('webgl-on');
    html.classList.add('webgl-off');
    setTimeout(() => html.classList.add('img-in', 'glass-in'), 200);
    if (window.console) console.info('[donatella] sin 3D:', why);
    if (hasGSAP) ScrollTrigger.refresh();
  }
  function load3D() {
    if (!html.classList.contains('full') || isLite()) return;
    // capturas de página completa (?qa): el canvas fijo se estiraría a todo el alto → foto del frasco
    if (QA) return webglFail('modo qa');
    window.addEventListener('frasco:fail', e => webglFail(e.detail), { once: true });
    import('./frasco.js?v=2').then(() => {
      if (isLite()) { if (window.__frasco) window.__frasco.destroy(); return; }
      F = window.__frasco;
      if (!F) return webglFail('sin api');
      html.classList.add('webgl-on');
      maybeGlass();
      if (hasGSAP && !QA) setupStory();
      else F.state.k = 0;
    }).catch(err => webglFail(err));
  }

  /* mouse: el frasco gira apenas, la pared hace paralaje y las palabras se despegan */
  if (window.matchMedia && matchMedia('(pointer: fine)').matches) {
    const heroP = $('.hero');
    addEventListener('pointermove', e => {
      const mx = (e.clientX / innerWidth) * 2 - 1, my = (e.clientY / innerHeight) * 2 - 1;
      if (F) { F.state.mx = mx; F.state.my = my; }
      if (heroP && window.scrollY < innerHeight && !reduce) {
        heroP.style.setProperty('--mx', mx.toFixed(3));
        heroP.style.setProperty('--my', my.toFixed(3));
      }
    }, { passive: true });
  }

  /* "es un tester: probalo" */
  let sprayDir = -1;
  function probar() {
    if (F && html.classList.contains('webgl-on')) {
      sprayDir = -sprayDir;
      F.spray(sprayDir);
    } else {
      const n = $('.niebla');
      if (!n) return;
      n.classList.remove('is-on');
      void n.offsetWidth;
      n.classList.add('is-on');
    }
    const b = $('#probar');
    if (b) {
      b.classList.add('is-probado');
      clearTimeout(b._t);
      b._t = setTimeout(() => b.classList.remove('is-probado'), 2600);
    }
  }
  const probarBtn = $('#probar');
  if (probarBtn) probarBtn.addEventListener('click', probar);
  const slotHero = $('#slotHero');
  if (slotHero) slotHero.addEventListener('click', probar);

  /* móvil: la invitación es una tira de prueba colgada al lado del frasco */
  const heroEl = $('.hero');
  const tagEl = $('.hero__probar');
  function placeTag() {
    if (!heroEl || !tagEl || !slotHero) return;
    const on = narrow();
    html.classList.toggle('tag-flota', on);
    if (!on) return;
    const hr = heroEl.getBoundingClientRect(), sr = slotHero.getBoundingClientRect();
    const x = Math.min(sr.right - hr.left + 20, hr.width - 46);
    heroEl.style.setProperty('--tag-x', Math.round(x) + 'px');
    heroEl.style.setProperty('--tag-y', Math.round(sr.top - hr.top + sr.height * .3) + 'px');
  }
  addEventListener('load', placeTag);

  /* con mouse: un cursor "Probalo" aparece sobre el frasco */
  const cursor = $('#cursorProbar');
  if (cursor && slotHero && window.matchMedia && matchMedia('(pointer: fine)').matches) {
    html.classList.add('cursor-on');
    let cx = -300, cy = -300, tx = -300, ty = -300, craf = 0;
    const loop = () => {
      cx += (tx - cx) * .3; cy += (ty - cy) * .3;
      cursor.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      craf = Math.abs(tx - cx) + Math.abs(ty - cy) > .4 ? requestAnimationFrame(loop) : 0;
    };
    slotHero.addEventListener('pointerenter', e => { cx = tx = e.clientX; cy = ty = e.clientY; cursor.classList.add('is-on'); loop(); });
    slotHero.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; if (!craf) craf = requestAnimationFrame(loop); });
    slotHero.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    slotHero.addEventListener('pointerdown', () => {
      cursor.classList.add('is-click');
      setTimeout(() => cursor.classList.remove('is-click'), 160);
    });
  }

  /* ---------- scroll suave ---------- */
  let lenis = null;
  const lenisTick = t => { if (lenis) lenis.raf(t * 1000); };
  if (window.Lenis && html.classList.contains('full') && !reduce && !QA) {
    lenis = new Lenis({ lerp: .11, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { if (lenis) { lenis.raf(t); requestAnimationFrame(raf); } };
      requestAnimationFrame(raf);
    }
  }
  const navH = () => ($('#nav') ? $('#nav').offsetHeight : 70);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -navH() + 2, duration: 1.3 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ---------- historia: la sección queda fija y el frasco cuenta qué es un tester ---------- */
  const triggers = [];
  function setupStory() {
    const pin = $('.historia__pin');
    const caps = $$('.cap');
    const bars = $$('.historia__avance i');
    const START = [0, .3, .66], LEN = [.3, .36, .34];
    let cur = -1;
    const setCap = i => {
      if (i === cur) return;
      cur = i;
      caps.forEach((c, k) => c.classList.toggle('is-on', k === i));
    };
    F.prepareBox();
    triggers.push(ScrollTrigger.create({
      trigger: pin, start: 'top top',
      end: () => '+=' + Math.round(innerHeight * (narrow() ? 2.6 : 3)),
      pin: true, anticipatePin: 1,
      onUpdate: self => {
        const p = self.progress;
        F.state.ch = p;
        setCap(p < START[1] ? 0 : p < START[2] ? 1 : 2);
        bars.forEach((b, k) => b.style.setProperty('--p', clamp01((p - START[k]) / LEN[k]).toFixed(3)));
      },
    }));
    // del encabezado a la historia: el frasco viaja y la pared de hojas pasa a papel
    triggers.push(ScrollTrigger.create({
      trigger: '.historia', start: 'top bottom', end: 'top top',
      onUpdate: self => { F.state.k = self.progress; F.state.wall = self.progress; },
      onLeaveBack: () => { F.state.k = 0; F.state.wall = 0; },
    }));
    // el frasco deja el escenario: el texto del encabezado se apaga mientras el frasco viaja
    const fade = (sel, end) => {
      const el = $$(sel);
      if (!el.length) return;
      const tw = gsap.fromTo(el, { opacity: 1 }, {
        opacity: 0, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: end, scrub: true },
      });
      triggers.push({ kill: rev => { if (tw.scrollTrigger) tw.scrollTrigger.kill(rev); tw.kill(); gsap.set(el, { clearProps: 'opacity' }); } });
    };
    fade('.hero__pie, .hero__kicker, .hero__credito', '32% top');
    fade('.hero__titulo', '52% top');
    // pasada la historia la escena queda tapada: dejamos de dibujarla
    triggers.push(ScrollTrigger.create({
      trigger: '.historia', start: 'bottom top',
      onEnter: () => { F.setVisible(false); html.classList.add('escena-off'); if (video) video.pause(); },
      onLeaveBack: () => { html.classList.remove('escena-off'); F.setVisible(true); if (video) { const p = video.play(); if (p && p.catch) p.catch(() => {}); } },
    }));
    ScrollTrigger.refresh();
  }

  /* ---------- navegación ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    html.classList.toggle('menu-open', open);
    onScroll();
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  if (burger) burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  if (menu) $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); burger.focus(); }
  });
  addEventListener('resize', () => { if (innerWidth >= 1100 && menu && !menu.hidden) setMenu(false); });

  /* ---------- botón flotante y mini caja: aparecen pasado el encabezado ---------- */
  const fab = $('#fab');
  const mini = $('#miniCaja');
  let cierreVisible = false, consultaVisible = false;
  const oscuras = $$('[data-nav="oscuro"]');
  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 24);
      const mid = nav.offsetHeight / 2;
      const dark = !html.classList.contains('menu-open') && oscuras.some(sec => {
        const r = sec.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      nav.classList.toggle('is-dark', dark);
    }
    const pasado = y > innerHeight * .6;
    if (fab) fab.classList.toggle('is-on', pasado && !cierreVisible);
    if (mini) mini.classList.toggle('is-on', pasado && !consultaVisible && consulta.items.length > 0 && consulta.modo === 'se');
  }
  addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    const cierre = $('#contacto');
    if (cierre) new IntersectionObserver(es => { cierreVisible = es[0].isIntersecting; onScroll(); }, { threshold: .25 }).observe(cierre);
    const sec = $('#consulta');
    if (sec) new IntersectionObserver(es => { consultaVisible = es[0].isIntersecting; onScroll(); }, { threshold: .12 }).observe(sec);
  }

  /* ---------- aparición al scrollear ---------- */
  const rv = $$('[data-rv]');
  if (QA || reduce || !('IntersectionObserver' in window)) rv.forEach(el => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    rv.forEach(el => io.observe(el));
  }

  /* =========================================================
     PEDÍ PRECIO — la consulta se arma dentro de una caja tester
     ========================================================= */
  const form = $('#armador');
  const tabs = $$('[role="tab"]', form || document);
  const panels = { se: $('#panelSe'), ayuda: $('#panelAyuda') };
  const inPerfume = $('#inPerfume');
  const lista = $('#lista');
  const listaVacia = $('#listaVacia');
  const inUsa = $('#inUsa');
  const inNombre = $('#inNombre');
  const inZona = $('#inZona');
  const errorEl = $('#armadorError');
  const caja = $('#caja');
  const cajaItems = $('#cajaItems');
  const cajaPara = $('#cajaPara');
  const burbuja = $('#burbuja');
  const miniN = $('#miniCajaN');

  const limpio = s => String(s || '').replace(/\s+/g, ' ').trim();
  const listaY = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
  const dos = n => String(n).padStart(2, '0');

  function mensaje() {
    const L = [];
    if (consulta.modo === 'se') {
      L.push('¡Hola, Fragancias Donatella! Quiero consultar precio y disponibilidad de estos perfumes tester:');
      consulta.items.forEach(it => L.push('• ' + it.n + (it.c > 1 ? ' (x' + it.c + ')' : '')));
      if (!consulta.items.length) L.push('• …');
    } else {
      L.push('¡Hola, Fragancias Donatella! Quiero que me ayuden a elegir un perfume tester.');
      if (consulta.para) L.push('• Es ' + consulta.para + '.');
      if (consulta.aromas.length) L.push('• Me gustan los aromas ' + listaY(consulta.aromas) + '.');
      if (consulta.usa) L.push('• Uso o me gustó: ' + consulta.usa);
      if (!consulta.para && !consulta.aromas.length && !consulta.usa) L.push('• …');
    }
    const yo = [];
    if (consulta.nombre) yo.push('soy ' + consulta.nombre);
    if (consulta.zona) yo.push('te escribo desde ' + consulta.zona);
    if (yo.length) {
      const f = yo.join(' y ');
      L.push('', f.charAt(0).toUpperCase() + f.slice(1) + '.');
    }
    return L.join('\n');
  }

  const vistos = new Set();
  function pintarCaja(golpe) {
    if (!cajaItems) return;
    const filas = [];
    if (consulta.modo === 'se') {
      consulta.items.forEach((it, i) => filas.push({ k: 'p:' + it.n.toLowerCase() + ':' + it.c, b: dos(i + 1), t: it.n + (it.c > 1 ? '  ×' + it.c : '') }));
    } else {
      if (consulta.para) filas.push({ k: 'a:para:' + consulta.para, b: '·', t: consulta.para.charAt(0).toUpperCase() + consulta.para.slice(1) });
      if (consulta.aromas.length) filas.push({ k: 'a:ar:' + consulta.aromas.join(), b: '·', t: listaY(consulta.aromas) });
      if (consulta.usa) filas.push({ k: 'a:usa:' + consulta.usa, b: '·', t: 'Usa: ' + consulta.usa });
    }
    cajaItems.textContent = '';
    if (!filas.length) {
      const li = document.createElement('li');
      li.className = 'caja__vacio';
      li.textContent = consulta.modo === 'se' ? '— tu lista de perfumes —' : '— contanos qué te gusta —';
      cajaItems.appendChild(li);
    }
    filas.forEach(f => {
      const li = document.createElement('li');
      const b = document.createElement('b');
      b.textContent = f.b;
      const s = document.createElement('span');
      s.textContent = f.t;
      li.append(b, s);
      if (vistos.has(f.k)) li.style.animation = 'none';
      vistos.add(f.k);
      cajaItems.appendChild(li);
    });
    const quien = [consulta.nombre, consulta.zona].filter(Boolean).join(' · ');
    if (cajaPara) cajaPara.textContent = quien ? 'Para: ' + quien : '';
    if (caja) {
      caja.classList.toggle('is-sellada', filas.length > 0);
      if (golpe && !reduce) {
        caja.classList.remove('is-golpe');
        void caja.offsetWidth;
        caja.classList.add('is-golpe');
      }
    }
    if (burbuja) burbuja.textContent = mensaje();
    if (miniN) miniN.textContent = String(consulta.items.reduce((a, it) => a + it.c, 0));
    onScroll();
  }

  function pintarLista() {
    if (!lista) return;
    lista.textContent = '';
    consulta.items.forEach((it, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="lista__nombre"></span>' +
        '<span class="cant"><button type="button" data-menos aria-label="Uno menos">−</button><output></output><button type="button" data-mas aria-label="Uno más">+</button></span>' +
        '<button type="button" class="quitar" data-quitar aria-label="Quitar">×</button>';
      li.querySelector('.lista__nombre').textContent = it.n;
      li.querySelector('output').textContent = String(it.c);
      li.querySelector('[data-quitar]').setAttribute('aria-label', 'Quitar ' + it.n);
      li.dataset.i = String(i);
      lista.appendChild(li);
    });
    if (listaVacia) listaVacia.hidden = consulta.items.length > 0;
  }

  function error(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || '';
    errorEl.hidden = !msg;
  }

  function sumar(nombre) {
    const n = limpio(nombre).slice(0, 70);
    if (!n) return false;
    const ya = consulta.items.find(it => it.n.toLowerCase() === n.toLowerCase());
    if (ya) ya.c = Math.min(9, ya.c + 1);
    else {
      if (consulta.items.length >= MAX_ITEMS) { error('Hasta ' + MAX_ITEMS + ' perfumes por consulta. Para más, escribinos directo por WhatsApp.'); return false; }
      consulta.items.push({ n, c: 1 });
    }
    if (consulta.modo !== 'se') setModo('se', false);
    error('');
    guardar();
    pintarLista();
    pintarCaja(true);
    return true;
  }
  // la vitrina suma perfumes a la misma caja
  window.__donatella = { sumar };

  function setModo(modo, foco) {
    consulta.modo = modo;
    tabs.forEach(t => {
      const on = (t.id === 'tabSe' && modo === 'se') || (t.id === 'tabAyuda' && modo === 'ayuda');
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
    });
    if (panels.se) panels.se.hidden = modo !== 'se';
    if (panels.ayuda) panels.ayuda.hidden = modo !== 'ayuda';
    error('');
    guardar();
    pintarCaja(false);
  }

  if (form) {
    tabs.forEach(t => {
      t.addEventListener('click', () => setModo(t.id === 'tabAyuda' ? 'ayuda' : 'se', false));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          setModo(consulta.modo === 'se' ? 'ayuda' : 'se', true);
        }
      });
    });

    const btnSumar = $('#btnSumar');
    const sumarCampo = () => {
      if (!limpio(inPerfume.value)) { error('Escribí la marca y el nombre del perfume.'); inPerfume.focus({ preventScroll: true }); return; }
      if (sumar(inPerfume.value)) { inPerfume.value = ''; inPerfume.focus({ preventScroll: true }); }
    };
    if (btnSumar) btnSumar.addEventListener('click', sumarCampo);
    if (inPerfume) inPerfume.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sumarCampo(); }
    });

    if (lista) lista.addEventListener('click', e => {
      const li = e.target.closest('li');
      if (!li) return;
      const it = consulta.items[+li.dataset.i];
      if (!it) return;
      if (e.target.closest('[data-mas]')) it.c = Math.min(9, it.c + 1);
      else if (e.target.closest('[data-menos]')) it.c = Math.max(1, it.c - 1);
      else if (e.target.closest('[data-quitar]')) consulta.items.splice(+li.dataset.i, 1);
      else return;
      guardar();
      pintarLista();
      pintarCaja(false);
    });

    $$('.chips[data-campo]', form).forEach(grupo => {
      const campo = grupo.dataset.campo;
      const multi = grupo.hasAttribute('data-multi');
      grupo.addEventListener('click', e => {
        const b = e.target.closest('.chip');
        if (!b) return;
        const v = b.dataset.valor;
        if (multi) {
          const i = consulta[campo].indexOf(v);
          if (i >= 0) consulta[campo].splice(i, 1); else consulta[campo].push(v);
        } else consulta[campo] = consulta[campo] === v ? '' : v;
        sincChips();
        error('');
        guardar();
        pintarCaja(true);
      });
    });
    function sincChips() {
      $$('.chips[data-campo]', form).forEach(grupo => {
        const campo = grupo.dataset.campo;
        $$('.chip', grupo).forEach(b => {
          const on = Array.isArray(consulta[campo]) ? consulta[campo].includes(b.dataset.valor) : consulta[campo] === b.dataset.valor;
          b.setAttribute('aria-pressed', String(on));
        });
      });
    }

    const texto = (el, campo) => {
      if (!el) return;
      el.value = consulta[campo];
      el.addEventListener('input', () => { consulta[campo] = limpio(el.value).slice(0, 240); guardar(); pintarCaja(false); });
    };
    texto(inUsa, 'usa');
    texto(inNombre, 'nombre');
    texto(inZona, 'zona');

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (consulta.modo === 'se') {
        if (inPerfume && limpio(inPerfume.value)) { sumar(inPerfume.value); inPerfume.value = ''; }
        if (!consulta.items.length) { error('Sumá al menos un perfume para armar la consulta.'); if (inPerfume) inPerfume.focus({ preventScroll: true }); return; }
      } else if (!consulta.para && !consulta.aromas.length && !consulta.usa) {
        error('Contanos para quién es, qué aromas te gustan o qué perfume usás.');
        return;
      }
      error('');
      window.open(waLink(mensaje()), '_blank', 'noopener');
    });

    sincChips();
    setModo(consulta.modo, false);
    pintarLista();
    pintarCaja(false);
  }

  /* =========================================================
     MODO LIVIANO: si el equipo no da, se apaga el 3D y el pin
     ========================================================= */
  function goLite(reason) {
    if (isLite()) return;
    const y = window.scrollY;
    try { sessionStorage.setItem('donatella-lite', '1'); } catch (e) { /* nada */ }
    triggers.forEach(t => t.kill(true));
    triggers.length = 0;
    if (lenis) { lenis.destroy(); lenis = null; if (hasGSAP) gsap.ticker.remove(lenisTick); }
    if (F) { F.destroy(); F = null; }
    html.classList.remove('full', 'webgl-on', 'escena-off');
    html.classList.add('lite', 'img-in', 'glass-in');
    $$('.cap').forEach(c => c.classList.remove('is-on'));
    if (video && video.paused) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
    if (hasGSAP) ScrollTrigger.refresh();
    window.scrollTo(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
    onScroll();
    if (window.console) console.info('[donatella] modo liviano:', reason);
  }
  window.__donatellaLite = goLite;

  const FORCE_FULL = /[?&]full\b/.test(location.search);
  if (html.classList.contains('full') && !FORCE_FULL && !QA) {
    let frames = 0, slow = 0, last = 0, start = 0, sampling = false, retries = 0;
    const sample = now => {
      if (!sampling) return;
      if (document.visibilityState !== 'visible') { last = 0; requestAnimationFrame(sample); return; }
      if (last) { frames++; if (now - last > 50) slow++; } else start = now;
      last = now;
      if (now - start > 2500 && frames > 0) {
        sampling = false;
        const fps = frames / ((now - start) / 1000);
        // < 12 fps no es un equipo lento: el navegador no está pintando (ventana tapada) → medimos de nuevo
        if (fps < 12) { if (++retries < 4) setTimeout(begin, 3000); return; }
        if (fps < 34 || slow / frames > .25) goLite('fps ' + fps.toFixed(0));
        return;
      }
      requestAnimationFrame(sample);
    };
    const begin = () => { if (sampling || isLite()) return; sampling = true; frames = slow = last = 0; requestAnimationFrame(sample); };
    setTimeout(begin, 2600);
    let scrolled = false;
    addEventListener('scroll', () => { if (!scrolled && window.scrollY > 160) { scrolled = true; setTimeout(begin, 1800); } }, { passive: true });
  }

  /* el sello del cierre gira apenas con el scroll, como un sello que se apoya */
  const selloCierre = $('.cierre__sello');
  if (hasGSAP && selloCierre && !reduce && !QA) {
    gsap.fromTo(selloCierre, { yPercent: -50, rotation: -30 }, {
      yPercent: -50, rotation: 6, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: .6 },
    });
  }

  load3D();
  onScroll();
  if (hasGSAP) addEventListener('load', () => ScrollTrigger.refresh());
})();
