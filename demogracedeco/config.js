/* ─────────────────────────────────────────────────────────────
   Grace Deco — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   CATÁLOGO CONECTADO (CobrOS) — TODO ESTÁ LISTO, FALTA LA CUENTA
   ────────────────────────────────────────────────────────────
   Hoy Grace Deco todavía no tiene panel de CobrOS, así que la web
   muestra el catálogo de muestra que vive en store.js (FALLBACK).

   Cuando se cree la cuenta (HANDOFF-MIMO-LANDINGS.md §5.1):
     1. Dar de alta el tenant y subir el plan a WEB_TIENDA
        (el trial corta a los 3 productos — subir el plan ANTES
        de sembrar el catálogo).
     2. Escribir acá abajo el SLUG que devolvió el alta.
     3. Listo, no hay que tocar nada más: store.js arranca con el
        catálogo de muestra, le pide el real a CobrOS con timeout de
        8 s y lo reemplaza cuando llega. Si el panel no responde, la
        web nunca queda vacía ni colgada en "cargando".

   CÓMO CARGAR LOS PRODUCTOS EN EL PANEL PARA QUE LA WEB LOS ENTIENDA
   ────────────────────────────────────────────────────────────
   El modelo Producto de CobrOS no tiene campos de medidas ni de
   ambiente, así que la web los lee desde `descripcion`, separados
   por " · ":

     nombre:      Florero de cerámica arenisca
     categoria:   Floreros y vasijas       (así, con acento — la web lo normaliza)
     precio:      38900
     descripcion: Living · Comedor · 32 cm de alto · Cerámica esmaltada
     foto:        (la foto del producto)

   - Los ítems que coinciden con un ambiente de AMBIENTES (abajo)
     arman los filtros por ambiente y alimentan "Las medidas justas".
   - Los ítems con formato "NN cm" / "NNxNN cm" se muestran como medida.
   - El resto queda como chips de material/detalle en la ficha.
   Un producto sin ambiente igual se muestra: solo no aparece en las
   sugerencias por ambiente.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Grace Deco",
  CIUDAD: "Tigre, Buenos Aires",

  WA: "5491166519721",
  WA_TEXTO: "Hola Grace Deco, quiero hacer un pedido:",
  IG: "gracedeco__",

  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",

  // ← Completar cuando exista la cuenta. Vacío = catálogo de muestra.
  SLUG: "",

  TIMEOUT_MS: 8000,
  TIMEOUT_PEDIDO_MS: 15000,

  /* Ambientes. La clave es el slug interno; `match` son las palabras
     que se buscan en la descripción del panel. */
  AMBIENTES: [
    { id: "living",     nombre: "Living",     match: ["living", "estar", "sala"],
      foto: "img/amb-living.jpg",
      copy: "El ambiente que ve todo el mundo. Textura, luz cálida y una pieza que mande." },
    { id: "dormitorio", nombre: "Dormitorio", match: ["dormitorio", "habitacion", "cuarto"],
      foto: "img/amb-dormitorio.jpg",
      copy: "Capas blandas y luz baja: lo que hace que un cuarto se sienta hotel." },
    { id: "comedor",    nombre: "Comedor",    match: ["comedor", "cocina", "mesa"],
      foto: "img/amb-comedor.jpg",
      copy: "Un centro de mesa que no estorbe y una luz a la altura justa." },
    { id: "entrada",    nombre: "Entrada",    match: ["entrada", "hall", "recibidor", "pasillo"],
      foto: "img/amb-entrada.jpg",
      copy: "Dos metros cuadrados que dan la primera impresión de toda la casa." }
  ]
};
