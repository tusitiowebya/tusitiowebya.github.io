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

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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

// ===== Gallery Lightbox =====
const cars = [
  { src: 'images/cauto4.jpeg', title: 'Camión Ligero', category: 'Carga' },
  { src: 'images/car-suv.jpg', title: 'SUV Familiar', category: 'SUV' },
  { src: 'images/car-hatchback.jpg', title: 'Hatchback Deportivo', category: 'Hatchback' },
  { src: 'images/auto1.jpeg', title: 'Camioneta Nissan', category: 'SUV' },
  { src: 'images/car-pickup.jpg', title: 'Pickup Robusta', category: 'Pickup' },
  { src: 'images/auto3.jpeg', title: 'Compacto', category: 'SUV' }
];

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
let currentIndex = 0;

// Open lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function() {
    currentIndex = parseInt(this.dataset.index);
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Navigate lightbox
document.querySelector('.lightbox-prev').addEventListener('click', function(e) {
  e.stopPropagation();
  currentIndex = currentIndex === 0 ? cars.length - 1 : currentIndex - 1;
  updateLightbox();
});

document.querySelector('.lightbox-next').addEventListener('click', function(e) {
  e.stopPropagation();
  currentIndex = currentIndex === cars.length - 1 ? 0 : currentIndex + 1;
  updateLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentIndex = currentIndex === 0 ? cars.length - 1 : currentIndex - 1;
    updateLightbox();
  }
  if (e.key === 'ArrowRight') {
    currentIndex = currentIndex === cars.length - 1 ? 0 : currentIndex + 1;
    updateLightbox();
  }
});

function updateLightbox() {
  const car = cars[currentIndex];
  lightboxImage.src = car.src;
  lightboxImage.alt = car.title;
  lightboxTitle.textContent = car.title;
  lightboxCategory.textContent = car.category;
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;
  
  const whatsappMessage = `Hola! Soy ${name}. ${message ? message + '. ' : ''}Mi teléfono es ${phone}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  window.open(`https://wa.me/5411140339022?text=${encodedMessage}`, '_blank');
});

// ===== Update Current Year in Footer =====
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===== Mobile Menu Button (basic toggle for future use) =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

mobileMenuBtn.addEventListener('click', function() {
  this.classList.toggle('active');
  // Add mobile menu functionality here if needed
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

// Observe elements for animation
document.querySelectorAll('.step-card, .benefit-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
