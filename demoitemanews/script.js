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

// Contenido real desde el panel (notas, cursos y publicidad) — si no hay nada cargado, se queda la demo de ejemplo
(function(){
  const API = 'https://itemanews-panel.tupaginaya.com.ar';
  const CATEGORIA_LABEL = { inyeccion: 'Inyección Electrónica', motor: 'Motor', electrica: 'Eléctrica y Electrónica', diagnostico: 'Diagnóstico', mantenimiento: 'Mantenimiento', institucional: 'Institucional' };
  const TAG_CLASS = { inyeccion: 'tag--educacion', motor: 'tag--deportes', electrica: 'tag--tecnologia', diagnostico: 'tag--region', mantenimiento: 'tag--economia', institucional: 'tag--tecnologia' };
  const IMG_FALLBACK = 'images/hero.jpg';
  const WHATSAPP = '5493424296808';

  function tiempoRelativo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const horas = Math.floor(diffMs / 3600000);
    if (horas < 1) return 'Hace instantes';
    if (horas < 24) return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
    const dias = Math.floor(horas / 24);
    return dias === 1 ? 'Ayer' : `Hace ${dias} días`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function notaCardHTML(a, variante) {
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

  function cursoCardHTML(c) {
    const img = c.imagen_url || IMG_FALLBACK;
    const grabado = c.modalidad === 'grabado';
    const mensaje = encodeURIComponent(`Hola! Quiero ${grabado ? 'info del curso grabado' : 'anotarme al curso'} de ${c.titulo}`);
    return `<article class="curso-card">
      <div class="curso-card__img-wrap">
        <img src="${img}" alt="">
        <span class="curso-card__modalidad${grabado ? ' curso-card__modalidad--grabado' : ''}">${grabado ? 'Grabado' : 'Presencial'}</span>
      </div>
      <div class="curso-card__body">
        <h3>${escapeHtml(c.titulo)}</h3>
        <p class="curso-card__meta">${[c.duracion, c.cupos].filter(Boolean).map(escapeHtml).join(' · ') || (grabado ? 'Acceso inmediato' : 'Consultar disponibilidad')}</p>
        <div class="curso-card__footer">
          <span class="curso-card__precio">${escapeHtml(c.precio || 'Consultar')}</span>
          <a href="https://wa.me/${WHATSAPP}?text=${mensaje}" target="_blank" rel="noopener" class="curso-card__cta">${grabado ? 'Consultar' : 'Anotarme'}</a>
        </div>
      </div>
    </article>`;
  }

  function pintarAdSlot(id, auspiciante) {
    const el = document.getElementById(id);
    if (!el || !auspiciante) return;
    el.classList.add('has-banner');
    el.innerHTML = '';
    const link = document.createElement('a');
    link.href = auspiciante.link || '#';
    if (auspiciante.link) { link.target = '_blank'; link.rel = 'noopener'; }
    const img = document.createElement('img');
    img.src = auspiciante.imagen_url;
    img.alt = auspiciante.nombre;
    img.className = 'adslot__banner';
    link.appendChild(img);
    el.appendChild(link);
  }

  const fetchJSON = (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    return fetch(url, { signal: controller.signal }).then((r) => r.json()).finally(() => clearTimeout(timeout));
  };

  // Notas técnicas
  fetchJSON(`${API}/api/articulos`)
    .then((articulos) => {
      if (!Array.isArray(articulos) || articulos.length === 0) return;

      const destacada = articulos.find((a) => a.destacado) || articulos[0];
      if (destacada) {
        const heroImg = document.getElementById('heroImg');
        const heroTag = document.getElementById('heroTag');
        const heroTitle = document.getElementById('heroTitleLink');
        const heroExcerpt = document.getElementById('heroExcerpt');
        const heroMeta = document.getElementById('heroMeta');
        if (heroImg && destacada.imagen_url) heroImg.src = destacada.imagen_url;
        if (heroTag) { heroTag.textContent = CATEGORIA_LABEL[destacada.categoria] || destacada.categoria; heroTag.className = 'tag ' + (TAG_CLASS[destacada.categoria] || 'tag--region'); }
        if (heroTitle) heroTitle.textContent = destacada.titulo;
        if (heroExcerpt) heroExcerpt.textContent = destacada.resumen || '';
        if (heroMeta) heroMeta.innerHTML = `<span>Por ${escapeHtml(destacada.autor || 'Redacción ITEMA')}</span><span class="dot">·</span><span>${tiempoRelativo(destacada.creado_en)}</span>`;
      }

      const tickerContent = document.getElementById('tickerContent');
      if (tickerContent) tickerContent.innerHTML = articulos.slice(0, 6).map((a) => `<span>${escapeHtml(a.titulo)}</span>`).join('');

      const generales = articulos.filter((a) => a.categoria !== 'institucional');
      const gridNotas = document.getElementById('gridNotas');
      if (gridNotas && generales.length > 0) {
        gridNotas.innerHTML = generales.slice(0, 3).map((a, i) => notaCardHTML(a, i === 0 ? 'featured' : '')).join('');
      }

      const institucionales = articulos.filter((a) => a.categoria === 'institucional');
      const gridInstitucional = document.getElementById('gridInstitucional');
      if (gridInstitucional && institucionales.length > 0) {
        gridInstitucional.innerHTML = institucionales.slice(0, 2).map((a) => notaCardHTML(a, 'horizontal')).join('');
      }
    })
    .catch(() => {});

  // Cursos presenciales
  fetchJSON(`${API}/api/cursos?modalidad=presencial`)
    .then((cursos) => {
      const grid = document.getElementById('gridCursos');
      if (grid && Array.isArray(cursos) && cursos.length > 0) grid.innerHTML = cursos.slice(0, 6).map(cursoCardHTML).join('');
    })
    .catch(() => {});

  // Cursos grabados
  fetchJSON(`${API}/api/cursos?modalidad=grabado`)
    .then((cursos) => {
      const grid = document.getElementById('gridGrabados');
      if (grid && Array.isArray(cursos) && cursos.length > 0) grid.innerHTML = cursos.slice(0, 6).map(cursoCardHTML).join('');
    })
    .catch(() => {});

  // Publicidad / auspiciantes
  fetchJSON(`${API}/api/auspiciantes`)
    .then((auspiciantes) => {
      if (!Array.isArray(auspiciantes)) return;
      const byPos = (pos) => auspiciantes.find((a) => a.posicion === pos);
      pintarAdSlot('adHero', byPos('hero_bar'));
      pintarAdSlot('adWide', byPos('wide_bar'));
      pintarAdSlot('adSide', byPos('sidebar'));
    })
    .catch(() => {});
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
