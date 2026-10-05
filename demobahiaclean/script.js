(() => {
  'use strict';
  const WA = '5492974288931';
  const qa = new URLSearchParams(location.search).has('qa');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const form = document.querySelector('#consultForm');
  const purposeNames = { evento: 'Un evento', obra: 'Una obra', otro: 'Otro espacio' };
  const byId = id => document.getElementById(id);
  const menu = document.querySelector('.menu');
  const nav = byId('nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); nav.classList.toggle('open', open); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  byId('year').textContent = new Date().getFullYear();
  const dateLabel = value => value ? new Intl.DateTimeFormat('es-AR', { day:'numeric', month:'long', year:'numeric' }).format(new Date(value + 'T12:00:00')) : 'A confirmar';
  function update() {
    const purpose = form.querySelector('input[name="purpose"]:checked')?.value || '';
    const locality = byId('location').value.trim();
    const date = byId('date').value;
    const duration = byId('duration').value;
    const peopleInput = byId('people');
    const people = peopleInput.value && peopleInput.validity.valid ? peopleInput.value : '';
    const units = byId('units').value;
    const detail = byId('detail').value.trim();
    const ready = Boolean(purpose && locality && peopleInput.validity.valid);
    byId('summaryPurpose').textContent = purposeNames[purpose] || 'Por definir';
    byId('summaryLocation').textContent = locality || 'Por definir';
    byId('summaryDate').textContent = dateLabel(date) + (duration ? ' · ' + duration : '');
    byId('summaryPeople').textContent = people ? Number(people).toLocaleString('es-AR') + ' personas' : 'A confirmar';
    byId('summaryUnits').textContent = units || 'Pedir orientación';
    byId('sheetStatus').textContent = ready ? 'Lista para enviar ✓' : 'Por completar';
    byId('sheetStatus').classList.toggle('ready', ready);
    document.querySelector('.consult-sheet').classList.toggle('ready', ready);
    byId('sheetHint').textContent = ready ? 'Tu mensaje ya tiene un punto de partida.' : 'Elegí el uso y sumá la localidad.';
    const lines = ['Hola Bahía Clean, quiero consultar por el servicio de baños químicos.', '', 'Uso: ' + (purposeNames[purpose] || 'A confirmar'), 'Localidad / lugar: ' + (locality || 'A confirmar'), 'Fecha: ' + dateLabel(date), 'Tiempo de uso: ' + (duration || 'A confirmar'), 'Personas aproximadas: ' + (people || 'A confirmar'), 'Cantidad: ' + (units || 'Necesito orientación sobre la cantidad de baños.')];
    if (detail) lines.push('Detalle: ' + detail);
    lines.push('', '¿Me confirman cobertura, disponibilidad, qué incluye el servicio y presupuesto?');
    const message = lines.join('\n');
    byId('messagePreview').textContent = message;
    byId('sendConsult').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message);
    byId('formError').textContent = '';
    return ready;
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', e => { e.preventDefault(); byId('sendConsult').click(); });
  byId('sendConsult').addEventListener('click', e => { if (!update()) { e.preventDefault(); byId('formError').textContent = 'Elegí para qué los necesitás y completá la localidad. Si indicás personas, usá un número entre 1 y 100.000.'; const target = !form.querySelector('input[name="purpose"]:checked') ? form.querySelector('input[name="purpose"]') : (!byId('location').value.trim() ? byId('location') : byId('people')); target.focus(); } });
  document.querySelectorAll('[data-purpose]').forEach(link => link.addEventListener('click', () => { const radio = form.querySelector('input[value="' + link.dataset.purpose + '"]'); if (radio) { radio.checked = true; update(); } }));
  const preset = new URLSearchParams(location.search).get('uso');
  if (purposeNames[preset]) form.querySelector('input[value="' + preset + '"]').checked = true;
  update();
  const video = byId('heroVideo');
  const toggle = byId('videoToggle');
  let userPaused = reduced.matches;
  let inView = true;
  function playback() { if (userPaused || !inView || document.hidden) video.pause(); else video.play().catch(() => {}); }
  function playbackUI() { toggle.textContent = video.paused ? '▶' : 'Ⅱ'; toggle.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video'); }
  toggle.addEventListener('click', () => { userPaused = !video.paused; playback(); });
  video.addEventListener('play', playbackUI); video.addEventListener('pause', playbackUI);
  reduced.addEventListener('change', () => { userPaused = reduced.matches; playback(); });
  if (reduced.matches) { video.autoplay = false; video.pause(); }
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; playback(); }, { threshold:.1 }).observe(video);
  document.addEventListener('visibilitychange', playback);
  document.addEventListener('pointerdown', () => { playback(); }, { once:true });
  playbackUI();
  if (!qa && !reduced.matches) { document.documentElement.classList.add('js-ready'); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold:.12 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }
})();
