/* =========================================================
   Espacio Luz de Conciencia — interacciones
   ========================================================= */
(function () {
  'use strict';

  var WA = '5492995575927';
  var STORE = 'elc_guia_v1';

  /* ---------- WhatsApp: arma todos los links con data-wa ---------- */
  function waLink(texto) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    a.setAttribute('href', waLink(a.getAttribute('data-wa')));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function closeMenu() {
    if (!burger) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    if (window.matchMedia('(max-width:900px)').matches) menu.hidden = true;
  }
  function syncMenu() {
    if (!menu) return;
    if (window.matchMedia('(max-width:900px)').matches) {
      if (burger.getAttribute('aria-expanded') !== 'true') menu.hidden = true;
    } else {
      menu.hidden = false;
    }
  }
  if (burger && menu) {
    syncMenu();
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      burger.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      menu.hidden = open;
    });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', syncMenu);
  }

  function onScroll() {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var qa = location.search.indexOf('qa') > -1;
  if (qa || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add('in'); }, Math.min(i, 4) * 70);
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ---------- Video del hero (algunos navegadores no autoplay) ---------- */
  var v = document.querySelector('.disc-media video');
  if (v) {
    var tryPlay = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    tryPlay();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) tryPlay(); });
    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }

  /* ---------- Guía: ¿por dónde empiezo? ---------- */
  var MAPA = {
    decision: {
      frase: 'Tengo que tomar una decisión',
      consulta: 'Tarot de pronóstico',
      ancla: '#c-tarot',
      por: 'Cuando hay un tema concreto sobre la mesa y querés ver hacia dónde se está moviendo antes de decidir, la lectura de pronóstico es la que suele dar más claridad.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Tengo que tomar una decisión y me interesaría una lectura de tarot de pronóstico.'
    },
    repite: {
      frase: 'Algo se repite y no sé por qué',
      consulta: 'Tarot terapéutico',
      ancla: '#c-tarot',
      por: 'Acá no se trata de adivinar qué va a pasar, sino de mirar el patrón: qué parte tuya lo sostiene y por dónde se puede aflojar.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Hay algo que se me repite y me interesaría una lectura de tarot terapéutico.'
    },
    familia: {
      frase: 'Hay un tema de familia',
      consulta: 'Constelación familiar',
      ancla: '#c-constelacion',
      por: 'Si el tema viene de atrás —de tus viejos, de tus abuelos, de una historia que nadie nombra— la constelación es el trabajo que lo pone a la vista.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Tengo un tema de familia y quería consultarte por una constelación familiar.'
    },
    entenderme: {
      frase: 'Quiero entenderme mejor',
      consulta: 'Carta natal',
      ancla: '#c-natal',
      por: 'La carta natal es tu mapa de base: cómo funcionás, qué te mueve, qué te cuesta y con qué tiempos. Hace falta fecha, hora y lugar de nacimiento.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Quiero entenderme mejor y me interesaría una carta natal.'
    },
    cansancio: {
      frase: 'Estoy agotada y con el cuerpo tenso',
      consulta: 'Reiki con cuencos tibetanos',
      ancla: '#c-reiki',
      por: 'Cuando el cansancio está en el cuerpo y la cabeza no para, conviene empezar por una sesión de energía con cuencos antes que por una lectura.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Estoy con mucho cansancio y me interesaría una sesión de reiki con cuencos tibetanos.'
    },
    ambiente: {
      frase: 'Siento mi casa o mi ánimo pesados',
      consulta: 'Limpieza',
      ancla: '#c-limpieza',
      por: 'Para eso está la limpieza. Según sea la persona o el ambiente, se trabaja distinto: contame la situación y te digo cómo.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Siento el ambiente pesado y quería consultarte por una limpieza.'
    },
    pareja: {
      frase: 'Tengo una duda con una persona',
      consulta: 'Tarot de pronóstico',
      ancla: '#c-tarot',
      por: 'Para una pregunta puntual sobre un vínculo, la lectura de pronóstico muestra el momento del tema y qué se está moviendo ahí.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Tengo una duda con una persona y me interesaría una lectura de tarot.'
    },
    duelo: {
      frase: 'Estoy atravesando una pérdida',
      consulta: 'Constelación familiar',
      ancla: '#c-constelacion',
      por: 'En las pérdidas suele ayudar mirar el lugar de quien se fue dentro del sistema. Si preferís algo más del cuerpo, también se puede empezar por reiki con cuencos.',
      wa: 'Hola Paula! Vi la web de Espacio Luz de Conciencia. Estoy atravesando una pérdida y quería consultarte cómo me podés acompañar.'
    }
  };

  var chips = document.querySelectorAll('.chip');
  var card = document.getElementById('guiaCard');
  var empty = document.getElementById('guiaEmpty');
  var elYou = document.getElementById('guiaYou');
  var elTitle = document.getElementById('guiaTitle');
  var elWhy = document.getElementById('guiaWhy');
  var elWa = document.getElementById('guiaWa');
  var elMore = document.getElementById('guiaMore');
  var reset = document.getElementById('guiaReset');
  var box = document.getElementById('guiaOut');

  function pintar(key, scroll) {
    var d = MAPA[key];
    if (!d || !card) return;
    Array.prototype.forEach.call(chips, function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-key') === key ? 'true' : 'false');
    });
    elYou.textContent = '“' + d.frase.toLowerCase() + '”';
    elTitle.textContent = d.consulta;
    elWhy.textContent = d.por;
    elWa.setAttribute('href', waLink(d.wa));
    elWa.setAttribute('target', '_blank');
    elWa.setAttribute('rel', 'noopener');
    elMore.setAttribute('href', d.ancla);
    empty.hidden = true;
    card.hidden = false;
    if (box) {
      box.classList.remove('ping');
      void box.offsetWidth;
      box.classList.add('ping');
    }
    try { localStorage.setItem(STORE, key); } catch (e) {}
    if (scroll && box && window.matchMedia('(max-width:900px)').matches) {
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  Array.prototype.forEach.call(chips, function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () { pintar(c.getAttribute('data-key'), true); });
  });

  if (reset) {
    reset.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-pressed', 'false'); });
      card.hidden = true;
      empty.hidden = false;
      try { localStorage.removeItem(STORE); } catch (e) {}
    });
  }

  try {
    var prev = localStorage.getItem(STORE);
    if (prev && MAPA[prev]) pintar(prev, false);
  } catch (e) {}

  /* ---------- Título del hero: achicar si no entra (letra grande Android) ---------- */
  function fitText() {
    var h1 = document.getElementById('h1');
    if (!h1) return;
    h1.style.fontSize = '';
    var parent = h1.parentElement;
    if (!parent) return;
    var guard = 0;
    while (h1.scrollWidth > parent.clientWidth && guard < 24) {
      var cur = parseFloat(window.getComputedStyle(h1).fontSize);
      h1.style.fontSize = (cur * 0.95) + 'px';
      guard++;
    }
  }
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
  fitText();
})();
