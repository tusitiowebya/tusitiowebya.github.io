/* ==========================================
   Laura Indumentaria Femenina - JavaScript
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // Navbar Scroll Effect
  // ==========================================
  const navbar = document.querySelector(".navbar");

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuIcon.style.display = isOpen ? "none" : "block";
      closeIcon.style.display = isOpen ? "block" : "none";
      mobileToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menu" : "Abrir menu"
      );
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuIcon.style.display = "block";
        closeIcon.style.display = "none";
      });
    });
  }

  // ==========================================
  // Intersection Observer - Fade Up Animations
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });

  // ==========================================
  // WhatsApp FAB Visibility
  // ==========================================
  const whatsappFab = document.querySelector(".whatsapp-fab");

  function handleFabScroll() {
    if (window.scrollY > 400) {
      whatsappFab.classList.add("visible");
    } else {
      whatsappFab.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleFabScroll);
  handleFabScroll();

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos =
          target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
});
