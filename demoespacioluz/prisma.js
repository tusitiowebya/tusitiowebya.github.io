/* =========================================================
   Espacio Luz de Conciencia — "Una luz, siete caminos"
   Cuarzo en 3D: entra un haz blanco y salen siete rayos,
   uno por consulta. Detrás, el cubo de Metatrón de su paño.
   Se carga solo en escritorio con GPU.
   ========================================================= */
import * as THREE from './vendor/three.module.min.js';

const STILL = /[?&]still\b/.test(location.search);
const canvas = document.getElementById('prismaCanvas');
const stage = document.getElementById('caminosStage');
const COLORS = ['#F2766B', '#F4A340', '#EDD24F', '#5DCB9C', '#48C2DA', '#6E8DF2', '#A47CEB'];
const N = COLORS.length;

function fail(err) {
  window.dispatchEvent(new Event('prisma:fail'));
  if (window.console) console.warn('[luz] escena 3D no disponible', err);
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: STILL });
} catch (e) {
  fail(e);
  throw e;
}
const PR = STILL ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
renderer.setPixelRatio(PR);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.setClearColor(0x110E1C, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 16 / 9, .1, 60);
camera.position.set(0, 0, 12);
const VIEW_H = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

/* ---------- utilidades ---------- */
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(.18, 'rgba(255,255,255,.55)');
  grd.addColorStop(.45, 'rgba(225,215,255,.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// el cubo de Metatrón (13 círculos unidos entre sí), dibujado en una textura
function metatronTexture() {
  const S = 1024, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const r = S / 10.4, cx = S / 2, cy = S / 2;
  const pts = [[cx, cy]];
  [2, 4].forEach(k => { for (let i = 0; i < 6; i++) { const a = Math.PI / 2 + i * Math.PI / 3; pts.push([cx + k * r * Math.cos(a), cy - k * r * Math.sin(a)]); } });
  g.strokeStyle = 'rgba(255,255,255,1)';
  g.lineWidth = 1.6;
  g.beginPath();
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[j][0], pts[j][1]); }
  g.stroke();
  g.lineWidth = 2;
  pts.forEach(p => { g.beginPath(); g.arc(p[0], p[1], r, 0, Math.PI * 2); g.stroke(); });
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

