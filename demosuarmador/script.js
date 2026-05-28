/* ============================================================
   SU ARMADOR — script.js
   ============================================================ */

/* ---------- NAVBAR SCROLL + MOBILE TOGGLE ---------- */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', function () {
  const open = navMobile.classList.toggle('open');
  this.classList.toggle('open', open);
  const spans = this.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.addEventListener('click', e => {
  if (!navMobile.contains(e.target) && !navToggle.contains(e.target)) {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- FADE-UP ANIMATION ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(
      '.serv-list, .gal-grid, .proc-steps, .ben-cols, .redes-cards, .faq-list, .corp-inner, .redes-inner'
    );
    const delay = parent
      ? Array.from(parent.children).indexOf(entry.target) * 80
      : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- GALERÍA LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
const giItems  = Array.from(document.querySelectorAll('.gi'));
let lbIndex    = 0;

function openLb(index) {
  lbIndex = index;
  const src = giItems[index].dataset.src || giItems[index].querySelector('img').src;
  lbImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function prevLb() { openLb((lbIndex - 1 + giItems.length) % giItems.length); }
function nextLb() { openLb((lbIndex + 1) % giItems.length); }

giItems.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
lbClose.addEventListener('click', closeLb);
lbPrev.addEventListener('click', prevLb);
lbNext.addEventListener('click', nextLb);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLb();
  if (e.key === 'ArrowLeft')  prevLb();
  if (e.key === 'ArrowRight') nextLb();
});

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ---------- HERO VIDEO PARALLAX ---------- */
const heroVid = document.querySelector('.hero-video');
if (heroVid) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroVid.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });
}
