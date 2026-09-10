/* ─────────────────────────────────────────────────────────────
   Perfumes GG — configuración del negocio
   Archivo público, sin credenciales.
   ─────────────────────────────────────────────────────────────
   CATÁLOGO CONECTADO (CobrOS) — TODO ESTÁ LISTO, FALTA LA CUENTA
   ────────────────────────────────────────────────────────────
   Hoy Perfumes GG todavía no tiene panel de CobrOS, así que la web
   muestra el catálogo de muestra que vive en store.js (FALLBACK).

   Cuando se cree la cuenta (HANDOFF-MIMO-LANDINGS.md §5.1):
     1. Dar de alta el tenant y subir el plan a WEB_TIENDA
        (el trial corta a los 3 productos — subir el plan ANTES
        de sembrar el catálogo).
     2. Escribir acá abajo el SLUG que devolvió el alta.
     3. Listo: no hay que tocar nada más. store.js arranca con el
        catálogo de muestra, pide el real a CobrOS con timeout de 8 s
        y lo reemplaza cuando llega. Si el panel no responde, la web
        nunca queda vacía.

   CÓMO CARGAR LOS PERFUMES EN EL PANEL PARA QUE LA WEB LOS ENTIENDA
   ────────────────────────────────────────────────────────────
   El modelo Producto de CobrOS no tiene campos de familia olfativa
   ni de género, así que la web los lee desde `descripcion`,
   separados por " · ":

     nombre:      Bouquet de Jazmín
     categoria:   Florales             (así, con acento — la web lo normaliza)
     precio:      96500
     descripcion: 100 ml · Para ella · Noche · Jazmín, pera, almizcle
     foto:        (la foto del frasco)

   - El ítem que arranca con un número + "ml" arma el tamaño del frasco.
   - "Para ella" / "Para él" / "Unisex" arma el filtro de género.
   - Los ítems que coinciden con un momento de MOMENTOS (abajo)
     alimentan el buscador "Encontrá tu aroma".
   - El resto queda como notas en la ficha.
   Un perfume sin momentos igual se muestra: solo no aparece
   en el buscador de aroma.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Perfumes GG",
  CIUDAD: "Mar del Plata",
  WA: "5492235696084",
  WA_TEXTO: "Hola GG, quiero consultarles por un perfume:",
  IG: "perfumes.gg",
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",

  // ← Completar cuando exista la cuenta. Vacío = catálogo de muestra.
  SLUG: "",

  TIMEOUT_MS: 8000,
  TIMEOUT_PEDIDO_MS: 15000,

  /* Familias olfativas. `match` son las palabras que se buscan en la
     categoría del panel; `id` es el slug que usan los filtros. */
  FAMILIAS: [
    { id: "citricos",   nombre: "Cítricos",   match: ["citricos", "cítricos", "citrico"],
      resumen: "Limón, bergamota, pomelo. Livianos, limpios, para el día.",
      img: "img/p-bergamota.jpg" },
    { id: "florales",   nombre: "Florales",   match: ["florales", "floral"],
      resumen: "Jazmín, rosa, peonía. Clásicos, femeninos, siempre bien.",
      img: "img/p-jazmin.jpg" },
    { id: "amaderados", nombre: "Amaderados", match: ["amaderados", "amaderado", "maderas"],
      resumen: "Cedro, sándalo, vetiver. Secos, elegantes, de noche.",
      img: "img/p-cedro.jpg" },
    { id: "dulces",     nombre: "Dulces",     match: ["dulces", "dulce", "gourmand"],
      resumen: "Vainilla, caramelo, frutos rojos. Golosos y muy fijadores.",
      img: "img/p-vainilla.jpg" },
    { id: "orientales", nombre: "Orientales", match: ["orientales", "oriental", "ambar"],
      resumen: "Ámbar, oud, especias. Intensos, para dejar estela.",
      img: "img/p-ambar.jpg" },
    { id: "frescos",    nombre: "Frescos",    match: ["frescos", "fresco", "acuaticos", "acuáticos"],
      resumen: "Notas acuáticas y almizcle limpio. Para todos los días.",
      img: "img/p-acuatica.jpg" }
  ],

  /* Momentos del buscador "Encontrá tu aroma". La clave es el slug
     interno; `match` son las palabras que se buscan en la descripción
     del panel. */
  MOMENTOS: [
    { id: "diario",  nombre: "Todos los días",   match: ["diario", "todos los dias", "día", "dia"],
      copy: "Algo que puedas usar en la oficina, la facu o el súper sin invadir." },
    { id: "noche",   nombre: "Salida de noche",  match: ["noche", "salida"],
      copy: "Estela larga, presencia. Que se note cuando entrás." },
    { id: "verano",  nombre: "Calor y playa",    match: ["verano", "playa", "calor"],
      copy: "Livianos, que no empalaguen cuando aprieta el sol marplatense." },
    { id: "invierno",nombre: "Frío y abrigo",    match: ["invierno", "frio", "frío"],
      copy: "Notas densas que el frío sostiene todo el día." },
    { id: "regalo",  nombre: "Para regalar",     match: ["regalo", "regalar"],
      copy: "Aromas que le gustan a casi todo el mundo. Van con caja y moño." }
  ]
};
