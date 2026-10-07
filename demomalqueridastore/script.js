(() => {
  'use strict';
  const cfg = window.MALQUERIDA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safeImage = value => {
    if (typeof value !== 'string') return 'media/favicon.svg';
    if (/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(value)) return value;
    try { const url = new URL(value, location.href); return ['http:','https:'].includes(url.protocol) ? url.href : 'media/favicon.svg'; }
    catch { return 'media/favicon.svg'; }
  };
  const previews = [
    {id:'ig-rojo-negro',name:'Rojo & negro',category:'Looks',image:'media/rojo-negro.webp',source:'https://www.instagram.com/p/DeMu0qOx5K1/',description:'Un look rojo y negro de nuestra vidriera, publicado en Instagram. Consultanos por las prendas que lo componen.'},
    {id:'ig-animal-print',name:'Animal print',category:'Vestidos',image:'media/animal-print.webp',source:'https://www.instagram.com/p/DeHu6_pxO2T/',description:'Vestido animal print con blazer claro, tal como se ve en nuestra vidriera. Pedinos las medidas y la disponibilidad de cada prenda.'},
    {id:'ig-rayas',name:'Rayas con actitud',category:'Looks',image:'media/rayas.webp',source:'https://www.instagram.com/p/DeHu6_pxO2T/',description:'Rayas y tonos cálidos en un look publicado en Instagram. Elegí qué prenda te interesa y consultanos por WhatsApp.'},
    {id:'ig-campera',name:'Campera + pantalón blanco',category:'Looks',image:'media/campera.webp',source:'https://www.instagram.com/p/DeHu6_pxO2T/',description:'Una combinación de nuestra vidriera: campera y pantalón blanco. Consultanos por el estado, las medidas y el precio de cada pieza.'},
    {id:'ig-flores',name:'Flores en la vidriera',category:'Vestidos',image:'media/flores.webp',source:'https://www.instagram.com/p/DeHu6_pxO2T/',description:'Un conjunto con estampado floral publicado en la vidriera de MalqueridaStore. Pedinos más fotos, medidas y detalles antes de comprar.'}
  ].map(p => ({...p,preview:true,price:null,unavailable:false}));
  let products=[],visible=[],selected=new Set(),category='Todo',loadState='loading',toastTimer,lastTrigger=null,loading=false;
  const storeKey='malquerida-perchero-v1-'+(cfg.slug || 'instagram');
  try { const saved=JSON.parse(localStorage.getItem(storeKey) || '[]'); if(Array.isArray(saved)) selected=new Set(saved.filter(x=>typeof x==='string').slice(0,60)); } catch {}
  const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3 12C-3 4 7 0 12 7c5-7 15-3 9 5Z"/></svg>';
  const currency = p => p.price===null || p.price<=0 ? 'A consultar' : new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2}).format(p.price);
  const photoUrl = p => new URL(p.image, 'https://tusitiowebya.github.io/demomalqueridastore/').href;
  const messageFor = list => {
    let text='Hola, MalqueridaStore. '+(list.length ? 'Me interesan estas prendas:' : 'Quiero consultar por las prendas disponibles.');
    list.forEach((p,i)=>{text+='\n\n'+(i+1)+'. '+p.name;if(p.preview)text+='\nVista en Instagram (a confirmar disponibilidad):\n'+p.source+'\nFoto: '+photoUrl(p);else text+='\nReferencia: '+p.id+'\nPrecio publicado: '+currency(p);});
    if(list.length)text+='\n\n¿Me confirman disponibilidad, precio, talle, medidas y estado?';
    const w=$('#measureWidth').value,l=$('#measureLength').value;
    if((w && Number(w)>0 && Number(w)<=200)||(l && Number(l)>0 && Number(l)<=250)){
      text+='\n\nMedidas de una prenda superior mía, extendida sobre una mesa:';
      if(w && Number(w)>0 && Number(w)<=200)text+='\nAncho de axila a axila: '+w+' cm.';
      if(l && Number(l)>0 && Number(l)<=250)text+='\nLargo de hombro a ruedo: '+l+' cm.';
      text+='\n¿Podemos comparar las medidas?';
    }
    const note=$('#customerNote').value.trim();if(note)text+='\n\nMi consulta: '+note;
    return text;
  };
  const wa = text => 'https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(text);
  const listSelected = () => products.filter(p=>selected.has(p.id));
  const showToast = text => {clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,2600);};
  function persist(){try{localStorage.setItem(storeKey,JSON.stringify([...selected]));}catch{}}
  function updateMessage(){const message=messageFor(listSelected());$('#messagePreview').textContent=message;$('#selectionWhatsApp').href=wa(message);}
  function updateSelection(){
    const list=listSelected();$$('[data-count]').forEach(e=>e.textContent=list.length);$('#selectionDock').hidden=!list.length;
    $('#selectionRows').innerHTML=list.length ? list.map(p=>`<article class="selection-row"><img src="${esc(p.image)}" width="65" height="80" alt="${esc(p.name)}"><div><h3>${esc(p.name)}</h3><p>${p.preview?'Vista en Instagram · a confirmar':esc(currency(p))}</p></div><button data-remove="${esc(p.id)}" aria-label="Quitar ${esc(p.name)}">×</button></article>`).join('') : '<p class="empty-selection">Tu perchero está esperando un flechazo. Guardá las prendas con el corazón del carrusel.</p>';
    $('#clearSelection').hidden=!list.length;$('#selectionWhatsApp').firstChild.textContent=list.length?'Consultar mi perchero ':'Consultar prendas disponibles ';
    $$('[data-favorite]').forEach(button=>{const p=products.find(p=>p.id===button.dataset.favorite);if(!p)return;button.setAttribute('aria-pressed',String(selected.has(p.id)));button.setAttribute('aria-label',(selected.has(p.id)?'Quitar ':'Guardar ')+p.name+' en mi perchero');});
    const save=$('[data-detail-save]');if(save){const yes=selected.has(save.dataset.detailSave);save.textContent=yes?'♡ Guardada · quitar de mi perchero':'♡ Guardar en mi perchero';save.setAttribute('aria-pressed',String(yes));}
    updateMessage();
  }
  function toggleFavorite(id){const p=products.find(p=>p.id===id);if(!p || p.unavailable)return;const has=selected.has(id);if(has)selected.delete(id);else selected.add(id);persist();updateSelection();showToast(has?'Prenda quitada de tu perchero.':'Un flechazo más en tu perchero.');}
  function renderCategories(){
    const cats=['Todo',...new Set(products.map(p=>p.category))];
    if(!cats.includes(category))category='Todo';
    $('#categoryTabs').innerHTML=cats.map(c=>`<button data-category="${esc(c)}" aria-pressed="${c===category}">${esc(c)}</button>`).join('');
  }
  function state(kind,text,canRetry=false){loadState=kind;$('#catalogState').hidden=false;$('#catalogState').innerHTML=`<p>${esc(text)}</p>${canRetry?'<button data-retry>Volver a intentar</button>':''}`;$('#products').innerHTML='';$('#prevProduct').disabled=true;$('#nextProduct').disabled=true;$('#carouselPosition').textContent='— / —';}
  function renderProducts(){
    if(loadState!=='ready')return;
    const q=normalize($('#search').value.trim());visible=products.filter(p=>(category==='Todo'||p.category===category)&&normalize(p.name+' '+p.category+' '+p.description).includes(q));
    $('#catalogState').hidden=!!visible.length;
    if(!visible.length)$('#catalogState').innerHTML='<p>No encontramos prendas con esa búsqueda.</p><button data-reset>Ver todas las prendas</button>';
    $('#products').innerHTML=visible.map((p,i)=>`<article class="product"><button class="product-art" data-detail="${esc(p.id)}" aria-label="Ver ficha de ${esc(p.name)}"><img src="${esc(p.image)}" width="600" height="800" loading="lazy" alt="${esc(p.name)}${p.preview?', foto publicada por MalqueridaStore en Instagram':''}"><span class="product-index">${String(i+1).padStart(2,'0')} / ${esc(p.category)}</span></button><button class="favorite" data-favorite="${esc(p.id)}" aria-pressed="${selected.has(p.id)}" aria-label="Guardar ${esc(p.name)} en mi perchero" ${p.unavailable?'disabled':''}>${heart}</button><div class="product-meta"><div><h3>${esc(p.name)}</h3><p>${p.preview?'VISTA EN INSTAGRAM':p.unavailable?'SIN STOCK':'CATÁLOGO ACTUAL'}</p></div><span class="product-price">${esc(currency(p))}</span></div><a class="product-cta" href="${esc(wa(messageFor([p])))}" target="_blank" rel="noopener noreferrer">Consultar esta prenda <span aria-hidden="true">↗</span></a></article>`).join('');
    $('#products').scrollLeft=0;updateSelection();requestAnimationFrame(updateCarousel);
  }
  function updateCarousel(){
    const rail=$('#products'),cards=$$('.product');const max=rail.scrollWidth-rail.clientWidth;
    const index=cards.length ? Math.min(cards.length-1,Math.max(0,Math.round(rail.scrollLeft/(cards[0].offsetWidth+18)))) : 0;
    $('#carouselPosition').textContent=cards.length?String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0'):'00 / 00';
    $('#prevProduct').disabled=rail.scrollLeft<2 || !cards.length;$('#nextProduct').disabled=rail.scrollLeft>=max-2 || !cards.length;
  }
  function moveCarousel(dir){const card=$('.product');if(card)$('#products').scrollBy({left:dir*(card.offsetWidth+18),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  function openDialog(id){const dialog=$('#'+id);lastTrigger=document.activeElement;if(!dialog.open)dialog.showModal();}
  function closeDialog(id){$('#'+id).close();if(lastTrigger?.isConnected)lastTrigger.focus();}
  function detail(id){
    const p=products.find(p=>p.id===id);if(!p)return;
    $('#productDetail').innerHTML=`<div class="product-detail-layout"><img class="product-detail-photo" src="${esc(p.image)}" width="600" height="800" alt="${esc(p.name)}"><div class="product-detail-copy"><p class="eyebrow">${p.preview?'DE NUESTRA VIDRIERA / INSTAGRAM':'MALQUERIDASTORE / CATÁLOGO'}</p><h2 id="productTitle">${esc(p.name)}</h2><p>${esc(p.description)}</p><dl class="detail-fields"><div><dt>PRECIO</dt><dd>${esc(currency(p))}</dd></div><div><dt>DISPONIBILIDAD</dt><dd>${p.unavailable?'Sin stock':'A confirmar'}</dd></div><div><dt>TALLE Y MEDIDAS</dt><dd>Pedinos los detalles</dd></div><div><dt>ESTADO</dt><dd>Consultanos</dd></div></dl><p>${p.preview?'Foto real de una publicación. Puede mostrar varias prendas: contanos cuál te gustó. La publicación no confirma stock actual.':'Consultá los detalles de la prenda antes de comprar. Guardarla en tu perchero no reserva stock.'}</p><a class="button" href="${esc(wa(messageFor([p])))}" target="_blank" rel="noopener noreferrer">Consultar esta prenda <span aria-hidden="true">↗</span></a><button class="detail-save" data-detail-save="${esc(p.id)}" aria-pressed="${selected.has(p.id)}" ${p.unavailable?'disabled':''}>♡ Guardar en mi perchero</button>${p.source?`<a class="source-link" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Ver la publicación original ↗</a>`:''}</div></div>`;
    updateSelection();openDialog('productDialog');
  }
  async function loadCatalog(){
    if(loading)return;loading=true;$('#categoryTabs').innerHTML='';
    state('loading','Buscando tus próximos flechazos…');
    if(!cfg.slug){products=previews;loadState='ready';loading=false;renderCategories();renderProducts();return;}
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),cfg.timeoutMs);
    try{
      const response=await fetch(cfg.api+'/catalogo/'+encodeURIComponent(cfg.slug),{signal:controller.signal,credentials:'omit'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();if(!Array.isArray(data.productos))throw new Error('Respuesta inválida');
      products=data.productos.filter(p=>p && p._id && p.nombre && p.activo!==false).map(p=>({id:String(p._id),name:String(p.nombre),category:String(p.categoria||'Prendas'),description:String(p.descripcion||'Consultanos por los detalles, las medidas y el estado de esta prenda.'),image:safeImage(p.foto),price:p.precio!==null&&p.precio!==undefined&&p.precio!==''&&Number.isFinite(Number(p.precio))&&Number(p.precio)>=0?Number(p.precio):null,unavailable:p.controlaStock===true && p.stock!==null && p.stock!==undefined && Number.isFinite(Number(p.stock)) && Number(p.stock)<=0,preview:false}));
      const ids=new Set(products.map(p=>p.id));selected=new Set([...selected].filter(id=>ids.has(id)));persist();updateSelection();
      $('#catalogNote').textContent='Catálogo del negocio. Consultá disponibilidad, medidas, estado y condiciones antes de comprar.';
      if(!products.length){state('empty','Estamos preparando nuevas prendas para el catálogo. Escribinos por WhatsApp para ver lo disponible.');return;}
      loadState='ready';renderCategories();renderProducts();
    }catch(error){products=[];selected.clear();updateSelection();state('error',error.name==='AbortError'?'El catálogo tardó más de lo esperado. Volvé a intentar o consultanos por WhatsApp.':'No pudimos cargar las prendas. Volvé a intentar o escribinos por WhatsApp.',true);}
    finally{clearTimeout(timer);loading=false;}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button)return;
    if(button.hasAttribute('data-favorite'))toggleFavorite(button.dataset.favorite);
    if(button.hasAttribute('data-detail-save'))toggleFavorite(button.dataset.detailSave);
    if(button.hasAttribute('data-detail'))detail(button.dataset.detail);
    if(button.hasAttribute('data-remove')){selected.delete(button.dataset.remove);persist();updateSelection();renderProducts();}
    if(button.hasAttribute('data-open-selection')){updateSelection();openDialog('selectionDialog');}
    if(button.hasAttribute('data-close'))closeDialog(button.dataset.close);
    if(button.hasAttribute('data-category')){category=button.dataset.category;renderCategories();renderProducts();}
    if(button.hasAttribute('data-retry'))loadCatalog();
    if(button.hasAttribute('data-reset')){category='Todo';$('#search').value='';renderCategories();renderProducts();}
  });
  $$('#productDialog,#selectionDialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d.id);}}));
  $('#clearSelection').addEventListener('click',()=>{selected.clear();persist();updateSelection();showToast('Tu perchero quedó vacío.');});
  $('#search').addEventListener('input',renderProducts);$('#products').addEventListener('scroll',updateCarousel,{passive:true});
  $('#products').addEventListener('keydown',e=>{if(e.target!==$('#products'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveCarousel(e.key==='ArrowRight'?1:-1);}});
  $('#prevProduct').addEventListener('click',()=>moveCarousel(-1));$('#nextProduct').addEventListener('click',()=>moveCarousel(1));window.addEventListener('resize',updateCarousel);
  $$('#customerNote,#measureWidth,#measureLength').forEach(input=>input.addEventListener('input',()=>{const invalid=[$('#measureWidth'),$('#measureLength')].some(i=>i.value && !i.validity.valid);$('#selectionStatus').textContent=invalid?'Revisá las medidas: usá valores positivos en centímetros, en pasos de 0,5.':'';updateMessage();}));
  $('#selectionWhatsApp').addEventListener('click',e=>{const bad=[$('#measureWidth'),$('#measureLength')].find(i=>i.value && !i.validity.valid);if(bad){e.preventDefault();bad.reportValidity();}});
  const menu=$('.menu-button'),nav=$('#navigation');
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.classList.remove('is-open');};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('is-open',open);});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  const video=$('#heroVideo'),control=$('#videoControl'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let manuallyPaused=reduce.matches;
  const syncVideo=()=>{control.textContent=video.paused?'▶':'Ⅱ';control.setAttribute('aria-label',video.paused?'Reproducir video':'Pausar video');};
  video.addEventListener('pause',syncVideo);video.addEventListener('play',syncVideo);
  control.addEventListener('click',()=>{manuallyPaused=!video.paused;if(video.paused)video.play().catch(()=>{});else video.pause();});
  if(reduce.matches)video.pause();else video.play().catch(()=>{});
  new IntersectionObserver(entries=>{if(entries[0].isIntersecting && !manuallyPaused)video.play().catch(()=>{});else video.pause();},{threshold:.08}).observe(video);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!manuallyPaused && video.getBoundingClientRect().bottom>0)video.play().catch(()=>{});});
  $$('.footer [data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  if(new URLSearchParams(location.search).has('qa'))document.body.classList.add('qa');
  if(!reduce.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('is-pending');observer.unobserve(e.target);}}),{threshold:.05});$$('.section-heading,.circular-copy,.buy-title,.visit-info,.faq>div:first-child').forEach(e=>{e.classList.add('reveal','is-pending');observer.observe(e);});}
  window.addEventListener('storage',event=>{if(event.key===storeKey){try{const s=JSON.parse(event.newValue||'[]');if(Array.isArray(s)){selected=new Set(s.filter(id=>products.some(p=>p.id===id)));updateSelection();}}catch{}}});
  loadCatalog();
})();
