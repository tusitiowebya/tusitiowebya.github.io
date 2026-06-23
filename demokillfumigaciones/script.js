// ============================================================
// KILLFUMIGACIONES · script.js
// ============================================================

// Año dinámico
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú mobile
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const navClose = document.getElementById('navClose');
if (toggle && mobile) {
  const open = () => { mobile.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobile.classList.remove('open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', open);
  if (navClose) navClose.addEventListener('click', close);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) close();
  });
}

// Fade-up con stagger por hermanos
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
