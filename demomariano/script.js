/* ============================================================
   TAPIZADOS MARIANO — script.js
   ============================================================ */

/* ---------- NAVBAR ---------- */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', function () {
  const open = navMobile.classList.toggle('open');
  const spans = this.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- FADE-UP ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(
      '.serv-grid, .ba-grid, .ben-grid, .emp-list, .gal-grid, ' +
      '.proc-grid, .faq-list, .cta-final-inner, .hero-content, .emp-text'
    );
    const delay = parent
      ? Array.from(parent.children).indexOf(entry.target) * 70
      : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8,
      behavior: 'smooth'
    });
  });
});

/* ---------- HERO PARALLAX ---------- */
const heroVid = document.querySelector('.hero-video');
if (heroVid) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroVid.style.transform = `translateY(${window.scrollY * 0.14}px)`;
    }
  }, { passive: true });
}

/* ---------- ANTES / DESPUÉS — slider comparativo ---------- */
document.querySelectorAll('.ba-compare').forEach(box => {
  const setPos = (pct) => {
    pct = Math.max(0, Math.min(100, pct));
    box.style.setProperty('--pos', pct + '%');
  };
  setPos(50);

  let dragging = false;
  const onMove = (clientX) => {
    if (!dragging) return;
    const rect = box.getBoundingClientRect();
    const x = clientX - rect.left;
    setPos((x / rect.width) * 100);
  };

  box.addEventListener('mousedown',  e => { dragging = true; onMove(e.clientX); });
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup',   () => dragging = false);

  box.addEventListener('touchstart', e => { dragging = true; onMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend',  () => dragging = false);
});

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
const giItems  = Array.from(document.querySelectorAll('.gi'));
let lbIndex    = 0;

function openLb(i) {
  lbIndex = i;
  lbImg.src = giItems[i].dataset.src || giItems[i].querySelector('img').src;
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

/* ---------- AÑO FOOTER ---------- */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
