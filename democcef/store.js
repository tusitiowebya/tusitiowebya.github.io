/* CCEF — núcleo compartido de la tienda digital (home + /tienda/).
   Expone window.CC con: productos, carrito y el panel de pedido.
   Todos los productos son DIGITALES: cantidad siempre 1, no hay envío,
   y el email es obligatorio porque es donde llega la entrega. */
(function () {
  var CFG = window.CCEF_CONFIG || {}
  var LS_CART = "ccef_cart"
  var estado = { productos: [], negocio: null, conectado: false, cargando: true, error: "" }

  // ── utilidades ────────────────────────────────────────────────────────────
  function money(n) {
    n = Number(n) || 0
    if (n === 0) return "Gratis"
    return "$" + n.toLocaleString("es-AR", { maximumFractionDigits: 0 })
  }
  function sinAcentos(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    })
  }

  // ── catálogo ──────────────────────────────────────────────────────────────
  function normalizar(p) {
    return {
      id: String(p._id || p.id),
      nombre: p.nombre || "Material",
      descripcion: String(p.descripcion || ""),
      categoria: p.categoria || "Material",
      cat: sinAcentos(p.categoria || ""),
      precio: Number(p.precio) || 0,
      // En CobrOS el formato viaja en `unidad` (el negocio escribe "PDF",
      // "Video", etc.); en la demo viene explícito.
      formato: p.formato || p.unidad || "PDF",
      peso: p.peso || "",
      modos: p.modos || [],
      foto: p.foto || "",
      cuotas: Number(p.cuotasSinInteres) || 0,
    }
  }

  var suscriptores = []
  function avisar() { suscriptores.forEach(function (f) { try { f(estado) } catch (e) {} }) }
  function alCargar(f) { suscriptores.push(f); if (!estado.cargando) f(estado) }

  function usarDemo() {
    estado.productos = (CFG.CATALOGO_DEMO || []).map(normalizar)
    estado.conectado = false
    estado.cargando = false
  }

  function cargar() {
    if (!CFG.SLUG) { usarDemo(); avisar(); return Promise.resolve(estado) }
    var ctrl = new AbortController()
    var t = setTimeout(function () { ctrl.abort() }, CFG.TIMEOUT || 8000)
    return fetch(CFG.API + "/catalogo/" + CFG.SLUG, { signal: ctrl.signal })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() })
      .then(function (d) {
        clearTimeout(t)
        estado.negocio = d.negocio || null
        estado.productos = (d.productos || []).map(normalizar)
        estado.conectado = true
        estado.cargando = false
        avisar()
        return estado
      })
      .catch(function (e) {
        // Nunca dejamos la página colgada: caemos al catálogo de muestra.
        clearTimeout(t)
        usarDemo()
        estado.error = e.name === "AbortError" ? "timeout" : e.message
        avisar()
        return estado
      })
  }

  // ── carrito (digital: un ejemplar por producto) ────────────────────────────
  function leerCarrito() {
    try { return JSON.parse(localStorage.getItem(LS_CART) || "[]") } catch (e) { return [] }
  }
  function guardarCarrito(c) {
    try { localStorage.setItem(LS_CART, JSON.stringify(c)) } catch (e) {}
    pintarBadges()
    document.dispatchEvent(new CustomEvent("cc:carrito", { detail: c }))
  }
  function enCarrito(id) { return leerCarrito().indexOf(String(id)) !== -1 }
  function agregar(id) {
    var c = leerCarrito()
    if (c.indexOf(String(id)) === -1) c.push(String(id))
    guardarCarrito(c)
  }
  function sacar(id) {
    guardarCarrito(leerCarrito().filter(function (x) { return x !== String(id) }))
  }
  function alternar(id) {
    if (enCarrito(id)) { sacar(id); return false }
    agregar(id); return true
  }
  function vaciar() { guardarCarrito([]) }
  function items() {
    var ids = leerCarrito()
    return estado.productos.filter(function (p) { return ids.indexOf(p.id) !== -1 })
  }
  function sumar(its) { return its.reduce(function (s, p) { return s + p.precio }, 0) }

  function pintarBadges() {
    var n = leerCarrito().length
    Array.prototype.forEach.call(document.querySelectorAll("[data-carrito-n]"), function (el) {
      el.textContent = n
      el.classList.toggle("vacio", n === 0)
    })
  }

  // ── panel de pedido (3 pasos) ─────────────────────────────────────────────
  var paso = 1, datos = {}, resultado = null

  function abrirPanel() {
    var p = document.getElementById("cc-panel")
    if (!p) return
    paso = 1; resultado = null
    p.classList.add("abierto")
    document.body.style.overflow = "hidden"
    render()
  }
  function cerrarPanel() {
    var p = document.getElementById("cc-panel")
    if (!p) return
    p.classList.remove("abierto")
    document.body.style.overflow = ""
  }

  function montarPanel() {
    if (document.getElementById("cc-panel")) return
    var d = document.createElement("div")
    d.id = "cc-panel"
    d.className = "cc-panel"
    d.innerHTML =
      '<div class="cc-panel-fondo" data-cerrar></div>' +
      '<aside class="cc-panel-caja" role="dialog" aria-label="Tu pedido">' +
      '<header class="cc-panel-top">' +
      '<div><span class="cc-panel-kicker">Material digital</span><h3>Tu pedido</h3></div>' +
      '<button class="cc-cerrar" data-cerrar aria-label="Cerrar">&times;</button>' +
      '</header>' +
      '<div class="cc-pasos"><span data-p="1">1 · Pedido</span><span data-p="2">2 · Tus datos</span><span data-p="3">3 · Entrega</span></div>' +
      '<div class="cc-panel-cuerpo"></div>' +
      '</aside>'
    document.body.appendChild(d)
    d.addEventListener("click", function (e) {
      if (e.target.closest("[data-cerrar]")) cerrarPanel()
    })
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarPanel()
    })
  }

  function render() {
    var caja = document.querySelector("#cc-panel .cc-panel-cuerpo")
    if (!caja) return
    Array.prototype.forEach.call(document.querySelectorAll("#cc-panel .cc-pasos span"), function (s) {
      s.classList.toggle("on", Number(s.dataset.p) <= paso)
    })
    if (paso === 1) return renderPedido(caja)
    if (paso === 2) return renderDatos(caja)
    return renderFinal(caja)
  }

  function renderPedido(caja) {
    var its = items()
    var base = document.body.dataset.base || ""
    if (!its.length) {
      caja.innerHTML =
        '<div class="cc-vacio"><span class="cc-vacio-ico">▤</span>' +
        '<p>Todavía no elegiste material.</p>' +
        '<a class="btn btn-verde" href="' + base + 'tienda/">Ver la biblioteca</a></div>'
      return
    }
    caja.innerHTML =
      '<ul class="cc-lista">' + its.map(function (p) {
        return '<li><span class="cc-li-tapa">' + iconoCat(p.cat) + '</span>' +
          '<span class="cc-li-txt"><b>' + esc(p.nombre) + '</b>' +
          '<small>' + esc(p.formato) + (p.peso ? " · " + esc(p.peso) : "") + '</small></span>' +
          '<span class="cc-li-der"><b class="' + (p.precio === 0 ? "gratis" : "") + '">' + money(p.precio) + '</b>' +
          '<button class="cc-quitar" data-quitar="' + esc(p.id) + '">Quitar</button></span></li>'
      }).join("") + '</ul>' +
      '<div class="cc-total"><span>Total</span><b>' + money(sumar(its)) + '</b></div>' +
      '<p class="cc-nota">Entrega por email apenas se confirma el pago. Sin envío, sin espera.</p>' +
      '<button class="btn btn-verde cc-full" data-seguir>Continuar</button>' +
      '<button class="cc-link" data-vaciar>Vaciar pedido</button>'
    Array.prototype.forEach.call(caja.querySelectorAll("[data-quitar]"), function (b) {
      b.onclick = function () { sacar(b.dataset.quitar); render() }
    })
    caja.querySelector("[data-vaciar]").onclick = function () { vaciar(); render() }
    caja.querySelector("[data-seguir]").onclick = function () { paso = 2; render() }
  }

  function renderDatos(caja) {
    var its = items()
    var t = sumar(its)
    var perfiles = ["Entrenador/a", "Directivo/a", "Jugador/a", "Familia", "Profe de Ed. Física", "Otro"]
    caja.innerHTML =
      '<form class="cc-form" novalidate>' +
      '<label>Nombre y apellido *<input name="nombre" required autocomplete="name" value="' + esc(datos.nombre || "") + '"></label>' +
      '<label>Email * <small>acá te llega el material</small><input name="email" type="email" required autocomplete="email" value="' + esc(datos.email || "") + '"></label>' +
      '<label>WhatsApp<input name="telefono" inputmode="tel" autocomplete="tel" value="' + esc(datos.telefono || "") + '"></label>' +
      '<label>Club o institución <small>opcional</small><input name="club" value="' + esc(datos.club || "") + '"></label>' +
      '<label>Sos…<select name="perfil">' + perfiles.map(function (o) {
        return '<option' + (datos.perfil === o ? " selected" : "") + '>' + o + '</option>'
      }).join("") + '</select></label>' +
      '<p class="cc-err" hidden></p>' +
      '<div class="cc-total"><span>Total</span><b>' + money(t) + '</b></div>' +
      '<button class="btn btn-verde cc-full" type="submit">' + (t === 0 ? "Descargar gratis" : "Confirmar pedido") + '</button>' +
      '<button class="cc-link" type="button" data-volver>Volver</button>' +
      '</form>'
    var f = caja.querySelector("form")
    caja.querySelector("[data-volver]").onclick = function () { paso = 1; render() }
    f.onsubmit = function (e) {
      e.preventDefault()
      var fd = new FormData(f)
      datos = {
        nombre: String(fd.get("nombre") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        telefono: String(fd.get("telefono") || "").trim(),
        club: String(fd.get("club") || "").trim(),
        perfil: String(fd.get("perfil") || ""),
      }
      var err = caja.querySelector(".cc-err")
      if (!datos.nombre || !/^\S+@\S+\.\S+$/.test(datos.email)) {
        err.textContent = "Necesitamos tu nombre y un email válido para mandarte el material."
        err.hidden = false
        return
      }
      err.hidden = true
      var btn = f.querySelector("button[type=submit]")
      btn.disabled = true
      btn.textContent = "Enviando…"
      enviarPedido(its, t).then(function (r) { resultado = r; paso = 3; render() })
    }
  }

  function enviarPedido(its, t) {
    var nota = [datos.perfil, datos.club ? "Club: " + datos.club : ""].filter(Boolean).join(" · ")
    // Sin cuenta de CobrOS todavía: el pedido igual se cierra por WhatsApp.
    if (!CFG.SLUG) return Promise.resolve({ ok: false, demo: true, total: t })
    return fetch(CFG.API + "/catalogo/" + CFG.SLUG + "/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: datos.nombre, telefono: datos.telefono, email: datos.email, nota: nota,
        items: its.map(function (p) { return { productoId: p.id, cantidad: 1 } }),
      }),
    })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j } }) })
      .then(function (x) {
        if (x.status >= 400) return { ok: false, error: x.j.error || "", total: t }
        var out = { ok: true, total: t }
        for (var k in x.j) out[k] = x.j[k]
        return out
      })
      .catch(function () { return { ok: false, error: "red", total: t } })
  }

  function renderFinal(caja) {
    var r = resultado || {}
    var its = items()
    var t = r.total != null ? r.total : sumar(its)
    var base = document.body.dataset.base || ""
    var msg = "Hola! Soy " + datos.nombre + (datos.club ? " (" + datos.club + ")" : "") +
      ". Pedí este material digital:\n" +
      its.map(function (p) { return "• " + p.nombre + " — " + money(p.precio) }).join("\n") +
      "\nTotal: " + money(t) + "\nEmail: " + datos.email + (datos.perfil ? "\nSoy: " + datos.perfil : "")
    var wa = "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(msg)

    // Gratis: CobrOS entrega en el acto y devuelve el token de la biblioteca.
    if (r.gratis && r.entregaToken) {
      caja.innerHTML =
        '<div class="cc-ok"><span class="cc-ok-ico">✓</span><h4>Listo, es tuyo</h4>' +
        '<p>Te lo mandamos a <b>' + esc(datos.email) + '</b> y lo podés bajar ahora mismo.</p>' +
        '<a class="btn btn-verde cc-full" href="' + base + 'descarga/?t=' + encodeURIComponent(r.entregaToken) + '">Abrir mi descarga</a></div>'
      vaciar()
      return
    }

    var cabecera = r.ok
      ? '<span class="cc-ok-ico">✓</span><h4>Pedido registrado</h4>' +
        '<p>Ya quedó anotado. Apenas confirmemos el pago te llega el material a <b>' + esc(datos.email) + '</b>.</p>'
      : '<span class="cc-ok-ico warn">!</span><h4>Cerralo por WhatsApp</h4><p>' +
        (r.demo
          ? "La tienda todavía no está conectada al panel de cobros: mandanos el pedido y te lo pasamos a mano."
          : "No pudimos registrar el pedido automáticamente, pero no se pierde nada.") + '</p>'

    caja.innerHTML =
      '<div class="cc-ok">' + cabecera +
      '<div class="cc-resumen">' + its.map(function (p) {
        return '<div><span>' + esc(p.nombre) + '</span><b>' + money(p.precio) + '</b></div>'
      }).join("") + '<div class="tot"><span>Total</span><b>' + money(t) + '</b></div></div>' +
      (r.init_point ? '<a class="btn btn-verde cc-full" href="' + esc(r.init_point) + '" target="_blank" rel="noopener">Pagar ahora</a>' : "") +
      '<a class="btn btn-wa cc-full" href="' + wa + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
      '</div>'
  }

  // Tapa del material: la variante (0-3) sale de la categoría, así la grilla
  // no queda como ocho rectángulos iguales.
  function varianteCat(cat) {
    var h = 0
    for (var i = 0; i < cat.length; i++) h = (h * 31 + cat.charCodeAt(i)) % 4
    return h
  }
  function tapaHTML(p) {
    return '<div class="card-tapa v' + varianteCat(p.cat) + '">' +
      '<span class="tapa-fondo" aria-hidden="true">' + p.categoria.slice(0, 12) + '</span>' +
      '<span class="ico">' + iconoCat(p.cat) + '</span>' +
      '<span class="fmt">' + esc(p.formato) + '</span>' +
      (p.precio === 0 ? '<span class="gratis-tag">Gratis</span>' : "") + '</div>'
  }

  function iconoCat(cat) {
    if (cat.indexOf("curso") === 0) return "▶"
    if (cat.indexOf("directiv") === 0) return "■"
    if (cat.indexOf("jugador") === 0) return "●"
    return "◆"
  }

  // ── arranque ──────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    montarPanel()
    pintarBadges()
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-abrir-pedido]")
      if (b) { e.preventDefault(); abrirPanel() }
    })
    cargar()
  })

  window.CC = {
    cfg: CFG, estado: estado, cargar: cargar, alCargar: alCargar,
    productos: function () { return estado.productos },
    money: money, esc: esc, sinAcentos: sinAcentos, iconoCat: iconoCat, tapaHTML: tapaHTML,
    agregar: agregar, sacar: sacar, alternar: alternar, enCarrito: enCarrito,
    items: items, vaciar: vaciar, abrirPanel: abrirPanel, cerrarPanel: cerrarPanel,
  }
})();
