/* ===================================
   TELECOMUNICACIONES_X - JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initNavbar();
    initSmoothScroll();
    initCounterAnimation();
    initAOSAnimations();
    initFormHandler();
});

/* ===================================
   PARTICLES BACKGROUND
   =================================== */
function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 15;
    
    // Random color
    const colors = ['#00d4ff', '#ff00ff', '#9d4edd', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: -${delay}s;
        animation-duration: ${duration}s;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
    `;
    
    container.appendChild(particle);
}

/* ===================================
   NAVBAR
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
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
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   COUNTER ANIMATION
   =================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

/* ===================================
   AOS-LIKE ANIMATIONS
   =================================== */
function initAOSAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ===================================
   FORM HANDLER
   =================================== */
function initFormHandler() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission
            console.log('Form submitted:', data);
            
            // Show success modal
            modal.classList.add('active');
            
            // Reset form
            form.reset();
        });
    }
}

// Close modal function (global)
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

/* ===================================
   ADDITIONAL EFFECTS
   =================================== */

// Parallax effect for floating elements
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    
    const floatingElements = document.querySelectorAll('.floating-element');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Card tilt effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Input focus effect
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Scroll reveal for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
            section.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealSections);
revealSections();

// Preload images for better performance
const preloadImages = () => {
    const images = [
        'images/tv-interface.jpg',
        'images/mobile-app.jpg',
        'images/streaming-platform.jpg',
        'images/hero-bg.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

preloadImages();

// Console branding
console.log('%c TELECOMUNICACIONES_X ', 'background: linear-gradient(135deg, #00d4ff, #ff00ff); color: white; font-size: 24px; padding: 10px 20px; font-family: Orbitron, sans-serif; font-weight: bold;');
console.log('%c El Futuro de las Telecomunicaciones ', 'color: #00d4ff; font-size: 14px; font-family: Rajdhani, sans-serif;');
