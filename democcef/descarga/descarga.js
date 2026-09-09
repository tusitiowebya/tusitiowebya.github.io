/* CCEF — biblioteca del comprador.
   Lee ?t=<downloadToken> y muestra lo que CobrOS entregó para esa venta
   (GET /api/cobros-publico/entrega/:token). Sin login: el token ES la llave. */
(function () {
  var CFG = window.CCEF_CONFIG || {}
  var caja = document.getElementById("caja")
  var token = new URLSearchParams(location.search).get("t") || ""

  function wa(m) { return "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(m) }
  var ayuda = document.getElementById("waAyuda")
  if (ayuda) ayuda.href = wa("Hola! Compré material digital y necesito que me reenvíen el enlace de descarga.")

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    })
  }
  function fecha(f) {
    if (!f) return "—"
    try { return new Date(f).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) }
    catch (e) { return "—" }
  }

  function error(titulo, texto) {
    caja.innerHTML = '<h1>' + esc(titulo) + '</h1><p style="color:var(--tiza-2)">' + esc(texto) + '</p>' +
      '<a class="btn btn-verde" style="margin-top:1.4rem" href="../tienda/">Volver a la biblioteca</a>'
  }

  if (!token) {
    error("Nos falta tu enlace", "Esta página se abre desde el enlace que te llega por email después de la compra. Si lo tenés a mano, entrá desde ahí.")
    return
  }

  fetch(CFG.API + "/entrega/" + encodeURIComponent(token))
    .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json() })
    .then(pintar)
    .catch(function (e) {
      if (String(e.message) === "404") {
        error("No encontramos esta entrega", "El enlace puede estar incompleto o haber sido dado de baja. Escribinos y lo revisamos.")
      } else {
        error("No pudimos abrir tu descarga", "Probá de nuevo en un minuto. Si sigue igual, escribinos por WhatsApp y te la reenviamos a mano.")
      }
    })

  function pintar(d) {
    var c = d.contenido || {}
    var est = d.descarga || {}
    var trabado = est.vencido || est.agotado
    var partes = []

    partes.push('<span class="dsc-estado' + (trabado ? " vencido" : "") + '">' +
      (est.vencido ? "Enlace vencido" : est.agotado ? "Descargas agotadas" : "Listo para bajar") + '</span>')
    partes.push('<h1>' + esc((d.producto && d.producto.nombre) || "Tu material") + '</h1>')
    partes.push('<p style="color:var(--tiza-2)">Esto es lo que incluye tu compra. Guardá el archivo en tu compu: el enlace tiene fecha de vencimiento.</p>')

    if (c.archivos && c.archivos.length) {
      partes.push('<div class="dsc-bloque"><h2>Descargas</h2>' + c.archivos.map(function (a) {
        return '<div class="dsc-item"><span><b>' + esc(a.nombre) + '</b>' +
          '<small>' + (a.externo ? "Enlace externo" : "Archivo") + '</small></span>' +
          (trabado ? '<span style="color:var(--gris);font-size:.8rem">No disponible</span>'
            : '<a class="btn btn-verde btn-sm" href="' + esc(a.href) + '">Descargar</a>') + '</div>'
      }).join("") + '</div>')
    }

    if (c.links && c.links.length) {
      partes.push('<div class="dsc-bloque"><h2>Accesos</h2>' + c.links.map(function (l) {
        return '<div class="dsc-item"><span><b>' + esc(l.label || "Acceso") + '</b></span>' +
          '<a class="btn btn-tiza btn-sm" href="' + esc(l.url) + '" target="_blank" rel="noopener">Abrir</a></div>'
      }).join("") + '</div>')
    }

    if (c.credenciales && c.credenciales.length) {
      partes.push('<div class="dsc-bloque"><h2>Tus credenciales</h2>' + c.credenciales.map(function (cr) {
        return '<div class="dsc-item"><span><b>' + esc(cr.label || "Dato") + '</b>' +
          '<small>' + esc(cr.valor) + '</small></span></div>'
      }).join("") + '</div>')
    }

    if (c.licencias && c.licencias.length) {
      partes.push('<div class="dsc-bloque"><h2>Licencias</h2>' +
        c.licencias.map(function (l) { return '<div class="dsc-copia">' + esc(l) + '</div>' }).join("") + '</div>')
    }

    if (c.textos && c.textos.length) {
      partes.push('<div class="dsc-bloque"><h2>Instrucciones</h2>' +
        c.textos.map(function (t) { return '<p style="color:var(--tiza-2);font-size:.92rem">' + esc(t) + '</p>' }).join("") + '</div>')
    }

    partes.push('<div class="dsc-meta">' +
      '<div><span>Entregado</span><b>' + fecha(d.entregadaEn) + '</b></div>' +
      (est.expiraEn ? '<div><span>Vence</span><b>' + fecha(est.expiraEn) + '</b></div>' : "") +
      (est.maxDescargas ? '<div><span>Descargas</span><b>' + (est.descargas || 0) + " de " + est.maxDescargas + '</b></div>' : "") +
      '</div>')

    if (trabado) {
      partes.push('<a class="btn btn-wa cc-full" style="margin-top:1.2rem" href="' +
        wa("Hola! Se me venció el enlace de descarga de " + ((d.producto && d.producto.nombre) || "mi compra") + ". ¿Me lo reenvían?") +
        '" target="_blank" rel="noopener">Pedir que me lo reenvíen</a>')
    }

    caja.innerHTML = partes.join("")
  }
})();
