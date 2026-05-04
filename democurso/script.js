// ===== Particles Animation =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Fade In Animation on Scroll =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== Contact Form Handler =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const consulta = document.getElementById('consulta').value;
        
        // Create WhatsApp message
        const message = `¡Hola! Mi nombre es ${nombre}.\n\nConsulta: ${consulta}`;
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/+5491100000000?text=${encodedMessage}`, '_blank');
        
        // Reset form
        form.reset();
        
        // Show success feedback
        showNotification('¡Mensaje enviado! Te contactaremos pronto.');
    });
}

// ===== Notification System =====
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37, #f4d47c);
        color: #0a0a0a;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #0a0a0a;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Typing Effect for Hero Title =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Add a subtle glow animation to the gold text
    const goldText = heroTitle.querySelector('.gold-text');
    if (goldText) {
        goldText.style.animation = 'textGlow 3s ease-in-out infinite';
        
        if (!document.querySelector('#text-glow-styles')) {
            const style = document.createElement('style');
            style.id = 'text-glow-styles';
            style.textContent = `
                @keyframes textGlow {
                    0%, 100% {
                        filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
                    }
                    50% {
                        filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== Parallax Effect for Hero =====
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroGlow = document.querySelector('.hero-glow');
    
    if (!hero || !heroGlow) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        
        if (scrolled < window.innerHeight) {
            heroGlow.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
        }
    });
}

// ===== Hover Effects for Cards =====
function initCardEffects() {
    const cards = document.querySelectorAll('.benefit-card, .step-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Add hover glow effect styles
    if (!document.querySelector('#card-glow-styles')) {
        const style = document.createElement('style');
        style.id = 'card-glow-styles';
        style.textContent = `
            .benefit-card::before,
            .step-card::before,
            .testimonial-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(
                    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                    rgba(212, 175, 55, 0.1) 0%,
                    transparent 50%
                );
                border-radius: inherit;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .benefit-card:hover::before,
            .step-card:hover::before,
            .testimonial-card:hover::before {
                opacity: 1;
            }
            
            .benefit-card,
            .step-card,
            .testimonial-card {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }
}

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

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initTypingEffect();
    initParallax();
    initCardEffects();
    initLazyLoading();
    
    // Make initial hero elements visible immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});

// ===== Handle Reduced Motion Preference =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}
