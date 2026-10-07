/* Catálogo inicial de Luz Buena: productos, precios y aromas tomados de sus
   publicaciones (flyers e Instagram @luz_buena, octubre 2026).
   Cuando el comercio cargue su catálogo en CobrOS, la tienda usa esos datos y
   de acá solo toma las opciones de aroma (por nombre) y las energías. */
(function () {
  var AROMAS_ESENCIA = ['Sándalo', 'Lavanda', 'Limón', 'Chicle', 'Colonia bebé', 'Coco', 'Citronella', 'Jazmín',
    'Frutos rojos', 'Naranja pimienta', 'Auto sport', 'Sandía', 'Coniglio', 'Verbena', 'Maracuyá limón',
    'Manzana canela', 'Uva', 'Rosas', 'Patio Bulrich', 'Vainilla (solo color original)', 'Vainicoco (solo color original)'];
  var AROMAS_KIT = ['Limón', 'Sándalo', 'Colonia bebé', 'Chicle', 'Jazmín', 'Naranja pimienta', 'Uva', 'Maracuyá limón', 'Vainicoco'];
  var AROMAS_TRIPLE = ['Surtidos', 'Naranja pimienta', 'Nardo', 'Reina de la noche', 'Sándalo', 'Frutos rojos', '7 poderes',
    'Limón', 'Yagra', 'Mirra', 'Coco', 'Incienso', 'Energía limpia'];
  var SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  var A_COORDINAR = ['A coordinar por WhatsApp'];

  window.LUZ_CATS = [
    { id: 'sahumerios', nombre: 'Sahumerios' },
    { id: 'difusores', nombre: 'Difusores y esencias' },
    { id: 'energia', nombre: 'Rocíos y bombitas' },
    { id: 'kits', nombre: 'Kits y regalos' },
    { id: 'souvenirs', nombre: 'Souvenirs' },
    { id: 'fuentes', nombre: 'Fuentes de agua' },
    { id: 'stickers', nombre: 'Stickers' }
  ];

  window.LUZ_ENERGIAS = [
    { id: 'abundancia', nombre: 'Abundancia', color: '#E9B949', frase: 'Prosperidad, riqueza y oportunidades.' },
    { id: 'limpieza', nombre: 'Limpieza', color: '#7FB77E', frase: 'Purificar ambientes y renovar la energía.' },
    { id: 'caminos', nombre: 'Abrir caminos', color: '#A98BE0', frase: 'Liberar bloqueos y avanzar con claridad.' },
    { id: 'proteccion', nombre: 'Protección', color: '#6F9BEA', frase: 'Mantener tu energía limpia y en equilibrio.' },
    { id: 'calma', nombre: 'Calma', color: '#F2A7BC', frase: 'Armonía, equilibrio y un rincón que relaja.' },
    { id: 'regalo', nombre: 'Para regalar', color: '#F0A35E', frase: 'Detalles listos para sorprender.' }
  ];

  window.LUZ_PRODUCTOS = [
    { id: 'kit-aromas', nombre: 'Kit Aromas: spray textil + difusor ambiental', categoria: 'kits', precio: 11000, unidad: 'kit',
      descripcion: 'Spray textil y difusor ambiental del mismo aroma. Presentación cuidada, lista para regalar.',
      foto: 'media/p/kit-aromas.svg', ilustracion: true, opciones: AROMAS_KIT, opcionLabel: 'Aroma', energia: ['regalo'], madre: true, nuevo: true },
    { id: 'kit-energetico', nombre: 'Kit energético Día de la Madre', categoria: 'kits', precio: 15000, unidad: 'kit',
      descripcion: 'Sahumador con bombitas x 5 unidades, sahumerios surtidos x 10 unidades y difusor.',
      foto: 'media/p/kit-energetico.webp', energia: ['regalo', 'limpieza'], madre: true },
    { id: 'cascada-piedritas', nombre: 'Cascada de humo con 10 conitos + sahumerios con piedritas', categoria: 'kits', precio: 12000, unidad: 'kit',
      descripcion: 'Cascada de humo, 10 conitos y sahumerios con piedritas, en caja de regalo.',
      foto: 'media/p/cascada-piedritas.webp', energia: ['regalo', 'calma'], madre: true },
    { id: 'difusor', nombre: 'Difusor aromático', categoria: 'difusores', precio: 6000, unidad: 'unidad',
      descripcion: 'Difusor con varillas y moño, ideal para regalar.',
      foto: 'media/p/difusor.webp', energia: ['regalo', 'calma'], madre: true },
    { id: 'esencia-litro', nombre: 'Esencia para difusor premium (1 litro)', categoria: 'difusores', precio: 9000, unidad: 'litro',
      descripcion: 'Esencia líquida para difusor por litro. 21 aromas para elegir.',
      foto: 'media/p/esencia-litro.webp', opciones: AROMAS_ESENCIA, opcionLabel: 'Aroma', energia: ['calma'], destacado: true },
    { id: 'kit-emprendedor', nombre: 'Kit Emprendedor para armar difusores', categoria: 'kits', precio: 15000, unidad: 'kit',
      descripcion: '1 litro de esencia líquida a elección, 5 difusores de 125 ml con tapa y varillas de madera. Podés sumar el logo de tu emprendimiento.',
      foto: 'media/p/kit-emprendedor.webp', opciones: AROMAS_ESENCIA, opcionLabel: 'Aroma de la esencia', energia: ['regalo'], destacado: true },
    { id: 'triple-empaste', nombre: 'Sahumerios triple empaste x 10', categoria: 'sahumerios', precio: 1200, unidad: 'paquete de 10',
      descripcion: 'Triple empaste, aromas intensos y larga duración. Surtidos o a elección.',
      foto: 'media/p/triple-empaste.webp', opciones: AROMAS_TRIPLE, opcionLabel: 'Aroma', energia: ['limpieza'], destacado: true },
    { id: 'tibetano-sandalo', nombre: 'Tibetanos Slim Aromanza · Sándalo Hindú', categoria: 'sahumerios', precio: 1500, unidad: 'caja',
      descripcion: 'Sahumerio tibetano slim "Sándalo".', foto: 'media/p/tibetano-sandalo.webp', energia: ['calma'] },
    { id: 'tibetano-dinero', nombre: 'Tibetanos Slim Aromanza · Atrae Dinero', categoria: 'sahumerios', precio: 1500, unidad: 'caja',
      descripcion: 'Sahumerio tibetano slim "Dinero".', foto: 'media/p/tibetano-dinero.webp', energia: ['abundancia'] },
    { id: 'tibetano-naranja', nombre: 'Tibetanos Slim Aromanza · Naranja Pimienta', categoria: 'sahumerios', precio: 1500, unidad: 'caja',
      descripcion: 'Sahumerio tibetano slim "Atracción".', foto: 'media/p/tibetano-naranja.webp', energia: ['abundancia'] },
    { id: 'tibetano-diamante', nombre: 'Tibetanos Slim Aromanza · Diamante Negro', categoria: 'sahumerios', precio: 1500, unidad: 'caja',
      descripcion: 'Sahumerio tibetano slim "Aquí y Ahora".', foto: 'media/p/tibetano-diamante.webp', energia: ['proteccion'] },
    { id: 'cascada-conitos', nombre: 'Cascada de humo + 10 conitos', categoria: 'sahumerios', precio: 5500, unidad: 'combo',
      descripcion: 'Cascada de humo con 10 conitos.', foto: 'media/p/cascada-conitos.webp', energia: ['calma'], destacado: true },
    { id: 'bombitas-abundancia', nombre: 'Bombitas de defumación · Abundancia infinita x 5', categoria: 'energia', precio: 1000, unidad: 'bolsita de 5',
      descripcion: 'Atrae prosperidad, riqueza y oportunidades.', foto: 'media/p/bombitas-abundancia.webp', energia: ['abundancia'] },
    { id: 'bombitas-limpieza', nombre: 'Bombitas de defumación · Limpieza energética x 5', categoria: 'energia', precio: 1000, unidad: 'bolsita de 5',
      descripcion: 'Purifica ambientes y personas. Limpia energías pesadas y renueva tu campo energético.', foto: 'media/p/bombitas-limpieza.webp', energia: ['limpieza'] },
    { id: 'bombitas-destrabe', nombre: 'Bombitas de defumación · Destrabe x 5', categoria: 'energia', precio: 1000, unidad: 'bolsita de 5',
      descripcion: 'Libera bloqueos y obstáculos. Abre caminos y te ayuda a avanzar con claridad y ligereza.', foto: 'media/p/bombitas-destrabe.webp', energia: ['caminos'] },
    { id: 'rocio-aura', nombre: 'Rocío Áurico · Regenerador de Aura', categoria: 'energia', precio: 3000, unidad: 'spray',
      descripcion: 'Armoniza, equilibra y revitaliza tu energía.', foto: 'media/p/rocio-aura.webp', energia: ['calma'] },
    { id: 'rocio-proteccion', nombre: 'Rocío Áurico · Protección Energética', categoria: 'energia', precio: 3000, unidad: 'spray',
      descripcion: 'Te ayuda a mantener tu energía limpia y en equilibrio.', foto: 'media/p/rocio-proteccion.webp', energia: ['proteccion', 'limpieza'] },
    { id: 'souvenirs-x10', nombre: 'Souvenirs: 10 difusores de 125 ml con sticker', categoria: 'souvenirs', precio: 30000, unidad: 'pack de 10',
      descripcion: 'Para cumpleaños, 15 años y casamientos. Con el aroma que más te guste y sticker.',
      foto: 'media/p/souvenirs.webp', opciones: A_COORDINAR, opcionLabel: 'Aroma', energia: ['regalo'], evento: true },
    { id: 'comunion-x10', nombre: 'Difusores para Comunión x 10', categoria: 'souvenirs', precio: 30000, unidad: 'pack de 10',
      descripcion: 'Aroma a elección, sticker personalizado y presentación en bolsita con moño del color que elijas.',
      foto: 'media/p/comunion.webp', opciones: A_COORDINAR, opcionLabel: 'Aroma', energia: ['regalo'], evento: true },
    { id: 'fuente-mini', nombre: 'Fuente de agua mini facetada con motor y LED (13,5 cm)', categoria: 'fuentes', precio: 35000, unidad: 'unidad',
      descripcion: 'Fuente decorativa con luz LED de color. Ideal para el hogar, la oficina o tu emprendimiento.',
      foto: 'media/p/fuente-mini.webp', energia: ['calma'], destacado: true },
    { id: 'fuente-3caidas', nombre: 'Fuente de agua 3 caídas, plato con motor y LED (26 cm)', categoria: 'fuentes', precio: 45500, unidad: 'unidad',
      descripcion: 'Tres caídas de agua con luz LED de color. El sonido del agua crea un ambiente relajante.',
      foto: 'media/p/fuente-3caidas.webp', energia: ['calma'] },
    { id: 'stickers-signos', nombre: 'Sticker de tu signo', categoria: 'stickers', precio: 1000, unidad: 'unidad',
      descripcion: 'Los 12 signos del zodíaco, para llevar el tuyo siempre con vos.',
      foto: 'media/p/stickers-signos.svg', ilustracion: true, opciones: SIGNOS, opcionLabel: 'Signo', energia: ['regalo'] }
  ];

  /* Productos que Luz Buena publica sin precio: se consultan por WhatsApp. */
  window.LUZ_CONSULTAS = [
    { id: 'piedritas', nombre: 'Sahumerios con piedritas de intención · Aromanza Crystal Scents',
      descripcion: 'Amatista (calma), turmalina (protección), jade verde (abundancia), cuarzo rosa (amor) y ojo de tigre (fuerza).',
      foto: 'media/p/piedritas.webp', energia: ['calma', 'proteccion', 'abundancia'] },
    { id: 'esencias-solidas', nombre: 'Esencias sólidas para hornito · Aromanza',
      descripcion: 'Limón (renueva y abre caminos), naranja pimienta (energía y alegría) y diamante negro (protección y limpieza profunda).',
      foto: 'media/p/esencias-solidas.webp', energia: ['caminos', 'proteccion', 'limpieza'] },
    { id: 'lamparas-sal', nombre: 'Lámparas de sal',
      descripcion: 'Consultá modelos y disponibilidad.', foto: '', energia: ['calma'] }
  ];
})();