/* ---------- fondo: noche, Metatrón y estrellas (opaco: lo refracta el cristal) ---------- */
const backMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1600, 900) },
    uCrystal: { value: new THREE.Vector2(.25, .36) },
    uGeo: { value: metatronTexture() },
    uGeoSize: { value: .9 }
  },
  vertexShader: 'void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform float uTime; uniform vec2 uRes; uniform vec2 uCrystal; uniform sampler2D uGeo; uniform float uGeoSize;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      float aspect = uRes.x / uRes.y;
      vec3 col = vec3(0.060, 0.050, 0.100);
      vec2 d = (uv - uCrystal) * vec2(aspect, 1.0);
      float r2 = dot(d, d);
      col += vec3(0.40, 0.30, 0.70) * exp(-r2 * 9.0) * 0.26;
      vec2 d2 = (uv - vec2(0.86, 0.84)) * vec2(aspect, 1.0);
      col += vec3(0.25, 0.33, 0.74) * exp(-dot(d2, d2) * 5.0) * 0.09;
      vec2 d3 = (uv - vec2(0.62, 0.12)) * vec2(aspect, 1.0);
      col += vec3(0.86, 0.50, 0.30) * exp(-dot(d3, d3) * 6.0) * 0.05;
      float a = uTime * 0.018;
      vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * d / uGeoSize + 0.5;
      float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
      float geo = texture2D(uGeo, q).r * inside;
      col += vec3(0.80, 0.74, 1.0) * geo * 0.12 * exp(-r2 * 2.6);
      vec2 sp = gl_FragCoord.xy / 3.4;
      vec2 cell = floor(sp);
      float h = hash(cell);
      float tw = 0.55 + 0.45 * sin(uTime * 1.3 + h * 70.0);
      float star = step(0.9972, h) * tw * smoothstep(0.5, 0.0, length(fract(sp) - 0.5) * 2.0);
      col += vec3(0.86, 0.84, 1.0) * star * 0.55;
      float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(aspect, 1.0)));
      col *= mix(0.72, 1.0, vig);
      gl_FragColor = vec4(col, 1.0);
    }`,
  depthWrite: false
});
const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backMat);
back.position.z = -6;
back.renderOrder = -10;
back.frustumCulled = false;
scene.add(back);

/* ---------- entorno: paneles de luz (blanco a la izquierda, espectro a la derecha) ---------- */
(function buildEnv() {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x050409);
  const geo = new THREE.PlaneGeometry(1, 1);
  const add = (color, k, pos, sx, sy) => {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide });
    const p = new THREE.Mesh(geo, m);
    p.position.set(pos[0], pos[1], pos[2]);
    p.scale.set(sx, sy, 1);
    p.lookAt(0, 0, 0);
    env.add(p);
  };
  add('#ffffff', 9, [-7, 1.2, 2.5], 2.2, 7);
  add('#ffffff', 4, [-3, 6.5, 3], 6, .8);
  add('#ffffff', 3, [2.5, -1, 7], .7, 5);
  COLORS.forEach((c, i) => add(c, 5, [6.5, 3.2 - i * 1.05, 1.5 - i * .25], 2.4, .55));
  add('#6E8DF2', 1.4, [0, -6.5, 2], 10, 1.6);
  add('#F4A340', 2.2, [-2, -2.5, -7], 3, 2.4);
  add('#A47CEB', 2.2, [2.5, 2.5, -7], 3, 3);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(env, .015).texture;
  pm.dispose();
})();
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(-6, 2.5, 5);
scene.add(key);
const rimViolet = new THREE.PointLight(0xA47CEB, 40, 30, 2);
scene.add(rimViolet);
const warm = new THREE.PointLight(0xF4A340, 22, 30, 2);
scene.add(warm);

/* ---------- el cuarzo (punta hexagonal, como los de su balcón) ---------- */
function crystalGeometry() {
  const r = rng(11);
  const sides = 6, R = .62;
  const top = [], bot = [];
  for (let i = 0; i < sides; i++) {
    const a = i / sides * Math.PI * 2 + .14;
    const r1 = R * (.93 + r() * .14), r2 = R * (.86 + r() * .1);
    top.push(new THREE.Vector3(Math.cos(a) * r1, .72 + (r() - .5) * .22, Math.sin(a) * r1));
    bot.push(new THREE.Vector3(Math.cos(a) * r2, -1.55 + (r() - .5) * .16, Math.sin(a) * r2));
  }
  const tip = new THREE.Vector3(.06, 1.82, -.04);
  const base = new THREE.Vector3(-.03, -1.9, .02);
  const pos = [];
  const tri = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    tri(bot[i], top[i], top[j]);
    tri(bot[i], top[j], bot[j]);
    tri(top[i], tip, top[j]);
    tri(bot[j], base, bot[i]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}
const crystalGeo = crystalGeometry();
const crystalMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: .015,
  transmission: 1,
  thickness: .9,
  ior: 1.6,
  dispersion: 7,
  iridescence: .85,
  iridescenceIOR: 1.5,
  iridescenceThicknessRange: [120, 560],
  clearcoat: 1,
  clearcoatRoughness: .02,
  specularIntensity: 1,
  envMapIntensity: 2.3,
  flatShading: true
});
const crystal = new THREE.Mesh(crystalGeo, crystalMat);
const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(crystalGeo, 12),
  new THREE.LineBasicMaterial({ color: new THREE.Color('#F4EFFF'), transparent: true, opacity: .42, blending: THREE.AdditiveBlending, depthWrite: false })
);
edges.renderOrder = 3;
const crystalGroup = new THREE.Group();
const crystalSpin = new THREE.Group();
crystalSpin.add(crystal, edges);
crystalGroup.add(crystalSpin);
scene.add(crystalGroup);

const glowTex = glowTexture();
const sprite = (color, opacity, order) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(color), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, opacity }));
  s.renderOrder = order;
  scene.add(s);
  return s;
};
const inner = sprite('#EDE4FF', .2, 5);
const entry = sprite('#FFFFFF', .6, 6);
const exitFlare = sprite('#FFF3E2', .5, 6);

/* ---------- haces de luz (quads aditivos con shader) ---------- */
const beamVert = `
  attribute vec2 auv; varying vec2 vUv;
  void main(){ vUv = auv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const beamFrag = `
  uniform vec3 uColor; uniform float uI; uniform float uTime; uniform float uReveal; uniform float uWhite;
  varying vec2 vUv;
  void main(){
    float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float core = pow(max(across, 0.0), 8.0);
    float halo = pow(max(across, 0.0), 1.8) * 0.3;
    float along = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.84, 1.0, vUv.x) * (0.8 - uWhite * 0.8));
    float rev = 1.0 - smoothstep(uReveal - 0.08, uReveal, vUv.x);
    float flick = 0.9 + 0.1 * sin(uTime * 2.3 + vUv.x * 18.0 - vUv.y * 4.0);
    float a = (core + halo) * along * rev * uI * flick;
    vec3 col = mix(vec3(1.0), uColor, smoothstep(0.0, 0.35, vUv.x) * (1.0 - uWhite));
    gl_FragColor = vec4(col * a, a);
  }`;
function makeBeam(color, white) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
  g.setAttribute('auv', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 0, 1, 1], 2));
  g.setIndex([0, 2, 1, 2, 3, 1]);
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uI: { value: .3 }, uTime: { value: 0 }, uReveal: { value: 0 }, uWhite: { value: white ? 1 : 0 } },
    vertexShader: beamVert, fragmentShader: beamFrag,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  scene.add(mesh);
  return mesh;
}
function setQuad(mesh, s, e, w0, w1) {
  const dx = e.x - s.x, dy = e.y - s.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const p = mesh.geometry.attributes.position.array;
  p[0] = s.x - nx * w0 / 2; p[1] = s.y - ny * w0 / 2; p[2] = .2;
  p[3] = s.x + nx * w0 / 2; p[4] = s.y + ny * w0 / 2; p[5] = .2;
  p[6] = e.x - nx * w1 / 2; p[7] = e.y - ny * w1 / 2; p[8] = .2;
  p[9] = e.x + nx * w1 / 2; p[10] = e.y + ny * w1 / 2; p[11] = .2;
  mesh.geometry.attributes.position.needsUpdate = true;
}
const whiteBeam = makeBeam('#ffffff', true);
const rays = COLORS.map(c => makeBeam(c, false));

