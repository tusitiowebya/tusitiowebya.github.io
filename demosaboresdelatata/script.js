/* ============================================
   SABORES DE LA TATA - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
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
            }
        });
    });
    
    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Create WhatsApp message
            let whatsappMessage = `¡Hola! Soy ${nombre}.\n\n`;
            whatsappMessage += `📞 Mi teléfono: ${telefono}\n`;
            whatsappMessage += `📋 Servicio de interés: ${getServiceName(servicio)}\n`;
            
            if (mensaje) {
                whatsappMessage += `\n💬 Mensaje: ${mensaje}`;
            }
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp
            window.open(`https://wa.me/5493364282072?text=${encodedMessage}`, '_blank');
            
            // Show success feedback
            showFormSuccess();
            
            // Reset form
            contactForm.reset();
        });
    }
    
    function getServiceName(value) {
        const services = {
            'empresa': 'Viandas para empresa',
            'particular': 'Viandas particulares',
            'evento': 'Catering para evento',
            'rotiseria': 'Rotisería',
            'mesa-salada': 'Mesa salada',
            'otro': 'Otro'
        };
        return services[value] || value;
    }
    
    function showFormSuccess() {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '✓ ¡Mensaje enviado!';
        btn.style.background = '#25D366';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 3000);
    }
    
    // ========================================
    // PARALLAX EFFECT FOR HERO (Optional, subtle)
    // ========================================
    const heroImg = document.querySelector('.hero-img');
    
    if (heroImg && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }
    
    // ========================================
    // GALLERY LIGHTBOX (Simple implementation)
    // ========================================
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
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${src}" alt="${alt}">
                </div>
            `;
            
            // Add styles
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 20px;
                cursor: zoom-out;
            `;
            
            const lightboxContent = lightbox.querySelector('.lightbox-content');
            lightboxContent.style.cssText = `
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            `;
            
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
            `;
            
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 5px 10px;
            `;
            
            // Add to body
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Animate in
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.transition = 'opacity 0.3s ease';
                lightbox.style.opacity = '1';
            }, 10);
            
            // Close handlers
            function closeLightbox() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
            
            lightbox.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', closeLightbox);
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeLightbox();
            }, { once: true });
        });
    });
    
    // ========================================
    // COUNTER ANIMATION FOR STATS
    // ========================================
    function animateCounter(element, target) {
        const duration = 2000;
        const step = (target / duration) * 16;
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
    
    // Observe the badge number
    const badgeNumber = document.querySelector('.badge-number');
    if (badgeNumber) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(badgeNumber, 50);
                    badgeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        badgeObserver.observe(badgeNumber);
    }
    
    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ========================================
    // LAZY LOADING FOR IMAGES
    // ========================================
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
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ========================================
    // HOVER EFFECTS ENHANCEMENT
    // ========================================
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // ========================================
    // PRELOADER (Optional - can be removed)
    // ========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        const heroElements = document.querySelectorAll('.hero .animate-fade-up');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // ========================================
    // TOUCH DEVICE DETECTION
    // ========================================
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // ========================================
    // KEYBOARD ACCESSIBILITY
    // ========================================
    document.addEventListener('keydown', function(e) {
        // Skip link functionality
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('🍕 Sabores de la Tata - Website loaded successfully!');
});
