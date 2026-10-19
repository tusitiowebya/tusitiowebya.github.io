(() => {
  const WA = "5491126485773";
  const TZ = "America/Argentina/Buenos_Aires";
  const QA = /[?&]qa/.test(location.search);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (QA) document.documentElement.style.scrollBehavior = "auto";
  const money = n => "$" + n.toLocaleString("es-AR");
  const waUrl = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;

  // Fechas reales: flyers del cliente + eventosconclave.com
  const EVENTS = [
    {
      id: "gricel", nombre: "Club Gricel", corto: "Club Gricel", fechaTxt: "sábado 24/10",
      extra: "DJ Rulex Cósmico", dia: "2026-10-24",
      end: new Date("2026-10-25T06:00:00-03:00"), tiers: null
    },
    {
      id: "lacity", nombre: "La City Halloween", corto: "La City · Halloween", fechaTxt: "viernes 30/10",
      extra: "100% salsa · 23 a 5", dia: "2026-10-30",
      start: new Date("2026-10-30T23:00:00-03:00"),
      end: new Date("2026-10-31T05:00:00-03:00"),
      tiers: [
        { n: "Preventa 1", p: 14000, until: new Date("2026-10-15T23:59:59-03:00"), hasta: "15/10" },
        { n: "Preventa 2", p: 17000, until: new Date("2026-10-29T23:59:59-03:00"), hasta: "29/10" },
        { n: "En puerta", p: 20000 }
      ]
    }
  ];

  const now = () => new Date();
  const todayAR = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now());
  const dayDiff = iso => Math.round((Date.parse(iso + "T00:00:00Z") - Date.parse(todayAR() + "T00:00:00Z")) / 864e5);
  const isPast = ev => now() > ev.end;
  const upcoming = () => EVENTS.filter(e => !isPast(e));
  const tierNow = ev => ev.tiers ? ev.tiers.find(t => !t.until || now() <= t.until) : null;
  const doorTier = ev => ev.tiers ? ev.tiers[ev.tiers.length - 1] : null;
  const whenLabel = ev => {
    if (isPast(ev)) return "Ya pasó";
    const d = dayDiff(ev.dia);
    if (d <= 0) return "¡Es hoy!";
    if (d === 1) return "Es mañana";
    return `Faltan ${d} días`;
  };

  /* ---------- nav / menú ---------- */
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  let inLista = false;
  const onScroll = () => {
    nav.classList.toggle("is-solid", scrollY > 40);
    $(".dock").classList.toggle("is-on", scrollY > innerHeight * .7 && !inLista);
  };
  // el armador ya tiene su propio botón de WhatsApp
  new IntersectionObserver(([e]) => { inLista = e.isIntersecting; onScroll(); }).observe($("#lista"));
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const setMenu = open => {
    menu.hidden = !open; burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(menu.hidden));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); closeLb(); } });

  /* ---------- links de WhatsApp ---------- */
  const GENERIC = {
    sabados: "Hola Marce! ¿Qué hay este sábado en Gricel? Quiero anotarme.",
    empty: "Hola Marce! ¿Cuál es la próxima fiesta?"
  };
  $$("[data-wa]").forEach(a => {
    a.href = waUrl(GENERIC[a.dataset.wa] || "Hola Marce! Quiero anotarme en lista. ¿Qué fiestas hay?");
  });
  const evMsg = ev => {
    if (isPast(ev)) return `Hola Marce! Vi que ya pasó ${ev.nombre}. ¿Cuál es la próxima fiesta?`;
    const t = tierNow(ev);
    if (t) return `Hola Marce! Quiero la entrada para ${ev.nombre} (${ev.fechaTxt}). Vi ${t.n} a ${money(t.p)}. ¿Me pasás el alias de Mercado Pago?`;
    return `Hola Marce! Quiero reservar para ${ev.nombre} el ${ev.fechaTxt} (${ev.extra}). ¿Cuánto sale y cómo reservo?`;
  };
  $$("[data-wa-ev]").forEach(a => {
    const ev = EVENTS.find(e => e.id === a.dataset.waEv);
    a.href = waUrl(evMsg(ev));
    if (isPast(ev)) a.lastChild.textContent = "Preguntar por la próxima";
  });

  /* ---------- cartelera ---------- */
  EVENTS.forEach(ev => {
    const card = $(`[data-ev="${ev.id}"]`);
    if (!card) return;
    if (isPast(ev)) { card.hidden = true; return; }
    $("[data-state]", card).textContent = whenLabel(ev);
  });
  if (!upcoming().length) $("#eventsEmpty").hidden = false;

  const lacity = EVENTS[1], tNow = tierNow(lacity);
  $("#tiers").innerHTML = lacity.tiers.map(t => {
    const cls = t === tNow ? "is-now" : (t.until && now() > t.until ? "is-past" : "");
    return `<li class="tier ${cls}"><small>${t.n}</small><b>${money(t.p)}</b><span>${t.hasta ? "hasta el " + t.hasta : "el día de la fiesta"}</span></li>`;
  }).join("");

  /* ---------- placa de la marquesina ---------- */
  const next = upcoming()[0];
  const plateCount = $("#plateCount");
  const tickPlate = () => {
    if (!next) return;
    if (next.start && dayDiff(next.dia) <= 1) {
      const ms = next.start - now();
      if (ms > 0) {
        const h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4);
        plateCount.textContent = `faltan ${h} h ${String(m).padStart(2, "0")} min`;
        return;
      }
      plateCount.textContent = "¡Está pasando!";
      return;
    }
    plateCount.textContent = whenLabel(next).toLowerCase();
  };
  if (next) {
    $("#plateName").textContent = next.corto;
    $("#plateWhen").textContent = next.fechaTxt.replace(/^./, c => c.toUpperCase()) + " · " + next.extra;
    tickPlate(); setInterval(tickPlate, 30000);
  } else {
    $("#plateName").textContent = "Nuevas fechas";
    $("#plateWhen").textContent = "Pedile a Marce la próxima";
  }

  /* ---------- ticker ---------- */
  const items = [];
  upcoming().forEach(ev => {
    const t = tierNow(ev);
    items.push(`${ev.fechaTxt} · ${ev.nombre}`);
    if (t && t.until) items.push(`${t.n} ${money(t.p)} hasta el ${t.hasta}`);
    if (t && !t.until) items.push(`Entrada en puerta ${money(t.p)}`);
  });
  items.push("Los sábados se bachatea en Gricel", "Salsa a la carta en La City", "Reservas con Marce 11 2648-5773");
  const tk = $("#ticker");
  tk.innerHTML = [...items, ...items].map(t => `<span>${t}</span>`).join("");

  /* ---------- lamparitas ---------- */
  const frame = $(".marquee-frame"), bulbsBox = $("#bulbs");
  let bulbs = [];
  const layBulbs = () => {
    const w = frame.offsetWidth, h = frame.offsetHeight, inset = 10, r = 22;
    const pts = [];
    const per = 2 * (w + h - 4 * inset);
    const n = Math.max(24, Math.round(per / 26));
    // recorrido de un rectángulo redondeado
    const W = w - 2 * inset, H = h - 2 * inset, rr = Math.min(r, W / 2, H / 2);
    const segs = [
      ["l", W - 2 * rr, (t) => [inset + rr + t, inset]],
      ["a", Math.PI * rr / 2, (t) => { const a = -Math.PI / 2 + t / rr; return [inset + W - rr + rr * Math.cos(a), inset + rr + rr * Math.sin(a)]; }],
      ["l", H - 2 * rr, (t) => [inset + W, inset + rr + t]],
      ["a", Math.PI * rr / 2, (t) => { const a = t / rr; return [inset + W - rr + rr * Math.cos(a), inset + H - rr + rr * Math.sin(a)]; }],
      ["l", W - 2 * rr, (t) => [inset + W - rr - t, inset + H]],
      ["a", Math.PI * rr / 2, (t) => { const a = Math.PI / 2 + t / rr; return [inset + rr + rr * Math.cos(a), inset + H - rr + rr * Math.sin(a)]; }],
      ["l", H - 2 * rr, (t) => [inset, inset + H - rr - t]],
      ["a", Math.PI * rr / 2, (t) => { const a = Math.PI + t / rr; return [inset + rr + rr * Math.cos(a), inset + rr + rr * Math.sin(a)]; }]
    ];
    const total = segs.reduce((s, x) => s + x[1], 0);
    for (let i = 0; i < n; i++) {
      let d = i * total / n;
      for (const s of segs) { if (d <= s[1]) { pts.push(s[2](d)); break; } d -= s[1]; }
    }
    bulbsBox.innerHTML = pts.map(([x, y]) => `<i class="bulb" style="left:${x}px;top:${y}px"></i>`).join("");
    bulbs = $$(".bulb", bulbsBox);
    paint();
  };
  let phase = 0;
  const paint = () => bulbs.forEach((b, i) => b.classList.toggle("on", reduce || QA || (i + phase) % 3 !== 0));
  layBulbs();
  new ResizeObserver(layBulbs).observe(frame);
  if (!reduce && !QA) setInterval(() => { phase = (phase + 1) % 3; paint(); }, 260);

  /* ---------- armá tu lista ---------- */
  const KEY = "mmf-lista-v1";
  let st = { ev: null, names: [], mot: [] };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  const OPTS = [...upcoming().map(e => ({ id: e.id, label: e.corto, sub: e.fechaTxt })), { id: "proxima", label: "La que venga", sub: "avisame la próxima" }];
  if (!OPTS.some(o => o.id === st.ev)) st.ev = OPTS[0].id;
  const evChips = $("#evChips");
  evChips.innerHTML = OPTS.map(o => `<button type="button" class="chip" role="radio" data-id="${o.id}" aria-checked="false">${o.label}<small>${o.sub}</small></button>`).join("");
  evChips.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    st.ev = b.dataset.id; render(true);
  });

  const nameIn = $("#nameIn"), nameHint = $("#nameHint");
  const addName = () => {
    const v = nameIn.value.replace(/\s+/g, " ").trim();
    if (!v) { nameIn.focus(); return; }
    if (st.names.length >= 15) { nameHint.textContent = "Llegaste a 15. Si son más, decíselo a Marce en el mensaje."; nameHint.classList.add("is-warn"); return; }
    st.names.push(v); nameIn.value = ""; nameIn.focus(); render(true);
  };
  $("#nameAdd").addEventListener("click", addName);
  nameIn.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addName(); } });
  $("#nameList").addEventListener("click", e => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    st.names.splice(+b.dataset.i, 1); render();
  });
  $("#motChips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    const m = b.dataset.mot;
    st.mot = st.mot.includes(m) ? st.mot.filter(x => x !== m) : [...st.mot, m];
    render();
  });
  $("#reset").addEventListener("click", () => { st = { ev: OPTS[0].id, names: [], mot: [] }; nameHint.classList.remove("is-warn"); render(true); });

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const serial = () => {
    let h = 7; (st.ev + st.names.join("|")).split("").forEach(c => h = (h * 31 + c.charCodeAt(0)) % 9973);
    return "Nº " + String(h).padStart(4, "0");
  };

  const render = stamp => {
    save();
    $$(".chip", evChips).forEach(b => b.setAttribute("aria-checked", b.dataset.id === st.ev));
    $$(".chip", $("#motChips")).forEach(b => b.setAttribute("aria-pressed", st.mot.includes(b.dataset.mot)));
    $("#nameList").innerHTML = st.names.map((n, i) => `<li>${i === 0 ? "<i>VOS</i>" : ""}${esc(n)}<button type="button" data-i="${i}" aria-label="Sacar a ${esc(n)}">×</button></li>`).join("");
    if (st.names.length < 15) { nameHint.textContent = st.names.length ? `${st.names.length} en la lista. Seguí sumando o mandala.` : "Empezá por el tuyo. Hasta 15 nombres."; nameHint.classList.remove("is-warn"); }

    const ev = EVENTS.find(e => e.id === st.ev);
    const qty = st.names.length;
    $("#wEv").textContent = ev ? ev.corto : "La próxima fiesta";
    $("#wMeta").textContent = ev ? `${ev.fechaTxt} · ${ev.extra}` : "Marce te avisa la fecha";
    $("#wQty").textContent = qty;
    $("#wNo").textContent = serial();

    const t = ev && tierNow(ev), door = ev && doorTier(ev);
    const sTier = $("#sTier"), sEach = $("#sEach"), sTotal = $("#sTotal"), saveRow = $("#sSaveRow");
    if (t) {
      sTier.textContent = t.until ? `${t.n} (hasta el ${t.hasta})` : t.n;
      sEach.textContent = money(t.p);
      sTotal.textContent = qty ? money(t.p * qty) : "—";
      const ahorro = (door.p - t.p) * qty;
      saveRow.hidden = !(ahorro > 0);
      $("#sSave").textContent = money(ahorro);
      $("#passNote").textContent = "Valores publicados por Con Clave Producciones. Marce te confirma todo y te pasa el alias de Mercado Pago.";
    } else {
      sTier.textContent = "A confirmar";
      sEach.textContent = "Consultalo con Marce";
      sTotal.textContent = qty ? `${qty} ${qty === 1 ? "persona" : "personas"}` : "—";
      saveRow.hidden = true;
      $("#passNote").textContent = "Para esta fecha el valor lo confirma Marce por WhatsApp.";
    }

    const lines = ["Hola Marce! Te mando mi lista 🙌"];
    lines.push(ev ? `Fiesta: ${ev.nombre} (${ev.fechaTxt})` : "Fiesta: la próxima que venga, avisame cuál es");
    lines.push(qty ? `Somos ${qty}: ${st.names.join(", ")}` : "Somos: (te paso los nombres)");
    if (t && qty) lines.push(`Vi ${t.n} a ${money(t.p)} c/u, total ${money(t.p * qty)}. ¿Me pasás el alias de Mercado Pago?`);
    else if (t) lines.push(`Vi ${t.n} a ${money(t.p)}. ¿Me pasás el alias de Mercado Pago?`);
    else if (ev) lines.push("¿Cuánto sale la entrada y cómo reservo?");
    if (st.mot.length) lines.push(`Dato: ${st.mot.join(" · ")}`);
    const msg = lines.join("\n");
    $("#msgPrev").textContent = msg;
    $("#sendList").href = waUrl(msg);

    if (stamp) { const w = $("#wrist"); w.classList.remove("is-stamp"); void w.offsetWidth; w.classList.add("is-stamp"); }
  };
  render();

  /* ---------- lightbox ---------- */
  const lb = $("#lb"), lbImg = $("#lbImg");
  let lastFocus = null;
  $$("[data-zoom]").forEach(b => b.addEventListener("click", () => {
    lastFocus = b; lbImg.src = b.dataset.zoom; lbImg.alt = $("img", b).alt; lb.hidden = false; $("#lbX").focus();
  }));
  function closeLb() { if (lb.hidden) return; lb.hidden = true; lastFocus && lastFocus.focus(); }
  $("#lbX").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });

  /* ---------- videos ---------- */
  const heroV = $(".hero__video"), cityV = $(".lacity__video");
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (v.dataset.src && !v.src) { v.src = v.dataset.src; }
      if (!reduce) v.play().catch(() => {});
    } else v.pause();
  }), { threshold: .2 });
  [heroV, cityV].forEach(v => io.observe(v));

  /* ---------- reveals ---------- */
  const rv = $$(".sec-head, .ev, .builder, .pass, .steps__list li, .lacity__copy, .faq details, .cierre h2");
  if (QA || reduce) return;
  rv.forEach(el => el.classList.add("reveal"));
  const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  rv.forEach(el => ro.observe(el));
})();
