/* =========================================================
   TuPaginaYa — "La Vidriera" · script
   ========================================================= */
(function(){
  "use strict";

  // ---------- datos de los trabajos ----------
  const SITES = [
    {s:"suarmador", n:"Su Armador", d:"suarmador.com.ar", cat:"servicios", rubro:"Amoblamientos", blurb:"Amoblamientos y diseño de interiores premium. Cocinas, placares y muebles a medida con un look editorial.", f:["Video hero","Catálogo","Presupuesto WhatsApp"]},
    {s:"claudiasanchez", n:"Claudia Sánchez Eventos", d:"claudiasanchez.ar", cat:"eventos", rubro:"Eventos", blurb:"Organización y ambientación de bodas, quinces y celebraciones. Identidad cálida y elegante con galería de eventos.", f:["Galería","OG propia","SEO a medida"]},
    {s:"eleonorasticoni", n:"Eleonora Sticoni", d:"eleonorasticoni.com.ar", cat:"salud", rubro:"Coaching & terapias", blurb:"Sitio multipágina para una mentora y coach: coaching ontológico, constelaciones y terapias holísticas.", f:["Sitio multipágina","Video hero","Subpáginas"]},
    {s:"aberturasgyg", n:"Aberturas G&G", d:"aberturasgyg.com.ar", cat:"servicios", rubro:"Industria", blurb:"Fábrica de aberturas de aluminio a medida en Chascomús. Muestra líneas de producto y pedidos de presupuesto.", f:["Catálogo de líneas","Galería de obras","Presupuesto"]},
    {s:"mendozatransfer", n:"Mendoza Transfer", d:"mendozatransfer.com.ar", cat:"eventos", rubro:"Turismo", blurb:"Tours y traslados premium en Mendoza: bodegas, vinos y excursiones. Reservas directas por WhatsApp.", f:["Tours","Reservas","Galería"]},
    {s:"constructorarjo", n:"Constructora RJO", d:"constructorarjo.com.ar", cat:"servicios", rubro:"Construcción", blurb:"Casas, piletas, quinchos y galpones llave en mano. Portfolio de obras y contacto rápido.", f:["Portfolio de obras","Servicios","Contacto"]},
    {s:"caslafv", n:"San Lorenzo · F. Varela", d:"caslafv.com.ar", cat:"instituciones", rubro:"Club deportivo", blurb:"Sede de fútbol infantil con cancha de 11. Galería de fotos y videos, horarios e inscripciones.", f:["Galería fotos+video","Inscripción","Horarios"]},
    {s:"danieleventos", n:"Daniel Producciones", d:"danieleventos.com.ar", cat:"eventos", rubro:"Eventos", blurb:"Fiestas de 15 y casamientos premium. Una landing pensada para enamorar y dejar el contacto.", f:["Video hero","Galería","Contacto"]},
    {s:"durlockespinosa", n:"Espinosa Construcciones", d:"durlockespinosa.com.ar", cat:"servicios", rubro:"Construcción", blurb:"Steel framing, remodelaciones y construcción en seco en San Juan. Servicios y obras realizadas.", f:["Servicios","Obras","Presupuesto"]},
    {s:"electrobohemia", n:"Electro Bohemia", d:"electrobohemia.com.ar", cat:"comercio", rubro:"Mayorista", blurb:"Importación y venta mayorista de electrónica. Catálogo claro orientado a revendedores.", f:["Catálogo mayorista","Contacto","Marcas"]},
    {s:"cleandmlimpieza", n:"Clean DM", d:"cleandmlimpieza.com.ar", cat:"servicios", rubro:"Limpieza", blurb:"Limpieza profesional de edificios, oficinas y obra. Servicios, números de confianza y presupuesto.", f:["Servicios","Estadísticas","Presupuesto"]},
    {s:"cortinasservice", n:"CM Special Service", d:"cortinasservice.com.ar", cat:"servicios", rubro:"Reparaciones", blurb:"Reparación de cortinas metálicas con urgencias 24 hs. Pensada para que llamen ya.", f:["Urgencias 24h","Servicios","Llamado directo"]},
    {s:"lavaderosplash", n:"Lavadero Splash", d:"lavaderosplash.com.ar", cat:"servicios", rubro:"Servicios", blurb:"Lavadero de ropa en Florencio Varela. Servicio rápido y confiable con pedidos por WhatsApp.", f:["Servicios","Precios","WhatsApp"]},
    {s:"lrturbos", n:"Turbos LR", d:"lrturbos.com.ar", cat:"servicios", rubro:"Automotor", blurb:"Reparación de turbocompresores. Sitio técnico y directo, orientado a la consulta inmediata.", f:["Servicios","Consulta","Galería"]},
    {s:"matiasroman", n:"Matías Román", d:"matiasroman.com.ar", cat:"servicios", rubro:"Seguros", blurb:"Productor asesor de seguros. Una presencia profesional para generar confianza y captar consultas.", f:["Coberturas","Asesoramiento","Contacto"]},
    {s:"andresromeroservice", n:"AR Service", d:"andresromeroservice.com.ar", cat:"servicios", rubro:"Construcción", blurb:"Obras, instalaciones y servicios integrales. Catálogo de servicios y presupuesto a un toque.", f:["Servicios","Obras","Presupuesto"]},
    {s:"plasticosfhd", n:"Plásticos FHD", d:"plasticosfhd.com.ar", cat:"comercio", rubro:"Industrial", blurb:"Retiro industrial y compra de rezagos plásticos en todo el país. Sitio B2B claro y serio.", f:["Servicios B2B","Cobertura país","Contacto"]},
    {s:"rbdigital", n:"RB Digital", d:"rbdigital.online", cat:"comercio", rubro:"Streaming", blurb:"Televisión por streaming con sistema anticortes. Planes, beneficios y alta inmediata.", f:["Planes","Beneficios","Alta online"]},
    {s:"sonicboomstore", n:"SonicBoom Store", d:"sonicboomstore.online", cat:"comercio", rubro:"Streaming & TV", blurb:"Streaming, TV e internet. Tienda de servicios digitales con un look enérgico y moderno.", f:["Catálogo","Planes","Contacto"]},
    {s:"jarabus", n:"Jara Bus", d:"jarabus.com.ar", cat:"eventos", rubro:"Traslados", blurb:"Traslados grupales seguros y confiables. Cotización de viajes directa por WhatsApp.", f:["Servicios","Cotización","Flota"]},
    {s:"receptivocataratasluz", n:"Cataratas Traslados", d:"receptivocataratasluz.com.ar", cat:"eventos", rubro:"Turismo", blurb:"Servicio de traslados en Puerto Iguazú. Excursiones y reservas para turistas.", f:["Excursiones","Reservas","Galería"]},
    {s:"licgabrielabasualdo", n:"Lic. Basualdo Gabriela", d:"licgabrielabasualdo.com.ar", cat:"salud", rubro:"Salud mental", blurb:"Acompañamiento terapéutico en Comodoro Rivadavia, presencial y virtual. Presencia profesional y cálida.", f:["Estudios y alcances","Modalidades","Contacto"]},
    {s:"solramirezcoach", n:"Sol Ramírez", d:"solramirezcoach.com.ar", cat:"salud", rubro:"Coaching", blurb:"Coaching ontológico con sesiones online y talleres. Sitio personal que transmite cercanía.", f:["Servicios","Talleres","Agenda"]},
    {s:"iopsaformacion", n:"IOPSA", d:"iopsaformacion.com.ar", cat:"instituciones", rubro:"Formación", blurb:"Instituto de psicología social argentino. Formaciones virtuales con inscripción y programa.", f:["Formaciones","Programa","Inscripción"]},
    {s:"itemacursos", n:"ITEMA", d:"itemacursos.com.ar", cat:"instituciones", rubro:"Educación", blurb:"Instituto tecnológico de mecánica automotriz. Cursos, modalidades y matriculación.", f:["Cursos","Modalidades","Inscripción"]},
    {s:"iglesiareydegloria", n:"Iglesia Rey de Gloria", d:"iglesiareydegloria.com.ar", cat:"instituciones", rubro:"Comunidad", blurb:"Comunidad religiosa en Luján. Horarios, actividades y un espacio para acercar a la gente.", f:["Actividades","Horarios","Contacto"]},
    {s:"enlaceosc", n:"Enlace OSC", d:"enlaceosc.com.ar", cat:"instituciones", rubro:"Consultoría", blurb:"Consultoría estratégica para organizaciones de la sociedad civil. Sitio institucional sobrio y claro.", f:["Servicios","Enfoque","Contacto"]}
  ];

  const $ = (s,c)=>(c||document).querySelector(s);
  const $$ = (s,c)=>[...(c||document).querySelectorAll(s)];
  const img = s => "images/portfolio/"+s+".jpg";

  document.addEventListener("DOMContentLoaded", function(){

    // ---------- año ----------
    const yr = $("#yr"); if(yr) yr.textContent = new Date().getFullYear();

    // ---------- nav scroll ----------
    const nav = $("#nav");
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
      $("#waFloat").classList.toggle("show", window.scrollY > 360);
    };
    window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

    // ---------- menú móvil ----------
    const burger = $("#burger"), navMobile = $("#navMobile");
    const toggleMenu = (open) => {
      burger.classList.toggle("open", open);
      navMobile.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true":"false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", ()=>toggleMenu(!navMobile.classList.contains("open")));
    $$("#navMobile a").forEach(a=>a.addEventListener("click", ()=>toggleMenu(false)));

    // ---------- vidriera (marquee) ----------
    const shotHTML = site => `<a class="shot" href="https://${site.d}/" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="${img(site.s)}" alt="" loading="lazy"><span>${site.d}</span></a>`;
    const half = Math.ceil(SITES.length/2);
    const rowA = SITES.slice(0,half), rowB = SITES.slice(half);
    const fill = (el,arr)=>{ const h = arr.map(shotHTML).join(""); el.innerHTML = h+h; };
    fill($("#track1"), rowA); fill($("#track2"), rowB);

    // ---------- grilla de trabajos ----------
    const grid = $("#workGrid");
    const cardHTML = site => `
      <button class="work-card" data-cat="${site.cat}" data-slug="${site.s}" aria-label="Ver detalle de ${site.n}">
        <div class="work-thumb">
          <img src="${img(site.s)}" alt="Sitio web de ${site.n}" loading="lazy">
          <span class="work-badge">${site.rubro}</span>
          <span class="work-open"><span>Ver detalle</span></span>
        </div>
        <div class="work-meta">
          <div>
            <div class="work-cat">${labelOf(site.cat)}</div>
            <div class="work-name">${site.n}</div>
          </div>
          <span class="work-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
        </div>
      </button>`;
    grid.innerHTML = SITES.map(cardHTML).join("");

    function labelOf(c){
      return {servicios:"Servicios",comercio:"Comercio",eventos:"Eventos & Turismo",salud:"Salud & Coaching",instituciones:"Instituciones"}[c]||c;
    }

    // ---------- filtros ----------
    $$("#filters .chip").forEach(chip=>{
      chip.addEventListener("click", ()=>{
        $$("#filters .chip").forEach(c=>c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        $$(".work-card").forEach(card=>{
          const show = f==="all" || card.dataset.cat===f;
          card.style.display = show ? "" : "none";
        });
      });
    });

    // ---------- modal ----------
    const modal = $("#modal");
    let lastFocus = null;
    const bySlug = Object.fromEntries(SITES.map(s=>[s.s,s]));

    function openModal(slug){
      const site = bySlug[slug]; if(!site) return;
      lastFocus = document.activeElement;
      $("#mImg").src = img(site.s);
      $("#mImg").alt = "Sitio web de "+site.n;
      $("#mCat").textContent = labelOf(site.cat)+" · "+site.rubro;
      $("#mTitle").textContent = site.n;
      $("#mDomain").textContent = site.d;
      $("#mText").textContent = site.blurb;
      $("#mFeats").innerHTML = site.f.map(x=>`<li>${x}</li>`).join("");
      const link = $("#mLink"); link.href = "https://"+site.d+"/";
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".modal-close", modal).focus();
    }
    function closeModal(){
      modal.classList.remove("open");
      document.body.style.overflow = "";
      if(lastFocus) lastFocus.focus();
    }
    grid.addEventListener("click", e=>{
      const card = e.target.closest(".work-card");
      if(card) openModal(card.dataset.slug);
    });
    $$("[data-close]", modal).forEach(el=>el.addEventListener("click", closeModal));
    document.addEventListener("keydown", e=>{ if(e.key==="Escape" && modal.classList.contains("open")) closeModal(); });

    // ---------- reveal ----------
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    },{threshold:.12});
    $$(".reveal").forEach(el=>io.observe(el));

    // ---------- formulario demo ----------
    const form = $("#demoForm");
    if(form){
      form.addEventListener("submit", e=>{
        e.preventDefault();
        let ok = true;
        $$(".err", form).forEach(el=>el.textContent="");
        const need = [["#nombre","Decinos el nombre de tu negocio"],["#rubro","¿A qué se dedica?"],["#productos","Contanos qué ofrecés"],["#whatsapp","Dejanos tu WhatsApp"]];
        need.forEach(([sel,msg])=>{
          const inp = $(sel,form);
          if(!inp.value.trim()){ setErr(inp,msg); ok=false; }
        });
        const wa = $("#whatsapp",form);
        if(wa.value.trim() && !/^[\d+\s()\-]{8,20}$/.test(wa.value.trim())){ setErr(wa,"Número inválido"); ok=false; }
        if(!ok) return;

        // abrir WhatsApp con el mensaje prearmado
        const msg = `Hola TuPaginaYa! Quiero mi demo.%0A`+
          `Negocio: ${enc($("#nombre").value)}%0A`+
          `Rubro: ${enc($("#rubro").value)}%0A`+
          `Ofrece: ${enc($("#productos").value)}%0A`+
          `WhatsApp: ${enc($("#whatsapp").value)}`;
        window.open(`https://wa.me/5491126966153?text=${msg}`,"_blank","noopener");

        form.style.display="none";
        $("#demoOk").style.display="block";
        $("#demoOk").classList.add("in");
      });
    }
    function setErr(inp,msg){ const e = inp.parentElement.querySelector(".err"); if(e) e.textContent = msg; }
    function enc(v){ return encodeURIComponent(v.trim()); }

  });
})();
