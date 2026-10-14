/* Grupo San Francisco Automotores — interacciones */
(function () {
  'use strict';

  var WA = '5493888682650';
  var doc = document.documentElement;
  doc.classList.add('js');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forceQA = /[?&]qa\b/.test(location.search);

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('menu');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Parabrisas: pasada del limpiaparabrisas ---------- */
  var shield = document.getElementById('shield');
  function revealShield() { shield.classList.add('is-wiped'); }
  if (reduced || forceQA) {
    revealShield();
  } else {
    shield.classList.add('is-wiping');
    setTimeout(revealShield, 620);
  }
  // Seguro por si la animación no corre
  setTimeout(revealShield, 2500);

  /* ---------- Ajuste del título a su caja (letra grande en Android) ---------- */
  function fitText() {
    var lines = document.querySelectorAll('.fit');
    lines.forEach(function (el) { el.style.transform = ''; });
    lines.forEach(function (el) {
      var box = el.parentElement.clientWidth;
      var w = el.scrollWidth;
      if (w > box && box > 0) {
        el.style.transform = 'scale(' + (box / w).toFixed(3) + ')';
      }
    });
  }
  window.addEventListener('resize', fitText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  fitText();

  /* ---------- Horario: abierto / cerrado (hora de Argentina) ---------- */
  var SLOTS = [[9 * 60, 13 * 60], [16 * 60, 21 * 60 + 30]];

  function nowAR() {
    // Argentina no usa horario de verano: UTC-3 fijo
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc - 3 * 3600000);
  }
  function hhmm(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }

  function updateStatus() {
    var d = nowAR();
    var mins = d.getHours() * 60 + d.getMinutes();
    var day = d.getDay(); // 0 = domingo: atienden de lunes a sábado
    var state, detail, cls;

    var open = day !== 0 && SLOTS.find(function (s) { return mins >= s[0] && mins < s[1]; });
    if (open) {
      state = 'Abierto ahora';
      detail = 'Hasta las ' + hhmm(open[1]) + ' · Rogelio Leach esq. Miguel Aráoz';
      cls = 'is-open';
    } else {
      var next = day !== 0 && SLOTS.find(function (s) { return mins < s[0]; });
      state = 'Cerrado ahora';
      if (next) detail = 'Abre hoy a las ' + hhmm(next[0]);
      else if (day === 6 || day === 0) detail = 'Abre el lunes a las 09:00';
      else detail = 'Abre mañana a las 09:00';
      detail += ' · escribinos igual por WhatsApp';
      cls = 'is-closed';
    }

    document.querySelectorAll('[data-status-text]').forEach(function (el) { el.textContent = state; });
    document.querySelectorAll('[data-status-detail]').forEach(function (el) { el.textContent = detail; });
    document.querySelectorAll('[data-status-led]').forEach(function (el) {
      el.classList.remove('is-open', 'is-closed');
      if (cls) el.classList.add(cls);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Buscador: arma el mensaje de WhatsApp ---------- */
  var STORE = 'sfa-busqueda';
  var form = document.getElementById('finder');
  var list = document.getElementById('ticketList');
  var send = document.getElementById('ticketSend');
  var reset = document.getElementById('ticketReset');
  var inPres = document.getElementById('presupuesto');
  var inName = document.getElementById('nombre');
  var state = { tipo: [], uso: [], pago: [], visita: [], presupuesto: '', nombre: '' };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved && typeof saved === 'object') {
        ['tipo', 'uso', 'pago', 'visita'].forEach(function (k) {
          if (Array.isArray(saved[k])) state[k] = saved[k].filter(function (v) { return typeof v === 'string'; });
        });
        state.presupuesto = typeof saved.presupuesto === 'string' ? saved.presupuesto : '';
        state.nombre = typeof saved.nombre === 'string' ? saved.nombre : '';
      }
    } catch (e) { /* sin almacenamiento: arranca vacío */ }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* no pasa nada */ }
  }

  function syncChips() {
    form.querySelectorAll('.chips').forEach(function (group) {
      var key = group.getAttribute('data-group');
      group.querySelectorAll('.chip').forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(state[key].indexOf(chip.getAttribute('data-value')) !== -1));
      });
    });
    inPres.value = state.presupuesto;
    inName.value = state.nombre;
  }

  function labelOf(key, value) {
    var chip = form.querySelector('.chips[data-group="' + key + '"] .chip[data-value="' + value.replace(/"/g, '\\"') + '"]');
    return chip ? chip.textContent.trim() : value;
  }

  function lineEl(text, hl) {
    var li = document.createElement('li');
    if (hl) {
      var s = document.createElement('span');
      s.className = 'hl';
      s.textContent = hl + ' ';
      li.appendChild(s);
    }
    li.appendChild(document.createTextNode(text));
    return li;
  }

  function render() {
    list.textContent = '';
    var lines = [];
    if (state.tipo.length) lines.push(lineEl(labelOf('tipo', state.tipo[0]), ''));
    if (state.uso.length) lines.push(lineEl(state.uso.map(function (v) { return labelOf('uso', v); }).join(' · '), 'Para'));
    if (state.pago.length) lines.push(lineEl(labelOf('pago', state.pago[0]), 'Pago:'));
    if (state.presupuesto.trim()) lines.push(lineEl(state.presupuesto.trim(), 'Hasta:'));
    if (state.visita.length) lines.push(lineEl(labelOf('visita', state.visita[0]), 'Paso:'));

    if (!lines.length) {
      var empty = document.createElement('li');
      empty.className = 'is-empty';
      empty.textContent = 'Marcá lo que buscás y se escribe acá';
      list.appendChild(empty);
    } else {
      lines.forEach(function (li) { list.appendChild(li); });
    }
    send.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(buildMessage());
  }

  function buildMessage() {
    var m = ['Hola, Grupo San Francisco Automotores.'];
    if (state.nombre.trim()) m[0] += ' Soy ' + state.nombre.trim() + '.';
    var any = state.tipo.length || state.uso.length || state.pago.length || state.presupuesto.trim() || state.visita.length;
    if (!any) {
      m.push('Estoy buscando mi próximo vehículo. ¿Qué unidades tienen disponibles?');
      return m.join('\n');
    }
    m.push('Armé mi búsqueda en la web:');
    if (state.tipo.length) m.push('• Tipo: ' + state.tipo[0]);
    if (state.uso.length) m.push('• Lo voy a usar para: ' + state.uso.join(', '));
    if (state.pago.length) m.push('• Pago: ' + state.pago[0]);
    if (state.presupuesto.trim()) m.push('• Presupuesto aproximado: ' + state.presupuesto.trim());
    if (state.visita.length) m.push('• Para pasar por el local: ' + state.visita[0]);
    m.push('¿Qué unidades tienen que se ajusten?');
    return m.join('\n');
  }

  form.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var group = chip.closest('.chips');
    var key = group.getAttribute('data-group');
    var value = chip.getAttribute('data-value');
    var single = group.hasAttribute('data-single');
    var i = state[key].indexOf(value);
    if (i !== -1) state[key].splice(i, 1);
    else if (single) state[key] = [value];
    else state[key].push(value);
    syncChips(); render(); save();
  });

  inPres.addEventListener('input', function () { state.presupuesto = inPres.value; render(); save(); });
  inName.addEventListener('input', function () { state.nombre = inName.value; render(); save(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  reset.addEventListener('click', function () {
    state = { tipo: [], uso: [], pago: [], visita: [], presupuesto: '', nombre: '' };
    syncChips(); render(); save();
  });

  load(); syncChips(); render();

  /* ---------- Reveal al hacer scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if (forceQA || reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.transitionDelay = Math.min(sibs, 5) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp flotante: se esconde en el hero y en el cierre ---------- */
  var floatBtn = document.querySelector('.wa-float');
  var hero = document.querySelector('.hero');
  var close = document.querySelector('.close');
  var hidden = { hero: true, close: false };
  function applyFloat() { floatBtn.classList.toggle('is-hidden', hidden.hero || hidden.close); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.target === hero) hidden.hero = x.intersectionRatio > 0.35;
        if (x.target === close) hidden.close = x.isIntersecting;
      });
      applyFloat();
    }, { threshold: [0, 0.35, 0.6] }).observe(hero);
    new IntersectionObserver(function (en) {
      hidden.close = en[0].isIntersecting; applyFloat();
    }).observe(close);
  } else {
    hidden.hero = false; applyFloat();
  }
})();
