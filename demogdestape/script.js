// GDestape — script.js

document.getElementById('yr').textContent = new Date().getFullYear();

// Reloj LiveBar (hora Buenos Aires)
const lbTime = document.getElementById('lbTime');
if (lbTime) {
  const tick = () => {
    const d = new Date();
    const opts = { timeZone:'America/Argentina/Buenos_Aires', hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' };
    lbTime.textContent = new Intl.DateTimeFormat('es-AR', opts).format(d) + ' AR';
  };
  tick(); setInterval(tick, 1000);
}

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// Mobile menu
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

// Fade-up stagger
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    el.style.transitionDelay = (siblings.indexOf(el) * 65) + 'ms';
    el.classList.add('in');
    io.unobserve(el);
  });
}, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });
document.querySelectorAll('.fu').forEach(el => io.observe(el));

// Hero parallax
const hv = document.querySelector('.hero-video');
const hc = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    if (hv) hv.style.transform = `translateY(${y * 0.16}px) scale(1.04)`;
    if (hc) {
      hc.style.transform = `translateY(${y * 0.06}px)`;
      hc.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.75));
    }
  }
}, { passive:true });
