// ===== Product Data =====
const products = [
    {
        id: 'pp',
        name: 'Polipropileno (PP)',
        shortName: 'PP',
        image: 'images/polipropileno.jpg',
        properties: {
            resistencia: 'Alta',
            flexibilidad: 'Media',
            tempMax: '100°C',
            uso: 'Multipropósito'
        },
        description: 'Polímero termoplástico de alta versatilidad, ideal para aplicaciones que requieren resistencia química y térmica.',
        specs: {
            densidad: '0.90 - 0.91 g/cm³',
            puntoFusion: '160 - 170°C',
            resistenciaTensil: '31 - 41 MPa',
            modulo: '1.1 - 1.6 GPa'
        },
        chemResistance: 'Excelente resistencia a ácidos, bases y solventes orgánicos. Resistente a la mayoría de químicos industriales.',
        applications: ['Envases alimentarios', 'Autopartes', 'Fibras textiles', 'Tuberías', 'Electrodomésticos', 'Muebles de jardín'],
        advantages: [
            'Excelente relación resistencia-peso',
            'Alta resistencia a la fatiga',
            'Buena resistencia química',
            'Fácil procesamiento',
            'Reciclable al 100%'
        ]
    },
    {
        id: 'pe',
        name: 'Polietileno (PE)',
        shortName: 'PE',
        image: 'images/polietileno.jpg',
        properties: {
            resistencia: 'Media-Alta',
            flexibilidad: 'Alta',
            tempMax: '80°C',
            uso: 'Envases'
        },
        description: 'El plástico más producido mundialmente, conocido por su versatilidad y excelente resistencia química.',
        specs: {
            densidad: '0.91 - 0.97 g/cm³',
            puntoFusion: '105 - 135°C',
            resistenciaTensil: '8 - 32 MPa',
            modulo: '0.2 - 1.2 GPa'
        },
        chemResistance: 'Resistente a la mayoría de ácidos, alcoholes y aceites. No recomendado para hidrocarburos aromáticos.',
        applications: ['Bolsas plásticas', 'Botellas', 'Contenedores', 'Tuberías de agua', 'Films protectores', 'Juguetes'],
        advantages: [
            'Excelente flexibilidad',
            'Bajo costo de producción',
            'Alta resistencia al impacto',
            'Buenas propiedades dieléctricas',
            'Atóxico y apto para alimentos'
        ]
    },
    {
        id: 'abs',
        name: 'ABS',
        shortName: 'ABS',
        image: 'images/abs.jpg',
        properties: {
            resistencia: 'Muy Alta',
            flexibilidad: 'Baja',
            tempMax: '105°C',
            uso: 'Impacto'
        },
        description: 'Termoplástico de ingeniería que combina rigidez, resistencia al impacto y excelente acabado superficial.',
        specs: {
            densidad: '1.04 - 1.06 g/cm³',
            puntoFusion: '200 - 260°C',
            resistenciaTensil: '40 - 50 MPa',
            modulo: '2.0 - 2.6 GPa'
        },
        chemResistance: 'Buena resistencia a ácidos y bases diluidas. Sensible a solventes orgánicos y ésteres.',
        applications: ['Carcasas electrónicas', 'Autopartes', 'Electrodomésticos', 'Juguetes LEGO', 'Instrumentos musicales', 'Equipaje'],
        advantages: [
            'Excelente resistencia al impacto',
            'Acabado superficial superior',
            'Fácil de pintar y pegar',
            'Buena estabilidad dimensional',
            'Procesamiento versátil'
        ]
    },
    {
        id: 'ps-cristal',
        name: 'Poliestireno Cristal',
        shortName: 'PS Cristal',
        image: 'images/poliestireno-cristal.jpg',
        properties: {
            resistencia: 'Media',
            flexibilidad: 'Baja',
            tempMax: '80°C',
            uso: 'Transparente'
        },
        description: 'Poliestireno de alta transparencia, ideal para aplicaciones que requieren claridad óptica y brillo.',
        specs: {
            densidad: '1.04 - 1.05 g/cm³',
            puntoFusion: '180 - 260°C',
            resistenciaTensil: '35 - 55 MPa',
            modulo: '2.8 - 3.5 GPa'
        },
        chemResistance: 'Resistente a ácidos y bases diluidas. No apto para solventes aromáticos o clorados.',
        applications: ['Envases transparentes', 'Vitrinas', 'Displays', 'CD/DVD', 'Envases cosméticos', 'Cubertería desechable'],
        advantages: [
            'Alta transparencia óptica',
            'Excelente brillo superficial',
            'Bajo costo',
            'Fácil de procesar',
            'Apto para contacto alimentario'
        ]
    },
    {
        id: 'hips',
        name: 'Poliestireno Alto Impacto',
        shortName: 'HIPS',
        image: 'images/poliestireno-impacto.jpg',
        properties: {
            resistencia: 'Alta',
            flexibilidad: 'Media',
            tempMax: '85°C',
            uso: 'Resistente'
        },
        description: 'Poliestireno modificado con butadieno para mayor resistencia al impacto, manteniendo facilidad de procesamiento.',
        specs: {
            densidad: '1.03 - 1.06 g/cm³',
            puntoFusion: '180 - 260°C',
            resistenciaTensil: '20 - 35 MPa',
            modulo: '1.6 - 2.4 GPa'
        },
        chemResistance: 'Similar al PS cristal. Buena resistencia a ácidos y bases diluidas.',
        applications: ['Carcasas de electrodomésticos', 'Juguetes', 'Envases lácteos', 'Bandejas', 'Señalización', 'Maquetas'],
        advantages: [
            'Mayor resistencia al impacto que PS',
            'Fácil de pintar y decorar',
            'Buena estabilidad dimensional',
            'Costo competitivo',
            'Excelente para termoformado'
        ]
    },
    {
        id: 'nylon',
        name: 'Poliamida (Nylon)',
        shortName: 'PA/Nylon',
        image: 'images/nylon.jpg',
        properties: {
            resistencia: 'Muy Alta',
            flexibilidad: 'Media',
            tempMax: '150°C',
            uso: 'Ingeniería'
        },
        description: 'Plástico de ingeniería con excepcional resistencia mecánica, térmica y al desgaste.',
        specs: {
            densidad: '1.13 - 1.15 g/cm³',
            puntoFusion: '220 - 265°C',
            resistenciaTensil: '70 - 85 MPa',
            modulo: '2.7 - 3.3 GPa'
        },
        chemResistance: 'Excelente resistencia a hidrocarburos, aceites y grasas. Sensible a ácidos fuertes.',
        applications: ['Engranajes', 'Rodamientos', 'Cierres', 'Cuerdas', 'Redes de pesca', 'Componentes automotrices'],
        advantages: [
            'Excepcional resistencia al desgaste',
            'Bajo coeficiente de fricción',
            'Alta resistencia a la fatiga',
            'Buena resistencia química',
            'Autolubricante'
        ]
    },
    {
        id: 'eva',
        name: 'EVA',
        shortName: 'EVA',
        image: 'images/eva.jpg',
        properties: {
            resistencia: 'Media',
            flexibilidad: 'Muy Alta',
            tempMax: '65°C',
            uso: 'Flexible'
        },
        description: 'Copolímero de etileno y acetato de vinilo, conocido por su flexibilidad y propiedades amortiguadoras.',
        specs: {
            densidad: '0.93 - 0.95 g/cm³',
            puntoFusion: '70 - 110°C',
            resistenciaTensil: '15 - 25 MPa',
            modulo: '0.02 - 0.08 GPa'
        },
        chemResistance: 'Buena resistencia a aceites y grasas. Resistente a la intemperie y rayos UV.',
        applications: ['Suelas de calzado', 'Espumas deportivas', 'Empaques', 'Paneles solares', 'Juguetes', 'Colchonetas'],
        advantages: [
            'Excelente flexibilidad',
            'Propiedades amortiguadoras',
            'Resistente a baja temperatura',
            'Atóxico',
            'Fácil de termoformar'
        ]
    },
    {
        id: 'san',
        name: 'SAN',
        shortName: 'SAN',
        image: 'images/san.jpg',
        properties: {
            resistencia: 'Alta',
            flexibilidad: 'Baja',
            tempMax: '95°C',
            uso: 'Óptico'
        },
        description: 'Copolímero de estireno-acrilonitrilo con excelente transparencia y resistencia química mejorada.',
        specs: {
            densidad: '1.07 - 1.08 g/cm³',
            puntoFusion: '200 - 260°C',
            resistenciaTensil: '55 - 75 MPa',
            modulo: '3.5 - 4.0 GPa'
        },
        chemResistance: 'Superior al PS. Buena resistencia a aceites, grasas y muchos solventes.',
        applications: ['Envases cosméticos', 'Artículos de cocina', 'Baterías', 'Instrumentos médicos', 'Displays', 'Accesorios de baño'],
        advantages: [
            'Alta transparencia',
            'Mayor dureza que PS',
            'Resistencia química mejorada',
            'Brillo excepcional',
            'Estabilidad dimensional'
        ]
    },
    {
        id: 'pom',
        name: 'Resina Acetal (POM)',
        shortName: 'POM/Acetal',
        image: 'images/acetal.jpg',
        properties: {
            resistencia: 'Muy Alta',
            flexibilidad: 'Baja',
            tempMax: '120°C',
            uso: 'Precisión'
        },
        description: 'Plástico de ingeniería de alta precisión con excelentes propiedades mecánicas y bajo coeficiente de fricción.',
        specs: {
            densidad: '1.41 - 1.43 g/cm³',
            puntoFusion: '165 - 180°C',
            resistenciaTensil: '60 - 70 MPa',
            modulo: '2.8 - 3.2 GPa'
        },
        chemResistance: 'Excelente resistencia a solventes y combustibles. No apto para ácidos y bases fuertes.',
        applications: ['Engranajes de precisión', 'Válvulas', 'Bombas', 'Cierres', 'Componentes eléctricos', 'Rodamientos'],
        advantages: [
            'Excelente estabilidad dimensional',
            'Muy bajo coeficiente de fricción',
            'Alta resistencia a la fatiga',
            'Autolubricante',
            'Resistencia a fluencia'
        ]
    },
    {
        id: 'masterbatch',
        name: 'Masterbatch',
        shortName: 'Masterbatch',
        image: 'images/masterbatch.jpg',
        properties: {
            resistencia: 'Variable',
            flexibilidad: 'Variable',
            tempMax: 'Variable',
            uso: 'Colorantes'
        },
        description: 'Concentrados de color y aditivos para la industria plástica, disponibles en amplia gama de colores y efectos.',
        specs: {
            densidad: 'Según base',
            puntoFusion: 'Según base',
            resistenciaTensil: 'Según base',
            modulo: 'Según base'
        },
        chemResistance: 'Depende del polímero base y los pigmentos utilizados. Disponibles versiones resistentes a UV.',
        applications: ['Coloración de plásticos', 'Efectos especiales', 'Protección UV', 'Retardantes de llama', 'Antioxidantes', 'Deslizantes'],
        advantages: [
            'Dispersión uniforme del color',
            'Fácil dosificación',
            'Amplia gama de colores',
            'Efectos especiales disponibles',
            'Mejora consistencia del producto'
        ]
    },
    {
        id: 'elastomeros',
        name: 'Elastómeros',
        shortName: 'TPE/TPR',
        image: 'images/elastomeros.jpg',
        properties: {
            resistencia: 'Media',
            flexibilidad: 'Muy Alta',
            tempMax: '100°C',
            uso: 'Goma'
        },
        description: 'Elastómeros termoplásticos que combinan las propiedades del caucho con la procesabilidad de los termoplásticos.',
        specs: {
            densidad: '0.90 - 1.25 g/cm³',
            puntoFusion: '150 - 200°C',
            resistenciaTensil: '5 - 30 MPa',
            modulo: '0.01 - 0.5 GPa'
        },
        chemResistance: 'Variable según tipo. Generalmente buena resistencia a aceites y solventes alifáticos.',
        applications: ['Sellos y juntas', 'Mangos ergonómicos', 'Calzado', 'Componentes automotrices', 'Cables', 'Dispositivos médicos'],
        advantages: [
            'Procesable como termoplástico',
            'Reciclable',
            'Excelente elasticidad',
            'Amplio rango de durezas',
            'Buena resistencia a la abrasión'
        ]
    },
    {
        id: 'cargas',
        name: 'Cargas Minerales',
        shortName: 'Cargas',
        image: 'images/cargas.jpg',
        properties: {
            resistencia: 'Refuerzo',
            flexibilidad: 'Reduce',
            tempMax: 'Mejora',
            uso: 'Aditivos'
        },
        description: 'Cargas y refuerzos minerales para mejorar propiedades mecánicas, térmicas y reducir costos.',
        specs: {
            densidad: '2.5 - 2.8 g/cm³',
            puntoFusion: 'N/A',
            resistenciaTensil: 'Mejora rigidez',
            modulo: 'Aumenta 20-100%'
        },
        chemResistance: 'Las cargas minerales son químicamente inertes y mejoran la resistencia química del compuesto.',
        applications: ['Reducción de costos', 'Mejora de rigidez', 'Estabilidad dimensional', 'Resistencia térmica', 'Acabado superficial', 'Propiedades barrera'],
        advantages: [
            'Reduce costo del compuesto',
            'Mejora rigidez y dureza',
            'Estabilidad dimensional',
            'Reduce contracción',
            'Mejora propiedades térmicas'
        ]
    }
];

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const productsGrid = document.getElementById('productsGrid');
const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const heroImages = document.getElementById('heroImages');
const contactForm = document.getElementById('contactForm');

