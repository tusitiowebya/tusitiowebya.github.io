/* ===========================================================
   Elisa Piñeiro — TuPaginaYa
   =========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIGURACIÓN — cambiar acá y listo
     WA: número de WhatsApp con código de país, sin + ni espacios.
     REDES: links reales de cada red (dejar '' para ocultar).
     --------------------------------------------------------- */
  var WA = '5491100000000';            // TODO: número real de Elisa
  var REDES = {
    facebook: '',                      // TODO
    youtube: '',                       // TODO
    linkedin: ''                       // TODO
  };

  var waBase = 'https://wa.me/' + WA;

  /* ---------- links de WhatsApp ---------- */
  function waLink(msg) {
    return waBase + '?text=' + encodeURIComponent(msg);
  }
  [].forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    a.href = waLink(a.dataset.msg || 'Hola Elisa. Vengo de tu web y quiero hacerte una consulta.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- redes sociales ---------- */
  [].forEach.call(document.querySelectorAll('[data-social]'), function (a) {
    var url = REDES[a.dataset.social];
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      var li = a.closest('li');
      if (li) li.hidden = true;
    }
  });

  /* ---------- año ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function onScroll() { nav.classList.toggle('solid', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ===========================================================
     MAPA DE LA REPETICIÓN — señales tomadas de sus propios posteos
     =========================================================== */
  var SIGNALS = [
    { t: 'Sabés que el vínculo no te hace bien y aun así volvés', g: 'soltar' },
    { t: 'Te adaptás para no perder al otro', g: 'dependencia' },
    { t: 'Esperás que finalmente te elijan', g: 'dependencia' },
    { t: 'Aparece el miedo a que te abandonen antes de que pase nada', g: 'ansiedad' },
    { t: 'Justificás lo que te lastima una y otra vez', g: 'soltar' },
    { t: 'Te cuesta poner un límite o sostenerlo', g: 'limites' },
    { t: 'Terminás preguntándote qué estás haciendo mal', g: 'limites' },
    { t: 'Cambiaste de persona y la historia fue la misma', g: 'repeticion' },
    { t: 'Vivís la relación en estado de alerta', g: 'ansiedad' }
  ];

  var EJES = {
    soltar: 'la dificultad para soltar',
    dependencia: 'la dependencia emocional',
    ansiedad: 'la ansiedad dentro del vínculo',
    limites: 'los límites y el lugar que ocupás',
    repeticion: 'la repetición del mismo patrón'
  };

  var list = document.getElementById('mapaList');
  var num = document.getElementById('mapaNum');
  var bar = document.getElementById('mapaBar');
  var title = document.getElementById('mapaTitle');
  var text = document.getElementById('mapaText');
  var cta = document.getElementById('mapaWa');

  if (list) {
    SIGNALS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sig';
      b.setAttribute('aria-pressed', 'false');
      b.dataset.i = i;
      b.textContent = s.t;
      list.appendChild(b);
    });

    list.addEventListener('click', function (e) {
      var b = e.target.closest('.sig');
      if (!b) return;
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    });

    update();
  }

  function update() {
    var picked = [].slice.call(list.querySelectorAll('.sig[aria-pressed="true"]'))
      .map(function (b) { return SIGNALS[+b.dataset.i]; });
    var n = picked.length;

    num.textContent = n;
    bar.style.width = (n / SIGNALS.length * 100) + '%';

    /* eje predominante */
    var count = {};
    picked.forEach(function (p) { count[p.g] = (count[p.g] || 0) + 1; });
    var top = null;
    Object.keys(count).forEach(function (k) {
      if (!top || count[k] > count[top]) top = k;
    });

    var t, x;
    if (n === 0) {
      t = 'Tocá las señales que te resuenen.';
      x = 'A medida que marques, te voy devolviendo qué eje aparece con más fuerza.';
    } else if (n <= 2) {
      t = 'Aparece algo, todavía en voz baja.';
      x = 'Lo que marcaste se organiza alrededor de ' + EJES[top] + '. Con una sesión individual podemos escucharlo con más detalle y ver qué necesita ser trabajado.';
    } else if (n <= 5) {
      t = 'Hay un patrón tomando forma.';
      x = 'Lo que más se repite en lo que marcaste tiene que ver con ' + EJES[top] +
          '. No se resuelve con fuerza de voluntad: necesita comprenderse. Un proceso sostenido es el camino que suelo proponer.';
    } else {
      t = 'Esto pide un trabajo en profundidad.';
      x = 'Marcaste ' + n + ' de ' + SIGNALS.length + ' señales, con ' + EJES[top] +
          ' como eje principal. Cuando la repetición ocupa tanto lugar, el proceso de ocho encuentros permite ir al origen y no solo al último vínculo.';
    }

    if (count.repeticion && n >= 3 && top !== 'repeticion') {
      x += ' Además reconocés que la historia se repitió con personas distintas: ahí el trabajo es sobre el patrón, no sobre esa relación.';
    }

    title.textContent = t;
    text.textContent = x;

    var msg = n === 0
      ? 'Hola Elisa. Vengo de tu web y quiero solicitar una sesión.'
      : 'Hola Elisa. Hice el mapa en tu web y marqué ' + n + ' de ' + SIGNALS.length + ' señales:\n\n' +
        picked.map(function (p) { return '• ' + p.t; }).join('\n') +
        '\n\nQuiero solicitar una sesión.';
    cta.href = waLink(msg);
    cta.textContent = n === 0 ? 'Escribirme por WhatsApp' : 'Mandarle estas ' + n + ' señales a Elisa';
  }

  /* ---------- reveals ---------- */
  var QA = /(\?|&)qa/.test(location.search);
  var targets = document.querySelectorAll(
    '.hero__txt, .hero__pic, .dato, .sechead, .motivo, .consulta__foot, ' +
    '.sobre__pic, .sobre__txt, .enfoque__head, .pilares li, .mapa__in, ' +
    '.plan, .pasos li, .libro__pics, .libro__txt, .testi, .faq__list, .cta__in'
  );
  if (!QA && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, (i % 4) * 85);
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    [].forEach.call(targets, function (t) { t.classList.add('rv'); io.observe(t); });
  }

  /* ---------- parallax suave en las fotos ---------- */
  var pics = document.querySelectorAll('.hero__pic .frame img, .sobre__pic .frame img');
  if (!QA && pics.length && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        [].forEach.call(pics, function (img) {
          var r = img.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          img.style.transform = 'scale(1.06) translateY(' + (p * -14).toFixed(2) + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- fitText: Android con letra del sistema agrandada ---------- */
  function fitText() {
    var sel = '.h-display, .h-sec, .nav__name em, .mapa__num, .libro__specs strong, .dato strong';
    [].forEach.call(document.querySelectorAll(sel), function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      var guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 11 && guard++ < 60) {
        size -= 1;
        el.style.fontSize = size + 'px';
      }
    });
  }
  window.__epFit = fitText;
  fitText();
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
})();
