// ===== NAV scroll state =====
const nav = document.getElementById('nav');
const waFloat = document.getElementById('waFloat');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  waFloat.classList.toggle('show', y > window.innerHeight * 0.7);
}, { passive: true });

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  const setHeight = () => { if (item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px'; };
  setHeight();
  window.addEventListener('resize', setHeight);
  q.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = 0; }
    });
    item.classList.toggle('open', willOpen);
    a.style.maxHeight = willOpen ? a.scrollHeight + 'px' : 0;
  });
});

// ===== WIZARD "¿Qué necesitás resolver?" =====
const WA_NUMBER = '541123878134';

const SITUATIONS = [
  {
    id: 'compre',
    title: 'Compré un auto o moto',
    hint: 'Necesito transferirlo a mi nombre',
    time: '48-72 hs hábiles',
    reqs: [
      'DNI del comprador y del vendedor',
      'Título y cédula del vehículo',
      'Formulario 08 completo y firmado',
      'Verificación policial vigente'
    ],
    waMsg: 'Hola María, compré un vehículo y necesito hacer la transferencia. ¿Qué papeles tengo que juntar?'
  },
  {
    id: 'vendi',
    title: 'Vendí mi vehículo',
    hint: 'Quiero hacer la denuncia de venta',
    time: '24-48 hs hábiles',
    reqs: [
      'DNI del titular',
      'Título y cédula del vehículo',
      'Datos del comprador (nombre y DNI)',
      'Fecha de la operación'
    ],
    waMsg: 'Hola María, vendí mi vehículo y quiero hacer la denuncia de venta. ¿Cómo seguimos?'
  },
  {
    id: 'perdi',
    title: 'Perdí mis papeles',
    hint: 'Necesito un duplicado de título o cédula',
    time: '7-15 días hábiles',
    reqs: [
      'DNI del titular',
      'Denuncia de extravío (si corresponde)',
      'Datos del dominio del vehículo',
      'Comprobante de domicilio actualizado'
    ],
    waMsg: 'Hola María, perdí el título/cédula de mi vehículo y necesito el duplicado. ¿Qué necesito llevar?'
  },
  {
    id: 'robo',
    title: 'Me robaron el vehículo',
    hint: 'Necesito hacer la denuncia correspondiente',
    time: '24-48 hs hábiles',
    reqs: [
      'DNI del titular',
      'Constancia de denuncia policial',
      'Título y cédula (si los tenés)',
      'Datos completos del dominio'
    ],
    waMsg: 'Hola María, me robaron el vehículo y necesito hacer la denuncia correspondiente. ¿Cómo arrancamos?'
  },
  {
    id: 'verificacion',
    title: 'Necesito verificación policial',
    hint: 'Para transferencia o patentamiento',
    time: 'Turno en 24-72 hs',
    reqs: [
      'DNI del titular',
      'Título y cédula del vehículo',
      'Formulario 08 (si es transferencia)',
      'El vehículo presente en el turno'
    ],
    waMsg: 'Hola María, necesito sacar un turno de verificación policial para mi vehículo. ¿Me ayudás?'
  },
  {
    id: 'informe',
    title: 'Voy a comprar un usado',
    hint: 'Quiero un informe antes de cerrar la compra',
    time: '24-48 hs hábiles',
    reqs: [
      'Dominio (patente) del vehículo',
      'DNI de quien solicita el informe',
      'Datos del vendedor (opcional)',
      'Nada más — el resto lo consulto yo'
    ],
    waMsg: 'Hola María, estoy por comprar un auto usado y quiero pedirte un informe de dominio antes de cerrar. ¿Qué datos necesitás?'
  }
];

const optionsWrap = document.getElementById('wizardOptions');
const step1 = document.querySelector('.wizard-step[data-step="1"]');
const step2 = document.querySelector('.wizard-step[data-step="2"]');
const progress = document.querySelectorAll('#wizardProgress span');
const resultTitle = document.getElementById('resultTitle');
const resultTime = document.getElementById('resultTime');
const resultReqs = document.getElementById('resultReqs');
const resultWa = document.getElementById('resultWa');
const backBtn = document.getElementById('wizardBack');

SITUATIONS.forEach(s => {
  const btn = document.createElement('button');
  btn.className = 'wizard-opt';
  btn.innerHTML = `<strong>${s.title}</strong><span>${s.hint}</span>`;
  btn.addEventListener('click', () => showResult(s));
  optionsWrap.appendChild(btn);
});

function showResult(s) {
  resultTitle.textContent = s.title;
  resultTime.textContent = s.time;
  resultReqs.innerHTML = s.reqs.map(r => `
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>
      <span>${r}</span>
    </li>`).join('');
  resultWa.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(s.waMsg)}`;
  step1.classList.remove('active');
  step2.classList.add('active');
  progress[1].classList.add('done');
}

backBtn.addEventListener('click', () => {
  step2.classList.remove('active');
  step1.classList.add('active');
  progress[1].classList.remove('done');
});
