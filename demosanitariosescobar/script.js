/* ══════════════════════════════════════════════════════════
   SANITARIOS ESCOBAR — nav, reveal al scroll y armador de consulta
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var CFG = window.NEGOCIO || {};
  var RUBROS = CFG.RUBROS || [];

  /* ── Nav: sombra al scroll + menú mobile ─────────────────── */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('nav--on', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ── Reveal al entrar en viewport ─────────────────────────── */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Rubros: pintar cards ──────────────────────────────────── */
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var grid = document.getElementById('rubrosGrid');
  if (grid) {
    grid.innerHTML = RUBROS.map(function (r) {
      return '<article class="rubro" data-reveal>' +
        '<div class="rubro-foto"><img src="' + esc(r.img) + '" alt="' + esc(r.nombre) + '" loading="lazy"></div>' +
        '<div class="rubro-body">' +
          '<h3>' + esc(r.nombre) + '</h3>' +
          '<p>' + esc(r.copy) + '</p>' +
          '<ul class="rubro-items">' + r.items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') + '</ul>' +
          '<button type="button" class="rubro-add" data-rubro="' + esc(r.id) + '">Agregar a mi consulta</button>' +
        '</div></article>';
    }).join('');
    reveals = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } });
      }, { threshold: 0.14 });
      reveals.forEach(function (el) { io2.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ── Armador de consulta (carrito por rubro, sin precios) ──── */
  var seleccion = {};
  try { seleccion = JSON.parse(sessionStorage.getItem('se_consulta') || '{}'); } catch (e) { seleccion = {}; }

  function guardar() { try { sessionStorage.setItem('se_consulta', JSON.stringify(seleccion)); } catch (e) {} }
  function rubroPorId(id) { for (var i = 0; i < RUBROS.length; i++) if (RUBROS[i].id === id) return RUBROS[i]; return null; }
  function keys() { return Object.keys(seleccion).filter(function (k) { return seleccion[k]; }); }

  function linkWA(nota) {
    var elegidos = keys().map(function (k) { return rubroPorId(k); }).filter(Boolean);
    var lineas = elegidos.map(function (r) { return '• ' + r.nombre; }).join('\n');
    var texto = (CFG.WA_TEXTO || 'Hola, quiero hacer una consulta:') +
      (lineas ? '\n\n' + lineas : '') +
      (nota ? '\n\nDetalle: ' + nota : '');
    return 'https://wa.me/' + CFG.WA + '?text=' + encodeURIComponent(texto);
  }

  var barra = document.getElementById('cartBar');
  var barraCount = document.getElementById('cartCount');
  var barraNombres = document.getElementById('cartNombres');
  var drawer = document.getElementById('cart');
  var scrim = document.getElementById('cartScrim');
  var body = document.getElementById('cartBody');
  var waLink = document.getElementById('cartWaLink');
  var notaInput = document.getElementById('cartNota');

  function pintarBotones() {
    document.querySelectorAll('[data-rubro]').forEach(function (b) {
      var id = b.getAttribute('data-rubro');
      var on = !!seleccion[id];
      b.classList.toggle('en', on);
      b.textContent = on ? '✓ En tu consulta' : 'Agregar a mi consulta';
    });
  }

  function pintarBarra() {
    var n = keys().length;
    if (barra) barra.classList.toggle('on', n > 0);
    document.body.classList.toggle('cart-activa', n > 0);
    if (barraCount) barraCount.textContent = n;
    var navCount = document.getElementById('navCount');
    if (navCount) navCount.textContent = n;
    if (barraNombres) {
      var nombres = keys().map(function (k) { var r = rubroPorId(k); return r ? r.nombre : ''; });
      barraNombres.textContent = nombres.join(' · ');
    }
  }

  function pintarDrawer() {
    if (!body) return;
    var elegidos = keys().map(rubroPorId).filter(Boolean);
    if (!elegidos.length) {
      body.innerHTML = '<div class="cart-empty">Todavía no elegiste ningún rubro. Sumá los que necesites desde “Nuestros rubros”.</div>';
    } else {
      body.innerHTML = elegidos.map(function (r) {
        return '<div class="cart-item"><img src="' + esc(r.img) + '" alt="">' +
          '<span>' + esc(r.nombre) + '</span>' +
          '<button type="button" class="cart-quitar" data-quitar="' + esc(r.id) + '" aria-label="Quitar">×</button></div>';
      }).join('');
    }
    if (waLink) waLink.href = linkWA(notaInput ? notaInput.value.trim() : '');
  }

  function abrir(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('on', open);
    document.body.classList.toggle('no-scroll', open);
    if (open) pintarDrawer();
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-rubro]');
    if (add) {
      var id = add.getAttribute('data-rubro');
      seleccion[id] = !seleccion[id];
      guardar(); pintarBotones(); pintarBarra(); pintarDrawer();
      return;
    }
    var open = e.target.closest('[data-cart-open]');
    if (open) { e.preventDefault(); abrir(true); return; }
    var close = e.target.closest('[data-cart-close]');
    if (close) { abrir(false); return; }
    var quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      seleccion[quitar.getAttribute('data-quitar')] = false;
      guardar(); pintarBotones(); pintarBarra(); pintarDrawer();
    }
  });
  if (notaInput) notaInput.addEventListener('input', function () { if (waLink) waLink.href = linkWA(notaInput.value.trim()); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });

  pintarBotones(); pintarBarra();

  /* ── Año en footer ─────────────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