// ===== Carousel State =====
let currentSlide = 0;
let slidesPerView = 3;
let autoplayInterval;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderCarousel();
    renderProductsGrid();
    setupEventListeners();
    updateSlidesPerView();
    startAutoplay();
    setupScrollAnimations();
    setupHeroParallax();
});

// ===== Hero Parallax Effect =====
function setupHeroParallax() {
    if (!heroImages) return;
    
    const images = heroImages.querySelectorAll('.floating-image');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;
        
        images.forEach((img, index) => {
            const depth = (index + 1) * 0.5;
            const x = moveX * 15 * depth;
            const y = moveY * 10 * depth;
            img.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== Carousel =====
function renderCarousel() {
    carouselTrack.innerHTML = products.map(product => `
        <div class="carousel-card" data-id="${product.id}">
            <div class="carousel-card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="carousel-card-content">
                <h3 class="carousel-card-title">${product.name}</h3>
                <div class="carousel-card-props">
                    <div class="prop">
                        <svg class="prop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span>${product.properties.resistencia}</span>
                    </div>
                    <div class="prop">
                        <svg class="prop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h16M4 12l4-4m-4 4l4 4m12-4l-4-4m4 4l-4 4"></path>
                        </svg>
                        <span>${product.properties.flexibilidad}</span>
                    </div>
                    <div class="prop">
                        <svg class="prop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>${product.properties.tempMax}</span>
                    </div>
                    <div class="prop">
                        <svg class="prop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span>${product.properties.uso}</span>
                    </div>
                </div>
                <p class="carousel-card-desc">${product.description}</p>
            </div>
        </div>
    `).join('');

    renderDots();
    updateCarousel();

    // Add click handlers
    document.querySelectorAll('.carousel-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.id));
    });
}

function renderDots() {
    const totalDots = Math.ceil(products.length / slidesPerView);
    carouselDots.innerHTML = Array.from({ length: totalDots }, (_, i) => 
        `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
    ).join('');

    document.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.dataset.index);
            updateCarousel();
            resetAutoplay();
        });
    });
}

function updateCarousel() {
    const cardWidth = carouselTrack.querySelector('.carousel-card').offsetWidth + 24;
    carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth * slidesPerView}px)`;

    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    const totalSlides = Math.ceil(products.length / slidesPerView);
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    const totalSlides = Math.ceil(products.length / slidesPerView);
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
    renderDots();
    updateCarousel();
}

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// ===== Products Grid =====
function renderProductsGrid() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <span class="product-card-subtitle">${product.shortName}</span>
                <div class="product-card-preview">
                    <span class="preview-tag">${product.properties.resistencia}</span>
                    <span class="preview-tag">${product.properties.tempMax}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.id));
    });
}

