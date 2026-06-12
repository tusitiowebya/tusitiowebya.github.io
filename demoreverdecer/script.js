// ============================================================
// REVERDECER COUNSELING — Celeste Santillán · script.js
// ============================================================

// Año dinámico en footer
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú mobile — abrir / cerrar
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const navClose = document.getElementById('navClose');
if (toggle && mobile) {
  const openMenu = () => {
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) closeMenu();
  });
}

// Fade-up con stagger por hermanos
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    const i = siblings.indexOf(el);
    el.style.transitionDelay = (i * 70) + 'ms';
    el.classList.add('vis');
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fu').forEach(el => io.observe(el));

// ============================================================
// SIGNATURE: círculo de respiración guiada
// Sincroniza el texto con la animación CSS @keyframes breathe
// (12s: inhalá 0-4s · sostené 4-6s · exhalá 6-12s).
// ============================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phaseEl = document.getElementById('breathPhase');
const countEl = document.getElementById('breathCount');

if (phaseEl && countEl) {
  if (reduceMotion) {
    phaseEl.textContent = 'Respirá';
    countEl.textContent = 'a tu ritmo';
  } else {
    // Fases dentro del ciclo de 12s (ms desde el inicio del ciclo)
    const phases = [
      { at: 0,    label: 'Inhalá',  note: '4 segundos' },
      { at: 4000, label: 'Sostené', note: '2 segundos' },
      { at: 6000, label: 'Exhalá',  note: '6 segundos' },
    ];
    const CYCLE = 12000;
    const start = performance.now();
    let lastLabel = '';

    const tick = (now) => {
      const t = (now - start) % CYCLE;
      // buscar la fase activa (la última cuyo "at" ya pasó)
      let current = phases[0];
      for (const p of phases) { if (t >= p.at) current = p; }
      if (current.label !== lastLabel) {
        phaseEl.textContent = current.label;
        countEl.textContent = current.note;
        lastLabel = current.label;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
