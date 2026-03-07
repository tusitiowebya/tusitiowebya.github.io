// Navigation scroll effect
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll navigation
function scrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileMenu.classList.remove('active');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// WhatsApp
function openWhatsApp() {
    const whatsappUrl = "https://wa.me/5491160342764?text=Hola%20Agua%20Cimes%20Los%20Hermanos%2C%20quiero%20pedir%20agua";
    window.open(whatsappUrl, "_blank");
}

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email') || undefined,
        message: formData.get('message')
    };

    // Remove undefined email
    if (!data.email) {
        delete data.email;
    }

    try {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Enviando...';

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent = '✓ Mensaje enviado correctamente. Nos contactaremos pronto!';
            contactForm.reset();
            submitButton.textContent = '✉️ Enviar Mensaje';
            submitButton.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            formMessage.className = 'form-message error';
            formMessage.textContent = result.message || 'Error al enviar el mensaje. Intenta de nuevo.';
            submitButton.textContent = '✉️ Enviar Mensaje';
            submitButton.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Error de conexión. Intenta de nuevo o contactanos por WhatsApp.';
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.textContent = '✉️ Enviar Mensaje';
        submitButton.disabled = false;
    }
}

// Add subtle animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `slideInLeft 0.6s ease-out`;
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .service-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const navContainer = document.querySelector('.nav-container');
    const isClickInsideNav = navContainer.contains(event.target);
    
    if (!isClickInsideNav && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
});

// Add slide-in animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
