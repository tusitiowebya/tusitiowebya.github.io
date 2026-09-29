const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}

const form = document.getElementById('diagnostic-form');
const preview = document.getElementById('message-preview');

function consultationMessage() {
  const problem = form.querySelector('input[name="problem"]:checked')?.value || 'Quiero consultar por mi PC';
  const mode = form.querySelector('input[name="mode"]:checked')?.value || 'Necesito que me orienten sobre la modalidad';
  const detail = form.querySelector('#details').value.trim().replace(/\s+/g, ' ');
  const problemText = problem.charAt(0).toLowerCase() + problem.slice(1);
  return `Hola Eze Tech, ${problemText}. ${mode}.${detail ? ` Detalle: ${detail}.` : ''} ¿Me pueden orientar?`;
}

function updatePreview() {
  if (preview) preview.textContent = consultationMessage();
}

if (form) {
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = `https://wa.me/5492323348379?text=${encodeURIComponent(consultationMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  updatePreview();
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveals = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach((element) => observer.observe(element));
  document.body.classList.add('reveal-ready');
}
