const WHATSAPP = 'https://wa.me/5493884211866';
const INSTAGRAM = 'https://www.instagram.com/mdfmuebles/';

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── Mobile menu ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose && mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const target = document.getElementById(el.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── Intersection Observer for reveal animations ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* ─── WhatsApp / Instagram links ─── */
document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = WHATSAPP;
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});

document.querySelectorAll('[data-ig]').forEach(el => {
  el.href = INSTAGRAM;
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});

/* ─── Carousel ─── */
(function() {
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      stopAuto();
      startAuto();
    });
  });

  startAuto();
})();

/* ─── Footer year ─── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
