// ============================================
// MATÍAS ROMÁN SEGUROS - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initGalleryEffects();
});

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navLinks.classList.contains('active') 
                    ? index === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : index === 1 ? 'opacity: 0'
                    : 'rotate(-45deg) translate(5px, -5px)'
                    : '';
            });
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
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
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.service-card, .gallery-item, .why-us-card, .testimonial-card, .about-image, .about-text, .contact-info, .contact-form'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add the CSS for animate-in
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const tipoSeguro = document.getElementById('tipoSeguro').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Create WhatsApp message
            const tiposSeguro = {
                'auto': 'Seguro de Auto',
                'moto': 'Seguro de Moto',
                'hogar': 'Seguro de Hogar',
                'vida': 'Seguro de Vida',
                'otro': 'Otro tipo de seguro'
            };
            
            let whatsappMessage = `Hola Matías! Soy ${nombre}.\n`;
            whatsappMessage += `Me interesa consultar sobre: ${tiposSeguro[tipoSeguro]}\n`;
            whatsappMessage += `Mi teléfono: ${telefono}`;
            
            if (mensaje) {
                whatsappMessage += `\n\nMensaje adicional: ${mensaje}`;
            }
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp
            window.open(`https://wa.me/5491164381048?text=${encodedMessage}`, '_blank');
            
            // Show success message
            showFormSuccess();
            
            // Reset form
            form.reset();
        });
    }
}

function showFormSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        <span>¡Mensaje enviado! Te redirigimos a WhatsApp...</span>
    `;
    
    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10b981;
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: fadeInScale 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'fadeInScale 0.3s ease reverse';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// ============================================
// GALLERY EFFECTS
// ============================================
function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Open Instagram
            window.open('https://instagram.com/mroman.seguros', '_blank');
        });
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
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

// Initialize counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.dataset.animated) {
                    stat.dataset.animated = 'true';
                    const prefix = text.match(/^\D+/) || [''];
                    const suffix = text.match(/\D+$/) || [''];
                    animateCounter(stat, number, 1500);
                    // Add prefix/suffix back after animation
                    setTimeout(() => {
                        stat.textContent = prefix[0] + number + suffix[0];
                    }, 1600);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(stats => {
    statsObserver.observe(stats);
});

// ============================================
// PARALLAX EFFECT FOR HERO
// ============================================
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.backgroundPositionY = `${rate}px`;
    }
});

// ============================================
// PRELOADER (Optional)
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
