/* Vivi Mazzarello · Emprendedora digital — TuPaginaYa */
(function () {
  'use strict';

  var WA = '5493518658382';
  var QA = /[?&]qa\b/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent);
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem('vivi:' + k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('vivi:' + k, JSON.stringify(v)); } catch (e) { /* sin storage */ } }
  };
  function wa(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- fecha de hoy (hora AR) ---------- */
  var DOW = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  var DOW_L = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  function hoyAR() {
    try {
      var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]);
    } catch (e) { return new Date(); }
  }
  var today = hoyAR();
  $('#stampDay').textContent = 'Hoy · ' + DOW_L[today.getDay()];
  $('#stampDate').textContent = today.getDate() + ' ' + MES[today.getMonth()];

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40 || nav.classList.contains('is-open')); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    onScroll();
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- lista "Para hoy" ---------- */
  var saved = store.get('hoy') || {};
  if (saved.d !== today.toDateString()) saved = { d: today.toDateString() };
  var note = $('#todayNote');
  function updNote() {
    var n = $$('#todayList input:checked').length;
    note.textContent = n === 0 ? 'tachá lo que vayas haciendo' : n === 3 ? '¡listo por hoy! un día a la vez.' : n + ' de 3 · vas bien';
  }
  $$('#todayList input').forEach(function (inp) {
    inp.checked = !!saved[inp.dataset.k];
    inp.addEventListener('change', function () { saved[inp.dataset.k] = inp.checked; store.set('hoy', saved); updNote(); });
  });
  updNote();

  /* ---------- reveal + reel ---------- */
  if ('IntersectionObserver' in window && !QA) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .close').forEach(function (el) { io.observe(el); });

    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.3 });
    $$('video[data-autoplay]').forEach(function (v) { vo.observe(v); });
  } else {
    $$('.reveal, .close').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- por dentro ---------- */
  var PARTS = [
    { t: 'Clases paso a paso', p: 'Una sección educativa con todos los videos ordenados: empezás por el principio y avanzás a tu ritmo. Podés volver a mirarlos cuantas veces quieras.', ui: 'clases' },
    { t: 'Biblioteca de anuncios', p: 'Creativos que el programa ya usa para vender. Los descargás y los podés usar desde el primer día, sin tener que diseñarlos vos.', ui: 'anuncios' },
    { t: 'Páginas y sistema de venta', p: 'Las páginas y el sistema de venta vienen armados y probados. No arrancás de cero: aprendés a usarlos y a llevar gente hasta ahí.', ui: 'paginas' },
    { t: 'Comunidad privada', p: 'Un espacio donde están todos los días: preguntas, avisos y celebraciones. La idea es que nunca te quedes sola o solo con una duda.', ui: 'comunidad' },
    { t: 'Sesiones en vivo', p: 'Cada semana hay encuentros en vivo con gente de cada área, que cuenta estrategias y responde dudas en el momento.', ui: 'vivo' },
    { t: 'Encuentros presenciales', p: 'Además de la pantalla, el programa organiza experiencias presenciales para conocerse. Preguntame cuándo y dónde es el próximo.', ui: 'presencial' }
  ];
  var screen = $('#screen'), pT = $('#panelT'), pP = $('#panelP'), pAsk = $('#panelAsk');
  function side(on) { var s = '<div class="ui__side">'; for (var i = 0; i < 6; i++) s += '<i' + (i === on ? ' class="on"' : '') + '></i>'; return s + '</div>'; }
  var UI = {
    clases: function () {
      var c = ''; for (var i = 0; i < 4; i++) c += '<div class="ui__card">' + (i === 0 ? '<span class="ui__play"></span>' : '') + '</div>';
      return side(0) + '<div class="ui__main"><span class="ui__h"></span><div class="ui__row" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr">' + c + '</div><div class="ui__bar"><b style="width:38%"></b></div></div>';
    },
    anuncios: function () {
      var c = ''; for (var i = 0; i < 6; i++) c += '<div class="ui__ad"></div>';
      return side(1) + '<div class="ui__main"><span class="ui__h"></span><div class="ui__row" style="grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr">' + c + '</div></div>';
    },
    paginas: function () {
      return side(2) + '<div class="ui__main"><span class="ui__h"></span><div class="ui__row" style="grid-template-columns:1fr 1fr"><div class="ui__page"><i class="t"></i><i></i><i style="width:80%"></i><i class="b"></i></div><div class="ui__page"><i class="t" style="width:50%"></i><i></i><i></i><i style="width:60%"></i><i class="b"></i></div></div></div>';
    },
    comunidad: function () {
      return side(3) + '<div class="ui__main" style="justify-content:flex-end"><div class="ui__msg"><span></span><p>¿Alguien me ayuda con el paso 3?</p></div><div class="ui__msg"><span style="background:#7a5a3a"></span><p>¡Sí! Fijate el video 3.2 😉</p></div><div class="ui__msg me"><span style="background:var(--red)"></span><p>¡Gracias! Ya me salió 🎉</p></div><div class="ui__bar" style="height:14px;border-radius:7px"></div></div>';
    },
    vivo: function () {
      return side(4) + '<div class="ui__main"><span class="ui__h"></span><div class="ui__card" style="flex:1"><span class="ui__live">EN VIVO</span><span class="ui__play"></span></div><div class="ui__faces" style="flex:0 0 22%"><i></i><i></i><i></i></div></div>';
    },
    presencial: function () {
      return side(5) + '<div class="ui__main"><span class="ui__h"></span><div class="ui__map"><b style="left:30%;top:40%"></b><b style="left:62%;top:28%"></b><b style="left:48%;top:66%"></b></div></div>';
    }
  };
  var tabs = $$('.tabs [role="tab"]');
  function showPart(i, focus) {
    var d = PARTS[i];
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    if (focus) tabs[i].focus();
    screen.innerHTML = '<div class="ui">' + UI[d.ui]() + '</div>';
    pT.textContent = d.t;
    pP.textContent = d.p;
    pAsk.href = wa('Hola Vivi, quiero saber más sobre "' + d.t + '" de Franquicia IA.');
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { showPart(i); });
    b.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (n) { e.preventDefault(); showPart((i + n + tabs.length) % tabs.length, true); }
    });
  });
  showPart(0);

  /* ---------- tu primera semana (signature) ---------- */
  var LBL = {
    tiempo: { poco: 'menos de 30 min por día', medio: 'entre 30 min y 1 h por día', mucho: 'más de 1 h por día' },
    plata: { no: 'hoy no puedo cubrir la entrada', cuotas: 'puedo pagar la entrada en cuotas', si: 'puedo pagar la entrada' },
    redes: { nada: 'casi no uso redes', algo: 'uso redes para mí', bien: 'me muevo bien en redes' },
    vender: { no: 'me cuesta mucho mostrarme y vender', ayuda: 'me animo a vender con ayuda', si: 'me gusta mostrarme y vender' },
    busco: { aprender: 'aprender algo nuevo', extra: 'un ingreso extra', cambio: 'un cambio de rumbo' }
  };
  var KEYS = ['tiempo', 'plata', 'redes', 'vender', 'busco'];
  var ans = store.get('semana') || {};
  var verdictBox = $('#verdict'), vT = $('#verdictT'), vP = $('#verdictP'), daysEl = $('#days');
  var weekWa = $('#weekWa'), weekWaTxt = $('#weekWaTxt'), count = $('#quizCount');

  function lectura(a) {
    if (a.plata === 'no') return { k: 'no', t: 'Hoy, mejor esperá.', p: 'Si hoy no te da el bolsillo, no te endeudes. Mirá la clase gratis, aprendé lo que puedas y volvemos a hablar cuando tengas margen. Mis respuestas no te cuestan nada.' };
    var pts = { poco: 0, medio: 1, mucho: 2, nada: 0, algo: 1, bien: 2, no: 0, ayuda: 1, si: 2 };
    var s = pts[a.tiempo] + pts[a.redes] + pts[a.vender];
    if (s >= 4) return { k: 'si', t: 'Tenés con qué arrancar.', p: 'Tiempo y ganas de mostrarte son lo que más pesa, y los tenés. Igual: mirá la clase completa y hacé todas tus preguntas antes de pagar.' };
    if (s >= 2) return { k: 'quizas', t: 'Se puede, con acompañamiento.', p: 'Vas a tener que aprender cosas nuevas, sobre todo a mostrarte y a vender. Se aprende, pero con paciencia: arrancá despacio y preguntá todo.' };
    return { k: 'no', t: 'Todavía no, y está bien.', p: 'Con poco tiempo y sin ganas de vender, hoy te va a costar. Mirá la clase, animate de a poco y volvé cuando sientas que es tu momento.' };
  }

  function plan(a, l) {
    var min = { poco: '20 min', medio: '45 min', mucho: '1 h' }[a.tiempo] || '30 min';
    var p = [
      'Mirar la clase gratis completa',
      'Anotar tus dudas, sin filtro',
      'Mandarle tus dudas a Vivi',
      'Hacer cuentas: costo, cuotas y tu tiempo'
    ];
    if (l.k === 'no') {
      p.push('Seguir cuentas de marketing y aprender gratis', 'Descansar: esto no es una carrera', 'Ver cómo te sentiste y volver a charlar');
    } else {
      p.push('Decidir: sí, no o todavía no', 'Si entraste: ' + min + ' de clases', a.redes === 'nada' ? 'Abrir o acomodar tu Instagram' : 'Ordenar tu perfil para vender');
    }
    return p;
  }

  function render(animate) {
    KEYS.forEach(function (k) {
      $$('.chips[data-q="' + k + '"] button').forEach(function (b) { b.setAttribute('aria-pressed', String(ans[k] === b.dataset.v)); });
    });
    var n = KEYS.filter(function (k) { return ans[k]; }).length;
    count.textContent = n + ' de 5 respondidas';
    daysEl.innerHTML = '';
    var done = n === 5;
    var l = done ? lectura(ans) : null;
    var tasks = done ? plan(ans, l) : [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      var li = document.createElement('li');
      li.className = 'day' + (done ? (animate ? ' is-in' : '') : ' is-empty');
      if (done && animate) li.style.animationDelay = (i * 70) + 'ms';
      li.innerHTML = '<span class="day__h">' + (i === 0 ? 'HOY' : DOW[d.getDay()]) + '</span><span class="day__n">' + d.getDate() + '</span><span class="day__t">' + (done ? tasks[i] : '·') + '</span>';
      li.setAttribute('aria-label', DOW_L[d.getDay()] + ' ' + d.getDate() + (done ? ': ' + tasks[i] : ''));
      daysEl.appendChild(li);
    }
    verdictBox.classList.toggle('is-no', !!(l && l.k === 'no'));
    if (!done) {
      vT.textContent = n === 0 ? 'Respondé las preguntas y te digo lo que pienso.' : 'Te faltan ' + (5 - n) + (5 - n === 1 ? ' pregunta.' : ' preguntas.');
      vP.textContent = 'Sin vueltas: si hoy no es para vos, también te lo voy a decir.';
      weekWa.setAttribute('aria-disabled', 'true');
      weekWa.href = wa('Hola Vivi, vi tu página.');
      weekWaTxt.textContent = 'Mandale tus respuestas a Vivi';
      return;
    }
    vT.textContent = l.t;
    vP.textContent = l.p;
    var msg = 'Hola Vivi, armé mi primera semana en tu página.\n\n' +
      '• Tiempo: ' + LBL.tiempo[ans.tiempo] + '\n' +
      '• Entrada: ' + LBL.plata[ans.plata] + '\n' +
      '• Redes: ' + LBL.redes[ans.redes] + '\n' +
      '• Vender: ' + LBL.vender[ans.vender] + '\n' +
      '• Busco: ' + LBL.busco[ans.busco] + '\n\n' +
      'La página me dijo: "' + l.t + '" ¿Lo charlamos?';
    weekWa.href = wa(msg);
    weekWa.removeAttribute('aria-disabled');
    weekWaTxt.textContent = l.k === 'no' ? 'Igual quiero charlar con Vivi' : 'Mandale tu semana a Vivi';
  }

  $$('.chips').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var before = KEYS.filter(function (k) { return ans[k]; }).length;
      ans[g.dataset.q] = b.dataset.v;
      store.set('semana', ans);
      var after = KEYS.filter(function (k) { return ans[k]; }).length;
      render(after === 5);
      if (before < 5 && after === 5 && window.innerWidth < 900) {
        $('#read').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  $('#reset').addEventListener('click', function () { ans = {}; store.set('semana', ans); render(false); });
  render(false);

  /* ---------- clase gratis (YouTube a pedido) ---------- */
  $('#ytBtn').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/63dtZ8NXfQI?autoplay=1&rel=0';
    f.title = 'Clase gratis: cómo ganar con la Franquicia IA';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    $('#yt').innerHTML = '';
    $('#yt').appendChild(f);
    saved.clase = true; store.set('hoy', saved);
    var c = $('#todayList input[data-k="clase"]'); if (c) { c.checked = true; updNote(); }
  });

  /* ---------- botón flotante: oculto con los CTA del hero o el cierre a la vista ---------- */
  var fab = $('.fab'), seen = new Map();
  if ('IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
      var any = false; seen.forEach(function (v) { any = any || v; });
      fab.classList.toggle('is-hidden', any);
    }, { threshold: 0.2 });
    fo.observe($('.hero__ctas'));
    fo.observe($('.close'));
  }
})();
