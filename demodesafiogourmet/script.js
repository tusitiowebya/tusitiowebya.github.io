// ===== Data =====
const categories = [
  {
    name: "Vinos",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
    description: "Seleccion de los mejores vinedos",
  },
  {
    name: "Aceite de Oliva",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2070&auto=format&fit=crop",
    description: "Extra virgen de primera prensa",
  },
  {
    name: "Salames",
    image: "https://images.unsplash.com/photo-1626201850129-a96c04b3e5b4?q=80&w=2070&auto=format&fit=crop",
    description: "Artesanales de Cordoba",
  },
  {
    name: "Quesos",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop",
    description: "Variedad de quesos gourmet",
  },
  {
    name: "Jamones",
    image: "https://images.unsplash.com/photo-1590846083693-f23fdede3a7e?q=80&w=1887&auto=format&fit=crop",
    description: "Curados artesanalmente",
  },
  {
    name: "Yerba Mate",
    image: "https://images.unsplash.com/photo-1576686489885-c9b09a4f4954?q=80&w=1887&auto=format&fit=crop",
    description: "Blend premium seleccionado",
  },
  {
    name: "Pasta de Aceitunas",
    image: "https://images.unsplash.com/photo-1593871075120-982e042088d8?q=80&w=2071&auto=format&fit=crop",
    description: "Elaboracion artesanal",
  },
  {
    name: "Aceitunas",
    image: "https://images.unsplash.com/photo-1563412885-139e4045b8c4?q=80&w=1887&auto=format&fit=crop",
    description: "Variedad selecta",
  },
  {
    name: "Embutidos",
    image: "https://images.unsplash.com/photo-1600688640154-9619e002df30?q=80&w=2074&auto=format&fit=crop",
    description: "Tradicionales argentinos",
  },
  {
    name: "Bondiola",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    description: "Curada y ahumada",
  },
];

const products = [
  {
    id: 1,
    name: "Malbec Reserve 2020",
    price: 12500,
    image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?q=80&w=1887&auto=format&fit=crop",
    category: "Vinos",
  },
  {
    id: 2,
    name: "Aceite de Oliva Extra Virgen 500ml",
    price: 8900,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2070&auto=format&fit=crop",
    category: "Aceite de Oliva",
  },
  {
    id: 3,
    name: "Salame de Tandil 300g",
    price: 6500,
    image: "https://images.unsplash.com/photo-1626201850129-a96c04b3e5b4?q=80&w=2070&auto=format&fit=crop",
    category: "Salames",
  },
  {
    id: 4,
    name: "Queso Provolone Ahumado 400g",
    price: 5800,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=2069&auto=format&fit=crop",
    category: "Quesos",
  },
  {
    id: 5,
    name: "Jamon Crudo Serrano 200g",
    price: 9200,
    image: "https://images.unsplash.com/photo-1590846083693-f23fdede3a7e?q=80&w=1887&auto=format&fit=crop",
    category: "Jamones",
  },
  {
    id: 6,
    name: "Yerba Mate Premium 1kg",
    price: 4500,
    image: "https://images.unsplash.com/photo-1576686489885-c9b09a4f4954?q=80&w=1887&auto=format&fit=crop",
    category: "Yerba Mate",
  },
  {
    id: 7,
    name: "Pasta de Aceitunas Negras 200g",
    price: 3200,
    image: "https://images.unsplash.com/photo-1593871075120-982e042088d8?q=80&w=2071&auto=format&fit=crop",
    category: "Pasta de Aceitunas",
  },
  {
    id: 8,
    name: "Aceitunas Verdes Rellenas 350g",
    price: 2800,
    image: "https://images.unsplash.com/photo-1563412885-139e4045b8c4?q=80&w=1887&auto=format&fit=crop",
    category: "Aceitunas",
  },
  {
    id: 9,
    name: "Chorizo Seco Artesanal 250g",
    price: 4800,
    image: "https://images.unsplash.com/photo-1600688640154-9619e002df30?q=80&w=2074&auto=format&fit=crop",
    category: "Embutidos",
  },
  {
    id: 10,
    name: "Bondiola Curada 350g",
    price: 7800,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    category: "Bondiola",
  },
  {
    id: 11,
    name: "Cabernet Sauvignon Gran Reserva",
    price: 18500,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
    category: "Vinos",
  },
  {
    id: 12,
    name: "Queso Azul Gorgonzola 300g",
    price: 6200,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2073&auto=format&fit=crop",
    category: "Quesos",
  },
];

// ===== Cart State =====
let cart = [];

// ===== DOM Elements =====
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const menuIcon = menuToggle.querySelector('.menu-icon');
const closeIcon = menuToggle.querySelector('.close-icon');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartContent = document.getElementById('cart-content');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const categoriesGrid = document.getElementById('categories-grid');
const productsGrid = document.getElementById('products-grid');
const footerYear = document.getElementById('footer-year');

// ===== Utility Functions =====
function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
  const isOpen = !mobileNav.classList.contains('hidden');
  
  if (isOpen) {
    mobileNav.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  } else {
    mobileNav.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  }
});

// Close mobile menu when clicking a link
mobileNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

// ===== Cart Functions =====
function openCart() {
  cartOverlay.classList.remove('hidden');
  cartSidebar.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.add('hidden');
  cartSidebar.classList.add('hidden');
  document.body.style.overflow = '';
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
    }
  }
}

function updateCart() {
  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart content
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
        </div>
        <p>Tu carrito esta vacio</p>
        <span>Agrega productos para comenzar tu pedido</span>
      </div>
    `;
    cartFooter.classList.add('hidden');
  } else {
    cartContent.innerHTML = `
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <h3 class="cart-item-name">${item.name}</h3>
              <p class="cart-item-price">${formatPrice(item.price)}</p>
              <div class="cart-item-controls">
                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Disminuir cantidad">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="cart-item-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Aumentar cantidad">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                  </svg>
                </button>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Eliminar producto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatPrice(total);
    cartFooter.classList.remove('hidden');
  }
}

function sendWhatsAppOrder() {
  if (cart.length === 0) return;
  
  let message = 'Hola, quiero hacer un pedido desde la web UnDesafioGourmet:%0A%0A';
  
  cart.forEach(item => {
    message += `- ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}%0A`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `%0ATotal: ${formatPrice(total)}`;
  
  window.open(`https://wa.me/5491164108146?text=${message}`, '_blank', 'noopener,noreferrer');
}

// Cart event listeners
cartButton.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', sendWhatsAppOrder);

// ===== Render Categories =====
function renderCategories() {
  categoriesGrid.innerHTML = categories.map(category => `
    <a href="#productos" class="category-card">
      <img src="${category.image}" alt="${category.name}">
      <div class="category-content">
        <h3 class="category-name">${category.name}</h3>
        <p class="category-description">${category.description}</p>
        <span class="category-link">
          Ver productos
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </span>
      </div>
    </a>
  `).join('');
}

// ===== Render Products =====
function renderProducts() {
  productsGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-category">${product.category}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-footer">
          <p class="product-price">${formatPrice(product.price)}</p>
          <button class="btn-add" onclick='addToCart(${JSON.stringify(product)})' aria-label="Agregar ${product.name} al carrito">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ===== Footer Year =====
function updateFooterYear() {
  const year = new Date().getFullYear();
  footerYear.textContent = `© ${year} UnDesafioGourmet. Todos los derechos reservados.`;
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCart();
  updateFooterYear();
});
