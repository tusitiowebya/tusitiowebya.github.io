/* ══════════════════════════════════════════════════════════
   FERREPEHUA — landing + catálogo
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CFG = window.NEGOCIO || {};
  var WA = CFG.WA || '5492396616927';

  /* ── Catálogo destacado (fallback / demo) ───────────────── */
  var CATALOGO = [
    { id:'ID8008',      cat:'electricas',   catNom:'Eléctricas',    marca:'INGCO',  nombre:'Taladro percutor 13mm 800W',                 specs:['800W','13mm','Reversible'],           precio:30500,  img:'img/p-taladro-percutor.jpg',    dest:true },
    { id:'AG11508-5',   cat:'electricas',   catNom:'Eléctricas',    marca:'INGCO',  nombre:'Amoladora angular 115mm 800W',               specs:['800W','115mm','11.000 rpm'],          precio:38900,  img:'img/p-amoladora.jpg' },
    { id:'RH12008',     cat:'electricas',   catNom:'Eléctricas',    marca:'INGCO',  nombre:'Rotomartillo SDS Plus 1050W 3.5J',           specs:['1050W','3.5J','SDS Plus'],            precio:94500,  img:'img/p-rotomartillo.jpg' },
    { id:'HGL12003',    cat:'electricas',   catNom:'Eléctricas',    marca:'INGCO',  nombre:'Pistola de calor 1800W industrial',          specs:['1800W','2 temperaturas','4 boquillas'], precio:26900, img:'img/p-pistola-calor.jpg' },
    { id:'CDLI205581',  cat:'inalambricas', catNom:'Inalámbricas',  marca:'INGCO',  nombre:'Taladro inalámbrico compacto 20V 55Nm',      specs:['20V','55 Nm','Brushless'],            precio:84500,  img:'img/p-taladro-inalambrico.jpg', dest:true },
    { id:'CIWLI205581', cat:'inalambricas', catNom:'Inalámbricas',  marca:'INGCO',  nombre:'Llave de impacto inalámbrica 20V 300Nm',     specs:['20V','300 Nm','Brushless'],           precio:106900, img:'img/p-llave-impacto.jpg' },
    { id:'CSLI1401',    cat:'inalambricas', catNom:'Inalámbricas',  marca:'INGCO',  nombre:'Sierra circular inalámbrica 20V 140mm',      specs:['20V','140mm','4.500 rpm'],            precio:78900,  img:'img/p-sierra-circular.jpg' },
    { id:'THT102256',   cat:'manuales',     catNom:'Manuales',      marca:'TOTAL',  nombre:'Juego de llaves combinadas 8–22mm · 12 pzas',specs:['12 piezas','8–22mm','Cr-V'],          precio:34900,  img:'img/p-llaves-combinadas.jpg' },
    { id:'THT73166',    cat:'manuales',     catNom:'Manuales',      marca:'TOTAL',  nombre:'Martillo de uña 16oz mango de fibra',        specs:['16 oz','Fibra','Antideslizante'],     precio:8400,   img:'img/p-martillo.jpg' },
    { id:'WSS1K06',     cat:'manuales',     catNom:'Manuales',      marca:'WADFOW', nombre:'Juego de destornilladores 6 piezas',         specs:['6 piezas','Cr-V','Imantados'],        precio:12700,  img:'img/p-destornilladores.jpg' },
    { id:'HSMT08519',   cat:'medicion',     catNom:'Medición',      marca:'INGCO',  nombre:'Cinta métrica 5m x 19mm magnética',          specs:['5 m','19 mm','Punta magnética'],      precio:2850,   img:'img/p-cinta-metrica.jpg', dest:true },
    { id:'ELLR2001',    cat:'medicion',     catNom:'Medición',      marca:'EMTOP',  nombre:'Nivel láser autonivelante verde 2 líneas',   specs:['Láser verde','2 líneas','±0,3 mm/m'], precio:79900,  img:'img/p-nivel-laser.jpg' },
    { id:'AKD11901',    cat:'accesorios',   catNom:'Accesorios',    marca:'INGCO',  nombre:'Set de mechas HSS 19 piezas 1–10mm',         specs:['19 piezas','HSS','1–10 mm'],          precio:9900,   img:'img/p-mechas.jpg' },
    { id:'TAC2201151',  cat:'accesorios',   catNom:'Accesorios',    marca:'TOTAL',  nombre:'Discos de corte 115mm · pack x10',           specs:['115 mm','Pack x10','Metal'],          precio:6200,   img:'img/p-discos-corte.jpg' },
    { id:'WLDA1207',    cat:'construccion', catNom:'Construcción',  marca:'WADFOW', nombre:'Escalera de aluminio 7 escalones reforzada', specs:['7 escalones','Aluminio','150 kg'],    precio:89900,  img:'img/p-escalera.jpg' },
    { id:'TGT51012',    cat:'jardineria',   catNom:'Jardinería',    marca:'TOTAL',  nombre:'Bordeadora eléctrica 1000W 300mm',           specs:['1000W','300 mm','Hilo de nylon'],     precio:52900,  img:'img/p-jardineria.jpg' },
    { id:'EFLL3001',    cat:'iluminacion',  catNom:'Iluminación',   marca:'EMTOP',  nombre:'Reflector LED recargable 30W con trípode',   specs:['30W','Recargable','IP65'],            precio:24900,  img:'img/p-reflector.jpg' },
    { id:'HSKSPK01',    cat:'seguridad',    catNom:'Seguridad',     marca:'INGCO',  nombre:'Kit de seguridad: casco, guantes y antiparras', specs:['Casco','Guantes','Antiparras'],     precio:18500,  img:'img/p-seguridad.jpg' }
  ];

  var CAT_NOMBRES = {
    electricas:'Herramientas eléctricas', inalambricas:'Herramientas inalámbricas',
    manuales:'Herramientas manuales', accesorios:'Accesorios y consumibles',
    construccion:'Construcción', medicion:'Medición y nivelación',
    jardineria:'Jardinería', iluminacion:'Iluminación',
    seguridad:'Seguridad y protección', organizacion:'Organización'
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toLocaleString('es-AR'); };

  /* ══ Catálogo en vivo desde CobrOS (opcional) ══════════════ */
  function cargarCobrOS() {
    if (!CFG.SLUG) return Promise.resolve(null);
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, CFG.TIMEOUT_MS || 8000);
    return fetch(CFG.API + '/catalogo/' + CFG.SLUG, { signal: ctrl.signal })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(t);
        if (!d || !d.productos || !d.productos.length) return null;
        return d.productos.map(function (p) {
          var slug = (p.categoria || '').toLowerCase();
          return {
            id: p._id || p.codigo || '', cat: slug, catNom: p.categoria || 'General',
            marca: (p.marca || '').toUpperCase(), nombre: p.nombre,
            specs: [], precio: p.precio || 0, img: p.foto || 'img/p-mechas.jpg'
          };
        });
      })
      .catch(function () { clearTimeout(t); return null; });
  }

  /* ══ Estado ════════════════════════════════════════════════ */
  var estado = { cat: 'all', marca: 'all', q: '' };
  var carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('fp_cart') || '{}'); } catch (e) { carrito = {}; }

  var grid = $('#grid'), catCount = $('#catCount'), catEmpty = $('#catEmpty');

  function filtrar() {
    var q = estado.q.trim().toLowerCase();
    return CATALOGO.filter(function (p) {
      if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
      if (estado.marca !== 'all' && p.marca !== estado.marca) return false;
      if (q && (p.nombre + ' ' + p.id + ' ' + p.marca + ' ' + p.catNom).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  function tarjeta(p) {
    var enCarrito = carrito[p.id];
    return '' +
      '<article class="card' + (p.dest ? ' is-dest' : '') + '" data-id="' + p.id + '">' +
        '<div class="card-img">' +
          '<img src="' + p.img + '" alt="' + p.nombre + '" loading="lazy" width="760" height="570">' +
          (p.dest ? '<span class="card-flag">Más vendido</span>' : '') +
          '<span class="card-brand">' + p.marca + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<code class="card-sku">' + p.id + '</code>' +
          '<h3>' + p.nombre + '</h3>' +
          '<div class="card-specs">' + p.specs.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div>' +
          '<div class="card-foot">' +
            '<div class="card-price"><b>' + money(p.precio) + '</b><small>Precio final en ARS</small></div>' +
            '<span class="card-stock"><i></i>Disponible</span>' +
          '</div>' +
          '<button class="card-add' + (enCarrito ? ' is-in' : '') + '" data-add="' + p.id + '">' +
            (enCarrito ? 'En el pedido · ' + enCarrito + '' : 'Agregar al pedido') +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var lista = filtrar();
    grid.innerHTML = lista.map(tarjeta).join('');
    $$('.card', grid).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 45 + 'ms';
      requestAnimationFrame(function () { el.classList.add('in'); });
    });

    var nombreCat = estado.cat === 'all' ? 'el catálogo destacado' : CAT_NOMBRES[estado.cat];
    catCount.innerHTML = lista.length
      ? '<b>' + lista.length + '</b> ' + (lista.length === 1 ? 'producto' : 'productos') + ' en ' + nombreCat
      : '';

    if (!lista.length) {
      catEmpty.hidden = false;
      catEmpty.innerHTML =
        '<h3>No hay productos destacados de ' + (CAT_NOMBRES[estado.cat] || 'esa búsqueda').toLowerCase() + ' en la web.</h3>' +
        '<p>En el depósito sí los tenemos cargados. Escribinos y te pasamos precio y stock al toque.</p>' +
        '<a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/' + WA +
        '?text=' + encodeURIComponent('Hola Ferrepehua, busco productos de ' + (CAT_NOMBRES[estado.cat] || estado.q)) + '">Consultar por WhatsApp</a>';
    } else {
      catEmpty.hidden = true;
    }
  }

  /* ══ Filtros ═══════════════════════════════════════════════ */
  $$('#catChips .chip').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#catChips .chip').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      estado.cat = b.dataset.cat;
      render();
    });
  });
  $$('#brandChips .chip').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#brandChips .chip').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      estado.marca = b.dataset.brand;
      render();
    });
  });

  var q = $('#q'), qClear = $('#qClear');
  q.addEventListener('input', function () {
    estado.q = q.value;
    qClear.hidden = !q.value;
    render();
  });
  qClear.addEventListener('click', function () {
    q.value = ''; estado.q = ''; qClear.hidden = true; render(); q.focus();
  });

  function irACatalogo(cat) {
    if (cat) {
      var chip = $('#catChips .chip[data-cat="' + cat + '"]');
      if (chip) chip.click();
      else { estado.cat = cat; render(); }
    }
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('#navSearch').addEventListener('click', function () {
    irACatalogo(null);
    setTimeout(function () { q.focus({ preventScroll: true }); }, 650);
  });

  /* ══ Índice de rubros con preview ══════════════════════════ */
  var preview = $('#rubroPreview'), previewImg = $('img', preview);
  $$('#rubroList li').forEach(function (li) {
    li.addEventListener('click', function () { irACatalogo(li.dataset.cat); });
    li.addEventListener('mouseenter', function () {
      previewImg.src = li.dataset.img;
      preview.classList.add('on');
    });
    li.addEventListener('mouseleave', function () { preview.classList.remove('on'); });
  });
  var rubrosSec = $('.rubros');
  if (rubrosSec) {
    rubrosSec.addEventListener('mousemove', function (e) {
      var r = rubrosSec.getBoundingClientRect();
      preview.style.transform = 'translate(' + (e.clientX - r.left + 26) + 'px,' + (e.clientY - r.top - 130) + 'px)';
    });
  }

  /* ══ Carrito ═══════════════════════════════════════════════ */
  var cart = $('#cart'), cartBackdrop = $('#cartBackdrop'), cartBody = $('#cartBody');

  function guardar() { try { localStorage.setItem('fp_cart', JSON.stringify(carrito)); } catch (e) {} }

  function totalItems() {
    return Object.keys(carrito).reduce(function (a, k) { return a + carrito[k]; }, 0);
  }
  function totalPesos() {
    return Object.keys(carrito).reduce(function (a, k) {
      var p = CATALOGO.filter(function (x) { return x.id === k; })[0];
      return a + (p ? p.precio * carrito[k] : 0);
    }, 0);
  }

  function pintarCarrito() {
    var keys = Object.keys(carrito);
    $('#cartCount').textContent = totalItems();
    $('#navCart').classList.toggle('has', keys.length > 0);
    $('#cartTotal').textContent = money(totalPesos());

    if (!keys.length) {
      cartBody.innerHTML = '<div class="cart-empty"><p>Todavía no agregaste nada.</p><span>Sumá productos del catálogo y armamos el pedido acá.</span></div>';
      $('#cartSend').classList.add('is-off');
      return;
    }
    $('#cartSend').classList.remove('is-off');
    cartBody.innerHTML = keys.map(function (k) {
      var p = CATALOGO.filter(function (x) { return x.id === k; })[0];
      if (!p) return '';
      return '<div class="cart-item">' +
        '<img src="' + p.img + '" alt="" width="80" height="60" loading="lazy">' +
        '<div class="ci-txt"><code>' + p.id + '</code><h4>' + p.nombre + '</h4>' +
        '<b>' + money(p.precio * carrito[k]) + '</b></div>' +
        '<div class="ci-qty"><button data-minus="' + k + '" aria-label="Quitar uno">−</button>' +
        '<span>' + carrito[k] + '</span>' +
        '<button data-plus="' + k + '" aria-label="Agregar uno">+</button></div>' +
        '</div>';
    }).join('');

    var lineas = keys.map(function (k) {
      var p = CATALOGO.filter(function (x) { return x.id === k; })[0];
      return '• ' + carrito[k] + 'x ' + p.nombre + ' (' + p.id + ') — ' + money(p.precio * carrito[k]);
    }).join('\n');
    var texto = (CFG.WA_TEXTO || 'Hola, quiero hacer un pedido:') + '\n\n' + lineas +
      '\n\nTotal estimado: ' + money(totalPesos()) + '\n\n¿Me confirmás stock y forma de envío?';
    $('#cartSend').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(texto);
  }

  function abrirCarrito(open) {
    cart.classList.toggle('open', open);
    cart.setAttribute('aria-hidden', open ? 'false' : 'true');
    cartBackdrop.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var id = add.dataset.add;
      carrito[id] = (carrito[id] || 0) + 1;
      guardar(); pintarCarrito(); render();
      add = $('[data-add="' + id + '"]');
      if (add) { add.classList.add('pop'); setTimeout(function () { add.classList.remove('pop'); }, 320); }
      $('#navCart').classList.add('bump');
      setTimeout(function () { $('#navCart').classList.remove('bump'); }, 400);
      return;
    }
    var plus = e.target.closest('[data-plus]');
    if (plus) { carrito[plus.dataset.plus]++; guardar(); pintarCarrito(); render(); return; }
    var minus = e.target.closest('[data-minus]');
    if (minus) {
      var k = minus.dataset.minus;
      carrito[k]--; if (carrito[k] <= 0) delete carrito[k];
      guardar(); pintarCarrito(); render(); return;
    }
  });

  $('#navCart').addEventListener('click', function () { abrirCarrito(true); });
  $('#cartClose').addEventListener('click', function () { abrirCarrito(false); });
  cartBackdrop.addEventListener('click', function () { abrirCarrito(false); });
  $('#cartSend').addEventListener('click', function (e) {
    if (this.classList.contains('is-off')) e.preventDefault();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrirCarrito(false); });

  /* ══ Nav / scroll ══════════════════════════════════════════ */
  var nav = $('#nav'), waFloat = $('#waFloat'), tapeFill = $('#tapeFill');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('solid', y > 40);
    waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    tapeFill.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#burger').addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ══ Reveal ════════════════════════════════════════════════ */
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

  /* ══ Init ══════════════════════════════════════════════════ */
  $('#year').textContent = new Date().getFullYear();
  pintarCarrito();
  render();

  cargarCobrOS().then(function (prods) {
    if (prods && prods.length) { CATALOGO = prods; render(); pintarCarrito(); }
  });
})();
