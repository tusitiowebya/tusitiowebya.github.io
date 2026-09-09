/* CCEF — home. Nav, reveals, contacto y la pizarra táctica (signature). */
(function () {
  // Modo QA: ?qa fuerza el estado final (reveals, animaciones) para capturas.
  if (/[?&]qa/.test(location.search)) document.documentElement.classList.add("qa")
  var CFG = window.CCEF_CONFIG || {}
  var $ = function (s, c) { return (c || document).querySelector(s) }
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)) }

  // ── Contacto ──────────────────────────────────────────────────────────────
  function wa(msg) {
    return "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(msg)
  }
  var LINKS = {
    waNav: "Hola! Vi la web de Creciendo con el Fútbol y quiero saber más sobre las capacitaciones.",
    waFinal: "Hola! Te escribo desde la web. Quiero contarles qué necesita mi club.",
    waPie: "Hola! Te escribo desde la web de Creciendo con el Fútbol.",
    waFlota: "Hola! Te escribo desde la web de Creciendo con el Fútbol.",
  }
  Object.keys(LINKS).forEach(function (id) {
    var el = document.getElementById(id)
    if (el) el.href = wa(LINKS[id])
  })
  var yt = document.getElementById("ytBtn")
  if (yt) yt.href = CFG.YT
  var anio = document.getElementById("anio")
  if (anio) anio.textContent = new Date().getFullYear()

  // Redes — cada una con su glifo, no un ícono genérico para todas.
  var GLIFOS = {
    ig: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z"/>',
    yt: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1Z"/>',
    fb: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/>',
    x:  '<path d="M17.5 3h3.2l-7 8 8.3 10h-6.5l-5-6.1-5.8 6.1H1.5l7.5-8.6L1 3h6.7l4.6 5.6ZM16.4 19.2h1.8L7.7 4.7H5.8Z"/>',
  }
  var redes = document.getElementById("redes")
  if (redes) {
    redes.innerHTML = [
      ["Instagram @ccef_argentina", CFG.IG, "ig"],
      ["YouTube @ccef_argentina", CFG.YT, "yt"],
      ["Facebook", CFG.FB, "fb"],
      ["X @creciconfutbol", CFG.TW, "x"],
    ].map(function (r) {
      return '<a class="red" href="' + r[1] + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + GLIFOS[r[2]] + '</svg>' + r[0] + '</a>'
    }).join("")
  }

  // Ondas de la radio
  var ondas = $(".ondas")
  if (ondas) {
    var h = ""
    for (var i = 0; i < 22; i++) h += '<i style="animation-delay:' + (i * 0.07).toFixed(2) + 's"></i>'
    ondas.innerHTML = h
  }

  // ── Nav ───────────────────────────────────────────────────────────────────
  var nav = document.getElementById("nav")
  var burger = document.getElementById("burger")
  if (burger) {
    burger.addEventListener("click", function () {
      var abierta = nav.classList.toggle("abierta")
      burger.setAttribute("aria-expanded", abierta ? "true" : "false")
      document.body.style.overflow = abierta ? "hidden" : ""
    })
    $$("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("abierta")
        burger.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      })
    })
  }
  var alScroll = function () { nav.classList.toggle("solida", window.scrollY > 40) }
  window.addEventListener("scroll", alScroll, { passive: true })
  alScroll()

  // ── Reveal ────────────────────────────────────────────────────────────────
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target) }
    })
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
  $$(".rv").forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.07 + "s"
    io.observe(el)
  })

  // ══════════════════════════════════════════════════════════════════════════
  //  LA PIZARRA — dibuja el trabajo y arma el plan
  // ══════════════════════════════════════════════════════════════════════════
  var sel = { perfil: "entrenador", categoria: "6-9", foco: "tecnica" }
  // ?pz=perfil|categoria|foco — atajo para revisar/capturar un estado puntual.
  var pzURL = (new URLSearchParams(location.search).get("pz") || "").split("|")
  if (pzURL.length === 3) {
    sel.perfil = pzURL[0]; sel.categoria = pzURL[1]; sel.foco = pzURL[2]
  }

  var CATS = {
    "6-9":   { nombre: "6 a 9 años",   formato: "Fútbol 5 / 7",  jug: 5,  minutos: 60, foco: "el juego y el vínculo con la pelota" },
    "10-12": { nombre: "10 a 12 años", formato: "Fútbol 8 / 9",  jug: 8,  minutos: 75, foco: "la técnica aplicada y las primeras sociedades" },
    "13-15": { nombre: "13 a 15 años", formato: "Fútbol 11",     jug: 11, minutos: 85, foco: "la estructura del equipo y el cuerpo que cambia" },
    "16-18": { nombre: "16 a 18 años", formato: "Fútbol 11",     jug: 11, minutos: 90, foco: "el rendimiento y la transición al plantel mayor" },
  }

  var PLANES = {
    "entrenador|tecnica": {
      t: "Rondo con intención",
      p: "La técnica no se entrena aislada: se entrena decidiendo. Armamos una progresión de rondos y juegos de posición donde el gesto aparece obligado por el juego, y te damos el criterio para corregir sin frenar la sesión cada 30 segundos.",
      d: ["Bloque teórico + campo", "3 encuentros", "Hasta 20 entrenadores"],
    },
    "entrenador|tactica": {
      t: "Ordenar sin robotizar",
      p: "Qué le podés pedir a la categoría y qué todavía no. Trabajamos ocupación de espacios, salida y presión con el nivel de exigencia que tolera la edad, sin convertir a los chicos en fichas.",
      d: ["Bloque teórico + campo", "4 encuentros", "Cuerpo técnico completo"],
    },
    "entrenador|valores": {
      t: "El vestuario también entrena",
      p: "Cómo se para el entrenador frente al error, la derrota y el padre que grita. Herramientas concretas de comunicación y acuerdos de convivencia para el grupo.",
      d: ["Taller teórico", "2 encuentros", "Abierto a familias"],
    },
    "entrenador|gestion": {
      t: "Coordinar el fútbol formativo",
      p: "Del entrenador solo al proyecto compartido: cómo se documenta lo que se entrena, cómo se evalúa al jugador y cómo se le rinde cuentas al club.",
      d: ["Teórico + plantillas", "3 encuentros", "Coordinación y CT"],
    },
    "directivo|tecnica": {
      t: "Qué mirar cuando mirás un entrenamiento",
      p: "Para el dirigente que no viene del campo: qué debería estar pasando en una práctica según la edad, y qué señales indican que el proyecto deportivo está funcionando.",
      d: ["Teórico + visita a campo", "2 encuentros", "Comisión directiva"],
    },
    "directivo|tactica": {
      t: "Un modelo de juego para todo el club",
      p: "Que la 2012 y la 2007 hablen el mismo idioma. Definimos la identidad de juego del club y cómo bajarla a cada categoría sin ahogar al entrenador.",
      d: ["Taller institucional", "3 encuentros", "CD + coordinación"],
    },
    "directivo|valores": {
      t: "Educación Deportiva y Cívica en el club",
      p: "Convivencia, reglamento interno y trabajo con familias. El club como espacio de formación ciudadana, no solo de resultados.",
      d: ["Taller abierto", "2 encuentros", "Club entero"],
    },
    "directivo|gestion": {
      t: "El club, ordenado",
      p: "Estructura, roles, protocolos y organización de eventos. Dejamos escrito quién hace qué, para que el club no dependa de la memoria de tres personas.",
      d: ["Teórico + documentos", "4 encuentros", "Comisión directiva"],
    },
    "jugador|tecnica": {
      t: "Entrenar la cabeza y el gesto",
      p: "Charla y práctica con el plantel: cómo entrenar mejor, qué mirar del propio juego y cómo pedir corrección en vez de esperarla.",
      d: ["Charla + campo", "1 encuentro", "Plantel completo"],
    },
    "jugador|tactica": {
      t: "Entender el rol dentro del equipo",
      p: "Qué se espera de tu puesto, cómo leer al compañero y por qué el equipo gana cuando la decisión es la correcta aunque el resultado no salga.",
      d: ["Charla + video", "1 encuentro", "Plantel completo"],
    },
    "jugador|valores": {
      t: "Antes que deportistas, personas",
      p: "El eje de la ONG, aplicado al plantel: hábitos, respeto, manejo de la frustración y qué pasa cuando el fútbol se termina. Con las familias invitadas.",
      d: ["Charla abierta", "1 encuentro", "Plantel y familias"],
    },
    "jugador|gestion": {
      t: "Tu carrera, en serio",
      p: "Cómo se maneja una prueba, qué papeles existen, quién es representante y quién no, y qué preguntas hacer antes de firmar cualquier cosa.",
      d: ["Charla informativa", "1 encuentro", "Juveniles y familias"],
    },
  }

  // Palabras que le sirven a cada foco para elegir material del catálogo real.
  var CLAVES = {
    tecnica: ["ejercicio", "tecnica", "sesion", "plantilla", "entrenamiento", "practica"],
    tactica: ["planificacion", "tactica", "modelo", "juego", "categoria", "curso"],
    valores: ["valor", "civica", "educacion", "comunicacion", "charla", "familia"],
    gestion: ["directivo", "club", "gestion", "evento", "protocolo", "institucional"],
  }

  function elegirMaterial() {
    var prods = (window.CC && window.CC.productos()) || []
    if (!prods.length) return []
    var claves = CLAVES[sel.foco] || []
    var perfilClave = sel.perfil === "directivo" ? "directiv" : (sel.perfil === "jugador" ? "jugador" : "entrenador")
    var puntuados = prods.map(function (p) {
      var txt = window.CC.sinAcentos(p.nombre + " " + p.descripcion + " " + p.categoria)
      var s = 0
      claves.forEach(function (k, i) { if (txt.indexOf(k) !== -1) s += 10 - i })
      if (txt.indexOf(perfilClave) !== -1) s += 6
      if (p.precio === 0) s += 2 // lo gratuito primero: es la puerta de entrada
      return { p: p, s: s }
    }).sort(function (a, b) { return b.s - a.s })
    return puntuados.slice(0, 3).map(function (x) { return x.p })
  }

  // ── Dibujo ────────────────────────────────────────────────────────────────
  var TIZA = "#EFF3E9", AMA = "#F2E23F", VER = "#2CC257"

  function jugador(x, y, txt, color) {
    // Ojo: los llamadores pasan strings (toFixed) — sin Number() el `y + 5`
    // del dorsal concatenaba y el número terminaba fuera del viewBox.
    x = Number(x); y = Number(y)
    return '<g class="pz-j"><circle cx="' + x + '" cy="' + y + '" r="15" fill="' + (color || "rgba(7,18,12,.75)") +
      '" stroke="' + (color === AMA ? AMA : TIZA) + '" stroke-width="2"/>' +
      '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="13" font-family="Sora,sans-serif" fill="' +
      (color === AMA ? "#1B1A05" : TIZA) + '">' + txt + '</text></g>'
  }
  // Cada color tiene su propia punta de flecha: `context-stroke` no es fiable
  // en todos los navegadores, así que se resuelve con tres markers explícitos.
  function puntaDe(color) {
    if (color === AMA) return "pzPuntaAma"
    if (color === VER) return "pzPuntaVer"
    return "pzPuntaTiza"
  }
  function flecha(d, color, punteada) {
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round"' +
      (punteada ? ' stroke-dasharray="7 8"' : "") + ' marker-end="url(#' + puntaDe(color) + ')"/>'
  }
  // Corta el tramo final de un pase para que la punta de flecha no tape al
  // jugador (el marker mide ~13px y se comía el número del dorsal).
  function separar(a, b, d) {
    var dx = b[0] - a[0], dy = b[1] - a[1]
    var largo = Math.sqrt(dx * dx + dy * dy) || 1
    return [a[0] + (dx / largo) * d, a[1] + (dy / largo) * d]
  }
  function cancha() {
    return '<rect x="14" y="14" width="772" height="432" rx="6" fill="none" stroke="' + TIZA + '" stroke-opacity=".28" stroke-width="2"/>' +
      '<line x1="400" y1="14" x2="400" y2="446" stroke="' + TIZA + '" stroke-opacity=".18" stroke-width="2"/>' +
      '<circle cx="400" cy="230" r="66" fill="none" stroke="' + TIZA + '" stroke-opacity=".18" stroke-width="2"/>' +
      '<rect x="14" y="128" width="92" height="204" fill="none" stroke="' + TIZA + '" stroke-opacity=".18" stroke-width="2"/>' +
      '<rect x="694" y="128" width="92" height="204" fill="none" stroke="' + TIZA + '" stroke-opacity=".18" stroke-width="2"/>'
  }
  function defs() {
    var m = function (id, fill) {
      return '<marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="' + fill + '"/></marker>'
    }
    return '<defs>' + m("pzPuntaTiza", "rgba(239,243,233,.55)") + m("pzPuntaAma", AMA) + m("pzPuntaVer", VER) + '</defs>'
  }
  function titulo(t) {
    return '<text x="34" y="46" font-family="Anton,sans-serif" font-size="24" fill="' + TIZA +
      '" fill-opacity=".85" letter-spacing="1">' + t + '</text>'
  }

  function dibujarTecnica() {
    // Rondo: aros externos + dos adentro. Cantidad según la categoría.
    var n = Math.max(5, Math.min(8, CATS[sel.categoria].jug - 1))
    var cx = 400, cy = 250, r = 138, s = titulo("RONDO " + n + " V 2 · " + CATS[sel.categoria].nombre.toUpperCase())
    var pts = []
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.78])
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + TIZA + '" stroke-opacity=".2" stroke-width="2" stroke-dasharray="6 9" transform="scale(1,.78) translate(0,' + (cy / 0.78 - cy) + ')"/>'
    for (var j = 0; j < pts.length; j++) {
      var a1 = pts[j], a2 = pts[(j + 1) % pts.length]
      var mx = (a1[0] + a2[0]) / 2, my = (a1[1] + a2[1]) / 2
      var dx = mx - cx, dy = my - cy
      var qx = mx + dx * 0.22, qy = my + dy * 0.22
      var ini = separar(a1, [qx, qy], 20)   // arranca fuera del círculo
      var fin = separar(a2, [qx, qy], 22)   // y frena antes del siguiente
      s += flecha("M" + ini[0].toFixed(0) + " " + ini[1].toFixed(0) + " Q" + qx.toFixed(0) + " " + qy.toFixed(0) + " " + fin[0].toFixed(0) + " " + fin[1].toFixed(0), j === 0 ? AMA : "rgba(239,243,233,.55)")
    }
    s += jugador(cx - 42, cy - 6, "×", VER) + jugador(cx + 42, cy + 16, "×", VER)
    pts.forEach(function (p, i) { s += jugador(p[0].toFixed(0), p[1].toFixed(0), String(i + 1), i === 0 ? AMA : null) })
    s += '<text x="400" y="425" text-anchor="middle" font-size="13" font-family="Sora,sans-serif" fill="' + TIZA + '" fill-opacity=".6">Dos toques · el que pierde la pelota entra al medio</text>'
    return s
  }

  function dibujarTactica() {
    var jug = CATS[sel.categoria].jug
    var lineas = jug <= 5 ? [1, 2, 2] : jug <= 8 ? [1, 3, 2, 2] : [1, 4, 3, 3]
    var s = titulo("SALIDA Y PRESIÓN · " + CATS[sel.categoria].formato.toUpperCase())
    var x = 92, paso = 148, dorsal = 1, pos = []
    lineas.forEach(function (cant, li) {
      var fila = []
      for (var i = 0; i < cant; i++) {
        var y = 90 + (330 / (cant + 1)) * (i + 1)
        fila.push([x, y, dorsal++])
      }
      pos.push(fila)
      x += paso
    })
    // El que tiene la pelota: un central; el destino: un volante por afuera.
    var linDef = pos[1], linMed = pos[2] || pos[1]
    var conPelota = linDef[Math.min(1, linDef.length - 1)]
    var destino = linMed[0]
    // Rivales presionando (marca al hombre sobre la salida)
    var rivales = [[conPelota[0] + 62, conPelota[1] - 62], [conPelota[0] + 62, conPelota[1] + 96]]
    rivales.forEach(function (r, i) {
      var obj = i === 0 ? linDef[Math.max(0, linDef.length - 3)] : linDef[linDef.length - 1]
      var fin = separar([obj[0], obj[1]], r, 22)
      s += flecha("M" + (r[0] - 20) + " " + r[1].toFixed(0) + " L " + fin[0].toFixed(0) + " " + fin[1].toFixed(0), "rgba(239,243,233,.5)", true)
    })
    pos.forEach(function (fila) {
      fila.forEach(function (p) {
        s += jugador(p[0], p[1].toFixed(0), String(p[2]), p === conPelota ? AMA : null)
      })
    })
    rivales.forEach(function (r) { s += jugador(r[0], r[1].toFixed(0), "×", VER) })
    var ini2 = separar([conPelota[0], conPelota[1]], [destino[0], destino[1]], 22)
    var fin2 = separar([destino[0], destino[1]], [conPelota[0], conPelota[1]], 24)
    s += flecha("M" + ini2[0].toFixed(0) + " " + ini2[1].toFixed(0) +
      " Q " + (conPelota[0] + 86) + " " + (conPelota[1] - 96).toFixed(0) + " " +
      fin2[0].toFixed(0) + " " + fin2[1].toFixed(0), AMA)
    s += '<text x="400" y="425" text-anchor="middle" font-size="13" font-family="Sora,sans-serif" fill="' + TIZA + '" fill-opacity=".6">Salir jugando con la presión encima, sin pelotazo automático</text>'
    return s
  }

  function dibujarValores() {
    // La ronda de charla: el grupo cerrado, nadie de espaldas.
    var cx = 400, cy = 245, r = 150, n = 9
    var s = titulo("LA RONDA · " + CATS[sel.categoria].nombre.toUpperCase())
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + TIZA + '" stroke-opacity=".16" stroke-width="2"/>'
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n
      var px = cx + r * Math.cos(a), py = cy + r * Math.sin(a) * 0.82
      s += jugador(px.toFixed(0), py.toFixed(0), "", i === 0 ? AMA : null)
      s += flecha("M" + (cx + (r - 118) * Math.cos(a)).toFixed(0) + " " + (cy + (r - 118) * Math.sin(a) * 0.82).toFixed(0) +
        " L " + (cx + (r - 30) * Math.cos(a)).toFixed(0) + " " + (cy + (r - 30) * Math.sin(a) * 0.82).toFixed(0), "rgba(239,243,233,.4)", true)
    }
    s += jugador(cx, cy, "DT", VER)
    s += '<text x="400" y="425" text-anchor="middle" font-size="13" font-family="Sora,sans-serif" fill="' + TIZA + '" fill-opacity=".6">Todos se ven la cara: el que habla no es siempre el mismo</text>'
    return s
  }

  function dibujarGestion() {
    // Organigrama del club: quién responde a quién.
    var s = titulo("ESTRUCTURA DEL CLUB FORMATIVO")
    var caja = function (x, y, w, txt, sub, on) {
      return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="52" rx="8" fill="' + (on ? "rgba(242,226,63,.14)" : "rgba(7,18,12,.6)") +
        '" stroke="' + (on ? AMA : TIZA) + '" stroke-opacity="' + (on ? "1" : ".45") + '" stroke-width="2"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 24) + '" text-anchor="middle" font-family="Sora,sans-serif" font-size="14" font-weight="600" fill="' + TIZA + '">' + txt + '</text>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 41) + '" text-anchor="middle" font-family="Sora,sans-serif" font-size="11" fill="' + TIZA + '" fill-opacity=".6">' + sub + '</text></g>'
    }
    s += caja(300, 78, 200, "Comisión directiva", "define el proyecto", sel.perfil === "directivo")
    s += caja(300, 190, 200, "Coordinación deportiva", "traduce y controla", sel.perfil === "entrenador")
    s += caja(80, 320, 190, "Cuerpo técnico", "ejecuta la sesión", sel.perfil === "entrenador")
    s += caja(305, 320, 190, "Jugadores", "el centro de todo", sel.perfil === "jugador")
    s += caja(530, 320, 190, "Familias", "acompañan", false)
    s += '<path d="M400 130 L400 190" stroke="' + TIZA + '" stroke-opacity=".45" stroke-width="2"/>'
    s += '<path d="M400 242 L400 282 M175 282 L625 282 M175 282 L175 320 M400 282 L400 320 M625 282 L625 320" stroke="' + TIZA + '" stroke-opacity=".45" stroke-width="2" fill="none"/>'
    s += '<text x="400" y="425" text-anchor="middle" font-size="13" font-family="Sora,sans-serif" fill="' + TIZA + '" fill-opacity=".6">Cada flecha necesita un documento: eso es lo que dejamos escrito</text>'
    return s
  }

  function pintar() {
    var svg = document.getElementById("pzSvg")
    if (!svg) return
    var cuerpo = sel.foco === "tecnica" ? dibujarTecnica()
      : sel.foco === "tactica" ? dibujarTactica()
        : sel.foco === "valores" ? dibujarValores() : dibujarGestion()
    svg.innerHTML = defs() + cancha() + cuerpo

    var plan = PLANES[sel.perfil + "|" + sel.foco] || PLANES["entrenador|tecnica"]
    var cat = CATS[sel.categoria]
    $("#pzTitulo").textContent = plan.t
    $("#pzTexto").textContent = plan.p
    $("#pzDatos").innerHTML =
      '<div class="dato"><span>Categoría</span><b>' + cat.nombre + " · " + cat.formato + '</b></div>' +
      '<div class="dato"><span>Duración de sesión</span><b>' + cat.minutos + ' minutos</b></div>' +
      '<div class="dato"><span>Modalidad</span><b>' + plan.d[0] + '</b></div>' +
      '<div class="dato"><span>Encuentros</span><b>' + plan.d[1] + '</b></div>' +
      '<div class="dato"><span>Para</span><b>' + plan.d[2] + '</b></div>' +
      '<div class="dato"><span>El eje de la edad</span><b>' + cat.foco + '</b></div>'

    pintarMaterial()

    var msg = "Hola! Armé esta capacitación en la pizarra de la web:\n" +
      "• Perfil: " + sel.perfil + "\n• Categoría: " + cat.nombre + " (" + cat.formato + ")\n" +
      "• Foco: " + sel.foco + "\n• Propuesta: " + plan.t + "\n¿Cómo seguimos?"
    var b = document.getElementById("pzWa")
    if (b) b.href = wa(msg)
  }

  function pintarMaterial() {
    var cont = document.getElementById("pzMat")
    if (!cont) return
    var mats = elegirMaterial()
    if (!mats.length) {
      cont.innerHTML = '<p style="font-size:.85rem;opacity:.7">Estamos cargando la biblioteca…</p>'
      return
    }
    cont.innerHTML = mats.map(function (p) {
      var ya = window.CC.enCarrito(p.id)
      return '<button data-add="' + window.CC.esc(p.id) + '" class="' + (ya ? "ya" : "") + '">' +
        '<span><b style="font-weight:600">' + window.CC.esc(p.nombre) + '</b>' +
        '<small>' + window.CC.esc(p.formato) + '</small></span>' +
        '<i>' + (ya ? "En tu pedido ✓" : window.CC.money(p.precio)) + '</i></button>'
    }).join("")
    $$("[data-add]", cont).forEach(function (b) {
      b.onclick = function () { window.CC.alternar(b.dataset.add); pintarMaterial() }
    })
  }

  $$(".pz-ops").forEach(function (grupo) {
    $$(".pz-op", grupo).forEach(function (o) { o.classList.toggle("on", o.dataset.v === sel[grupo.dataset.pz]) })
    grupo.addEventListener("click", function (e) {
      var b = e.target.closest(".pz-op")
      if (!b) return
      $$(".pz-op", grupo).forEach(function (o) { o.classList.remove("on") })
      b.classList.add("on")
      sel[grupo.dataset.pz] = b.dataset.v
      pintar()
    })
  })

  // ── Destacados de la biblioteca ───────────────────────────────────────────
  function pintarDestacados() {
    var cont = document.getElementById("destacados")
    if (!cont) return
    var prods = window.CC.productos().slice()
    // Primero lo gratuito (es la puerta de entrada), después por precio.
    prods.sort(function (a, b) { return (a.precio === 0 ? -1 : 0) - (b.precio === 0 ? -1 : 0) })
    var top = prods.slice(0, 4)
    cont.innerHTML = top.map(function (p) {
      var ya = window.CC.enCarrito(p.id)
      return '<article class="card">' + window.CC.tapaHTML(p) +
        '<div class="card-cuerpo"><span class="card-cat">' + window.CC.esc(p.categoria) + '</span>' +
        '<h3>' + window.CC.esc(p.nombre) + '</h3>' +
        '<p>' + window.CC.esc(p.descripcion) + '</p>' +
        '<div class="card-pie"><span class="card-precio' + (p.precio === 0 ? " es-gratis" : "") + '">' + window.CC.money(p.precio) + '</span>' +
        '<button class="card-add' + (ya ? " ya" : "") + '" data-add="' + window.CC.esc(p.id) + '">' + (ya ? "Agregado ✓" : "Agregar") + '</button>' +
        '</div></div></article>'
    }).join("")
    $$("[data-add]", cont).forEach(function (b) {
      b.onclick = function () { window.CC.alternar(b.dataset.add); pintarDestacados(); pintarMaterial() }
    })

    var aviso = document.getElementById("avisoCatalogo")
    if (aviso && !window.CC.estado.conectado) {
      aviso.innerHTML = '<p class="aviso-catalogo"><b>Catálogo de muestra.</b> Cuando conectemos el panel de cobros, ' +
        'estos materiales se cargan una sola vez ahí y aparecen solos acá, con su precio y su archivo.</p>'
    }
  }

  if (window.CC) {
    window.CC.alCargar(function () { pintarDestacados(); pintar() })
  }
  document.addEventListener("cc:carrito", function () { pintarMaterial() })
  pintar()
})();
