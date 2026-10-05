/* SB Event Planner — demo TuPaginaYa */
(function () {
  'use strict';

  var WA_NUMBER = '5492284602422';
  var root = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var QA = qs.has('qa');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STATIC = reduce || QA || qs.has('lite');

  function wa(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  /* ---------- links de WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = wa(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a') && menu.classList.contains('is-open')) burger.click();
  });

  /* =========================================================
     HERO: el SB rojo deja ver la fiesta y se abre con el scroll
     ========================================================= */
  var hero = document.getElementById('hero');
  var stage = document.getElementById('stage');
  var knock = document.getElementById('knock');
  var logo = document.getElementById('knockLogo');
  var letterB = document.getElementById('knockB');
  var plate = document.querySelector('.logo-plate');
  var front = document.getElementById('front');
  var after = document.getElementById('after');
  var video = document.getElementById('heroVideo');

  if (STATIC) root.classList.add('is-static');
  // ?qa: escenario con alto fijo para capturas de página completa
  if (QA) stage.style.height = (parseInt(qs.get('vh'), 10) || 900) + 'px';
  if (!QA) root.classList.add('is-loading');

  function setLogoSize() {
    var w = window.innerWidth, h = stage.offsetHeight || window.innerHeight;
    var size = w <= 768 ? Math.min(h * 0.27, w * 0.52) : Math.min(h * 0.33, w * 0.26);
    stage.style.setProperty('--logo-size', Math.round(size) + 'px');
  }

  // ubica la capa del SB exactamente detrás de "EVENT PLANNER"
  function placeLogo() {
    var s = stage.getBoundingClientRect();
    var p = plate.getBoundingClientRect();
    var lw = logo.offsetWidth, lh = logo.offsetHeight;
    var cx = p.left - s.left + p.width / 2;
    var cy = p.top - s.top + p.height / 2;
    logo.style.left = (cx - lw / 2) + 'px';
    logo.style.top = (cy - lh / 2) + 'px';
    // el zoom entra por el asta de la B: así la pantalla se llena de "letra"
    // centro del asta de la B en Bodoni Moda: 0,156 em desde el origen del glifo (medido con canvas)
    var ox = letterB.offsetLeft + parseFloat(getComputedStyle(letterB).fontSize) * 0.156;
    logo.style.transformOrigin = ox + 'px ' + (lh * 0.56) + 'px';
  }

  var MAX_SCALE = 90;
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > hero.offsetTop + hero.offsetHeight - window.innerHeight - 10);
    if (STATIC) return;

    var range = hero.offsetHeight - window.innerHeight;
    var p = range > 0 ? clamp((y - hero.offsetTop) / range, 0, 1) : 0;

    var fade = 1 - smooth(p / 0.2);
    front.style.opacity = fade;
    front.style.transform = 'translateY(' + (-50 * smooth(p / 0.3)) + 'px)';
    front.style.pointerEvents = fade < 0.3 ? 'none' : '';

    var z = smooth((p - 0.06) / 0.6);
    var scale = Math.exp(z * Math.log(MAX_SCALE));
    logo.style.transform = 'scale(' + scale.toFixed(3) + ')';
    knock.style.opacity = 1 - smooth((p - 0.6) / 0.14);

    var a = smooth((p - 0.7) / 0.2);
    after.style.opacity = a;
    after.style.transform = 'translateY(' + (20 * (1 - a)) + 'px)';
    stage.style.setProperty('--scrim', a.toFixed(3));

    // video fuera de vista: pausa
    var visible = y < hero.offsetTop + hero.offsetHeight;
    if (visible && video.paused) video.play().catch(function () {});
    else if (!visible && !video.paused) video.pause();
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }

  function layout() {
    setLogoSize();
    placeLogo();
    onScroll();
    fitText();
  }

  setLogoSize();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', function () { requestAnimationFrame(layout); });
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () {
    layout();
    requestAnimationFrame(function () { root.classList.remove('is-loading'); });
  });
  window.addEventListener('load', layout);
  setTimeout(function () { root.classList.remove('is-loading'); }, 2500);

  // si el autoplay se rechaza (ahorro de datos, iOS), arranca con el primer toque
  function kick() { if (video.paused) video.play().catch(function () {}); }
  ['touchstart', 'pointerdown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, kick, { once: true, passive: true });
  });

  /* ---------- fitText: Android con letra grande ---------- */
  function fitText() {
    document.querySelectorAll('.logo-plate__ep, .tagline, .hero__title').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      var guard = 30;
      while (el.scrollWidth > el.clientWidth + 1 && size > 9 && guard--) {
        size -= 1;
        el.style.fontSize = size + 'px';
      }
    });
  }
  window.__sbFit = fitText;

  /* ---------- reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.reveal, .why__item').forEach(function (el, i) {
    if (!io || QA || reduce) { el.classList.add('is-in'); return; }
    el.style.transitionDelay = (i % 3) * 90 + 'ms';
    io.observe(el);
  });

  /* ---------- servicios: cenital que sigue al puntero ---------- */
  document.querySelectorAll('.act').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- reel del salón ---------- */
  var sv = document.getElementById('salonVideo');
  var sBtn = document.getElementById('salonPlay');
  var userPaused = false;
  function syncBtn() {
    sBtn.textContent = sv.paused ? '▶' : '❚❚';
    sBtn.setAttribute('aria-label', sv.paused ? 'Reproducir el recorrido' : 'Pausar el recorrido');
  }
  sBtn.addEventListener('click', function () {
    if (sv.paused) { userPaused = false; sv.play().catch(function () {}); }
    else { userPaused = true; sv.pause(); }
  });
  sv.addEventListener('play', syncBtn);
  sv.addEventListener('pause', syncBtn);
  syncBtn();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting && !userPaused) sv.play().catch(function () {});
        else if (!e.isIntersecting) sv.pause();
      });
    }, { threshold: 0.35 }).observe(sv);
  }

  /* ---------- WhatsApp flotante ---------- */
  var waF = document.getElementById('waFloat');
  var bubbleShown = false;
  function waCheck() {
    var on = window.scrollY > window.innerHeight * 0.9;
    waF.classList.toggle('is-on', on);
    if (on && !bubbleShown) {
      bubbleShown = true;
      waF.classList.add('show-bubble');
      setTimeout(function () { waF.classList.remove('show-bubble'); }, 6500);
    }
  }
  window.addEventListener('scroll', waCheck, { passive: true });
  waCheck();

  /* =========================================================
     CRONOGRAMA DE TU FECHA
     ========================================================= */
  var $ = function (id) { return document.getElementById(id); };
  var fecha = $('fecha'), inv = $('invitados'), invOut = $('invOut');
  var timeline = $('timeline'), notes = $('notes'), verdict = $('verdict');
  var barFill = $('barFill'), shTitle = $('shTitle'), err = $('err');
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  var today = new Date(); today.setHours(0, 0, 0, 0);
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  fecha.min = iso(tomorrow);

  function parseDate(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
    var p = v.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d) ? null : d;
  }
  function longDate(d) { return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear(); }
  function shortDate(d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); }
  function monthYear(d) { return MESES[d.getMonth()] + ' ' + d.getFullYear(); }

  function state() {
    var tipo = document.querySelector('input[name=tipo]:checked');
    var lugar = document.querySelector('input[name=lugar]:checked');
    var nivel = document.querySelector('input[name=nivel]:checked');
    var rubros = Array.prototype.slice.call(document.querySelectorAll('#rubros input:checked'));
    return {
      tipo: tipo ? tipo.value : '',
      date: parseDate(fecha.value),
      inv: +inv.value,
      lugar: lugar ? lugar.value : 'salon',
      nivel: nivel ? nivel.value : 'Propuesta base',
      rubros: rubros.map(function (r) { return r.value; }),
      gastro: rubros.some(function (r) { return r.dataset.g; }),
      nombre: $('nombre').value.trim(),
      tel: $('tel').value.trim(),
      mail: $('mail').value.trim(),
      idea: $('idea').value.trim()
    };
  }

  function monthsUntil(d) { return (d - today) / (1000 * 60 * 60 * 24 * 30.44); }
  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }
  function leadText(m) {
    if (m < 1) { var w = Math.max(1, Math.round(m * 30.44 / 7)); return plural(w, 'semana', 'semanas'); }
    return plural(Math.floor(m), 'mes', 'meses');
  }

  function li(time, title, small, night) {
    var el = document.createElement('li');
    if (night) el.className = 'is-night';
    el.innerHTML = '<time></time><b></b>' + (small ? '<small></small>' : '');
    el.querySelector('time').textContent = time;
    el.querySelector('b').textContent = title;
    if (small) el.querySelector('small').textContent = small;
    return el;
  }
  function note(html, cls) {
    var el = document.createElement('li');
    if (cls) el.className = cls;
    el.innerHTML = html;
    return el;
  }

  function render() {
    var s = state();
    invOut.textContent = s.inv >= 400 ? '400+' : s.inv;
    timeline.innerHTML = '';
    notes.innerHTML = '';
    verdict.classList.remove('is-short');

    shTitle.textContent = (s.tipo || 'Tu celebración') + (s.date ? ' · ' + shortDate(s.date) : '');

    if (!s.date) {
      barFill.style.width = '0';
      verdict.innerHTML = 'Elegí una fecha para ver tu margen de planificación.';
      timeline.appendChild(li('Hoy', 'Primera conversación', 'Reunión inicial con Laura y César para conocer tu idea.'));
      timeline.appendChild(li('Al reservar', 'Seña del 30% y fecha bloqueada', 'Sobre los servicios organizativos base.'));
      timeline.appendChild(li('Tu fecha', 'La noche', 'Vos disfrutá. Nosotros nos ocupamos del resto.', true));
    } else if (s.date <= today) {
      barFill.style.width = '0';
      verdict.innerHTML = '<b>Elegí una fecha futura</b> para armar el cronograma.';
    } else {
      var m = monthsUntil(s.date);
      barFill.style.width = (clamp(m, 0.2, 14) / 14 * 100) + '%';
      if (m >= 12) verdict.innerHTML = '<b>Margen ideal:</b> faltan ' + leadText(m) + '. Tiempo de sobra para planificar con serenidad y elegir a los mejores proveedores.';
      else if (m >= 6) verdict.innerHTML = '<b>Buen margen:</b> faltan ' + leadText(m) + ', dentro de lo que recomendamos (6 a 12 meses).';
      else {
        verdict.classList.add('is-short');
        verdict.innerHTML = '<b>Plazo corto:</b> faltan ' + leadText(m) + '. Lo evaluamos según disponibilidad: cuanto antes hablemos, mejor.';
      }

      timeline.appendChild(li('Hoy', 'Primera conversación', 'Reunión inicial con Laura y César para conocer tu idea y diseñar la propuesta.'));
      timeline.appendChild(li('Al reservar', 'Seña del 30% y fecha bloqueada', 'Corresponde a los servicios organizativos base. Desde ahí, la fecha es tuya.'));
      if (m >= 1.5) {
        timeline.appendChild(li('Hasta ' + monthYear(s.date), 'Saldo en cuotas acordadas', 'El resto se ordena en un plan de cuotas hasta la fecha del evento.'));
      }
      if (s.tipo === 'Cumpleaños de 15' && s.rubros.indexOf('Fotografía y video') > -1) {
        timeline.appendChild(li('La previa', 'Prebook de fotos', 'Una jornada de fotos y video antes de la noche, como el prebook de los 15 de Camila.'));
      }
      if (s.gastro) {
        var d30 = new Date(s.date); d30.setDate(d30.getDate() - 30);
        var t30 = d30 > today ? shortDate(d30) : 'Ya';
        timeline.appendChild(li(t30 + ' · 30 días antes', 'Valor final de gastronomía', 'Catering, barra y pastelería dependen de prestadores externos: su precio se ajusta 30 días antes.'));
      }
      timeline.appendChild(li(longDate(s.date), 'La noche', s.rubros.indexOf('Planificación y coordinación 360°') > -1
        ? 'Supervisión técnica en el lugar durante toda la jornada. Vos disfrutá.'
        : 'Vos disfrutá. Nosotros nos ocupamos del resto.', true));
    }

    if (s.lugar === 'salon') {
      notes.appendChild(note('<b>50% de bonificación</b> en el alquiler del salón de 9 de Julio 2044 al organizar con SB.', 'is-bonus'));
      if (s.inv > 130) notes.appendChild(note('Más de 130 invitados: lo conversamos y vemos la mejor alternativa de espacio.'));
    } else {
      notes.appendChild(note('Cobertura y logística integral en cualquier salón, quinta o estancia de Olavarría y la zona.'));
    }
    if (s.tipo === 'Cumpleaños de 15') {
      notes.appendChild(note('Para los 15 promovemos barras 100% libres de alcohol, con mocktails frutales.'));
    } else if (s.rubros.indexOf('Barra de tragos o mocktails') > -1) {
      notes.appendChild(note('Las cotizaciones base no incluyen alcohol: coordinamos si lo proveen ustedes o suman coctelería.'));
    }
    if (s.nivel === 'Super Premium') {
      var ups = [];
      if (s.rubros.indexOf('Gastronomía y pastelería') > -1) ups.push('cocina de autor con chef en vivo');
      if (s.rubros.indexOf('Técnica, audio e iluminación') > -1) ups.push('puestas lumínicas de gran porte y pantallas');
      if (s.rubros.indexOf('Diseño y ambientación') > -1) ups.push('puestas botánicas de alta escala');
      notes.appendChild(note('<b>Super Premium</b>' + (ups.length ? ': ' + ups.join(', ') + '.' : ': lo escalamos rubro por rubro según tu perfil.')));
    }
    if (!s.rubros.length) notes.appendChild(note('Marcá al menos un rubro para que sepamos qué coordinar.'));
  }

  function message(s) {
    var L = ['*Solicitud de presupuesto — SB Event Planner*', ''];
    L.push('Nombre: ' + s.nombre);
    if (s.tel) L.push('Teléfono: ' + s.tel);
    if (s.mail) L.push('Correo: ' + s.mail);
    L.push('Tipo de evento: ' + s.tipo);
    L.push('Fecha estimada: ' + longDate(s.date) + ' (faltan ' + leadText(monthsUntil(s.date)) + ')');
    L.push('Invitados aprox.: ' + (s.inv >= 400 ? 'más de 400' : s.inv));
    L.push('Lugar: ' + (s.lugar === 'salon' ? 'en el salón de SB (9 de Julio 2044)' : 'en otro salón, quinta o estancia'));
    L.push('Quiero que coordinen: ' + (s.rubros.length ? s.rubros.join(', ') : 'a definir'));
    L.push('Nivel: ' + s.nivel);
    if (s.idea) { L.push(''); L.push('Mi idea: ' + s.idea); }
    L.push('');
    L.push('¿Coordinamos una reunión inicial?');
    return L.join('\n');
  }

  $('send').addEventListener('click', function () {
    var s = state();
    var missing = [];
    if (!s.tipo) missing.push('el tipo de evento');
    if (!s.date) missing.push('la fecha estimada');
    if (!s.nombre) missing.push('tu nombre');
    if (s.date && s.date <= today) missing.push('una fecha futura');
    if (missing.length) {
      err.hidden = false;
      err.textContent = 'Nos falta ' + missing.join(', ').replace(/, ([^,]*)$/, ' y $1') + '.';
      var first = !s.tipo ? document.querySelector('#tipo input') : (!s.date || s.date <= today ? fecha : $('nombre'));
      first.focus();
      if (!s.tipo) document.getElementById('cronograma').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    err.hidden = true;
    window.open(wa(message(s)), '_blank', 'noopener');
  });
  window.__sbMessage = function () { return message(state()); };

  document.querySelectorAll('#planner input, .planner--b input, .planner--b textarea').forEach(function (el) {
    el.addEventListener(el.type === 'range' ? 'input' : 'change', render);
  });
  inv.addEventListener('input', render);

  // preselección: ?tipo=15|boda|corporativo
  var pre = { '15': 'Cumpleaños de 15', boda: 'Boda', corporativo: 'Evento corporativo', social: 'Evento social' }[qs.get('tipo')];
  if (pre) { var r = document.querySelector('input[name=tipo][value="' + pre + '"]'); if (r) r.checked = true; }
  render();
})();
