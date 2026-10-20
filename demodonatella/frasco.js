/* =========================================================
   Fragancias Donatella — el frasco del sello, en vidrio.
   El frasco del logo modelado en 3D: vidrio grueso, perfume
   adentro, tapa negra, collar dorado y el sello impreso.
   Delante de la pared con sombras de hojas (video del hero).
   Se dibuja, se materializa y se llena; si lo tocás, rocía.
   Más abajo, la caja de lujo se da vuelta y queda la caja tester.
   Se carga solo con GPU y sin modo liviano (ver boot.js).
   ========================================================= */
import * as THREE from './vendor/three.module.min.js';

const Q = new URLSearchParams(location.search);
const STILL = Q.get('still');            // renders fijos para el modo liviano y la imagen OG
const canvas = document.getElementById('escena');
const video = document.getElementById('heroVideo');
const slotHero = document.getElementById('slotHero');
const slotStory = document.getElementById('slotStory');
const isNarrow = () => innerWidth <= 768;

function fail(err) {
  window.dispatchEvent(new CustomEvent('frasco:fail', { detail: String(err) }));
  if (window.console) console.warn('[donatella] escena 3D no disponible:', err);
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!STILL });
} catch (e) { fail(e); throw e; }

const maxDpr = () => (STILL ? Math.min(devicePixelRatio || 1, 2) : (isNarrow() ? 1.5 : 1.75));
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxDpr()));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.localClippingEnabled = true;
const PAPER = new THREE.Color('#FDF4EB');
renderer.setClearColor(PAPER, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, 16 / 9, 0.1, 80);
camera.position.set(0, 0, 16);
const TAN = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
const WALL_Z = -6;

/* ---------- utilidades ---------- */
const clamp01 = v => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* polígono con esquinas redondeadas (las mismas medidas que el contorno SVG del HTML) */
function roundedShape(pts, radii) {
  const s = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n], cur = pts[i], next = pts[(i + 1) % n];
    const r = radii[i];
    const v1x = prev[0] - cur[0], v1y = prev[1] - cur[1];
    const v2x = next[0] - cur[0], v2y = next[1] - cur[1];
    const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
    const ax = cur[0] + v1x / l1 * r, ay = cur[1] + v1y / l1 * r;
    const bx = cur[0] + v2x / l2 * r, by = cur[1] + v2y / l2 * r;
    if (i === 0) s.moveTo(ax, ay); else s.lineTo(ax, ay);
    s.quadraticCurveTo(cur[0], cur[1], bx, by);
  }
  s.closePath();
  return s;
}
const trap = (wTop, wBot, y0, h) => [[-wBot / 2, y0], [wBot / 2, y0], [wTop / 2, y0 + h], [-wTop / 2, y0 + h]];

/* extrusión con bisel redondeado; la silueta exterior respeta las medidas pedidas */
function roundedSlab(wTop, wBot, y0, h, rBot, rTop, depth, bevel, segs = 10) {
  const shape = roundedShape(trap(wTop - 2 * bevel, wBot - 2 * bevel, y0 + bevel, h - 2 * bevel),
    [rBot - bevel * .6, rBot - bevel * .6, rTop - bevel * .6, rTop - bevel * .6].map(r => Math.max(.02, r)));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel,
    bevelSegments: segs, curveSegments: 28,
  });
  g.translate(0, 0, -(depth - 2 * bevel) / 2);
  return creased(g, 34);
}

/* normales suavizadas por ángulo (para que el bisel no se vea facetado) */
function creased(geo, deg) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position;
  const n = pos.count;
  const cos = Math.cos(THREE.MathUtils.degToRad(deg));
  const fn = new Float32Array(n);  // índice de cara
  const faceN = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const map = new Map();
  const key = i => `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`;
  for (let f = 0; f < n / 3; f++) {
    a.fromBufferAttribute(pos, f * 3); b.fromBufferAttribute(pos, f * 3 + 1); c.fromBufferAttribute(pos, f * 3 + 2);
    const nrm = new THREE.Vector3().subVectors(c, b).cross(new THREE.Vector3().subVectors(a, b));
    const area = nrm.length();
    nrm.normalize();
    faceN.push({ nrm, area });
    for (let k = 0; k < 3; k++) {
      const kk = key(f * 3 + k);
      if (!map.has(kk)) map.set(kk, []);
      map.get(kk).push(f);
      fn[f * 3 + k] = f;
    }
  }
  const out = new Float32Array(n * 3);
  const acc = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const own = faceN[fn[i]].nrm;
    acc.set(0, 0, 0);
    for (const f of map.get(key(i))) {
      const o = faceN[f];
      if (o.nrm.dot(own) >= cos) acc.addScaledVector(o.nrm, Math.max(o.area, 1e-6));
    }
    acc.normalize();
    out[i * 3] = acc.x; out[i * 3 + 1] = acc.y; out[i * 3 + 2] = acc.z;
  }
  g.setAttribute('normal', new THREE.BufferAttribute(out, 3));
  return g;
}

