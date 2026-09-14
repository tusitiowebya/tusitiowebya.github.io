/* ─────────────────────────────────────────────────────────────
   MyD HOGAR — configuración del negocio (archivo público, sin credenciales)
   ─────────────────────────────────────────────────────────────
   CATÁLOGO CONECTADO A COBROS (cuenta real, slug "myd-hogar")

   La web arranca con la copia del catálogo que vive en
   catalogo-snapshot.js (productos con precio del panel, tomada el
   14/09/2026) y en paralelo le pide a CobrOS el catálogo en vivo:

     GET {API}/catalogo/myd-hogar/web   ← versión liviana para webs
       (sin fotos en base64, sin el tope de 300 productos)

   Si esa ruta todavía no está publicada en el backend, la web se
   queda con la copia y NO baja el catálogo viejo (/catalogo/:slug),
   que para este negocio pesa 23 MB y corta en 300 productos.

   Los pedidos se registran siempre en CobrOS
   (POST {API}/catalogo/myd-hogar/pedido) y después se abren en WhatsApp.

   CÓMO SE ORDENA EL CATÁLOGO
   El panel tiene 1.400 productos sin categoría, así que la web
   deduce el rubro por el nombre (RUBROS.match). Si el producto tiene
   categoría cargada y el nombre no dice nada, se usa RUBROS.cats.
   ───────────────────────────────────────────────────────────── */
