/* SegurOS · appseguros.ar */
(function () {
  "use strict";

  var WA = "5491135767915";
  var html = document.documentElement;
  var LITE = function () { return html.classList.contains("lite"); };
  var QA = html.classList.contains("qa");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return "$" + Math.round(n).toLocaleString("es-AR"); };

  var CIAS = ["ATM Seguros", "Sancor Seguros", "La Equidad", "El Norte", "BBVA Seguros", "Rivadavia", "Mercantil Andina", "Zurich", "Río Uruguay", "San Cristóbal", "La Equitativa"];
  var CORTAS = ["ATM", "Sancor", "La Equidad", "El Norte", "BBVA", "Rivadavia", "Mercantil", "Zurich", "RUS", "San Cristóbal", "Equitativa"];

  /* ---------- WhatsApp: todo [data-wa] abre el chat con el mensaje precargado ---------- */
  function waHref(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  function wireWa(el) {
    var msg = el.getAttribute("data-wa") || "Hola! Quiero info de SegurOS.";
    el.setAttribute("href", waHref(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }
  $$("[data-wa]").forEach(wireWa);

  /* ---------- nav ---------- */
  var nav = $("#nav"), burger = $("#burger");
  function onScroll() {
    nav.classList.toggle("is-solid", window.scrollY > 40);
    $("#waFloat").classList.toggle("is-on", window.scrollY > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  burger.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(function (a) {
    a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- video del hero (en LITE ni se pide) ---------- */
  function loadVideo() {
    var v = $(".hero__video");
    if (!v || LITE() || v.getAttribute("src")) return;
    v.src = v.getAttribute("data-src");
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  loadVideo();

  /* ---------- reloj de sincronización ---------- */
  (function () {
    var el = $("#syncClock"); if (!el) return;
    var left = 598;
    function draw() { var m = Math.floor(left / 60), s = left % 60; el.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s; }
    draw();
    if (QA) return;
    setInterval(function () { left = left <= 0 ? 600 : left - 1; draw(); }, 1000);
  })();

  /* ---------- marquee de compañías (lista duplicada para el loop) ---------- */
  (function () {
    var ul = $("#ciasList"); if (!ul) return;
    var items = CIAS.concat(CIAS);
    ul.innerHTML = items.map(function (n, i) { return "<li" + (i >= CIAS.length ? ' aria-hidden="true"' : "") + ">" + n + "</li>"; }).join("");
  })();

  /* ---------- COTI en la ventana del hero ---------- */
  (function () {
    var log = $("#heroLog"); if (!log) return;
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function add(node) { log.appendChild(node); while (log.scrollHeight > log.clientHeight && log.children.length > 1) log.removeChild(log.firstChild); return node; }
    function msg(cls, text) { var d = document.createElement("div"); d.className = "msg " + cls; d.textContent = text; return add(d); }
    function typing() { var d = document.createElement("div"); d.className = "msg msg--bot msg--typing"; d.innerHTML = "<i></i><i></i><i></i>"; return add(d); }
    function bot(text, at) { later(function () { var t = typing(); later(function () { t.remove(); msg("msg--bot", text); }, 700); }, at); }

    var CASOS = [
      { auto: "Toyota Hilux 2022 · CP 1832 · particular", cias: ["Sancor", "Zurich", "Rivadavia", "Mercantil Andina"], cobs: 23 },
      { auto: "Fiat Cronos 2020 · CP 5000 · particular", cias: ["San Cristóbal", "Río Uruguay", "La Equitativa", "ATM"], cobs: 19 },
      { auto: "VW Amarok 2019 · CP 2000 · comercial", cias: ["Mercantil Andina", "Sancor", "Río Uruguay", "Zurich"], cobs: 21 }
    ];
    var n = 0;

    function run() {
      log.innerHTML = "";
      var c = CASOS[n++ % CASOS.length];
      bot("¡Hola! ¿Qué vehículo cotizamos hoy?", 300);
      later(function () { msg("msg--me", c.auto); }, 1900);
      bot("Perfecto. Cotizo con tus compañías conectadas…", 2600);
      c.cias.forEach(function (cia, i) {
        var row;
        later(function () {
          row = document.createElement("div");
          row.className = "rowcia";
          row.innerHTML = "<span>" + cia + "</span><em>cotizando…</em>";
          add(row);
        }, 4000 + i * 450);
        later(function () { row.classList.add("is-ok"); row.querySelector("em").textContent = "lista"; }, 5300 + i * 650);
      });
      bot("Listo: " + c.cobs + " coberturas. Te armé el PDF con tu marca 📄", 8400);
      if (!QA) later(run, 13500);
    }
    if (LITE()) {
      msg("msg--bot", "¡Hola! ¿Qué vehículo cotizamos hoy?");
      msg("msg--me", CASOS[0].auto);
      msg("msg--bot", "Listo: " + CASOS[0].cobs + " coberturas con tus compañías conectadas. Te armé el PDF con tu marca 📄");
    } else if (QA) {
      run();
    } else {
      run();
    }
  })();

  /* ---------- COTI simulador ---------- */
  (function () {
    var sim = $("#sim"); if (!sim) return;
    var state = { veh: "auto", anio: "2021", zona: "sur", uso: "part" };
    var labels = { veh: "Sedán / hatch", anio: "2021", zona: "Zona Sur · CP 1832", uso: "Particular" };
    var F = {
      veh: { auto: 1, pick: 1.34 },
      anio: { "2025": 1.26, "2021": 1, "2017": 0.83, "2012": 0.67 },
      zona: { caba: 1.17, sur: 1.1, cba: 0.92, ros: 0.96 },
      uso: { part: 1, com: 1.22 }
    };
    var COBS = [["Todo riesgo con franquicia", 78400], ["Terceros completo", 36100], ["Responsabilidad civil", 15600]];
    var CIAS_SIM = [
      { n: "Compañía A", k: [1, 1.02, 1] },
      { n: "Compañía B", k: [0.94, 1.07, 0.97] },
      { n: "Compañía C", k: [1.06, 0.95, 1.05] }
    ];
    var chosen = {};
    var run = $("#simRun"), steps = $("#simSteps"), res = $("#simRes"), pdf = $("#simPdf");
    var brand = $("#simBrand"), busy = false;

    $$(".chips", sim).forEach(function (group) {
      var key = group.getAttribute("data-key");
      group.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        $$(".chip", group).forEach(function (x) { x.classList.toggle("is-on", x === b); });
        state[key] = b.getAttribute("data-v");
        labels[key] = b.getAttribute("data-l") || b.textContent;
      });
    });

    function vehiculo() { return labels.veh + " " + labels.anio + " · " + labels.zona + " · " + labels.uso; }

    function renderPdf() {
      $("#pdfBrand").textContent = brand.value.trim() || "Tu Broker";
      $("#pdfVeh").textContent = vehiculo() + " · " + new Date().toLocaleDateString("es-AR");
      var rows = [];
      Object.keys(chosen).forEach(function (k) { if (chosen[k]) rows.push(chosen[k]); });
      $("#pdfRows").innerHTML = rows.length
        ? rows.map(function (r) { return '<div class="pdf__row"><span>' + r.cia + " · " + r.cob + "</span><b>" + fmt(r.v) + "/mes</b></div>"; }).join("")
        : '<p class="pdf__empty">Tildá las coberturas que querés mandarle al cliente.</p>';
      var wa = $("#simWa");
      wa.setAttribute("data-wa", "Hola! Probé COTI en la web con un " + vehiculo() + " y quiero usarlo con mi cartera. ¿Me muestran SegurOS?");
      wireWa(wa);
    }

    function render() {
      var mult = F.veh[state.veh] * F.anio[state.anio] * F.zona[state.zona] * F.uso[state.uso];
      chosen = {};
      res.innerHTML = "";
      CIAS_SIM.forEach(function (c, ci) {
        var box = document.createElement("div");
        box.className = "cia";
        box.style.animationDelay = ci * 0.12 + "s";
        var h = "<h4>" + c.n + "</h4>";
        COBS.forEach(function (cob, i) {
          var v = Math.round(cob[1] * mult * c.k[i] / 100) * 100;
          var id = ci + "-" + i;
          var pre = i === 1 && ci < 2;
          if (pre) chosen[id] = { cia: c.n, cob: cob[0], v: v };
          h += '<label class="cob"><input type="checkbox" data-id="' + id + '" data-cia="' + c.n + '" data-cob="' + cob[0] + '" data-v="' + v + '"' + (pre ? " checked" : "") + "><span>" + cob[0] + "<b data-to=\"" + v + "\">" + fmt(QA || LITE() ? v : 0) + "</b></span></label>";
        });
        box.innerHTML = h;
        res.appendChild(box);
      });
      $$("b[data-to]", res).forEach(countUp);
      pdf.hidden = false;
      renderPdf();
    }

    function countUp(el) {
      var to = +el.getAttribute("data-to");
      if (QA || LITE()) { el.textContent = fmt(to); return; }
      var t0 = null;
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 900); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }

    res.addEventListener("change", function (e) {
      var i = e.target; if (!i.matches("input[type=checkbox]")) return;
      var id = i.getAttribute("data-id");
      chosen[id] = i.checked ? { cia: i.getAttribute("data-cia"), cob: i.getAttribute("data-cob"), v: +i.getAttribute("data-v") } : null;
      renderPdf();
    });
    brand.addEventListener("input", renderPdf);

    $("#simGo").addEventListener("click", function () {
      if (busy) return;
      busy = true;
      run.hidden = false;
      res.innerHTML = "";
      pdf.hidden = true;
      steps.innerHTML = "";
      var lines = ["Leyendo " + vehiculo()].concat(CIAS_SIM.map(function (c) { return "Cotizando con " + c.n; }));
      var fast = QA || LITE();
      lines.forEach(function (l, i) {
        var li = document.createElement("li");
        li.className = "rowcia";
        li.innerHTML = "<span>" + l + "</span><em>…</em>";
        setTimeout(function () {
          steps.appendChild(li);
          setTimeout(function () { li.classList.add("is-ok"); li.querySelector("em").textContent = "ok"; }, fast ? 0 : 420);
        }, fast ? 0 : i * 480);
      });
      setTimeout(function () {
        render();
        busy = false;
        if (!fast && window.innerWidth < 900) res.scrollIntoView({ behavior: "smooth", block: "start" });
      }, fast ? 0 : lines.length * 480 + 380);
    });

    if (QA) $("#simGo").click();
  })();

  /* ---------- órbita del Conector ---------- */
  (function () {
    var svg = $("#orbit"); if (!svg) return;
    var NS = "http://www.w3.org/2000/svg", C = 280, R = 214;
    function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; }
    el("circle", { cx: C, cy: C, r: R, class: "orb-ring" });
    el("circle", { cx: C, cy: C, r: 120, class: "orb-ring" });
    var lines = [], nodes = [];
    CORTAS.forEach(function (name, i) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / CORTAS.length);
      var x = C + R * Math.cos(a), y = C + R * Math.sin(a);
      lines.push(el("line", { x1: x, y1: y, x2: C, y2: C, class: "orb-line" }));
    });
    CORTAS.forEach(function (name, i) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / CORTAS.length);
      var x = C + R * Math.cos(a), y = C + R * Math.sin(a);
      var w = Math.max(58, name.length * 8.6 + 26);
      var g = el("g", { class: "orb-node" });
      el("rect", { x: x - w / 2, y: y - 19, width: w, height: 38, rx: 19 }, g);
      var t = el("text", { x: x, y: y + 5, "text-anchor": "middle" }, g);
      t.textContent = name;
      nodes.push(g);
    });
    var core = el("g", { class: "orb-core" });
    el("circle", { cx: C, cy: C, r: 78, class: "orb-pulse" }, core);
    el("circle", { cx: C, cy: C, r: 76 }, core);
    var t1 = el("text", { x: C, y: C - 2, "text-anchor": "middle" }, core); t1.textContent = "Tu cartera";
    var t2 = el("text", { x: C, y: C + 20, "text-anchor": "middle", class: "orb-sub" }, core); t2.textContent = "al día";

    var FEED = [
      "Sancor · 4 pólizas actualizadas",
      "Zurich · cupón de octubre al legajo",
      "Rivadavia · cuenta corriente al día",
      "Mercantil Andina · renovación detectada",
      "Río Uruguay · 2 pólizas importadas",
      "San Cristóbal · certificado al legajo",
      "La Equitativa · frente de póliza al legajo",
      "BBVA Seguros · cuota cobrada",
      "El Norte · anulación registrada",
      "ATM · endoso aplicado",
      "La Equidad · cartera sincronizada"
    ];
    var IDX = [1, 7, 5, 6, 8, 9, 10, 4, 3, 0, 2];
    var feed = $("#feed"), k = 0, minute = 38;
    function tick() {
      var i = IDX[k % IDX.length];
      nodes.forEach(function (n, j) { n.classList.toggle("is-on", j === i); lines[j].classList.toggle("is-on", j === i); });
      var li = document.createElement("li");
      minute = (minute + 1) % 60;
      li.innerHTML = "<time>10:" + (minute < 10 ? "0" : "") + minute + "</time><span>" + FEED[k % FEED.length] + "</span>";
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
      k++;
    }
    tick(); tick(); tick();
    if (!QA && !LITE()) setInterval(tick, 2200);
  })();

  /* ---------- reveals ---------- */
  (function () {
    var els = $$(".reveal, .tile--cobra");
    if (!("IntersectionObserver" in window) || QA || LITE()) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var sibs = $$(".reveal", en.target.parentElement);
        var d = Math.max(0, sibs.indexOf(en.target)) * 70;
        en.target.style.transitionDelay = Math.min(d, 350) + "ms";
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- fitText: la letra grande de Android no corta los títulos ---------- */
  function fitText() {
    $$(".fit, .btn--lg").forEach(function (el) {
      el.style.fontSize = "";
      var size = parseFloat(getComputedStyle(el).fontSize), guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > 11 && guard++ < 60) {
        size -= 1;
        el.style.fontSize = size + "px";
      }
    });
  }
  window.__asFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener("load", fitText);
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitText, 120); });

  /* ---------- watchdog de FPS: degrada a LITE en caliente ---------- */
  (function () {
    if (QA || LITE() || /[?&]full\b/.test(location.search) || !window.requestAnimationFrame) return;
    var frames = 0, t0 = 0, tries = 0;
    function goLite() {
      html.classList.add("lite");
      try { sessionStorage.setItem("as-lite", "1"); } catch (e) {}
      var v = $(".hero__video");
      if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
      $$(".reveal").forEach(function (e) { e.classList.add("is-in"); });
    }
    function loop(t) {
      if (!t0) t0 = t;
      frames++;
      if (t - t0 >= 2000) {
        var fps = frames * 1000 / (t - t0);
        if (fps < 12 && tries++ < 2) { frames = 0; t0 = 0; requestAnimationFrame(loop); return; } // pestaña sin pintar: volver a medir
        if (fps < 28 && fps >= 12) goLite();
        return;
      }
      requestAnimationFrame(loop);
    }
    setTimeout(function () { if (!document.hidden) requestAnimationFrame(loop); }, 1200);
  })();
})();
