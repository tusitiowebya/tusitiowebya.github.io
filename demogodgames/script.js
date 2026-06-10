/* ══ NAVBAR ══ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ══ MOBILE MENU ══ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ══ CATALOG FILTER ══ */
const filtros   = document.querySelectorAll('.filtro');
const cards     = document.querySelectorAll('.game-card');

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.platform === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* Footer platform links */
document.querySelectorAll('[data-filter-link]').forEach(link => {
  link.addEventListener('click', e => {
    const platform = link.dataset.filterLink;
    const btn = document.querySelector(`.filtro[data-filter="${platform}"]`);
    if (btn) btn.click();
  });
});

/* ══ SCROLL FADE-IN ══ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.game-card, .paso, .beneficio, .platform-item').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  observer.observe(el);
});
