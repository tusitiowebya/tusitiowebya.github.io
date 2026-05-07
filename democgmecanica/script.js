// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    const target = el.getAttribute('href') || el.getAttribute('data-scroll');
    if (target && target.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(target);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      document.getElementById('mobileMenu').classList.remove('open');
    }
  });
});

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(5,10,18,0.92)';
  } else {
    nav.style.background = 'rgba(5,10,18,0.65)';
  }
});

// ─── ACTIVE NAV LINK HIGHLIGHT ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = '#00e5ff';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ─── STAGGERED CARD ANIMATION ─────────────────────────────────────────────────
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.service-card, .why-card, .testimonial-card, .gallery-item');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.services-grid, .why-grid, .testimonials-grid, .gallery-grid').forEach(grid => {
  grid.querySelectorAll('.service-card, .why-card, .testimonial-card, .gallery-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });
  staggerObserver.observe(grid);
});
