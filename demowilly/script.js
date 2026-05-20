// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');
const menuIcon = document.getElementById('icon-menu');
const closeIcon = document.getElementById('icon-close');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navMobile.classList.toggle('open', menuOpen);
  menuIcon.style.display = menuOpen ? 'none' : 'block';
  closeIcon.style.display = menuOpen ? 'block' : 'none';
});

// Close mobile menu on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    navMobile.classList.remove('open');
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  });
});

// ===== SCROLL ANIMATIONS =====
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// Staggered children animation
function initStaggered() {
  const groups = document.querySelectorAll('[data-stagger]');
  groups.forEach(group => {
    const children = group.children;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(group);
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const galleryItems = document.querySelectorAll('.gallery-item');
let currentIndex = 0;

const images = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
  lightboxCaption.textContent = `${images[currentIndex].alt} — ${currentIndex + 1} / ${images.length}`;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }
});

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('f-nombre').value;
  const retiro = document.getElementById('f-retiro').value;
  const entrega = document.getElementById('f-entrega').value;
  const mensaje = document.getElementById('f-mensaje').value;
  const msg = `Hola Willy! Soy ${nombre}.\nRetiro: ${retiro}\nEntrega: ${entrega}\nMensaje: ${mensaje}`;
  window.open(`https://wa.me/5491100000000?text=${encodeURIComponent(msg)}`, '_blank');
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFadeIn();
  initStaggered();
});
