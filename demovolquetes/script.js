/* =========================================================
   Volquetes Argentina — interacciones
   ========================================================= */
(function () {
  'use strict';

  var WA = '5491171369947';

  /* ---------- año del footer ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav sticky ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 40);
    var wa = document.getElementById('wafloat');
    if (wa) wa.classList.toggle('on', window.scrollY > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- reveal ---------- */
  var targets = document.querySelectorAll(
    '.strip__i, .sizes__head, .sizes__tabs, .scene, .waste__h2, .wcol,' +
    '.steps__h2, .steps__list li, .zones__head, .zcard, .zones__foot,' +
    '.why__txt, .why__call, .faq__h2, .faq__list, .final__in, .kicker'
  );
  targets.forEach(function (el) { el.classList.add('rv'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        setTimeout(function () { el.classList.add('in'); }, Math.min(sibs, 5) * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* =========================================================
     COMPARADOR A ESCALA
     1 m = 60 px · piso en y=220 · persona de 1,75 m fija
     ========================================================= */
  var DATA = {
    '3': {
      tag: 'El más chico',
      vol: '3',
      largo: 2.40, ancho: 1.60, alto: 0.80,
      dim: '2,40 × 1,60 × 0,80 m',
      bolsas: '≈ 100 bolsas de escombro',
      para: [
        'Reforma de un baño o una cocina',
        'Limpieza de patio, garaje o terraza',
        'Restos de poda y de jardín',
        'Entra hasta en las veredas angostas'
      ]
    },
    '5': {
      tag: 'El más pedido',
      vol: '5',
      largo: 3.10, ancho: 1.70, alto: 1.00,
      dim: '3,10 × 1,70 × 1,00 m',
      bolsas: '≈ 165 bolsas de escombro',
      para: [
        'Demolición de paredes y contrapisos',
        'Refacción completa de una casa',
        'Vaciado de casa, depósito o local',
        'Obra chica de albañilería'
      ]
    },
    '7': {
      tag: 'El más grande',
      vol: '7',
      largo: 3.90, ancho: 1.80, alto: 1.05,
      dim: '3,90 × 1,80 × 1,05 m',
      bolsas: '≈ 230 bolsas de escombro',
      para: [
        'Obra nueva o ampliación grande',
        'Limpieza y nivelado de terrenos',
        'Demolición completa',
        'Mucho volumen de tierra o escombro'
      ]
    }
  };

  var M = 60,        // px por metro
      BASE = 216,    // línea de piso
      X = 40;        // borde izquierdo del volquete

  var el = {
    body:  document.getElementById('binBody'),
    ribs:  document.getElementById('binRibs'),
    skid:  document.getElementById('binSkid'),
    lip:   document.getElementById('binLip'),
    dimHx: document.getElementById('dimHx'),
    dimHt: document.getElementById('dimHt'),
    dimVx: document.getElementById('dimVx'),
    dimVt: document.getElementById('dimVt'),
    tag:   document.getElementById('sTag'),
    vol:   document.getElementById('sVol'),
    dim:   document.getElementById('sDim'),
    para:  document.getElementById('sFor'),
    bags:  document.getElementById('sBags'),
    cta:   document.getElementById('sCta')
  };

  function fmt(n) { return String(n.toFixed(2)).replace('.', ','); }

  function draw(key) {
    var d = DATA[key];
    if (!d || !el.body) return;

    var w = d.largo * M,
        h = d.alto * M,
        top = BASE - h,
        SK = 7,               // alto del patín inferior
        lean = Math.min(20, w * 0.1); // inclinación del frente

    /* cuerpo: caja con el frente (izquierda) inclinado hacia adentro */
    el.body.setAttribute('d',
      'M' + (X + 5) + ' ' + top +
      ' L' + (X + w) + ' ' + top +
      ' L' + (X + w) + ' ' + (BASE - SK) +
      ' L' + (X + 5 + lean) + ' ' + (BASE - SK) + ' Z'
    );

    /* nervaduras internas */
    el.ribs.setAttribute('x', X + 5 + lean + 4);
    el.ribs.setAttribute('y', top + 5);
    el.ribs.setAttribute('width', Math.max(0, w - lean - 13));
    el.ribs.setAttribute('height', Math.max(0, h - SK - 10));

    /* patín inferior (los rieles sobre los que se apoya) */
    el.skid.setAttribute('d',
      'M' + (X + 1) + ' ' + (BASE - SK) +
      ' L' + (X + w + 6) + ' ' + (BASE - SK) +
      ' L' + (X + w + 6) + ' ' + BASE +
      ' L' + (X + 1) + ' ' + BASE + ' Z'
    );

    /* labio superior */
    el.lip.setAttribute('d',
      'M' + (X + 1) + ' ' + (top - 7) +
      ' L' + (X + w + 4) + ' ' + (top - 7) +
      ' L' + (X + w + 4) + ' ' + top +
      ' L' + (X + 1) + ' ' + top + ' Z'
    );

    /* cota horizontal (largo) */
    el.dimHx.setAttribute('x1', X + 1);
    el.dimHx.setAttribute('x2', X + w + 6);
    el.dimHx.setAttribute('y1', BASE + 16);
    el.dimHx.setAttribute('y2', BASE + 16);
    el.dimHt.setAttribute('x', X + w / 2);
    el.dimHt.setAttribute('y', BASE + 34);
    el.dimHt.textContent = fmt(d.largo) + ' m';

    /* cota vertical (alto) */
    var vx = X + w + 22;
    el.dimVx.setAttribute('x1', vx);
    el.dimVx.setAttribute('x2', vx);
    el.dimVx.setAttribute('y1', top - 7);
    el.dimVx.setAttribute('y2', BASE);
    el.dimVt.setAttribute('x', vx + 6);
    el.dimVt.setAttribute('y', top + h / 2);
    el.dimVt.setAttribute('text-anchor', 'start');
    el.dimVt.textContent = fmt(d.alto) + ' m';

    /* ficha */
    el.tag.textContent = d.tag;
    el.vol.textContent = d.vol;
    el.dim.textContent = d.dim;
    el.bags.textContent = d.bolsas;
    el.para.innerHTML = d.para.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    el.cta.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
      'Hola! Quiero alquilar el volquete de ' + d.vol + ' m³. ¿Me pasan precio y disponibilidad?'
    );
    el.cta.textContent = 'Pedir el de ' + d.vol + ' m³';
  }

  var tabs = document.querySelectorAll('.stab');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (o) {
        o.classList.remove('is-on');
        o.setAttribute('aria-selected', 'false');
      });
      b.classList.add('is-on');
      b.setAttribute('aria-selected', 'true');
      draw(b.dataset.size);
    });
  });

  draw('3');

  /* al entrar en viewport, recorre las tres medidas una vez (muestra la escala) */
  var scene = document.querySelector('.scene');
  if (scene && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var shown = false;
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || shown) return;
        shown = true;
        io2.disconnect();
        var seq = ['5', '7', '3'];
        seq.forEach(function (k, i) {
          setTimeout(function () {
            var t = document.querySelector('.stab[data-size="' + k + '"]');
            if (t) t.click();
          }, 620 + i * 720);
        });
      });
    }, { threshold: 0.4 });
    io2.observe(scene);
  }
})();
