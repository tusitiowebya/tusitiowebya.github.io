/* ===========================
   Iglesia Rey de Gloria
   script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll effect ---------- */
  const header = document.querySelector('.header');

  function handleHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  /* ---------- Mobile menu toggle ---------- */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOpenIcon = document.getElementById('menu-open-icon');
  const menuCloseIcon = document.getElementById('menu-close-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuOpenIcon.style.display = isOpen ? 'none' : 'block';
      menuCloseIcon.style.display = isOpen ? 'block' : 'none';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuOpenIcon.style.display = 'block';
        menuCloseIcon.style.display = 'none';
      });
    });
  }

  /* ---------- WhatsApp floating button ---------- */
  const whatsappFloat = document.querySelector('.whatsapp-float');

  function handleWhatsAppScroll() {
    if (window.scrollY > 400) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleWhatsAppScroll);
  handleWhatsAppScroll();

  /* ---------- Scroll animations (Intersection Observer) ---------- */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Prayer form (send to WhatsApp) ---------- */
  const prayerForm = document.getElementById('prayer-form');
  const submitBtn = document.getElementById('submit-btn');

  if (prayerForm) {
    prayerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !mensaje) return;

      const text = encodeURIComponent(`Hola, soy ${nombre}. ${mensaje}`);
      window.open(`https://wa.me/5492323354805?text=${text}`, '_blank');

      // Reset
      submitBtn.textContent = 'Enviando a WhatsApp...';
      submitBtn.disabled = true;

      setTimeout(() => {
        prayerForm.reset();
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Enviar por WhatsApp
        `;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

});
