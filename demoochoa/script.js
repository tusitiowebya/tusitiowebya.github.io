/* =========================================================
   José Ochoa & hijos — "En altura" · script
   ========================================================= */
(function(){
  "use strict";
  const $ = (s,c)=>(c||document).querySelector(s);
  const $$ = (s,c)=>[...(c||document).querySelectorAll(s)];

  document.addEventListener("DOMContentLoaded", function(){
    const yr = $("#yr"); if(yr) yr.textContent = new Date().getFullYear();

    // nav + wa float
    const nav = $("#nav"), wa = $("#wa");
    const onScroll = ()=>{ nav.classList.toggle("scrolled", scrollY>40); wa.classList.toggle("show", scrollY>420); };
    addEventListener("scroll", onScroll, {passive:true}); onScroll();

    // menú móvil
    const burger = $("#burger"), navMobile = $("#navMobile");
    const toggle = open=>{ burger.classList.toggle("open",open); navMobile.classList.toggle("open",open);
      burger.setAttribute("aria-expanded",open?"true":"false"); document.body.style.overflow=open?"hidden":""; };
    burger.addEventListener("click", ()=>toggle(!navMobile.classList.contains("open")));
    $$("#navMobile a").forEach(a=>a.addEventListener("click", ()=>toggle(false)));

    // lightbox galería
    const lb = $("#lb"), lbImg = $("#lbImg"); let lastFocus=null;
    const open = (src,alt)=>{ lastFocus=document.activeElement; lbImg.src=src; lbImg.alt=alt||""; lb.classList.add("open"); document.body.style.overflow="hidden"; $("#lbClose").focus(); };
    const close = ()=>{ lb.classList.remove("open"); document.body.style.overflow=""; lbImg.src=""; if(lastFocus)lastFocus.focus(); };
    $("#gal").addEventListener("click", e=>{ const b=e.target.closest("button[data-src]"); if(b) open(b.dataset.src, b.querySelector("img").alt); });
    $("#lbClose").addEventListener("click", close);
    lb.addEventListener("click", e=>{ if(e.target===lb) close(); });
    addEventListener("keydown", e=>{ if(e.key==="Escape" && lb.classList.contains("open")) close(); });

    // reveal
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }); },{threshold:.12});
    $$(".reveal").forEach(el=>io.observe(el));
  });
})();
