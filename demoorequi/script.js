/* ============================================================
   Estudio Jurídico Integral Orequi & Asoc. — TuPaginaYa
   ============================================================ */
(function () {
  'use strict';

  var WA = '5491133811256';

  /* Textos por área — se usan para armar el mensaje de WhatsApp */
  var AREAS = {
    familia:    'un tema de familia (divorcio, cuota alimentaria o régimen de comunicación)',
    laboral:    'un tema laboral (despido, trabajo en negro o accidente de trabajo)',
    sucesiones: 'una sucesión / herencia',
    danos:      'un accidente o un reclamo por daños',
    consumidor: 'un problema como consumidor (banco, telefónica, aerolínea o compra)',
    civil:      'un contrato o un alquiler',
    otro:       'una consulta legal'
  };

  function waLink(text) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }

  function openWa(text) {
    window.open(waLink(text), '_blank', 'noopener');
  }


  /* ---------- modo QA (?qa / headless): saltea animaciones para capturas ---------- */
  var QA = /(?:\?|&)qa/.test(location.search) || /HeadlessChrome/.test(navigator.userAgent);
  if (QA) {
    document.documentElement.style.scrollBehavior = 'auto';
    var to = new URLSearchParams(location.search).get('to');
    window.addEventListener('load', function () {
      document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
      if (to) {
        setTimeout(function () {
          var t = document.getElementById(to);
          if (!t) return;
          var off = t.getBoundingClientRect().top + window.scrollY - 70;
          document.body.style.marginTop = (-off) + 'px';
        }, 700);
      }
    });
  }

  /* ---------- año del footer ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav sticky ---------- */
  var nav = document.getElementById('nav');
  var dock = document.getElementById('dock');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 40);
    if (dock) dock.classList.toggle('is-on', y > window.innerHeight * 0.7);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        burger.classList.remove('is-on');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- consulta directa del hero ---------- */
  var heroSel = document.getElementById('temaHero');
  var heroBtn = document.getElementById('heroSend');

  if (heroSel && heroBtn) {
    heroBtn.addEventListener('click', function () {
      var a = heroSel.value;
      openWa('Hola, quiero hacer una consulta por ' + (AREAS[a] || AREAS.otro) + '. ¿Me pueden orientar?');
    });
  }

  /* ---------- archivador: pestañas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var pans = Array.prototype.slice.call(document.querySelectorAll('.pan'));

  function showArea(area) {
    tabs.forEach(function (t) {
      var on = t.dataset.area === area;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    pans.forEach(function (p) {
      p.classList.toggle('is-on', p.dataset.area === area);
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showArea(t.dataset.area); });
  });

  /* flechas del teclado entre pestañas */
  var tabsBox = document.querySelector('.arch__tabs');
  if (tabsBox) {
    tabsBox.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' &&
          e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      showArea(next.dataset.area);
    });
  }

  /* botón "consultar por X" dentro de cada panel */
  document.querySelectorAll('.js-area').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var area = a.dataset.area;
      openWa('Hola, quiero hacer una consulta por ' + (AREAS[area] || AREAS.otro) + '. ¿Me pueden orientar?');
    });
  });

  /* ---------- formulario de consulta directa ---------- */
  var form = document.getElementById('cdForm');
  var grid = document.getElementById('cdGrid');
  var msg = document.getElementById('cdMsg');
  var nom = document.getElementById('cdNombre');
  var hint = document.getElementById('cdHint');
  var tema = 'familia';

  if (grid) {
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.opt');
      if (!b) return;
      grid.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      tema = b.dataset.area;
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var detalle = (msg && msg.value || '').trim();
      if (detalle.length < 8) {
        if (hint) {
          hint.textContent = 'Contanos aunque sea una frase para que puedan orientarte mejor.';
          hint.classList.add('is-err');
        }
        if (msg) msg.focus();
        return;
      }
      if (hint) {
        hint.textContent = 'Con un par de datos alcanza. Los detalles los vemos después.';
        hint.classList.remove('is-err');
      }

      var nombre = (nom && nom.value || '').trim();
      var texto = 'Hola' + (nombre ? ', soy ' + nombre : '') + '. ' +
        'Quiero hacer una consulta por ' + (AREAS[tema] || AREAS.otro) + '.\n\n' +
        'Mi caso: ' + detalle;

      openWa(texto);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var targets = document.querySelectorAll(
    '.sec-head, .arch__box, .banda__in, .step, .cd__head, .cd__form, ' +
    '.perfil__img, .perfil__txt, .qa, .cta__in'
  );

  if ('IntersectionObserver' in window) {
    targets.forEach(function (el) { el.classList.add('rv'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, i * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- acordeón: uno abierto por vez ---------- */
  var qas = document.querySelectorAll('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

})();
