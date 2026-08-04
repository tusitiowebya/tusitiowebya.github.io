const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  const open = links.style.display === 'flex';
  links.style.display = open ? 'none' : 'flex';
  links.style.cssText = open ? '' : 'display:flex;position:fixed;top:64px;left:0;right:0;flex-direction:column;background:rgba(26,14,23,.97);padding:24px 28px;gap:18px;backdrop-filter:blur(10px)';
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  document.querySelector('.nav-links').removeAttribute('style');
}));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 90);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
