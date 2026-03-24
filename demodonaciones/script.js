/* ========================================
   CARLOS - TU GRANITO AYUDA
   JavaScript Functionality
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initProgressBar();
  initScrollToTop();
  initSmoothScroll();
});

/* ========================================
   PROGRESS BAR ANIMATION
   ======================================== */
function initProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const raised = 129446100;
  const goal = 205470000;
  const percentage = (raised / goal) * 100;
  
  // Animate progress bar after a short delay
  setTimeout(() => {
    progressBar.style.width = percentage + '%';
  }, 500);
}

/* ========================================
   COPY TO CLIPBOARD FUNCTIONALITY
   ======================================== */
function copyToClipboard(inputId, button) {
  const input = document.getElementById(inputId);
  const text = input.value;
  
  // Use modern clipboard API
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback
    const originalText = button.textContent;
    button.textContent = '¡Copiado!';
    button.classList.add('copied');
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    // Fallback for older browsers
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    // Visual feedback
    const originalText = button.textContent;
    button.textContent = '¡Copiado!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  });
}

/* ========================================
   ACCORDION FUNCTIONALITY
   ======================================== */
function toggleAccordion(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');
  
  // Close all other accordion items
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(i => {
    if (i !== item) {
      i.classList.remove('active');
    }
  });
  
  // Toggle current item
  if (isActive) {
    item.classList.remove('active');
  } else {
    item.classList.add('active');
  }
}

/* ========================================
   SCROLL TO TOP BUTTON
   ======================================== */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbarHeight = 64;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ======================================== */
function initScrollAnimations() {
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
  
  // Observe sections for animation
  const sections = document.querySelectorAll('.historia, .donar, .transparencia, .faq');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initScrollAnimations);
