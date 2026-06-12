// ============================================================
// MEG ÉLECTRIC · script.js
// ============================================================

// Año dinámico
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú mobile
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const navClose = document.getElementById('navClose');
if (toggle && mobile) {
  const openMenu = () => { mobile.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobile.classList.remove('open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) closeMenu();
  });
}

// Fade-up con stagger
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    const i = siblings.indexOf(el);
    el.style.transitionDelay = (i * 65) + 'ms';
    el.classList.add('vis');
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fu').forEach(el => io.observe(el));

// Contador animado de estadísticas / métricas
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animateCount = (el) => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const dur = 1300;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
};
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countIO.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => countIO.observe(el));
