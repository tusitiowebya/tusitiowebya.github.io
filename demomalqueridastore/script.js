(() => {
  'use strict';
  const {$, $$} = MQ;

  /* Recién colgado: las 4 más recientes */
  const rail = $('#homeRail');
  MQ.load().then(result => {
    if (result.kind === 'error') {
      rail.innerHTML = '<p class="state">No pudimos traer las prendas. <a href="catalogo/">Probá en el catálogo</a> o escribinos por WhatsApp.</p>';
      return;
    }
    if (result.kind === 'empty' || !MQ.products.length) {
      rail.innerHTML = '<p class="state">Estamos colgando prendas nuevas. Escribinos y te mostramos lo que hay.</p>';
      return;
    }
    rail.innerHTML = MQ.products.slice(0, 4).map((p, i) => MQ.card(p, i, {eager: i < 2})).join('');
    $$('[data-total]').forEach(e => { e.textContent = '(' + MQ.products.length + ')'; });
    MQ.syncHearts();
  });

  MQ.initBag();
  MQ.initWaitlist($('[data-waitlist]'));

  /* Video de la vidriera */
  const video = $('#heroVideo'), toggle = $('#videoToggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches;
  const sync = () => {
    toggle.textContent = video.paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video');
  };
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  toggle.addEventListener('click', () => {
    paused = !video.paused;
    if (video.paused) video.play().catch(() => {}); else video.pause();
  });
  if (paused) video.pause(); else video.play().catch(() => {});
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !paused) video.play().catch(() => {}); else video.pause();
  }, {threshold: .05}).observe(video);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (!paused && video.getBoundingClientRect().bottom > 0) video.play().catch(() => {});
  });
})();
