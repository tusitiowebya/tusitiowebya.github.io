/* ==========================================================
   Tarot & Videncia — script.js
   ========================================================== */

// ---- CONFIG ----
const WHATSAPP_NUMBER = "5491100000000"; // <-- cambiá por tu número (con código de país, sin +)
const WHATSAPP_MESSAGE =
  "Hola Aurelia, vi tu página y quiero hacer una consulta de tarot.";

// ---- WhatsApp links ----
function buildWaLink(extra) {
  const text = encodeURIComponent(extra ? `${WHATSAPP_MESSAGE} ${extra}` : WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.setAttribute("href", buildWaLink());
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener noreferrer");
});

// ---- Year ----
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Nav scroll state ----
const nav = document.querySelector(".nav");
const onScroll = () => {
  if (window.scrollY > 30) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
revealEls.forEach((el) => io.observe(el));

// ---- Smooth-anchor (just in case) ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

// ---- Form handler ----
const form = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();
    if (!name || !message) {
      form.reportValidity();
      return;
    }
    // Open WhatsApp with the user's data prefilled
    const extra = `Soy ${name}. Mi consulta: ${message}`;
    window.open(buildWaLink(extra), "_blank", "noopener,noreferrer");

    formSuccess.classList.add("show");
    form.reset();
    setTimeout(() => formSuccess.classList.remove("show"), 6000);
  });
}

/* ==========================================================
   Stars / particles canvas
   ========================================================== */
(function starfield() {
  const canvas = document.getElementById("stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let raf = 0;

  const resize = () => {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.floor((w * h) / 8000); // density
    stars = new Array(count).fill(0).map(() => makeStar());
  };

  const makeStar = () => {
    const tier = Math.random();
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: tier > 0.97 ? 1.6 + Math.random() * 0.8 : 0.4 + Math.random() * 0.9,
      a: 0.3 + Math.random() * 0.7,
      tw: Math.random() * Math.PI * 2,
      tws: 0.005 + Math.random() * 0.02,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      gold: tier > 0.92,
    };
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.tw += s.tws;
      const tw = (Math.sin(s.tw) + 1) / 2; // 0..1
      const alpha = s.a * (0.5 + tw * 0.5);
      ctx.beginPath();
      const color = s.gold ? `rgba(245, 200, 112, ${alpha})` : `rgba(255, 250, 230, ${alpha})`;
      ctx.fillStyle = color;
      if (s.gold) {
        ctx.shadowColor = "rgba(245, 200, 112, 0.8)";
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -2) s.x = w + 2;
      if (s.x > w + 2) s.x = -2;
      if (s.y < -2) s.y = h + 2;
      if (s.y > h + 2) s.y = -2;
    }
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(tick);
  };

  resize();
  tick();

  let to;
  window.addEventListener("resize", () => {
    clearTimeout(to);
    to = setTimeout(resize, 120);
  });

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });
})();
