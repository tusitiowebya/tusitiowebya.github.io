/* =========================================================
   MAB DIGITAL GROUP — script
   ========================================================= */
(function () {
  'use strict';

  var WA = '5491161219590';

  /* ---------- iconos ---------- */
  var ICO = {
    search : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    code   : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18l-5-6 5-6M16 6l5 6-5 6"/></svg>',
    box    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    crown  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l4 4 5-7 5 7 4-4v11H3z"/></svg>',
    brain  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a3 3 0 0 0-3 3v10a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3z"/><path d="M9 8H7a3 3 0 0 0 0 6h2M15 8h2a3 3 0 0 1 0 6h-2"/></svg>',
    doc    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    users  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0-2-5.2M16.5 20a5.6 5.6 0 0 0-1.2-3.5"/></svg>',
    spark  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z"/></svg>',
    clock  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
    chart  : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    chat   : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>',
    star   : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 10l6.1-.9z"/></svg>',
    link   : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l2-2A5 5 0 0 0 12.4 4.4l-1.2 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2A5 5 0 0 0 11.6 19.6l1.2-1.1"/></svg>',
    map    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2z"/><path d="M9 3v16M15 5v16"/></svg>',
    chart2 : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".9" fill="currentColor"/></svg>',
    spark2 : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4L2.5 9 12 14l9.5-5z"/><path d="M6.5 11.4V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.6M21.5 9v5"/></svg>',
    users2 : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="3.4"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 12.5l2 2 3.5-3.6"/></svg>'
  };

  /* ---------- catálogo de servicios ---------- */
  var SERVICIOS = {
    empresa: [
      { i:'search', t:'Búsqueda y selección de talentos', a:'Selección',
        d:'Publicamos, buscamos y entrevistamos con el modelo de evaluación por competencias. En 7 días empezás a conocer a tus potenciales candidatos.',
        k:'seleccion selección busqueda búsqueda talentos reclutamiento personal empleado contratar terna cv competencias' },
      { i:'brain', t:'Psicotécnicos y evaluaciones operativas', a:'Evaluación',
        d:'Informe psicotécnico y evaluación por competencias antes del ingreso o para una promoción interna. Te entregamos el perfil del candidato por escrito.',
        k:'psicotecnico psicotécnico evaluacion evaluación operativa test competencias informe apto ingreso' },
      { i:'chart', t:'Diseño de puestos y organigrama', a:'Organización',
        d:'Diseñamos cada puesto junto al responsable del área: qué hace, de quién depende y cómo se mide. Base para contratar, evaluar y ordenar sueldos.',
        k:'diseño puestos descripcion descripción organigrama estructura roles funciones responsables productivo' },
      { i:'spark', t:'Consultoría en desarrollo organizacional', a:'Consultoría',
        d:'Estudio de la empresa y diagnóstico, elaboración del proyecto estructural y puesta en práctica de las soluciones. Te acompañamos 15 días para que veas resultados.',
        k:'consultoria consultoría desarrollo organizacional diagnostico diagnóstico proyecto estructura organizacion cambio' },
      { i:'chart2', t:'Auditoría comercial', a:'Comercial',
        d:'¿Por qué perdés clientes? Revisamos selección de comerciales, administración comercial, puntos de venta y marketing, y te damos la respuesta en 24 horas.',
        k:'auditoria auditoría comercial ventas vendedores agentes puntos de venta marketing clientes facturacion' },
      { i:'users', t:'Evaluación y rotación de personal interno', a:'Interno',
        d:'Analizamos al equipo que ya tenés: quién está en el puesto equivocado, quién puede crecer y por qué se te va la gente.',
        k:'evaluacion evaluación rotacion rotación interno equipo clima desempeño promocion promoción retencion' },
      { i:'spark2', t:'Capacitaciones a medida', a:'Capacitación',
        d:'Talleres armados para tu equipo: liderazgo, ventas, atención al cliente, trabajo en equipo. Presenciales o por videollamada.',
        k:'capacitacion capacitación talleres formacion formación entrenamiento liderazgo ventas atencion equipo curso' },
      { i:'star', t:'Identidad corporativa', a:'Marketing',
        d:'La pata de marketing de MAB: identidad de marca, comunicación interna y presencia digital para que tu empresa se vea como lo que es.',
        k:'identidad corporativa marca branding marketing comunicacion comunicación imagen digital redes diseño' },
      { i:'users2', t:'Seguimiento de la inducción', a:'Onboarding',
        d:'Acompañamos al ingresante desde el primer día hasta el plan de carrera, con informe de avance para vos. La gente que ingresa bien se queda.',
        k:'induccion inducción onboarding ingreso seguimiento plan de carrera integracion retencion primeros dias' },
      { i:'doc', t:'Administración general de RRHH', a:'Administración',
        d:'Legajos, documentación, control de ausentismo y orden del área. Ideal para la PyME donde RRHH lo hace el dueño o el contador.',
        k:'administracion administración general legajos documentacion ausentismo altas bajas laboral rrhh orden' }
    ],
    candidato: [
      { i:'doc', t:'Armado de CV en formato APS', a:'CV',
        d:'Te armamos el CV con el formato que los sistemas de selección leen bien y el reclutador entiende en 10 segundos. En 7 días mostrás tu potencial renovado.',
        k:'cv curriculum currículum aps armado formato rediseño hoja de vida mejorar' },
      { i:'link', t:'Perfil de LinkedIn', a:'LinkedIn',
        d:'Titular, extracto y experiencia ajustados para que aparezcas en las búsquedas de los reclutadores de tu rubro.',
        k:'linkedin perfil red profesional visibilidad reclutadores online busqueda' },
      { i:'star', t:'Perfil de Instagram profesional', a:'Perfil IG',
        d:'Si trabajás por tu cuenta o vendés tu servicio, tu Instagram es tu vidriera. Lo ordenamos para que comunique lo que sabés hacer.',
        k:'instagram ig perfil redes vidriera emprendedor marca personal contenido' },
      { i:'spark', t:'Marketing personal', a:'Marca personal',
        d:'Cómo te presentás, qué contás primero y cómo sostener eso en cada entrevista y en cada red. Tu experiencia vale más si sabés mostrarla.',
        k:'marketing personal marca imagen presentacion presentación pitch entrevista comunicacion' },
      { i:'chat', t:'Coach laboral', a:'Coaching',
        d:'Acompañamiento uno a uno: preparación de entrevistas, cómo hablar de sueldo, cómo salir de un trabajo que no va y qué buscar después.',
        k:'coach coaching laboral entrevista preparacion preparación sueldo pretensiones cambio orientacion ayuda' },
      { i:'map', t:'Perfil y búsqueda laboral', a:'Inserción',
        d:'¿Tenés problemas para insertarte en el mundo laboral o para desarrollar tu perfil profesional? Armamos juntos el plan: qué puestos te dan tu experiencia y dónde buscar.',
        k:'insercion inserción perfil busqueda búsqueda laboral empleo trabajo primer plan rubro reconversion' },
      { i:'users', t:'Sumate a la base de talento', a:'Gratis',
        d:'Mandanos tu CV por WhatsApp y quedás en nuestra base: te escribimos cuando salga una búsqueda que encaje con tu perfil. Sin costo.',
        k:'base talento cv cargar postular sumarme gratis vacantes busquedas activas empleo trabajo' }
    ]
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var state = { mode: 'empresa', q: '', area: 'Todos' };

  /* =========================================================
     NAV
     ========================================================= */
  var nav = $('#nav');
  function onScroll(){ nav.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  var burger = $('#burger'), menu = $('#mobileMenu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.classList.remove('on');
      burger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    });
  });

  /* =========================================================
     REVEAL
     ========================================================= */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, idx) {
      if (e.isIntersecting) {
        var el = e.target;
        setTimeout(function () { el.classList.add('in'); }, idx * 90);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* =========================================================
     SWITCH empresa / candidato
     ========================================================= */
  var glider = $('.switch-glider');

  function moveGlider(){
    var on = $('.switch-btn.is-on');
    if (!on || !glider) return;
    glider.style.width = on.offsetWidth + 'px';
    glider.style.transform = 'translateX(' + (on.offsetLeft - 5) + 'px)';
  }

  function applyModeTexts(){
    $$('[data-empresa]').forEach(function (el) {
      var val = el.getAttribute('data-' + state.mode);
      if (val) el.textContent = val;
    });
  }

  function setMode(mode){
    state.mode = mode;
    document.documentElement.setAttribute('data-mode', mode);
    $$('.switch-btn').forEach(function (b) {
      var on = b.dataset.mode === mode;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    moveGlider();
    applyModeTexts();
    state.area = 'Todos';
    renderChips();
    renderServices();
  }

  $$('.switch-btn').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.mode); });
  });
  window.addEventListener('resize', moveGlider);

  /* =========================================================
     BUSCADOR DE SERVICIOS
     ========================================================= */
  var grid   = $('#svcGrid');
  var empty  = $('#svcEmpty');
  var count  = $('#svcCount');
  var chips  = $('#chips');
  var input  = $('#svcSearch');
  var clear  = $('#svcClear');

  function norm(s){
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function areas(){
    var out = ['Todos'];
    SERVICIOS[state.mode].forEach(function (s) {
      if (out.indexOf(s.a) === -1) out.push(s.a);
    });
    return out;
  }

  function renderChips(){
    chips.innerHTML = areas().map(function (a) {
      return '<button class="chip' + (a === state.area ? ' on' : '') + '" data-area="' + a + '">' + a + '</button>';
    }).join('');
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    state.area = b.dataset.area;
    renderChips();
    renderServices();
  });

  function match(s){
    var q = norm(state.q);
    var okArea = state.area === 'Todos' || s.a === state.area;
    var okQ = !q || norm(s.t + ' ' + s.d + ' ' + s.k + ' ' + s.a).indexOf(q) !== -1;
    return okArea && okQ;
  }

  function waLink(s){
    var txt = state.mode === 'empresa'
      ? 'Hola MAB! Me interesa el servicio de "' + s.t + '". ¿Me pasan info?'
      : 'Hola MAB! Estoy buscando trabajo y me interesa "' + s.t + '". ¿Cómo sigo?';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  }

  function renderServices(){
    var list = SERVICIOS[state.mode].filter(match);

    grid.innerHTML = list.map(function (s, i) {
      return '' +
      '<article class="svc" style="animation-delay:' + (i * 45) + 'ms">' +
        '<div class="svc-ico">' + (ICO[s.i] || ICO.star) + '</div>' +
        '<h3>' + s.t + '</h3>' +
        '<p>' + s.d + '</p>' +
        '<div class="svc-tags"><span>' + s.a + '</span></div>' +
        '<a class="svc-cta" href="' + waLink(s) + '" target="_blank" rel="noopener">' +
          'Pedir este servicio' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a>' +
      '</article>';
    }).join('');

    empty.hidden = list.length !== 0;
    grid.hidden  = list.length === 0;

    var total = SERVICIOS[state.mode].length;
    count.textContent = list.length === total
      ? total + ' servicios disponibles'
      : list.length + ' de ' + total + ' servicios';

    clear.hidden = !state.q;
  }

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      state.q = input.value;
      renderServices();
    }, 120);
  });

  clear.addEventListener('click', function () {
    input.value = ''; state.q = ''; renderServices(); input.focus();
  });

  /* ---------- buscador del hero ---------- */
  var heroInput = $('#heroSearch');

  function goSearch(q){
    if (typeof q === 'string' && q) { input.value = q; state.q = q; }
    else { input.value = heroInput.value; state.q = heroInput.value; }
    state.area = 'Todos';
    renderChips();
    renderServices();
    document.getElementById('servicios').scrollIntoView({ behavior:'smooth', block:'start' });
  }

  $('#heroSearchGo').addEventListener('click', function () { goSearch(); });
  heroInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); goSearch(); }
  });
  $$('.hint').forEach(function (h) {
    h.addEventListener('click', function () {
      if (h.dataset.q === 'CV') setMode('candidato');
      goSearch(h.dataset.q);
    });
  });

  /* =========================================================
     INIT
     ========================================================= */
  $('#year').textContent = new Date().getFullYear();
  renderChips();
  renderServices();
  applyModeTexts();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveGlider);
  moveGlider();
  window.addEventListener('load', moveGlider);
})();
