/* ═══════════════════════════════════════════════
   DI TUTTO — Sanguchería & Casa de Comidas
   Menú (sin precios, se pide por WhatsApp) + armador de bandejas
   ═══════════════════════════════════════════════ */

const WA = '5491144440620';

/* ── Categorías: cuánto se calcula por persona y en qué unidad ── */
const CATS = {
  sanguches: { label:'Sanguches de miga', nota:'Se cortan en el momento · se venden por docena',
               porPersona:3, step:6, min:6, unidad:'sanguchitos', docena:true, rol:'picar' },
  empanadas: { label:'Empanadas', nota:'Masa casera, horneadas · por docena o media',
               porPersona:3, step:6, min:6, unidad:'empanadas', docena:true, rol:'picar' },
  tartas:    { label:'Tartas', nota:'Por porción o enteras (8 porciones)',
               porPersona:1, step:1, min:2, unidad:'porciones', rol:'fuerte' },
  porciones: { label:'Del día, al plato', nota:'Comida casera lista para calentar',
               porPersona:1, step:1, min:1, unidad:'porciones', rol:'fuerte' },
  alpaso:    { label:'Sanguches al paso', nota:'Para comer ahí o llevar',
               porPersona:1, step:1, min:1, unidad:'sándwiches', rol:'fuerte' },
  ensaladas: { label:'Ensaladas', nota:'Armadas al momento · chica, mediana o grande',
               porPersona:.5, step:1, min:1, unidad:'porciones', rol:'verde' },
  dulces:    { label:'Para el postre', nota:'Lo que salió del horno esa mañana',
               porPersona:1, step:1, min:2, unidad:'porciones', rol:'dulce' }
};

const PRODUCTOS = [
  // sanguches de miga
  { id:'miga_jq',    cat:'sanguches', n:'Miga de jamón y queso',        d:'El clásico, pan blanco o negro' },
  { id:'miga_esp',   cat:'sanguches', n:'Miga especial surtida',        d:'Crudo, roquefort, morrón y palmito' },
  { id:'miga_triple',cat:'sanguches', n:'Triple de jamón, queso y tomate', d:'Tres pisos, bien cargado' },
  { id:'miga_ave',   cat:'sanguches', n:'Miga de ave con salsa golf',   d:'Pollo desmenuzado, hecho en casa' },
  { id:'miga_huevo', cat:'sanguches', n:'Miga de huevo y morrón',       d:'Con aceitunas, sin carne' },
  { id:'miga_crudo', cat:'sanguches', n:'Pan negro con crudo y rúcula', d:'Con queso crema y nueces' },
  // empanadas
  { id:'emp_carne',  cat:'empanadas', n:'Carne cortada a cuchillo', d:'Suave o picante' },
  { id:'emp_jq',     cat:'empanadas', n:'Jamón y queso',            d:'Bien gratinada' },
  { id:'emp_pollo',  cat:'empanadas', n:'Pollo',                    d:'Con cebolla de verdeo' },
  { id:'emp_humita', cat:'empanadas', n:'Humita',                   d:'Cremosa, con choclo fresco' },
  { id:'emp_verd',   cat:'empanadas', n:'Verdura y salsa blanca',   d:'Espinaca y ricota' },
  { id:'emp_caprese',cat:'empanadas', n:'Caprese',                  d:'Tomate, muzzarella y albahaca' },
  // tartas
  { id:'tar_jq',     cat:'tartas', n:'Tarta de jamón y queso',   d:'Masa casera, bien alta' },
  { id:'tar_verd',   cat:'tartas', n:'Tarta de verdura',         d:'Acelga, cebolla y huevo' },
  { id:'tar_cal',    cat:'tartas', n:'Tarta de calabaza y puerro', d:'Con un toque de queso azul' },
  { id:'tar_choclo', cat:'tartas', n:'Tarta de choclo',          d:'Cremosa, con muzzarella' },
  { id:'tar_pascual',cat:'tartas', n:'Pascualina',               d:'La de siempre, con huevo entero' },
  { id:'tar_zap',    cat:'tartas', n:'Tarta de zapallitos',      d:'Con cebolla y queso rallado' },
  // del día
  { id:'por_mila',   cat:'porciones', n:'Milanesa con puré',       d:'De carne o de pollo' },
  { id:'por_lasa',   cat:'porciones', n:'Lasaña',                  d:'De carne o de verdura' },
  { id:'por_cane',   cat:'porciones', n:'Canelones de verdura',    d:'Con salsa mixta' },
  { id:'por_pastel', cat:'porciones', n:'Pastel de papa',          d:'Gratinado arriba' },
  { id:'por_matam',  cat:'porciones', n:'Matambre a la pizza',     d:'Para compartir' },
  { id:'por_tortilla',cat:'porciones', n:'Tortilla de papas',      d:'Jugosa, con o sin cebolla' },
  { id:'por_pollo',  cat:'porciones', n:'Pollo al horno con papas', d:'Con romero y limón' },
  // al paso
  { id:'paso_mila',  cat:'alpaso', n:'Sándwich de milanesa', d:'En pan francés o árabe' },
  { id:'paso_tost',  cat:'alpaso', n:'Tostado de jamón y queso', d:'De miga o en pan de molde' },
  { id:'paso_pebete',cat:'alpaso', n:'Pebete de jamón y queso', d:'Con tomate y mayonesa' },
  { id:'paso_lomito',cat:'alpaso', n:'Lomito completo', d:'Con huevo, lechuga y tomate' },
  // ensaladas
  { id:'ens_cesar',  cat:'ensaladas', n:'César',           d:'Pollo, croutones y parmesano' },
  { id:'ens_mixta',  cat:'ensaladas', n:'Mixta',           d:'Lechuga, tomate y cebolla' },
  { id:'ens_rusa',   cat:'ensaladas', n:'Rusa',            d:'Con mayonesa hecha en casa' },
  { id:'ens_caprese',cat:'ensaladas', n:'Caprese',         d:'Tomate, muzzarella y albahaca' },
  { id:'ens_waldorf',cat:'ensaladas', n:'Waldorf',         d:'Manzana, apio y nueces' },
  { id:'ens_quinoa', cat:'ensaladas', n:'Quinoa y vegetales', d:'Fresca, sin carne' },
  // postre
  { id:'dul_lemon',  cat:'dulces', n:'Lemon pie',        d:'Merengue quemado arriba' },
  { id:'dul_pasta',  cat:'dulces', n:'Pastafrola',       d:'De membrillo o batata' },
  { id:'dul_manzana',cat:'dulces', n:'Tarta de manzana', d:'Con canela' },
  { id:'dul_budin',  cat:'dulces', n:'Budín de limón',   d:'Con glaseado' },
  { id:'dul_brownie',cat:'dulces', n:'Brownie con nueces', d:'Húmedo, por porción' }
];

