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
  { src: 'https://images.pexels.com/photos/4620555/pexels-photo-4620555.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Nuestra flota' },
  { src: 'https://images.pexels.com/photos/7218504/pexels-photo-7218504.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Mudanzas' },
  { src: 'https://images.pexels.com/photos/7844001/pexels-photo-7844001.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Cargas' },
  { src: 'https://images.pexels.com/photos/12354555/pexels-photo-12354555.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Encomiendas' },
  { src: 'https://images.pexels.com/photos/7843970/pexels-photo-7843970.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Entregas' },
  { src: 'https://images.pexels.com/photos/4554239/pexels-photo-4554239.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'A tu casa' },
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
  const serv = (d.get('servicio') || '').toString().trim();
  const msg = (d.get('mensaje') || '').toString().trim();
  let txt = `Hola Fletes el Rey, soy ${nombre}.`;
  if (serv) txt += `\n• Servicio: ${serv}`;
  if (tel) txt += `\n• Teléfono: ${tel}`;
  if (msg) txt += `\n\n${msg}`;
  window.open(`https://wa.me/5491176609660?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
});