/* ---------- entorno de estudio (reflejos del vidrio y la laca) ---------- */
function studioEnv() {
  // carpa de producto: paredes oscuras (definen los cantos del vidrio) y tiras de luz verticales
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(26, 18, 26), new THREE.MeshBasicMaterial({ color: 0x2e2724, side: THREE.BackSide }));
  s.add(room);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ color: 0x6d5f55 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -8.9; s.add(floor);
  const panel = (w, h, x, y, z, rx, ry, k, col) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); s.add(m);
  };
  const strip = (deg, k, w = 1.1, col = 0xffffff) => {
    const a = THREE.MathUtils.degToRad(deg), R = 11.5;
    panel(w, 13, Math.sin(a) * R, .5, Math.cos(a) * R, 0, a + Math.PI, k, col);
  };
  strip(-58, 7, 1.6, 0xfff3e6);
  strip(-24, 9, .9);
  strip(26, 9, .9);
  strip(62, 6, 1.8, 0xfff0df);
  // dos tiras casi de frente: al girar el frasco, el brillo barre la cara plana del vidrio
  strip(11, 11, .55);
  strip(-9, 6, .32);
  // softbox arriba a la izquierda, de frente: el parche brillante típico de la foto de producto
  panel(3.2, 4.6, -3.1, 3.4, 10.6, -.3, Math.PI - .28, 2.6, 0xfffaf4);
  panel(6, 11, 12.5, 1.5, -2, 0, -Math.PI / 2, 8, 0xfff1e2);    // ventana a la derecha (la del video)
  panel(16, 7, 0, 8.6, 0, Math.PI / 2, 0, 3.4, 0xfff8ef);       // cenital
  panel(2.4, 2.4, -5, 5, 12.5, 0, Math.PI, 6, 0xffffff);         // brillo puntual de frente
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.02).texture;
  pm.dispose();
  return tex;
}
scene.environment = studioEnv();

/* ---------- la pared: video del hero que se vuelve papel ---------- */
const loader = new THREE.TextureLoader();
const wallU = { uMix: { value: 0 }, uPaper: { value: PAPER.clone() } };
const wallMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
wallMat.onBeforeCompile = sh => {
  sh.uniforms.uMix = wallU.uMix; sh.uniforms.uPaper = wallU.uPaper;
  sh.fragmentShader = 'uniform float uMix;\nuniform vec3 uPaper;\n' +
    sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n\tdiffuseColor.rgb = mix(diffuseColor.rgb, uPaper, uMix);');
};
const wall = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), wallMat);
wall.position.z = WALL_Z;
scene.add(wall);
let wallTex = null, wallAspect = 16 / 9;
function setWallTexture(tex, aspect) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  wallTex = tex; wallAspect = aspect;
  wallMat.map = tex; wallMat.needsUpdate = true;
  fitWall();
}
function fitWall() {
  const dist = camera.position.z - WALL_Z;
  const h = 2 * dist * TAN * 1.06, w = h * camera.aspect;
  wall.scale.set(w, h, 1);
  if (!wallTex) return;
  const sa = w / h;
  wallTex.repeat.set(1, 1); wallTex.offset.set(0, 0);
  if (sa > wallAspect) { wallTex.repeat.y = wallAspect / sa; wallTex.offset.y = (1 - wallTex.repeat.y) / 2; }
  else { wallTex.repeat.x = sa / wallAspect; wallTex.offset.x = (1 - wallTex.repeat.x) / 2; }
}
const posterUrl = isNarrow() ? 'media/poster-m.jpg' : 'media/poster.jpg';
loader.load(posterUrl, t => { if (!wallMat.map || wallMat.map === t || !(wallMat.map instanceof THREE.VideoTexture)) setWallTexture(t, t.image.width / t.image.height); });
function useVideo() {
  if (!video || STILL) return;
  const go = () => {
    if (wallMat.map instanceof THREE.VideoTexture) return;
    const vt = new THREE.VideoTexture(video);
    setWallTexture(vt, (video.videoWidth || 16) / (video.videoHeight || 9));
  };
  if (video.readyState >= 2 && !video.paused) go();
  else video.addEventListener('playing', go, { once: true });
}

/* sombra del frasco sobre la pared + destello rosado dentro de la sombra (la luz que atraviesa el perfume) */
const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ color: 0x5a3a38, opacity: .24, transparent: true }));
catcher.position.z = WALL_Z + .02;
catcher.receiveShadow = true;
scene.add(catcher);

function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const caustic = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
  map: radialTexture([[0, 'rgba(255,214,206,.95)'], [.35, 'rgba(244,168,166,.55)'], [.7, 'rgba(226,128,140,.14)'], [1, 'rgba(226,128,140,0)']]),
  transparent: true, depthWrite: false, toneMapped: false, opacity: 0,
}));
caustic.position.z = WALL_Z + .04;
scene.add(caustic);

/* ---------- luz ---------- */
const key = new THREE.DirectionalLight(0xfff1e2, 2.4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
key.shadow.camera.near = 1; key.shadow.camera.far = 40;
key.shadow.radius = 14; key.shadow.blurSamples = 18;
key.shadow.bias = -0.0004;
scene.add(key, key.target);
const KEY_OFFSET = new THREE.Vector3(3.4, 3.8, 8.5);
scene.add(new THREE.HemisphereLight(0xfff6ec, 0x8c6f5e, .35));

/* ---------- el frasco ---------- */
const H = 3.70;                       // alto total (cuerpo + collar + cuello + tapa)
const BODY = { wTop: 2.0, wBot: 1.84, h: 2.56, rTop: .5, rBot: .3, depth: 1.06, bevel: .14 };
const INNER = { wTop: 1.6, wBot: 1.42, y0: .34, h: 1.86, rTop: .2, rBot: .34, depth: .74, bevel: .1 };
const FRONT_Z = BODY.depth / 2;

const product = new THREE.Group();   // frasco + caja: se posiciona según los "slots" del HTML
scene.add(product);
const spin = new THREE.Group();      // rotación (mouse, idle, capítulos)
product.add(spin);
const bottle = new THREE.Group();    // origen en el centro visual del frasco
bottle.position.y = 0;
spin.add(bottle);
const B = new THREE.Group();
B.position.y = -H / 2;
bottle.add(B);

const revealPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
const fillPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff, metalness: 0, roughness: .0,
  transmission: 1, thickness: 1.5, ior: 1.5, dispersion: .3,
  clearcoat: 1, clearcoatRoughness: .0,
  specularIntensity: 1, envMapIntensity: 2.4,
  attenuationColor: new THREE.Color('#f7efe6'), attenuationDistance: 5.5,
  clippingPlanes: [revealPlane],
});
// sobre un fondo claro el vidrio se dibuja por sus cantos oscuros (como en la foto de estudio)
glassMat.onBeforeCompile = sh => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
    float gFace = abs(dot(normalize(vViewPosition), normal));
    outgoingLight *= mix(.7, 1., smoothstep(.04, .5, gFace));
    #include <opaque_fragment>`);
};
/* perfume rosé: más claro en el centro (donde lo atraviesa la luz) y más hondo en los cantos */
const liquidMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff, roughness: .1, metalness: 0,
  emissive: new THREE.Color('#b9566a'), emissiveIntensity: .3,
  clearcoat: .7, clearcoatRoughness: .06, envMapIntensity: .6,
  sheen: .5, sheenColor: new THREE.Color('#ffd8cf'), sheenRoughness: .45,
  vertexColors: true,
  clippingPlanes: [fillPlane, revealPlane], side: THREE.DoubleSide,
});
/* el perfume es transparente: se ve la pared (y las sombras de hojas del video) refractada y teñida de rosé.
   El rayo sale de la cámara, se quiebra en la superficie y se busca dónde pega en el plano de la pared. */
