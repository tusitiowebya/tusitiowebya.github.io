// Pirolo — page.js (subpages)
document.getElementById('yr').textContent = new Date().getFullYear();

const nav = document.getElementById('nav');
nav.classList.add('pg-nav');

const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// Thumb switcher
document.querySelectorAll('.pd-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const src = thumb.querySelector('img').src;
    const main = document.querySelector('.pd-img-main img');
    if (main) main.src = src;
    document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// Fade in on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.opacity = 1;
    e.target.style.transform = 'translateY(0)';
    io.unobserve(e.target);
  });
}, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.fu').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  io.observe(el);
});
