document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Cerrar menú');
    mainNav.classList.add('is-open');
    document.body.classList.add('menu-open');
  }
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const form = document.querySelector('#plan-form');
const summary = document.querySelector('#plan-summary');
const send = document.querySelector('#plan-send');
const remote = document.querySelector('#remote');
const audienceChoices = form.querySelectorAll('input[name="audience"]');
const focusLabels = {
  alimentacion: 'Alimentación personalizada',
  entrenamiento: 'Entrenamiento personalizado',
  ambos: 'Alimentación + entrenamiento'
};
const audienceLabels = { mujeres: 'para mujeres', hombres: 'para hombres' };

function updatePlan() {
  const focus = form.querySelector('input[name="focus"]:checked')?.value;
  const audience = form.querySelector('input[name="audience"]:checked')?.value;
  const isFoodOnly = focus === 'alimentacion';
  form.querySelector('#audience-fieldset').hidden = isFoodOnly;
  if (isFoodOnly) audienceChoices.forEach(choice => { choice.checked = false; });

  const selectedAudience = isFoodOnly ? undefined : audience;
  const parts = [];
  if (focus) parts.push(focusLabels[focus]);
  if (selectedAudience && audienceLabels[selectedAudience]) parts.push(audienceLabels[selectedAudience]);
  if (remote.checked) parts.push('a distancia');
  summary.textContent = parts.length ? parts.join(' · ') : 'Elegí tu punto de partida';

  let message = 'Hola Pablo, quiero consultarte por Bearforce Team.';
  if (focus) message += ` Me interesa ${focusLabels[focus].toLowerCase()}.`;
  if (selectedAudience && audienceLabels[selectedAudience]) message += ` Quiero conocer el entrenamiento ${audienceLabels[selectedAudience]}.`;
  if (remote.checked) message += ' Me interesa el asesoramiento a distancia completo.';
  message += ' Te cuento mi objetivo:';
  send.href = `https://wa.me/5491141923167?text=${encodeURIComponent(message)}`;
}
form.addEventListener('change', updatePlan);
updatePlan();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}
