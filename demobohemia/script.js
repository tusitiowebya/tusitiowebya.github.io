// ===== Sticky Header on Scroll =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Mobile Navigation =====
const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const mobileNav = document.getElementById('mobileNav');

menuOpen.addEventListener('click', () => {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
});

menuClose.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
});

// Close mobile nav when clicking a link
mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Scroll Reveal Animation (IntersectionObserver) =====
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger the animations slightly for items in grids
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
  // Add staggered delay for grid children
  const parent = el.parentElement;
  if (parent && (
    parent.classList.contains('features-grid') ||
    parent.classList.contains('categories-grid') ||
    parent.classList.contains('instagram-grid')
  )) {
    const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
    const siblingIndex = siblings.indexOf(el);
    el.dataset.delay = siblingIndex * 100;
  }
  observer.observe(el);
});

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
