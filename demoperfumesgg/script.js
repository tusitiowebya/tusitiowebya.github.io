/* ══════════════════════════════════════════════════════════
   Perfumes GG — home
   Depende de config.js + store.js (window.GG).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var S  = window.GG;

  // Modo QA (?qa): apaga animaciones y fija el alto del hero para
  // poder capturar la pagina entera de una sola pasada.
  if (/[?&]qa/.test(location.search)) document.documentElement.classList.add('qa');

  /* ── Nav ─────────────────────────────────────────────────── */
  var nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');
  function scrollNav() { nav.classList.toggle('stuck', window.scrollY > 30); }
  window.addEventListener('scroll', scrollNav, { passive: true });
  scrollNav();

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Reveal al hacer scroll ──────────────────────────────── */
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('on'); }, i * 90);
      io.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* ── Bruma del atomizador ────────────────────────────────
     Partículas finas que salen del pico del frasco y se dispersan.
     El trazo dorado del contorno arranca junto con la primera nube. */
  (function bruma() {
    var cv = $('#bruma'), panel = $('.hero-frasco');
    if (!cv || !panel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { panel.classList.add('on'); return; }

    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [], t0 = 0, raf = null;

    function medir() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', medir);
    medir();

    // El pico del frasco cae más o menos donde el clip-path pone la tapa.
    function boca() { return { x: W * .5, y: H * .30 }; }

    function soplar(n) {
      var b = boca();
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + (Math.random() - .5) * 1.15;
        var vel = .35 + Math.random() * 1.1;
        parts.push({
          x: b.x + (Math.random() - .5) * 14,
          y: b.y + (Math.random() - .5) * 10,
          vx: Math.cos(ang) * vel + .22,
          vy: Math.sin(ang) * vel,
          r: 1.4 + Math.random() * 5.5,
          vida: 0, max: 110 + Math.random() * 120,
          giro: (Math.random() - .5) * .02
        });
      }
    }

    function pintar(t) {
      raf = requestAnimationFrame(pintar);
      if (!t0) t0 = t;
      var pasado = t - t0;

      // Nubes cada 4,2 s; la primera al medio segundo.
      if (pasado > 500 && Math.floor((pasado - 500) / 4200) !== Math.floor((pasado - 516) / 4200)) soplar(46);

      ctx.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vida++;
        if (p.vida > p.max) { parts.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx += p.giro; p.vy -= .006;          // sube y se abre
        p.vx *= .992; p.vy *= .992;
        p.r += .085;
        var k = p.vida / p.max;
        var alfa = Math.sin(k * Math.PI) * .16;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(169,138,86,' + alfa.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (pasado > 400 && !panel.classList.contains('on')) panel.classList.add('on');
    }

    // Solo corre mientras el hero está a la vista.
    var visible = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(pintar); }
      else if (raf) { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: .05 });
    visible.observe(panel);
  })();

  /* ── Ficha de producto (compartida) ──────────────────────── */
  function fichaHTML(p) {
    var mejor = S.mejorMedio(p);
    return '<article class="prod reveal">' +
      '<div class="prod-foto">' +
        '<img src="' + S.esc(p.img) + '" alt="' + S.esc(p.nombre) + '" loading="lazy">' +
        '<span class="prod-fam">' + S.esc(p.catNom) + '</span>' +
      '</div>' +
      '<div class="prod-txt">' +
        '<h3>' + S.esc(p.nombre) + '</h3>' +
        '<span class="prod-meta">' + S.esc([p.ml, p.genNom].filter(Boolean).join(' · ')) + '</span>' +
        '<p class="prod-notas">' + S.esc((p.notas || []).join(' · ')) + '</p>' +
        '<div class="prod-precio"><b>' + S.money(p.precio) + '</b>' +
          (mejor ? '<i>' + S.money(mejor.precioFinal) + ' en ' + S.esc(mejor.medio.toLowerCase()) + '</i>' : '') +
        '</div>' +
        '<button class="prod-add" data-add="' + S.esc(p.id) + '">Sumar al pedido</button>' +
      '</div>' +
    '</article>';
  }

  function pintarGrid(cont, lista) {
    if (!cont) return;
    cont.innerHTML = lista.map(fichaHTML).join('');
    $$('.reveal', cont).forEach(function (el) { io.observe(el); });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    S.agregar(b.getAttribute('data-add'), 1);
    b.textContent = 'Agregado ✓';
    b.classList.add('puesto');
    setTimeout(function () { b.textContent = 'Sumar al pedido'; b.classList.remove('puesto'); }, 1400);
  });

  /* ── Familias ────────────────────────────────────────────── */
  function pintarFamilias() {
    var cont = $('#famGrid');
    if (!cont) return;
    cont.innerHTML = S.familias.map(function (f) {
      var n = S.porCategoria(f.id).length;
      return '<a class="fam-card reveal" href="catalogo/?fam=' + f.id + '">' +
        '<div class="fam-foto"><img src="' + S.esc(f.img) + '" alt="' + S.esc(f.nombre) + '" loading="lazy"></div>' +
        '<div class="fam-txt">' +
          '<h3>' + S.esc(f.nombre) + '</h3>' +
          '<p>' + S.esc(f.resumen) + '</p>' +
          '<span class="fam-link">' + (n ? n + (n === 1 ? ' perfume' : ' perfumes') : 'Ver') + '</span>' +
        '</div></a>';
    }).join('');
    $$('.reveal', cont).forEach(function (el) { io.observe(el); });
  }

  /* ── Buscador de aroma ───────────────────────────────────── */
  var elegido = { gen: null, mom: null, fam: null };

  function chips(cont, items, grupo) {
    if (!cont) return;
    cont.innerHTML = items.map(function (i) {
      return '<button data-val="' + S.esc(i.id) + '">' + S.esc(i.nombre) + '</button>';
    }).join('') + '<button data-val="">Cualquiera</button>';
    void grupo;
  }

  function montarBuscador() {
    chips($('#busMom'), S.momentos, 'mom');
    chips($('#busFam'), S.familias, 'fam');

    $$('.bus-ops').forEach(function (grupo) {
      var clave = grupo.getAttribute('data-grupo');
      grupo.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var val = b.getAttribute('data-val') || null;
        elegido[clave] = (elegido[clave] === val) ? null : val;
        $$('button', grupo).forEach(function (x) {
          x.classList.toggle('on', (x.getAttribute('data-val') || null) === elegido[clave]);
        });
        pintarResultado();
      });
    });
    pintarResultado();
  }

  function filtrar() {
    return S.productos().filter(function (p) {
      if (elegido.gen && p.gen !== elegido.gen && p.gen !== 'unisex') return false;
      if (elegido.fam && p.cat !== elegido.fam) return false;
      if (elegido.mom && (p.mom || []).indexOf(elegido.mom) < 0) return false;
      return true;
    });
  }

  function pintarResultado() {
    var cont = $('#busRes');
    if (!cont) return;
    var hayFiltro = elegido.gen || elegido.mom || elegido.fam;

    if (!hayFiltro) {
      cont.innerHTML = '<div class="bus-vacio"><b>Elegí al menos una opción</b>' +
        'Tocá arriba y te mostramos qué frascos entran.</div>';
      return;
    }

    var lista = filtrar();
    var mom = elegido.mom ? S.momentos.filter(function (m) { return m.id === elegido.mom; })[0] : null;

    if (!lista.length) {
      cont.innerHTML = '<div class="bus-vacio">' +
        '<b>Con esa combinación no tenemos nada hoy</b>' +
        'Pasa: el stock rota. Escribinos y te decimos qué se le parece.' +
        '<div class="bus-acc" style="justify-content:center">' +
        '<a class="btn btn-wa" href="' + S.esc(S.linkWA(mensajeBusqueda([]))) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        '<button class="bus-reset" data-reset>Empezar de nuevo</button></div></div>';
      return;
    }

    var top = lista.slice(0, 4);
    cont.innerHTML =
      '<div class="bus-res-head">' +
        '<b>' + lista.length + (lista.length === 1 ? ' opción para vos' : ' opciones para vos') + '</b>' +
        '<p>' + S.esc(mom ? mom.copy : 'Estos son los que mejor entran en lo que buscás.') + '</p>' +
      '</div>' +
      '<div class="prod-grid">' + top.map(fichaHTML).join('') + '</div>' +
      '<div class="bus-acc">' +
        '<a class="btn btn-wa" href="' + S.esc(S.linkWA(mensajeBusqueda(top))) + '" target="_blank" rel="noopener">Consultar estos por WhatsApp</a>' +
        (lista.length > top.length ? '<a class="btn btn-line" href="catalogo/' + queryActual() + '">Ver las ' + lista.length + ' opciones</a>' : '') +
        '<button class="bus-reset" data-reset>Empezar de nuevo</button>' +
      '</div>';
    $$('.reveal', cont).forEach(function (el) { el.classList.add('on'); });
  }

  function queryActual() {
    var q = [];
    if (elegido.fam) q.push('fam=' + elegido.fam);
    if (elegido.gen) q.push('gen=' + elegido.gen);
    if (elegido.mom) q.push('mom=' + elegido.mom);
    return q.length ? '?' + q.join('&') : '';
  }

  function mensajeBusqueda(lista) {
    var partes = [];
    if (elegido.gen) partes.push(S.genNombres[elegido.gen]);
    if (elegido.mom) partes.push('para ' + S.nombreMomento(elegido.mom).toLowerCase());
    if (elegido.fam) partes.push('familia ' + S.nombreFamilia(elegido.fam).toLowerCase());
    var txt = 'Hola GG! Busco un perfume' + (partes.length ? ': ' + partes.join(', ') : '') + '.';
    if (lista && lista.length) {
      txt += '\n\nEn la web me aparecieron:\n' + lista.map(function (p) {
        return '• ' + p.nombre + (p.ml ? ' (' + p.ml + ')' : '');
      }).join('\n');
    }
    return txt + '\n\n¿Me ayudan a elegir?';
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-reset]')) return;
    elegido = { gen: null, mom: null, fam: null };
    $$('.bus-ops button').forEach(function (b) { b.classList.remove('on'); });
    pintarResultado();
  });

  /* ── Pirámide olfativa ───────────────────────────────────── */
  $$('.piramide li').forEach(function (li) {
    li.addEventListener('click', function () {
      $$('.piramide li').forEach(function (o) { o.classList.toggle('on', o === li); });
    });
  });

  /* ── Arranque ────────────────────────────────────────────── */
  $('#anio').textContent = new Date().getFullYear();

  pintarFamilias();
  pintarGrid($('#destGrid'), S.destacados().slice(0, 8));
  montarBuscador();
  S.montarCarrito();

  // Catálogo real de CobrOS: si llega, se repinta todo con lo del panel.
  S.sincronizar().then(function (r) {
    if (!r.conectado) return;
    pintarFamilias();
    pintarGrid($('#destGrid'), S.destacados().slice(0, 8));
    pintarResultado();
    var nota = $('#catNota');
    if (nota) {
      nota.textContent = 'Precios y stock en vivo desde el panel de Perfumes GG.';
      nota.classList.add('vivo');
    }
  });
})();
