/* Mini Fletes Mario — interacción de la demo */
(function () {
  'use strict';

  var WA_NUMERO = '5491136052688';
  var raiz = document.documentElement;
  raiz.classList.add('js');

  var params = new URLSearchParams(window.location.search);
  var QA = params.has('qa');
  if (QA) raiz.classList.add('qa');
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function linkWA(texto) {
    return 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(texto);
  }

  /* ---------- Mensajes de WhatsApp por lugar ---------- */
  var MENSAJES = {
    nav: 'Hola Mario! Te escribo desde tu página. Quiero consultar por un mini flete.',
    hero: 'Hola Mario! Quiero pedir precio para un mini flete. Te cuento qué hay que llevar y de dónde a dónde:',
    calco: 'Hola Mario! Vi tu número en la página. Necesito un mini flete.',
    marketplace: 'Hola Mario! Compré algo por Marketplace y necesito que lo retires y me lo traigas. Te paso el link de la publicación, dónde se retira y adónde va:',
    muebles: 'Hola Mario! Necesito un mini flete para un mueble. Te cuento qué es y de dónde a dónde:',
    electro: 'Hola Mario! Necesito llevar un electrodoméstico grande. Te cuento cuál es, de dónde a dónde y si hay escaleras:',
    mudanza: 'Hola Mario! Tengo una mudanza chica. Te cuento cuántas cosas son y de dónde a dónde:',
    como: 'Hola Mario! Quiero pedir un mini flete. Te paso qué hay que llevar, de dónde a dónde y para cuándo:',
    cierre: 'Hola Mario! Quiero pedir precio para un mini flete.',
    pie: 'Hola Mario! Te escribo desde tu página.',
    flotante: 'Hola Mario! Quiero consultar por un mini flete.'
  };

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var clave = a.getAttribute('data-wa');
    a.href = linkWA(MENSAJES[clave] || MENSAJES.nav);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Navegación ---------- */
  var nav = document.getElementById('nav');
  var toggle = nav.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');

  function cerrarMenu() {
    nav.classList.remove('nav--abierta');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var abierta = nav.classList.toggle('nav--abierta');
    toggle.setAttribute('aria-expanded', abierta ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });

  var flotante = document.getElementById('flotante');
  var dockVisible = false;
  function alScroll() {
    var y = window.scrollY;
    nav.classList.toggle('nav--pegada', y > 24);
    var pasoHero = y > window.innerHeight * 0.6;
    flotante.classList.toggle('flotante--visible', pasoHero && !dockVisible);
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  /* ---------- Hero: se abren las puertas del flete ---------- */
  var caja = document.getElementById('caja');
  var video = document.getElementById('heroVideo');
  var abierta = false;
  function abrirPuertas() {
    if (abierta) return;
    abierta = true;
    caja.classList.add('caja--abierta');
  }
  if (QA || sinMovimiento) {
    abrirPuertas();
  } else {
    var respaldo = setTimeout(abrirPuertas, 1300);
    video.addEventListener('playing', function () {
      clearTimeout(respaldo);
      setTimeout(abrirPuertas, 380);
    }, { once: true });
  }
  var intento = video.play();
  if (intento && intento.catch) intento.catch(function () { abrirPuertas(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.05 }).observe(caja);
  }

  /* ---------- Armador de viaje ---------- */
  var COSAS = [
    { id: 'heladera', nombre: 'Heladera', uno: 'heladera', varios: 'heladeras' },
    { id: 'lavarropas', nombre: 'Lavarropas', uno: 'lavarropas', varios: 'lavarropas' },
    { id: 'cocina', nombre: 'Cocina', uno: 'cocina', varios: 'cocinas' },
    { id: 'sillon', nombre: 'Sillón', uno: 'sillón', varios: 'sillones' },
    { id: 'colchon', nombre: 'Colchón', uno: 'colchón', varios: 'colchones' },
    { id: 'cama', nombre: 'Cama o sommier', uno: 'cama o sommier', varios: 'camas o sommiers' },
    { id: 'ropero', nombre: 'Ropero o placard', uno: 'ropero o placard', varios: 'roperos o placards' },
    { id: 'mesa', nombre: 'Mesa', uno: 'mesa', varios: 'mesas' },
    { id: 'silla', nombre: 'Silla', uno: 'silla', varios: 'sillas' },
    { id: 'cajas', nombre: 'Cajas o bolsos', uno: 'caja o bolso', varios: 'cajas o bolsos' },
    { id: 'tele', nombre: 'Tele', uno: 'tele', varios: 'teles' },
    { id: 'bici', nombre: 'Bici', uno: 'bici', varios: 'bicis' }
  ];
  var TIPOS = {
    mueble: 'Un mueble o electrodoméstico',
    marketplace: 'Retiro de una compra (Marketplace u otra)',
    mudanza: 'Mudanza chica',
    otro: 'Otra cosa'
  };
  var TIPOS_CARTEL = {
    mueble: 'Mueble o electrodoméstico',
    marketplace: 'Retiro de una compra',
    mudanza: 'Mudanza chica',
    otro: 'Otra cosa'
  };
  var ESCALERAS = {
    no: 'No',
    retiro: 'Sí, donde se retira',
    entrega: 'Sí, donde se entrega',
    ambos: 'En los dos lados'
  };
  var MAX_POR_COSA = 30;

  var form = document.getElementById('armador');
  var cosasEl = document.getElementById('cosas');
  var cantidades = {};
  var porId = {};

  function svgUso(id) {
    return '<svg aria-hidden="true"><use href="img/iconos.svg#i-' + id + '"></use></svg>';
  }

  COSAS.forEach(function (c) {
    porId[c.id] = c;
    cantidades[c.id] = 0;
    var div = document.createElement('div');
    div.className = 'cosa';
    div.dataset.id = c.id;
    div.innerHTML =
      '<button type="button" class="cosa__mas" aria-label="Sumar ' + c.uno + '">' +
        svgUso(c.id) + '<span class="cosa__nombre">' + c.nombre + '</span>' +
      '</button>' +
      '<span class="cosa__n" aria-hidden="true">0</span>' +
      '<button type="button" class="cosa__menos" aria-label="Sacar ' + c.uno + '" hidden>−</button>';
    cosasEl.appendChild(div);
  });

  cosasEl.addEventListener('click', function (e) {
    var boton = e.target.closest('button');
    if (!boton) return;
    var tarjeta = boton.closest('.cosa');
    var id = tarjeta.dataset.id;
    if (boton.classList.contains('cosa__mas')) {
      cantidades[id] = Math.min(MAX_POR_COSA, cantidades[id] + 1);
    } else {
      cantidades[id] = Math.max(0, cantidades[id] - 1);
    }
    tarjeta.classList.remove('cosa--pop');
    void tarjeta.offsetWidth;
    tarjeta.classList.add('cosa--pop');
    actualizar();
    if (!cantidades[id] && boton.classList.contains('cosa__menos')) {
      tarjeta.querySelector('.cosa__mas').focus();
    }
  });

  function valorRadio(nombre) {
    var r = form.querySelector('input[name="' + nombre + '"]:checked');
    return r ? r.value : '';
  }
  function limpio(id) {
    return document.getElementById(id).value.replace(/\s+/g, ' ').trim();
  }
  function fechaLinda(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[d.getDay()] + ' ' + Number(p[2]) + '/' + Number(p[1]);
  }

  function leerEstado() {
    var lista = [];
    COSAS.forEach(function (c) {
      var n = cantidades[c.id];
      if (n > 0) lista.push({ id: c.id, n: n, texto: n === 1 ? c.uno : c.varios });
    });
    var escaleras = valorRadio('escaleras');
    var cuando = valorRadio('cuando');
    return {
      tipo: valorRadio('tipo'),
      lista: lista,
      otraCosa: limpio('otraCosa'),
      link: limpio('link'),
      desde: limpio('desde'),
      hasta: limpio('hasta'),
      escaleras: escaleras,
      piso: limpio('piso'),
      cuando: cuando,
      fecha: document.getElementById('fecha').value,
      nombre: limpio('nombre'),
      nota: limpio('nota')
    };
  }

  function textoEscaleras(s) {
    var t = ESCALERAS[s.escaleras] || 'No';
    if (s.escaleras !== 'no' && s.piso) t += ' (' + s.piso + ')';
    return t;
  }
  function textoCuando(s) {
    if (s.cuando === 'fecha') return s.fecha ? 'El ' + fechaLinda(s.fecha) : 'Tengo una fecha, te la paso';
    return s.cuando || 'A coordinar';
  }
  function textoCarga(s) {
    var partes = s.lista.map(function (x) { return x.n + ' ' + x.texto; });
    if (s.otraCosa) partes.push(s.otraCosa);
    return partes.join(', ');
  }

  function armarMensaje(s) {
    var l = ['Hola Mario! Te escribo desde tu página. Quiero pedir precio para un mini flete.', ''];
    l.push('*Tipo de viaje:* ' + TIPOS[s.tipo]);
    var carga = textoCarga(s);
    l.push('*Hay que llevar:* ' + (carga || 'te cuento por acá'));
    if (s.tipo === 'marketplace' && s.link) l.push('*Publicación:* ' + s.link);
    l.push('*Se retira en:* ' + (s.desde || 'a confirmar'));
    l.push('*Se entrega en:* ' + (s.hasta || 'a confirmar'));
    l.push('*Escaleras:* ' + textoEscaleras(s));
    l.push('*Cuándo:* ' + textoCuando(s));
    if (s.nota) l.push('*Nota:* ' + s.nota);
    if (s.nombre) l.push('', 'Soy ' + s.nombre + '.');
    return l.join('\n');
  }

  var cTipo = document.getElementById('cTipo');
  var cCarga = document.getElementById('cCarga');
  var cVacio = document.getElementById('cVacio');
  var cDesde = document.getElementById('cDesde');
  var cHasta = document.getElementById('cHasta');
  var cEscaleras = document.getElementById('cEscaleras');
  var cCuando = document.getElementById('cCuando');
  var cMensaje = document.getElementById('cMensaje');
  var cAviso = document.getElementById('cAviso');
  var enviar = document.getElementById('enviar');
  var dock = document.getElementById('dock');
  var dockTxt = document.getElementById('dockTxt');
  var dockBtn = document.getElementById('dockBtn');
  var campoLink = document.getElementById('campoLink');
  var campoPiso = document.getElementById('campoPiso');
  var campoFecha = document.getElementById('campoFecha');
  var pintados = {};

  function filaCartel(clave, icono, html) {
    var li = pintados[clave];
    if (!li) {
      li = document.createElement('li');
      if (!sinMovimiento) {
        li.className = 'pintando';
        li.addEventListener('animationend', function () { li.classList.remove('pintando'); }, { once: true });
      }
      li.dataset.clave = clave;
      pintados[clave] = li;
    }
    li.innerHTML = svgUso(icono) + '<span>' + html + '</span>';
    return li;
  }

  function escapar(t) {
    return t.replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function actualizar() {
    var s = leerEstado();

    COSAS.forEach(function (c) {
      var tarjeta = cosasEl.querySelector('.cosa[data-id="' + c.id + '"]');
      var n = cantidades[c.id];
      tarjeta.classList.toggle('cosa--si', n > 0);
      tarjeta.querySelector('.cosa__n').textContent = n;
      tarjeta.querySelector('.cosa__menos').hidden = n === 0;
      tarjeta.querySelector('.cosa__mas').setAttribute('aria-label', 'Sumar ' + c.uno + (n ? ' (van ' + n + ')' : ''));
    });

    campoLink.hidden = s.tipo !== 'marketplace';
    campoPiso.hidden = s.escaleras === 'no';
    campoFecha.hidden = s.cuando !== 'fecha';

    cTipo.textContent = TIPOS_CARTEL[s.tipo];
    var vivos = {};
    var orden = [];
    s.lista.forEach(function (x) {
      vivos[x.id] = true;
      orden.push(filaCartel(x.id, x.id, '<b>' + x.n + ' ×</b> ' + escapar(x.texto)));
    });
    if (s.otraCosa) {
      vivos.otro = true;
      orden.push(filaCartel('otro', 'otro', escapar(s.otraCosa)));
    }
    Object.keys(pintados).forEach(function (k) {
      if (!vivos[k]) {
        if (pintados[k].parentNode) pintados[k].parentNode.removeChild(pintados[k]);
        delete pintados[k];
      }
    });
    // solo mover lo que cambió de lugar: reinsertar un nodo reinicia su animación
    orden.forEach(function (li, i) {
      if (cCarga.children[i] !== li) cCarga.insertBefore(li, cCarga.children[i] || null);
    });
    var hayCarga = orden.length > 0;
    cVacio.hidden = hayCarga;

    cDesde.textContent = s.desde || '—';
    cHasta.textContent = s.hasta || '—';
    cEscaleras.textContent = textoEscaleras(s);
    cCuando.textContent = textoCuando(s);

    var mensaje = armarMensaje(s);
    cMensaje.textContent = mensaje;
    enviar.href = linkWA(mensaje);
    dockBtn.href = enviar.href;

    var total = s.lista.reduce(function (a, x) { return a + x.n; }, 0) + (s.otraCosa ? 1 : 0);
    if (total) {
      var ruta = (s.desde || '¿desde?') + ' → ' + (s.hasta || '¿hasta?');
      dockTxt.textContent = total + (total === 1 ? ' cosa' : ' cosas') + ' · ' + ruta;
    } else {
      dockTxt.textContent = 'Tocá lo que hay que llevar';
    }
    if (hayCarga) cAviso.textContent = '';
    return s;
  }

  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  function validarEnvio(e) {
    var s = leerEstado();
    if (!s.lista.length && !s.otraCosa) {
      e.preventDefault();
      cAviso.textContent = 'Primero contale qué hay que llevar (paso 2).';
      var primera = cosasEl.querySelector('.cosa__mas');
      cosasEl.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { primera.focus({ preventScroll: true }); }, 450);
    }
  }
  enviar.target = '_blank';
  enviar.rel = 'noopener';
  dockBtn.target = '_blank';
  dockBtn.rel = 'noopener';
  enviar.addEventListener('click', validarEnvio);
  dockBtn.addEventListener('click', validarEnvio);

  function aplicarPreset(tipo) {
    var r = form.querySelector('input[name="tipo"][value="' + tipo + '"]');
    if (r) {
      r.checked = true;
      actualizar();
    }
  }
  document.querySelectorAll('[data-preset]').forEach(function (a) {
    a.addEventListener('click', function () { aplicarPreset(a.getAttribute('data-preset')); });
  });
  if (params.get('tipo') && TIPOS[params.get('tipo')]) aplicarPreset(params.get('tipo'));

  actualizar();

  /* Dock móvil: visible mientras se completa el armador y el cartel no está a la vista */
  if ('IntersectionObserver' in window) {
    var enForm = false;
    var enCartel = false;
    var mq = window.matchMedia('(max-width: 1099px)');
    function refrescarDock() {
      dockVisible = mq.matches && enForm && !enCartel;
      dock.classList.toggle('dock--visible', dockVisible);
      dock.setAttribute('aria-hidden', dockVisible ? 'false' : 'true');
      dockBtn.tabIndex = dockVisible ? 0 : -1;
      alScroll();
    }
    new IntersectionObserver(function (en) {
      enForm = en[0].isIntersecting;
      refrescarDock();
    }, { rootMargin: '-30% 0px -10% 0px' }).observe(form);
    new IntersectionObserver(function (en) {
      enCartel = en[0].isIntersecting;
      refrescarDock();
    }, { threshold: 0.25 }).observe(document.getElementById('cartel'));
    if (mq.addEventListener) mq.addEventListener('change', refrescarDock);
  }

  /* ---------- Revelado escalonado ---------- */
  var revelar = document.querySelectorAll('.revelar');
  if (QA || sinMovimiento || !('IntersectionObserver' in window)) {
    revelar.forEach(function (el) { el.classList.add('visible'); });
  } else {
    revelar.forEach(function (el) {
      var hermanos = el.parentElement ? el.parentElement.querySelectorAll(':scope > .revelar') : [];
      var i = Array.prototype.indexOf.call(hermanos, el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 90, 360) + 'ms';
    });
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revelar.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Títulos que no pueden cortarse (letra grande en Android) ---------- */
  // inline-block: se mide contra el ancho del padre; bloques (patente, calco): contra sí mismos
  var ajustables = document.querySelectorAll('.letras, .cinta--hero, .cinta--cartel, .cinta--cierre, .patente__num, .calco__tel, .lleva__fila h3');
  function seDesborda(el) {
    if (el.matches('.patente__num, .calco__tel, .lleva__fila h3')) {
      return el.scrollWidth > el.clientWidth + 1;
    }
    return el.getBoundingClientRect().width > el.parentElement.clientWidth - 4;
  }
  function ajustarTextos() {
    ajustables.forEach(function (el) {
      el.style.fontSize = '';
      if (!el.parentElement) return;
      var tam = parseFloat(window.getComputedStyle(el).fontSize);
      var vueltas = 0;
      while (seDesborda(el) && tam > 11 && vueltas < 40) {
        tam *= 0.95;
        el.style.fontSize = tam + 'px';
        vueltas++;
      }
    });
  }
  window.__mfmFit = ajustarTextos;
  ajustarTextos();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTextos);
  window.addEventListener('load', ajustarTextos);
  var tRes;
  window.addEventListener('resize', function () {
    clearTimeout(tRes);
    tRes = setTimeout(ajustarTextos, 150);
  });

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