/* ---------- polvo en suspensión dentro de la luz ---------- */
const DUST = 240;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(DUST * 3);
const dustCol = new Float32Array(DUST * 3);
const dustSeed = [];
const rd = rng(5);
for (let i = 0; i < DUST; i++) {
  const lane = Math.floor(rd() * (N + 2)) - 1; // -1 = haz blanco
  dustSeed.push({ lane: Math.max(-1, Math.min(N - 1, lane)), t: rd(), off: (rd() - .5), sp: .015 + rd() * .03, ph: rd() * 6.28 });
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
const LANE_RGB = COLORS.map(c => { const k = new THREE.Color(c); return [k.r, k.g, k.b]; });
const WHITE_RGB = [1, 1, 1];
const tmpS = new THREE.Vector2();
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  size: .085, map: glowTex, vertexColors: true, transparent: true, opacity: .9,
  blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, sizeAttenuation: true
}));
dust.frustumCulled = false;
dust.renderOrder = 7;
scene.add(dust);

/* ---------- maquetación: de la pantalla al mundo ---------- */
let W = 1, H = 1, VIEW_W = 1;
const P = { cryst: new THREE.Vector2(), entry: new THREE.Vector2(), exit: new THREE.Vector2(), src: new THREE.Vector2(), ends: COLORS.map(() => new THREE.Vector2()) };
const toWorld = (px, py, out) => out.set((px / W - .5) * VIEW_W, (.5 - py / H) * VIEW_H);
let crystalScale = .8;

