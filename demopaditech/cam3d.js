/* =========================================================
   PADITECH — la cámara del inicio, en 3D
   Cámara WiFi de interior con giro (pan/tilt). Arranca con la
   lente guardada (modo privacidad), se despierta y sigue al
   puntero; su giro mueve el encuadre de la imagen en vivo.
   Se carga solo con GPU (ver script.js).
   ========================================================= */
import * as THREE from './vendor/three.module.min.js';

const html = document.documentElement;
const QA = html.classList.contains('qa');
const canvas = document.getElementById('cam3d');
const wrap = document.getElementById('camWrap');
const stage = document.getElementById('stage');
const feedPan = document.getElementById('feedPan');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function fail(err) {
  window.dispatchEvent(new Event('cam:fail'));
  if (window.console) console.warn('[paditech] cámara 3D no disponible', err);
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: QA });
} catch (e) {
  fail(e);
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(23, 0.86, 0.1, 100);
cam.position.set(0, 7.4, 30);
cam.lookAt(0, 4.75, 0);

/* ---------- estudio: softboxes para los reflejos ---------- */
function studio() {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(60, 40, 60), new THREE.MeshBasicMaterial({ color: 0x0c0d10, side: THREE.BackSide })));
  const panel = (w, h, hex, k, pos, look) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.copy(pos);
    m.lookAt(look);
    env.add(m);
  };
  const c = new THREE.Vector3(0, 5, 0);
  panel(18, 11, 0xffffff, 5.2, new THREE.Vector3(-10, 13, 12), c);   // softbox principal
  panel(5, 20, 0xe4ebf3, 2.4, new THREE.Vector3(16, 7, 6), c);       // tira de relleno
  panel(12, 4, 0xff4a3b, 3.2, new THREE.Vector3(9, 4, -15), c);      // contraluz rojo (REC)
  panel(34, 2.5, 0xffffff, 1.3, new THREE.Vector3(0, -7, 9), c);     // rebote del piso
  panel(8, 8, 0x9fb4cc, 1.0, new THREE.Vector3(-16, 2, -6), c);      // relleno frío
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(env, 0.03);
  pm.dispose();
  return rt.texture;
}
scene.environment = studio();
const key = new THREE.DirectionalLight(0xffffff, 1.15);
key.position.set(-7, 13, 10);
scene.add(key);
const rim = new THREE.DirectionalLight(0xff5545, 1.1);
rim.position.set(9, 6, -11);
scene.add(rim);
scene.add(new THREE.HemisphereLight(0xe6ebf1, 0x14161a, 0.32));

/* ---------- materiales ---------- */
const plastic = new THREE.MeshPhysicalMaterial({ color: 0xf2f3f5, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.28, envMapIntensity: 1 });
const plasticBase = new THREE.MeshPhysicalMaterial({ color: 0xe5e7ea, roughness: 0.56, clearcoat: 0.2, clearcoatRoughness: 0.5, envMapIntensity: 0.95, side: THREE.DoubleSide });
const gloss = new THREE.MeshPhysicalMaterial({ color: 0x030405, roughness: 0.13, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.3 });
const gun = new THREE.MeshStandardMaterial({ color: 0x272b31, roughness: 0.3, metalness: 0.85 });
const matte = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.8 });
const glass = new THREE.MeshPhysicalMaterial({
  color: 0x080b16, roughness: 0.03, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0,
  iridescence: 1, iridescenceIOR: 1.75, iridescenceThicknessRange: [180, 560], envMapIntensity: 1.9,
  transparent: true, opacity: 0.64, depthWrite: false
});
const ledMat = new THREE.MeshBasicMaterial({ color: 0x3a1512 });

/* ---------- base: campana con copa arriba ---------- */
const prof = new THREE.SplineCurve([
  [0, 0], [2.8, 0], [2.97, 0.08], [3.04, 0.3], [3.05, 0.9], [2.99, 1.9], [2.87, 3.0], [2.74, 3.9],
  [2.66, 4.45], [2.63, 4.66], [2.56, 4.78], [2.45, 4.76], [2.34, 4.58], [1.9, 4.12], [0.001, 3.96]
].map(([r, y]) => new THREE.Vector2(r, y))).getPoints(110);
const base = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), plasticBase);
scene.add(base);
// junta entre el cabezal y la base
const seam = new THREE.Mesh(new THREE.TorusGeometry(2.645, 0.04, 10, 128), matte);
seam.rotation.x = Math.PI / 2;
seam.position.y = 4.56;
scene.add(seam);
const foot = new THREE.Mesh(new THREE.TorusGeometry(2.86, 0.07, 12, 128), matte);
foot.rotation.x = Math.PI / 2;
foot.position.y = 0.09;
scene.add(foot);
// micrófono: agujeritos al frente de la base
for (let i = 0; i < 5; i++) {
  const a = (i - 2) * 0.075;
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), matte);
  dot.position.set(Math.sin(a) * 3.035, 1.25, Math.cos(a) * 3.035);
  dot.lookAt(dot.position.x * 2, 1.25, dot.position.z * 2);
  scene.add(dot);
}

