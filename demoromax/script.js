/* =========================================================
   Romax TV Digital — "Señal" · script
   ========================================================= */
(function(){
  "use strict";
  const $ = (s,c)=>(c||document).querySelector(s);
  const $$ = (s,c)=>[...(c||document).querySelectorAll(s)];

  document.addEventListener("DOMContentLoaded", function(){
    const yr = $("#yr"); if(yr) yr.textContent = new Date().getFullYear();

    const nav = $("#nav"), wa = $("#wa");
    const onScroll = ()=>{ nav.classList.toggle("scrolled", scrollY>40); wa.classList.toggle("show", scrollY>420); };
    addEventListener("scroll", onScroll, {passive:true}); onScroll();

    const burger = $("#burger"), navMobile = $("#navMobile");
    const toggle = open=>{ burger.classList.toggle("open",open); navMobile.classList.toggle("open",open);
      burger.setAttribute("aria-expanded",open?"true":"false"); document.body.style.overflow=open?"hidden":""; };
    burger.addEventListener("click", ()=>toggle(!navMobile.classList.contains("open")));
    $$("#navMobile a").forEach(a=>a.addEventListener("click", ()=>toggle(false)));

    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }); },{threshold:.12});
    $$(".reveal").forEach(el=>io.observe(el));
  });
})();
