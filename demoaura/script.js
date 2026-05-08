/* ===== PRODUCTS DATA ===== */
const WA_NUMBER = '5491133840419';

function waLink(productName) {
  const msg = encodeURIComponent(
    `Hola! Estoy interesado/a en el producto ${productName}. ¿Podrías darme más información, precio y disponibilidad?`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

const products = [
  {
    img: 'images/perfumarab.png',
    fallbackIcon: 'fa-spray-can',
    name: 'Perfumes Árabes Premium',
    category: 'Perfumes',
    badge: 'Más vendido',
    desc: 'Fragancias orientales de larga duración. Aromas únicos y exóticos que perduran durante todo el día.',
    specs: ['Contenido: 100ml', 'Duración: 8-12 horas', 'Origen: Medio Oriente', 'Sin alcohol']
  },
  {
    img: 'https://ladelfina.uy/wp-content/uploads/2025/05/Perfume-GD-Amakha-paris-15ml.png',
    fallbackIcon: 'fa-spray-can',
    name: 'Amakha Paris Collection',
    category: 'Perfumes',
    badge: 'Premium',
    desc: 'Fragancias importadas de la reconocida marca Amakha Paris. Elegancia francesa en un frasco compacto.',
    specs: ['Contenido: 15ml', 'Duración: 6-8 horas', 'Origen: Brasil', 'Ideal para llevar']
  },
  {
    img: 'https://www.karseell.com/wp-content/uploads/2024/08/%E8%AF%A6%E6%83%85%E9%A1%B5-21-768x768.png',
    fallbackIcon: 'fa-scissors',
    name: 'Crema Karseell Capilar',
    category: 'Cuidado Capilar',
    badge: 'Novedad',
    desc: 'Tratamiento intensivo para cabello. Hidratación profunda, brillo y suavidad desde la primera aplicación.',
    specs: ['Tipo: Crema capilar', 'Para todo tipo de cabello', 'Sin sal', 'Formula profesional']
  },
  {
    img: 'https://images.pexels.com/photos/3738339/pexels-photo-3738339.jpeg?auto=compress&cs=tinysrgb&w=600',
    fallbackIcon: 'fa-scissors',
    name: 'Tratamientos Capilares',
    category: 'Cuidado Capilar',
    badge: null,
    desc: 'Línea completa de productos capilares para nutrición, hidratación y reparación de todo tipo de cabello.',
    specs: ['Variedad de productos', 'Fórmulas sin parabenos', 'Resultados visibles', 'Uso profesional y domiciliario']
  },
  {
    img: 'https://afaar.vtexassets.com/arquivos/ids/158644-800-auto?v=638979860679030000&width=800&height=auto&aspect=true',
    fallbackIcon: 'fa-futbol',
    name: 'Camiseta Argentina 2026',
    category: 'Moda',
    badge: '¡Nueva!',
    desc: 'Camiseta oficial de la Selección Argentina para la temporada 2026. Viví la pasión del fútbol con estilo.',
    specs: ['Temporada: 2026', 'Talles: XS al XXL', 'Material: Dry-fit', 'Diseño oficial']
  },
  {
    img: 'images/importbrasil.jpg',
    fallbackIcon: 'fa-spray-can',
    name: 'Perfumes Importados Brasil',
    category: 'Perfumes',
    badge: 'Importado',
    desc: 'Exclusiva selección de fragancias importadas directamente desde Brasil. Aromas tropicales y modernos.',
    specs: ['Origen: Brasil', 'Variedad de aromas', 'Alta concentración', 'Presentaciones múltiples']
  }
];


/* ===== RENDER PRODUCT CARDS ===== */
function renderProducts() {
  const wrapper = document.getElementById('productosWrapper');
  if (!wrapper) return;

  products.forEach((product, i) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.style.cssText = 'height:auto;';

    slide.innerHTML = `
      <div class="product-card" data-index="${i}" role="button" tabindex="0" aria-label="Ver detalle de ${product.name}">
        <div class="product-img-wrap">
          <img class="product-img" src="${product.img}" alt="${product.name}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.nextElementSibling.style.display='flex';" />
          <div class="product-img-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:56px;color:#c9a96e;">
            <i class="fas ${product.fallbackIcon}"></i>
          </div>
          <div class="product-img-glow"></div>
          <div class="product-category">${product.category}</div>
          ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-footer">
            <a
              class="product-wa-btn"
              href="${waLink(product.name)}"
              target="_blank"
              rel="noreferrer"
              onclick="event.stopPropagation()"
            >
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(slide);

    slide.querySelector('.product-card').addEventListener('click', () => openModal(i));
    slide.querySelector('.product-card').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openModal(i);
    });
  });
}


/* ===== SWIPER ===== */
function initSwiper() {
  const swiper = new Swiper('.swiper-productos', {
    slidesPerView: 1.1,
    spaceBetween: 20,
    centeredSlides: false,
    autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '#swiperNext',
      prevEl: '#swiperPrev',
    },
    breakpoints: {
      480:  { slidesPerView: 1.4, spaceBetween: 20 },
      640:  { slidesPerView: 2.1, spaceBetween: 22 },
      900:  { slidesPerView: 3,   spaceBetween: 24 },
      1200: { slidesPerView: 3.5, spaceBetween: 24 },
    },
    grabCursor: true,
  });
  return swiper;
}


/* ===== MODAL ===== */
function openModal(index) {
  const product = products[index];
  const overlay = document.getElementById('modalOverlay');

  const modalImgSide = document.getElementById('modalEmoji');
  modalImgSide.innerHTML = `<img src="${product.img}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" loading="lazy" />`;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalDesc').textContent = product.desc;

  const specsList = document.getElementById('modalSpecs');
  specsList.innerHTML = '';
  product.specs.forEach(spec => {
    const li = document.createElement('li');
    li.textContent = spec;
    specsList.appendChild(li);
  });

  const waBtn = document.getElementById('modalWaBtn');
  waBtn.onclick = () => window.open(waLink(product.name), '_blank', 'noreferrer');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}


/* ===== NAVBAR SCROLL ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ===== HAMBURGER ===== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}


/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}


/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
  });
}


/* ===== CATEGORY CARDS CLICK ===== */
function initCategoryCards() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      const msg = encodeURIComponent(
        `Hola! Estoy interesado/a en la categoría de ${cat}. ¿Podrías darme más información sobre los productos disponibles?`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noreferrer');
    });
  });
}


/* ===== PARALLAX (subtle) ===== */
function initParallax() {
  const heroGrid = document.querySelector('.hero-grid');
  if (!heroGrid) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGrid.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}


/* ===== NUMBER COUNTER ANIMATION ===== */
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
}


/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initSwiper();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCategoryCards();
  initParallax();
  animateCounters();

  // Modal close handlers
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Hero card rotation — cycle through products with real images
  const heroImgEl = document.getElementById('heroCardImg');
  const heroTitle = document.querySelector('.hero-product-info h3');
  const heroSub   = document.querySelector('.hero-product-info p');
  if (heroImgEl && heroTitle && heroSub) {
    const showcaseProducts = [
      { img: 'images/perfumarab.png',  name: 'Perfume Árabe Premium',   sub: 'Fragancias exclusivas 100ml' },
      { img: 'https://ladelfina.uy/wp-content/uploads/2025/05/Perfume-GD-Amakha-paris-15ml.png', name: 'Amakha Paris Collection',  sub: 'Collection 15ml' },
      { img: 'https://afaar.vtexassets.com/arquivos/ids/158644-800-auto?v=638979860679030000&width=800&height=auto&aspect=true', name: 'Camiseta Argentina 2026',  sub: 'Edición especial' },
      { img: 'https://www.karseell.com/wp-content/uploads/2024/08/%E8%AF%A6%E6%83%85%E9%A1%B5-21-768x768.png', name: 'Cremas Karseell',          sub: 'Cuidado capilar premium' },
    ];
    let idx = 0;
    heroTitle.style.transition = 'opacity 0.35s ease';
    heroSub.style.transition   = 'opacity 0.35s ease';
    heroImgEl.style.transition = 'opacity 0.35s ease';
    setInterval(() => {
      idx = (idx + 1) % showcaseProducts.length;
      heroImgEl.style.opacity = '0';
      heroTitle.style.opacity = '0';
      heroSub.style.opacity   = '0';
      setTimeout(() => {
        heroImgEl.src         = showcaseProducts[idx].img;
        heroTitle.textContent = showcaseProducts[idx].name;
        heroSub.textContent   = showcaseProducts[idx].sub;
        heroImgEl.style.opacity = '1';
        heroTitle.style.opacity = '1';
        heroSub.style.opacity   = '1';
      }, 350);
    }, 3000);
  }
});
