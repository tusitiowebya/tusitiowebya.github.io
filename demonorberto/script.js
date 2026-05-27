/* ============================================================
   SERVICIO TÉCNICO NORBERTO — script.js
   ============================================================ */

/* ---------- NAVBAR SCROLL + TOGGLE ---------- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', function () {
  const open = navLinks.classList.toggle('open');
  this.classList.toggle('open', open);
  const spans = this.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- FADE-UP OBSERVER ---------- */
const fuObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(
      '.servicios-grid, .ben-grid, .proceso-grid, .galeria-grid, .fallas-grid, .aires-servicios'
    );
    const delay = parent
      ? Array.from(parent.children).indexOf(entry.target) * 90
      : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
function animateCount(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1600;
  const step     = target / (duration / 16);
  let current    = 0;
  const t = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(t);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCount);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.aires-stats');
if (statsEl) counterObs.observe(statsEl);

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ---------- HERO VIDEO PARALLAX ---------- */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroVideo.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
}
