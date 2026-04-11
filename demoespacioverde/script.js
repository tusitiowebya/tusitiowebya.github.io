// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.getElementById('header');

function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
const menuIcon = menuToggle.querySelector('.menu-icon');
const closeIcon = menuToggle.querySelector('.close-icon');

menuToggle.addEventListener('click', () => {
  const isOpen = !navMobile.classList.contains('hidden');
  
  if (isOpen) {
    navMobile.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  } else {
    navMobile.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  }
});

// Close mobile menu when clicking a link
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

// ========================================
// CONTACT FORM - WHATSAPP REDIRECT
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const mensaje = document.getElementById('mensaje').value;
  
  const whatsappMessage = `Hola! Mi nombre es ${nombre}. Mi teléfono es ${telefono}. ${mensaje}`;
  const whatsappUrl = `https://wa.me/5491144061222?text=${encodeURIComponent(whatsappMessage)}`;
  
  window.open(whatsappUrl, '_blank');
});

// ========================================
// WHATSAPP FLOATING BUTTON
// ========================================
const whatsappContainer = document.getElementById('whatsappContainer');
const whatsappTooltip = document.getElementById('whatsappTooltip');
const tooltipClose = document.getElementById('tooltipClose');

// Show WhatsApp button after delay
setTimeout(() => {
  whatsappContainer.classList.add('visible');
}, 2000);

// Show tooltip after longer delay
setTimeout(() => {
  whatsappTooltip.classList.remove('hidden');
}, 5000);

// Close tooltip
tooltipClose.addEventListener('click', () => {
  whatsappTooltip.classList.add('hidden');
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
function handleScrollAnimations() {
  const elements = document.querySelectorAll('.benefit-card, .product-card, .contact-card, .instagram-card');
  
  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.85;
    
    if (isVisible) {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}

// Set initial state for animated elements
document.querySelectorAll('.benefit-card, .product-card, .contact-card, .instagram-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease';
});

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ========================================
// PARALLAX EFFECT FOR HERO BLOBS
// ========================================
function handleParallax() {
  const scrollY = window.scrollY;
  const blobs = document.querySelectorAll('.hero-blob');
  
  blobs.forEach((blob, index) => {
    const speed = 0.1 + (index * 0.05);
    blob.style.transform = `translateY(${scrollY * speed}px)`;
  });
  
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    const speed = 0.15 + (index * 0.05);
    card.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

window.addEventListener('scroll', handleParallax);

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// INTERSECTION OBSERVER FOR SECTIONS
// ========================================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section-header, .section-title, .section-subtitle').forEach(el => {
  el.classList.add('fade-in-view');
  sectionObserver.observe(el);
});

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('[Papelera Espacio Verde] Website loaded successfully!');
