/* =====================================================================
   TuPaginaYa v2 — Cinematic Premium · app
   Stack: Three.js (hero WebGL) · GSAP + ScrollTrigger · Lenis
   ===================================================================== */
import * as THREE from "three";

// GSAP / ScrollTrigger / Lenis se cargan como UMD desde /vendor (globales)
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;

gsap.registerPlugin(ScrollTrigger);

const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

/* Detecta navegadores SIN aceleración por hardware (render WebGL por software),
   equipos de gama muy baja o sin WebGL → activa modo LITE (sin 3D ni efectos GPU). */
function detectLite() {
  try {
    if (/[?&]lite/.test(location.search)) return true;   // override manual: ?lite
    if (/[?&]full/.test(location.search)) return false;  // forzar 3D: ?full
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
      if (/swiftshader|llvmpipe|software|basic render|microsoft basic|mesa offscreen|softpipe/.test(r)) return true;
    }
  } catch (e) { return true; }
  return false;
}
const LITE = detectLite();
if (LITE) document.documentElement.classList.add("lite");

/* ---------------------------------------------------------------------
   0 · Datos de los trabajos
   ------------------------------------------------------------------- */
const SITES = [
  {s:"suarmador",n:"Su Armador",d:"suarmador.com.ar",cat:"servicios",rubro:"Amoblamientos",blurb:"Amoblamientos y diseño de interiores premium. Cocinas, placares y muebles a medida con un look editorial.",f:["Video hero","Catálogo","Presupuesto WhatsApp"]},
  {s:"claudiasanchez",n:"Claudia Sánchez Eventos",d:"claudiasanchez.ar",cat:"eventos",rubro:"Eventos",blurb:"Organización y ambientación de bodas, quinces y celebraciones. Identidad cálida y elegante con galería de eventos.",f:["Galería","OG propia","SEO a medida"]},
  {s:"eleonorasticoni",n:"Eleonora Sticoni",d:"eleonorasticoni.com.ar",cat:"salud",rubro:"Coaching & terapias",blurb:"Sitio multipágina para una mentora y coach: coaching ontológico, constelaciones y terapias holísticas.",f:["Sitio multipágina","Video hero","Subpáginas"]},
  {s:"aberturasgyg",n:"Aberturas G&G",d:"aberturasgyg.com.ar",cat:"servicios",rubro:"Industria",blurb:"Fábrica de aberturas de aluminio a medida en Chascomús. Muestra líneas de producto y pedidos de presupuesto.",f:["Catálogo de líneas","Galería de obras","Presupuesto"]},
  {s:"mendozatransfer",n:"Mendoza Transfer",d:"mendozatransfer.com.ar",cat:"eventos",rubro:"Turismo",blurb:"Tours y traslados premium en Mendoza: bodegas, vinos y excursiones. Reservas directas por WhatsApp.",f:["Tours","Reservas","Galería"]},
  {s:"constructorarjo",n:"Constructora RJO",d:"constructorarjo.com.ar",cat:"servicios",rubro:"Construcción",blurb:"Casas, piletas, quinchos y galpones llave en mano. Portfolio de obras y contacto rápido.",f:["Portfolio de obras","Servicios","Contacto"]},
  {s:"caslafv",n:"San Lorenzo · F. Varela",d:"caslafv.com.ar",cat:"instituciones",rubro:"Club deportivo",blurb:"Sede de fútbol infantil con cancha de 11. Galería de fotos y videos, horarios e inscripciones.",f:["Galería fotos+video","Inscripción","Horarios"]},
  {s:"danieleventos",n:"Daniel Producciones",d:"danieleventos.com.ar",cat:"eventos",rubro:"Eventos",blurb:"Fiestas de 15 y casamientos premium. Una landing pensada para enamorar y dejar el contacto.",f:["Video hero","Galería","Contacto"]},
  {s:"durlockespinosa",n:"Espinosa Construcciones",d:"durlockespinosa.com.ar",cat:"servicios",rubro:"Construcción",blurb:"Steel framing, remodelaciones y construcción en seco en San Juan. Servicios y obras realizadas.",f:["Servicios","Obras","Presupuesto"]},
  {s:"electrobohemia",n:"Electro Bohemia",d:"electrobohemia.com.ar",cat:"comercio",rubro:"Mayorista",blurb:"Importación y venta mayorista de electrónica. Catálogo claro orientado a revendedores.",f:["Catálogo mayorista","Contacto","Marcas"]},
  {s:"cleandmlimpieza",n:"Clean DM",d:"cleandmlimpieza.com.ar",cat:"servicios",rubro:"Limpieza",blurb:"Limpieza profesional de edificios, oficinas y obra. Servicios, números de confianza y presupuesto.",f:["Servicios","Estadísticas","Presupuesto"]},
  {s:"cortinasservice",n:"CM Special Service",d:"cortinasservice.com.ar",cat:"servicios",rubro:"Reparaciones",blurb:"Reparación de cortinas metálicas con urgencias 24 hs. Pensada para que llamen ya.",f:["Urgencias 24h","Servicios","Llamado directo"]},
  {s:"lavaderosplash",n:"Lavadero Splash",d:"lavaderosplash.com.ar",cat:"servicios",rubro:"Servicios",blurb:"Lavadero de ropa en Florencio Varela. Servicio rápido y confiable con pedidos por WhatsApp.",f:["Servicios","Precios","WhatsApp"]},
  {s:"lrturbos",n:"Turbos LR",d:"lrturbos.com.ar",cat:"servicios",rubro:"Automotor",blurb:"Reparación de turbocompresores. Sitio técnico y directo, orientado a la consulta inmediata.",f:["Servicios","Consulta","Galería"]},
  {s:"matiasroman",n:"Matías Román",d:"matiasroman.com.ar",cat:"servicios",rubro:"Seguros",blurb:"Productor asesor de seguros. Una presencia profesional para generar confianza y captar consultas.",f:["Coberturas","Asesoramiento","Contacto"]},
  {s:"andresromeroservice",n:"AR Service",d:"andresromeroservice.com.ar",cat:"servicios",rubro:"Construcción",blurb:"Obras, instalaciones y servicios integrales. Catálogo de servicios y presupuesto a un toque.",f:["Servicios","Obras","Presupuesto"]},
  {s:"plasticosfhd",n:"Plásticos FHD",d:"plasticosfhd.com.ar",cat:"comercio",rubro:"Industrial",blurb:"Retiro industrial y compra de rezagos plásticos en todo el país. Sitio B2B claro y serio.",f:["Servicios B2B","Cobertura país","Contacto"]},
  {s:"rbdigital",n:"RB Digital",d:"rbdigital.online",cat:"comercio",rubro:"Streaming",blurb:"Televisión por streaming con sistema anticortes. Planes, beneficios y alta inmediata.",f:["Planes","Beneficios","Alta online"]},
  {s:"sonicboomstore",n:"SonicBoom Store",d:"sonicboomstore.online",cat:"comercio",rubro:"Streaming & TV",blurb:"Streaming, TV e internet. Tienda de servicios digitales con un look enérgico y moderno.",f:["Catálogo","Planes","Contacto"]},
  {s:"jarabus",n:"Jara Bus",d:"jarabus.com.ar",cat:"eventos",rubro:"Traslados",blurb:"Traslados grupales seguros y confiables. Cotización de viajes directa por WhatsApp.",f:["Servicios","Cotización","Flota"]},
  {s:"receptivocataratasluz",n:"Cataratas Traslados",d:"receptivocataratasluz.com.ar",cat:"eventos",rubro:"Turismo",blurb:"Servicio de traslados en Puerto Iguazú. Excursiones y reservas para turistas.",f:["Excursiones","Reservas","Galería"]},
  {s:"licgabrielabasualdo",n:"Lic. Basualdo Gabriela",d:"licgabrielabasualdo.com.ar",cat:"salud",rubro:"Salud mental",blurb:"Acompañamiento terapéutico en Comodoro Rivadavia, presencial y virtual. Presencia profesional y cálida.",f:["Estudios y alcances","Modalidades","Contacto"]},
  {s:"solramirezcoach",n:"Sol Ramírez",d:"solramirezcoach.com.ar",cat:"salud",rubro:"Coaching",blurb:"Coaching ontológico con sesiones online y talleres. Sitio personal que transmite cercanía.",f:["Servicios","Talleres","Agenda"]},
  {s:"iopsaformacion",n:"IOPSA",d:"iopsaformacion.com.ar",cat:"instituciones",rubro:"Formación",blurb:"Instituto de psicología social argentino. Formaciones virtuales con inscripción y programa.",f:["Formaciones","Programa","Inscripción"]},
  {s:"itemacursos",n:"ITEMA",d:"itemacursos.com.ar",cat:"instituciones",rubro:"Educación",blurb:"Instituto tecnológico de mecánica automotriz. Cursos, modalidades y matriculación.",f:["Cursos","Modalidades","Inscripción"]},
  {s:"iglesiareydegloria",n:"Iglesia Rey de Gloria",d:"iglesiareydegloria.com.ar",cat:"instituciones",rubro:"Comunidad",blurb:"Comunidad religiosa en Luján. Horarios, actividades y un espacio para acercar a la gente.",f:["Actividades","Horarios","Contacto"]},
  {s:"enlaceosc",n:"Enlace OSC",d:"enlaceosc.com.ar",cat:"instituciones",rubro:"Consultoría",blurb:"Consultoría estratégica para organizaciones de la sociedad civil. Sitio institucional sobrio y claro.",f:["Servicios","Enfoque","Contacto"]}
];
const imgPath = s => "/images/portfolio/" + s + ".jpg";
const labelOf = c => ({servicios:"Servicios",comercio:"Comercio",eventos:"Eventos & Turismo",salud:"Salud & Coaching",instituciones:"Instituciones"}[c] || c);

