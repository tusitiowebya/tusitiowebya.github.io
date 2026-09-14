/* =========================================================
   AUTYTEC · script
   ========================================================= */
(function () {
  'use strict';

  var WSP = '5491136499113';
  var html = document.documentElement;
  var QA = html.classList.contains('qa');
  var LITE = html.classList.contains('lite');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waUrl = function (msg) { return 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg); };

  /* ---------- links de WhatsApp ---------- */
  $$('[data-wa]').forEach(function (a) { a.href = waUrl(a.getAttribute('data-wa')); });
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- video del hero (en LITE ni se pide) ---------- */
  var vid = $('#heroVideo');
  if (vid && !LITE && !QA) {
    vid.src = vid.getAttribute('data-src');
    var p = vid.play(); if (p && p.catch) p.catch(function () {});
  }

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); waFloat(); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
  });
  var fab = $('.wa-float');
  function waFloat() { fab.classList.toggle('show', window.scrollY > window.innerHeight * 0.6); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveals ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !QA && !LITE) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = $$('.reveal', e.target.parentElement);
        var i = Math.max(0, sibs.indexOf(e.target));
        e.target.style.setProperty('--d', Math.min(i * 0.07, 0.42) + 's');
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* =========================================================
     HERO · la tecla
     ========================================================= */
  var hero = $('.hero'), sw = $('#heroSwitch'), hint = $('#plateHint'), term = $('#termCmd');
  var dash = {};
  $$('[data-d]').forEach(function (el) { dash[el.getAttribute('data-d')] = el; });
  var typing = null;

  function typeCmd(text) {
    clearInterval(typing);
    if (QA || LITE) { term.textContent = text; return; }
    var i = 0; term.textContent = '';
    typing = setInterval(function () {
      term.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(typing);
    }, 34);
  }
  function setDash(k, v, cls) {
    var el = dash[k]; if (!el) return;
    el.textContent = v;
    el.classList.remove('on', 'cool');
    if (cls) el.classList.add(cls);
  }
  function setLit(on, user) {
    hero.classList.toggle('is-lit', on);
    sw.setAttribute('aria-checked', on ? 'true' : 'false');
    sw.setAttribute('aria-label', on ? 'Apagar las luces de la casa' : 'Encender las luces de la casa');
    if (user) { sw.classList.add('touched'); }
    if (on) {
      typeCmd('escena "llegué" ✓ 4 luces · aire 22° · puerta abierta');
      hint.textContent = 'Así llegás a casa';
      setDash('luces', '4 / 6', 'on');
      setDash('clima', '22° frío', 'cool');
      setDash('pers', 'Bajas');
      setDash('puerta', 'Destrabada', 'on');
      setDash('alarma', 'Desarmada');
    } else {
      typeCmd('escena "me voy" ✓ todo apagado · alarma armada');
      hint.textContent = 'Tocá la tecla';
      setDash('luces', '0 / 6');
      setDash('clima', 'Apagado');
      setDash('pers', 'Bajas');
      setDash('puerta', 'Trabada', 'cool');
      setDash('alarma', 'Armada', 'cool');
    }
  }
  var autoLit = null;
  sw.addEventListener('click', function () {
    clearTimeout(autoLit);
    setLit(!hero.classList.contains('is-lit'), true);
  });
  if (QA) setLit(true);
  else autoLit = setTimeout(function () { setLit(true); }, 3200);

  /* hora real de Buenos Aires */
  var horaEl = $('#dashHora');
  var fmt;
  try { fmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' }); } catch (e) {}
  function tick() {
    var d = new Date();
    horaEl.textContent = fmt ? fmt.format(d) : (('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2));
  }
  tick(); setInterval(tick, 15000);

  /* =========================================================
     SIGNATURE · armá tu escena
     ========================================================= */
  var room = $('#room');
  if (room) initScenes();

  function initScenes() {
    var el = {
      triggers: $$('.trig'), swatches: $$('.sw'),
      luces: $('#cLuces'), dim: $('#cDim'), temp: $('#cTemp'), pers: $('#cPers'),
      aire: $('#cAire'), led: $('#cLed'), tv: $('#cTv'), puerta: $('#cPuerta'), alarma: $('#cAlarma'),
      vDim: $('#vDim'), vTemp: $('#vTemp'), vPers: $('#vPers'), vAire: $('#vAire'),
      sky1: $('#sky1'), sky2: $('#sky2'), sun: $('#sun'), moon: $('#moon'), stars: $('#stars'),
      blind: $('#blind'), dark: $('#dark'), beam: $('#beam'), bulb: $('#bulb'), floorGlow: $('#floorGlow'), shade: $('#shade'),
      ledGlow: $('#ledGlow'), ledStrip: $('#ledStrip'), tvScreen: $('#tvScreen'),
      acLed: $('#acLed'), acTxt: $('#acTxt'), airflow: $('#airflow'), lockLed: $('#lockLed'), alarmLed: $('#alarmLed'),
      title: $('#roomTitle'), time: $('#roomTime'), chips: $('#roomChips'),
      recipe: $('#recipeText'), kit: $('#kitList'), kitCount: $('#kitCount'), wa: $('#sceneWa')
    };

    var LED = { ambar: ['#FFB347', 'ámbar'], cian: ['#3DE0E8', 'cian'], violeta: ['#9B7BFF', 'violeta'], rojo: ['#FF5A5F', 'rojo tenue'] };

    var TRIG = {
      llego:    { label: 'Llego a casa',   frase: 'llegás a casa',           hora: '19:40', sky: ['#1B2A55', '#E88A4A'], sun: 1, sunY: 226, moon: 0, stars: 0, dark: .55,
                  s: { luces: true, dim: 70, temp: 15, pers: 0, aire: true, grados: 22, led: true, color: 'ambar', tv: false, puerta: false, alarma: false } },
      anochece: { label: 'Anochece',       frase: 'se hace de noche',        hora: '20:15', sky: ['#0E1630', '#4A3A6A'], sun: 0, sunY: 260, moon: .9, stars: .6, dark: .72,
                  s: { luces: true, dim: 45, temp: 8, pers: 0, aire: false, grados: 24, led: true, color: 'ambar', tv: false, puerta: true, alarma: false } },
      cine:     { label: 'Modo cine',      frase: 'decís “modo cine”',       hora: '22:10', sky: ['#070B18', '#16204A'], sun: 0, sunY: 260, moon: 1, stars: 1, dark: .82,
                  s: { luces: true, dim: 10, temp: 0, pers: 0, aire: true, grados: 23, led: true, color: 'violeta', tv: true, puerta: true, alarma: false } },
      dormir:   { label: 'Me voy a dormir', frase: 'te vas a dormir',        hora: '23:50', sky: ['#05070F', '#0C1230'], sun: 0, sunY: 260, moon: 1, stars: 1, dark: .88,
                  s: { luces: false, dim: 30, temp: 0, pers: 0, aire: true, grados: 24, led: true, color: 'rojo', tv: false, puerta: true, alarma: true } },
      salgo:    { label: 'Me voy de casa', frase: 'salís de casa',           hora: '09:30', sky: ['#5DA9EC', '#CFE7FA'], sun: 1, sunY: 104, moon: 0, stars: 0, dark: .08, day: true,
                  s: { luces: false, dim: 70, temp: 50, pers: 50, aire: false, grados: 24, led: false, color: 'ambar', tv: false, puerta: true, alarma: true } }
    };

    var state = { t: 'llego', color: 'ambar', grados: 22 };
    var userTouched = false;

    /* helpers */
    function hex(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
    function mix(a, b, t) { a = hex(a); b = hex(b); return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; }
    function tempColor(v) { return v <= 50 ? mix('#FF9A3D', '#FFE2B0', v / 50) : mix('#FFE2B0', '#D6E8FF', (v - 50) / 50); }
    function tempName(v) { return v < 34 ? 'cálida' : v < 67 ? 'neutra' : 'fría'; }
    function persName(v) { return v === 0 ? 'Bajas' : v === 100 ? 'Arriba' : v + '%'; }
    function fill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); }
    function joinY(arr) { return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1]; }

    function applyPreset(key) {
      var s = TRIG[key].s;
      state.t = key;
      el.luces.checked = s.luces; el.dim.value = s.dim; el.temp.value = s.temp; el.pers.value = s.pers;
      el.aire.checked = s.aire; state.grados = s.grados;
      el.led.checked = s.led; state.color = s.color;
      el.tv.checked = s.tv; el.puerta.checked = s.puerta; el.alarma.checked = s.alarma;
      render();
    }

    function render() {
      var T = TRIG[state.t];
      var lucesOn = el.luces.checked, dim = +el.dim.value, temp = +el.temp.value, pers = +el.pers.value;
      var aireOn = el.aire.checked, ledOn = el.led.checked, tvOn = el.tv.checked, trabada = el.puerta.checked, armada = el.alarma.checked;
      var lamp = tempColor(temp), led = LED[state.color][0];

      /* controles */
      el.triggers.forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-t') === state.t ? 'true' : 'false'); });
      el.swatches.forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-c') === state.color ? 'true' : 'false'); });
      [el.dim, el.temp, el.pers].forEach(fill);
      el.vDim.textContent = dim + '%';
      el.vTemp.textContent = tempName(temp).charAt(0).toUpperCase() + tempName(temp).slice(1);
      el.vPers.textContent = persName(pers);
      el.vAire.textContent = state.grados + '°';
      $('.dev[data-dev="luces"]').classList.toggle('is-off', !lucesOn);
      $('.dev[data-dev="aire"]').classList.toggle('is-off', !aireOn);
      $('.dev[data-dev="led"]').classList.toggle('is-off', !ledOn);
      $$('.dev').forEach(function (d) {
        var k = d.getAttribute('data-dev');
        var on = { luces: lucesOn, pers: pers > 0, aire: aireOn, led: ledOn, tv: tvOn, puerta: trabada, alarma: armada }[k];
        d.classList.toggle('is-on', !!on);
      });

      /* ambiente */
      room.style.setProperty('--lamp', lamp);
      room.style.setProperty('--led', led);
      el.title.textContent = 'Living · escena “' + T.label + '”';
      el.time.textContent = T.hora;
      el.sky1.setAttribute('stop-color', T.sky[0]);
      el.sky2.setAttribute('stop-color', T.sky[1]);
      el.sun.style.opacity = T.sun;
      el.sun.style.transform = 'translateY(' + (T.sunY - 200) + 'px)';
      el.moon.style.opacity = T.moon;
      el.stars.style.opacity = T.stars;
      el.blind.style.transform = 'translateY(' + (-pers / 100 * 184) + 'px)';

      var light = lucesOn ? dim / 100 : 0;
      var base = T.day ? 0.06 + (1 - pers / 100) * 0.55 : T.dark;
      var dark = base * (1 - light * 0.6) * (ledOn ? 0.92 : 1) * (tvOn ? 0.9 : 1);
      el.dark.style.opacity = dark.toFixed(3);
      el.beam.style.opacity = (light * 0.95).toFixed(3);
      el.floorGlow.style.opacity = (light * 0.85).toFixed(3);
      el.bulb.style.fill = lucesOn ? lamp : '#39414F';
      el.shade.style.fill = lucesOn ? mix('#39414F', '#FFD9A0', 0.35 + light * 0.5) : '#39414F';
      el.ledGlow.style.opacity = ledOn ? 0.9 : 0;
      el.ledStrip.style.opacity = ledOn ? 1 : 0;
      el.tvScreen.style.opacity = tvOn ? 1 : 0;
      el.acLed.style.fill = aireOn ? '#3DE0E8' : '#39414F';
      el.acTxt.textContent = aireOn ? state.grados + '°' : '';
      el.airflow.style.opacity = aireOn ? 0.75 : 0;
      el.lockLed.style.fill = trabada ? '#25D366' : '#FFB347';
      el.alarmLed.style.fill = armada ? '#FF5A5F' : '#39414F';

      /* chips */
      var chips = [];
      chips.push(lucesOn ? 'luces <b>' + dim + '% ' + tempName(temp) + '</b>' : 'luces <b>off</b>');
      chips.push('persianas <b>' + persName(pers).toLowerCase() + '</b>');
      chips.push(aireOn ? 'aire <b>' + state.grados + '°</b>' : 'aire <b>off</b>');
      if (ledOn) chips.push('led <b>' + LED[state.color][1] + '</b>');
      if (tvOn) chips.push('tele <b>on</b>');
      chips.push('puerta <b>' + (trabada ? 'trabada' : 'libre') + '</b>');
      chips.push('alarma <b>' + (armada ? 'armada' : 'off') + '</b>');
      el.chips.innerHTML = chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');

      /* receta */
      var acc = [];
      acc.push(lucesOn ? 'prende las luces al <em>' + dim + '%</em> en luz <em>' + tempName(temp) + '</em>' : 'apaga <em>todas las luces</em>');
      acc.push(pers === 0 ? 'baja las <em>persianas</em>' : pers === 100 ? 'sube las <em>persianas</em>' : 'deja las persianas al <em>' + pers + '%</em>');
      acc.push(aireOn ? 'pone el aire a <em>' + state.grados + '°</em>' : 'apaga el <em>aire</em>');
      if (ledOn) acc.push('enciende la tira LED en <em>' + LED[state.color][1] + '</em>');
      if (tvOn) acc.push('prende la <em>tele</em>');
      if (trabada) acc.push('traba la <em>puerta</em>');
      else if (state.t === 'llego') acc.push('destraba la <em>puerta</em>');
      if (armada) acc.push('arma la <em>alarma</em>');
      else if (state.t === 'llego') acc.push('desarma la <em>alarma</em>');
      el.recipe.innerHTML = 'Cuando ' + T.frase + ', tu casa ' + joinY(acc) + '. <span style="color:var(--muted)">Todo junto, sin tocar nada.</span>';

      /* kit */
      var kit = ['Módulos inteligentes para las luces', 'Motor o módulo para la persiana', 'Control Wi-Fi para el aire'];
      if (ledOn) kit.push('Controlador para la tira LED');
      if (tvOn) kit.push('Integración con la tele');
      if (trabada || state.t === 'llego') kit.push('Cerradura inteligente');
      if (armada || state.t === 'llego') kit.push('Sensores y central de alarma');
      kit.push(state.t === 'cine' ? 'Asistente de voz + app' : 'App para manejar todo');
      el.kit.innerHTML = kit.map(function (k) { return '<li>' + k + '</li>'; }).join('');
      el.kitCount.textContent = '· ' + kit.length + ' cosas';

      /* WhatsApp */
      var lines = [
        'Hola Autytec! Armé esta escena en la web y la quiero en mi casa:',
        '',
        '*Cuando:* ' + T.label,
        '*Luces:* ' + (lucesOn ? dim + '%, luz ' + tempName(temp) : 'apagadas'),
        '*Persianas:* ' + persName(pers).toLowerCase(),
        '*Aire:* ' + (aireOn ? state.grados + '°' : 'apagado'),
        '*Tira LED:* ' + (ledOn ? LED[state.color][1] : 'apagada'),
        '*Tele:* ' + (tvOn ? 'prendida' : 'no'),
        '*Puerta:* ' + (trabada ? 'trabada' : 'destrabada'),
        '*Alarma:* ' + (armada ? 'armada' : 'desarmada'),
        '',
        '¿Me pasan un presupuesto?'
      ];
      el.wa.href = waUrl(lines.join('\n'));
    }

    function touch() { userTouched = true; clearInterval(demo); }

    el.triggers.forEach(function (b) {
      b.addEventListener('click', function () { touch(); applyPreset(b.getAttribute('data-t')); });
    });
    el.swatches.forEach(function (b) {
      b.addEventListener('click', function () { touch(); state.color = b.getAttribute('data-c'); el.led.checked = true; render(); });
    });
    [el.luces, el.aire, el.led, el.tv, el.puerta, el.alarma].forEach(function (c) {
      c.addEventListener('change', function () { touch(); render(); });
    });
    [el.dim, el.temp, el.pers].forEach(function (r) {
      r.addEventListener('input', function () {
        touch();
        if (r === el.dim || r === el.temp) el.luces.checked = true;
        render();
      });
    });
    $$('.step').forEach(function (b) {
      b.addEventListener('click', function () {
        touch();
        state.grados = Math.max(16, Math.min(30, state.grados + (+b.getAttribute('data-step'))));
        el.aire.checked = true; render();
      });
    });

    applyPreset('llego');

    /* auto-demo al entrar en viewport, se corta si el usuario toca */
    var demo = null;
    var order = ['anochece', 'cine', 'dormir', 'salgo', 'llego'];
    if (!QA && !LITE && 'IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting || seen || userTouched) return;
        seen = true; obs.disconnect();
        var i = 0;
        demo = setInterval(function () {
          if (userTouched || i >= order.length) { clearInterval(demo); return; }
          applyPreset(order[i++]);
        }, 2600);
      }, { threshold: 0.45 }).observe(room);
    }
    var qt = /[?&]t=(\w+)/.exec(location.search);
    if (qt && TRIG[qt[1]]) applyPreset(qt[1]);
  }

  /* ---------- despiece de la tecla ---------- */
  var explode = $('#explode');
  if (explode) {
    if (QA || LITE || !('IntersectionObserver' in window)) explode.classList.add('is-open');
    else new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { explode.classList.toggle('is-open', e.isIntersecting); });
    }, { threshold: 0.5 }).observe(explode);
  }
})();