const liqU = {
  uWall: { value: null }, uHasWall: { value: 0 },
  uWallRect: { value: new THREE.Vector4(0, 0, 1, 1) },   // centro x, y y tamaño del plano de la pared (mundo)
  uWallUv: { value: new THREE.Vector4(1, 1, 0, 0) },     // repeat.xy y offset.xy de la textura
  uWallZ: { value: WALL_Z },
  uTint: { value: new THREE.Color('#f4b3ae') },
};
liquidMat.onBeforeCompile = sh => {
  Object.assign(sh.uniforms, liqU, { uWallMix: wallU.uMix, uWallPaper: wallU.uPaper });
  sh.vertexShader = 'varying vec3 vLiqW;\n' + sh.vertexShader.replace('#include <fog_vertex>',
    '#include <fog_vertex>\n\tvLiqW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
  sh.fragmentShader = `varying vec3 vLiqW;
uniform sampler2D uWall; uniform float uHasWall; uniform vec4 uWallRect; uniform vec4 uWallUv;
uniform float uWallZ; uniform float uWallMix; uniform vec3 uWallPaper; uniform vec3 uTint;
` + sh.fragmentShader.replace('#include <opaque_fragment>', `
    float facing = abs(dot(normalize(vViewPosition), normal));
    outgoingLight *= mix(.56, 1.1, pow(facing, .7));
    outgoingLight += vec3(.27, .15, .14) * pow(facing, 5.);
    if (uHasWall > .5) {
      vec3 wN = inverseTransformDirection(normal, viewMatrix);
      vec3 I = normalize(vLiqW - cameraPosition);
      vec3 R = refract(I, wN, .75);
      if (dot(R, R) < .01) R = I;
      float tt = (uWallZ - vLiqW.z) / min(R.z, -.05);
      vec3 hit = vLiqW + R * tt;
      vec2 wuv = vec2((hit.x - uWallRect.x) / uWallRect.z + .5, (hit.y - uWallRect.y) / uWallRect.w + .5);
      wuv = clamp(wuv, .002, .998) * uWallUv.xy + uWallUv.zw;
      vec3 wc = mix(texture2D(uWall, wuv).rgb, uWallPaper, uWallMix);
      outgoingLight = mix(outgoingLight, wc * uTint * 1.06 + outgoingLight * .18, .5);
    }
    #include <opaque_fragment>`);
};
/* la superficie del perfume (menisco): una lámina clara que agarra los brillos del estudio */
const surfMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#fbe3da'), roughness: .04, metalness: 0,
  clearcoat: 1, clearcoatRoughness: .02, envMapIntensity: 1.5,
  emissive: new THREE.Color('#e9a3a3'), emissiveIntensity: .22,
  clippingPlanes: [revealPlane], side: THREE.DoubleSide,
});
const goldMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#d2ab66'), metalness: 1, roughness: .26, envMapIntensity: 1.35,
  clearcoat: .3, clippingPlanes: [revealPlane],
});
const capMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#17120f'), metalness: 0, roughness: .2,
  clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: 1.1,
  clippingPlanes: [revealPlane],
});
const tubeMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff, roughness: .25, transmission: .6, thickness: .1, transparent: false,
  clippingPlanes: [revealPlane],
});

// cuerpo de vidrio
const body = new THREE.Mesh(roundedSlab(BODY.wTop, BODY.wBot, 0, BODY.h, BODY.rBot, BODY.rTop, BODY.depth, BODY.bevel, 12), glassMat);
B.add(body);
// el vidrio hace una sombra tenue (tramado que el desenfoque de la sombra suaviza); la fuerte la da el perfume
body.castShadow = true;
body.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaHash: true, opacity: .3, transparent: true, clippingPlanes: [revealPlane] });

