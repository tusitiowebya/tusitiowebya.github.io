/* ─────────────────────────────────────────────────────────────
   MAju — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   CATÁLOGO CONECTADO (CobrOS) — TODO ESTÁ LISTO, FALTA LA CUENTA
   ────────────────────────────────────────────────────────────
   Hoy MAju todavía no tiene panel de CobrOS, así que la web muestra
   el catálogo de muestra que vive en store.js (FALLBACK).

   Cuando se cree la cuenta (HANDOFF-MIMO-LANDINGS.md §5.1):
     1. Dar de alta el tenant y subir el plan a WEB_TIENDA
        (el trial corta a los 3 productos — subir el plan ANTES
        de sembrar el catálogo).
     2. Escribir acá abajo el SLUG que devolvió el alta.
     3. Listo: no hay que tocar nada más. store.js arranca con el
        catálogo de muestra, pide el real a CobrOS con timeout de 8 s
        y lo reemplaza cuando llega. Si el panel no responde, la web
        nunca queda vacía.

   CÓMO CARGAR LOS PRODUCTOS EN EL PANEL PARA QUE LA WEB LOS ENTIENDA
   ────────────────────────────────────────────────────────────
   El modelo Producto de CobrOS no tiene campos de talle ni de ocasión,
   así que la web los lee desde `descripcion`, separados por " · ":

     nombre:      Vestido midi de punto
     categoria:   Vestidos            (así, con acento — la web lo normaliza)
     precio:      76900
     descripcion: Talles 1 al 4 · Morley · Oficina · Noche
     foto:        (la foto de la prenda)

   - El ítem que arranca con "Talles" arma el selector de talles.
   - Los ítems que coinciden con una ocasión de PLANES (abajo) alimentan
     el armador de looks "Vestir con propósito".
   - El resto queda como chips de tela/detalle en la ficha.
   Un producto sin ocasiones igual se muestra: solo no aparece en el
   armador de looks.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "MAju",
  CIUDAD: "La Plata",
  WA: "5492216824635",
  WA_TEXTO: "Hola MAju, quiero hacer un pedido:",
  IG: "majulaplataa",
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",

  // ← Completar cuando exista la cuenta. Vacío = catálogo de muestra.
  SLUG: "",

  TIMEOUT_MS: 8000,
  TIMEOUT_PEDIDO_MS: 15000,

  /* Ocasiones del armador de looks. La clave es el slug interno;
     `match` son las palabras que se buscan en la descripción del panel. */
  PLANES: [
    { id: "oficina", nombre: "Oficina y facultad", match: ["oficina", "trabajo", "facultad"],
      copy: "Prendas que aguantan el día entero sin que tengas que pensarlas." },
    { id: "juntada", nombre: "Juntada de tarde",   match: ["juntada", "tarde", "café"],
      copy: "Algo lindo y cómodo: salís del laburo y vas derecho." },
    { id: "noche",   nombre: "Salida de noche",    match: ["noche", "salida"],
      copy: "Para cuando querés que la prenda hable antes que vos." },
    { id: "finde",   nombre: "Finde relajado",     match: ["finde", "relajado", "casual"],
      copy: "Ropa de estar bien, sin bajar el nivel." },
    { id: "evento",  nombre: "Evento o fiesta",    match: ["evento", "fiesta", "casamiento"],
      copy: "Civil, cumple de 40, casamiento de día. Sin comprar algo que usás una vez." }
  ]
};
