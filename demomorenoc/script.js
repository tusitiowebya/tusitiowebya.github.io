// Año dinámico
document.getElementById('yr').textContent = new Date().getFullYear();

// ══ NAVBAR SCROLL ══
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ══ HERO VIDEO PARALLAX ══
const heroVideo = document.querySelector('.hero-video');
window.addEventListener('scroll', () => {
  if (heroVideo && window.scrollY < window.innerHeight) {
    heroVideo.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

// ══ MOBILE NAV ══
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ══ FADE-UP OBSERVER ══
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ══ COUNTER ANIMATION ══
function animateCounter(el, target, duration) {
  const start    = 0;
  const step     = (timestamp, startTime) => {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(ts => step(ts, startTime));
    else el.textContent = target;
  };
  requestAnimationFrame(ts => step(ts, ts));
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    animateCounter(el, target, 1800);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ══ GALLERY LIGHTBOX ══
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lbImg');
const lbClose    = document.getElementById('lbClose');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lbImg.src    = galleryItems[index].dataset.src;
  lbImg.alt    = galleryItems[index].dataset.alt || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  lbImg.src    = galleryItems[currentIndex].dataset.src;
  lbImg.alt    = galleryItems[currentIndex].dataset.alt || '';
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  lbImg.src    = galleryItems[currentIndex].dataset.src;
  lbImg.alt    = galleryItems[currentIndex].dataset.alt || '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
lbNext.addEventListener('click', e => { e.stopPropagation(); showNext(); });

lightbox.addEventListener('click', e => {
  if (e.target === lightbox || e.target === lbImg.parentElement) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// ══ SMOOTH SCROLL ══
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
