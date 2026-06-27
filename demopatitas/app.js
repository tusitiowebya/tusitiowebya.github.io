/* Patitas que Aman — landing */
(function () {
  'use strict';
  var C = window.PATITAS;

  // año
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // ---- banner deslizable de avisos ----
  var avisos = (C && C.AVISOS) || [];
  var track = document.getElementById('avisosTrack');
  if (track && avisos.length) {
    var one = avisos.map(function (a) { return '<span class="aviso">' + a + '</span>'; }).join('<span class="aviso-dot">•</span>');
    track.innerHTML = one + '<span class="aviso-dot">•</span>' + one; // duplicado para loop continuo
  } else if (document.getElementById('avisos')) {
    document.getElementById('avisos').style.display = 'none';
  }

  // ---- hero editable (frase + foto) ----
  if (C) {
    var ht = document.getElementById('heroTitle'); // si definieron BIENVENIDA, la usamos como título plano
    if (ht && C.BIENVENIDA) ht.textContent = C.BIENVENIDA;
    var hs = document.getElementById('heroSub'); if (hs && C.SUBTITULO) hs.textContent = C.SUBTITULO;
    var hf = document.getElementById('heroFoto'); if (hf && C.HERO_FOTO) hf.src = C.HERO_FOTO;
  }

  // ---- redes en footer ----
  var soc = document.getElementById('ftSocial');
  if (soc && C) {
    var s = '';
    if (C.INSTAGRAM) s += '<a href="' + C.INSTAGRAM + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.42.6.22 1 .5 1.4.94.44.43.72.83.94 1.4.17.45.36 1.05.42 2.2.06 1.2.07 1.6.07 4.77s0 3.6-.07 4.8c-.06 1.2-.25 1.8-.42 2.2-.22.6-.5 1-.94 1.4-.43.44-.83.72-1.4.94-.45.17-1.05.36-2.2.42-1.2.06-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.22-1-.5-1.4-.94a3.8 3.8 0 01-.94-1.4c-.17-.45-.36-1.05-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-1.8.42-2.2.22-.6.5-1 .94-1.4.43-.44.83-.72 1.4-.94.45-.17 1.05-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.95c-3.15 0-3.5 0-4.7.07-.92.04-1.42.2-1.75.33-.44.17-.75.37-1.08.7-.33.33-.53.64-.7 1.08-.13.33-.29.83-.33 1.75-.06 1.2-.07 1.55-.07 4.7s0 3.5.07 4.7c.04.92.2 1.42.33 1.75.17.44.37.75.7 1.08.33.33.64.53 1.08.7.33.13.83.29 1.75.33 1.2.06 1.55.07 4.7.07s3.5 0 4.7-.07c.92-.04 1.42-.2 1.75-.33.44-.17.75-.37 1.08-.7.33-.33.53-.64.7-1.08.13-.33.29-.83.33-1.75.06-1.2.07-1.55.07-4.7s0-3.5-.07-4.7c-.04-.92-.2-1.42-.33-1.75a2.9 2.9 0 00-.7-1.08 2.9 2.9 0 00-1.08-.7c-.33-.13-.83-.29-1.75-.33-1.2-.06-1.55-.07-4.7-.07zm0 3.32a4.53 4.53 0 110 9.06 4.53 4.53 0 010-9.06zm0 7.47a2.94 2.94 0 100-5.88 2.94 2.94 0 000 5.88zm5.77-7.69a1.06 1.06 0 11-2.12 0 1.06 1.06 0 012.12 0z"/></svg></a>';
    if (C.FACEBOOK) s += '<a href="' + C.FACEBOOK + '" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg></a>';
    var wa = 'https://wa.me/' + C.WA;
    s += '<a href="' + wa + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7L7 20.4A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.6.7.7-2.5-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.250-.13-1.5-.74-1.7-.82-.23-.08-.4-.13-.56.13-.16.25-.64.82-.78.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.58.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28z"/></svg></a>';
    soc.innerHTML = s;
  }

  // nav scrolled
  var nav = document.getElementById('nav');
  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  // menú móvil
  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function(){
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true':'false');
      document.body.style.overflow = o ? 'hidden':'';
    });
    nm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ nm.classList.remove('open'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }); });
  }

  // helpers
  function money(n){ return '$' + Number(n||0).toLocaleString('es-AR'); }
  function emoji(cat){ return /gato/i.test(cat) ? '🐱' : '🐶'; }
  function waProducto(p){
    var t = 'Hola Patitas que Aman! Me interesa: ' + p.nombre + (p.descripcion ? ' ('+p.descripcion+')' : '') + ' — ' + money(p.precio);
    return 'https://wa.me/' + C.WA + '?text=' + encodeURIComponent(t);
  }

  // promos en vivo desde cobros
  var grid = document.getElementById('promoGrid');
  if (grid && C) {
    fetch(C.API + '/catalogo/' + C.SLUG)
      .then(function(r){ if(!r.ok) throw new Error('catalogo'); return r.json(); })
      .then(function(d){
        var prods = (d.productos || []).slice(0, 4);
        if (!prods.length) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft)">Pronto vas a ver acá nuestras promos. Mientras, escribinos por WhatsApp.</p>'; return; }
        grid.innerHTML = prods.map(function(p){
          var esGato = /gato/i.test(p.categoria||'');
          var media = p.foto ? '<img src="'+p.foto+'" alt="'+p.nombre+'" loading="lazy">' : emoji(p.categoria);
          return '<article class="pcard">'
            + '<div class="pcard-top'+(esGato?' gatos':'')+'">'
              + '<span class="pcard-cat'+(esGato?' gatos':'')+'">'+(p.categoria||'')+'</span>'+media
            + '</div>'
            + '<div class="pcard-body">'
              + '<h3>'+p.nombre+'</h3>'
              + '<p class="pcard-desc">'+(p.descripcion||'')+'</p>'
              + '<div class="pcard-foot">'
                + '<span class="pcard-price">'+money(p.precio)+'</span>'
                + '<a class="pcard-btn" href="'+waProducto(p)+'" target="_blank" rel="noopener">Pedir</a>'
              + '</div>'
            + '</div></article>';
        }).join('');
      })
      .catch(function(){
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft)">No pudimos cargar las promos en este momento. <a href="catalogo/" style="color:var(--blue);font-weight:700">Ver catálogo</a></p>';
      });
  }

  // reveal
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); }, { threshold:.12 });
  document.querySelectorAll('.head, .cat, .env-card, .marcas-row, .cta-in').forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
})();