// perfume: la "cámara" interior del logo, con degradé (más claro arriba)
const liqGeo = roundedSlab(INNER.wTop, INNER.wBot, INNER.y0, INNER.h, INNER.rBot, INNER.rTop, INNER.depth, INNER.bevel, 8);
{
  const p = liqGeo.attributes.position, cols = new Float32Array(p.count * 3);
  const lo = new THREE.Color('#c25d6d'), hi = new THREE.Color('#f8d2c7'), tmp = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const t = clamp01((p.getY(i) - INNER.y0) / INNER.h);
    tmp.copy(lo).lerp(hi, Math.pow(t, .8));
    cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
  }
  liqGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
}
const liquid = new THREE.Mesh(liqGeo, liquidMat);
liquid.castShadow = true;
B.add(liquid);
// menisco: sigue el nivel de llenado; el ancho sale del trapecio de la cámara interior
const surf = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(
  [[-.5, -(INNER.depth - .04) / 2], [.5, -(INNER.depth - .04) / 2], [.5, (INNER.depth - .04) / 2], [-.5, (INNER.depth - .04) / 2]],
  [.1, .1, .1, .1]), 24), surfMat);
surf.rotation.x = -Math.PI / 2;
surf.visible = false;
B.add(surf);
const innerWidthAt = y => INNER.wBot + (INNER.wTop - INNER.wBot) * clamp01((y - INNER.y0) / INNER.h);

// tubito sumergido (se ve a través del vidrio, como en un frasco real)
const tube = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, BODY.h - .2, 12), tubeMat);
tube.position.set(0, (BODY.h - .2) / 2 + .14, -.05);
B.add(tube);

// collar y cuello dorados (torneados)
function lathe(r, h, y, round = .025) {
  const pts = [
    new THREE.Vector2(0, 0), new THREE.Vector2(r - round, 0), new THREE.Vector2(r, round),
    new THREE.Vector2(r, h - round), new THREE.Vector2(r - round, h), new THREE.Vector2(0, h),
  ];
  const g = new THREE.LatheGeometry(pts, 72);
  g.translate(0, y, 0);
  return creased(g, 40);
}
const collar = new THREE.Mesh(lathe(.5, .16, BODY.h), goldMat);
const neck = new THREE.Mesh(lathe(.41, .24, BODY.h + .16, .015), goldMat);
collar.castShadow = neck.castShadow = true;
B.add(collar, neck);

// pulsador (aparece cuando se levanta la tapa)
const nozzleG = new THREE.Group();
const nozzle = new THREE.Mesh(lathe(.17, .2, 0, .03), goldMat);
const nozzleTop = new THREE.Mesh(lathe(.21, .07, .2, .03), capMat);
nozzleG.add(nozzle, nozzleTop);
nozzleG.position.y = BODY.h + .4;
B.add(nozzleG);

// tapa negra laqueada
const capG = new THREE.Group();
capG.position.y = BODY.h + .40;
const cap = new THREE.Mesh(roundedSlab(1.36, 1.36, 0, .74, .16, .16, .98, .07, 6), capMat);
cap.castShadow = true;
capG.add(cap);
B.add(capG);

// el sello impreso en el frente del vidrio
const sealTex = loader.load('media/sello-1024.png', t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
const labelMat = new THREE.MeshStandardMaterial({ map: sealTex, transparent: true, roughness: .4, metalness: 0, depthWrite: false, opacity: 0, clippingPlanes: [revealPlane], polygonOffset: true, polygonOffsetFactor: -2 });
const label = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 1.02), labelMat);
label.position.set(0, 1.3, FRONT_Z + .004);
B.add(label);

/* ---------- la caja (lujo → tester) ---------- */
const BOX = { w: 2.62, h: 4.12, d: 1.62 };
const box = new THREE.Group();
box.position.y = 0;
box.visible = false;
spin.add(box);