// ===== Modal =====
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${product.image}" alt="${product.name}">
            <div class="modal-header-overlay"></div>
            <div class="modal-header-content">
                <h2>${product.name}</h2>
                <span>${product.shortName}</span>
            </div>
        </div>
        <div class="modal-info">
            <div class="modal-section">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                    Especificaciones Técnicas
                </h3>
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                        </div>
                        <div class="spec-text">
                            <span class="spec-label">Densidad</span>
                            <span class="spec-value">${product.specs.densidad}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2v10l4.5 4.5"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                        </div>
                        <div class="spec-text">
                            <span class="spec-label">Punto de Fusión</span>
                            <span class="spec-value">${product.specs.puntoFusion}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <div class="spec-text">
                            <span class="spec-label">Resistencia Tensil</span>
                            <span class="spec-value">${product.specs.resistenciaTensil}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                        </div>
                        <div class="spec-text">
                            <span class="spec-label">Módulo Elástico</span>
                            <span class="spec-value">${product.specs.modulo}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-section">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Resistencia Química
                </h3>
                <p>${product.chemResistance}</p>
            </div>
            
            <div class="modal-section">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    Aplicaciones Industriales
                </h3>
                <div class="apps-list">
                    ${product.applications.map(app => `<span class="app-tag">${app}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Ventajas
                </h3>
                <div class="advantages-list">
                    ${product.advantages.map(adv => `
                        <div class="advantage-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>${adv}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-header, .industry-card, .diff-card, .about-feature, .product-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Event Listeners =====
function setupEventListeners() {
    // Navbar scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile nav toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Carousel buttons
    carouselPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    carouselNext.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Window resize
    window.addEventListener('resize', () => {
        updateSlidesPerView();
    });

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const nombre = formData.get('nombre');
        const empresa = formData.get('empresa');
        const telefono = formData.get('telefono');
        const consulta = formData.get('consulta');

        const message = `Hola! Mi nombre es ${nombre}${empresa ? ` de ${empresa}` : ''}.\n\nTeléfono: ${telefono}\n\nConsulta: ${consulta}`;
        const whatsappUrl = `https://wa.me/5491160124001?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
