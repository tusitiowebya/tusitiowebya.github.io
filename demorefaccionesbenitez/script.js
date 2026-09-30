/* Refacciones Benítez — interacción */
(function () {
  'use strict';

  var WA_NUMBER = '5491153831824';
  var root = document.documentElement;
  root.classList.add('js');
  if (/[?&]qa\b/.test(location.search)) root.classList.add('qa');

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  /* ---------- mensajes por CTA ---------- */
  var MSG = {
    nav: 'Hola Refacciones Benítez! Quiero pedir un presupuesto.',
    hero: 'Hola Refacciones Benítez! Vi su página y quiero pedir un presupuesto para un trabajo en CABA.',
    oficios: 'Hola Refacciones Benítez! Quería consultar por un trabajo de ',
    altura: 'Hola Refacciones Benítez! Necesito un trabajo en altura (frente / medianera). ¿Me pasan presupuesto?',
    consorcio: 'Hola Refacciones Benítez! Escribo por un consorcio y quería pedir presupuesto. El edificio está en: ',
    empresa: 'Hola Refacciones Benítez! Escribo por una empresa y queríamos consultar por mantenimiento/reparaciones del edificio.',
    particular: 'Hola Refacciones Benítez! Quería consultar por un arreglo en mi casa/departamento.',
    cierre: 'Hola Refacciones Benítez! Quiero pedir un presupuesto. Les paso el barrio y fotos.',
    footer: 'Hola Refacciones Benítez! Quería hacerles una consulta.',
    flotante: 'Hola Refacciones Benítez! Quería hacerles una consulta.'
  };
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var k = a.getAttribute('data-wa');
    if (MSG[k]) a.href = waLink(MSG[k]);
  });

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) nav.classList.add('scrolled');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    }
  });

  var waFloat = document.getElementById('waFloat');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 30 || menu.classList.contains('open'));
    waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- videos: cargar solo los visibles ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var videos = [].slice.call(document.querySelectorAll('video[data-src]'));

  function isShown(el) {
    return el.offsetParent !== null && el.getBoundingClientRect().width > 0;
  }
  function startVideo(v) {
    if (reduce || saveData || !isShown(v)) return;
    if (!v.src) { v.src = v.getAttribute('data-src'); }
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) startVideo(en.target);
        else if (en.target.src) en.target.pause();
      });
    }, { rootMargin: '120px 0px' });
    videos.forEach(function (v) { vio.observe(v); });
  } else {
    videos.forEach(startVideo);
  }
  function kickVisible() {
    videos.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight + 120) startVideo(v);
    });
  }
  kickVisible();
  window.addEventListener('load', kickVisible);
  window.addEventListener('resize', kickVisible);

  /* ---------- entrada del hero ---------- */
  var hero = document.querySelector('.hero');
  requestAnimationFrame(function () {
    setTimeout(function () { hero.classList.add('loaded'); }, 60);
  });

  /* ---------- reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !root.classList.contains('qa')) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (c) { return c.classList.contains('reveal'); }) : [];
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + 'ms';
        el.classList.add('in');
        rio.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- ARMADOR: edificio en corte ---------- */
  var ZONES = [
    { id: 'terraza', n: 1, name: 'Techo y terraza', alt: false,
      items: ['Impermeabilización de techos y terrazas', 'Reparación de albañilería'] },
    { id: 'medianera', n: 2, name: 'Medianera', alt: true,
      items: ['Impermeabilización de medianera', 'Sellado de grietas', 'Trabajo en altura con silleteros'] },
    { id: 'frente', n: 3, name: 'Frente o fachada', alt: true,
      items: ['Reparación e impermeabilización de frente', 'Sellado de grietas', 'Pintura exterior y revestimiento texturado', 'Trabajos en altura por Ley de Fachada'] },
    { id: 'balcones', n: 4, name: 'Balcones y barandas', alt: true,
      items: ['Reparación de albañilería en balcones', 'Herrería en barandas', 'Pintura exterior'] },
    { id: 'interior', n: 5, name: 'Interior del depto', alt: false,
      items: ['Pintura de interior', 'Albañilería y arreglos', 'Revestimiento texturado'] },
    { id: 'plomeria', n: 6, name: 'Baño, cocina y cañerías', alt: false,
      items: ['Arreglos e instalaciones de plomería'] },
    { id: 'electricidad', n: 7, name: 'Electricidad', alt: false,
      items: ['Arreglos e instalaciones eléctricas', 'Unidades y espacios comunes'] },
    { id: 'entrada', n: 8, name: 'Entrada y palier', alt: false,
      items: ['Mantenimiento general del edificio', 'Herrería en rejas y portones', 'Pintura de palier y espacios comunes'] }
  ];
  var byId = {};
  ZONES.forEach(function (z) { byId[z.id] = z; });

  var selected = [];
  var chipsBox = document.getElementById('zoneChips');
  var info = document.getElementById('zoneInfo');
  var tMsg = document.getElementById('tMsg');
  var tAlt = document.getElementById('tAlt');
  var sendWa = document.getElementById('sendWa');
  var fBarrio = document.getElementById('fBarrio');
  var fPisos = document.getElementById('fPisos');
  var fDetalle = document.getElementById('fDetalle');
  var dock = document.getElementById('dock');
  var dockTxt = document.getElementById('dockTxt');
  var dockWa = document.getElementById('dockWa');
  var svgZones = document.querySelectorAll('.corte .zone');
  var pins = document.querySelectorAll('.corte .pins g');
  var emptyHtml = info.innerHTML;

  ZONES.forEach(function (z) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('data-zone', z.id);
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<i>' + z.n + '</i><span>' + z.name + '</span>';
    b.addEventListener('click', function () { toggle(z.id); });
    chipsBox.appendChild(b);
  });

  function toggle(id, force) {
    var i = selected.indexOf(id);
    var on = typeof force === 'boolean' ? force : i === -1;
    if (on && i === -1) selected.push(id);
    if (!on && i !== -1) selected.splice(i, 1);
    render();
  }

  svgZones.forEach(function (g) {
    var id = g.getAttribute('data-zone');
    g.addEventListener('click', function () { toggle(id); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(id); }
    });
  });

  function who() {
    var r = document.querySelector('input[name="who"]:checked');
    return r ? r.value : '';
  }

  function buildMessage() {
    var lines = ['Hola Refacciones Benítez! Quiero pedir un presupuesto.'];
    lines.push('Consulto como: ' + who());
    var barrio = fBarrio.value.trim();
    if (barrio) lines.push('Zona / dirección: ' + barrio);
    var pisos = parseInt(fPisos.value, 10);
    if (pisos > 0) lines.push('Pisos del edificio: ' + pisos);
    if (selected.length) {
      lines.push('');
      lines.push('Qué hay que arreglar:');
      selected.forEach(function (id) {
        var z = byId[id];
        lines.push('• ' + z.name + (z.alt ? ' (trabajo en altura)' : ''));
      });
    } else {
      lines.push('');
      lines.push('Qué hay que arreglar: (todavía no lo marqué)');
    }
    var det = fDetalle.value.trim();
    if (det) { lines.push(''); lines.push('Detalle: ' + det); }
    lines.push('');
    lines.push('Les mando fotos por acá.');
    return lines.join('\n');
  }

  function render() {
    var alt = selected.some(function (id) { return byId[id].alt; });
    svgZones.forEach(function (g) {
      var on = selected.indexOf(g.getAttribute('data-zone')) !== -1;
      g.classList.toggle('on', on);
      g.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    pins.forEach(function (p, i) {
      p.classList.toggle('on', selected.indexOf(ZONES[i].id) !== -1);
    });
    chipsBox.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', selected.indexOf(c.getAttribute('data-zone')) !== -1 ? 'true' : 'false');
    });

    if (!selected.length) {
      info.innerHTML = emptyHtml;
    } else {
      info.innerHTML = selected.map(function (id) {
        var z = byId[id];
        return '<div class="zi-item"><b>' + z.name + (z.alt ? '<span>En altura</span>' : '') + '</b><ul>' +
          z.items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>';
      }).join('');
    }

    tAlt.hidden = !alt;
    var msg = buildMessage();
    tMsg.textContent = msg;
    var link = waLink(msg);
    sendWa.href = link;
    dockWa.href = link;
    dockTxt.textContent = selected.length === 1 ? '1 parte marcada' : selected.length + ' partes marcadas';
    updateDock();
  }

  [fBarrio, fPisos, fDetalle].forEach(function (el) { el.addEventListener('input', render); });
  document.querySelectorAll('input[name="who"]').forEach(function (r) { r.addEventListener('change', render); });

  /* dock móvil: visible con partes marcadas mientras el armador está en pantalla */
  var builder = document.getElementById('edificio');
  var builderVisible = false;
  function updateDock() {
    var show = builderVisible && selected.length > 0 && window.innerWidth < 900;
    var sendVisible = false;
    var r = sendWa.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) sendVisible = true;
    dock.hidden = !show || sendVisible;
    document.body.classList.toggle('dock-on', !dock.hidden);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      builderVisible = entries[0].isIntersecting;
      updateDock();
    }).observe(builder);
  }
  window.addEventListener('scroll', updateDock, { passive: true });

  /* edificios del hero: sumar la zona y bajar al armador */
  document.querySelectorAll('.skyline [data-zone], .skyline [data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      var zone = b.getAttribute('data-zone');
      var go = b.getAttribute('data-go');
      if (zone) {
        toggle(zone, true);
        builder.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      } else if (go) {
        var t = document.querySelector(go);
        if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  /* preselección por URL: ?zona=medianera,frente */
  var qz = /[?&]zona=([^&]+)/.exec(location.search);
  if (qz) decodeURIComponent(qz[1]).split(',').forEach(function (id) { if (byId[id]) toggle(id, true); });

  render();

  /* ---------- títulos: que no se corten con letra grande del sistema ---------- */
  function fitText() {
    document.querySelectorAll('.fit').forEach(function (el) {
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      var guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 20 && guard < 40) {
        size -= 2; guard++;
        el.style.fontSize = size + 'px';
      }
    });
  }
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener('load', fitText);
  window.addEventListener('resize', fitText);

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