/* ---------- cabezal: esfera + cara negra + lente ---------- */
const HEAD_Y = 6.12, R = 3.05;
const pan = new THREE.Group();
scene.add(pan);
const tilt = new THREE.Group();
tilt.position.y = HEAD_Y;
pan.add(tilt);
tilt.add(new THREE.Mesh(new THREE.SphereGeometry(R, 112, 80), plastic));

function capsuleTex() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 256, 512);
  g.fillStyle = '#fff';
  const x = 10, y = 10, w = 236, h = 492, r = 112;
  g.beginPath();
  g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}
const deg = THREE.MathUtils.degToRad;
const FACE_W = deg(62), FACE_T0 = deg(27), FACE_T = deg(87);
const faceMat = gloss.clone();
faceMat.alphaMap = capsuleTex();
faceMat.alphaTest = 0.5;
const face = new THREE.Mesh(new THREE.SphereGeometry(R + 0.03, 72, 72, Math.PI / 2 - FACE_W / 2, FACE_W, FACE_T0, FACE_T), faceMat);
tilt.add(face);
// filete de la cara (borde apenas más claro)
const onSphere = (theta, r) => new THREE.Vector3(0, Math.cos(theta) * r, Math.sin(theta) * r);
function mount(obj, theta, r) {
  const n = onSphere(theta, 1);
  obj.position.copy(n.clone().multiplyScalar(r));
  obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  tilt.add(obj);
  return obj;
}
const lens = mount(new THREE.Group(), deg(76), R + 0.02);
const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.09, 24, 96), gun);
bezel.position.z = 0.03;
lens.add(bezel);
const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.77, 0.34, 64, 1, true), matte);
barrel.rotation.x = Math.PI / 2;
barrel.position.z = -0.12;
lens.add(barrel);
const back = new THREE.Mesh(new THREE.CircleGeometry(0.76, 64), matte);
back.position.z = -0.28;
lens.add(back);
const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 16, 64), gun);
ring.position.z = -0.22;
lens.add(ring);
const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 16), new THREE.MeshPhysicalMaterial({ color: 0x0b1530, roughness: 0.1, clearcoat: 1, emissive: 0x0a1c48, emissiveIntensity: 0.35 }));
pupil.position.z = -0.2;
lens.add(pupil);
const dome = new THREE.Mesh(new THREE.SphereGeometry(0.72, 64, 24, 0, Math.PI * 2, 0, Math.PI * 0.3), glass);
dome.rotation.x = Math.PI / 2;
dome.position.z = -0.62;
lens.add(dome);
// sensor de luz y LED de estado
mount(new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), new THREE.MeshPhysicalMaterial({ color: 0x15171c, roughness: 0.2, clearcoat: 1 })), deg(52), R + 0.035);
const led = mount(new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 12), ledMat), deg(42), R + 0.03);
function glowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,90,70,1)');
  gr.addColorStop(0.25, 'rgba(255,59,48,.55)');
  gr.addColorStop(1, 'rgba(255,59,48,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
glow.scale.setScalar(1.1);
glow.position.set(0, 0, 0.06);
led.add(glow);

/* ---------- sombra de contacto ---------- */
function shadowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.85)');
  gr.addColorStop(0.45, 'rgba(0,0,0,.45)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 6.2), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false, opacity: 0.9 }));
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.01;
scene.add(shadow);

/* ---------- movimiento: resorte casi crítico, como un motor ---------- */
const PRIV = { pan: 0.42, tilt: 1.95 };          // lente guardada dentro de la base
const REST = 0.2;                                // con esta inclinación la lente mira al frente
const pose = QA ? { pan: -0.34, tilt: REST } : { pan: PRIV.pan, tilt: PRIV.tilt };
const target = { pan: -0.34, tilt: REST };
const vel = { pan: 0, tilt: 0 };
let privacy = !QA, waking = false, ledOn = QA, lastMove = -1e9, wakeAt = 0;

function setTargetFrom(x, y) {
  const r = canvas.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
  const dx = (x - cx) / Math.max(innerWidth * 0.55, 1);
  const dy = (y - cy) / Math.max(innerHeight * 0.6, 1);
  target.pan = clamp(dx * 1.15, -1.2, 1.2);
  target.tilt = clamp(dy * 0.7 + REST, -0.32, 0.78);
  lastMove = performance.now();
}
window.addEventListener('pointermove', e => { if (e.pointerType !== 'touch') setTargetFrom(e.clientX, e.clientY); }, { passive: true });
if (stage) stage.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') setTargetFrom(e.clientX, e.clientY); }, { passive: true });
window.addEventListener('cam:privacy', e => {
  privacy = !!e.detail;
  if (!privacy) { lastMove = -1e9; ledOn = true; }
});

function patrol(now) {
  // recorrido de vigilancia: va, se detiene, vuelve
  const t = now / 1000;
  const s = Math.sin(t * 0.38);
  target.pan = Math.sign(s) * Math.pow(Math.abs(s), 0.55) * 0.68;
  target.tilt = REST + 0.04 + Math.sin(t * 0.23) * 0.07;
}

let px = 0, py = 0;
function step(dt, now) {
  if (!privacy && now - lastMove > (finePointer ? 3200 : 4000) && !QA) patrol(now);
  const k = 30, d = 2 * Math.sqrt(k) * 0.9;
  ['pan', 'tilt'].forEach(a => {
    const tgt = privacy ? PRIV[a] : target[a];
    vel[a] += (k * (tgt - pose[a]) - d * vel[a]) * dt;
    vel[a] = clamp(vel[a], -3.2, 3.2);
    pose[a] += vel[a] * dt;
  });
  pan.rotation.y = pose.pan;
  tilt.rotation.x = pose.tilt;
  // la imagen en vivo es lo que ve esta cámara
  if (feedPan && !privacy) {
    const nx = clamp(pose.pan / 1.1, -1, 1), ny = clamp((pose.tilt - REST) / 0.5, -1, 1);
    if (Math.abs(nx - px) > 0.002 || Math.abs(ny - py) > 0.002) {
      px = nx; py = ny;
      feedPan.style.setProperty('--px', px.toFixed(3));
      feedPan.style.setProperty('--py', py.toFixed(3));
    }
  }
  // LED: titila dos veces al despertar, después queda fijo (REC)
  let on = ledOn && !privacy;
  if (waking) { const e = now - wakeAt; on = e > 0 && ((e % 260) < 130) && e < 780 ? true : e >= 780; if (e >= 780) waking = false; }
  ledMat.color.setHex(on ? 0xff3b30 : 0x3a1512);
  glow.material.opacity = on ? 0.95 : 0;
}

/* ---------- tamaño ---------- */
function resize() {
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  cam.aspect = w / h;
  cam.updateProjectionMatrix();
}
resize();
if ('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap);
else window.addEventListener('resize', resize);

/* ---------- bucle ---------- */
let rafId = 0, last = 0, frames = 0, inView = true, alive = true;
function loop(now) {
  if (!alive) return;
  rafId = 0;
  const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
  last = now;
  step(dt, now);
  renderer.render(scene, cam);
  if (++frames === 2) {
    html.classList.add('cam-ready');
    window.dispatchEvent(new Event('cam:ready'));
  }
  if (QA && frames > 3) return; // captura estática
  if (inView && document.visibilityState === 'visible') rafId = requestAnimationFrame(loop);
}
function start() { if (alive && !rafId) { last = 0; rafId = requestAnimationFrame(loop); } }
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView) start(); }, { threshold: 0 }).observe(wrap);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') start(); });

// despertar: sale del modo privacidad mientras se conecta la imagen
if (!QA) {
  const wake = () => { if (!privacy) return; privacy = false; ledOn = true; waking = true; wakeAt = performance.now() + 120; };
  setTimeout(wake, html.classList.contains('feed-live') ? 250 : 650);
}
start();

/* ---------- modo liviano en caliente ---------- */
window.addEventListener('padi:lite', () => {
  alive = false;
  if (rafId) cancelAnimationFrame(rafId);
  scene.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) [].concat(o.material).forEach(m => { Object.values(m).forEach(v => { if (v && v.isTexture) v.dispose(); }); m.dispose(); });
  });
  if (scene.environment) scene.environment.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  html.classList.remove('cam-ready');
}, { once: true });
