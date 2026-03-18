/**
 * Clean DM - Landing Page JavaScript
 * ===================================
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Check initial state

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(function(element) {
    observer.observe(element);
  });

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Create WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `Hola Clean DM!\n\n` +
        `Mi nombre es ${name}\n` +
        `Teléfono: ${phone}\n` +
        `Email: ${email}\n\n` +
        `Mensaje:\n${message}`
      );
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/5491162152800?text=${whatsappMessage}`, '_blank');
      
      // Reset form
      contactForm.reset();
      
      // Show success message (you can customize this)
      alert('¡Gracias por tu mensaje! Te redirigimos a WhatsApp para completar el envío.');
    });
  }

  // Add hover effects to service cards
  const serviceCards = document.querySelectorAll('.service-card, .service-item');
  
  serviceCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add parallax effect to hero orbs (optional - subtle effect)
  const heroOrbs = document.querySelectorAll('.hero-orb, .cta-orb');
  
  window.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    heroOrbs.forEach(function(orb, index) {
      const speed = (index + 1) * 10;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // Gallery items click effect (could open a lightbox in the future)
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      // Add a click animation
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      // You could add lightbox functionality here
      // For now, it's just a visual feedback
    });
  });

  // Testimonials auto-rotation (optional)
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll('.testimonial-card');
  
  if (testimonials.length > 1 && window.innerWidth < 768) {
    // Only auto-rotate on mobile when cards stack
    setInterval(function() {
      testimonials[currentTestimonial].style.opacity = '0.5';
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      testimonials[currentTestimonial].style.opacity = '1';
    }, 5000);
  }

  // Stats counter animation
  const stats = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }
    });
  }, { threshold: 0.5 });
  
  if (stats.length > 0) {
    statsObserver.observe(stats[0].parentElement.parentElement);
  }
  
  function animateStats() {
    stats.forEach(function(stat) {
      const text = stat.textContent;
      const hasPlus = text.includes('+');
      const number = parseInt(text.replace(/\D/g, ''));
      
      if (number && number > 0) {
        let current = 0;
        const increment = Math.ceil(number / 50);
        const duration = 1500;
        const stepTime = duration / (number / increment);
        
        const timer = setInterval(function() {
          current += increment;
          if (current >= number) {
            current = number;
            clearInterval(timer);
          }
          stat.textContent = (hasPlus ? '+' : '') + current + (text.includes('/') ? '/7' : '');
        }, stepTime);
      }
    });
  }

  // Keyboard navigation support
  document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    }
  });

  // Performance: Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
      handleNavbarScroll();
    });
  });

  // Add loading complete class
  document.body.classList.add('loaded');
  
  console.log('Clean DM Landing Page initialized successfully');
});
