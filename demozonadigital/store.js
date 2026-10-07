/* Biblioteca compartida entre la portada y /catalogo/. */
(() => {
  'use strict';
  const config = window.ZONA_DIGITAL;
  const demo = !config.slug;
  const key = 'zona-digital:v1:' + (demo ? 'demo' : config.slug);
  const samples = [
    {id:'demo-c1',name:'Marketing digital',cat:'cursos',desc:'Una muestra de cómo se presenta un curso en tu biblioteca digital.',art:'course-1.svg'},
    {id:'demo-e1',name:'Ideas para organizarte',cat:'ebooks',desc:'Una muestra de cómo se presenta un ebook para leer y consultar.',art:'ebook-1.svg'},
    {id:'demo-r1',name:'Cocina de todos los días',cat:'recetarios',desc:'Una muestra de cómo se presenta un recetario digital.',art:'recipe-1.svg'},
    {id:'demo-c2',name:'Creación de contenido',cat:'cursos',desc:'Otra ficha ilustrativa para explorar el formato de cursos.',art:'course-2.svg'},
    {id:'demo-e2',name:'Tu próxima idea',cat:'ebooks',desc:'Otra ficha ilustrativa para explorar el formato de ebooks.',art:'ebook-2.svg'},
    {id:'demo-r2',name:'Algo dulce en casa',cat:'recetarios',desc:'Otra ficha ilustrativa para explorar el formato de recetarios.',art:'recipe-2.svg'}
  ].map(p => ({...p,price:null,demo:true,image:'',available:true}));
  let products = [], status = 'loading', selection = [], pending = false, submitted = false;
  let uncertain = false, lastError = '', lastOrder = null, loading = null;
  try {
    const state=sessionStorage.getItem(key+':order');
    uncertain=state==='uncertain';submitted=state==='confirmed';
    if(submitted)lastOrder={ok:true};
  } catch {}
  const saveOrderState=state=>{try{if(state)sessionStorage.setItem(key+':order',state);else sessionStorage.removeItem(key+':order');}catch{}};
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) selection = stored.filter(x => typeof x === 'string').slice(0,60);
  } catch { selection = []; }
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const labels = {cursos:'Cursos',ebooks:'Ebooks',recetarios:'Recetarios',otros:'Otros formatos'};
  const category = raw => {
    const n = norm(raw);
    if (n.includes('recet') || n.includes('cocina') || n.includes('repost')) return 'recetarios';
    if (n.includes('ebook') || n.includes('e-book') || n.includes('libro')) return 'ebooks';
    if (n.includes('curso') || n.includes('capacit') || n.includes('taller')) return 'cursos';
    return 'otros';
  };
  const safeImage = value => {
    if (typeof value !== 'string') return '';
    if (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(value)) return value;
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
  };
  const money = value => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2}).format(value);
  const map = p => ({id:String(p._id || ''),name:String(p.nombre || 'Producto digital'),desc:String(p.descripcion || ''),
    cat:category(p.categoria),rawCat:String(p.categoria || ''),price:p.precio !== null && p.precio !== '' && Number.isFinite(Number(p.precio)) && Number(p.precio)>=0 ? Number(p.precio) : null,
    image:safeImage(p.foto),art:category(p.categoria)==='cursos'?'format-course.svg':category(p.categoria)==='recetarios'?'format-recipe.svg':'format-ebook.svg',
    available:p.activo!==false && !(p.controlaStock===true && Number.isFinite(Number(p.stock)) && Number(p.stock)<1),demo:false});
  const emit = () => document.dispatchEvent(new CustomEvent('zona:change'));
  const save = () => { try { localStorage.setItem(key,JSON.stringify(selection)); } catch {} emit(); };
  async function request(path, options={}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),config.timeoutMs);
    try {
      const response = await fetch(config.api.replace(/\/$/,'') + '/catalogo/' + encodeURIComponent(config.slug) + path,{...options,signal:controller.signal});
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status===404?'El catálogo todavía no está disponible.':String(data.message || data.error || 'No pudimos conectar con el catálogo.'));
      return data;
    } catch (error) {
      if (error.name==='AbortError') throw new Error('El catálogo tardó en responder. Probá de nuevo.');
      throw error;
    } finally { clearTimeout(timer); }
  }
  async function load() {
    if (loading) return loading;
    loading = (async () => {
      status='loading'; lastError=''; emit();
      if (demo) { products = samples; status='demo'; }
      else {
        try {
          const data = await request('');
          if (!Array.isArray(data.productos)) throw new Error('No pudimos leer el catálogo. Probá de nuevo.');
          products = data.productos.filter(p=>p && p._id && p.activo!==false).map(map);
          status=products.length?'ready':'empty';
        } catch(e) { products=[];status='error';lastError=e.message; }
      }
      if (status!=='error') selection=selection.filter(id=>products.some(p=>p.id===id && p.available));
      save();
    })();
    try { await loading; } finally { loading=null; }
  }
  const selected = () => selection.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const total = () => { const list=selected();return list.length && list.every(p=>p.price!==null)?Math.round(list.reduce((s,p)=>s+Math.round(p.price*100),0))/100:null; };
  const message = note => {
    const list=selected();
    const start=demo?'Hola, Zona Digital. Estoy viendo la demo de tu catálogo. Me interesan estos formatos y temas de ejemplo:':'Hola, Zona Digital. Quiero consultar por esta selección:';
    const lines=list.map(p=>'• '+p.name+' ('+labels[p.cat]+')'+(p.price!==null?' — '+money(p.price):''));
    const end=demo?'¿Qué productos reales tenés disponibles? Quisiera conocer el contenido, el precio y cómo recibo el material.':'Quisiera confirmar el contenido, el acceso al material y las condiciones de compra.';
    return [start,...lines,note?'Mi consulta: '+note:'',lastOrder?'Pedido registrado en el catálogo.':'',end].filter(Boolean).join('\n');
  };
  const wa = text => 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(text);
  async function order(customer) {
    if (demo || pending || submitted || uncertain) throw new Error(demo?'La vista de ejemplo permite consultas por WhatsApp.':'Este pedido ya se envió o está pendiente de confirmación.');
    const chosen=selected();
    if (!chosen.length) throw new Error('Sumá un producto a tu selección.');
    if (!customer.nombre.trim() || customer.telefono.replace(/\D/g,'').length<8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) throw new Error('Completá tu nombre, un teléfono válido y tu email.');
    if(chosen.some(p=>p.price===null || !p.available)) throw new Error('Consultá el precio y la disponibilidad antes de registrar este pedido.');
    pending=true; emit();
    let didPost=false;
    try {
      const fresh=await request('');
      if(!Array.isArray(fresh.productos)) throw new Error('No pudimos verificar el catálogo. Reintentá antes de confirmar.');
      const current=fresh.productos.filter(p=>p && p._id && p.activo!==false).map(map);
      const changed=chosen.some(p=>{const q=current.find(x=>x.id===p.id);return !q || !q.available || q.price!==p.price;});
      products=current;selection=selection.filter(id=>current.some(p=>p.id===id && p.available));save();
      if(changed) throw new Error('El catálogo cambió. Revisá los productos y el total antes de confirmar otra vez.');
      didPost=true;
      saveOrderState('uncertain');
      const result=await request('/pedido',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre:customer.nombre.trim(),telefono:customer.telefono.trim(),email:customer.email.trim(),nota:customer.nota.trim(),items:chosen.map(p=>({productoId:p.id,cantidad:1}))})});
      submitted=true;lastOrder=result;
      saveOrderState('confirmed');
      return result;
    } catch(e) {
      if(didPost) uncertain=true;
      throw new Error(didPost? 'No pudimos confirmar el resultado. Consultá por WhatsApp antes de volver a enviar, para evitar un pedido duplicado.':e.message);
    } finally { pending=false;emit(); }
  }
  window.ZonaStore = {load,norm,labels,money,selected,total,message,wa,order,
    get products(){return products;},get status(){return status;},get error(){return lastError;},get demo(){return demo;},get pending(){return pending;},get submitted(){return submitted;},get uncertain(){return uncertain;},
    toggle(id){if(pending||submitted||uncertain)return;const p=products.find(x=>x.id===id);if(!p||!p.available)return;selection=selection.includes(id)?selection.filter(x=>x!==id):[...selection,id];save();},
    clear(){if(pending||submitted||uncertain)return;selection=[];save();},
    newOrder(){if(pending||uncertain)return;selection=[];submitted=false;lastOrder=null;saveOrderState('');save();}
  };
})();
