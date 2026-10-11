// Datos y rutas compartidos por la portada y la lectura de notas.
(function () {
  const API = 'https://itemanews-panel.tupaginaya.com.ar';

  function mediaURL(value, fallback) {
    const path = String(value || '').trim();
    if (!path) return fallback;
    if (/^\/?uploads\//.test(path)) return new URL(path.replace(/^\/?/, '/'), API).href;
    try {
      const url = new URL(path, document.baseURI);
      return /^https?:$/.test(url.protocol) ? url.href : fallback;
    } catch {
      return fallback;
    }
  }

  function articleHref(id) {
    return 'nota/?id=' + encodeURIComponent(id);
  }

  async function fetchJSON(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(API + path, { signal: controller.signal });
      if (!response.ok) throw new Error('No se pudo cargar el contenido');
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  window.ITEMA_CONTENT = { API, mediaURL, articleHref, fetchJSON };
})();
