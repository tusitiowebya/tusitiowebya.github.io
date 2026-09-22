(function(){
  const WA='5491151584854';
  const key='robypesca_consulta';
  const products=window.ROBY_PRODUCTS||[];
  const categories=window.ROBY_CATEGORIES||[];
  const catalog=document.querySelector('[data-catalog]');
  const preview=document.querySelector('[data-preview]');
  const drawer=document.querySelector('[data-drawer]');
  let selected=[];
  try { selected=JSON.parse(localStorage.getItem(key)||'[]').filter(id=>products.some(p=>p.id===id)); } catch(e) {}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(selected))}catch(e){}};
  const photo=(p,base='')=>`${base}img/${p.image}`;
  const wa=(message)=>`https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
  const card=(p,base='')=>`<article class="product-card"><div class="product-image"><img src="${photo(p,base)}" alt="Imagen ilustrativa de ${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div><div class="product-content"><span class="product-type">${categories.find(c=>c.id===p.category)?.label||''}</span><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price-note">Precio a consultar</span><button class="add-button ${selected.includes(p.id)?'is-added':''}" data-add="${p.id}" aria-label="${selected.includes(p.id)?'Quitar':'Agregar'} ${p.name} ${selected.includes(p.id)?'de':'a'} la consulta">${selected.includes(p.id)?'✓ Agregado':'+ Consultar'}</button></div></div></article>`;
  function renderPreview(){if(preview)preview.innerHTML=products.slice(0,3).map(p=>card(p)).join('');}
  let filter='todos',query='';
  function renderCatalog(){
    if(!catalog)return;
    const found=products.filter(p=>(filter==='todos'||p.category===filter)&&(`${p.name} ${p.description} ${p.category}`).toLocaleLowerCase('es').includes(query));
    catalog.innerHTML=found.length?found.map(p=>card(p,'../')).join(''):'<div class="empty-state"><h3>No encontramos esa búsqueda.</h3><p>Probá con otro término o consultanos directamente.</p><a class="text-link" href="'+wa('Hola RobyPesca, busco un producto para pesca o camping.')+'" target="_blank" rel="noopener">Consultar por WhatsApp ↗</a></div>';
    document.querySelector('[data-results]').textContent=`${found.length} ${found.length===1?'producto de ejemplo':'productos de ejemplo'}`;
    document.querySelectorAll('[data-filter]').forEach(b=>{let active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  function renderDrawer(){
    const body=document.querySelector('[data-drawer-items]');if(!body)return;
    body.innerHTML=selected.length?selected.map(id=>{const p=products.find(x=>x.id===id);return `<div class="drawer-item"><img src="${photo(p,document.body.dataset.page==='catalog'?'../':'')}" alt=""><span>${p.name}<small>${categories.find(c=>c.id===p.category)?.label}</small></span><button data-remove="${p.id}" aria-label="Quitar ${p.name}">×</button></div>`}).join(''):'<p class="drawer-empty">Tu lista está vacía. Agregá lo que te interese y consultá todo junto.</p>';
    document.querySelectorAll('[data-count]').forEach(el=>el.textContent=selected.length);
    const send=document.querySelector('[data-send]');
    if(send){send.href=wa(selected.length?'Hola RobyPesca, me interesan estos productos de la web:\n'+selected.map((id,i)=>`${i+1}. ${products.find(p=>p.id===id).name}`).join('\n')+'\n¿Me contás precios y disponibilidad?':'Hola RobyPesca, quisiera consultar por artículos de pesca y camping.');send.textContent=selected.length?'Enviar consulta por WhatsApp ↗':'Consultar por WhatsApp ↗';}
  }
  function refresh(){renderPreview();renderCatalog();renderDrawer();}
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add;selected=selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];save();refresh();if(selected.includes(id))openDrawer();return;}
    const remove=e.target.closest('[data-remove]');if(remove){selected=selected.filter(x=>x!==remove.dataset.remove);save();refresh();return;}
    if(e.target.closest('[data-open-drawer]')){openDrawer();return;}
    if(e.target.closest('[data-close-drawer]')||e.target===drawer){closeDrawer();return;}
    const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;const url=new URL(location.href);url.searchParams.set('r',filter);history.replaceState(null,'',url);renderCatalog();return;}
  });
  function openDrawer(){if(!drawer)return;drawer.hidden=false;document.body.classList.add('drawer-open');drawer.querySelector('[data-close-drawer]').focus();}
  function closeDrawer(){if(!drawer)return;drawer.hidden=true;document.body.classList.remove('drawer-open');}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});
  const search=document.querySelector('[data-search]');if(search)search.addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('es');renderCatalog();});
  const initial=new URLSearchParams(location.search).get('r');if(initial&&categories.some(c=>c.id===initial))filter=initial;
  refresh();
  const observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');observer.unobserve(x.target)}}),{threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(x=>observer.observe(x));
})();
