/* Soluciones Servicios Baires — interacción */
(() => {
  const WA = "5491140644347";
  const qs = new URLSearchParams(location.search);
  const QA = qs.has("qa");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (QA) document.documentElement.classList.add("qa");

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  document.querySelectorAll("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Títulos que entran (letra grande en Android) ---------- */
  const fit = () => {
    document.querySelectorAll(".fit").forEach((el) => {
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      let guard = 40;
      while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard--) {
        size -= 1;
        el.style.fontSize = size + "px";
      }
    });
  };
  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  addEventListener("load", fit);
  addEventListener("resize", fit);

  /* ---------- Videos del mosaico: cargan y se pausan según visibilidad ---------- */
  const vids = document.querySelectorAll("video.hv");
  if (!reduce && !QA && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; v.load(); }
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else if (v.src) {
          v.pause();
        }
      });
    }, { threshold: 0.15 });
    vids.forEach((v) => vio.observe(v));
  }

  /* ---------- Reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (QA || reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
        e.target.style.transitionDelay = Math.max(0, sibs.indexOf(e.target)) * 90 + "ms";
        e.target.classList.add("is-in");
        rio.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    reveals.forEach((el) => rio.observe(el));
  }

  /* ---------- Orden de servicio ---------- */
  const form = document.getElementById("wizard");
  const steps = [...form.querySelectorAll(".step")];
  const rowsEl = document.getElementById("t-rows");
  const prioEl = document.getElementById("t-prio");
  const tipEl = document.getElementById("t-tip");
  const errEl = document.getElementById("t-err");
  const sendEl = document.getElementById("t-send");
  const msgEl = document.getElementById("t-msg");
  const fillEl = document.getElementById("m-fill");
  const needleEl = document.getElementById("m-needle");
  const noEl = document.getElementById("t-no");

  const d = new Date();
  noEl.textContent = "#" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0");

  const LABELS = {
    aire: [["lugar", "Lugar"], ["exterior", "Unidad ext."], ["equipo", "Equipo"]],
    heladera: [["heladera", "Equipo"], ["sintoma", "Falla"], ["mercaderia", "Mercadería"]],
  };
  const TIPS = {
    aire: "Tip: mandá una foto del ambiente y otra de donde iría la unidad exterior. Si ya tenés el equipo, sumá la foto de la caja o la etiqueta.",
    heladera: "Tip: sacale foto a la <b>chapa del equipo</b> (la etiqueta con marca y modelo). Si hace ruido, grabá un video corto.",
  };
  const val = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || "";
  const txt = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const setMeter = (ratio, color) => {
    const r = Math.max(0, Math.min(1, ratio));
    fillEl.style.strokeDashoffset = String(158 * (1 - r));
    fillEl.style.stroke = color;
    needleEl.style.transform = `rotate(${-90 + 180 * r}deg)`;
  };

  const render = () => {
    const tipo = val("tipo");
    // Mostrar la rama elegida, paso a paso
    let prevDone = !!tipo;
    steps.forEach((s) => {
      const br = s.dataset.branch;
      if (s.dataset.step === "tipo") return;
      if (s.dataset.step === "datos") { s.hidden = !tipo; return; }
      if (br !== tipo) { s.hidden = true; return; }
      s.hidden = !prevDone && !QA;
      prevDone = prevDone && !!val(s.dataset.step);
    });

    // Filas del ticket
    const rows = [["Servicio", tipo === "aire" ? "Instalación de aire acondicionado" : tipo === "heladera" ? "Reparación de heladera comercial" : "—"]];
    if (tipo) LABELS[tipo].forEach(([k, l]) => rows.push([l, val(k) || "—"]));
    if (tipo) {
      rows.push(["Zona", txt("zona") || "—"]);
      rows.push(["Nombre", txt("nombre") || "—"]);
    }
    rowsEl.innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    tipEl.innerHTML = TIPS[tipo] || TIPS.heladera;

    // Prioridad (solo orienta el mensaje; no es un compromiso de horario)
    if (!tipo) { prioEl.textContent = "Elegí un servicio"; setMeter(0, "var(--lo)"); }
    else if (tipo === "aire") {
      const ext = val("exterior");
      prioEl.textContent = ext === "Fachada, en altura" ? "Instalación en altura" : "Instalación a coordinar";
      setMeter(ext === "Fachada, en altura" ? 0.55 : 0.35, "var(--hi)");
    } else {
      const sIn = form.querySelector('input[name="sintoma"]:checked');
      const mIn = form.querySelector('input[name="mercaderia"]:checked');
      const u = (sIn ? +sIn.dataset.u : 0) + (mIn ? +mIn.dataset.u : 0);
      const r = sIn ? Math.min(1, 0.2 + u / 5 * 0.8) : 0.15;
      prioEl.textContent = !sIn ? "Contanos qué le pasa" : u >= 4 ? "Urgente: equipo cargado sin frío" : u >= 2 ? "Conviene revisarla pronto" : "Revisión a coordinar";
      setMeter(r, u >= 4 ? "var(--hi)" : "var(--lo)");
    }

    // Mensaje
    const lines = ["Hola Soluciones Servicios Baires, les mando mi orden de servicio:"];
    rows.forEach(([k, v]) => { if (v !== "—") lines.push(`• ${k}: ${v}`); });
    const nota = txt("nota");
    if (nota) lines.push(`• Detalle: ${nota}`);
    lines.push(tipo === "heladera" ? "Les paso foto de la chapa del equipo." : tipo === "aire" ? "Les paso fotos del lugar." : "");
    const msg = lines.filter(Boolean).join("\n");
    msgEl.textContent = msg;
    sendEl.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    errEl.hidden = true;
  };

  form.addEventListener("change", render);
  form.addEventListener("input", (e) => { if (e.target.matches("input[type=text], textarea")) render(); });
  form.addEventListener("submit", (e) => e.preventDefault());

  sendEl.addEventListener("click", (e) => {
    const tipo = val("tipo");
    let falta = "";
    if (!tipo) falta = "Elegí si es un aire o una heladera comercial.";
    else if (tipo === "heladera" && !val("sintoma")) falta = "Contanos qué le pasa a la heladera.";
    else if (!txt("zona")) falta = "Sumá tu barrio o localidad para saber si llegamos.";
    if (falta) {
      e.preventDefault();
      errEl.textContent = falta;
      errEl.hidden = false;
      const target = !tipo ? form.querySelector('input[name="tipo"]') : tipo === "heladera" && !val("sintoma") ? form.querySelector('input[name="sintoma"]') : form.elements.zona;
      if (target) target.focus({ preventScroll: false });
    }
  });

  const pick = (tipo) => {
    const r = form.querySelector(`input[name="tipo"][value="${tipo}"]`);
    if (r) { r.checked = true; render(); }
  };
  document.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
    pick(b.dataset.pick);
    document.getElementById("orden").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));
  if (qs.get("tipo")) pick(qs.get("tipo"));
  render();

  /* ---------- Galería: filtros + lightbox ---------- */
  const phs = [...document.querySelectorAll(".ph")];
  document.querySelectorAll(".filter").forEach((f) => f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((x) => { x.classList.toggle("is-on", x === f); x.setAttribute("aria-selected", String(x === f)); });
    phs.forEach((p) => p.classList.toggle("is-off", f.dataset.f !== "all" && p.dataset.c !== f.dataset.f));
    document.getElementById("mosaic").classList.toggle("is-filtered", f.dataset.f !== "all");
  }));

  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  let cur = 0, lastFocus = null;
  const visible = () => phs.filter((p) => !p.classList.contains("is-off"));
  const show = (i) => {
    const list = visible();
    cur = (i + list.length) % list.length;
    const img = list[cur].querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = list[cur].querySelector("span").textContent;
  };
  const openLb = (p) => { lastFocus = p; show(visible().indexOf(p)); lb.hidden = false; document.body.style.overflow = "hidden"; document.getElementById("lb-x").focus(); };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  phs.forEach((p) => p.addEventListener("click", () => openLb(p)));
  document.getElementById("lb-x").addEventListener("click", closeLb);
  document.getElementById("lb-p").addEventListener("click", () => show(cur - 1));
  document.getElementById("lb-n").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Botón flotante: se esconde sobre el cierre ---------- */
  const fab = document.getElementById("fab");
  const hideOn = new Set();
  if ("IntersectionObserver" in window) {
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? hideOn.add(e.target) : hideOn.delete(e.target)));
      fab.classList.toggle("is-hidden", hideOn.size > 0);
    }, { threshold: 0.2 });
    // Oculto mientras se ven los CTA del hero o del cierre: no tapa contenido ni duplica botones
    [document.querySelector(".tile--head .cta-row"), document.querySelector(".close")].forEach((el) => el && fio.observe(el));
  }
})();
