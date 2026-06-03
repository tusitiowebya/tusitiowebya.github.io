// Nico Tour — script.js

// Año dinámico
document.getElementById('yr').textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// Mobile toggle
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Fade-up con IntersectionObserver, stagger por hermanos
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
      const i = siblings.indexOf(el);
      el.style.transitionDelay = (i * 70) + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fu').forEach(el => io.observe(el));

// Hero parallax
const heroVideo = document.querySelector('.hero-video');
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight && heroVideo) {
    heroVideo.style.transform = `translateY(${y * 0.18}px) scale(1.04)`;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.08}px)`;
    if (heroContent) heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
  }
}, { passive:true });
