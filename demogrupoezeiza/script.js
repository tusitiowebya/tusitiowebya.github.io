// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('active');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
  }
}

// Open WhatsApp
function openWhatsApp() {
  window.open('https://wa.me/5491112345678', '_blank');
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Here you would typically send the data to a server
  console.log('Form data:', data);
  
  // Create WhatsApp message
  const message = `Hola! Me contacto desde la web.
Nombre: ${data.nombre}
Teléfono: ${data.telefono}
Email: ${data.email}
Servicio: ${data.servicio}
Mensaje: ${data.mensaje}`;
  
  const whatsappUrl = `https://wa.me/5491112345678?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  
  // Reset form
  event.target.reset();
  
  // Show success message
  alert('¡Gracias por tu consulta! Te contactaremos pronto.');
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all service cards and gallery items
document.addEventListener('DOMContentLoaded', function() {
  const animateElements = document.querySelectorAll('.service-card, .gallery-item, .feature-item');
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    hero.style.backgroundPositionY = -(scrolled * parallaxSpeed) + 'px';
  }
});
