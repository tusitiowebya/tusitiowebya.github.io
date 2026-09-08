/* FR Pisos Industriales — TuPaginaYa */
(function () {
  'use strict';

  var WA = 'https://wa.me/5493547532955?text=';
  var QA = /[?&]qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent);
  if (QA) document.body.classList.add('qa');

  /* ---------- año ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- video del hero (data-src diferido para no frenar el LCP) ---------- */
  var v = document.getElementById('heroVideo');
  if (v && !QA) {
    var s = document.createElement('source');
    s.src = 'hero.mp4';
    s.type = 'video/mp4';
    v.appendChild(s);
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 30); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) nav.classList.add('solid');
  });
  document.querySelectorAll('#links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- reveals ---------- */
  var els = document.querySelectorAll('.reveal, .steps li');
  if ('IntersectionObserver' in window && !QA) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = Array.prototype.slice.call(e.target.parentNode.children);
        var i = sibs.indexOf(e.target);
        setTimeout(function () {
          e.target.classList.add('in');
        }, Math.min(i, 6) * 80);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* ======================================================================
     CALIBRADOR DE BRILLO
     ====================================================================== */
  var NIVELES = [
    {
      name: 'Mate industrial',
      gu: 15,
      desc: 'Hormigón cerrado, sin brillo. Es el piso de trabajo puro: no encandila, no marca las ruedas y perdona el tránsito de autoelevador todo el día.',
      grit: 'Diamante 30 → 50',
      use: 'Depósitos, galpones, planta de producción',
      slip: 'Alto — el más seguro en mojado',
      care: 'Barrido y mopa húmeda',
      wa: 'Hola FR Pisos, me interesa el acabado MATE INDUSTRIAL (nivel 1) para mi piso.'
    },
    {
      name: 'Satinado',
      gu: 32,
      desc: 'Primer punto de reflejo. La superficie ya rechaza el polvo y el aceite, pero mantiene textura: es el equilibrio que más piden los galpones con tránsito mixto.',
      grit: 'Diamante 50 → 100 → 200',
      use: 'Depósitos con circulación de personas, talleres',
      slip: 'Alto',
      care: 'Mopa y detergente neutro',
      wa: 'Hola FR Pisos, me interesa el acabado SATINADO (nivel 2) para mi piso.'
    },
    {
      name: 'Semi brillo',
      gu: 52,
      desc: 'Se empieza a ver la luminaria reflejada. Levanta muchísimo un galpón oscuro porque devuelve la luz del techo y baja el consumo de iluminación.',
      grit: 'Diamante 200 → 400 → 800',
      use: 'Cocheras, locales, depósitos de exhibición',
      slip: 'Medio',
      care: 'Mopa y repaso de sellador cada 2 años',
      wa: 'Hola FR Pisos, me interesa el acabado SEMI BRILLO (nivel 3) para mi piso.'
    },
    {
      name: 'Brillo pleno',
      gu: 74,
      desc: 'Reflejo nítido y piso completamente cerrado. Es el acabado clásico de depósito logístico prolijo: se limpia rápido y no absorbe manchas.',
      grit: 'Diamante 800 → 1500 + endurecedor',
      use: 'Logística, showrooms, supermercados',
      slip: 'Medio — con tratamiento antideslizante opcional',
      care: 'Máquina fregadora, sin ácidos',
      wa: 'Hola FR Pisos, me interesa el acabado BRILLO PLENO (nivel 4) para mi piso.'
    },
    {
      name: 'Espejo',
      gu: 90,
      desc: 'Pulido a 3000 con cristalizado. El piso se convierte en la terminación de diseño del lugar: refleja columnas, luces y mercadería como un espejo.',
      grit: 'Diamante 1500 → 3000 + cristalizado',
      use: 'Showrooms, concesionarias, oficinas y locales premium',
      slip: 'Bajo — no recomendado en zonas que se mojan',
      care: 'Fregadora con pad de brillo, mantenimiento programado',
      wa: 'Hola FR Pisos, me interesa el acabado ESPEJO (nivel 5) para mi piso.'
    }
  ];

  var scene = document.querySelector('.cal-scene');
  var range = document.getElementById('glossRange');

  if (scene && range) {
    var arc = document.getElementById('guArc');
    var ARC_LEN = 151;
    var steps = document.querySelectorAll('#calSteps li');
    var out = {
      name: document.getElementById('calName'),
      desc: document.getElementById('calDesc'),
      grit: document.getElementById('calGrit'),
      use: document.getElementById('calUse'),
      slip: document.getElementById('calSlip'),
      care: document.getElementById('calCare'),
      gu: document.getElementById('guVal'),
      wa: document.getElementById('calWa')
    };

    function setNivel(i) {
      i = Math.max(0, Math.min(4, i | 0));
      var n = NIVELES[i];
      var g = i / 4;

      scene.style.setProperty('--g', g.toFixed(3));
      range.value = i;
      range.style.setProperty('--fill', (g * 100) + '%');

      out.name.textContent = n.name;
      out.desc.textContent = n.desc;
      out.grit.textContent = n.grit;
      out.use.textContent = n.use;
      out.slip.textContent = n.slip;
      out.care.textContent = n.care;
      out.wa.href = WA + encodeURIComponent(n.wa);

      arc.style.strokeDashoffset = ARC_LEN * (1 - n.gu / 100);
      arc.style.stroke = i >= 3 ? '#CFF255' : '#3D6BFF';
      animarGU(parseInt(out.gu.textContent, 10) || 0, n.gu);

      steps.forEach(function (li, k) { li.classList.toggle('on', k === i); });
    }

    var guTimer;
    function animarGU(from, to) {
      clearInterval(guTimer);
      if (QA) { out.gu.textContent = to; return; }
      var t0 = performance.now();
      guTimer = setInterval(function () {
        var k = Math.min(1, (performance.now() - t0) / 520);
        out.gu.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k === 1) clearInterval(guTimer);
      }, 16);
    }

    range.addEventListener('input', function () { setNivel(+range.value); });
    steps.forEach(function (li) {
      li.querySelector('button').addEventListener('click', function () {
        setNivel(+this.getAttribute('data-i'));
      });
    });

    setNivel(0);

    /* demo automática al entrar en viewport (se corta al primer toque) */
    var tocado = false;
    ['input', 'click', 'keydown'].forEach(function (ev) {
      scene.parentNode.addEventListener(ev, function () { tocado = true; }, true);
    });
    if ('IntersectionObserver' in window && !QA) {
      var demoIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        demoIO.disconnect();
        var i = 0;
        var t = setInterval(function () {
          if (tocado) { clearInterval(t); return; }
          i++;
          if (i > 4) { clearInterval(t); return; }
          setNivel(i);
        }, 1100);
      }, { threshold: 0.4 });
      demoIO.observe(scene);
    }
  }

  /* ======================================================================
     PRESUPUESTO RÁPIDO
     ====================================================================== */
  var form = document.getElementById('presuForm');
  if (form) {
    var SUP = {
      nuevo:   { txt: 'hormigón nuevo (menos de 1 año)',      base: 'pulido' },
      viejo:   { txt: 'hormigón viejo o gastado',             base: 'pulido' },
      pintado: { txt: 'piso pintado o con epoxi viejo',       base: 'epoxi' },
      carpeta: { txt: 'carpeta de cemento o cerámico',        base: 'epoxi' }
    };
    var DEST = {
      deposito: { txt: 'depósito o planta',       rinde: 130, gusto: 'pulido' },
      taller:   { txt: 'taller o cochera',        rinde: 110, gusto: 'epoxi' },
      showroom: { txt: 'showroom o local',        rinde: 90,  gusto: 'pulido' },
      casa:     { txt: 'casa, quincho o galpón chico', rinde: 80, gusto: 'pulido' }
    };
    var PLAN = {
      'pulido-deposito': ['Pulido mate a semi brillo + endurecedor', 'El acabado que aguanta autoelevador y baja el costo de limpieza. Se hace por sectores sin frenar la operación.'],
      'pulido-taller':   ['Pulido satinado + sellador antimanchas', 'Cierra el hormigón para que deje de chupar aceite y se limpie con manguera.'],
      'pulido-showroom': ['Pulido brillo pleno o espejo', 'El piso pasa a ser parte de la terminación del local y devuelve la luz del techo.'],
      'pulido-casa':     ['Pulido satinado + sellador', 'Terminación pareja, sin polvo y fácil de barrer. Ideal para quincho y galpón chico.'],
      'epoxi-deposito':  ['Epoxi bicomponente sobre desbaste mecánico', 'Capa nueva, color a elección y demarcación pintada en el mismo trabajo.'],
      'epoxi-taller':    ['Epoxi antideslizante resistente a hidrocarburos', 'Aguanta nafta, aceite y ácido de batería, y se lava con hidrolavadora.'],
      'epoxi-showroom':  ['Epoxi autonivelante color', 'Superficie continua y sin juntas, con el color que elijas.'],
      'epoxi-casa':      ['Epoxi color o poliuretánico', 'Solución prolija cuando el piso existente no da para pulir.']
    };

    var sel = { sup: null, dest: null };
    var poTrat = document.getElementById('poTrat');
    var poPlazo = document.getElementById('poPlazo');
    var m2 = document.getElementById('m2');
    var m2days = document.getElementById('m2days');
    var presuWa = document.getElementById('presuWa');

    function dias() {
      var n = Math.max(10, Math.min(20000, +m2.value || 0));
      var r = sel.dest ? DEST[sel.dest].rinde : 110;
      return Math.max(1, Math.ceil(n / r));
    }

    function render() {
      var d = dias();
      m2days.textContent = '≈ ' + d + (d === 1 ? ' día' : ' días') + ' de obra';

      var msg = 'Hola FR Pisos, quiero un presupuesto.';
      if (sel.sup && sel.dest) {
        var base = SUP[sel.sup].base === 'pulido' && DEST[sel.dest].gusto === 'pulido' ? 'pulido'
                 : SUP[sel.sup].base;
        var plan = PLAN[base + '-' + sel.dest];
        poTrat.textContent = plan[0];
        poPlazo.textContent = plan[1] + ' Estimado: ' + d + (d === 1 ? ' día' : ' días') + ' de obra para ' + (+m2.value || 0) + ' m².';
        msg += ' Es ' + SUP[sel.sup].txt + ', para ' + DEST[sel.dest].txt + ', de unos ' + (+m2.value || 0) + ' m².';
      } else {
        poTrat.textContent = 'Elegí superficie y destino';
        poPlazo.textContent = 'Con esos dos datos ya te decimos si va pulido, epoxi o sellado.';
        if (sel.sup) msg += ' Es ' + SUP[sel.sup].txt + '.';
        if (sel.dest) msg += ' Es para ' + DEST[sel.dest].txt + '.';
        msg += ' Son unos ' + (+m2.value || 0) + ' m².';
      }
      presuWa.href = WA + encodeURIComponent(msg);
    }

    form.querySelectorAll('.chips').forEach(function (grp) {
      var key = grp.getAttribute('data-group');
      grp.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-v');
          var mismo = sel[key] === v;
          grp.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
          if (mismo) { sel[key] = null; } else { sel[key] = v; b.classList.add('on'); }
          render();
        });
      });
    });
    m2.addEventListener('input', render);
    render();
  }
})();
