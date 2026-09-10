/* =========================================================
   Abril Decoraciones — TuPaginaYa
   ========================================================= */

/* ---------- modo QA (?qa): sin animaciones, para capturas ---------- */
const QA = location.search.includes('qa');
if (QA) document.documentElement.classList.add('qa');

/* ---------- nav ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* ---------- año ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- reveal ---------- */
const targets = document.querySelectorAll(
  '.head, .sis, .pasos li, .g, .quotes blockquote, .faq details, .sim-stage, .sim-panel, .cta .wrap > *'
);
targets.forEach(el => el.classList.add(QA ? 'in' : 'reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('in'), (i % 6) * 80);
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
targets.forEach(el => io.observe(el));

/* ---------- FAQ: una abierta por vez ---------- */
const faqs = document.querySelectorAll('#faq details');
faqs.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
}));

/* =========================================================
   PROBADOR DE LUZ
   ========================================================= */
const fabric   = document.getElementById('fabric');
const chips    = document.getElementById('chipsTipo');
const swatches = document.getElementById('swatches');
const bajada   = document.getElementById('bajada');
const giro     = document.getElementById('giro');
const fieldGiro = document.getElementById('fieldGiro');
const labelBajada = document.getElementById('labelBajada');
const labelGiro   = document.getElementById('labelGiro');
const valBajada = document.getElementById('valBajada');
const valGiro   = document.getElementById('valGiro');
const anchoIn = document.getElementById('ancho');
const altoIn  = document.getElementById('alto');
const m2Out   = document.getElementById('m2');
const simWa   = document.getElementById('simWa');
const simNote = document.getElementById('simNote');
const simCaption = document.getElementById('simCaption');

const NOMBRES = {
  screen:   'Roller screen 5%',
  blackout: 'Roller blackout',
  zebra:    'Cortina zebra',
  bandas:   'Bandas verticales',
  paneles:  'Paneles orientales'
};

const state = { tipo: 'screen', color: '#D9CDBB', colorNombre: 'Arena', bajada: 60, giro: 45 };

const hexToRgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const mix = (a, b, t) => a + (b - a) * t;

/* --- dibujo de la tela --- */
function drawFabric() {
  const { tipo, color, bajada: cov, giro: g } = state;
  const c = cov / 100;
  const t = g / 90;

  if (tipo === 'blackout' || tipo === 'screen' || tipo === 'zebra') {
    let tela = '';
    if (tipo === 'blackout') {
      tela = `background:${color};background-image:linear-gradient(90deg,rgba(0,0,0,.10),transparent 18%,transparent 82%,rgba(0,0,0,.10));`;
    } else if (tipo === 'screen') {
      tela =
        `background-color:${hexToRgba(color, .48)};` +
        `background-image:repeating-linear-gradient(to bottom,${hexToRgba(color, .92)} 0 1px,transparent 1px 3px),` +
        `repeating-linear-gradient(to right,${hexToRgba(color, .92)} 0 1px,transparent 1px 3px);`;
    } else {
      const period = 46;
      const opaco = (period / 2) * (1 + t);           // 23px abiertas → 46px cerradas
      tela =
        `background-image:repeating-linear-gradient(to bottom,` +
        `${color} 0 ${opaco.toFixed(1)}px,` +
        `${hexToRgba(color, .24)} ${opaco.toFixed(1)}px ${period}px);`;
    }
    fabric.innerHTML = `<div class="roller" style="height:${cov}%"><div class="tela" style="${tela}"></div></div>`;
    return;
  }

  if (tipo === 'bandas') {
    const n = 12;
    // giro 0 = lamas abiertas (de canto) · giro 90 = cerradas (de frente)
    const lamas = Array.from({ length: n }, () =>
      `<i style="background:${color};transform:rotateY(${90 - g}deg)"></i>`
    ).join('');
    fabric.innerHTML =
      `<div class="slats" style="right:auto;width:${Math.max(cov, 6)}%">${lamas}</div>`;
    return;
  }

  // paneles
  const n = 3;
  const paños = Array.from({ length: n }, (_, k) =>
    `<i style="background:${color};left:0;transform:translateX(${(k * c * 97).toFixed(1)}%)"></i>`
  ).join('');
  fabric.innerHTML = `<div class="panels">${paños}</div>`;
}

/* --- medidores --- */
function metrics() {
  let c = state.bajada / 100;
  // los paños de un panelado siempre tapan un tramo, aunque estén corridos del todo
  if (state.tipo === 'paneles') c = .34 + c * .66;
  if (state.tipo === 'bandas')  c = Math.max(c, .06);
  const t = state.giro / 90;
  let trans, vis, priv;

  switch (state.tipo) {
    case 'blackout': trans = 0;   vis = 0;   priv = 100; break;
    case 'screen':   trans = .30; vis = .50; priv = 92;  break;
    case 'zebra':    trans = mix(.55, .06, t); vis = mix(.45, .02, t); priv = mix(58, 96, t); break;
    case 'bandas':   trans = mix(.78, .08, t); vis = mix(.70, .03, t); priv = mix(38, 94, t); break;
    default:         trans = .10; vis = .06; priv = 90;  break; // paneles
  }

  return {
    luz:  Math.round(((1 - c) + c * trans) * 100),
    vis:  Math.round(((1 - c) + c * vis) * 100),
    priv: Math.round(c * priv)
  };
}

