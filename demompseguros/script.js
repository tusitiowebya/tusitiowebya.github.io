/* MP Seguros — interacciones */
(function () {
  'use strict';

  var WA = '5491154959207';
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waLink = function (msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); };

  if (/[?&]qa\b/.test(location.search)) document.documentElement.classList.add('qa');

  /* ---------- Nav ---------- */
  var nav = qs('#nav');
  var burger = qs('#burger');
  var waFloat = qs('#waFloat');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    waFloat.classList.toggle('is-on', y > window.innerHeight * 0.6);
    road();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  qsa('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Video: pausa fuera de pantalla ---------- */
  var video = qs('#heroVideo');
  if (video) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { video.removeAttribute('autoplay'); video.pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      }, { threshold: 0.05 }).observe(video);
    }
  }

  /* ---------- Reveal ---------- */
  var reveals = qsa('.reveal');
  if ('IntersectionObserver' in window && !document.documentElement.classList.contains('qa')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Ruta del choque: línea que avanza con el scroll ---------- */
  var roadEl = qs('#road');
  function road() {
    if (!roadEl) return;
    var r = roadEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.75 - r.top) / r.height;
    roadEl.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  if (document.documentElement.classList.contains('qa') && roadEl) roadEl.style.setProperty('--p', 1);

  /* =========================================================
     Cotizador: "Mandanos tu cédula"
     ========================================================= */
  var TYPES = {
    auto: {
      label: 'Auto', icon: 'i-auto', year: true, useLabel: 'Uso',
      useQ: '¿Para qué lo usás?',
      uses: [['particular', 'Particular'], ['apps', 'Uber / DiDi / Cabify'], ['trabajo', 'Trabajo o comercial']],
      cov: ['Responsabilidad civil', 'Robo total', 'Incendio', 'Cristales', 'Granizo', 'Asistencia y grúa']
    },
    moto: {
      label: 'Moto', icon: 'i-moto', year: true, useLabel: 'Uso',
      useQ: '¿Para qué la usás?',
      uses: [['particular', 'Particular'], ['reparto', 'Reparto / delivery'], ['apps', 'Aplicaciones']],
      cov: ['Responsabilidad civil', 'Robo total', 'Incendio', 'Asistencia y grúa']
    },
    camioneta: {
      label: 'Camioneta', icon: 'i-pickup', year: true, useLabel: 'Uso',
      useQ: '¿Para qué la usás?',
      uses: [['particular', 'Particular'], ['trabajo', 'Trabajo o comercial'], ['apps', 'Aplicaciones']],
      cov: ['Responsabilidad civil', 'Robo total', 'Incendio', 'Cristales', 'Granizo', 'Asistencia y grúa']
    },
    camion: {
      label: 'Camión', icon: 'i-truck', year: true, useLabel: 'Uso',
      useQ: '¿Qué tipo de uso le das?',
      uses: [['propia', 'Carga propia'], ['terceros', 'Transporte para terceros']],
      cov: ['Responsabilidad civil', 'Robo total', 'Incendio', 'Cristales', 'Granizo', 'Asistencia y grúa']
    },
    bici: {
      label: 'Bici', icon: 'i-bike', year: false, useLabel: 'Tipo',
      useQ: '¿Qué bici es?',
      uses: [['urbana', 'Urbana'], ['mtb', 'Mountain bike / ruta'], ['electrica', 'Eléctrica']],
      cov: ['Robo', 'Daños', 'Responsabilidad civil']
    },
    hogar: {
      label: 'Hogar', icon: 'i-house', year: false, useLabel: 'Vivienda',
      useQ: '¿Qué tipo de vivienda?',
      uses: [['casa', 'Casa'], ['depto', 'Departamento'], ['ph', 'PH']],
      cov: ['Incendio', 'Robo en la vivienda', 'Daños por agua', 'Cristales', 'Responsabilidad civil']
    }
  };
  var ASESORAME = 'No sé, asesorame';

  var form = qs('#quoteForm');
  var useChips = qs('#useChips');
  var covChecks = qs('#covChecks');
  var yearIn = qs('#year');
  var yearOut = qs('#yearOut');
  var yearWrap = qs('.year');
  var stepYear = qs('#stepYear');
  var ficha = qs('#ficha');
  var send = qs('#quoteSend');
  var nameIn = qs('#qName');
  var zoneIn = qs('#qZone');
  var touched = false;
  var qbar = qs('#qbar');
  var qbarSend = qs('#qbarSend');
  var cardWrap = qs('.card-wrap');

  // Barra fija en mobile: visible mientras se completa el form y la ficha no está a la vista
  if ('IntersectionObserver' in window) {
    var formIn = false, cardIn = false;
    var syncBar = function () {
      var on = formIn && !cardIn;
      qbar.classList.toggle('is-on', on);
      qbar.setAttribute('aria-hidden', on ? 'false' : 'true');
      qbarSend.tabIndex = on ? 0 : -1;
      document.body.classList.toggle('qbar-on', on);
    };
    new IntersectionObserver(function (e) { formIn = e[0].isIntersecting; syncBar(); }, { rootMargin: '0px 0px -30% 0px' }).observe(form);
    new IntersectionObserver(function (e) { cardIn = e[0].isIntersecting; syncBar(); }, { threshold: 0.35 }).observe(cardWrap);
  }

  qs('#fichaNo').textContent = 'N.º ' + String(Math.floor(1000 + Math.random() * 8999));
  qs('#yearNow').textContent = new Date().getFullYear();
  yearIn.max = new Date().getFullYear() + 1;

  function current() {
    var t = qs('input[name="tipo"]:checked', form);
    return t ? t.value : 'auto';
  }

  function buildOptions(type, useValue) {
    var cfg = TYPES[type];
    qs('#useLegend').textContent = cfg.useQ;
    useChips.innerHTML = cfg.uses.map(function (u, i) {
      var checked = useValue ? u[0] === useValue : i === 0;
      return '<label class="chip"><input type="radio" name="uso" value="' + u[0] + '"' + (checked ? ' checked' : '') +
        '><span>' + u[1] + '</span></label>';
    }).join('');
    covChecks.innerHTML = cfg.cov.concat([ASESORAME]).map(function (c) {
      return '<label class="check"><input type="checkbox" name="cov" value="' + c + '"><span>' + c + '</span></label>';
    }).join('');
    stepYear.hidden = !cfg.year;
  }

  function flash(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('is-flash'); void el.offsetWidth; el.classList.add('is-flash');
  }

  function update() {
    var type = current();
    var cfg = TYPES[type];
    var year = +yearIn.value;
    var useIn = qs('input[name="uso"]:checked', form);
    var useTxt = useIn ? useIn.nextElementSibling.textContent : '';
    var covs = qsa('input[name="cov"]:checked', form).map(function (c) { return c.value; });

    yearOut.textContent = year;
    flash(qs('#fTipo'), cfg.label);
    qs('#fYearRow').hidden = !cfg.year;
    flash(qs('#fYear'), String(year));
    qs('#fUseLabel').textContent = cfg.useLabel;
    flash(qs('#fUse'), useTxt);
    flash(qs('#fCov'), covs.length ? covs.join(' · ') : 'A definir con el asesor');

    var robo = qs('#fRobo');
    var roboTxt = qs('#fRoboTxt');
    if (!cfg.year) {
      robo.dataset.state = 'na';
      roboTxt.textContent = type === 'hogar' ? 'Cotizamos tu hogar en las compañías disponibles' : 'Te asesoramos según el tipo y el valor de la bici';
    } else if (year >= 2000) {
      robo.dataset.state = 'ok';
      roboTxt.textContent = 'Robo: lo cotizamos para modelos 2000 en adelante ✓';
    } else {
      robo.dataset.state = 'warn';
      roboTxt.textContent = 'Modelo anterior a 2000: consultá otras coberturas';
    }

    ficha.classList.toggle('is-ready', touched && (covs.length > 0 || nameIn.value.trim().length > 1));

    // Mensaje de WhatsApp
    var lines = ['Hola MP Seguros! Quiero cotizar un seguro:'];
    lines.push('• Qué asegurar: ' + cfg.label);
    if (cfg.year) lines.push('• Año / modelo: ' + year);
    lines.push('• ' + cfg.useLabel + ': ' + useTxt);
    lines.push('• Me interesa: ' + (covs.length ? covs.join(', ') : 'que me asesoren'));
    if (nameIn.value.trim()) lines.push('• Nombre: ' + nameIn.value.trim());
    if (zoneIn.value.trim()) lines.push('• Localidad: ' + zoneIn.value.trim());
    if (type === 'hogar') lines.push('Les paso la dirección aproximada por acá.');
    else if (type === 'bici') lines.push('Les mando una foto de la bici y la factura si la tengo.');
    else lines.push('Les mando foto de la cédula (frente y dorso).');
    send.href = waLink(lines.join('\n'));
    qbarSend.href = send.href;
    qs('#qbarTitle').textContent = cfg.label + (cfg.year ? ' · ' + year : '') + ' · ' + useTxt;
    qs('#qbarSub').textContent = covs.length ? covs.join(', ') : 'Coberturas a definir con el asesor';
  }

  function setType(type, useValue) {
    var radio = qs('input[name="tipo"][value="' + type + '"]', form);
    if (radio) radio.checked = true;
    buildOptions(type, useValue);
    var icon = qs('#fichaIcon');
    icon.innerHTML = '<svg viewBox="0 0 48 48"><use href="#' + TYPES[type].icon + '"/></svg>';
    update();
  }

  form.addEventListener('change', function (e) {
    touched = true;
    if (e.target.name === 'tipo') { setType(e.target.value); return; }
    // "Asesorame" excluye al resto y viceversa
    if (e.target.name === 'cov' && e.target.checked) {
      var isAsk = e.target.value === ASESORAME;
      qsa('input[name="cov"]', form).forEach(function (c) {
        if (c !== e.target && (isAsk || c.value === ASESORAME)) c.checked = false;
      });
    }
    update();
  });
  form.addEventListener('input', function (e) { if (e.target !== yearIn) touched = true; update(); });
  yearIn.addEventListener('input', function () { touched = true; update(); });

  setType('auto');

  // Presets desde otras secciones
  qsa('[data-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      touched = true;
      setType(btn.dataset.preset, btn.dataset.use);
      var target = qs('#cotizar');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Ya soy cliente: chat de muestra + WhatsApp ---------- */
  var chatOut = qs('#chatOut');
  var chatIn = qs('#chatIn');
  var replyTimer;
  function preview(a) {
    qsa('.client__actions a').forEach(function (x) { x.classList.toggle('is-active', x === a); });
    if (chatOut.textContent === a.dataset.client) return;
    chatOut.textContent = a.dataset.client;
    chatOut.classList.remove('is-new'); void chatOut.offsetWidth; chatOut.classList.add('is-new');
    chatIn.style.visibility = 'hidden';
    clearTimeout(replyTimer);
    replyTimer = setTimeout(function () {
      chatIn.textContent = a.dataset.reply;
      chatIn.style.visibility = '';
      chatIn.classList.remove('is-new'); void chatIn.offsetWidth; chatIn.classList.add('is-new');
    }, 650);
  }
  qsa('.client__actions a[data-client]').forEach(function (a) {
    a.href = waLink('Hola MP Seguros! Ya soy cliente. ' + a.dataset.client + '.\nMi nombre y DNI: ');
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('mouseenter', function () { preview(a); });
    a.addEventListener('focus', function () { preview(a); });
    a.addEventListener('click', function () { preview(a); });
  });

  /* ---------- fitText: evita cortes con letra grande en Android ---------- */
  var fitSel = ['.hero__script', '.hero__title .l1', '.brand__word b'];
  function fitText() {
    fitSel.forEach(function (sel) {
      qsa(sel).forEach(function (el) {
        el.style.fontSize = '';
        var fs = parseFloat(getComputedStyle(el).fontSize);
        var guard = 0;
        while (el.scrollWidth > el.clientWidth + 1 && fs > 11 && guard < 40) {
          fs -= 1; el.style.fontSize = fs + 'px'; guard++;
        }
      });
    });
  }
  window.__mpFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  var rT;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(fitText, 120); });

  onScroll();
})();