async function fontsReady() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('700 60px "Bona Nova SC"'),
      document.fonts.load('400 60px "Cutive Mono"'),
      document.fonts.load('300 60px "Noto Serif Display"'),
    ]);
  } catch (e) { /* seguimos con las de respaldo */ }
}
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function noise(g, w, h, amt, seed) {
  const r = rng(seed), img = g.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
}
function goldGrad(g, w) {
  const gr = g.createLinearGradient(0, 0, w, 0);
  gr.addColorStop(0, '#9c7232'); gr.addColorStop(.32, '#e7c987'); gr.addColorStop(.55, '#b88d47'); gr.addColorStop(.8, '#f0d79c'); gr.addColorStop(1, '#a67a38');
  return gr;
}
function spaced(g, text, x, y, spacing) {
  // texto centrado con tracking (canvas no tiene letter-spacing confiable en todos lados)
  const chars = [...text];
  const widths = chars.map(ch => g.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let cx = x - total / 2;
  chars.forEach((ch, i) => { g.fillText(ch, cx + widths[i] / 2, y); cx += widths[i] + spacing; });
}
/* caras de lujo: negro con filetes dorados; el mapa de metal marca el dorado */
function luxFace(w, h, kind) {
  const c = cv(w, h), m = cv(w, h);
  const g = c.getContext('2d'), gm = m.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#201a17'); bg.addColorStop(1, '#0e0b0a');
  g.fillStyle = bg; g.fillRect(0, 0, w, h); noise(g, w, h, 10, 7);
  gm.fillStyle = '#000'; gm.fillRect(0, 0, w, h);
  const both = fn => { fn(g, goldGrad(g, w)); fn(gm, '#fff'); };
  const pad = Math.round(Math.min(w, h) * .055);
  both((x, col) => { x.strokeStyle = col; x.lineWidth = Math.max(3, w * .007); x.strokeRect(pad, pad, w - pad * 2, h - pad * 2); x.lineWidth = Math.max(1.5, w * .0025); x.strokeRect(pad * 1.45, pad * 1.45, w - pad * 2.9, h - pad * 2.9); });
  if (kind === 'front') {
    both((x, col) => {
      x.fillStyle = col; x.strokeStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle';
      const cx = w / 2, cy = h * .38, R = w * .17;
      x.lineWidth = w * .004; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(cx, cy, R * .86, 0, Math.PI * 2); x.lineWidth = w * .0018; x.stroke();
      // estrella de ocho puntas
      x.beginPath();
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? R * .2 : R * .62; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      x.closePath(); x.fill();
      x.font = `700 ${Math.round(w * .066)}px "Bona Nova SC", Georgia, serif`;
      spaced(x, 'EAU DE PARFUM', cx, h * .6, w * .018);
      x.fillRect(cx - w * .16, h * .655, w * .32, Math.max(2, w * .002));
      x.font = `400 ${Math.round(w * .03)}px "Cutive Mono", monospace`;
      spaced(x, 'VAPORISATEUR · NATURAL SPRAY', cx, h * .7, w * .006);
    });
  } else if (kind === 'side') {
    both((x, col) => {
      x.save(); x.translate(w / 2, h / 2); x.rotate(-Math.PI / 2);
      x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `700 ${Math.round(w * .13)}px "Bona Nova SC", Georgia, serif`;
      spaced(x, 'EAU DE PARFUM', 0, 0, w * .04);
      x.restore();
    });
  }
  return { map: tex(c), metal: tex(m) };
}
/* caras tester: cartón blanco con impresión de tinta */
function testerFace(w, h, kind) {
  const c = cv(w, h), g = c.getContext('2d');
  g.fillStyle = '#efe8dc'; g.fillRect(0, 0, w, h);
  // fibras
  const r = rng(11 + w + h);
  for (let i = 0; i < w * h / 900; i++) {
    g.strokeStyle = `rgba(${150 + r() * 40},${130 + r() * 30},${110 + r() * 30},${.05 + r() * .07})`;
    g.lineWidth = .6 + r(); const x = r() * w, y = r() * h, a = r() * Math.PI;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * (4 + r() * 10), y + Math.sin(a) * (4 + r() * 10)); g.stroke();
  }
  noise(g, w, h, 8, 3);
  g.fillStyle = '#2a2420'; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (kind === 'front') {
    g.font = `400 ${Math.round(w * .15)}px "Cutive Mono", monospace`;
    spaced(g, 'TESTER', w / 2, h * .2, w * .03);
    g.fillRect(w * .16, h * .265, w * .68, Math.max(2, w * .003));
    g.font = `400 ${Math.round(w * .042)}px "Cutive Mono", monospace`;
    spaced(g, 'EAU DE PARFUM', w / 2, h * .31, w * .01);
    g.font = `400 ${Math.round(w * .032)}px "Cutive Mono", monospace`;
    spaced(g, 'PRODUCTO DE DEMOSTRACIÓN', w / 2, h * .9, w * .004);
    // código de barras genérico
    const bx = w * .3, by = h * .78, bw = w * .4, bh = h * .07, rb = rng(5);
    let x = bx;
    while (x < bx + bw) { const lw = 1 + Math.floor(rb() * 3) * (w / 512); if (rb() > .45) g.fillRect(x, by, lw, bh); x += lw + w / 512; }
  } else if (kind === 'side') {
    g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
    g.font = `400 ${Math.round(w * .2)}px "Cutive Mono", monospace`;
    spaced(g, 'TESTER', 0, 0, w * .06);
    g.restore();
  } else {
    g.font = `400 ${Math.round(h * .14)}px "Cutive Mono", monospace`;
    spaced(g, 'TESTER', w / 2, h / 2, h * .03);
  }
  return tex(c);
}

const faces = [];
let boxBuilt = false;
async function buildBox() {
  if (boxBuilt) return; boxBuilt = true;
  await fontsReady();
  const { w, h, d } = BOX;
  const PX = 1024 / w;  // resolución por unidad
  const res = (a, b) => [Math.round(a * PX), Math.round(b * PX)];
  const lux = {
    front: luxFace(...res(w, h), 'front'), side: luxFace(...res(d, h), 'side'), top: luxFace(...res(w, d), 'top'),
  };
  const tst = {
    front: testerFace(...res(w, h), 'front'), side: testerFace(...res(d, h), 'side'), top: testerFace(...res(w, d), 'top'),
  };
  const luxMat = k => new THREE.MeshPhysicalMaterial({ map: lux[k].map, metalnessMap: lux[k].metal, metalness: 1, roughness: .38, clearcoat: .4, clearcoatRoughness: .3, envMapIntensity: 1.1 });
  const tstMat = k => new THREE.MeshStandardMaterial({ map: tst[k], roughness: .86, metalness: 0, envMapIntensity: .7 });
  const innerMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#cdbfae'), roughness: .95, side: THREE.BackSide });
  // [nombre, ancho, alto, tipo, posición, rotación, normal]
  const defs = [
    ['front', w, h, 'front', [0, 0, d / 2], [0, 0, 0], [0, 0, 1]],
    ['back', w, h, 'front', [0, 0, -d / 2], [0, Math.PI, 0], [0, 0, -1]],
    ['right', d, h, 'side', [w / 2, 0, 0], [0, Math.PI / 2, 0], [1, 0, 0]],
    ['left', d, h, 'side', [-w / 2, 0, 0], [0, -Math.PI / 2, 0], [-1, 0, 0]],
    ['bottom', w, d, 'top', [0, -h / 2, 0], [Math.PI / 2, 0, 0], [0, -1, 0]],
    ['top', w, d, 'top', [0, h / 2, 0], [-Math.PI / 2, 0, 0], [0, 1, 0]],
  ];
  const r = rng(42);
  defs.forEach(([name, fw, fh, kind, pos, rot, nrm], i) => {
    const geo = new THREE.PlaneGeometry(fw, fh);
    const mLux = luxMat(kind), mTst = tstMat(kind);
    const outer = new THREE.Mesh(geo, mLux);
    const inner = new THREE.Mesh(geo, innerMat);
    outer.castShadow = true;
    const card = new THREE.Group(); card.add(outer, inner);
    const pivot = new THREE.Group();
    let hinge = null;
    if (name === 'top') {
      // bisagra en el borde de atrás: la solapa se abre hacia arriba
      pivot.position.set(0, h / 2, -d / 2);
      card.position.set(0, 0, d / 2);
      card.rotation.set(-Math.PI / 2, 0, 0);
      hinge = pivot;
    } else {
      pivot.position.set(...pos);
      card.rotation.set(...rot);
    }
    pivot.add(card);
    box.add(pivot);
    faces.push({
      name, card, outer, mLux, mTst, pivot, hinge,
      base: pivot.position.clone(), nrm: new THREE.Vector3(...nrm),
      spinOff: new THREE.Euler((r() - .5) * 2.4, (r() - .5) * 2.4, (r() - .5) * 2.4),
      delay: [.36, .3, .12, .2, 0, .06][i],
      flipDelay: [0, .5, .18, .32, .62, .45][i],
    });
  });
  // sello de Fragancias Donatella que se estampa en la caja tester
  const front = faces.find(f => f.name === 'front');
  const stampMat = new THREE.MeshStandardMaterial({ map: sealTex, transparent: true, opacity: 0, roughness: .7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 });
  const stamp = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 1.32), stampMat);
  stamp.position.set(0, -.28, .006);
  front.card.add(stamp);
  boxStamp = stamp;
}
let boxStamp = null;

