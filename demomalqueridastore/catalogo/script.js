(() => {
  'use strict';
  const {$, $$, esc, normalize} = MQ;
  const grid = $('#catGrid'), tabs = $('#catTabs'), search = $('#catSearch'), count = $('#catCount'), stateBox = $('#catState');
  let category = 'Todo', ready = false;

  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && MQ.products.some(p => p.id === id)) MQ.detail(id);
  };

  function state(kind, text, retry) {
    ready = false;
    grid.innerHTML = kind === 'loading' ? Array.from({length: 6}, () => '<div class="prenda skeleton" aria-hidden="true"></div>').join('') : '';
    stateBox.hidden = kind === 'loading';
    stateBox.innerHTML = `<p>${esc(text)}</p>${retry ? '<button class="btn btn-ink" type="button" data-retry>Volver a intentar</button>' : ''}<a class="link-arrow" href="${esc(MQ.wa('Hola, MalqueridaStore. Quiero ver qué prendas tienen disponibles.'))}" target="_blank" rel="noopener noreferrer">Preguntanos por WhatsApp</a>`;
    count.textContent = kind === 'loading' ? text : '';
    tabs.innerHTML = '';
  }

  function renderTabs() {
    const counts = MQ.products.reduce((acc, p) => (acc[p.category] = (acc[p.category] || 0) + 1, acc), {});
    const cats = ['Todo', ...Object.keys(counts)];
    if (!cats.includes(category)) category = 'Todo';
    tabs.innerHTML = cats.map(c => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === category}">${esc(c)} <small>${c === 'Todo' ? MQ.products.length : counts[c]}</small></button>`).join('');
  }

  function render() {
    if (!ready) return;
    const q = normalize(search.value.trim());
    const list = MQ.products.filter(p => (category === 'Todo' || p.category === category) && normalize(`${p.name} ${p.category} ${p.description}`).includes(q));
    grid.innerHTML = list.map(p => MQ.card(p, MQ.products.indexOf(p), {eager: MQ.products.indexOf(p) < 4})).join('');
    count.textContent = list.length ? `${list.length} ${list.length === 1 ? 'prenda' : 'prendas'}${category !== 'Todo' ? ' en ' + category.toLowerCase() : ''}` : '';
    stateBox.hidden = !!list.length;
    if (!list.length) stateBox.innerHTML = '<p>No encontramos prendas con esa búsqueda.</p><button class="btn btn-ink" type="button" data-reset>Ver todas</button><a class="link-arrow" href="#avisame">Dejanos tu búsqueda</a>';
    MQ.syncHearts();
  }

  async function load() {
    state('loading', 'Colgando las prendas…');
    const result = await MQ.load();
    if (result.kind === 'error') return state('error', result.timeout ? 'El catálogo tardó más de lo normal.' : 'No pudimos cargar el catálogo.', true);
    if (result.kind === 'empty') return state('empty', 'Estamos colgando prendas nuevas. Escribinos y te mostramos lo que hay.', false);
    if (result.source === 'cobros') $('#catNote').textContent = 'Catálogo actualizado por MalqueridaStore. Igual te confirmamos disponibilidad al consultar.';
    ready = true;
    renderTabs(); render(); fromHash();
  }

  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    category = b.dataset.cat; renderTabs(); render();
  });
  search.addEventListener('input', render);
  stateBox.addEventListener('click', e => {
    if (e.target.closest('[data-retry]')) load();
    if (e.target.closest('[data-reset]')) { category = 'Todo'; search.value = ''; renderTabs(); render(); }
  });
  window.addEventListener('hashchange', fromHash);

  MQ.initBag();
  MQ.initWaitlist($('[data-waitlist]'));
  MQ.onChange(() => { $('.bag-dock').classList.toggle('is-on', MQ.chosen().length > 0); });
  load();
})();
