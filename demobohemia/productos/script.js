/* ============================================
   Catalogo Mayorista - Electro Bohemia
   script.js
   ============================================ */

const API_URL =
  "https://www.electrobohemia.com.ar/galeria/ws.php?format=json&method=pwg.categories.getImages&cat_id=1&per_page=12";
const WHATSAPP_NUMBER = "549XXXXXXXXXX";
const PLACEHOLDER_IMG = "images/placeholder-product.jpg";

// --- SVG Icons ---
const whatsappSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const chevronUpSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>`;

const errorSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

// --- DOM References ---
const productsContainer = document.getElementById("products-container");
const backToTopBtn = document.getElementById("back-to-top");

// --- Skeleton Loader ---
function renderSkeletons(count = 8) {
  let html = '<div class="skeleton-grid">';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line w75"></div>
          <div class="skeleton-line w100"></div>
          <div class="skeleton-line w66"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>`;
  }
  html += "</div>";
  productsContainer.innerHTML = html;
}

// --- Error State ---
function renderError() {
  productsContainer.innerHTML = `
    <div class="error-state">
      <div class="error-icon">${errorSVG}</div>
      <h3 class="error-title">Error al cargar productos</h3>
      <p class="error-desc">
        No pudimos conectar con el servidor. Por favor, intent&aacute; nuevamente
        m&aacute;s tarde o contact&aacute;nos por WhatsApp.
      </p>
    </div>`;
}

// --- Product Card ---
function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.transitionDelay = `${index * 80}ms`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, quiero consultar por ${product.name}`
  )}`;

  card.innerHTML = `
    <div class="card-img">
      <img
        src="${product.imageUrl}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.src='${PLACEHOLDER_IMG}'"
        crossorigin="anonymous"
      />
      <div class="card-img-overlay"></div>
    </div>
    <div class="card-body">
      <h3 class="card-title">${product.name}</h3>
      ${product.comment ? `<p class="card-desc">${product.comment}</p>` : ""}
      <a
        href="${waLink}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-whatsapp"
        aria-label="Consultar por ${product.name} en WhatsApp"
      >
        ${whatsappSVG}
        Consultar
      </a>
    </div>`;

  return card;
}

// --- Render Products ---
function renderProducts(products) {
  const grid = document.createElement("div");
  grid.className = "product-grid";

  products.forEach((product, index) => {
    const card = createProductCard(product, index);
    grid.appendChild(card);
  });

  productsContainer.innerHTML = "";
  productsContainer.appendChild(grid);

  // Intersection Observer for scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  grid.querySelectorAll(".product-card").forEach((card) => {
    observer.observe(card);
  });
}

// --- Fetch Products ---
async function fetchProducts() {
  renderSkeletons();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (data.stat !== "ok" || !data.result || !data.result.images) {
      throw new Error("Invalid API response");
    }

    const products = data.result.images.map((img) => ({
      name: img.name || "Producto sin nombre",
      comment: img.comment || null,
      imageUrl:
        (img.derivatives && img.derivatives.medium && img.derivatives.medium.url) ||
        PLACEHOLDER_IMG,
    }));

    // Small delay to show the skeleton effect
    setTimeout(() => {
      renderProducts(products);
    }, 400);
  } catch (error) {
    console.error("Error fetching products:", error);
    renderError();
  }
}

// --- Back to Top ---
function initBackToTop() {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  initBackToTop();
});
