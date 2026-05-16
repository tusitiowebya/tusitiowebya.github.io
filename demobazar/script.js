document.addEventListener('DOMContentLoaded', () => {
  
  // Sticky Navbar
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const btnNav = document.querySelector('.btn-nav');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // If we want the CTA in the mobile menu
    if (navLinks.classList.contains('active')) {
      btnNav.style.display = 'flex';
      btnNav.style.position = 'absolute';
      btnNav.style.top = '220px';
      btnNav.style.left = '24px';
      btnNav.style.right = '24px';
    } else {
      btnNav.style.display = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      btnNav.style.display = 'none';
    });
  });

  // Intersection Observer for scroll animations
  const revealElements = document.querySelectorAll('.section-reveal');

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });
  
  // Trigger active on elements already in viewport on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight) {
        el.classList.add('active');
      }
    });
  }, 100);

});