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

/* ░░ BILLING TOGGLE (mensual / anual) ░░ */
const btOpts = document.querySelectorAll('.bt-opt');
function setCycle(cycle) {
  btOpts.forEach(b => b.classList.toggle('active', b.dataset.cycle === cycle));
  document.querySelectorAll('.pp-amount').forEach(el => { el.textContent = el.dataset[cycle]; });
  document.querySelectorAll('.pp-cycle').forEach(el => { el.textContent = el.dataset[cycle]; });
}
btOpts.forEach(b => b.addEventListener('click', () => setCycle(b.dataset.cycle)));

/* ░░ GALLERY MODAL ░░ */
const galImages = [
  { src: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Al aire' },
  { src: 'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'La consola' },
  { src: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'En la cabina' },
  { src: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'La comunidad' },
  { src: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'La música' },
  { src: 'https://images.pexels.com/photos/7087668/pexels-photo-7087668.jpeg?auto=compress&cs=tinysrgb&w=1400', cap: 'Entre amigos' },
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