/* ---------------------------------------------------------------------
   1 · Lenis smooth scroll + ScrollTrigger sync
   ------------------------------------------------------------------- */
let lenis, lenisRaf;
if (!reduce && !LITE) {
  lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  lenisRaf = t => { if (lenis) lenis.raf(t * 1000); };
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  // anclas internas via lenis
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
    });
  });
}

/* ---------------------------------------------------------------------
   2 · Three.js — hero WebGL (nube de partículas + núcleo wireframe)
   ------------------------------------------------------------------- */
function initHero3D() {
  const canvas = $("#gl");
  if (!canvas || reduce || LITE) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return; }

  const hero = $("#hero");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 7;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const C = [new THREE.Color("#3D6DFF"), new THREE.Color("#7C5CFF"), new THREE.Color("#C13B8A"), new THREE.Color("#FF7A18")];

  // --- nube de partículas volumétrica ---
  const N = window.innerWidth < 700 ? 900 : 1800;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 6.5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    pos[i*3+1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[i*3+2] = r * Math.cos(ph);
    const c = C[(Math.random() * C.length) | 0];
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pm = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(pg, pm);
  scene.add(points);

  // --- GALERÍA FLOTANTE DE SITIOS REALES (pieza 3D propia) ---
  const GAL = ["suarmador","claudiasanchez","eleonorasticoni","mendozatransfer","danieleventos","sonicboomstore","solramirezcoach","cortinasservice","rbdigital","lrturbos","iopsaformacion","constructorarjo","itemacursos","caslafv"];
  const gallery = new THREE.Group();
  scene.add(gallery);
  const cards = [];
  const loader = new THREE.TextureLoader();
  const CW = 3.0, CH = CW * 10 / 16;              // aspecto 16:10 de los screenshots
  const cardGeo = new THREE.PlaneGeometry(CW, CH);
  const edgeGeo = new THREE.EdgesGeometry(cardGeo);
  const glowGeo = new THREE.PlaneGeometry(CW * 1.3, CH * 1.3);
  const GA = Math.PI * (3 - Math.sqrt(5));         // ángulo áureo → distribución pareja

  GAL.forEach((slug, i) => {
    const ang0 = i * GA * 3.7;
    const radius = 6.3 + (i % 3) * 0.95;
    const z0 = 3.2 - i * 2.15;                     // recede hacia adentro
    const brand = C[i % C.length];

    const card = new THREE.Group();
    card.position.set(Math.cos(ang0) * radius, Math.sin(ang0) * radius * 0.62, z0);

    // glow trasero de color de marca
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: brand, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.z = -0.06;
    card.add(glow);

    // screenshot (placeholder hasta que carga la textura)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#171433"), transparent: true, opacity: 0.97, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(cardGeo, mat);
    card.add(mesh);
    loader.load(imgPath(slug), tex => { tex.colorSpace = THREE.SRGBColorSpace; mat.map = tex; mat.color.set("#ffffff"); mat.needsUpdate = true; });

    // marco neón
    const frame = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: brand, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    frame.scale.set(1.05, 1.05, 1);
    frame.position.z = 0.01;
    card.add(frame);

    gallery.add(card);
    cards.push({ card, mat, glow, frame, ang0, radius, z0, phase: i * 1.3 });
  });

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // parallax mouse
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) window.addEventListener("mousemove", e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });

  // scroll: zoom cinematográfico + fade al salir del hero
  let scrollF = 0;
  if (!reduce) {
    ScrollTrigger.create({
      trigger: hero, start: "top top", end: "bottom top", scrub: true,
      onUpdate: self => { scrollF = self.progress; }
    });
  }

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) tick(); });

  // watchdog de FPS: si aún así renderiza lento (software encubierto), cae a LITE en vivo
  let torn = false, fCount = 0, winStart = 0, fpsDone = false;
  function goLite() {
    torn = true;
    document.documentElement.classList.add("lite");
    canvas.style.display = "none";
    try { renderer.dispose(); } catch (e) {}
    try { cardGeo.dispose(); edgeGeo.dispose(); glowGeo.dispose(); pg.dispose(); } catch (e) {}
    if (lenis) { try { gsap.ticker.remove(lenisRaf); lenis.destroy(); } catch (e) {} lenis = null; }
    ScrollTrigger.refresh();
  }

  function tick() {
    if (torn) return;
    if (!visible || document.hidden) { requestAnimationFrame(guard); return; }
    const t = clock.getElapsedTime();

    // galería: orbita lenta alrededor del eje + flotación + billboard a la cámara
    const op = Math.max(0, 1 - scrollF * 1.25);
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const ang = c.ang0 + t * 0.06;
      c.card.position.x = Math.cos(ang) * c.radius;
      c.card.position.y = Math.sin(ang) * c.radius * 0.62;
      c.card.position.z = c.z0 + Math.sin(t * 0.7 + c.phase) * 0.45;
      c.card.quaternion.copy(camera.quaternion);   // siempre legible de frente
      c.mat.opacity = 0.97 * op;
      c.frame.material.opacity = 0.85 * op;
      c.glow.material.opacity = 0.13 * op;
    }
    points.rotation.y = t * 0.02;
    pm.opacity = 0.5 * op;

    // scroll: fly-through hacia adentro de la galería
    camera.position.z = 8 - scrollF * 6;

    // parallax
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.position.x = mouse.x * 1.4;
    camera.position.y = -mouse.y * 1.0;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // watchdog: mide FPS entre el frame 60 y 160 (tras el warm-up de carga de texturas)
    if (!fpsDone) {
      fCount++;
      if (fCount === 60) winStart = performance.now();
      else if (fCount === 160) {
        fpsDone = true;
        const fps = 100 / ((performance.now() - winStart) / 1000);
        if (fps < 30) { goLite(); return; }
      }
    }
    requestAnimationFrame(guard);
  }
  function guard() { tick(); }
  requestAnimationFrame(guard);
}

