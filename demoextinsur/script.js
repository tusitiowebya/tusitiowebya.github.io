// ==================== //
// NAVBAR SCROLL EFFECT //
// ==================== //
const navbar = document.getElementById('navbar');
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

// ==================== //
// MOBILE MENU //
// ==================== //
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ==================== //
// FIRE PARTICLES //
// ==================== //
const fireParticles = document.getElementById('fireParticles');

function createFireParticle() {
    const particle = document.createElement('div');
    particle.classList.add('fire-particle');
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random color (orange to red)
    const colors = ['#e63946', '#ff6b35', '#ff9f1c', '#ffba08'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random size
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    fireParticles.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Create particles periodically
setInterval(createFireParticle, 200);

// ==================== //
// SCROLL ANIMATIONS //
// ==================== //
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

// Observe all elements that should animate
document.querySelectorAll('.service-card, .diferencial-item, .proceso-step, .testimonio-card, .stat-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ==================== //
// COUNTER ANIMATION //
// ==================== //
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const count = parseInt(target.getAttribute('data-count'));
            animateCounter(target, count);
            counterObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.closest('.stat-card').querySelector('.stat-label').textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ==================== //
// SMOOTH SCROLL //
// ==================== //
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

// ==================== //
// WHATSAPP BUTTON ANIMATION //
// ==================== //
const whatsappFloat = document.getElementById('whatsappFloat');

// Add pulse animation periodically
setInterval(() => {
    whatsappFloat.style.transform = 'scale(1.15)';
    setTimeout(() => {
        whatsappFloat.style.transform = 'scale(1)';
    }, 300);
}, 3000);

// ==================== //
// SERVICE CARDS HOVER EFFECT //
// ==================== //
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 40px rgba(230, 57, 70, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// ==================== //
// PARALLAX EFFECT //
// ==================== //
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ==================== //
// TESTIMONIAL CARDS ANIMATION //
// ==================== //
document.querySelectorAll('.testimonio-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ==================== //
// CONTACT FORM FOCUS EFFECTS //
// ==================== //
document.querySelectorAll('.contacto-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contacto-icon');
        icon.style.transform = 'scale(1.1)';
    });
    
    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contacto-icon');
        icon.style.transform = 'scale(1)';
    });
});

// ==================== //
// LOADING ANIMATION //
// ==================== //
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-badges');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// Add initial styles for hero animation
document.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-badges');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// ==================== //
// SCROLL INDICATOR HIDE //
// ==================== //
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// ==================== //
// ACTIVE NAV LINK HIGHLIGHT //
// ==================== //
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== //
// COPY TO CLIPBOARD (for email/phone) //
// ==================== //
document.querySelectorAll('.contacto-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // Only for email and phone items
        const text = this.querySelector('.contacto-text span');
        if (text) {
            const textToCopy = text.textContent;
            
            // Check if it's email or phone (not WhatsApp or location)
            const icon = this.querySelector('.contacto-icon');
            if (icon.classList.contains('email') || icon.classList.contains('phone')) {
                // Don't prevent default, let the link work
            }
        }
    });
});

console.log('🔥 Extinsur Matafuegos - Website loaded successfully!');
