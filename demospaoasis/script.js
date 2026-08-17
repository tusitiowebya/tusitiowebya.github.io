/* =========================================================
   Spa Oasis — TuPaginaYa
   ========================================================= */
(function () {
  'use strict';

  var WA = '5491122549288';

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');

  function onScroll() {
    nav.classList.toggle('is-stuck', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = drawer.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      drawer.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      var el = e.target;
      setTimeout(function () { el.classList.add('is-in'); }, i * 90);
      io.unobserve(el);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- armador de ritual ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var timeline = document.getElementById('timeline');
  var totalEl = document.getElementById('total');
  var waBtn = document.getElementById('ritualWa');
  var elegidos = [];

  function fmt(min) {
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60), m = min % 60;
    return m ? h + ' h ' + m + ' min' : h + ' h';
  }

  function render() {
    if (!elegidos.length) {
      timeline.innerHTML = '<p class="timeline__empty">Todavía no elegiste nada. ' +
        'Tocá los servicios y se van sumando acá.</p>';
      totalEl.textContent = '0 min';
      waBtn.href = 'https://wa.me/' + WA + '?text=' +
        encodeURIComponent('Hola Spa Oasis! Quiero reservar un turno.');
      return;
    }

    var total = elegidos.reduce(function (s, it) { return s + it.min; }, 0);
    var max = Math.max.apply(null, elegidos.map(function (it) { return it.min; }));

    timeline.innerHTML = elegidos.map(function (it) {
      var pct = Math.round((it.min / max) * 100);
      var verde = (it.cat === 'depilacion' || it.cat === 'pedicuria') ? ' tl--verde' : '';
      return '<div class="tl' + verde + '">' +
        '<div class="tl__top"><b>' + it.name + '</b>' +
        '<span>' + it.min + '′ <button class="tl__x" data-off="' + it.id + '" ' +
        'aria-label="Sacar ' + it.name + '">✕</button></span></div>' +
        '<div class="tl__bar"><div class="tl__fill" style="width:' + pct + '%"></div></div>' +
        '</div>';
    }).join('');

    totalEl.textContent = fmt(total);

    var msg = 'Hola Spa Oasis! Quiero armar este ritual:\n' +
      elegidos.map(function (it) { return '• ' + it.name + ' (' + it.min + ' min)'; }).join('\n') +
      '\n\nDuración estimada: ' + fmt(total) + '.\n¿Qué días y horarios tenés disponibles?';
    waBtn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  chips.forEach(function (chip, i) {
    chip.dataset.id = 'c' + i;
    chip.addEventListener('click', function () {
      var id = chip.dataset.id;
      var yaEsta = elegidos.some(function (it) { return it.id === id; });
      if (yaEsta) {
        elegidos = elegidos.filter(function (it) { return it.id !== id; });
        chip.classList.remove('is-on');
      } else {
        elegidos.push({
          id: id,
          name: chip.dataset.name,
          min: parseInt(chip.dataset.min, 10),
          cat: chip.closest('.chips').dataset.cat
        });
        chip.classList.add('is-on');
      }
      render();
    });
  });

  timeline.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-off]');
    if (!btn) return;
    var id = btn.dataset.off;
    elegidos = elegidos.filter(function (it) { return it.id !== id; });
    var chip = chips.filter(function (c) { return c.dataset.id === id; })[0];
    if (chip) chip.classList.remove('is-on');
    render();
  });

  render();

  /* ---------- año ---------- */
  document.getElementById('anio').textContent = new Date().getFullYear();
})();