const PRESETS = {
  copetin: ['miga_jq','miga_esp','emp_carne','emp_jq','ens_caprese'],
  oficina: ['miga_triple','tar_verd','por_mila','ens_cesar','dul_brownie'],
  cumple:  ['miga_jq','miga_esp','miga_crudo','emp_carne','emp_humita','ens_rusa','dul_lemon']
};

/* ═══════════ QUÉ HACEMOS (menú sin precios) ═══════════ */
(function menu(){
  const grid = document.getElementById('menuGrid');
  if(!grid) return;

  grid.innerHTML = Object.keys(CATS).map(cat => {
    const items = PRODUCTOS.filter(p => p.cat === cat);
    return `<article class="menu__card reveal">
      <header>
        <h3>${CATS[cat].label}</h3>
        <p class="menu__nota">${CATS[cat].nota}</p>
      </header>
      <ul>${items.map(p => `<li><span>${p.n}</span><small>${p.d}</small></li>`).join('')}</ul>
    </article>`;
  }).join('');
})();

/* ═══════════ ARMÁ TU BANDEJA ═══════════ */
(function bandeja(){
  const picker = document.getElementById('picker');
  if(!picker) return;

  const $ = id => document.getElementById(id);
  const peopleBox = $('people'), boardList = $('boardList'), boardEmpty = $('boardEmpty');
  const scaleWeight = $('scaleWeight'), balance = $('balance'),
        scalePerson = $('scalePerson'), scaleItems = $('scaleItems');
  const waBtn = $('waPicada');

  let personas = 8;
  const elegidos = new Set();

  Object.keys(CATS).forEach(cat => {
    const items = PRODUCTOS.filter(p => p.cat === cat);
    const g = document.createElement('div');
    g.className = 'picker__group';
    g.innerHTML = `<p class="picker__title">${CATS[cat].label}</p>
      <div class="picker__items">${items.map(p =>
        `<button type="button" class="chip" data-id="${p.id}">
           <span class="chip__plus" aria-hidden="true"></span>${p.n}
         </button>`).join('')}</div>`;
    picker.appendChild(g);
  });

  picker.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if(!chip) return;
    const id = chip.dataset.id;
    elegidos.has(id) ? elegidos.delete(id) : elegidos.add(id);
    sync();
  });

  peopleBox.addEventListener('click', e => {
    const b = e.target.closest('button');
    if(!b) return;
    personas = +b.dataset.n;
    [...peopleBox.children].forEach(x => x.classList.toggle('is-on', x === b));
    sync();
  });

  document.querySelectorAll('[data-preset]').forEach(b => {
    b.addEventListener('click', () => {
      elegidos.clear();
      PRESETS[b.dataset.preset].forEach(id => elegidos.add(id));
      sync();
    });
  });

  /* "24 (2 docenas)" / "18 (docena y media)" */
  const enDocenas = q => {
    const d = q / 12;
    if(d === .5) return 'media docena';
    if(Number.isInteger(d)) return d === 1 ? '1 docena' : d + ' docenas';
    return Math.floor(d) + (Math.floor(d) === 1 ? ' docena y media' : ' docenas y media');
  };

  /* reparte la cantidad de cada categoría entre los productos elegidos */
  function calcular(){
    const porCat = {};
    elegidos.forEach(id => {
      const p = PRODUCTOS.find(x => x.id === id);
      (porCat[p.cat] = porCat[p.cat] || []).push(p);
    });

    const filas = [];
    Object.keys(CATS).forEach(cat => {
      const items = porCat[cat];
      if(!items) return;
      const c = CATS[cat];
      const total = c.porPersona * personas;
      items.forEach(p => {
        let q = total / items.length;
        q = Math.max(c.min, Math.round(q / c.step) * c.step);
        const detalle = c.docena
          ? `${q} ${c.unidad} · ${enDocenas(q)}`
          : `${q} ${q === 1 ? c.unidad.replace(/es$/,'').replace(/s$/,'') : c.unidad}`;
        filas.push({ p, cat, q, detalle, rol:c.rol });
      });
    });
    return filas;
  }

  function sync(){
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', elegidos.has(c.dataset.id)));

    const filas = calcular();
    const unidades = filas.reduce((a,f) => a + f.q, 0);
    const roles = new Set(filas.map(f => f.rol));

    scaleWeight.innerHTML = unidades + '<small>unidades</small>';
    [...balance.children].forEach(li => li.classList.toggle('is-on', roles.has(li.dataset.k)));
    scalePerson.textContent = unidades
      ? '≈ ' + (Math.round(unidades / personas * 10) / 10).toString().replace('.', ',') + ' por persona'
      : '— por persona';
    scaleItems.textContent = filas.length + (filas.length === 1 ? ' producto' : ' productos');

    boardEmpty.style.display = filas.length ? 'none' : 'block';
    boardList.innerHTML = filas.map(f => `
      <li>
        <span class="board__i-name">${f.p.n}<small>${f.detalle}</small></span>
        <button class="board__i-del" type="button" data-del="${f.p.id}" aria-label="Quitar ${f.p.n}">×</button>
      </li>`).join('');

    let txt = `Hola Di Tutto! Quería encargar para ${personas} personas:\n\n`;
    txt += filas.length
      ? filas.map(f => `• ${f.p.n} — ${f.detalle}`).join('\n') +
        '\n\n¿Me confirman si está todo disponible, el precio y para cuándo lo puedo tener?'
      : '¿Me pasan el menú de hoy y me recomiendan qué llevar?';
    waBtn.href = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  }

  boardList.addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if(!b) return;
    elegidos.delete(b.dataset.del);
    sync();
  });

  PRESETS.copetin.forEach(id => elegidos.add(id));
  sync();
})();

/* ═══════════ NAV ═══════════ */
(function nav(){
  const bar = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('navMobile');

  const scroll = () => bar.classList.toggle('is-stuck', window.scrollY > 40);
  scroll();
  window.addEventListener('scroll', scroll, { passive:true });

  burger.addEventListener('click', () => {
    const abierto = menu.classList.toggle('is-open');
    burger.classList.toggle('is-open', abierto);
    burger.setAttribute('aria-expanded', abierto);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', false);
  }));
})();

/* ═══════════ REVEAL ═══════════ */
(function reveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if(!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('is-in'), i * 90);
      io.unobserve(e.target);
    });
  }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });
  items.forEach(i => io.observe(i));
})();

document.getElementById('year').textContent = new Date().getFullYear();
