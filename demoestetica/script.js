// ===== Testimonials Data =====
const testimonials = [
  {
    name: "María García",
    role: "Paciente de Rehabilitación",
    content: "Después de meses de dolor crónico en la espalda, Solange me devolvió la calidad de vida. Su profesionalismo y calidez humana hacen toda la diferencia.",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    role: "Paciente de Masajes Deportivos",
    content: "Como deportista, necesitaba una profesional que entendiera mis necesidades. Los masajes deportivos de Solange me ayudan a mantenerme en forma y prevenir lesiones.",
    rating: 5
  },
  {
    name: "Laura Fernández",
    role: "Paciente de Reiki",
    content: "Las sesiones de Reiki con Solange fueron transformadoras. Encontré paz interior y alivio a síntomas que arrastraba hace años. Totalmente recomendable.",
    rating: 5
  },
  {
    name: "Roberto Martínez",
    role: "Paciente de Fisioterapia",
    content: "Excelente profesional. Me recuperé de una lesión de hombro mucho más rápido de lo esperado gracias a su tratamiento integral y dedicación.",
    rating: 5
  },
  {
    name: "Ana Sánchez",
    role: "Paciente de Reflexología",
    content: "Solange tiene un don especial. Las sesiones de reflexología no solo me relajan, sino que me ayudan con problemas digestivos que tenía hace años.",
    rating: 5
  }
];

let currentTestimonialIndex = 0;

// ===== Initialize Testimonials =====
function initTestimonials() {
  const dotsContainer = document.getElementById('testimonials-dots');
  if (!dotsContainer) return;
  
  // Create dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
    dot.addEventListener('click', () => goToTestimonial(index));
    dotsContainer.appendChild(dot);
  });

  // Navigation buttons
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  
  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
}

function updateTestimonial() {
  const testimonial = testimonials[currentTestimonialIndex];
  
  const textEl = document.getElementById('testimonial-text');
  const nameEl = document.getElementById('testimonial-name');
  const roleEl = document.getElementById('testimonial-role');
  const avatarEl = document.getElementById('testimonial-avatar');
  
  if (textEl) textEl.textContent = `"${testimonial.content}"`;
  if (nameEl) nameEl.textContent = testimonial.name;
  if (roleEl) roleEl.textContent = testimonial.role;
  if (avatarEl) avatarEl.textContent = testimonial.name.charAt(0);
  
  // Update dots
  const dots = document.querySelectorAll('.testimonial-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentTestimonialIndex);
  });
}

function goToTestimonial(index) {
  currentTestimonialIndex = index;
  updateTestimonial();
}

function nextTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
  updateTestimonial();
}

function prevTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
  updateTestimonial();
}

// ===== FAQ Accordion =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    }
  });
}

// ===== Contact Form =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    const whatsappMessage = `Hola Solange, soy ${name}. ${message}. Mi email es ${email} y mi teléfono ${phone}.`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    window.open(`https://wa.me/5491155825883?text=${encodedMessage}`, '_blank');
  });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// ===== Navigation Scroll Effect =====
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  // Create mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = `
    <button class="mobile-menu-close" aria-label="Cerrar menú">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <a href="#sobre-mi">Sobre Mí</a>
    <a href="#servicios">Tratamientos</a>
    <a href="#testimonios">Testimonios</a>
    <a href="#contacto">Contacto</a>
  `;
  document.body.appendChild(mobileMenu);
  
  toggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== Set Current Year =====
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initTestimonials();
  initFAQ();
  initContactForm();
  initScrollReveal();
  initNavScroll();
  initSmoothScroll();
  initMobileMenu();
  setCurrentYear();
});

// ===== Auto-rotate Testimonials =====
setInterval(() => {
  nextTestimonial();
}, 8000);
