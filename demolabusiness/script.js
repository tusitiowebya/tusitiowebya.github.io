/* ============================================================
   LA Business Consulting — demo TuPaginaYa
   ============================================================ */
(function () {
  'use strict';

  var WA = 'https://wa.me/5491126630042?text=';
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* modo QA para capturas headless */
  if (location.search.indexOf('qa') > -1) document.documentElement.classList.add('qa');

  /* ---------------- año ---------------- */
  var yr = qs('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- nav ---------------- */
  var nav = qs('#nav'), burger = qs('#burger'), wa = qs('#waFloat');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 40);
    if (wa) wa.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    qsa('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- reveals ---------------- */
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    qsa('.reveal, .met-steps li').forEach(function (el, i) {
      if (el.classList.contains('srv')) el.style.setProperty('--i', i % 3);
      io.observe(el);
    });
  } else {
    qsa('.reveal, .met-steps li').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- checklist de síntomas ---------------- */
  var sintBtns = qsa('#sintList button'), sintMsg = qs('#sintMsg'), sintCta = qs('#sintCta');
  function updateSint() {
    var on = sintBtns.filter(function (b) { return b.classList.contains('on'); });
    var n = on.length;
    if (!n) {
      sintMsg.innerHTML = 'Ninguna te representa todavía. Igual, la primera conversación no cuesta nada.';
      sintCta.href = WA + encodeURIComponent('Hola, quiero hablar de las finanzas de mi empresa.');
      return;
    }
    var txt = n === 1
      ? 'Marcaste <b>1 señal</b>. Con una alcanza para sentarnos a mirar los números.'
      : n < 4
        ? 'Marcaste <b>' + n + ' señales</b>. No son problemas sueltos: casi siempre son el mismo problema.'
        : 'Marcaste <b>' + n + ' señales</b>. Es un cuadro de liquidez, no de costos. Hablemos esta semana.';
    sintMsg.innerHTML = txt;
    var msg = 'Hola, vi la web y me identifiqué con esto:\n\n' +
      on.map(function (b, i) { return (i + 1) + '. ' + b.getAttribute('data-s'); }).join('\n') +
      '\n\nQuiero coordinar la primera conversación.';
    sintCta.href = WA + encodeURIComponent(msg);
  }
  sintBtns.forEach(function (b) {
    b.addEventListener('click', function () { b.classList.toggle('on'); updateSint(); });
  });
  updateSint();

  /* ---------------- ciclo de conversión de caja ---------------- */
  var ids = ['dio', 'dso', 'dpo'], inputs = {};
  ids.forEach(function (id) { inputs[id] = { n: qs('#' + id), r: qs('#' + id + 'R') }; });
  var cccVal = qs('#cccVal'), cccVerdict = qs('#cccVerdict'), cccCta = qs('#cccCta');
  var bars = { dio: qs('.b-dio'), dso: qs('.b-dso'), dpo: qs('.b-dpo') };

  function clampInt(v, min, max) {
    v = parseInt(v, 10); if (isNaN(v)) v = 0;
    return Math.max(min, Math.min(max, v));
  }
  function verdict(ccc, d) {
    if (ccc <= 0) return 'Tu operación se financia sola: cobrás antes de pagarle a tus proveedores. <b>Es una ventaja competitiva</b>, conviene cuidarla antes de cambiar condiciones comerciales.';
    if (ccc <= 30) return 'Ciclo corto: la plata vuelve rápido. <b>Mirá que no sea a costa del margen</b> — a veces se cobra rápido regalando precio.';
    if (ccc <= 60) return 'Ciclo moderado. Financiás ' + ccc + ' días de operación: sostenible mientras las ventas no crezcan de golpe. <b>El crecimiento acelerado te va a pedir caja.</b>';
    if (ccc <= 90) return 'Ciclo exigente: ' + ccc + ' días de operación financiados con plata propia o con deuda. <b>Acá suele aparecer el costo financiero comiéndose el margen.</b>';
    return 'Ciclo alto: ' + ccc + ' días. Cada peso de crecimiento te exige más caja de la que genera el negocio. <b>Es el cuadro previo a una crisis de liquidez</b>, y se corrige con plazos y precios, no con más crédito.';
  }
  function compute(from) {
    var v = {};
    ids.forEach(function (id) {
      var src = (from === id + 'R') ? inputs[id].r.value : inputs[id].n.value;
      v[id] = clampInt(src, 0, 365);
      inputs[id].n.value = v[id];
      inputs[id].r.value = Math.min(v[id], 180);
    });
    var ccc = v.dio + v.dso - v.dpo;
    var max = Math.max(v.dio, v.dso, v.dpo, 1);
    ids.forEach(function (id) {
      var bar = bars[id];
      qs('i', bar).style.width = Math.round((v[id] / max) * 100) + '%';
      qs('b', bar).textContent = v[id];
    });
    cccVal.textContent = ccc;
    cccVerdict.innerHTML = verdict(ccc, v);
    cccCta.href = WA + encodeURIComponent(
      'Hola, calculé mi ciclo de caja en la web:\n\n' +
      '• Inventario (DIO): ' + v.dio + ' días\n' +
      '• Cobranza (DSO): ' + v.dso + ' días\n' +
      '• Pago a proveedores (DPO): ' + v.dpo + ' días\n' +
      '• Ciclo de conversión de caja: ' + ccc + ' días\n\n' +
      '¿Lo miramos juntos?'
    );
  }
  ids.forEach(function (id) {
    inputs[id].n.addEventListener('input', function () { compute(id); });
    inputs[id].r.addEventListener('input', function () { compute(id + 'R'); });
    inputs[id].n.addEventListener('blur', function () { compute(id); });
  });
  compute();

  /* ---------------- contenido real de Instagram ---------------- */
  var POSTS = [
    {
      id: 'DcwKswRIH-7', tag: 'financiamiento', kicker: 'Financiamiento',
      title: '¿Cuándo el financiamiento deja de ser una solución?',
      body: [
        'Llevo años acompañando empresas y personas en decisiones financieras. Y hay un patrón que se repite: el crédito que iba a “salvar” el negocio termina hundiéndolo.',
        'No es que financiarse esté mal. Es que nadie te enseña dónde está la línea:',
        '<b>1.</b> Financiás gastos operativos recurrentes. Un préstamo para un proyecto puntual es inversión; uno para pagar los sueldos del mes que viene es un síntoma.',
        '<b>2.</b> No podés explicar cómo se paga solo. <b>3.</b> Refinanciás para pagar la refinanciación anterior. <b>4.</b> El costo financiero supera tu margen. <b>5.</b> Dejaste de mirar el “para qué” y sólo mirás el “cuánto me dan”.',
        'La regla que usamos con nuestros clientes: <b>el financiamiento es una herramienta de crecimiento, no de supervivencia.</b> Cuando empieza a usarse para sobrevivir, es momento de reestructurar, no de refinanciar.'
      ]
    },
    {
      id: 'Dcl54vNoCGz', tag: 'liquidez', kicker: 'Liquidez',
      title: 'Cuando una PyME factura, el Estado cobra',
      body: [
        'Cuando una PyME vende, todavía no necesariamente tiene el dinero. Puede vender hoy y cobrar a 60, 90 o 180 días. Pero los impuestos llegan mucho antes.',
        'El resultado: la empresa tiene que financiar ese descalce con su capital de trabajo o endeudándose. Y cuando los plazos de cobro se extienden y además se corta la cadena de pagos, el problema deja de ser solamente impositivo: <b>se convierte en un problema de liquidez.</b>',
        'Una cosa es vender. Otra muy distinta es tener el dinero en la cuenta. En una PyME, la liquidez también es supervivencia.'
      ]
    },
    {
      id: 'DchR9jMH2os', tag: 'rentabilidad', kicker: 'Diagnóstico',
      title: '¿Rentabilidad, liquidez o cobertura de intereses?',
      body: [
        'Las tres son importantes, pero no responden a la misma pregunta. Una empresa puede ser rentable y, aun así, tener problemas de caja.',
        'Por eso, para analizar la salud financiera miramos primero la liquidez: ¿puede afrontar sus compromisos cuando vencen? Después, rentabilidad y cobertura de intereses completan el diagnóstico.'
      ]
    },
    {
      id: 'DceslZ8nz28', tag: 'liquidez', kicker: 'KPIs',
      title: 'El KPI que el 80% de las empresas en crecimiento no mide',
      body: [
        'La mayoría de los dueños mira la facturación todos los días. Pocos miran el ciclo de conversión de caja, y es justo ese número el que anticipa una crisis de liquidez semanas antes de que se sienta en la cuenta bancaria.',
        'Los 5 indicadores que todo tablero de CFO debería tener: <b>flujo de fondos a 90 días, desvío presupuestario, margen de contribución, DSO/DPO y CCC.</b>',
        'Podés calcular el tuyo en esta misma página, en la sección “Tu ciclo de conversión de caja”.'
      ]
    },
    {
      id: 'DceWfRFH5hR', tag: 'impuestos', kicker: 'Impuestos',
      title: '¿Tenés saldos a favor de IVA y no sabés qué hacer con ellos?',
      body: [
        'No todos los saldos a favor son iguales ni tienen el mismo tratamiento. Su origen puede estar en créditos fiscales acumulados, importaciones, inversiones, retenciones o percepciones, entre otros.',
        'Analizar su composición te permite saber cuánto tenés, qué tipo de saldo es y qué alternativas existen para optimizarlo. <b>Escribinos “SALDO” y analizamos tu situación.</b>'
      ]
    },
    {
      id: 'Dca5hMZxN84', tag: 'liquidez', kicker: 'Novedad · Reel',
      title: 'Si tenés más de 10 empleados en blanco, esto te cambia la caja',
      body: [
        'El FAL (Fondo de Asistencia Laboral) cambia la forma en que tu empresa provisiona y paga. Si tenés más de 10 empleados en blanco, impacta directo en tu flujo de fondos.',
        'Lo contamos en video en la cuenta: <b>miralo completo en Instagram</b> y, si querés, lo analizamos sobre los números de tu empresa.'
      ]
    },
    {
      id: 'DcRrmLDH7Qa', tag: 'rentabilidad', kicker: 'Presupuesto',
      title: 'Tus ventas quedaron por debajo del presupuesto: el problema no termina ahí',
      body: [
        'Menos ingresos afectan la rentabilidad, la caja y la capacidad de cumplir con tus compromisos. Y cuando la brecha se sostiene en el tiempo, ya no alcanza con ajustar: hay que revisar el presupuesto entero.',
        '<b>Un presupuesto no es un documento fijo.</b> Es una herramienta que se monitorea, se revisa y se adapta a la realidad del negocio.'
      ]
    },
    {
      id: 'DcHjIzLxj5I', tag: 'financiamiento', kicker: 'Financiamiento',
      title: '¿Estás financiando crecimiento o pérdidas?',
      body: [
        'El crédito puede ser una herramienta de crecimiento… o simplemente una forma de postergar un problema. La diferencia no está en cuánto crédito conseguís, sino en para qué lo usás y cómo vas a pagarlo.',
        'Antes de endeudarte, mirá tus números: <b>flujo de fondos, rentabilidad y capacidad de repago.</b>'
      ]
    },
    {
      id: 'Db9CzRcRsB7', tag: 'rentabilidad', kicker: 'Presupuesto',
      title: 'El presupuesto no es de una sola vez: es un hábito',
      body: [
        'Invertís tiempo y esfuerzo armando el presupuesto a principio de año y después lo guardás en un cajón. La realidad del negocio cambia todos los meses: sube un insumo, bajan las ventas, aparece una oportunidad nueva.',
        'Si no lo revisás periódicamente con tu equipo, dejás de tomar decisiones con datos reales y empezás a manejarte a ciegas.',
        'Un presupuesto vivo te permite <b>detectar desvíos a tiempo, ajustar antes de que el problema crezca y decidir con información actualizada</b>, no con supuestos de hace seis meses.'
      ]
    },
    {
      id: 'Db61HWeGkkX', tag: 'rentabilidad', kicker: 'Caso real',
      title: 'Una mala estrategia de precios te cuesta plata todos los meses',
      body: [
        'Trabajamos con el dueño de una empresa que facturaba bien pero a fin de mes no le quedaba nada. Su primera sospecha: “tengo un problema de costos”. Revisamos gastos, renegociamos proveedores, ajustamos estructura. Mejoró un poco, pero no alcanzaba.',
        'Cuando miramos los precios encontramos esto: mismo precio hacía más de un año, mismo precio para clientes chicos y grandes, mismo precio para trabajos simples y complejos. Su respuesta: <b>“Lo tengo pensado hace rato, pero no quería tocarlo, no fuera cosa que se me vayan clientes.”</b>',
        'Rediseñamos todo: valor diferenciado por tipo de cliente, ajuste según complejidad, revisión trimestral. En dos meses el margen mejoró más que con todo el trabajo de costos anterior.',
        '<b>La inacción no es neutral. Es una decisión, y tiene precio.</b>'
      ]
    },
    {
      id: 'Dbqqz3DIIQa', tag: 'liquidez', kicker: 'Política comercial',
      title: 'La forma en que premiás a tus vendedores puede estar afectando tu caja',
      body: [
        'Muchas PyMEs tienen esquemas de comisiones basados únicamente en las ventas realizadas. El problema aparece cuando esa venta todavía no se transformó en dinero disponible.',
        'Si tu equipo cobra comisión al momento de vender, pero tus clientes pagan a 60, 90 o más días, <b>la empresa está asumiendo un costo financiero que no siempre está visible.</b>',
        'Una política de incentivos efectiva se alinea con la estrategia financiera: ventas rentables, condiciones de cobro saludables, generación de caja y sostenibilidad. Vender más es importante, pero cobrar bien es lo que permite crecer.'
      ]
    },
    {
      id: 'Dbd6bpYmtJP', tag: 'impuestos', kicker: 'Escudo fiscal',
      title: 'Mejorar el flujo de caja y reducir la carga impositiva, de forma legal',
      body: [
        'El Escudo Fiscal es una estrategia financiera que permite aprovechar los gastos deducibles para disminuir el Impuesto a las Ganancias.',
        '¿El resultado? <b>Más liquidez, menor costo financiero y mayor capacidad para invertir y crecer.</b>',
        'No se trata de pagar menos impuestos, sino de tomar decisiones financieras inteligentes que fortalezcan la rentabilidad y el flujo de caja de la empresa.'
      ]
    }
  ];

  var grid = qs('#contGrid');
  if (grid) {
    POSTS.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'post';
      b.setAttribute('data-tag', p.tag);
      b.setAttribute('data-i', i);
      b.innerHTML =
        '<img src="ig/' + p.id + '.jpg" alt="' + p.title.replace(/"/g, '') + '" loading="lazy" width="818" height="1125">' +
        '<span class="post-meta"><small>' + p.kicker + '</small><b>' + p.title + '</b></span>';
      grid.appendChild(b);
    });
  }

  qsa('#contFilters button').forEach(function (f) {
    f.addEventListener('click', function () {
      qsa('#contFilters button').forEach(function (x) { x.classList.remove('on'); });
      f.classList.add('on');
      var v = f.getAttribute('data-f');
      qsa('.post', grid).forEach(function (p) {
        p.classList.toggle('hide', v !== 'todos' && p.getAttribute('data-tag') !== v);
      });
    });
  });

  /* ---------------- lector de publicaciones ---------------- */
  var reader = qs('#reader'), rImg = qs('#readerImg'), rTag = qs('#readerTag'),
      rTitle = qs('#readerTitle'), rBody = qs('#readerBody'),
      rIg = qs('#readerIg'), rWa = qs('#readerWa'), lastFocus = null;

  function openReader(i) {
    var p = POSTS[i];
    lastFocus = document.activeElement;
    rImg.src = 'ig/' + p.id + '.jpg';
    rImg.alt = p.title;
    rTag.textContent = p.kicker;
    rTitle.textContent = p.title;
    rBody.innerHTML = p.body.map(function (t) { return '<p>' + t + '</p>'; }).join('');
    rIg.href = 'https://www.instagram.com/p/' + p.id + '/';
    rWa.href = WA + encodeURIComponent('Hola, leí en la web la publicación “' + p.title + '” y quiero consultar sobre ese tema en mi empresa.');
    reader.hidden = false;
    document.body.style.overflow = 'hidden';
    qs('.reader-x').focus();
  }
  function closeReader() {
    reader.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (grid) {
    grid.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('.post') : null;
      if (card) openReader(parseInt(card.getAttribute('data-i'), 10));
    });
  }
  qsa('[data-close]').forEach(function (el) { el.addEventListener('click', closeReader); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !reader.hidden) closeReader();
  });
})();
