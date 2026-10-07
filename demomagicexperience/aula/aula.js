/* Aula virtual — Magic Experience */
(() => {
  const WA = '5493537312173';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

  const header = $('.header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menu = $('.menu'), nav = $('#nav');
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  // Mazos con el contenido publicado en su Instagram
  const DECKS = {
    siempre: { front: 'Español', back: 'In English', cards: [
      ['Ya voy / Estoy en camino', 'I’m on my way.'],
      ['Dame un minuto', 'Give me a minute.'],
      ['No sé', 'I don’t know.'],
      ['Depende', 'It depends.'],
      ['¡Suena bien! / ¡Me parece bien!', 'Sounds good!']
    ] },
    argentas: { front: 'Frase argenta', back: 'In English', cards: [
      ['“Se picó el partido”', '“Things are getting heated”'],
      ['“Estoy manija”', '“I’m hyped”'],
      ['“Este pibe juega una banda”', '“He’s on another level!”'],
      ['“El árbitro está comprado”', '“The referee is paid off”']
    ] },
    farmear: { front: '¿Qué significa?', back: 'Magic te explica', long: true, cards: [
      ['Farmear', 'Viene del inglés “to farm”. En el mundo gamer e internet, significa repetir algo para acumular experiencia, puntos o recursos.'],
      ['Aura', 'En redes, “aura” se usa como carisma, presencia, estilo o ese “algo” que te hace ver cool.'],
      ['Farmear inglés', 'En tono de humor: practicar mucho inglés, sumar vocabulario, experiencia y fluidez, como si subieras de nivel.']
    ] }
  };
  const KEY = 'magic-aula-known';
  let known = {};
  try { known = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { known = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(known)); } catch (e) { /* sin storage */ } };
  const total = Object.values(DECKS).reduce((n, d) => n + d.cards.length, 0);

  let deck = 'siempre', idx = 0;
  const flash = $('#flash');
  const render = () => {
    const d = DECKS[deck], c = d.cards[idx];
    flash.classList.remove('flipped');
    $('#frontTag').textContent = d.front; $('#backTag').textContent = d.back;
    $('#frontText').textContent = c[0];
    const back = $('#backText'); back.textContent = c[1]; back.classList.toggle('long', !!d.long);
    $('#count').textContent = `${idx + 1} / ${d.cards.length}`;
    flash.classList.toggle('known', !!known[`${deck}:${idx}`]);
    flash.setAttribute('aria-label', `Tarjeta ${idx + 1} de ${d.cards.length}: ${c[0]}. Tocá para ver la respuesta.`);
    const n = Object.keys(known).length;
    $('#xpNum').textContent = n;
    $('#xpBar').style.width = `${Math.min(100, (n / total) * 100)}%`;
  };
  const next = () => { idx = (idx + 1) % DECKS[deck].cards.length; render(); };
  flash.addEventListener('click', () => {
    flash.classList.toggle('flipped');
    if (flash.classList.contains('flipped')) flash.setAttribute('aria-label', `Respuesta: ${DECKS[deck].cards[idx][1]}`);
  });
  $('#know').addEventListener('click', () => { known[`${deck}:${idx}`] = 1; save(); next(); });
  $('#again').addEventListener('click', () => { delete known[`${deck}:${idx}`]; save(); next(); });
  $$('.decks [data-deck]').forEach((b) => b.addEventListener('click', () => {
    $$('.decks [data-deck]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    deck = b.dataset.deck; idx = 0; render();
  }));
  render();

  // Acceso de alumnos
  const af = $('#accessForm'), note = $('#accessNote');
  af.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = af.elements.aname.value.trim(), course = af.elements.acourse.value.trim();
    if (!name) { note.textContent = 'Escribí tu nombre para pedir el acceso.'; af.elements.aname.focus(); return; }
    const msg = ['Hola Magic Experience! Soy alumno/a y necesito el acceso o el link de mi clase online.',
      `• Nombre: ${name}`, course && `• Curso / profe: ${course}`].filter(Boolean).join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
    note.textContent = 'Se abrió WhatsApp con tu pedido. Envialo y te pasamos el acceso.';
  });
})();
