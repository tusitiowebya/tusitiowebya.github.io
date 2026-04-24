// ─── FADE-UP SCROLL ANIMATIONS ─────────────────────────
function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}

// ─── CONTACT FORM → WHATSAPP ──────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tipo     = document.getElementById('tipo').value;
    const marca    = document.getElementById('marca').value.trim();
    const problema = document.getElementById('problema').value.trim();

    if (!nombre || !telefono) {
      alert('Por favor completá el nombre y el teléfono.');
      return;
    }

    const lineas = [
      'Hola HGB Refrigeración,',
      '',
      'Mi nombre es: ' + nombre,
      'Teléfono: ' + telefono,
      tipo     ? 'Tipo de equipo: ' + tipo     : null,
      marca    ? 'Marca: '          + marca    : null,
      problema ? 'Consulta: '       + problema : null,
    ].filter(l => l !== null).join('\n');

    const url = 'https://wa.me/5491126226045?text=' + encodeURIComponent(lineas);
    window.open(url, '_blank');
  });
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initFadeUp();
  initContactForm();
  initSmoothScroll();
});
