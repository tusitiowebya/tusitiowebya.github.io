/* El selector prepara una consulta administrativa. No almacena datos. */
(() => {
  'use strict';
  const phone = '5491151451277';
  const form = document.getElementById('consultForm');
  const preview = document.getElementById('messagePreview');
  const send = document.getElementById('sendConsult');
  const messages = {
    turno: 'Quiero consultar por un turno de medicina cardiovascular.',
    atencion: 'Quisiera conocer las prestaciones disponibles y la modalidad de atención en medicina cardiovascular.',
    pregunta: 'Quiero hacer una consulta sobre la atención en el centro.'
  };
  function updateMessage() {
    const purpose = form.querySelector('input[name="purpose"]:checked')?.value || 'turno';
    const extras = [...form.querySelectorAll('input[name="extra"]:checked')].map(input => input.value);
    const message = `Hola, Centro Médico Integral. ${messages[purpose]}${extras.length ? ` También quisiera saber: ${extras.join(', ')}.` : ''}`;
    preview.textContent = message;
    send.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
  form.addEventListener('change', updateMessage);
  form.addEventListener('submit', event => event.preventDefault());
  updateMessage();
  document.querySelectorAll('[data-purpose]').forEach(link => link.addEventListener('click', () => {
    const input = form.querySelector(`input[value="${link.dataset.purpose}"]`);
    if (input) input.checked = true;
    updateMessage();
  }));

  const button = document.getElementById('menuButton');
  const menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menú');
  }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); if (menu.contains(document.activeElement)) button.focus(); } });
  document.addEventListener('click', event => { if (!menu.contains(event.target) && !button.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width:900px)').addEventListener('change', closeMenu);
  const header = document.getElementById('header');
  function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const video = document.getElementById('heroVideo');
  const videoButton = document.getElementById('videoButton');
  const symbol = document.getElementById('videoSymbol');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  let userPaused = reduced.matches || !!saveData;
  function syncVideoButton() {
    videoButton.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video');
    symbol.textContent = video.paused ? '▷' : 'Ⅱ';
  }
  video.addEventListener('play', syncVideoButton);
  video.addEventListener('pause', syncVideoButton);
  video.addEventListener('error', () => { videoButton.hidden = true; });
  if (userPaused) { video.autoplay = false; video.pause(); } else { video.play().catch(syncVideoButton); }
  syncVideoButton();
  videoButton.addEventListener('click', () => {
    userPaused = !video.paused;
    if (video.paused) video.play().catch(syncVideoButton); else video.pause();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause(); else if (!userPaused) video.play().catch(syncVideoButton);
  });
  if ('IntersectionObserver' in window) {
    const filmObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting && !userPaused && !document.hidden) video.play().catch(syncVideoButton); else video.pause(); });
    }, { threshold: .05 });
    filmObserver.observe(video);
    if (!reduced.matches && !new URLSearchParams(location.search).has('qa')) {
      document.documentElement.classList.add('js-animate');
      const reveals = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('waiting'); observer.unobserve(entry.target); }
      }), { threshold: .08 });
      reveals.forEach(element => { element.classList.add('waiting'); observer.observe(element); });
    }
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
