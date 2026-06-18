/* ============================================================
   FALCÓN FERRETERÍA — script.js (landing)
   ============================================================ */

/* ---------- NAVBAR ---------- */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', function () {
  const open = navMobile.classList.toggle('open');
  const s = this.querySelectorAll('span');
  if (open) {
    s[0].style.transform = 'translateY(7px) rotate(45deg)';
    s[1].style.opacity   = '0';
    s[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    s.forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
  }
});
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
  });
});

/* ---------- FADE-UP ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest('.cat-grid, .ben-grid, .feat-grid, .proc-grid, .test-grid, .faq-list, .hero-content');
    const delay = parent ? Array.from(parent.children).indexOf(entry.target) * 55 : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
const observeFu = () => document.querySelectorAll('.fu:not(.vis)').forEach(el => fuObs.observe(el));
observeFu();

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 8, behavior: 'smooth' });
  });
});

/* ---------- HERO PARALLAX ---------- */
const heroVid = document.querySelector('.hero-video');
if (heroVid) window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) heroVid.style.transform = `translateY(${window.scrollY * 0.14}px)`;
}, { passive: true });

/* ---------- FAQ ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- PRODUCTOS DESTACADOS (desde products.js) ---------- */
const featBox = document.getElementById('featGrid');
if (featBox && typeof loadProducts === 'function') {
  loadProducts().then(list => {
    const pick = list.slice(0, 4);
    featBox.innerHTML = pick.map(p => `
      <a class="feat-card fu" href="productos.html?cat=${encodeURIComponent(p.cat)}">
        <div class="feat-img"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
        <div class="feat-body">
          <span class="feat-cat">${p.cat}</span>
          <h3>${p.name}</h3>
          <span class="feat-price">$${p.price.toLocaleString('es-AR')} <small>${p.unit}</small></span>
        </div>
      </a>`).join('');
    observeFu();
  });
}

/* ---------- AÑO ---------- */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
