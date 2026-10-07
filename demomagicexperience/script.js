/* Magic Experience — demo TuPaginaYa */
(() => {
  const WA = '5493537312173';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (params.has('qa')) document.documentElement.classList.add('qa');

  // WhatsApp links with a specific message
  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

  // Header + menu
  const header = $('.header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menu = $('.menu'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); };
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#nav a').forEach((a) => a.addEventListener('click', closeMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Reveal
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  } else reveals.forEach((el) => el.classList.add('in'));

  // Fit one-line titles (Android large font)
  const fitText = () => $$('.fit').forEach((el) => {
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard++ < 60) { size -= 1; el.style.fontSize = size + 'px'; }
  });
  window.__meFit = fitText;
  fitText();
  if (document.fonts) document.fonts.ready.then(fitText);
  addEventListener('load', fitText);
  addEventListener('resize', fitText);

  // Hero video
  const hv = $('#heroVideo'), toggle = $('.vid-toggle');
  let userPaused = false;
  const setToggle = (playing) => {
    toggle.innerHTML = `<svg class="i"><use href="#${playing ? 'pause' : 'play'}"/></svg>`;
    toggle.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video');
    toggle.setAttribute('aria-pressed', String(!playing));
  };
  const tryPlay = () => { const p = hv.play(); if (p && p.catch) p.catch(() => {}); };
  if (reduced) { hv.removeAttribute('autoplay'); hv.pause(); setToggle(false); userPaused = true; }
  toggle.addEventListener('click', () => {
    if (hv.paused) { userPaused = false; tryPlay(); } else { userPaused = true; hv.pause(); }
  });
  hv.addEventListener('play', () => setToggle(true));
  hv.addEventListener('pause', () => setToggle(false));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (!userPaused) tryPlay(); } else hv.pause();
    }, { threshold: .15 }).observe(hv);
  }
  addEventListener('pointerdown', () => { if (!userPaused && hv.paused) tryPlay(); }, { once: true });

  // Off Campus ladder
  $$('.rung').forEach((r) => r.addEventListener('click', () => {
    $$('.rung').forEach((x) => x.setAttribute('aria-selected', String(x === r)));
  }));

  // Reel with sound
  const reel = $('#reelVideo'), frame = $('.reel-frame');
  $('.reel-play').addEventListener('click', () => {
    reel.controls = true; reel.muted = false;
    const p = reel.play(); if (p && p.catch) p.catch(() => {});
    frame.classList.add('playing');
  });
  reel.addEventListener('ended', () => frame.classList.remove('playing'));

  // Mini flashcard
  const mini = $('.mini-card');
  mini.addEventListener('click', () => mini.classList.toggle('flip'));

  /* ---------- Inscripción ---------- */
  const form = $('#enrollForm');
  const slotBox = $('#slotBox');
  const send = $('#enrollSend');
  const msgOut = $('#enrollMsg');
  const missingOut = $('#ticketMissing');
  const MODES = {
    grupal: 'Online grupal (profe nativa)',
    one: 'Online one-to-one',
    'pres-bv': 'Presencial en Bell Ville',
    'pres-sal': 'Presencial en San Antonio de Litín',
    examen: 'Preparación de examen internacional'
  };
  // Últimos horarios grupales publicados en su Instagram (placa "Horarios disponibles")
  const GROUP_SLOTS = {
    A1: ['Jueves 10 a 11 h', 'Jueves 11 a 12 h'],
    A2: ['Jueves 18 a 19 h'],
    B1: ['Jueves 16 a 17 h'],
    B2: ['Miércoles 15 a 16 h'],
    'Conversación': ['Lunes 16 a 17 h', 'Miércoles 18 a 19 h']
  };
  const BANDS = ['Mañana', 'Tarde', 'Noche'];
  const val = (name) => { const el = form.querySelector(`[name="${name}"]:checked`); return el ? el.value : ''; };
  const text = (name) => (form.elements[name] ? form.elements[name].value.trim() : '');
  const chip = (name, value, label = value, small = '') =>
    `<label><input type="radio" name="${name}" value="${value.replace(/"/g, '&quot;')}"><span>${label}${small ? ` <small>${small}</small>` : ''}</span></label>`;

  function renderSlots() {
    const mode = val('mode'), level = val('level');
    const prev = val('slot');
    let html = '';
    if (!mode) {
      html = '<p class="slot-empty">Elegí cómo querés cursar para ver opciones.</p>';
    } else if (mode === 'grupal') {
      html += '<p class="slot-title">Nuevos cursos grupales de octubre</p><div class="chips">' +
        chip('slot', 'A2 General English (octubre)', 'A2 General English', 'nuevo') +
        chip('slot', 'B2 Fluency English (octubre)', 'B2 Fluency English', 'nuevo') + '</div>';
      const lv = GROUP_SLOTS[level] ? [level] : Object.keys(GROUP_SLOTS);
      html += `<p class="slot-title">Últimos horarios grupales publicados${GROUP_SLOTS[level] ? ` · ${level}` : ''}</p><div class="chips">`;
      lv.forEach((l) => GROUP_SLOTS[l].forEach((s) => { html += chip('slot', `${l} · ${s}`, GROUP_SLOTS[level] ? s : `${l} · ${s}`); }));
      html += '</div><p class="slot-note">Horarios del último cronograma publicado. Confirmá cupo y horario de los cursos nuevos por WhatsApp.</p>';
    } else if (mode === 'examen') {
      html += '<div class="chips chips-col">' +
        chip('slot', 'B2 First Preparation (octubre)', 'B2 First Preparation', 'nuevo · octubre') +
        chip('slot', 'B2 First · martes y jueves 19 a 20 h', 'B2 First', 'mar y jue 19 a 20 h') +
        chip('slot', 'C1 Advanced · martes y jueves 20 a 21 h', 'C1 Advanced', 'mar y jue 20 a 21 h') + '</div>' +
        '<p class="slot-note">Los horarios de B2 y C1 son los de la cursada publicada (inicio en julio, 8 meses). Consultá la próxima.</p>';
    } else {
      if (mode === 'one') html += '<p class="slot-title">1-1 Personalized English · ¿qué franja te queda mejor?</p>';
      else html += '<p class="slot-title">¿Qué franja te queda mejor?</p>';
      html += '<div class="chips">' + BANDS.map((b) => chip('slot', b)).join('') + '</div>' +
        `<p class="slot-note">${mode === 'one' ? 'El horario se coordina con vos.' : 'Grupos y horarios presenciales a confirmar por WhatsApp.'}</p>`;
    }
    slotBox.innerHTML = html;
    if (prev) { const keep = $$('input[name="slot"]', slotBox).find((i) => i.value === prev); if (keep) keep.checked = true; }
  }

  function buildMessage() {
    const who = val('who'), mode = val('mode'), level = val('level'), slot = val('slot');
    const lines = ['Hola Magic Experience! ✨ Quiero inscribirme.'];
    if (who) lines.push(`• Para: ${who}`);
    if (mode) lines.push(`• Modalidad: ${MODES[mode]}`);
    if (level) lines.push(`• Nivel: ${level === 'No sé' ? 'No sé mi nivel, necesito ayuda para elegir' : level}`);
    if (slot) lines.push(`• Curso / horario: ${slot}`);
    if (text('name')) lines.push(`• Nombre: ${text('name')}`);
    if (text('age') && !$('.field-age').hidden) lines.push(`• Edad: ${text('age')}`);
    if (text('place')) lines.push(`• Desde: ${text('place')}`);
    if (text('note')) lines.push(`• Comentario: ${text('note')}`);
    lines.push('¿Me pasan cupos, horarios y valores? ¡Gracias!');
    return lines.join('\n');
  }

  function missing() {
    const m = [];
    if (!val('who')) m.push('para quién es');
    if (!val('mode')) m.push('la modalidad');
    if (!text('name')) m.push('tu nombre');
    return m;
  }

  function update() {
    const who = val('who'), mode = val('mode'), level = val('level');
    $('.field-age').hidden = !who || who.startsWith('Para mí');
    $('#quiz').hidden = level !== 'No sé';
    const set = (k, v) => { const dd = $(`[data-t="${k}"]`); dd.textContent = v || '—'; dd.classList.toggle('empty', !v); };
    set('who', who); set('mode', MODES[mode]); set('level', level === 'No sé' ? 'A confirmar' : level);
    set('slot', val('slot')); set('name', text('name')); set('place', text('place'));
    const done = [who, mode, level, val('slot'), text('name')].filter(Boolean).length;
    $$('.ticket-stars svg').forEach((s, i) => s.classList.toggle('on', i < done));
    const msg = buildMessage();
    msgOut.textContent = msg;
    const miss = missing();
    send.href = waLink(msg);
    send.setAttribute('aria-disabled', String(miss.length > 0));
    if (!miss.length) missingOut.textContent = '';
  }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'mode' || e.target.name === 'level') renderSlots();
    update();
  });
  form.addEventListener('input', update);
  form.addEventListener('submit', (e) => e.preventDefault());

  send.addEventListener('click', (e) => {
    const miss = missing();
    if (!miss.length) return;
    e.preventDefault();
    missingOut.textContent = `Falta completar: ${miss.join(', ')}.`;
    const nameIn = form.elements.name;
    nameIn.setAttribute('aria-invalid', String(!text('name')));
    const first = !val('who') ? form.querySelector('[name="who"]') : !val('mode') ? form.querySelector('[name="mode"]') : nameIn;
    first.closest('.step').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => first.focus({ preventScroll: true }), reduced ? 0 : 450);
  });
  form.elements.name.addEventListener('input', () => form.elements.name.removeAttribute('aria-invalid'));

  // Quiz → level
  $$('#quiz [data-q]').forEach((b) => b.addEventListener('click', () => {
    $$('#quiz [data-q]').forEach((x) => x.classList.toggle('on', x === b));
    pick('level', b.dataset.q, false);
  }));

  function pick(name, value, scroll = true) {
    const input = $$(`#enrollForm input[name="${name}"]`).find((i) => i.value === value);
    if (!input) return;
    input.checked = true;
    renderSlots(); update();
    if (scroll) $('#inscripcion').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  $$('.lv').forEach((b) => b.addEventListener('click', () => pick('level', b.dataset.level)));
  $$('.way-go').forEach((b) => b.addEventListener('click', () => pick('mode', b.dataset.mode)));
  $$('[data-pick-mode]').forEach((a) => a.addEventListener('click', () => pick('mode', a.dataset.pickMode, false)));

  // URL presets: ?nivel=B1&modo=examen
  if (params.get('modo')) pick('mode', params.get('modo'), false);
  if (params.get('nivel')) pick('level', params.get('nivel'), false);
  renderSlots(); update();

  /* ---------- Newsletter ---------- */
  const lf = $('#letterForm'), note = $('#letterNote');
  lf.addEventListener('submit', (e) => {
    e.preventDefault();
    const topics = $$('input[name="topic"]:checked', lf).map((i) => i.value);
    const name = lf.elements.lname.value.trim();
    const mail = lf.elements.lmail;
    if (!topics.length) { note.textContent = 'Elegí al menos un tema.'; return; }
    if (mail.value.trim() && !mail.checkValidity()) { note.textContent = 'Revisá el email o dejalo vacío.'; mail.focus(); return; }
    const msg = ['Hola Magic Experience! Quiero recibir las novedades de la Magic Letter.',
      `• Temas: ${topics.join(', ')}`,
      name && `• Nombre: ${name}`,
      mail.value.trim() && `• Email: ${mail.value.trim()}`].filter(Boolean).join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
    note.textContent = 'Listo: se abrió WhatsApp con tu pedido. Envialo para confirmarlo.';
  });
})();
