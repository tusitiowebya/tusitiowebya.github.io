/* =========================================================
   Fragancias Donatella — vitrina conectada a CobrOS
   Estados: cargando (esqueleto) · ok · vacío · error.
   Sin SLUG en config.js la vitrina queda vacía: nunca se
   muestran perfumes ni precios de ejemplo.
   ========================================================= */
(function () {
  'use strict';
  const N = window.NEGOCIO || {};
  const estado = document.getElementById('vitrinaEstado');
  const grid = document.getElementById('vitrinaGrid');
  const filtros = document.getElementById('vitrinaFiltros');
  const buscar = document.getElementById('vitrinaBuscar');
  const cats = document.getElementById('vitrinaCats');
  if (!estado || !grid) return;

  const WA = N.WA || '5491124729304';
  const waLink = txt => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  // el contorno del frasco del sello, punteado (lugar vacío en el estante)
  const FRASCO = '<svg viewBox="0 0 60 100" aria-hidden="true" focusable="false">' +
    '<path d="M19 3h22a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"/>' +
    '<path d="M23 24h14v7H23z"/>' +
    '<path d="M13 31h34a9 9 0 0 1 9 9v47a9 9 0 0 1-9 9H13a9 9 0 0 1-9-9V40a9 9 0 0 1 9-9Z"/>' +
    '<path d="M16 41h28a5 5 0 0 1 5 5v33a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5V46a5 5 0 0 1 5-5Z"/></svg>';

  let ALL = [], cat = '', q = '';

  function setEstado(k, contenido) {
    estado.dataset.estado = k;
    estado.innerHTML = contenido || '';
  }

  function tplVacio(conCuenta) {
    const titulo = conCuenta ? 'Todavía no cargaste tus testers' : 'La vitrina se llena sola';
    const texto = conCuenta
      ? 'Entrá a tu app CobrOS y cargá tu catálogo: cada tester aparece acá al instante, con foto, nombre y precio.'
      : 'Cuando cargues tus testers en tu app CobrOS —con foto, nombre y precio— aparecen acá al instante, listos para sumar a la consulta.';
    const nota = conCuenta ? 'La vitrina se actualiza sola desde el panel.' : 'Vista de demostración: todavía no hay productos cargados.';
    return '<div class="vacio">' +
      '<div class="vacio__frascos">' + FRASCO + FRASCO + FRASCO + '</div>' +
      '<div><h3>' + titulo + '</h3><p>' + texto + '</p>' +
      '<div class="vacio__acciones">' +
      '<a class="btn btn--tinta" href="#consulta">Pedí precio de tu perfume</a>' +
      '<a class="enlace" href="' + waLink('¡Hola, Fragancias Donatella! Quiero consultar qué perfumes tester tienen disponibles.') + '" target="_blank" rel="noopener">O preguntá qué hay disponible <span aria-hidden="true">→</span></a>' +
      '</div><p class="vacio__nota">' + nota + '</p></div></div>';
  }

  function tplError() {
    return '<div class="vacio vacio--error">' +
      '<div class="vacio__frascos">' + FRASCO + '</div>' +
      '<div><h3>No pudimos abrir la vitrina</h3>' +
      '<p>Puede ser la conexión. Probá de nuevo en un momento o pedinos precio directo por WhatsApp.</p>' +
      '<div class="vacio__acciones">' +
      '<button type="button" class="btn btn--tinta" data-reintentar>Probar de nuevo</button>' +
      '<a class="enlace" href="' + waLink('¡Hola, Fragancias Donatella! Quiero consultar por un perfume tester.') + '" target="_blank" rel="noopener">Escribinos por WhatsApp <span aria-hidden="true">→</span></a>' +
      '</div></div></div>';
  }

  function mapear(p) {
    const stock = p.controlaStock ? Number(p.stock) : null;
    return {
      id: String(p._id || p.id || p.nombre),
      nombre: String(p.nombre || '').trim(),
      cat: String(p.categoria || 'Perfumes').trim(),
      precio: Number(p.precio) || 0,
      foto: typeof p.foto === 'string' ? p.foto : '',
      desc: String(p.descripcion || '').trim(),
      stock: Number.isFinite(stock) ? stock : null,
    };
  }

  function tarjeta(p, i) {
    const foto = p.foto
      ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async">'
      : FRASCO;
    let aviso = '';
    if (p.stock === 0) aviso = '<p class="prod__stock">Consultá disponibilidad</p>';
    else if (p.stock !== null && p.stock <= 2) aviso = '<p class="prod__stock">Últimas unidades</p>';
    return '<li class="prod" style="--i:' + (i % 8) + '">' +
      '<div class="prod__foto">' + foto + '</div>' +
      '<div class="prod__cuerpo">' +
      '<p class="prod__cat">' + esc(p.cat) + '</p>' +
      '<h3 class="prod__nombre">' + esc(p.nombre) + '</h3>' +
      (p.desc ? '<p class="prod__desc">' + esc(p.desc) + '</p>' : '') +
      '<p class="prod__precio">' + (p.precio > 0 ? fmt.format(p.precio) + '<small>precio tester</small>' : 'Consultá el precio') + '</p>' +
      aviso +
      '<button type="button" class="prod__sumar" data-nombre="' + esc(p.nombre) + '">Sumar a la consulta</button>' +
      '</div></li>';
  }

  function pintar() {
    const nq = norm(q);
    const lista = ALL.filter(p => (!cat || norm(p.cat) === cat) && (!nq || norm(p.nombre + ' ' + p.desc).includes(nq)));
    grid.innerHTML = lista.map(tarjeta).join('');
    if (!lista.length) {
      setEstado('filtro', '<p class="vitrina__nada">No encontramos testers con esa búsqueda. <a class="enlace" href="' +
        waLink('¡Hola, Fragancias Donatella! Busco este perfume tester: ' + q) + '" target="_blank" rel="noopener">Preguntanos por WhatsApp <span aria-hidden="true">→</span></a></p>');
    } else setEstado('ok');
  }

  function armarFiltros() {
    const unicas = [];
    ALL.forEach(p => { const k = norm(p.cat); if (k && !unicas.some(u => u.k === k)) unicas.push({ k, n: p.cat }); });
    cats.innerHTML = (unicas.length > 1 ? ['<button type="button" class="chip" data-cat="" aria-pressed="true">Todos</button>']
      .concat(unicas.map(u => '<button type="button" class="chip" data-cat="' + esc(u.k) + '" aria-pressed="false">' + esc(u.n) + '</button>')) : []).join('');
    filtros.hidden = false;
  }

  async function cargar() {
    if (!N.SLUG) { setEstado('vacio', tplVacio(false)); return; }
    setEstado('cargando', '<ul class="esqueleto" aria-hidden="true"><li></li><li></li><li></li><li></li></ul><p class="vh">Cargando la vitrina…</p>');
    const ctrl = window.AbortController ? new AbortController() : null;
    const corte = setTimeout(() => ctrl && ctrl.abort(), N.TIMEOUT_MS || 8000);
    try {
      const r = await fetch(N.API + '/catalogo/' + encodeURIComponent(N.SLUG), ctrl ? { signal: ctrl.signal } : {});
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      ALL = (data.productos || []).filter(p => p && p.activo !== false && p.nombre).map(mapear);
      if (!ALL.length) { setEstado('vacio', tplVacio(true)); return; }
      armarFiltros();
      pintar();
    } catch (e) {
      setEstado('error', tplError());
    } finally {
      clearTimeout(corte);
    }
  }

  estado.addEventListener('click', e => {
    if (e.target.closest('[data-reintentar]')) cargar();
  });
  cats.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    cats.querySelectorAll('[data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar();
  });
  let tBuscar = 0;
  buscar.addEventListener('input', () => {
    clearTimeout(tBuscar);
    tBuscar = setTimeout(() => { q = buscar.value.trim(); pintar(); }, 160);
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.prod__sumar');
    if (!b) return;
    const api = window.__donatella;
    if (api && api.sumar(b.dataset.nombre)) {
      b.classList.add('is-ok');
      b.textContent = 'En tu consulta ✓';
      setTimeout(() => { b.classList.remove('is-ok'); b.textContent = 'Sumar otra vez'; }, 2200);
    }
  });

  cargar();
})();
