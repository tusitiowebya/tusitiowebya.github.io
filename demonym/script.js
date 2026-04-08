// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');
const contactForm = document.getElementById('contactForm');
const sliderTrack = document.querySelector('.testimonials-track');
const sliderPrev = document.querySelector('.slider-btn.prev');
const sliderNext = document.querySelector('.slider-btn.next');
const sliderDots = document.querySelectorAll('.dot');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Navbar Scroll Effect =====
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Lightbox for Gallery =====
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Testimonials Slider =====
let currentSlide = 0;
const totalSlides = 3;

function updateSlider() {
    if (window.innerWidth > 768) {
        // Desktop: Show all cards, no sliding needed
        sliderTrack.style.transform = 'translateX(0)';
    } else {
        // Mobile: Slide through cards
        sliderTrack.style.transform = `translateY(-${currentSlide * (100 / totalSlides)}%)`;
    }
    
    sliderDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

sliderPrev?.addEventListener('click', () => {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateSlider();
});

sliderNext?.addEventListener('click', () => {
    currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    updateSlider();
});

sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-slide for testimonials (mobile only)
let autoSlideInterval;

function startAutoSlide() {
    if (window.innerWidth <= 768) {
        autoSlideInterval = setInterval(() => {
            currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
            updateSlider();
        }, 5000);
    }
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Restart auto-slide on window resize
window.addEventListener('resize', () => {
    stopAutoSlide();
    updateSlider();
    startAutoSlide();
});

startAutoSlide();

// ===== Counter Animation for Stats =====
function animateCounters() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString('es-AR');
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString('es-AR');
            }
        };
        
        updateCounter();
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.closest('.why-us-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== Contact Form Submission =====
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-dashoffset="10"/>
        </svg>
        Enviando...
    `;
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `Hola! Soy ${name}.\n` +
        `Mi teléfono: ${phone}\n` +
        `Mensaje: ${message || 'Me interesa solicitar información sobre sus servicios.'}`
    );
    
    // Show success message
    submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" style="width: 20px; height: 20px;" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Mensaje enviado!
    `;
    submitBtn.style.background = '#25D366';
    
    // Reset form
    contactForm.reset();
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
        window.open(`https://wa.me/5491135976696?text=${whatsappMessage}`, '_blank');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
    }, 1000);
});

// Add spinner animation to head
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== Parallax Effect for Hero =====
const heroBg = document.querySelector('.hero-bg img');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const scrolled = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
        }
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Initialize slider
    updateSlider();
    
    // Check initial scroll position for navbar
    handleNavbarScroll();
});

// ===== Preloader (optional) =====
window.addEventListener('load', () => {
    // Remove any preloader here if needed
    document.body.style.overflow = '';
});
