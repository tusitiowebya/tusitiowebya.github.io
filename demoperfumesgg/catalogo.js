/* ══════════════════════════════════════════════════════════
   Perfumes GG — página de catálogo
   Los filtros se reflejan en la URL (?fam=&gen=&mom=) para poder
   linkear desde el home y desde el buscador de aroma.
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
  var links = $('#navLinks'), burger = $('#burger');
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

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('on'); }, i * 55);
      io.unobserve(e.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });

  /* ── Estado ──────────────────────────────────────────────── */
  var q = new URLSearchParams(location.search);
  var f = {
    fam: q.get('fam') || null,
    gen: q.get('gen') || null,
    mom: q.get('mom') || null,
    orden: 'dest'
  };

  function urlSync() {
    var p = new URLSearchParams();
    if (f.fam) p.set('fam', f.fam);
    if (f.gen) p.set('gen', f.gen);
    if (f.mom) p.set('mom', f.mom);
    var s = p.toString();
    history.replaceState(null, '', s ? '?' + s : location.pathname);
  }

  /* ── Chips ───────────────────────────────────────────────── */
  function chips(cont, items, clave) {
    cont.innerHTML = '<button data-val="">Todas</button>' + items.map(function (i) {
      return '<button data-val="' + S.esc(i.id) + '">' + S.esc(i.nombre) + '</button>';
    }).join('');
    marcar(cont, clave);
    cont.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      f[clave] = b.getAttribute('data-val') || null;
      marcar(cont, clave);
      urlSync();
      pintar();
    });
  }
  function marcar(cont, clave) {
    $$('button', cont).forEach(function (b) {
      b.classList.toggle('on', (b.getAttribute('data-val') || null) === f[clave]);
    });
  }

  chips($('#fFam'), S.familias.concat([{ id: 'sets', nombre: 'Sets y decants' }]), 'fam');
  chips($('#fGen'), [
    { id: 'ella', nombre: 'Para ella' },
    { id: 'el', nombre: 'Para él' },
    { id: 'unisex', nombre: 'Unisex' }
  ], 'gen');
  chips($('#fMom'), S.momentos, 'mom');

  $('#fOrden').addEventListener('change', function () { f.orden = this.value; pintar(); });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-reset]')) return;
    f.fam = f.gen = f.mom = null;
    $$('.filtro-ops').forEach(function (c) { marcar(c, c.getAttribute('data-grupo')); });
    urlSync();
    pintar();
  });

  /* ── Ficha ───────────────────────────────────────────────── */
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

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    S.agregar(b.getAttribute('data-add'), 1);
    b.textContent = 'Agregado ✓';
    b.classList.add('puesto');
    setTimeout(function () { b.textContent = 'Sumar al pedido'; b.classList.remove('puesto'); }, 1400);
  });

  /* ── Pintado ─────────────────────────────────────────────── */
  function filtrar() {
    return S.productos().filter(function (p) {
      if (f.fam && p.cat !== f.fam) return false;
      if (f.gen && p.gen !== f.gen && p.gen !== 'unisex') return false;
      if (f.mom && (p.mom || []).indexOf(f.mom) < 0) return false;
      return true;
    });
  }

  function ordenar(lista) {
    var l = lista.slice();
    if (f.orden === 'asc')  return l.sort(function (a, b) { return a.precio - b.precio; });
    if (f.orden === 'desc') return l.sort(function (a, b) { return b.precio - a.precio; });
    if (f.orden === 'az')   return l.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
    return l.sort(function (a, b) { return (b.dest ? 1 : 0) - (a.dest ? 1 : 0); });
  }

  function mensajeFiltro() {
    var partes = [];
    if (f.gen) partes.push(S.genNombres[f.gen]);
    if (f.fam) partes.push('familia ' + S.nombreFamilia(f.fam).toLowerCase());
    if (f.mom) partes.push('para ' + S.nombreMomento(f.mom).toLowerCase());
    return 'Hola GG! Busqué en la web' + (partes.length ? ' (' + partes.join(', ') + ')' : '') +
           ' y no me apareció nada. ¿Qué tienen parecido?';
  }

  function pintar() {
    var lista = ordenar(filtrar());
    var grid = $('#catGrid');

    $('#catConteo').innerHTML = lista.length
      ? '<b>' + lista.length + '</b> ' + (lista.length === 1 ? 'perfume' : 'perfumes')
      : 'Sin resultados';

    if (!lista.length) {
      grid.innerHTML = '<div class="cat-vacio">' +
        '<b>Con esos filtros no queda nada</b>' +
        'Probá sacando alguno, o preguntanos directamente: el stock rota seguido.' +
        '<br><a class="btn btn-wa" href="' + S.esc(S.linkWA(mensajeFiltro())) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a>' +
        '</div>';
      return;
    }

    grid.innerHTML = lista.map(fichaHTML).join('');
    $$('.reveal', grid).forEach(function (el) { io.observe(el); });
  }

  /* ── Arranque ────────────────────────────────────────────── */
  $('#anio').textContent = new Date().getFullYear();
  pintar();
  S.montarCarrito();

  S.sincronizar().then(function (r) {
    if (!r.conectado) return;
    pintar();
    var nota = $('#catNota');
    if (nota) {
      nota.textContent = 'Precios y stock en vivo desde el panel de Perfumes GG.';
      nota.classList.add('vivo');
    }
  });
})();
