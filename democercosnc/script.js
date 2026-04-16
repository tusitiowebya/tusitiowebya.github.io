// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all section headers and cards
document.querySelectorAll('.section-header, .benefit-card, .gallery-item, .step, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Gallery hover effect enhancement
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.querySelector('.gallery-overlay').style.opacity = '1';
  });
  
  item.addEventListener('mouseleave', function() {
    this.querySelector('.gallery-overlay').style.opacity = '0';
  });
});

// WhatsApp button pulse animation on scroll
let lastScrollTop = 0;
const whatsappBtn = document.querySelector('.whatsapp-sticky');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 500) {
    // Scrolling down
    whatsappBtn.style.transform = 'scale(1.1)';
  } else {
    whatsappBtn.style.transform = 'scale(1)';
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });

// Add loading animation on page load
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  
  // Animate hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }
});

// Initialize page with hidden state for animations
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';

const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(20px)';
  heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
}
