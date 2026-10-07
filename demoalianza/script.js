/* Alianza — Consultora & Gestoría Integral */
(function () {
  'use strict';

  var WA = '5492352537094';
  var params = new URLSearchParams(location.search);
  if (params.has('qa')) document.documentElement.classList.add('qa');

  function waUrl(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }

  // Links de WhatsApp con mensaje propio
  document.querySelectorAll('.wa-link[data-msg]').forEach(function (a) { a.href = waUrl(a.dataset.msg); });

  // Año
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Nav: sombra al scrollear + menú móvil
  var nav = document.querySelector('.nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); }
  burger.addEventListener('click', function () {
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Video del hero: pausa manual y fuera de vista
  var video = document.getElementById('heroVideo');
  var toggle = document.getElementById('videoToggle');
  var userPaused = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || params.has('lite')) { video.removeAttribute('autoplay'); video.pause(); userPaused = true; toggle.setAttribute('aria-pressed', 'true'); toggle.setAttribute('aria-label', 'Reproducir video'); }
  if (params.has('lite')) { video.preload = 'none'; }
  function tryPlay() { if (!userPaused) video.play().catch(function () {}); }
  if (video.readyState >= 2) tryPlay(); else video.addEventListener('loadeddata', tryPlay, { once: true });
  toggle.addEventListener('click', function () {
    if (video.paused) { video.play().catch(function () {}); userPaused = false; }
    else { video.pause(); userPaused = true; }
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', userPaused ? 'Reproducir video' : 'Pausar video');
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (userPaused) return;
        if (en.isIntersecting) video.play().catch(function () {}); else video.pause();
      });
    }, { threshold: 0.05 }).observe(video);
  }

  // Reveal escalonado
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !params.has('qa')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) {
      var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(sibs, 5) * 0.08 + 's');
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Carpeta de trámite ---------- */
  var AREAS = [
    { id: 'admin', icon: 'i-doc', name: 'Gestiones administrativas', tab: 'Administrativo' },
    { id: 'auto', icon: 'i-car', name: 'Automotor', tab: 'Automotor' },
    { id: 'inmo', icon: 'i-house', name: 'Inmobiliario', tab: 'Inmobiliario' },
    { id: 'prev', icon: 'i-people', name: 'Previsional y jubilaciones', tab: 'Previsional' },
    { id: 'rrhh', icon: 'i-search', name: 'Recursos humanos', tab: 'RR.HH.' },
    { id: 'juri', icon: 'i-scale', name: 'Área jurídica', tab: 'Jurídico' }
  ];
  var LABELS = {
    quien: { persona: 'Persona / familia', empresa: 'Empresa' },
    modo: { presencial: 'Presencial', online: 'Online', indistinto: 'Presencial u online' },
    papeles: { tengo: 'La tengo completa', parte: 'Tengo una parte', nose: 'No sé qué necesito' }
  };
  var state = { area: '', quien: '', modo: '', papeles: '' };

  var areaWrap = document.getElementById('areaChips');
  AREAS.forEach(function (a) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.value = a.id;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<svg aria-hidden="true"><use href="#' + a.icon + '"/></svg><span></span>';
    b.querySelector('span').textContent = a.name;
    areaWrap.appendChild(b);
  });
  areaWrap.dataset.group = 'area';

  function setChoice(group, value) {
    state[group] = state[group] === value && group !== 'area' ? '' : value;
    document.querySelectorAll('[data-group="' + group + '"] .chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.dataset.value === state[group]));
    });
    render();
  }
  document.querySelectorAll('[data-group]').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) setChoice(g.dataset.group, chip.dataset.value);
    });
  });

  var fNombre = document.getElementById('fNombre');
  var fLocalidad = document.getElementById('fLocalidad');
  var fDetalle = document.getElementById('fDetalle');
  [fNombre, fLocalidad, fDetalle].forEach(function (inp) { inp.addEventListener('input', render); });

  var el = function (id) { return document.getElementById(id); };
  var prev = {};
  function put(id, text, placeholder) {
    var dd = el(id);
    var val = text || placeholder;
    if (dd.textContent !== val) {
      dd.textContent = val;
      dd.classList.toggle('empty', !text);
      if (text && prev[id] !== text) { dd.classList.remove('pop'); void dd.offsetWidth; dd.classList.add('pop'); }
    }
    prev[id] = text;
  }

  function areaObj() { return AREAS.filter(function (a) { return a.id === state.area; })[0]; }

  function buildMessage() {
    var a = areaObj();
    var nombre = fNombre.value.trim();
    var lines = ['Hola Karen' + (nombre ? ', soy ' + nombre : '') + '. Te escribo desde la web de Alianza.', ''];
    lines.push('Área: ' + (a ? a.name : 'a definir'));
    if (state.quien) lines.push('Para: ' + LABELS.quien[state.quien]);
    if (state.modo) lines.push('Atención: ' + LABELS.modo[state.modo]);
    if (state.papeles) lines.push('Documentación: ' + LABELS.papeles[state.papeles]);
    var loc = fLocalidad.value.trim();
    if (loc) lines.push('Localidad: ' + loc);
    var det = fDetalle.value.trim();
    if (det) { lines.push(''); lines.push('Lo que necesito: ' + det); }
    lines.push('');
    lines.push('¿Me orientás con los próximos pasos?');
    return lines.join('\n');
  }

  var send = el('sendWa');
  function render() {
    var a = areaObj();
    el('lgTab').querySelector('span').textContent = a ? a.tab : 'sin área';
    put('lgArea', a ? a.name : '', 'Elegí un área');
    put('lgQuien', state.quien ? LABELS.quien[state.quien] : '', '—');
    put('lgModo', state.modo ? LABELS.modo[state.modo] : '', '—');
    put('lgPapeles', state.papeles ? LABELS.papeles[state.papeles] : '', '—');
    put('lgNombre', fNombre.value.trim(), '—');
    put('lgLocalidad', fLocalidad.value.trim(), '—');
    put('lgDetalle', fDetalle.value.trim(), '—');

    var done = [state.area, state.quien, state.modo, state.papeles, fDetalle.value.trim()].filter(Boolean).length;
    el('lgBar').style.width = (done / 5 * 100) + '%';
    var ready = !!state.area;
    var sealed = ready && state.quien && state.modo;
    el('sello').classList.toggle('on', !!sealed);
    el('lgNote').textContent = !ready ? 'Completá al menos el área para enviar.'
      : sealed ? 'Carpeta lista. Karen la recibe con todo lo que marcaste.'
      : 'Ya se puede enviar. Si sumás para quién y cómo te atendemos, mejor.';
    send.setAttribute('aria-disabled', String(!ready));
    var msg = buildMessage();
    send.href = waUrl(msg);
    el('msgPreview').textContent = msg;
    el('cbArea').textContent = a ? 'Legajo · ' + a.tab : 'Legajo';
    el('cbFill').textContent = done + ' de 5 pasos' + (sealed ? ' · lista' : '');
    el('cbSend').href = send.href;
    updateBar();
  }

  // Barra fija en móvil: aparece mientras se completa el formulario y el legajo no se ve
  var bar = el('carpetaBar');
  var formIn = false, legajoIn = false;
  function updateBar() {
    var on = formIn && !legajoIn && !!state.area;
    bar.classList.toggle('on', on);
    bar.setAttribute('aria-hidden', String(!on));
    el('cbSend').tabIndex = on ? 0 : -1;
    var f = document.querySelector('.wa-float');
    if (f) f.classList.toggle('below-bar', on);
  }
  send.addEventListener('click', function (e) {
    if (send.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      el('lgNote').textContent = 'Primero elegí sobre qué es tu trámite (paso 1).';
      areaWrap.querySelector('.chip').focus();
    }
  });

  // Atajos desde el hero y las carpetas: preseleccionan el área
  document.querySelectorAll('a[href="#carpeta"][data-area]').forEach(function (a) {
    a.addEventListener('click', function () {
      setChoice('area', a.dataset.area);
      var sec = document.getElementById('carpeta');
      sec.classList.remove('flash'); void sec.offsetWidth; sec.classList.add('flash');
    });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { en.forEach(function (e) { formIn = e.isIntersecting; }); updateBar(); }, { rootMargin: '0px 0px -30% 0px' }).observe(el('consulta'));
    new IntersectionObserver(function (en) { en.forEach(function (e) { legajoIn = e.isIntersecting; }); updateBar(); }, { threshold: 0.25 }).observe(el('legajo'));
  }

  var qArea = params.get('area');
  if (qArea && AREAS.some(function (a) { return a.id === qArea; })) state.area = qArea;
  ['quien', 'modo', 'papeles'].forEach(function (k) { var v = params.get(k); if (v && LABELS[k][v]) state[k] = v; });
  ['area', 'quien', 'modo', 'papeles'].forEach(function (k) {
    document.querySelectorAll('[data-group="' + k + '"] .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.value === state[k])); });
  });
  render();

  // Ocultar el botón flotante cuando el envío de la carpeta está a la vista
  var floatBtn = document.querySelector('.wa-float');
  if ('IntersectionObserver' in window) {
    var hideFor = [document.querySelector('.cierre'), send, document.querySelector('.hero-ctas')];
    var visible = new Set();
    var floatObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      floatBtn.classList.toggle('hide', visible.size > 0);
    });
    hideFor.forEach(function (t) { if (t) floatObs.observe(t); });
  }

  // Lightbox del folleto
  var lb = el('lightbox');
  el('folletoBtn').addEventListener('click', function () { if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); });
  el('lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
})();
