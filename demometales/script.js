/* ===========================================
   METALES - Interactions
   =========================================== */

// Sticky header
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 30) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    nav.classList.remove('open');
  });
});

// Reveal on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stagger material/feature cards
document.querySelectorAll('.grid-materials .reveal, .grid-features .reveal, .provinces .province')
  .forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
