/* ░░ HERO ENTRANCE ░░ */
function readyHero() { document.querySelector('.hero')?.classList.add('ready'); }
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

/* ░░ GALLERY MODAL ░░ */
const galImages = [
  { src: 'https://images.pexels.com/photos/12278585/pexels-photo-12278585.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Stock permanente' },
  { src: 'https://images.pexels.com/photos/12278574/pexels-photo-12278574.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Tablones' },
  { src: 'https://images.pexels.com/photos/13005858/pexels-photo-13005858.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Corte y cepillado' },
  { src: 'https://images.pexels.com/photos/1094769/pexels-photo-1094769.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'El taller' },
  { src: 'https://images.pexels.com/photos/11483251/pexels-photo-11483251.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Leña seca' },
  { src: 'https://images.pexels.com/photos/30285503/pexels-photo-30285503.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Madera aserrada' },
];
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCap = document.getElementById('modalCap');
let curIdx = 0;
function openModal(i) { curIdx = i; render(); modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
function render() { const g = galImages[curIdx]; modalImg.src = g.src; modalImg.alt = g.cap; modalCap.textContent = g.cap; }
function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }
function nav(d) { curIdx = (curIdx + d + galImages.length) % galImages.length; render(); }
document.querySelectorAll('.gal-item').forEach(item => item.addEventListener('click', () => openModal(+item.dataset.index)));
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalPrev').addEventListener('click', () => nav(-1));
document.getElementById('modalNext').addEventListener('click', () => nav(1));
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') nav(-1);
  if (e.key === 'ArrowRight') nav(1);
});

/* ░░ CONTACT FORM → WHATSAPP ░░ */
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nombre = (d.get('nombre') || '').toString().trim();
  const tel = (d.get('telefono') || '').toString().trim();
  const prod = (d.get('producto') || '').toString().trim();
  const msg = (d.get('mensaje') || '').toString().trim();
  let txt = `Hola Maderas del NEA, soy ${nombre}.`;
  if (prod) txt += `\n• Producto: ${prod}`;
  if (tel) txt += `\n• Teléfono: ${tel}`;
  if (msg) txt += `\n\n${msg}`;
  window.open(`https://wa.me/5491144738051?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
});
