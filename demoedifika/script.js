/* ============================================================================
   EDIFIKA DESARROLLOS - JAVASCRIPT
   Version estatica que replica exactamente la version React
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function () {
    initHeroAnimations();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initProjectModal();
    initWhatsAppButton();
});

/* ============================================================================
   HERO ANIMATIONS
   ============================================================================ */

function initHeroAnimations() {
    const heroLogo = document.querySelector('.hero-logo');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    setTimeout(() => {
        heroLogo.classList.add('animate-fade-in-up');
    }, 100);

    setTimeout(() => {
        heroTitle.classList.add('animate-fade-in-up');
    }, 200);

    setTimeout(() => {
        heroSubtitle.classList.add('animate-fade-in-up');
    }, 400);

    setTimeout(() => {
        heroCta.classList.add('animate-fade-in-up');
    }, 600);

    setTimeout(() => {
        scrollIndicator.classList.add('animate-fade-in');
    }, 1000);
}

/* ============================================================================
   HEADER SCROLL EFFECT
   ============================================================================ */

function initHeader() {
    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

/* ============================================================================
   MOBILE MENU
   ============================================================================ */

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

/* ============================================================================
   SMOOTH SCROLL
   ============================================================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
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
}

/* ============================================================================
   PROJECT DATA
   ============================================================================ */

const projectsData = {
    1: {
        id: 1,
        image: "images/proyecto-1.jpg",
        alt: "Casa moderna residencial",
        title: "Residencia Familiar Premium",
        category: "Casas",
        location: "Nordelta, Buenos Aires",
        year: "2024",
        area: "280 m2",
        description: "Vivienda unifamiliar de diseno contemporaneo con amplios espacios, doble altura en living, cocina integrada con isla central y jardin con piscina. Construccion con materiales de primera calidad y terminaciones premium.",
        features: [
            "Diseno arquitectonico personalizado",
            "Doble altura en living comedor",
            "Suite principal con vestidor y bano en suite",
            "Cocina gourmet con isla central",
            "Jardin paisajistico con piscina climatizada",
            "Sistema domotica integrado",
            "Garage para 2 vehiculos",
            "Paneles solares para agua caliente"
        ]
    },
    2: {
        id: 2,
        image: "images/proyecto-2.jpg",
        alt: "Edificio de departamentos",
        title: "Complejo Residencial Vista al Rio",
        category: "Edificios",
        location: "Puerto Madero, CABA",
        year: "2023",
        area: "4,500 m2",
        description: "Edificio residencial de 12 plantas con 48 unidades funcionales, amenities completos y vistas panoramicas al rio. Construccion de categoria premium con estandares internacionales de calidad.",
        features: [
            "48 departamentos de 1, 2 y 3 ambientes",
            "Amenities: gym, piscina, SUM, coworking",
            "Cocheras subterraneas con acceso directo",
            "Seguridad 24hs con control de acceso",
            "Certificacion LEED en sustentabilidad",
            "Fachada vidriada con DVH",
            "Sistema centralizado de aire acondicionado",
            "Espacios verdes en terraza"
        ]
    },
    3: {
        id: 3,
        image: "images/proyecto-3.jpg",
        alt: "Renovacion interior",
        title: "Renovacion Integral Penthouse",
        category: "Refacciones",
        location: "Palermo, CABA",
        year: "2024",
        area: "320 m2",
        description: "Remodelacion completa de penthouse con nuevo diseno interior, ampliacion de espacios y actualizacion de todas las instalaciones. Transformacion total manteniendo la estructura original.",
        features: [
            "Redistribucion completa de espacios",
            "Nueva cocina con electrodomesticos integrados",
            "3 banos renovados con porcelanato premium",
            "Pisos de roble europeo en todo el departamento",
            "Iluminacion LED con control inteligente",
            "Carpinterias de aluminio nuevas",
            "Terraza con deck y jacuzzi",
            "Sistema de calefaccion por losa radiante"
        ]
    },
    4: {
        id: 4,
        image: "images/proyecto-4.jpg",
        alt: "Instalacion de aberturas",
        title: "Proyecto Aberturas Completas",
        category: "Aberturas",
        location: "San Isidro, Buenos Aires",
        year: "2024",
        area: "450 m2 de aberturas",
        description: "Instalacion integral de sistema de aberturas de aluminio y PVC para residencia de alta gama. Incluye ventanas, puertas, cerramientos de balcon y sistema de oscurecimiento.",
        features: [
            "Ventanas de aluminio linea Modena",
            "Puertas corredizas con RPT (Ruptura Puente Termico)",
            "Cristales DVH con control solar",
            "Sistema de oscurecimiento automatizado",
            "Mosquiteros en todas las aberturas",
            "Cerramiento de balcon con vidrio templado",
            "Garantia de 10 anos en estructura",
            "Eficiencia energetica clase A"
        ]
    }
};

/* ============================================================================
   PROJECT MODAL
   ============================================================================ */

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const galleryItems = document.querySelectorAll('.gallery-item[data-project]');
    const closeBtn = document.getElementById('modalClose');
    const closeBtnSecondary = document.querySelector('.modal-close-btn');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (project) {
                openProjectModal(project);
            }
        });
    });
    
    closeBtn.addEventListener('click', closeProjectModal);
    closeBtnSecondary.addEventListener('click', closeProjectModal);
    backdrop.addEventListener('click', closeProjectModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.alt;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalLocation').textContent = project.location;
    document.getElementById('modalYear').textContent = project.year;
    document.getElementById('modalArea').textContent = project.area;
    document.getElementById('modalDescription').textContent = project.description;
    
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    const whatsappLink = document.getElementById('modalWhatsapp');
    const message = encodeURIComponent(`Hola EDIFIKA Desarrollos, me interesa conocer mas sobre el proyecto ${project.title}`);
    whatsappLink.href = `https://wa.me/5492241472227?text=${message}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================================================
   WHATSAPP FLOATING BUTTON
   ============================================================================ */

function initWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappFloat');
    
    function handleScroll() {
        if (window.scrollY > 300) {
            whatsappBtn.classList.add('visible');
        } else {
            whatsappBtn.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

console.log('EDIFIKA Desarrollos - Sitio Web Cargado');
