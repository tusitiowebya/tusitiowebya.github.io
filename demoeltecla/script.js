(() => {
  'use strict';
  const cfg = window.ELTECLA;
  const wa = text => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); });
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('open'); };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); nav.classList.toggle('open', open); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qa = new URLSearchParams(location.search).has('qa');
  if ('IntersectionObserver' in window && !reduced && !qa) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
  }
  const video = document.getElementById('heroVideo');
  const control = document.getElementById('videoControl');
  let manualPause = reduced;
  const updateVideoButton = () => { if (!control) return; const playing = !video.paused; control.setAttribute('aria-label', playing ? 'Pausar video' : 'Reproducir video'); control.firstElementChild.textContent = playing ? 'Ⅱ' : '▶'; };
  if (video) {
    if (reduced) video.pause();
    video.addEventListener('play', updateVideoButton); video.addEventListener('pause', updateVideoButton);
    control.addEventListener('click', () => { manualPause = !video.paused; if (manualPause) video.pause(); else video.play().catch(() => {}); updateVideoButton(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting && !manualPause && !document.hidden) video.play().catch(() => {}); else video.pause(); }); }, { threshold: .1 }).observe(video);
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else if (!manualPause && video.getBoundingClientRect().bottom > 0) video.play().catch(() => {}); });
    updateVideoButton();
  }
  const form = document.getElementById('radarForm');
  if (!form) return;
  const game = document.getElementById('radarGame');
  const platform = document.getElementById('radarConsole');
  const preview = document.getElementById('radarPreview');
  let mode = 'titulo', mood = '';
  const message = () => {
    if (mode === 'titulo') return `Hola, El Tecla. Estoy buscando ${game.value.trim() || '[nombre del juego]'} para ${platform.value.trim() || '[mi consola o plataforma]'}. ¿Lo tienen? Quiero consultar precio, disponibilidad y cómo coordinar la compra.`;
    return `Hola, El Tecla. Quiero una recomendación de juegos para ${platform.value.trim() || '[mi consola o plataforma]'}.${game.value.trim() ? ` Me gustan: ${game.value.trim()}.` : ''}${mood ? ` Mi plan: ${mood.toLowerCase()}.` : ''} ¿Qué tienen publicado para consultar?`;
  };
  const update = () => { preview.textContent = game.value.trim() || platform.value.trim() || mode === 'idea' ? message() : 'Sumá el juego y tu consola. Tu próxima partida empieza con una charla.'; };
  document.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    game.required = mode === 'titulo';
    document.getElementById('radarGameLabel').textContent = mode === 'titulo' ? '¿QUÉ JUEGO ESTÁS BUSCANDO?' : '¿QUÉ JUEGOS O ESTILOS TE GUSTAN? (OPCIONAL)';
    game.placeholder = mode === 'titulo' ? 'Escribí el nombre del juego' : 'Contanos qué te gusta jugar';
    document.getElementById('moodChoices').hidden = mode !== 'idea'; update();
  }));
  document.querySelectorAll('[data-mood]').forEach(btn => btn.addEventListener('click', () => { mood = mood === btn.dataset.mood ? '' : btn.dataset.mood; document.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mood === mood))); update(); }));
  form.addEventListener('input', update);
  form.addEventListener('submit', e => { e.preventDefault(); if (!platform.value.trim() || (mode === 'titulo' && !game.value.trim())) { document.getElementById('radarNote').textContent = 'Completá el nombre del juego y la consola para preparar tu consulta.'; return; } window.open(wa(message()), '_blank', 'noopener,noreferrer'); });
})();
