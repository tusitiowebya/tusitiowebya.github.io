/* =========================================================
   Encontrá lo que te gusta — Catálogo conectado a CobrOS
   Lee los productos desde CobrOS y los pedidos caen ahí
   (cargo pendiente + aviso en el panel) + WhatsApp.
   ========================================================= */
(function () {
  "use strict";
  var CFG = {
    API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
    SLUG: "encontra-lo-que-te-gusta",
    WA: "5493815539573",
    NEGOCIO: "Encontrá lo que te gusta",
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return "$" + Number(n || 0).toLocaleString("es-AR"); };

  var grid = $("#cobrosGrid"), chipsBox = $("#cobrosChips"), empty = $("#cobrosEmpty");
  if (!grid) return;

  var ALL = [], activeCat = "Todos", q = "";
  var CART = {};
  try { CART = JSON.parse(localStorage.getItem("encontra_cart") || "{}"); } catch (e) { CART = {}; }
  var save = function () { try { localStorage.setItem("encontra_cart", JSON.stringify(CART)); } catch (e) {} };

  // ---- carga con timeout (nunca cuelga) ----
  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 8000);
  fetch(CFG.API + "/catalogo/" + CFG.SLUG, { signal: ctrl.signal })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (d) { clearTimeout(timer); ALL = d.productos || []; boot(); })
    .catch(function () { clearTimeout(timer); ALL = []; boot(); });

  function boot() {
    var cats = ["Todos"]; ALL.forEach(function (p) { if (p.categoria && cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    if (chipsBox) {
      chipsBox.style.display = cats.length > 1 ? "" : "none";
      chipsBox.innerHTML = cats.map(function (c) { return '<button class="e-chip' + (c === activeCat ? " active" : "") + '" data-c="' + c + '">' + c + "</button>"; }).join("");
      chipsBox.querySelectorAll(".e-chip").forEach(function (b) {
        b.addEventListener("click", function () { activeCat = b.dataset.c; chipsBox.querySelectorAll(".e-chip").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); render(); });
      });
    }
    var s = $("#cobrosSearch"); if (s) s.addEventListener("input", function () { q = this.value.trim().toLowerCase(); render(); });
    render(); renderCart();
  }

  function render() {
    var list = ALL.filter(function (p) {
      if (activeCat !== "Todos" && p.categoria !== activeCat) return false;
      if (q && (p.nombre + " " + (p.descripcion || "") + " " + (p.categoria || "")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    if (empty) {
      if (ALL.length === 0) {
        empty.innerHTML = '<span style="display:block;font-size:52px;margin-bottom:10px">🛍️</span><strong style="display:block;font-size:1.2rem;margin-bottom:6px">Todavía no cargaste tus productos</strong><span style="opacity:.8;display:block;max-width:440px;margin:0 auto">Entrá a tu app <b>CobrOS</b> y cargá tu catálogo (fotos, precios y categorías). Aparecen acá al instante.</span>';
        empty.hidden = false;
      } else { empty.innerHTML = "No encontramos productos con ese filtro."; empty.hidden = list.length > 0; }
    }
    grid.innerHTML = list.map(function (p) {
      var qn = CART[p._id] ? CART[p._id].cantidad : 0;
      var media = p.foto ? '<img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy">' : '<span class="e-noimg">🛍️</span>';
      return '<article class="e-card">'
        + '<div class="e-card-img">' + media + (p.categoria ? '<span class="e-card-cat">' + p.categoria + "</span>" : "") + "</div>"
        + '<div class="e-card-body"><h3>' + p.nombre + "</h3>"
        + '<p class="e-card-desc">' + (p.descripcion || "") + "</p>"
        + '<div class="e-card-foot"><span class="e-price">' + money(p.precio) + (p.unidad ? ' <small>' + p.unidad + "</small>" : "") + "</span>"
        + (qn
            ? '<div class="e-step" data-id="' + p._id + '"><button data-m>−</button><b>' + qn + "</b><button data-p>+</button></div>"
            : '<button class="e-add" data-id="' + p._id + '">Agregar</button>')
        + "</div></div></article>";
    }).join("");
    grid.querySelectorAll(".e-add").forEach(function (b) { b.addEventListener("click", function () { setQty(b.dataset.id, 1); }); });
    grid.querySelectorAll(".e-step").forEach(function (s) {
      var id = s.dataset.id;
      s.querySelector("[data-p]").addEventListener("click", function () { setQty(id, cnt(id) + 1); });
      s.querySelector("[data-m]").addEventListener("click", function () { setQty(id, cnt(id) - 1); });
    });
  }

  function cnt(id) { return CART[id] ? CART[id].cantidad : 0; }
  function setQty(id, n) {
    var p = ALL.find(function (x) { return x._id === id; }); if (!p) return;
    if (n <= 0) delete CART[id]; else CART[id] = { producto: p, cantidad: n };
    save(); render(); renderCart();
  }
  function items() { return Object.keys(CART).map(function (id) { return CART[id]; }); }
  function total() { return items().reduce(function (s, it) { return s + it.producto.precio * it.cantidad; }, 0); }
  function count() { return items().reduce(function (s, it) { return s + it.cantidad; }, 0); }

  function renderCart() {
    var bar = $("#cobrosBar"), n = count();
    if (bar) { bar.classList.toggle("show", n > 0); $("#cobrosBarCount").textContent = n + (n === 1 ? " producto" : " productos"); $("#cobrosBarTotal").textContent = money(total()); }
    var box = $("#cobrosCartItems");
    if (box) {
      box.innerHTML = items().length ? items().map(function (it) {
        var p = it.producto;
        return '<div class="e-ci"><div class="e-ci-info"><strong>' + p.nombre + "</strong><span>" + money(p.precio) + " c/u</span></div>"
          + '<div class="e-step sm" data-id="' + p._id + '"><button data-m>−</button><b>' + it.cantidad + "</b><button data-p>+</button></div></div>";
      }).join("") : '<p class="e-ci-empty">Todavía no agregaste productos.</p>';
      $("#cobrosCartTotal").textContent = money(total());
      box.querySelectorAll(".e-step").forEach(function (s) {
        var id = s.dataset.id;
        s.querySelector("[data-p]").addEventListener("click", function () { setQty(id, cnt(id) + 1); });
        s.querySelector("[data-m]").addEventListener("click", function () { setQty(id, cnt(id) - 1); });
      });
    }
  }

  // drawer
  var drawer = $("#cobrosDrawer"), back = $("#cobrosBack");
  function openD() { drawer.classList.add("open"); back.classList.add("open"); }
  function closeD() { drawer.classList.remove("open"); back.classList.remove("open"); }
  if ($("#cobrosBarBtn")) $("#cobrosBarBtn").addEventListener("click", openD);
  if ($("#cobrosClose")) $("#cobrosClose").addEventListener("click", closeD);
  if (back) back.addEventListener("click", closeD);

  // checkout
  var form = $("#cobrosForm");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!items().length) return;
    var nombre = $("#eNombre").value.trim(), tel = $("#eTel").value.trim(), nota = $("#eNota").value.trim();
    if (!nombre || !tel) return;
    var btn = $("#cobrosSubmit"); btn.disabled = true; btn.textContent = "Enviando…";
    var lines = ["Hola *" + CFG.NEGOCIO + "*! Quiero este pedido por mayor:", ""];
    items().forEach(function (it) { lines.push("• " + it.cantidad + "x " + it.producto.nombre + " — " + money(it.producto.precio * it.cantidad)); });
    lines.push("", "*Total estimado: " + money(total()) + "*", "", "Nombre: " + nombre); if (nota) lines.push("Nota: " + nota);
    var url = "https://wa.me/" + CFG.WA + "?text=" + encodeURIComponent(lines.join("\n"));
    var payload = { nombre: nombre, telefono: tel, nota: nota, items: items().map(function (it) { return { productoId: it.producto._id, cantidad: it.cantidad }; }) };
    fetch(CFG.API + "/catalogo/" + CFG.SLUG + "/pedido", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .catch(function () {})
      .finally(function () {
        window.open(url, "_blank");
        CART = {}; save(); render(); renderCart(); closeD();
        btn.disabled = false; btn.textContent = "Enviar pedido por WhatsApp";
        alert("¡Pedido enviado! Te abrimos WhatsApp para confirmar precios y envío.");
      });
  });
})();
