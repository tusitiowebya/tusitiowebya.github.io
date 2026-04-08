// ===== Particles Animation =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
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

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .timeline-item, .testimonial-card, .benefit-card, .gallery-item, .faq-item'
    );

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const consulta = document.getElementById('consulta').value;
            
            // Create WhatsApp message
            const message = `Hola, mi nombre es ${nombre}.\n\nTeléfono: ${telefono}\n\nConsulta: ${consulta}`;
            const encodedMessage = encodeURIComponent(message);
            
            // Open WhatsApp
            window.open(`https://wa.me/5493855913564?text=${encodedMessage}`, '_blank');
            
            // Reset form
            form.reset();
            
            // Show success feedback
            showFormFeedback('¡Mensaje enviado! Te redirigimos a WhatsApp...');
        });
    }
}

function showFormFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #c9a227, #a68520);
        color: #0a0a0f;
        padding: 15px 30px;
        border-radius: 50px;
        font-family: 'Cinzel', serif;
        font-weight: 600;
        z-index: 10000;
        animation: slideDown 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Add animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== Parallax Effect on Hero =====
function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// ===== Gallery Lightbox =====
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay span');
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(10, 10, 15, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                z-index: 10000;
                padding: 20px;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;
            
            const caption = document.createElement('p');
            caption.textContent = overlay ? overlay.textContent : '';
            caption.style.cssText = `
                font-family: 'Cinzel', serif;
                font-size: 1.2rem;
                color: #c9a227;
                margin-top: 20px;
            `;
            
            const closeHint = document.createElement('p');
            closeHint.textContent = 'Click para cerrar';
            closeHint.style.cssText = `
                font-size: 0.9rem;
                color: #a0a0a0;
                margin-top: 10px;
            `;
            
            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(caption);
            lightbox.appendChild(closeHint);
            
            lightbox.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => lightbox.remove(), 300);
            });
            
            document.body.appendChild(lightbox);
        });
    });
}

// Add fadeIn animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(fadeInStyle);

// ===== Typing Effect for Hero Title =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // The effect is already good with CSS animation, but we can add a subtle glow pulse
    setInterval(() => {
        heroTitle.style.textShadow = '0 0 30px rgba(201, 162, 39, 0.5)';
        setTimeout(() => {
            heroTitle.style.textShadow = 'none';
        }, 500);
    }, 3000);
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const urgencyStrip = document.querySelector('.urgency-strip');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (urgencyStrip) {
                urgencyStrip.style.transform = 'translateY(-100%)';
                urgencyStrip.style.opacity = '0';
            }
        } else {
            if (urgencyStrip) {
                urgencyStrip.style.transform = 'translateY(0)';
                urgencyStrip.style.opacity = '1';
            }
        }
    });
}

// ===== Counter Animation =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initSmoothScroll();
    initFAQ();
    initScrollAnimations();
    initContactForm();
    initParallax();
    initGallery();
    initTypingEffect();
    initNavbarScroll();
    
    // Add loaded class to body for any initial animations
    document.body.classList.add('loaded');
    
    console.log('✨ Hechicera Catalina y Maestro Tarziso - Landing Page Loaded');
});

// ===== Service Worker Registration (for PWA-like experience) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here if needed
    });
}
