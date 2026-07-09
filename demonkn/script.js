/* ============================================================
   NkN Maderas — interacciones
   ============================================================ */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav scrolled ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- menú móvil ---- */
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  function closeMenu() {
    navMobile.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      var open = navMobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- formulario "lista de precios" -> WhatsApp ---- */
  var WA_NUM = '5491150620365';
  var listaForm = document.getElementById('listaForm');
  if (listaForm) {
    listaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('lfNombre').value.trim();
      var tel = document.getElementById('lfTel').value.trim();
      var zona = document.getElementById('lfZona').value.trim();
      var checks = Array.prototype.slice.call(listaForm.querySelectorAll('input[name="lista"]:checked')).map(function (c) { return c.value; });

      var lines = ['Hola! Quiero pedir la lista de precios de maderas.', ''];
      lines.push('Nombre: ' + nombre);
      lines.push('WhatsApp: ' + tel);
      if (zona) lines.push('Zona: ' + zona);
      if (checks.length) {
        lines.push('', 'Me interesa la lista de:');
        checks.forEach(function (c) { lines.push('• ' + c); });
      } else {
        lines.push('', 'Quiero la lista de precios completa.');
      }

      var url = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank');
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll('section > .wrap, section > .manifiesto-in, section > .hero-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

})();