/* ---------- rocío (partículas) ---------- */
const MIST_N = 680;
const mistGeo = new THREE.BufferGeometry();
const mPos = new Float32Array(MIST_N * 3), mLife = new Float32Array(MIST_N), mSize = new Float32Array(MIST_N);
const mVel = new Float32Array(MIST_N * 3), mAge = new Float32Array(MIST_N).fill(99), mMax = new Float32Array(MIST_N).fill(1), mS0 = new Float32Array(MIST_N);
mistGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
mistGeo.setAttribute('aLife', new THREE.BufferAttribute(mLife, 1));
mistGeo.setAttribute('aSize', new THREE.BufferAttribute(mSize, 1));
const mistMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  // rocío apenas rosado: blanco puro desaparecería sobre la pared crema
  uniforms: { uPx: { value: 600 }, uColor: { value: new THREE.Color('#efb2ab') } },
  vertexShader: `attribute float aLife; attribute float aSize; uniform float uPx; varying float vA;
    void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = aSize * uPx / -mv.z; gl_Position = projectionMatrix * mv; vA = aLife; }`,
  fragmentShader: `uniform vec3 uColor; varying float vA;
    void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); a *= a; gl_FragColor = vec4(uColor, a * vA); }`,
});
const mist = new THREE.Points(mistGeo, mistMat);
mist.frustumCulled = false;
scene.add(mist);
const mr = rng(9);
let mistCursor = 0, mistActive = 0;
function emitMist(origin, dir, n) {
  for (let i = 0; i < n; i++) {
    const k = mistCursor; mistCursor = (mistCursor + 1) % MIST_N;
    mPos[k * 3] = origin.x; mPos[k * 3 + 1] = origin.y; mPos[k * 3 + 2] = origin.z;
    const spread = .46, sp = 5 + mr() * 4.5;
    const vx = dir.x + (mr() - .5) * spread, vy = dir.y + (mr() - .5) * spread * .8, vz = dir.z + (mr() - .5) * spread;
    const l = Math.hypot(vx, vy, vz);
    mVel[k * 3] = vx / l * sp; mVel[k * 3 + 1] = vy / l * sp; mVel[k * 3 + 2] = vz / l * sp;
    mAge[k] = -i * .0012; mMax[k] = 1.3 + mr() * 1.1; mS0[k] = .05 + mr() * .12;
  }
  mistActive = 3;
}
function stepMist(dt) {
  if (mistActive <= 0) return;
  mistActive -= dt;
  const drag = Math.exp(-dt * 2.6);
  for (let k = 0; k < MIST_N; k++) {
    if (mAge[k] > mMax[k]) { mLife[k] = 0; continue; }
    mAge[k] += dt;
    if (mAge[k] < 0) { mLife[k] = 0; continue; }
    mVel[k * 3] *= drag; mVel[k * 3 + 1] = mVel[k * 3 + 1] * drag + dt * .35; mVel[k * 3 + 2] *= drag;
    mPos[k * 3] += mVel[k * 3] * dt; mPos[k * 3 + 1] += mVel[k * 3 + 1] * dt; mPos[k * 3 + 2] += mVel[k * 3 + 2] * dt;
    const t = mAge[k] / mMax[k];
    // bruma translúcida: las gotas se abren y se desvanecen sin juntarse en una mancha
    mLife[k] = Math.sin(Math.min(1, t * 1.15) * Math.PI) * .16 * (1 - t * .5);
    mSize[k] = mS0[k] + t * .75;
  }
  mistGeo.attributes.position.needsUpdate = true;
  mistGeo.attributes.aLife.needsUpdate = true;
  mistGeo.attributes.aSize.needsUpdate = true;
}

/* ---------- estado (lo maneja script.js con el scroll) ---------- */
const state = {
  k: 0,          // 0 = slot del hero, 1 = slot de la historia
  wall: 0,       // 0 = video, 1 = papel
  ch: 0,         // avance de la historia 0..1
  mx: 0, my: 0,  // mouse normalizado (-1..1)
  intro: STILL ? 1 : 0,
  spray: 0,      // segundos desde el último rocío (para la tapa)
};
let sprayT = 99, sprayDir = -1;

