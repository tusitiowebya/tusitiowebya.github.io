/* =========================================================
   MATRICULADO JCM — script.js
   ========================================================= */
(function () {
  'use strict';

  var WA = 'https://wa.me/5492646317017?text=';

  /* ---------- modo QA: ?qa=1 para capturas headless ---------- */
  if (/[?&]qa=1/.test(location.search)) document.documentElement.classList.add('qa');

  /* ---------- año del footer ---------- */
  var yy = document.getElementById('yy');
  if (yy) yy.textContent = new Date().getFullYear();

  /* ---------- knockout del hero: 2 lineas en desktop, 3 apiladas en mobile ---------- */
  var KN_D = { vb: 350, lines: [['PLOMERO GASISTA', 150, 140], ['MATRICULADO', 200, 322]] };
  var KN_M = { vb: 650, lines: [['PLOMERO', 310, 230], ['GASISTA', 310, 455], ['MATRICULADO', 200, 620]] };
  var knock = document.getElementById('knock');
  var knockMode = null;

  function pintarKnock() {
    if (!knock) return;
    var modo = window.innerWidth <= 768 ? 'm' : 'd';
    if (modo === knockMode) return;
    knockMode = modo;

    var cfg = modo === 'm' ? KN_M : KN_D;
    var mask = document.getElementById('knockmask');
    var shadow = document.getElementById('knockShadow');
    var fo = document.getElementById('knockFo');
    var NS = 'http://www.w3.org/2000/svg';

    knock.setAttribute('viewBox', '0 0 1000 ' + cfg.vb);
    mask.setAttribute('height', cfg.vb);
    fo.setAttribute('height', cfg.vb);

    while (mask.firstChild) mask.removeChild(mask.firstChild);
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

    cfg.lines.forEach(function (l) {
      [mask, shadow].forEach(function (host) {
        var t = document.createElementNS(NS, 'text');
        t.setAttribute('x', '500');
        t.setAttribute('y', l[2]);
        t.setAttribute('class', 'knock__t');
        t.setAttribute('font-size', l[1]);
        t.setAttribute('textLength', '940');
        t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        if (host === mask) t.setAttribute('fill', '#fff');
        t.textContent = l[0];
        host.appendChild(t);
      });
    });
  }
  pintarKnock();
  var knockTO;
  window.addEventListener('resize', function () {
    clearTimeout(knockTO);
    knockTO = setTimeout(pintarKnock, 150);
  });

  /* ---------- ticker del hero ---------- */
  var tickerItems = [
    'Destapaciones con máquina',
    'Pérdidas de gas',
    'Detección de fugas de agua',
    'Calefones y termotanques',
    'Cámaras sépticas y pozos',
    'Instalaciones nuevas',
    'Planos y trámites ante Ecogas',
    'San Juan Capital y Gran San Juan'
  ];
  var ticker = document.getElementById('ticker');
  if (ticker) {
    var line = tickerItems.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    ticker.innerHTML = line + line; /* duplicado: el keyframe corre -50% */
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-on');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal + pipeline ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('is-in'); }, i * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var pipe = document.getElementById('pipe');
    if (pipe) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { pipe.classList.add('is-in'); pio.unobserve(pipe); }
        });
      }, { threshold: 0.25 });
      pio.observe(pipe);
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    var p = document.getElementById('pipe');
    if (p) p.classList.add('is-in');
  }

  /* =========================================================
     TRIAJE DE URGENCIA (signature)
     ========================================================= */
  var RIESGO = {
    critico: { txt: 'Crítico', color: '#D62128', fg: '#fff' },
    alto:    { txt: 'Alto',    color: '#E8842B', fg: '#1A1206' },
    medio:   { txt: 'Medio',   color: '#E5B234', fg: '#1A1206' },
    bajo:    { txt: 'Bajo',    color: '#8A929C', fg: '#0E1013' }
  };

  var CASOS = [
    {
      id: 'gas-olor', rubro: 'gas', riesgo: 'critico',
      t: 'Huelo a gas adentro de la casa',
      h: 'Olor a gas en el ambiente',
      sub: 'Es la urgencia más seria del rubro. No pierdas tiempo probando dónde es.',
      pasos: [
        'No toques ningún interruptor ni enchufe, ni prendas o apagues luces. La chispa es lo que enciende.',
        'No uses el celular adentro. Tampoco encendedores, velas ni fósforos.',
        'Cerrá la llave de paso general del gas (está junto al medidor).',
        'Abrí puertas y ventanas de par en par para ventilar.',
        'Salí de la vivienda con todos y recién ahí llamame, desde afuera.'
      ],
      mio: 'Voy con detector de gas, ubico la pérdida exacta, aíslo el tramo y hago la prueba de hermeticidad con manómetro antes de rehabilitar la instalación.',
      wa: 'Hola JCM, siento olor a gas en mi casa. Ya cerré la llave de paso y ventilé. Necesito que vengas.'
    },
    {
      id: 'gas-llama', rubro: 'gas', riesgo: 'alto',
      t: 'El calefón o la estufa tiene llama amarilla / se apaga sola',
      h: 'Llama amarilla o artefacto que se apaga',
      sub: 'La llama tiene que ser azul. Amarilla o naranja significa mala combustión, y mala combustión significa monóxido.',
      pasos: [
        'Apagá el artefacto y cerrá su llave de paso.',
        'Ventilá bien el ambiente donde está instalado.',
        'No lo vuelvas a usar hasta que esté revisado, aunque parezca que anda.',
        'Si alguien de la casa tiene dolor de cabeza, náuseas o sueño raro, salgan al aire libre y consultá al médico.'
      ],
      mio: 'Reviso la combustión, el quemador, la ventilación del ambiente y el conducto de evacuación. La mayoría de las veces el problema no está en el artefacto sino en el tiraje.',
      wa: 'Hola JCM, mi calefón/estufa tiene llama amarilla y se apaga solo. Ya lo apagué. ¿Cuándo podés venir a revisarlo?'
    },
    {
      id: 'gas-consumo', rubro: 'gas', riesgo: 'medio',
      t: 'Me llegó la boleta de gas altísima sin explicación',
      h: 'Consumo de gas que no cierra',
      sub: 'Antes de reclamarle a la distribuidora, conviene descartar una pérdida chica en la instalación.',
      pasos: [
        'Cerrá todas las llaves de los artefactos de la casa.',
        'Andá al medidor y mirá la rueda o el dígito más chico durante un par de minutos.',
        'Si con todo cerrado el medidor sigue moviéndose, hay pérdida en la instalación.',
        'Anotá la lectura y mandámela por WhatsApp.'
      ],
      mio: 'Hago la prueba de hermeticidad con manómetro: se presuriza la instalación y se mide si baja. Con eso queda claro si el problema es una pérdida o un artefacto mal regulado.',
      wa: 'Hola JCM, me vino la boleta de gas muy alta y quiero descartar una pérdida. ¿Hacés la prueba de hermeticidad?'
    },
    {
      id: 'agua-rotura', rubro: 'agua', riesgo: 'critico',
      t: 'Se rompió un caño y pierde agua a chorro',
      h: 'Rotura de cañería con pérdida abierta',
      sub: 'Cada minuto que pasa es más agua adentro de la casa y más plata en reparación.',
      pasos: [
        'Cerrá la llave de paso general de agua (suele estar en el frente, junto al medidor, o en el pasillo de entrada).',
        'Si el agua llegó a tomacorrientes, artefactos eléctricos o al tablero, cortá la luz de ese sector.',
        'Sacá muebles, alfombras y cosas del piso antes de secar.',
        'Sacale una foto a la rotura y mandámela: voy con el material justo.'
      ],
      mio: 'Corto el tramo dañado y lo reemplazo. Si la cañería ya viene con varias roturas, te digo de frente si conviene reparar o renovar el tramo completo.',
      wa: 'Hola JCM, se me rompió un caño y pierde agua. Ya cerré la llave general. Es urgente.'
    },
    {
      id: 'agua-humedad', rubro: 'agua', riesgo: 'alto',
      t: 'Tengo una mancha de humedad en la pared o el techo',
      h: 'Pérdida embutida (humedad)',
      sub: 'Está perdiendo un caño adentro de la pared o el piso. La mancha casi nunca está donde está la pérdida.',
      pasos: [
        'No piques nada a ciegas: es el error que más caro sale.',
        'Fijate si la mancha crece cuando usás una canilla o la ducha en particular, y anotá cuál.',
        'Si el piso está tibio en una zona, puede ser la cañería de agua caliente.',
        'Si podés, cerrá el paso de agua caliente y mirá si la mancha deja de avanzar.'
      ],
      mio: 'Busco la pérdida con detector de humedad y geófono, marco el punto exacto y rompo solo ahí. En general es menos de medio metro cuadrado de piso o pared.',
      wa: 'Hola JCM, tengo una mancha de humedad y creo que pierde un caño adentro de la pared. ¿Podés venir a detectarla?'
    },
    {
      id: 'agua-presion', rubro: 'agua', riesgo: 'bajo',
      t: 'Me quedé sin presión de agua',
      h: 'Poca o nada de presión',
      sub: 'Antes de mover nada conviene saber si es toda la casa o una sola canilla.',
      pasos: [
        'Probá varias canillas: si es una sola, casi seguro es el aireador o el flexible.',
        'Si es toda la casa, mirá el nivel del tanque y escuchá si la bomba arranca.',
        'Revisá que la llave de paso general no haya quedado medio cerrada.',
        'Si tenés bomba, fijate que no le haya saltado la térmica.'
      ],
      mio: 'Reviso tanque, flotante, bomba, presurizador y llaves de paso. Si la cañería está tapada por sarro, te muestro el tramo y te paso las opciones.',
      wa: 'Hola JCM, me quedé sin presión de agua en la casa. ¿Cuándo podés pasar?'
    },
    {
      id: 'agua-goteo', rubro: 'agua', riesgo: 'bajo',
      t: 'Una canilla o el inodoro gotea sin parar',
      h: 'Goteo permanente',
      sub: 'Parece poca cosa, pero una canilla que gotea tira decenas de litros por día y te lo cobran igual.',
      pasos: [
        'Cerrá la llave de paso de ese artefacto si la tiene.',
        'Poné un balde o un trapo para que no se manche el bacha ni el piso.',
        'Si es la mochila del inodoro y no para de correr agua, cerrale el paso hasta que lo revise.',
        'Sacale una foto a la grifería: con la marca ya llevo el repuesto.'
      ],
      mio: 'Cambio cueritos, cartuchos o el mecanismo de la mochila. Es un trabajo corto y se resuelve en la misma visita.',
      wa: 'Hola JCM, tengo una canilla/inodoro que gotea sin parar. ¿Cuándo podés venir?'
    },
    {
      id: 'cloaca-tapado', rubro: 'cloacas', riesgo: 'alto',
      t: 'Se tapó el inodoro o rebalsa la rejilla del baño',
      h: 'Cañería cloacal tapada',
      sub: 'Si rebalsa la rejilla y no solo el inodoro, la obstrucción está más adelante en la cañería.',
      pasos: [
        'Dejá de tirar agua: cada descarga empeora el rebalse.',
        'No le tires ácido ni soda cáustica. Arruina el caño, no destapa y es peligroso cuando llego a trabajar.',
        'No uses el lavarropas ni la ducha hasta destapar.',
        'Si tenés boca de registro o cámara en el patio, fijate si está llena y contámelo.'
      ],
      mio: 'Voy con máquina destapadora. Destapo, hago correr agua para verificar y reviso por qué se tapó, así no se te repite en dos semanas.',
      wa: 'Hola JCM, se me tapó la cloaca y rebalsa. Necesito destapación urgente.'
    },
    {
      id: 'cloaca-olor', rubro: 'cloacas', riesgo: 'medio',
      t: 'Hay olor a cloaca adentro de la casa',
      h: 'Olor cloacal en ambientes',
      sub: 'Casi siempre es un sifón que se secó o una ventilación tapada, no una rotura.',
      pasos: [
        'Echá un balde de agua en las rejillas y piletas que casi no usás: el sifón seco deja pasar el olor.',
        'Fijate si el olor aparece siempre en el mismo ambiente y a qué hora.',
        'Revisá que la tapa de la boca de registro esté bien puesta.',
        'Si el olor sigue después de cargar los sifones, avisame.'
      ],
      mio: 'Reviso sifones, la ventilación de la cañería y el estado de la cámara. Si hace falta, inspecciono el tramo para descartar un caño roto.',
      wa: 'Hola JCM, tengo olor a cloaca adentro de la casa. Ya cargué los sifones con agua y sigue. ¿Podés revisarlo?'
    },
    {
      id: 'cloaca-camara', rubro: 'cloacas', riesgo: 'alto',
      t: 'Se me rebalsa la cámara séptica o el pozo',
      h: 'Cámara o pozo desbordado',
      sub: 'Mientras esté lleno, todo lo que uses adentro de la casa vuelve para afuera.',
      pasos: [
        'Cortá el uso de agua en toda la casa: nada de lavarropas, ducha ni lavavajillas.',
        'Mantené a los chicos y las mascotas lejos de la zona desbordada.',
        'No destapes la cámara para revolver adentro.',
        'Contame hace cuánto fue el último desagote.'
      ],
      mio: 'Reviso si es cuestión de desagote o si el problema está en la cañería de salida al colector. Muchas veces la cámara rebalsa porque la salida está obstruida, y desagotar solo patea el problema.',
      wa: 'Hola JCM, se me rebalsa la cámara séptica. Ya corté el uso de agua. ¿Cuándo podés venir?'
    }
  ];

  var list = document.getElementById('triList');
  var panel = document.getElementById('triPanel');
  var filtros = document.querySelectorAll('.tri__f');
  var activo = CASOS[0].id;
  var filtro = 'todo';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function pintarLista() {
    if (!list) return;
    var vis = CASOS.filter(function (c) { return filtro === 'todo' || c.rubro === filtro; });
    list.innerHTML = vis.map(function (c) {
      var r = RIESGO[c.riesgo];
      return '<li><button type="button" class="tri__b' + (c.id === activo ? ' is-on' : '') +
        '" data-id="' + c.id + '">' +
        '<span class="dot" style="background:' + r.color + '"></span>' +
        '<span class="t">' + esc(c.t) + '</span>' +
        '<span class="r" style="color:' + r.color + '">' + r.txt + '</span>' +
        '</button></li>';
    }).join('');

    list.querySelectorAll('.tri__b').forEach(function (b) {
      b.addEventListener('click', function () {
        activo = b.getAttribute('data-id');
        pintarLista();
        pintarPanel();
      });
    });
  }

  function pintarPanel() {
    if (!panel) return;
    var c = CASOS.filter(function (x) { return x.id === activo; })[0];
    if (!c) return;
    var r = RIESGO[c.riesgo];

    panel.style.borderTopColor = r.color;
    panel.innerHTML =
      '<span class="rk" style="background:' + r.color + ';color:' + r.fg + '">Riesgo ' + r.txt + '</span>' +
      '<h3>' + esc(c.h) + '</h3>' +
      '<p class="sub">' + esc(c.sub) + '</p>' +
      '<div class="tri__hd">Hacé esto ahora</div>' +
      '<ol>' + c.pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' +
      '<div class="tri__hd">Lo que hago yo</div>' +
      '<div class="tri__mine">' + esc(c.mio) + '</div>' +
      '<a class="cta cta--wa" target="_blank" rel="noopener" href="' + WA + encodeURIComponent(c.wa) + '">Escribirme por esto</a>';
  }

  filtros.forEach(function (f) {
    f.addEventListener('click', function () {
      filtro = f.getAttribute('data-f');
      filtros.forEach(function (o) { o.classList.remove('is-on'); });
      f.classList.add('is-on');
      var vis = CASOS.filter(function (c) { return filtro === 'todo' || c.rubro === filtro; });
      if (vis.length && !vis.some(function (c) { return c.id === activo; })) activo = vis[0].id;
      pintarLista();
      pintarPanel();
    });
  });

  pintarLista();
  pintarPanel();
})();
