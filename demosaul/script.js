// ===== Saúl Pragart =====
(function(){
  var WA = "5491157710414";

  // ---------- nav solid on scroll ----------
  var nav = document.getElementById('nav');
  function onScroll(){
    if(window.scrollY > 40){ nav.classList.add('solid'); }
    else{ nav.classList.remove('solid'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // ---------- burger / mobile nav ----------
  var burger = document.getElementById('burger');
  var navMobile = document.getElementById('navMobile');
  function closeMobile(){
    navMobile.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  }
  burger.addEventListener('click', function(){
    var open = navMobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navMobile.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMobile);
  });

  // ---------- reveal on scroll ----------
  var revealEls = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry, i){
        if(entry.isIntersecting){
          setTimeout(function(){ entry.target.classList.add('on'); }, i * 60);
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('on'); });
  }

  // ---------- footer year ----------
  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();

  // ---------- el tablero de Saúl ----------
  var PEGS = [
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15a4 4 0 100-8 4 4 0 000 8z"/><path d="M20 4l-6.5 6.5M13 15l7 7M9.5 12.5L4 18"/></svg>',
      label:'Plomería menor',
      kicker:'Mantenimiento · Plomería',
      title:'Pérdidas, canillas e inodoros',
      desc:'Canillas que gotean, inodoros que no cortan el agua, cañerías con pérdidas menores. Se soluciona en una visita, casi siempre.',
      msg:'Hola Saúl! Tengo un problema de plomería (una pérdida / una canilla / un inodoro) y quería consultarte.'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
      label:'Electricidad menor',
      kicker:'Mantenimiento · Electricidad',
      title:'Tomas, llaves y luminarias',
      desc:'Tomacorrientes que no andan, llaves térmicas, artefactos de luz que hay que instalar o cambiar. Trabajo prolijo, sin cables a la vista.',
      msg:'Hola Saúl! Necesito ayuda con algo de electricidad (tomas / llaves / luces).'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z"/></svg>',
      label:'Humedad y filtraciones',
      kicker:'Mantenimiento · Humedad',
      title:'Manchas, filtraciones y olor a humedad',
      desc:'Se busca el origen (no solo se tapa la mancha) y se soluciona con el tratamiento que corresponda a la pared o el techo.',
      msg:'Hola Saúl! Tengo un problema de humedad / filtración y quería que lo veas.'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3l3 3-11 11H7v-3z"/><path d="M3 21h6"/></svg>',
      label:'Pintura',
      kicker:'Mantenimiento · Pintura',
      title:'Interior y exterior',
      desc:'Una pared, un ambiente completo o el frente de la casa. Se cotiza por metro, con marca y color a elección.',
      msg:'Hola Saúl! Quiero cotizar pintura (interior / exterior) para mi casa.'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 9h18M9 4v5"/></svg>',
      label:'Carpintería y muebles',
      kicker:'A medida · Carpintería',
      title:'Armado, arreglo y restauración',
      desc:'Ese mueble que llegó desarmado, el que se rompió una pata, o el que merece una segunda vida con otro color.',
      msg:'Hola Saúl! Tengo un mueble para armar / arreglar / restaurar.'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>',
      label:'Deco y arte',
      kicker:'Deco y arte',
      title:'Murales e intervenciones',
      desc:'Un mural en una pared, un objeto pintado a mano, un detalle que cambia el ambiente entero. Se diseña junto con vos.',
      msg:'Hola Saúl! Quería contarte una idea de deco / arte que tengo para un espacio.'
    },
    {
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>',
      label:'Otra rareza',
      kicker:'Personalización a medida',
      title:'Lo que no entra en ninguna categoría',
      desc:'Si tenías una idea rara guardada hace tiempo y no sabías a quién llamar: es exactamente para esto.',
      msg:'Hola Saúl! Tengo una idea media rara y no sabía a quién más llamar, ¿me ayudás?'
    }
  ];

  var board = document.getElementById('board');
  var fichaKicker = document.getElementById('fichaKicker');
  var fichaTitle = document.getElementById('fichaTitle');
  var fichaDesc = document.getElementById('fichaDesc');
  var fichaBtn = document.getElementById('fichaBtn');

  function waLink(msg){
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  function selectPeg(i, el){
    board.querySelectorAll('.peg').forEach(function(p){ p.classList.remove('active'); });
    el.classList.add('active');
    var p = PEGS[i];
    fichaKicker.textContent = p.kicker;
    fichaTitle.textContent = p.title;
    fichaDesc.textContent = p.desc;
    fichaBtn.href = waLink(p.msg);
  }

  PEGS.forEach(function(p, i){
    var btn = document.createElement('button');
    btn.className = 'peg';
    btn.type = 'button';
    btn.setAttribute('role','listitem');
    btn.innerHTML = '<span class="peg-ic">' + p.icon + '</span><span>' + p.label + '</span>';
    btn.addEventListener('click', function(){ selectPeg(i, btn); });
    board.appendChild(btn);
  });

})();
