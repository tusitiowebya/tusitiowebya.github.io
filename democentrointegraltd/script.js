/* Centro Integral de Técnicas Dentales — demo TuPaginaYa */
(function () {
  "use strict";

  var WA = "5491135250069";
  var WA_BASE = "Hola! Vi la web del Centro Integral de Técnicas Dentales y quiero información sobre el curso de Técnico/a Dental.";
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  if (params.has("qa")) root.classList.add("qa");

  function waLink(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- Enlaces de WhatsApp genéricos ---------- */
  $$("[data-wa]").forEach(function (a) { a.href = waLink(WA_BASE); });

  /* ---------- Video del hero (se pide solo si hay movimiento) ---------- */
  var video = $("#heroVideo");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (video && !reduce) {
    video.src = video.getAttribute("data-src");
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Nav ---------- */
  var nav = $("#nav"), burger = $("#burger");
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 30);
    $("#waFloat").classList.toggle("is-on", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function closeMenu() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$("#navLinks a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Técnicas (fotos y captions reales del IG) ---------- */
  var TECNICAS = [
    { id: "protesis", corto: "Prótesis completa", titulo: "Prótesis completa", img: "img/protesis-claudia.jpg",
      alt: "Alumna Claudia trabajando su prótesis completa sobre el tapete violeta",
      que: "La dentadura completa: se enfilan los dientes sobre la base, se encera y se termina en acrílico. Es el trabajo que más se pide en un laboratorio.",
      cita: "Claudia trabajando en su prótesis completa con acrílicos combinados." },
    { id: "cromo", corto: "Cromo", titulo: "Esquelético de cromo", img: "img/cromo-ulises.jpg",
      alt: "Alumno Ulises con guardapolvo trabajando una pieza de cromo",
      que: "Prótesis parcial removible con estructura metálica colada y ganchos que se apoyan en los dientes propios del paciente.",
      cita: "Ulises trabajando en cromo." },
    { id: "coronas", corto: "Coronas", titulo: "Coronas provisorias", img: "img/coronas-cecilia.jpg",
      alt: "Alumna Cecilia trabajando coronas provisorias con modelos en articulador",
      que: "Piezas temporarias que protegen el diente preparado mientras se fabrica la definitiva. Se trabajan sobre modelos montados en articulador.",
      cita: "Cecilia trabajando en sus coronas provisorias." },
    { id: "ortopedia", corto: "Ortopedia", titulo: "Ortopedia", img: "img/ortopedia-ivana.jpg",
      alt: "Aparatos de ortopedia de acrílico y alambre hechos por la alumna Ivana",
      que: "Aparatos removibles de acrílico y alambre, como placas y expansores, que el ortodoncista usa para guiar el crecimiento de los maxilares.",
      cita: "Trabajos de ortopedia de la alumna Ivana." },
    { id: "inyectado", corto: "Inyectado", titulo: "Prótesis flexible (inyectado)", img: "img/inyectado-aurora.jpg",
      alt: "Mufla abierta con el primer inyectado de la alumna Aurora",
      que: "La base se hace con material termoplástico inyectado en mufla: sin ganchos metálicos a la vista y más liviana para el paciente.",
      cita: "1° inyectado de la alumna Aurora." },
    { id: "pulido", corto: "Pulido", titulo: "Pulido y terminación", img: "img/pulido-tomas.jpg",
      alt: "Alumno Tomás en el laboratorio después de pulir su trabajo",
      que: "Con el torno y los cepillos la pieza queda lisa y con brillo. Es el último paso antes de entregar, y el que se nota en la boca.",
      cita: "Tomas a mil puliendo." }
  ];
  var MAP_INTERES = { protesis: "Prótesis completa", cromo: "Esquelético de cromo", coronas: "Coronas provisorias",
    ortopedia: "Ortopedia", inyectado: "Prótesis flexible (inyectado)", pulido: null };

  /* ---------- Tapete del hero (marquee de trabajos reales) ---------- */
  var PIEZAS = [
    ["img/inyectado-aurora.jpg", "1° inyectado · Aurora"], ["img/protesis-claudia.jpg", "Prótesis completa · Claudia"],
    ["img/aparato-ivana.jpg", "Ortopedia · Ivana"], ["img/cromo-ulises.jpg", "Cromo · Ulises"],
    ["img/fotocurado-ramona.jpg", "Trabajo de Ramona"], ["img/coronas-cecilia.jpg", "Coronas provisorias · Cecilia"],
    ["img/protesis-azul.jpg", "Prótesis completa · Azul"], ["img/cubetas.jpg", "Impresiones"],
    ["img/galiana.jpg", "Galiana trabajando"], ["img/pulido-tomas.jpg", "Pulido · Tomás"]
  ];
  var track = $("#tapeteTrack");
  if (track) {
    var html = "";
    for (var rep = 0; rep < 2; rep++) {
      PIEZAS.forEach(function (p, i) {
        var rot = ((i * 37) % 7 - 3) * 0.8;
        html += '<a class="pieza" href="#alumnos" style="--rot:' + rot.toFixed(1) + 'deg"' + (rep ? ' aria-hidden="true" tabindex="-1"' : "") +
          '><img src="' + p[0] + '" alt="' + (rep ? "" : p[1]) + '" width="900" height="900" loading="lazy"><span>' + p[1] + "</span></a>";
      });
    }
    track.innerHTML = html;
  }

  /* ---------- Arcada ---------- */
  var arco = $("#arco");
  var ficha = $("#ficha");
  var btnSumar = $("#fichaSumar");
  var sumadoPulido = false;
  var actual = 0;
  var TOOTH = "M50,13 C40,3 21,1 12,10 C2,20 3,39 8,53 C12,65 15,77 18,89 C20,97 30,99 33,91 C36,81 38,67 43,61 C46,57 54,57 57,61 C62,67 64,81 67,91 C70,99 80,97 82,89 C85,77 88,65 92,53 C97,39 98,20 88,10 C79,1 60,3 50,13 Z";

  function layoutArco() {
    var n = TECNICAS.length;
    $$(".diente", arco).forEach(function (b, i) {
      // semicírculo de 160° abierto hacia abajo, como una arcada superior vista desde arriba
      var t = n === 1 ? 0.5 : i / (n - 1);
      var ang = (-72 + t * 144) * Math.PI / 180;
      var x = 50 + Math.sin(ang) * 45;
      var y = 72 - Math.cos(ang) * 52;
      b.style.left = x + "%";
      b.style.top = y + "%";
    });
  }

  if (arco) {
    TECNICAS.forEach(function (t, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "diente";
      b.id = "tab-" + t.id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "ficha");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.tabIndex = i === 0 ? 0 : -1;
      b.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><path class="d-cuerpo" d="' + TOOTH + '"/>' +
        '<text class="d-num" x="50" y="46">' + String(i + 1).padStart(2, "0") + "</text></svg>" +
        '<span class="diente__label">' + t.corto + "</span>";
      b.addEventListener("click", function () { elegir(i, true); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, to = null;
        if (k === "ArrowRight" || k === "ArrowDown") to = (actual + 1) % TECNICAS.length;
        if (k === "ArrowLeft" || k === "ArrowUp") to = (actual - 1 + TECNICAS.length) % TECNICAS.length;
        if (k === "Home") to = 0;
        if (k === "End") to = TECNICAS.length - 1;
        if (to !== null) { e.preventDefault(); elegir(to, true); $$(".diente", arco)[to].focus(); }
      });
      arco.appendChild(b);
    });
    layoutArco();
    pintarFicha(0, false);
  }

  function pintarFicha(i, anim) {
    var t = TECNICAS[i];
    var apply = function () {
      var img = $("#fichaImg");
      img.src = t.img; img.alt = t.alt;
      $("#fichaNum").textContent = String(i + 1).padStart(2, "0");
      $("#fichaTitulo").textContent = t.titulo;
      $("#fichaQue").textContent = t.que;
      $("#fichaCita").textContent = t.cita;
      ficha.setAttribute("aria-labelledby", "tab-" + t.id);
      syncSumar();
      ficha.classList.remove("is-changing");
    };
    if (anim) { ficha.classList.add("is-changing"); setTimeout(apply, 220); } else apply();
  }

  function elegir(i, anim) {
    if (i === actual && anim) return;
    actual = i;
    $$(".diente", arco).forEach(function (b, j) {
      b.setAttribute("aria-selected", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    pintarFicha(i, anim);
  }

  function interesInput(val) {
    return $$('input[name="interes"]').filter(function (x) { return x.value === val; })[0];
  }
  function syncSumar() {
    var t = TECNICAS[actual];
    var val = MAP_INTERES[t.id];
    var sumado = val ? interesInput(val).checked : sumadoPulido;
    btnSumar.textContent = sumado ? "Sumado a tu consulta ✓" : "Sumar a mi consulta";
    btnSumar.classList.toggle("is-added", sumado);
    $$(".diente", arco).forEach(function (b, j) {
      var v = MAP_INTERES[TECNICAS[j].id];
      b.classList.toggle("is-sumado", v ? interesInput(v).checked : sumadoPulido && TECNICAS[j].id === "pulido");
    });
  }
  if (btnSumar) {
    btnSumar.addEventListener("click", function () {
      var t = TECNICAS[actual];
      var val = MAP_INTERES[t.id];
      if (val) { var inp = interesInput(val); inp.checked = !inp.checked; }
      else sumadoPulido = !sumadoPulido;
      actualizarOrden();
      syncSumar();
    });
  }

  /* ---------- Orden de trabajo ---------- */
  var form = $("#ordenForm");
  var odonto = $("#odonto");
  var hoy = new Date();
  $("#ticketFecha").textContent = hoy.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  $("#ticketNum").textContent = String((hoy.getDate() * 37 + hoy.getMonth() * 11) % 9000 + 1000);

  // odontograma: 16 piezas superiores
  if (odonto) {
    var s = '<line x1="160" y1="2" x2="160" y2="38"/>';
    for (var k = 0; k < 16; k++) {
      var x = 2 + k * 19.4 + (k >= 8 ? 2 : 0);
      s += '<g transform="translate(' + x.toFixed(1) + ' 4) scale(.16 .3)"><path class="o-d" d="' + TOOTH + '"/></g>';
    }
    odonto.innerHTML = s;
  }

  function valores(name) {
    return $$('input[name="' + name + '"]:checked', form).map(function (x) { return x.value; });
  }
  function lista(arr) {
    if (!arr.length) return "";
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + " y " + arr[arr.length - 1];
  }

  function actualizarOrden() {
    var nombre = form.nombre.value.trim();
    var loc = form.localidad.value.trim();
    var punto = valores("punto")[0] || "";
    var interes = valores("interes");
    if (sumadoPulido) interes = interes.concat(["Pulido y terminación"]);
    var saber = valores("saber");

    $("#tNombre").textContent = (nombre || "—") + (loc ? " · " + loc : "");
    $("#tPunto").textContent = punto || "—";
    $("#tInteres").textContent = interes.length ? interes.join(" · ") : "—";
    $("#tSaber").textContent = saber.length ? saber.join(" · ") : "—";

    var msg = "Hola! Vi la web del Centro Integral de Técnicas Dentales.";
    if (nombre || loc) msg += "\nSoy " + (nombre || "") + (nombre && loc ? ", de " : loc ? "de " : "") + (loc || "") + ".";
    if (punto) msg += "\nArranco así: " + punto.charAt(0).toLowerCase() + punto.slice(1) + ".";
    if (interes.length) msg += "\nMe interesa: " + lista(interes) + ".";
    if (saber.length) msg += "\nQuiero saber " + lista(saber) + ".";
    else msg += "\nQuiero más información del curso.";
    msg += "\n¡Gracias!";
    $("#tMsg").textContent = msg;
    $("#ordenEnviar").href = waLink(msg);

    // cada interés enciende piezas del odontograma; las consultas, en lila
    var dientes = $$(".o-d", odonto);
    var on = Math.min(16, interes.length * 2);
    var on2 = Math.min(16 - on, saber.length);
    dientes.forEach(function (d, i) {
      var idx = [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14, 0, 15].indexOf(i);
      d.classList.toggle("on", idx < on);
      d.classList.toggle("on2", idx >= on && idx < on + on2);
    });
  }
  if (form) {
    form.addEventListener("input", function () { actualizarOrden(); syncSumar(); });
    form.addEventListener("change", function () { actualizarOrden(); syncSumar(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    actualizarOrden();
    syncSumar();
  }

  /* ---------- Reveal ---------- */
  var rv = $$("[data-rv]");
  rv.forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--d", Math.min(sib, 6) * 0.08 + "s");
  });
  if (root.classList.contains("qa") || !("IntersectionObserver" in window)) {
    rv.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }
  requestAnimationFrame(function () { root.classList.add("is-ready"); });

  /* ---------- fitText: títulos que no entran con letra agrandada (Android) ---------- */
  function fitText() {
    $$(".hero__title span, .cierre h2, .brand__txt strong").forEach(function (el) {
      el.style.fontSize = "";
      var guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && guard++ < 40) {
        var fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = (fs * 0.95) + "px";
      }
    });
  }
  window.__citdFit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  window.addEventListener("load", fitText);
  window.addEventListener("resize", function () { fitText(); });
})();
