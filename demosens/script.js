// ===== Venues Data =====
const venues = [
    {
        id: 1,
        name: "Terraza Aurora",
        location: "Buenos Aires",
        capacity: "Hasta 150 personas",
        type: "social",
        eventTypes: "Eventos sociales, Corporativos",
        image: "images/venue1.jpg",
        tag: "Rooftop",
        description: "Un espacio único en las alturas de Buenos Aires con vistas panorámicas de la ciudad. Ideal para cocktails, celebraciones íntimas y eventos corporativos con un toque distintivo. La terraza cuenta con iluminación ambiente, barra completa y áreas lounge."
    },
    {
        id: 2,
        name: "Loft Industrial",
        location: "Palermo, Buenos Aires",
        capacity: "Hasta 200 personas",
        type: "boda",
        eventTypes: "Bodas, Eventos sociales",
        image: "images/venue2.jpg",
        tag: "Loft",
        description: "Un loft con carácter industrial y detalles arquitectónicos únicos. Techos altos con vigas de metal expuestas, paredes de ladrillo y grandes ventanales que inundan el espacio de luz natural. Perfecto para bodas contemporáneas y celebraciones con estilo."
    },
    {
        id: 3,
        name: "Espacio Ejecutivo",
        location: "Microcentro, Buenos Aires",
        capacity: "Hasta 100 personas",
        type: "corporativo",
        eventTypes: "Corporativos, Conferencias",
        image: "images/venue3.jpg",
        tag: "Corporativo",
        description: "Un espacio moderno y sofisticado diseñado para eventos corporativos de alto nivel. Equipado con la última tecnología audiovisual, WiFi de alta velocidad y mobiliario ejecutivo. Vistas espectaculares de la ciudad desde el piso 20."
    },
    {
        id: 4,
        name: "Jardín Secreto",
        location: "Tigre, Buenos Aires",
        capacity: "Hasta 250 personas",
        type: "boda",
        eventTypes: "Bodas, Eventos sociales",
        image: "images/venue4.jpg",
        tag: "Jardín",
        description: "Un oasis verde escondido en las afueras de la ciudad. Jardines manicurados, pérgolas románticas y una glorieta central perfecta para ceremonias al aire libre. El espacio incluye un salón interior para recepciones."
    },
    {
        id: 5,
        name: "Salón Imperial",
        location: "Recoleta, Buenos Aires",
        capacity: "Hasta 300 personas",
        type: "boda",
        eventTypes: "Bodas, Galas, Corporativos",
        image: "images/venue5.jpg",
        tag: "Salón",
        description: "Elegancia clásica en un salón histórico con techos ornamentados, arañas de cristal y pisos de mármol. Un espacio majestuoso que transporta a otra época, ideal para bodas grandes, galas benéficas y eventos de gala."
    },
    {
        id: 6,
        name: "Club Costero",
        location: "Pinamar, Buenos Aires",
        capacity: "Hasta 180 personas",
        type: "social",
        eventTypes: "Eventos sociales, Corporativos",
        image: "images/venue6.jpg",
        tag: "Beach Club",
        description: "Un exclusivo beach club con vistas al mar. Terrazas al aire libre, piscina infinity y áreas lounge frente al océano. El lugar perfecto para eventos de verano, fiestas de empresa y celebraciones con brisa marina."
    }
];

// Gallery images for lightbox
const galleryImages = [
    "images/gallery1.jpg",
    "images/gallery2.jpg",
    "images/gallery3.jpg",
    "images/gallery4.jpg",
    "images/gallery5.jpg",
    "images/gallery6.jpg"
];

// Current state
let currentFilter = 'all';
let currentTestimonial = 0;
let currentLightboxIndex = 0;

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const venuesGrid = document.getElementById('venuesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const venueModal = document.getElementById('venueModal');
const lightbox = document.getElementById('lightbox');
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialDots = document.getElementById('testimonialDots');
const contactForm = document.getElementById('contactForm');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderVenues();
    initTestimonials();
    initScrollAnimations();
    initGalleryLightbox();
    initFeaturedCards();
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu =====
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('modal-open');
});

function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// ===== Render Venues =====
function renderVenues(filter = 'all') {
    const filteredVenues = filter === 'all' 
        ? venues 
        : venues.filter(v => v.type === filter);
    
    venuesGrid.innerHTML = filteredVenues.map(venue => `
        <div class="venue-card fade-in" onclick="openVenueModal(${venue.id})">
            <div class="venue-card-image">
                <img src="${venue.image}" alt="${venue.name}" loading="lazy">
                <div class="venue-card-overlay">
                    <span>Ver más</span>
                </div>
            </div>
            <div class="venue-card-content">
                <span class="venue-card-tag">${venue.tag}</span>
                <h3 class="venue-card-title">${venue.name}</h3>
                <p class="venue-card-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${venue.location}
                </p>
                <div class="venue-card-meta">
                    <span>${venue.capacity}</span>
                    <span>•</span>
                    <span>${venue.tag}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.venue-card.fade-in').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

// ===== Filter Venues =====
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderVenues(currentFilter);
    });
});

// ===== Venue Modal =====
function openVenueModal(venueId) {
    const venue = venues.find(v => v.id === venueId);
    if (!venue) return;
    
    document.getElementById('modalMainImage').src = venue.image;
    document.getElementById('modalMainImage').alt = venue.name;
    document.getElementById('modalTag').textContent = venue.tag;
    document.getElementById('modalTitle').textContent = venue.name;
    document.getElementById('modalLocation').textContent = venue.location;
    document.getElementById('modalCapacity').textContent = venue.capacity;
    document.getElementById('modalEventTypes').textContent = venue.eventTypes;
    document.getElementById('modalDescription').textContent = venue.description;
    
    venueModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal() {
    venueModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeLightbox();
    }
});

// ===== Featured Cards =====
function initFeaturedCards() {
    document.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', () => {
            const venueId = parseInt(card.dataset.venueId);
            openVenueModal(venueId);
        });
    });
}

// ===== Testimonials Slider =====
function initTestimonials() {
    const totalSlides = testimonialTrack.children.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
        dot.addEventListener('click', () => goToTestimonial(i));
        testimonialDots.appendChild(dot);
    }
    
    // Auto slide
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % totalSlides;
        goToTestimonial(currentTestimonial);
    }, 6000);
}

function goToTestimonial(index) {
    currentTestimonial = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ===== Gallery Lightbox =====
function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            openLightbox(index);
        });
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    document.getElementById('lightboxImage').src = galleryImages[currentLightboxIndex];
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
    }
});

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section-header, .feature-card, .step-card, .featured-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // Show success message
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    contactForm.reset();
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
