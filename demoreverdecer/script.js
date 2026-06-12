// ============================================================
// REVERDECER COUNSELING — Celeste Santillán · script.js
// ============================================================

// Año dinámico en footer
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

// Fade-up con stagger por hermanos
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    const i = siblings.indexOf(el);
    el.style.transitionDelay = (i * 70) + 'ms';
    el.classList.add('vis');
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fu').forEach(el => io.observe(el));

// Tallo del brote — se "dibuja" al entrar en viewport
const branchLine = document.querySelector('.branch-line');
if (branchLine) {
  const branchIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        branchLine.classList.add('drawn');
        branchIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  branchIO.observe(document.querySelector('.branch-stage') || branchLine);
}

// SVG hero — paraguas que sube + sol que aparece cuando el hero termina de entrar
const heroArt = document.querySelector('.hero-art');
if (heroArt) {
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sun = heroArt.querySelector('.sun');
        const sprout = heroArt.querySelector('.sprout');
        const stem = heroArt.querySelector('.stem');
        if (sun) {
          sun.style.transition = 'opacity 2.2s ease 1.2s';
          sun.style.opacity = '.95';
        }
        if (sprout) {
          sprout.style.transformOrigin = '180px 460px';
          sprout.style.transform = 'scaleY(.2)';
          sprout.style.transition = 'transform 2s cubic-bezier(.2,.7,.3,1) .6s';
          requestAnimationFrame(() => {
            sprout.style.transform = 'scaleY(1)';
          });
        }
        heroIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  heroIO.observe(heroArt);
}
