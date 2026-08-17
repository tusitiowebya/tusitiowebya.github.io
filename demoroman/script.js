/* =========================================================
   Estudio Jurídico Román y Asoc. — TuPaginaYa
   ========================================================= */
(function () {
  'use strict';

  var WA = '5491139330909';

  /* ---------- año ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  var fab = document.querySelector('.fab');
  var hero = document.querySelector('.hero__paper');

  function onScroll() {
    var y = window.scrollY;
    var limit = hero ? hero.offsetHeight - 70 : 400;
    var overPaper = y <= limit && !links.classList.contains('is-open');
    // sobre el papel el nav va transparente con tinta; recién al salir se vuelve barra oscura
    nav.classList.toggle('is-stuck', !overPaper && y > 30);
    nav.classList.toggle('is-top', overPaper);
    if (fab) fab.classList.toggle('is-on', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      onScroll();
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        onScroll();
      }
    });
  }

  /* ---------- reveal ---------- */
  var rvTargets = document.querySelectorAll(
    '.ficha, .sechead, .idx__row, .lesa__media, .lesa__txt, .perfil__txt, .perfil__media, .pasos3__list li, .faq__it, .cta__in > *, .pasos__panel, .pasos__tabs'
  );
  Array.prototype.forEach.call(rvTargets, function (el, i) {
    el.classList.add('rv');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  Array.prototype.forEach.call(rvTargets, function (el) { io.observe(el); });

  /* ---------- índice de áreas (acordeón) ---------- */
  var rows = document.querySelectorAll('.idx__row');
  Array.prototype.forEach.call(rows, function (row) {
    var head = row.querySelector('.idx__head');
    var body = row.querySelector('.idx__body');
    head.addEventListener('click', function () {
      var open = row.classList.contains('is-open');
      Array.prototype.forEach.call(rows, function (r) {
        r.classList.remove('is-open');
        r.querySelector('.idx__body').style.height = '0px';
        r.querySelector('.idx__head').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        row.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
        body.style.height = body.firstElementChild.offsetHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', function () {
    var open = document.querySelector('.idx__row.is-open');
    if (open) {
      var b = open.querySelector('.idx__body');
      b.style.height = b.firstElementChild.offsetHeight + 'px';
    }
  });

  /* =========================================================
     SIGNATURE — "El plazo corre"
     ========================================================= */
  var SITUACIONES = [
    {
      id: 'detencion',
      tab: 'Detuvieron a un familiar',
      ttl: 'Detuvieron a un familiar',
      desc: 'Las primeras horas definen buena parte de la causa: quién lo asiste, qué declara y con qué se llega a la audiencia.',
      norma: 'Art. 18 CN',
      pasos: [
        { t: 'Ahora', w: 'Ubicá dónde está', d: 'Dependencia, fiscalía interviniente y carátula. Con esos tres datos se puede intervenir.' },
        { t: 'Primeras horas', w: 'Designá defensor de confianza', d: 'Se puede reemplazar al defensor oficial en cualquier momento. Cuanto antes, mejor prepara la audiencia.' },
        { t: '24 h', w: 'Audiencia de control', d: 'Se discute la legalidad de la detención y la libertad. Ahí se juega el primer round.' },
        { t: '48–72 h', w: 'Excarcelación', d: 'Pedido de libertad con la prueba de arraigo: domicilio, trabajo, familia, antecedentes.' }
      ],
      no: [
        'No lo dejes declarar sin abogado de confianza.',
        'No firmes nada que no hayas leído entero.',
        'No mandes audios ni mensajes a la presunta víctima.',
        'No borres el celular: puede ser prueba a favor.'
      ],
      cierre: 'Si la detención fue hoy, escribinos ahora. Se puede intervenir antes de la audiencia.',
      wa: 'Hola, DETUVIERON A UN FAMILIAR. Te cuento la situación:',
      cta: 'Escribir por una detención'
    },
    {
      id: 'genero',
      tab: 'Sufrí violencia de género',
      ttl: 'Sufrí violencia de género',
      desc: 'Primero la seguridad, después el expediente. Las medidas de protección se piden y se otorgan rápido cuando están bien fundadas.',
      norma: 'Ley 26.485',
      pasos: [
        { t: 'Ahora', w: 'Lugar seguro y línea 144', d: 'Atiende 24 h, es gratuita y confidencial. Si hay riesgo inmediato, 911.' },
        { t: 'Primeras horas', w: 'Guardá la prueba', d: 'Capturas de mensajes, audios, fotos de lesiones con fecha, testigos. No la borres nunca.' },
        { t: '24 h', w: 'Denuncia y constatación', d: 'Denuncia con relato completo de la escalada, no solo del último episodio. Constatación médica de lesiones.' },
        { t: '48–72 h', w: 'Medidas de protección', d: 'Exclusión del hogar, prohibición de acercamiento, botón antipánico y, si corresponde, alimentos provisorios.' }
      ],
      no: [
        'No te quedes con "es la primera vez": contá toda la historia.',
        'No borres los mensajes aunque duela leerlos.',
        'No firmes acuerdos privados sin asesorarte.',
        'No dejes pasar los incumplimientos: se denuncian.'
      ],
      cierre: 'Te acompañamos en la denuncia y pedimos las medidas el mismo día. Consulta confidencial.',
      wa: 'Hola, necesito asesoramiento por VIOLENCIA DE GÉNERO. Te cuento:',
      cta: 'Consulta confidencial'
    },
    {
      id: 'citacion',
      tab: 'Me citaron a declarar',
      ttl: 'Me citaron a declarar',
      desc: 'Antes de ir hay que saber en qué carácter te citan. No es lo mismo ir de testigo que de imputado, y la cédula no siempre lo aclara.',
      norma: 'Derecho a no declarar',
      pasos: [
        { t: 'Ahora', w: 'Leé bien la cédula', d: 'Fecha, juzgado o fiscalía, número de causa y en qué carácter te citan. Sacale una foto.' },
        { t: 'Antes de ir', w: 'Consultá con un abogado', d: 'Se pide vista del expediente para saber qué se investiga y qué prueba hay.' },
        { t: 'El día', w: 'Andá acompañada', d: 'Si sos imputado tenés derecho a declarar, a negarte y a hacerlo por escrito. Negarte no te perjudica.' },
        { t: 'Después', w: 'Seguimiento', d: 'Pedir copia de lo actuado y definir si conviene ofrecer prueba propia.' }
      ],
      no: [
        'No faltes sin justificar: pueden llevarte por la fuerza pública.',
        'No improvises respuestas sobre fechas que no recordás.',
        'No vayas sin haber visto el expediente.',
        'No lleves documentación sin revisarla antes.'
      ],
      cierre: 'Mandanos una foto de la cédula y te decimos qué significa y cómo conviene presentarse.',
      wa: 'Hola, ME CITARON A DECLARAR y quiero asesorarme antes de ir. Te cuento:',
      cta: 'Enviar la cédula'
    },
    {
      id: 'victima',
      tab: 'Soy víctima de un delito',
      ttl: 'Soy víctima de un delito',
      desc: 'Denunciar no es lo mismo que ser parte. Constituyéndote como querellante podés impulsar la causa en vez de esperar que alguien la mueva.',
      norma: 'Ley 27.372',
      pasos: [
        { t: 'Ahora', w: 'Denuncia y prueba', d: 'Denunciá con el mayor detalle posible y guardá todo: tickets, fotos, mensajes, datos de testigos.' },
        { t: '24–72 h', w: 'Pedí el número de causa', d: 'Sin número de expediente no se puede seguir nada. Anotá fiscalía y secretaría.' },
        { t: '15 días', w: 'Constituirte como querellante', d: 'Te convierte en parte: podés pedir medidas de prueba, apelar y ser oída en cada decisión.' },
        { t: 'Después', w: 'Impulso y reparación', d: 'Control de la investigación y reclamo de la reparación económica del daño sufrido.' }
      ],
      no: [
        'No supongas que la causa avanza sola.',
        'No entregues originales: siempre copias.',
        'No arregles con el imputado sin asesorarte.',
        'No dejes de informar cambios de domicilio o teléfono.'
      ],
      cierre: 'Revisamos en qué estado está tu causa y te decimos si conviene presentarte como querellante.',
      wa: 'Hola, SOY VÍCTIMA DE UN DELITO y quiero saber cómo seguir. Te cuento:',
      cta: 'Consultar por mi causa'
    },
    {
      id: 'lesa',
      tab: 'Familiar víctima de lesa humanidad',
      ttl: 'Soy familiar de una víctima de lesa humanidad',
      desc: 'Son delitos imprescriptibles: no importa cuánto tiempo pasó. Lo que sí importa es reconstruir la documentación.',
      norma: 'Imprescriptible',
      pasos: [
        { t: 'Primer paso', w: 'Reuní lo que haya en casa', d: 'Actas, cartas, fotos, libretas de trabajo, recortes. Todo suma, aunque parezca menor.' },
        { t: 'Relevamiento', w: 'Búsqueda en archivos', d: 'Archivos provinciales, registros civiles, legajos militares y policiales, prensa de época.' },
        { t: 'Presentación', w: 'Querella', d: 'Presentación como parte querellante en la causa, con el vínculo familiar acreditado.' },
        { t: 'Proceso', w: 'Impulso sostenido', d: 'Son causas largas: se trabaja con equipos de investigación y organismos de derechos humanos.' }
      ],
      no: [
        'No descartes documentación por vieja o incompleta.',
        'No entregues originales familiares: se digitalizan.',
        'No asumas que "ya prescribió": estos delitos no prescriben.',
        'No trabajes solo de memoria: hay que documentar.'
      ],
      cierre: 'Contanos el vínculo y qué documentación tenés. Te decimos si hay causa donde presentarse.',
      wa: 'Hola, soy familiar de una víctima y consulto por una causa de LESA HUMANIDAD. Te cuento:',
      cta: 'Escribir por una querella'
    }
  ];

  var tabsEl = document.getElementById('pasosTabs');
  var tlFill = document.getElementById('tlFill');
  var tlSteps = document.getElementById('tlSteps');
  var elTtl = document.getElementById('pasosTtl');
  var elDesc = document.getElementById('pasosDesc');
  var elNorma = document.getElementById('pasosNorma');
  var elNo = document.getElementById('pasosNo');
  var elCierre = document.getElementById('pasosCierre');
  var elWa = document.getElementById('pasosWa');
  var current = 0;
  var seen = false;

  if (tabsEl) {
    SITUACIONES.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'tab' + (i === 0 ? ' is-on' : '');
      b.type = 'button';
      b.textContent = s.tab;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { render(i, true); });
      tabsEl.appendChild(b);
    });

    render(0, false);

    var panelIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen) {
          seen = true;
          runTimeline();
        }
      });
    }, { threshold: 0.3 });
    panelIo.observe(document.getElementById('pasosPanel'));
  }

  function render(i, animate) {
    current = i;
    var s = SITUACIONES[i];

    Array.prototype.forEach.call(tabsEl.children, function (b, k) {
      b.classList.toggle('is-on', k === i);
      b.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });

    elTtl.textContent = s.ttl;
    elDesc.textContent = s.desc;
    elNorma.textContent = s.norma;

    tlSteps.innerHTML = '';
    s.pasos.forEach(function (p) {
      var d = document.createElement('div');
      d.className = 'tl__step';
      d.innerHTML =
        '<span class="tl__when"></span>' +
        '<p class="tl__what"></p>' +
        '<p class="tl__det"></p>';
      d.querySelector('.tl__when').textContent = p.t;
      d.querySelector('.tl__what').textContent = p.w;
      d.querySelector('.tl__det').textContent = p.d;
      tlSteps.appendChild(d);
    });

    elNo.innerHTML = '';
    s.no.forEach(function (n) {
      var li = document.createElement('li');
      li.textContent = n;
      elNo.appendChild(li);
    });

    elCierre.textContent = s.cierre;
    elWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(s.wa);
    elWa.innerHTML = elWa.innerHTML.replace(/(<\/svg>)[\s\S]*$/, '$1') + ' ' + s.cta;

    tlFill.style.width = '0%';
    if (animate || seen) runTimeline();
  }

  function runTimeline() {
    var steps = tlSteps.querySelectorAll('.tl__step');
    tlFill.style.width = '0%';
    // reflow para reiniciar la transición
    void tlFill.offsetWidth;
    tlFill.style.width = '100%';
    Array.prototype.forEach.call(steps, function (st, k) {
      st.classList.remove('is-in');
      setTimeout(function () { st.classList.add('is-in'); }, 120 + k * 230);
    });
  }
})();
