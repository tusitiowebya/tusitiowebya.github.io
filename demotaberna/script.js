// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuGrid = document.getElementById('menuGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-nav.prev');
const lightboxNext = lightbox.querySelector('.lightbox-nav.next');

// Menu Modal Elements
const menuModal = document.getElementById('menuModal');
const modalMenuGrid = document.getElementById('modalMenuGrid');
const openMenuModalBtn = document.getElementById('openMenuModal');
const closeMenuModalBtn = document.getElementById('closeMenuModal');

// ===== WhatsApp Number (CAMBIAR ESTE NUMERO) =====
const WHATSAPP_NUMBER = '542616123098'; // Cambiar por el numero real

// ===== Gallery Images =====
const galleryImages = [
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nFftPbPCL3dTIE45M6cSoZHegeHFrK.png',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xtaQ3zH2NXJYNTVOHkzafHLKl6DmM4.png',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GryueYIAFEkIUFKtph1FXxcpmWfsmX.png',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-M4gWQqUcV3LHJJMXaV59VZUSxcfjUs.png'
];
let currentImageIndex = 0;

// ===== Menu Data Storage =====
let allProducts = [];

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Fetch Menu Data =====
const API_URL = 'https://newback.quierolacarta.com/v1/locals/261/categories/2137';
const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url='
];

async function fetchMenu() {
    // Try direct fetch first
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            processMenuData(data);
            return;
        }
    } catch (e) {
        // CORS error, try proxies
    }
    
    // Try CORS proxies
    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetch(proxy + encodeURIComponent(API_URL));
            if (response.ok) {
                const data = await response.json();
                processMenuData(data);
                return;
            }
        } catch (e) {
            continue;
        }
    }
    
    // All methods failed
    console.error('Error fetching menu: CORS blocked and proxies failed');
    showErrorState();
}

function processMenuData(data) {
    allProducts = [];
    
    // Products are at root level in the API response (data.products)
    const products = data.products || [];
    
    // Process all products
    products.forEach(product => {
        const attrs = product.attributes || {};
        // Construir URL de imagen correctamente (S3 Amazon)
        let imageUrl = null;
        if (attrs.image) {
            imageUrl = `https://quierolacarta.s3-sa-east-1.amazonaws.com/${attrs.image}`;
        }
        
        allProducts.push({
            id: product.id,
            name: attrs.name || 'Sin nombre',
            description: attrs.description || '',
            price: attrs.price || 0,
            image: imageUrl,
            enabled: attrs.enabled !== false,
            order: attrs.order || 0
        });
    });
    
    // Sort products by order
    allProducts.sort((a, b) => a.order - b.order);
    
    // Render only 4 featured products in the main section
    renderFeaturedProducts(allProducts.slice(0, 4));
    
    // Prepare full menu for modal
    renderModalProducts(allProducts);
}

function renderFeaturedProducts(products) {
    if (products.length === 0) {
        menuGrid.innerHTML = `
            <div class="error-state">
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    menuGrid.innerHTML = products.map(product => `
        <div class="menu-card fade-in ${!product.enabled ? 'disabled' : ''}">
            <div class="menu-card-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>Sin imagen</div>'">`
                    : `<div class="no-image">Sin imagen</div>`
                }
            </div>
            <div class="menu-card-content">
                <h3>${product.name}</h3>
                <p>${product.description || 'Preparacion de la casa'}</p>
                <div class="menu-card-footer">
                    <span class="price">$${formatPrice(product.price)}</span>
                    ${!product.enabled ? '<span class="stock-badge out-of-stock">Agotado</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Trigger fade-in animations
    setTimeout(() => {
        document.querySelectorAll('.menu-card.fade-in').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

function renderModalProducts(products) {
    if (products.length === 0) {
        modalMenuGrid.innerHTML = `
            <div class="error-state">
                <p>No hay productos disponibles</p>
            </div>
        `;
        return;
    }
    
    modalMenuGrid.innerHTML = products.map(product => `
        <div class="modal-menu-item ${!product.enabled ? 'disabled' : ''}">
            <div class="modal-item-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>Sin imagen</div>'">`
                    : `<div class="no-image">Sin imagen</div>`
                }
            </div>
            <div class="modal-item-info">
                <h3>${product.name}</h3>
                <p>${product.description || 'Preparacion de la casa'}</p>
                <span class="modal-item-price">$${formatPrice(product.price)}</span>
            </div>
            <div class="modal-item-actions">
                ${!product.enabled 
                    ? '<span class="stock-badge out-of-stock">Agotado</span>'
                    : `<a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20consultar%20por%20${encodeURIComponent(product.name)}" target="_blank" class="btn-contact">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Contacto
                    </a>`
                }
            </div>
        </div>
    `).join('');
}

function showErrorState() {
    menuGrid.innerHTML = `
        <div class="error-state">
            <p>No pudimos cargar la carta en este momento.</p>
            <p>Contactanos por WhatsApp para ver nuestros tragos!</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" class="btn btn-whatsapp" style="margin-top: 1rem; display: inline-flex;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribinos
            </a>
        </div>
    `;
    
    // Also show error in modal
    modalMenuGrid.innerHTML = menuGrid.innerHTML;
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR').format(price);
}

// ===== Menu Modal Controls =====
openMenuModalBtn.addEventListener('click', () => {
    menuModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenuModalBtn.addEventListener('click', () => {
    menuModal.classList.remove('active');
    document.body.style.overflow = '';
});

menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Gallery Lightbox =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(galleryImages[index]);
    });
});

function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    lightboxImage.src = galleryImages[currentImageIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Lightbox navigation
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    }
    
    // Close menu modal with Escape
    if (menuModal.classList.contains('active') && e.key === 'Escape') {
        menuModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Scroll Animations =====
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);

// ===== Parallax Effect =====
function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}

window.addEventListener('scroll', handleParallax);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    handleScrollAnimations();
    handleNavbarScroll();
    
    // Add fade-in class to elements
    document.querySelectorAll('.section-tag, .section-title, .about-text, .badges, .image-card, .info-card, .contact-card').forEach(el => {
        el.classList.add('fade-in');
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
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
