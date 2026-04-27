// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuGrid = document.getElementById('menuGrid');
const menuFilters = document.getElementById('menuFilters');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-nav.prev');
const lightboxNext = lightbox.querySelector('.lightbox-nav.next');

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
let allSubcategories = [];

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
async function fetchMenu() {
    try {
        const response = await fetch('https://newback.quierolacarta.com/v1/locals/261/categories/2137');
        const data = await response.json();
        processMenuData(data);
    } catch (error) {
        console.error('Error fetching menu:', error);
        showErrorState();
    }
}

function processMenuData(data) {
    allProducts = [];
    allSubcategories = [];
    
    // Products are at root level in the API response (data.products)
    const products = data.products || [];
    
    // Process all products
    products.forEach(product => {
        const attrs = product.attributes || {};
        allProducts.push({
            id: product.id,
            name: attrs.name || 'Sin nombre',
            description: attrs.description || '',
            price: attrs.price || 0,
            image: attrs.image ? `https://quierolacarta.com/storage/${attrs.image}` : null,
            enabled: attrs.enabled !== false,
            category: 'Tragos',
            order: attrs.order || 0
        });
    });
    
    // Sort products by order
    allProducts.sort((a, b) => a.order - b.order);
    
    // No subcategories filter needed since all are "Tragos"
    allSubcategories = [];
    
    // Hide filters since there's only one category
    menuFilters.style.display = 'none';
    
    // Render all products
    renderProducts(allProducts);
}

function createFilterButtons() {
    // Clear existing filters except "Todos"
    menuFilters.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';
    
    // Add filter for each subcategory
    allSubcategories.forEach(subcat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = subcat;
        btn.textContent = subcat;
        menuFilters.appendChild(btn);
    });
    
    // Add event listeners to filter buttons
    menuFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            menuFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const filter = btn.dataset.filter;
            if (filter === 'all') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.category === filter);
                renderProducts(filtered);
            }
        });
    });
}

function renderProducts(products) {
    if (products.length === 0) {
        menuGrid.innerHTML = `
            <div class="error-state">
                <p>No hay productos disponibles en esta categoria</p>
            </div>
        `;
        return;
    }
    
    menuGrid.innerHTML = products.map(product => `
        <div class="menu-card fade-in ${!product.enabled ? 'disabled' : ''}">
            <div class="menu-card-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231f1f1f%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2212%22>Sin imagen</text></svg>'">`
                    : `<div style="width:100%;height:180px;background:#1f1f1f;display:flex;align-items:center;justify-content:center;color:#666;">Sin imagen</div>`
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
            }, index * 50);
        });
    }, 100);
}

function showErrorState() {
    menuGrid.innerHTML = `
        <div class="error-state">
            <p>No pudimos cargar la carta en este momento.</p>
            <p>Contactanos por WhatsApp para ver nuestros tragos!</p>
            <a href="https://wa.me/542616123098" target="_blank" class="btn btn-whatsapp" style="margin-top: 1rem; display: inline-flex;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Escribinos
            </a>
        </div>
    `;
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR').format(price);
}

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
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
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
