const WA_NUMBER = "5491150054039";

const topbar = document.querySelector("#topbar");
const menu = document.querySelector(".menu");
const nav = document.querySelector("#nav");
const video = document.querySelector(".hero-video");
const videoControl = document.querySelector(".video-control");

const setTopbar = () => topbar.classList.toggle("scrolled", window.scrollY > 24);
setTopbar();
window.addEventListener("scroll", setTopbar, { passive: true });

menu.addEventListener("click", () => {
  const isOpen = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
}));

videoControl.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    videoControl.textContent = "Ⅱ";
    videoControl.setAttribute("aria-label", "Pausar video");
  } else {
    video.pause();
    videoControl.textContent = "▶";
    videoControl.setAttribute("aria-label", "Reproducir video");
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const form = document.querySelector("#route-form");
const fields = [...form.querySelectorAll("input, select, textarea")];
const meterFill = document.querySelector("#meter-fill");
const meterValue = document.querySelector("#meter-value");
const formNote = document.querySelector("#form-note");
const orderNumber = document.querySelector("#order-number");
orderNumber.textContent = `DB-${String(Math.floor(1000 + Math.random() * 9000))}`;

const updateProgress = () => {
  const completed = fields.filter((field) => field.value.trim() && field.value !== "No lo sé todavía").length;
  const progress = Math.round((completed / fields.length) * 100);
  meterFill.style.width = `${progress}%`;
  meterValue.textContent = `${progress}%`;
  formNote.textContent = progress >= 70 ? "Ya tenemos una buena base para evaluar tu traslado." : "No hace falta tener todo definido para consultar.";
};
fields.forEach((field) => field.addEventListener("input", updateProgress));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = (id) => document.querySelector(`#${id}`).value.trim() || "A confirmar";
  const rawDate = document.querySelector("#date").value;
  const formattedDate = rawDate ? new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${rawDate}T12:00:00`)) : "A confirmar";
  const message = [
    "Hola DBCARGA, quiero consultar por un traslado.",
    "",
    `Orden: ${orderNumber.textContent}`,
    `Origen: ${value("origin")}`,
    `Destino: ${value("destination")}`,
    `Tipo de carga: ${value("cargo")}`,
    `Cantidad aproximada: ${value("quantity")}`,
    `Fecha estimada: ${formattedDate}`,
    `Ayuda de carga: ${value("handling")}`,
    `Observaciones: ${value("notes")}`
  ].join("\n");
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
