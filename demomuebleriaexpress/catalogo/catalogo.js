/* Mueblería Express — /catalogo/: filtros por rubro, búsqueda y orden, linkeables por URL (?r=&q=&o=). */
(function () {
  'use strict';
  const ME = window.ME, U = window.MEUI;
  const { $, $$, esc } = U;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const ORDEN = ['frio', 'mostradores', 'gastro', 'combos', 'carteleria', 'hogar', 'electro', 'tecno', 'herramientas'];

  const url = new URLSearchParams(location.search);
  const st = {
    r: ORDEN.includes(url.get('r')) ? url.get('r') : 'todos',
    q: url.get('q') || '',
    o: ['rel', 'asc', 'desc', 'az'].includes(url.get('o')) ? url.get('o') : 'rel'
  };

  /* Nav mobile */
  const nav = $('.nav'), burger = $('.burger');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(o));
    document.documentElement.classList.toggle('no-scroll', o);
  });

  const count = r => r === 'todos' ? ME.productos.length : ME.productos.filter(p => p.c === r).length;
  const nombre = r => r === 'todos' ? 'Todos los productos' : ME.RUBROS[r];
  const btns = (cls) => ['todos', ...ORDEN].map(r =>
    `<button class="${cls}" type="button" data-r="${r}" aria-pressed="${r === st.r}">${nombre(r)}<small>${count(r)}</small></button>`).join('');
  $('[data-side]').innerHTML = '<strong>RUBROS</strong>' + btns('');
  $('[data-chips-m]').innerHTML = btns('chip');

  const qIn = $('[data-q]'), oSel = $('[data-o]'), grid = $('[data-grid]'), meta = $('[data-meta]');
  qIn.value = st.q; oSel.value = st.o;

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-r]'); if (!b) return;
    st.r = b.dataset.r; render(true);
  });
  let t;
  qIn.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = qIn.value.trim(); render(); }, 160); });
  oSel.addEventListener('change', () => { st.o = oSel.value; render(); });

  function valor(p) { const c = ME.cuota(p); return c ? c.v : Infinity; }

  function render(scroll) {
    $$('[data-r]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.r === st.r)));
    const q = norm(st.q);
    let lista = ME.productos.filter(p => (st.r === 'todos' || p.c === st.r) && (!q || norm(p.n + ' ' + p.s).includes(q)));
    if (st.o === 'rel') lista.sort((a, b) => ORDEN.indexOf(a.c) - ORDEN.indexOf(b.c));
    if (st.o === 'asc') lista.sort((a, b) => valor(a) - valor(b));
    if (st.o === 'desc') lista.sort((a, b) => (valor(b) === Infinity ? -1 : valor(b)) - (valor(a) === Infinity ? -1 : valor(a)));
    if (st.o === 'az') lista.sort((a, b) => a.n.localeCompare(b.n, 'es'));

    meta.textContent = `${lista.length} producto${lista.length === 1 ? '' : 's'} · ${nombre(st.r)} · cuotas en plan de ${ME.plan} días`;
    grid.innerHTML = lista.length ? lista.map(U.card).join('') :
      `<p class="vacio">No encontramos “${esc(st.q)}”. <a href="${ME.waLink('Hola! Busco: ' + st.q)}" target="_blank" rel="noopener">Preguntanos por WhatsApp</a>, capaz lo conseguimos.</p>`;

    const p = new URLSearchParams();
    if (st.r !== 'todos') p.set('r', st.r);
    if (st.q) p.set('q', st.q);
    if (st.o !== 'rel') p.set('o', st.o);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    if (scroll && window.scrollY > 300) window.scrollTo({ top: $('.cat').offsetTop - 80, behavior: 'smooth' });
  }

  ME.on(() => render());
  render();
})();
