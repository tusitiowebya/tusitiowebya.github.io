/* ==========================================================
   Fundación FoMeVa — TuPaginaYa
   ========================================================== */
(function () {
  'use strict';

  var WA = '5491154200365';

  /* ---------- año ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en, i) {
      if (!en.isIntersecting) return;
      var el = en.target;
      setTimeout(function () { el.classList.add('in'); }, Math.min(i * 70, 280));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3800);
  }

  /* ---------- WhatsApp ---------- */
  var MSG = {
    general: 'Hola Fundación FoMeVa 👋 Quiero hacerles una consulta.',
    municipio: 'Hola Fundación FoMeVa 👋 Les escribo desde un municipio/provincia. Queremos conversar sobre ferias, capacitaciones y proyectos conjuntos.',
    empresa: 'Hola Fundación FoMeVa 👋 Les escribo desde una empresa/organización. Nos interesa vincularnos con la Red FoMeVa.'
  };
  function waLink(text) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.setAttribute('href', waLink(MSG[a.dataset.wa] || MSG.general));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- redes pendientes ---------- */
  document.querySelectorAll('[data-soc]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      toast('Falta el usuario de ' + a.dataset.soc + ' para enlazarlo.');
    });
  });

  /* ---------- formulario → WhatsApp ---------- */
  var form = document.getElementById('formRed');
  var formErr = document.getElementById('formErr');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var wrap = inp.closest('.f');
        var bad = !inp.value.trim();
        if (wrap) wrap.classList.toggle('err', bad);
        if (bad) ok = false;
      });
      if (formErr) formErr.hidden = ok;
      if (!ok) return;

      var d = new FormData(form);
      var txt =
        'Hola Fundación FoMeVa 👋 Quiero sumarme a la Red FoMeVa.\n\n' +
        '• Nombre: ' + d.get('nombre') + '\n' +
        '• WhatsApp: ' + d.get('tel') + '\n' +
        (d.get('empre') ? '• Emprendimiento: ' + d.get('empre') + '\n' : '') +
        '• Rubro: ' + d.get('rubro') + '\n' +
        '• Localidad: ' + d.get('loc') + ', ' + d.get('prov') + '\n' +
        (d.get('msg') ? '• Actividad / necesidad: ' + d.get('msg') + '\n' : '');

      window.open(waLink(txt), '_blank', 'noopener');
      toast('¡Listo! Se abre WhatsApp con tus datos cargados.');
    });
  }

  /* ---------- Ruta FoMeVa: progreso de la línea ---------- */
  var rScroll = document.getElementById('routeScroll');
  var rProg = document.getElementById('routeProg');
  if (rScroll && rProg) {
    var upd = function () {
      var max = rScroll.scrollWidth - rScroll.clientWidth;
      var pct = max > 0 ? (rScroll.scrollLeft / max) : 0;
      rProg.style.width = (8 + pct * 92) + '%';
    };
    rScroll.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- Red FoMeVa: grafo de nodos ---------- */
  (function net() {
    var svg = document.querySelector('.net__svg');
    if (!svg) return;
    var gL = svg.querySelector('.net__links');
    var gN = svg.querySelector('.net__nodes');
    var W = 900, H = 420;
    var COLORS = ['#E9B400', '#2C7E9B', '#0C2A21'];

    var nodes = [];
    var i;
    /* hub central */
    nodes.push({ x: W / 2, y: H / 2, r: 15, c: 2, hub: true });
    /* anillo interno: municipios y empresas */
    for (i = 0; i < 7; i++) {
      var a1 = (Math.PI * 2 * i) / 7 - Math.PI / 2;
      nodes.push({
        x: W / 2 + Math.cos(a1) * 130,
        y: H / 2 + Math.sin(a1) * 92,
        r: 8,
        c: i % 2 === 0 ? 1 : 2
      });
    }
    /* anillo externo: emprendedores */
    for (i = 0; i < 18; i++) {
      var a2 = (Math.PI * 2 * i) / 18 - Math.PI / 2 + 0.16;
      var rad = 0.86 + ((i * 37) % 23) / 100;
      nodes.push({
        x: W / 2 + Math.cos(a2) * 300 * rad,
        y: H / 2 + Math.sin(a2) * 168 * rad,
        r: 5.5,
        c: 0
      });
    }

    var svgns = 'http://www.w3.org/2000/svg';
    function link(a, b, op) {
      var l = document.createElementNS(svgns, 'line');
      l.setAttribute('x1', a.x.toFixed(1)); l.setAttribute('y1', a.y.toFixed(1));
      l.setAttribute('x2', b.x.toFixed(1)); l.setAttribute('y2', b.y.toFixed(1));
      if (op) l.setAttribute('opacity', op);
      gL.appendChild(l);
    }
    /* hub -> anillo interno */
    for (i = 1; i <= 7; i++) link(nodes[0], nodes[i], 0.5);
    /* anillo interno -> externos */
    for (i = 8; i < nodes.length; i++) {
      link(nodes[1 + ((i - 8) % 7)], nodes[i], 0.22);
      if (i + 1 < nodes.length) link(nodes[i], nodes[i + 1], 0.12);
    }

    nodes.forEach(function (n, idx) {
      var c = document.createElementNS(svgns, 'circle');
      c.setAttribute('cx', n.x.toFixed(1));
      c.setAttribute('cy', n.y.toFixed(1));
      c.setAttribute('r', n.r);
      c.setAttribute('fill', COLORS[n.c]);
      if (n.hub) c.setAttribute('stroke', '#FFD23F'), c.setAttribute('stroke-width', '4');
      c.style.opacity = '0';
      c.style.transition = 'opacity .5s ease ' + (idx * 26) + 'ms';
      gN.appendChild(c);

      if (!n.hub) {
        var an = document.createElementNS(svgns, 'animate');
        an.setAttribute('attributeName', 'r');
        an.setAttribute('values', n.r + ';' + (n.r + 1.6) + ';' + n.r);
        an.setAttribute('dur', (2.6 + (idx % 5) * 0.4) + 's');
        an.setAttribute('repeatCount', 'indefinite');
        c.appendChild(an);
      }
    });

    var seen = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      gN.querySelectorAll('circle').forEach(function (c) { c.style.opacity = '1'; });
      seen.disconnect();
    }, { threshold: 0.25 });
    seen.observe(svg);
  })();

  /* ---------- lightbox galería ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('.gal__i').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var img = fig.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.add('on');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLb() {
      lb.classList.remove('on');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__x')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('on')) closeLb();
    });
  }

  /* ---------- fitText: Android con letra del sistema agrandada ---------- */
  function fitText() {
    document.querySelectorAll('[data-fit]').forEach(function (el) {
      el.style.fontSize = '';
      var cur = parseFloat(getComputedStyle(el).fontSize);
      var guard = 0;
      while (el.scrollWidth > el.clientWidth && cur > 12 && guard < 60) {
        cur -= 1;
        el.style.fontSize = cur + 'px';
        guard++;
      }
    });
  }
  window.__fomevaFit = fitText;
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  fitText();
})();
