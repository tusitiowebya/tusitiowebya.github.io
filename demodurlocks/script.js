/* Joel Orlando · Durlock Colocación */
(() => {
  "use strict";
  const WA = "5491162868860";
  const doc = document.documentElement;
  doc.classList.add("js");
  if (/[?&]qa\b/.test(location.search)) doc.classList.add("qa");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin storage */ } }
  };
  const waUrl = (txt) => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;

  // enlaces de WhatsApp con mensaje precargado
  $$("[data-wa]").forEach((a) => { a.href = waUrl(a.dataset.wa); });

  // nav
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 10);
    $(".fab").classList.toggle("show", scrollY > innerHeight * 0.6);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  }));

  // hero
  const hero = $(".hero");
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("ready")));
  const play = (v) => {
    if (!v.src && v.dataset.src) v.src = v.dataset.src;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  play($("#heroVideo"));

  // videos de obra: se cargan y reproducen solo en pantalla
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) play(e.target); else if (!e.target.paused) e.target.pause();
  }), { threshold: 0.25 });
  $$(".obra video").forEach((v) => vio.observe(v));

  // reveal
  const rio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; rio.observe(el); });

  // ---------- Medí tu ambiente ----------
  const form = $("#calcForm");
  const svg = $("#plano");
  const NS = "http://www.w3.org/2000/svg";
  const COLOR = { estandar: "#d9d4c7", verde: "#9DBFA7", roja: "#E3A19B" };
  const NOMBRE_PLACA = { estandar: "estándar", verde: "verde antihumedad", roja: "roja RF (resistente al fuego)" };
  const NOMBRE_TRABAJO = { cielorraso: "un cielorraso", pared: "una pared divisoria", revestimiento: "un revestimiento de pared" };
  const fmt = (n, d = 2) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });

  const saved = store.get("durlock-medir");
  if (saved) {
    ["trabajo", "placa"].forEach((k) => {
      const r = form.querySelector(`input[name="${k}"][value="${saved[k]}"]`);
      if (r) r.checked = true;
    });
    if (saved.a) $("#a").value = saved.a;
    if (saved.b) $("#b").value = saved.b;
    if (saved.zona) $("#zona").value = saved.zona;
  }

  const leer = () => {
    const f = new FormData(form);
    return {
      trabajo: f.get("trabajo"), placa: f.get("placa"),
      a: parseFloat(String(f.get("a")).replace(",", ".")),
      b: parseFloat(String(f.get("b")).replace(",", ".")),
      zona: String(f.get("zona") || "").trim()
    };
  };

  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  const dibujar = (d) => {
    svg.textContent = "";
    const W = 400, H = 300;
    const s = Math.min((W - 8) / d.a, (H - 8) / d.b);
    const w = d.a * s, h = d.b * s, x0 = (W - w) / 2, y0 = (H - h) / 2;
    const clip = el("clipPath", { id: "sup" });
    clip.appendChild(el("rect", { x: x0, y: y0, width: w, height: h }));
    const defs = el("defs", {}); defs.appendChild(clip); svg.appendChild(defs);
    const g = el("g", { "clip-path": "url(#sup)" });
    svg.appendChild(g);
    // pared y revestimiento: placas paradas (1,20 de ancho × 2,40 de alto); cielorraso: acostadas y trabadas
    const parada = d.trabajo !== "cielorraso";
    const pw = (parada ? 1.2 : 2.4) * s, ph = (parada ? 2.4 : 1.2) * s;
    let k = 0;
    for (let fila = 0, y = y0; y < y0 + h; fila++, y += ph) {
      const off = !parada && fila % 2 ? -pw / 2 : 0;
      for (let x = x0 + off; x < x0 + w; x += pw) {
        const r = el("rect", {
          class: "pl", x: x + 0.8, y: y + 0.8, width: pw - 1.6, height: ph - 1.6,
          fill: COLOR[d.placa], stroke: "#F7F5F0", "stroke-width": 1.6
        });
        r.style.animationDelay = `${Math.min(k++ * 18, 900)}ms`;
        g.appendChild(r);
      }
    }
    // tornillos sobre los perfiles cada ~40 cm
    const paso = 0.4 * s;
    if (paso > 5) {
      const perf = parada ? 0.4 * s : 0.4 * s;
      for (let x = x0 + perf / 2; x < x0 + w; x += perf) {
        for (let y = y0 + paso / 2; y < y0 + h; y += paso) {
          g.appendChild(el("circle", { cx: x, cy: y, r: Math.max(0.8, Math.min(1.6, s / 60)), fill: "rgba(0,0,0,.28)" }));
        }
      }
    }
    svg.appendChild(el("rect", { x: x0, y: y0, width: w, height: h, fill: "none", stroke: "#F2A21B", "stroke-width": 2 }));
  };

  const calc = () => {
    const d = leer();
    const err = $("#calcError");
    const ok = d.a >= 0.5 && d.a <= 40 && d.b >= 0.5 && d.b <= 40;
    const pared = d.trabajo !== "cielorraso";
    $("#labA").textContent = "Largo";
    $("#labB").textContent = pared ? "Alto" : "Ancho";
    $("#medLabel").textContent = pared ? "(largo × alto de la pared)" : "(largo × ancho del ambiente)";
    if (!ok) {
      err.hidden = false;
      err.textContent = "Cargá medidas entre 0,5 y 40 metros.";
      $("#calcWa").setAttribute("aria-disabled", "true");
      return null;
    }
    err.hidden = true;
    $("#calcWa").removeAttribute("aria-disabled");
    const caras = d.trabajo === "pared" ? 2 : 1;
    const m2 = d.a * d.b;
    const placas = Math.ceil((m2 * caras / 2.88) * 1.1);
    $("#outM2").textContent = `${fmt(m2)} m²`;
    $("#outPlacas").textContent = placas;
    $("#outCaras").textContent = caras;
    $("#cotaA").textContent = `${fmt(d.a)} m`;
    $("#cotaB").textContent = `${fmt(d.b)} m`;
    dibujar(d);
    store.set("durlock-medir", d);
    const msg = [
      "Hola Joel, quisiera un presupuesto para " + NOMBRE_TRABAJO[d.trabajo] + ".",
      `Placa: ${NOMBRE_PLACA[d.placa]}.`,
      `Medidas: ${fmt(d.a)} m × ${fmt(d.b)} m (${fmt(m2)} m²${caras === 2 ? ", dos caras" : ""}).`,
      `Según la web serían unas ${placas} placas.`,
      d.zona ? `La obra es en ${d.zona}.` : ""
    ].filter(Boolean).join("\n");
    $("#calcWa").href = waUrl(msg);
    return d;
  };

  let t;
  form.addEventListener("input", () => { clearTimeout(t); t = setTimeout(calc, 120); });
  form.addEventListener("change", calc);
  form.addEventListener("submit", (e) => e.preventDefault());
  $$("[data-step]", form).forEach((b) => b.addEventListener("click", () => {
    const i = $("#" + b.dataset.for);
    const v = (parseFloat(String(i.value).replace(",", ".")) || 0) + parseFloat(b.dataset.step);
    i.value = Math.min(40, Math.max(0.5, Math.round(v * 10) / 10)).toFixed(1);
    calc();
  }));
  $("#calcWa").addEventListener("click", (e) => { if (!calc()) e.preventDefault(); });
  calc();

  // títulos que no deben cortarse con letra grande de Android
  const fitText = () => {
    $$(".ht-line, .cierre-tel").forEach((n) => {
      n.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(n).fontSize), guard = 40;
      const box = n.parentElement.clientWidth;
      while (n.scrollWidth > box + 1 && fs > 12 && guard--) { fs *= 0.95; n.style.fontSize = fs + "px"; }
    });
  };
  window.__fit = fitText;
  fitText();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitText);
  addEventListener("load", fitText);
  addEventListener("resize", () => { clearTimeout(fitText.t); fitText.t = setTimeout(fitText, 150); });
})();
