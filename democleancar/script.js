const WHATSAPP = "5491149394976";

const products = [
  { id: "lub-10w40", name: "Lubricante 10W-40", category: "lubricantes", label: "Motor", desc: "Lubricación y protección para el uso diario.", image: "assets/lubricantes.jpg" },
  { id: "lub-5w30", name: "Aceite sintético 5W-30", category: "lubricantes", label: "Motor", desc: "Rendimiento y cuidado en cada arranque.", image: "assets/lubricantes.jpg" },
  { id: "perf-black", name: "Perfume interior Black", category: "interior", label: "Aromas", desc: "Fragancia intensa para el habitáculo.", image: "assets/interior.jpg" },
  { id: "perf-citrus", name: "Perfume interior Citrus", category: "interior", label: "Aromas", desc: "Aroma fresco y liviano para todos los días.", image: "assets/interior.jpg" },
  { id: "sil-tablero", name: "Silicona para tableros", category: "interior", label: "Interior", desc: "Realza el acabado y ayuda a proteger superficies.", image: "assets/siliconas.jpg" },
  { id: "limp-interior", name: "Limpiador multi interior", category: "interior", label: "Interior", desc: "Para plásticos, paneles y zonas de contacto.", image: "assets/siliconas.jpg" },
  { id: "cera-liquida", name: "Cera líquida protectora", category: "exterior", label: "Exterior", desc: "Brillo uniforme y una capa extra de protección.", image: "assets/ceras.jpg" },
  { id: "ren-neumaticos", name: "Renovador de neumáticos", category: "exterior", label: "Exterior", desc: "Terminación pareja para cubiertas y cauchos.", image: "assets/ceras.jpg" },
  { id: "shampoo-ph", name: "Shampoo pH neutro", category: "exterior", label: "Lavado", desc: "Limpieza suave para conservar la terminación.", image: "assets/espuma.jpg" },
  { id: "microfibra", name: "Paño de microfibra", category: "exterior", label: "Accesorios", desc: "Secado y repaso sin marcar la superficie.", image: "assets/espuma.jpg" }
];

const state = {
  filter: "todos",
  search: "",
  cart: JSON.parse(localStorage.getItem("cleanCarCart") || "{}")
};

const grid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const drawer = document.querySelector("#cartDrawer");

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function visibleProducts() {
  const term = normalize(state.search);
  return products.filter(product => {
    const matchesFilter = state.filter === "todos" || product.category === state.filter;
    const matchesSearch = !term || normalize(`${product.name} ${product.desc} ${product.label}`).includes(term);
    return matchesFilter && matchesSearch;
  });
}

function renderProducts() {
  const visible = visibleProducts();
  grid.innerHTML = visible.map((product, index) => {
    const added = Boolean(state.cart[product.id]);
    return `
      <article class="product-card" style="animation-delay:${Math.min(index * 45, 270)}ms">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}, imagen ilustrativa" loading="lazy">
          <span class="product-cat">${product.label}</span>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <button class="add-product ${added ? "is-added" : ""}" type="button" data-add="${product.id}" aria-pressed="${added}">
            <span>${added ? "En tu lista" : "Agregar a mi lista"}</span><b>${added ? "✓" : "+"}</b>
          </button>
        </div>
      </article>`;
  }).join("");
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? "producto" : "productos"}`;
  emptyState.hidden = visible.length > 0;
}

function setFilter(filter) {
  state.filter = filter;
  filterButtons.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
}

function cartEntries() {
  return products.filter(product => state.cart[product.id]).map(product => ({ ...product, qty: state.cart[product.id] }));
}

function saveCart() {
  localStorage.setItem("cleanCarCart", JSON.stringify(state.cart));
  renderCart();
  renderProducts();
}

function renderCart() {
  const entries = cartEntries();
  const total = entries.reduce((sum, item) => sum + item.qty, 0);
  document.querySelector("#cartItems").innerHTML = entries.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="" loading="lazy">
      <div><strong>${item.name}</strong><small>${item.label}</small></div>
      <div class="qty-controls" aria-label="Cantidad de ${item.name}">
        <button type="button" data-qty="${item.id}" data-change="-1" aria-label="Quitar uno">−</button>
        <span>${item.qty}</span>
        <button type="button" data-qty="${item.id}" data-change="1" aria-label="Agregar uno">+</button>
      </div>
    </div>`).join("");
  document.querySelector("#cartEmpty").hidden = entries.length > 0;
  document.querySelector("#cartItems").hidden = entries.length === 0;
  document.querySelector("#sendCart").disabled = entries.length === 0;
  document.querySelector("#cartTotal").textContent = `${total} ${total === 1 ? "producto" : "productos"}`;
  document.querySelector("#cartHeadCount").textContent = total;
  document.querySelector("#mobileCartCount").textContent = total;
  document.querySelector("#mobileCart").classList.toggle("is-visible", total > 0);
}

function toggleProduct(id) {
  if (state.cart[id]) delete state.cart[id];
  else state.cart[id] = 1;
  saveCart();
}

function changeQuantity(id, change) {
  if (!state.cart[id]) return;
  state.cart[id] += change;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveCart();
}

function openCart() {
  if (!drawer.open) drawer.showModal();
  document.body.classList.add("cart-open");
}

function closeCart() {
  drawer.close();
  document.body.classList.remove("cart-open");
}

function sendCart() {
  const entries = cartEntries();
  if (!entries.length) return;
  const lines = entries.map(item => `• ${item.qty}x ${item.name}`);
  const message = ["Hola Clean Car, quiero consultar por estos productos:", "", ...lines, "", "¿Me confirmás marcas, presentaciones, stock y precio?"].join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) toggleProduct(button.dataset.add);
});

document.querySelector("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");
  if (button) changeQuantity(button.dataset.qty, Number(button.dataset.change));
});

filterButtons.forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
searchInput.addEventListener("input", () => { state.search = searchInput.value; renderProducts(); });
document.querySelector("#clearSearch").addEventListener("click", () => { searchInput.value = ""; state.search = ""; setFilter("todos"); });

document.querySelectorAll("[data-quick-filter]").forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.quickFilter;
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
  if (filter === "servicios") document.querySelector("#lavadero").scrollIntoView({ behavior: "smooth" });
  else setFilter(filter);
}));

document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => {
  const service = button.dataset.service;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Clean Car, quiero consultar por el servicio de ${service}.`)}`, "_blank", "noopener");
}));

document.querySelector("#cartHead").addEventListener("click", openCart);
document.querySelector("#mobileCart").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
document.querySelector("#sendCart").addEventListener("click", sendCart);
drawer.addEventListener("click", event => { if (event.target === drawer) closeCart(); });
drawer.addEventListener("close", () => document.body.classList.remove("cart-open"));

const header = document.querySelector("#siteHeader");
const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); });
}, { threshold: .12 });
document.querySelectorAll(".section-head, .wash-copy, .final-cta > *, footer").forEach(element => {
  element.classList.add("reveal");
  observer.observe(element);
});

renderProducts();
renderCart();
