/* ===========================
   NATURAL GREEN — script.js
   =========================== */

/* --- Scroll-triggered fade-in --- */
(function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
})();

/* --- Navbar: add shadow on scroll --- */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* --- Hero parallax --- */
(function initParallax() {
  const parallax = document.querySelector('.hero-parallax');
  if (!parallax) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallax.style.transform = `translateY(${scrollY * 0.4}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* --- Gallery item: subtle hover overlay already handled via CSS ---
   Adding a lightbox-style zoom for gallery images */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.id = 'lightbox';
      overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.88);
        display:flex; align-items:center; justify-content:center;
        cursor:zoom-out; padding:24px;
        animation: lbIn 0.25s ease;
      `;

      const style = document.createElement('style');
      style.textContent = '@keyframes lbIn{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(style);

      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt;
      clone.style.cssText = `
        max-width:90vw; max-height:90vh;
        object-fit:contain; border-radius:12px;
        box-shadow:0 40px 80px rgba(0,0,0,0.5);
      `;

      overlay.appendChild(clone);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
          overlay.remove();
          document.body.style.overflow = '';
          document.removeEventListener('keydown', onEsc);
        }
      });
    });
  });
})();

/* --- Service cards: staggered entrance --- */
(function initServiceCards() {
  const cards = document.querySelectorAll('.service-card, .service-cta-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
})();
