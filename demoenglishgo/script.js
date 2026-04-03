// ===== DOM Elements =====
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

// ===== Header Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    }
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Stats Counter Animation =====
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item');
            statItems.forEach(item => {
                const numberEl = item.querySelector('.stat-number');
                const target = parseInt(item.dataset.count);
                const currentText = numberEl.textContent;
                const suffix = currentText.includes('%') ? '%' : '+';
                animateCounter(numberEl, target, suffix);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const socialProof = document.querySelector('.social-proof');
if (socialProof) {
    statsObserver.observe(socialProof);
}

// ===== Fade In Animation on Scroll =====
const fadeElements = document.querySelectorAll('.course-card, .benefit-card, .why-feature, .process-step, .testimonial-card, .contact-method');

fadeElements.forEach(el => {
    el.classList.add('fade-in');
});

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => {
    fadeObserver.observe(el);
});

// ===== Form Submission =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
        </svg>
        Enviando...
    `;
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create WhatsApp message
        const message = `¡Hola! Mi nombre es ${data.nombre}.%0A%0A` +
            `Edad: ${data.edad}%0A` +
            `Nivel de inglés: ${data.nivel}%0A` +
            `Objetivo: ${data.objetivo}%0A` +
            (data.mensaje ? `Mensaje: ${data.mensaje}` : '');
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/5492604345465?text=${message}`;
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);
        
    }, 1500);
});

// ===== Modal Close =====
function closeModal() {
    successModal.classList.remove('active');
}

// Close modal on outside click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Floating Cards Animation Enhancement =====
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// ===== Parallax Effect on Hero =====
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg-img');

if (hero && heroBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallax = scrolled * 0.4;
            heroBg.style.transform = `translateY(${parallax}px) scale(1.1)`;
        }
    });
}

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Cursor Animation for Hero =====
const heroContent = document.querySelector('.hero-content');

if (heroContent && window.innerWidth > 1024) {
    heroContent.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.floating-card');
        const rect = heroContent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        cards.forEach((card, index) => {
            const factor = (index + 1) * 10;
            card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
    
    heroContent.addEventListener('mouseleave', () => {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach(card => {
            card.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== Typed Effect for Hero Title (Optional Enhancement) =====
const heroTitle = document.querySelector('.hero-title');

function typeEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== Service Worker Registration (for PWA support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for PWA functionality
        console.log('ENGLISHGO Ready!');
    });
}

// ===== CSS Animation for Spinner =====
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .nav-link.active {
        color: var(--primary);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add initial scroll check
    handleScroll();
    setActiveLink();
    
    // Add loaded class for animations
    document.body.classList.add('loaded');
});
