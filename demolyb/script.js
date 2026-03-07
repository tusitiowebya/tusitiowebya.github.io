// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMobile = document.querySelector('.nav-mobile');
const iconMenu = document.querySelector('.icon-menu');
const iconClose = document.querySelector('.icon-close');

menuToggle.addEventListener('click', () => {
  const isOpen = !navMobile.classList.contains('hidden');
  
  if (isOpen) {
    navMobile.classList.add('hidden');
    iconMenu.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  } else {
    navMobile.classList.remove('hidden');
    iconMenu.classList.add('hidden');
    iconClose.classList.remove('hidden');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
  }
});

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.nav-mobile a');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.add('hidden');
    iconMenu.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const mensaje = document.getElementById('mensaje').value;
  
  const whatsappMessage = `Hola, soy ${nombre}. Mi teléfono es ${telefono}. ${mensaje}`;
  const whatsappUrl = `https://wa.me/541124522542?text=${encodeURIComponent(whatsappMessage)}`;
  
  window.open(whatsappUrl, '_blank');
});

// Smooth scroll for anchor links (fallback for older browsers)
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

// Header scroll effect (optional enhancement)
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});
