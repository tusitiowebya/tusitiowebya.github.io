/* BORO Servicios Industriales — TuPaginaYa */
(function () {
  'use strict';

  /* ---------- año del footer ---------- */
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- nav sólida al scrollear ---------- */
  var nav = document.getElementById('nav');
  var carro = document.getElementById('carro');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('fija', y > 40);

    /* signature: el carro del puente grúa viaja con el progreso del scroll */
    if (carro) {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var p = alto > 0 ? Math.min(1, Math.max(0, y / alto)) : 0;
      carro.style.transform = 'translateX(' + (3 + p * 94) + 'vw)';
    }
  }
  var pidiendo = false;
  window.addEventListener('scroll', function () {
    if (pidiendo) return;
    pidiendo = true;
    requestAnimationFrame(function () { onScroll(); pidiendo = false; });
  }, { passive: true });
  onScroll();

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menuMobile');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      burger.classList.toggle('abierto', abierto);
      burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('abierto');
        burger.classList.remove('abierto');
      }
    });
  }

  /* ---------- reveal escalonado ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var hermanos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(hermanos, 5) * 90 + 'ms';
        el.classList.add('visible');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- el video de hero no siempre arranca solo en iOS ---------- */
  var video = document.querySelector('.hero__video');
  if (video) {
    var arrancar = function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* el poster queda visible */ });
    };
    arrancar();
    document.addEventListener('touchstart', arrancar, { once: true, passive: true });
    document.addEventListener('click', arrancar, { once: true });
  }
})();
