// ===== Product Data =====
const products = {
    1: {
        name: "Culotte Tiro Alto de Lycra",
        image: "images/product-1.jpg",
        description: "Nuestro culotte más vendido. Diseñado con lycra premium que se adapta perfectamente a tu cuerpo, brindando comodidad y suavidad durante todo el día. El tiro alto estiliza la figura y ofrece mayor cobertura.",
        sizes: "4 - 6 - 8 - 10",
        material: "Lycra premium con elastano, sin costuras visibles",
        colors: [
            { name: "Negro", hex: "#1a1a1a" },
            { name: "Fucsia", hex: "#e91e8c" },
            { name: "Azul", hex: "#1e3a5f" }
        ]
    },
    2: {
        name: "Culotte Premium Fucsia",
        image: "images/product-2.jpg",
        description: "Elegancia y comodidad en un diseño vibrante. Este culotte fucsia es perfecto para quienes buscan un toque de color sin sacrificar la calidad. Confeccionado con materiales de primera.",
        sizes: "4 - 6 - 8 - 10",
        material: "Lycra suave con refuerzo de algodón",
        colors: [
            { name: "Fucsia", hex: "#e91e8c" },
            { name: "Rosa", hex: "#ff69b4" },
            { name: "Negro", hex: "#1a1a1a" }
        ]
    },
    3: {
        name: "Conjunto con Detalles de Encaje",
        image: "images/product-3.jpg",
        description: "Un conjunto que combina feminidad y elegancia. Los detalles de encaje añaden un toque sofisticado mientras la base de lycra garantiza comodidad. Ideal para ocasiones especiales o para sentirte especial cada día.",
        sizes: "4 - 6 - 8 - 10",
        material: "Lycra con detalles de encaje francés",
        colors: [
            { name: "Azul", hex: "#1e3a5f" },
            { name: "Negro", hex: "#1a1a1a" },
            { name: "Bordo", hex: "#8b0000" }
        ]
    },
    4: {
        name: "Corpiño de Algodón Confort",
        image: "images/product-4.jpg",
        description: "El corpiño que necesitás para el día a día. Confeccionado 100% en algodón de primera calidad, ofrece soporte suave y transpirabilidad excepcional. Breteles anchos para mayor comodidad.",
        sizes: "90 - 95 - 100 - 105 - 110",
        material: "Algodón 100% con breteles regulables",
        colors: [
            { name: "Blanco", hex: "#ffffff" },
            { name: "Nude", hex: "#f5e6e0" },
            { name: "Negro", hex: "#1a1a1a" }
        ]
    },
    5: {
        name: "Body Modelador Sin Costuras",
        image: "images/product-5.jpg",
        description: "Silueta perfecta con máxima comodidad. Este body modelador sin costuras se adapta a tu cuerpo como una segunda piel, ofreciendo soporte suave sin marcar. Perfecto bajo cualquier prenda.",
        sizes: "4 - 6 - 8 - 10",
        material: "Microfibra modeladora sin costuras",
        colors: [
            { name: "Negro", hex: "#1a1a1a" },
            { name: "Nude", hex: "#f5e6e0" }
        ]
    },
    6: {
        name: "Pijama de Satén Rosa",
        image: "images/product-6.jpg",
        description: "Noches elegantes y confortables con nuestro pijama de satén. Incluye short y musculosa con detalles de encaje. El satén de alta calidad te hará sentir especial cada noche.",
        sizes: "4 - 6 - 8 - 10",
        material: "Satén de seda con detalles de encaje",
        colors: [
            { name: "Rosa", hex: "#ffb6c1" },
            { name: "Fucsia", hex: "#e91e8c" },
            { name: "Negro", hex: "#1a1a1a" }
        ]
    }
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const carousel = document.getElementById('carousel');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Carousel Navigation =====
const scrollAmount = 324;

carouselPrev.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

carouselNext.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// ===== Product Modal =====
function openModal(productId) {
    const product = products[productId];
    if (!product) return;
    
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalSizes').textContent = product.sizes;
    document.getElementById('modalMaterial').textContent = product.material;
    
    const colorsContainer = document.getElementById('modalColors');
    colorsContainer.innerHTML = product.colors.map(color => 
        `<span class="color-dot" style="background: ${color.hex}; border: 2px solid ${color.hex === '#ffffff' ? '#ddd' : color.hex}" title="${color.name}"></span>`
    ).join('');
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Product card clicks
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-consultar')) {
            openModal(card.dataset.product);
        }
    });
});

// Consultar button clicks
document.querySelectorAll('.btn-consultar').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        openModal(card.dataset.product);
    });
});

// Grid item clicks
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
        openModal(item.dataset.product);
    });
});

// Close modal
modalClose.addEventListener('click', closeModal);

document.querySelector('.modal-overlay').addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const consulta = document.getElementById('consulta').value;
    
    const message = encodeURIComponent(
        `¡Hola! Mi nombre es ${nombre}.\n\nTeléfono: ${telefono}\n\nConsulta: ${consulta}`
    );
    
    window.open(`https://wa.me/5491158169267?text=${message}`, '_blank');
    
    contactForm.reset();
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Fade In Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to sections
document.querySelectorAll('.section-header, .product-card, .value-card, .testimonial-card, .gallery-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Preload Images =====
function preloadImages() {
    Object.values(products).forEach(product => {
        const img = new Image();
        img.src = product.image;
    });
}

window.addEventListener('load', preloadImages);

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
