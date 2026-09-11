/* ===========================================================
   CADEVI SALUD — script
   =========================================================== */
(function () {
  "use strict";

  var WA = "5491149367769"; // 11 4936-7769

  /* ---------- modo QA (capturas headless): ?qa ---------- */
  if (location.search.indexOf("qa") > -1) document.documentElement.classList.add("qa");

  /* ---------- links de WhatsApp ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(el.dataset.wa);
  });

  /* ---------- año ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- reloj de la barra de status (hora AR) ---------- */
  var clockNow = document.getElementById("clockNow");
  function tick() {
    if (!clockNow) return;
    var f = new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    clockNow.textContent = f.format(new Date());
  }
  tick();
  setInterval(tick, 20000);

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var links = document.getElementById("links");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("stuck", window.scrollY > 8);
  }, { passive: true });

  burger.addEventListener("click", function () {
    links.classList.toggle("open");
    burger.classList.toggle("x");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      burger.classList.remove("x");
    });
  });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        setTimeout(function () { e.target.classList.add("in"); }, i * 90);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });


  /* ===========================================================
     CONTADORES ANIMADOS
     =========================================================== */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var end = parseInt(el.dataset.count, 10);
        var pre = el.dataset.prefix || "";
        var suf = el.dataset.suffix || "";
        if (document.documentElement.classList.contains("qa") ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          el.textContent = pre + end + suf;
          return;
        }
        var t0 = null, dur = 1100;
        function step(t) {
          if (t0 === null) t0 = t;
          var k = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = pre + Math.round(end * eased) + suf;
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ===========================================================
     ZONAS DE COBERTURA (buscador)
     =========================================================== */
  var zoInput = document.getElementById("zoInput");
  if (zoInput) {
    var CABA = ["Caballito", "Flores", "Floresta", "Almagro", "Boedo", "Villa Crespo", "Villa del Parque",
      "Villa Devoto", "Paternal", "Chacarita", "Colegiales", "Belgrano", "Núñez", "Palermo", "Recoleta",
      "Balvanera", "San Cristóbal", "Parque Patricios", "Barracas", "La Boca", "San Telmo", "Constitución",
      "Monserrat", "Retiro", "Saavedra", "Villa Urquiza", "Villa Pueyrredón", "Agronomía", "Liniers",
      "Mataderos", "Parque Chacabuco", "Versalles", "Vélez Sarsfield", "Villa Luro", "Villa Real",
      "Monte Castro", "Villa Santa Rita", "Villa General Mitre", "Parque Avellaneda", "Nueva Pompeya"];
    var GBA = ["Avellaneda", "Lanús", "Lomas de Zamora", "Banfield", "Temperley", "Quilmes", "Vicente López",
      "Olivos", "Florida", "San Isidro", "Martínez", "San Martín", "Villa Ballester", "Tres de Febrero",
      "Caseros", "Ciudadela", "Ramos Mejía", "Haedo", "Morón", "Castelar", "Ituzaingó", "San Justo",
      "Wilde", "Sarandí", "Valentín Alsina"];

    var zoList = document.getElementById("zoList");
    var zoMsg = document.getElementById("zoMsg");
    var zoNone = document.getElementById("zoNone");

    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function render(q) {
      var nq = norm(q.trim());
      var caba = CABA.filter(function (z) { return norm(z).indexOf(nq) > -1; });
      var gba = GBA.filter(function (z) { return norm(z).indexOf(nq) > -1; });
      var total = caba.length + gba.length;

      zoList.innerHTML = "";
      caba.forEach(function (z) {
        var li = document.createElement("li");
        li.textContent = z;
        zoList.appendChild(li);
      });
      gba.forEach(function (z) {
        var li = document.createElement("li");
        li.className = "gba";
        li.textContent = z;
        zoList.appendChild(li);
      });

      zoNone.hidden = total > 0;
      if (!nq) {
        zoMsg.innerHTML = "Mostrando las <b>" + (CABA.length + GBA.length) + "</b> zonas donde trabajamos · <b>" +
          CABA.length + "</b> barrios de CABA y <b>" + GBA.length + "</b> localidades del conurbano.";
      } else if (total > 0) {
        zoMsg.innerHTML = "<b>Sí, llegamos.</b> " + total + (total === 1 ? " zona encontrada" : " zonas encontradas") + " para “" + q.trim() + "”.";
      } else {
        zoMsg.innerHTML = "No encontramos “" + q.trim() + "” en la lista.";
      }
    }

    render("");
    zoInput.addEventListener("input", function () { render(zoInput.value); });
  }

  /* ===========================================================
     RELOJ DE TURNOS (signature)
     =========================================================== */
  var svg = document.getElementById("clock");
  if (!svg) return;

  var CX = 170, CY = 170, R_OUT = 152, R_IN = 118, GAP = 1.1;
  var segsG = document.getElementById("segs");
  var ticksG = document.getElementById("ticks");
  var sel = new Array(24).fill(false);
  var segEls = [];

  function pol(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function arcPath(h) {
    var a1 = h * 15 + GAP, a2 = (h + 1) * 15 - GAP;
    var p1 = pol(CX, CY, R_OUT, a1), p2 = pol(CX, CY, R_OUT, a2);
    var p3 = pol(CX, CY, R_IN, a2), p4 = pol(CX, CY, R_IN, a1);
    return "M" + p1[0].toFixed(2) + "," + p1[1].toFixed(2) +
      " A" + R_OUT + "," + R_OUT + " 0 0 1 " + p2[0].toFixed(2) + "," + p2[1].toFixed(2) +
      " L" + p3[0].toFixed(2) + "," + p3[1].toFixed(2) +
      " A" + R_IN + "," + R_IN + " 0 0 0 " + p4[0].toFixed(2) + "," + p4[1].toFixed(2) + " Z";
  }

  var NS = "http://www.w3.org/2000/svg";
  for (var h = 0; h < 24; h++) {
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", arcPath(h));
    p.setAttribute("class", "seg");
    p.dataset.h = h;
    p.setAttribute("role", "checkbox");
    p.setAttribute("aria-checked", "false");
    p.setAttribute("aria-label", pad(h) + " a " + pad((h + 1) % 24) + " hs");
    segsG.appendChild(p);
    segEls.push(p);
  }

  [0, 3, 6, 9, 12, 15, 18, 21].forEach(function (hh) {
    var t = document.createElementNS(NS, "text");
    var pt = pol(CX, CY, R_OUT + 15, hh * 15 + 7.5);
    t.setAttribute("x", pt[0].toFixed(1));
    t.setAttribute("y", pt[1].toFixed(1));
    t.setAttribute("class", "tk" + (hh % 6 === 0 ? " mj" : ""));
    t.textContent = hh;
    ticksG.appendChild(t);
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isNight(h) { return h >= 20 || h < 8; }

  function paint() {
    segEls.forEach(function (el, i) {
      el.classList.toggle("on-d", sel[i] && !isNight(i));
      el.classList.toggle("on-n", sel[i] && isNight(i));
      el.setAttribute("aria-checked", sel[i] ? "true" : "false");
    });
    update();
  }

  /* --- interacción: click + arrastre --- */
  var painting = false, paintTo = true;

  function hourFromEvent(ev) {
    var t = ev.target;
    if (t && t.classList && t.classList.contains("seg")) return +t.dataset.h;
    return -1;
  }

  svg.addEventListener("pointerdown", function (ev) {
    var h = hourFromEvent(ev);
    if (h < 0) return;
    ev.preventDefault();
    painting = true;
    paintTo = !sel[h];
    sel[h] = paintTo;
    paint();
  });

  svg.addEventListener("pointermove", function (ev) {
    if (!painting) return;
    var el = document.elementFromPoint(ev.clientX, ev.clientY);
    if (el && el.classList && el.classList.contains("seg")) {
      var h = +el.dataset.h;
      if (sel[h] !== paintTo) { sel[h] = paintTo; paint(); }
    }
  });

  window.addEventListener("pointerup", function () { painting = false; });
  window.addEventListener("pointercancel", function () { painting = false; });

  /* --- presets --- */
  document.querySelectorAll("[data-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = b.dataset.preset;
      for (var i = 0; i < 24; i++) {
        if (p === "clear") sel[i] = false;
        else if (p === "full") sel[i] = true;
        else if (p === "dia") sel[i] = (i >= 8 && i < 20);
        else if (p === "noche") sel[i] = (i >= 20 || i < 8);
      }
      paint();
    });
  });

  /* --- chips de opciones --- */
  document.querySelectorAll(".chips[data-group]").forEach(function (g) {
    g.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        g.querySelectorAll(".chip").forEach(function (o) { o.classList.remove("on"); });
        c.classList.add("on");
        update();
      });
    });
  });

  var chk = document.getElementById("chkSosten");
  chk.addEventListener("change", update);

  /* --- bloques horarios legibles: "08 a 20 hs" --- */
  function bloques() {
    var out = [], i = 0;
    if (sel.every(function (v) { return v; })) return ["las 24 horas"];
    // arrancar en un hueco para no cortar un bloque que cruza la medianoche
    var start = -1;
    for (i = 0; i < 24; i++) { if (!sel[i]) { start = i; break; } }
    if (start < 0) return [];
    var run = null;
    for (var k = 1; k <= 24; k++) {
      var h = (start + k) % 24;
      if (sel[h]) {
        if (run === null) run = h;
      } else if (run !== null) {
        out.push(pad(run) + " a " + pad(h) + " hs");
        run = null;
      }
    }
    return out;
  }

  function pick(group) {
    var el = document.querySelector('.chips[data-group="' + group + '"] .chip.on');
    return el ? el.dataset.val : "";
  }

  function update() {
    var total = sel.filter(Boolean).length;
    var cH = document.getElementById("cHoras");
    var cT = document.getElementById("cTipo");
    var res = document.getElementById("resumen");
    var btn = document.getElementById("btnTurno");

    cH.textContent = total;

    var tipo = "tocá el reloj";
    if (total === 24) tipo = "cobertura completa";
    else if (total > 0) {
      var noches = sel.filter(function (v, i) { return v && isNight(i); }).length;
      if (noches === 0) tipo = "turno diurno";
      else if (noches === total) tipo = "turno nocturno";
      else tipo = "turno mixto";
    }
    cT.textContent = tipo;

    var bl = bloques();
    var lugar = pick("lugar"), frec = pick("frec"), desde = pick("desde");

    if (total === 0) {
      res.innerHTML = "Elegí las horas en el reloj y te armamos el mensaje.";
    } else {
      res.innerHTML =
        "<b>" + total + " " + (total === 1 ? "hora" : "horas") + "</b> por día · " + tipo +
        "<br>" + (bl.length ? bl.join(" · ") : "") +
        "<br>" + lugar + " · " + frec;
    }

    var msg = "Hola Cadevi Salud, quiero consultar por un acompañante.\n" +
      "• Lugar: " + lugar + "\n" +
      "• Frecuencia: " + frec + "\n" +
      "• Comenzar: " + desde + "\n";
    if (total > 0) {
      msg += "• Horas por día: " + total + " (" + tipo + ")\n";
      if (bl.length) msg += "• Franjas: " + bl.join(" · ") + "\n";
    } else {
      msg += "• Horario: a definir\n";
    }
    if (chk.checked) msg += "• También necesito elementos de sostén (silla de ruedas / andador / cama ortopédica)\n";
    msg += "¿Me pasan disponibilidad y valores? Gracias.";

    btn.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  paint();
})();
