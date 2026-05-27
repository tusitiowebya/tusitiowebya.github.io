/* ============================================================
   LO DE MARTÍN — script.js
   ============================================================ */

/* ---------- TOP BAR SCROLL + TOGGLE ---------- */
const topbar   = document.getElementById('topbar');
const tbToggle = document.getElementById('tbToggle');
const tbNav    = document.getElementById('tbNav');

window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

tbToggle.addEventListener('click', function () {
  const open = tbNav.classList.toggle('open');
  this.classList.toggle('open', open);
  const spans = this.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.addEventListener('click', e => {
  if (!tbNav.contains(e.target) && !tbToggle.contains(e.target)) {
    tbNav.classList.remove('open');
    tbToggle.classList.remove('open');
    tbToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

tbNav.querySelectorAll('.tb-link, .tb-wa').forEach(link => {
  link.addEventListener('click', () => {
    tbNav.classList.remove('open');
    tbToggle.classList.remove('open');
    tbToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- FADE-UP ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest('.vitrina-strip, .galeria-mosaic, .calidad-checks, .pagos-grid, .faq-cols, .info-grid');
    const delay  = parent
      ? Array.from(parent.children).indexOf(entry.target) * 80
      : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  if (!target) return;
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const t = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(t);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const numerosObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCount);
      numerosObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const numerosEl = document.querySelector('.numeros-inner');
if (numerosEl) numerosObs.observe(numerosEl);

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
const gmItems  = Array.from(document.querySelectorAll('.gm-item'));
let lbIndex    = 0;

function openLb(index) {
  lbIndex = index;
  const src = gmItems[index].dataset.src || gmItems[index].querySelector('img').src;
  lbImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function prevLb() { openLb((lbIndex - 1 + gmItems.length) % gmItems.length); }
function nextLb() { openLb((lbIndex + 1) % gmItems.length); }

gmItems.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
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
    const offset = topbar.offsetHeight + 12;
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
      heroVid.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });
}
