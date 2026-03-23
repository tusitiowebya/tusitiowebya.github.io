/**
 * TheGarrisonVinoteca - JavaScript
 * Premium Wine Shop Landing Page
 */

document.addEventListener('DOMContentLoaded', function() {
  // ========================================
  // Loader
  // ========================================
  const loader = document.getElementById('loader');
  
  setTimeout(function() {
    loader.classList.add('hidden');
  }, 2000);

  // ========================================
  // Navigation
  // ========================================
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  // Scroll behavior for navbar
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Check initial state

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
    const menuIcon = this.querySelector('.menu-icon');
    const closeIcon = this.querySelector('.close-icon');
    
    mobileMenu.classList.toggle('open');
    this.classList.toggle('active');
    
    if (mobileMenu.classList.contains('open')) {
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      this.setAttribute('aria-label', 'Cerrar menú');
    } else {
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      this.setAttribute('aria-label', 'Abrir menú');
    }
  });

  // Close mobile menu when clicking a link
  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.querySelector('.menu-icon').classList.remove('hidden');
      mobileMenuBtn.querySelector('.close-icon').classList.add('hidden');
    });
  });

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
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

  // ========================================
  // Reveal Animations on Scroll
  // ========================================
  const revealElements = document.querySelectorAll('.reveal, .fade-up');
  
  function revealOnScroll() {
    revealElements.forEach(function(element) {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      const delay = element.dataset.delay || 0;
      
      if (elementTop < window.innerHeight - elementVisible) {
        setTimeout(function() {
          element.classList.add('visible');
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check initial state

  // ========================================
  // Hero Animation on Load
  // ========================================
  const heroContent = document.querySelector('.hero-content');
  
  setTimeout(function() {
    if (heroContent) {
      heroContent.classList.add('visible');
    }
  }, 500);

  // ========================================
  // WhatsApp Floating Button
  // ========================================
  const whatsappFloat = document.getElementById('whatsapp-float');
  const whatsappTooltip = document.getElementById('whatsapp-tooltip');
  const closeTooltipBtn = document.getElementById('close-tooltip');

  // Show WhatsApp button after delay
  setTimeout(function() {
    whatsappFloat.classList.remove('hidden');
  }, 2500);

  // Show tooltip after longer delay
  setTimeout(function() {
    whatsappTooltip.classList.remove('hidden');
  }, 5000);

  // Close tooltip
  if (closeTooltipBtn) {
    closeTooltipBtn.addEventListener('click', function() {
      whatsappTooltip.classList.add('hidden');
    });
  }

  // ========================================
  // Footer Year
  // ========================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========================================
  // Parallax Effect (subtle)
  // ========================================
  const heroSection = document.querySelector('.hero');
  
  function handleParallax() {
    if (window.innerWidth > 768) {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-image');
      
      if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
  }

  window.addEventListener('scroll', handleParallax);

  // ========================================
  // Product Cards Hover Effect (touch devices)
  // ========================================
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(function(card) {
    card.addEventListener('touchstart', function() {
      // Remove active class from all cards
      productCards.forEach(function(c) {
        if (c !== card) {
          c.classList.remove('touch-active');
        }
      });
      // Toggle active class on current card
      this.classList.toggle('touch-active');
    });
  });

  // ========================================
  // Intersection Observer for Performance
  // ========================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ========================================
  // Accessibility: Reduce Motion
  // ========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ========================================
  // Console Greeting
  // ========================================
  console.log('%c🍷 TheGarrisonVinoteca', 'color: #d4a853; font-size: 24px; font-weight: bold;');
  console.log('%c"Nos importa lo que a la gente le importa"', 'color: #9a8b7a; font-style: italic;');
});
