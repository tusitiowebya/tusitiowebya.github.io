// ===== SEGUROS MATJON - Main Script =====

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initCopyButton();
  initSmoothScroll();
  initScrollAnimations();
  initFooterYear();
});

// ===== Copy Phone Button =====
function initCopyButton() {
  const copyBtn = document.getElementById('copyPhoneBtn');
  if (!copyBtn) return;

  const phoneNumber = '(+54 9 11 2882-8330)';
  const iconCopy = copyBtn.querySelector('.icon-copy');
  const iconCheck = copyBtn.querySelector('.icon-check');
  const copyText = copyBtn.querySelector('.copy-text');

  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(phoneNumber).then(function() {
      // Show success state
      iconCopy.classList.add('hidden');
      iconCheck.classList.remove('hidden');
      copyText.textContent = 'Copiado';

      // Reset after 2 seconds
      setTimeout(function() {
        iconCopy.classList.remove('hidden');
        iconCheck.classList.add('hidden');
        copyText.textContent = 'Copiar';
      }, 2000);
    }).catch(function(err) {
      console.error('Error al copiar: ', err);
    });
  });
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for scroll-triggered animations
  const sections = document.querySelectorAll('section');
  sections.forEach(function(section) {
    observer.observe(section);
  });

  // Add fade-in class to cards when they come into view
  const cards = document.querySelectorAll('.service-card, .benefit-item');
  cards.forEach(function(card, index) {
    card.style.animationDelay = (index * 0.1) + 's';
  });
}

// ===== Footer Year =====
function initFooterYear() {
  const yearElement = document.querySelector('.footer-copyright');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear + ' SEGUROS MATJON. Todos los derechos reservados.';
  }
}

// ===== Utility: Add hover effect to WhatsApp FAB =====
(function() {
  const fab = document.querySelector('.whatsapp-fab');
  if (!fab) return;

  // Add entrance animation
  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.5)';
  
  setTimeout(function() {
    fab.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    fab.style.opacity = '1';
    fab.style.transform = 'scale(1)';
  }, 1000);
})();
