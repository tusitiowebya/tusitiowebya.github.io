/* ===========================================================
   Metal & Madera — TuPaginaYa
   Catálogo de referencia + banco de diseño paramétrico
   =========================================================== */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA_NUM = CFG.WA || '5491165732676';
  var WA_BASE = 'https://wa.me/' + WA_NUM;
  var STORE_KEY = 'mm-seleccion';

  function waLink(text) {
    return WA_BASE + '?text=' + encodeURIComponent(text);
  }

  /* ---------- todos los links con mensaje pre-cargado ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    a.href = waLink(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- header ---------- */
  var header = document.querySelector('.header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('navigation');

  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      header.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- video del hero (carga diferida) ---------- */
  var video = document.getElementById('hero-video');
  var vToggle = document.getElementById('video-toggle');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (video && !reduced) {
    var src = video.getAttribute('data-src');
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function () { video.src = src; });
    } else {
      setTimeout(function () { video.src = src; }, 400);
    }
  }
  if (vToggle) {
    if (reduced) {
      vToggle.hidden = true;
    } else {
      vToggle.addEventListener('click', function () {
        if (video.paused) {
          video.play();
          vToggle.textContent = 'Ⅱ';
          vToggle.setAttribute('aria-label', 'Pausar video de fondo');
        } else {
          video.pause();
          vToggle.textContent = '▶';
          vToggle.setAttribute('aria-label', 'Reproducir video de fondo');
        }
      });
    }
  }

  /* ---------- reveal ---------- */
  var QA = /(\?|&)qa/.test(location.search);
  if (QA) document.documentElement.classList.add('qa');
  var targets = document.querySelectorAll(
    '.reveal, .catalog-controls, .catalog-meta, .designer, .process ol, .process>div, ' +
    '.faq>div, .contact .wrap, .selection'
  );
  if (!QA && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, (i % 4) * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(targets, function (t) {
      t.classList.add('reveal');
      io.observe(t);
    });
  } else {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('in'); });
  }

  /* ===========================================================
     CATÁLOGO
     Con SLUG vacío se muestra la colección de referencia de la demo.
     Cuando el negocio tenga cuenta en CobrOS, sus productos entran
     por la API y reemplazan por completo a los de referencia.
     =========================================================== */
  var grid = document.getElementById('product-grid');
  var empty = document.getElementById('empty');
  var notice = document.getElementById('catalog-notice');
  var countEl = document.getElementById('result-count');
  var searchInput = document.getElementById('search');
  var filtersBox = document.querySelector('.filters');
  var ALL = [];
  var state = { filter: 'todos', query: '' };

  function fetchCatalog() {
    if (!CFG.SLUG || !CFG.API) return Promise.resolve(null);
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 8000);
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        clearTimeout(t);
        var items = (data && (data.productos || data.items || data)) || [];
        if (!items.length) return null;
        return items.map(function (p, i) {
          return {
            id: String(p.id || p._id || i),
            name: p.nombre || p.name || 'Pieza',
            category: (p.categoria || p.category || 'catalogo').toString().toLowerCase(),
            label: p.categoria || p.category || 'Catálogo',
            image: p.imagen || p.image || 'assets/poster.jpg',
            description: p.descripcion || p.description || '',
            material: p.material || '',
            use: p.uso || p.use || ''
          };
        });
      })
      .catch(function () { clearTimeout(t); return null; });
  }

  function buildFilters() {
    var cats = [];
    ALL.forEach(function (p) {
      if (!cats.some(function (c) { return c.id === p.category; })) {
        cats.push({ id: p.category, label: p.label });
      }
    });
    var html = '<button data-filter="todos" aria-pressed="true">Todo <sup>' +
      pad(ALL.length) + '</sup></button>';
    cats.forEach(function (c) {
      var n = ALL.filter(function (p) { return p.category === c.id; }).length;
      html += '<button data-filter="' + c.id + '" aria-pressed="false">' +
        esc(c.label) + ' <sup>' + pad(n) + '</sup></button>';
    });
    filtersBox.innerHTML = html;
  }

  function stampCounts() {
    Array.prototype.forEach.call(filtersBox.querySelectorAll('button'), function (b) {
      var f = b.getAttribute('data-filter');
      var n = f === 'todos' ? ALL.length : ALL.filter(function (p) { return p.category === f; }).length;
      var sup = b.querySelector('sup');
      if (!sup) {
        sup = document.createElement('sup');
        b.appendChild(document.createTextNode(' '));
        b.appendChild(sup);
      }
      sup.textContent = pad(n);
    });
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function visible() {
    var q = state.query.trim().toLowerCase();
    return ALL.filter(function (p) {
      if (state.filter !== 'todos' && p.category !== state.filter) return false;
      if (!q) return true;
      return (p.name + ' ' + p.description + ' ' + p.label + ' ' + p.material + ' ' + p.use)
        .toLowerCase().indexOf(q) > -1;
    });
  }

  function render() {
    var list = visible();
    grid.innerHTML = list.map(function (p) {
      var on = selection.indexOf(p.id) > -1;
      return '<article class="card" data-id="' + esc(p.id) + '">' +
        '<div class="card-media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' — imagen de referencia" loading="lazy" width="600" height="450">' +
          '<span class="card-tag">' + esc(p.label) + '</span>' +
          '<button class="card-save" aria-pressed="' + (on ? 'true' : 'false') +
            '" aria-label="' + (on ? 'Quitar de tu selección' : 'Guardar en tu selección') + '">' +
            (on ? '✓' : '＋') + '</button>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.description) + '</p>' +
          '<div class="card-foot"><button class="card-open">Ver ficha</button><em>' +
            esc(p.material) + '</em></div>' +
        '</div>' +
      '</article>';
    }).join('');

    empty.hidden = list.length > 0;
    countEl.textContent = list.length === ALL.length
      ? pad(ALL.length) + ' piezas'
      : pad(list.length) + ' de ' + pad(ALL.length);
  }

  function setFilter(f) {
    state.filter = f;
    Array.prototype.forEach.call(filtersBox.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-filter') === f ? 'true' : 'false');
    });
    render();
  }

  filtersBox.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-filter]');
    if (b) setFilter(b.getAttribute('data-filter'));
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    render();
  });

  document.getElementById('clear-filters').addEventListener('click', function () {
    searchInput.value = '';
    state.query = '';
    setFilter('todos');
  });

  /* ---------- selección de referencias ---------- */
  var selection = [];
  try {
    selection = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    if (!Array.isArray(selection)) selection = [];
  } catch (err) { selection = []; }

  var selCount = document.getElementById('selection-count');
  var selLabel = document.getElementById('selection-label');

  function saveSelection() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(selection)); } catch (err) {}
  }

  function syncSelection() {
    selection = selection.filter(function (id) {
      return ALL.some(function (p) { return p.id === id; });
    });
    selCount.textContent = selection.length;
    selLabel.textContent = selection.length
      ? 'Tenés ' + selection.length + (selection.length === 1 ? ' pieza guardada.' : ' piezas guardadas.')
      : 'Guardá las piezas que te inspiran.';
    saveSelection();
  }

  function toggleSaved(id) {
    var i = selection.indexOf(id);
    if (i > -1) selection.splice(i, 1); else selection.push(id);
    syncSelection();
    render();
  }

  /* ---------- ficha de producto ---------- */
  var dlg = document.getElementById('product-dialog');
  var dlgBody = document.getElementById('detail-content');

  function openDetail(id) {
    var p = ALL.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var on = selection.indexOf(p.id) > -1;
    var msg = 'Hola, Metal & Madera. Me interesa la referencia "' + p.name +
      '" del catálogo. ¿Podemos verla a medida?';
    dlgBody.innerHTML = '<div class="detail">' +
      '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' — imagen de referencia">' +
      '<div class="detail-body">' +
        '<p class="eyebrow">' + esc(p.label) + '</p>' +
        '<h2 id="detail-title">' + esc(p.name) + '</h2>' +
        '<p>' + esc(p.description) + '</p>' +
        '<dl class="detail-specs">' +
          (p.material ? '<div><dt>Materiales</dt><dd>' + esc(p.material) + '</dd></div>' : '') +
          (p.use ? '<div><dt>Pensada para</dt><dd>' + esc(p.use) + '</dd></div>' : '') +
          '<div><dt>Medidas y terminación</dt><dd>A definir con vos en la consulta.</dd></div>' +
        '</dl>' +
        '<div class="detail-actions">' +
          '<a class="button dark" href="' + waLink(msg) + '" target="_blank" rel="noopener">Consultar esta pieza <span>↗</span></a>' +
          '<button class="text-link" data-save="' + esc(p.id) + '">' +
            (on ? 'Quitar de la selección' : 'Guardar en mi selección') + ' <span>→</span></button>' +
        '</div>' +
        '<small>Imagen de referencia. Cada pieza se fabrica a medida y se cotiza por consulta.</small>' +
      '</div>' +
    '</div>';
    dlg.showModal();
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    var id = card.getAttribute('data-id');
    if (e.target.closest('.card-save')) { toggleSaved(id); return; }
    openDetail(id);
  });

  dlgBody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-save]');
    if (!b) return;
    var id = b.getAttribute('data-save');
    toggleSaved(id);
    b.firstChild.nodeValue = selection.indexOf(id) > -1
      ? 'Quitar de la selección ' : 'Guardar en mi selección ';
  });

  /* ---------- diálogo de selección ---------- */
  var selDlg = document.getElementById('selection-dialog');
  var selItems = document.getElementById('selected-items');
  var selWa = document.getElementById('selection-wa');

  function renderSelection() {
    if (!selection.length) {
      selItems.innerHTML = '<p class="selection-empty">Todavía no guardaste ninguna pieza. ' +
        'Tocá el ＋ de las que te gusten y armá tu lista de referencias.</p>';
      selWa.href = waLink('Hola, Metal & Madera. Quiero consultar por un proyecto a medida.');
      return;
    }
    selItems.innerHTML = selection.map(function (id) {
      var p = ALL.filter(function (x) { return x.id === id; })[0];
      if (!p) return '';
      return '<article><img src="' + esc(p.image) + '" alt="" loading="lazy">' +
        '<div><strong>' + esc(p.name) + '</strong><p>' + esc(p.label) +
        (p.material ? ' · ' + esc(p.material) : '') + '</p></div>' +
        '<button data-remove="' + esc(p.id) + '" aria-label="Quitar ' + esc(p.name) + '">✕</button></article>';
    }).join('');

    var lines = selection.map(function (id, i) {
      var p = ALL.filter(function (x) { return x.id === id; })[0];
      return p ? (i + 1) + '. ' + p.name + ' (' + p.label + ')' : '';
    }).filter(Boolean).join('\n');
    selWa.href = waLink('Hola, Metal & Madera. Estas son las referencias que me gustaron:\n\n' +
      lines + '\n\nMe gustaría consultar medidas y presupuesto.');
  }

  selItems.addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b) return;
    toggleSaved(b.getAttribute('data-remove'));
    renderSelection();
  });

  document.getElementById('review-selection').addEventListener('click', function () {
    renderSelection();
    selDlg.showModal();
  });

  Array.prototype.forEach.call(document.querySelectorAll('.dialog-close'), function (b) {
    b.addEventListener('click', function () { b.closest('dialog').close(); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('dialog'), function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  /* ---------- arranque del catálogo ---------- */
  fetchCatalog().then(function (remote) {
    if (remote && remote.length) {
      ALL = remote;
      buildFilters();
      notice.textContent = 'Catálogo del taller. Consultá la pieza que te interese por WhatsApp.';
    } else {
      ALL = window.DEMO_PRODUCTS || [];
      stampCounts();
      if (CFG.SLUG) {
        notice.textContent = 'Estamos cargando el catálogo del taller. Mientras tanto, ' +
          'mirá estas referencias y escribinos por WhatsApp.';
      }
    }
    syncSelection();
    render();
  });

  /* ===========================================================
     BANCO DE DISEÑO — mesa paramétrica en axonometría
     Vista conceptual, no es un plano técnico.
     =========================================================== */
  var svg = document.getElementById('table-drawing');
  var form = document.getElementById('design-form');
  var explodeBtn = document.getElementById('explode');
  var sizeOut = document.getElementById('drawing-size');
  var designWa = document.getElementById('design-wa');
  var exploded = false;

  var WOOD = {
    Natural: { top: '#C79A62', edge: '#A87C48', side: '#8E6738' },
    Nogal:   { top: '#8A5A34', edge: '#6F4526', side: '#5A371E' },
    Oscuro:  { top: '#4A382B', edge: '#382A20', side: '#2C2119' }
  };
  var METAL = { 'Negro mate': '#3A403D', 'Blanco': '#E4E1D9', 'Acero': '#AEBCC2' };

  // ejes de la axonometría (ancho hacia la derecha-arriba, profundidad hacia la derecha-abajo)
  var UX = { x: 0.95, y: -0.24 };
  var VX = { x: 0.60, y: 0.40 };

  function cfg() {
    return {
      w: +document.getElementById('width').value,
      d: +document.getElementById('depth').value,
      h: +document.getElementById('height').value,
      wood: (form.querySelector('input[name=wood]:checked') || {}).value || 'Natural',
      metal: document.getElementById('metal').value
    };
  }

  function drawTable() {
    var c = cfg();
    var K = 1.8;                    // cm → px (calibrado para que el máximo llene el lienzo)
    var W = c.w * K, D = c.d * K * 0.8, H = c.h * K * 0.95;
    var T = 9;                      // espesor de la tapa
    var gapTop = exploded ? -70 : 0; // despiece: la tapa sube
    var legOut = exploded ? 16 : 0;  // y las patas se abren

    function P(a, b, z) {
      return { x: a * UX.x + b * VX.x, y: a * UX.y + b * VX.y + z };
    }
    // esquinas de la tapa (cara superior)
    var t0 = P(0, 0, gapTop), t1 = P(W, 0, gapTop), t2 = P(W, D, gapTop), t3 = P(0, D, gapTop);
    var pts = [t0, t1, t2, t3];
    var legs = [
      { top: P(14, 12, gapTop + T), dx: -legOut, dy: -legOut },
      { top: P(W - 14, 12, gapTop + T), dx: legOut, dy: -legOut },
      { top: P(W - 14, D - 12, gapTop + T), dx: legOut, dy: legOut },
      { top: P(14, D - 12, gapTop + T), dx: -legOut, dy: legOut }
    ];
    legs.forEach(function (l) {
      l.top = { x: l.top.x + l.dx, y: l.top.y + l.dy };
      l.bot = { x: l.top.x, y: l.top.y + H };
    });

    var all = pts.concat(legs.map(function (l) { return l.bot; }));
    var minX = Math.min.apply(null, all.map(function (p) { return p.x; })) - 92;
    var maxX = Math.max.apply(null, all.map(function (p) { return p.x; })) + 82;
    var minY = Math.min.apply(null, all.map(function (p) { return p.y; })) - 54;
    var maxY = Math.max.apply(null, all.map(function (p) { return p.y; })) + 62;
    var scale = Math.min(700 / (maxX - minX), 480 / (maxY - minY), 1);
    var offX = (700 - (maxX - minX) * scale) / 2 - minX * scale;
    var offY = (480 - (maxY - minY) * scale) / 2 - minY * scale;

    var wood = WOOD[c.wood] || WOOD.Natural;
    var metal = METAL[c.metal] || METAL['Negro mate'];

    function poly(list, fill, stroke) {
      return '<polygon points="' + list.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') +
        '" fill="' + fill + '" stroke="' + (stroke || 'rgba(21,24,23,.55)') + '" stroke-width="1"/>';
    }
    function line(a, b, stroke, w, dash) {
      return '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) +
        '" y2="' + b.y.toFixed(1) + '" stroke="' + stroke + '" stroke-width="' + w +
        '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>';
    }
    function txt(p, s, anchor, size) {
      return '<text x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" fill="#9BB8C5" ' +
        'font-family="Teko, sans-serif" font-size="' + (size || 20) + '" letter-spacing="1.5" ' +
        'text-anchor="' + (anchor || 'middle') + '">' + s + '</text>';
    }
    function down(p, n) { return { x: p.x, y: p.y + n }; }

    var g = '';

    // sombra en el piso
    var floorY = Math.max.apply(null, legs.map(function (l) { return l.bot.y; }));
    g += '<ellipse cx="' + ((t0.x + t2.x) / 2).toFixed(1) + '" cy="' + (floorY + 6).toFixed(1) +
      '" rx="' + (W * 0.55).toFixed(1) + '" ry="14" fill="rgba(0,0,0,.28)"/>';

    // patas traseras primero
    g += line(legs[0].top, legs[0].bot, metal, 7);
    g += line(legs[1].top, legs[1].bot, metal, 7);
    // travesaños
    var braceY = 0.72;
    function at(l, k) { return { x: l.top.x, y: l.top.y + H * k }; }
    g += line(at(legs[0], braceY), at(legs[3], braceY), metal, 4.5);
    g += line(at(legs[1], braceY), at(legs[2], braceY), metal, 4.5);
    g += line(at(legs[3], braceY), at(legs[2], braceY), metal, 4.5);

    // líneas de despiece
    if (exploded) {
      legs.forEach(function (l) {
        g += line({ x: l.top.x, y: l.top.y - 26 }, l.top, 'rgba(155,184,197,.5)', 1, '4 5');
      });
    }

    // tapa: canto frontal, canto lateral y cara superior
    g += poly([t3, t2, down(t2, T), down(t3, T)], wood.edge);
    g += poly([t2, t1, down(t1, T), down(t2, T)], wood.side);
    g += poly([t0, t1, t2, t3], wood.top);
    g += '<line x1="' + t0.x.toFixed(1) + '" y1="' + t0.y.toFixed(1) + '" x2="' + t2.x.toFixed(1) +
      '" y2="' + t2.y.toFixed(1) + '" stroke="rgba(0,0,0,.14)" stroke-width="1"/>';

    // patas delanteras
    g += line(legs[3].top, legs[3].bot, metal, 7);
    g += line(legs[2].top, legs[2].bot, metal, 7);

    // cotas
    var dimY = floorY + 34;
    var a = { x: t3.x - 6, y: dimY }, b = { x: legs[2].bot.x + 20, y: dimY };
    g += line(a, b, '#9BB8C5', 1);
    g += line({ x: a.x, y: a.y - 6 }, { x: a.x, y: a.y + 6 }, '#9BB8C5', 1);
    g += line({ x: b.x, y: b.y - 6 }, { x: b.x, y: b.y + 6 }, '#9BB8C5', 1);
    g += '<rect x="' + ((a.x + b.x) / 2 - 34).toFixed(1) + '" y="' + (dimY - 13).toFixed(1) +
      '" width="68" height="22" fill="#1B1E1D"/>';
    g += txt({ x: (a.x + b.x) / 2, y: dimY + 5 }, c.w + ' CM');

    var dimX = Math.max.apply(null, all.map(function (p) { return p.x; })) + 44;
    var hTop = { x: dimX, y: legs[1].top.y }, hBot = { x: dimX, y: legs[1].bot.y };
    g += line(hTop, hBot, '#9BB8C5', 1);
    g += line({ x: dimX - 6, y: hTop.y }, { x: dimX + 6, y: hTop.y }, '#9BB8C5', 1);
    g += line({ x: dimX - 6, y: hBot.y }, { x: dimX + 6, y: hBot.y }, '#9BB8C5', 1);
    g += '<rect x="' + (dimX - 21).toFixed(1) + '" y="' + ((hTop.y + hBot.y) / 2 - 24).toFixed(1) +
      '" width="42" height="48" fill="#1B1E1D"/>';
    g += txt({ x: dimX, y: (hTop.y + hBot.y) / 2 - 4 }, c.h, 'middle', 22);
    g += txt({ x: dimX, y: (hTop.y + hBot.y) / 2 + 14 }, 'CM', 'middle', 15);

    var dTop = { x: t0.x - 30, y: t0.y + 6 }, dBot = { x: t3.x - 30, y: t3.y + 6 };
    g += line(dTop, dBot, '#9BB8C5', 1);
    g += line({ x: dTop.x - 5, y: dTop.y - 3 }, { x: dTop.x + 5, y: dTop.y + 3 }, '#9BB8C5', 1);
    g += line({ x: dBot.x - 5, y: dBot.y - 3 }, { x: dBot.x + 5, y: dBot.y + 3 }, '#9BB8C5', 1);
    g += txt({ x: (dTop.x + dBot.x) / 2 - 10, y: (dTop.y + dBot.y) / 2 + 6 }, c.d + ' CM', 'end', 18);

    // etiquetas de material
    g += txt({ x: t1.x + 4, y: t1.y - 16 }, c.wood.toUpperCase(), 'end', 18);
    g += txt({ x: legs[3].bot.x - 16, y: legs[3].bot.y - 10 }, c.metal.toUpperCase(), 'end', 16);

    svg.innerHTML = '<g transform="translate(' + offX.toFixed(1) + ',' + offY.toFixed(1) +
      ') scale(' + scale.toFixed(3) + ')">' + g + '</g>';
  }

  function updateDesign() {
    var c = cfg();
    document.getElementById('width-value').textContent = c.w + ' cm';
    document.getElementById('depth-value').textContent = c.d + ' cm';
    document.getElementById('height-value').textContent = c.h + ' cm';
    sizeOut.textContent = c.w + ' × ' + c.d + ' × ' + c.h + ' CM';
    Array.prototype.forEach.call(form.querySelectorAll('.swatches label'), function (l) {
      l.classList.toggle('on', l.querySelector('input').checked);
    });
    designWa.href = waLink(
      'Hola, Metal & Madera. Armé una mesa en el banco de diseño de la web:\n\n' +
      '• Medidas: ' + c.w + ' × ' + c.d + ' × ' + c.h + ' cm\n' +
      '• Madera: ' + c.wood + '\n' +
      '• Metal: ' + c.metal + '\n\n' +
      '¿Me pasan presupuesto y plazo?'
    );
    drawTable();
  }

  form.addEventListener('input', updateDesign);
  form.addEventListener('change', updateDesign);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  explodeBtn.addEventListener('click', function () {
    exploded = !exploded;
    explodeBtn.setAttribute('aria-pressed', exploded ? 'true' : 'false');
    explodeBtn.textContent = exploded ? 'Ver armada ✕' : 'Ver despiece ＋';
    drawTable();
  });

  updateDesign();
})();
