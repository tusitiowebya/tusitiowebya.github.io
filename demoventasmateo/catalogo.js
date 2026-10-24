/* Vidriera online conectada a CobrOS (ver config.js).
   Estados: cargando (esqueleto) → productos / vacío / error con reintento.
   Nunca muestra productos de ejemplo: sin SLUG o sin productos = estado vacío. */
(function () {
  "use strict";
  var N = window.NEGOCIO || {};
  var grid = document.getElementById("grid");
  var vacio = document.getElementById("estVacio");
  var error = document.getElementById("estError");
  var filtros = document.getElementById("filtros");
  var buscar = document.getElementById("buscar");
  var cats = document.getElementById("cats");
  var TODOS = [], cat = "", q = "";

  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }
  function estado(e) {
    vacio.hidden = e !== "vacio";
    error.hidden = e !== "error";
    filtros.hidden = e !== "ok";
    if (e !== "ok" && e !== "cargando") grid.innerHTML = "";
  }
  function esqueleto() {
    grid.innerHTML = "";
    for (var i = 0; i < 4; i++) {
      var d = document.createElement("div");
      d.className = "prod prod--esq"; d.setAttribute("aria-hidden", "true");
      grid.appendChild(d);
    }
  }

  function pintar() {
    var qs = norm(q);
    var lista = TODOS.filter(function (p) {
      return (!cat || norm(p.categoria) === cat) && (!qs || norm(p.nombre + " " + p.descripcion + " " + p.categoria).indexOf(qs) >= 0);
    });
    grid.innerHTML = "";
    if (!lista.length) {
      var m = document.createElement("p");
      m.textContent = "No encontramos eso en la vidriera. Anotalo en tu lista y lo consultamos por WhatsApp.";
      m.style.gridColumn = "1 / -1";
      grid.appendChild(m);
      return;
    }
    lista.forEach(function (p) {
      var art = document.createElement("article");
      art.className = "prod";
      var foto = document.createElement("div");
      foto.className = "prod__foto";
      if (p.foto) {
        var img = document.createElement("img");
        img.src = p.foto; img.alt = p.nombre; img.loading = "lazy"; img.width = 400; img.height = 400;
        foto.appendChild(img);
      }
      var etq = document.createElement("span");
      etq.className = "etq";
      etq.textContent = p.precio > 0 ? "$ " + Math.round(p.precio).toLocaleString("es-AR") : "CONSULTAR";
      foto.appendChild(etq);
      var c = document.createElement("div");
      c.className = "prod__cuerpo";
      var k = document.createElement("span"); k.className = "prod__cat"; k.textContent = p.categoria || "";
      var h = document.createElement("h3"); h.textContent = p.nombre;
      c.appendChild(k); c.appendChild(h);
      if (p.descripcion) { var d = document.createElement("p"); d.textContent = p.descripcion; c.appendChild(d); }
      var b = document.createElement("button");
      b.type = "button"; b.textContent = "Sumar a la lista";
      b.addEventListener("click", function () {
        if (window.VM_lista && window.VM_lista.agregar(p.nombre, p.precio > 0 ? p.precio : 0)) {
          b.textContent = "En tu lista ✓"; b.classList.add("ok");
          setTimeout(function () { b.textContent = "Sumar a la lista"; b.classList.remove("ok"); }, 2200);
        }
      });
      c.appendChild(b);
      art.appendChild(foto); art.appendChild(c);
      grid.appendChild(art);
    });
  }

  function chips() {
    var vistos = {}, orden = [];
    TODOS.forEach(function (p) { var k = norm(p.categoria); if (k && !vistos[k]) { vistos[k] = p.categoria; orden.push(k); } });
    cats.innerHTML = "";
    [""].concat(orden).forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip";
      b.textContent = k ? vistos[k] : "Todo";
      b.setAttribute("aria-pressed", k === cat ? "true" : "false");
      b.addEventListener("click", function () { cat = k; chips(); pintar(); });
      cats.appendChild(b);
    });
  }

  function cargar() {
    if (!N.SLUG) { estado("vacio"); return; }
    estado("cargando"); esqueleto();
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, N.TIMEOUT_MS || 8000);
    fetch(N.API + "/catalogo/" + encodeURIComponent(N.SLUG), ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        clearTimeout(t);
        TODOS = (j && j.productos || []).filter(function (p) { return p && p.nombre; });
        if (!TODOS.length) { estado("vacio"); return; }
        estado("ok"); chips(); pintar();
      })
      .catch(function () { clearTimeout(t); estado("error"); });
  }

  buscar.addEventListener("input", function () { q = buscar.value; pintar(); });
  document.getElementById("reintentar").addEventListener("click", cargar);
  cargar();
})();
