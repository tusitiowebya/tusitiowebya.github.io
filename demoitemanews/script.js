// iTEMA News — demo TuPaginaYa

// Fecha en el utility bar
(function(){
  const el = document.getElementById('fecha');
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const d = new Date();
  el.textContent = `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
})();

// Dólar en vivo (dolarapi.com — gratis, sin key)
(function(){
  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
  const oficialEl = document.getElementById('dolarOficial');
  const blueEl = document.getElementById('dolarBlue');
  if (!oficialEl || !blueEl) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  Promise.all([
    fetch('https://dolarapi.com/v1/dolares/oficial', { signal: controller.signal }).then(r => r.json()),
    fetch('https://dolarapi.com/v1/dolares/blue', { signal: controller.signal }).then(r => r.json())
  ])
  .then(([oficial, blue]) => {
    oficialEl.textContent = `${fmt(oficial.compra)} / ${fmt(oficial.venta)}`;
    blueEl.textContent = `${fmt(blue.compra)} / ${fmt(blue.venta)}`;
  })
  .catch(() => {
    oficialEl.textContent = 'no disponible';
    blueEl.textContent = 'no disponible';
  })
  .finally(() => clearTimeout(timeout));
})();

// Año en footer
document.getElementById('anio').textContent = new Date().getFullYear();

// Barra de progreso de lectura
(function(){
  const bar = document.getElementById('readbar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  }, { passive: true });
})();

// Menú mobile
(function(){
  const burger = document.getElementById('navBurger');
  const list = document.getElementById('navList');
  burger.addEventListener('click', () => {
    list.classList.toggle('is-open');
  });
  list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => list.classList.remove('is-open'));
  });
})();

// Nav activo según sección visible + fade-in de secciones
(function(){
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav__list a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => io.observe(s));

  const navIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav__list a[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id], main[id]').forEach(s => navIo.observe(s));
})();

// Buscador simple (placeholder funcional)
(function(){
  const btn = document.getElementById('navSearch');
  btn.addEventListener('click', () => {
    const q = prompt('Buscar en iTEMA News:');
    if (q) alert(`Mostrando resultados para "${q}" (demo — sin backend conectado)`);
  });
})();
