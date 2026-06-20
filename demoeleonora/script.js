/* ============================================================
   ELEONORA STICONI — script.js (compartido por todo el sitio)
   ============================================================ */

/* ---------- NAVBAR ---------- */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
const navClose  = document.getElementById('navClose');
function closeMenu() { if (navMobile) navMobile.classList.remove('open'); }
if (navToggle && navMobile) navToggle.addEventListener('click', () => navMobile.classList.add('open'));
if (navClose) navClose.addEventListener('click', closeMenu);
if (navMobile) navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- FADE-UP ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('fu')) : [];
    const idx = siblings.indexOf(entry.target);
    const delay = idx > 0 ? Math.min(idx, 6) * 80 : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- SMOOTH SCROLL (anchors internos) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight + 10 : 10;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ---------- CONSTELACIÓN (signature) ---------- */
(function constellation() {
  const svg = document.querySelector('.hero-constellation');
  if (!svg) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1000, H = 700;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  const N = 26;
  const pts = [];
  for (let i = 0; i < N; i++) pts.push({ x: Math.random() * W, y: Math.random() * H });

  const lines = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .filter(o => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach(o => {
      if (o.j > i && o.d < 260) {
        const q = pts[o.j];
        lines.push(`<line class="cline" x1="${p.x.toFixed(0)}" y1="${p.y.toFixed(0)}" x2="${q.x.toFixed(0)}" y2="${q.y.toFixed(0)}" style="animation-delay:${(Math.random()*1.5).toFixed(2)}s"/>`);
      }
    });
  });
  const stars = pts.map(p =>
    `<circle class="cstar" cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${(Math.random()*1.6+1).toFixed(1)}" style="animation-delay:${(Math.random()*4).toFixed(2)}s"/>`
  );
  svg.innerHTML = lines.join('') + stars.join('');
  if (reduce) {
    svg.querySelectorAll('.cline').forEach(l => l.style.opacity = '.4');
    svg.querySelectorAll('.cstar').forEach(s => s.style.opacity = '.7');
  }
})();

/* ---------- AÑO FOOTER ---------- */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
