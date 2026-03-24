/**
 * Victoria Martínez Servicios Inmobiliarios
 * Landing Page JavaScript
 */

// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

// ===========================================
// Header Scroll Effect
// ===========================================
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // Initial check

// ===========================================
// Mobile Menu Toggle
// ===========================================
mobileMenuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  
  if (isOpen) {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.querySelector('.menu-icon').classList.remove('hidden');
    mobileMenuBtn.querySelector('.close-icon').classList.add('hidden');
  } else {
    mobileMenu.classList.remove('hidden');
    mobileMenuBtn.querySelector('.menu-icon').classList.add('hidden');
    mobileMenuBtn.querySelector('.close-icon').classList.remove('hidden');
  }
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.querySelector('.menu-icon').classList.remove('hidden');
    mobileMenuBtn.querySelector('.close-icon').classList.add('hidden');
  });
});

// ===========================================
// Image Modal
// ===========================================
function openModal(imageUrl) {
  modalImage.src = imageUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on background click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// ===========================================
// Business Hours - Highlight Today
// ===========================================
function highlightToday() {
  const today = new Date().getDay();
  const hoursRows = document.querySelectorAll('.hours-row');
  
  hoursRows.forEach(row => {
    const dayIndex = parseInt(row.dataset.day);
    if (dayIndex === today) {
      row.classList.add('today');
      const daySpan = row.querySelector('.hours-day');
      daySpan.innerHTML += '<span class="today-badge">Hoy</span>';
    }
  });
}

highlightToday();

// ===========================================
// Current Year in Footer
// ===========================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===========================================
// Smooth Scroll for Anchor Links
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    
    if (target) {
      e.preventDefault();
      
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===========================================
// Intersection Observer for Animations
// ===========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.property-card, .service-card, .testimonial-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ===========================================
// Lazy Loading Images
// ===========================================
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  document.querySelectorAll('img').forEach(img => {
    if (!img.closest('.hero-bg')) {
      img.loading = 'lazy';
    }
  });
} else {
  // Fallback for older browsers
  const lazyImages = document.querySelectorAll('img:not(.hero-img)');
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => lazyObserver.observe(img));
}
