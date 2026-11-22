/* TuPaginaYa v3 · guion del asistente de chat (motor: /assets/chat.js)
   build.mjs reemplaza __DATA__ con planes, FAQ y trabajos de src/data.mjs. */
(function () {
  "use strict";
  var D = /*__DATA__*/null;
  var P = D.planes[0], C = D.planes[1];
  var faq = function (re) { for (var i = 0; i < D.faq.length; i++) if (re.test(D.faq[i][0])) return D.faq[i][1]; return ""; };
  var rubroActual = function (path) {
    var m = path.match(/^\/rubros\/([^/]+)\//);
    return m ? D.rubros.filter(function (r) { return r.slug === m[1]; })[0] : null;
  };

  var MENU = [
    ["💰 Precios y planes", "precios"],
    ["🎁 Quiero mi demo gratis", "demo"],
    ["⏱️ ¿Cuánto tarda?", "plazos"],
    ["🖼️ Ver trabajos", "trabajos"],
    ["💬 ¿Cómo funciona este chat?", "chat"],
    ["🙋 Hablar con una persona", "humano"],
  ];
  var VOLVER = ["↩︎ Otra consulta", "menu"];

  TPYChat.init({
    id: "tupaginaya",
    wa: D.wa,
    brand: { name: "TuPaginaYa", avatar: "/brand/icon-192.png", status: "En línea · 24 h" },
    launcherLabel: "¿Te ayudo?",
    note: "Asistente automático de TuPaginaYa · después seguís con una persona por WhatsApp",
    hideUntil: "#hero",
    replace: ".wa-float",
    teaser: { text: "¡Hola! 👋 ¿Querés saber cuánto sale tu web o pedir la demo gratis? Te respondo al toque.", delay: 9000 },
    fallback: "nolose",

    start: function (path) {
      if (/^\/planes\//.test(path)) return "inicio_planes";
      if (rubroActual(path)) return "inicio_rubro";
      return "inicio";
    },

    fields: [["negocio", "Negocio"], ["rubro", "Rubro"], ["zona", "Zona"], ["nombre", "Mi nombre"], ["plan", "Me interesa"]],
    waText: function (data, st) {
      var l = [data.negocio ? "Hola TuPaginaYa! Vengo del chat de la web y quiero mi demo gratis." : "Hola TuPaginaYa! Vengo del chat de la web."];
      [["negocio", "Negocio"], ["rubro", "Rubro"], ["zona", "Zona"], ["nombre", "Mi nombre"], ["plan", "Me interesa"]].forEach(function (f) {
        if (data[f[0]]) l.push(f[1] + ": " + data[f[0]]);
      });
      if (st.asks.length) l.push("Mi consulta: " + st.asks.slice(-2).join(" / "));
      return l.join("\n");
    },

    nodes: {
      inicio: {
        say: ["¡Hola! 👋 Soy el asistente de **TuPaginaYa**.", "Te respondo al instante, a cualquier hora. ¿Qué querés saber?"],
        chips: MENU,
      },
      inicio_planes: {
        say: ["¡Hola! 👋 Soy el asistente de **TuPaginaYa**.", "¿Te ayudo a elegir plan? Te hago una sola pregunta y te digo cuál te conviene."],
        chips: [["Sí, ayudame a elegir", "recomendar"]].concat(MENU),
      },
      inicio_rubro: {
        say: function () {
          var r = rubroActual(location.pathname);
          return ["¡Hola! 👋 Soy el asistente de **TuPaginaYa**.",
            "¿Buscás una web para **" + r.short.toLowerCase() + "**? Tenemos " + r.n + " " + (r.n === 1 ? "web en vivo" : "webs en vivo") + " de ese rubro. Te armamos la demo de la tuya gratis."];
        },
        chips: function () { return [["🎁 Quiero mi demo gratis", "demo"]].concat(MENU.slice(0, 1), MENU.slice(2)); },
      },
      menu: { say: ["¿Qué más querés saber?"], chips: MENU },
      hola: { say: ["¡Hola! 😊 ¿En qué te ayudo?"], chips: MENU },
      gracias: { say: ["¡De nada! 🙌 Si te queda alguna duda, escribime cuando quieras."], chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER] },

      precios: {
        topic: "precios",
        say: [
          "Tenemos dos planes, **sin permanencia**:",
          "**" + P.name + "**: " + P.monthly + "/mes + " + P.activation + " de activación (una sola vez). Web a medida, dominio .com.ar, hosting, este asistente de chat 24/7, 5 cambios por mes y 2 correos.",
          "**" + C.name + "**: " + C.monthly + "/mes + " + C.activation + " de activación. Todo lo anterior + la app CobrOS: cargás tus productos y los pedidos te llegan por WhatsApp.",
        ],
        chips: [["🤔 ¿Cuál me conviene?", "recomendar"], ["¿Pago algo antes de verla?", "antes"], ["¿Qué incluye el abono?", "incluye"], ["🎁 Quiero mi demo gratis", "demo"]],
      },
      recomendar: {
        say: ["Te hago una pregunta: ¿qué vendés?"],
        chips: [["Servicios", "rec_serv"], ["Pocos productos", "rec_pocos"], ["Muchos productos", "rec_cat"]],
      },
      rec_serv: {
        set: { plan: P.name },
        say: ["Para servicios te conviene el **" + P.name + "** (" + P.monthly + "/mes): tus servicios, tu zona y el contacto por WhatsApp, con este chat atendiendo 24/7."],
        chips: [["🎁 Quiero mi demo gratis", "demo"], ["🖼️ Ver ejemplos", "trabajos"], VOLVER],
      },
      rec_pocos: {
        say: ["Con pocos productos alcanza con el **" + P.name + "**: los mostramos en la web y los cambios los hacemos nosotros (5 por mes incluidos).",
          "Si preferís cargarlos y cambiar precios vos mismo, el indicado es **" + C.name + "**."],
        chips: [["Me quedo con el Profesional", "rec_pocos_p"], ["Prefiero cargarlos yo", "rec_cat"], VOLVER],
      },
      rec_pocos_p: { set: { plan: P.name }, say: ["¡Buenísimo! Arrancamos con tu demo gratis así la ves antes de pagar nada."], chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER] },
      rec_cat: {
        set: { plan: C.name },
        say: ["Te conviene **" + C.name + "** (" + C.monthly + "/mes): con la app CobrOS cargás productos y precios, se publican solos en tu web y el cliente te manda el pedido armado por WhatsApp."],
        chips: [["🎁 Quiero mi demo gratis", "demo"], ["¿Qué es CobrOS?", "cobros"], VOLVER],
      },
      antes: { topic: "pago previo", say: [faq(/pagar algo antes/i)], chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER] },
      incluye: { topic: "qué incluye", say: [faq(/incluye el abono/i)], chips: [["💰 Precios", "precios"], ["🎁 Quiero mi demo gratis", "demo"], VOLVER] },
      pago: {
        topic: "formas de pago",
        say: ["La activación se paga una sola vez, cuando aprobás la demo. Después, el abono es mensual y por adelantado, sin permanencia.",
          "Los medios de pago te los pasamos por WhatsApp."],
        chips: [["🙋 Consultar por WhatsApp", "humano"], ["🎁 Quiero mi demo gratis", "demo"], VOLVER],
      },
      plazos: { topic: "plazos", say: [faq(/tarda/i)], chips: [["🎁 Quiero mi demo gratis", "demo"], ["💰 Precios", "precios"], VOLVER] },
      trabajos: {
        topic: "trabajos",
        say: ["Hay **" + D.nSitios + " webs en vivo** de negocios reales: tiendas, oficios, salud, turismo, industria, profesionales y más.", "Mirá las de tu rubro 👇"],
        chips: [["Ver todos los trabajos", "/trabajos/"], ["Ver por rubro", "/rubros/"], ["🎁 Quiero una para mi negocio", "demo"]],
      },
      chat: {
        topic: "asistente de chat",
        say: [
          "Este chat es justamente lo que le sumamos a tu web 😉",
          "Responde solo, **24/7**, las preguntas de siempre de tu rubro: precios, horarios, zonas, turnos, envíos. Las respuestas las armamos con vos.",
          "Cuando el cliente está listo, te llega a tu WhatsApp con su nombre y lo que necesita. **Vos solo confirmás la venta.**",
          "Viene incluido en los dos planes, desde " + P.monthly + "/mes.",
        ],
        chips: [["🎁 Lo quiero en mi web", "demo"], ["💰 Precios", "precios"], VOLVER],
      },
      dominio: {
        topic: "dominio",
        say: ["Sí, el dominio .com.ar está incluido en el abono, junto con el hosting. Si el nombre de tu negocio está libre, lo usamos para tu web."],
        chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER],
      },
      google: { topic: "Google", say: [faq(/google/i)], chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER] },
      pais: { topic: "zona", say: [faq(/todo el país/i)], chips: [["🎁 Quiero mi demo gratis", "demo"], VOLVER] },
      plantillas: { topic: "diseño a medida", say: [faq(/plantillas/i)], chips: [["🖼️ Ver trabajos", "trabajos"], VOLVER] },
      cancelar: { topic: "permanencia", say: [faq(/cancelar/i)], chips: [["💰 Precios", "precios"], VOLVER] },
      empezar: { say: [faq(/necesito para empezar/i)], chips: [["🎁 Arrancar mi demo", "demo"], VOLVER] },
      cobros: {
        topic: "CobrOS",
        say: [faq(/qué es cobros/i), "Está en el plan **" + C.name + "** (" + C.monthly + "/mes)."],
        chips: [["Conocer CobrOS", "/cobros/"], ["🎁 Quiero mi demo gratis", "demo"], VOLVER],
      },
      referidos: { topic: "referidos", say: [faq(/referidos/i)], chips: [["Ver cómo funciona", "/referidos/"], VOLVER] },

      /* ---- pedido de demo: 4 preguntas y pasa a WhatsApp ---- */
      demo: {
        topic: "demo",
        say: ["¡Genial! 🙌 Te armamos la demo **gratis y sin compromiso**: la ves antes de pagar nada.", "Son 4 preguntas rápidas. ¿Cómo se llama tu negocio?"],
        ask: { key: "negocio", ph: "Nombre de tu negocio", next: "demo_rubro" },
      },
      demo_rubro: {
        say: ["¿A qué se dedica **{negocio}**?"],
        ask: { key: "rubro", ph: "Ej.: ferretería, psicóloga, taller", next: "demo_zona" },
      },
      demo_zona: {
        say: ["¿En qué ciudad o zona trabajás?"],
        ask: { key: "zona", ph: "Ej.: Morón, Rosario, todo el país", next: "demo_nombre" },
      },
      demo_nombre: {
        say: ["Última: ¿cómo te llamás?"],
        ask: { key: "nombre", ph: "Tu nombre", next: "demo_fin" },
      },
      demo_fin: {
        say: ["¡Listo, {nombre}! 🙌", "Tocá el botón y nos llega tu pedido por WhatsApp con estos datos. Si tenés logo, fotos o redes, mandalas ahí y arrancamos tu demo."],
        wa: "Enviar mi pedido por WhatsApp",
        chips: [["💰 Ver precios", "precios"], VOLVER],
      },

      humano: {
        topic: "persona",
        say: ["¡Dale! Te paso con una persona del equipo por WhatsApp. Tocá el botón 👇"],
        wa: "Hablar por WhatsApp",
        chips: [VOLVER],
      },
      nolose: {
        say: ["Mmm, esa no la tengo 🙈 Pero se la paso a una persona del equipo con tu consulta ya escrita.", "¿O querés ver alguno de estos temas?"],
        wa: "Preguntar por WhatsApp",
        chips: MENU.slice(0, 5),
      },
    },

    intents: [
      { go: "hola", k: ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "que tal"] },
      { go: "gracias", k: ["gracias", "genial", "perfecto", "joya", "dale gracias", "buenisimo"] },
      { go: "plazos", k: ["tarda*", "demora*", "cuanto tiempo", "dias", "horas", "rapido", "48", "24"] },
      { go: "precios", k: ["precio*", "cuesta*", "sale", "salen", "valor*", "cuanto", "costo*", "plan", "planes", "abono", "tarifa*", "mensual*", "$"] },
      { go: "recomendar", k: ["conviene", "cual elijo", "cual me", "que plan", "recomend*"] },
      { go: "demo", k: ["demo", "prueba", "gratis", "quiero una web", "quiero una pagina", "quiero mi web", "quiero mi pagina", "contratar", "arrancar", "hagamos"] },
      { go: "trabajos", k: ["ejemplo*", "trabajos", "portfolio", "portafolio", "muestra*", "clientes", "hicieron"] },
      { go: "chat", k: ["chat", "bot", "asistente", "ia", "inteligencia", "automatic*", "24 7", "atiende sola", "responde solo"] },
      { go: "humano", k: ["persona", "humano", "asesor*", "hablar", "llamar", "llamada", "telefono", "whatsapp", "wsp", "contacto", "numero"] },
      { go: "dominio", k: ["dominio", "com ar", "url", "direccion web", "nombre de la web"] },
      { go: "google", k: ["google", "seo", "buscador*", "posicionamiento", "aparecer", "aparece"] },
      { go: "pais", k: ["provincia*", "interior", "todo el pais", "cordoba", "rosario", "mendoza", "tucuman", "trabajan en", "son de", "donde estan"] },
      { go: "plantillas", k: ["plantilla*", "template*", "a medida", "wordpress", "wix", "personalizad*"] },
      { go: "cancelar", k: ["cancelar", "permanencia", "baja", "contrato", "dar de baja"] },
      { go: "cobros", k: ["cobros", "catalogo", "productos", "tienda", "stock", "carrito", "vender online", "ecommerce", "e commerce"] },
      { go: "referidos", k: ["referido*", "recomendar a", "recomiendo", "comision", "ganar plata", "20 000", "20000"] },
      { go: "pago", k: ["pagar", "pago", "pagos", "transferencia", "mercado pago", "mercadopago", "tarjeta", "efectivo", "cuotas", "factura*"] },
      { go: "incluye", k: ["incluye*", "incluido", "hosting", "correo*", "mail*", "email", "actualizacion*", "cambios", "soporte"] },
      { go: "empezar", k: ["que necesito", "que te paso", "que hace falta", "requisitos", "empezar"] },
      { go: "antes", k: ["pagar antes", "pago antes", "adelantado", "sin pagar"] },
    ],
  });
})();
