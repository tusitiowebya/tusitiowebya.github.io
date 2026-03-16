// ==================== //
// Mobile Menu Toggle
// ==================== //
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
  
  // Change icon
  const icon = mobileMenuBtn.querySelector('svg');
  if (mobileNav.classList.contains('active')) {
    icon.innerHTML = '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>';
  } else {
    icon.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
  }
});

// Close mobile menu when clicking a link
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('svg');
    icon.innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
  });
});

// ==================== //
// Header Scroll Effect
// ==================== //
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ==================== //
// Smooth Scroll for Anchor Links
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
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

// ==================== //
// FAQ Accordion
// ==================== //
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    // Close all other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  });
});

// ==================== //
// Appointment Form
// ==================== //
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(appointmentForm);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const petType = formData.get('petType');
  const service = formData.get('service');
  const message = formData.get('message') || 'Sin mensaje adicional';
  
  const whatsappMessage = `Hola! Quiero reservar un turno.

*Nombre:* ${name}
*Teléfono:* ${phone}
*Tipo de mascota:* ${petType}
*Servicio:* ${service}
*Mensaje:* ${message}`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/5492976238410?text=${encodedMessage}`, '_blank');
});

// ==================== //
// Intersection Observer for Animations
// ==================== //
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ==================== //
// Service Cards Hover Effect (Touch Devices)
// ==================== //
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('touchstart', function() {
    this.classList.add('hover');
  });
  
  card.addEventListener('touchend', function() {
    this.classList.remove('hover');
  });
});

// ==================== //
// Gallery Lightbox (Simple version)
// ==================== //
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.querySelector('img').src;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="${imgSrc}" alt="Gallery image">
        <button class="lightbox-close">&times;</button>
      </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 1rem;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
      position: absolute;
      top: -1rem;
      right: -1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    const closeLightbox = () => {
      lightbox.remove();
      document.body.style.overflow = '';
    };
    
    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', escHandler);
      }
    });
  });
});

// Add fadeIn animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(fadeInStyle);

// ==================== //
// Current Year for Footer
// ==================== //
const yearElements = document.querySelectorAll('.current-year');
const currentYear = new Date().getFullYear();
yearElements.forEach(el => {
  el.textContent = currentYear;
});

// ==================== //
// Prevent form resubmission on page refresh
// ==================== //
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// ==================== //
// Console Welcome Message
// ==================== //
console.log('%c🐾 Veterinaria Martin', 'font-size: 24px; font-weight: bold; color: #14b8a6;');
console.log('%cCuidamos a tu mascota como parte de nuestra familia', 'font-size: 14px; color: #5f9ea0;');
console.log('%c📍 Av. Cap. Fragata Moyano 2427, Rada Tilly, Chubut', 'font-size: 12px; color: #888;');
console.log('%c📱 WhatsApp: +54 9 2976 238410', 'font-size: 12px; color: #888;');
