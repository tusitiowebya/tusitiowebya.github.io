/* ============================================================
   SEGHI — Consultora de Higiene y Seguridad
   ============================================================ */
(function () {
  'use strict';

  var WA = '5491100000000';

  /* ---------------- nav ---------------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var fab = document.getElementById('wafab');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    // el FAB aparece recién pasado el hero: sobre el hero tapa los pilares
    fab.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.classList.toggle('is-on', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('is-open');
      burger.classList.remove('is-on');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- ticker: duplicar el set para loop sin corte ---------------- */
  var track = document.getElementById('tickerTrack');
  if (track && track.firstElementChild) {
    track.appendChild(track.firstElementChild.cloneNode(true));
  }

  /* ---------------- reveal ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });

  /* ---------------- acordeón normativa ---------------- */
  document.querySelectorAll('.acc__i').forEach(function (item) {
    var btn = item.querySelector('.acc__b');
    var panel = item.querySelector('.acc__p');
    btn.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      document.querySelectorAll('.acc__i.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.acc__p').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     AUTODIAGNÓSTICO DE CUMPLIMIENTO
     ============================================================ */
  var ITEMS = [
    { k: 'serv',  w: 18, txt: 'Servicio de Higiene y Seguridad con profesional matriculado', ref: 'Ley 19.587 · Dec. 1338/96' },
    { k: 'rgrl',  w: 16, txt: 'RGRL presentado y actualizado ante la ART',                    ref: 'Res. SRT 463/09' },
    { k: 'cap',   w: 14, txt: 'Programa anual de capacitación con constancias firmadas',      ref: 'Res. SRT 905/15' },
    { k: 'fuego', w: 13, txt: 'Matafuegos con carga vigente y señalización completa',         ref: 'Dec. 351/79 — Anexo VII' },
    { k: 'medic', w: 12, txt: 'Protocolos de iluminación, ruido y puesta a tierra vigentes',  ref: 'Res. SRT 84/12 · 85/12 · 900/15' },
    { k: 'evac',  w: 11, txt: 'Plan de evacuación y simulacro documentado',                   ref: 'Dec. 351/79' },
    { k: 'epp',   w: 9,  txt: 'Entrega de EPP con constancia firmada',                        ref: 'Res. SRT 299/11' },
    { k: 'acc',   w: 7,  txt: 'Investigación documentada de accidentes e incidentes',         ref: 'Ley 24.557' }
  ];

  var RUBRO = {
    industria:    { n: 'Industria / planta',    extra: 'Matriz de riesgos por puesto y protocolo de máquinas y herramientas' },
    construccion: { n: 'Construcción / obra',   extra: 'Aviso de obra, programa de seguridad aprobado por la ART y legajo técnico (Dec. 911/96)' },
    logistica:    { n: 'Logística / depósito',  extra: 'Habilitación de autoelevadores, circulación peatonal y estiba segura' },
    comercio:     { n: 'Comercio / oficinas',   extra: 'Carga de fuego, salidas de emergencia y ergonomía de puestos con pantalla' },
    gastronomia:  { n: 'Gastronomía',           extra: 'Riesgo de incendio en cocina, campanas, gas y manipulación segura de alimentos' }
  };

  var DOT = {
    '1': { n: 'Hasta 10 personas',   note: 'Con dotación chica la carga horaria profesional es baja, pero la obligación existe igual.' },
    '2': { n: '11 a 50 personas',    note: 'A partir de 11 personas la exigencia documental y la carga horaria profesional crecen.' },
    '3': { n: '51 a 150 personas',   note: 'Con esta dotación se requiere mayor carga horaria profesional y control periódico documentado.' },
    '4': { n: 'Más de 150 personas', note: 'Dotación grande: servicio de H&S con carga horaria alta y sistema de gestión formal.' }
  };

  var state = { rubro: 'industria', dot: '1' };

  var out = {
    val:     document.getElementById('scoreVal'),
    meter:   document.getElementById('meter'),
    verdict: document.getElementById('verdict'),
    gaps:    document.getElementById('gapList'),
    wa:      document.getElementById('diagWa')
  };

  // segmentos del medidor
  var SEG = 12;
  if (out.meter) {
    for (var s = 0; s < SEG; s++) out.meter.appendChild(document.createElement('i'));
  }
  var segs = out.meter ? out.meter.querySelectorAll('i') : [];

  function bindChips(id, key) {
    var box = document.getElementById(id);
    if (!box) return;
    box.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        box.querySelectorAll('.chip').forEach(function (o) { o.classList.remove('is-on'); });
        c.classList.add('is-on');
        state[key] = c.dataset.v;
        render();
      });
    });
  }
  bindChips('chipsRubro', 'rubro');
  bindChips('chipsDot', 'dot');

  document.querySelectorAll('#checks input').forEach(function (i) {
    i.addEventListener('change', render);
  });

  var shown = 0; // valor animado del contador

  function animateScore(target) {
    var from = shown, start = null, dur = 700;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      shown = Math.round(from + (target - from) * eased);
      out.val.textContent = shown;
      if (p < 1) requestAnimationFrame(step);
      else shown = target;
    }
    requestAnimationFrame(step);
  }

  function render() {
    var score = 0, gaps = [];
    ITEMS.forEach(function (it) {
      var input = document.querySelector('#checks input[data-k="' + it.k + '"]');
      if (input && input.checked) score += it.w;
      else gaps.push(it);
    });

    animateScore(score);

    var filled = Math.round((score / 100) * SEG);
    segs.forEach(function (el, i) { el.classList.toggle('on', i < filled); });

    var title, desc;
    if (score >= 100)     { title = 'Cumplimiento completo';   desc = 'Excelente. Lo que queda es sostenerlo: vigencias, actualizaciones y registro de cada visita.'; }
    else if (score >= 85) { title = 'Nivel sólido';            desc = 'Estás muy bien parado. Con los puntos de abajo cerrados, quedás en regla y con respaldo formal.'; }
    else if (score >= 65) { title = 'Buen nivel, con brechas'; desc = 'La base está, pero las brechas que quedan son justo las que se miran en una inspección.'; }
    else if (score >= 40) { title = 'Cumplimiento parcial';    desc = 'Hay exposición real: ante un accidente, la falta de documentación recae sobre el empleador.'; }
    else                  { title = 'Situación crítica';       desc = 'Tu empresa está expuesta a sanciones de la SRT y a responsabilidad directa ante un accidente.'; }

    out.verdict.innerHTML = '<b>' + title + '</b>' + desc + ' ' + DOT[state.dot].note;

    var html = '';
    gaps.forEach(function (g) {
      html += '<li class="gap"><span>' + g.txt + '<small>' + g.ref + '</small></span></li>';
    });
    html += '<li class="gap gap--ok"><span>Según tu rubro (' + RUBRO[state.rubro].n.toLowerCase() + '): ' +
            RUBRO[state.rubro].extra + '</span></li>';
    out.gaps.innerHTML = html;

    var msg = 'Hola SEGHI, hice el autodiagnóstico de la web.\n' +
              '• Rubro: ' + RUBRO[state.rubro].n + '\n' +
              '• Dotación: ' + DOT[state.dot].n + '\n' +
              '• Nivel de cumplimiento: ' + score + '%\n';
    if (gaps.length) {
      msg += '• Me falta cubrir:\n';
      gaps.forEach(function (g) { msg += '   - ' + g.txt + '\n'; });
    } else {
      msg += '• Tengo todos los puntos cubiertos y quiero mantenerlos al día.\n';
    }
    msg += '\nQuiero coordinar un relevamiento.';

    out.wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  if (out.val) render();

  /* ---------------- proceso: línea dorada al entrar ---------------- */
  var pio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); pio.unobserve(e.target); }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.proc__list li').forEach(function (li) { pio.observe(li); });

  /* ---------------- año ---------------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