/* ---------- posicionamiento: el frasco ocupa el rectángulo del slot ---------- */
let W = 1, Hh = 1;
const rectOf = el => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, h: r.height, w: r.width };
};
function placeFor(rect, z) {
  // unidades por píxel en el plano z (frente del frasco)
  const upp = (2 * (camera.position.z - z) * TAN) / Hh;
  return { x: (rect.cx - W / 2) * upp, y: -(rect.cy - Hh / 2) * upp, s: (rect.h * upp) / H };
}

function resize() {
  W = innerWidth; Hh = innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxDpr()));
  renderer.setSize(W, Hh, false);
  camera.aspect = W / Hh;
  camera.updateProjectionMatrix();
  fitWall();
  const dist = camera.position.z - WALL_Z;
  catcher.scale.set(2 * dist * TAN * camera.aspect * 1.1, 2 * dist * TAN * 1.1, 1);
  mistMat.uniforms.uPx.value = renderer.getDrawingBufferSize(new THREE.Vector2()).y / (2 * TAN);
}
addEventListener('resize', resize);
resize();

/* ---------- animación por cuadro ---------- */
const clock = new THREE.Clock();
let introStart = -1, t0 = 0, rotY = 0, rotX = 0, wallX = 0, wallY = 0;
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3();

function update(dt, time) {
  // intro: aparece de abajo hacia arriba y se llena
  let intro = state.intro;
  if (!STILL && introStart >= 0) intro = state.intro = clamp01((time - introStart) / 2.3);
  const reveal = easeInOut(seg(intro, .12, .62));
  const fill = easeOut(seg(intro, .42, .95));
  labelMat.opacity = .9 * seg(intro, .62, .9);

  const p = state.ch;
  const asm = seg(p, .30, .46);      // la caja de lujo se arma
  const flip = seg(p, .50, .64);     // se da vuelta: caja tester
  const stampP = seg(p, .68, .74);   // sello
  const open = seg(p, .76, .88);     // se abre la solapa
  const rise = easeInOut(seg(p, .82, .97)); // el frasco sale

  // posición: interpolamos entre los dos slots
  const rh = rectOf(slotHero), rs = rectOf(slotStory);
  const k = easeInOut(clamp01(state.k));
  let pl;
  if (rh && rs) {
    const a = placeFor(rh, FRONT_Z), b = placeFor(rs, FRONT_Z);
    pl = { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k) };
  } else pl = placeFor(rh || rs || { cx: W / 2, cy: Hh / 2, h: Hh * .5 }, FRONT_Z);

  const bob = STILL ? 0 : Math.sin(time * 1.1) * .045 * (1 - k);
  // con la caja: el conjunto se achica para que entren caja y frasco
  const fitScale = lerp(1, .86, Math.max(asm * .4, rise));
  product.position.set(pl.x, pl.y + bob * pl.s, 0);
  product.scale.setScalar(pl.s * fitScale);

  // rotación: mouse + respiración en el hero; capítulos en la historia
  const idle = STILL ? 0 : Math.sin(time * .35) * .28;
  const heroRotY = idle + state.mx * .42;
  const storyRotY = lerp(lerp(.15, .62, seg(p, 0, .3)), -.42, easeInOut(seg(p, .3, .6))) + lerp(0, .5, easeInOut(seg(p, .6, .78))) - .1 * rise;
  const targetY = lerp(heroRotY, storyRotY, k);
  const targetX = lerp(.1 - state.my * .08, .08 + .08 * open, k);
  const damp = 1 - Math.exp(-dt * (k > .5 ? 7 : 3.2));
  rotY += (targetY - rotY) * (STILL ? 1 : damp);
  rotX += (targetX - rotX) * (STILL ? 1 : damp);
  spin.rotation.set(rotX, rotY, 0);

  // el frasco sale de la caja
  bottle.position.y = lerp(0, 2.55, rise);
  box.position.y = lerp(0, -.62, rise);

  // los reflejos del estudio se mueven apenas: el brillo recorre vidrio, tapa y collar
  if (!STILL) scene.environmentRotation.y = Math.sin(time * .23) * .35;

  // pared: video → papel; leve paralaje con el mouse. Sobre papel la sombra se aliviana
  wallU.uMix.value = state.wall;
  catcher.material.opacity = lerp(.24, .13, state.wall);
  wallX += ((state.mx * -.22) - wallX) * damp; wallY += ((state.my * .12) - wallY) * damp;
  wall.position.x = wallX; wall.position.y = wallY;
  // lo que el perfume deja ver de la pared
  const wm = wallMat.map;
  liqU.uWall.value = wm;
  liqU.uHasWall.value = wm && wall.visible ? 1 : 0;
  liqU.uWallRect.value.set(wall.position.x, wall.position.y, wall.scale.x, wall.scale.y);
  if (wm) liqU.uWallUv.value.set(wm.repeat.x, wm.repeat.y, wm.offset.x, wm.offset.y);

  // planos de corte en coordenadas de mundo (aparición y nivel del perfume)
  product.updateMatrixWorld(true);
  const s = product.scale.y;
  const baseY = product.position.y + (bottle.position.y - H / 2) * s;
  revealPlane.constant = reveal >= 1 ? 1e4 : reveal <= 0 ? baseY - 1 : baseY + (H + .05) * s * reveal;
  const fillLevel = INNER.y0 + INNER.h * .82 * fill;
  fillPlane.constant = fill <= 0 ? baseY - 1 : baseY + fillLevel * s;
  surf.visible = fill > .03;
  surf.position.y = fillLevel - .004;
  surf.scale.x = Math.max(.01, innerWidthAt(fillLevel) - .05);

  // tapa: se levanta para rociar
  sprayT += dt;
  const capUp = sprayT < .25 ? easeOut(sprayT / .25) : sprayT < 1.55 ? 1 : 1 - easeInOut(clamp01((sprayT - 1.55) / .45));
  // la tapa se corre hacia el lado contrario al rocío (si subiera, pisaría el texto de arriba)
  capG.position.y = BODY.h + .40 + capUp * .29;
  capG.rotation.z = capUp * .3 * sprayDir;
  capG.position.x = -capUp * .72 * sprayDir;
  const press = sprayT > .26 && sprayT < .5 ? Math.sin((sprayT - .26) / .24 * Math.PI) : 0;
  nozzleG.position.y = BODY.h + .4 - press * .06;
  if (sprayT > .3 && sprayT - dt <= .3) {
    nozzleTop.getWorldPosition(tmpV);
    tmpV.y += .06 * s;
    tmpV2.set(sprayDir * 1, .1, .35).normalize();
    emitMist(tmpV, tmpV2, 340);
  }
  stepMist(dt);

  // la caja
  box.visible = boxBuilt && asm > 0;
  if (box.visible) {
    faces.forEach(f => {
      const t = easeOut(clamp01((asm - f.delay * .55) / .45));
      const off = (1 - t) * 4.2;
      f.pivot.position.copy(f.base).addScaledVector(f.nrm, off);
      if (!f.hinge) f.pivot.rotation.set(f.spinOff.x * (1 - t), f.spinOff.y * (1 - t), f.spinOff.z * (1 - t));
      else f.pivot.rotation.set(-open * 1.95 + f.spinOff.x * (1 - t), f.spinOff.y * (1 - t), 0);
      f.pivot.scale.setScalar(.35 + .65 * t);
      // giro de carta: a mitad del giro cambia la impresión (lujo → tester)
      const ft = clamp01((flip - f.flipDelay * .45) / .55);
      f.card.scale.x = Math.max(.001, Math.abs(Math.cos(ft * Math.PI)));
      f.outer.material = ft >= .5 ? f.mTst : f.mLux;
    });
    if (boxStamp) {
      const sp = easeOut(stampP);
      boxStamp.material.opacity = .88 * Math.min(1, stampP * 2.2);
      boxStamp.scale.setScalar(lerp(1.9, 1, sp));
      boxStamp.rotation.z = lerp(-.4, -.1, sp);
    }
  }

  // luz y sombra siguen al frasco
  key.target.position.copy(product.position);
  key.position.copy(product.position).addScaledVector(KEY_OFFSET, 1);
  // destello ámbar dentro de la sombra (donde el rayo atraviesa el perfume)
  bottle.getWorldPosition(tmpV);
  tmpV.y -= .1 * s;
  tmpV2.subVectors(tmpV, key.position);
  const tt = (WALL_Z - tmpV.z) / tmpV2.z;
  caustic.position.set(tmpV.x + tmpV2.x * tt, tmpV.y + tmpV2.y * tt, WALL_Z + .04);
  caustic.scale.set(1.7 * s, 2.5 * s, 1);
  caustic.material.opacity = .5 * fill * (1 - state.wall * .35) * (1 - asm) + .3 * rise;
}

