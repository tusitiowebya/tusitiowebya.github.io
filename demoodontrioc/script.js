// ========================================
// DOM Elements
// ========================================
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.getElementById('contactForm');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dotsContainer = document.getElementById('testimonialsDots');

// ========================================
// Header Scroll Effect
// ========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Mobile Menu Toggle
// ========================================
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu when clicking nav links
navLinks.forEach(link => {
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

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ========================================
// FAQ Accordion
// ========================================
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========================================
// Testimonials Slider
// ========================================
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonialCards.length;
let testimonialsPerView = 3;

// Create dots
function createDots() {
    dotsContainer.innerHTML = '';
    const numDots = Math.ceil(totalTestimonials / testimonialsPerView);
    
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    }
}

// Update slider position
function updateSlider() {
    const cardWidth = testimonialCards[0].offsetWidth + 30; // card + gap
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * cardWidth}px)`;
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

// Navigation functions
function goToTestimonial(index) {
    const maxIndex = totalTestimonials - testimonialsPerView;
    currentTestimonial = Math.max(0, Math.min(index, maxIndex));
    updateSlider();
}

function nextTestimonial() {
    const maxIndex = totalTestimonials - testimonialsPerView;
    currentTestimonial = currentTestimonial >= maxIndex ? 0 : currentTestimonial + 1;
    updateSlider();
}

function prevTestimonialFn() {
    const maxIndex = totalTestimonials - testimonialsPerView;
    currentTestimonial = currentTestimonial <= 0 ? maxIndex : currentTestimonial - 1;
    updateSlider();
}

// Update testimonials per view based on screen size
function updateTestimonialsPerView() {
    if (window.innerWidth < 768) {
        testimonialsPerView = 1;
    } else if (window.innerWidth < 1024) {
        testimonialsPerView = 2;
    } else {
        testimonialsPerView = 3;
    }
    createDots();
    updateSlider();
}

// Event listeners
prevBtn.addEventListener('click', prevTestimonialFn);
nextBtn.addEventListener('click', nextTestimonial);
window.addEventListener('resize', updateTestimonialsPerView);

// Initialize
updateTestimonialsPerView();

// Auto-play testimonials
let autoplayInterval = setInterval(nextTestimonial, 5000);

// Pause on hover
testimonialsTrack.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

testimonialsTrack.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextTestimonial, 5000);
});

// ========================================
// Contact Form Handler
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message') || 'Quiero solicitar un turno';
    
    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `Hola! Soy ${name}.\n` +
        `Mi teléfono es: ${phone}\n\n` +
        `Mensaje: ${message}`
    );
    
    // Open WhatsApp
    window.open(`https://wa.me/5435435577415?text=${whatsappMessage}`, '_blank');
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    showNotification('¡Mensaje enviado! Te contactaremos pronto.');
});

// ========================================
// Notification System
// ========================================
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(14, 165, 233, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
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
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// Animated Counter
// ========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
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
}

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Trigger counter animation when stats become visible
            if (entry.target.classList.contains('hero-stats') || entry.target.closest('.hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    animationObserver.observe(el);
});

// Observe hero stats for counter animation
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    animationObserver.observe(heroStats);
}

// ========================================
// Parallax Effect for Hero
// ========================================
const heroImage = document.querySelector('.hero-image');

if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroImage.style.transform = `translateY(${rate}px)`;
    });
}

// ========================================
// Active Navigation Link Highlight
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
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

window.addEventListener('scroll', highlightNavLink);

// ========================================
// Initialize on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial animation for elements in view
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('aos-animate');
            }
        });
    }, 100);
    
    // Animate counters if hero stats are visible
    const heroStatsRect = heroStats?.getBoundingClientRect();
    if (heroStatsRect && heroStatsRect.top < window.innerHeight) {
        animateCounters();
    }
});

// ========================================
// Preloader (Optional)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
