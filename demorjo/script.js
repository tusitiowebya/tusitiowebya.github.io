// ===== Navbar scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Mobile Menu =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileToggle.classList.remove('active');
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Fade In on Scroll =====
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(i, 5) * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

fadeEls.forEach(el => observer.observe(el));

// Safety net: reveal any still-hidden elements after 6s
setTimeout(() => {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => el.classList.add('visible'));
}, 6000);

// ===== Smooth close nav on anchor click =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      closeMobileMenu();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Stagger cards on load =====
document.querySelectorAll('.servicio-card, .confianza-card, .paso').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});

// ===== Custom Cursor =====
(function () {
  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  var mx = -200, my = -200;
  var rx = -200, ry = -200;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function setDot(x, y)  { dot.style.left  = x + 'px'; dot.style.top  = y + 'px'; }
  function setRing(x, y) { ring.style.left = x + 'px'; ring.style.top = y + 'px'; }

  (function loop() {
    rx = lerp(rx, mx, 0.13);
    ry = lerp(ry, my, 0.13);
    setRing(rx, ry);
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    setDot(mx, my);
    dot.classList.remove('is-out');
    ring.classList.remove('is-out');
  });

  document.addEventListener('mouseleave', function () {
    dot.classList.add('is-out');
    ring.classList.add('is-out');
  });

  document.addEventListener('mouseenter', function () {
    dot.classList.remove('is-out');
    ring.classList.remove('is-out');
  });

  document.addEventListener('mousedown', function () {
    dot.classList.add('is-down');
    ring.classList.add('is-down');
  });

  document.addEventListener('mouseup', function () {
    dot.classList.remove('is-down');
    ring.classList.remove('is-down');
  });

  // WA buttons
  document.querySelectorAll('a[href*="wa.me"], .float-wa').forEach(function (el) {
    el.addEventListener('mouseenter', function () { dot.classList.add('is-wa'); ring.classList.add('is-wa'); });
    el.addEventListener('mouseleave', function () { dot.classList.remove('is-wa'); ring.classList.remove('is-wa'); });
  });

  // Cards
  document.querySelectorAll('.servicio-card, .confianza-card, .galeria-item, .paso, .solucion-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () { dot.classList.add('is-card'); ring.classList.add('is-card'); });
    el.addEventListener('mouseleave', function () { dot.classList.remove('is-card'); ring.classList.remove('is-card'); });
  });

  // Links & buttons (non-WA)
  document.querySelectorAll('a:not([href*="wa.me"]):not(.float-wa), button').forEach(function (el) {
    el.addEventListener('mouseenter', function () { dot.classList.add('is-link'); ring.classList.add('is-link'); });
    el.addEventListener('mouseleave', function () { dot.classList.remove('is-link'); ring.classList.remove('is-link'); });
  });
})();
