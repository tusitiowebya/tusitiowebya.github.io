/**
 * Plásticos HD - Landing Page JavaScript
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
  // ========================================
  // NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.getElementById('navbar');
  
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  
  mobileMenuBtn.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    
    if (isOpen) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      mobileMenuBtn.setAttribute('aria-label', 'Cerrar menú');
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      mobileMenuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  });

  // Close mobile menu when clicking a link
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    });
  });

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // HERO SECTION ANIMATION
  // ========================================
  const heroContent = document.getElementById('heroContent');
  
  // Show hero content with animation on load
  setTimeout(function() {
    heroContent.classList.add('visible');
  }, 100);

  // ========================================
  // SCROLL ANIMATIONS (FADE IN)
  // ========================================
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(function(element) {
    fadeInObserver.observe(element);
  });

  // ========================================
  // CONTACT FORM SUBMISSION
  // ========================================
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Create WhatsApp message
    const whatsappMessage = `Hola, mi nombre es ${nombre}. Mi teléfono es ${telefono}. ${mensaje}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/5491160124001?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  });

  // ========================================
  // DYNAMIC YEAR IN FOOTER
  // ========================================
  const yearElements = document.querySelectorAll('.footer-bottom p');
  yearElements.forEach(function(el) {
    if (el.textContent.includes('2024')) {
      el.textContent = el.textContent.replace('2024', new Date().getFullYear());
    }
  });

  // ========================================
  // PARALLAX EFFECT FOR GLOWS (OPTIONAL)
  // ========================================
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  
  if (glow1 && glow2) {
    window.addEventListener('mousemove', function(e) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      
      glow1.style.transform = `translate(${moveX}px, ${moveY}px)`;
      glow2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    });
  }

  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a');
  
  function highlightNavLink() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
    
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

  // ========================================
  // STAGGER ANIMATION FOR CARDS
  // ========================================
  const cardGroups = [
    '.services-grid .service-card',
    '.process-grid .process-card',
    '.benefits-grid .benefit-card',
    '.materials-grid .material-card'
  ];

  cardGroups.forEach(function(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(function(card, index) {
      card.style.transitionDelay = `${index * 100}ms`;
    });
  });

  // ========================================
  // GALLERY FILTERING
  // ========================================
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilters.forEach(function(filter) {
    filter.addEventListener('click', function() {
      // Update active filter
      galleryFilters.forEach(function(f) {
        f.classList.remove('active');
      });
      this.classList.add('active');

      // Filter items
      const category = this.getAttribute('data-filter');

      galleryItems.forEach(function(item) {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });

  // ========================================
  // GALLERY LIGHTBOX
  // ========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCurrent = document.getElementById('lightboxCurrent');
  const lightboxTotal = document.getElementById('lightboxTotal');
const lightboxImage = document.getElementById('lightboxImage');
  let currentImageIndex = 0;
  let visibleItems = [];

function updateVisibleItems() {
  visibleItems = Array.from(galleryItems)
    .filter(item => !item.classList.contains('hidden'))
    .sort((a, b) => {
      const idA = parseInt(a.querySelector('img').id);
      const idB = parseInt(b.querySelector('img').id);
      return idA - idB;
    });
}

  function openLightbox(index) {
    updateVisibleItems();
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

function updateLightboxContent() {
  const item = visibleItems[currentImageIndex];
  if (!item) return;

  const img = item.querySelector('img');
  const category = item.querySelector('.gallery-category').textContent;
  const caption = item.querySelector('.gallery-caption').textContent;

  // 👉 Imagen
  lightboxImage.src = img.src;
  lightboxImage.alt = caption;

  // 👉 Info
  lightboxCategory.textContent = category;
  lightboxCaption.textContent = caption;
  lightboxCurrent.textContent = currentImageIndex + 1;
  lightboxTotal.textContent = visibleItems.length;
}

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  // Event Listeners for Lightbox
  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      updateVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    }
  });

  // ========================================
  // PRELOADER (OPTIONAL)
  // ========================================
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });
});
