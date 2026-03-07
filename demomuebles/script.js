// TheMuebles - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Constants
  const WHATSAPP_NUMBER = '541132956863';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconMenu = mobileMenuBtn.querySelector('.icon-menu');
  const iconClose = mobileMenuBtn.querySelector('.icon-close');
  const appointmentForm = document.getElementById('appointmentForm');
  const faqItems = document.querySelectorAll('.faq-item');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Navbar scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      iconMenu.classList.remove('hidden');
      iconClose.classList.add('hidden');
    } else {
      mobileMenu.classList.remove('hidden');
      iconMenu.classList.add('hidden');
      iconClose.classList.remove('hidden');
    }
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking a link
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      iconMenu.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Appointment form submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value;
      const telefono = document.getElementById('telefono').value;
      const tipoMueble = document.getElementById('tipoMueble').value;
      const dia = document.getElementById('dia').value;
      const mensaje = document.getElementById('mensaje').value;

      let whatsappMessage = 'Hola, quiero programar una cita para ver muebles.';
      whatsappMessage += '%0A%0ANombre: ' + encodeURIComponent(nombre);
      whatsappMessage += '%0ATeléfono: ' + encodeURIComponent(telefono);
      whatsappMessage += '%0ATipo de mueble: ' + encodeURIComponent(tipoMueble);
      
      if (dia) {
        whatsappMessage += '%0ADía preferido: ' + encodeURIComponent(dia);
      }
      
      if (mensaje) {
        whatsappMessage += '%0AMensaje: ' + encodeURIComponent(mensaje);
      }

      window.open(WHATSAPP_LINK + '?text=' + whatsappMessage, '_blank');
    });
  }

  // FAQ Accordion
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(function(otherItem) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.service-card, .product-card, .step-item, .testimonial-card, .faq-item');
  animateElements.forEach(function(el) {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Product card hover effect enhancement
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Gallery hover effect
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });

  // Active nav link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);
});
