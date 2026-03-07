// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');
const contactForm = document.getElementById('contact-form');
const yearSpan = document.getElementById('year');

// ===== Gallery Images Data =====
const galleryImages = [
  { src: 'images/gallery-1.jpg', alt: 'Cielorraso moderno con iluminación empotrada' },
  { src: 'images/gallery-2.jpg', alt: 'Pared divisoria en espacio moderno' },
  { src: 'images/gallery-3.jpg', alt: 'Revestimiento de pared profesional' },
  { src: 'images/gallery-4.jpg', alt: 'Instalación comercial de Durlock' },
  { src: 'images/gallery-5.jpg', alt: 'Cielorraso elegante en living' },
  { src: 'images/gallery-6.jpg', alt: 'Renovación con Durlock' }
];

// ===== Navbar Scroll Effect =====
function handleScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // Initial check

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  
  if (isOpen) {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  } else {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

// ===== Gallery Lightbox =====
function openLightbox(index) {
  const image = galleryImages[index];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = parseInt(item.dataset.index);
    openLightbox(index);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
    closeLightbox();
  }
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const mensaje = document.getElementById('mensaje').value;
  
  const whatsappMessage = `Hola! Mi nombre es ${nombre}. ${mensaje}. Mi teléfono es ${telefono}.`;
  const whatsappUrl = `https://wa.me/5491100000000?text=${encodeURIComponent(whatsappMessage)}`;
  
  window.open(whatsappUrl, '_blank');
});

// ===== Year in Footer =====
yearSpan.textContent = new Date().getFullYear();

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
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

// Animate elements on scroll
document.querySelectorAll('.service-card, .benefit-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
