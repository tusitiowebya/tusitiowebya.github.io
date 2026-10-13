/* J3D Impresiones 3D — demo TuPaginaYa */
(function () {
  'use strict';

  var WA = '5491124591195';
  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (params.has('qa')) document.documentElement.classList.add('qa');

  function wa(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- nav ---------- */
  var nav = $('#nav');
  var burger = $('#burger');
  var menu = $('#menu');
  var waFloat = $('#waFloat');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 30);
    waFloat.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });

  /* ---------- hero: impresión capa por capa ---------- */
  var build = $('#build');
  var bar = $('#bar');
  var layer = $('#layer');
  var TOTAL = 240;
  function setPrinted(p) {
    build.style.setProperty('--printed', (p * 100).toFixed(2) + '%');
  }
  function runPrint() {
    if (reduced || params.has('qa')) {
      setPrinted(1); build.classList.add('is-done');
      bar.style.width = '100%'; layer.textContent = String(TOTAL);
      return;
    }
    var start = null;
    var dur = 2600;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - k, 2.2);
      setPrinted(e);
      if (k >= 1) { build.classList.add('is-done'); }
      else requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // seguro: si el navegador no anima (pestaña en segundo plano), el video nunca queda tapado
    setTimeout(function () { setPrinted(1); build.classList.add('is-done'); }, dur + 1200);
    // la pantalla de la cama sigue contando mientras corre el video
    var vid = $('#heroVideo');
    function tick() {
      var d = vid.duration || 13.6;
      var k = (vid.currentTime % d) / d;
      bar.style.width = (k * 100).toFixed(1) + '%';
      layer.textContent = String(Math.max(1, Math.round(k * TOTAL))).padStart(3, '0');
    }
    setInterval(tick, 250);
  }
  setPrinted(0);
  runPrint();

  /* ---------- reveals ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add(en.target.classList.contains('piece') ? 'printed' : 'is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  $$('.reveal, .piece').forEach(function (el, i) {
    if (el.classList.contains('reveal')) el.style.transitionDelay = ((i % 4) * 70) + 'ms';
    if (io && !params.has('qa')) io.observe(el);
    else el.classList.add(el.classList.contains('piece') ? 'printed' : 'is-in');
  });

  /* ---------- reels con carga diferida ---------- */
  var reels = $$('.reel video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.25 });
    reels.forEach(function (v) { vio.observe(v); });
  } else reels.forEach(function (v) { v.src = v.dataset.src; });

  /* ---------- filtros de trabajos ---------- */
  var chips = $$('.chip');
  var pieces = $$('.piece');
  var empty = $('#gridEmpty');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.f;
      chips.forEach(function (x) {
        var on = x === c;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-selected', String(on));
      });
      var shown = 0;
      pieces.forEach(function (p) {
        var ok = f === 'todo' || p.dataset.cat === f;
        p.classList.toggle('is-hidden', !ok);
        if (ok) { shown++; p.classList.remove('printed'); void p.offsetWidth; p.classList.add('printed'); }
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---------- visor ---------- */
  var viewer = $('#viewer');
  var vImg = $('#vImg'), vName = $('#vName'), vNote = $('#vNote'), vAsk = $('#vAsk');
  var current = 0;
  function visible() { return pieces.filter(function (p) { return !p.classList.contains('is-hidden'); }); }
  function show(i) {
    var list = visible();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var p = list[current];
    vImg.src = p.dataset.img;
    vImg.alt = p.querySelector('img').alt;
    vName.textContent = p.dataset.name;
    vNote.textContent = p.dataset.note || '';
    vAsk.href = wa('Hola J3D, vi en la web "' + p.dataset.name + '" y quiero uno así. ¿Me pasás info?');
  }
  pieces.forEach(function (p) {
    p.addEventListener('click', function () {
      show(visible().indexOf(p));
      if (viewer.showModal) viewer.showModal(); else viewer.setAttribute('open', '');
    });
  });
  function closeViewer() { if (viewer.close) viewer.close(); else viewer.removeAttribute('open'); }
  $('#viewerX').addEventListener('click', closeViewer);
  $('#vPrev').addEventListener('click', function () { show(current - 1); });
  $('#vNext').addEventListener('click', function () { show(current + 1); });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) closeViewer(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  var tx = null;
  viewer.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- armá tu pedido ---------- */
  var form = $('#orderForm');
  var spoolInputs = $$('#spools input');
  var perso = $('#perso'), ref = $('#ref'), qty = $('#qty'), fecha = $('#fecha');
  var stack = $('#stack');
  var LAYERS = 12;
  for (var i = 0; i < LAYERS; i++) stack.appendChild(document.createElement('i'));
  var stackBars = $$('i', stack);

  // fecha mínima = hoy
  var today = new Date();
  var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  fecha.min = iso;

  function fmtDate(v) {
    if (!v) return '';
    var p = v.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function update() {
    var pieza = (form.querySelector('input[name="pieza"]:checked') || {}).value || '';
    var colors = spoolInputs.filter(function (x) { return x.checked; });
    var names = colors.map(function (x) { return x.value; });
    spoolInputs.forEach(function (x) { x.disabled = !x.checked && colors.length >= 3; });
    var n = Math.max(1, Math.min(500, parseInt(qty.value, 10) || 1));
    var txt = perso.value.trim();

    $('#tPieza').textContent = pieza || '—';
    $('#tColorTxt').textContent = names.length ? names.join(', ') : '—';
    var sw = $('#tSw'); sw.innerHTML = '';
    colors.forEach(function (x) {
      var dot = document.createElement('i');
      dot.style.setProperty('--c', x.nextElementSibling.style.getPropertyValue('--c'));
      sw.appendChild(dot);
    });
    $('#tPerso').textContent = txt ? txt + (ref.checked ? ' · con foto de referencia' : '') : (ref.checked ? 'Con foto de referencia' : '—');
    $('#tQty').textContent = String(n);
    $('#tFecha').textContent = fecha.value ? fmtDate(fecha.value) : '—';

    var done = [!!pieza, names.length > 0, !!txt || ref.checked, true, !!fecha.value];
    var score = done.filter(Boolean).length / done.length;
    var pct = Math.round(score * 100);
    $('#tPct').textContent = String(pct);
    var lit = Math.round(score * LAYERS);
    stackBars.forEach(function (b, k) { b.classList.toggle('on', k < lit); });
    var ready = !!pieza;
    $('.screen').classList.toggle('is-ready', pct === 100);
    $('#tStatus').textContent = pct === 100 ? 'LISTA PARA IMPRIMIR' : (ready ? 'ARMANDO ORDEN' : 'ESPERANDO DATOS');

    var lines = ['Hola J3D, quiero hacer un pedido de impresión 3D:'];
    lines.push('• Pieza: ' + (pieza || 'a definir'));
    if (names.length) lines.push('• Colores: ' + names.join(', '));
    if (txt) lines.push('• Personalización: ' + txt);
    if (ref.checked) lines.push('• Tengo una foto o modelo de referencia, te la mando por acá');
    lines.push('• Cantidad: ' + n);
    if (fecha.value) lines.push('• Lo necesito para el ' + fmtDate(fecha.value));
    lines.push('¿Me pasás precio y plazo?');
    $('#sendOrder').href = wa(lines.join('\n'));
    $('#miniGo').href = $('#sendOrder').href;
    $('#miniPct').textContent = String(pct);
    $('#miniBar').style.width = pct + '%';
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  $('#minus').addEventListener('click', function () { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); update(); });
  $('#plus').addEventListener('click', function () { qty.value = Math.min(500, (parseInt(qty.value, 10) || 1) + 1); update(); });
  update();

  // barrita de la orden en celular: visible mientras el formulario está en pantalla y el ticket no
  var mini = $('#orderMini');
  var ticket = $('.ticket');
  function syncMini() {
    var vh = window.innerHeight;
    var fr = form.getBoundingClientRect();
    var tr = ticket.getBoundingClientRect();
    var formIn = fr.top < vh * 0.8 && fr.bottom > 0;
    var ticketIn = tr.top < vh - 60 && tr.bottom > 0;
    var on = formIn && !ticketIn;
    if (on === mini.classList.contains('is-on')) return;
    mini.classList.toggle('is-on', on);
    mini.setAttribute('aria-hidden', String(!on));
    $('#miniGo').tabIndex = on ? 0 : -1;
  }
  window.addEventListener('scroll', syncMini, { passive: true });
  window.addEventListener('resize', syncMini);
  syncMini();

  /* ---------- títulos que no se cortan con letra grande (Android) ---------- */
  function fitText() {
    $$('.fit').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      var guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard++ < 40) {
        size -= 1; el.style.fontSize = size + 'px';
      }
    });
  }
  window.__j3dFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
})();
