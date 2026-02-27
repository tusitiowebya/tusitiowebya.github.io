// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", function () {
  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById("navbar");

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll);
  handleNavScroll();

  // ===== MOBILE MENU TOGGLE =====
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const iconMenu = document.getElementById("iconMenu");
  const iconClose = document.getElementById("iconClose");

  navToggle.addEventListener("click", function () {
    const isOpen = mobileMenu.classList.toggle("open");
    iconMenu.style.display = isOpen ? "none" : "block";
    iconClose.style.display = isOpen ? "block" : "none";
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menu" : "Abrir menu"
    );
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      iconMenu.style.display = "block";
      iconClose.style.display = "none";
    });
  });

  // ===== HERO PARALLAX OVERLAY =====
  const heroOverlay = document.getElementById("heroOverlay");

  function handleHeroParallax() {
    if (heroOverlay) {
      const opacity = 0.55 + window.scrollY * 0.001;
      heroOverlay.style.opacity = Math.min(opacity, 1);
    }
  }

  window.addEventListener("scroll", handleHeroParallax);

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll(".scroll-reveal");

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ===== GALLERY LIGHTBOX =====
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const gallerySources = [];
  galleryItems.forEach(function (item) {
    const img = item.querySelector("img");
    gallerySources.push({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
    });
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = gallerySources[index].src;
    lightboxImage.alt = gallerySources[index].alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function goPrev() {
    currentIndex =
      (currentIndex - 1 + gallerySources.length) % gallerySources.length;
    lightboxImage.src = gallerySources[currentIndex].src;
    lightboxImage.alt = gallerySources[currentIndex].alt;
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % gallerySources.length;
    lightboxImage.src = gallerySources[currentIndex].src;
    lightboxImage.alt = gallerySources[currentIndex].alt;
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightboxPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    goPrev();
  });

  lightboxNext.addEventListener("click", function (e) {
    e.stopPropagation();
    goNext();
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const tipoObra = document.getElementById("tipoObra").value;
    const mensaje = document.getElementById("mensaje").value;

    const text =
      "Hola Elias, soy " +
      nombre +
      ". Necesito un presupuesto para: " +
      tipoObra +
      ". " +
      mensaje +
      ". Mi telefono: " +
      telefono;

    window.open(
      "https://wa.me/5491138541993?text=" + encodeURIComponent(text),
      "_blank"
    );
  });

  // ===== FOOTER YEAR =====
  var yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== SMOOTH SCROLL (fallback for older browsers) =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
