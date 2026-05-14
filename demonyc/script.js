// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const modal = document.getElementById('productModal');
const contactForm = document.getElementById('contactForm');

// ===== Product Data =====
const products = {
    remera: {
        name: 'Remera Deportiva',
        image: 'public/images/product-tshirt.jpg',
        description: 'Remera deportiva de alta calidad, confeccionada con tela transpirable que mantiene tu cuerpo fresco durante el ejercicio. Diseño moderno y corte cómodo para máximo rendimiento.',
        sizes: 'S - M - L - XL',
        colors: ['#000', '#dc2626', '#fff'],
        stock: 'En stock',
        badge: 'Disponible'
    },
    shorts: {
        name: 'Shorts Deportivos',
        image: 'public/images/product-shorts.jpg',
        description: 'Shorts deportivos livianos con cintura elástica y bolsillos laterales. Perfectos para entrenamientos intensos o uso casual. Secado rápido.',
        sizes: 'S - M - L - XL',
        colors: ['#000', '#1a1a1a', '#404040'],
        stock: 'En stock',
        badge: 'Disponible'
    },
    conjunto: {
        name: 'Conjunto Deportivo',
        image: 'public/images/product-conjunto.jpg',
        description: 'Conjunto completo de buzo y pantalón jogger. Ideal para entrenar o salir con estilo. Tela suave y abrigada con terminaciones premium.',
        sizes: 'S - M - L - XL - XXL',
        colors: ['#000', '#dc2626', '#262626'],
        stock: 'En stock',
        badge: 'Hot'
    },
    campera: {
        name: 'Campera Deportiva',
        image: 'public/images/product-campera.jpg',
        description: 'Campera deportiva con cierre y capucha. Diseño urbano perfecto para el día a día. Bolsillos con cierre y puños ajustables.',
        sizes: 'M - L - XL - XXL',
        colors: ['#000', '#dc2626', '#1a1a1a'],
        stock: 'En stock',
        badge: 'Disponible'
    },
    pantalon: {
        name: 'Pantalón Jogger',
        image: 'public/images/product-pantalon.jpg',
        description: 'Pantalón jogger con corte moderno y ajuste cómodo. Cintura elástica con cordón y puños en los tobillos. Ideal para cualquier ocasión.',
        sizes: 'S - M - L - XL',
        colors: ['#000', '#404040', '#dc2626'],
        stock: 'En stock',
        badge: 'Nuevo'
    },
    kids: {
        name: 'Conjunto Niños',
        image: 'public/images/product-kids-set.jpg',
        description: 'Conjunto deportivo para niños, cómodo y resistente. Diseñado para aguantar el ritmo de los más pequeños. Colores vibrantes y divertidos.',
        sizes: '4 - 6 - 8 - 10 - 12',
        colors: ['#dc2626', '#000', '#3b82f6'],
        stock: 'En stock',
        badge: 'Disponible'
    }
};

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
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('[data-reveal]');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Product Modal Functions =====
function openModal(productId) {
    const product = products[productId];
    if (!product) return;
    
    // Update modal content
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalSizes').textContent = product.sizes;
    document.getElementById('modalStock').textContent = product.stock;
    document.getElementById('modalBadge').textContent = product.badge;
    
    // Update colors
    const colorsContainer = document.getElementById('modalColors');
    colorsContainer.innerHTML = product.colors.map(color => 
        `<span class="color-dot" style="background: ${color}${color === '#fff' ? '; border: 1px solid #ccc' : ''}"></span>`
    ).join('');
    
    // Update WhatsApp link
    const whatsappMessage = encodeURIComponent(`Hola! Quiero consultar por ${product.name} de nyc_indumentaria`);
    document.getElementById('modalWhatsapp').href = `https://wa.me/5493364370670?text=${whatsappMessage}`;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Contact Form Handler =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const nombre = formData.get('nombre');
    const telefono = formData.get('telefono');
    const categoria = formData.get('categoria');
    const consulta = formData.get('consulta');
    
    // Create WhatsApp message
    const message = `Hola! Soy ${nombre}
📱 Tel: ${telefono}
📦 Categoría: ${categoria}
💬 Consulta: ${consulta}`;
    
    const whatsappUrl = `https://wa.me/5493364370670?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success feedback
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '¡Enviado!';
    btn.style.background = '#25d366';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 3000);
});

// ===== Parallax Effect for Hero =====
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg img');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
        }
    }
});

// ===== Category Cards Tilt Effect =====
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Lazy Loading Images =====
const lazyImages = document.querySelectorAll('img[data-src]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== Stats Counter Animation =====
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    
    const heroSection = document.querySelector('.hero');
    const heroRect = heroSection.getBoundingClientRect();
    
    if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
        statsAnimated = true;
        
        stats.forEach(stat => {
            const target = stat.textContent;
            const isNumber = !isNaN(parseInt(target));
            
            if (isNumber) {
                const finalNumber = parseInt(target);
                let current = 0;
                const increment = finalNumber / 50;
                const suffix = target.includes('+') ? '+' : '';
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        stat.textContent = finalNumber + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            }
        });
    }
};

window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

// ===== Add Dynamic Year to Footer =====
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== Console Easter Egg =====
console.log('%c NYC INDUMENTARIA ', 'background: #dc2626; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Desarrollado con ❤️ para San Nicolás', 'color: #737373; font-size: 12px;');
