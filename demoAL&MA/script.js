// =============================================
//  AL&MA — Interactive Scripts
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- Mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));

  // ---- Counter animation ----
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ---- Gallery filter + Lightbox ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIndex = 0;
  let activeImages = [];

  function buildActiveImages(category) {
    activeImages = [];
    masonryItems.forEach(item => {
      if (category === 'all' || item.dataset.cat === category) {
        activeImages.push(item.querySelector('img').src);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      masonryItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.5s ease both';
        } else {
          item.style.display = 'none';
        }
      });
      buildActiveImages(cat);
    });
  });

  buildActiveImages('all');

  masonryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const activeCat = document.querySelector('.filter-btn.active').dataset.filter;
      buildActiveImages(activeCat);
      const src = item.querySelector('img').src;
      currentGalleryIndex = activeImages.indexOf(src);
      if (currentGalleryIndex === -1) currentGalleryIndex = 0;
      openLightbox(currentGalleryIndex);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImg.src = activeImages[index];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  lightboxPrev.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + activeImages.length) % activeImages.length;
    lightboxImg.src = activeImages[currentGalleryIndex];
  });

  lightboxNext.addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % activeImages.length;
    lightboxImg.src = activeImages[currentGalleryIndex];
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ---- Custom Select ----
  const customSelect = document.getElementById('customSelect');
  const customSelectTrigger = customSelect?.querySelector('.custom-select-trigger');
  const customSelectText = document.getElementById('customSelectText');
  const customSelectItems = customSelect?.querySelectorAll('.custom-select-dropdown li');
  const servicioInput = document.getElementById('servicio');

  customSelectTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    customSelect.classList.toggle('open');
  });

  customSelectItems?.forEach(item => {
    item.addEventListener('click', () => {
      customSelectItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      customSelectText.textContent = item.textContent;
      customSelectTrigger.classList.add('selected');
      servicioInput.value = item.dataset.value;
      customSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!customSelect?.contains(e.target)) {
      customSelect?.classList.remove('open');
    }
  });

  // ---- Contact form ----
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.querySelector('[name="nombre"]').value;
      const tel = form.querySelector('[name="tel"]').value;
      const servicio = form.querySelector('[name="servicio"]').value;
      const msg = form.querySelector('[name="mensaje"]').value;
      const waText = encodeURIComponent(
        `Hola AL&MA! 👋 Me contacto desde la web.\n\n*Nombre:* ${nombre}\n*Teléfono:* ${tel}\n*Servicio:* ${servicio}\n*Consulta:* ${msg}`
      );
      window.open(`https://wa.me/5491130440814?text=${waText}`, '_blank');
      form.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  // ---- Smooth staggered reveal for cards ----
  const cards = document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .pillar');
  cards.forEach((card, i) => {
    card.dataset.delay = (i % 4) * 100;
  });

});
