/* ─────────────────────────────────────────────────────────────
   Ventas Mateo — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   VIDRIERA CONECTADA A CobrOS — TODO LISTO, FALTA LA CUENTA
   ────────────────────────────────────────────────────────────
   Hoy el negocio no tiene panel de CobrOS: con SLUG vacío la
   vidriera muestra su estado vacío (nunca productos inventados).

   Cuando se cree la cuenta (HANDOFF-MIMO-LANDINGS.md §5.1):
     1. Dar de alta el tenant y subir el plan a WEB_TIENDA
        (el trial corta a los 3 productos: subir el plan ANTES
        de cargar el catálogo).
     2. Escribir acá abajo el SLUG que devolvió el alta.
     3. Listo. catalogo.js pide los productos con timeout de 8 s;
        si el panel no responde, muestra el aviso de error con el
        WhatsApp y la página nunca queda colgada en "cargando".

   CÓMO CARGAR LOS PRODUCTOS EN EL PANEL
   ────────────────────────────────────────────────────────────
     nombre:      Nombre del producto
     categoria:   el rubro (Bazar, Librería, Limpieza…) → arma los filtros
     precio:      el valor en pesos (0 = "Consultar")
     descripcion: detalle corto (medida, color, unidades)
     foto:        la foto del producto
   "Sumar a la lista" lo agrega a la bolsa de "Pasanos tu lista"
   y viaja en el mismo WhatsApp.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Ventas Mateo",
  WA: "5492226444745",
  WA_VISIBLE: "2226 44-4745",
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",

  // ← Completar cuando exista la cuenta. Vacío = vidriera en estado vacío.
  SLUG: "",

  TIMEOUT_MS: 8000
};