window.NEGOCIO = {
  NOMBRE: "MyD HOGAR",
  CIUDAD: "San Miguel de Tucumán",
  DIRECCION: "Inca Garcilaso de la Vega 45",

  WA: "5493814474176",
  WA_VISIBLE: "381 447-4176",
  TEL: "+543815122294",
  TEL_VISIBLE: "381 512-2294",
  EMAIL: "mydhogar@outlook.com",
  WA_TEXTO: "Hola MyD HOGAR, quiero hacer un pedido:",

  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
  SLUG: "myd-hogar",
  SNAPSHOT_FECHA: "14/09/2026",
  TIMEOUT_MS: 8000,
  TIMEOUT_PEDIDO_MS: 15000,

  // Localidades donde MyD ya tiene clientes (del sistema de cobros).
  ZONAS: ["San Miguel de Tucumán", "Leales", "Santa Ana", "Cruz Alta", "Concepción", "Alberdi",
          "Alderetes", "Aguilares", "Banda del Río Salí", "Graneros", "Tafí Viejo", "Lamadrid", "San Andrés"],

  /* Rubros. `match` = palabras del nombre (sin acentos, palabra entera,
     acepta plural). El orden importa: gana el primero que coincide. */
  RUBROS: [
    { id: "aberturas", nombre: "Aberturas", sala: "puerta",
      match: ["puerta", "ventana", "picaporte", "cerradura", "reja"], excluir: ["ropero", "mostrador", "armario", "placard"],
      cats: ["aberturas"] },
    { id: "chicos", nombre: "Juguetería", sala: "chicos",
      match: ["juguete", "infantil", "muneca", "muneco", "dolls", "kaibibi", "labubu", "stich", "princess", "k pop",
              "beauty bomb", "beautybomo", "beauty paleta", "make up series", "jewellery", "bijouteria", "pulsera",
              "cuentas", "gomitas", "beading", "bloques", "blocks", "gear", "trencito", "pop it", "varita", "toys",
              "balloons", "bubble", "tricycle", "submarino", "helicoptero", "helicopter", "avion", "aircraft",
              "control remoto", "speed car", "circuito", "caja registradora", "cash register", "maletin medico",
              "pizarra", "pelota", "diana", "pistola", "poker", "naipe", "cartas", "basta", "tic tac", "memory",
              "greedy", "fishing", "football arena", "juego de mesa", "zippy", "playmat"],
      cats: ["jugueteria"] },
    { id: "herramientas", nombre: "Herramientas y aire libre", sala: "patio",
      match: ["herramienta", "herramientas", "destornillador", "set de pinzas", "bordeadora", "inflador", "escalera",
              "bicicleta", "bici", "linterna", "luz frontal", "monopatin", "piloto", "mochila", "carpa", "bomba de agua"],
      cats: ["bicicletas", "temporada"] },
    { id: "clima", nombre: "Climatización", sala: "living",
      match: ["aire acondicionado", "estufa", "caloventor", "calefactor", "ventilador"], cats: ["climatizacion"] },
    { id: "electro", nombre: "Electrodomésticos", sala: "cocina",
      match: ["heladera", "lavarropa", "secarropa", "microondas", "horno", "aspiradora", "anafe", "campana extractora",
              "calefon", "freezer", "cocina a gas"], cats: ["cocina y hornos"] },
    { id: "dormitorio", nombre: "Colchones y dormitorio", sala: "dormitorio",
      match: ["colchon", "somier", "respaldo", "almohada", "cama", "cucheta", "bata"], cats: ["colchones y somiers"] },
    { id: "bano", nombre: "Baño y agua", sala: "bano",
      match: ["ducha", "griferia", "canilla", "tanque", "bacha"], cats: [] },
    { id: "cuidado", nombre: "Cuidado personal", sala: "bano",
      match: ["planchita", "secador", "rizador", "cepillo secador", "manicura", "unas", "tensiometro", "baby care",
              "espejo", "vanity"], cats: ["cuidado personal"] },
    { id: "cocina", nombre: "Cocina y bazar", sala: "cocina",
      match: ["olla", "cacerola", "sarten", "bifera", "tramontina", "cuchillo", "cuchillos", "pinza para", "espatula",
              "pisa papas", "cortador", "vajilla", "escurridor", "seca platos", "condimentero", "especiero", "molinillo",
              "picadora", "mixer", "batidora", "sandwichera", "cafetera", "pava", "cascada", "encendedor", "asador",
              "churrasco", "utensilios", "termo", "tumbler", "vaso", "bandeja", "botella"], cats: [] },
    { id: "deco", nombre: "Luces y deco", sala: "living",
      match: ["lampara", "luz de mesa", "luz led", "luz usb", "tira led", "cartel luminoso", "atomizador"], cats: [] },
    { id: "muebles", nombre: "Muebles", sala: "living",
      match: ["modular", "ropero", "armario", "cajonera", "silla", "mesa auxiliar", "mesa", "mostrador", "biblioteca",
              "rack", "perchero", "organizador", "estante", "zapatos", "botinero", "alacena", "bajo mesada", "placard",
              "escritorio", "aparador"], cats: ["pino", "muebles melamina", "muebles de cano", "comercial"] },
    { id: "tecno", nombre: "Tecnología y celulares", sala: "living",
      match: ["celular", "galaxy", "auricular", "auriculares", "ultrapods", "parlante", "smartwatch", "cable", "cargador",
              "power bank", "mouse", "proyector", "camara", "videovigilancia", "dualsense", "dualshock", "doubleshock", "playstation",
              "consola", "tv stick", "video game", "drone", "aro de luz", "tripode", "pilas", "adaptador", "soporte tv",
              "soporte universal"], cats: ["tecnologia", "celulares", "tv y audio"] }
  ],
  RUBRO_DEFAULT: { id: "varios", nombre: "Hogar y varios", sala: "living" },

  /* Ambientes de "Armá tu casa". */
  SALAS: [
    { id: "cocina", nombre: "Cocina", copy: "Heladera, horno, anafe y todo el bazar para cocinar todos los días." },
    { id: "living", nombre: "Living", copy: "El aire para el verano, la estufa para el invierno, muebles y tecnología." },
    { id: "dormitorio", nombre: "Dormitorio", copy: "Un buen colchón cambia el día entero. Somier, respaldo y almohadas." },
    { id: "chicos", nombre: "Cuarto de los chicos", copy: "Juguetes, juegos de mesa y regalos para que se note el cumpleaños." },
    { id: "bano", nombre: "Baño", copy: "Grifería, ducha y lo de todos los días: secador, planchita, espejo." },
    { id: "patio", nombre: "Patio y garage", copy: "Herramientas, escaleras, bici y lo que hace falta para arreglar la casa." },
    { id: "puerta", nombre: "Aberturas", copy: "Puertas de chapa y placa, ventanas de aluminio y de chapa reforzada." }
  ]
};
