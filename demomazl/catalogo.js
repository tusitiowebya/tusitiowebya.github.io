(function(){
  'use strict';
  const cfg=window.MAZL;
  const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
  const wa=message=>'https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(message);
  const safeImage=value=>typeof value==='string'&&(/^(https:\/\/|data:image\/(?:jpeg|png|webp|gif);base64,)/i).test(value)?value:'';
  let products=[];
  let state='loading';
  let loadPromise;
  const cartKey='mazl-cart-v1';
  const getCart=()=>{try{return JSON.parse(localStorage.getItem(cartKey))||{}}catch{return {}}};
  const saveCart=cart=>{try{localStorage.setItem(cartKey,JSON.stringify(cart))}catch{}};
  function normalize(raw){return {id:String(raw._id||''),name:String(raw.nombre||''),description:String(raw.descripcion||''),category:String(raw.categoria||'Tecnología'),price:Number(raw.precio)||0,image:safeImage(raw.foto),stock:Number(raw.stock),controlStock:Boolean(raw.controlaStock),type:String(raw.tipo||'fisico')};}
  async function load(force=false){
    if(loadPromise&&!force)return loadPromise;
    state='loading';
    if(!cfg.slug){state='unavailable';products=[];loadPromise=Promise.resolve(products);return loadPromise}
    loadPromise=(async()=>{
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
      try{
        const response=await fetch(cfg.api+'/catalogo/'+encodeURIComponent(cfg.slug),{signal:controller.signal});
        if(response.status===404){state='unavailable';products=[];return products}
        if(!response.ok)throw Error('HTTP '+response.status);
        const data=await response.json();
        products=Array.isArray(data.productos)?data.productos.filter(p=>p&&p.activo!==false).map(normalize).filter(p=>p.id&&p.name):[];
        state=products.length?'ready':'empty';
        return products;
      }catch{state='error';products=[];return products}
      finally{clearTimeout(timer)}
    })();
    return loadPromise;
  }
  function statusHTML(){
    if(state==='loading')return 'Cargando productos…';
    if(state==='empty')return '<strong>Pronto habrá productos publicados.</strong><br>Mientras tanto, consultanos por lo que buscás. <a href="'+wa('Hola MAZL.COM, quisiera consultar disponibilidad de un producto tecnológico.')+'" target="_blank" rel="noopener">Escribir por WhatsApp ↗</a>';
    if(state==='unavailable')return '<strong>El catálogo online se está preparando.</strong><br>Consultanos disponibilidad por WhatsApp. <a href="'+wa('Hola MAZL.COM, quisiera consultar disponibilidad de un producto tecnológico.')+'" target="_blank" rel="noopener">Consultar ↗</a>';
    return '<strong>No pudimos cargar el catálogo ahora.</strong><br>Podés consultarnos por WhatsApp o volver a intentar. <button class="retry-catalog" type="button">Reintentar</button>';
  }
  function card(product,action='link'){
    const article=document.createElement('article');article.className='product-card';
    const image=document.createElement('div');image.className='product-card-image';
    if(product.image){const img=document.createElement('img');img.src=product.image;img.alt=product.name;img.loading='lazy';image.append(img)}
    else{const marker=document.createElement('span');marker.className='image-placeholder';marker.textContent='M';image.append(marker)}
    const body=document.createElement('div');body.className='product-card-body';
    const category=document.createElement('small');category.textContent=product.category;
    const heading=document.createElement('h3');heading.textContent=product.name;
    const foot=document.createElement('div');foot.className='product-card-footer';
    const price=document.createElement('strong');price.textContent=product.price>0?money(product.price):'Consultar precio';
    const canOrder=action==='cart'&&product.price>0&&(!product.controlStock||product.stock>0);
    const button=document.createElement(canOrder?'button':'a');
    button.textContent=canOrder?'Sumar +':product.controlStock&&product.stock<=0?'Consultar stock ↗':'Consultar ↗';
    if(canOrder){button.type='button';button.className='add-product';button.dataset.id=product.id}
    else{button.href=wa('Hola MAZL.COM, quisiera consultar por '+product.name+'.');button.target='_blank';button.rel='noopener'}
    foot.append(price,button);body.append(category,heading,foot);article.append(image,body);return article;
  }
  function bindRetry(container,render){container.querySelector('.retry-catalog')?.addEventListener('click',async()=>{container.textContent='Cargando productos…';await load(true);render()})}
  window.MazlCatalog={load,card,money,wa,statusHTML,bindRetry,getCart,saveCart,get products(){return products},get state(){return state}};
})();
