/* ========================================
   TuSitioWebYa - Landing Page JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // === MOBILE MENU TOGGLE ===
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Logo click -> scroll to hero
  document.querySelector('.navbar-logo').addEventListener('click', () => {
    document.querySelector('#hero').scrollIntoView({ behavior: 'smooth' });
  });

  // === SCROLL REVEAL ANIMATIONS ===
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // === HERO ENTRANCE ANIMATION ===
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    requestAnimationFrame(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }

  // === PORTFOLIO MODALS ===
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImage = document.getElementById('modal-image');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');

  const projects = [
    {
      name: 'Estudio Juridico Perez',
      category: 'Sitio corporativo',
      image: 'images/mockup-juridico.jpg',
      description: 'Sitio web profesional para un estudio juridico con formulario de contacto, blog legal y seccion de servicios.'
    },
    {
      name: 'Gym PowerFit',
      category: 'Landing page',
      image: 'images/mockup-gym.jpg',
      description: 'Pagina web dinamica para un gimnasio con horarios de clases, planes de membresia y galeria de fotos.'
    },
    {
      name: 'Tienda Urbana Store',
      category: 'E-commerce',
      image: 'images/mockup-tienda.jpg',
      description: 'Tienda online completa con catalogo de productos, carrito de compras y pasarela de pago integrada.'
    }
  ];

  document.querySelectorAll('.portfolio-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const project = projects[idx];
      modalImage.src = project.image;
      modalImage.alt = 'Preview de ' + project.name;
      modalCategory.textContent = project.category;
      modalTitle.textContent = project.name;
      modalDesc.textContent = project.description;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // === FORM VALIDATION ===
  const form = document.getElementById('demo-form');
  const successMsg = document.getElementById('success-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(el => el.textContent = '');

      // Validate nombre
      const nombre = form.querySelector('#nombre');
      if (!nombre.value.trim()) {
        showError(nombre, 'El nombre es obligatorio');
        isValid = false;
      }

      // Validate descripcion
      const descripcion = form.querySelector('#descripcion');
      if (!descripcion.value.trim()) {
        showError(descripcion, 'La descripcion es obligatoria');
        isValid = false;
      }

      // Validate productos
      const productos = form.querySelector('#productos');
      if (!productos.value.trim()) {
        showError(productos, 'Indicanos tus productos o servicios');
        isValid = false;
      }

      // Validate whatsapp
      const whatsapp = form.querySelector('#whatsapp');
      if (!whatsapp.value.trim()) {
        showError(whatsapp, 'El numero de WhatsApp es obligatorio');
        isValid = false;
      } else if (!/^[\d+\s()\-]{8,20}$/.test(whatsapp.value.trim())) {
        showError(whatsapp, 'Numero invalido');
        isValid = false;
      }

      // Validate redes
      const redes = form.querySelector('#redes');
      if (!redes.value.trim()) {
        showError(redes, 'Indicanos tus redes sociales');
        isValid = false;
      }

      if (isValid) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.style.opacity = '0';
        successMsg.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          successMsg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          successMsg.style.opacity = '1';
          successMsg.style.transform = 'translateY(0)';
        });
      }
    });
  }

  function showError(input, message) {
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  // === WHATSAPP FLOATING BUTTON ===
  const whatsappFloat = document.querySelector('.whatsapp-float');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }
  });

});
