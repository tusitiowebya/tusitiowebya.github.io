// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Fade-up observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Gallery hover sync (all items with same images auto-sync on hover)
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    item.style.zIndex = 2;
  });
  item.addEventListener('mouseleave', () => {
    item.style.zIndex = 1;
  });
});