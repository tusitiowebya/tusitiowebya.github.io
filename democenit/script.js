const WA = '5493544590915';

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

function closeMenu() {
  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const open = !mobileNav.classList.contains('is-open');
  menuToggle.classList.toggle('is-active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.classList.toggle('is-open', open);
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

const filterButtons = document.querySelectorAll('[data-filter]');
const propertyCards = document.querySelectorAll('.property-card');

function filterProperties(filter) {
  filterButtons.forEach(button => button.classList.toggle('is-active', button.dataset.filter === filter));
  propertyCards.forEach(card => {
    const visible = filter === 'todas' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !visible);
  });
}

filterButtons.forEach(button => button.addEventListener('click', () => filterProperties(button.dataset.filter)));

const finderTabs = document.querySelectorAll('.finder__tabs button');
const propertyType = document.querySelector('#propertyType');
const finderGo = document.querySelector('#finderGo');
let finderMode = 'comprar';

finderTabs.forEach(button => button.addEventListener('click', () => {
  finderMode = button.dataset.mode;
  finderTabs.forEach(tab => tab.classList.toggle('is-active', tab === button));
  const map = {
    comprar: ['Todo tipo de propiedad', 'Ver opciones'],
    vender: ['Quiero vender una propiedad', 'Empezar'],
    tasar: ['Necesito una tasación', 'Tasar']
  };
  propertyType.options[0].textContent = map[finderMode][0];
  finderGo.querySelector('span').textContent = map[finderMode][1];
}));

finderGo.addEventListener('click', () => {
  if (finderMode === 'comprar') {
    filterProperties(propertyType.value);
    document.querySelector('#propiedades').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (finderMode === 'tasar') {
    document.querySelector('#tasacion').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent('Hola Cenit, quiero vender una propiedad y recibir asesoramiento.')}`, '_blank', 'noopener');
});

const valuationForm = document.querySelector('#valuationForm');
const progress = document.querySelector('#formProgress');
const requiredFields = [...valuationForm.querySelectorAll('[required]')];

function updateProgress() {
  const completed = requiredFields.filter(field => field.value.trim()).length;
  progress.style.width = `${(completed / requiredFields.length) * 100}%`;
}

valuationForm.querySelectorAll('input, select').forEach(field => {
  field.addEventListener('input', updateProgress);
  field.addEventListener('change', updateProgress);
});

valuationForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(valuationForm);
  const message = [
    'Hola Cenit, quiero solicitar una tasación.',
    '',
    `Propiedad: ${data.get('tipo')}`,
    `Zona: ${data.get('zona')}`,
    `Superficie aprox.: ${data.get('metros') || 'A confirmar'}`,
    `Nombre: ${data.get('nombre')}`
  ].join('\n');
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelector('#year').textContent = new Date().getFullYear();
