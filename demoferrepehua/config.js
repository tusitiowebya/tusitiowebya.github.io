/* ─────────────────────────────────────────────────────────────
   FERREPEHUA — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   CATÁLOGO CONECTADO (CobrOS):
   Cuando el negocio tenga su panel de CobrOS, completá SLUG con
   el slug del tenant. La landing pasa automáticamente a leer los
   productos reales desde el panel (con timeout de 8 s y fallback
   al catálogo local de abajo si el servicio no responde).
   Mientras SLUG esté vacío, se muestra el catálogo destacado
   cargado en script.js.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Ferrepehua",
  WA: "5492396616927",
  WA_TEXTO: "Hola Ferrepehua, quiero hacer un pedido:",
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
  SLUG: "",          // ej: "ferrepehua"  ← activa el catálogo en vivo
  TIMEOUT_MS: 8000
};
