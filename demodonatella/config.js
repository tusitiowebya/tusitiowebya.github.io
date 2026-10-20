/* ─────────────────────────────────────────────────────────────
   Fragancias Donatella — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   VITRINA CONECTADA A CobrOS — TODO LISTO, FALTA LA CUENTA
   ────────────────────────────────────────────────────────────
   Hoy el negocio todavía no tiene panel de CobrOS: con SLUG vacío
   la vitrina muestra su estado vacío (nunca productos inventados).

   Cuando se cree la cuenta (HANDOFF-MIMO-LANDINGS.md §5.1):
     1. Dar de alta el tenant y subir el plan a WEB_TIENDA
        (el trial corta a los 3 productos: subir el plan ANTES
        de cargar el catálogo).
     2. Escribir acá abajo el SLUG que devolvió el alta.
     3. Listo. catalogo.js pide los productos con timeout de 8 s;
        si el panel no responde, muestra el aviso de error con el
        WhatsApp y la página nunca queda colgada en "cargando".

   CÓMO CARGAR LOS TESTERS EN EL PANEL
   ────────────────────────────────────────────────────────────
     nombre:      Marca - Nombre del perfume
     categoria:   Para ella / Para él / Unisex (o la que usen)
     precio:      el valor en pesos
     descripcion: 100 ml · Eau de parfum · Con tapa
     foto:        la foto del tester
   La categoría arma los filtros de la vitrina; la descripción va
   debajo del nombre. "Sumar a la consulta" agrega el perfume a la
   caja tester de "Pedí precio" y viaja en el mismo WhatsApp.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Fragancias Donatella",
  WA: "5491124729304",
  WA_VISIBLE: "11 2472-9304",
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",

  // ← Completar cuando exista la cuenta. Vacío = vitrina en estado vacío.
  SLUG: "",

  TIMEOUT_MS: 8000
};
