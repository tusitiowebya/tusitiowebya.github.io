/* =====================================================================
   MD Podas — Cinematic Premium · app
   Three.js (hojas cayendo sobre el video) · GSAP + ScrollTrigger · Lenis
   ===================================================================== */
import * as THREE from "three";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;
gsap.registerPlugin(ScrollTrigger);

const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine   = matchMedia("(hover:hover) and (pointer:fine)").matches;

/* Detecta navegadores SIN aceleración por hardware (WebGL por software),
   equipos de gama muy baja o sin WebGL → modo LITE (sin 3D ni efectos GPU). */
function detectLite() {
  try {
    if (/[?&]lite/.test(location.search)) return true;
    if (/[?&]full/.test(location.search)) return false;
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
   1 · Lenis smooth scroll + ScrollTrigger sync
   ------------------------------------------------------------------- */
let lenis, lenisRaf;
if (!reduce && !LITE) {
  lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  lenisRaf = t => { if (lenis) lenis.raf(t * 1000); };
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
    });
  });
}

/* ---------------------------------------------------------------------
   2 · Three.js — hojas volumétricas cayendo sobre el video del hero
   ------------------------------------------------------------------- */
function leafTexture() {
  const s = 128;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const g = cv.getContext("2d");
  g.translate(s / 2, s / 2);
  // hoja: dos curvas simétricas + nervadura
  g.beginPath();
  g.moveTo(0, -52);
  g.bezierCurveTo(40, -34, 40, 34, 0, 54);
  g.bezierCurveTo(-40, 34, -40, -34, 0, -52);
  g.closePath();
  const grd = g.createLinearGradient(0, -52, 0, 54);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(1, "#dfeec8");
  g.fillStyle = grd;
  g.fill();
  g.strokeStyle = "rgba(60,90,30,.55)";
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, -46); g.lineTo(0, 48); g.stroke();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function initLeaves() {
  const canvas = $("#gl");
  const hero = $("#inicio");
  if (!canvas || !hero || reduce || LITE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 14;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const tex = leafTexture();
  const COLORS = [new THREE.Color("#A3E635"), new THREE.Color("#7FB93B"), new THREE.Color("#C6FF4A"),
                  new THREE.Color("#E0B24A"), new THREE.Color("#F5872E")];
  const N = window.innerWidth < 700 ? 46 : 90;
  const geo = new THREE.PlaneGeometry(1, 1);
  const group = new THREE.Group();
  scene.add(group);

  const RANGE_X = 26, RANGE_Y = 18;
  const leaves = [];
  for (let i = 0; i < N; i++) {
    const c = COLORS[(Math.random() * COLORS.length) | 0];
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: c, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });
    const m = new THREE.Mesh(geo, mat);
    const scale = 0.35 + Math.random() * 0.75;
    const depth = -6 + Math.random() * 14;      // parallax por profundidad
    m.userData = {
      scale,
      x: (Math.random() - 0.5) * RANGE_X,
      y: (Math.random() - 0.5) * RANGE_Y,
      z: depth,
      fall: 0.9 + Math.random() * 1.6,
      sway: 0.6 + Math.random() * 1.4,
      swayAmp: 0.6 + Math.random() * 1.2,
      rotS: (Math.random() - 0.5) * 1.4,
      phase: Math.random() * Math.PI * 2,
      baseOp: 0.55 + Math.random() * 0.4
    };
    m.scale.setScalar(scale);
    group.add(m);
    leaves.push(m);
  }

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) window.addEventListener("mousemove", e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });

  // el campo de hojas se disuelve al salir del hero
  let scrollF = 0;
  ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", scrub: true, onUpdate: s => scrollF = s.progress });

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);

  // watchdog de FPS: si renderiza lento (software encubierto) → LITE en vivo
  let torn = false, fCount = 0, winStart = 0, fpsDone = false;
  function goLite() {
    torn = true;
    document.documentElement.classList.add("lite");
    canvas.style.display = "none";
    try { renderer.dispose(); geo.dispose(); tex.dispose(); leaves.forEach(l => l.material.dispose()); } catch (e) {}
    if (lenis) { try { gsap.ticker.remove(lenisRaf); lenis.destroy(); } catch (e) {} lenis = null; }
    ScrollTrigger.refresh();
  }

  function tick() {
    if (torn) return;
    if (!visible || document.hidden) { requestAnimationFrame(tick); return; }
    const t = clock.getElapsedTime();
    const fade = Math.max(0, 1 - scrollF * 1.35);

    for (const m of leaves) {
      const d = m.userData;
      d.y -= d.fall * 0.03;
      if (d.y < -RANGE_Y / 2) { d.y = RANGE_Y / 2; d.x = (Math.random() - 0.5) * RANGE_X; }
      m.position.x = d.x + Math.sin(t * d.sway + d.phase) * d.swayAmp;
      m.position.y = d.y;
      m.position.z = d.z;
      m.rotation.z = t * d.rotS + d.phase;
      m.rotation.y = Math.sin(t * d.sway + d.phase) * 0.9;
      m.material.opacity = d.baseOp * fade;
    }
    // parallax suave con el mouse
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    group.rotation.y = mouse.x * 0.25;
    group.rotation.x = mouse.y * 0.16;
    camera.position.z = 14 + scrollF * 4;

    renderer.render(scene, camera);

    if (!fpsDone) {
      fCount++;
      if (fCount === 40) winStart = performance.now();
      else if (fCount === 130) {
        fpsDone = true;
        const fps = 90 / ((performance.now() - winStart) / 1000);
        if (fps < 28) { goLite(); return; }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------------------
   3 · Cursor custom + magnético + tilt
   ------------------------------------------------------------------- */
function initCursor() {
  if (!fine || reduce) return;
  document.body.classList.add("cursor-ready");
  const cur = $("#cursor"), dotEl = $(".cursor-dot"), ringEl = $(".cursor-ring");
  const dot = { x: innerWidth/2, y: innerHeight/2 }, ring = { ...dot };
  let mx = dot.x, my = dot.y;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function loop(){
    dot.x += (mx-dot.x)*0.35; dot.y += (my-dot.y)*0.35;
    ring.x += (mx-ring.x)*0.16; ring.y += (my-ring.y)*0.16;
    dotEl.style.transform = `translate(${dot.x}px,${dot.y}px)`;
    ringEl.style.transform = `translate(${ring.x}px,${ring.y}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => { if (e.target.closest('[data-cursor="hover"],a,button')) cur.classList.add("hovering"); });
  document.addEventListener("mouseout",  e => { if (e.target.closest('[data-cursor="hover"],a,button')) cur.classList.remove("hovering"); });
}

function initMagnetic() {
  if (!fine || reduce) return;
  $$(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width/2) * 0.32, y: (e.clientY - r.top - r.height/2) * 0.32, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
  });
}

function initTilt() {
  if (!fine || reduce) return;
  $$(".tilt").forEach(el => {
    const max = 8;
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
  const words = $$(".hero-title .w");
  gsap.set(words, { yPercent: 118 });
  gsap.set([".hero .eyebrow", ".hero-lead", ".hero-actions", ".hero-trust"], { opacity: 0, y: 24 });

  const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power4.out" } });
  tl.to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.7 })
    .to(words, { yPercent: 0, duration: 1.05, stagger: 0.05 }, "-=0.3")
    .to(".hero-lead", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero-trust", { opacity: 1, y: 0, duration: 0.7 }, "-=0.6");
  if (reduce) { gsap.set(words, { yPercent: 0 }); gsap.set([".hero .eyebrow", ".hero-lead", ".hero-actions", ".hero-trust"], { opacity: 1, y: 0 }); tl.kill(); }

  const revs = $$(".reveal");
  gsap.set(revs, { opacity: 0, y: 40 });
  ScrollTrigger.batch(revs, {
    start: "top 88%",
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }),
    once: true
  });
  if (reduce) gsap.set(revs, { opacity: 1, y: 0 });

  $$(".stat-num[data-count]").forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "", o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(o.v) + suf; } })
    });
  });

  if (!reduce) {
    gsap.to(".safety-bg img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".safety", start: "top bottom", end: "bottom top", scrub: 1 } });
  }
}

/* ---------------------------------------------------------------------
   5 · UI: nav, menú, progreso, galería/modal, formulario
   ------------------------------------------------------------------- */
function initUI() {
  $("#yr").textContent = new Date().getFullYear();

  const nav = $("#nav"), waFloat = $("#waFloat"), progress = $("#progress");
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    waFloat.classList.toggle("show", y > 520);
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

  // galería / lightbox
  const figs = $$(".gal-item");
  const items = figs.map(f => ({ src: f.querySelector("img").src, cap: f.querySelector("figcaption")?.textContent || "" }));
  const modal = $("#modal"), mImg = $("#modalImg"), mCap = $("#modalCap");
  let idx = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    mImg.src = items[idx].src; mImg.alt = items[idx].cap; mCap.textContent = items[idx].cap;
    gsap.fromTo(".modal-figure", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  }
  function open(i) { modal.classList.add("open"); lenis && lenis.stop(); show(i); }
  function close() { modal.classList.remove("open"); lenis && lenis.start(); }
  figs.forEach((f, i) => f.addEventListener("click", () => open(i)));
  $$("[data-close]", modal).forEach(el => el.addEventListener("click", close));
  $("#modalPrev").addEventListener("click", () => show(idx - 1));
  $("#modalNext").addEventListener("click", () => show(idx + 1));
  addEventListener("keydown", e => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // formulario → WhatsApp
  const form = $("#contactForm");
  const enc = v => encodeURIComponent(v.trim());
  const setErr = (inp, msg) => { const e = inp.parentElement.querySelector(".err"); if (e) e.textContent = msg; };
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$(".err", form).forEach(el => el.textContent = "");
    const nombre = $("#f-nombre"), tel = $("#f-tel");
    if (!nombre.value.trim()) { setErr(nombre, "Decinos tu nombre"); ok = false; }
    if (!tel.value.trim()) { setErr(tel, "Dejanos tu teléfono"); ok = false; }
    else if (!/^[\d+\s()\-]{6,20}$/.test(tel.value.trim())) { setErr(tel, "Número inválido"); ok = false; }
    if (!ok) return;
    const serv = $("#f-serv").value || "Consulta general";
    const msg = $("#f-msg").value.trim();
    let text = `Hola MD Podas! Quiero un presupuesto.%0ANombre: ${enc(nombre.value)}%0ATeléfono: ${enc(tel.value)}%0AServicio: ${enc(serv)}`;
    if (msg) text += `%0AMensaje: ${enc(msg)}`;
    window.open(`https://wa.me/5491161022884?text=${text}`, "_blank", "noopener");
  });
}

/* ---------------------------------------------------------------------
   boot
   ------------------------------------------------------------------- */
initUI();
initMotion();
if (!LITE) {
  initLeaves();
  initCursor();
  initMagnetic();
  initTilt();
}
ScrollTrigger.refresh();
