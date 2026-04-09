'use strict';

/* ── SCROLL FADE-IN ANIMATIONS ─────────────── */
(function initFadeAnimations() {
  const targets = document.querySelectorAll('.fade-up');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ── NAVBAR SCROLL SHADOW ───────────────────── */
(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 4px 24px rgba(60,30,20,0.07)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
})();

/* ── MOBILE HAMBURGER MENU ──────────────────── */
(function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.navbar-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // close on link click
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ── CONTACT FORM VALIDATION ────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + '-error');
    if (!input || !error) return;
    input.classList.add('invalid');
    error.textContent = message;
    error.classList.add('show');
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + '-error');
    if (!input || !error) return;
    input.classList.remove('invalid');
    error.classList.remove('show');
  }

  // Live clear on input
  ['name', 'email', 'message'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    clearError('name');
    clearError('email');
    clearError('message');

    if (name.length < 2) {
      showError('name', 'Por favor ingresa tu nombre (mínimo 2 caracteres).');
      valid = false;
    }

    if (!validateEmail(email)) {
      showError('email', 'Ingresa un email válido.');
      valid = false;
    }

    if (message.length < 10) {
      showError('message', 'Cuéntanos más en tu mensaje (mínimo 10 caracteres).');
      valid = false;
    }

    if (!valid) return;

    // Simulate submit
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Enviar mensaje';
      submitBtn.disabled = false;
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 900);
  });
})();

/* ── CURRENT YEAR IN FOOTER ─────────────────── */
(function setYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
})();
