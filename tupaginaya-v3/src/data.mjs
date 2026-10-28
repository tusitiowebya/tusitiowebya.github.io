/* =====================================================================
   TuPaginaYa · datos del sitio (única fuente de verdad)
   Todo lo que aparece en páginas, JSON-LD, sitemap y llms.txt sale de acá.
   Solo datos reales: no inventar reseñas, cifras, dirección ni redes.
   ===================================================================== */

export const SITE = {
  name: 'TuPaginaYa',
  url: 'https://tupaginaya.com.ar',
  locale: 'es_AR',
  lang: 'es-AR',
  waNumber: '5491157204355',
  waDisplay: '11 5720-4355',
  telE164: '+5491157204355',
  area: 'Argentina',
  updated: '2026-10-28',
  updatedLabel: '28 de octubre de 2026',
  tagline: 'Páginas web para negocios de toda Argentina, online en 48 horas.',
  description:
    'TuPaginaYa diseña páginas web a medida para negocios y profesionales de toda Argentina: demo gratis antes de pagar, dominio .com.ar, hosting y WhatsApp.',
};

export const wa = (text) =>
  `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;

/* ---------------------------------------------------------------------
   Planes (precios vigentes en la home al 28/10/2026)
   ------------------------------------------------------------------- */
export const PLANES = [
  {
    id: 'profesional',
    name: 'Plan Profesional',
    short: 'Tu página lista para vender.',
    monthly: 17000,
    activation: 50000,
    feats: [
      'Diseño a medida de tu rubro (no plantillas)',
      'Dominio .com.ar + hosting',
      'WhatsApp y redes integrados',
      'SEO básico: Google te encuentra por rubro y zona',
      'Soporte 24/7',
      '5 actualizaciones por mes',
      '2 correos corporativos',
    ],
    wa: 'Hola TuPaginaYa! Quiero el Plan Profesional ($17.000/mes)',
  },
  {
    id: 'catalogo',
    name: 'Web + Catálogo',
    short: 'Todo lo del Profesional, más la app CobrOS.',
    monthly: 35000,
    activation: 100000,
    popular: true,
    feats: [
      'Todo lo del Plan Profesional',
      'App CobrOS: catálogo digital que cargás vos',
      'Catálogo publicado en tu web, siempre actualizado',
      'Pedidos directos por WhatsApp',
      'Cobros integrados desde el link',
      'Ventas y pendientes a la vista',
    ],
    wa: 'Hola TuPaginaYa! Quiero el plan Web + Catálogo CobrOS ($35.000/mes)',
  },
];

export const money = (n) => '$' + n.toLocaleString('es-AR');

/* ---------------------------------------------------------------------
   Rubros: solo los que tienen trabajos reales en vivo
   ------------------------------------------------------------------- */
export const RUBROS = [
  {
    slug: 'construccion-y-hogar',
    title: 'Página web para constructoras y arquitectos | TuPaginaYa',
    desc: 'Página web para constructoras, arquitectos y oficios del hogar: galería de obras, servicios y presupuesto por WhatsApp. Ejemplos reales y demo gratis.',
    name: 'Construcción, arquitectura y hogar',
    short: 'Construcción y hogar',
    h1: 'Página web para constructoras, arquitectos y oficios del hogar',
    lead: 'Una web para mostrar obras terminadas, explicar qué hacés y recibir pedidos de presupuesto por WhatsApp con los datos de la obra.',
    needs: [
      ['Galería de obras reales', 'Antes y después, terminaciones y detalles. Es lo primero que mira quien te va a contratar.'],
      ['Servicios explicados por tipo de trabajo', 'Refacciones, ampliaciones, steel framing o muebles a medida, cada uno con su propio bloque.'],
      ['Pedido de presupuesto guiado', 'Que te llegue al WhatsApp con el tipo de trabajo, la zona y las medidas, sin ida y vuelta.'],
      ['Zona de trabajo clara', 'Barrios y localidades donde trabajás, para aparecer cuando te buscan cerca.'],
    ],
    faq: [
      ['¿Puedo subir fotos nuevas de obras después?', 'Sí. El plan incluye 5 actualizaciones por mes: nos mandás las fotos por WhatsApp y las sumamos a la galería.'],
      ['¿Sirve si trabajo solo en mi zona?', 'Sí. La web se escribe con tu zona real de trabajo para que Google te muestre a quien busca ese servicio cerca.'],
    ],
  },
  {
    slug: 'servicios-y-oficios',
    title: 'Página web para electricistas y oficios | TuPaginaYa',
    desc: 'Página web para electricistas, servicios técnicos y empresas de limpieza: servicios claros, zona de trabajo y WhatsApp a un toque. Demo gratis.',
    name: 'Servicios técnicos, limpieza y oficios',
    short: 'Servicios y oficios',
    h1: 'Página web para electricistas, servicios técnicos y empresas de limpieza',
    lead: 'Para el que vive del teléfono: una web pensada para que te escriban rápido, con tus servicios claros y la zona donde atendés.',
    needs: [
      ['Botón de WhatsApp siempre a mano', 'En celular, el contacto queda a un toque desde cualquier parte de la página.'],
      ['Servicios con lo que resolvés', 'Lista concreta de trabajos, para que el cliente sepa que hacés justo lo que necesita.'],
      ['Matrícula, garantía y forma de trabajo', 'Lo que genera confianza antes de dejar entrar a alguien a la casa o al edificio.'],
      ['Zona y horarios', 'Dónde atendés y cuándo, escrito para que Google lo entienda.'],
    ],
    faq: [
      ['¿Me sirve si no tengo local a la calle?', 'Sí. La mayoría de los oficios trabaja a domicilio: la web muestra tu zona de cobertura en vez de una dirección.'],
      ['¿Puedo poner precios?', 'Si querés, sí. Si preferís cotizar por WhatsApp, armamos el pedido para que te llegue con los datos necesarios.'],
    ],
  },
  {
    slug: 'tiendas-y-catalogos',
    title: 'Página web con catálogo online para tiendas | TuPaginaYa',
    desc: 'Página web con catálogo online para comercios y tiendas: buscador, filtros y pedidos por WhatsApp, con productos que actualizás vos desde CobrOS.',
    name: 'Tiendas, comercios y catálogos online',
    short: 'Tiendas y catálogos',
    h1: 'Página web con catálogo online para comercios y tiendas',
    lead: 'Tu catálogo publicado en tu propia web, con fotos, filtros y pedido por WhatsApp. Lo actualizás vos desde la app CobrOS.',
    needs: [
      ['Catálogo con buscador y filtros', 'Por rubro, marca o categoría, para que encuentren el producto en segundos.'],
      ['Pedido armado por WhatsApp', 'El cliente elige productos y te llega el pedido listo al chat.'],
      ['Precios y stock que cargás vos', 'Con CobrOS cambiás precios o sumás productos sin pedirle nada a nadie.'],
      ['Fotos y variantes', 'Más de una foto por producto, colores o modelos.'],
    ],
    faq: [
      ['¿Necesito el plan Web + Catálogo?', 'Si querés que los productos los cargues y actualices vos, sí: es el plan que incluye CobrOS. Si es una vidriera fija, alcanza el Plan Profesional.'],
      ['¿Puedo vender por mayor y por menor?', 'Sí. Ya hay tiendas en vivo con precios o condiciones distintas según el tipo de cliente.'],
    ],
  },
  {
    slug: 'salud-y-bienestar',
    title: 'Página web para psicólogos y terapeutas | TuPaginaYa',
    desc: 'Página web para psicólogos, terapeutas y coaches: tu enfoque, modalidades presencial u online y turnos por WhatsApp. Ejemplos reales y demo gratis.',
    name: 'Salud, terapias y coaching',
    short: 'Salud y bienestar',
    h1: 'Página web para psicólogos, terapeutas y coaches',
    lead: 'Una presencia profesional y cálida para explicar tu enfoque, tus modalidades (presencial u online) y que pidan turno por WhatsApp.',
    needs: [
      ['Enfoque y formación', 'Quién sos, cómo trabajás y para quién es tu espacio, en un lenguaje claro.'],
      ['Modalidades y lugar', 'Presencial, online o ambas, con la ciudad donde atendés.'],
      ['Turnos por WhatsApp', 'Un botón que abre el chat con un mensaje inicial, sin formularios largos.'],
      ['Tono cuidado', 'Colores, fotos y textos que transmitan calma y confianza.'],
    ],
    faq: [
      ['¿Puedo tener una web si atiendo solo online?', 'Sí. En ese caso la web se posiciona por especialidad y por "online", sin depender de una dirección.'],
      ['¿Puedo sumar talleres o cursos?', 'Sí. Se agregan como sección o subpágina con fecha, modalidad e inscripción por WhatsApp.'],
    ],
  },
  {
    slug: 'turismo-y-eventos',
    title: 'Página web para cabañas, turismo y eventos | TuPaginaYa',
    desc: 'Página web para cabañas, traslados, turismo y eventos: fotos reales, opciones claras y consulta de disponibilidad por WhatsApp. Demo gratis.',
    name: 'Turismo, alojamiento y eventos',
    short: 'Turismo y eventos',
    h1: 'Página web para cabañas, traslados, turismo y eventos',
    lead: 'Para vender una experiencia: fotos reales del lugar o de los eventos, lo que incluye cada opción y la consulta de disponibilidad por WhatsApp.',
    needs: [
      ['Galería que venda el lugar', 'Fotos y videos reales, cargados livianos para que abran rápido en el celular.'],
      ['Opciones claras', 'Cabañas, tours, traslados o paquetes, cada uno con lo que incluye.'],
      ['Consulta de disponibilidad', 'Fechas, cantidad de personas y servicio elegido, directo al WhatsApp.'],
      ['Cómo llegar y zona', 'Ubicación y alrededores, que es lo que busca el turista.'],
    ],
    faq: [
      ['¿Puedo mostrar varias propiedades o servicios?', 'Sí. Cada cabaña, tour o salón puede tener su bloque o su página propia.'],
      ['¿La web reemplaza a las plataformas de reservas?', 'No necesariamente: suma un canal propio donde el cliente te contacta directo, sin comisión.'],
    ],
  },
  {
    slug: 'industria-y-mayoristas',
    title: 'Página web para industrias y mayoristas | TuPaginaYa',
    desc: 'Página web para industrias, empresas B2B y mayoristas: productos, capacidades, cobertura y contacto comercial con correo corporativo. Demo gratis.',
    name: 'Industria, B2B y mayoristas',
    short: 'Industria y mayoristas',
    h1: 'Página web para industrias, empresas B2B y mayoristas',
    lead: 'Una web seria para clientes empresa: qué fabricás o vendés, capacidades, certificaciones y contacto comercial directo.',
    needs: [
      ['Productos y capacidades', 'Líneas de producto, servicios técnicos y alcance, sin vueltas.'],
      ['Cobertura', 'Provincia, región o todo el país, dicho con claridad.'],
      ['Contacto comercial', 'WhatsApp y correo corporativo con tu dominio.'],
      ['Imagen profesional', 'La web es la carta de presentación cuando te piden "pasame tu página".'],
    ],
    faq: [
      ['¿Incluye correos con mi dominio?', 'Sí. El Plan Profesional incluye 2 correos corporativos (por ejemplo, ventas@tuempresa.com.ar).'],
      ['¿Pueden mostrar un catálogo mayorista?', 'Sí, con el plan Web + Catálogo o como catálogo fijo dentro de la web.'],
    ],
  },
  {
    slug: 'instituciones-y-educacion',
    title: 'Página web para institutos, cursos y clubes | TuPaginaYa',
    desc: 'Página web para institutos, cursos y clubes: oferta de cursos, horarios e inscripción por WhatsApp, siempre actualizados. Ejemplos reales y demo gratis.',
    name: 'Instituciones, educación y clubes',
    short: 'Instituciones',
    h1: 'Página web para institutos, cursos y clubes',
    lead: 'Cursos, formaciones, horarios e inscripciones en un solo lugar, para dejar de responder lo mismo por mensaje todos los días.',
    needs: [
      ['Oferta de cursos o actividades', 'Cada curso con modalidad, duración y requisitos.'],
      ['Inscripción simple', 'Consulta o inscripción por WhatsApp con el curso elegido.'],
      ['Galería y comunidad', 'Fotos y videos de clases, eventos o partidos.'],
      ['Horarios y sedes', 'Siempre actualizados, gracias a las actualizaciones mensuales del plan.'],
    ],
    faq: [
      ['¿Puedo cambiar las fechas de inicio de los cursos?', 'Sí. Nos avisás por WhatsApp y lo actualizamos: el plan incluye 5 cambios por mes.'],
      ['¿Se pueden subir PDFs de programas?', 'Sí. Programas, reglamentos o fichas de inscripción se pueden descargar desde la web.'],
    ],
  },
  {
    slug: 'profesionales',
    title: 'Página web para profesionales y seguros | TuPaginaYa',
    desc: 'Página web para profesionales, productores de seguros y consultores: servicios claros, datos profesionales y contacto directo. Demo gratis.',
    name: 'Profesionales, seguros y consultoría',
    short: 'Profesionales',
    h1: 'Página web para profesionales, productores de seguros y consultores',
    lead: 'Una presencia que genera confianza antes de la primera charla: qué hacés, para quién y cómo contactarte.',
    needs: [
      ['Servicios explicados simple', 'Sin jerga: qué resolvés y en qué casos conviene consultarte.'],
      ['Datos profesionales', 'Matrícula, trayectoria o especialidad, lo que corresponda a tu actividad.'],
      ['Contacto directo', 'WhatsApp y correo con tu dominio.'],
      ['Aparecer en Google', 'Textos escritos con tu servicio y tu zona real.'],
    ],
    faq: [
      ['¿Me sirve si trabajo con referidos?', 'Sí: cuando te recomiendan, lo primero que hacen es buscarte. Una web propia confirma que sos real y profesional.'],
      ['¿Puedo tener mi nombre como dominio?', 'Sí, si está disponible. Lo registramos como parte del plan.'],
    ],
  },
  {
    slug: 'software-y-apps',
    title: 'Landing page para software, apps y SaaS | TuPaginaYa',
    desc: 'Landing page para software, apps y SaaS: el producto en acción, planes, prueba gratis y SEO para aparecer cuando buscan tu solución. Casos en vivo.',
    name: 'Software, apps y SaaS',
    short: 'Software y apps',
    h1: 'Landing page para software, apps y SaaS',
    lead: 'Para vender un producto digital: qué problema resuelve, cómo se ve por dentro, planes y prueba gratis, con el registro a un clic.',
    needs: [
      ['El producto en acción', 'Pantallas reales o recreadas de la app, no ilustraciones genéricas: que se entienda qué hace en segundos.'],
      ['Planes y prueba gratis', 'Precios o planes claros y el botón de registro o demo siempre visible.'],
      ['Funciones por problema', 'Cada función explicada por lo que le resuelve al usuario, no por cómo está hecha.'],
      ['SEO por búsqueda real', 'Textos y datos estructurados para aparecer cuando buscan "software para…" o "app para…".'],
    ],
    faq: [
      ['¿Puede convivir la landing con la app en el mismo dominio?', 'Sí. Ya lo hicimos: la landing sirve la portada y el resto de las rutas siguen yendo a la app.'],
      ['¿Incluye SEO para el producto?', 'Sí: título, descripción, datos estructurados de aplicación, imagen para compartir, robots, sitemap y llms.txt.'],
    ],
  },
];

/* ---------------------------------------------------------------------
   Trabajos en vivo (verificados el 28/10/2026: responden 200 y sin
   aviso de suspensión). `loc` solo cuando el propio sitio la declara.
   ------------------------------------------------------------------- */
export const SITIOS = [
  { s: 'ferrepehua', n: 'Ferrepehua', d: 'ferrepehua.com.ar', r: 'tiendas-y-catalogos', tipo: 'Ferretería', loc: 'Pehuajó, Buenos Aires', blurb: 'Ferretería profesional con todo el catálogo online: herramientas INGCO, TOTAL, EMTOP y WADFOW con precio final, pedido por WhatsApp y envíos a todo el país.', f: ['Catálogo completo con filtros y buscador', 'Carrito compartido entre home y catálogo', 'Catálogo conectado a CobrOS', 'Pedido por WhatsApp'], destacado: true },
  { s: 'muebleriaexpress', n: 'Mueblería Express', d: 'muebleriaexpress.shop', r: 'tiendas-y-catalogos', tipo: 'Equipamiento comercial', loc: 'Rosario, Santa Fe', blurb: 'Heladeras, exhibidoras, balanzas, hornos y muebles para comercios, con pago por día. La tienda lee el catálogo de CobrOS en vivo.', f: ['Tienda conectada al catálogo de CobrOS', 'Galería de fotos por producto y color', 'Calculadora de pago diario', 'Pedido por WhatsApp'], destacado: true },
  { s: 'dpstudio', n: 'DPSTUDIO', d: 'dpstudio.com.ar', r: 'tiendas-y-catalogos', tipo: 'Indumentaria personalizada', loc: 'Caballito, CABA', blurb: 'Diseño e indumentaria personalizada para clubes, equipos y empresas: sublimación, DTF, vinilo y bordado con taller propio.', f: ['Material real de su Instagram', 'Asistente para elegir sublimación, DTF o vinilo', 'Identidad urbana tipo graffiti', 'Presupuesto por WhatsApp'], destacado: true },
  { s: 'electrogipa', n: 'Electro Gipa', d: 'electrogipa.com.ar', r: 'servicios-y-oficios', tipo: 'Electricista matriculado', blurb: 'Electricista matriculado Cat. 2: instalaciones eléctricas, reparación de electrodomésticos y cargadores para autos eléctricos.', f: ['Tablero de térmicas interactivo', 'Servicios por tipo de trabajo', 'Consulta directa por WhatsApp'], destacado: true },
  { s: 'talleros', n: 'TallerOS', d: 'talleros.ar', r: 'software-y-apps', tipo: 'Software para talleres mecánicos', blurb: 'Software para taller mecánico: presupuestos, órdenes de trabajo, historial de cada auto, stock y QR del vehículo, desde el celular.', f: ['Landing de producto con prueba gratis', 'Planes y registro a un clic', 'App Android en Google Play'], destacado: true },
  { s: 'appseguros', n: 'SegurOS', d: 'appseguros.ar', r: 'software-y-apps', tipo: 'CRM para productores de seguros', blurb: 'CRM para productores y brokers de seguros: conecta las compañías, cotiza autos con COTI en 2 minutos y avisa cobranzas por WhatsApp.', f: ['Simulador de COTI en vivo', 'Órbita del Conector con 11 compañías', 'Landing en el mismo dominio que la app'], destacado: true },
  { s: 'appcobros', n: 'CobrOS', d: 'appcobros.ar', r: 'software-y-apps', tipo: 'App de cobros y cuenta corriente', blurb: 'Cuenta corriente por cliente, cobros recurrentes, catálogo con stock, recibos y presupuestos, y avisos automáticos de vencimiento.', f: ['Landing de producto', 'Estado de cuenta de ejemplo', 'Registro gratis'] },
  { s: 'tusventas', n: 'TusVentas', d: 'tusventas.com.ar', r: 'software-y-apps', tipo: 'Software de gestión', blurb: 'Software de gestión a medida: sistemas para talleres, productores de seguros, turnos online y comercios.', f: ['Portada de la familia de productos', 'Accesos a cada sistema', 'Desarrollos a medida'] },
  { s: 'boro', n: 'BORO Servicios Industriales', d: 'boroservicios.com.ar', r: 'industria-y-mayoristas', tipo: 'Equipos de izaje', loc: 'Tucumán', blurb: 'Fabricación y venta de aparejos eléctricos y puentes grúa, y certificación de equipos de izaje.', f: ['Navegación inspirada en el puente grúa', 'Fabricación, venta y certificación', 'Contacto por WhatsApp'] },
  { s: 'mdqvacaciones', n: 'MDQ Alquileres', d: 'mdqvacaciones.com.ar', r: 'turismo-y-eventos', tipo: 'Cabañas', loc: 'Villa Larca y Piscu Yaco, San Luis', blurb: 'Siete cabañas propias en las Sierras de los Comechingones, en tres complejos, con consulta de disponibilidad por WhatsApp.', f: ['Fotos reales de los complejos', 'Un bloque por complejo', 'Consulta de disponibilidad'] },
  { s: 'arqbelo', n: 'Cecilia Albelo Arquitectura', d: 'arqbelo.com.ar', r: 'construccion-y-hogar', tipo: 'Estudio de arquitectura', blurb: 'Proyecto, dirección de obra, refacciones, ampliaciones e interiorismo, del primer croquis a la obra terminada.', f: ['Identidad editorial', 'Servicios y obras', 'Contacto por WhatsApp'] },
  { s: 'saulpragart', n: 'Saúl Pragart', d: 'saulpragart.com.ar', r: 'construccion-y-hogar', tipo: 'Mantenimiento y deco', blurb: 'Mantenimiento edilicio, deco, arte y personalización a medida: un solo número para lo que se rompió o para una idea distinta.', f: ['Selector para contar qué se rompió', 'Servicios de mantenimiento y arte', 'Llamado y WhatsApp directos'] },
  { s: 'suarmador', n: 'Su Armador', d: 'suarmador.com.ar', r: 'construccion-y-hogar', tipo: 'Amoblamientos', blurb: 'Amoblamientos y diseño de interiores: cocinas, placares y muebles a medida con un look editorial.', f: ['Video en el hero', 'Catálogo de trabajos', 'Presupuesto por WhatsApp'] },
  { s: 'liliananasuti', n: 'Liliana Nasuti', d: 'liliananasuti.com.ar', r: 'salud-y-bienestar', tipo: 'Terapeuta holística', loc: 'Mar del Plata', blurb: 'Masajes terapéuticos, reflexología podal, drenaje linfático y Flores de Bach, con reserva de turno por WhatsApp.', f: ['Terapias explicadas una por una', 'Reserva de turno por WhatsApp', 'Tono sereno y cálido'] },
  { s: 'licgabrielabasualdo', n: 'Lic. Gabriela Basualdo', d: 'licgabrielabasualdo.com.ar', r: 'salud-y-bienestar', tipo: 'Acompañamiento terapéutico', loc: 'Comodoro Rivadavia', blurb: 'Acompañamiento terapéutico presencial y virtual, con una presencia profesional y cálida.', f: ['Estudios y alcances', 'Modalidades presencial y virtual', 'Contacto'] },
  { s: 'solramirezcoach', n: 'Sol Ramírez', d: 'solramirezcoach.com.ar', r: 'salud-y-bienestar', tipo: 'Coaching ontológico', blurb: 'Coaching ontológico con sesiones online y talleres: un sitio personal que transmite cercanía.', f: ['Servicios', 'Talleres', 'Agenda'] },
  { s: 'eleonorasticoni', n: 'Eleonora Sticoni', d: 'eleonorasticoni.com.ar', r: 'salud-y-bienestar', tipo: 'Mentora y coach', blurb: 'Sitio multipágina para una mentora y coach: coaching ontológico, constelaciones y terapias holísticas.', f: ['Sitio multipágina', 'Video en el hero', 'Subpáginas por servicio'] },
  { s: 'electrobohemia', n: 'Electro Bohemia', d: 'electrobohemia.com.ar', r: 'industria-y-mayoristas', tipo: 'Mayorista de electrónica', blurb: 'Importación y venta mayorista de electrónica, con un catálogo claro orientado a revendedores.', f: ['Catálogo mayorista', 'Marcas', 'Contacto'] },
  { s: 'cleandmlimpieza', n: 'Clean DM', d: 'cleandmlimpieza.com.ar', r: 'servicios-y-oficios', tipo: 'Limpieza profesional', blurb: 'Limpieza profesional de edificios, oficinas y final de obra: servicios, forma de trabajo y presupuesto.', f: ['Servicios por tipo de espacio', 'Datos de confianza', 'Presupuesto'] },
  { s: 'lavaderosplash', n: 'Lavadero Splash', d: 'lavaderosplash.com.ar', r: 'servicios-y-oficios', tipo: 'Lavadero de ropa', loc: 'Florencio Varela', blurb: 'Lavadero de ropa con servicio rápido y pedidos por WhatsApp.', f: ['Servicios', 'Precios', 'Pedido por WhatsApp'] },
  { s: 'mendozatransfer', n: 'Mendoza Transfer', d: 'mendozatransfer.com.ar', r: 'turismo-y-eventos', tipo: 'Traslados y tours', loc: 'Mendoza', blurb: 'Tours y traslados en Mendoza: bodegas, vinos y excursiones, con reservas directas por WhatsApp.', f: ['Tours', 'Videos del cliente', 'Reservas por WhatsApp'] },
  { s: 'claudiasanchez', n: 'Claudia Sánchez Eventos', d: 'claudiasanchez.ar', r: 'turismo-y-eventos', tipo: 'Organización de eventos', blurb: 'Organización y ambientación de bodas, quinces y celebraciones, con una identidad cálida y galería de eventos.', f: ['Galería de eventos', 'Imagen para redes propia', 'SEO a medida'] },
  { s: 'rbdigital', n: 'RB Digital', d: 'rbdigital.online', r: 'tiendas-y-catalogos', tipo: 'Televisión por streaming', blurb: 'Televisión por streaming con sistema anticortes: planes, beneficios y alta inmediata.', f: ['Planes', 'Beneficios', 'Alta por WhatsApp'] },
  { s: 'itemacursos', n: 'ITEMA', d: 'itemacursos.com.ar', r: 'instituciones-y-educacion', tipo: 'Instituto de mecánica automotriz', blurb: 'Instituto tecnológico de mecánica automotriz: cursos, modalidades e inscripción.', f: ['Cursos con flyers', 'Modalidades', 'Inscripción'] },
  { s: 'caslafv', n: 'San Lorenzo · Florencio Varela', d: 'caslafv.com.ar', r: 'instituciones-y-educacion', tipo: 'Fútbol infantil', loc: 'Florencio Varela', blurb: 'Sede de fútbol infantil con cancha de 11: galería de fotos y videos, horarios e inscripciones.', f: ['Galería de fotos y video', 'Inscripción', 'Horarios'] },
  { s: 'matiasroman', n: 'Matías Román', d: 'matiasroman.com.ar', r: 'profesionales', tipo: 'Productor asesor de seguros', blurb: 'Productor asesor de seguros: una presencia profesional para generar confianza y recibir consultas.', f: ['Coberturas', 'Asesoramiento', 'Contacto'] },
  { s: 'enlaceosc', n: 'Enlace OSC', d: 'enlaceosc.com.ar', r: 'profesionales', tipo: 'Consultoría', blurb: 'Consultoría estratégica para organizaciones de la sociedad civil, con un sitio institucional sobrio y claro.', f: ['Servicios', 'Enfoque', 'Contacto'] },
];

export const rubroOf = (slug) => RUBROS.find((r) => r.slug === slug);
export const sitiosDe = (slug) => SITIOS.filter((x) => x.r === slug);

/* ---------------------------------------------------------------------
   Preguntas frecuentes (generales)
   ------------------------------------------------------------------- */
export const FAQ = [
  ['¿Cuánto cuesta una página web con TuPaginaYa?', 'El Plan Profesional cuesta $17.000 por mes más una activación única de $50.000. El plan Web + Catálogo, con la app CobrOS, cuesta $35.000 por mes más $100.000 de activación. No hay permanencia.'],
  ['¿Tengo que pagar algo antes de ver la página?', 'No. Primero armamos una demo de tu web, gratis. Si te gusta, pagás la activación y la publicamos con tu dominio.'],
  ['¿Cuánto tarda en estar online?', 'La demo suele estar en menos de 24 horas desde que nos pasás los datos. Una vez aprobada y paga la activación, la web queda online con tu dominio en unas 48 horas.'],
  ['¿Qué incluye el abono mensual?', 'Dominio .com.ar, hosting, soporte, 5 actualizaciones por mes y 2 correos corporativos. En el plan Web + Catálogo también incluye la app CobrOS.'],
  ['¿Usan plantillas?', 'No. Cada web se diseña para el rubro y la marca del cliente: tipografía, colores, estructura y una herramienta útil para sus clientes.'],
  ['¿Trabajan en todo el país?', 'Sí. Trabajamos 100% online por WhatsApp con negocios de toda Argentina: hay webs en vivo en CABA, el conurbano, Rosario, Mendoza, Tucumán, San Luis, Mar del Plata y Comodoro Rivadavia, entre otras.'],
  ['¿Qué necesito para empezar?', 'El nombre del negocio, a qué te dedicás, tus productos o servicios y, si tenés, logo, fotos y redes. Con eso arrancamos la demo.'],
  ['¿Aparece en Google?', 'Sí. Cada web sale con título, descripción, datos estructurados e imagen para compartir, escritos con tu servicio y tu zona. El posicionamiento depende también de la competencia de tu rubro, pero la base técnica queda hecha.'],
  ['¿Puedo cancelar cuando quiera?', 'Sí. No hay permanencia mínima. Si dejás de abonar, la web se suspende.'],
  ['¿Qué es CobrOS?', 'Es nuestra app de catálogo y cobros: cargás tus productos y precios, se publican en tu web y recibís los pedidos por WhatsApp. Viene incluida en el plan Web + Catálogo.'],
  ['¿Cómo funciona el programa de referidos?', 'Si sos cliente con el abono al día y nos recomendás a alguien que activa su web, ganás $20.000 por transferencia o como crédito en tu abono.'],
];
