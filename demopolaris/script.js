/* =========================================================
   Grupo Polaris S.A.S — landing
   ========================================================= */
(function () {
  'use strict';

  /* modo QA: ?qa fuerza reveals y achica el hero (para capturas de revisión) */
  if (/qa/.test(location.search) || /qa/.test(location.hash)) document.documentElement.classList.add('qa');

  /* --------- WhatsApp: número único, fácil de reemplazar --------- */
  var WSP = '541100000000'; // TODO cliente: número real, formato 54 9 11 XXXXXXXX
  function wspURL(texto) {
    return 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }
  document.querySelectorAll('[data-wsp]').forEach(function (a) {
    a.href = wspURL(a.getAttribute('data-wsp'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* --------- Logo: rosa de los vientos (mismo trazado que el logo del cliente) --------- */
  var FACETAS = [
    ['#4C8AF5', '#1C4FC7'], ['#FFFFFF', '#B9D0EE'], ['#FFFFFF', '#9FBDE4'], ['#DCE8F8', '#8FB0DC'],
    ['#B9D0EE', '#FFFFFF'], ['#8FB0DC', '#DCE8F8'], ['#9FBDE4', '#FFFFFF'], ['#B9D0EE', '#FFFFFF']
  ];
  function estrellaSVG() {
    var R_CARD = 100, R_DIAG = 52, R_WAIST = 21, pad = 6, vb = R_CARD + pad;
    function pt(r, deg) {
      var a = deg * Math.PI / 180;
      return [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)];
    }
    var polys = '';
    for (var i = 0; i < 8; i++) {
      var ang = i * 45,
        tip = pt(i % 2 === 0 ? R_CARD : R_DIAG, ang),
        wl = pt(R_WAIST, ang - 22.5),
        wr = pt(R_WAIST, ang + 22.5);
      polys += '<polygon points="0,0 ' + wl + ' ' + tip + '" fill="' + FACETAS[i][0] + '"/>';
      polys += '<polygon points="0,0 ' + tip + ' ' + wr + '" fill="' + FACETAS[i][1] + '"/>';
    }
    return '<svg viewBox="' + -vb + ' ' + -vb + ' ' + vb * 2 + ' ' + vb * 2 +
      '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + polys + '</svg>';
  }
  ['lockupStar', 'footStar', 'credStar'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = estrellaSVG();
  });

  /* --------- Nav --------- */
  var nav = document.getElementById('nav'),
    burger = document.getElementById('burger'),
    links = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  burger.addEventListener('click', function () {
    var abierto = links.classList.toggle('open');
    burger.classList.toggle('is-open', abierto);
    burger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* --------- Reloj de la central (hora de Buenos Aires) --------- */
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  }
  tick();
  setInterval(tick, 1000);

  /* --------- Ticker: duplico el contenido para loop continuo --------- */
  var track = document.getElementById('tickerTrack');
  if (track) track.innerHTML += track.innerHTML;

  /* --------- Año --------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --------- Reveal escalonado --------- */
  var objetivos = document.querySelectorAll(
    '.sec-head, .serv, .pasos li, .uni-txt, .uni-card, .cob-txt, .radar, .cfg-form, .cfg-out, .grid-why article, .faq details, .cta-final h2, .cta-final p, .cta-final .hero-cta'
  );
  objetivos.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        setTimeout(function () { el.classList.add('in'); }, (i % 6) * 80);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    objetivos.forEach(function (el) { io.observe(el); });
  } else {
    objetivos.forEach(function (el) { el.classList.add('in'); });
  }

  /* =========================================================
     Configurador "Armá tu servicio"
     ========================================================= */
  var OBJETIVOS = {
    obra:      { nombre: 'Obra en construcción', nota: 'En obra el foco está en el egreso de materiales y el turno nocturno, que es cuando más se roba.' },
    barrio:    { nombre: 'Barrio o country',     nota: 'En barrios cerrados sumamos control vehicular y registro de visitas en la garita.' },
    comercio:  { nombre: 'Comercio o local',     nota: 'Para comercios trabajamos apertura, cierre y presencia en horario de atención.' },
    industria: { nombre: 'Planta o depósito',    nota: 'En planta combinamos puesto fijo en portería con rondines por el predio.' },
    edificio:  { nombre: 'Edificio',             nota: 'En edificios el puesto cubre portería, recepción de proveedores y control de cocheras.' },
    evento:    { nombre: 'Evento',               nota: 'En eventos la dotación se dimensiona por aforo: acá cada puesto es una persona en puerta, vallado o sector.' }
  };
  var FRANJAS = {
    nocturno: { nombre: 'Nocturno (12 h)',        factor: 2.5, horas: 84 },
    diurno:   { nombre: 'Diurno (12 h)',          factor: 2.5, horas: 84 },
    '24':     { nombre: '24 horas',               factor: 5,   horas: 168 },
    finde:    { nombre: 'Solo fines de semana',   factor: 1,   horas: 24 }
  };

  var estado = { obj: 'obra', franja: 'nocturno', puestos: 1 };

  var el = {
    objChips: document.getElementById('objChips'),
    franjaChips: document.getElementById('franjaChips'),
    puestos: document.getElementById('puestos'),
    mas: document.getElementById('mas'),
    menos: document.getElementById('menos'),
    vig: document.getElementById('outVig'),
    obj: document.getElementById('outObj'),
    outPuestos: document.getElementById('outPuestos'),
    franja: document.getElementById('outFranja'),
    horas: document.getElementById('outHoras'),
    nota: document.getElementById('outNota'),
    wsp: document.getElementById('cfgWsp')
  };

  function calcular() {
    var o = OBJETIVOS[estado.obj], f = FRANJAS[estado.franja];
    // en eventos la cobertura es puntual: un puesto = una persona
    var vigiladores = estado.obj === 'evento'
      ? estado.puestos
      : Math.ceil(estado.puestos * f.factor);
    var horas = estado.obj === 'evento' ? estado.puestos * 8 : estado.puestos * f.horas;

    el.vig.textContent = vigiladores;
    el.obj.textContent = o.nombre;
    el.outPuestos.textContent = estado.puestos;
    el.franja.textContent = estado.obj === 'evento' ? 'Servicio por jornada' : f.nombre;
    el.horas.textContent = estado.obj === 'evento' ? (horas + ' h aprox.') : horas;
    el.nota.textContent = o.nota + (estado.obj === 'evento'
      ? ' Confirmamos la cantidad final con el aforo y el plano del predio.'
      : ' El número incluye relevo de francos y supervisión; se confirma en el relevamiento.');

    var msg = 'Hola Grupo Polaris, armé un servicio en la web:\n' +
      '• Objetivo: ' + o.nombre + '\n' +
      '• Puestos simultáneos: ' + estado.puestos + '\n' +
      '• Cobertura: ' + (estado.obj === 'evento' ? 'servicio por jornada' : f.nombre) + '\n' +
      '• Dotación estimada: ' + vigiladores + ' vigilador(es)\n' +
      'Quiero coordinar el relevamiento.';
    el.wsp.href = wspURL(msg);
  }

  function pintarChips(cont, activo) {
    cont.querySelectorAll('.chip').forEach(function (c) {
      c.classList.toggle('is-on', c === activo);
    });
  }

  if (el.objChips) {
    el.objChips.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      estado.obj = c.dataset.obj;
      if (estado.obj === 'evento' && estado.puestos < 4) {
        estado.puestos = 4;
        el.puestos.textContent = 4;
      }
      pintarChips(el.objChips, c);
      calcular();
    });

    el.franjaChips.addEventListener('click', function (e) {
      var c = e.target.closest('.chip');
      if (!c) return;
      estado.franja = c.dataset.franja;
      pintarChips(el.franjaChips, c);
      calcular();
    });

    el.mas.addEventListener('click', function () {
      estado.puestos = Math.min(20, estado.puestos + 1);
      el.puestos.textContent = estado.puestos;
      calcular();
    });
    el.menos.addEventListener('click', function () {
      estado.puestos = Math.max(1, estado.puestos - 1);
      el.puestos.textContent = estado.puestos;
      calcular();
    });

    el.wsp.target = '_blank';
    el.wsp.rel = 'noopener';
    calcular();
  }
})();