function nota(m) {
  const { tipo, bajada: cov } = state;
  if (cov < 8) return 'Cortina levantada: la ventana queda libre. Bajala para ver cómo trabaja la tela.';
  switch (tipo) {
    case 'blackout':
      return cov > 90
        ? 'Oscuridad total: no entra luz ni se ve nada desde afuera. Es lo que se pide para dormitorios.'
        : 'La parte cubierta queda opaca del todo — el blackout no filtra, corta.';
    case 'screen':
      return 'El tejido baja el resplandor y el calor pero mantiene la vista. De día no te ven desde la calle; de noche, con la luz prendida, sí.';
    case 'zebra':
      return state.giro < 30
        ? 'Franjas alineadas: entra luz difusa por las bandas traslúcidas, como un velo.'
        : (state.giro > 65
          ? 'Franjas cruzadas: la cortina se cierra y el ambiente queda en penumbra.'
          : 'Punto intermedio: media luz, la más usada en livings.');
    case 'bandas':
      return state.giro < 30
        ? 'Lamas abiertas: pasa mucha luz y mirás para afuera entre banda y banda.'
        : (state.giro > 65
          ? 'Lamas cerradas: la ventana queda tapada de punta a punta.'
          : 'Lamas a 45°: entra luz de rebote y desde afuera casi no se ve hacia adentro.');
    default:
      return 'Los paños corren uno detrás del otro: podés tapar sólo una parte del ventanal o dividir el ambiente.';
  }
}

function update() {
  const tipo = state.tipo;
  const esRoller = tipo === 'blackout' || tipo === 'screen' || tipo === 'zebra';
  const usaGiro  = tipo === 'zebra' || tipo === 'bandas';

  fieldGiro.hidden = !usaGiro;
  labelGiro.childNodes[0].nodeValue = tipo === 'zebra' ? 'Alineación de las franjas ' : 'Giro de las lamas ';
  labelBajada.childNodes[0].nodeValue = esRoller ? 'Cuánto la bajás ' : 'Cuánto la corrés ';
  valBajada.textContent = state.bajada + '%';
  valGiro.textContent = tipo === 'zebra'
    ? (state.giro < 30 ? 'abiertas' : state.giro > 65 ? 'cerradas' : 'media')
    : state.giro + '°';

  drawFabric();

  const m = metrics();
  document.getElementById('mLuz').style.width  = m.luz + '%';
  document.getElementById('mPriv').style.width = m.priv + '%';
  document.getElementById('mVis').style.width  = m.vis + '%';
  document.getElementById('mLuzV').textContent  = m.luz + '%';
  document.getElementById('mPrivV').textContent = m.priv + '%';
  document.getElementById('mVisV').textContent  = m.vis + '%';

  simNote.textContent = nota(m);
  simCaption.textContent = `${NOMBRES[tipo]} ${state.colorNombre.toLowerCase()}, ${esRoller ? 'bajada' : 'corrida'} al ${state.bajada}%.`;

  // medidas + mensaje
  const a = Math.max(20, Math.min(600, Number(anchoIn.value) || 0));
  const h = Math.max(20, Math.min(400, Number(altoIn.value) || 0));
  const sup = (a * h) / 10000;
  m2Out.textContent = sup.toFixed(2).replace('.', ',') + ' m²';

  const msg =
    `Hola Pablo! Probé la cortina en la web y quiero un precio:\n` +
    `• Sistema: ${NOMBRES[tipo]}\n` +
    `• Color de tela: ${state.colorNombre}\n` +
    `• Medidas: ${a} cm de ancho x ${h} cm de alto (${sup.toFixed(2).replace('.', ',')} m²)\n` +
    `¿Me pasás el presupuesto?`;
  simWa.href = 'https://wa.me/5491141791241?text=' + encodeURIComponent(msg);
}

chips.addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  chips.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
  b.classList.add('is-on');
  state.tipo = b.dataset.tipo;
  update();
});

swatches.addEventListener('click', e => {
  const b = e.target.closest('.sw');
  if (!b) return;
  swatches.querySelectorAll('.sw').forEach(c => c.classList.remove('is-on'));
  b.classList.add('is-on');
  state.color = b.dataset.color;
  state.colorNombre = b.dataset.nombre;
  update();
});

bajada.addEventListener('input', () => { state.bajada = Number(bajada.value); update(); });
giro.addEventListener('input',   () => { state.giro   = Number(giro.value);   update(); });
[anchoIn, altoIn].forEach(i => i.addEventListener('input', update));

/* en modo QA se puede fijar el estado del probador por querystring */
if (QA) {
  const q = new URLSearchParams(location.search);
  const tq = q.get('tipo');
  if (tq && NOMBRES[tq]) {
    const c = document.querySelector(`.chip[data-tipo="${tq}"]`);
    if (c) c.click();
  }
  if (q.get('bajada')) { bajada.value = q.get('bajada'); state.bajada = Number(bajada.value); }
  if (q.get('giro'))   { giro.value   = q.get('giro');   state.giro   = Number(giro.value); }
}

update();