function layout() {
  const cr = canvas.getBoundingClientRect();
  if (STILL) { W = 1400; H = 900; }
  else { W = Math.max(1, Math.round(cr.width)); H = Math.max(1, Math.round(cr.height)); }
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  VIEW_W = VIEW_H * camera.aspect;
  back.scale.set(VIEW_W * 1.7, VIEW_H * 1.7, 1);
  backMat.uniforms.uRes.value.set(W * PR, H * PR);
  const cx = STILL ? .3 : .25, cy = STILL ? .55 : .64;
  toWorld(W * cx, H * cy, P.cryst);
  backMat.uniforms.uCrystal.value.set(cx, 1 - cy);
  crystalScale = Math.min(.86, (VIEW_H * (STILL ? .5 : .42)) / 3.7);
  backMat.uniforms.uGeoSize.value = 1.7 * crystalScale * 3.7 / VIEW_H;
  crystalGroup.position.set(P.cryst.x, P.cryst.y, 0);
  crystalGroup.scale.setScalar(crystalScale);
  P.entry.set(P.cryst.x - .36 * crystalScale, P.cryst.y + .2 * crystalScale);
  P.exit.set(P.cryst.x + .4 * crystalScale, P.cryst.y + .02 * crystalScale);
  P.src.set(-VIEW_W / 2 - .4, P.cryst.y + .62 * crystalScale);
  inner.position.set(P.cryst.x, P.cryst.y + .05 * crystalScale, .5);
  inner.scale.setScalar(1.3 * crystalScale);
  entry.position.set(P.entry.x, P.entry.y, .6);
  entry.scale.setScalar(.42);
  exitFlare.position.set(P.exit.x, P.exit.y, .6);
  exitFlare.scale.setScalar(.5);
  rimViolet.position.set(P.cryst.x + 2.2, P.cryst.y + 1.4, 2.2);
  warm.position.set(P.cryst.x - 1.6, P.cryst.y - 1.8, 2.4);
  readDots(cr);
}

const dots = Array.from(document.querySelectorAll('#rayos i'));
function readDots(cr) {
  if (STILL) {
    for (let i = 0; i < N; i++) toWorld(W * .88, H * (.2 + i * (.62 / (N - 1))), P.ends[i]);
    return;
  }
  const c = cr || canvas.getBoundingClientRect();
  dots.forEach((d, i) => {
    const r = d.getBoundingClientRect();
    if (!r.width) return;
    toWorld(r.left + r.width / 2 - c.left - 9, r.top + r.height / 2 - c.top, P.ends[i]);
  });
}

/* ---------- estado ---------- */
let active = 0;
let progress = 0;
let reveal = STILL ? 1 : 0;
let revealGo = STILL;
const level = COLORS.map(() => STILL ? .62 : .46);
let mx = 0, my = 0, smx = 0, smy = 0;
window.addEventListener('pointermove', e => { mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5; }, { passive: true });

const clock = new THREE.Clock();
let running = false, raf = 0, frame = 0, destroyed = false, onStage = false;

