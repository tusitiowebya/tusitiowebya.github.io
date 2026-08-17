/* ═══════════════════════════════════════════
   Solos en la galaxia — interacciones
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  var WA = '5493424095987';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── NAV ────────────────────────────────── */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  var wafloat = document.querySelector('.wafloat');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    wafloat.classList.toggle('is-on', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-on', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-on');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── REVEAL ─────────────────────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll(
    '.reveal, .espiral__head, .espiral__grid, .autor__media, .autor__copy, .libs__head, .lib, .libs__cta, .reps__head, .rep, .pedido__copy, .pedido__form, .cierre .wrap > *'
  ).forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
    io.observe(el);
  });

  /* ── STARFIELD DEL HERO (canvas 2D liviano) ─ */
  var cv = document.getElementById('stars');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d');
    var stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mx = 0, my = 0, cx = 0, cy = 0;

    function build() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(150, Math.round((w * h) / 12000));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.25,
          z: Math.random() * 0.9 + 0.1,
          t: Math.random() * Math.PI * 2,
          s: Math.random() * 0.02 + 0.005
        });
      }
    }

    function draw() {
      cx += (mx - cx) * 0.045;
      cy += (my - cy) * 0.045;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.t += st.s;
        var a = 0.28 + Math.abs(Math.sin(st.t)) * 0.62;
        var px = st.x + cx * st.z * 26;
        var py = st.y + cy * st.z * 18;
        ctx.beginPath();
        ctx.arc(px, py, st.r * (0.6 + st.z * 0.8), 0, 6.284);
        ctx.fillStyle = 'rgba(' + (st.z > 0.65 ? '190,235,255' : '255,255,255') + ',' + a * st.z + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', build);
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    build();
    requestAnimationFrame(draw);
  }

  /* ── TILT DEL LIBRO ─────────────────────── */
  var book = document.getElementById('book');
  if (book && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var host = book.parentElement;
    host.addEventListener('mousemove', function (e) {
      var r = host.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      book.style.transform =
        'rotateY(' + (px * 17) + 'deg) rotateX(' + (-py * 12) + 'deg) translateZ(24px)';
    });
    host.addEventListener('mouseleave', function () {
      book.style.transform = 'rotateY(-9deg) rotateX(2deg)';
    });
    book.style.transform = 'rotateY(-9deg) rotateX(2deg)';
  }

  /* ── ESPIRAL DE LOS FRAGMENTOS (signature) ─ */
  var FRAGMENTOS = [
    {
      n: '01', t: 'El Sistema Solar', e: 'Escala: 9.000 millones de km',
      d: 'Nuestro barrio. Ocho planetas, un cinturón de rocas y una estrella común y corriente. El capítulo donde se aprende a leer distancias: cuánto tarda la luz del Sol en llegarnos, y por qué todo lo que sigue va a ser mucho, mucho más grande.'
    },
    {
      n: '02', t: 'El Brazo de Orión', e: 'Escala: 3.500 años luz de ancho',
      d: 'La calle donde vivimos: un brazo secundario, ni siquiera de los principales. Acá entran las estrellas vecinas, las nebulosas donde nacen soles nuevos y la primera incomodidad del libro — no estamos en el centro de nada.'
    },
    {
      n: '03', t: 'La Vía Láctea', e: 'Escala: 100.000 años luz',
      d: 'Doscientos mil millones de estrellas girando alrededor de un agujero negro supermasivo. Cómo se midió el tamaño de algo que nos contiene, cómo sabemos que es espiral si estamos adentro, y cuántos mundos posibles caben en esa cuenta.'
    },
    {
      n: '04', t: 'El Grupo Local', e: 'Escala: 10 millones de años luz',
      d: 'Andrómeda viene hacia nosotros a 110 km por segundo. En unos 4.500 millones de años las dos galaxias se van a fundir en una sola. El capítulo de los choques cósmicos y de las escalas de tiempo que no entran en una vida humana.'
    },
    {
      n: '05', t: 'El Universo Observable', e: 'Escala: 93.000 millones de años luz',
      d: 'El borde de lo que la luz alcanzó a mostrarnos. Dos billones de galaxias, un fondo de radiación de hace 13.800 millones de años, y la pregunta obligada: si todo eso existe, ¿por qué el silencio?'
    },
    {
      n: '06', t: 'Hipótesis de los Fragmentos', e: 'Escala: la que propone el libro',
      d: 'La idea que le da título a la obra. Una lectura propia del silencio cósmico, armada con lo que se recorrió en los cinco fragmentos anteriores. Acá el libro deja de explicar y empieza a proponer — con números arriba de la mesa.'
    }
  ];

  var svg = document.getElementById('spiralSvg');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var armsG = svg.querySelector('#arms');
    var dustG = svg.querySelector('#dust');
    var nodesG = svg.querySelector('#nodes');
    var CXs = 280, CYs = 280;

    function spiralPoint(theta, offset, a, b) {
      var r = a * Math.exp(b * theta);
      return [CXs + r * Math.cos(theta + offset), CYs + r * Math.sin(theta + offset)];
    }

    // brazos
    var ARMS = 3, A = 17, B = 0.235;
    for (var k = 0; k < ARMS; k++) {
      var off = (k * 2 * Math.PI) / ARMS;
      var d = '';
      for (var th = 0; th <= 11.2; th += 0.14) {
        var p = spiralPoint(th, off, A, B);
        d += (d ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      armsG.appendChild(path);
    }

    // polvo estelar sobre los brazos
    for (var i = 0; i < 260; i++) {
      var arm = Math.floor(Math.random() * ARMS);
      var th2 = Math.random() * 11.2;
      var pt = spiralPoint(th2, (arm * 2 * Math.PI) / ARMS, A, B);
      var jitter = 12 * (Math.random() - 0.5) * (0.4 + th2 / 11.2);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (pt[0] + jitter * 2).toFixed(1));
      c.setAttribute('cy', (pt[1] + jitter * 2).toFixed(1));
      c.setAttribute('r', (Math.random() * 1.5 + 0.3).toFixed(2));
      c.setAttribute('fill', Math.random() > 0.62 ? '#B07BE8' : '#9FE6F2');
      c.setAttribute('opacity', (Math.random() * 0.6 + 0.2).toFixed(2));
      dustG.appendChild(c);
    }

    // nodos = fragmentos (uno por vuelta, sobre el brazo 0)
    var NODE_TH = [2.1, 4.0, 5.6, 7.1, 8.6, 10.4];
    var nodeEls = [];
    NODE_TH.forEach(function (th, idx) {
      var p = spiralPoint(th, 0, A, B);
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'node');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', 'Fragmento ' + FRAGMENTOS[idx].n + ': ' + FRAGMENTOS[idx].t);

      var halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('class', 'halo');
      halo.setAttribute('cx', p[0]); halo.setAttribute('cy', p[1]); halo.setAttribute('r', 13);

      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'dot');
      dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.setAttribute('r', 5);

      var hit = document.createElementNS(NS, 'circle');
      hit.setAttribute('class', 'hit');
      hit.setAttribute('cx', p[0]); hit.setAttribute('cy', p[1]); hit.setAttribute('r', 22);

      var tx = document.createElementNS(NS, 'text');
      var right = p[0] >= CXs;
      tx.setAttribute('x', p[0] + (right ? 18 : -18));
      tx.setAttribute('y', p[1] + 4);
      tx.setAttribute('text-anchor', right ? 'start' : 'end');
      tx.textContent = FRAGMENTOS[idx].n;

      g.appendChild(halo); g.appendChild(dot); g.appendChild(tx); g.appendChild(hit);
      nodesG.appendChild(g);
      nodeEls.push(g);

      g.addEventListener('click', function () { select(idx, true); });
      g.addEventListener('mouseenter', function () { select(idx, false); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(idx, true); }
      });
    });

    // barritas de navegación
    var dotsUl = document.getElementById('fragDots');
    var bars = [];
    FRAGMENTOS.forEach(function (f, idx) {
      var li = document.createElement('li');
      li.setAttribute('title', f.t);
      li.addEventListener('click', function () { select(idx, true); });
      dotsUl.appendChild(li);
      bars.push(li);
    });

    var elNum = document.querySelector('.frag__num');
    var elTit = document.querySelector('.frag__title');
    var elEsc = document.querySelector('.frag__scale');
    var elTxt = document.querySelector('.frag__text');
    var panel = document.getElementById('fragPanel');
    var current = -1, auto = null;

    function select(idx, manual) {
      if (idx === current) return;
      current = idx;
      var f = FRAGMENTOS[idx];
      elNum.textContent = 'Fragmento ' + f.n;
      elTit.textContent = f.t;
      elEsc.textContent = f.e;
      elTxt.textContent = f.d;
      panel.animate(
        [{ opacity: 0.25, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
      nodeEls.forEach(function (g, i) { g.classList.toggle('is-on', i === idx); });
      bars.forEach(function (b, i) { b.classList.toggle('is-on', i === idx); });
      if (manual && auto) { clearInterval(auto); auto = null; }
    }

    select(0, false);

    // recorrido automático cuando entra en pantalla (una sola pasada)
    if (!reduce) {
      var seen = false;
      var io2 = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting && !seen) {
            seen = true;
            var i = 0;
            auto = setInterval(function () {
              i++;
              if (i >= FRAGMENTOS.length) { clearInterval(auto); auto = null; return; }
              if (current === i - 1) select(i, false);
              else { clearInterval(auto); auto = null; }
            }, 2600);
          }
        });
      }, { threshold: 0.4 });
      io2.observe(svg);
    }
  }

  /* ── LIBRERÍAS ──────────────────────────── */
  var LIBRERIAS = [
    { tag: 'Tienda oficial', name: 'Editorial Autores de Argentina', where: 'Envíos a todo el país', url: 'https://autoresdeargentina.com' },
    { tag: 'Santa Fe', name: 'Librería Colmegna', where: 'San Martín 2546, Santa Fe', url: '#' },
    { tag: 'Cadena nacional', name: 'Cúspide Libros', where: 'Sucursales y tienda online', url: 'https://www.cuspide.com' },
    { tag: 'Cadena nacional', name: 'El Ateneo', where: 'Sucursales y tienda online', url: 'https://www.yenny-elateneo.com' },
    { tag: 'Marketplace', name: 'Mercado Libre', where: 'Papel · envío a domicilio', url: 'https://www.mercadolibre.com.ar' },
    { tag: 'Internacional', name: 'Amazon', where: 'Kindle y papel · todo el mundo', url: 'https://www.amazon.com' },
    { tag: 'Internacional', name: 'Google Play Libros', where: 'Ebook · lectura en cualquier dispositivo', url: 'https://play.google.com/store/books' },
    { tag: 'Internacional', name: 'Buscalibre', where: 'Latinoamérica y España', url: 'https://www.buscalibre.com.ar' }
  ];

  var grid = document.getElementById('libsGrid');
  if (grid) {
    LIBRERIAS.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'lib';
      a.href = l.url;
      if (l.url !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML =
        '<p class="lib__tag">' + l.tag + '</p>' +
        '<h3 class="lib__name">' + l.name + '</h3>' +
        '<p class="lib__where">' + l.where + '</p>' +
        '<span class="lib__go">Ver dónde comprar <span>→</span></span>';
      grid.appendChild(a);
    });
  }

  /* ── PEDIDO → WHATSAPP ──────────────────── */
  var form = document.getElementById('pedidoForm');
  if (form) {
    var fmt = 'Papel';
    var qty = 1;
    var qtyEl = document.getElementById('qty');
    var resumen = document.getElementById('resumen');
    var waBtn = document.getElementById('waBtn');
    var ded = document.getElementById('ded');
    var loc = document.getElementById('loc');
    var dedField = document.getElementById('dedField');

    document.getElementById('fmtChips').addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      this.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-on'); });
      b.classList.add('is-on');
      fmt = b.dataset.fmt;
      dedField.style.display = fmt === 'Ebook' ? 'none' : '';
      update();
    });

    document.getElementById('plus').addEventListener('click', function () {
      qty = Math.min(qty + 1, 20); update();
    });
    document.getElementById('minus').addEventListener('click', function () {
      qty = Math.max(qty - 1, 1); update();
    });
    ded.addEventListener('input', update);
    loc.addEventListener('input', update);

    function update() {
      qtyEl.textContent = qty;
      var etiqueta = fmt === 'Papel' ? 'en papel' : fmt === 'Ebook' ? 'en ebook' : 'en papel, firmado';
      var txt = qty + (qty === 1 ? ' ejemplar ' : ' ejemplares ') + etiqueta;
      if (loc.value.trim()) txt += ' · ' + loc.value.trim();
      if (fmt !== 'Ebook' && ded.value.trim()) txt += ' · con dedicatoria';
      resumen.textContent = txt;

      var msg = '¡Hola Claudio! Quiero pedir "Solos en la galaxia".\n' +
        '• Formato: ' + fmt + '\n' +
        '• Cantidad: ' + qty;
      if (fmt !== 'Ebook' && ded.value.trim()) msg += '\n• Dedicatoria: ' + ded.value.trim();
      if (loc.value.trim()) msg += '\n• Localidad: ' + loc.value.trim();
      msg += '\n¿Me pasás precio y forma de pago?';

      waBtn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    }
    update();
  }

  /* ── AÑO / NADA MÁS ─────────────────────── */
})();
