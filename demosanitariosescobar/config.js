/* ─────────────────────────────────────────────────────────────
   SANITARIOS ESCOBAR — configuración del negocio
   Venta de artículos para instalaciones sanitarias (agua, gas,
   calefacción, piscinas, tanques, bombas). Escobar, Buenos Aires.

   Sin catálogo de precios público: la web arma la consulta por
   rubro (no por SKU) y la manda por WhatsApp ya redactada.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "Sanitarios Escobar",
  CIUDAD: "Escobar, Buenos Aires",
  INSTAGRAM: "@sanitariosescobar",
  INSTAGRAM_URL: "https://instagram.com/sanitariosescobar",

  WA: "5493484670374",
  WA_VISIBLE: "348 467-0374",
  WA_TEXTO: "Hola Sanitarios Escobar, quiero hacer una consulta:",

  RUBROS: [
    {
      id: "griferia",
      nombre: "Grifería y canillas",
      img: "img/grifo.jpg",
      copy: "Monocomandos, canillas de cocina y baño, duchas y accesorios cromados.",
      items: ["Monocomandos", "Canillas de cocina y baño", "Duchas y grifería para ducha", "Accesorios cromados"]
    },
    {
      id: "canerias",
      nombre: "Cañerías y conexiones",
      img: "img/canios.jpg",
      copy: "Caños, codos, uniones y accesorios para agua fría y caliente.",
      items: ["Caños de PVC y termofusión", "Codos y uniones", "Llaves de paso", "Accesorios roscados"]
    },
    {
      id: "gas",
      nombre: "Gas",
      img: "img/gas.jpg",
      copy: "Reguladores, válvulas y accesorios para instalaciones de gas.",
      items: ["Reguladores de presión", "Válvulas de gas", "Mangueras y abrazaderas", "Accesorios para garrafa y red"]
    },
    {
      id: "calefaccion",
      nombre: "Calefacción y termotanques",
      img: "img/calefon.jpg",
      copy: "Termotanques, calefones y repuestos para agua caliente todo el año.",
      items: ["Termotanques", "Calefones", "Repuestos y válvulas de seguridad", "Instalación y asesoramiento"]
    },
    {
      id: "piletas",
      nombre: "Piletas y filtrado",
      img: "img/pileta.jpg",
      copy: "Equipos de filtrado, bombas para pileta y accesorios de mantenimiento.",
      items: ["Filtros de arena y cartucho", "Bombas para pileta", "Mangueras y conexiones", "Accesorios de limpieza"]
    },
    {
      id: "tanques",
      nombre: "Tanques de agua",
      img: "img/tanque.jpg",
      copy: "Tanques de distintas capacidades para tu casa, campo o negocio.",
      items: ["Tanques de 500 a 1500 L", "Tapas y flotantes", "Bases y accesorios de montaje"]
    },
    {
      id: "bombas",
      nombre: "Bombas de agua",
      img: "img/bomba.jpg",
      copy: "Bombas periféricas, centrífugas y presurizadores para toda la casa.",
      items: ["Bombas periféricas", "Bombas centrífugas", "Presurizadores", "Repuestos y mantenimiento"]
    }
  ]
};
