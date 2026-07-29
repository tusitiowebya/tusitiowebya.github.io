/* =====================================================================
   PROCERCOS Eléctricos — Cinematic Premium · app
   Stack: Three.js (hero WebGL) · GSAP + ScrollTrigger · Lenis
   ===================================================================== */
import * as THREE from "three";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;
gsap.registerPlugin(ScrollTrigger);

const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

/* Detecta navegadores sin aceleración por hardware → modo LITE */
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
   Lenis smooth scroll
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
   Three.js — pieza 3D propia: perímetro de cerco eléctrico con
   corriente pulsando entre postes + chispazos aleatorios
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
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.6, 9);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const VOLT = new THREE.Color("#E8FF3D");
  const VOLT_DIM = new THREE.Color("#8FA300");
  const WHITE = new THREE.Color("#FFFFFF");

  // --- perímetro de postes en elipse, con profundidad ---
  const N = window.innerWidth < 700 ? 9 : 13;
  const posts = [];
  const rx = 8.5, rz = 3.4;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    posts.push(new THREE.Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz - 1.5));
  }

  const group = new THREE.Group();
  scene.add(group);

  // postes: cilindros finos
  const postGeo = new THREE.CylinderGeometry(0.03, 0.04, 2.6, 6);
  const postMat = new THREE.MeshBasicMaterial({ color: 0x33362a, transparent: true, opacity: 0.5 });
  posts.forEach(p => {
    const m = new THREE.Mesh(postGeo, postMat);
    m.position.set(p.x, 1.3, p.z);
    group.add(m);
  });

  // alambres: 3 niveles horizontales entre postes consecutivos
  const LEVELS = [0.7, 1.4, 2.1];
  const wireLines = [];
  const wireMat = new THREE.LineBasicMaterial({ color: VOLT_DIM, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let i = 0; i < N; i++) {
    const a = posts[i], b = posts[(i + 1) % N];
    LEVELS.forEach(y => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(a.x, y, a.z), new THREE.Vector3(b.x, y, b.z)
      ]);
      const line = new THREE.Line(g, wireMat.clone());
      group.add(line);
      wireLines.push({ a: new THREE.Vector3(a.x, y, a.z), b: new THREE.Vector3(b.x, y, b.z), mat: line.material });
    });
  }

  // pulsos de corriente viajando por los alambres
  const PULSES_PER_WIRE = 1;
  const pulses = [];
  const pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
  wireLines.forEach((w, idx) => {
    for (let k = 0; k < PULSES_PER_WIRE; k++) {
      const mat = new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(pulseGeo, mat);
      scene.add(mesh);
      pulses.push({ mesh, wire: w, phase: Math.random(), speed: 0.18 + Math.random() * 0.14 });
    }
  });

  // chispazos aleatorios en postes (destello)
  const sparkGeo = new THREE.SphereGeometry(0.16, 10, 10);
  const sparks = posts.map(p => {
    const mat = new THREE.MeshBasicMaterial({ color: VOLT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(sparkGeo, mat);
    mesh.position.set(p.x, 1.4 + Math.random() * 1.2, p.z);
    scene.add(mesh);
    return { mesh, mat, next: Math.random() * 4, life: 0 };
  });

  // niebla sutil de partículas de fondo
  const bgN = window.innerWidth < 700 ? 200 : 400;
  const bgPos = new Float32Array(bgN * 3);
  for (let i = 0; i < bgN; i++) {
    bgPos[i*3] = (Math.random() - 0.5) * 24;
    bgPos[i*3+1] = Math.random() * 6;
    bgPos[i*3+2] = (Math.random() - 0.5) * 14 - 2;
  }
  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
  const bgMat = new THREE.PointsMaterial({ size: 0.028, color: VOLT_DIM, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const bgPoints = new THREE.Points(bgGeo, bgMat);
  scene.add(bgPoints);

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

  let scrollF = 0;
  ScrollTrigger.create({
    trigger: hero, start: "top top", end: "bottom top", scrub: true,
    onUpdate: self => { scrollF = self.progress; }
  });

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) tick(); });

  // watchdog de FPS: si renderiza lento igual, cae a LITE en vivo
  let torn = false, fCount = 0, winStart = 0, fpsDone = false;
  function goLite() {
    torn = true;
    document.documentElement.classList.add("lite");
    canvas.style.display = "none";
    try { renderer.dispose(); } catch (e) {}
    if (lenis) { try { gsap.ticker.remove(lenisRaf); lenis.destroy(); } catch (e) {} lenis = null; }
    ScrollTrigger.refresh();
  }

  function tick() {
    if (torn) return;
    if (!visible || document.hidden) { requestAnimationFrame(guard); return; }
    const t = clock.getElapsedTime();
    const op = Math.max(0, 1 - scrollF * 1.3);

    // pulsos de corriente viajando por cada alambre
    pulses.forEach(p => {
      const tt = (t * p.speed + p.phase) % 1;
      p.mesh.position.lerpVectors(p.wire.a, p.wire.b, tt);
      p.mesh.material.opacity = 0.9 * op;
    });

    // brillo del alambre pulsa levemente (corriente alterna)
    wireLines.forEach((w, i) => {
      w.mat.opacity = (0.28 + Math.sin(t * 3 + i) * 0.14) * op;
    });

    // chispazos aleatorios
    sparks.forEach(s => {
      s.next -= 1 / 60;
      if (s.next <= 0 && s.life <= 0) { s.life = 0.22; s.next = 2 + Math.random() * 4; }
      if (s.life > 0) {
        s.life -= 1 / 60;
        s.mat.opacity = Math.max(0, s.life / 0.22) * 0.85 * op;
        const sc = 1 + (1 - s.life / 0.22) * 2.4;
        s.mesh.scale.setScalar(sc);
      } else {
        s.mat.opacity = 0;
      }
    });

    // rotación lenta del perímetro completo
    group.rotation.y = Math.sin(t * 0.05) * 0.12;
    bgPoints.rotation.y = t * 0.01;

    // scroll: zoom cinematográfico + fade
    camera.position.z = 9 - scrollF * 3.5;
    camera.position.y = 1.6 - scrollF * 0.6;

    // parallax de mouse
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.position.x = mouse.x * 1.6;
    camera.lookAt(0, 1.1, -1.5);

    renderer.render(scene, camera);

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
   Cursor magnético + tilt
   ------------------------------------------------------------------- */
function initMagnetic() {
  if (!fine || reduce || LITE) return;
  $$(".magnetic").forEach(el => {
    const strength = 0.3;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
  });
}

function initTilt() {
  if (!fine || reduce || LITE) return;
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
   Animaciones GSAP (hero timeline + reveals)
   ------------------------------------------------------------------- */
function initMotion() {
  const words = $$(".hero-title .w");
  gsap.set(words, { yPercent: 115 });
  gsap.set([".hero .tag", ".hero-sub", ".hero-cta", ".chips"], { opacity: 0, y: 24 });

  const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power4.out" } });
  tl.to(".hero .tag", { opacity: 1, y: 0, duration: 0.7 })
    .to(words, { yPercent: 0, duration: 1.1, stagger: 0.08 }, "-=0.3")
    .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".chips", { opacity: 1, y: 0, duration: 0.7 }, "-=0.6");

  if (reduce) { gsap.set(words, { yPercent: 0 }); gsap.set([".hero .tag", ".hero-sub", ".hero-cta", ".chips"], { opacity: 1, y: 0 }); tl.kill(); }

  const revs = $$(".reveal");
  gsap.set(revs, { opacity: 0, y: 40 });
  ScrollTrigger.batch(revs, {
    start: "top 88%",
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
    once: true
  });
  if (reduce) gsap.set(revs, { opacity: 1, y: 0 });

  // reveal-img: clip-path (scroll-driven, robusto ante saltos de scroll)
  const imgs = $$(".gal-i, .porque-photo");
  function checkImgReveals() {
    const line = window.innerHeight * 0.9;
    imgs.forEach(el => { if (!el.classList.contains("in") && el.getBoundingClientRect().top < line) el.classList.add("in"); });
  }
  window.addEventListener("scroll", checkImgReveals, { passive: true });
  checkImgReveals();

  if (reduce) imgs.forEach(el => el.classList.add("in"));
}

/* ---------------------------------------------------------------------
   UI: nav, menú, progreso, wa float
   ------------------------------------------------------------------- */
function initUI() {
  $("#yr").textContent = new Date().getFullYear();

  const nav = $("#nav"), waFloat = $(".wa-float"), progress = $("#progress");
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    waFloat.classList.toggle("show", y > 400);
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $("#burger"), navMobile = $("#navMobile");
  const toggle = open => {
    burger.classList.toggle("open", open);
    navMobile.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  };
  burger.addEventListener("click", () => toggle(!navMobile.classList.contains("open")));
  $$("#navMobile a").forEach(a => a.addEventListener("click", () => toggle(false)));
}

/* boot */
function reveal() { document.body.classList.add("loaded"); }
if (document.readyState === "complete") reveal();
else window.addEventListener("load", reveal);
setTimeout(reveal, 700);

initUI();
initMotion();
if (!LITE) { initHero3D(); initMagnetic(); initTilt(); }
ScrollTrigger.refresh();
