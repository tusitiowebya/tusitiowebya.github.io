// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const viewBtns = document.querySelectorAll('.btn-view');
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const contactForm = document.getElementById('contactForm');

// ===== Project Data =====
const projectsData = {
    1: {
        title: 'Piscina Familiar con Deck',
        description: 'Hermosa piscina rectangular diseñada para toda la familia, con deck de madera de alta calidad y solárium integrado. Perfecta para disfrutar del verano con total comodidad.',
        materials: 'Hormigón armado, venecitas celestes, deck de madera tratada',
        time: '45-60 días',
        location: 'Buenos Aires',
        image: 'images/pool-1.jpg'
    },
    2: {
        title: 'Piscina Geométrica Premium',
        description: 'Diseño minimalista y moderno con líneas geométricas puras. Bordes atérmicos que permiten caminar sin quemarse y solárium de piedra natural.',
        materials: 'Hormigón proyectado, revestimiento cerámico, bordes atérmicos',
        time: '60-75 días',
        location: 'Zona Norte',
        image: 'images/pool-2.jpg'
    },
    3: {
        title: 'Proyecto en Desarrollo',
        description: 'Obra actualmente en proceso de excavación y construcción de estructura. Este proyecto incluirá piscina de 8x4 metros con zona de hidromasaje integrada.',
        materials: 'Hormigón armado H-30, acero estructural, impermeabilización especial',
        time: '90 días (en proceso)',
        location: 'Pilar',
        image: 'images/pool-3.jpg'
    },
    4: {
        title: 'Piscina con Iluminación LED',
        description: 'Sistema completo de iluminación LED RGB subacuática que permite crear ambientes únicos para disfrutar de noche. Control remoto para cambio de colores.',
        materials: 'Hormigón armado, venecitas premium, sistema LED RGB IP68',
        time: '50-65 días',
        location: 'Nordelta',
        image: 'images/pool-4.jpg'
    },
    5: {
        title: 'Piscina Compacta Urbana',
        description: 'Solución perfecta para espacios reducidos. Máximo aprovechamiento del espacio disponible sin sacrificar comodidad ni estilo.',
        materials: 'Hormigón armado, mosaico veneciano, bordes de piedra',
        time: '30-40 días',
        location: 'Capital Federal',
        image: 'images/pool-5.jpg'
    },
    6: {
        title: 'Piscina Estilo Natural',
        description: 'Diseño orgánico que se integra perfectamente con el jardín. Bordes de piedra natural y cascada integrada para un ambiente de relax total.',
        materials: 'Hormigón armado, piedra natural, sistema de cascada',
        time: '70-85 días',
        location: 'San Isidro',
        image: 'images/pool-6.jpg'
    }
};

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== Gallery Filter =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const categories = card.dataset.category;
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                card.style.display = '';
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

// ===== Project Modal =====
function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalMaterials').textContent = project.materials;
    document.getElementById('modalTime').textContent = project.time;
    document.getElementById('modalLocation').textContent = project.location;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        openModal(projectId);
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Close modal when clicking CTA
document.querySelector('.modal-cta').addEventListener('click', () => {
    closeModal();
});

// ===== Contact Form =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
    contactForm.reset();
});

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .project-card, .benefit-card, .process-step, .social-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('visible');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initial setup for reveal animation
document.querySelectorAll('.service-card, .project-card, .benefit-card, .process-step, .social-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.5, 0, 0, 1)';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Active Nav Link Highlight =====
function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

        if (navLink && scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Lazy Loading Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Parallax Effect on Hero =====
function parallaxHero() {
    const hero = document.querySelector('.hero-bg img');
    if (hero && window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(parallaxHero);
});

// ===== Water Wave Animation =====
function createWaterEffect() {
    const waterEffect = document.querySelector('.water-effect');
    if (!waterEffect) return;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        waterEffect.style.background = `
            radial-gradient(ellipse at ${20 + mouseX * 20}% ${80 - mouseY * 20}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at ${80 - mouseX * 20}% ${20 + mouseY * 20}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)
        `;
    });
}

createWaterEffect();

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };

        // Only animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });

        observer.observe(counter);
    });
}

animateCounters();

// ===== Preloader (optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        revealOnScroll();
    }, 100);
});

// ===== Console Welcome Message =====
console.log('%c🏊 Hugo Minuet - Construcción de Piscinas', 'font-size: 20px; font-weight: bold; color: #0891b2;');
console.log('%cSitio web desarrollado con ❤️', 'font-size: 14px; color: #64748b;');
