/* =========================================================
   IITI — rediseño 2026-08-26
   ========================================================= */
(function () {
  'use strict';

  var LITE = document.documentElement.classList.contains('lite');
  var QA = document.documentElement.classList.contains('qa');
  var WA = 'https://wa.me/5492216258553?text=';

  /* ---------------------------------------------------------
     Datos: formaciones
     --------------------------------------------------------- */
  var CURSOS = [
    {
      id: 'bio',
      nombre: 'Biodescodificación',
      destacado: true,
      estado: 'Inscripción abierta',
      que: 'La formación más elegida del instituto. Historia personal y familiar, genograma, proyecto-sentido y lectura del conflicto que aparece detrás de lo que la persona consulta. Con criterio, con encuadre y sabiendo cuándo derivar.',
      extra: [
        'Guía de entrevista lista para usar desde la unidad 2',
        'Genograma paso a paso, trabajado sobre casos reales',
        'Ateneo mensual para supervisar tus primeros consultantes',
        'Criterios de derivación: cuándo esto no es lo que corresponde'
      ],
      temas: ['Genograma', 'Proyecto-sentido', 'Entrevista', 'Conflictos programantes', 'Casos en vivo'],
      horas: '160 h',
      meses: '7 meses',
      pdf: 'programas/biodescodificacion.pdf'
    },
    {
      id: 'psi',
      nombre: 'Diplomado en Psicoterapia Orgánica Integral',
      estado: 'Inscripción abierta',
      que: 'Entrevista, encuadre, escucha clínica y armado de un plan de trabajo por sesiones. La base sobre la que se apoyan todas las demás.',
      temas: ['Primera entrevista', 'Encuadre', 'Plan de sesiones'],
      horas: '120 h',
      meses: '5 meses',
      pdf: 'programas/psicoterapia-organica-integral.pdf'
    },
    {
      id: 'leyes-intensivo',
      nombre: 'Curso Intensivo de 5 Leyes Biológicas',
      estado: 'Inscripción abierta',
      que: 'El marco teórico completo en formato intensivo: las cinco leyes, las fases y cómo se leen.',
      temas: ['Las 5 leyes', 'Fases', 'Lectura de casos'],
      horas: '48 h',
      meses: '2 meses',
      pdf: 'programas/intensivo-5-leyes-biologicas.pdf'
    },
    {
      id: 'leyes-basico',
      nombre: 'Curso Básico de 5 Leyes Biológicas',
      estado: 'Inscripción abierta',
      que: 'El marco teórico completo, con más tiempo de práctica y trabajo sobre casos que el intensivo.',
      temas: ['Las 5 leyes', 'Fases', 'Práctica sobre casos'],
      horas: '80 h',
      meses: '3 meses'
    },
    {
      id: 'leyes-avanzado',
      nombre: 'Diplomado de Profundización Avanzado en 5 Leyes Biológicas',
      estado: 'Inscripción abierta',
      que: 'Profundización para quienes ya cursaron el nivel básico o intensivo: casos complejos, supervisión y criterio clínico avanzado.',
      temas: ['Casos complejos', 'Supervisión', 'Criterio clínico avanzado'],
      horas: '120 h',
      meses: '5 meses',
      pdf: 'programas/diplomado-avanzado-5-leyes-biologicas.pdf'
    },
    {
      id: 'mind',
      nombre: 'Instructorado en Mindfulness',
      estado: 'Próxima cohorte',
      proxima: true,
      que: 'Práctica personal sostenida, protocolo de 8 semanas y las herramientas para conducir tu propio grupo.',
      temas: ['Práctica personal', 'Protocolo 8 semanas', 'Conducción de grupos'],
      horas: '80 h',
      meses: '3 meses'
    },
    {
      id: 'mind-psico',
      nombre: 'Mindfulness en Psicoterapia',
      estado: 'Próxima cohorte',
      proxima: true,
      que: 'Herramientas de mindfulness aplicadas al consultorio: regulación emocional, manejo de crisis y protocolos breves para incorporar en sesión.',
      temas: ['Regulación emocional', 'Manejo de crisis', 'Protocolos breves en sesión'],
      horas: '60 h',
      meses: '3 meses'
    },
    {
      id: 'hip',
      nombre: 'Hipnosis: Ericksoniana, clínica y de regresión',
      estado: 'Próxima cohorte',
      proxima: true,
      que: 'Inducciones, lenguaje hipnótico, trabajo con recursos internos y cierre seguro de la sesión.',
      temas: ['Inducciones', 'Lenguaje hipnótico', 'Sugestión', 'Cierre'],
      horas: '120 h',
      meses: '5 meses'
    },
    {
      id: 'flo',
      nombre: 'Terapia Floral',
      estado: 'Inscripción abierta',
      que: 'Sistema Bach completo: las 38 esencias, la entrevista, el criterio de selección y el seguimiento del consultante.',
      temas: ['38 esencias', 'Entrevista', 'Fórmulas', 'Seguimiento'],
      horas: '100 h',
      meses: '5 meses'
    }
  ];

  // cursos cortos (info y fechas por WhatsApp)
  var CORTOS = [
    {
      nombre: 'Constelaciones esquizofrénicas desde la Nueva Medicina Germánica',
      estado: 'Consultá fechas',
      proxima: true,
      que: 'Las constelaciones esquizofrénicas leídas desde el marco de la Nueva Medicina Germánica.',
      meses: '3 meses',
      modalidad: 'Online'
    },
    {
      nombre: 'Constelaciones esquizofrénicas y Flores de Bach',
      estado: 'Consultá fechas',
      proxima: true,
      que: 'Las constelaciones esquizofrénicas trabajadas junto con el sistema de Flores de Bach.',
      meses: '3 meses',
      modalidad: 'Online'
    },
    {
      nombre: '5 Leyes Biológicas y Flores de Bach',
      estado: 'Consultá fechas',
      proxima: true,
      que: 'El marco de las 5 Leyes Biológicas combinado con el sistema de Flores de Bach.',
      meses: '3 meses',
      modalidad: 'Online'
    },
    {
      nombre: '5 Leyes Biológicas y Fitoterapia',
      estado: 'Curso grabado',
      grabado: true,
      que: 'Las 5 Leyes Biológicas junto con la fitoterapia, en formato grabado para ver a tu ritmo.',
      meses: 'A tu ritmo',
      modalidad: 'Grabado'
    }
  ];

  function $(s, c) { return (c || document).querySelector(s); }
  function wa(t) { return WA + encodeURIComponent(t); }

  /* ---------------------------------------------------------
     Año
     --------------------------------------------------------- */
  var anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Nav
     --------------------------------------------------------- */
  var nav = $('#nav');
  var burger = $('#burger');

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.nav__links a'), function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });

  var lastY = -1;
  function onScroll() {
    var y = window.scrollY;
    if ((y > 8) !== (lastY > 8)) nav.classList.toggle('is-stuck', y > 8);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Hero — las 6 disciplinas escritas una atrás de la otra
     --------------------------------------------------------- */
  var lista = $('#heroLista');
  if (lista) {
    var PALABRAS = [
      'psicoterapia.', 'biodescodificación.', '5 leyes biológicas.',
      'mindfulness.', 'hipnosis.', 'terapia floral.'
    ];
    if (LITE || QA) {
      lista.textContent = 'biodescodificación.';
    } else {
      var i = 0, j = 0, borrando = false;
      (function tipear() {
        var p = PALABRAS[i];
        j += borrando ? -1 : 1;
        lista.textContent = p.slice(0, j);
        var t = borrando ? 34 : 62;
        if (!borrando && j === p.length) { borrando = true; t = 1900; }
        else if (borrando && j === 0) { borrando = false; i = (i + 1) % PALABRAS.length; t = 260; }
        setTimeout(tipear, t);
      })();
    }
  }

  /* ---------------------------------------------------------
     Video del hero (data-src: en LITE ni se pide)
     --------------------------------------------------------- */
  var v = $('#heroVideo');
  if (v && !LITE) {
    v.src = v.dataset.src;
    v.autoplay = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------------------------------------------------------
     Formaciones
     --------------------------------------------------------- */
  function tarjeta(c) {
    var msg = c.grabado
      ? '¡Hola! Me interesa el curso grabado de ' + c.nombre + '. ¿Cómo accedo y cuál es el arancel?'
      : '¡Hola! Me interesa ' + (c.horas ? 'la formación' : 'el curso') + ' de ' + c.nombre + '. ¿Cuándo arranca la próxima cohorte y cuál es el arancel?';
    return '' +
      '<article class="curso' + (c.destacado ? ' curso--destacado' : '') + ' rv">' +
        '<span class="curso__estado' + (c.proxima ? ' curso__estado--proxima' : '') + '"><i></i>' + c.estado + '</span>' +
        '<h3>' + c.nombre + '</h3>' +
        '<p class="curso__que">' + c.que + '</p>' +
        (c.extra ? '<ul class="curso__extra">' + c.extra.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>' : '') +
        (c.temas ? '<ul class="curso__temas">' + c.temas.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') +
        '<ul class="curso__meta">' +
          (c.horas ? '<li><span>Carga horaria</span><strong>' + c.horas + '</strong></li>' : '') +
          '<li><span>Duración</span><strong>' + c.meses + '</strong></li>' +
          '<li><span>Modalidad</span><strong>' + (c.modalidad || 'Online en vivo') + '</strong></li>' +
        '</ul>' +
        (c.pdf ? '<a class="curso__pdf" href="' + c.pdf + '" target="_blank" rel="noopener">Ver programa (PDF)</a>' : '') +
        '<a class="curso__link" href="' + wa(msg) + '" target="_blank" rel="noopener">' + (c.grabado ? 'Pedir acceso y arancel' : 'Consultar fechas y arancel') + ' →</a>' +
      '</article>';
  }
  var grid = $('#cursosGrid');
  if (grid) grid.innerHTML = CURSOS.map(tarjeta).join('');
  var cortos = $('#cortosGrid');
  if (cortos) cortos.innerHTML = CORTOS.map(tarjeta).join('');

  /* ---------------------------------------------------------
     Clase gratuita — el iframe de Drive se carga recién al dar play
     --------------------------------------------------------- */
  var cLista = $('#claseLista');
  var cPantalla = $('#clasePantalla');
  if (cLista && cPantalla) {
    var cBtns = cLista.querySelectorAll('button');
    var cActual = cBtns[0];

    var cargar = function () {
      cPantalla.innerHTML = '<iframe src="https://drive.google.com/file/d/' + cActual.dataset.id +
        '/preview" title="Clase ' + cActual.dataset.n + ' — Introducción a las 5 Leyes Biológicas" ' +
        'allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>';
    };
    var portada = function () {
      cPantalla.innerHTML = '<button type="button" class="clase__play" aria-label="Reproducir la clase ' + cActual.dataset.n + '">' +
        '<i aria-hidden="true"></i><strong>Clase ' + cActual.dataset.n + '</strong><small>Video en Google Drive</small></button>';
    };

    cPantalla.addEventListener('click', function (e) {
      if (e.target.closest('.clase__play')) cargar();
    });
    Array.prototype.forEach.call(cBtns, function (btn) {
      btn.addEventListener('click', function () {
        var habiaVideo = !!cPantalla.querySelector('iframe');
        cActual = btn;
        Array.prototype.forEach.call(cBtns, function (x) { x.classList.toggle('is-on', x === btn); });
        $('#claseDrive').href = 'https://drive.google.com/file/d/' + btn.dataset.id + '/view?usp=sharing';
        if (habiaVideo) cargar(); else portada();
        if (window.innerWidth <= 1100) cPantalla.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  /* ---------------------------------------------------------
     Contadores de la barra de datos
     --------------------------------------------------------- */
  var datos = document.getElementById('datos');
  if (datos && !LITE && !QA && 'IntersectionObserver' in window) {
    var ioD = new IntersectionObserver(function (ent, obs) {
      ent.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        Array.prototype.forEach.call(en.target.querySelectorAll('strong[data-num]'), function (s) {
          var fin = +s.dataset.num, pre = s.dataset.pre || '', t0 = performance.now(), dur = 1100;
          (function paso(now) {
            var k = Math.min(1, (now - t0) / dur);
            var val = Math.round(fin * (1 - Math.pow(1 - k, 3)));
            s.textContent = pre + val.toLocaleString('es-AR');
            if (k < 1) requestAnimationFrame(paso);
          })(t0);
        });
      });
    }, { threshold: .4 });
    ioD.observe(datos);
  }

  /* ---------------------------------------------------------
     Reveals
     --------------------------------------------------------- */
  if (!LITE && !QA && 'IntersectionObserver' in window) {
    var sel = '.sec-head, .promesa__frase, .promesa__cols article, .curso, .clase__lista, .clase__player, ' +
              '.pasos li, .instituto__texto, .instituto__sello, .voz, .faq__head, .faq__lista, .cierre__in, .datos';
    var items = document.querySelectorAll(sel);
    Array.prototype.forEach.call(items, function (el) { el.classList.add('rv'); });
    var ioR = new IntersectionObserver(function (ent, obs) {
      ent.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        var sib = Array.prototype.indexOf.call(en.target.parentNode.children, en.target);
        en.target.style.transitionDelay = Math.min(sib, 5) * 65 + 'ms';
        en.target.classList.add('is-in');
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (el) { ioR.observe(el); });
  }

  /* ---------------------------------------------------------
     Watchdog de FPS — si el equipo sufre, cae a LITE
     --------------------------------------------------------- */
  if (!LITE && !sessionStorage.getItem('iiti_lite_check')) {
    var frames = 0, ini = performance.now();
    (function medir(now) {
      frames++;
      if (now - ini < 2000) { requestAnimationFrame(medir); return; }
      var fps = frames / ((now - ini) / 1000);
      sessionStorage.setItem('iiti_lite_check', '1');
      if (fps < 28) {
        document.documentElement.classList.add('lite');
        if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
      }
    })(ini);
  }
})();
