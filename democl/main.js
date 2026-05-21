/* ==============================================
   CLIMAN LIVE — main.js v2
   7 efectos visuales únicos. IIFE — sin ES modules.
   v=20260520b
============================================== */
(function () {
  'use strict';
  window.__CL__ = {};

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('CL[' + name + ']', e); }
  }

  /* ────────────────────────────────────────────
     NAVBAR scroll
  ──────────────────────────────────────────── */
  safe(function () {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function tick() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }, 'nav');

  /* ────────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────────── */
  safe(function () {
    var ham  = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!ham || !menu) return;
    function close() { ham.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = ''; }
    function open()  { ham.classList.add('open');    menu.classList.add('open');    document.body.style.overflow = 'hidden'; }
    ham.addEventListener('click', function () { menu.classList.contains('open') ? close() : open(); });
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', close); });
    window.__CL__.close = window.closeMob = close;
  }, 'mobile');

  /* ────────────────────────────────────────────
     SMOOTH SCROLL
  ──────────────────────────────────────────── */
  safe(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = this.getAttribute('href');
        if (!h || h === '#') return;
        var t = document.querySelector(h);
        if (!t) return;
        e.preventDefault();
        if (window.__CL__.close) window.__CL__.close();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      });
    });
  }, 'scroll');

  /* ────────────────────────────────────────────
     FADE-IN OBSERVER  (threshold 0.05 + 6s safety)
  ──────────────────────────────────────────── */
  safe(function () {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        setTimeout(function () { entry.target.classList.add('visible'); }, Math.min(i, 5) * 70);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { obs.observe(el); });
    setTimeout(function () {
      document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) { el.classList.add('visible'); });
    }, 6000);
  }, 'observer');

  /* ────────────────────────────────────────────
     STAGGER delays on card groups
  ──────────────────────────────────────────── */
  safe(function () {
    [
      ['.serv-card',    0.06],
      ['.why-card',     0.07],
      ['.stat-card',    0.09],
      ['.gallery-item', 0.08],
      ['.contact-card', 0.08],
      ['.rep-item',     0.05],
      ['.equipo-card',  0.06]
    ].forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.style.transitionDelay = (i * g[1]).toFixed(2) + 's';
      });
    });
  }, 'stagger');

  /* ════════════════════════════════════════════
     EFECTO 1: HERO — Canvas Sound / Air Waves
     Múltiples ondas sinusoidales animadas que
     representan las ondas de presión del aire.
  ════════════════════════════════════════════ */
  safe(function () {
    var canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var hero = document.querySelector('.hero');
    var W, H, t = 0, raf;

    function resize() {
      W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
      H = canvas.height = hero ? hero.offsetHeight * 0.55 : window.innerHeight * 0.55;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* Configuración de cada onda: amp, freq, speed, color, lineWidth, yOffset(-1→+1) */
    var waves = [
      { a: 22,  f: 0.013, s: 0.020, c: 'rgba(56,189,248,',  lw: 1.5, yo: -0.05 },
      { a: 35,  f: 0.009, s: 0.013, c: 'rgba(56,189,248,',  lw: 2.0, yo:  0.10 },
      { a: 14,  f: 0.021, s: 0.028, c: 'rgba(125,211,252,', lw: 1.0, yo: -0.02 },
      { a: 50,  f: 0.006, s: 0.009, c: 'rgba(14,165,233,',  lw: 2.5, yo:  0.18 },
      { a:  9,  f: 0.034, s: 0.040, c: 'rgba(56,189,248,',  lw: 0.7, yo:  0.04 },
      { a: 70,  f: 0.004, s: 0.006, c: 'rgba(56,189,248,',  lw: 3.0, yo:  0.28 },
      { a: 18,  f: 0.017, s: 0.023, c: 'rgba(125,211,252,', lw: 1.2, yo: -0.12 },
    ];
    /* Intensidades (opacidades) de cada onda */
    var alphas = [0.5, 0.3, 0.35, 0.22, 0.2, 0.13, 0.28];

    function draw() {
      ctx.clearRect(0, 0, W, H);

      waves.forEach(function (w, idx) {
        var baseY = H * (0.45 + w.yo);
        var alpha = alphas[idx];

        /* Gradiente horizontal → fade en los bordes */
        var grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,    w.c + '0)');
        grad.addColorStop(0.06, w.c + alpha + ')');
        grad.addColorStop(0.94, w.c + alpha + ')');
        grad.addColorStop(1,    w.c + '0)');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = w.lw;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = w.c + '0.6)';

        for (var x = 0; x <= W; x += 3) {
          var y = baseY + Math.sin(x * w.f + t * w.s + idx * 0.9) * w.a;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      t  += 0.9;
      raf = requestAnimationFrame(draw);
    }
    draw();
  }, 'soundwaves');

  /* ────────────────────────────────────────────
     Partículas en hero (cristales de hielo)
  ──────────────────────────────────────────── */
  safe(function () {
    var container = document.getElementById('heroParticles');
    if (!container) return;
    for (var i = 0; i < 22; i++) {
      var p  = document.createElement('div');
      var sz = (Math.random() * 3.5 + 1.5).toFixed(1);
      p.className = 'particle';
      p.style.cssText = [
        'left:'               + (Math.random() * 100).toFixed(1) + '%',
        'top:'                + (Math.random() * 100).toFixed(1) + '%',
        'width:'              + sz + 'px',
        'height:'             + sz + 'px',
        'animation-delay:'    + (Math.random() * 8).toFixed(2)  + 's',
        'animation-duration:' + (Math.random() * 6 + 5).toFixed(1) + 's'
      ].join(';');
      container.appendChild(p);
    }
  }, 'particles');

  /* ════════════════════════════════════════════
     EFECTO 2: SERVICIOS — Circuit Board Canvas
     Grilla de nodos con partículas viajando
     entre ellos como señales eléctricas.
  ════════════════════════════════════════════ */
  safe(function () {
    var canvas = document.getElementById('circuitCanvas');
    if (!canvas) return;
    var section = document.getElementById('servicios');
    if (!section) return;
    var ctx = canvas.getContext('2d');
    var W, H, GRID = 64;
    var nodes = [], particles = [];

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
      buildNodes();
    }

    function buildNodes() {
      nodes = [];
      var cols = Math.ceil(W / GRID) + 1;
      var rows = Math.ceil(H / GRID) + 1;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          nodes.push({
            x:      c * GRID,
            y:      r * GRID,
            ph:     Math.random() * Math.PI * 2,
            speed:  0.018 + Math.random() * 0.025,
            bright: Math.random() > 0.55
          });
        }
      }
    }

    resize();
    window.addEventListener('resize', function () { resize(); particles = []; }, { passive: true });

    /* Spawn una partícula que viaja entre dos nodos adyacentes */
    function spawn() {
      if (particles.length >= 10) return;
      var si  = Math.floor(Math.random() * nodes.length);
      var src = nodes[si];
      var adj = nodes.filter(function (n, i) {
        if (i === si) return false;
        var dx = n.x - src.x, dy = n.y - src.y;
        return Math.sqrt(dx*dx + dy*dy) < GRID * 1.5;
      });
      if (!adj.length) return;
      var dst = adj[Math.floor(Math.random() * adj.length)];
      particles.push({ sx: src.x, sy: src.y, ex: dst.x, ey: dst.y, t: 0, spd: 0.007 + Math.random() * 0.009 });
    }
    setInterval(spawn, 300);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* Líneas de la grilla */
      nodes.forEach(function (n) {
        n.ph += n.speed;
        var a = 0.04 + 0.025 * Math.sin(n.ph);
        nodes.forEach(function (m) {
          if (m === n) return;
          var dx = m.x - n.x, dy = m.y - n.y;
          var d = Math.sqrt(dx*dx + dy*dy);
          if (d < GRID * 1.45 && n.x <= m.x) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(56,189,248,' + a + ')';
            ctx.lineWidth   = 0.6;
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        });
        /* Puntos en los nodos */
        if (n.bright) {
          var na = 0.25 + 0.2 * Math.sin(n.ph);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56,189,248,' + na + ')';
          ctx.fill();
        }
      });

      /* Partículas viajeras */
      particles = particles.filter(function (p) { return p.t <= 1; });
      particles.forEach(function (p) {
        p.t += p.spd;
        var px = p.sx + (p.ex - p.sx) * p.t;
        var py = p.sy + (p.ey - p.sy) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle   = 'rgba(125,211,252,0.85)';
        ctx.shadowBlur  = 10;
        ctx.shadowColor = 'rgba(56,189,248,0.8)';
        ctx.fill();
        ctx.shadowBlur  = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  }, 'circuit');

  /* ════════════════════════════════════════════
     EFECTO 6: TRAYECTORIA — Animated Counter
     Los números de los stats cuentan hacia arriba
     cuando entran al viewport (ease-out cuártico).
  ════════════════════════════════════════════ */
  safe(function () {
    var els = document.querySelectorAll('.stat-number[data-target]');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        var dur    = 2200;
        var t0     = null;

        function step(ts) {
          if (!t0) t0 = ts;
          var prog  = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - prog, 4);   /* ease-out quart */
          var cur   = Math.round(target * eased);
          el.textContent = cur + suffix;
          if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.35 });

    els.forEach(function (el) { obs.observe(el); });
  }, 'counter');

})();
