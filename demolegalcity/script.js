/* Legalcity & Asoc. — estante del Código, escribanía y consulta por WhatsApp */
(function () {
  'use strict';

  var WA_NUMBER = '5492212205147';
  var params = new URLSearchParams(location.search);
  if (params.has('qa')) document.documentElement.classList.add('qa');

  /* ---------- Datos: libros del Código Civil y Comercial (Ley 26.994) ---------- */
  var LIBROS = [
    {
      id: 'I', titulo: 'Parte general', lomo: 'Parte general', arts: 'Artículos 19 a 400', c: '#2b1613', h: 1,
      res: 'Las reglas de base: quién es persona para el derecho, su capacidad, nombre y domicilio; las personas jurídicas (asociaciones, fundaciones); los bienes, y cómo nacen, se prueban o se anulan los actos jurídicos.',
      temas: ['Restricción de la capacidad y sistema de apoyos', 'Cambio o rectificación de nombre', 'Nulidad de un acto o contrato', 'Asociación civil o fundación', 'Ausencia o presunción de fallecimiento'],
      llevar: ['DNI', 'Partidas de nacimiento o matrimonio, si corresponden', 'El acto, contrato o documento que querés revisar', 'Certificados médicos, si el tema es de capacidad']
    },
    {
      id: 'II', titulo: 'Relaciones de familia', lomo: 'Familia', arts: 'Artículos 401 a 723', c: '#13211b', h: .94,
      res: 'Matrimonio y divorcio, uniones convivenciales, régimen de bienes, alimentos, filiación, adopción y responsabilidad parental: cuidado personal de los hijos y comunicación con ellos.',
      temas: ['Divorcio y convenio regulador', 'Cuota alimentaria', 'Cuidado personal y régimen de comunicación', 'Unión convivencial y pactos', 'Filiación y reconocimiento', 'Adopción'],
      llevar: ['DNI', 'Libreta o partida de matrimonio', 'Partidas de nacimiento de los hijos', 'Comprobantes de ingresos y gastos (si es por alimentos)', 'Títulos de los bienes en común']
    },
    {
      id: 'III', titulo: 'Derechos personales', lomo: 'Der. personales', arts: 'Artículos 724 a 1881', c: '#151a26', h: 1.06,
      res: 'Obligaciones y contratos: compraventa, locación (alquileres), donación, mandato, fideicomiso y contratos de consumo. También la responsabilidad civil: el deber de reparar un daño.',
      temas: ['Contrato de alquiler', 'Boleto de compraventa', 'Reclamo por daños o accidente', 'Deudas, intimaciones y cartas documento', 'Problema con una compra o servicio', 'Redacción o revisión de un contrato'],
      llevar: ['DNI', 'El contrato o boleto', 'Recibos y comprobantes de pago', 'Cartas documento o intimaciones recibidas', 'Fotos, denuncia o certificados (si es por daños)']
    },
    {
      id: 'IV', titulo: 'Derechos reales', lomo: 'Der. reales', arts: 'Artículos 1882 a 2276', c: '#241c12', h: .98,
      res: 'Lo que se tiene sobre las cosas: posesión, dominio, condominio, propiedad horizontal, usufructo, servidumbres e hipoteca. Incluye la prescripción adquisitiva (usucapión) y las acciones para defender la propiedad.',
      temas: ['Escrituración de un inmueble', 'Usucapión (prescripción adquisitiva)', 'Condominio y división', 'Propiedad horizontal y consorcio', 'Usufructo', 'Hipoteca', 'Medianería o servidumbre'],
      llevar: ['DNI', 'Escritura o boleto del inmueble', 'Planos o informes de dominio, si los tenés', 'Impuestos y servicios pagados (si es por posesión)', 'Reglamento de propiedad horizontal, si corresponde']
    },
    {
      id: 'V', titulo: 'Sucesiones', lomo: 'Sucesiones', full: 'Transmisión de derechos por causa de muerte', arts: 'Artículos 2277 a 2531', c: '#1c1016', h: 1.1,
      res: 'Cómo se transmite la herencia: quiénes son herederos, la porción legítima que la ley les reserva, la partición de los bienes, los legados y los testamentos.',
      temas: ['Iniciar una sucesión', 'Hacer un testamento', 'Partición de la herencia', 'Cesión de derechos hereditarios', 'Herederos y porción legítima'],
      llevar: ['Partida de defunción', 'Partidas que acrediten el vínculo (nacimiento, matrimonio)', 'DNI de los herederos', 'Títulos de los bienes: escrituras, títulos de autos, cuentas', 'Testamento, si existe']
    },
    {
      id: 'VI', titulo: 'Disposiciones comunes', lomo: 'Disp. comunes', full: 'Disposiciones comunes a los derechos personales y reales', arts: 'Artículos 2532 a 2671', c: '#1a1a17', h: .9,
      res: 'Reglas que atraviesan todo lo anterior: prescripción y caducidad (los plazos para reclamar), privilegios entre acreedores, derecho de retención y los casos con elementos internacionales.',
      temas: ['¿Mi reclamo o deuda está prescripto?', 'Plazos de caducidad', 'Cobro con privilegio', 'Bienes o personas en el exterior'],
      llevar: ['DNI', 'Documentos con fechas: contratos, intimaciones, vencimientos', 'Constancias de reclamos anteriores', 'Resoluciones judiciales, si hubo juicio']
    }
  ];

  var ESCRIBANIA = {
    id: 'ESC', titulo: 'Escribanía',
    temas: ['Escritura de compraventa', 'Escritura de donación', 'Hipoteca', 'Poder general o especial', 'Certificación de firma', 'Acta notarial', 'Testamento por acto público', 'Cesión de derechos hereditarios', 'Autorización de viaje para menores'],
    llevar: ['DNI de todas las personas que firman', 'Título o escritura anterior del bien, si lo hay', 'Datos completos de las partes', 'Documentación del trámite que querés hacer']
  };
  var OTRO = { id: 'OTRO', titulo: 'Otro tema', temas: [], llevar: ['DNI', 'Todo papel relacionado con el tema'] };

  var ESC_ITEMS = [
    ['Primero', 'Escritura de compraventa', 'Para que la compra de un inmueble quede a tu nombre y oponible a terceros.', 'Escritura de compraventa'],
    ['Segundo', 'Donación e hipoteca', 'Donar un inmueble o garantizar un préstamo con él también requiere escritura pública.', 'Escritura de donación'],
    ['Tercero', 'Poderes', 'Para que otra persona pueda actuar en tu nombre: generales, especiales o para juicios.', 'Poder general o especial'],
    ['Cuarto', 'Certificación de firmas', 'El escribano da fe de que la firma de un documento es tuya.', 'Certificación de firma'],
    ['Quinto', 'Actas notariales', 'Dejar constancia fehaciente de un hecho: el estado de un inmueble, una entrega, una notificación.', 'Acta notarial'],
    ['Sexto', 'Testamento por acto público', 'Disponer de tus bienes para después, con la seguridad de la escritura.', 'Testamento por acto público'],
    ['Séptimo', 'Cesión de derechos hereditarios', 'Ceder lo que te corresponde en una herencia se hace por escritura pública.', 'Cesión de derechos hereditarios'],
    ['Octavo', 'Autorización de viaje para menores', 'Para que chicos y chicas viajen con uno solo de sus padres o con terceros.', 'Autorización de viaje para menores']
  ];

  /* Palabras frecuentes → libro y tema */
  var KEYS = [
    ['divorc separ', 'II', 0], ['alimento cuota manutencion', 'II', 1], ['hijo hija tenencia visita cuidado comunicacion', 'II', 2],
    ['concubin convivien pareja', 'II', 3], ['filiacion reconoc paternidad adn', 'II', 4], ['adopc adoptar', 'II', 5],
    ['alquil inquilin locacion locador desalojo', 'III', 0], ['boleto', 'III', 1], ['accident choque dano danos lesion mala praxis', 'III', 2],
    ['deuda carta documento intimac embargo', 'III', 3], ['consumidor garantia compra servicio', 'III', 4], ['contrato', 'III', 5],
    ['escritur titulo casa inmueble lote', 'IV', 0], ['usucap posesion terreno ocupado', 'IV', 1], ['condominio division', 'IV', 2],
    ['consorcio expensas propiedad horizontal departamento', 'IV', 3], ['usufructo', 'IV', 4], ['hipoteca', 'IV', 5], ['medianer servidumbre vecino pared', 'IV', 6],
    ['sucesion herencia herede murio fallec declaratoria', 'V', 0], ['testament', 'V', 1], ['particion repartir', 'V', 2], ['cesion derechos hereditarios', 'V', 3], ['legitima', 'V', 4],
    ['prescri vencio plazo', 'VI', 0], ['caducidad', 'VI', 1], ['privilegio acreedor', 'VI', 2], ['exterior extranjero otro pais', 'VI', 3],
    ['capacidad apoyo insania demencia', 'I', 0], ['nombre apellido rectific partida', 'I', 1], ['nulidad anular', 'I', 2], ['asociacion fundacion club', 'I', 3], ['ausencia desaparec', 'I', 4],
    ['poder apoderado', 'ESC', 3], ['firma certific', 'ESC', 4], ['acta constatac', 'ESC', 5], ['viaje menor', 'ESC', 8], ['donac', 'ESC', 1]
  ];

  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var byId = function (id) {
    if (id === 'ESC') return ESCRIBANIA;
    if (id === 'OTRO') return OTRO;
    for (var i = 0; i < LIBROS.length; i++) if (LIBROS[i].id === id) return LIBROS[i];
    return null;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var waUrl = function (msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); };

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('menuToggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('#menu a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); });
  });
  var waFloat = document.getElementById('waFloat');
  var onScroll = function () {
    nav.classList.toggle('is-solid', window.scrollY > 40);
    waFloat.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* WhatsApp con mensaje específico */
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.href = waUrl(a.getAttribute('data-msg') || 'Hola Dr. Battilana, les escribo desde la web de Legalcity & Asoc.');
  });

  /* ---------- Video del hero ---------- */
  var video = document.getElementById('heroVideo');
  if (video) {
    if (params.has('lite') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) {
          en.forEach(function (e) { if (e.isIntersecting) { var q = video.play(); if (q && q.catch) q.catch(function () {}); } else video.pause(); });
        }).observe(video);
      }
    }
  }

  /* ---------- Tarjeta: inclinación suave con el puntero ---------- */
  var card = document.getElementById('card');
  if (card && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', function () { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); });
  }

  /* ---------- Estante ---------- */
  var shelf = document.getElementById('shelf');
  var tome = document.getElementById('tome');
  var picked = {}; // libro -> Set de temas marcados en el tomo
  var current = null;

  LIBROS.forEach(function (l) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'book';
    b.id = 'book-' + l.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('aria-controls', 'tome');
    b.setAttribute('aria-label', 'Libro ' + l.id + ': ' + (l.full || l.titulo));
    b.style.setProperty('--c', l.c);
    b.style.setProperty('--h', 'calc(var(--hb, 230px) * ' + l.h + ')');
    b.innerHTML = '<span class="book__n">' + l.id + '</span><span class="book__t">' + esc(l.lomo) + '</span>';
    b.addEventListener('click', function () { openBook(l.id, true); });
    shelf.appendChild(b);
  });
  var setShelfHeight = function () {
    var w = window.innerWidth;
    shelf.style.setProperty('--hb', (w < 480 ? 250 : w < 768 ? 270 : 300) + 'px');
  };
  setShelfHeight();
  window.addEventListener('resize', setShelfHeight);

  shelf.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = LIBROS.findIndex(function (l) { return l.id === current; });
    i = (i + (e.key === 'ArrowRight' ? 1 : -1) + LIBROS.length) % LIBROS.length;
    openBook(LIBROS[i].id, false);
    document.getElementById('book-' + LIBROS[i].id).focus();
  });

  function openBook(id, focusPanel) {
    var l = byId(id);
    if (!l) return;
    current = id;
    picked[id] = picked[id] || new Set();
    shelf.querySelectorAll('.book').forEach(function (b) {
      var on = b.id === 'book-' + id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    tome.setAttribute('aria-labelledby', 'book-' + id);
    tome.innerHTML =
      '<div class="tome__a">' +
        '<p class="tome__lib">Libro ' + l.id + '</p>' +
        '<h3 class="tome__title">' + esc(l.full || l.titulo) + '</h3>' +
        '<p class="tome__arts">' + l.arts + '</p>' +
        '<p class="tome__res">' + esc(l.res) + '</p>' +
      '</div>' +
      '<div class="tome__b">' +
        '<h4>Consultas frecuentes</h4>' +
        '<div class="chips" id="tomeChips">' + l.temas.map(function (t, i) {
          return '<button type="button" class="chip" aria-pressed="' + (picked[id].has(t) ? 'true' : 'false') + '" data-i="' + i + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        '<button type="button" class="btn btn--ink" id="tomeGo">Armar mi consulta sobre esto</button>' +
      '</div>';
    tome.style.animation = 'none';
    void tome.offsetWidth;
    tome.style.animation = '';
    tome.querySelectorAll('#tomeChips .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        var t = l.temas[+c.getAttribute('data-i')];
        if (picked[id].has(t)) picked[id].delete(t); else picked[id].add(t);
        c.setAttribute('aria-pressed', picked[id].has(t) ? 'true' : 'false');
        updateGoLabel();
      });
    });
    var go = document.getElementById('tomeGo');
    function updateGoLabel() {
      var n = picked[id].size;
      go.textContent = n ? 'Armar mi consulta con ' + (n === 1 ? 'este tema' : 'estos ' + n + ' temas') : 'Armar mi consulta sobre esto';
    }
    updateGoLabel();
    go.addEventListener('click', function () {
      presetConsult(id, Array.from(picked[id]));
      goTo('consulta');
    });
    if (focusPanel && window.innerWidth < 768) tome.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function goTo(sec) {
    var el = document.getElementById(sec);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // índice del hero → abre el libro
  document.querySelectorAll('[data-libro]').forEach(function (a) {
    a.addEventListener('click', function () { openBook(a.getAttribute('data-libro'), false); });
  });

  /* ---------- Buscador ---------- */
  var search = document.getElementById('codeSearch');
  var results = document.getElementById('codeResults');
  search.addEventListener('input', function () {
    var q = norm(search.value).trim();
    results.innerHTML = '';
    if (q.length < 3) return;
    var words = q.split(/\s+/).filter(function (w) { return w.length >= 3; });
    var hits = [];
    KEYS.forEach(function (k) {
      var keys = k[0].split(' ');
      var match = words.some(function (w) {
        return keys.some(function (key) { return w.indexOf(key) === 0 || (w.length >= 4 && key.indexOf(w) === 0); });
      });
      if (match && !hits.some(function (h) { return h[1] === k[1] && h[2] === k[2]; })) hits.push(k);
    });
    if (!hits.length) {
      results.innerHTML = '<li class="is-empty">No lo encontramos en el índice. <a href="#consulta" data-preset="OTRO">Contalo en la consulta</a> y lo vemos.</li>';
      bindPresets(results);
      return;
    }
    hits.slice(0, 4).forEach(function (h) {
      var l = byId(h[1]);
      var tema = l.temas[h[2]];
      var li = document.createElement('li');
      li.innerHTML = '<button type="button"><b>' + (h[1] === 'ESC' ? 'Esc.' : 'Libro ' + h[1]) + '</b><span>' + esc(tema) + ' <em>· ' + esc(l.titulo) + '</em></span></button>';
      li.querySelector('button').addEventListener('click', function () {
        if (h[1] === 'ESC') { presetConsult('ESC', [tema]); goTo('consulta'); return; }
        picked[h[1]] = picked[h[1]] || new Set();
        picked[h[1]].add(tema);
        openBook(h[1], false);
        tome.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      results.appendChild(li);
    });
  });

  /* ---------- Escribanía ---------- */
  var escList = document.getElementById('escList');
  ESC_ITEMS.forEach(function (it) {
    var li = document.createElement('li');
    li.className = 'reveal';
    li.innerHTML = '<span class="protocol__ord">' + it[0] + '</span><div><h3>' + esc(it[1]) + '</h3><p>' + esc(it[2]) + '</p></div><button type="button">Consultar</button>';
    li.querySelector('button').addEventListener('click', function () { presetConsult('ESC', [it[3]]); goTo('consulta'); });
    escList.appendChild(li);
  });

  /* ---------- Consulta ---------- */
  var state = { tema: null, sits: new Set(), urg: null };
  var temaChips = document.getElementById('temaChips');
  var sitChips = document.getElementById('sitChips');
  var urgChips = document.getElementById('urgChips');
  var fNombre = document.getElementById('fNombre');
  var fModo = document.getElementById('fModo');
  var fDetalle = document.getElementById('fDetalle');
  var preview = document.getElementById('preview');
  var bring = document.getElementById('bring');
  var bringList = document.getElementById('bringList');
  var errBox = document.getElementById('consultError');

  LIBROS.concat([ESCRIBANIA, OTRO]).forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false');
    b.dataset.v = t.id;
    b.innerHTML = (/^[IV]+$/.test(t.id) ? '<b>' + t.id + '</b>' : '') + esc(t.titulo);
    b.addEventListener('click', function () { setTema(t.id, []); });
    temaChips.appendChild(b);
  });

  function setTema(id, sits) {
    var t = byId(id);
    state.tema = id;
    state.sits = new Set(sits || []);
    temaChips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-checked', c.dataset.v === id ? 'true' : 'false'); });
    sitChips.innerHTML = '';
    t.temas.forEach(function (s) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip';
      c.setAttribute('aria-pressed', state.sits.has(s) ? 'true' : 'false');
      c.textContent = s;
      c.addEventListener('click', function () {
        if (state.sits.has(s)) state.sits.delete(s); else state.sits.add(s);
        c.setAttribute('aria-pressed', state.sits.has(s) ? 'true' : 'false');
        render();
      });
      sitChips.appendChild(c);
    });
    if (!t.temas.length) sitChips.innerHTML = '<p class="field__hint">Contalo con tus palabras en el detalle, más abajo.</p>';
    bringList.innerHTML = t.llevar.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    bring.hidden = false;
    errBox.hidden = true;
    render();
  }

  function presetConsult(id, sits) { setTema(id, sits); }

  urgChips.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var on = state.urg !== c.dataset.v;
      state.urg = on ? c.dataset.v : null;
      urgChips.querySelectorAll('.chip').forEach(function (o) { o.setAttribute('aria-checked', o === c && on ? 'true' : 'false'); });
      render();
    });
  });
  [fNombre, fModo, fDetalle].forEach(function (el) { el.addEventListener('input', render); });

  function temaLabel() {
    var t = byId(state.tema);
    if (!t) return '';
    if (/^[IV]+$/.test(t.id)) return (t.full || t.titulo) + ' (Libro ' + t.id + ' del Código Civil y Comercial)';
    return t.titulo;
  }

  function buildMessage() {
    var lines = ['Hola Dr. Battilana, les escribo desde la web de Legalcity & Asoc.'];
    var nombre = fNombre.value.trim();
    if (nombre) lines.push('Soy ' + nombre + '.');
    if (state.tema) lines.push('Tema: ' + temaLabel());
    if (state.sits.size) lines.push('Situación: ' + Array.from(state.sits).join('; '));
    if (state.urg) lines.push('Apuro: ' + state.urg);
    lines.push('Prefiero empezar con ' + fModo.value + '.');
    var det = fDetalle.value.trim();
    if (det) lines.push('Detalle: ' + det);
    lines.push('¿Me indican cómo seguimos? Gracias.');
    return lines.join('\n');
  }

  function render() { preview.textContent = buildMessage(); }
  render();

  document.getElementById('consultForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = [];
    if (!state.tema) missing.push('elegí un tema');
    if (!fNombre.value.trim()) missing.push('poné tu nombre');
    fNombre.setAttribute('aria-invalid', fNombre.value.trim() ? 'false' : 'true');
    if (missing.length) {
      errBox.textContent = 'Para enviarlo, ' + missing.join(' y ') + '.';
      errBox.hidden = false;
      (state.tema ? fNombre : temaChips.querySelector('.chip')).focus();
      return;
    }
    errBox.hidden = true;
    window.open(waUrl(buildMessage()), '_blank', 'noopener');
  });

  function bindPresets(root) {
    root.querySelectorAll('[data-preset]').forEach(function (a) {
      a.addEventListener('click', function () { presetConsult(a.getAttribute('data-preset'), []); });
    });
  }
  bindPresets(document);

  /* Preselección por URL: ?libro=II o ?tema=ESC */
  var pre = (params.get('libro') || params.get('tema') || '').toUpperCase();
  if (/^(I|II|III|IV|V|VI)$/.test(pre)) openBook(pre, false);
  else openBook('II', false);
  if (pre === 'ESC') presetConsult('ESC', []);

  /* ---------- Reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !document.documentElement.classList.contains('qa')) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
        e.target.style.transitionDelay = Math.min(sibs, 6) * 70 + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  }

  /* ---------- Títulos que no deben cortarse con letra grande (Android) ---------- */
  function fitText() {
    document.querySelectorAll('.hero__title .fit').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      var guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 20 && guard++ < 40) {
        size -= 1;
        el.style.fontSize = size + 'px';
      }
    });
  }
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
})();
