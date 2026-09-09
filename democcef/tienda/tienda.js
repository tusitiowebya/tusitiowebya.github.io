/* CCEF — biblioteca digital. Filtros, orden, ficha y deep-links (?cat= ?q= ?p=). */
(function () {
  // Modo QA: ?qa fuerza el estado final (reveals, animaciones) para capturas.
  if (/[?&]qa/.test(location.search)) document.documentElement.classList.add("qa")
  var CFG = window.CCEF_CONFIG || {}
  var $ = function (s, c) { return (c || document).querySelector(s) }
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)) }
  var filtro = { cat: "todas", fmt: "todos", precio: "todos", q: "" }
  var orden = "destacado"

  // ── Nav + contacto ────────────────────────────────────────────────────────
  var nav = document.getElementById("nav"), burger = document.getElementById("burger")
  if (burger) {
    burger.addEventListener("click", function () {
      var a = nav.classList.toggle("abierta")
      burger.setAttribute("aria-expanded", a ? "true" : "false")
      document.body.style.overflow = a ? "hidden" : ""
    })
  }
  function wa(m) { return "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(m) }
  var wp = document.getElementById("waPie")
  if (wp) wp.href = wa("Hola! Te escribo desde la biblioteca digital de la web.")
  var wy = document.getElementById("waAyuda")
  if (wy) wy.href = wa("Hola! Trabajo con la categoría ___ y quiero saber qué material me sirve.")
  var anio = document.getElementById("anio")
  if (anio) anio.textContent = new Date().getFullYear()

  // ── URL ───────────────────────────────────────────────────────────────────
  function leerURL() {
    var u = new URLSearchParams(location.search)
    filtro.cat = u.get("cat") || "todas"
    filtro.fmt = u.get("fmt") || "todos"
    filtro.precio = u.get("precio") || "todos"
    filtro.q = u.get("q") || ""
    orden = u.get("orden") || "destacado"
    if (filtro.q) $("#buscar").value = filtro.q
    $("#orden").value = orden
  }
  function escribirURL() {
    var u = new URLSearchParams()
    if (filtro.cat !== "todas") u.set("cat", filtro.cat)
    if (filtro.fmt !== "todos") u.set("fmt", filtro.fmt)
    if (filtro.precio !== "todos") u.set("precio", filtro.precio)
    if (filtro.q) u.set("q", filtro.q)
    if (orden !== "destacado") u.set("orden", orden)
    var s = u.toString()
    history.replaceState(null, "", s ? "?" + s : location.pathname)
  }

  // ── Filtrado ──────────────────────────────────────────────────────────────
  function claveFmt(p) { return window.CC.sinAcentos(p.formato).split(" ")[0] }

  function filtrados() {
    var q = window.CC.sinAcentos(filtro.q).split(/\s+/).filter(Boolean)
    var out = window.CC.productos().filter(function (p) {
      if (filtro.cat !== "todas" && p.cat !== filtro.cat) return false
      if (filtro.fmt !== "todos" && claveFmt(p) !== filtro.fmt) return false
      if (filtro.precio === "gratis" && p.precio !== 0) return false
      if (filtro.precio === "pago" && p.precio === 0) return false
      if (q.length) {
        var txt = window.CC.sinAcentos(p.nombre + " " + p.descripcion + " " + p.categoria + " " + p.formato)
        for (var i = 0; i < q.length; i++) if (txt.indexOf(q[i]) === -1) return false
      }
      return true
    })
    if (orden === "precio-asc") out.sort(function (a, b) { return a.precio - b.precio })
    else if (orden === "precio-desc") out.sort(function (a, b) { return b.precio - a.precio })
    else if (orden === "nombre") out.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es") })
    else out.sort(function (a, b) { return (a.precio === 0 ? -1 : 0) - (b.precio === 0 ? -1 : 0) })
    return out
  }

  // ── Pintado ───────────────────────────────────────────────────────────────
  function pintarFiltros() {
    var prods = window.CC.productos()
    var cats = {}, fmts = {}
    prods.forEach(function (p) {
      cats[p.cat] = cats[p.cat] || { nombre: p.categoria, n: 0 }
      cats[p.cat].n++
      var k = claveFmt(p)
      fmts[k] = fmts[k] || { nombre: p.formato.split(" ")[0], n: 0 }
      fmts[k].n++
    })
    $("#cats").innerHTML =
      '<li><button data-cat="todas" class="' + (filtro.cat === "todas" ? "on" : "") + '">Todo el material <i>' + prods.length + '</i></button></li>' +
      Object.keys(cats).map(function (k) {
        return '<li><button data-cat="' + k + '" class="' + (filtro.cat === k ? "on" : "") + '">' +
          window.CC.esc(cats[k].nombre) + ' <i>' + cats[k].n + '</i></button></li>'
      }).join("")
    $("#formatos").innerHTML =
      '<li><button data-fmt="todos" class="' + (filtro.fmt === "todos" ? "on" : "") + '">Todos <i>' + prods.length + '</i></button></li>' +
      Object.keys(fmts).map(function (k) {
        return '<li><button data-fmt="' + k + '" class="' + (filtro.fmt === k ? "on" : "") + '">' +
          window.CC.esc(fmts[k].nombre) + ' <i>' + fmts[k].n + '</i></button></li>'
      }).join("")
    $$("#cats button").forEach(function (b) {
      b.onclick = function () { filtro.cat = b.dataset.cat; aplicar() }
    })
    $$("#formatos button").forEach(function (b) {
      b.onclick = function () { filtro.fmt = b.dataset.fmt; aplicar() }
    })
    $$('[data-filtro="precio"] .pz-op').forEach(function (b) {
      b.classList.toggle("on", b.dataset.v === filtro.precio)
    })

    var gratis = prods.filter(function (p) { return p.precio === 0 }).length
    $("#tiendaDatos").innerHTML =
      '<div><b>' + prods.length + '</b><span>Materiales</span></div>' +
      '<div><b>' + Object.keys(cats).length + '</b><span>Categorías</span></div>' +
      '<div><b>' + gratis + '</b><span>Gratuitos</span></div>' +
      '<div><b>24 h</b><span>Entrega</span></div>'
  }

  function tarjeta(p) {
    var ya = window.CC.enCarrito(p.id)
    return '<article class="card" data-p="' + window.CC.esc(p.id) + '">' +
      window.CC.tapaHTML(p) +
      '<div class="card-cuerpo"><span class="card-cat">' + window.CC.esc(p.categoria) + '</span>' +
      '<h3>' + window.CC.esc(p.nombre) + '</h3>' +
      '<p>' + window.CC.esc(p.descripcion) + '</p>' +
      '<div class="card-pie"><span class="card-precio' + (p.precio === 0 ? " es-gratis" : "") + '">' + window.CC.money(p.precio) + '</span>' +
      '<button class="card-add' + (ya ? " ya" : "") + '" data-add="' + window.CC.esc(p.id) + '">' + (ya ? "Agregado ✓" : "Agregar") + '</button>' +
      '</div></div></article>'
  }

  function pintarGrilla() {
    var lista = filtrados()
    $("#grilla").innerHTML = lista.map(tarjeta).join("")
    $("#sinResultados").hidden = lista.length > 0
    $("#conteo").textContent = lista.length === window.CC.productos().length
      ? lista.length + " materiales"
      : lista.length + " de " + window.CC.productos().length + " materiales"
    $$("#grilla .card").forEach(function (c) {
      c.onclick = function (e) {
        if (e.target.closest("[data-add]")) return
        abrirFicha(c.dataset.p)
      }
    })
    $$("#grilla [data-add]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation()
        window.CC.alternar(b.dataset.add)
        pintarGrilla()
      }
    })
    var aviso = $("#aviso")
    if (aviso && !window.CC.estado.conectado) {
      aviso.innerHTML = '<p class="aviso-catalogo"><b>Catálogo de muestra.</b> Con la cuenta de cobros conectada, ' +
        'el material se carga una sola vez en el panel (con su archivo, su precio y su vencimiento de descarga) y aparece acá solo.</p>'
    }
  }

  function aplicar() {
    escribirURL()
    pintarFiltros()
    pintarGrilla()
  }

  // ── Ficha ─────────────────────────────────────────────────────────────────
  function abrirFicha(id) {
    var p = window.CC.productos().filter(function (x) { return x.id === id })[0]
    if (!p) return
    var ya = window.CC.enCarrito(p.id)
    var modos = {
      archivo: "Archivo para descargar", link: "Acceso online",
      credencial: "Usuario y contraseña", licencia: "Licencia personal", texto: "Instrucciones",
    }
    $("#fichaCuerpo").innerHTML =
      '<div class="ficha-tapa">' + window.CC.iconoCat(p.cat) + '</div>' +
      '<div class="ficha-txt">' +
      '<span class="card-cat">' + window.CC.esc(p.categoria) + '</span>' +
      '<h3>' + window.CC.esc(p.nombre) + '</h3>' +
      '<p>' + window.CC.esc(p.descripcion) + '</p>' +
      '<div class="ficha-specs">' +
      '<div><span>Formato</span><b>' + window.CC.esc(p.formato) + '</b></div>' +
      (p.peso ? '<div><span>Tamaño</span><b>' + window.CC.esc(p.peso) + '</b></div>' : "") +
      '<div><span>Entrega</span><b>Por email, al confirmarse el pago</b></div>' +
      (p.modos && p.modos.length
        ? '<div><span>Incluye</span><b>' + p.modos.map(function (m) { return modos[m] || m }).join(" · ") + '</b></div>'
        : "") +
      '</div>' +
      '<div class="ficha-precio"><b class="' + (p.precio === 0 ? "es-gratis" : "") + '">' + window.CC.money(p.precio) + '</b>' +
      (p.precio === 0 ? '<span style="color:var(--gris);font-size:.85rem">Es nuestra puerta de entrada</span>' : "") + '</div>' +
      '<button class="btn btn-verde cc-full" data-add-ficha="' + window.CC.esc(p.id) + '">' +
      (ya ? "Quitar del pedido" : (p.precio === 0 ? "Sumar y descargar" : "Agregar al pedido")) + '</button>' +
      '<button class="btn btn-tiza cc-full" data-abrir-pedido>Ver mi pedido</button>' +
      '<p class="ficha-entrega">Te llega un enlace propio a tu email, con vencimiento y tope de descargas. ' +
      'Si se te vence, escribinos y te lo reenviamos.</p>' +
      '</div>'
    $("#ficha").classList.add("abierta")
    $("#ficha").setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"
    var b = $("[data-add-ficha]")
    b.onclick = function () {
      window.CC.alternar(p.id)
      pintarGrilla()
      abrirFicha(p.id)
    }
  }
  function cerrarFicha() {
    $("#ficha").classList.remove("abierta")
    $("#ficha").setAttribute("aria-hidden", "true")
    document.body.style.overflow = ""
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-cerrar-ficha]")) cerrarFicha()
  })
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrarFicha() })

  // ── Eventos de UI ─────────────────────────────────────────────────────────
  var tBuscar
  $("#buscar").addEventListener("input", function (e) {
    clearTimeout(tBuscar)
    var v = e.target.value
    tBuscar = setTimeout(function () { filtro.q = v; aplicar() }, 220)
  })
  $("#orden").addEventListener("change", function (e) { orden = e.target.value; aplicar() })
  $$('[data-filtro="precio"] .pz-op').forEach(function (b) {
    b.onclick = function () { filtro.precio = b.dataset.v; aplicar() }
  })

  leerURL()
  window.CC.alCargar(function () {
    aplicar()
    var pid = new URLSearchParams(location.search).get("p")
    if (pid) abrirFicha(pid)
  })
  document.addEventListener("cc:carrito", function () { pintarGrilla() })
})();
