/* ══════════════════════════════════════════════════════════
   MAju — home
   Armador de looks ("vestir con propósito") + vidriera de destacados
   + índice de rubros. El catálogo completo vive en /catalogo/.
   Depende de store.js (window.MJ).
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MJ = window.MJ;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = MJ.money, esc = MJ.esc;

  var DESTACADOS = 8;

  // Talle elegido por producto (se comparte entre la vidriera y el look).
  var talleElegido = {};
  function talleDefault(p) {
    if (!p.talles || !p.talles.length) return '';
    if (talleElegido[p.id] && p.talles.indexOf(talleElegido[p.id]) >= 0) return talleElegido[p.id];
    return p.talles[Math.floor((p.talles.length - 1) / 2)];   // el del medio de la curva
  }

  /* ══ Vidriera de destacados ══════════════════════════════ */
  var grid = $('#grid');

  function pago(p) {
    var mejor = MJ.mejorMedio(p), cuotas = p.cuotas || 0;
    return (mejor ? '<p class="card-pay">' + money(mejor.precioFinal) + ' con ' + esc(mejor.medio) + '</p>' : '') +
      (cuotas > 1 ? '<p class="card-cuotas">' + cuotas + 'x ' + money(p.precio / cuotas) + ' sin interés</p>' : '');
  }

  function planesHTML(p) {
    var pl = (p.planes || []).slice(0, 3);
    if (!pl.length) return '';
    return '<div class="card-planes">' + pl.map(function (id) {
      return '<span>' + esc(MJ.nombrePlan(id)) + '</span>';
    }).join('') + '</div>';
  }

  function tallesHTML(p) {
    if (!p.talles || !p.talles.length) return '<p class="card-tela">Talle único</p>';
    var sel = talleDefault(p);
    return '<div class="card-talles" role="group" aria-label="Talles disponibles">' +
      p.talles.map(function (t) {
        return '<button type="button" data-talle="' + esc(p.id) + '|' + esc(t) + '"' +
               (t === sel ? ' class="on"' : '') + ' aria-pressed="' + (t === sel) + '">' + esc(t) + '</button>';
      }).join('') + '</div>';
  }

  function tarjeta(p) {
    var n = MJ.cantProducto(p.id);
    return '' +
      '<article class="card" data-id="' + esc(p.id) + '">' +
        '<a class="card-img" href="catalogo/?p=' + encodeURIComponent(p.id) + '" aria-label="Ver ' + esc(p.nombre) + ' en el catálogo">' +
          '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="800" height="1066">' +
          (p.dest ? '<span class="card-flag">Más pedido</span>' : '') +
          planesHTML(p) +
        '</a>' +
        '<div class="card-body">' +
          '<span class="card-cat">' + esc(p.catNom || '') + '</span>' +
          '<h3>' + esc(p.nombre) + '</h3>' +
          (p.tela ? '<p class="card-tela">' + esc(p.tela) + '</p>' : '') +
          '<div class="card-price"><b>' + money(p.precio) + '</b><small>precio final</small></div>' +
          pago(p) +
          tallesHTML(p) +
          '<button class="card-add' + (n ? ' is-ok' : '') + '" data-add="' + esc(p.id) + '">' +
            (n ? n + ' en el pedido' : 'Sumar al pedido') + '</button>' +
        '</div>' +
      '</article>';
  }

  function renderGrid() {
    if (!grid) return;
    var prods = MJ.productos();
    var lista = prods.slice().sort(function (a, b) {
      return (b.dest ? 1 : 0) - (a.dest ? 1 : 0);
    }).slice(0, DESTACADOS);

    grid.innerHTML = lista.map(tarjeta).join('');
    $$('.card', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 45 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    var verTodo = $('#verTodo');
    if (verTodo) verTodo.textContent = 'Ver el catálogo completo (' + prods.length + ' prendas)';

    // Contadores reales por rubro: nunca publicar números inventados.
    var porCat = {};
    prods.forEach(function (p) { porCat[p.cat] = (porCat[p.cat] || 0) + 1; });
    $$('#rubroList li').forEach(function (li) {
      var n = porCat[li.dataset.cat] || 0;
      var c = $('.rc', li);
      if (c) c.textContent = n;
      li.classList.toggle('is-empty', n === 0);
    });
  }

  /* ══ Armador de looks ════════════════════════════════════
     Combina prendas del catálogo según la ocasión y el ánimo.
     `vuelta` va rotando los candidatos: el botón "otra combinación"
     avanza uno y el look cambia sin repetir siempre lo mismo.        */
  var MOODS = [
    { id:'comoda',    nombre:'Cómoda',    peso:{ tops:2, pantalones:2, abrigos:2, faldas:0, vestidos:0, conjuntos:-1, accesorios:1 }, precio:-1,
      copy:'Vamos por prendas sueltas, telas nobles y nada que te apriete.' },
    { id:'arreglada', nombre:'Arreglada', peso:{ vestidos:2, faldas:2, tops:1, conjuntos:1, abrigos:1, pantalones:0, accesorios:1 }, precio:0,
      copy:'Una prenda que resuelva sola y el resto que acompañe.' },
    { id:'poderosa',  nombre:'Poderosa',  peso:{ conjuntos:3, abrigos:2, pantalones:2, vestidos:1, tops:1, faldas:0, accesorios:1 }, precio:1,
      copy:'Sastrería, hombros marcados y un abrigo que se note al entrar.' }
  ];

  var ROLES = {
    principal: { nombre:'Prenda principal', cats:['vestidos','conjuntos'] },
    arriba:    { nombre:'Arriba',           cats:['tops'] },
    abajo:     { nombre:'Abajo',            cats:['pantalones','faldas'] },
    abrigo:    { nombre:'Abrigo',           cats:['abrigos'] },
    accesorio: { nombre:'El detalle',       cats:['accesorios'] }
  };

  var planSel = null, moodSel = 'arreglada', vuelta = 0, lookActual = [];
  var offsets = {};                      // corrimiento por rol (botón de cambiar prenda)

  function candidatos(rol, plan, mood) {
    var cats = ROLES[rol].cats;
    var m = MOODS.filter(function (x) { return x.id === mood; })[0] || MOODS[1];
    var lista = MJ.porPlan(plan).filter(function (p) { return cats.indexOf(p.cat) >= 0; });
    if (!lista.length) return [];
    var precios = lista.map(function (p) { return p.precio; });
    var min = Math.min.apply(null, precios), max = Math.max.apply(null, precios);
    return lista.slice().sort(function (a, b) {
      return puntaje(b) - puntaje(a);
    });
    function puntaje(p) {
      var base = (m.peso[p.cat] || 0);
      // Empuja hacia arriba o hacia abajo dentro del rango de precios del rubro.
      var rel = max > min ? (p.precio - min) / (max - min) : .5;
      return base + m.precio * rel * 1.5 + (p.dest ? .4 : 0);
    }
  }

  function elegir(rol, plan, mood, usados) {
    var cand = candidatos(rol, plan, mood).filter(function (p) { return usados.indexOf(p.id) < 0; });
    if (!cand.length) return null;
    var off = ((offsets[rol] || 0) + vuelta) % cand.length;
    return cand[off];
  }

  function armarLook() {
    if (!planSel) return [];
    var usados = [], out = [];
    // La vuelta alterna la receta: prenda principal, o arriba + abajo.
    var conPrincipal = (vuelta % 2 === 0) && moodSel !== 'comoda';
    var receta = conPrincipal
      ? ['principal', 'abrigo', 'accesorio']
      : ['arriba', 'abajo', 'abrigo', 'accesorio'];

    receta.forEach(function (rol) {
      var p = elegir(rol, planSel, moodSel, usados);
      if (!p) return;
      usados.push(p.id);
      out.push({ rol: rol, p: p });
    });

    // Si la ocasión tiene poco stock, completa con lo que haya del plan.
    if (out.length < 2) {
      MJ.porPlan(planSel).forEach(function (p) {
        if (out.length >= 3 || usados.indexOf(p.id) >= 0) return;
        usados.push(p.id);
        out.push({ rol: 'principal', p: p });
      });
    }
    return out;
  }

  function pintarLook() {
    var box = $('#lookResult');
    if (!box) return;

    if (!planSel) {
      box.innerHTML = '<p class="lr-empty">Elegí una ocasión y te armamos el look.</p>';
      return;
    }
    lookActual = armarLook();
    if (!lookActual.length) {
      box.innerHTML = '<p class="lr-empty">Todavía no tenemos prendas cargadas para ese plan. ' +
        'Escribinos y te contamos qué está entrando esta semana.</p>';
      return;
    }

    var total = lookActual.reduce(function (a, it) { return a + it.p.precio; }, 0);
    // Mejor total posible juntando el descuento de cada prenda.
    var medios = {};
    lookActual.forEach(function (it) {
      (it.p.medios || []).forEach(function (m) { if (m.pct > 0) medios[m.medio] = 1; });
    });
    var mejor = Object.keys(medios).map(function (medio) {
      return {
        medio: medio,
        total: lookActual.reduce(function (a, it) {
          var m = (it.p.medios || []).filter(function (x) { return x.medio === medio; })[0];
          return a + MJ.precioCon(it.p.precio, m ? m.pct : 0);
        }, 0)
      };
    }).sort(function (a, b) { return a.total - b.total; })[0];

    box.innerHTML = '' +
      '<div class="lr-head">' +
        '<h3>Para ' + esc(MJ.nombrePlan(planSel).toLowerCase()) + '</h3>' +
        '<span class="lr-count">' + lookActual.length + ' prendas</span>' +
      '</div>' +
      '<div class="lr-items">' + lookActual.map(function (it) {
        var t = talleDefault(it.p);
        return '<article class="lr-item">' +
          '<img src="' + esc(it.p.img) + '" alt="' + esc(it.p.nombre) + '" loading="lazy" width="800" height="1066">' +
          '<button class="lr-swap" data-swap="' + esc(it.rol) + '" title="Cambiar esta prenda" aria-label="Cambiar esta prenda">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h13l-3-3"/><path d="M20 15H7l3 3"/></svg>' +
          '</button>' +
          '<div class="lr-body">' +
            '<span class="lr-rol">' + esc(ROLES[it.rol].nombre) + '</span>' +
            '<h4>' + esc(it.p.nombre) + '</h4>' +
            '<b>' + money(it.p.precio) + '</b>' +
            (t ? ' <small>· talle ' + esc(t) + '</small>' : '') +
          '</div>' +
        '</article>';
      }).join('') + '</div>' +
      '<div class="lr-foot">' +
        '<div class="lr-total"><span>Total del look</span><b>' + money(total) + '</b>' +
          (mejor && mejor.total < total - 1 ? '<i>' + money(mejor.total) + ' con ' + esc(mejor.medio) + '</i>' : '') +
        '</div>' +
        '<div class="lr-actions">' +
          '<button class="btn btn-ink" data-look-add>Sumar el look al pedido</button>' +
          '<a class="btn btn-line" href="' + MJ.linkWA(mensajeLook(total)) + '" target="_blank" rel="noopener">Consultarlo</a>' +
        '</div>' +
      '</div>';
  }

  function mensajeLook(total) {
    var m = MOODS.filter(function (x) { return x.id === moodSel; })[0];
    return 'Hola MAju! Armé un look en la web para ' + MJ.nombrePlan(planSel).toLowerCase() +
      ' (' + (m ? m.nombre.toLowerCase() : '') + '):\n\n' +
      lookActual.map(function (it) {
        var t = talleDefault(it.p);
        return '• ' + it.p.nombre + (t ? ' — talle ' + t : '') + ' — ' + money(it.p.precio);
      }).join('\n') +
      '\n\nTotal: ' + money(total) + '\n\n¿Me confirmás stock y talles?';
  }

  function pintarChips() {
    var cp = $('#chipsPlan'), cm = $('#chipsMood');
    if (!cp || !cm) return;

    // Solo ocasiones que tengan prendas cargadas.
    var planes = (MJ.PLANES || []).filter(function (pl) { return MJ.porPlan(pl.id).length >= 2; });
    if (!planes.length) planes = MJ.PLANES || [];
    if (planSel && !planes.filter(function (p) { return p.id === planSel; }).length) planSel = null;
    if (!planSel && planes.length) planSel = planes[0].id;

    cp.innerHTML = planes.map(function (pl) {
      return '<button type="button" class="chip' + (pl.id === planSel ? ' on' : '') +
             '" data-plan="' + esc(pl.id) + '" aria-pressed="' + (pl.id === planSel) + '">' +
             esc(pl.nombre) + '</button>';
    }).join('');

    cm.innerHTML = MOODS.map(function (m) {
      return '<button type="button" class="chip' + (m.id === moodSel ? ' on' : '') +
             '" data-mood="' + esc(m.id) + '" aria-pressed="' + (m.id === moodSel) + '">' +
             esc(m.nombre) + '</button>';
    }).join('');

    var nota = $('#lookNote');
    if (nota) {
      var pl = (MJ.PLANES || []).filter(function (x) { return x.id === planSel; })[0];
      var mo = MOODS.filter(function (x) { return x.id === moodSel; })[0];
      nota.textContent = [pl && pl.copy, mo && mo.copy].filter(Boolean).join(' ');
    }
  }

  function renderLook() { pintarChips(); pintarLook(); }

  /* ══ Interacciones ═══════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    // Talle en la tarjeta
    var t = e.target.closest('[data-talle]');
    if (t) {
      var partes = t.dataset.talle.split('|');
      talleElegido[partes[0]] = partes[1];
      var cont = t.parentNode;
      $$('button', cont).forEach(function (b) {
        var on = b === t;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      return;
    }

    // Sumar una prenda al pedido
    var add = e.target.closest('[data-add]');
    if (add) {
      var p = MJ.buscar(add.dataset.add);
      if (!p) return;
      MJ.agregar(p.id, talleDefault(p), 1);
      bumpCarrito();
      return;
    }

    // Chips del armador
    var cp = e.target.closest('[data-plan]');
    if (cp) { planSel = cp.dataset.plan; vuelta = 0; offsets = {}; renderLook(); return; }
    var cm = e.target.closest('[data-mood]');
    if (cm) { moodSel = cm.dataset.mood; vuelta = 0; offsets = {}; renderLook(); return; }

    // Cambiar una prenda puntual del look
    var sw = e.target.closest('[data-swap]');
    if (sw) {
      var rol = sw.dataset.swap;
      offsets[rol] = (offsets[rol] || 0) + 1;
      pintarLook();
      return;
    }

    // Sumar el look entero
    if (e.target.closest('[data-look-add]')) {
      lookActual.forEach(function (it) { MJ.agregar(it.p.id, talleDefault(it.p), 1); });
      bumpCarrito();
      var btn = e.target.closest('[data-look-add]');
      btn.textContent = 'Listo, está en tu pedido';
      setTimeout(function () { btn.textContent = 'Sumar el look al pedido'; }, 2200);
    }
  });

  function bumpCarrito() {
    var nav = $('#navCart');
    if (!nav) return;
    nav.classList.add('bump');
    setTimeout(function () { nav.classList.remove('bump'); }, 420);
  }

  var shuffle = $('#lookShuffle');
  if (shuffle) shuffle.addEventListener('click', function () { vuelta++; offsets = {}; pintarLook(); });

  /* ══ Índice de rubros ════════════════════════════════════ */
  $$('#rubroList li').forEach(function (li) {
    li.addEventListener('click', function () {
      location.href = 'catalogo/?cat=' + encodeURIComponent(li.dataset.cat);
    });
  });

  /* ══ Nav / scroll ════════════════════════════════════════ */
  var nav = $('#nav'), waFloat = $('#waFloat');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 40);
    if (waFloat) waFloat.classList.toggle('show', y > window.innerHeight * 0.55);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#burger').addEventListener('click', function () { nav.classList.toggle('open'); });
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ══ Parallax suave de la vidriera del hero ══════════════ */
  var panels = $$('.hero-window .hw');
  var mueve = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 900;
  if (mueve && panels.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        panels.forEach(function (el) {
          el.style.transform = 'translateY(' + (-y * parseFloat(el.dataset.depth || 0)) + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ══ Reveal ══════════════════════════════════════════════ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.mf-grid article, .ps-grid li, .faq-list details, .ru-list li, .look-head > *, .vd-head > *, .tl-copy > *, .tl-table-wrap, .ns-copy > *, .nf, .ps-envios > *, .cta-in > *')
    .forEach(function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = (i % 6) * 55 + 'ms';
      io.observe(el);
    });

  /* ══ WhatsApp ════════════════════════════════════════════ */
  var LINKS = [
    ['#waFloat', 'Hola MAju! Te escribo desde la web, quería consultarles por unas prendas.'],
    ['#waCta',   'Hola MAju! Quiero que me ayuden a armar un look. Les cuento el plan que tengo:'],
    ['#waTalles','Hola MAju! Quería consultar por mi talle. Mis medidas son: busto __, cintura __, cadera __.']
  ];
  LINKS.forEach(function (par) {
    var el = $(par[0]);
    if (el) el.href = MJ.linkWA(par[1]);
  });

  /* ══ Init ════════════════════════════════════════════════ */
  $('#year').textContent = new Date().getFullYear();

  MJ.montarCarrito();
  MJ.alCambiar(function () { renderGrid(); });

  renderGrid();
  renderLook();
  MJ.iniciar().then(function () { renderGrid(); renderLook(); });
})();
