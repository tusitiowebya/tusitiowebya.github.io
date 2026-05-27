/* ============================================================
   CITY CASH — script.js
   ============================================================ */

/* ---------- NAVBAR SCROLL + TOGGLE ---------- */
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

/* ---------- FADE-UP OBSERVER ---------- */
const fuObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for grouped elements
      const delay = entry.target.closest('.prestamos-grid, .seguros-grid, .beneficios-grid, .test-grid, .timeline')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
        : 0;
      setTimeout(() => {
        entry.target.classList.add('vis');
      }, delay);
      fuObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObserver.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('es-AR');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('es-AR');
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

    // Open clicked (if it was closed)
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ---------- HERO PARALLAX ---------- */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroVideo.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

/* ---------- NAVBAR TOGGLE ANIMATION ---------- */
navToggle.addEventListener('click', function() {
  const spans = this.querySelectorAll('span');
  if (this.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
