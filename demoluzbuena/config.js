/* Configuración pública de la tienda. Nunca poner contraseñas ni tokens acá.
   slug: identificador del comercio en CobrOS. Mientras esté vacío, la tienda
   muestra el catálogo inicial (data.js) y los pedidos salen solo por WhatsApp. */
window.LUZ = Object.freeze({
  api: 'https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico',
  slug: '',
  whatsapp: '5491176119607',
  instagram: 'https://www.instagram.com/luz_buena/',
  zona: 'El Palomar',
  timeoutMs: 8000
});
