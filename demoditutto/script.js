/* ═══════════════════════════════════════════════
   DI TUTTO — Fiambrería & Almacén
   Mostrador dinámico + armador de picadas
   ═══════════════════════════════════════════════ */

const WA = '5491144440620';

/* ── Catálogo (fuente única: alimenta el mostrador y la picada) ── */
const CATS = {
  fiambres:    { label:'Fiambres',    gramos:90 },
  quesos:      { label:'Quesos',      gramos:80 },
  conservas:   { label:'Conservas',   gramos:60 },
  panificados: { label:'Panificados', gramos:50 },
  bebidas:     { label:'Bebidas',     gramos:0  }
};

const PRODUCTOS = [
  // fiambres
  { id:'crudo',      cat:'fiambres', n:'Jamón crudo estacionado', d:'12 meses · feteado fino', p:41900, u:'kg', tag:'El más pedido' },
  { id:'cocido',     cat:'fiambres', n:'Jamón cocido natural',    d:'Sin fécula, corte a cuchillo', p:14800, u:'kg' },
  { id:'salame',     cat:'fiambres', n:'Salame de Tandil',        d:'Con denominación de origen', p:23500, u:'kg' },
  { id:'bondiola',   cat:'fiambres', n:'Bondiola ahumada',        d:'Ahumada en la casa', p:29900, u:'kg' },
  { id:'mortadela',  cat:'fiambres', n:'Mortadela con pistachos', d:'Italiana, tajada gruesa', p:12400, u:'kg' },
  { id:'lomito',     cat:'fiambres', n:'Lomito ahumado',          d:'Magro, ideal para tabla', p:33500, u:'kg' },
  { id:'salamin',    cat:'fiambres', n:'Salamín picado fino',     d:'Estacionado 60 días', p:21800, u:'kg' },
  { id:'panceta',    cat:'fiambres', n:'Panceta ahumada',         d:'En bloque o feteada', p:18600, u:'kg' },
  // quesos
  { id:'provolone',  cat:'quesos', n:'Provolone estacionado',  d:'Estacionado en nuestra cámara', p:26900, u:'kg', tag:'De la casa' },
  { id:'azul',       cat:'quesos', n:'Queso azul',             d:'Cremoso, veta pareja', p:31500, u:'kg' },
  { id:'gruyere',    cat:'quesos', n:'Gruyère',                d:'Importado, horma entera', p:34900, u:'kg' },
  { id:'sardo',      cat:'quesos', n:'Sardo estacionado',      d:'Para rallar o cortar en cubos', p:24500, u:'kg' },
  { id:'cremoso',    cat:'quesos', n:'Cremoso artesanal',      d:'De tambo de Suipacha', p:13900, u:'kg' },
  { id:'brie',       cat:'quesos', n:'Brie',                   d:'Corteza blanca, bien maduro', p:38000, u:'kg' },
  { id:'pategras',   cat:'quesos', n:'Pategrás',               d:'Semiduro clásico', p:22400, u:'kg' },
  { id:'reggianito', cat:'quesos', n:'Reggianito',             d:'Estacionado 9 meses', p:33800, u:'kg' },
  // conservas
  { id:'aceitunas',  cat:'conservas', n:'Aceitunas griegas',      d:'En salmuera con hierbas', p:9800,  u:'kg' },
  { id:'berenjenas', cat:'conservas', n:'Berenjenas en aceite',   d:'Receta de la casa', p:12900, u:'kg' },
  { id:'pickles',    cat:'conservas', n:'Pickles caseros',        d:'Agridulces, bien crocantes', p:8400,  u:'kg' },
  { id:'tomates',    cat:'conservas', n:'Tomates secos',          d:'En aceite de oliva y albahaca', p:24500, u:'kg' },
  { id:'frutos',     cat:'conservas', n:'Frutos secos mixtos',    d:'Almendra, castaña y nuez', p:21000, u:'kg' },
  { id:'antipasto',  cat:'conservas', n:'Antipasto de la casa',   d:'Morrón, cebollita y champiñón', p:11600, u:'kg' },
  // panificados
  { id:'pancampo',   cat:'panificados', n:'Pan de campo',           d:'Masa madre, horneado a la mañana', p:6900,  u:'kg' },
  { id:'grisines',   cat:'panificados', n:'Grisines artesanales',   d:'Con semillas de sésamo', p:9200,  u:'kg' },
  { id:'focaccia',   cat:'panificados', n:'Focaccia con romero',    d:'Aceite de oliva y sal gruesa', p:11400, u:'kg' },
  { id:'tostaditas', cat:'panificados', n:'Tostaditas de masa madre', d:'Finitas, para untar', p:10800, u:'kg' },
  // bebidas
  { id:'malbec',     cat:'bebidas', n:'Malbec de bodega chica', d:'Valle de Uco · 750 ml', p:12500, u:'u' },
  { id:'vermut',     cat:'bebidas', n:'Vermut rosso',           d:'Argentino · 1 litro', p:9800,  u:'u' },
  { id:'ipa',        cat:'bebidas', n:'Cerveza artesanal IPA',  d:'Botella 500 ml', p:3900,  u:'u' },
  { id:'tonica',     cat:'bebidas', n:'Agua tónica premium',    d:'Botella 500 ml', p:2400,  u:'u' }
];