function tick() {
  if (!running || destroyed) return;
  raf = requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), .05);
  const t = clock.elapsedTime;
  frame++;
  if (frame % 3 === 0) readDots();

  if (revealGo && reveal < 1) reveal = Math.min(1, reveal + dt / 2.2);
  const beamRev = Math.min(1, reveal / .45) * 1.08;
  const rayRev = Math.max(0, (reveal - .4) / .6) * 1.08;

  smx += (mx - smx) * .05; smy += (my - smy) * .05;
  crystalSpin.rotation.set(.12 + smy * .35, t * .14 + progress * Math.PI * 1.15 + smx * .6, -.2);
  crystalGroup.position.y = P.cryst.y + Math.sin(t * .8) * .05;

  whiteBeam.material.uniforms.uTime.value = t;
  whiteBeam.material.uniforms.uReveal.value = beamRev;
  whiteBeam.material.uniforms.uI.value = 1.1;
  setQuad(whiteBeam, P.src, P.entry, .3, .34);

  for (let i = 0; i < N; i++) {
    const target = STILL ? .62 : (i === active ? 1.15 : .46);
    level[i] += (target - level[i]) * Math.min(1, dt * 4);
    const u = rays[i].material.uniforms;
    u.uTime.value = t + i * .7;
    u.uReveal.value = rayRev;
    u.uI.value = level[i];
    tmpS.set(P.exit.x, P.exit.y + (3 - i) * .03);
    setQuad(rays[i], tmpS, P.ends[i], .05, .26 + level[i] * .34);
  }

  for (let k = 0; k < DUST; k++) {
    const d = dustSeed[k];
    d.t += d.sp * dt;
    if (d.t > 1) d.t -= 1;
    let sx, sy, ex, ey, w, col, vis;
    if (d.lane < 0) { sx = P.src.x; sy = P.src.y; ex = P.entry.x; ey = P.entry.y; w = .2; col = WHITE_RGB; vis = beamRev > d.t ? .9 : 0; }
    else {
      const e = P.ends[d.lane];
      sx = P.exit.x; sy = P.exit.y; ex = e.x; ey = e.y; w = .1 + d.t * .5;
      col = LANE_RGB[d.lane];
      vis = (rayRev > d.t ? 1 : 0) * (.25 + level[d.lane] * .7);
    }
    const dx = ex - sx, dy = ey - sy, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const wob = Math.sin(t * .9 + d.ph) * .02;
    dustPos[k * 3] = sx + dx * d.t + nx * (d.off * w + wob);
    dustPos[k * 3 + 1] = sy + dy * d.t + ny * (d.off * w + wob);
    dustPos[k * 3 + 2] = .3;
    const fl = (.55 + .45 * Math.sin(t * 2.4 + d.ph * 3)) * vis * Math.sin(Math.PI * d.t);
    dustCol[k * 3] = col[0] * fl; dustCol[k * 3 + 1] = col[1] * fl; dustCol[k * 3 + 2] = col[2] * fl;
  }
  dustGeo.attributes.position.needsUpdate = true;
  dustGeo.attributes.color.needsUpdate = true;

  inner.material.opacity = (.14 + .08 * Math.sin(t * 1.6)) * Math.min(1, reveal * 2);
  entry.material.opacity = .62 * Math.min(1, beamRev);
  exitFlare.material.opacity = .5 * Math.min(1, rayRev * 1.4);
  edges.material.opacity = .26 + .18 * Math.min(1, reveal * 1.5);
  backMat.uniforms.uTime.value = t;

  renderer.render(scene, camera);
  if (frame === 2) window.dispatchEvent(new Event('prisma:ready'));
}

function start() { if (running || destroyed) return; running = true; clock.getDelta(); raf = requestAnimationFrame(tick); }
function stop() { running = false; cancelAnimationFrame(raf); }

/* ---------- API para script.js ---------- */
window.__prisma = {
  setActive(i) { if (i >= 0) active = i; },
  setProgress(p) { progress = p; },
  destroy() {
    destroyed = true;
    stop();
    try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) { /* nada */ }
    canvas.style.display = 'none';
  }
};

try {
  layout();
  if (STILL) {
    canvas.style.cssText = 'display:block;position:fixed;left:0;top:0;width:1400px;height:900px;z-index:999';
    running = true;
    for (let i = 0; i < 4; i++) { clock.elapsedTime = 3.2; tick(); cancelAnimationFrame(raf); }
    running = false;
    window.__prismaStill = canvas.toDataURL('image/png');
  } else {
    window.addEventListener('resize', () => { layout(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        onStage = en.isIntersecting;
        if (onStage) { start(); revealGo = true; } else stop();
      }, { threshold: 0 }).observe(stage);
    } else { start(); revealGo = true; }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (onStage) start();
    });
  }
} catch (e) {
  fail(e);
}
