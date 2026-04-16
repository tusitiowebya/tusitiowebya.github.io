// ===== Motorcycle Data =====
const motosData = {
    1: {
        name: 'Volt X1',
        badge: 'Más vendida',
        badgeClass: '',
        price: '$850.000',
        image: 'images/moto-1.jpg',
        description: 'La Volt X1 es nuestra moto más popular. Perfecta para moverte por la ciudad con estilo y eficiencia. Su diseño compacto y su potente motor eléctrico la convierten en la opción ideal para el día a día.',
        specs: {
            autonomia: '60 km',
            velocidad: '45 km/h',
            carga: '4-6 horas',
            bateria: 'Litio 60V 20Ah'
        }
    },
    2: {
        name: 'Storm E2',
        badge: 'Nueva',
        badgeClass: 'badge-new',
        price: '$1.100.000',
        image: 'images/moto-2.jpg',
        description: 'La Storm E2 combina velocidad y elegancia. Con su motor de alta potencia y su diseño aerodinámico, es perfecta para quienes buscan rendimiento sin comprometer el estilo.',
        specs: {
            autonomia: '70 km',
            velocidad: '55 km/h',
            carga: '3-4 horas',
            bateria: 'Litio 72V 26Ah'
        }
    },
    3: {
        name: 'Thunder R3',
        badge: 'Sport',
        badgeClass: 'badge-sport',
        price: '$1.350.000',
        image: 'images/moto-3.jpg',
        description: 'Para los amantes de la velocidad. La Thunder R3 cuenta con batería removible, lo que te permite cargarla donde quieras. Su diseño deportivo y su potencia la hacen única.',
        specs: {
            autonomia: '80 km',
            velocidad: '65 km/h',
            carga: '2-3 horas',
            bateria: 'Litio 72V 32Ah (Removible)'
        }
    },
    4: {
        name: 'Flash Pro',
        badge: 'Premium',
        badgeClass: 'badge-premium',
        price: '$1.650.000',
        image: 'images/moto-4.jpg',
        description: 'Lo mejor de lo mejor. La Flash Pro es nuestra moto premium con carga rápida, la mayor autonomía del mercado y acabados de primera calidad. Para quienes no aceptan nada menos que lo mejor.',
        specs: {
            autonomia: '100 km',
            velocidad: '70 km/h',
            carga: '2 horas (carga rápida)',
            bateria: 'Litio 84V 40Ah'
        }
    }
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const modal = document.getElementById('motoModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const particles = document.getElementById('particles');

// ===== Particles Animation =====
function createParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (3 + Math.random() * 3) + 's';
        particles.appendChild(particle);
    }
}

createParticles();

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

// ===== Mobile Menu =====
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Carousel =====
let currentSlide = 0;
const cards = document.querySelectorAll('.moto-card');
let cardsPerView = getCardsPerView();

function getCardsPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
}

function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    const maxSlide = Math.max(0, cards.length - cardsPerView);
    currentSlide = Math.min(currentSlide, maxSlide);
    
    carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    
    updateDots();
    updateButtons();
}

function createDots() {
    carouselDots.innerHTML = '';
    const totalDots = Math.max(1, cards.length - cardsPerView + 1);
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
        dot.addEventListener('click', () => {
            currentSlide = i;
            updateCarousel();
        });
        carouselDots.appendChild(dot);
    }
}

function updateDots() {
    const dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function updateButtons() {
    const maxSlide = Math.max(0, cards.length - cardsPerView);
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= maxSlide;
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
}

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
});

nextBtn.addEventListener('click', () => {
    const maxSlide = Math.max(0, cards.length - cardsPerView);
    if (currentSlide < maxSlide) {
        currentSlide++;
        updateCarousel();
    }
});

// Touch/Swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (diff > swipeThreshold) {
        // Swipe left - next
        const maxSlide = Math.max(0, cards.length - cardsPerView);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateCarousel();
        }
    } else if (diff < -swipeThreshold) {
        // Swipe right - prev
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
}

// Initialize carousel
createDots();
updateCarousel();

// Handle resize
window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    createDots();
    updateCarousel();
});

// ===== Modal =====
function openModal(motoId) {
    const moto = motosData[motoId];
    if (!moto) return;
    
    document.getElementById('modalImage').src = moto.image;
    document.getElementById('modalImage').alt = moto.name;
    document.getElementById('modalBadge').textContent = moto.badge;
    document.getElementById('modalBadge').className = 'modal-badge ' + (moto.badgeClass || '');
    document.getElementById('modalTitle').textContent = moto.name;
    document.getElementById('modalPrice').textContent = moto.price;
    document.getElementById('modalDescription').textContent = moto.description;
    
    const specsGrid = document.getElementById('modalSpecs');
    specsGrid.innerHTML = `
        <div class="spec-item">
            <span class="spec-label">Autonomía</span>
            <span class="spec-value">${moto.specs.autonomia}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Velocidad Máx</span>
            <span class="spec-value">${moto.specs.velocidad}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Tiempo de Carga</span>
            <span class="spec-value">${moto.specs.carga}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Batería</span>
            <span class="spec-value">${moto.specs.bateria}</span>
        </div>
    `;
    
    document.getElementById('modalCta').href = `https://wa.me/5491123456789?text=Hola! Me interesa la ${moto.name} (${moto.price})`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open modal buttons
document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        const motoId = btn.getAttribute('data-moto');
        openModal(motoId);
    });
});

// Open modal on image click
document.querySelectorAll('.moto-image-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
        const motoId = wrapper.closest('.moto-card').getAttribute('data-moto');
        openModal(motoId);
    });
});

// Close modal
modalClose.addEventListener('click', closeModal);
document.querySelector('.modal-overlay').addEventListener('click', closeModal);

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
    
    const message = `Hola! Mi nombre es ${nombre}.%0A%0ATeléfono: ${telefono}%0A%0AConsulta: ${consulta}`;
    const whatsappUrl = `https://wa.me/5491123456789?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    contactForm.reset();
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('.beneficio-card, .paso-card, .testimonio-card, .moto-card');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== Parallax Effect on Hero =====
const heroImg = document.querySelector('.hero-img');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroImg.style.transform = `scale(1.1) translateY(${rate}px)`;
    }
});

// ===== Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stats and animate when visible
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = target.textContent;
            const numericValue = parseInt(value);
            
            if (!isNaN(numericValue) && !target.classList.contains('animated')) {
                target.classList.add('animated');
                animateCounter(target, numericValue);
            }
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// ===== Preloader (optional - quick fade) =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

console.log('🏍️ EL AGUANTE - Motos Eléctricas loaded successfully!');
