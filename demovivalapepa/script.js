/* ============================================
   Viva La Pepa — Vanilla JS
   ============================================ */

// ----- Data -----
const services = [
  {
    title: "Cumpleaños Infantiles",
    desc: "Juegos, música y pura energía para los más chicos.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>'
  },
  {
    title: "Baby Shower",
    desc: "Dinámicas tiernas y divertidas para celebrar la dulce espera.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>'
  },
  {
    title: "Revelación de Género",
    desc: "El momento más emocionante preparado con creatividad y sorpresa.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>'
  },
  {
    title: "Comuniones",
    desc: "Animación respetuosa y entretenida para un día tan especial.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9h4"/><path d="M12 7v5"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="m18 22-1-2-1 2"/><path d="m6 22 1-2 1 2"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M22 22V11l-4-3"/><path d="M2 22V11l4-3"/></svg>'
  },
  {
    title: "Bautismos",
    desc: "Acompañamiento cálido con actividades para todas las edades.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/><circle cx="12" cy="12" r="3"/></svg>'
  },
  {
    title: "Cumpleaños de Adultos",
    desc: "Fiestas de 30, 40, 50 y más. Humor, juegos y cero aburrimiento.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-3.5-2-7H9c-1.5 3.5-2 5-2 7a5 5 0 0 0 5 5Z"/></svg>'
  },
  {
    title: "Spa de Nenas",
    desc: "Un momento de relax, belleza y brillos para sentirse reinas.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>'
  },
  {
    title: "Globología",
    desc: "Figuras increíbles y arcos decorativos que transforman el espacio.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a8 8 0 0 1-8-8c0-4.42 3.58-9 8-9s8 4.58 8 9a8 8 0 0 1-8 8z"/><path d="M12 22v-4"/><path d="m10 18 2 4 2-4"/></svg>'
  },
  {
    title: "Maquillaje Artístico",
    desc: "Diseños hermosos y coloridos con materiales hipoalergénicos.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
  }
];

const diffs = [
  "Animadores 100% profesionales y capacitados",
  "Actividades pensadas a medida de cada grupo",
  "Todos los materiales de juego incluidos y en perfecto estado",
  "Puntualidad, organización y cero estrés para vos",
  "Propuestas modernas, lejos de los clichés aburridos",
  "Sonido y musicalización de alta calidad"
];

const gallery = [
  { src: "images/kids-birthday.png", alt: "Cumpleaños infantil" },
  { src: "images/baby-shower.png", alt: "Baby shower elegante" },
  { src: "images/gender-reveal.png", alt: "Revelación de género" },
  { src: "images/adult-birthday.png", alt: "Cumpleaños adultos" },
  { src: "images/balloon-arch.png", alt: "Globología y decoración" },
  { src: "images/face-painting.png", alt: "Maquillaje artístico" },
  { src: "images/communion.png", alt: "Comuniones" },
  { src: "images/spa-nenas.png", alt: "Spa de nenas" }
];

// ----- Render -----
function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = services.map(s => `
    <article class="service-card reveal">
      <div class="ic-wrap">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </article>
  `).join("");
}

function renderDiffs() {
  const list = document.getElementById("diff-list");
  if (!list) return;
  const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  list.innerHTML = diffs.map(d => `
    <li>
      <span class="check">${checkSvg}</span>
      <span>${d}</span>
    </li>
  `).join("");
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = gallery.map(img => `
    <figure class="gallery-item reveal">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" />
      <figcaption class="overlay">${img.alt}</figcaption>
    </figure>
  `).join("");
}

// ----- Reveal on scroll -----
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  items.forEach(el => obs.observe(el));
}

// ----- Init -----
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderDiffs();
  renderGallery();
  setupReveal();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
