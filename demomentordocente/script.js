/* Mentor Docente — estantería, armador de lista y WhatsApp */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  var QA = /[?&]qa(&|=|$)/.test(location.search);
  if (QA) document.documentElement.classList.add('qa');

  // Número del formulario del cliente (confirmar: tiene 9 dígitos)
  var WA_NUMBER = '549358815422';

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  var MSG = {
    general: 'Hola Mentor Docente, quería hacer una consulta por libros.',
    lista: 'Hola Mentor Docente, les quiero mandar la lista de libros del colegio para saber qué tienen.',
    docente: 'Hola Mentor Docente, soy docente y quiero consultar propuestas de libros para mi curso.'
  };

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(MSG[a.dataset.wa] || MSG.general);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var floatWa = document.getElementById('floatWa');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 20);
    floatWa.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- estantería (títulos publicados en @mentordocente) ---------- */
  var BOOKS = [
    { id: 'palito', img: 'palito-bombon', tag: 'Primer grado', title: 'Palito Bombón Helado 1 — Lenguaje, Matemática y Ciencias', note: 'Integrado primer ciclo · compras comunitarias', f: ['primer'], mat: ['Lengua', 'Matemática', 'Ciencias / Integrado'] },
    { id: 'imagina', img: 'lengua-imagina', tag: 'Kapelusz', title: 'Lengua 1 · Imagina', note: 'Para primer ciclo', f: ['primer'], mat: ['Lengua'] },
    { id: 'trip', img: 'my-english-trip', tag: 'Macmillan', title: 'My English Trip 1 (2nd Edition)', note: 'Primer grado', f: ['primer', 'ingles'], mat: ['Inglés'] },
    { id: 'tecno', img: 'tecnologia', tag: 'El Semáforo · Aula Taller', title: 'Tecnología 4, 5 y 6 y Ciencias de la computación', note: 'Serie Tecnología, novedad', f: ['segundo'], mat: ['Tecnología'] },
    { id: 'dream', img: 'dream-makers', tag: 'Pearson', title: 'Dream Makers 4', note: 'Inglés primaria · pedí tu ejemplar', f: ['segundo', 'ingles'], mat: ['Inglés'] },
    { id: 'pulse', img: 'on-the-pulse', tag: 'Macmillan', title: 'On the Pulse 1 (2nd Edition)', note: 'Recomendado para 6.º grado o 1.er año', f: ['segundo', 'secundaria', 'ingles'], mat: ['Inglés'] },
    { id: 'geo', img: 'geografia', tag: 'El Semáforo · Aula Taller', title: 'Geografía 1 y 3 · Geografía de Córdoba', note: 'Novedad 2026, adaptado a la nueva currícula · C.B. y C.O.', f: ['secundaria'], mat: ['Geografía / Sociales'] },
    { id: 'lengua2', img: 'lengua-literatura', tag: 'Santillana · ¡Me gusta!', title: 'Lengua y Literatura II', note: 'Secundaria', f: ['secundaria'], mat: ['Lengua'] },
    { id: 'mate3', img: 'matematica', tag: 'Santillana · ¡Me gusta!', title: 'Matemática III', note: 'Textos adaptados a contextos cotidianos', f: ['secundaria'], mat: ['Matemática'] },
    { id: 'link', img: 'link-it', tag: 'Oxford', title: 'Link It! 1 · Student Book', note: 'Inglés secundaria', f: ['secundaria', 'ingles'], mat: ['Inglés'] },
    { id: 'rosetti', img: 'una-buena-vida', tag: 'Daniel López Rosetti', title: 'Una buena vida', note: 'Novedad para leer', f: ['leer'], mat: [] },
    { id: 'inquilina', img: 'la-inquilina', tag: 'Freida McFadden · Suma', title: 'La inquilina', note: 'Novedad para leer', f: ['leer'], mat: [] }
  ];
  var byId = {};
  BOOKS.forEach(function (b) { byId[b.id] = b; });

  var booksEl = document.getElementById('books');

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function renderBooks(filter) {
    var list = BOOKS.filter(function (b) { return filter === 'todos' || b.f.indexOf(filter) > -1; });
    booksEl.innerHTML = list.map(function (b, i) {
      return '<article class="book" style="animation-delay:' + (i * 0.05) + 's">' +
        '<div class="book__cover"><img src="img/' + b.img + '.webp" alt="Tapa de ' + esc(b.title) + '" loading="lazy" width="600" height="800"></div>' +
        '<div class="book__plank" aria-hidden="true"></div>' +
        '<div class="book__body">' +
        '<span class="book__tag">' + esc(b.tag) + '</span>' +
        '<h3 class="book__title">' + esc(b.title) + '</h3>' +
        '<p class="book__note">' + esc(b.note) + '</p>' +
        '<a class="book__ask" href="' + waLink('Hola Mentor Docente, quería consultar por "' + b.title + '" (' + b.tag + '). ¿Lo tienen y a qué precio?') + '" target="_blank" rel="noopener">Consultar por este <span aria-hidden="true">→</span></a>' +
        '</div></article>';
    }).join('');
  }

  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (o) {
        o.classList.toggle('is-on', o === t);
        o.setAttribute('aria-selected', String(o === t));
      });
      renderBooks(t.dataset.f);
    });
  });
  renderBooks('todos');

  /* ---------- armador de lista ---------- */
  var state = { quien: 'familia', nivel: 'primer', grado: '1.º grado', materias: [], picks: [], qty: 20 };
  var GRADOS = {
    primer: ['1.º grado', '2.º grado', '3.º grado'],
    segundo: ['4.º grado', '5.º grado', '6.º grado'],
    secundaria: ['1.er año', '2.º año', '3.er año', '4.º año', '5.º año', '6.º año'],
    leer: []
  };
  var NIVEL_TXT = { primer: 'Primer ciclo', segundo: 'Segundo ciclo', secundaria: 'Secundaria', leer: 'Para leer' };
  var QUIEN_TXT = { familia: 'para mi hijo/a', docente: 'soy docente', comunitaria: 'compra comunitaria' };

  var gradosEl = document.getElementById('grados');
  var materiasField = document.getElementById('materiasField');
  var qtyBox = document.getElementById('qtyBox');
  var qtyOut = document.getElementById('qty');
  var titulos = document.getElementById('titulos');
  var loc = document.getElementById('loc');
  var lines = document.getElementById('sheetLines');
  var sugg = document.getElementById('sugg');
  var suggRow = document.getElementById('suggRow');
  var sheet = document.querySelector('.sheet');
  var listWa = document.getElementById('listWa');
  var lastLines = [];

  var d = new Date();
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  document.getElementById('sheetDate').textContent = 'Córdoba, ' + d.getDate() + ' de ' + MESES[d.getMonth()];

  function renderGrados() {
    var g = GRADOS[state.nivel];
    if (g.indexOf(state.grado) === -1) state.grado = g[0] || '';
    gradosEl.innerHTML = g.map(function (x) {
      return '<button type="button" class="chip' + (x === state.grado ? ' is-on' : '') + '" data-v="' + x + '">' + x + '</button>';
    }).join('');
    gradosEl.hidden = !g.length;
    materiasField.hidden = state.nivel === 'leer';
  }

  document.querySelectorAll('.chips[data-group]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var key = group.dataset.group;
      var v = chip.dataset.v;
      if (group.hasAttribute('data-multi')) {
        var i = state[key].indexOf(v);
        if (i > -1) state[key].splice(i, 1); else state[key].push(v);
        chip.classList.toggle('is-on', i === -1);
      } else {
        state[key] = v;
        group.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        if (key === 'nivel') renderGrados();
        if (key === 'quien') qtyBox.hidden = v !== 'comunitaria';
      }
      update();
    });
  });

  document.querySelectorAll('.qty__b').forEach(function (b) {
    b.addEventListener('click', function () {
      state.qty = Math.max(5, Math.min(200, state.qty + Number(b.dataset.d)));
      qtyOut.textContent = state.qty;
      update();
    });
  });

  titulos.addEventListener('input', update);
  loc.addEventListener('input', update);

  suggRow.addEventListener('click', function (e) {
    var s = e.target.closest('.sugg');
    if (!s) return;
    var id = s.dataset.id;
    var i = state.picks.indexOf(id);
    if (i > -1) state.picks.splice(i, 1); else state.picks.push(id);
    update();
  });

  function suggestions() {
    return BOOKS.filter(function (b) {
      if (b.f.indexOf(state.nivel) === -1) return false;
      if (!state.materias.length || state.nivel === 'leer') return true;
      return b.mat.some(function (m) { return state.materias.indexOf(m) > -1; });
    });
  }

  function buildLines() {
    var out = [];
    var head = NIVEL_TXT[state.nivel] + (state.grado ? ' · ' + state.grado : '');
    out.push({ t: head, cls: 'sub' });
    if (state.quien === 'comunitaria') out.push({ t: 'Compra comunitaria para ' + state.qty + ' chicos', cls: 'sub' });
    else if (state.quien === 'docente') out.push({ t: 'Soy docente', cls: 'sub' });
    if (state.nivel !== 'leer') state.materias.forEach(function (m) { out.push({ t: m }); });
    state.picks.forEach(function (id) { if (byId[id]) out.push({ t: byId[id].title }); });
    titulos.value.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 12).forEach(function (s) { out.push({ t: s }); });
    if (loc.value.trim()) out.push({ t: 'Envío a ' + loc.value.trim(), cls: 'sub' });
    if (out.length < 3) out.push({ t: 'marcá materias o pegá los títulos…', cls: 'muted' });
    return out;
  }

  function update() {
    var ls = buildLines();
    var html = '';
    ls.forEach(function (l, i) {
      var isNew = lastLines[i] !== l.t;
      html += '<li' + (l.cls ? ' class="' + l.cls + '"' : '') + (isNew ? '' : ' style="animation:none"') + '>' + esc(l.t) + '</li>';
    });
    lines.innerHTML = html;
    lastLines = ls.map(function (l) { return l.t; });

    var sg = suggestions();
    sugg.hidden = !sg.length;
    suggRow.innerHTML = sg.slice(0, 4).map(function (b) {
      return '<button type="button" class="sugg' + (state.picks.indexOf(b.id) > -1 ? ' is-on' : '') + '" data-id="' + b.id + '" aria-pressed="' + (state.picks.indexOf(b.id) > -1) + '">' +
        '<img src="img/' + b.img + '.webp" alt="" loading="lazy" width="32" height="42">' + esc(b.title.split(' — ')[0]) + '</button>';
    }).join('');

    var items = state.materias.length || state.picks.length || titulos.value.trim();
    sheet.classList.toggle('is-ready', !!items);

    var msg = ['Hola Mentor Docente, les paso mi lista (' + QUIEN_TXT[state.quien] + ').'];
    msg.push('Nivel: ' + NIVEL_TXT[state.nivel] + (state.grado ? ', ' + state.grado : ''));
    if (state.quien === 'comunitaria') msg.push('Cantidad de chicos: ' + state.qty);
    if (state.nivel !== 'leer' && state.materias.length) msg.push('Materias: ' + state.materias.join(', '));
    if (state.picks.length) msg.push('De la estantería: ' + state.picks.map(function (id) { return byId[id].title; }).join('; '));
    var t = titulos.value.trim();
    if (t) msg.push('Títulos del colegio:\n' + t);
    if (loc.value.trim()) msg.push('Envío a: ' + loc.value.trim());
    msg.push('¿Qué tienen disponible y a qué precio?');
    listWa.href = waLink(msg.join('\n'));
  }

  renderGrados();
  update();

  /* ---------- reveal ---------- */
  var rvTargets = document.querySelectorAll('.shelf__head, .tabs, .list__form, .sheet, .teach__intro, .card, .steps h2, .steps__row li, .faq h2, .faq__list details, .end__in');
  if (!QA && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rvTargets.forEach(function (el, i) {
      el.classList.add('rv');
      if (el.matches('.card, .steps__row li, .faq__list details')) {
        var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--d', (sib * 0.08) + 's');
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rvTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- marquee continuo: duplicar pista ---------- */
  var track = document.getElementById('marquee');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- video: pausar fuera de vista ---------- */
  var v = document.getElementById('heroVideo');
  if (v && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    }).observe(v);
  }
})();
