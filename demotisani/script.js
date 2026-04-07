// ===== Tisoni Academy - Main Script =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initParallaxEffects();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            edad: formData.get('edad'),
            ciudad: formData.get('ciudad'),
            experiencia: formData.get('experiencia'),
            mensaje: formData.get('mensaje') || ''
        };
        
        // Validate
        if (!data.nombre || !data.edad || !data.ciudad || !data.experiencia) {
            showNotification('Por favor completá todos los campos requeridos', 'error');
            return;
        }
        
        // Create WhatsApp message
        const experienciaTexts = {
            'sin-experiencia': 'Sin experiencia previa',
            'algo': 'Algo de experiencia',
            'profesional': 'Ya trabajo en estética'
        };
        
        let message = `¡Hola! Me interesa inscribirme en el curso de depilación láser.\n\n`;
        message += `*Nombre:* ${data.nombre}\n`;
        message += `*Edad:* ${data.edad} años\n`;
        message += `*Ciudad:* ${data.ciudad}\n`;
        message += `*Experiencia:* ${experienciaTexts[data.experiencia]}\n`;
        
        if (data.mensaje) {
            message += `\n*Mensaje:* ${data.mensaje}`;
        }
        
        // Encode and redirect to WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5491127395246?text=${encodedMessage}`;
        
        // Show success message and redirect
        showNotification('¡Perfecto! Te redirigimos a WhatsApp...', 'success');
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            form.reset();
        }, 1500);
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Parallax Effects =====
function initParallaxEffects() {
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroImage) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (window.innerWidth > 1024) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/\D/g, ''));
        const prefix = counter.innerText.match(/^\D*/)[0];
        const suffix = counter.innerText.match(/\D*$/)[0];
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.innerText = prefix + Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = prefix + target + suffix;
            }
        };
        
        // Start animation when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// Initialize counters
document.addEventListener('DOMContentLoaded', animateCounters);

// ===== Lazy Loading Images =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== Gallery Lightbox =====
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const src = img.src;
            const alt = img.alt;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <img src="${src}" alt="${alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .lightbox-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.9);
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 90vh;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                .lightbox-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close handlers
            const closeLightbox = () => {
                lightbox.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };
            
            lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}

// Initialize gallery lightbox
document.addEventListener('DOMContentLoaded', initGalleryLightbox);

// ===== Typing Effect for Hero =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .text-gradient');
    
    if (!heroTitle) return;
    
    const text = heroTitle.innerText;
    heroTitle.innerText = '';
    heroTitle.style.borderRight = '2px solid var(--color-primary)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerText += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    };
    
    // Start after a delay
    setTimeout(typeWriter, 500);
}

// Uncomment to enable typing effect
// document.addEventListener('DOMContentLoaded', initTypingEffect);

// ===== Scroll Progress Indicator =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initScrollProgress);

// ===== Hover Effects Enhancement =====
function initHoverEffects() {
    const cards = document.querySelectorAll('.benefit-card, .location-card, .testimonial-card, .feature');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 168, 108, 0.1), transparent 50%), var(--color-cream)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', initHoverEffects);

console.log('Tisoni Academy - All scripts loaded successfully! ✨');
