/* Blindajes Eduardo — despiece, anclajes y orden de taller */
(function () {
  'use strict';

  var WA = '5491161490684';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var QA = /[?&]qa\b/.test(location.search);
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- nav ---------- */
  var nav = $('#nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
      menu.classList.remove('is-open');
    });
  });

  /* ---------- fitText: una palabra nunca se corta (letra grande en Android) ---------- */
  function fitText() {
    $$('[data-fit]').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 20 && guard < 80) {
        size -= 2; guard++;
        el.style.fontSize = size + 'px';
      }
    });
  }
  window.__beFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  var rT;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(fitText, 120); });

  /* ---------- anclajes del hero ---------- */
  var bolts = $('#bolts'), count = $('#boltCount');
  if (bolts) {
    var spans = $$('span', bolts);
    var order = [0, 7, 14, 3, 11, 5, 9, 1, 13, 6, 2, 10, 4, 12, 8];
    order.forEach(function (idx, n) { spans[idx].style.transitionDelay = (reduce ? 0 : n * 70) + 'ms'; });
    var lock = function () {
      bolts.classList.add('is-locked');
      if (!count || reduce) return;
      var v = 7;
      count.textContent = '07';
      var t = setInterval(function () {
        v++;
        count.textContent = (v < 10 ? '0' : '') + v;
        if (v >= 15) clearInterval(t);
      }, 95);
    };
    setTimeout(lock, reduce ? 0 : 450);
  }

  /* video del visor: si el navegador bloquea autoplay queda el póster */
  var hv = $('#heroVideo');
  if (hv) {
    var p = hv.play && hv.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------- despiece ---------- */
  var SETS = {
    a: ['a01', 'a02', 'a03', 'a04', 'a05'],
    b: ['b01', 'b02', 'b03', 'b04', 'b05'],
    c: ['c01', 'c02', 'c03', 'c04', 'c05']
  };
  var stack = $('#stack');
  var layers = stack ? [$('.l0', stack), $('.l1', stack), $('.l2', stack), $('.l3', stack)] : [];
  var lockImg = stack ? $('.lock', stack) : null;
  var steps = $$('.step');
  var curStep = 0;

  function applyStep(n) {
    curStep = n;
    var wide = window.innerWidth >= 900;
    var dx = wide ? 30 : 20;
    layers.forEach(function (img, i) {
      if (i < n) {
        var d = Math.min(n - i, 3);
        img.style.transform = 'translateX(' + (-d * dx) + '%) scale(' + (1 - d * .07) + ')';
        img.style.opacity = d === 1 ? '.5' : '.2';
      } else {
        img.style.transform = '';
        img.style.opacity = '1';
      }
    });
    if (lockImg) {
      if (n >= 4) {
        lockImg.style.opacity = '1';
        lockImg.style.transform = wide ? 'translateX(46%) scale(.66)' : 'translateX(40%) scale(.6)';
      } else {
        lockImg.style.opacity = '0';
        lockImg.style.transform = '';
      }
    }
    steps.forEach(function (s) { s.classList.toggle('is-on', +s.dataset.step === n); });
    var num = $('#expNum'), bar = $('#expBar');
    if (num) num.textContent = '0' + (n + 1);
    if (bar) bar.style.width = ((n + 1) * 20) + '%';
  }

  if (stack && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) applyStep(+e.target.dataset.step); });
    }, { rootMargin: '-48% 0px -48% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }
  window.addEventListener('resize', function () { applyStep(curStep); });

  $$('.model-tabs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.model-tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
      var set = SETS[btn.dataset.set];
      layers.concat(lockImg).forEach(function (img, i) { img.src = 'media/capas/' + set[i] + '.webp'; });
    });
  });

  /* animación completa en un diálogo */
  var dlg = $('#animDialog'), av = $('#animVideo');
  $('#playAnim').addEventListener('click', function () {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var pp = av.play(); if (pp && pp.catch) pp.catch(function () {});
  });
  var closeDlg = function () { av.pause(); if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); };
  $('#animClose').addEventListener('click', closeDlg);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener('close', function () { av.pause(); });

  /* ---------- orden de taller ---------- */
  var KEY = 'be-orden-v1';
  var DEF = {
    tipo: 'Puerta búnker nueva', modelo: 'Que me asesoren', terminacion: 'Madera lustrada a mano',
    chapa: 'Que me asesoren', ancho: '90', alto: '200', nose: false, marco: 'No sé',
    arreglo: 'Reparación de la puerta', marca: '', zona: 'CABA', barrio: '', nombre: ''
  };
  var st = Object.assign({}, DEF, store.get(KEY) || {});
  var form = $('#orderForm');
  var fAncho = $('#fAncho'), fAlto = $('#fAlto'), fNoSe = $('#fNoSe');
  var fMarca = $('#fMarca'), fBarrio = $('#fBarrio'), fNombre = $('#fNombre');
  var list = $('#ticketList'), send = $('#orderSend');
  var prevRows = {};

  var d = new Date();
  $('#tNum').textContent = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);

  function isFix() { return st.tipo === 'Servicio técnico'; }

  function syncUI() {
    $$('.chips', form).forEach(function (g) {
      var name = g.dataset.name;
      $$('.chip', g).forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.v === st[name])); });
    });
    fAncho.value = st.ancho; fAlto.value = st.alto; fNoSe.checked = !!st.nose;
    fAncho.disabled = fAlto.disabled = !!st.nose;
    fMarca.value = st.marca; fBarrio.value = st.barrio; fNombre.value = st.nombre;
    var fix = isFix();
    $$('.only-new', form).forEach(function (f) {
      f.hidden = fix || (st.tipo !== 'Puerta búnker nueva' && !!f.querySelector('[data-name="modelo"]'));
    });
    $$('.only-fix', form).forEach(function (f) { f.hidden = !fix; });
    relabel();
  }

  /* las letras de las secciones visibles siguen en orden */
  function relabel() {
    var n = 0, L = 'ABCDEFG';
    $$('fieldset', form).forEach(function (f) {
      if (f.hidden) return;
      var m = $('legend .mono', f);
      if (m) m.textContent = L[n];
      n++;
    });
  }

  function rows() {
    var r = [['Necesito', st.tipo]];
    if (isFix()) {
      r.push(['Qué', st.arreglo]);
      if (st.marca.trim()) r.push(['Marca', st.marca.trim()]);
    } else {
      if (st.tipo === 'Puerta búnker nueva') r.push(['Modelo', st.modelo]);
      r.push(['Terminación', st.terminacion]);
      r.push(['Chapa', st.chapa]);
      r.push(['Vano', st.nose ? 'Lo miden en la visita' : st.ancho + ' × ' + st.alto + ' cm (aprox.)']);
      r.push(['Marco de metal', st.marco]);
    }
    r.push(['Zona', st.zona + (st.barrio.trim() ? ' · ' + st.barrio.trim() : '')]);
    if (st.nombre.trim()) r.push(['Nombre', st.nombre.trim()]);
    return r;
  }

  function renderTicket() {
    var r = rows(), html = '', next = {};
    r.forEach(function (row) {
      var changed = prevRows[row[0]] !== undefined && prevRows[row[0]] !== row[1];
      next[row[0]] = row[1];
      html += '<dt>' + esc(row[0]) + '</dt><dd' + (changed ? ' class="flash"' : '') + '>' + esc(row[1]) + '</dd>';
    });
    prevRows = next;
    list.innerHTML = html;

    var msg = 'Hola Blindajes Eduardo, les paso mi orden desde la web:\n';
    r.forEach(function (row) { if (row[0] !== 'Nombre') msg += '• ' + row[0] + ': ' + row[1] + '\n'; });
    msg += '\n' + (st.nombre.trim() ? 'Me llamo ' + st.nombre.trim() + '. ' : '');
    msg += isFix() ? '¿Me pasan presupuesto del servicio?' : '¿Me pasan el presupuesto y coordinamos la visita sin costo?';
    send.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);

    drawDoor();
    store.set(KEY, st);
  }

  function drawDoor() {
    var box = $('.ticket-door');
    box.classList.toggle('is-paint', st.terminacion === 'Pintada al tono');
    var w = clamp(parseInt(st.ancho, 10) || 90, 50, 300);
    var h = clamp(parseInt(st.alto, 10) || 200, 150, 320);
    var H = 160, W = clamp(H * w / h, 34, 130), x = 76 - W / 2, y = 20;
    set('#dFrame', { x: x, y: y, width: W, height: H });
    set('#dLeaf', { x: x + 4, y: y + 4, width: W - 8, height: H - 4 });
    var pw = Math.max(W - 22, 8);
    set('#dP1', { x: x + 11, y: y + 14, width: pw, height: H * .36 });
    set('#dP2', { x: x + 11, y: y + 14 + H * .36 + 12, width: pw, height: H * .41 });
    set('#dH', { x: x + W - 15, y: y + H * .49 });
    set('#dimW', { x1: x, x2: x + W });
    set('#dimH', { x1: x + W + 14, x2: x + W + 14 });
    set('#dimHt', { x: x + W + 20 });
    $('#dimWt').textContent = st.nose ? '¿? cm' : w + ' cm';
    $('#dimHt').textContent = st.nose ? '¿?' : String(h);
  }

  function set(sel, attrs) { var el = $(sel); Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $$('.chips', form).forEach(function (g) {
    g.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      st[g.dataset.name] = c.dataset.v;
      syncUI(); renderTicket();
    });
  });
  [[fAncho, 'ancho'], [fAlto, 'alto']].forEach(function (p) {
    p[0].addEventListener('input', function () {
      p[0].value = p[0].value.replace(/\D/g, '').slice(0, 3);
      st[p[1]] = p[0].value || DEF[p[1]];
      renderTicket();
    });
  });
  fNoSe.addEventListener('change', function () { st.nose = fNoSe.checked; syncUI(); renderTicket(); });
  [[fMarca, 'marca'], [fBarrio, 'barrio'], [fNombre, 'nombre']].forEach(function (p) {
    p[0].addEventListener('input', function () { st[p[1]] = p[0].value; renderTicket(); });
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  $('#orderReset').addEventListener('click', function () {
    st = Object.assign({}, DEF); store.del(KEY); prevRows = {};
    syncUI(); renderTicket();
  });

  /* elegir un modelo desde las tarjetas */
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.pick;
      if (v === 'Ignífuga / cortafuego' || v === 'Antibalas') { st.tipo = v; }
      else { st.tipo = 'Puerta búnker nueva'; st.modelo = v; }
      $$('.model').forEach(function (m) { m.classList.remove('is-picked'); });
      b.closest('.model').classList.add('is-picked');
      syncUI(); renderTicket();
      $('#orden').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  syncUI(); renderTicket();

  /* ---------- fábrica ---------- */
  var rack = $('#rack');
  var by = function (dir) { rack.scrollBy({ left: dir * rack.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' }); };
  $('#rackPrev').addEventListener('click', function () { by(-1); });
  $('#rackNext').addEventListener('click', function () { by(1); });

  /* contadores */
  var nums = $$('.num').filter(function (n) { return +n.dataset.to <= 100; });
  if ('IntersectionObserver' in window && !reduce && !QA) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var to = +e.target.dataset.to, t0 = performance.now();
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 900);
          e.target.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  /* ---------- reveal escalonado ---------- */
  var rv = $$('.sec-head, .model, .order-form fieldset, .ticket, .stats p, .service-in > *, .contact-info, .map, .faq details, .close-in > *');
  if ('IntersectionObserver' in window && !reduce && !QA) {
    rv.forEach(function (el) { el.classList.add('rv'); });
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sib = e.target.parentElement ? $$(':scope > .rv', e.target.parentElement) : [];
        var i = Math.max(0, sib.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
        e.target.classList.add('in');
        rio.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { rio.observe(el); });
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