/* ---------------------------------------------------------------------
   3 · Cursor custom + magnético + tilt
   ------------------------------------------------------------------- */
function initCursor() {
  if (!fine || reduce) return;
  document.documentElement.classList.add("cursor-ready");
  const cur = $("#cursor");
  const dot = { x: innerWidth/2, y: innerHeight/2 };
  const ring = { x: innerWidth/2, y: innerHeight/2 };
  const dotEl = $(".cursor-dot"), ringEl = $(".cursor-ring");
  let mx = dot.x, my = dot.y;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function loop(){
    dot.x += (mx - dot.x) * 0.35; dot.y += (my - dot.y) * 0.35;
    ring.x += (mx - ring.x) * 0.16; ring.y += (my - ring.y) * 0.16;
    dotEl.style.transform = `translate(${dot.x}px,${dot.y}px)`;
    ringEl.style.transform = `translate(${ring.x}px,${ring.y}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    if (e.target.closest('[data-cursor="hover"], a, button')) cur.classList.add("hovering");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest('[data-cursor="hover"], a, button')) cur.classList.remove("hovering");
  });
}

function initMagnetic() {
  if (!fine || reduce) return;
  $$(".magnetic").forEach(el => {
    const strength = 0.35;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(el, { x: x*strength, y: y*strength, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
  });
}

function initTilt() {
  if (!fine || reduce) return;
  $$(".tilt").forEach(el => {
    const max = 9;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * max, rotateX: -py * max, transformPerspective: 900, transformOrigin: "center", duration: 0.4, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.5)" }));
  });
}

/* ---------------------------------------------------------------------
   4 · Animaciones GSAP (hero timeline + reveals + counters)
   ------------------------------------------------------------------- */
function initMotion() {
  // hero timeline
  const words = $$(".hero-title .w");
  gsap.set(words, { yPercent: 115 });
  gsap.set([".hero .eyebrow", ".hero-lead", ".hero-actions", ".hero-mini"], { opacity: 0, y: 24 });

  const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power4.out" } });
  tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.7 })
    .to(words, { yPercent: 0, duration: 1.1, stagger: 0.045 }, "-=0.3")
    .to(".hero-lead", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero-mini", { opacity: 1, y: 0, duration: 0.7 }, "-=0.6");

  if (reduce) { gsap.set(words, { yPercent: 0 }); gsap.set([".hero .eyebrow", ".hero-lead", ".hero-actions", ".hero-mini"], { opacity: 1, y: 0 }); tl.kill(); }

  // reveals genéricos
  const revs = $$(".reveal");
  gsap.set(revs, { opacity: 0, y: 40 });
  ScrollTrigger.batch(revs, {
    start: "top 86%",
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
    once: true
  });
  if (reduce) gsap.set(revs, { opacity: 1, y: 0 });

  // contadores
  $$(".stat-num[data-count]").forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(o.v) + suf; } })
    });
  });

  // parallax sutil del teléfono / floating
  if (!reduce) {
    gsap.to("#phone", { y: -26, scrollTrigger: { trigger: ".cobros", start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".b1", { yPercent: 18, scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } });
    gsap.to(".b3", { yPercent: -14, scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } });
  }
}

/* ---------------------------------------------------------------------
   5 · UI: nav, menú, grilla, filtros, modal, form, progreso
   ------------------------------------------------------------------- */
function initUI() {
  $("#yr").textContent = new Date().getFullYear();

  const nav = $("#nav"), waFloat = $("#waFloat"), progress = $("#progress");
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    waFloat.classList.toggle("show", y > 500);
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // menú móvil
  const burger = $("#burger"), navMobile = $("#navMobile");
  const toggle = open => {
    burger.classList.toggle("open", open);
    navMobile.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  };
  burger.addEventListener("click", () => toggle(!navMobile.classList.contains("open")));
  $$("#navMobile a").forEach(a => a.addEventListener("click", () => toggle(false)));

  // grilla de trabajos
  const grid = $("#workGrid");
  grid.innerHTML = SITES.map(site => `
    <button class="work-card" data-cat="${site.cat}" data-slug="${site.s}" aria-label="Ver detalle de ${site.n}">
      <div class="work-thumb">
        <img src="${imgPath(site.s)}" alt="Sitio web de ${site.n}" loading="lazy">
        <span class="work-badge">${site.rubro}</span>
        <span class="work-open"><span>Ver detalle</span></span>
      </div>
      <div class="work-meta">
        <div><div class="work-cat">${labelOf(site.cat)}</div><div class="work-name">${site.n}</div></div>
        <span class="work-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>
      </div>
    </button>`).join("");

  // filtros con animación
  $$("#filters .chip").forEach(chip => chip.addEventListener("click", () => {
    $$("#filters .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    $$(".work-card").forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      if (show) {
        card.style.display = "";
        gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
      } else card.style.display = "none";
    });
    ScrollTrigger.refresh();
  }));

  // modal
  const modal = $("#modal");
  const bySlug = Object.fromEntries(SITES.map(s => [s.s, s]));
  let lastFocus = null;
  function open(slug) {
    const site = bySlug[slug]; if (!site) return;
    lastFocus = document.activeElement;
    $("#mImg").src = imgPath(site.s); $("#mImg").alt = "Sitio web de " + site.n;
    $("#mCat").textContent = labelOf(site.cat) + " · " + site.rubro;
    $("#mTitle").textContent = site.n;
    $("#mDomain").textContent = site.d;
    $("#mText").textContent = site.blurb;
    $("#mFeats").innerHTML = site.f.map(x => `<li>${x}</li>`).join("");
    $("#mLink").href = "https://" + site.d + "/";
    modal.classList.add("open");
    lenis && lenis.stop();
    gsap.fromTo(".modal-card", { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    $(".modal-close", modal).focus();
  }
  function close() { modal.classList.remove("open"); lenis && lenis.start(); if (lastFocus) lastFocus.focus(); }
  grid.addEventListener("click", e => { const c = e.target.closest(".work-card"); if (c) open(c.dataset.slug); });
  $$("[data-close]", modal).forEach(el => el.addEventListener("click", close));
  addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });

  // formulario demo
  const form = $("#demoForm");
  const enc = v => encodeURIComponent(v.trim());
  const setErr = (inp, msg) => { const e = inp.parentElement.querySelector(".err"); if (e) e.textContent = msg; };
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$(".err", form).forEach(el => el.textContent = "");
    [["#nombre","Decinos el nombre de tu negocio"],["#rubro","¿A qué se dedica?"],["#productos","Contanos qué ofrecés"],["#whatsapp","Dejanos tu WhatsApp"]]
      .forEach(([sel, msg]) => { const inp = $(sel, form); if (!inp.value.trim()) { setErr(inp, msg); ok = false; } });
    const wa = $("#whatsapp", form);
    if (wa.value.trim() && !/^[\d+\s()\-]{8,20}$/.test(wa.value.trim())) { setErr(wa, "Número inválido"); ok = false; }
    if (!ok) return;
    const msg = `Hola TuPaginaYa! Quiero mi demo.%0ANegocio: ${enc($("#nombre").value)}%0ARubro: ${enc($("#rubro").value)}%0AOfrece: ${enc($("#productos").value)}%0AWhatsApp: ${enc($("#whatsapp").value)}`;
    window.open(`https://wa.me/5491126966153?text=${msg}`, "_blank", "noopener");
    form.style.display = "none";
    const okBox = $("#demoOk"); okBox.style.display = "flex";
    gsap.fromTo(okBox, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
  });
}

/* ---------------------------------------------------------------------
   boot
   ------------------------------------------------------------------- */
initUI();
initMotion();
if (!LITE) {
  initHero3D();
  initCursor();
  initMagnetic();
  initTilt();
}
ScrollTrigger.refresh();
