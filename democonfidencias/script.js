/* =========================================================
   Radio Confidencias — "Cabina EN VIVO" · script
   Contenido de noticias y programación: demostrativo.
   ========================================================= */
(function(){
  "use strict";
  const $ = (s,c)=>(c||document).querySelector(s);
  const $$ = (s,c)=>[...(c||document).querySelectorAll(s)];

  // ---------- programación (start = hora 24h en que arranca) ----------
  const SHOWS = [
    {start:0,  name:"Noche Confidente",      host:"trasnoche musical e informativa"},
    {start:6,  name:"Primera Edición",       host:"el resumen para arrancar el día"},
    {start:9,  name:"La Mañana Confidente",  host:"con el equipo de redacción"},
    {start:12, name:"Mediodía al Aire",      host:"noticias, servicio y agenda"},
    {start:14, name:"La Tarde es Nuestra",   host:"actualidad y entrevistas"},
    {start:18, name:"Regreso Informativo",   host:"el cierre del día minuto a minuto"},
    {start:21, name:"Confidencias de Noche", host:"charlas, música y compañía"}
  ];

  // ---------- noticias (demostrativas) ----------
  const NEWS = [
    {cat:"local", img:"local", time:"Hace 12 min", title:"Salta refuerza el transporte para el fin de semana largo",
      lead:"El municipio anunció más unidades y frecuencias por la afluencia turística esperada.",
      body:"Las autoridades detallaron que los recorridos hacia los principales puntos turísticos tendrán refuerzos desde el viernes. Se recomienda anticipar los viajes y consultar las frecuencias actualizadas."},
    {cat:"politica", img:"politica", time:"Hace 28 min", title:"Sesión clave en la Legislatura por el presupuesto provincial",
      lead:"Los bloques negocian las últimas modificaciones antes de la votación.",
      body:"El recinto debatirá las partidas destinadas a obra pública, salud y educación. Desde la oposición anticiparon pedidos de informes mientras el oficialismo busca asegurar el quórum."},
    {cat:"policiales", img:"policiales", time:"Hace 41 min", title:"Operativo de seguridad en el centro tras una serie de robos",
      lead:"Efectivos realizan controles en zonas comerciales durante la noche.",
      body:"La fuerza desplegó patrullajes adicionales luego de los reclamos de comerciantes. Se solicitó a los vecinos aportar información que pueda colaborar con la investigación."},
    {cat:"deportes", img:"deportes", time:"Hace 1 h", title:"El clásico salteño se jugará con público visitante",
      lead:"La organización confirmó el aforo y los horarios de ingreso.",
      body:"Tras varias reuniones de seguridad, se habilitó la presencia de hinchas visitantes con entradas anticipadas. El encuentro promete un marco imponente en las tribunas."},
    {cat:"espectaculos", img:"espectaculos", time:"Hace 1 h", title:"Llega una nueva edición del festival de música en la Ciudad",
      lead:"Artistas locales y nacionales en tres jornadas a pura peña y folclore.",
      body:"La grilla incluye números federales y propuestas emergentes. La entrada será accesible y habrá patios gastronómicos con producción regional."},
    {cat:"economia", img:"economia", time:"Hace 2 h", title:"Comercios adhieren a nuevas promociones para impulsar ventas",
      lead:"Descuentos y cuotas en rubros seleccionados durante la semana.",
      body:"Las cámaras comerciales informaron que la iniciativa busca dinamizar el consumo. Participan locales de indumentaria, electrodomésticos y gastronomía."},
    {cat:"local", img:"studio", time:"Hace 3 h", title:"Radio Confidencias suma nuevos móviles en la calle",
      lead:"Más cobertura en vivo para estar donde pasan las cosas.",
      body:"El equipo periodístico amplía su presencia en barrios y eventos para llevar la información de primera mano. Una apuesta por el contacto directo con la audiencia."},
    {cat:"deportes", img:"mic", time:"Hace 4 h", title:"Entrevista exclusiva: el técnico habló de cara al torneo",
      lead:"Objetivos, refuerzos y el sentir del plantel en nuestra mesa.",
      body:"En diálogo con Radio Confidencias, el entrenador analizó el presente del equipo y se mostró confiado para lo que viene. La nota completa, al aire y en nuestras redes."},
    {cat:"politica", img:"economia", time:"Hace 5 h", title:"Anuncian un plan de obras para el interior de la provincia",
      lead:"Caminos, agua y conectividad entre las prioridades.",
      body:"El cronograma contempla intervenciones en varias localidades durante el año. Los intendentes valoraron el anuncio y pidieron celeridad en la ejecución."}
  ];

  const catLabel = {politica:"Política",policiales:"Policiales",deportes:"Deportes",espectaculos:"Espectáculos",local:"Salta",economia:"Economía"};
  const pad = n => String(n).padStart(2,"0");

  document.addEventListener("DOMContentLoaded", function(){
    const yr = $("#yr"); if(yr) yr.textContent = new Date().getFullYear();

    // ---------- nav ----------
    const nav = $("#nav"), mini = $("#mini"), waOffset = 360;
    const onScroll = ()=>{ nav.classList.toggle("scrolled", scrollY>40); mini.classList.toggle("show", scrollY>waOffset); };
    addEventListener("scroll", onScroll, {passive:true}); onScroll();

    const burger = $("#burger"), navMobile = $("#navMobile");
    const toggleMenu = open=>{ burger.classList.toggle("open",open); navMobile.classList.toggle("open",open);
      burger.setAttribute("aria-expanded",open?"true":"false"); document.body.style.overflow=open?"hidden":""; };
    burger.addEventListener("click", ()=>toggleMenu(!navMobile.classList.contains("open")));
    $$("#navMobile a").forEach(a=>a.addEventListener("click", ()=>toggleMenu(false)));

    // ---------- programación + al aire ahora ----------
    const grid = $("#progGrid");
    const hour = new Date().getHours();
    let liveIdx = 0;
    SHOWS.forEach((sh,i)=>{
      const next = SHOWS[i+1] ? SHOWS[i+1].start : 24;
      if(hour>=sh.start && hour<next) liveIdx = i;
    });
    grid.innerHTML = SHOWS.map((sh,i)=>{
      const end = SHOWS[i+1] ? SHOWS[i+1].start : 24;
      const on = i===liveIdx;
      return `<div class="prog${on?' on':''}">
        <div class="prog-time">${pad(sh.start)}:00 – ${pad(end===24?0:end)}:00</div>
        <div><div class="prog-name">${sh.name}</div><div class="prog-host">${sh.host}</div></div>
        <div class="prog-live">${on?'Al aire':'Programado'}</div>
      </div>`;
    }).join("");

    // sincronizar reproductor con el show al aire
    const liveShow = SHOWS[liveIdx];
    $("#nowName").textContent = liveShow.name;
    $("#nowHost").textContent = liveShow.host;
    $("#miniName").textContent = liveShow.name;

    // ---------- ticker ----------
    const heads = NEWS.slice(0,6).map(n=>n.title);
    const tickHTML = "<span>"+heads.join("</span><span>")+"</span>";
    $("#ticker").innerHTML = tickHTML + tickHTML;

    // ---------- oyentes (varía suave) ----------
    const lis = $("#listeners"); let base = 312;
    setInterval(()=>{ base += Math.round((Math.random()-.45)*6); base=Math.max(180,Math.min(540,base)); lis.textContent=base; }, 4000);

    // ---------- noticias ----------
    const ng = $("#newsGrid");
    ng.innerHTML = NEWS.map((n,i)=>`
      <button class="news-card" data-cat="${n.cat}" data-i="${i}" aria-label="Leer: ${n.title}">
        <div class="news-thumb"><img src="img/${n.img}.jpg" alt="${n.title}" loading="lazy"><span class="news-cat">${catLabel[n.cat]}</span></div>
        <div class="news-body">
          <span class="news-time">${n.time}</span>
          <h3 class="news-title">${n.title}</h3>
          <p class="news-excerpt">${n.lead}</p>
          <span class="news-more">Leer la nota</span>
        </div>
      </button>`).join("");

    // filtros
    $$("#filters .chip").forEach(chip=>chip.addEventListener("click",()=>{
      $$("#filters .chip").forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      $$(".news-card").forEach(c=>{ c.style.display = (f==="all"||c.dataset.cat===f)?"":"none"; });
    }));

    // ---------- modal ----------
    const modal = $("#modal"); let lastFocus=null;
    const openModal = i=>{
      const n = NEWS[i]; lastFocus=document.activeElement;
      $("#mImg").src=`img/${n.img}.jpg`; $("#mImg").alt=n.title;
      $("#mCat").textContent=catLabel[n.cat]; $("#mTitle").textContent=n.title;
      $("#mTime").textContent=n.time+" · Radio Confidencias"; $("#mLead").textContent=n.lead; $("#mBody").textContent=n.body;
      modal.classList.add("open"); document.body.style.overflow="hidden"; $(".modal-close",modal).focus();
    };
    const closeModal=()=>{ modal.classList.remove("open"); document.body.style.overflow=""; if(lastFocus)lastFocus.focus(); };
    ng.addEventListener("click",e=>{ const c=e.target.closest(".news-card"); if(c) openModal(+c.dataset.i); });
    $$("[data-close]",modal).forEach(el=>el.addEventListener("click",closeModal));
    addEventListener("keydown",e=>{ if(e.key==="Escape"&&modal.classList.contains("open")) closeModal(); });

    // ---------- player play/pausa ----------
    let playing=false;
    const player=$("#player"), disc=$("#disc"), playLabel=$("#playLabel");
    const setIcons=(el,on)=>{ $(".ico-play",el).style.display=on?"none":""; $(".ico-pause",el).style.display=on?"":"none"; };
    const setPlaying=on=>{
      playing=on;
      player.classList.toggle("playing",on);
      mini.classList.toggle("playing",on);
      disc.classList.toggle("spin",on);
      setIcons($("#playBtn"),on); setIcons($("#miniPlay"),on);
      $("#playBtn").setAttribute("aria-pressed",on?"true":"false");
      playLabel.textContent = on ? "Pausar transmisión" : "Escuchar en vivo";
      if(on) mini.classList.add("show");
    };
    $("#playBtn").addEventListener("click",()=>setPlaying(!playing));
    $("#miniPlay").addEventListener("click",()=>setPlaying(!playing));

    // ---------- reveal ----------
    const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}})},{threshold:.12});
    $$(".reveal").forEach(el=>io.observe(el));
  });
})();
