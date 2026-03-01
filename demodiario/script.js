/* ==========================================
   Diario Popular San Juan - JavaScript
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ---- Mobile Menu Toggle ----
  const navbarToggle = document.getElementById("navbarToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const iconMenu = navbarToggle.querySelector(".icon-menu");
  const iconClose = navbarToggle.querySelector(".icon-close");

  navbarToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    iconMenu.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);
    navbarToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menu" : "Abrir menu"
    );
  });

  // Close mobile menu on link click
  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      iconMenu.classList.remove("hidden");
      iconClose.classList.add("hidden");
    });
  });

  // ---- Breaking News Slider ----
  const breakingNews = [
    "URGENTE: Nuevas obras de infraestructura para San Juan ya en marcha",
    "El gobernador anuncia plan de modernizacion educativa provincial",
    "San Juan lidera produccion vinicola a nivel nacional este trimestre",
    "Deportes: Seleccion sanjuanina clasifica a semifinales nacionales",
  ];

  let currentSlide = 0;
  const breakingText = document.getElementById("breakingText");
  const breakingPrev = document.getElementById("breakingPrev");
  const breakingNext = document.getElementById("breakingNext");

  function updateBreakingNews() {
    breakingText.style.opacity = "0";
    setTimeout(() => {
      breakingText.textContent = breakingNews[currentSlide];
      breakingText.style.opacity = "1";
    }, 200);
  }

  breakingPrev.addEventListener("click", () => {
    currentSlide =
      (currentSlide - 1 + breakingNews.length) % breakingNews.length;
    updateBreakingNews();
  });

  breakingNext.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % breakingNews.length;
    updateBreakingNews();
  });

  // Auto-rotate breaking news
  setInterval(() => {
    currentSlide = (currentSlide + 1) % breakingNews.length;
    updateBreakingNews();
  }, 4000);

  breakingText.style.transition = "opacity 0.2s ease";

  // ---- Image Gallery Modal ----
  const galleryImages = [
    { src: "images/gallery-1.jpg", alt: "Vinedos de San Juan al atardecer" },
    {
      src: "images/gallery-2.jpg",
      alt: "Arquitectura colonial sanjuanina",
    },
    {
      src: "images/gallery-3.jpg",
      alt: "Festival folclorico en San Juan",
    },
    { src: "images/gallery-4.jpg", alt: "Ruta 40 y paisaje cordillerano" },
    {
      src: "images/gallery-5.jpg",
      alt: "Mercado local de productos frescos",
    },
    {
      src: "images/gallery-6.jpg",
      alt: "Panoramica de la ciudad de San Juan",
    },
  ];

  let selectedIndex = null;
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalClose = document.getElementById("modalClose");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");

  function openModal(index) {
    selectedIndex = index;
    modalImage.src = galleryImages[index].src;
    modalImage.alt = galleryImages[index].alt;
    modalCaption.textContent = galleryImages[index].alt;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    selectedIndex = null;
  }

  function prevImage() {
    if (selectedIndex === null) return;
    selectedIndex =
      (selectedIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImage.src = galleryImages[selectedIndex].src;
    modalImage.alt = galleryImages[selectedIndex].alt;
    modalCaption.textContent = galleryImages[selectedIndex].alt;
  }

  function nextImage() {
    if (selectedIndex === null) return;
    selectedIndex = (selectedIndex + 1) % galleryImages.length;
    modalImage.src = galleryImages[selectedIndex].src;
    modalImage.alt = galleryImages[selectedIndex].alt;
    modalCaption.textContent = galleryImages[selectedIndex].alt;
  }

  document.querySelectorAll(".masonry-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = parseInt(item.getAttribute("data-index"), 10);
      openModal(index);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });
  modalNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation for modal
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });

  // ---- Animated Counters ----
  const statCards = document.querySelectorAll(".stat-card");
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statCards.forEach((card) => {
      const target = parseInt(card.getAttribute("data-target"), 10);
      const suffix = card.getAttribute("data-suffix") || "";
      const valueEl = card.querySelector(".stat-value");
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        valueEl.textContent =
          Math.floor(current).toLocaleString("es-AR") + suffix;
      }, 16);
    });
  }

  // Intersection Observer for counters
  const aboutSection = document.getElementById("nosotros");
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(aboutSection);
  }

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
