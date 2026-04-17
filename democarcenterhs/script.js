// ===== Header Scroll Effect =====
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // Check on load

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');

mobileMenuBtn.addEventListener('click', function() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  
  if (isOpen) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    mobileMenuBtn.classList.remove('active');
  } else {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('show');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    mobileMenuBtn.classList.add('active');
  }
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    mobileMenuBtn.classList.remove('active');
  });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Add animation to cards
const animatedElements = document.querySelectorAll('.promo-card, .service-card, .reason-item, .testimonial-card, .info-item');

animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== Add staggered animation delay to grid items =====
const promoCards = document.querySelectorAll('.promo-card');
promoCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.15}s`;
});

const reasonItems = document.querySelectorAll('.reason-item');
reasonItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.1}s`;
});

const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.15}s`;
});

// ===== Current Year for Copyright (if needed) =====
// const currentYear = new Date().getFullYear();
// Update copyright year if dynamic element exists
