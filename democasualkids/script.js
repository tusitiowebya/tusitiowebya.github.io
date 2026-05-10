// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Conjuntos Infantiles",
        description: "Sets completos y combinados para niños y niñas. Prendas cómodas y con diseños únicos que encantarán a tus pequeños. Ideales para el día a día o ocasiones especiales.",
        image: "images/product-1.jpg",
        badge: "Nuevo",
        sizes: ["2", "4", "6", "8", "10", "12"],
        colors: ["#FFB6C1", "#87CEEB", "#98FB98", "#DDA0DD"],
        stock: "En stock - Disponible para envío inmediato"
    },
    {
        id: 2,
        name: "Remeras Estampadas",
        description: "Remeras con diseños divertidos y coloridos. Algodón suave y de alta calidad para la comodidad de los más pequeños. Estampados únicos que les encantarán.",
        image: "images/product-2.jpg",
        badge: "Más vendido",
        sizes: ["2", "4", "6", "8", "10"],
        colors: ["#87CEEB", "#FFD54F", "#FF6B6B", "#98FB98"],
        stock: "En stock - Últimas unidades disponibles"
    },
    {
        id: 3,
        name: "Ropa de Personajes",
        description: "Prendas con los personajes favoritos de los niños. Diseños licenciados y de alta calidad. La opción perfecta para los pequeños fanáticos.",
        image: "images/product-3.jpg",
        badge: "Nuevo",
        sizes: ["2", "4", "6", "8"],
        colors: ["#FFB6C1", "#87CEEB", "#FFD54F"],
        stock: "En stock - Disponible para envío"
    },
    {
        id: 4,
        name: "Accesorios para Niñas",
        description: "Vinchas, moños, hebillas y más. Accesorios adorables para complementar cualquier look. Materiales seguros y cómodos para las más pequeñas.",
        image: "images/product-4.jpg",
        badge: "Disponible",
        sizes: ["Único"],
        colors: ["#FFB6C1", "#DDA0DD", "#FFD54F", "#87CEEB", "#FF6B6B"],
        stock: "En stock - Gran variedad disponible"
    },
    {
        id: 5,
        name: "Prendas Juveniles",
        description: "Moda actual y cómoda para los más grandes. Estilo moderno que combina tendencias con comodidad. Perfectas para preadolescentes con personalidad.",
        image: "images/product-5.jpg",
        badge: "Más vendido",
        sizes: ["8", "10", "12", "14", "16"],
        colors: ["#2D3748", "#87CEEB", "#98FB98", "#FFB6C1"],
        stock: "En stock - Disponible en todos los talles"
    },
    {
        id: 6,
        name: "Silloncitos Infantiles",
        description: "Mobiliario especial para el cuarto de los más pequeños. Sillones cómodos y seguros con diseños adorables. El complemento perfecto para su espacio.",
        image: "images/product-6.jpg",
        badge: "Destacado",
        sizes: ["Pequeño", "Mediano"],
        colors: ["#FFB6C1", "#87CEEB", "#98FB98", "#DDA0DD"],
        stock: "En stock - Consultar disponibilidad de colores"
    }
];

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const modal = document.getElementById('productModal');
const contactForm = document.getElementById('contactForm');

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== Carousel Functionality =====
let currentSlide = 0;
const cardWidth = 305; // card width + gap
const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
const totalCards = carousel.children.length;
const maxSlide = Math.max(0, totalCards - visibleCards);

// Create dots
function createDots() {
    carouselDots.innerHTML = '';
    const dotsCount = maxSlide + 1;
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

function updateDots() {
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = Math.min(Math.max(0, index), maxSlide);
    carousel.scrollTo({
        left: currentSlide * cardWidth,
        behavior: 'smooth'
    });
    updateDots();
}

prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

// Initialize carousel
createDots();

// Update carousel on resize
window.addEventListener('resize', () => {
    createDots();
});

// ===== Modal Functionality =====
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update modal content
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalBadge').textContent = product.badge;
    document.getElementById('modalStock').textContent = product.stock;

    // Update sizes
    const sizesContainer = document.getElementById('modalSizes');
    sizesContainer.innerHTML = product.sizes.map((size, index) => 
        `<button class="size-btn ${index === 0 ? 'active' : ''}">${size}</button>`
    ).join('');

    // Add click handlers to size buttons
    sizesContainer.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sizesContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Update colors
    const colorsContainer = document.getElementById('modalColors');
    colorsContainer.innerHTML = product.colors.map((color, index) => 
        `<button class="color-btn ${index === 0 ? 'active' : ''}" style="background-color: ${color};" aria-label="Color ${index + 1}"></button>`
    ).join('');

    // Add click handlers to color buttons
    colorsContainer.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            colorsContainer.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Update WhatsApp link
    const whatsappMessage = encodeURIComponent(`Hola! Quiero consultar por: ${product.name} de CasualKids`);
    document.getElementById('modalWhatsApp').href = `https://wa.me/5493773544610?text=${whatsappMessage}`;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const consulta = document.getElementById('consulta').value;
    
    // Create WhatsApp message
    const message = encodeURIComponent(
        `Hola! Soy ${nombre}.\n\nMi consulta es: ${consulta}\n\nMi teléfono: ${telefono}`
    );
    
    // Open WhatsApp
    window.open(`https://wa.me/5493773544610?text=${message}`, '_blank');
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    showNotification('¡Gracias por tu consulta! Te redirigimos a WhatsApp.');
});

// ===== Notification System =====
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>✓</span>
        <p>${message}</p>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, #25D366, #128C7E);
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 25px rgba(37, 211, 102, 0.4);
        z-index: 1001;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3.5 seconds
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes
document.querySelectorAll('.product-card, .featured-card, .why-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animation class
const animateStyle = document.createElement('style');
animateStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animateStyle);

// ===== Newsletter Form =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.');
        newsletterForm.reset();
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero .badge, .hero h1, .hero-text > p, .hero-buttons, .hero-stats').forEach((el, index) => {
            el.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
            el.style.opacity = '0';
        });
    }, 100);
});

// Add fadeInUp animation
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);
