(() => {
  'use strict';
  const store=window.ZonaStore, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const assets=document.body.dataset.assets;
  const esc=s=>String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initial=new URLSearchParams(location.search);
  if(initial.has('qa')) document.documentElement.classList.add('qa');
  let cat=['cursos','ebooks','recetarios','otros'].includes(initial.get('cat'))?initial.get('cat'):'todos';
  let query=initial.get('q') || '',sort=['name','price'].includes(initial.get('sort'))?initial.get('sort'):'default',detailId='',toastTimer;
  $('#search').value=query;$('#sort').value=sort;
  const image=p=>p.image || assets+p.art;
  const price=p=>p.demo?'Ejemplo · consultá el catálogo real':p.price!==null?store.money(p.price):'Precio a consultar';
  function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2300);}
  function addButton(p){const chosen=store.selected().some(x=>x.id===p.id);const locked=store.pending||store.submitted||store.uncertain||!p.available;return `<button class="product-add${chosen?' selected':''}" data-add="${esc(p.id)}" aria-pressed="${chosen}" ${locked?'disabled':''}>${!p.available?'A consultar':chosen?'En mi selección':'Sumar a mi selección'} <span aria-hidden="true">${chosen?'✓':'＋'}</span></button>`;}
  function fixImages(){ $$('img[data-fallback]').forEach(img=>{img.addEventListener('error',()=>{if(img.dataset.failed)return;img.dataset.failed='1';img.src=img.dataset.fallback;},{once:true});}); }
  function syncUrl(){const u=new URL(location.href);for(const [k,v] of [['cat',cat==='todos'?'':cat],['q',query],['sort',sort==='default'?'':sort]]){if(v)u.searchParams.set(k,v);else u.searchParams.delete(k);}history.replaceState(null,'',u);}
  function renderCatalog(){
    const grid=$('#products'), state=$('#catalogState');
    $$('.filters [data-category]').forEach(b=>{const on=b.dataset.category===cat;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);if(b.dataset.category==='otros')b.hidden=!store.products.some(p=>p.cat==='otros');});
    $('#catalogNotice').hidden=!store.demo;
    state.hidden=true;
    if(store.status==='loading'){grid.innerHTML='<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';$('#resultsCount').textContent='Cargando el catálogo…';return;}
    if(['error','empty'].includes(store.status)){
      grid.innerHTML='';state.hidden=false;$('#resultsCount').textContent='Catálogo';
      state.innerHTML=store.status==='error'?`<h3>Las ideas pueden esperar un momento.</h3><p>${esc(store.error)}</p><button class="button button-cyan" data-retry>Volver a intentar ↗</button>`:'<h3>Se vienen nuevas ideas.</h3><p>El catálogo todavía no tiene productos publicados. Consultanos por los cursos, ebooks y recetarios disponibles.</p>';
      state.innerHTML+=`<p><a class="text-button" href="${store.wa('Hola, Zona Digital. Quiero consultar por tu catálogo de cursos, ebooks y recetarios.')}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a></p>`;return;
    }
    let list=store.products.filter(p=>(cat==='todos'||p.cat===cat)&&store.norm(p.name+' '+p.desc+' '+store.labels[p.cat]+' '+(p.rawCat||'')).includes(store.norm(query)));
    if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'es'));
    if(sort==='price')list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
    $('#resultsCount').textContent=`${list.length} ${store.demo?'ejemplos':'productos'}${cat==='todos'?'':' / '+store.labels[cat]}`;
    grid.innerHTML=list.map(p=>`<article class="product" data-cat="${p.cat}"><button class="product-art" data-detail="${esc(p.id)}" aria-label="Ver ${esc(p.name)}"><img src="${esc(image(p))}" data-fallback="${assets+p.art}" alt="${p.demo?'Portada de ejemplo: ':'Producto: '}${esc(p.name)}" width="400" height="500" loading="lazy">${p.demo?'<span class="example-label">EJEMPLO</span>':''}<span class="detail-arrow" aria-hidden="true">↗</span></button><p class="product-meta"><i aria-hidden="true"></i>${store.labels[p.cat]}</p><h3><button data-detail="${esc(p.id)}">${esc(p.name)}</button></h3><p class="product-price">${esc(price(p))}</p>${addButton(p)}</article>`).join('');
    if(!list.length){state.hidden=false;state.innerHTML='<h3>Busquemos otra idea.</h3><p>No encontramos coincidencias para esta búsqueda.</p><button class="button button-cyan" data-reset>Ver todo el catálogo ↗</button>';}
    fixImages();
  }
  function updateMessage(){
    const message=store.message($('#customerNote').value.trim());
    $('#messagePreview').textContent=message;$('#selectionWhatsApp').href=store.wa(message);
  }
  function renderSelection(){
    const list=store.selected(),locked=store.pending||store.submitted||store.uncertain;
    $$('[data-count]').forEach(el=>el.textContent=list.length);
    $('#selectionDock').hidden=!list.length;$('#dockText').textContent=list.length===1?'idea en tu selección':'ideas en tu selección';
    $('#selectionRows').innerHTML=list.length?list.map(p=>`<div class="selection-row"><img src="${esc(image(p))}" data-fallback="${assets+p.art}" alt="" width="48" height="62"><div><strong>${esc(p.name)}</strong><small>${store.labels[p.cat]} · ${esc(p.demo?'Ejemplo':price(p))}</small></div><button data-add="${esc(p.id)}" aria-label="Quitar ${esc(p.name)}" ${locked?'disabled':''}>×</button></div>`).join(''):'<p class="empty-selection">Tu selección está esperando su primera idea.<br>Explorá el catálogo y sumá lo que te interesa.</p>';
    $('#selectionTotal').textContent=store.total()!==null?store.money(store.total()):'A consultar';
    $('#selectionNote').textContent=store.demo?'Selección de ejemplo. Consultá por los productos reales, el contenido y las condiciones antes de comprar.':'Cada producto se suma una vez. Revisá contenido, precio y modalidad de acceso antes de registrar tu pedido.';
    $('#selectionWhatsApp').setAttribute('aria-disabled',!list.length);
    if(!list.length)$('#selectionWhatsApp').setAttribute('tabindex','-1');else $('#selectionWhatsApp').removeAttribute('tabindex');
    $('#customerFields').hidden=store.demo;
    for(const id of ['customerName','customerPhone','customerEmail'])$('#'+id).required=!store.demo && !!list.length;
    $('#submitOrder').hidden=store.demo||!list.length||store.submitted||store.uncertain;
    $('#submitOrder').disabled=store.pending || list.some(p=>p.price===null||!p.available) || !['ready'].includes(store.status);
    $('#submitOrder').innerHTML=store.pending?'Verificando tu pedido…':'Registrar mi pedido <span aria-hidden="true">↗</span>';
    $('#clearSelection').hidden=!list.length||locked;
    $('#newOrder').hidden=!store.submitted;
    if(store.uncertain && !$('#orderStatus').textContent)$('#orderStatus').textContent='Hay un envío pendiente de confirmación. Consultá por WhatsApp antes de registrar otro pedido.';
    if(store.submitted && !$('#orderStatus').textContent)$('#orderStatus').textContent='Tu pedido ya está registrado. Podés consultar por WhatsApp o preparar otro pedido.';
    $$('#orderForm input,#orderForm textarea').forEach(e=>e.disabled=locked);
    fixImages();updateMessage();
  }
  function renderDetail(){
    if(!detailId)return;const p=store.products.find(p=>p.id===detailId);if(!p){$('#productDialog').close();return;}
    $('#productDetail').innerHTML=`<div class="detail-layout"><div class="detail-image"><img src="${esc(image(p))}" data-fallback="${assets+p.art}" alt="${p.demo?'Portada ilustrativa: ':''}${esc(p.name)}" width="400" height="500"></div><div class="detail-copy"><p class="product-meta">${store.labels[p.cat]}</p><h2 id="productTitle">${esc(p.name)}</h2><p>${esc(p.desc || 'Consultanos por el contenido y cómo recibís este producto digital.')}</p>${p.demo?'<p class="detail-demo">Tema y portada de demostración. Este ejemplo no se ofrece a la venta.</p>':''}<p class="detail-price">${esc(p.demo?'Consultá los títulos reales':price(p))}</p>${addButton(p)}<a class="text-button" href="${store.wa(p.demo?'Hola, Zona Digital. Vi un ejemplo de '+store.labels[p.cat].toLowerCase()+' sobre '+p.name+' en tu demo. ¿Qué productos reales tenés disponibles en ese formato?':'Hola, Zona Digital. Quiero consultar por '+p.name+'. ¿Qué contenido incluye y cómo recibo el material?')}" target="_blank" rel="noopener noreferrer">Consultar por este formato ↗</a></div></div>`;
    fixImages();
  }
  const openers=new Map();
  function openDialog(id){const d=$('#'+id);openers.set(id,document.activeElement);if(!d.open)d.showModal();document.body.classList.add('dialog-open');}
  $$('dialog').forEach(d=>{
    d.addEventListener('close',()=>{if(!$$('dialog[open]').length){document.body.classList.remove('dialog-open');const opener=openers.get(d.id);(opener?.isConnected?opener:$('.library-button')).focus({preventScroll:true});}});
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
  });
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]');if(add){const had=store.selected().some(p=>p.id===add.dataset.add);store.toggle(add.dataset.add);toast(had?'Idea quitada de tu selección':'Idea guardada en tu selección');return;}
    const detail=e.target.closest('[data-detail]');if(detail){detailId=detail.dataset.detail;renderDetail();openDialog('productDialog');return;}
    if(e.target.closest('[data-open-library]')){renderSelection();openDialog('libraryDialog');return;}
    const close=e.target.closest('[data-close-dialog]');if(close){$('#'+close.dataset.closeDialog).close();return;}
    const filter=e.target.closest('[data-category]');if(filter){cat=filter.dataset.category;syncUrl();renderCatalog();return;}
    if(e.target.closest('[data-retry]')){store.load();return;}
    if(e.target.closest('[data-reset]')){cat='todos';query='';$('#search').value='';syncUrl();renderCatalog();}
  });
  $('#search').addEventListener('input',e=>{query=e.target.value;syncUrl();renderCatalog();});
  $('#sort').addEventListener('change',e=>{sort=e.target.value;syncUrl();renderCatalog();});
  $('#customerNote').addEventListener('input',updateMessage);
  $('#clearSelection').addEventListener('click',()=>{store.clear();$('#orderStatus').textContent='';});
    $('#newOrder').addEventListener('click',()=>{store.newOrder();$('#orderStatus').textContent='';$('#paymentLink').hidden=true;$('#deliveryLink').hidden=true;$('#orderForm').reset();updateMessage();});
  $('#orderForm').addEventListener('submit',async e=>{
    e.preventDefault();if(store.demo)return;
    $('#orderStatus').textContent='';
    try{
      const result=await store.order({nombre:$('#customerName').value,telefono:$('#customerPhone').value,email:$('#customerEmail').value,nota:$('#customerNote').value});
      $('#orderStatus').textContent='Tu pedido quedó registrado. Podés consultar por WhatsApp o continuar al pago si está disponible.';
      try{const payment=new URL(result.init_point || result.pago?.init_point || '');if(payment.protocol==='https:'){$('#paymentLink').href=payment.href;$('#paymentLink').hidden=false;}}catch{}
      if(result.entregaToken && /^[A-Za-z0-9_-]+$/.test(result.entregaToken)){$('#deliveryLink').href=window.ZONA_DIGITAL.portal+'/entrega/'+encodeURIComponent(result.entregaToken);$('#deliveryLink').hidden=false;}
    }catch(error){$('#orderStatus').textContent=error.message;}
  });
  document.addEventListener('zona:change',()=>{const focused=document.activeElement;const id=focused?.dataset?.add;const detail=focused?.dataset?.detail;const dialog=focused?.closest('dialog');renderCatalog();renderSelection();renderDetail();if(id||detail){const area=dialog||document;const match=[...area.querySelectorAll(id?'[data-add]':'[data-detail]')].find(x=>id?x.dataset.add===id:x.dataset.detail===detail);match?.focus({preventScroll:true});}});
  const menu=$('.menu-button');
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');$('#nav').classList.toggle('open',open);});
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');$('#nav').classList.remove('open');}
  $$('#nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  $$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  const video=$('#heroVideo'),videoControl=$('#videoControl');
  if(video){const motion=matchMedia('(prefers-reduced-motion:reduce)');const syncVideo=()=>{videoControl.textContent=video.paused?'▷':'Ⅱ';videoControl.setAttribute('aria-label',video.paused?'Reproducir video':'Pausar video');};if(motion.matches)video.pause();video.addEventListener('play',syncVideo);video.addEventListener('pause',syncVideo);videoControl.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>toast('El video no pudo reproducirse.'));else video.pause();});motion.addEventListener('change',()=>{if(motion.matches)video.pause();});syncVideo();}
  const formats={cursos:{code:'CURSO / 01',glyph:'▷',name:'Una nueva habilidad.',desc:'Explorá los cursos y consultá por los temas, el material incluido y la modalidad de cada uno.'},ebooks:{code:'EBOOK / 02',glyph:'≡',name:'Una idea para volver a leer.',desc:'Explorá los ebooks y consultá por su contenido, el formato del archivo y cómo recibirlo.'},recetarios:{code:'RECETARIO / 03',glyph:'✳',name:'Algo nuevo en tu cocina.',desc:'Explorá los recetarios y consultá qué recetas incluyen, su formato y cómo recibir el material.'}};
  $$('[data-format]').filter(b=>b.tagName==='BUTTON').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.format,f=formats[id];$$('.format-choices button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});$('#formatPreview').dataset.format=id;$('#formatCode').textContent=f.code;$('#formatGlyph').textContent=f.glyph;$('#formatLabel').textContent=store.labels[id].toUpperCase();$('#formatName').textContent=f.name;$('#formatDescription').textContent=f.desc;$('#formatLink').href='catalogo/?cat='+id;$('#formatLink').innerHTML='Ver '+store.labels[id].toLowerCase()+' <span aria-hidden="true">↗</span>';}));
  if(!initial.has('qa')&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.documentElement.classList.add('reveal-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
    $$('.format-layout,.buy-heading,.buy-rows article,.closing').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  }
  renderSelection();
  store.load().then(()=>{const id=initial.get('p');if(id&&store.products.some(p=>p.id===id)){detailId=id;renderDetail();openDialog('productDialog');}});
})();
