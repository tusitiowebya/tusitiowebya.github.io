/* Fer Chu Baby's — landing */
(function () {
  'use strict';
  var C = window.FERCHU || {};

  // año
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // ---- banner de avisos ----
  var avisos = C.AVISOS || [];
  var track = document.getElementById('avisosTrack');
  if (track && avisos.length) {
    var one = avisos.map(function (a) { return '<span class="aviso">' + a + '</span>'; }).join('<span class="aviso-dot">•</span>');
    track.innerHTML = one + '<span class="aviso-dot">•</span>' + one; // duplicado para loop continuo
  } else if (document.getElementById('avisos')) {
    document.getElementById('avisos').style.display = 'none';
  }

  // ---- hero editable (opcional) ----
  var ht = document.querySelector('.hero h1');
  if (ht && C.BIENVENIDA) ht.textContent = C.BIENVENIDA;
  var hs = document.querySelector('.hero-sub');
  if (hs && C.SUBTITULO) hs.textContent = C.SUBTITULO;

  // ---- redes en footer ----
  var soc = document.getElementById('ftSocial');
  if (soc) {
    var s = '';
    if (C.INSTAGRAM) s += '<a href="' + C.INSTAGRAM + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg></a>';
    if (C.FACEBOOK) s += '<a href="' + C.FACEBOOK + '" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg></a>';
    s += '<a href="https://wa.me/' + C.WA + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7L7 20.4A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.6.7.7-2.5-.2-.3A8.2 8.2 0 1112 20.2z"/></svg></a>';
    soc.innerHTML = s;
  }

  // ---- nav scrolled ----
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- menú móvil ----
  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ---- helpers ----
  function money(n) { return '$' + Number(n || 0).toLocaleString('es-AR'); }
  function waProducto(p) {
    var t = 'Hola Fer Chu Baby\'s! Me interesa: ' + p.nombre + (p.descripcion ? ' (' + p.descripcion + ')' : '') + ' — ' + money(p.precio);
    return 'https://wa.me/' + C.WA + '?text=' + encodeURIComponent(t);
  }

  // ---- novedades en vivo desde cobros ----
  var grid = document.getElementById('promoGrid');
  if (grid && C.API && C.SLUG) {
    fetch(C.API + '/catalogo/' + C.SLUG)
      .then(function (r) { if (!r.ok) throw new Error('catalogo'); return r.json(); })
      .then(function (d) {
        var prods = (d.productos || []).slice(0, 4);
        if (!prods.length) { grid.innerHTML = '<p class="promo-msg">Muy pronto vas a ver acá nuestras novedades. Mientras, escribinos por WhatsApp. 🤍</p>'; return; }
        grid.innerHTML = prods.map(function (p) {
          var media = p.foto ? '<img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy">' : '🧺';
          return '<article class="promo-card">'
            + '<div class="promo-top">'
              + (p.categoria ? '<span class="promo-cat">' + p.categoria + '</span>' : '') + media
            + '</div>'
            + '<div class="promo-body">'
              + '<h3>' + p.nombre + '</h3>'
              + '<p class="promo-desc">' + (p.descripcion || '') + '</p>'
              + '<div class="promo-foot">'
                + '<span class="promo-price">' + money(p.precio) + '</span>'
                + '<a class="promo-btn" href="' + waProducto(p) + '" target="_blank" rel="noopener">Pedir</a>'
              + '</div>'
            + '</div></article>';
        }).join('');
      })
      .catch(function () {
        grid.innerHTML = '<p class="promo-msg">No pudimos cargar las novedades ahora. <a href="catalogo/">Ver catálogo →</a></p>';
      });
  }

  // ---- reveal ----
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
