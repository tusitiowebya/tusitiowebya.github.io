/* ============================================================
   SAN LORENZO SEDE FLORENCIO VARELA — script.js
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

/* ---------- PARTICLES (azul + rojo) ---------- */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#C71F2D', '#FFFFFF', '#122B6D', '#A30014'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';
    p.style.left   = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 9 + 7) + 's';
    p.style.animationDelay    = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
})();

/* ---------- FADE-UP ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(
      '.conv-points, .ben-grid, .act-items, .gal-grid, .test-grid, ' +
      '.faq-list, .cta-final-inner, .hero-content, .conv-text, ' +
      '.act-visual, .loc-grid'
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
      heroVid.style.transform = `translateY(${window.scrollY * 0.16}px)`;
    }
  }, { passive: true });
}

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- GALLERY FILTERS ---------- */
const filterBtns  = document.querySelectorAll('.gal-filter');
const galMasonry  = document.getElementById('galMasonry');
const gmItems     = Array.from(document.querySelectorAll('.gm-item'));

// Contenedor oculto fuera del flujo para guardar items filtrados
const galBench = document.createElement('div');
galBench.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
document.body.appendChild(galBench);

function applyFilter(filter) {
  // Fade out
  galMasonry.style.opacity = '0';
  galMasonry.style.transition = 'opacity .2s ease';

  setTimeout(() => {
    gmItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      if (match) {
        if (!galMasonry.contains(item)) galMasonry.appendChild(item);
      } else {
        if (!galBench.contains(item)) galBench.appendChild(item);
      }
    });
    // Fade in
    galMasonry.style.opacity = '1';
  }, 200);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

/* ---------- GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
let lbIndex    = 0;

function getVisible() {
  return gmItems.filter(i => !i.classList.contains('hidden'));
}

function openLb(i) {
  const visible = getVisible();
  lbIndex = i;
  const item = visible[i];
  lbImg.src = '';
  lbImg.style.opacity = '0';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  const src = item.dataset.src || item.querySelector('img').src;
  const tmp = new Image();
  tmp.onload = () => { lbImg.src = src; lbImg.style.opacity = '1'; };
  tmp.src = src;
}
function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function prevLb() {
  const v = getVisible();
  openLb((lbIndex - 1 + v.length) % v.length);
}
function nextLb() {
  const v = getVisible();
  openLb((lbIndex + 1) % v.length);
}

gmItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = getVisible();
    const vi = visible.indexOf(item);
    if (vi >= 0) openLb(vi);
  });
});
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
