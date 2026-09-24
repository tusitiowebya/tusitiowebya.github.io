const phone = '5493424424178';
const messages = {
  tarot: 'Hola Cristian, quiero información sobre una lectura de tarot a distancia.',
  medium: 'Hola Cristian, quiero información sobre una consulta como médium.',
  limpieza: 'Hola Cristian, quiero información sobre una limpieza energética.',
  desbloqueo: 'Hola Cristian, quiero información sobre un desbloqueo energético.',
  espiritual: 'Hola Cristian, quiero información sobre trabajos espirituales.'
};

const choices = document.querySelectorAll('input[name="service"]');
const question = document.querySelector('#visitor-question');
const preview = document.querySelector('#message-preview');
const preparedLink = document.querySelector('#prepared-wa');

function updateConsultation() {
  const selected = document.querySelector('input[name="service"]:checked');
  if (!selected || !preview || !preparedLink) return;
  const personalQuestion = question.value.trim();
  const message = `${messages[selected.value]}${personalQuestion ? ` Mi pregunta es: ${personalQuestion}` : ''}`;
  preview.textContent = message;
  preparedLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

choices.forEach(choice => choice.addEventListener('change', updateConsultation));
question?.addEventListener('input', updateConsultation);
updateConsultation();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation?.classList.toggle('open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menú');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
