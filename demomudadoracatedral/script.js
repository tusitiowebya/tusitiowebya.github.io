// ---------- NAV scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- Mobile menu ----------
const burger = document.getElementById('burger');
const mobmenu = document.getElementById('mobmenu');
burger.addEventListener('click', () => {
  mobmenu.classList.toggle('open');
  nav.classList.toggle('nav--onmenu', mobmenu.classList.contains('open'));
});
mobmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobmenu.classList.remove('open');
  nav.classList.remove('nav--onmenu');
}));

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll('.section__head, .card, .timeline li, .quotes blockquote, .wizard');
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ---------- Wizard de cotización ----------
const WA_NUMBER = '5492216286011';
const wizardState = { tamano: null, piso: null, ascensor: null, meta: {} };

document.querySelectorAll('.wizard__opts').forEach(group => {
  const key = group.dataset.group;
  group.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wizardState[key] = btn.dataset.value;
      if (key === 'tamano') {
        wizardState.meta = {
          camion: btn.dataset.camion,
          mudadores: btn.dataset.mudadores,
          horas: btn.dataset.horas,
          label: btn.textContent.trim()
        };
      }
      updateWizardResult();
    });
  });
});

function updateWizardResult() {
  const { tamano, piso, ascensor, meta } = wizardState;
  const result = document.getElementById('wizardResult');
  if (!tamano || !piso || !ascensor) return;

  let mudadores = parseInt(meta.mudadores, 10);
  let nota = '';
  if (piso === 'alto' && ascensor === 'no') {
    mudadores += 1;
    nota = ' (sumamos un mudador extra por los pisos sin ascensor)';
  }

  document.getElementById('rCamion').textContent = meta.camion;
  document.getElementById('rMudadores').textContent = mudadores + (mudadores === 1 ? ' persona' : ' personas');
  document.getElementById('rHoras').textContent = meta.horas + ' hs';

  const pisoTexto = { pb: 'planta baja', bajo: '1° a 3° piso', alto: '4° piso o más' }[piso];
  const ascensorTexto = ascensor === 'si' ? 'con ascensor' : 'sin ascensor';
  const msg = `Hola! Quiero presupuesto para mi mudanza.%0A%0A` +
    `📦 Tamaño: ${encodeURIComponent(meta.label)}%0A` +
    `🏢 Piso: ${encodeURIComponent(pisoTexto)}, ${encodeURIComponent(ascensorTexto)}%0A` +
    `🚛 Estimado: ${encodeURIComponent(meta.camion)}, ${mudadores} mudadores, ${encodeURIComponent(meta.horas)} hs${encodeURIComponent(nota)}%0A%0A` +
    `Me gustaría coordinar fecha y confirmar el presupuesto.`;

  document.getElementById('rWa').href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  result.classList.add('ready');
  if (!result.classList.contains('scrolled-into')) {
    result.classList.add('scrolled-into');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
