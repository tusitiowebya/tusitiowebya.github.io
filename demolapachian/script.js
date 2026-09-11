(function(){
  "use strict";

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  if(burger){
    burger.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.getElementById('navMobile').querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('is-open'); });
    });
  }

  /* ---------- lazy hero video ---------- */
  var vid = document.querySelector('.ticket__video');
  if(vid){
    var src = vid.getAttribute('data-src');
    if(src){
      var s = document.createElement('source');
      vid.src = src;
      vid.load();
      vid.play().catch(function(){});
    }
  }

  /* ---------- reveal on scroll ---------- */
  var toReveal = document.querySelectorAll('.svc, .steps li, .testis blockquote, .faq details, .fleet__photo, .fleet__specs, .section__head');
  toReveal.forEach(function(el){ el.classList.add('reveal'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e, i){
        if(e.isIntersecting){
          setTimeout(function(){ e.target.classList.add('is-visible'); }, (i % 6) * 70);
          io.unobserve(e.target);
        }
      });
    }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
    toReveal.forEach(function(el){ io.observe(el); });
  } else {
    toReveal.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- quoter (signature) ---------- */
  var chips = document.querySelectorAll('#tripChips .chip');
  var kmRange = document.getElementById('kmRange');
  var kmVal = document.getElementById('kmVal');
  var waitBtns = document.querySelectorAll('.tbtn');
  var qTag = document.getElementById('qTag');
  var qPrice = document.getElementById('qPrice');
  var qWa = document.getElementById('qWa');
  var carIcon = document.getElementById('carIcon');
  var routePath = document.getElementById('routeDash');

  var state = { trip:'aeropuerto', base:9000, rate:450, km:18, wait:0 };
  var tripLabels = {
    aeropuerto:'Aeropuertos', ciudad:'Ciudadanos', interior:'Al interior',
    fiestas:'Fiestas', encomienda:'Encomienda'
  };

  function fmtThousands(n){
    n = Math.round(n/100)*100;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function moveCarAlongPath(){
    if(!routePath || !carIcon) return;
    var len = routePath.getTotalLength();
    var duration = 1300;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = t < .5 ? 2*t*t : -1 + (4 - 2*t) * t;
      var pt = routePath.getPointAtLength(eased * len);
      var pt2 = routePath.getPointAtLength(Math.min(len, eased*len + 1));
      var angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180/Math.PI;
      carIcon.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ') rotate(' + angle + ')');
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateQuote(){
    var low = state.base + state.km * state.rate * 0.9;
    var high = state.base + state.km * state.rate * 1.15;
    if(state.wait){ low *= 1.35; high *= 1.4; }
    qTag.textContent = tripLabels[state.trip];
    qPrice.textContent = '$ ' + fmtThousands(low) + ' – ' + fmtThousands(high);

    var waitTxt = state.wait ? ' con espera para el regreso' : ' (solo ida)';
    var msg = 'Hola José, quería cotizar un traslado.%0A' +
      '- Tipo: ' + encodeURIComponent(tripLabels[state.trip]) + '%0A' +
      '- Distancia aprox: ' + state.km + ' km%0A' +
      '- Modalidad:' + encodeURIComponent(waitTxt) + '%0A' +
      '- Estimado orientativo: ' + encodeURIComponent(fmtThousands(low) + ' - ' + fmtThousands(high));
    qWa.href = 'https://wa.me/5493512168407?text=' + msg;

    moveCarAlongPath();
  }

  chips.forEach(function(btn){
    btn.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('is-active'); });
      btn.classList.add('is-active');
      state.trip = btn.getAttribute('data-trip');
      state.base = parseFloat(btn.getAttribute('data-base'));
      state.rate = parseFloat(btn.getAttribute('data-km'));
      updateQuote();
    });
  });

  if(kmRange){
    kmRange.addEventListener('input', function(){
      state.km = parseInt(kmRange.value, 10);
      kmVal.textContent = state.km;
      updateQuote();
    });
  }

  waitBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      waitBtns.forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      state.wait = parseInt(btn.getAttribute('data-wait'), 10);
      updateQuote();
    });
  });

  updateQuote();

})();
