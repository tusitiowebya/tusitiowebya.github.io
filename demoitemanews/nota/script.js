(function () {
  const { fetchJSON, mediaURL } = window.ITEMA_CONTENT;
  const labels = { inyeccion: 'Inyección Electrónica', motor: 'Motor', electrica: 'Eléctrica y Electrónica', diagnostico: 'Diagnóstico', mantenimiento: 'Mantenimiento', institucional: 'Institucional' };
  const id = new URLSearchParams(location.search).get('id');
  const get = (name) => document.getElementById(name);

  function setMeta(selector, value) {
    document.querySelector(selector).content = value;
  }

  async function load() {
    get('reader').setAttribute('aria-busy', 'true');
    get('status').hidden = false;
    get('status').textContent = 'Cargando la nota…';
    get('retry').hidden = true;
    try {
      if (!/^[a-f0-9]{24}$/i.test(id || '')) throw new Error('El enlace de esta nota no es válido. Volvé a la portada para elegir una nota.');
      // La lista pública contiene únicamente notas publicadas, nunca borradores.
      const notes = await fetchJSON('/api/articulos');
      if (!Array.isArray(notes)) throw new Error('No se pudo cargar la nota. Volvé a intentar en unos instantes.');
      const note = notes.find((row) => row.id === id && row.estado === 'publicado');
      if (!note) throw new Error('Esta nota no está disponible. Podés ver las notas actuales en la portada.');

      get('title').textContent = note.titulo;
      get('category').textContent = labels[note.categoria] || 'Nota técnica';
      get('summary').textContent = note.resumen || '';
      get('summary').hidden = !note.resumen;
      const date = new Date(note.creado_en);
      const dateLabel = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
      get('meta').textContent = ['Por ' + (note.autor || 'Redacción iTEMA'), dateLabel].filter(Boolean).join(' · ');
      const image = mediaURL(note.imagen_url, '');
      get('image').hidden = !image;
      if (image) { get('image').src = image; get('image').alt = note.titulo; }
      get('body').replaceChildren();
      const text = String(note.cuerpo || '').trim();
      for (const paragraph of text.split(/\n\s*\n/)) {
        const p = document.createElement('p');
        p.textContent = paragraph;
        get('body').appendChild(p);
      }
      if (!text) get('body').textContent = 'Esta nota todavía no tiene un texto completo publicado.';

      const canonical = new URL(location.href);
      canonical.search = new URLSearchParams({ id }).toString();
      canonical.hash = '';
      const title = note.titulo + ' — iTEMA News';
      const description = String(note.resumen || note.cuerpo || '').replace(/\s+/g, ' ').trim().slice(0, 160);
      document.title = title;
      document.querySelector('link[rel="canonical"]').href = canonical.href;
      setMeta('meta[name="description"]', description);
      setMeta('meta[name="robots"]', 'index, follow');
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[property="og:url"]', canonical.href);
      setMeta('meta[name="twitter:title"]', title);
      setMeta('meta[name="twitter:description"]', description);
      if (image) { setMeta('meta[property="og:image"]', image); setMeta('meta[name="twitter:image"]', image); }
      get('articleSchema').textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'NewsArticle', headline: note.titulo,
        description, datePublished: note.creado_en, dateModified: note.actualizado_en || note.creado_en,
        ...(image ? { image } : {}), mainEntityOfPage: canonical.href,
        author: { '@type': 'Organization', name: note.autor || 'Redacción iTEMA' },
        publisher: { '@type': 'Organization', name: 'iTEMA News', logo: { '@type': 'ImageObject', url: new URL('../images/logoitema.png', location.href).href } }
      });
      get('status').hidden = true;
      get('article').hidden = false;
    } catch (error) {
      get('article').hidden = true;
      get('status').textContent = error.name === 'AbortError' ? 'La carga está demorando. Volvé a intentar en unos instantes.' : error.message;
      get('retry').hidden = !/^[a-f0-9]{24}$/i.test(id || '');
    } finally {
      get('reader').setAttribute('aria-busy', 'false');
    }
  }

  get('retry').addEventListener('click', load);
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const distance = doc.scrollHeight - doc.clientHeight;
    get('readbar').style.width = (distance > 0 ? doc.scrollTop / distance * 100 : 0) + '%';
  }, { passive: true });
  load();
})();
