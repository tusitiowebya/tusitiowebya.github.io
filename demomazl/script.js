(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  $('[data-year]').textContent=new Date().getFullYear();
  const menu=$('.menu-toggle'),nav=$('.nav');
  menu.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',opened)});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.classList.remove('open')}));
  const symptoms={celular:['Pantalla','Batería','Carga','Audio','No enciende','Otra falla'],computadora:['No enciende','Lentitud','Pantalla','Teclado','Conexión','Otra falla']};
  let device='celular',issue='';
  const symptomBox=$('[data-symptoms]'),detail=$('#issue-detail'),message=$('[data-message]'),link=$('[data-diagnostic-link]');
  function updateMessage(){const desc=detail.value.trim();const parts=['Hola MAZL.COM, quiero consultar por la reparación de mi '+device+'.'];if(issue)parts.push('La falla es: '+issue+'.');if(desc)parts.push('Detalle: '+desc);parts.push('¿Me pueden orientar?');const value=parts.join(' ');message.textContent=value;link.href=window.MazlCatalog.wa(value)}
  function renderSymptoms(){symptomBox.replaceChildren();symptoms[device].forEach(label=>{const button=document.createElement('button');button.type='button';button.className='symptom';button.textContent=label;button.setAttribute('aria-pressed',String(issue===label));button.addEventListener('click',()=>{issue=issue===label?'':label;renderSymptoms();updateMessage()});symptomBox.append(button)})}
  $('[data-device]').addEventListener('click',e=>{const button=e.target.closest('[data-value]');if(!button)return;device=button.dataset.value;issue='';document.querySelectorAll('[data-device] .choice').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderSymptoms();updateMessage()});
  detail.addEventListener('input',updateMessage);renderSymptoms();updateMessage();
  const catalog=window.MazlCatalog,status=$('[data-catalog-status]'),grid=$('[data-products]');
  function renderProducts(){grid.replaceChildren();if(catalog.state==='ready'){status.textContent='';catalog.products.slice(0,4).forEach(p=>grid.append(catalog.card(p)))}else{status.innerHTML=catalog.statusHTML();catalog.bindRetry(status,renderProducts)}}
  catalog.load().then(renderProducts);
})();
