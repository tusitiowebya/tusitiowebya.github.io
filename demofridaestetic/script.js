/* ══ NAVBAR ══ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ══ MOBILE MENU ══ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ══ GALLERY MODAL ══ */
const galImages = [
  { src: 'https://images.pexels.com/photos/7446869/pexels-photo-7446869.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'HIFU Facial' },
  { src: 'https://images.pexels.com/photos/4264902/pexels-photo-4264902.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Tratamiento de piel' },
  { src: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Liposonix' },
  { src: 'https://images.pexels.com/photos/7423553/pexels-photo-7423553.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Tratamiento facial profesional' },
  { src: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Limpieza facial profunda' },
  { src: 'https://images.pexels.com/photos/8204101/pexels-photo-8204101.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Masaje facial' },
  { src: 'https://images.pexels.com/photos/4267991/pexels-photo-4267991.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Sesión facial completa' },
  { src: 'https://images.pexels.com/photos/4824009/pexels-photo-4824009.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Tratamiento cosmetológico profesional' },
];

const modal    = document.getElementById('modal');
const backdrop = document.getElementById('modalBackdrop');
const modalImg = document.getElementById('modalImg');
const modalCap = document.getElementById('modalCaption');
let currentIdx = 0;

function openModal(idx) {
  currentIdx = idx;
  const { src, caption } = galImages[idx];
  modalImg.src = src;
  modalImg.alt = caption;
  modalCap.textContent = caption;
  modal.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIdx = (currentIdx + dir + galImages.length) % galImages.length;
  const { src, caption } = galImages[currentIdx];
  modalImg.src = src;
  modalImg.alt = caption;
  modalCap.textContent = caption;
}

document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => openModal(+item.dataset.index));
});

document.getElementById('modalClose').addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.getElementById('modalPrev').addEventListener('click', () => navigate(-1));
document.getElementById('modalNext').addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

/* ══ SCROLL FADE-IN ══ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.trat-card, .gal-item, .testi-card, .tec-feat, .nos-valor, .strip-item'
).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});
