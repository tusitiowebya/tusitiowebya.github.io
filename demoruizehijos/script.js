// Ruiz e Hijos — Techistas · script.js

document.getElementById('yr').textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// Menú mobile
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// Fade-up con stagger por hermanos
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const sib = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    el.style.transitionDelay = (sib.indexOf(el) * 70) + 'ms';
    el.classList.add('in');
    io.unobserve(el);
  });
}, { threshold:0.12, rootMargin:'0px 0px -60px 0px' });
document.querySelectorAll('.fu').forEach(el => io.observe(el));

// Anatomía: dibujar las 5 capas del techo al entrar en viewport
const anatRoof = document.querySelector('.anat-roof');
if (anatRoof) {
  const anatIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { anatRoof.classList.add('drawn'); anatIO.unobserve(e.target); }
    });
  }, { threshold:0.4 });
  anatIO.observe(anatRoof);
}

// Hero parallax suave
const hv = document.querySelector('.hero-video');
const hc = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    if (hv) hv.style.transform = `translateY(${y * 0.16}px) scale(1.05)`;
    if (hc) { hc.style.transform = `translateY(${y * 0.05}px)`; hc.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.8)); }
  }
}, { passive:true });
