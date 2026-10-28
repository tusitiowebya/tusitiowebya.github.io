/* TuPaginaYa v3 · comportamiento compartido (todas las páginas) */
(function () {
  "use strict";
  var WA = "5491157204355";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waLink = function (t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); };

  /* ---------- header + menú móvil ---------- */
  var hdr = $(".hdr");
  var onScroll = function () { if (hdr) hdr.classList.toggle("solid", window.scrollY > 24); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = $(".burger"), mnav = $(".mnav");
  if (burger && mnav) {
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      mnav.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () { setOpen(burger.getAttribute("aria-expanded") !== "true"); });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- revelado al scroll ---------- */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window && !document.documentElement.classList.contains("lite")) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }
  var trails = $$(".trails");
  trails.forEach(function (t) { t.classList.add("run"); });

  /* ---------- barra de dirección (home) ---------- */
  var ub = $("#urlbar");
  if (ub) {
    // el WhatsApp flotante aparece recién después del hero (no tapa el formulario)
    var wf = $(".wa-float");
    var heroH = function () { return ($("#hero") || ub).offsetHeight * 0.7; };
    var waToggle = function () { if (wf) wf.classList.toggle("hide", window.scrollY < heroH()); };
    waToggle();
    window.addEventListener("scroll", waToggle, { passive: true });
    var inp = $("#negocio", ub), out = $("#urlName", ub), go = $("#urlGo", ub), goTxt = $("span", go);
    var slug = function (v) {
      return v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/&/g, "y").replace(/[^a-z0-9]+/g, "").slice(0, 40);
    };
    var examples = ["tunegocio", "panaderialaesquina", "fletesrodriguez", "estudiogarcia", "cabanaselbosque"];
    var typing = true, ei = 0, ci = 0, del = false;
    var tick = function () {
      if (!typing) return;
      var w = examples[ei];
      ci += del ? -1 : 1;
      out.textContent = w.slice(0, ci);
      var wait = del ? 45 : 95;
      if (!del && ci === w.length) { del = true; wait = 1600; }
      else if (del && ci === 1) { del = false; ci = 0; ei = (ei + 1) % examples.length; wait = 200; }
      setTimeout(tick, wait);
    };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(tick, 900);
    else out.textContent = "tunegocio";
    var update = function () {
      var raw = inp.value.trim(), s = slug(raw);
      typing = !raw;
      if (!raw) { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) { ci = 0; del = false; setTimeout(tick, 400); } return; }
      out.textContent = s || "tunegocio";
      goTxt.textContent = s ? "Pedir la demo de " + s + ".com.ar" : "Pedir mi demo gratis";
    };
    inp.addEventListener("input", update);
    ub.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = inp.value.trim(), s = slug(raw);
      var msg = raw
        ? "Hola TuPaginaYa! Quiero la demo gratis de mi web. Mi negocio se llama " + raw + ". Si está libre, me gustaría el dominio " + s + ".com.ar"
        : "Hola TuPaginaYa! Quiero mi demo gratis";
      window.open(waLink(msg), "_blank", "noopener");
    });
  }

  /* ---------- armá tu web (recomendador de plan) ---------- */
  $$(".picker").forEach(function (pk) {
    var res = $(".result", pk);
    var read = function (n) { var c = $("input[name='" + n + "']:checked", pk); return c ? c.value : ""; };
    var render = function () {
      var vende = read("vende"), carga = read("carga");
      var rubroSel = $("select", pk), rubro = rubroSel && rubroSel.value ? rubroSel.options[rubroSel.selectedIndex].text : "";
      var cat = vende === "muchos" || (vende === "algunos" && carga === "yo");
      var plan = cat
        ? { n: "Web + Catálogo", p: "$35.000/mes + $100.000 de activación", w: "Tenés productos para mostrar y querés actualizarlos vos: la app CobrOS publica tu catálogo en la web y los pedidos te llegan por WhatsApp." }
        : { n: "Plan Profesional", p: "$17.000/mes + $50.000 de activación", w: vende === "algunos"
            ? "Con pocos productos alcanza con mostrarlos en la web: los cambios los hacemos nosotros (5 por mes incluidos)."
            : "Para un negocio de servicios: web a medida con tus servicios, tu zona y el contacto por WhatsApp." };
      $("h3", res).textContent = plan.n;
      $("p", res).textContent = plan.w;
      $(".price", res).textContent = plan.p;
      var resumen = "Hola TuPaginaYa! Me recomendaron el " + plan.n + "." +
        (rubro ? " Mi rubro: " + rubro + "." : "") +
        (vende ? " Productos: " + ({ muchos: "muchos", algunos: "algunos", no: "no, vendo servicios" })[vende] + "." : "") +
        " Quiero mi demo gratis.";
      $(".btn", res).href = waLink(resumen);
    };
    pk.addEventListener("change", render);
    render();
  });

  /* ---------- filtros de trabajos ---------- */
  var fl = $("#filters");
  if (fl) {
    var cards = $$("#works .work");
    fl.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", fl).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var r = b.getAttribute("data-r");
      cards.forEach(function (c) { c.hidden = r !== "all" && c.getAttribute("data-r") !== r; });
      var u = new URL(location.href);
      if (r === "all") u.searchParams.delete("rubro"); else u.searchParams.set("rubro", r);
      history.replaceState(null, "", u);
    });
    var pre = new URL(location.href).searchParams.get("rubro");
    if (pre) { var pb = $("button[data-r='" + pre + "']", fl); if (pb) pb.click(); }
  }

  /* ---------- formulario de demo → WhatsApp ---------- */
  $$(".demo-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$(".err", form).forEach(function (x) { x.textContent = ""; });
      $$("[data-req]", form).forEach(function (f) {
        if (!f.value.trim()) { f.parentElement.querySelector(".err").textContent = f.getAttribute("data-req"); ok = false; }
      });
      var tel = $("[name=whatsapp]", form);
      if (tel.value.trim() && !/^[\d+\s()\-]{8,20}$/.test(tel.value.trim())) { tel.parentElement.querySelector(".err").textContent = "Revisá el número: solo números, espacios o guiones"; ok = false; }
      if (!ok) return;
      var v = function (n) { return $("[name=" + n + "]", form).value.trim(); };
      var msg = "Hola TuPaginaYa! Quiero mi demo gratis.\nNegocio: " + v("nombre") + "\nRubro: " + v("rubro") +
        "\nQué ofrece: " + v("productos") + "\nMi WhatsApp: " + v("whatsapp");
      window.open(waLink(msg), "_blank", "noopener");
      form.hidden = true;
      var okBox = form.parentElement.querySelector(".form-ok"); if (okBox) okBox.classList.add("show");
    });
  });

  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
})();
