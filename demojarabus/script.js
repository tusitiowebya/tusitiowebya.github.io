// ===== DOM Elements =====
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const faqQuestions = document.querySelectorAll('.faq-question');
const contactForm = document.getElementById('contactForm');

// ===== Header Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ Accordion =====
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked one if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== Contact Form Handler =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Build WhatsApp message
    const tipoViaje = {
        'escolar': 'Viaje escolar',
        'cancha': 'Transporte a cancha',
        'evento': 'Evento / Fiesta',
        'congreso': 'Congreso / Grupal',
        'vip': 'Servicio VIP',
        'otro': 'Otro'
    };
    
    let message = `¡Hola! Quiero solicitar un presupuesto:\n\n`;
    message += `📋 *Nombre:* ${data.nombre}\n`;
    message += `📞 *Teléfono:* ${data.telefono}\n`;
    message += `🚌 *Tipo de viaje:* ${tipoViaje[data.tipoViaje] || data.tipoViaje}\n`;
    message += `👥 *Cantidad de personas:* ${data.personas}\n`;
    message += `📅 *Fecha:* ${formatDate(data.fecha)}\n`;
    
    if (data.mensaje) {
        message += `💬 *Mensaje:* ${data.mensaje}\n`;
    }
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/543517404524?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success feedback
    showFormSuccess();
});

// ===== Helper Functions =====
function formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-AR', options);
}

function showFormSuccess() {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        ¡Mensaje enviado!
    `;
    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        contactForm.reset();
    }, 3000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .trust-item, .why-card, .testimonial-card, .step, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== Gallery Lightbox (Simple) =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add lightbox styles dynamically
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = overlay.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const lightboxImg = overlay.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 0.5rem;
        `;
        
        const closeBtn = overlay.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -3rem;
            right: 0;
            width: 40px;
            height: 40px;
            background: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Close on click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn || closeBtn.contains(e.target)) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        });
        
        // Close on ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
});

// ===== Set minimum date for date input =====
const dateInput = document.getElementById('fecha');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ===== Animate stats on scroll =====
const statsSection = document.querySelector('.hero-stats');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const isPercentage = text.includes('%');
        const is247 = text.includes('/');
        
        if (is247) return; // Skip 24/7, it's not a number to animate
        
        const finalNumber = parseInt(text.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = finalNumber / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                stat.textContent = text;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
            }
        }, stepTime);
    });
}

// ===== Add fade keyframe animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ===== Console Easter Egg =====
console.log('%c🚌 JARA BUS', 'font-size: 24px; font-weight: bold; color: #1e40af;');
console.log('%cTraslados seguros, cómodos y a tiempo', 'font-size: 14px; color: #64748b;');
console.log('%c📞 WhatsApp: 351 740 4524', 'font-size: 12px; color: #25d366;');
