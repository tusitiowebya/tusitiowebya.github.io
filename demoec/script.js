/* EC Construcciones — interacciones */
document.addEventListener('DOMContentLoaded', () => {

  /* Año dinámico */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Navbar scrolled */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menú mobile */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('active');
    links.classList.remove('open');
  }));

  /* Reveal fade-up con stagger */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const sibs = Array.from(e.target.parentElement.querySelectorAll(':scope > .fu'));
        const idx = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = (idx * 70) + 'ms';
        e.target.classList.add('vis');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fu').forEach(el => io.observe(el));

  /* Parallax hero */
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const o = window.scrollY;
      if (o < window.innerHeight) heroImg.style.transform = `translateY(${o * 0.16}px) scale(1.04)`;
    }, { passive: true });
  }

  /* FAQ acordeón (uno abierto) */
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* Lightbox galería */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.gal-item').forEach(g => {
    g.addEventListener('click', () => {
      lbImg.src = g.dataset.full || g.querySelector('img').src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-close')) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
});
