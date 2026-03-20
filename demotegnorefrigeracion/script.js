// ===== DOM Elements =====
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn.querySelector('.close-icon');
const whatsappWrapper = document.getElementById('whatsappWrapper');
const whatsappTooltip = document.getElementById('whatsappTooltip');
const tooltipClose = document.getElementById('tooltipClose');
const particlesContainer = document.getElementById('particles');
const ctaParticlesContainer = document.getElementById('ctaParticles');
const yearSpan = document.getElementById('year');

// ===== Set Current Year =====
yearSpan.textContent = new Date().getFullYear();

// ===== Header Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
handleScroll(); // Initial check

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    
    mobileMenu.classList.toggle('active');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ===== WhatsApp Button =====
setTimeout(() => {
    whatsappWrapper.classList.add('visible');
}, 1000);

setTimeout(() => {
    whatsappTooltip.classList.add('visible');
}, 3000);

tooltipClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    whatsappTooltip.classList.remove('visible');
});

// ===== Create Floating Particles =====
function createParticles(container, count) {
    if (!container) return;
    
    const snowflakeSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" x2="22" y1="12" y2="12"/>
            <line x1="12" x2="12" y1="2" y2="22"/>
            <path d="m20 16-4-4 4-4"/>
            <path d="m4 8 4 4-4 4"/>
            <path d="m16 4-4 4-4-4"/>
            <path d="m8 20 4-4 4 4"/>
        </svg>
    `;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = snowflakeSVG;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${4 + Math.random() * 4}s`;
        
        const size = 16 + Math.random() * 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
    }
}

createParticles(particlesContainer, 20);

// CTA particles with different styling
function createCtaParticles(container, count) {
    if (!container) return;
    
    const snowflakeSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" x2="22" y1="12" y2="12"/>
            <line x1="12" x2="12" y1="2" y2="22"/>
            <path d="m20 16-4-4 4-4"/>
            <path d="m4 8 4 4-4 4"/>
            <path d="m16 4-4 4-4-4"/>
            <path d="m8 20 4-4 4 4"/>
        </svg>
    `;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'cta-particle';
        particle.innerHTML = snowflakeSVG;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${4 + Math.random() * 4}s`;
        particle.style.position = 'absolute';
        particle.style.opacity = '0.1';
        particle.style.color = 'white';
        
        container.appendChild(particle);
    }
}

createCtaParticles(ctaParticlesContainer, 10);

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    animateOnScroll.observe(el);
});

// ===== Service Cards Hover Effect =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== Logo Rotation on Hover =====
const logoIcon = document.querySelector('.logo-icon');
if (logoIcon) {
    const logo = logoIcon.closest('.logo');
    logo.addEventListener('mouseenter', () => {
        logoIcon.style.transform = 'rotate(45deg)';
    });
    logo.addEventListener('mouseleave', () => {
        logoIcon.style.transform = 'rotate(0deg)';
    });
}

// ===== Preload animations after page load =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    document.querySelectorAll('.hero .fade-in').forEach((el, index) => {
        setTimeout(() => {
            el.style.animationPlayState = 'running';
        }, index * 100);
    });
});

// ===== Console message =====
console.log('%c Tegno Refrigeración ', 'background: #2563eb; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 8px;');
console.log('%c Servicio técnico de aire acondicionado en La Rioja ', 'color: #64748b; font-size: 12px;');