const PRESETS = {
  clasica: ['cocido','salame','mortadela','cremoso','pategras','aceitunas','grisines'],
  premium: ['crudo','bondiola','lomito','provolone','azul','tomates','focaccia','malbec'],
  quesos:  ['provolone','azul','gruyere','sardo','brie','reggianito','tostaditas']
};

const money = n => '$' + Math.round(n).toLocaleString('es-AR');

/* ═══════════ MOSTRADOR ═══════════ */
(function mostrador(){
  const tabs = document.getElementById('tabs');
  const grid = document.getElementById('counterGrid');
  if(!tabs || !grid) return;

  const cats = ['todo', ...Object.keys(CATS)];
  let activa = 'todo';

  cats.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c === 'todo' ? 'Ver todo' : CATS[c].label;
    b.dataset.cat = c;
    if(c === activa) b.classList.add('is-on');
    b.addEventListener('click', () => {
      activa = c;
      [...tabs.children].forEach(x => x.classList.toggle('is-on', x.dataset.cat === c));
      pintar();
    });
    tabs.appendChild(b);
  });

  function pintar(){
    const lista = activa === 'todo' ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === activa);
    grid.innerHTML = lista.map((p,i) => `
      <article class="prod" style="animation-delay:${Math.min(i*25,400)}ms">
        <div class="prod__name">${p.n}<small>${p.d}</small></div>
        ${p.tag ? `<span class="prod__tag">${p.tag}</span>` : ''}
        <span class="prod__dots"></span>
        <span class="prod__price">${money(p.p)} <small>/ ${p.u}</small></span>
      </article>`).join('');
  }
  pintar();
})();

/* ═══════════ ARMÁ TU PICADA ═══════════ */
(function picada(){
  const picker = document.getElementById('picker');
  if(!picker) return;

  const $ = id => document.getElementById(id);
  const peopleBox = $('people'), boardList = $('boardList'), boardEmpty = $('boardEmpty');
  const scaleWeight = $('scaleWeight'), scaleBar = $('scaleBar'),
        scalePerson = $('scalePerson'), scaleItems = $('scaleItems');
  const totalVal = $('totalVal'), totalPer = $('totalPer'), waBtn = $('waPicada');

  let personas = 4;
  const elegidos = new Set();

  /* chips por categoría */
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

  /* reparte el gramaje de cada categoría entre los productos elegidos */
  function calcular(){
    const porCat = {};
    elegidos.forEach(id => {
      const p = PRODUCTOS.find(x => x.id === id);
      (porCat[p.cat] = porCat[p.cat] || []).push(p);
    });

    const filas = [];
    Object.keys(porCat).forEach(cat => {
      const items = porCat[cat];
      if(cat === 'bebidas'){
        const unidades = Math.max(1, Math.ceil(personas / 4));
        items.forEach(p => filas.push({ p, cant:unidades, gramos:0, sub:unidades * p.p, detalle:`${unidades} ${unidades===1?'botella':'botellas'}` }));
        return;
      }
      const total = CATS[cat].gramos * personas;
      items.forEach(p => {
        const g = Math.max(50, Math.round(total / items.length / 25) * 25);
        filas.push({ p, gramos:g, sub:g / 1000 * p.p, detalle:`${g} g` });
      });
    });

    return filas.sort((a,b) => Object.keys(CATS).indexOf(a.p.cat) - Object.keys(CATS).indexOf(b.p.cat));
  }

  function sync(){
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', elegidos.has(c.dataset.id)));

    const filas = calcular();
    const gramos = filas.reduce((a,f) => a + f.gramos, 0);
    const total  = filas.reduce((a,f) => a + f.sub, 0);

    /* balanza */
    scaleWeight.innerHTML = gramos >= 1000
      ? (gramos/1000).toFixed(2).replace('.', ',') + '<small>kg</small>'
      : gramos + '<small>g</small>';
    const ideal = 280 * personas;
    scaleBar.style.width = Math.min(100, gramos / ideal * 100) + '%';
    scalePerson.textContent = gramos ? Math.round(gramos / personas) + ' g por persona' : '— por persona';
    scaleItems.textContent = filas.length + (filas.length === 1 ? ' producto' : ' productos');

    /* tabla */
    boardEmpty.style.display = filas.length ? 'none' : 'block';
    boardList.innerHTML = filas.map(f => `
      <li>
        <span class="board__i-name">${f.p.n}<small>${f.detalle}</small></span>
        <span class="board__i-price">${money(f.sub)}</span>
        <button class="board__i-del" type="button" data-del="${f.p.id}" aria-label="Quitar ${f.p.n}">×</button>
      </li>`).join('');

    totalVal.textContent = money(total);
    totalPer.textContent = filas.length ? money(total / personas) + ' por persona' : 'Elegí productos para ver el total';

    /* whatsapp */
    let txt = `Hola Di Tutto! Quería encargar una picada para ${personas} personas:\n\n`;
    txt += filas.length
      ? filas.map(f => `• ${f.p.n} — ${f.detalle}`).join('\n') + `\n\nEstimado: ${money(total)}\n\n¿Me confirman precio y cuándo la puedo retirar?`
      : 'Quería que me recomienden qué llevar.';
    waBtn.href = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  }

  boardList.addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if(!b) return;
    elegidos.delete(b.dataset.del);
    sync();
  });

  /* arranca con la picada clásica cargada */
  PRESETS.clasica.forEach(id => elegidos.add(id));
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
