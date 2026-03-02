/* ===== JJ Redes de Proteccion - Main Script ===== */

document.addEventListener("DOMContentLoaded", () => {
  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById("navbar");
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("mobile-open");
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("mobile-open");
    });
  });

  // ===== WHATSAPP FLOATING BUTTON =====
  const whatsappFloat = document.getElementById("whatsappFloat");
  const handleWhatsAppVisibility = () => {
    if (window.scrollY > 400) {
      whatsappFloat.classList.add("visible");
    } else {
      whatsappFloat.classList.remove("visible");
    }
  };
  window.addEventListener("scroll", handleWhatsAppVisibility);
  handleWhatsAppVisibility();

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const galleryItems = document.querySelectorAll(".gallery-item");

  const galleryImages = [
    { src: "images/gallery-1.jpg", alt: "Instalacion de red en balcon" },
    { src: "images/gallery-2.jpg", alt: "Redes en ventanas de edificio" },
    { src: "images/gallery-3.jpg", alt: "Red de proteccion en terraza" },
    { src: "images/gallery-4.jpg", alt: "Detalle de anclajes profesionales" },
    { src: "images/gallery-5.jpg", alt: "Cerco de seguridad para pileta" },
    { src: "images/gallery-6.jpg", alt: "Red en escalera interior" },
  ];

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = galleryImages[index].src;
    lightboxImage.alt = galleryImages[index].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
    lightboxImage.alt = galleryImages[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
    lightboxImage.alt = galleryImages[currentIndex].alt;
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const index = parseInt(item.dataset.index, 10);
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const zona = document.getElementById("zona").value;
    const mensaje = document.getElementById("mensaje").value;

    const text = `Hola! Soy ${nombre}. Telefono: ${telefono}. Zona: ${zona}. ${mensaje}`;
    window.open(
      `https://wa.me/5491533980947?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach((el) => el.classList.add("visible"));
  }

  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
