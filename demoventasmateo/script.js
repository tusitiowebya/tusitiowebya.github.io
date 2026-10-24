/* Ventas Mateo · Polirubro — persiana, lista y WhatsApp */
(function () {
  "use strict";
  var N = window.NEGOCIO || { WA: "5492226444745", NOMBRE: "Ventas Mateo" };
  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esMovil = function () { return window.matchMedia("(max-width: 768px)").matches; };

  function waUrl(txt) { return "https://wa.me/" + N.WA + "?text=" + encodeURIComponent(txt); }

  /* ─── Links de WhatsApp con mensaje según dónde se toca ─── */
  var MSJ = {
    nav: "Hola Ventas Mateo, quería hacer una consulta.",
    hero: "Hola Ventas Mateo, quería saber si tienen algo que estoy buscando.",
    tel: "Hola Ventas Mateo, quería hacer una consulta.",
    vidriera: "Hola Ventas Mateo, vi la página y quería consultar por productos y precios.",
    faq: "Hola Ventas Mateo, ¿me pasan la dirección y cómo entregan?",
    cierre: "Hola Ventas Mateo, ¿lo tendrán? Busco: ",
    pie: "Hola Ventas Mateo, quería hacer una consulta.",
    fab: "Hola Ventas Mateo, quería hacer una consulta."
  };
  $$("[data-wa]").forEach(function (a) { a.href = waUrl(MSJ[a.getAttribute("data-wa")] || MSJ.nav); });

  /* ─── Nav móvil ─── */
  var nav = $("#nav"), burger = $("#burger");
  function cerrarMenu() { nav.classList.remove("abierto"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var ab = nav.classList.toggle("abierto");
    burger.setAttribute("aria-expanded", ab ? "true" : "false");
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", cerrarMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrarMenu(); });

  /* ─── Hero: video por breakpoint (no en liviano) y persiana ─── */
  var video = $("#heroVideo");
  if (video) {
    if (esMovil()) video.poster = video.getAttribute("data-poster-m");
    if (!html.classList.contains("lite")) {
      video.src = video.getAttribute(esMovil() ? "data-src-m" : "data-src");
      video.preload = "auto";
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  }
  function abrir() { html.classList.add("abierta"); }
  if (html.classList.contains("lite") || html.classList.contains("qa")) abrir();
  else if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(abrir, 150); });
  setTimeout(abrir, 900); // tope: la persiana no espera a nada más

  /* ─── Reveal ─── */
  var rev = $$(".reveal");
  if ("IntersectionObserver" in window && !html.classList.contains("lite")) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    rev.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("in"); });

  /* ─── FAB: aparece pasado el hero, se esconde en el cierre ─── */
  var fab = $("#fab"), hero = $(".hero"), cierre = $(".cierre"), mostrador = $(".mostrador");
  function enPantalla(el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; }
  function fabCheck() {
    var pasado = window.scrollY > hero.offsetHeight * 0.7;
    // fuera del cierre y del formulario de la lista, que ya tienen su botón de WhatsApp
    fab.classList.toggle("ver", pasado && !enPantalla(cierre) && !enPantalla(mostrador));
  }
  window.addEventListener("scroll", fabCheck, { passive: true });
  fabCheck();

  /* ─── fitText: textos de una línea que no deben cortarse (letra grande de Android) ─── */
  function fit() {
    $$("[data-fit]").forEach(function (el) {
      el.style.fontSize = "";
      var fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 14 && n < 60) {
        fs -= 1; el.style.fontSize = fs + "px"; n++;
      }
    });
  }
  window.__vmFit = fit;
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("load", fit);
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fit, 120); });

  /* ══════════ LA LISTA ══════════ */
  var KEY = "vm-lista-v1";
  var estado = { items: [], para: [], entrega: "", cuando: "", nombre: "" };
  try {
    var g = JSON.parse(localStorage.getItem(KEY) || "null");
    if (g && Array.isArray(g.items)) estado = Object.assign(estado, g);
  } catch (e) {}
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch (e) {} }

  var ol = $("#items"), vacia = $("#vacia"), total = $("#total");
  var inp = $("#item"), cantOut = $("#cant"), ayuda = $("#ayudaItem");
  var pistola = $("#pistola"), err = $("#err"), enviar = $("#enviar"), prev = $("#prev");
  var nombre = $("#nombre");
  var cant = 1;
  var AYUDA = ayuda.textContent;

  function fmtPrecio(n) { return "$ " + Math.round(n).toLocaleString("es-AR"); }

  function pintar(nuevoIdx) {
    ol.innerHTML = "";
    estado.items.forEach(function (it, i) {
      var li = document.createElement("li");
      if (i === nuevoIdx) li.className = "nuevo";
      var txt = document.createElement("span");
      txt.className = "txt";
      if (it.q > 1) { var q = document.createElement("i"); q.textContent = it.q + " x"; txt.appendChild(q); }
      txt.appendChild(document.createTextNode(it.t));
      var etq = document.createElement("span");
      etq.className = "etq" + (it.p ? " etq--precio" : "");
      etq.style.setProperty("--r", (((i * 37) % 9) - 5) + "deg");
      etq.textContent = it.p ? fmtPrecio(it.p) : "¿$?";
      etq.title = it.p ? "Precio de la vidriera online" : "El precio te lo pasamos por WhatsApp";
      var x = document.createElement("button");
      x.type = "button"; x.className = "quitar"; x.textContent = "×";
      x.setAttribute("aria-label", "Quitar " + it.t);
      x.addEventListener("click", function () { estado.items.splice(i, 1); guardar(); pintar(); mensaje(); });
      li.appendChild(txt); li.appendChild(etq); li.appendChild(x);
      ol.appendChild(li);
    });
    var n = estado.items.length;
    vacia.hidden = n > 0;
    total.hidden = n === 0;
    if (n) {
      var u = estado.items.reduce(function (s, it) { return s + it.q; }, 0);
      total.innerHTML = "<b>" + n + (n === 1 ? " COSA" : " COSAS") + " · " + u + (u === 1 ? " UNIDAD" : " UNIDADES") + "</b><br>Donde dice ¿$? te pasamos el precio por WhatsApp.";
    }
  }

  function agregar(t, q, p) {
    t = (t || "").replace(/\s+/g, " ").trim();
    if (!t) return false;
    if (estado.items.length >= 30) { avisar("La lista llegó a 30 cosas. Mandala y seguimos por el chat.", "mal"); return false; }
    var k = t.toLowerCase(), idx = -1;
    estado.items.forEach(function (it, i) { if (it.t.toLowerCase() === k) idx = i; });
    if (idx >= 0) estado.items[idx].q = Math.min(99, estado.items[idx].q + q);
    else { estado.items.push({ t: t, q: q, p: p || 0 }); idx = estado.items.length - 1; }
    guardar(); pintar(idx); mensaje();
    pistola.classList.remove("clic"); void pistola.offsetWidth; pistola.classList.add("clic");
    err.hidden = true;
    return true;
  }
  window.VM_lista = {
    agregar: function (t, p) {
      var ok = agregar(t, 1, p);
      if (ok) avisar("«" + t + "» quedó en tu lista.", "ok");
      return ok;
    }
  };

  var tAviso;
  function avisar(txt, tipo) {
    ayuda.textContent = txt; ayuda.className = "ayuda " + (tipo || "");
    clearTimeout(tAviso);
    tAviso = setTimeout(function () { ayuda.textContent = AYUDA; ayuda.className = "ayuda"; }, 3200);
  }

  $("#form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = inp.value;
    if (!t.trim()) { avisar("Escribí qué buscás y tocá Anotar.", "mal"); inp.focus(); return; }
    if (agregar(t, cant)) {
      avisar("Anotado. Seguí con la próxima.", "ok");
      inp.value = ""; cant = 1; cantOut.textContent = "1";
      inp.focus({ preventScroll: true });
      if (esMovil()) {
        var r = ol.lastElementChild && ol.lastElementChild.getBoundingClientRect();
        if (r && (r.top < 70 || r.bottom > window.innerHeight)) ol.lastElementChild.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  });
  $("#menos").addEventListener("click", function () { cant = Math.max(1, cant - 1); cantOut.textContent = cant; });
  $("#mas").addEventListener("click", function () { cant = Math.min(99, cant + 1); cantOut.textContent = cant; });

  /* Placeholder que va cambiando con ejemplos de cómo anotar */
  var EJ = ["pilas AA", "cinta de embalar", "algo para regalar a un nene de 5", "repasadores", "un termo", "cuaderno rayado"], ej = 0;
  setInterval(function () {
    if (document.activeElement === inp || inp.value) return;
    ej = (ej + 1) % EJ.length; inp.placeholder = "Ej.: " + EJ[ej];
  }, 2600);

  /* Chips */
  $$(".chips[data-grupo]").forEach(function (grupo) {
    var key = grupo.getAttribute("data-grupo"), multi = key === "para";
    var chips = $$(".chip", grupo);
    function sync() {
      chips.forEach(function (c) {
        var v = c.getAttribute("data-v");
        var on = multi ? estado.para.indexOf(v) >= 0 : estado[key] === v;
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var v = c.getAttribute("data-v");
        if (multi) {
          var i = estado.para.indexOf(v);
          if (i >= 0) estado.para.splice(i, 1); else estado.para.push(v);
        } else estado[key] = estado[key] === v ? "" : v;
        sync(); guardar(); mensaje();
      });
    });
    sync();
  });

  nombre.value = estado.nombre || "";
  nombre.addEventListener("input", function () { estado.nombre = nombre.value.trim(); guardar(); mensaje(); });

  function texto() {
    var L = [];
    L.push("Hola Ventas Mateo" + (estado.nombre ? ", soy " + estado.nombre : "") + ". ¿Tienen esto? Te paso mi lista:");
    L.push("");
    estado.items.forEach(function (it, i) {
      L.push((i + 1) + ". " + (it.q > 1 ? it.q + " x " : "") + it.t + (it.p ? " (vi " + fmtPrecio(it.p) + " en la vidriera)" : ""));
    });
    var extra = [];
    if (estado.para.length) extra.push("Es " + estado.para.join(" y ").toLowerCase() + ".");
    if (estado.entrega) extra.push(estado.entrega + ".");
    if (estado.cuando) extra.push("Lo necesito: " + estado.cuando.toLowerCase() + ".");
    if (extra.length) { L.push(""); L.push(extra.join(" ")); }
    L.push("");
    L.push("¿Me pasás qué hay y el precio de cada cosa? Gracias.");
    return L.join("\n");
  }
  function mensaje() {
    var t = texto();
    prev.textContent = estado.items.length ? t : "Anotá algo en la lista y acá vas a ver el mensaje.";
    enviar.href = waUrl(t);
  }
  enviar.addEventListener("click", function (e) {
    if (!estado.items.length) {
      e.preventDefault();
      err.hidden = false;
      inp.focus();
    }
  });
  $("#borrar").addEventListener("click", function () {
    if (!estado.items.length) return;
    estado.items = []; guardar(); pintar(); mensaje();
    avisar("Lista vacía. Arrancamos de nuevo.", "ok");
  });

  pintar(); mensaje();
})();
