/* ===== Jotta3D — demo TuPaginaYa =====================================
   Catálogo de referencia + "placa de impresión" (pedido agrupado a WA).
   Sin precios ni stock: todo se cotiza por WhatsApp.
   ==================================================================== */
(function () {
  'use strict';

  var WA = '5491136155287';
  var BASE = document.body.getAttribute('data-base') || '';
  var KEY = 'jotta3d_placa_v1';

  /* ---------- datos ---------- */
  var COLORS = [
    { id: 'naranja', name: 'Naranja', hex: '#FF7300' },
    { id: 'negro',   name: 'Negro',   hex: '#1A1A1A' },
    { id: 'blanco',  name: 'Blanco',  hex: '#F4F2EC' },
    { id: 'rojo',    name: 'Rojo',    hex: '#D7262B' },
    { id: 'azul',    name: 'Azul',    hex: '#2060C4' },
    { id: 'verde',   name: 'Verde',   hex: '#1F9E5A' },
    { id: 'gris',    name: 'Gris',    hex: '#8C8C8C' },
    { id: 'amarillo',name: 'Amarillo',hex: '#F2B705' }
  ];

  var CATS = [
    { id: 'todos',     name: 'Todo' },
    { id: 'figuras',   name: 'Figuras' },
    { id: 'souvenirs', name: 'Souvenirs' },
    { id: 'deco',      name: 'Decoración' },
    { id: 'tecnico',   name: 'Técnico' },
    { id: 'amedida',   name: 'A medida' }
  ];

  var ITEMS = [
    { id: 'figuras',    cat: 'figuras',   tag: 'Figuras',     name: 'Figuras y personajes',
      desc: 'Muñecos y personajes impresos pieza por pieza, en el tamaño que necesites.',
      img: 'p-figuras.jpg',   alt: 'Figura naranja impresa en 3D con forma de personaje' },
    { id: 'coleccion',  cat: 'figuras',   tag: 'Figuras',     name: 'Coleccionables y estatuillas',
      desc: 'Piezas de detalle para vitrina o regalo, con terminación cuidada.',
      img: 'p-coleccion.jpg', alt: 'Estatuilla impresa en 3D sobre fondo claro' },
    { id: 'series',     cat: 'souvenirs', tag: 'Souvenirs',   name: 'Souvenirs y piezas en serie',
      desc: 'Varias unidades del mismo modelo para un evento, un cumple o tu emprendimiento.',
      img: 'p-series.jpg',    alt: 'Varias figuras iguales impresas en 3D sobre la cama de la impresora' },
    { id: 'deco',       cat: 'deco',      tag: 'Decoración',  name: 'Objetos decorativos',
      desc: 'Piezas con textura y diseño para escritorio, estantería o pared.',
      img: 'p-deco.jpg',      alt: 'Pieza decorativa con patrón hexagonal saliendo de una impresora 3D' },
    { id: 'vaso',       cat: 'deco',      tag: 'Decoración',  name: 'Macetas, vasos y contenedores',
      desc: 'Formas huecas impresas en una sola pieza, en el alto y el diámetro que pidas.',
      img: 'p-vaso.jpg',      alt: 'Vaso decorativo imprimiéndose en una impresora 3D' },
    { id: 'tecnicas',   cat: 'tecnico',   tag: 'Técnico',     name: 'Piezas técnicas y repuestos',
      desc: 'Engranajes, soportes, tapas y esa pieza que ya no se consigue.',
      img: 'p-tecnicas.jpg',  alt: 'Engranajes y piezas mecánicas impresas en 3D' },
    { id: 'maquetas',   cat: 'tecnico',   tag: 'Técnico',     name: 'Maquetas y prototipos',
      desc: 'Modelos a escala para mostrar un proyecto antes de fabricarlo.',
      img: 'p-maquetas.jpg',  alt: 'Maqueta de una casa impresa en 3D sostenida con la mano' },
    { id: 'amedida',    cat: 'amedida',   tag: 'A medida',    name: 'Pieza a medida con tu archivo',
      desc: 'Mandás tu STL, OBJ o 3MF (o la idea) y lo imprimimos con tus medidas.',
      img: 'p-retiro.jpg',    alt: 'Mano retirando una pieza naranja recién impresa de la cama de la impresora' }
  ];

  var HOME_IDS = ['figuras', 'series', 'deco', 'tecnicas', 'maquetas', 'amedida'];

  /* ---------- utilidades ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function colorOf(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i];
    return COLORS[0];
  }
  function itemOf(id) {
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i];
    return null;
  }

  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }

  /* ---------- estado de la placa ---------- */
  var plate = [];
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) plate = JSON.parse(raw) || [];
  } catch (e) { plate = []; }
  if (!Array.isArray(plate)) plate = [];

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(plate)); } catch (e) {}
  }
  function findLine(itemId, colorId) {
    for (var i = 0; i < plate.length; i++) {
      if (plate[i].id === itemId && plate[i].color === colorId) return i;
    }
    return -1;
  }
  function totalPieces() {
    return plate.reduce(function (n, l) { return n + l.qty; }, 0);
  }

  /* ---------- selección de color por tarjeta ---------- */
  var picked = {};

  function swatchHTML(itemId, activeId) {
    return COLORS.map(function (c) {
      return '<button class="sw" type="button" data-item="' + itemId + '" data-color="' + c.id + '" ' +
        'aria-pressed="' + (c.id === activeId) + '" title="' + c.name + '" aria-label="Color ' + c.name + '">' +
        '<i style="background:' + c.hex + '"></i></button>';
    }).join('');
  }

  function cardHTML(it) {
    var active = picked[it.id] || 'naranja';
    return '<article class="pcard" data-card="' + it.id + '">' +
      '<div class="pcard-ph"><img src="' + BASE + 'media/' + it.img + '" alt="' + it.alt + '" width="880" height="660" loading="lazy" decoding="async">' +
      '<span class="pcard-tag">' + it.tag + '</span></div>' +
      '<div class="pcard-b">' +
      '<h3>' + it.name + '</h3>' +
      '<p>' + it.desc + '</p>' +
      '<div class="swatches" role="group" aria-label="Color para ' + it.name + '">' + swatchHTML(it.id, active) + '</div>' +
      '<button class="pcard-add" type="button" data-add="' + it.id + '">Sumar a la placa</button>' +
      '</div></article>';
  }

  function paintCards() {
    $$('.pcard').forEach(function (card) {
      var id = card.getAttribute('data-card');
      var active = picked[id] || 'naranja';
      var inPlate = findLine(id, active) > -1;
      card.classList.toggle('on', inPlate);
      var btn = $('.pcard-add', card);
      if (btn) btn.textContent = inPlate ? 'Sumar otra ✓' : 'Sumar a la placa';
      $$('.sw', card).forEach(function (sw) {
        sw.setAttribute('aria-pressed', String(sw.getAttribute('data-color') === active));
      });
    });
  }

  document.addEventListener('click', function (ev) {
    var sw = ev.target.closest ? ev.target.closest('.sw[data-item]') : null;
    if (sw) {
      picked[sw.getAttribute('data-item')] = sw.getAttribute('data-color');
      paintCards();
      return;
    }
    var add = ev.target.closest ? ev.target.closest('[data-add]') : null;
    if (add) {
      var id = add.getAttribute('data-add');
      var it = itemOf(id);
      if (!it) return;
      var col = picked[id] || 'naranja';
      var i = findLine(id, col);
      if (i > -1) plate[i].qty += 1;
      else plate.push({ id: id, color: col, qty: 1 });
      save();
      renderPlate();
      paintCards();
      toast(it.name + ' · ' + colorOf(col).name + ' en la placa');
    }
  });

  /* ---------- placa ---------- */
  var plateEl = $('#plate'), bar = $('#plateBar'), panel = $('#platePanel'),
      bed = $('#plateBed'), cnt = $('#plateCount'), word = $('#plateWord'),
      sendBtn = $('#plateSend'), noteEl = $('#plateNote'), zoneEl = $('#plateZone');

  function renderPlate() {
    if (!plateEl) return;
    var n = totalPieces();
    plateEl.hidden = n === 0;
    if (cnt) cnt.textContent = String(n);
    if (word) word.textContent = n === 1 ? 'pieza' : 'piezas';
    if (bed) {
      if (!plate.length) {
        bed.innerHTML = '<p class="pp-empty">La placa está vacía. Sumá piezas desde el catálogo.</p>';
      } else {
        bed.innerHTML = plate.map(function (l, idx) {
          var it = itemOf(l.id), c = colorOf(l.color);
          if (!it) return '';
          return '<div class="pitem">' +
            '<span class="dot" style="background:' + c.hex + '"></span>' +
            '<span class="nm">' + it.name + '<small>' + c.name + '</small></span>' +
            '<span class="qty"><button type="button" data-q="-" data-i="' + idx + '" aria-label="Quitar una unidad">–</button>' +
            '<span>' + l.qty + '</span>' +
            '<button type="button" data-q="+" data-i="' + idx + '" aria-label="Sumar una unidad">+</button></span>' +
            '<button class="rm" type="button" data-rm="' + idx + '" aria-label="Sacar de la placa">×</button>' +
            '</div>';
        }).join('');
      }
    }
    if (sendBtn) sendBtn.href = waLink();
  }

  function waLink() {
    var txt = 'Hola Jotta3D! Te paso mi pedido armado desde la web:\n\n';
    plate.forEach(function (l) {
      var it = itemOf(l.id);
      if (it) txt += '• ' + it.name + ' — color ' + colorOf(l.color).name + ' — x' + l.qty + '\n';
    });
    var note = noteEl && noteEl.value.trim();
    var zone = zoneEl && zoneEl.value.trim();
    if (note) txt += '\nDetalle: ' + note;
    if (zone) txt += '\nZona: ' + zone;
    txt += '\n\n¿Me pasás presupuesto y plazo?';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  }

  if (bar) {
    bar.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      bar.setAttribute('aria-expanded', String(open));
      $('.pb-act', bar).textContent = open ? 'Cerrar' : 'Ver placa';
      if (open && sendBtn) sendBtn.href = waLink();
    });
  }
  var closeBtn = $('#plateClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.hidden = true;
      bar.setAttribute('aria-expanded', 'false');
      $('.pb-act', bar).textContent = 'Ver placa';
    });
  }
  if (bed) {
    bed.addEventListener('click', function (ev) {
      var q = ev.target.closest('[data-q]'), rm = ev.target.closest('[data-rm]');
      if (q) {
        var i = +q.getAttribute('data-i');
        if (q.getAttribute('data-q') === '+') plate[i].qty += 1;
        else plate[i].qty -= 1;
        if (plate[i].qty <= 0) plate.splice(i, 1);
      } else if (rm) {
        plate.splice(+rm.getAttribute('data-rm'), 1);
      } else return;
      save(); renderPlate(); paintCards();
      if (!plate.length && panel) { panel.hidden = true; bar.setAttribute('aria-expanded', 'false'); }
    });
  }
  var clearBtn = $('#plateClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      plate = []; save(); renderPlate(); paintCards();
      panel.hidden = true; bar.setAttribute('aria-expanded', 'false');
      toast('Placa vacía');
    });
  }
  [noteEl, zoneEl].forEach(function (el) {
    if (el) el.addEventListener('input', function () { if (sendBtn) sendBtn.href = waLink(); });
  });
  if (sendBtn) sendBtn.addEventListener('click', function () { sendBtn.href = waLink(); });

  /* ---------- home ---------- */
  var gridHome = $('#gridHome');
  if (gridHome) {
    gridHome.innerHTML = HOME_IDS.map(function (id) {
      var it = itemOf(id);
      return it ? cardHTML(it) : '';
    }).join('');
  }

  var demo = $('#swatchDemo');
  if (demo) {
    demo.innerHTML = COLORS.map(function (c) {
      return '<span class="sw" title="' + c.name + '"><i style="background:' + c.hex + '"></i></span>';
    }).join('');
  }

  /* ---------- subpágina catálogo ---------- */
  var gridCat = $('#gridCat');
  if (gridCat) {
    var chipsBox = $('#chips'), searchEl = $('#search'), countEl = $('#catCount');
    var params = new URLSearchParams(location.search);
    var state = { cat: params.get('cat') || 'todos', q: params.get('q') || '' };
    if (!CATS.some(function (c) { return c.id === state.cat; })) state.cat = 'todos';
    if (searchEl) searchEl.value = state.q;

    if (chipsBox) {
      chipsBox.innerHTML = CATS.map(function (c) {
        return '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (c.id === state.cat) + '">' + c.name + '</button>';
      }).join('');
      chipsBox.addEventListener('click', function (ev) {
        var ch = ev.target.closest('[data-cat]');
        if (!ch) return;
        state.cat = ch.getAttribute('data-cat');
        $$('.chip', chipsBox).forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === state.cat));
        });
        renderCat();
      });
    }
    if (searchEl) {
      searchEl.addEventListener('input', function () { state.q = searchEl.value; renderCat(); });
    }

    function matches(it) {
      var okCat = state.cat === 'todos' || it.cat === state.cat;
      var q = state.q.trim().toLowerCase();
      var okQ = !q || (it.name + ' ' + it.desc + ' ' + it.tag).toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    }

    function syncURL() {
      var p = new URLSearchParams();
      if (state.cat !== 'todos') p.set('cat', state.cat);
      if (state.q.trim()) p.set('q', state.q.trim());
      var qs = p.toString();
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    }

    function renderCat() {
      var list = ITEMS.filter(matches);
      if (!list.length) {
        gridCat.innerHTML = '';
        gridCat.insertAdjacentHTML('beforeend',
          '<div class="empty"><b>No encontramos nada con esa búsqueda</b>' +
          '<p>Igual lo podemos imprimir: casi todo es a pedido. Contanos qué necesitás.</p>' +
          '<a class="btn btn-wa" href="https://wa.me/' + WA + '?text=' +
          encodeURIComponent('Hola Jotta3D! Busqué "' + state.q.trim() + '" en el catálogo de la web y no lo encontré. ¿Lo pueden imprimir?') +
          '" target="_blank" rel="noopener">Preguntar por WhatsApp</a></div>');
      } else {
        gridCat.innerHTML = list.map(cardHTML).join('');
      }
      if (countEl) {
        countEl.textContent = list.length === 1
          ? '1 tipo de trabajo'
          : list.length + ' tipos de trabajo';
      }
      syncURL();
      paintCards();
    }
    renderCat();
  }

  /* ---------- nav móvil ---------- */
  var burger = $('#burger'), menu = $('#menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        menu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveals ---------- */
  var reveals = $$('[data-reveal]');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () { e.target.classList.add('in'); }, i * 70);
            io.unobserve(e.target);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -40px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }
  if (location.search.indexOf('qa') > -1) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- video del hero (algunos móviles no autoplayean) ---------- */
  var vid = $('.hexvid');
  if (vid) {
    var tryPlay = function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); };
    tryPlay();
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }

  renderPlate();
  paintCards();
})();
