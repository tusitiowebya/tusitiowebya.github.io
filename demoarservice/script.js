/* ░░ HERO ENTRANCE ░░ */
window.addEventListener('load', () => {
  document.querySelector('.hero').classList.add('ready');
});
// fallback if load already fired
if (document.readyState === 'complete') {
  document.querySelector('.hero')?.classList.add('ready');
}

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
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  io.observe(el);
});

/* ░░ STAT COUNTERS ░░ */
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 38));
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; }
      else { el.textContent = cur; requestAnimationFrame(tick); }
    };
    tick();
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => cio.observe(c));

/* ░░ GALLERY MODAL ░░ */
const galImages = [
  { src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Construcción' },
  { src: 'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Remodelaciones' },
  { src: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Electricidad' },
  { src: 'https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Herrería' },
  { src: 'https://images.pexels.com/photos/5824901/pexels-photo-5824901.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Aire acondicionado' },
  { src: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Construcción en seco' },
];
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalCap = document.getElementById('modalCap');
let curIdx = 0;

function openModal(i) {
  curIdx = i;
  render();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function render() {
  const g = galImages[curIdx];
  modalImg.src = g.src; modalImg.alt = g.cap; modalCap.textContent = g.cap;
}
function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }
function nav(d) { curIdx = (curIdx + d + galImages.length) % galImages.length; render(); }

document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => openModal(+item.dataset.index));
});
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
  const email = (d.get('email') || '').toString().trim();
  const serv = (d.get('servicio') || '').toString().trim();
  const msg = (d.get('mensaje') || '').toString().trim();

  let txt = `Hola AR SERVICE, soy ${nombre}.`;
  txt += `\n• Servicio: ${serv}`;
  txt += `\n• Teléfono: ${tel}`;
  if (email) txt += `\n• Email: ${email}`;
  if (msg) txt += `\n\n${msg}`;

  window.open(`https://wa.me/5491140510754?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
});
