/* Electro Gipa — tablero, consulta y detalles */
(function () {
  'use strict';

  var WA = '5493512436971';
  var KEY = 'egipa-consulta-v1';
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (params.has('qa')) root.classList.add('qa');

  var SERVICES = {
    lavarropas: {
      name: 'Lavarropas',
      opts: ['No enciende', 'No centrifuga', 'No desagota', 'No carga agua', 'Pierde agua', 'Hace ruido o vibra', 'Corta la luz al usarlo']
    },
    ventilador: {
      name: 'Ventilador',
      opts: ['Es de pie', 'Es de techo', 'No arranca', 'Gira lento', 'Hace ruido o vibra', 'Falla una velocidad', 'Huele a quemado']
    },
    microondas: {
      name: 'Microondas',
      opts: ['No enciende', 'No calienta', 'Hace chispas', 'El plato no gira', 'No responde el panel', 'Corta la luz al usarlo']
    },
    instalacion: {
      name: 'Instalación eléctrica',
      opts: ['Salta la térmica', 'Salta el disyuntor', 'Enchufes sin corriente', 'Olor a quemado', 'Sumar circuitos o tomas', 'Revisión general', 'Necesito firma de matriculado']
    },
    cargador: {
      name: 'Cargador para auto eléctrico',
      opts: ['Quiero instalar uno', 'Ya tengo el cargador', 'Saber si mi instalación lo soporta', 'Va en cochera o garage', 'Va en exterior']
    }
  };
  var ORDER = ['lavarropas', 'ventilador', 'microondas', 'instalacion', 'cargador'];

  function waUrl(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function openWa(url) {
    var w = window.open(url, '_blank');
    if (!w) location.href = url;
  }

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var waFloat = document.getElementById('waFloat');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 30);
    waFloat.classList.toggle('is-on', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    var open = !links.classList.contains('is-open');
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) nav.classList.add('is-solid');
  });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Hero: las térmicas encienden el tablero ---------- */
  var hero = document.querySelector('.hero');
  var brks = Array.prototype.slice.call(document.querySelectorAll('.brk'));
  var boardState = document.getElementById('boardState');
  var volts = document.getElementById('volts');
  var heroVideo = document.getElementById('heroVideo');

  volts.textContent = '0';
  function lightUp() {
    hero.classList.add('is-lit');
    boardState.textContent = 'CON LUZ';
    volts.textContent = '230';
    if (heroVideo && heroVideo.paused) { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
    if (!reduce) {
      setInterval(function () {
        volts.textContent = String(228 + Math.floor(Math.random() * 5));
      }, 1400);
    }
  }
  if (reduce || root.classList.contains('qa')) {
    brks.forEach(function (b) { b.classList.add('on'); });
    lightUp();
  } else {
    var started = false;
    var startSeq = function () {
      if (started) return;
      started = true;
      runSeq();
    };
    // En celular el tablero queda debajo del texto: arranca al verlo (o a los 2,6 s)
    var board = document.getElementById('board');
    if ('IntersectionObserver' in window) {
      var bio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { bio.disconnect(); setTimeout(startSeq, 250); }
      }, { threshold: 0.45 });
      bio.observe(board);
      setTimeout(startSeq, 2600);
    } else startSeq();
  }
  function runSeq() {
    brks.forEach(function (b, i) {
      setTimeout(function () {
        b.classList.add('on');
        volts.textContent = String(Math.round((i + 1) / brks.length * 230));
        if (i === brks.length - 1) setTimeout(lightUp, 260);
      }, 400 + i * 280);
    });
  }

  /* ---------- Consulta: estado ---------- */
  var state = { faults: {}, modelo: '', zona: '', cuando: '' };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      if (saved.faults && typeof saved.faults === 'object') {
        ORDER.forEach(function (k) {
          if (Array.isArray(saved.faults[k])) {
            state.faults[k] = saved.faults[k].filter(function (o) { return SERVICES[k].opts.indexOf(o) !== -1; });
          }
        });
      }
      state.modelo = typeof saved.modelo === 'string' ? saved.modelo.slice(0, 80) : '';
      state.zona = typeof saved.zona === 'string' ? saved.zona.slice(0, 60) : '';
      state.cuando = typeof saved.cuando === 'string' ? saved.cuando : '';
    }
  } catch (e) { /* sin persistencia */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var pks = Array.prototype.slice.call(document.querySelectorAll('.pk'));
  var faultsEl = document.getElementById('faults');
  var emptyEl = document.getElementById('faultsEmpty');
  var lcd = document.getElementById('meterLcd');
  var unit = document.getElementById('meterUnit');
  var err = document.getElementById('panelErr');
  var fModelo = document.getElementById('fModelo');
  var fZona = document.getElementById('fZona');
  var fCuando = document.getElementById('fCuando');

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render() {
    var keys = ORDER.filter(function (k) { return state.faults[k]; });
    pks.forEach(function (b) { b.setAttribute('aria-pressed', String(!!state.faults[b.dataset.svc])); });

    Array.prototype.slice.call(faultsEl.querySelectorAll('.fault')).forEach(function (n) {
      if (!state.faults[n.dataset.svc]) n.remove();
    });
    keys.forEach(function (k) {
      var card = faultsEl.querySelector('.fault[data-svc="' + k + '"]');
      if (!card) {
        card = el('div', 'fault');
        card.dataset.svc = k;
        var h = el('h3', null, SERVICES[k].name);
        h.appendChild(el('small', null, 'FALLA'));
        card.appendChild(h);
        var chips = el('div', 'chips');
        chips.setAttribute('role', 'group');
        chips.setAttribute('aria-label', '¿Qué le pasa al ' + SERVICES[k].name.toLowerCase() + '?');
        SERVICES[k].opts.forEach(function (o) {
          var c = el('button', 'chip', o);
          c.type = 'button';
          c.dataset.v = o;
          chips.appendChild(c);
        });
        card.appendChild(chips);
        var nextKey = null;
        for (var i = ORDER.indexOf(k) + 1; i < ORDER.length; i++) {
          if (faultsEl.querySelector('.fault[data-svc="' + ORDER[i] + '"]')) { nextKey = ORDER[i]; break; }
        }
        faultsEl.insertBefore(card, nextKey ? faultsEl.querySelector('.fault[data-svc="' + nextKey + '"]') : null);
      }
      Array.prototype.slice.call(card.querySelectorAll('.chip')).forEach(function (c) {
        c.setAttribute('aria-pressed', String(state.faults[k].indexOf(c.dataset.v) !== -1));
      });
    });

    emptyEl.hidden = keys.length > 0;
    lcd.textContent = keys.length ? String(keys.length) : '0.0';
    unit.textContent = keys.length === 0 ? 'TODO OK' : keys.length === 1 ? 'FALLA' : 'FALLAS';
    if (keys.length) err.hidden = true;

    Array.prototype.slice.call(fCuando.querySelectorAll('.chip')).forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.dataset.v === state.cuando));
    });
  }

  function toggleFault(k, force) {
    if (!SERVICES[k]) return;
    var on = typeof force === 'boolean' ? force : !state.faults[k];
    if (on && !state.faults[k]) state.faults[k] = [];
    if (!on) delete state.faults[k];
    save();
    render();
  }

  pks.forEach(function (b) {
    b.addEventListener('click', function () { toggleFault(b.dataset.svc); });
  });

  faultsEl.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (!c) return;
    var k = c.closest('.fault').dataset.svc;
    var list = state.faults[k];
    var i = list.indexOf(c.dataset.v);
    if (i === -1) list.push(c.dataset.v); else list.splice(i, 1);
    save();
    render();
  });

  fCuando.addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (!c) return;
    state.cuando = state.cuando === c.dataset.v ? '' : c.dataset.v;
    save();
    render();
  });

  fModelo.value = state.modelo;
  fZona.value = state.zona;
  fModelo.addEventListener('input', function () { state.modelo = fModelo.value; save(); });
  fZona.addEventListener('input', function () { state.zona = fZona.value; save(); });

  function buildMessage() {
    var keys = ORDER.filter(function (k) { return state.faults[k]; });
    var lines = ['Hola Pablo, te escribo desde la web de Electro Gipa.', ''];
    lines.push(keys.length === 1 ? 'Necesito un service para:' : 'Necesito un service para estos equipos:');
    keys.forEach(function (k) {
      var d = state.faults[k];
      lines.push('• ' + SERVICES[k].name + (d.length ? ': ' + d.join(', ').toLowerCase() : ''));
    });
    var modelo = state.modelo.trim();
    var zona = state.zona.trim();
    if (modelo || zona || state.cuando) lines.push('');
    if (modelo) lines.push('Marca y modelo: ' + modelo);
    if (zona) lines.push('Zona: ' + zona);
    if (state.cuando) lines.push('Me queda cómodo: ' + state.cuando.toLowerCase());
    lines.push('', 'Si hace falta te mando foto o video por acá.');
    return lines.join('\n');
  }

  document.getElementById('sendWa').addEventListener('click', function () {
    var keys = ORDER.filter(function (k) { return state.faults[k]; });
    if (!keys.length) {
      err.hidden = false;
      document.querySelector('.panel__rail').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    openWa(waUrl(buildMessage()));
  });

  document.getElementById('resetPanel').addEventListener('click', function () {
    state.faults = {};
    state.cuando = '';
    save();
    render();
  });

  // Atajos: térmicas del hero y botones de las placas preseleccionan el equipo
  function goTo(k) {
    toggleFault(k, true);
    var target = document.getElementById('que-se-corto');
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    var card = faultsEl.querySelector('.fault[data-svc="' + k + '"]');
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = '';
    }
  }
  brks.forEach(function (b) {
    b.addEventListener('click', function () {
      b.classList.remove('on');
      setTimeout(function () { b.classList.add('on'); }, 380);
      setTimeout(function () { goTo(b.dataset.svc); }, 220);
    });
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-goto]')).forEach(function (b) {
    b.addEventListener('click', function () { goTo(b.dataset.goto); });
  });

  render();

  /* ---------- Cargador EV: checklist ---------- */
  var evWa = document.getElementById('evWa');
  var evChecks = Array.prototype.slice.call(document.querySelectorAll('#evChecks input'));
  function evUpdate() {
    var sel = evChecks.filter(function (c) { return c.checked; }).map(function (c) { return '• ' + c.value; });
    var msg = 'Hola Pablo, te escribo desde la web de Electro Gipa. Quiero consultar por la instalación de un cargador para auto eléctrico.';
    if (sel.length) msg += '\n\nTengo estos datos:\n' + sel.join('\n');
    evWa.href = waUrl(msg);
  }
  evChecks.forEach(function (c) { c.addEventListener('change', evUpdate); });
  evUpdate();

  /* ---------- Reveal + videos diferidos ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal, .ev__media'));
  if ('IntersectionObserver' in window && !root.classList.contains('qa')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        var sib = t.parentElement ? Array.prototype.indexOf.call(t.parentElement.children, t) : 0;
        t.style.transitionDelay = Math.min(sib, 4) * 80 + 'ms';
        t.classList.add('is-in');
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  }

  var lazy = Array.prototype.slice.call(document.querySelectorAll('video.lazyvid'));
  function loadVid(v) {
    if (!v.dataset.src) return;
    v.src = v.dataset.src;
    delete v.dataset.src;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.dataset.src) loadVid(v);
          else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: '200px 0px' });
    lazy.forEach(function (v) { vio.observe(v); });
  } else {
    lazy.forEach(loadVid);
  }

  /* ---------- fitText: el H1 nunca se corta (letra grande en Android) ---------- */
  var fitEls = Array.prototype.slice.call(document.querySelectorAll('.hero__title .ln'));
  function fitText() {
    fitEls.forEach(function (n) {
      n.style.fontSize = '';
      var size = parseFloat(getComputedStyle(n).fontSize);
      var guard = 0;
      while (n.scrollWidth > n.clientWidth + 1 && size > 18 && guard < 60) {
        size -= 1;
        n.style.fontSize = size + 'px';
        guard++;
      }
    });
  }
  window.__egFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitText, 120); });
})();
