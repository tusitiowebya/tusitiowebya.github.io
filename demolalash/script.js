// Lalalash - Salud y Belleza
// JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
  const closeIcon = mobileMenuBtn.querySelector('.close-icon');

  mobileMenuBtn.addEventListener('click', function() {
    const isOpen = !mobileNav.classList.contains('hidden');
    
    if (isOpen) {
      mobileNav.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    } else {
      mobileNav.classList.remove('hidden');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }
  });

  // Close mobile menu when clicking a link
  const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileNav.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state

  // Testimonial Slider
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 0;
  let autoSlideInterval;

  function showTestimonial(index) {
    // Wrap around
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    
    currentIndex = index;

    // Update testimonials
    testimonials.forEach(function(testimonial, i) {
      if (i === currentIndex) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });

    // Update dots
    dots.forEach(function(dot, i) {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextTestimonial() {
    showTestimonial(currentIndex + 1);
  }

  function prevTestimonial() {
    showTestimonial(currentIndex - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextTestimonial, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners for testimonial controls
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function() {
      stopAutoSlide();
      prevTestimonial();
      startAutoSlide();
    });

    nextBtn.addEventListener('click', function() {
      stopAutoSlide();
      nextTestimonial();
      startAutoSlide();
    });
  }

  // Dot click handlers
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      stopAutoSlide();
      showTestimonial(index);
      startAutoSlide();
    });
  });

  // Start auto slide
  startAutoSlide();

  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scroll for anchor links (fallback for browsers without CSS smooth scroll)
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

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.service-card, .product-card, .benefit-card, .result-card');
  animatedElements.forEach(function(el, index) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease ' + (index * 0.1) + 's, transform 0.6s ease ' + (index * 0.1) + 's';
    observer.observe(el);
  });
});
