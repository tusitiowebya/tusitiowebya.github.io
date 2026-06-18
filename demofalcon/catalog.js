/* ============================================================
   FALCÓN FERRETERÍA — catalog.js
   Render del catálogo, filtros, búsqueda y carrito → WhatsApp.
   ============================================================ */

const WA = "5493731401144";
const fmt = n => "$" + n.toLocaleString("es-AR");

const grid     = document.getElementById("grid");
const chipsBox = document.getElementById("chips");
const search   = document.getElementById("search");
const emptyMsg = document.getElementById("empty");

let ALL = [];
let activeCat = "Todos";
let cart = JSON.parse(localStorage.getItem("falcon_cart") || "{}");

/* ---------- INIT ---------- */
(async function init(){
  ALL = await loadProducts();

  // chips de categoría (Todos + las que existan)
  const cats = ["Todos", ...new Set(ALL.map(p => p.cat))];
  chipsBox.innerHTML = cats.map(c =>
    `<button class="chip${c===activeCat?' active':''}" data-cat="${c}">${c}</button>`
  ).join("");
  chipsBox.querySelectorAll(".chip").forEach(b =>
    b.addEventListener("click", () => { activeCat = b.dataset.cat; syncChips(); render(); })
  );

  // preselección por ?cat= (desde la landing)
  const urlCat = new URLSearchParams(location.search).get("cat");
  if (urlCat && cats.includes(urlCat)) { activeCat = urlCat; syncChips(); }

  if (search) search.addEventListener("input", render);

  render();
  updateCart();
})();

function syncChips(){
  chipsBox.querySelectorAll(".chip").forEach(b =>
    b.classList.toggle("active", b.dataset.cat === activeCat)
  );
}

/* ---------- RENDER GRID ---------- */
function render(){
  const q = (search?.value || "").trim().toLowerCase();
  const list = ALL.filter(p =>
    (activeCat === "Todos" || p.cat === activeCat) &&
    (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
  );

  emptyMsg.hidden = list.length > 0;

  grid.innerHTML = list.map(p => {
    const qty = cart[p.id] || 0;
    return `
    <article class="card fu vis" data-id="${p.id}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <span class="card-cat">${p.cat}</span>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="card-desc">${p.desc || ""}</p>
        <div class="card-price"><strong>${fmt(p.price)}</strong><span>${p.unit}</span></div>
        ${qty
          ? `<div class="stepper" data-id="${p.id}">
               <button class="st-less" aria-label="Quitar uno">−</button>
               <span class="st-qty">${qty}</span>
               <button class="st-more" aria-label="Agregar uno">+</button>
             </div>`
          : `<button class="add" data-id="${p.id}">Agregar al pedido</button>`}
      </div>
    </article>`;
  }).join("");

  grid.querySelectorAll(".add").forEach(b =>
    b.addEventListener("click", () => { setQty(b.dataset.id, 1); }));
  grid.querySelectorAll(".stepper").forEach(s => {
    const id = s.dataset.id;
    s.querySelector(".st-more").addEventListener("click", () => setQty(id, (cart[id]||0)+1));
    s.querySelector(".st-less").addEventListener("click", () => setQty(id, (cart[id]||0)-1));
  });
}

/* ---------- CART ---------- */
function setQty(id, qty){
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  localStorage.setItem("falcon_cart", JSON.stringify(cart));
  render();
  updateCart();
}

function cartItems(){
  return Object.keys(cart).map(id => {
    const p = ALL.find(x => x.id === id);
    return p ? { ...p, qty: cart[id] } : null;
  }).filter(Boolean);
}

function updateCart(){
  const items = cartItems();
  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);

  const bar   = document.getElementById("cartbar");
  const cCount= document.getElementById("cartCount");
  const cTotal= document.getElementById("cartTotal");
  const list  = document.getElementById("cartList");
  const navBadge = document.getElementById("navBadge");
  const floatWa  = document.querySelector(".float-wa");

  if (cCount) cCount.textContent = count;
  if (cTotal) cTotal.textContent = fmt(total);
  const cTotal2 = document.getElementById("cartTotal2");
  if (cTotal2) cTotal2.textContent = fmt(total);
  if (bar) bar.classList.toggle("show", count > 0);
  if (floatWa) floatWa.classList.toggle("lifted", count > 0);
  if (navBadge){ navBadge.textContent = count; navBadge.hidden = count === 0; }

  if (list) {
    list.innerHTML = items.length ? items.map(i => `
      <li>
        <img src="${i.img}" alt="" />
        <div class="ci-info"><strong>${i.name}</strong><span>${fmt(i.price)} ${i.unit}</span></div>
        <div class="stepper sm" data-id="${i.id}">
          <button class="st-less">−</button><span class="st-qty">${i.qty}</span><button class="st-more">+</button>
        </div>
      </li>`).join("") : `<li class="ci-empty">Todavía no agregaste productos.</li>`;
    list.querySelectorAll(".stepper").forEach(s => {
      const id = s.dataset.id;
      s.querySelector(".st-more").addEventListener("click", () => setQty(id, (cart[id]||0)+1));
      s.querySelector(".st-less").addEventListener("click", () => setQty(id, (cart[id]||0)-1));
    });
  }
}

/* ---------- WHATSAPP ORDER ---------- */
function sendOrder(){
  const items = cartItems();
  if (!items.length) return;
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);
  let msg = "Hola Falcón Ferretería, quiero hacer un *pedido por mayor*:\n\n";
  items.forEach(i => { msg += `• ${i.name} — ${i.qty} ${i.unit}\n`; });
  msg += `\nSubtotal estimado: ${fmt(total)}\n(Aguardo confirmación de precios y stock)`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

/* ---------- DRAWER toggle ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const open  = document.getElementById("cartOpen");
  const close = document.getElementById("cartClose");
  const drawer= document.getElementById("drawer");
  const back  = document.getElementById("drawerBack");
  const toggle = (v) => { drawer.classList.toggle("open", v); back.classList.toggle("show", v); document.body.style.overflow = v ? "hidden" : ""; };
  document.querySelectorAll(".js-open-cart").forEach(b => b.addEventListener("click", e => { e.preventDefault(); toggle(true); }));
  if (open)  open.addEventListener("click", () => toggle(true));
  if (close) close.addEventListener("click", () => toggle(false));
  if (back)  back.addEventListener("click", () => toggle(false));
  document.querySelectorAll(".js-send").forEach(b => b.addEventListener("click", sendOrder));
});
