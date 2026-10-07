/* Coaching Educativo | Víctor Aguilar — demo TuPaginaYa */
(function () {
  'use strict';

  // Número de WhatsApp en formato internacional sin "+" (ej. 5491123456789).
  // Pendiente: el cliente todavía no lo pasó. Vacío = WhatsApp abre para elegir el contacto.
  var WA_NUMBER = '';

  var MSG_INFO = 'Hola Víctor, vi tu página y quiero más información sobre el coaching educativo.';
  var MSG_AGENDAR = 'Hola Víctor, quiero agendar una conversación.';

  function waUrl(text) {
    var base = WA_NUMBER ? 'https://wa.me/' + WA_NUMBER : 'https://wa.me/';
    return base + '?text=' + encodeURIComponent(text);
  }

  var root = document.documentElement;
  root.classList.add('js');
  var params = new URLSearchParams(location.search);
  var QA = params.has('qa');
  if (QA) root.classList.add('qa');

  /* ---------- Links directos a WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var msg = a.getAttribute('data-wa') === 'agendar' ? MSG_AGENDAR : MSG_INFO;
    a.href = waUrl(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    dock.classList.toggle('show', y > hero.offsetHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Título del hero: que nunca se corte (letra grande en Android) ---------- */
  var title = document.querySelector('.hero-title');
  function fitTitle() {
    title.style.fontSize = '';
    var max = title.parentElement.clientWidth;
    var widest = 0;
    title.querySelectorAll('.ln').forEach(function (ln) { widest = Math.max(widest, ln.scrollWidth); });
    if (widest > max) {
      var size = parseFloat(getComputedStyle(title).fontSize);
      title.style.fontSize = Math.floor(size * (max / widest) * 0.98) + 'px';
    }
  }
  fitTitle();
  window.addEventListener('resize', fitTitle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);

  /* ---------- Video del hero ---------- */
  var video = document.getElementById('heroVideo');
  var toggle = document.getElementById('videoToggle');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var userPaused = reduce.matches || params.has('lite');

  function setPaused(p) {
    toggle.setAttribute('aria-pressed', String(p));
    toggle.setAttribute('aria-label', p ? 'Reproducir video' : 'Pausar video');
  }
  function tryPlay() {
    if (userPaused) return;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (params.has('lite')) {
    video.removeAttribute('autoplay');
    video.preload = 'none';
    video.querySelector('source').removeAttribute('src');
  }
  if (userPaused) { video.pause(); setPaused(true); } else { setPaused(false); }
  toggle.addEventListener('click', function () {
    userPaused = !video.paused ? true : false;
    if (userPaused) video.pause(); else tryPlay();
    setPaused(userPaused);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) tryPlay(); else video.pause();
      });
    }, { threshold: 0.1 }).observe(video);
  }
  document.addEventListener('touchstart', tryPlay, { once: true, passive: true });

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var route = document.getElementById('route');
  var line = document.getElementById('routeLine');
  route.style.setProperty('--len', Math.ceil(line.getTotalLength()) + 1);

  if (QA || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    route.classList.add('drawn');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var siblings = Array.prototype.indexOf.call(en.target.parentElement.children, en.target);
        en.target.style.transitionDelay = Math.min(siblings, 4) * 90 + 'ms';
        en.target.classList.add('in');
        if (en.target === route) route.classList.add('drawn');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Metodología: elegir etapa ---------- */
  var STEP_NAME = { ser: 'Ser', hacer: 'Hacer', impactar: 'Impactar' };
  var currentStep = 'ser';
  var goStep = document.getElementById('methodGoStep');

  function selectStep(step) {
    currentStep = step;
    document.querySelectorAll('.node, .step').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-step') === step);
    });
    document.querySelectorAll('.node').forEach(function (n) {
      n.setAttribute('aria-pressed', String(n.getAttribute('data-step') === step));
    });
    goStep.textContent = STEP_NAME[step];
  }
  document.querySelectorAll('.node, .step').forEach(function (el) {
    el.addEventListener('click', function () { selectStep(el.getAttribute('data-step')); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectStep(el.getAttribute('data-step')); }
    });
  });
  selectStep('ser');
  document.getElementById('methodGo').addEventListener('click', function () {
    setRadio('etapa', currentStep);
    update();
  });

  /* ---------- Planificador de la conversación ---------- */
  var form = document.getElementById('planner');
  var preview = document.getElementById('preview');
  var hint = document.getElementById('hint');
  var formato = document.getElementById('formato');
  var nombre = document.getElementById('nombre');
  var detalle = document.getElementById('detalle');

  var AREA_TXT = {
    personal: 'mi vida personal',
    liderazgo: 'mi liderazgo',
    proyecto: 'un proyecto'
  };
  var ETAPA_TXT = {
    ser: 'Hoy no tengo claro qué quiero o hacia dónde ir (SER).',
    hacer: 'Sé lo que quiero, pero me cuesta pasar a la acción (HACER).',
    impactar: 'Quiero potenciar a mi equipo o a otras personas (IMPACTAR).'
  };

  function getRadio(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function setRadio(name, value) {
    var el = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (el) el.checked = true;
  }

  function buildMessage() {
    var area = getRadio('area');
    var etapa = getRadio('etapa');
    var n = nombre.value.trim();
    var lines = [];
    lines.push('Hola Víctor' + (n ? ', soy ' + n : '') + '. Quiero agendar una conversación.');
    if (area) lines.push('Quiero avanzar en ' + AREA_TXT[area] + '.');
    if (etapa) lines.push(ETAPA_TXT[etapa]);
    if (formato.value) lines.push('Me interesa: ' + formato.value + '.');
    var d = detalle.value.trim();
    if (d) lines.push(d);
    return lines.join('\n');
  }

  function update() {
    preview.textContent = buildMessage();
    if (getRadio('area') && getRadio('etapa')) hint.textContent = '';
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!getRadio('area') || !getRadio('etapa')) {
      hint.textContent = !getRadio('area')
        ? 'Elegí dónde querés avanzar para armar el mensaje.'
        : 'Elegí cómo te sentís hoy para armar el mensaje.';
      var first = form.querySelector(!getRadio('area') ? 'input[name="area"]' : 'input[name="etapa"]');
      first.focus();
      return;
    }
    hint.textContent = '';
    window.open(waUrl(buildMessage()), '_blank', 'noopener');
  });

  // Atajos desde "Cómo te ayudo" y "Programas"
  document.querySelectorAll('[data-area], [data-etapa], [data-formato]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.dataset.area) setRadio('area', a.dataset.area);
      if (a.dataset.etapa) { setRadio('etapa', a.dataset.etapa); selectStep(a.dataset.etapa); }
      if (a.dataset.formato) formato.value = a.dataset.formato;
      update();
    });
  });

  // Preselección por URL: ?etapa=hacer&area=liderazgo
  if (STEP_NAME[params.get('etapa')]) { setRadio('etapa', params.get('etapa')); selectStep(params.get('etapa')); }
  if (AREA_TXT[params.get('area')]) setRadio('area', params.get('area'));
  update();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
