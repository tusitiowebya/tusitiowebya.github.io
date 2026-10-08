(function () {
  "use strict";

  // ?qa: muestra todo sin animaciones (capturas de página completa)
  if (/[?&]qa\b/.test(location.search)) document.documentElement.classList.add("qa");

  var WA = "5492326404051";
  var STORE_KEY = "dosalas-consulta";

  var UNITS = {
    ps: { name: "Punto Service", color: "#7fb8d6", txt: "#1f5f7d", line: "refrigeración, aire acondicionado, electricidad o electrónica" },
    ab: { name: "AB Construcciones", color: "#e3ac2f", txt: "#855d05", line: "mantenimiento, pintura, piscinas, refacciones o construcción" },
    ev: { name: "Espacios Verdes", color: "#7fae6c", txt: "#2f6b33", line: "parques o poda en altura" }
  };

  // Puntos del plano (coordenadas en el viewBox 1000x560 del SVG)
  var SPOTS = [
    { id: "aire", unit: "ps", n: 1, x: 372, y: 290, title: "Aire acondicionado",
      text: "Si el equipo no enfría, gotea, hace ruido o no arranca, o si necesitás un trabajo nuevo, lo ve Punto Service.",
      send: "foto de la etiqueta del equipo (marca y frigorías) y un video corto si hace ruido." },
    { id: "frio", unit: "ps", n: 2, x: 603, y: 296, title: "Refrigeración",
      text: "Heladeras, freezers y equipos de frío que no enfrían, cortan o pierden agua.",
      send: "marca y modelo del equipo, y qué hace exactamente." },
    { id: "elec", unit: "ps", n: 3, x: 213, y: 306, title: "Electricidad",
      text: "Tablero, térmicas que saltan, enchufes o una instalación que hay que revisar.",
      send: "foto del tablero y qué se corta o salta." },
    { id: "electro", unit: "ps", n: 4, x: 400, y: 396, title: "Electrónica",
      text: "Equipos electrónicos que dejaron de andar o fallan.",
      send: "marca, modelo y qué falla." },
    { id: "mant", unit: "ab", n: 5, x: 410, y: 196, title: "Mantenimiento en general",
      text: "Lo que la casa necesita para seguir en condiciones, por dentro y por fuera.",
      send: "fotos del lugar y una descripción breve de lo que pasa." },
    { id: "pint", unit: "ab", n: 6, x: 492, y: 312, title: "Pintura",
      text: "Paredes, ambientes o frentes para pintar.",
      send: "fotos de la superficie y medidas aproximadas (largo × alto)." },
    { id: "ref", unit: "ab", n: 7, x: 497, y: 444, title: "Refacciones",
      text: "Cocina, baño o cualquier ambiente que quieras renovar.",
      send: "fotos del ambiente y qué te gustaría cambiar." },
    { id: "cons", unit: "ab", n: 8, x: 705, y: 362, title: "Construcciones",
      text: "Una ampliación o una construcción nueva.",
      send: "un croquis o plano si tenés, y las medidas del terreno." },
    { id: "pile", unit: "ab", n: 9, x: 885, y: 512, title: "Construcción de piscinas",
      text: "Piscinas nuevas, a cargo de AB Construcciones.",
      send: "medidas del espacio disponible y fotos del terreno." },
    { id: "poda", unit: "ev", n: 10, x: 150, y: 52, title: "Poda en altura",
      text: "Árboles altos que hay que podar, despejar o controlar.",
      send: "foto del árbol entero y qué tiene cerca (cables, techo, vereda)." },
    { id: "parque", unit: "ev", n: 11, x: 52, y: 516, title: "Parques",
      text: "Cuidado y mantenimiento de parques y espacios verdes.",
      send: "fotos y medida aproximada del terreno." }
  ];

  var byId = {};
  SPOTS.forEach(function (s) { byId[s.id] = s; });

  function waLink(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }

  var MSG = {
    general: "Hola Dos Alas, vi la página y quiero hacer una consulta.",
    ps: "Hola Dos Alas, quiero consultar a Punto Service por " + UNITS.ps.line + ".",
    ab: "Hola Dos Alas, quiero consultar a AB Construcciones por " + UNITS.ab.line + ".",
    ev: "Hola Dos Alas, quiero consultar a Espacios Verdes por " + UNITS.ev.line + "."
  };
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var m = MSG[a.getAttribute("data-wa")];
    if (m) a.href = waLink(m);
  });

  /* ---------- Menú ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); }
  });
  function onScroll() { nav.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Plano de consulta ---------- */
  var picked = [];
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (Array.isArray(saved)) picked = saved.filter(function (id) { return byId[id]; });
  } catch (e) { picked = []; }
  var zona = "";
  try { zona = localStorage.getItem(STORE_KEY + "-zona") || ""; } catch (e) { zona = ""; }

  var current = null;
  var SVGNS = "http://www.w3.org/2000/svg";
  var pinsG = document.getElementById("pins");
  var chipsEl = document.getElementById("chips");
  var fichaEmpty = document.getElementById("fichaEmpty");
  var fichaCard = document.getElementById("fichaCard");
  var fichaUnit = document.getElementById("fichaUnit");
  var fichaTitle = document.getElementById("fichaTitle");
  var fichaText = document.getElementById("fichaText");
  var fichaSend = document.getElementById("fichaSend");
  var fichaToggle = document.getElementById("fichaToggle");
  var list = document.getElementById("pedidoList");
  var empty = document.getElementById("pedidoEmpty");
  var clearBtn = document.getElementById("pedidoClear");
  var zonaInput = document.getElementById("pedidoZona");
  var sendBtn = document.getElementById("pedidoSend");
  zonaInput.value = zona;

  var pinEls = {};
  SPOTS.forEach(function (s) {
    var g = document.createElementNS(SVGNS, "g");
    g.setAttribute("class", "pin pin--" + s.unit);
    g.setAttribute("transform", "translate(" + s.x + " " + s.y + ")");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", s.n + ". " + s.title + " (" + UNITS[s.unit].name + ")");
    var ring = document.createElementNS(SVGNS, "circle");
    ring.setAttribute("class", "ring"); ring.setAttribute("r", "17");
    ring.style.animationDelay = (s.n * 0.17) + "s";
    var dot = document.createElementNS(SVGNS, "circle");
    dot.setAttribute("class", "dot"); dot.setAttribute("r", "17");
    var t = document.createElementNS(SVGNS, "text");
    t.setAttribute("text-anchor", "middle"); t.setAttribute("dy", "5.5");
    t.textContent = s.n;
    g.appendChild(ring); g.appendChild(dot); g.appendChild(t);
    g.addEventListener("click", function () { show(s.id, true); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(s.id, true); }
    });
    pinsG.appendChild(g);
    pinEls[s.id] = g;
  });

  // Los puntos mantienen un tamaño tocable aunque el plano se achique en el celular
  var houseSvg = document.getElementById("house");
  function scalePins() {
    var w = houseSvg.getBoundingClientRect().width || 1000;
    var k = Math.min(2.3, Math.max(1, 15 / (17 * (w / 1000))));
    SPOTS.forEach(function (s) {
      pinEls[s.id].setAttribute("transform", "translate(" + s.x + " " + s.y + ") scale(" + k.toFixed(2) + ")");
    });
  }
  scalePins();
  window.addEventListener("resize", scalePins);

  var chipEls = {};
  Object.keys(UNITS).forEach(function (u) {
    var group = document.createElement("div");
    group.className = "chips__group";
    group.style.setProperty("--c", UNITS[u].color);
    group.style.setProperty("--c-txt", UNITS[u].txt);
    var h = document.createElement("h3");
    h.textContent = UNITS[u].name;
    var row = document.createElement("div");
    row.className = "chips__row";
    SPOTS.filter(function (s) { return s.unit === u; }).forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip";
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = "<i></i><span></span>";
      b.querySelector("i").textContent = s.n;
      b.querySelector("span").textContent = s.title;
      b.addEventListener("click", function () { togglePick(s.id); show(s.id, false); });
      row.appendChild(b);
      chipEls[s.id] = b;
    });
    group.appendChild(h); group.appendChild(row);
    chipsEl.appendChild(group);
  });

  function show(id, fromPin) {
    var s = byId[id]; if (!s) return;
    current = id;
    var u = UNITS[s.unit];
    fichaEmpty.hidden = true;
    fichaCard.hidden = false;
    fichaCard.style.setProperty("--c", u.color);
    fichaCard.style.setProperty("--c-txt", u.txt);
    fichaUnit.textContent = s.n + " · " + u.name;
    fichaTitle.textContent = s.title;
    fichaText.textContent = s.text;
    fichaSend.textContent = s.send;
    Object.keys(pinEls).forEach(function (k) { pinEls[k].classList.toggle("is-active", k === id); });
    syncToggle();
    // en móvil la ficha queda debajo del plano: acercarla solo si no se ve
    if (fromPin && window.innerWidth < 900) {
      var r = fichaCard.getBoundingClientRect();
      if (r.top > window.innerHeight - 120 || r.bottom < 80) {
        fichaCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function syncToggle() {
    if (!current) return;
    var on = picked.indexOf(current) > -1;
    fichaToggle.textContent = on ? "✓ Agregado a tu consulta (quitar)" : "+ Agregar a mi consulta";
    fichaToggle.classList.toggle("is-on", on);
  }

  fichaToggle.addEventListener("click", function () { if (current) togglePick(current); });

  function togglePick(id) {
    var i = picked.indexOf(id);
    if (i > -1) picked.splice(i, 1); else picked.push(id);
    save(); render();
  }

  clearBtn.addEventListener("click", function () { picked = []; save(); render(); });
  zonaInput.addEventListener("input", function () {
    try { localStorage.setItem(STORE_KEY + "-zona", zonaInput.value); } catch (e) {}
    updateSend();
  });

  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(picked)); } catch (e) {} }

  function render() {
    list.innerHTML = "";
    picked.forEach(function (id) {
      var s = byId[id];
      var li = document.createElement("li");
      li.style.setProperty("--c", UNITS[s.unit].color);
      var span = document.createElement("span");
      span.textContent = s.title;
      var x = document.createElement("button");
      x.type = "button"; x.textContent = "×";
      x.setAttribute("aria-label", "Quitar " + s.title);
      x.addEventListener("click", function () { togglePick(id); });
      li.appendChild(span); li.appendChild(x);
      list.appendChild(li);
    });
    empty.hidden = picked.length > 0;
    clearBtn.hidden = picked.length === 0;
    SPOTS.forEach(function (s) {
      var on = picked.indexOf(s.id) > -1;
      pinEls[s.id].classList.toggle("is-picked", on);
      chipEls[s.id].setAttribute("aria-pressed", String(on));
    });
    syncToggle();
    updateSend();
  }

  function updateSend() {
    var z = zonaInput.value.trim();
    var msg;
    if (!picked.length) {
      msg = MSG.general + (z ? "\nLocalidad: " + z : "");
      sendBtn.textContent = "Escribir por WhatsApp";
    } else {
      var lines = ["Hola Dos Alas, armé mi consulta en la página y necesito:"];
      Object.keys(UNITS).forEach(function (u) {
        var items = picked.filter(function (id) { return byId[id].unit === u; });
        if (!items.length) return;
        lines.push("");
        lines.push(UNITS[u].name + ":");
        items.forEach(function (id) { lines.push("• " + byId[id].title); });
      });
      if (z) { lines.push(""); lines.push("Localidad: " + z); }
      lines.push(""); lines.push("Te mando fotos por acá.");
      msg = lines.join("\n");
      sendBtn.textContent = "Enviar consulta (" + picked.length + ") por WhatsApp";
    }
    sendBtn.href = waLink(msg);
  }

  render();
  if (/[?&]qa=pick\b/.test(location.search)) { picked = ["aire", "poda"]; render(); show("poda", false); }

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Video: pausar fuera de pantalla ---------- */
  var video = document.querySelector(".hero__video");
  if (video && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      });
    }).observe(video);
  }

  /* ---------- fitText: títulos con letra grande del sistema (Android) ---------- */
  var FIT = [".rule-kicker", ".hero__title", ".cierre__tel", ".plano__head h2", ".unidades__head h2"];
  function fitText() {
    FIT.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.fontSize = "";
        var size = parseFloat(getComputedStyle(el).fontSize);
        var guard = 0;
        while (el.scrollWidth > el.clientWidth + 1 && size > 14 && guard < 60) {
          size -= 1; el.style.fontSize = size + "px"; guard++;
        }
      });
    });
  }
  window.__dosAlasFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener("load", fitText);
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitText, 120); });
})();
