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

// La portada muestra únicamente contenido publicado en el panel.
(function(){
  const { mediaURL, articleHref, fetchJSON } = window.ITEMA_CONTENT;
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

  function estado(id, mensaje, reintentar) {
    const el = document.getElementById(id);
    const texto = document.createElement(el.tagName === 'OL' ? 'li' : 'p');
    texto.className = 'content-state';
    texto.textContent = mensaje;
    el.replaceChildren(texto);
    if (reintentar) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'content-retry';
      boton.textContent = 'Volver a intentar';
      boton.addEventListener('click', reintentar);
      texto.appendChild(boton);
    }
  }

  function pintarGrid(id, rows, pintar, mensaje) {
    const grid = document.getElementById(id);
    grid.classList.toggle('grid--single', rows.length === 1);
    if (rows.length) grid.innerHTML = rows.map(pintar).join('');
    else estado(id, mensaje);
  }

  function notaCardHTML(a, variante) {
    const tag = TAG_CLASS[a.categoria] || 'tag--region';
    const label = CATEGORIA_LABEL[a.categoria] || a.categoria;
    const img = escapeHtml(mediaURL(a.imagen_url, ''));
    const imagen = img ? `<a href="${articleHref(a.id)}" class="card__img-link"><img src="${img}" alt="${escapeHtml(a.titulo)}"></a>` : '';
    const href = articleHref(a.id);
    if (variante === 'side') {
      return `<article class="side-item${img ? '' : ' side-item--text'}">
        ${img ? `<a href="${href}" class="side-item__img-link"><img src="${img}" alt="${escapeHtml(a.titulo)}"></a>` : ''}
        <div><span class="tag ${tag}">${escapeHtml(label)}</span>
          <h3><a href="${href}">${escapeHtml(a.titulo)}</a></h3>
          <span class="side-item__time">${tiempoRelativo(a.creado_en)}</span>
        </div>
      </article>`;
    }
    if (variante === 'horizontal') {
      return `<article class="card card--horizontal${img ? '' : ' card--text'}">
        ${imagen}
        <div>
          <span class="tag ${tag}">${label}</span>
          <h3><a href="${href}">${escapeHtml(a.titulo)}</a></h3>
          ${a.resumen ? `<p>${escapeHtml(a.resumen)}</p>` : ''}
          <span class="card__time">${tiempoRelativo(a.creado_en)}</span>
        </div>
      </article>`;
    }
    return `<article class="card${variante === 'featured' ? ' card--featured' : ''}">
      ${imagen}
      <span class="tag ${tag}">${label}</span>
      <h3><a href="${href}">${escapeHtml(a.titulo)}</a></h3>
      ${a.resumen ? `<p>${escapeHtml(a.resumen)}</p>` : ''}
      <span class="card__time">${tiempoRelativo(a.creado_en)}</span>
    </article>`;
  }

  function cursoCardHTML(c) {
    const img = escapeHtml(mediaURL(c.imagen_url, ''));
    const grabado = c.modalidad === 'grabado';
    const mensaje = encodeURIComponent(`Hola! Quiero ${grabado ? 'info del curso grabado' : 'anotarme al curso'} de ${c.titulo}`);
    return `<article class="curso-card${img ? '' : ' curso-card--text'}">
      <div class="curso-card__img-wrap">
        ${img ? `<img src="${img}" alt="${escapeHtml(c.titulo)}">` : ''}
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
    img.src = mediaURL(auspiciante.imagen_url, IMG_FALLBACK);
    img.alt = auspiciante.nombre;
    img.className = 'adslot__banner';
    link.appendChild(img);
    el.appendChild(link);
  }

  // Notas técnicas
  function cargarNotas() {
    const status = document.getElementById('heroStatus');
    status.hidden = false;
    estado('heroStatus', 'Cargando notas…');
    ['gridNotas', 'gridInstitucional', 'latestNotes'].forEach(id => estado(id, 'Cargando notas…'));
    return fetchJSON('/api/articulos')
    .then((articulos) => {
      if (!Array.isArray(articulos)) throw new Error('Respuesta inválida');
      articulos = articulos.filter(a => a.estado === 'publicado' && /^[a-f0-9]{24}$/i.test(a.id));

      const destacada = articulos.find((a) => a.destacado) || articulos[0];
      document.getElementById('heroMain').hidden = !destacada;
      document.querySelector('.hero').classList.toggle('hero--single', articulos.length < 2);
      if (destacada) {
        const heroImg = document.getElementById('heroImg');
        const heroTag = document.getElementById('heroTag');
        const heroTitle = document.getElementById('heroTitleLink');
        const heroExcerpt = document.getElementById('heroExcerpt');
        const heroMeta = document.getElementById('heroMeta');
        if (heroImg) {
          const imagen = mediaURL(destacada.imagen_url, '');
          heroImg.hidden = !imagen;
          if (imagen) heroImg.src = imagen;
          heroImg.alt = destacada.titulo;
          heroImg.closest('a').href = articleHref(destacada.id);
          heroImg.closest('a').classList.toggle('hero__img-link--text', !imagen);
        }
        if (heroTag) { heroTag.textContent = CATEGORIA_LABEL[destacada.categoria] || destacada.categoria; heroTag.className = 'tag ' + (TAG_CLASS[destacada.categoria] || 'tag--region'); }
        if (heroTitle) {
          heroTitle.textContent = destacada.titulo;
          heroTitle.href = articleHref(destacada.id);
        }
        document.getElementById('heroReadMore').href = articleHref(destacada.id);
        if (heroExcerpt) heroExcerpt.textContent = destacada.resumen || '';
        if (heroMeta) heroMeta.innerHTML = `<span>Por ${escapeHtml(destacada.autor || 'Redacción ITEMA')}</span><span class="dot">·</span><span>${tiempoRelativo(destacada.creado_en)}</span>`;
        status.hidden = true;
      } else {
        estado('heroStatus', 'Por ahora no hay notas publicadas.');
      }

      const secundarias = articulos.filter(a => a.id !== destacada?.id).slice(0, 3);
      const side = document.getElementById('heroSide');
      side.hidden = secundarias.length === 0;
      side.innerHTML = secundarias.map(a => notaCardHTML(a, 'side')).join('');

      const tickerContent = document.getElementById('tickerContent');
      if (tickerContent) tickerContent.innerHTML = articulos.length ? articulos.slice(0, 6).map((a) => `<span>${escapeHtml(a.titulo)}</span>`).join('') : '<span>Notas de mecánica y cursos del Instituto ITEMA</span>';

      const generales = articulos.filter((a) => a.categoria !== 'institucional');
      pintarGrid('gridNotas', generales, (a, i) => notaCardHTML(a, i === 0 ? 'featured' : ''), 'Todavía no hay notas técnicas publicadas.');

      const institucionales = articulos.filter((a) => a.categoria === 'institucional');
      pintarGrid('gridInstitucional', institucionales, a => notaCardHTML(a, 'horizontal'), 'Todavía no hay novedades institucionales publicadas.');
      const ultimas = [...articulos].sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)).slice(0, 5);
      const ranking = document.getElementById('latestNotes');
      if (ultimas.length) {
        ranking.innerHTML = ultimas.map((a, i) => `<li><span class="ranking__n">${i + 1}</span><a href="${articleHref(a.id)}">${escapeHtml(a.titulo)}</a></li>`).join('');
      } else {
        estado('latestNotes', 'Todavía no hay notas publicadas.');
      }
    })
    .catch(() => {
      document.getElementById('heroMain').hidden = true;
      document.getElementById('heroSide').hidden = true;
      document.querySelector('.hero').classList.add('hero--single');
      ['heroStatus', 'gridNotas', 'gridInstitucional', 'latestNotes'].forEach(id => estado(id, 'No pudimos cargar las notas. Volvé a intentar.', cargarNotas));
    });
  }
  cargarNotas();

  function cargarCursos() {
    ['gridCursos', 'gridGrabados'].forEach(id => estado(id, 'Cargando cursos…'));
    return fetchJSON('/api/cursos')
      .then(cursos => {
        if (!Array.isArray(cursos)) throw new Error('Respuesta inválida');
        cursos = cursos.filter(c => c.estado === 'publicado');
        pintarGrid('gridCursos', cursos.filter(c => c.modalidad === 'presencial'), cursoCardHTML, 'Por ahora no hay cursos presenciales publicados. Consultá las próximas fechas por WhatsApp.');
        pintarGrid('gridGrabados', cursos.filter(c => c.modalidad === 'grabado'), cursoCardHTML, 'Por ahora no hay cursos grabados publicados. Consultá las opciones por WhatsApp.');
      })
      .catch(() => ['gridCursos', 'gridGrabados'].forEach(id => estado(id, 'No pudimos cargar los cursos. Volvé a intentar.', cargarCursos)));
  }
  cargarCursos();

  // Publicidad / auspiciantes
  fetchJSON('/api/auspiciantes')
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
    burger.setAttribute('aria-expanded', String(list.classList.contains('is-open')));
  });
  list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      list.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
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
