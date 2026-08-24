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

// Notas reales desde el panel (si el cliente ya cargó algo, reemplaza los ejemplos de la demo)
(function(){
  const API = 'https://itemanews-panel.tupaginaya.com.ar';
  const CATEGORIA_LABEL = { educacion: 'Educación', economia: 'Economía', tecnologia: 'Tecnología', deportes: 'Deportes', region: 'Región', opinion: 'Opinión' };
  const TAG_CLASS = { educacion: 'tag--educacion', economia: 'tag--economia', tecnologia: 'tag--tecnologia', deportes: 'tag--deportes', region: 'tag--region', opinion: 'tag--region' };
  const IMG_FALLBACK = 'images/hero.jpg';

  function tiempoRelativo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const horas = Math.floor(diffMs / 3600000);
    if (horas < 1) return 'Hace instantes';
    if (horas < 24) return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
    const dias = Math.floor(horas / 24);
    return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
  }

  function cardHTML(a, variante) {
    const tag = TAG_CLASS[a.categoria] || 'tag--region';
    const label = CATEGORIA_LABEL[a.categoria] || a.categoria;
    const img = a.imagen_url || IMG_FALLBACK;
    if (variante === 'horizontal') {
      return `<article class="card card--horizontal">
        <a href="#" class="card__img-link"><img src="${img}" alt=""></a>
        <div>
          <span class="tag ${tag}">${label}</span>
          <h3><a href="#">${escapeHtml(a.titulo)}</a></h3>
          ${a.resumen ? `<p>${escapeHtml(a.resumen)}</p>` : ''}
          <span class="card__time">${tiempoRelativo(a.creado_en)}</span>
        </div>
      </article>`;
    }
    return `<article class="card${variante === 'featured' ? ' card--featured' : ''}">
      <a href="#" class="card__img-link"><img src="${img}" alt=""></a>
      <span class="tag ${tag}">${label}</span>
      <h3><a href="#">${escapeHtml(a.titulo)}</a></h3>
      ${a.resumen ? `<p>${escapeHtml(a.resumen)}</p>` : ''}
      <span class="card__time">${tiempoRelativo(a.creado_en)}</span>
    </article>`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  fetch(`${API}/api/articulos`, { signal: controller.signal })
    .then((r) => r.json())
    .then((articulos) => {
      if (!Array.isArray(articulos) || articulos.length === 0) return; // sin notas reales: se queda la demo de ejemplo

      // Hero: la nota destacada más nueva (si hay)
      const destacada = articulos.find((a) => a.destacado);
      if (destacada) {
        const heroImg = document.querySelector('.hero__img');
        const heroTag = document.querySelector('.hero__img-link .tag');
        const heroTitle = document.querySelector('.hero__title a');
        const heroExcerpt = document.querySelector('.hero__excerpt');
        const heroMeta = document.querySelector('.hero__meta');
        if (heroImg && destacada.imagen_url) heroImg.src = destacada.imagen_url;
        if (heroTag) { heroTag.textContent = CATEGORIA_LABEL[destacada.categoria] || destacada.categoria; heroTag.className = 'tag ' + (TAG_CLASS[destacada.categoria] || 'tag--region'); }
        if (heroTitle) heroTitle.textContent = destacada.titulo;
        if (heroExcerpt) heroExcerpt.textContent = destacada.resumen || '';
        if (heroMeta) heroMeta.innerHTML = `<span>Por ${escapeHtml(destacada.autor || 'Redacción iTEMA')}</span><span class="dot">·</span><span>${tiempoRelativo(destacada.creado_en)}</span>`;
      }

      // Ticker: últimos títulos reales
      const tickerContent = document.getElementById('tickerContent');
      if (tickerContent) {
        tickerContent.innerHTML = articulos.slice(0, 6).map((a) => `<span>${escapeHtml(a.titulo)}</span>`).join('');
      }

      // Grillas por sección: si hay notas de esa categoría, reemplazan los ejemplos
      Object.keys(CATEGORIA_LABEL).forEach((cat) => {
        const notas = articulos.filter((a) => a.categoria === cat);
        if (notas.length === 0) return;
        const seccion = document.getElementById(cat);
        const grid = seccion && seccion.querySelector('.grid');
        if (!grid) return;
        const esGrid2 = grid.classList.contains('grid--2');
        grid.innerHTML = notas.slice(0, 3).map((a, i) =>
          cardHTML(a, esGrid2 ? 'horizontal' : (i === 0 ? 'featured' : ''))
        ).join('');
      });
    })
    .catch(() => { /* API no disponible: se queda la demo de ejemplo tal cual */ })
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
