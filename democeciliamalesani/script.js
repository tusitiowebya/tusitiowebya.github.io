/* ░░ HERO ENTRANCE ░░ */
function readyHero(){ document.querySelector('.hero')?.classList.add('ready'); }
window.addEventListener('load', readyHero);
if (document.readyState === 'complete') readyHero();

/* ░░ NAVBAR SCROLL ░░ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ░░ MOBILE MENU ░░ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

/* ░░ SCROLL REVEAL ░░ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

/* ░░ CONTACT FORM → WHATSAPP ░░ */
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nombre = (d.get('nombre') || '').toString().trim();
  const contacto = (d.get('contacto') || '').toString().trim();
  const tema = (d.get('tema') || '').toString().trim();
  const msg = (d.get('mensaje') || '').toString().trim();
  let txt = `Hola Cecilia, soy ${nombre}. Me gustaría solicitar un turno de terapia online.`;
  if (tema) txt += `\n• Tema: ${tema}`;
  if (contacto) txt += `\n• Contacto: ${contacto}`;
  if (msg) txt += `\n\n${msg}`;
  window.open(`https://wa.me/5491149146823?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
});
