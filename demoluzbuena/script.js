/* Portada de Luz Buena: menú, video, estante, Día de la Madre, vela de energías y destacados. */
(function () {
  'use strict';
  var S = window.LuzStore;
  var qs = function (s, r) { return (r || document).querySelector(s); };
  var QA = /[?&]qa\b/.test(location.search);
  if (QA) document.documentElement.classList.add('qa');

  /* ---------- nav ---------- */
  var nav = qs('[data-nav]');
  var burger = qs('[data-burger]');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('no-scroll', open);
  });
  qs('#menu').addEventListener('click', function (e) {
    if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); document.documentElement.classList.remove('no-scroll'); }
  });

  /* ---------- video ---------- */
  var video = qs('[data-hero-video]');
  var ctl = qs('[data-vidctl]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var userPaused = reduce.matches;
  function setCtl() {
    var playing = !video.paused;
    ctl.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video');
    ctl.firstElementChild.textContent = playing ? '❚❚' : '▶';
  }
  function tryPlay() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  if (userPaused) video.removeAttribute('autoplay'); else tryPlay();
  video.addEventListener('play', setCtl); video.addEventListener('pause', setCtl);
  ctl.addEventListener('click', function () {
    if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (userPaused) return;
      if (en[0].isIntersecting) tryPlay(); else video.pause();
    }, { threshold: 0.05 }).observe(video);
  }
  document.addEventListener('touchstart', function once() { if (!userPaused && video.paused) tryPlay(); document.removeEventListener('touchstart', once); }, { passive: true });
  setCtl();

  /* ---------- Día de la Madre (domingo 18/10/2026) ---------- */
  var MADRE = new Date(2026, 9, 18);
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  var dias = Math.round((MADRE - hoy) / 864e5);
  var madre = qs('[data-madre]');
  var showMadre = dias >= 0;

  /* ---------- vela de energías ---------- */
  var intents = qs('[data-intents]');
  var energiaGrid = qs('[data-energia-grid]');
  var current = 'calma';
  intents.innerHTML = window.LUZ_ENERGIAS.map(function (e) {
    return '<button type="button" role="radio" class="intent" data-e="' + e.id + '" style="--c:' + e.color + '" aria-checked="false">' +
      '<span class="intent__dot" aria-hidden="true"></span>' + S.esc(e.nombre) + '</button>';
  }).join('');
  intents.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-e]');
    if (b) { current = b.getAttribute('data-e'); renderEnergia(); }
  });
  intents.addEventListener('keydown', function (ev) {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].indexOf(ev.key) < 0) return;
    ev.preventDefault();
    var ids = window.LUZ_ENERGIAS.map(function (e) { return e.id; });
    var i = ids.indexOf(current) + (ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : -1);
    current = ids[(i + ids.length) % ids.length];
    renderEnergia();
    qs('[data-e="' + current + '"]', intents).focus();
  });

  function renderEnergia() {
    var e = window.LUZ_ENERGIAS.filter(function (x) { return x.id === current; })[0];
    intents.querySelectorAll('[data-e]').forEach(function (b) {
      var on = b.getAttribute('data-e') === current;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    document.documentElement.style.setProperty('--flame', e.color);
    qs('[data-frase]').textContent = e.nombre + ': ' + e.frase;
    var flame = qs('[data-flame]');
    flame.classList.remove('is-lit'); void flame.offsetWidth; flame.classList.add('is-lit');
    if (S.state.mode === 'loading') { energiaGrid.innerHTML = ''; return; }
    var prods = S.state.productos.filter(function (p) { return p.energia.indexOf(current) >= 0; }).slice(0, 6);
    var cons = window.LUZ_CONSULTAS.filter(function (c) { return c.energia.indexOf(current) >= 0; }).slice(0, Math.max(0, 8 - prods.length)).slice(0, 2);
    var html = prods.map(function (p) { return S.card(p, { compact: true }); }).join('') + cons.map(S.consultaCard).join('');
    energiaGrid.innerHTML = html || '<p class="status__msg">Por ahora no hay productos para esta intención. Consultá por WhatsApp.</p>';
    qs('[data-energia-link]').href = 'tienda/?energia=' + current;
  }

  /* ---------- catálogo listo ---------- */
  var statusEl = qs('[data-status]');
  var dest = qs('[data-destacados]');
  S.on(function (st) {
    if (st._painted === st.mode + st.productos.length) return;
    st._painted = st.mode + st.productos.length;

    if (st.mode === 'loading') {
      statusEl.innerHTML = '<p class="status__msg">Cargando productos…</p>';
      dest.innerHTML = '<div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div>';
      return;
    }
    statusEl.innerHTML = '';
    if (st.mode === 'error') {
      statusEl.innerHTML = '<p class="status__msg">No pudimos cargar la tienda en este momento. <button type="button" class="linkbtn" data-retry>Reintentar</button> o pedí por <a href="' + S.waLink('Hola Luz Buena! Quiero hacer un pedido.') + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';
      dest.innerHTML = '';
    } else if (st.mode === 'empty') {
      statusEl.innerHTML = '<p class="status__msg">Todavía no hay productos cargados en la tienda. Mientras tanto, pedí por <a href="' + S.waLink('Hola Luz Buena! Quiero hacer un pedido.') + '" target="_blank" rel="noopener">WhatsApp</a>.</p>';
      dest.innerHTML = '';
    } else {
      var d = st.productos.filter(function (p) { return p.destacado; });
      d = d.concat(st.productos.filter(function (p) { return !p.destacado && !p.madre && d.indexOf(p) < 0; }));
      dest.innerHTML = d.slice(0, 8).map(function (p) { return S.card(p); }).join('');
    }

    /* "desde $" del estante */
    document.querySelectorAll('[data-desde]').forEach(function (el) {
      var cat = el.getAttribute('data-desde');
      var precios = st.productos.filter(function (p) { return p.categoria === cat; }).map(function (p) { return p.precio; });
      el.textContent = precios.length ? 'desde ' + S.money(Math.min.apply(null, precios)) : 'ver productos';
    });

    /* Día de la Madre */
    var mp = st.productos.filter(function (p) { return p.madre; });
    if (showMadre && mp.length) {
      madre.hidden = false;
      qs('[data-madre-count]').textContent = dias === 0 ? 'Es hoy: ¡pedí tu regalo ya!' : dias === 1 ? 'Falta 1 día' : 'Faltan ' + dias + ' días';
      qs('[data-madre-row]').innerHTML = mp.map(function (p) { return S.card(p, { compact: true, noMadre: true }); }).join('');
    } else madre.hidden = true;

    renderEnergia();
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-retry]')) S.load(); });

  /* accesos rápidos de souvenirs */
  document.querySelectorAll('[data-quick]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = S.state.productos.filter(function (x) { return x.localId === b.getAttribute('data-quick'); })[0];
      if (!p) { location.href = 'tienda/?cat=souvenirs'; return; }
      S.add(p.id, p.opciones && p.opciones.length === 1 ? p.opciones[0] : '', 1);
      var t = b.textContent; b.textContent = 'Sumado al pedido ✓';
      setTimeout(function () { b.textContent = t; }, 1500);
    });
  });

  /* ---------- aparición ---------- */
  if (!QA && 'IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.sec-head, .energia__intro, .eventos__card, .steps li, .faq, .cierre > *').forEach(function (el) {
      el.classList.add('rv'); io.observe(el);
    });
  }
})();
