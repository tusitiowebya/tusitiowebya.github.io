// ===== Nav scroll state =====
const nav = document.getElementById('nav');
const waFloat = document.getElementById('waFloat');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  waFloat.classList.toggle('show', y > window.innerHeight * 0.55);
}, { passive: true });

// ===== Reveal on scroll =====
document.querySelectorAll(
  '.section-head, .service-card, .process__step, .trust__item, .wizard'
).forEach(el => el.setAttribute('data-reveal', ''));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i % 6 * 70);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('.stat__num');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const dur = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countIO.observe(c));

// ===== Wizard: ¿Qué trámite necesitás? =====
const state = { vehiculo: null, tramite: null, domicilio: null };

const vehiculoLabels = { auto: 'tu auto', moto: 'tu moto', embarcacion: 'tu embarcación' };
const tramiteLabels = {
  transferencia: 'una transferencia (compra/venta)',
  patentamiento: 'un patentamiento 0km',
  verificacion: 'una verificación policial',
  duplicado: 'un duplicado de cédula/título',
  informe: 'un informe de dominio',
  prenda: 'una prenda o cambio de radicación',
};

const checklists = {
  transferencia: [
    'Título y cédula del vehículo',
    'DNI de comprador y vendedor',
    'Formulario 08 firmado',
    'Verificación policial vigente',
  ],
  patentamiento: [
    'Factura de compra del 0km',
    'Certificado de fábrica',
    'DNI del titular',
    'Seguro obligatorio contratado',
  ],
  verificacion: [
    'Título o cédula del vehículo',
    'DNI del titular',
    'Coordinar día y horario a domicilio',
  ],
  duplicado: [
    'DNI del titular',
    'Denuncia de extravío (si corresponde)',
    'Comprobante de pago de tasas',
  ],
  informe: [
    'Dominio o número de chasis',
    'DNI de quien solicita',
    'Motivo del informe (compra, embargo, etc.)',
  ],
  prenda: [
    'Título y cédula del vehículo',
    'Contrato de prenda o cancelación',
    'DNI del titular',
  ],
};

function randLetters(n) {
  const L = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  return Array.from({ length: n }, () => L[Math.floor(Math.random() * L.length)]).join('');
}
function randDigits(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
}

function setActive(container, value) {
  container.querySelectorAll('button').forEach(b => {
    b.classList.toggle('active', b.dataset.value === value);
  });
}

function updateWizard() {
  const plateCode = document.getElementById('plateCode');
  const title = document.getElementById('resultTitle');
  const list = document.getElementById('resultChecklist');
  const wa = document.getElementById('wizardWa');

  if (state.vehiculo === 'moto') {
    plateCode.textContent = `${randLetters(3)} ${randDigits(3)}`;
  } else {
    plateCode.textContent = `${randLetters(2)} ${randDigits(3)} ${randLetters(2)}`;
  }

  if (!state.vehiculo) {
    title.textContent = 'Elegí tu vehículo para empezar';
    list.innerHTML = '<li>Seleccioná las opciones de la izquierda</li>';
    return;
  }
  if (!state.tramite) {
    title.textContent = `Perfecto, ${vehiculoLabels[state.vehiculo]}. ¿Qué trámite necesitás?`;
    list.innerHTML = '<li>Elegí el trámite en el paso 02</li>';
    return;
  }

  title.textContent = `${vehiculoLabels[state.vehiculo]} · ${tramiteLabels[state.tramite]}`;
  const items = [...checklists[state.tramite]];
  if (state.domicilio === 'si') items.push('Verificación policial coordinada a domicilio');
  list.innerHTML = items.map(i => `<li>${i}</li>`).join('');

  const domicilioSuffix = state.domicilio === 'si' && state.tramite !== 'verificacion'
    ? ', con verificación policial a domicilio' : '';
  const msg = `Hola, quiero consultar sobre ${tramiteLabels[state.tramite]} para ${vehiculoLabels[state.vehiculo]}${domicilioSuffix}.`;
  wa.href = `https://wa.me/5491171206846?text=${encodeURIComponent(msg)}`;
}

document.getElementById('vehiculoOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  state.vehiculo = btn.dataset.value;
  setActive(e.currentTarget, state.vehiculo);
  updateWizard();
});
document.getElementById('tramiteOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  state.tramite = btn.dataset.value;
  setActive(e.currentTarget, state.tramite);
  updateWizard();
});
document.getElementById('domicilioOptions').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  state.domicilio = btn.dataset.value;
  setActive(e.currentTarget, state.domicilio);
  updateWizard();
});
