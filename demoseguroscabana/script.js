(function () {
  'use strict';
  var WA = '5493704346024';
  var KEY = 'cabana-pedido-v1';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calma = root.classList.contains('calma');

  /* ---------- entrada del hero ---------- */
  $$('.hero__copy > *').forEach(function (el, i) { el.style.setProperty('--i', i); });
  var art = $('[data-art]');
  function ready() {
    root.classList.add('is-ready');
    setTimeout(function () { art && art.classList.add('is-lit'); }, 60);
    setTimeout(function () { root.classList.add('entro'); }, 2400);
  }
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 900); })]).then(function () { requestAnimationFrame(ready); });
  } else { setTimeout(ready, 100); }

  /* video según ancho, después de pintar */
  var video = $('.noche__video');
  function loadVideo() {
    if (!video || calma) return;
    var src = window.innerWidth < 760 ? video.dataset.srcSm : video.dataset.srcLg;
    video.src = src;
    video.load();
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (document.readyState === 'complete') setTimeout(loadVideo, 200);
  else window.addEventListener('load', function () { setTimeout(loadVideo, 200); });

  /* ---------- nav ---------- */
  var nav = $('#nav');
  var burger = $('.nav__burger');
  var fab = $('.fab');
  var hero = $('.hero');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 30);
    if (fab && hero) fab.classList.toggle('is-on', y > hero.offsetHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    nav.classList.add('is-solid');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* ---------- abierto / cerrado (hora de Formosa) ---------- */
  function estado() {
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
    var dia = get('weekday'), h = (+get('hour')) % 24, m = +get('minute');
    var min = h * 60 + m;
    var habil = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(dia) > -1;
    var abierto = habil && ((min >= 480 && min < 720) || (min >= 990 && min < 1200));
    var txt;
    if (abierto) txt = 'Oficina abierta · hasta las ' + (min < 720 ? '12' : '20') + ' h';
    else if (habil && min < 480) txt = 'Cerrado · abre a las 8 h';
    else if (habil && min >= 720 && min < 990) txt = 'Cerrado · abre a las 16:30 h';
    else if (dia === 'Fri' || dia === 'Sat' || dia === 'Sun') txt = 'Cerrado · abre el lunes a las 8 h';
    else txt = 'Cerrado · abre mañana a las 8 h';
    $$('[data-estado]').forEach(function (el) {
      el.classList.toggle('is-open', abierto);
      el.querySelector('span').textContent = txt;
    });
  }
  estado();
  setInterval(estado, 60000);

  /* ---------- estrellas ---------- */
  $$('[data-stars]').forEach(function (cv) {
    var ctx = cv.getContext('2d');
    var stars = [], w = 0, h = 0, visible = false, raf = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      w = cv.offsetWidth; h = cv.offsetHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(w * h / 5200);
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h * 0.9, r: Math.random() * 1.2 + 0.25, p: Math.random() * 6.28, s: 0.6 + Math.random() * 1.4 });
      draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = calma ? 0.6 : 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
        ctx.globalAlpha = a * (1 - s.y / h * 0.6);
        ctx.fillStyle = s.r > 1.1 ? '#FFE2A1' : '#DCEBFF';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
    }
    function loop(t) { draw(t); if (visible && !calma) raf = requestAnimationFrame(loop); }
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !calma) raf = requestAnimationFrame(loop);
    }).observe(cv);
    size();
    var to;
    window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(size, 150); });
  });

  /* ---------- parallax suave del hero ---------- */
  var luna = $('.n-luna'), ventana = $('.noche__ventana');
  if (art && !calma) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = window.scrollY, hh = hero.offsetHeight;
        if (y > hh || !root.classList.contains('is-ready')) return;
        var k = y / hh;
        luna.style.transform = 'rotate(' + (k * 28) + 'deg)';
        ventana.style.transform = 'translateY(' + (k * 40) + 'px) scale(' + (1 + k * 0.06) + ')';
      });
    }, { passive: true });
  }

  /* ---------- reveals ---------- */
  var reveals = $$('.reveal');
  reveals.forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--i', sib);
  });
  $$('.cielo li').forEach(function (li, i) { li.style.setProperty('--k', i); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- encender: pedido de cotización ---------- */
  var form = $('#pedido');
  var casitas = $$('.casita');
  var msgEl = $('[data-msg]'), cuentaEl = $('[data-cuenta]'), vacio = $('[data-vacio]'), errorEl = $('[data-error]');
  var ORDEN = ['auto', 'moto', 'hogar', 'comercio', 'personas', 'eco', 'campo', 'otros'];
  var NOMBRE = { auto: 'Auto', moto: 'Moto', hogar: 'Hogar', comercio: 'Comercio y ART', personas: 'Vida y personas', eco: 'Bici y monopatín', campo: 'Campo', otros: 'Viaje y otros' };
  var state = { ramos: [], v: {}, c: {} };

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.ramos) state = { ramos: s.ramos.filter(function (r) { return NOMBRE[r]; }), v: s.v || {}, c: s.c || {} };
    } catch (e) {}
  }

  function val(n) { return (state.v[n] || '').trim(); }
  function chips(n) { return state.c[n] || []; }
  function linea(label, v) { return v ? '   · ' + label + ': ' + v + '\n' : ''; }

  function mensaje() {
    var t = 'Hola Juan' + (val('nombre') ? ', soy ' + val('nombre') : '') + '. Quiero cotizar:\n\n';
    var ramos = ORDEN.filter(function (r) { return state.ramos.indexOf(r) > -1; });
    ramos.forEach(function (r) {
      t += '🔸 ' + NOMBRE[r] + '\n';
      if (r === 'auto') t += linea('Vehículo', val('auto_modelo')) + linea('Año', val('auto_anio')) + linea('GNC', chips('auto_gnc').join('')) + linea('Uso', chips('auto_uso').join(''));
      if (r === 'moto') t += linea('Moto', val('moto_modelo')) + linea('Año', val('moto_anio')) + linea('Uso', chips('moto_uso').join(''));
      if (r === 'hogar') t += linea('Vivienda', chips('hogar_tipo').join('')) + linea('Soy', chips('hogar_soy').join('')) + linea('Cubrir', chips('hogar_cubrir').join(', '));
      if (r === 'comercio') t += linea('Rubro', val('com_rubro')) + linea('Necesito', chips('com_que').join(', ')) + linea('Personas empleadas', val('com_empleados'));
      if (r === 'personas') t += linea('Consulta', chips('per_que').join(', ')) + linea('Personas', val('per_cuantas'));
      if (r === 'eco') t += linea('Qué es', chips('eco_tipo').join('')) + linea('Modelo', val('eco_modelo'));
      if (r === 'campo') t += linea('Cubrir', val('campo_que')) + linea('Lugar', val('campo_lugar'));
      if (r === 'otros') t += linea('Me interesa', chips('otros_que').join(', ')) + linea('Detalle', val('otros_detalle'));
    });
    if (!ramos.length) t += '(todavía no elegí qué asegurar)\n';
    t += '\n📍 ' + (val('localidad') || 'Formosa');
    if (chips('tiene').length) t += '\n' + chips('tiene')[0];
    t += '\n\nLo armé en la web de Cabaña.';
    return t;
  }

  function render() {
    casitas.forEach(function (b) { b.setAttribute('aria-pressed', state.ramos.indexOf(b.dataset.ramo) > -1 ? 'true' : 'false'); });
    $$('[data-ficha]').forEach(function (f) { f.hidden = state.ramos.indexOf(f.dataset.ficha) < 0; });
    var n = state.ramos.length;
    vacio.hidden = n > 0;
    cuentaEl.textContent = n === 1 ? '1 ventana encendida' : n + ' ventanas encendidas';
    msgEl.textContent = mensaje();
    if (n) errorEl.hidden = true;
  }

  function hydrate() {
    $$('input[name]', form).forEach(function (i) { if (state.v[i.name] != null) i.value = state.v[i.name]; });
    $$('.chips', form).forEach(function (g) {
      var sel = chips(g.dataset.name);
      $$('button', g).forEach(function (b) { b.setAttribute('aria-pressed', sel.indexOf(b.dataset.v) > -1 ? 'true' : 'false'); });
    });
  }

  casitas.forEach(function (b) {
    b.addEventListener('click', function () {
      var r = b.dataset.ramo, i = state.ramos.indexOf(r);
      if (i > -1) state.ramos.splice(i, 1); else state.ramos.push(r);
      render(); save();
      if (i < 0) {
        var f = $('[data-ficha="' + r + '"]');
        var first = f && f.querySelector('input, button');
        if (first && window.innerWidth >= 900) first.focus({ preventScroll: true });
      }
    });
  });

  $$('.chips', form).forEach(function (g) {
    var single = g.hasAttribute('data-single');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var n = g.dataset.name, sel = chips(n).slice(), v = b.dataset.v, i = sel.indexOf(v);
      if (single) sel = i > -1 ? [] : [v];
      else if (i > -1) sel.splice(i, 1); else sel.push(v);
      state.c[n] = sel;
      $$('button', g).forEach(function (x) { x.setAttribute('aria-pressed', sel.indexOf(x.dataset.v) > -1 ? 'true' : 'false'); });
      render(); save();
    });
  });

  form.addEventListener('input', function (e) {
    if (!e.target.name) return;
    state.v[e.target.name] = e.target.value;
    render(); save();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!state.ramos.length) {
      errorEl.hidden = false;
      $('.barrio').scrollIntoView({ behavior: calma ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(mensaje()), '_blank', 'noopener');
  });

  $('[data-reset]').addEventListener('click', function () {
    state = { ramos: [], v: { localidad: 'Formosa' }, c: {} };
    form.reset();
    hydrate(); render(); save();
  });

  load();
  if (state.v.localidad == null) state.v.localidad = 'Formosa';
  hydrate(); render();

  /* ---------- fitText: el título nunca se corta con letra grande ---------- */
  function fit() {
    $$('.fit').forEach(function (el) {
      el.style.fontSize = '';
      var fs = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 18 && guard++ < 60) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
  }
  window.__cabanaFit = fit;
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('load', fit);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 120); });

  var yEl = $('[data-year]');
  if (yEl) yEl.textContent = new Date().getFullYear();
})();
