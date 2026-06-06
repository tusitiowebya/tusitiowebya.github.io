/* ══ NAVBAR SCROLL ══ */
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
  { src: 'https://images.pexels.com/photos/4958639/pexels-photo-4958639.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Tabla de fiambres gourmet' },
  { src: 'https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Picada premium' },
  { src: 'https://images.pexels.com/photos/5961962/pexels-photo-5961962.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Catering para eventos' },
  { src: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Pernil para eventos' },
  { src: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Platos gourmet' },
  { src: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Appetizers y canapés' },
  { src: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Mesa de evento' },
  { src: 'https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Bocaditos finos' },
  { src: 'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Buffet completo' },
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

document.querySelectorAll('.galeria-item').forEach(item => {
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

/* ══ INTERSECTION OBSERVER — fade-in ══ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.servicio-card, .galeria-item, .testi-card, .esp-card, .premium-list li').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
