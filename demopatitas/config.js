/* ============================================================
   Patitas que Aman — CONFIG EDITABLE
   Esto es lo que el local puede cambiar fácil cada mes.
   El catálogo (productos/precios/categorías) se edita desde
   el panel de cobros — acá NO hay que tocar nada de eso.
   ============================================================ */
window.PATITAS = {
  /* ---- conexión con la app de cobros (no tocar) ---- */
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
  SLUG: "patitas-que-aman",

  /* ---- datos del local ---- */
  NEGOCIO: "Patitas que Aman",
  WA: "5493516209312",          // WhatsApp formato wa.me
  WA_HUMANO: "351 620-9312",
  DIRECCION: "25 de Mayo 350, Córdoba",

  /* ---- BANNER DESLIZABLE de avisos (editá / agregá los que quieras) ---- */
  AVISOS: [
    "🚚 Envíos a domicilio en Córdoba — coordinás por WhatsApp",
    "⭐ Nuevas promos todas las semanas",
    "🐾 Las mejores marcas para perros y gatos",
    "🏠 Retirá en el local: 25 de Mayo 350",
  ],

  /* ---- HERO: frase de bienvenida + foto cambiable (cambiala por ocasión/promo) ---- */
  BIENVENIDA: "Todo para consentir a quien más querés",
  SUBTITULO: "Alimento y accesorios para perros y gatos de las mejores marcas, a precio de promo. En Córdoba y con envíos a domicilio.",
  // Foto del hero — reemplazá la URL (o subí una imagen y poné su nombre) cuando quieras cambiarla.
  HERO_FOTO: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1100",

  /* ---- redes (dejá "" las que no uses) ---- */
  INSTAGRAM: "https://instagram.com/",
  FACEBOOK: "https://facebook.com/",
};
