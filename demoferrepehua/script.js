/* ══════════════════════════════════════════════════════════
   FERREPEHUA — home
   Destacados + índice de rubros. El catálogo completo con
   filtros vive en /catalogo/ (catalogo.js).
   Depende de store.js (window.FP).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FP = window.FP;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = FP.money;

  var DESTACADOS = 8;

  /* ══ Destacados ══════════════════════════════════════════ */
  var grid = $('#grid');

  // Mejor forma de pago y cuotas, tal como vienen del panel.
  function pago(p) {
    var mejor = FP.mejorMedio(p), cuotas = p.cuotas || 0;
    return (mejor
        ? '<p class="card-pay"><b>' + money(mejor.precioFinal) + '</b> con ' + mejor.medio + '</p>'
        : '') +
      (cuotas > 1
        ? '<p class="card-cuotas">' + cuotas + 'x ' + money(p.precio / cuotas) + ' sin interés</p>'
        : '');
  }

  function tarjeta(p) {
    var n = FP.cant(p.id);
    return '' +
      '<article class="card' + (p.dest ? ' is-dest' : '') + '" data-id="' + p.id + '">' +
        '<a class="card-img" href="catalogo/?q=' + encodeURIComponent(p.nombre) + '" aria-label="Ver ' + p.nombre + ' en el catálogo">' +
          '<img src="' + p.img + '" alt="' + p.nombre + '" loading="lazy" width="760" height="570">' +
          (p.dest ? '<span class="card-flag">Más vendido</span>' : '') +
          (p.marca ? '<span class="card-brand">' + p.marca + '</span>' : '') +
        '</a>' +
        '<div class="card-body">' +
          (p.cod ? '<code class="card-sku">' + p.cod + '</code>' : '') +
          '<h3>' + p.nombre + '</h3>' +
          '<div class="card-specs">' + (p.specs || []).slice(0, 3).map(function (s) {
            return '<span>' + s + '</span>';
          }).join('') + '</div>' +
          '<div class="card-foot">' +
            '<div class="card-price"><b>' + money(p.precio) + '</b><small>Precio final en ARS</small></div>' +
            '<span class="card-stock"><i></i>Disponible</span>' +
          '</div>' +
          pago(p) +
          (n
            ? '<div class="card-stepper"><button data-minus="' + p.id + '" aria-label="Quitar uno">−</button>' +
              '<span>' + n + ' en el pedido</span>' +
              '<button data-plus="' + p.id + '" aria-label="Agregar uno">+</button></div>'
            : '<button class="card-add" data-add="' + p.id + '">Agregar al pedido</button>') +
        '</div>' +
      '</article>';
  }

  function render() {
    var prods = FP.productos();
    // Los marcados como destacados primero; si no alcanzan, completa con el resto.
    var lista = prods.slice().sort(function (a, b) {
      return (b.dest ? 1 : 0) - (a.dest ? 1 : 0);
    }).slice(0, DESTACADOS);

    grid.innerHTML = lista.map(tarjeta).join('');
    $$('.card', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 45 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    var total = prods.length;
    var verTodo = $('#verTodo');
    if (verTodo) verTodo.textContent = 'Ver el catálogo completo (' + total + ' productos)';

    // Contadores reales del catálogo, para no publicar números inventados.
    var porCat = {};
    prods.forEach(function (p) { porCat[p.cat] = (porCat[p.cat] || 0) + 1; });
    $$('#rubroList li').forEach(function (li) {
      var n = porCat[li.dataset.cat] || 0;
      var c = $('.rc', li);
      if (c) c.textContent = n;
      li.classList.toggle('is-empty', n === 0);
    });
    var tot = $('#rubrosTotal');
    if (tot) tot.textContent = total;
    var totRubros = $('#rubrosCount');
    if (totRubros) totRubros.textContent = Object.keys(porCat).length;
  }

  /* ══ Agregar al pedido ═══════════════════════════════════ */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (!add) return;
    FP.agregar(add.dataset.add, 1);
    var nav = $('#navCart');
    if (nav) { nav.classList.add('bump'); setTimeout(function () { nav.classList.remove('bump'); }, 400); }
  });

  /* ══ Índice de rubros con preview ════════════════════════ */
  var preview = $('#rubroPreview'), previewImg = preview ? $('img', preview) : null;
  $$('#rubroList li').forEach(function (li) {
    li.addEventListener('click', function () {
      location.href = 'catalogo/?cat=' + encodeURIComponent(li.dataset.cat);
    });
    li.addEventListener('mouseenter', function () {
      if (!previewImg) return;
      previewImg.src = li.dataset.img;
      preview.classList.add('on');
    });
    li.addEventListener('mouseleave', function () {
      if (preview) preview.classList.remove('on');
    });
  });
  var rubrosSec = $('.rubros');
  if (rubrosSec && preview) {
    rubrosSec.addEventListener('mousemove', function (e) {
      var r = rubrosSec.getBoundingClientRect();
      preview.style.transform = 'translate(' + (e.clientX - r.left + 26) + 'px,' + (e.clientY - r.top - 130) + 'px)';
    });
  }

  /* ══ Nav / scroll ════════════════════════════════════════ */
  var nav = $('#nav'), waFloat = $('#waFloat'), tapeFill = $('#tapeFill');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 40);
    if (waFloat) waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
    if (tapeFill) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      tapeFill.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#burger').addEventListener('click', function () { nav.classList.toggle('open'); });
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ══ Reveal ══════════════════════════════════════════════ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.rubro-list li, .pasos-grid article, .pillars article, .faq-list details, .brands-in > *, .rubros-head > *, .cat-head > *, .envios-copy > *, .cta-copy > *, .cta-side, .zonas li')
    .forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      io.observe(el);
    });

  /* ══ Init ════════════════════════════════════════════════ */
  $('#year').textContent = new Date().getFullYear();

  FP.montarCarrito();
  FP.alCambiar(render);

  render();
  FP.iniciar().then(render);
})();
