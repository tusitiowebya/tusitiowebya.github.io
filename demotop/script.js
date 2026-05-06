const WHATSAPP_LINK =
  "https://wa.me/5493813382103?text=Hola%21%20Quiero%20consultar%20por%20sus%20productos%20%F0%9F%91%8B";

function openWhatsApp() {
  window.open(WHATSAPP_LINK, "_blank");
}

// ─── HEADER SCROLL ──────────────────────────────────────────
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ─── SMOOTH SCROLL TO TOP ───────────────────────────────────
document.querySelectorAll("[data-scroll-top]").forEach((el) => {
  el.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ─── WHATSAPP ALL BUTTONS ───────────────────────────────────
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.addEventListener("click", openWhatsApp);
});

// ─── SCROLL REVEAL ──────────────────────────────────────────
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
reveals.forEach((el) => revealObserver.observe(el));

// ─── FAQ ACCORDION ──────────────────────────────────────────
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));

    if (!isOpen) {
      item.classList.add("open");
    }
  });
});
