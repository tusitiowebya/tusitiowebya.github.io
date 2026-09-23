/* EGAM · /catalogo/ — filtros linkeables ?m=menor|mayor&c=cat&q=texto&o=az */
(function () {
  const D = window.EGAM, S = window.Shop;
  const $ = s => document.querySelector(s);
  if (/[?&]qa\b/.test(location.search)) document.documentElement.classList.add('qa');

  const url = new URLSearchParams(location.search);
  const st = { c: url.get('c') || '', q: url.get('q') || '', o: url.get('o') || '' };
  if (url.get('m')) S.setMode(url.get('m'));
  if (st.c && !D.cats.some(c => c.id === st.c)) st.c = '';

  const tabs = $('#catTabs'), grid = $('#catGrid'), q = $('#catQ'), o = $('#catO');
  q.value = st.q; o.value = st.o;

  tabs.innerHTML = [{ id: '', name: 'Todo' }, ...D.cats].map(c => {
    const n = c.id ? D.list.filter(p => p.cat === c.id).length : D.list.length;
    return `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === st.c}">${c.name}<span>${n}</span></button>`;
  }).join('');

  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function syncUrl() {
    const u = new URLSearchParams();
    u.set('m', S.mode);
    if (st.c) u.set('c', st.c);
    if (st.q) u.set('q', st.q);
    if (st.o) u.set('o', st.o);
    history.replaceState(null, '', '?' + u.toString());
  }

  function render() {
    const nq = norm(st.q.trim());
    let list = D.list.filter(p => (!st.c || p.cat === st.c) &&
      (!nq || norm(`${p.name} ${p.desc} ${p.uso} ${S.catName[p.cat]}`).includes(nq)));
    if (st.o === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (st.o === 'za') list.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    grid.innerHTML = '';
    list.forEach((p, i) => { const c = S.card(p); c.classList.add('in'); c.style.animationDelay = Math.min(i, 12) * 35 + 'ms'; grid.appendChild(c); });
    $('#catCount').textContent = `${list.length} producto${list.length === 1 ? '' : 's'} · ${S.mode === 'mayor' ? 'presentaciones por mayor' : 'presentaciones por menor'}`;
    $('#catEmpty').hidden = list.length > 0;
    if (!list.length) {
      $('#catEmptyQ').textContent = st.q;
      $('#catEmptyWa').href = S.waLink(D.sellers[0], `Hola EGAM! ¿Tienen ${st.q}?`);
    }
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.cat === st.c));
    $('#catMayorNote').hidden = S.mode !== 'mayor';
    syncUrl();
  }

  tabs.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; st.c = b.dataset.cat; render(); });
  let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = q.value; render(); }, 140); });
  o.addEventListener('change', () => { st.o = o.value; render(); });
  S.onChange(render);
  render();
  // abrir ficha directa: /catalogo/?p=almendras
  if (url.get('p') && S.byId[url.get('p')]) S.openInfo(url.get('p'));
})();
