document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;
            
            // Format message for WhatsApp
            const text = `Hola! Soy ${name}.%0A%0AMe comunico para solicitar un traslado el día ${date}.%0A%0A*Detalles / Itinerario:*%0A${message}%0A%0A*Mi teléfono es:* ${phone}`;
            
            // Change button state to show loading/sent
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Redirigiendo a WhatsApp...</span><i data-lucide="check" class="w-5 h-5"></i>';
            lucide.createIcons();
            
            // Simulate processing then redirect to WhatsApp
            setTimeout(() => {
                // Replace with actual WhatsApp number
                const waNumber = '549XXXXXXXXXX'; 
                window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
                
                // Reset form and button
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                lucide.createIcons();
            }, 1000);
        });
    }
});