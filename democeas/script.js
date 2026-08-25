/* ═══════════════════════════════════════════════════════════
   CEAS APRENDIZAJE SOCIAL — TuPaginaYa
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = document.documentElement;
  var LITE = H.classList.contains('lite');
  var WA = '5491164694910';

  /* ── año ───────────────────────────────────────────── */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── nav ───────────────────────────────────────────── */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('nav--stuck', window.scrollY > 24);
    var wf = document.getElementById('wafloat');
    if (wf) wf.classList.toggle('on', window.scrollY > window.innerHeight * 0.62);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  if (links) {
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── reveal ────────────────────────────────────────── */
  if (!LITE && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
        setTimeout(function () { el.classList.add('in'); }, Math.min(sib, 5) * 85);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ── video del hero (data-src: en LITE no se pide) ─── */
  var vid = document.querySelector('.ronda__vid');
  if (vid && !LITE) {
    var src = vid.getAttribute('data-src');
    if (src) {
      vid.setAttribute('preload', 'auto');
      vid.src = src;
      var p = vid.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: queda el poster */ });
    }
  }

  /* ══════════════════════════════════════════════════════
     LA RONDA — nodos sobre el anillo del hero
     ══════════════════════════════════════════════════════ */
  (function ronda() {
    var host = document.getElementById('ronda');
    var gN = document.getElementById('rrNodes');
    var gL = document.getElementById('rrLinks');
    if (!host || !gN || !gL) return;

    var NS = 'http://www.w3.org/2000/svg';
    var N = 9, R = 186, CX = 200, CY = 200, pts = [];

    for (var i = 0; i < N; i++) {
      var a = (-90 + (360 / N) * i) * Math.PI / 180;
      pts.push({ x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) });
    }

    // líneas de vínculo (todas contra todas, tenues)
    pts.forEach(function (p, i) {
      for (var j = i + 1; j < N; j++) {
        var l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', p.x.toFixed(1)); l.setAttribute('y1', p.y.toFixed(1));
        l.setAttribute('x2', pts[j].x.toFixed(1)); l.setAttribute('y2', pts[j].y.toFixed(1));
        l.dataset.a = i; l.dataset.b = j;
        gL.appendChild(l);
      }
    });

    pts.forEach(function (p, i) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1));
      c.setAttribute('r', 7);
      c.dataset.i = i;
      gN.appendChild(c);
    });

    setTimeout(function () { host.classList.add('is-on'); }, 500);
    if (LITE) return;

    // el "emergente": un nodo se enciende y sus vínculos se marcan
    var nodes = gN.querySelectorAll('circle');
    var lines = gL.querySelectorAll('line');
    var cur = -1;

    function light(k) {
      nodes.forEach(function (n, i) { n.classList.toggle('hot', i === k); });
      lines.forEach(function (l) {
        var on = +l.dataset.a === k || +l.dataset.b === k;
        l.style.opacity = on ? '.85' : '.16';
        l.style.stroke = on ? 'var(--coral)' : 'var(--azul)';
      });
    }
    var timer = setInterval(function () {
      cur = (cur + 1) % N;
      light(cur);
    }, 2200);

    nodes.forEach(function (n) {
      n.style.cursor = 'pointer';
      n.addEventListener('mouseenter', function () { light(+n.dataset.i); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer);
    });
  })();

  /* ══════════════════════════════════════════════════════
     SIGNATURE — EL CONO INVERTIDO
     ══════════════════════════════════════════════════════ */
  (function cono() {
    var box = document.getElementById('vecs');
    if (!box) return;

    var NS = 'http://www.w3.org/2000/svg';

    var VECS = [
      {
        k: 'afiliacion', n: 'Afiliación y pertenencia',
        d: '¿se sienten parte o están de visita?',
        r: [
          'Cada uno viene, cumple y se va: nadie siente el grupo como propio.',
          'Hay pertenencia en algunos y en otros no — el grupo tiene socios y espectadores.',
          'Se sienten parte: el grupo existe también cuando no están reunidos.'
        ]
      },
      {
        k: 'cooperacion', n: 'Cooperación',
        d: '¿se reparten la tarea o cada uno tira para su lado?',
        r: [
          'No hay aporte mutuo: se compite o se descarga todo en una misma persona.',
          'Cooperan cuando el tema les interesa, no cuando la tarea se pone pesada.',
          'Los roles se complementan y el trabajo se reparte sin que haya que pedirlo.'
        ]
      },
      {
        k: 'pertinencia', n: 'Pertinencia',
        d: '¿se centran en la tarea o se van por las ramas?',
        r: [
          'La tarea se pierde: se habla de todo menos de lo que hay que resolver.',
          'Arrancan centrados y se dispersan; hay que volver a encuadrar seguido.',
          'El grupo sostiene la tarea y sabe volver a ella cuando se desvía.'
        ]
      },
      {
        k: 'comunicacion', n: 'Comunicación',
        d: '¿lo que se dice llega?',
        r: [
          'Se habla mucho y se escucha poco; lo importante circula por afuera del grupo.',
          'La información llega, pero incompleta o tarde, y hay malentendidos frecuentes.',
          'Se dice lo que hay que decir y hay lugar para lo que cuesta decir.'
        ]
      },
      {
        k: 'aprendizaje', n: 'Aprendizaje',
        d: '¿cambia algo o repiten siempre lo mismo?',
        r: [
          'Los mismos conflictos vuelven una y otra vez: el grupo no aprende de lo que le pasa.',
          'Se corrigen algunas cosas, pero los cambios no se sostienen en el tiempo.',
          'El grupo revisa lo que hace y transforma la experiencia en criterio propio.'
        ]
      },
      {
        k: 'tele', n: 'Tele',
        d: '¿hay clima de aceptación o de rechazo?',
        r: [
          'El clima es de rechazo o desconfianza; hay que cuidarse de lo que se dice.',
          'Hay afinidades y roces; el clima depende de quién esté ese día.',
          'Hay confianza básica: se puede estar en desacuerdo sin que se rompa nada.'
        ]
      }
    ];

    var state = {};

    /* — panel de vectores — */
    VECS.forEach(function (v) {
      var el = document.createElement('div');
      el.className = 'vec';
      el.dataset.k = v.k;
      el.innerHTML =
        '<div class="vec__top"><span class="vec__n">' + v.n + '</span>' +
        '<span class="vec__d">' + v.d + '</span></div>' +
        '<div class="vec__opts" role="group" aria-label="' + v.n + '">' +
        '<button type="button" data-v="0" aria-pressed="false">Traba</button>' +
        '<button type="button" data-v="1" aria-pressed="false">Más o menos</button>' +
        '<button type="button" data-v="2" aria-pressed="false">Anda bien</button>' +
        '</div>';
      box.appendChild(el);

      el.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          state[v.k] = +b.dataset.v;
          el.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          el.classList.add('set');
          render();
        });
      });
    });

    /* — niveles del cono — */
    var gLev = document.getElementById('conoLevels');
    [['tarea explícita', 82], ['lo que se juega', 190], ['situación básica', 296]].forEach(function (L) {
      var y = L[1];
      // ancho del cono a esa altura (triángulo 14..326 en y=26 → punta 170 en y=386)
      var t = (y - 26) / 360, half = 156 * (1 - t);
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', (170 - half + 6).toFixed(1)); ln.setAttribute('x2', (170 + half - 6).toFixed(1));
      ln.setAttribute('y1', y); ln.setAttribute('y2', y);
      gLev.appendChild(ln);
      var tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', 170); tx.setAttribute('y', y - 6);
      tx.setAttribute('text-anchor', 'middle');
      tx.textContent = L[0];
      gLev.appendChild(tx);
    });

    /* — espiral dialéctica — */
    function spiral(turns) {
      var d = '', steps = Math.max(8, Math.round(turns * 46));
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;                       // 0 = vértice, 1 = base
        var y = 386 - t * 336;
        var half = 156 * ((y - 26) / 360);       // radio disponible a esa altura
        var rad = half * 0.68 * t;
        var a = t * turns * Math.PI * 2 - Math.PI / 2;
        var x = 170 + rad * Math.cos(a);
        var yy = y + rad * 0.30 * Math.sin(a);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1);
      }
      return d;
    }

    var fill = document.getElementById('coneFill');
    var sp = document.getElementById('conoSpiral');
    var outNum = document.getElementById('outNum');
    var outTitle = document.getElementById('outTitle');
    var outTxt = document.getElementById('outTxt');
    var outList = document.getElementById('outList');
    var outWa = document.getElementById('outWa');

    var BANDAS = [
      [0, 24, 'Grupo trabado', 'Con este panorama la tarea casi no puede sostenerse: la energía se va en resolver lo vincular. No es un diagnóstico feo — es el punto donde más sirve una mirada de afuera.'],
      [25, 44, 'Hay tarea, pero cuesta', 'El grupo funciona a los tirones. Hay algo que se repite y traba: en general aparece en los vectores más bajos, no en el que más ruido hace.'],
      [45, 64, 'Grupo en movimiento', 'Hay materia prima. El grupo puede trabajar, pero todavía depende demasiado de quién esté con ganas ese día.'],
      [65, 84, 'Buen funcionamiento', 'El grupo sostiene la tarea y se banca los desacuerdos. Lo que falta es afinar: los vectores más bajos son la palanca más barata.'],
      [85, 100, 'Grupo operativo', 'Este grupo aprende de lo que le pasa. Ojo igual: los grupos muy afiatados a veces evitan el conflicto para no romper el clima.']
    ];

    var animId = null;
    function animateNum(to) {
      var from = parseInt(outNum.textContent, 10); if (isNaN(from)) from = 0;
      if (LITE) { outNum.textContent = to; return; }
      cancelAnimationFrame(animId);
      var t0 = performance.now(), dur = 620;
      (function step(t) {
        var k = Math.min(1, (t - t0) / dur);
        k = 1 - Math.pow(1 - k, 3);
        outNum.textContent = Math.round(from + (to - from) * k);
        if (k < 1) animId = requestAnimationFrame(step);
      })(t0);
    }

    function render() {
      var keys = Object.keys(state);
      if (!keys.length) return;

      var sum = 0;
      VECS.forEach(function (v) { if (state[v.k] != null) sum += state[v.k]; });
      var score = Math.round((sum / (VECS.length * 2)) * 100);
      var completo = keys.length === VECS.length;

      // cono
      var h = (score / 100) * 360;
      fill.setAttribute('y', (386 - h).toFixed(1));
      fill.setAttribute('height', h.toFixed(1));
      sp.setAttribute('d', spiral(1.2 + (score / 100) * 2.4));
      if (!LITE) {
        var len = sp.getTotalLength ? sp.getTotalLength() : 800;
        sp.style.transition = 'none';
        sp.style.strokeDasharray = len; sp.style.strokeDashoffset = len;
        void sp.getBoundingClientRect();
        sp.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)';
        sp.style.strokeDashoffset = 0;
      }

      // veredicto
      outNum.classList.remove('is-empty');
      animateNum(score);
      var b = BANDAS.find(function (x) { return score >= x[0] && score <= x[1]; }) || BANDAS[0];
      outTitle.textContent = completo ? b[2] : 'Vas ' + keys.length + ' de ' + VECS.length;
      outTxt.textContent = completo ? b[3] : 'Seguí marcando los vectores que faltan: la lectura se arma con los seis, porque ninguno se explica solo.';

      // lecturas, de lo que más traba a lo que mejor anda
      outList.innerHTML = '';
      VECS.filter(function (v) { return state[v.k] != null; })
        .sort(function (a, c) { return state[a.k] - state[c.k]; })
        .forEach(function (v) {
          var li = document.createElement('li');
          if (state[v.k] === 2) li.className = 'ok';
          li.innerHTML = '<b>' + v.n + '.</b> ' + v.r[state[v.k]];
          outList.appendChild(li);
        });

      // whatsapp
      var lin = VECS.filter(function (v) { return state[v.k] != null; })
        .map(function (v) { return '• ' + v.n + ': ' + ['traba', 'más o menos', 'anda bien'][state[v.k]]; })
        .join('\n');
      var msg = 'Hola CEAS! Probé el cono invertido de la web con un grupo mío y me dio ' + score + '/100 (' + b[2] + ').\n\n' + lin + '\n\nMe gustaría charlarlo y saber más de la formación.';
      outWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    }

    var reset = document.getElementById('conoReset');
    if (reset) {
      reset.addEventListener('click', function () {
        state = {};
        box.querySelectorAll('.vec').forEach(function (el) {
          el.classList.remove('set');
          el.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        });
        fill.setAttribute('height', 0); fill.setAttribute('y', 386);
        sp.setAttribute('d', '');
        outNum.textContent = '—'; outNum.classList.add('is-empty');
        outTitle.textContent = 'Marcá los seis vectores';
        outTxt.textContent = 'Cada vector es una manera de mirar lo mismo: si el grupo puede trabajar junto o si algo lo traba. No hay respuesta correcta — hay lectura.';
        outList.innerHTML = '';
        outWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola CEAS! Quiero saber más de la formación en Psicología Social.');
      });
    }

    // arranque: link de WhatsApp base
    outWa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola CEAS! Quiero saber más de la formación en Psicología Social.');

    // demo automática al entrar en viewport
    if (!LITE && 'IntersectionObserver' in window) {
      var seeded = false;
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting || seeded) return;
          seeded = true; io2.disconnect();
          var demo = [1, 2, 0, 1, 1, 2], i = 0;
          var t = setInterval(function () {
            if (i >= VECS.length || Object.keys(state).length > i) { clearInterval(t); return; }
            var v = VECS[i], el = box.querySelector('.vec[data-k="' + v.k + '"]');
            if (el) el.querySelector('button[data-v="' + demo[i] + '"]').click();
            i++;
          }, 340);
        });
      }, { threshold: 0.3 });
      io2.observe(document.getElementById('cono'));
    }
  })();

  /* ══════════════════════════════════════════════════════
     WATCHDOG DE FPS — degrada a LITE en caliente
     ══════════════════════════════════════════════════════ */
  if (!LITE && !H.classList.contains('full')) {
    var f = 0, t0 = performance.now();
    (function tick(t) {
      f++;
      if (t - t0 < 2000) return requestAnimationFrame(tick);
      var fps = f / ((t - t0) / 1000);
      if (fps < 28) {
        H.classList.add('lite');
        try { sessionStorage.setItem('ceas_lite', '1'); } catch (e) {}
      }
    })(t0);
  }
})();
