/* TuPaginaYa v3 · hero 3D de la home
   Túnel de velocidad: las webs reales de clientes pasan alrededor del texto
   y las estelas de la marca (azul → violeta → magenta → naranja) cruzan a
   toda velocidad. Al scrollear, el túnel acelera. Si no hay GPU o los FPS
   caen, se apaga y queda el fondo estático (modo LITE). */
import * as THREE from "/vendor/three.module.js";

const root = document.documentElement;
const canvas = document.getElementById("gl");
const hero = document.getElementById("hero");
const SHOTS = (hero && hero.dataset.shots ? hero.dataset.shots.split(",") : []);

function goLite() {
  root.classList.add("lite");
  try { sessionStorage.setItem("tpy-lite", "1"); } catch (e) {}
  if (canvas) canvas.remove();
}

if (canvas && !root.classList.contains("lite") && SHOTS.length) start();

function start() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x0a0820, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0820, 5, 24);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const DEPTH = 36;          // largo del túnel
  const NEAR_Z = 7;          // pasado este z, la pieza vuelve al fondo
  const mobile = innerWidth < 760;

  /* --- tarjetas: capturas de webs reales en anillo --- */
  const loader = new THREE.TextureLoader();
  const cards = [];
  const COUNT = mobile ? 16 : 26;
  const cardGeo = new THREE.PlaneGeometry(2.4, 1.5);
  const frameGeo = new THREE.PlaneGeometry(2.52, 1.62);
  const colors = [0x3d6dff, 0x7c5cff, 0xc13b8a, 0xff7a18];
  const textures = SHOTS.map((src) => {
    const t = loader.load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  });
  for (let i = 0; i < COUNT; i++) {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(frameGeo, new THREE.MeshBasicMaterial({ color: colors[i % 4], transparent: true, opacity: 0.55 }));
    frame.position.z = -0.01;
    const img = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ map: textures[i % textures.length] }));
    g.add(frame, img);
    const a = (i / COUNT) * Math.PI * 2 * 2.618; // espiral áurea para no alinear
    const rad = (mobile ? 3.1 : 4.2) + (i % 3) * 0.55;
    g.userData = { a, rad, z: -((i / COUNT) * DEPTH) + NEAR_Z - 2, spin: (Math.random() - 0.5) * 0.2 };
    scene.add(g);
    cards.push(g);
  }

  /* --- estelas --- */
  const N = mobile ? 140 : 260;
  const pos = new Float32Array(N * 6);
  const col = new Float32Array(N * 6);
  const meta = [];
  const pal = colors.map((c) => new THREE.Color(c));
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.6 + Math.random() * 6;
    const len = 0.6 + Math.random() * 2.6;
    const z = -Math.random() * DEPTH + NEAR_Z;
    meta.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, z, len, v: 0.6 + Math.random() * 0.9 });
    const c = pal[i % 4];
    col.set([c.r, c.g, c.b, c.r * 0.05, c.g * 0.05, c.b * 0.05], i * 6);
  }
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  lgeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const lines = new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 }));
  scene.add(lines);

  /* --- tamaño --- */
  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 78 : 62;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  /* --- interacción: mouse = parallax, scroll = acelera --- */
  let mx = 0, my = 0, tx = 0, ty = 0, boost = 0;
  addEventListener("pointermove", (e) => { tx = (e.clientX / innerWidth - 0.5) * 0.9; ty = (e.clientY / innerHeight - 0.5) * 0.6; }, { passive: true });
  addEventListener("scroll", () => { boost = Math.min(1, scrollY / (hero.clientHeight * 0.8)); }, { passive: true });

  /* --- visible / no visible --- */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }).observe(hero);

  /* --- watchdog de FPS: < 24 sostenido = sin GPU real → LITE.
     < 12 = pestaña sin pintar (pane oculto), no cuenta. --- */
  let frames = 0, t0 = performance.now(), checks = 0, slow = 0;
  const watchdog = !/[?&]full/.test(location.search);

  const clock = new THREE.Clock();
  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const speed = (reduce ? 0.6 : 2.2) + boost * 9;

    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    camera.position.x = mx; camera.position.y = -my;
    camera.lookAt(0, 0, -10);

    for (const g of cards) {
      const u = g.userData;
      u.z += speed * dt;
      if (u.z > NEAR_Z) u.z -= DEPTH;
      u.a += u.spin * dt * 0.2;
      g.position.set(Math.cos(u.a) * u.rad * 1.25, Math.sin(u.a) * u.rad * 0.72, u.z);
      g.lookAt(0, 0, u.z + 14);
    }
    for (let i = 0; i < N; i++) {
      const m = meta[i];
      m.z += speed * m.v * 2.2 * dt;
      if (m.z > NEAR_Z) m.z -= DEPTH;
      const L = m.len * (1 + boost * 3);
      pos.set([m.x, m.y, m.z, m.x, m.y, m.z - L], i * 6);
    }
    lgeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);

    if (watchdog && checks < 4) {
      frames++;
      const now = performance.now();
      if (now - t0 > 1000) {
        const fps = (frames * 1000) / (now - t0);
        frames = 0; t0 = now; checks++;
        if (fps >= 12 && fps < 24) slow++;
        if (slow >= 2) { cancelAnimationFrame(raf); renderer.dispose(); goLite(); }
      }
    }
  }
  loop();
}
