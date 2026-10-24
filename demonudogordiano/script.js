/* Terapias Nudo Gordiano — hilo que se desata, consulta y bitácora */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WA = '5492804967286';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lite = /[?&]lite\b/.test(location.search);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  var waUrl = function (txt) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt); };
  var abrirWA = function (txt) {
    var a = document.createElement('a');
    a.href = waUrl(txt); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  };

  /* =========================================================
     HILO: una curva 3D (nudo tórico abierto con dos colas) que
     se interpola hacia una línea recta. Se dibuja por segmentos
     ordenados por profundidad, así los cruces quedan de verdad
     por arriba y por abajo. Con dos canvas (atrás / adelante)
     el hilo pasa entre las letras del título.
     ========================================================= */
  function Hilo(opts) {
    this.back = opts.back;
    this.front = opts.front || null;
    this.layout = opts.layout;
    this.onDark = !!opts.onDark;
    this.n = opts.n || 520;
    this.u = 0; this.uTarget = 0;
    this.reveal = reduce || lite ? 1 : 0;
    this.rotY = .4; this.rotX = .55; this.mx = 0; this.my = 0;
    this.spin = !(reduce || lite);
    this.t0 = performance.now();
    this.visible = true;
    this.build();
    this.palette();
  }
  Hilo.prototype.build = function () {
    var n = this.n, k = [], i, s, phi, r;
    this.a = Math.round(n * .2); this.b = Math.round(n * .8);
    var m = this.b - this.a;
    for (i = 0; i <= m; i++) {
      s = i / m;
      phi = s * Math.PI * 2;
      r = .62 + .3 * Math.cos(4 * phi) + .06 * Math.sin(11 * phi);
      k.push({
        x: (1 + r * .55) * Math.cos(3 * phi) * .62 + (s - .5) * .9,
        y: (1 + r * .55) * Math.sin(3 * phi) * .62,
        z: r * Math.sin(4 * phi) * .85 + .12 * Math.sin(7 * phi)
      });
    }
    this.knot = k;
  };
  Hilo.prototype.palette = function () {
    var cols = [], i, t, r, g, b;
    for (i = 0; i < 16; i++) {
      t = i / 15;
      r = Math.round(104 + t * (226 - 104)); g = Math.round(8 + t * (74 - 8)); b = Math.round(26 + t * (96 - 26));
      cols.push('rgb(' + r + ',' + g + ',' + b + ')');
    }
    this.cols = cols;
    this.edge = this.onDark ? 'rgba(10,2,4,.85)' : 'rgba(64,6,12,.5)';
  };
  Hilo.prototype.size = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cs = [this.back, this.front], i, c, r;
    for (i = 0; i < 2; i++) {
      c = cs[i]; if (!c) continue;
      r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    this.W = this.back.getBoundingClientRect().width;
    this.H = this.back.getBoundingClientRect().height;
    this.L = this.layout(this.W, this.H);
  };
  Hilo.prototype.points = function (time) {
    var L = this.L, n = this.n, a = this.a, b = this.b, pts = new Array(n + 1);
    var u = ease(clamp(this.u, 0, 1)), iu = 1 - u;
    var ry = this.rotY + this.mx * .5 + (this.spin ? time * .00012 : 0);
    var rx = this.rotX + this.my * .35;
    var cyR = Math.cos(ry), syR = Math.sin(ry), cxR = Math.cos(rx), sxR = Math.sin(rx);
    var breath = this.spin ? 1 + .025 * Math.sin(time * .0011) : 1;
    var i, p, x, y, z, x2, z2, y2, kx, ky, kz, sx, sy, f, wob;
    var start, end;
    for (i = a; i <= b; i++) {
      p = this.knot[i - a];
      x = p.x * cyR + p.z * syR; z2 = -p.x * syR + p.z * cyR;
      y2 = p.y * cxR - z2 * sxR; z = p.y * sxR + z2 * cxR;
      kx = L.cx + x * L.R * breath; ky = L.cy + y2 * L.R * breath; kz = z;
      pts[i] = { kx: kx, ky: ky, kz: kz };
    }
    start = pts[a]; end = pts[b];
    for (i = 0; i < a; i++) {
      f = i / a;
      pts[i] = { kx: L.x0 + (start.kx - L.x0) * f, ky: L.ty + (start.ky - L.ty) * f * f, kz: Math.sin(i * .16 + 1.2) * .55 * (1 - f) + start.kz * f };
    }
    for (i = b + 1; i <= n; i++) {
      f = (i - b) / (n - b);
      pts[i] = { kx: end.kx + (L.x1 - end.kx) * f, ky: end.ky + (L.ty - end.ky) * (1 - (1 - f) * (1 - f)), kz: Math.sin(i * .16) * .55 * f + end.kz * (1 - f) };
    }
    for (i = 0; i <= n; i++) {
      p = pts[i];
      f = i / n;
      sx = L.x0 + (L.x1 - L.x0) * f;
      sy = L.yLine + Math.sin(f * Math.PI) * L.sag;
      wob = Math.sin(f * 23 + time * .002) * 14 * u * iu;
      p.x = p.kx * iu + sx * u;
      p.y = p.ky * iu + sy * u + wob;
      p.z = p.kz * iu;
    }
    return pts;
  };
  Hilo.prototype.draw = function (time) {
    if (!this.L) return;
    /* Cada segmento cae en una capa de profundidad (y en el canvas de
       atrás o de adelante). Por capa se dibujan tramos continuos, así el
       hilo no se ve "punteado" y los cruces conservan su contorno. */
    var pts = this.points(time), n = this.n, NB = 7, i, k, p, q, z;
    var lim = Math.floor(this.reveal * n);
    var keys = new Array(lim);
    var split = !!this.front;
    for (i = 0; i < lim; i++) {
      z = clamp((pts[i].z + pts[i + 1].z) / 2, -1, 1);
      keys[i] = (split && z >= -.02 ? NB : 0) + Math.min(NB - 1, Math.floor((z + 1) / 2 * NB));
    }
    var ctxB = this.back.getContext('2d'), ctxF = split ? this.front.getContext('2d') : null;
    ctxB.clearRect(0, 0, this.W, this.H);
    if (ctxF) ctxF.clearRect(0, 0, this.W, this.H);
    var w0 = this.L.w, ctx, w, zb, s, e;
    for (k = 0; k < NB * 2; k++) {
      ctx = k >= NB ? ctxF : ctxB;
      zb = ((k % NB) + .5) / NB * 2 - 1;
      w = w0 * (1 + .3 * zb);
      for (i = 0; i < lim; i++) {
        if (keys[i] !== k) continue;
        s = i;
        while (i + 1 < lim && keys[i + 1] === k) i++;
        e = i + 1;
        ctx.beginPath(); ctx.moveTo(pts[s].x, pts[s].y);
        for (q = s + 1; q <= e; q++) ctx.lineTo(pts[q].x, pts[q].y);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'butt'; ctx.strokeStyle = this.edge; ctx.lineWidth = w + 2.4; ctx.stroke();
        ctx.lineCap = 'round'; ctx.strokeStyle = this.cols[Math.round((zb + 1) / 2 * 15)]; ctx.lineWidth = w; ctx.stroke();
        if (this.hq) { ctx.strokeStyle = 'rgba(255,214,214,.3)'; ctx.lineWidth = w * .28; ctx.stroke(); }
      }
    }
    if (this.reveal < 1 && lim > 1) {
      p = pts[lim];
      ctx = ctxF || ctxB;
      ctx.fillStyle = this.cols[12];
      ctx.beginPath(); ctx.arc(p.x, p.y, w0 * .7, 0, Math.PI * 2); ctx.fill();
    }
  };

  /* bucle compartido para todos los hilos */
  var hilos = [], lastFrame = 0, fpsAcc = [], degraded = false;
  function loop(now) {
    var dt = lastFrame ? now - lastFrame : 16;
    lastFrame = now;
    var any = false;
    hilos.forEach(function (h) {
      if (!h.visible) return;
      any = true;
      if (h.reveal < 1) h.reveal = Math.min(1, h.reveal + dt / 1900);
      h.u += (h.uTarget - h.u) * Math.min(1, dt / 160);
      if (h.mxT !== undefined) { h.mx += (h.mxT - h.mx) * Math.min(1, dt / 400); h.my += (h.myT - h.my) * Math.min(1, dt / 400); }
      h.draw(now);
    });
    if (any && !degraded && !reduce) {
      fpsAcc.push(dt);
      if (fpsAcc.length > 90) {
        var avg = fpsAcc.reduce(function (a, b) { return a + b; }, 0) / fpsAcc.length;
        fpsAcc = [];
        /* < 12 fps suele ser un panel oculto que estrangula rAF: no degradar por eso */
        if (avg > 40 && avg < 85) { degraded = true; hilos.forEach(function (h) { h.hq = false; h.spin = false; }); }
      }
    }
    requestAnimationFrame(loop);
  }
  function registrar(h, el) {
    h.hq = !lite;
    hilos.push(h);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { h.visible = es[0].isIntersecting; }, { rootMargin: '80px' }).observe(el);
    }
  }

  /* ---------- hilo del hero ---------- */
  var hero = $('[data-hero]');
  var heroHilo = null;
  if (hero) {
    var ancla = $('[data-nudo-ancla]'), desatar = $('[data-desatar]'), kicker = $('.hero__kicker');
    heroHilo = new Hilo({
      back: $('[data-hilo-atras]'),
      front: $('[data-hilo-frente]'),
      n: window.innerWidth < 769 ? 420 : 560,
      layout: function (W, H) {
        var hr = hero.getBoundingClientRect(), ar = ancla.getBoundingClientRect(), dr = desatar.getBoundingClientRect();
        var mobile = W < 769;
        var R = Math.max(ar.height * (mobile ? .56 : .62), ar.width * .32);
        var cy = ar.top - hr.top + ar.height * .54;
        /* que el nudo no suba hasta el kicker en pantallas bajas */
        if (kicker) R = Math.min(R, (cy - (kicker.getBoundingClientRect().bottom - hr.top) - 4) / 1.05);
        return {
          cx: ar.left - hr.left + ar.width * .5,
          cy: cy,
          R: R,
          x0: -30, x1: W + 30,
          ty: ar.top - hr.top + ar.height * .62,
          yLine: dr.top - hr.top + dr.height * .9,
          sag: mobile ? 5 : 9,
          w: mobile ? 4 : Math.max(5, Math.min(8, W / 200))
        };
      }
    });
    heroHilo.mxT = 0; heroHilo.myT = 0;
    registrar(heroHilo, hero);
    var heroScroll = function () {
      var r = hero.getBoundingClientRect();
      heroHilo.uTarget = clamp(-r.top / (r.height * .5), 0, 1);
    };
    window.addEventListener('scroll', heroScroll, { passive: true });
    heroScroll();
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      hero.addEventListener('pointermove', function (e) {
        heroHilo.mxT = e.clientX / window.innerWidth - .5;
        heroHilo.myT = e.clientY / window.innerHeight - .5;
      });
    }
    /* video y póster según el ancho */
    var vid = $('[data-hero-video]');
    if (vid && window.matchMedia('(max-width: 768px)').matches) vid.poster = 'media/hero-m-poster.jpg';
    if (vid) { var pr = vid.play && vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }

  /* ---------- hilo de la consulta ---------- */
  var consulta = $('[data-consulta]');
  var conHilo = null;
  if (consulta) {
    conHilo = new Hilo({
      back: $('[data-hilo-consulta]'),
      onDark: true,
      n: 460,
      layout: function (W, H) {
        var mobile = W < 769 || H < 260;
        var R = mobile ? H * .3 : Math.min(W, H) * .24;
        return {
          cx: W / 2, cy: mobile ? H * .44 : H * .44, R: R,
          x0: W * .04, x1: W * .96, ty: mobile ? H * .44 : H * .46,
          yLine: mobile ? H * .44 : H * .46, sag: mobile ? 4 : 18,
          w: mobile ? 3 : 5.5
        };
      }
    });
    conHilo.rotY = 1.1;
    registrar(conHilo, consulta);
  }

  /* Android aplica la letra del sistema a los px pero no a los vw:
     si una palabra del título no entra, se achica hasta que entre */
  function fitText() {
    $$('.h1__l1, .h1__l2, .cierre__lema, main h2').forEach(function (el) {
      el.style.fontSize = '';
      var fs = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && guard++ < 40) { fs *= .96; el.style.fontSize = fs + 'px'; }
    });
  }
  window.__ngFit = fitText;
  function medir() { fitText(); hilos.forEach(function (h) { h.size(); }); }
  var rT;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(medir, 120); });
  var arrancar = function () { medir(); requestAnimationFrame(loop); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(arrancar); else window.addEventListener('load', arrancar);

  /* =========================================================
     CONSULTA: tres pasos que aflojan el nudo y arman el WhatsApp
     ========================================================= */
  var form = $('[data-form]');
  var NOMBRES = {
    holistica: 'Terapia holística integrativa',
    trayectorias: 'Acompañamiento a trayectorias',
    armonizacion: 'Armonización & bienestar',
    charlar: 'Prefiero charlarlo primero'
  };
  var estado = store.get('ng-consulta', { manual: false });
  function leer() {
    var fd = new FormData(form);
    return {
      trae: fd.getAll('trae'),
      espacio: fd.get('espacio') || '',
      modalidad: fd.get('modalidad') || '',
      dias: fd.getAll('dia'),
      franja: fd.get('franja') || '',
      nombre: (fd.get('nombre') || '').toString().trim()
    };
  }
  function sugerir() {
    var tally = { holistica: 0, trayectorias: 0, armonizacion: 0 }, best = '';
    $$('input[name="trae"]:checked', form).forEach(function (c) {
      c.dataset.peso.split(' ').forEach(function (k) { tally[k] += 1; });
    });
    ['holistica', 'trayectorias', 'armonizacion'].forEach(function (k) { if (tally[k] > 0 && (!best || tally[k] > tally[best])) best = k; });
    return best;
  }
  function mensaje(d) {
    var l = [];
    l.push('Hola' + (d.nombre ? ', soy ' + d.nombre : '') + '. Quiero pedir un turno en Terapias Nudo Gordiano.');
    if (d.trae.length) l.push('Lo que me trae: ' + d.trae.join('; ').toLowerCase() + '.');
    if (d.espacio) l.push(d.espacio === 'charlar' ? 'Espacio: prefiero charlarlo en el primer encuentro.' : 'Espacio: ' + NOMBRES[d.espacio] + '.');
    if (d.modalidad) l.push('Modalidad: ' + d.modalidad.toLowerCase() + '.');
    if (d.dias.length || d.franja) {
      var dias = d.dias.length ? (d.dias.length > 1 ? d.dias.slice(0, -1).join(', ') + ' o ' + d.dias[d.dias.length - 1] : d.dias[0]) : '';
      l.push('Me queda bien ' + (dias ? dias : 'cualquier día') + (d.franja ? ', ' + d.franja : '') + '.');
    }
    l.push('¿Qué horarios tienen disponibles?');
    return l.join('\n');
  }
  function actualizar(guardar) {
    if (!form) return;
    var d = leer(), sug = sugerir();
    if (!estado.manual) {
      $$('input[name="espacio"]', form).forEach(function (r) { r.checked = r.value === sug; });
      d.espacio = sug;
    }
    $$('.espacio-opt', form).forEach(function (o) { o.classList.toggle('is-sugerido', !!sug && $('input', o).value === sug); });
    var sugEl = $('[data-sugerencia]');
    sugEl.innerHTML = sug
      ? 'Por lo que marcaste, te sugerimos empezar por <b>' + NOMBRES[sug] + '</b>. Si preferís otro, elegilo.'
      : 'Marcá al menos una opción arriba y te sugerimos por dónde empezar.';
    var s1 = d.trae.length > 0, s2 = !!d.espacio;
    var s3p = (d.modalidad ? 1 : 0) + (d.dias.length ? 1 : 0) + (d.franja ? 1 : 0);
    $('[data-paso="1"]').classList.toggle('is-done', s1);
    $('[data-paso="2"]').classList.toggle('is-done', s2);
    $('[data-paso="3"]').classList.toggle('is-done', s3p === 3);
    var p = (s1 ? 1 : 0) / 3 + (s2 ? 1 : 0) / 3 + s3p / 9;
    if (conHilo) conHilo.uTarget = p;
    var pct = Math.round(p * 100);
    $('[data-visor-pct]').textContent = pct + '%';
    $('[data-visor-txt]').textContent = pct === 0 ? 'El nudo, tal como llega.'
      : pct < 40 ? 'Primera hebra suelta.'
      : pct < 70 ? 'Se está aflojando.'
      : pct < 100 ? 'Casi derecho.'
      : 'Hilo derecho: ya podés enviarlo.';
    $('[data-msg]').textContent = mensaje(d);
    if (guardar) {
      estado.d = d;
      store.set('ng-consulta', estado);
    }
  }
  function restaurar() {
    var d = estado.d;
    if (!d) return;
    $$('input[name="trae"]', form).forEach(function (c) { c.checked = d.trae.indexOf(c.value) > -1; });
    $$('input[name="dia"]', form).forEach(function (c) { c.checked = d.dias.indexOf(c.value) > -1; });
    ['espacio', 'modalidad', 'franja'].forEach(function (k) {
      $$('input[name="' + k + '"]', form).forEach(function (r) { r.checked = r.value === d[k]; });
    });
    form.elements.nombre.value = d.nombre || '';
  }
  if (form) {
    restaurar();
    form.addEventListener('change', function (e) {
      if (e.target.name === 'espacio') estado.manual = true;
      $('[data-error]').hidden = true;
      actualizar(true);
    });
    form.addEventListener('input', function (e) { if (e.target.name === 'nombre') actualizar(true); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = leer();
      if (!d.trae.length && !d.espacio) {
        var err = $('[data-error]');
        err.textContent = 'Marcá al menos qué te trae o qué espacio te interesa, así sabemos por dónde empezar.';
        err.hidden = false;
        return;
      }
      abrirWA(mensaje(d));
    });
    $('[data-reset]').addEventListener('click', function () {
      form.reset();
      estado = { manual: false };
      store.set('ng-consulta', estado);
      $('[data-error]').hidden = true;
      actualizar(false);
    });
    $$('[data-elegir]').forEach(function (a) {
      a.addEventListener('click', function () {
        var v = a.getAttribute('data-elegir');
        estado.manual = true;
        $$('input[name="espacio"]', form).forEach(function (r) { r.checked = r.value === v; });
        actualizar(true);
      });
    });
    actualizar(false);
  }

  /* =========================================================
     BITÁCORA: registros locales, uno por nudo
     ========================================================= */
  var TENSION = { 5: 'Muy anudado', 4: 'Anudado', 3: 'En proceso', 2: 'Más suelto', 1: 'Liviano' };
  var reg = $('[data-registro]');
  var lista = $('[data-bit-lista]');
  var bit = store.get('ng-bitacora', []);
  if (!Array.isArray(bit)) bit = [];
  var hoy = function () {
    var d = new Date(), z = function (x) { return (x < 10 ? '0' : '') + x; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  };
  var fechaLarga = function (iso) {
    var p = iso.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '');
  };
  var fechaCorta = function (iso) { var p = iso.split('-'); return p[2] + '/' + p[1]; };
  function pintarBitacora() {
    if (!lista) return;
    bit.sort(function (a, b) { return a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : a.id - b.id; });
    lista.innerHTML = '';
    bit.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'registro-item';
      var nudo = document.createElement('span');
      nudo.className = 'tension__nudo t' + r.tension; nudo.setAttribute('aria-hidden', 'true');
      var meta = document.createElement('p');
      meta.className = 'registro-item__meta';
      meta.textContent = fechaLarga(r.fecha) + ' · ' + TENSION[r.tension];
      var nota = document.createElement('p');
      nota.className = 'registro-item__nota';
      nota.textContent = r.nota;
      var del = document.createElement('button');
      del.type = 'button'; del.className = 'registro-item__borrar';
      del.setAttribute('aria-label', 'Borrar este registro'); del.textContent = '×';
      del.addEventListener('click', function () {
        bit = bit.filter(function (x) { return x.id !== r.id; });
        store.set('ng-bitacora', bit); pintarBitacora();
      });
      li.append(nudo, meta, nota, del);
      lista.appendChild(li);
    });
    var vacio = bit.length === 0;
    $('[data-bit-vacio]').hidden = !vacio;
    $('[data-bit-compartir]').disabled = vacio;
    $('[data-bit-borrar]').disabled = vacio;
    $('[data-bit-cant]').textContent = vacio ? '' : '· ' + bit.length + (bit.length === 1 ? ' nudo' : ' nudos');
  }
  if (reg) {
    reg.elements.fecha.value = hoy();
    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      var nota = reg.elements.nota.value.trim(), err = $('[data-reg-error]');
      if (!nota) { err.textContent = 'Escribí aunque sea una línea: qué notaste o qué querés llevar a la sesión.'; err.hidden = false; reg.elements.nota.focus(); return; }
      err.hidden = true;
      var t = reg.querySelector('input[name="tension"]:checked');
      bit.push({ id: Date.now(), fecha: reg.elements.fecha.value || hoy(), tension: t ? +t.value : 3, nota: nota.slice(0, 280) });
      store.set('ng-bitacora', bit);
      reg.elements.nota.value = '';
      pintarBitacora();
    });
    $('[data-bit-compartir]').addEventListener('click', function () {
      var txt = 'Hola, te comparto mi bitácora antes de la próxima sesión:\n';
      var items = bit.map(function (r) { return '\n• ' + fechaCorta(r.fecha) + ' (' + TENSION[r.tension].toLowerCase() + '): ' + r.nota; });
      while (items.length > 1 && (txt + items.join('')).length > 1500) items.shift();
      abrirWA(txt + items.join(''));
    });
    $('[data-bit-borrar]').addEventListener('click', function () {
      if (!window.confirm('¿Borrar todos los registros de tu bitácora en este dispositivo?')) return;
      bit = []; store.set('ng-bitacora', bit); pintarBitacora();
    });
    pintarBitacora();
  }

  /* =========================================================
     NAV, reveal, proceso, FAB
     ========================================================= */
  var nav = $('[data-nav]'), toggle = $('[data-menu]'), menu = $('#menu');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function cerrarMenu() {
    toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); document.body.classList.remove('menu-open');
  }
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', cerrarMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });

  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  var procHilo = $('[data-proceso-hilo]'), riel = $('.proceso__riel');
  if (procHilo && riel) {
    var procScroll = function () {
      var r = riel.getBoundingClientRect();
      var p = clamp((window.innerHeight * .72 - r.top) / r.height, 0, 1);
      procHilo.style.strokeDashoffset = String(1 - p);
    };
    window.addEventListener('scroll', procScroll, { passive: true }); procScroll();
  }

  var fab = $('[data-fab]');
  if (fab && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { fab.classList.toggle('is-on', !es[0].isIntersecting); }).observe(hero);
  }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
