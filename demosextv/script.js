// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const fullscreenModal = document.getElementById('fullscreenModal');
const modalClose = document.getElementById('modalClose');
const fullscreenIframe = document.getElementById('fullscreenIframe');
const videoPlaceholders = document.querySelectorAll('.video-placeholder');
const fullscreenButtons = document.querySelectorAll('.btn-fullscreen');

// ===== Stream URLs Configuration =====
// Replace these with your actual stream URLs
const streamUrls = {
    1: 'YOUR_STREAM_URL_1', // SEX TV
    2: 'YOUR_STREAM_URL_2', // SEX TV MUSIC
    3: 'YOUR_STREAM_URL_3'  // CANAL 3
};

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Smooth Scroll for Navigation Links =====
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

// ===== Video Player Functionality =====
videoPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        const channelId = this.dataset.channel;
        const card = this.closest('.channel-card');
        const iframe = card.querySelector('.video-iframe');
        const streamUrl = streamUrls[channelId];
        
        if (streamUrl && streamUrl !== `YOUR_STREAM_URL_${channelId}`) {
            // Hide placeholder and show iframe
            this.classList.add('hidden');
            iframe.src = streamUrl;
            iframe.classList.remove('hidden');
        } else {
            // Show alert if no stream URL is configured
            showNotification('El stream se está cargando...', 'info');
            
            // Simulate loading for demo purposes
            setTimeout(() => {
                showNotification('Conectando al canal en vivo...', 'success');
            }, 1500);
        }
    });
});

// ===== Fullscreen Modal =====
fullscreenButtons.forEach(button => {
    button.addEventListener('click', function() {
        const channelId = this.dataset.channel;
        const streamUrl = streamUrls[channelId];
        
        if (streamUrl && streamUrl !== `YOUR_STREAM_URL_${channelId}`) {
            fullscreenIframe.src = streamUrl;
            openFullscreenModal();
        } else {
            showNotification('Configura la URL del stream para ver en pantalla completa', 'warning');
        }
    });
});

function openFullscreenModal() {
    fullscreenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFullscreenModal() {
    fullscreenModal.classList.remove('active');
    fullscreenIframe.src = '';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeFullscreenModal);

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenModal.classList.contains('active')) {
        closeFullscreenModal();
    }
});

// Close modal when clicking outside content
fullscreenModal.addEventListener('click', (e) => {
    if (e.target === fullscreenModal) {
        closeFullscreenModal();
    }
});

// ===== Contact Form =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!data.name || !data.email || !data.message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Enviando...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Cerrar">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// ===== Scroll Reveal Animations =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.channel-card, .feature-card, .about-stat-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal', 'active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== Active Navigation Link =====
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;
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

window.addEventListener('scroll', setActiveNavLink);

// ===== Live Indicator Animation =====
function animateLiveIndicators() {
    const liveDots = document.querySelectorAll('.live-dot');
    liveDots.forEach(dot => {
        setInterval(() => {
            dot.style.opacity = dot.style.opacity === '0.3' ? '1' : '0.3';
        }, 500);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    handleNavbarScroll();
    revealOnScroll();
    setActiveNavLink();
    
    // Add reveal class to animated elements
    document.querySelectorAll('.channel-card, .feature-card, .about-stat-card').forEach(el => {
        el.classList.add('reveal');
    });
    
    console.log('🎬 StreamLive - Landing Page Initialized');
    console.log('📺 Configure your stream URLs in the streamUrls object');
});

// ===== Keyboard Accessibility =====
document.addEventListener('keydown', (e) => {
    // Tab navigation focus styles
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== Performance: Debounce scroll events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
const debouncedReveal = debounce(revealOnScroll, 50);
const debouncedActiveNav = debounce(setActiveNavLink, 50);

// Re-attach optimized scroll listeners
window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', revealOnScroll);
window.removeEventListener('scroll', setActiveNavLink);

window.addEventListener('scroll', debouncedNavbarScroll);
window.addEventListener('scroll', debouncedReveal);
window.addEventListener('scroll', debouncedActiveNav);
