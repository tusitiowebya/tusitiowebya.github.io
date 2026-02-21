// ==========================================================================
// Mas Salud - Landing Page JavaScript
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // Navbar scroll effect
  // ========================================================================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ========================================================================
  // Mobile menu toggle
  // ========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hamburgerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  let menuOpen = false;

  mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    mobileToggle.innerHTML = menuOpen ? closeIcon : hamburgerIcon;
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      mobileToggle.innerHTML = hamburgerIcon;
    });
  });

  // ========================================================================
  // Scroll animations (fade-in)
  // ========================================================================
  const fadeElements = document.querySelectorAll('.fade-in');
  const observerOptions = { threshold: 0.1 };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for children
        const children = entry.target.querySelectorAll('[data-delay]');
        children.forEach(child => {
          const delay = child.getAttribute('data-delay');
          child.style.transitionDelay = delay + 'ms';
        });
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ========================================================================
  // Course filter
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filter === 'todos' || type === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================================================
  // Testimonials slider
  // ========================================================================
  const testimonials = [
    {
      name: 'Maria Laura G.',
      role: 'Egresada de Enfermeria Domiciliaria',
      image: 'images/testimonial-1.jpg',
      text: 'Gracias a Mas Salud pude formarme como enfermera sin dejar de trabajar. Las clases en vivo son excelentes y los profesores siempre estan disponibles para resolver dudas. Hoy trabajo en lo que me apasiona.'
    },
    {
      name: 'Carlos M.',
      role: 'Egresado de Emergencias Medicas',
      image: 'images/testimonial-2.jpg',
      text: 'El curso de emergencias medicas supero mis expectativas. La modalidad online en vivo permite aprender de verdad, interactuar con los profesores y companeros. Lo recomiendo totalmente.'
    },
    {
      name: 'Valentina R.',
      role: 'Egresada de Estimulacion Temprana',
      image: 'images/testimonial-3.jpg',
      text: 'Buscaba una formacion seria y accesible, y la encontre en Mas Salud. El material de estudio es muy completo, las cuotas son accesibles y la certificacion me abrio muchas puertas laborales.'
    }
  ];

  let currentTestimonial = 0;
  const testimonialText = document.querySelector('.testimonial-text');
  const testimonialImg = document.querySelector('.testimonial-author img');
  const testimonialName = document.querySelector('.testimonial-author-name');
  const testimonialRole = document.querySelector('.testimonial-author-role');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  function updateTestimonial(index) {
    currentTestimonial = index;
    const t = testimonials[index];
    testimonialText.textContent = '"' + t.text + '"';
    testimonialImg.src = t.image;
    testimonialImg.alt = t.name;
    testimonialName.textContent = t.name;
    testimonialRole.textContent = t.role;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateTestimonial((currentTestimonial + 1) % testimonials.length);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateTestimonial(i));
  });

  // Auto-play slider
  setInterval(() => {
    updateTestimonial((currentTestimonial + 1) % testimonials.length);
  }, 5000);

  // ========================================================================
  // Form validation
  // ========================================================================
  const form = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(el => el.textContent = '');

      const nombre = form.querySelector('#nombre');
      const telefono = form.querySelector('#telefono');
      const email = form.querySelector('#email');
      const curso = form.querySelector('#curso');

      if (!nombre.value.trim()) {
        form.querySelector('#nombre-error').textContent = 'El nombre es obligatorio';
        valid = false;
      }

      if (!telefono.value.trim()) {
        form.querySelector('#telefono-error').textContent = 'El telefono es obligatorio';
        valid = false;
      }

      if (!email.value.trim()) {
        form.querySelector('#email-error').textContent = 'El email es obligatorio';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        form.querySelector('#email-error').textContent = 'Ingrese un email valido';
        valid = false;
      }

      if (!curso.value) {
        form.querySelector('#curso-error').textContent = 'Seleccione un curso';
        valid = false;
      }

      if (valid) {
        const message = `Hola! Mi nombre es ${nombre.value}. Me interesa el curso de ${curso.value}. Mi email es ${email.value} y mi telefono ${telefono.value}.`;
        window.open(`https://wa.me/5491139251494?text=${encodeURIComponent(message)}`, '_blank');
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
      }
    });
  }

  // ========================================================================
  // WhatsApp FAB delayed appearance
  // ========================================================================
  const fab = document.querySelector('.whatsapp-fab');
  if (fab) {
    setTimeout(() => fab.classList.add('visible'), 2000);
  }

});