let running = false, raf = 0, visible = true;
function frame() {
  raf = 0;
  if (!running) return;
  const dt = Math.min(clock.getDelta(), 1 / 20);
  t0 += dt;
  update(dt, t0);
  renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
}
function start() { if (running || !visible) return; running = true; clock.getDelta(); raf = requestAnimationFrame(frame); }
function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

/* ---------- API para script.js ---------- */
const api = {
  state,
  intro() { if (introStart < 0) introStart = t0; },
  spray(dir) {
    if (sprayT < 1.9) return false;
    sprayDir = dir || (Math.random() > .5 ? 1 : -1);
    sprayT = 0;
    return true;
  },
  setVisible(v) { visible = v; if (v) start(); else stop(); },
  prepareBox: buildBox,
  render() { update(0, t0); renderer.render(scene, camera); },
  destroy() {
    stop();
    removeEventListener('resize', resize);
    try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) {}
    canvas.style.display = 'none';
  },
};
window.__frasco = api;

/* modo render fijo: ?still=hero|ch1|ch2|ch3 (&ch=0..1 para elegir el cuadro de la historia)
   &matte=0|1 → sin pared, sobre negro o blanco (para recortar el frasco con alfa real por diferencia) */
async function renderStill(which) {
  await buildBox();
  const presets = { hero: { k: 0, wall: 0, ch: 0 }, ch1: { k: 1, wall: 1, ch: .2 }, ch2: { k: 1, wall: 1, ch: .47 }, ch3: { k: 1, wall: 1, ch: 1 } };
  Object.assign(state, presets[which] || presets.hero, { intro: 1, mx: 0, my: 0 });
  if (Q.get('rot')) state.mx = parseFloat(Q.get('rot'));
  if (Q.get('ch')) state.ch = parseFloat(Q.get('ch'));
  if (Q.has('matte')) {
    // solo el frasco: la sombra se agrega en CSS (drop-shadow), así siempre oscurece lo que tiene detrás
    wall.visible = false; catcher.visible = false; caustic.visible = false;
    renderer.setClearColor(Q.get('matte') === '1' ? 0xffffff : 0x000000, 1);
  }
  // dejamos que carguen las texturas
  await new Promise(r => setTimeout(r, 900));
  for (let i = 0; i < 4; i++) { update(1 / 60, 0); renderer.render(scene, camera); }
  document.documentElement.classList.add('still-done');
}

if (STILL) {
  renderStill(STILL);
} else {
  useVideo();
  start();
  // armamos la caja cuando el navegador está libre
  (window.requestIdleCallback || (f => setTimeout(f, 1200)))(() => buildBox());
  window.dispatchEvent(new Event('frasco:ready'));
}
