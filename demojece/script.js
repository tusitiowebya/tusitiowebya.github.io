// ===== JECETvDirect - script.js =====

// --- Navbar scroll effect ---
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Mobile menu toggle ---
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', !isOpen);
  // Swap icon
  mobileToggle.innerHTML = isOpen
    ? '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
    : '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileToggle.innerHTML = '<svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    mobileToggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Intersection Observer for scroll animations ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.fade-up, .fade-scale').forEach(el => {
  observer.observe(el);
});

// --- Staggered card animations ---
document.querySelectorAll('.channel-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 100}ms`;
});

document.querySelectorAll('.why-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 150}ms`;
});

// --- Contact form submission ---
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const message = encodeURIComponent(
    `Hola! Mi nombre es ${nombre} y mi telefono es ${telefono}. Quiero mas informacion sobre JECETvDirect.`
  );
  window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
});

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
