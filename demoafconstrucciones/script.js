/* AF Construcciones — piscinas y albañilería */
(function () {
  'use strict';

  var WA_NUMBER = '5491153781424';
  var params = new URLSearchParams(location.search);
  var root = document.documentElement;
  if (params.has('qa')) root.classList.add('qa');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- Links de WhatsApp genéricos ---------- */
  var WA_MSG = {
    nav: 'Hola Ariel! Vi la web de AF Construcciones y quería hacerte una consulta.',
    hero: 'Hola Ariel! Vi la web de AF Construcciones y quiero pedir un presupuesto.',
    cierre: 'Hola Ariel! Quiero arrancar una obra y pedirte presupuesto. Te cuento:',
    dock: 'Hola Ariel! Vi la web de AF Construcciones y quería hacerte una consulta.'
  };
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(WA_MSG[a.getAttribute('data-wa')] || WA_MSG.nav);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !root.classList.contains('qa')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = Array.prototype.slice.call(e.target.parentElement.querySelectorAll(':scope > .reveal'));
        e.target.style.transitionDelay = (Math.max(0, sibs.indexOf(e.target)) * 90) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Scroll: nav sólida, regla de profundidad, dock ---------- */
  var depth = document.querySelector('.depth');
  var depthWater = document.getElementById('depthWater');
  var depthRead = document.getElementById('depthRead');
  var darkSections = document.querySelectorAll('.cut, .end');
  var dock = document.getElementById('dock');
  var hero = document.getElementById('inicio');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 30);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    depthWater.style.height = (p * 100) + '%';
    depthRead.textContent = (p * 1.8).toFixed(2).replace('.', ',') + ' m';

    var mid = window.innerHeight / 2;
    var dark = false;
    darkSections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) dark = true;
    });
    depth.classList.toggle('is-dark', dark);

    var hb = hero.getBoundingClientRect().bottom;
    var endR = document.querySelector('.end').getBoundingClientRect();
    dock.classList.toggle('is-on', hb < 80 && endR.top > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Hero: rótulo sincronizado con el video ---------- */
  var video = document.getElementById('heroVideo');
  var poolTag = document.getElementById('poolTag');
  var poolStage = document.getElementById('poolStage');
  var poolBar = document.getElementById('poolBar');
  var WATER_AT = 9.2; // segundo en que el montaje pasa de obra a agua
  var lastWater = null;
  function syncVideo() {
    var d = video.duration || 15.8;
    var t = video.currentTime;
    var water = t >= WATER_AT;
    if (water !== lastWater) {
      lastWater = water;
      poolStage.textContent = water ? 'Terminada · primer chapuzón' : 'En obra · revestimiento';
      poolTag.classList.toggle('is-water', water);
    }
    poolBar.style.width = Math.min(100, (t / d) * 100) + '%';
  }
  video.addEventListener('timeupdate', syncVideo);
  if (reduced) { video.removeAttribute('autoplay'); video.pause(); }
  else {
    var tryPlay = function () {
      if (!video.paused) return;
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function () {});
    };
    tryPlay();
    video.addEventListener('canplay', tryPlay, { once: true });
    ['touchstart', 'scroll', 'pointerdown'].forEach(function (ev) {
      window.addEventListener(ev, tryPlay, { once: true, passive: true });
    });
  }

  /* ---------- Signature: la pileta en corte ---------- */
  var STAGES = [
    { t: 'Replanteo y excavación', s: 'Excavación',
      d: 'Se marca la forma en el terreno y se excava el pozo con la profundidad y las pendientes que va a tener la pileta.',
      f: '¿Estás pensando una nueva? Contanos cómo se entra al patio: define cómo se hace la excavación.',
      leg: 'Estacas de replanteo + pozo excavado',
      preset: { tipo: 'nueva' } },
    { t: 'Armadura de hierro', s: 'Armadura',
      d: 'Se arma la estructura de hierro de fondo, paredes y escalera. Es el esqueleto de la pileta.',
      f: 'No se ve, pero de esto depende que la pileta no se fisure con los años.',
      leg: 'Hierros en fondo, escalera y paredes',
      preset: { tipo: 'nueva' } },
    { t: 'Hormigón: el casco', s: 'Hormigón',
      d: 'Se llena con hormigón y queda formado el casco, que aguanta el peso del agua y el empuje de la tierra.',
      f: '¿Ves fisuras o grietas? Conviene revisarlas antes de cualquier terminación.',
      leg: 'Casco de hormigón',
      preset: { tipo: 'arreglo', key: 'problema', v: 'fisuras o grietas' } },
    { t: 'Revoque e impermeabilización', s: 'Impermeable',
      d: 'Revoques y capas que sellan el casco para que el agua se quede donde tiene que estar.',
      f: '¿Pierde agua? Es lo primero que se revisa. Mirá la prueba del balde en las preguntas.',
      leg: 'Revoque + capa impermeable',
      preset: { tipo: 'arreglo', key: 'problema', v: 'pierde agua' } },
    { t: 'Revestimiento', s: 'Revestimiento',
      d: 'La terminación interior: lo que ves y tocás cuando te metés. El tipo y el color se definen con vos.',
      f: '¿Está gastado, manchado o descascarado? Se puede renovar sin hacer la pileta de nuevo.',
      leg: 'Revestimiento interior',
      preset: { tipo: 'arreglo', key: 'problema', v: 'revestimiento gastado o descascarado' } },
    { t: 'Borde y solárium', s: 'Borde',
      d: 'Bordes alrededor de la pileta y el piso que la rodea, para pisar seguro y que el agua escurra.',
      f: '¿Bordes flojos, rotos o con juntas abiertas? Se cambian las piezas y se rehacen las juntas.',
      leg: 'Bordes perimetrales + solárium',
      preset: { tipo: 'arreglo', key: 'problema', v: 'bordes rotos o flojos' } },
    { t: 'Cañerías y llenado', s: 'Llenado',
      d: 'Se conectan las cañerías de la obra y llega el momento más esperado: el primer llenado. Listo el chapuzón.',
      f: 'El equipo de filtrado y lo que incluye cada obra se charla con Ariel en la consulta.',
      leg: 'Cañerías al filtro + agua',
      preset: { tipo: 'nueva' } }
  ];
  var stepsEl = document.getElementById('steps');
  var layers = document.querySelectorAll('#cutSvg .ly');
  var waterRect = document.getElementById('waterRect');
  var infoN = document.getElementById('infoN');
  var infoT = document.getElementById('infoT');
  var infoD = document.getElementById('infoD');
  var infoF = document.getElementById('infoF');
  var infoBtn = document.getElementById('infoBtn');
  var legend = document.getElementById('cutLegend');
  var current = 0;
  var autoTimer = null;
  var userTouched = false;

  STAGES.forEach(function (s, i) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'step';
    b.setAttribute('role', 'tab');
    b.id = 'step-' + i;
    b.innerHTML = '<span class="step__n">' + String(i + 1).padStart(2, '0') + '</span><span class="step__t">' + s.s + '</span>';
    b.setAttribute('aria-label', 'Etapa ' + (i + 1) + ': ' + s.t);
    b.addEventListener('click', function () { userTouched = true; stopAuto(); setStage(i); });
    b.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = Math.min(STAGES.length - 1, i + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = Math.max(0, i - 1);
      if (n !== null) { e.preventDefault(); userTouched = true; stopAuto(); setStage(n); document.getElementById('step-' + n).focus(); }
    });
    li.appendChild(b);
    stepsEl.appendChild(li);
  });

  function setStage(i) {
    current = i;
    // capas: 0 estacas, 1 pozo, 2 hierro, 3 hormigón, 4 revoque, 5 revestimiento, 6 borde, 7 agua
    layers.forEach(function (ly) {
      var k = parseInt(ly.className.baseVal.match(/ly--(\d)/)[1], 10);
      var on = k === 0 ? i <= 1 : k <= i + 1;
      ly.classList.toggle('is-on', on);
    });
    waterRect.style.y = (i === STAGES.length - 1) ? '118px' : '340px';
    waterRect.setAttribute('y', i === STAGES.length - 1 ? '118' : '340');
    document.querySelectorAll('.step').forEach(function (b, j) {
      b.classList.toggle('is-on', j === i);
      b.classList.toggle('is-done', j < i);
      b.setAttribute('aria-selected', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
    var s = STAGES[i];
    infoN.textContent = 'Etapa ' + (i + 1) + ' de ' + STAGES.length;
    infoT.textContent = s.t;
    infoD.textContent = s.d;
    infoF.textContent = s.f;
    legend.textContent = '› ' + s.leg;
    infoBtn.textContent = s.preset.tipo === 'arreglo' ? 'Consultar por mi pileta' : 'Consultar por una pileta nueva';
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function startAuto() {
    if (userTouched || autoTimer || reduced) return;
    setStage(0);
    autoTimer = setInterval(function () {
      if (current >= STAGES.length - 1) { stopAuto(); return; }
      setStage(current + 1);
    }, 2300);
  }
  var cutSvg = document.getElementById('cutSvg');
  function fitCut() {
    cutSvg.setAttribute('viewBox', window.innerWidth < 600 ? '52 58 718 272' : '0 0 800 340');
  }
  fitCut();
  window.addEventListener('resize', fitCut);
  setStage(root.classList.contains('qa') ? STAGES.length - 1 : 0);
  if ('IntersectionObserver' in window && !root.classList.contains('qa')) {
    var cutIo = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { startAuto(); cutIo.disconnect(); } });
    }, { threshold: 0.45 });
    cutIo.observe(document.getElementById('cutSvg'));
  }
  infoBtn.addEventListener('click', function () {
    var p = STAGES[current].preset;
    setTipo(p.tipo);
    if (p.key) selectChip(p.key, p.v, true);
    if (p.tipo === 'nueva') addExtra('Vi en la web la etapa "' + STAGES[current].t + '" y quiero saber más.');
    document.getElementById('consulta').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- Armador de consulta ---------- */
  var state = { tipo: null, tam: [], ideas: [], acceso: [], problema: [], trabajo: [], cuando: [] };
  var TIPO_TXT = { nueva: 'Pileta nueva', arreglo: 'Arreglar mi pileta', albanileria: 'Albañilería' };
  var tipoBtns = document.querySelectorAll('#tipo .opt');
  var branches = document.querySelectorAll('.branch');
  var rest = document.querySelector('.rest');
  var zona = document.getElementById('zona');
  var nombre = document.getElementById('nombre');
  var extra = document.getElementById('extra');
  var fotos = document.getElementById('fotos');
  var ticket = document.getElementById('ticket');
  var send = document.getElementById('send');
  var dockTxt = document.getElementById('dockTxt');
  var dockBtn = document.getElementById('dockBtn');

  function setTipo(v) {
    state.tipo = v;
    tipoBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
    branches.forEach(function (f) { f.hidden = f.dataset.branch !== v; });
    rest.hidden = !v;
    render();
  }
  tipoBtns.forEach(function (b) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { setTipo(b.dataset.v); });
  });

  function selectChip(key, v, force) {
    var group = document.querySelector('.chips[data-key="' + key + '"]');
    if (!group) return;
    var single = group.hasAttribute('data-single');
    var list = state[key];
    var idx = list.indexOf(v);
    if (single) state[key] = (idx > -1 && !force) ? [] : [v];
    else if (idx > -1 && !force) list.splice(idx, 1);
    else if (idx === -1) list.push(v);
    group.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(state[key].indexOf(c.dataset.v) > -1));
    });
    render();
  }
  document.querySelectorAll('.chips').forEach(function (g) {
    g.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', 'false');
      c.addEventListener('click', function () { selectChip(g.dataset.key, c.dataset.v, false); });
    });
  });
  function addExtra(txt) {
    if (extra.value.indexOf(txt) === -1) extra.value = (extra.value ? extra.value + ' ' : '') + txt;
    render();
  }
  [zona, nombre, extra, fotos].forEach(function (el) { el.addEventListener('input', render); el.addEventListener('change', render); });

  document.querySelectorAll('[data-preset]').forEach(function (a) {
    a.addEventListener('click', function () { setTipo(a.dataset.preset); });
  });

  function rows() {
    var r = [];
    if (!state.tipo) return r;
    r.push(['Quiero', TIPO_TXT[state.tipo]]);
    if (state.tipo === 'nueva') {
      if (state.tam.length) r.push(['Tamaño', state.tam[0]]);
      if (state.ideas.length) r.push(['Ideas', state.ideas.join(', ')]);
      if (state.acceso.length) r.push(['Acceso', state.acceso[0]]);
    }
    if (state.tipo === 'arreglo' && state.problema.length) r.push(['Qué le pasa', state.problema.join(', ')]);
    if (state.tipo === 'albanileria' && state.trabajo.length) r.push(['Trabajo', state.trabajo.join(', ')]);
    if (zona.value.trim()) r.push(['Zona', zona.value.trim()]);
    if (state.cuando.length) r.push(['Para cuándo', state.cuando[0]]);
    if (extra.value.trim()) r.push(['Detalle', extra.value.trim()]);
    if (fotos.checked) r.push(['Fotos', 'te las mando por acá']);
    if (nombre.value.trim()) r.push(['Nombre', nombre.value.trim()]);
    return r;
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function message(r) {
    var lines = ['Hola Ariel! Te escribo desde la web de AF Construcciones.', ''];
    r.forEach(function (x) {
      if (x[0] === 'Fotos') return;
      if (x[0] === 'Nombre') return;
      lines.push('*' + x[0] + ':* ' + x[1]);
    });
    if (fotos.checked) { lines.push(''); lines.push('Te mando fotos del lugar por acá.'); }
    if (nombre.value.trim()) { lines.push(''); lines.push('Soy ' + nombre.value.trim() + '.'); }
    return lines.join('\n');
  }

  function render() {
    var r = rows();
    if (!r.length) {
      ticket.innerHTML = '<div class="ticket__empty">Elegí qué querés hacer y tu consulta se va armando acá.</div>';
      send.setAttribute('aria-disabled', 'true');
      send.href = '#';
      dockTxt.textContent = 'Contanos tu obra';
      dockBtn.href = waLink(WA_MSG.dock);
      return;
    }
    ticket.innerHTML = r.map(function (x) {
      return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>';
    }).join('');
    var href = waLink(message(r));
    send.href = href;
    send.target = '_blank';
    send.rel = 'noopener';
    send.removeAttribute('aria-disabled');
    dockTxt.textContent = TIPO_TXT[state.tipo] + (zona.value.trim() ? ' · ' + zona.value.trim() : '');
    dockBtn.href = href;
  }
  send.addEventListener('click', function (e) { if (send.getAttribute('aria-disabled') === 'true') e.preventDefault(); });

  var preTipo = params.get('tipo');
  if (preTipo && TIPO_TXT[preTipo]) setTipo(preTipo); else render();
  // expone para QA
  window.__af = { setStage: setStage, setTipo: setTipo, selectChip: selectChip, message: function () { return message(rows()); }, fit: fitText };

  /* ---------- fitText: títulos que no entran con letra grande del sistema ---------- */
  function fitText() {
    document.querySelectorAll('[data-fit], .phone').forEach(function (el) {
      el.style.fontSize = '';
      var kids = el.classList.contains('phone') ? el.querySelectorAll('span') : [el];
      kids.forEach(function (k) { k.style.fontSize = ''; });
      var guard = 0;
      var size = parseFloat(getComputedStyle(kids[0]).fontSize);
      function over() {
        if (el.classList.contains('phone')) return el.scrollWidth > el.clientWidth + 1;
        var w = el.clientWidth, bad = false;
        el.querySelectorAll('span').forEach(function (s) { if (s.getBoundingClientRect().width > w + 1) bad = true; });
        return bad || el.scrollWidth > w + 1;
      }
      while (over() && size > 16 && guard++ < 60) {
        size -= 1;
        kids.forEach(function (k) { k.style.fontSize = size + 'px'; });
      }
    });
  }
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
})();
