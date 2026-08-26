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
      meses: '7 meses'
    },
    {
      id: 'psi',
      nombre: 'Psicoterapia Integrativa',
      estado: 'Inscripción abierta',
      que: 'Entrevista, encuadre, escucha clínica y armado de un plan de trabajo por sesiones. La base sobre la que se apoyan todas las demás.',
      temas: ['Primera entrevista', 'Encuadre', 'Plan de sesiones'],
      horas: '220 h',
      meses: '9 meses'
    },
    {
      id: 'leyes',
      nombre: '5 Leyes Biológicas',
      estado: 'Inscripción abierta',
      que: 'El marco teórico completo: las cinco leyes, las fases, cómo se leen y —sobre todo— dónde están sus límites.',
      temas: ['Las 5 leyes', 'Fases', 'Lectura y límites'],
      horas: '90 h',
      meses: '4 meses'
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
      id: 'hip',
      nombre: 'Hipnosis Ericksoniana',
      estado: 'Inscripción abierta',
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

  /* ---------------------------------------------------------
     Datos: la matriz (6 temas × 6 enfoques)
     --------------------------------------------------------- */
  var ENFOQUES = [
    { id: 'psi', sigla: 'Psico', nombre: 'Psicoterapia Integrativa' },
    { id: 'bio', sigla: 'Bio', nombre: 'Biodescodificación' },
    { id: 'leyes', sigla: '5 Leyes', nombre: '5 Leyes Biológicas' },
    { id: 'mind', sigla: 'Mindful', nombre: 'Mindfulness' },
    { id: 'hip', sigla: 'Hipnosis', nombre: 'Hipnosis Ericksoniana' },
    { id: 'flo', sigla: 'Floral', nombre: 'Terapia Floral' }
  ];

  var TEMAS = [
    {
      nombre: 'Ansiedad y crisis',
      celdas: {
        psi: 'Contener la crisis, ordenar el relato y armar un plan de sesiones con objetivos que se puedan chequear.',
        bio: 'Rastrear qué situación se vivió como amenaza y qué quedó sin resolver detrás de ese estado de alerta.',
        leyes: 'Ubicar en qué fase está la persona —alerta sostenida o descarga posterior— y qué se observa en cada una.',
        mind: 'Anclaje en respiración y cuerpo para bajar la activación antes de cualquier otra intervención.',
        hip: 'Inducciones breves de calma y recursos internos que la persona después pueda repetir sola.',
        flo: 'Fórmulas para la emergencia y para el miedo anticipatorio, con seguimiento semana a semana.'
      }
    },
    {
      nombre: 'Duelo y pérdidas',
      celdas: {
        psi: 'Acompañar el proceso sin apurarlo: qué se perdió, qué sigue vivo y qué necesita ser dicho.',
        bio: 'Leer el vínculo con lo perdido y los mandatos familiares que se activan alrededor de esa pérdida.',
        leyes: 'Distinguir la etapa aguda de la etapa de recomposición y qué se espera en cada una.',
        mind: 'Práctica de permanecer con lo que duele, sin evitarlo y sin quedarse a vivir ahí.',
        hip: 'Trabajo con escenas de despedida y cierres simbólicos en estado de relajación profunda.',
        flo: 'Esencias para la tristeza, la nostalgia y la dificultad para volver a arrancar.'
      }
    },
    {
      nombre: 'Vínculos y familia',
      celdas: {
        psi: 'Mapear roles, límites y repeticiones en la trama vincular que la persona tiene hoy.',
        bio: 'Genograma y proyecto-sentido: qué lugar ocupa esta persona en la historia de su familia.',
        leyes: 'Conflictos de territorio, de separación y de nido: cómo se plantean y qué observar.',
        mind: 'Comunicación consciente: escuchar sin reaccionar, hablar sin acusar. Se practica en clase.',
        hip: 'Reencuadre de escenas tempranas que siguen ordenando el vínculo del presente.',
        flo: 'Esencias para la dependencia, el resentimiento y la sobreadaptación al otro.'
      }
    },
    {
      nombre: 'Hábitos y autoexigencia',
      celdas: {
        psi: 'Separar el hábito de la función que cumple, y trabajar sobre esa función.',
        bio: 'Qué necesidad tapa la conducta que se repite, y desde cuándo está instalada.',
        leyes: 'Ciclos de tensión y descarga aplicados a las conductas que vuelven una y otra vez.',
        mind: 'Registrar el impulso antes del acto: la pausa como herramienta central de la práctica.',
        hip: 'Sugestión post-hipnótica y ensayo mental de la conducta nueva, paso por paso.',
        flo: 'Esencias para la rigidez, el perfeccionismo y la dificultad para poner límites propios.'
      }
    },
    {
      nombre: 'Síntoma físico recurrente',
      celdas: {
        psi: 'Escuchar el relato que rodea al síntoma, siempre en paralelo a la consulta médica, nunca en lugar de ella.',
        bio: 'Explorar qué estaba pasando en la vida de la persona cuando ese síntoma apareció por primera vez.',
        leyes: 'El marco completo de las cinco leyes, sus fases y una regla que no se negocia: acompañar, no prometer.',
        mind: 'Relación con el malestar: exploración corporal y regulación de la respuesta al dolor.',
        hip: 'Técnicas de acompañamiento del malestar como complemento del tratamiento médico indicado.',
        flo: 'Esencias para el estado emocional que rodea al cuadro, siempre como complemento.'
      }
    },
    {
      nombre: 'Autoestima e identidad',
      celdas: {
        psi: 'Historia personal, imagen de sí y qué sostiene hoy esa mirada devaluada.',
        bio: 'Lealtades y mandatos: de quién es, en realidad, esa voz que descalifica.',
        leyes: 'Conflictos de desvalorización: cómo se plantean, cómo se leen y qué observar.',
        mind: 'Autocompasión practicada, no declamada: ejercicios concretos para llevar a la sesión.',
        hip: 'Recuperación de recursos propios y anclaje de una imagen de sí más firme.',
        flo: 'Esencias para la inseguridad, la comparación permanente y la falta de confianza.'
      }
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
  var grid = $('#cursosGrid');
  if (grid) {
    grid.innerHTML = CURSOS.map(function (c) {
      var msg = '¡Hola! Me interesa la formación de ' + c.nombre + '. ¿Cuándo arranca la próxima cohorte y cuál es el arancel?';
      return '' +
        '<article class="curso' + (c.destacado ? ' curso--destacado' : '') + ' rv">' +
          '<span class="curso__estado' + (c.proxima ? ' curso__estado--proxima' : '') + '"><i></i>' + c.estado + '</span>' +
          '<h3>' + c.nombre + '</h3>' +
          '<p class="curso__que">' + c.que + '</p>' +
          (c.extra ? '<ul class="curso__extra">' + c.extra.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ul>' : '') +
          '<ul class="curso__temas">' + c.temas.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
          '<ul class="curso__meta">' +
            '<li><span>Carga horaria</span><strong>' + c.horas + '</strong></li>' +
            '<li><span>Duración</span><strong>' + c.meses + '</strong></li>' +
            '<li><span>Modalidad</span><strong>Online en vivo</strong></li>' +
          '</ul>' +
          '<a class="curso__link" href="' + wa(msg) + '" target="_blank" rel="noopener">Consultar fechas y arancel →</a>' +
        '</article>';
    }).join('');
  }

  /* ---------------------------------------------------------
     LA MATRIZ (signature)
     --------------------------------------------------------- */
  var mgrid = $('#mgrid');
  var celdas = [];
  var temasBtn = [];
  var headBtn = [];
  var selT = 0, selE = 1;

  function pintar() {
    temasBtn.forEach(function (b, r) { b.classList.toggle('is-on', r === selT); });
    headBtn.forEach(function (h, c) { h.classList.toggle('is-on', c === selE); });
    celdas.forEach(function (cell) {
      var r = +cell.dataset.r, c = +cell.dataset.c;
      cell.classList.toggle('is-on', r === selT && c === selE);
      cell.classList.toggle('is-row', r === selT && c !== selE);
      cell.classList.toggle('is-col', c === selE && r !== selT);
      cell.setAttribute('aria-selected', (r === selT && c === selE) ? 'true' : 'false');
    });

    var tema = TEMAS[selT];
    var enf = ENFOQUES[selE];
    $('#lecTema').textContent = tema.nombre;
    $('#lecEnf').textContent = enf.sigla;
    $('#lecTexto').textContent = tema.celdas[enf.id];
    $('#lecCurso').textContent = 'Se aprende en: ' + enf.nombre;
    $('#lecWa').href = wa('¡Hola! Vi en la web el cruce de "' + tema.nombre + '" con ' + enf.nombre +
      '. Me gustaría saber más sobre esa formación: fechas, cursada y arancel.');
  }

  if (mgrid) {
    var frag = document.createDocumentFragment();

    var corner = document.createElement('div');
    corner.className = 'mcorner';
    corner.setAttribute('role', 'presentation');
    frag.appendChild(corner);

    ENFOQUES.forEach(function (e, c) {
      var h = document.createElement('button');
      h.type = 'button';
      h.className = 'mhead';
      h.textContent = e.sigla;
      h.title = e.nombre;
      h.addEventListener('click', function () { selE = c; pintar(); });
      headBtn.push(h);
      frag.appendChild(h);
    });

    TEMAS.forEach(function (t, r) {
      var tb = document.createElement('button');
      tb.type = 'button';
      tb.className = 'mcell mtema';
      tb.textContent = t.nombre;
      tb.addEventListener('click', function () { selT = r; pintar(); });
      temasBtn.push(tb);
      frag.appendChild(tb);

      ENFOQUES.forEach(function (e, c) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'mcell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', t.nombre + ' según ' + e.nombre);
        cell.addEventListener('click', function () { selT = r; selE = c; pintar(); });
        celdas.push(cell);
        frag.appendChild(cell);
      });
    });

    mgrid.appendChild(frag);
    pintar();

    // auto-demo: recorre la diagonal una vez al entrar en viewport
    if (!LITE && 'IntersectionObserver' in window) {
      var demoHecha = false;
      var ioM = new IntersectionObserver(function (ent) {
        ent.forEach(function (en) {
          if (!en.isIntersecting || demoHecha) return;
          demoHecha = true;
          var pasos = [[1, 1], [2, 4], [4, 2], [0, 3], [0, 1]];
          pasos.forEach(function (p, k) {
            setTimeout(function () {
              if (mgrid.dataset.tocado === '1') return;
              selT = p[0]; selE = p[1]; pintar();
            }, 500 + k * 1150);
          });
        });
      }, { threshold: .35 });
      ioM.observe(mgrid);
      mgrid.addEventListener('click', function () { mgrid.dataset.tocado = '1'; }, { once: true });
    }
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
    var sel = '.sec-head, .promesa__frase, .promesa__cols article, .curso, .matriz__cuerpo, ' +
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
