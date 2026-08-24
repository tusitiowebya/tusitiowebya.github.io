// Config de conexión a CobrOS (catálogo real + pedidos + cobros).
// Hoy Saga Tienda no tiene cuenta CobrOS todavía — el catálogo de abajo
// es un array estático en script.js con productos de ejemplo.
//
// Cuando se cree la cuenta (ver HANDOFF-MIMO-LANDINGS.md §5.1):
//   1. Completar SLUG con el slug real que devuelve el alta.
//   2. Poner ACTIVO en true.
//   3. Reemplazar la carga estática de script.js por un fetch a
//      `${API}/catalogo/${SLUG}` — ver tusitiowebya.github.io/demoferrepehua/store.js
//      como referencia de implementación (fetch con timeout + carrito compartido).
window.NEGOCIO = {
  ACTIVO: false,
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
  SLUG: "",
  WA: "5493765070285",
};
