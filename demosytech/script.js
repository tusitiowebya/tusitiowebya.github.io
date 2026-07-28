/* =====================================================================
   S.Y.TECH Hnos. — app (cinematic industrial)
   Vanilla JS · GSAP + ScrollTrigger + Lenis (globales, con guardas)
   Chispas en canvas 2D · sin módulos ni WebGL · con modo LITE
   ===================================================================== */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = matchMedia("(hover:hover) and (pointer:fine)").matches;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Lenis = window.Lenis;
  var hasGsap = !!(gsap && ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!hasGsap) document.documentElement.classList.add("no-anim");

  /* Detecta equipos sin aceleración por hardware / gama baja / sin WebGL
     → modo LITE: sin chispas, sin Lenis, sin backdrop-filter (glass sólido).
     Overrides: ?lite fuerza liviano · ?full fuerza completo. */
  function detectLite() {
    try {
      if (/[?&]lite/.test(location.search)) return true;
      if (/[?&]full/.test(location.search)) return false;
      if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
      var c = document.createElement("canvas");
      var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return true;
      var ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        var r = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
        if (/swiftshader|llvmpipe|software|basic render|microsoft basic|mesa offscreen|softpipe/.test(r)) return true;
      }
    } catch (e) { return true; }
    return false;
  }
  var LITE = detectLite();
  if (LITE) document.documentElement.classList.add("lite");

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (hasGsap && Lenis && !reduce && !LITE) {
    try {
      lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && $(id)) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(id, { offset: -68 });
        else $(id).scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
    });
  });

  /* ---------- Chispas (canvas 2D) sobre el video del hero ---------- */
  function initSparks() {
    var canvas = $("#sparks"), hero = $("#inicio");
    if (!canvas || !hero || reduce || LITE) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, parts = [];

    function resize() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 12,
        r: 0.6 + Math.random() * 2,
        sp: 0.4 + Math.random() * 1.3,
        drift: (Math.random() - 0.5) * 0.6,
        ph: Math.random() * Math.PI * 2,
        fl: 2 + Math.random() * 4,           // flicker speed
        op: 0.35 + Math.random() * 0.55,
        warm: Math.random()                  // 0=amber .. 1=spark
      };
    }
    resize();
    var N = W < 700 ? 34 : 68;
    for (var i = 0; i < N; i++) parts.push(make(true));
    window.addEventListener("resize", resize);

    var visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);

    var t = 0;
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.sp;
        p.x += Math.sin(t * 0.8 + p.ph) * 0.4 + p.drift;
        if (p.y < -8) { parts[i] = make(false); continue; }
        var fade = p.y > H * 0.7 ? (H - p.y) / (H * 0.3) : 1;
        var flick = 0.55 + 0.45 * Math.sin(t * p.fl + p.ph);
        var a = p.op * Math.max(0, fade) * flick;
        var col = p.warm > 0.5 ? "255,122,47" : "251,169,76";
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        g.addColorStop(0, "rgba(" + col + "," + a + ")");
        g.addColorStop(1, "rgba(" + col + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    })();
  }

  /* ---------- Magnético + tilt ---------- */
  function initMagnetic() {
    if (!fine || reduce || !hasGsap) return;
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }); });
    });
  }
  function initTilt() {
    if (!fine || reduce || !hasGsap) return;
    $$(".tilt").forEach(function (el) {
      var max = 8;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotateY: px * max, rotateX: -py * max, transformPerspective: 900, transformOrigin: "center", duration: 0.4, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", function () { gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.5)" }); });
    });
  }

  /* ---------- Motion (hero + reveals + counters) ---------- */
  function setCounter(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (!hasGsap || reduce) { el.textContent = end + suf; return; }
    var o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: function () { gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v) + suf; } }); }
    });
  }
  function initMotion() {
    var counters = $$(".stat-num[data-count]");
    if (!hasGsap) { counters.forEach(setCounter); return; }

    var words = $$(".hero-title .w");
    var heroBits = [".hero .eyebrow", ".hero-lead", ".hero-actions", ".hero-trust"];
    gsap.set(words, { yPercent: 118 });
    gsap.set(heroBits, { opacity: 0, y: 24 });
    if (reduce) { gsap.set(words, { yPercent: 0 }); gsap.set(heroBits, { opacity: 1, y: 0 }); }
    else {
      gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } })
        .to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.6 })
        .to(words, { yPercent: 0, duration: 1.0, stagger: 0.06 }, "-=0.25")
        .to(".hero-lead", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
        .to(".hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(".hero-trust", { opacity: 1, y: 0, duration: 0.7 }, "-=0.6");
    }

    var revs = $$(".reveal");
    gsap.set(revs, { opacity: 0, y: 40 });
    if (reduce) gsap.set(revs, { opacity: 1, y: 0 });
    else ScrollTrigger.batch(revs, {
      start: "top 88%",
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }); },
      once: true
    });

    counters.forEach(setCounter);

    if (!reduce) {
      gsap.to(".why-bg img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".why", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".medida-video", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".medida", start: "top bottom", end: "bottom top", scrub: 1 } });
    }
  }

  /* ---------- UI ---------- */
  function initUI() {
    var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
    var nav = $("#nav"), waFloat = $("#waFloat"), progress = $("#progress");
    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      waFloat.classList.toggle("show", y > 520);
      var h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    var burger = $("#burger"), navMobile = $("#navMobile");
    function toggle(open) {
      burger.classList.toggle("open", open);
      navMobile.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    burger.addEventListener("click", function () { toggle(!navMobile.classList.contains("open")); });
    $$("#navMobile a").forEach(function (a) { a.addEventListener("click", function () { toggle(false); }); });

    // galería / lightbox
    var figs = $$(".gal-item");
    var items = figs.map(function (f) { return { src: f.querySelector("img").src, cap: (f.querySelector("figcaption") || {}).textContent || "" }; });
    var modal = $("#modal"), mImg = $("#modalImg"), mCap = $("#modalCap"), idx = 0;
    function show(i) {
      idx = (i + items.length) % items.length;
      mImg.src = items[idx].src; mImg.alt = items[idx].cap; mCap.textContent = items[idx].cap;
      if (hasGsap && !reduce) gsap.fromTo(".modal-figure", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    }
    function open(i) { modal.classList.add("open"); if (lenis) lenis.stop(); show(i); }
    function close() { modal.classList.remove("open"); if (lenis) lenis.start(); }
    figs.forEach(function (f, i) { f.addEventListener("click", function () { open(i); }); });
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", close); });
    $("#modalPrev").addEventListener("click", function () { show(idx - 1); });
    $("#modalNext").addEventListener("click", function () { show(idx + 1); });
    addEventListener("keydown", function (e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  function boot() {
    initUI();
    initMotion();
    initSparks();
    initMagnetic();
    initTilt();
    if (hasGsap) ScrollTrigger.refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
