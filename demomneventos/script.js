// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const testimonialsSlider = document.getElementById('testimonials-slider');
const testimonialsDots = document.getElementById('testimonials-dots');
const contactForm = document.getElementById('contact-form');

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.aosDelay || 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, delay);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  animationObserver.observe(el);
});

// ===== Animated Counters =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.dataset.target);
      animateCounter(counter, target);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

function animateCounter(element, target) {
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, duration / steps);
}

document.querySelectorAll('.stat-number').forEach(counter => {
  counterObserver.observe(counter);
});

// ===== Gallery Lightbox =====
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== Testimonials Slider =====
const testimonialSlides = testimonialsSlider.querySelectorAll('.testimonial-slide');
let currentSlide = 0;
let slideInterval;

function initTestimonials() {
  // Create dots
  testimonialSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ver testimonio ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    testimonialsDots.appendChild(dot);
  });
  
  // Show first slide
  testimonialSlides[0].classList.add('active');
  
  // Start auto-play
  startSlideshow();
}

function goToSlide(index) {
  testimonialSlides[currentSlide].classList.remove('active');
  testimonialsDots.children[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  testimonialSlides[currentSlide].classList.add('active');
  testimonialsDots.children[currentSlide].classList.add('active');
  
  // Reset interval
  clearInterval(slideInterval);
  startSlideshow();
}

function nextSlide() {
  const next = (currentSlide + 1) % testimonialSlides.length;
  goToSlide(next);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000);
}

initTestimonials();

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  console.log('Formulario enviado:', data);
  
  // Show success message
  alert('Gracias por tu mensaje! Te contactaremos pronto.');
  
  // Reset form
  contactForm.reset();
});

// ===== Parallax Effect on Hero Blobs =====
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  const blobs = document.querySelectorAll('.hero-blob');
  
  blobs.forEach((blob, index) => {
    const speed = (index + 1) * 0.1;
    blob.style.transform = `translateY(${scrollY * speed}px)`;
  });
  
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to body for initial animations
  document.body.classList.add('loaded');
  
  // Trigger hero animations
  document.querySelectorAll('.animate-slide-up').forEach((el, index) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity = '1';
    }, 100 + (index * 200));
  });
});

// ===== Performance: Debounce scroll events =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounced scroll handler for non-critical updates
const debouncedScroll = debounce(() => {
  // Any additional scroll-based updates can go here
}, 100);

window.addEventListener('scroll', debouncedScroll);
