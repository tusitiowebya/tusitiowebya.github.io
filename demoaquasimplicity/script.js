/* AQUA SIMPLICITY — demo TuPaginaYa */
(function () {
  'use strict';

  /* ---------- modo QA (capturas headless): ?qa ---------- */
  if (/[?&]qa/.test(location.search)) document.documentElement.classList.add('qa');
  var qy = location.search.match(/[?&]y=(\d+)/);
  if (qy) {
    document.documentElement.style.scrollBehavior = 'auto';
    window.addEventListener('load', function () { window.scrollTo(0, +qy[1]); });
  }

  /* ---------- año del footer ---------- */
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav sticky ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('is-open');
        burger.classList.remove('is-on');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('on'); }, i * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('on'); });
  }

  /* ---------- tabs de sectores ---------- */
  var btns = document.querySelectorAll('.tabs__b');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-tab');
      btns.forEach(function (o) {
        var on = o === b;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('.pan').forEach(function (p) {
        var on = p.id === 'pan-' + id;
        p.classList.toggle('is-on', on);
        if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
    });
  });

  /* ---------- comparador antes / después ---------- */
  var rev = document.getElementById('rev');
  if (rev) {
    var before = document.getElementById('revBefore');
    var bar = document.getElementById('revBar');
    var knob = document.getElementById('revKnob');
    var dragging = false;
    var cur = 50;

    var setPos = function (pct) {
      pct = Math.max(3, Math.min(97, pct));
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      bar.style.left = pct + '%';
      cur = pct;
    };
    var fromEvent = function (e) {
      var r = rev.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      setPos((x / r.width) * 100);
    };
    var start = function (e) { dragging = true; fromEvent(e); };
    var move = function (e) {
      if (!dragging) return;
      if (e.cancelable && e.touches) e.preventDefault();
      fromEvent(e);
    };
    var end = function () { dragging = false; };

    rev.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    rev.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);

    knob.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { setPos(cur - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(cur + 4); e.preventDefault(); }
    });

    /* pequeño teaser la primera vez que entra en pantalla */
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var shown = false;
      var io2 = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting || shown) return;
        shown = true;
        var t0 = null;
        var tick = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          setPos(50 + Math.sin(e * Math.PI) * 22);
          if (p < 1) requestAnimationFrame(tick);
        };
        setTimeout(function () { requestAnimationFrame(tick); }, 350);
      }, { threshold: 0.4 });
      io2.observe(rev);
    }
  }
})();
