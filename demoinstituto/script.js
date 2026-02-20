/* =============================================
   Instituto PC Training - Landing Page Scripts
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. Navbar Scroll Effect
  // =========================================
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // =========================================
  // 2. Mobile Menu Toggle
  // =========================================
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  let menuOpen = false;

  mobileToggle.addEventListener("click", function () {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    menuIcon.style.display = menuOpen ? "none" : "block";
    closeIcon.style.display = menuOpen ? "block" : "none";
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".mobile-menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      menuIcon.style.display = "block";
      closeIcon.style.display = "none";
    });
  });

  // =========================================
  // 3. Scroll Animations (Fade In)
  // =========================================
  const fadeElements = document.querySelectorAll(".fade-in");

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // =========================================
  // 4. Animated Counters
  // =========================================
  const counters = document.querySelectorAll(".counter");
  const counterAnimated = new Set();

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterAnimated.has(entry.target)) {
          counterAnimated.add(entry.target);
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const suffix = element.getAttribute("data-suffix") || "";
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    function update() {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // =========================================
  // 5. Contact Form Validation
  // =========================================
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("form-name").value.trim();
      const phone = document.getElementById("form-phone").value.trim();
      const email = document.getElementById("form-email").value.trim();
      const course = document.getElementById("form-course").value;
      const message = document.getElementById("form-message-text").value.trim();

      // Basic validation
      if (!name || !phone || !email || !course) {
        showFormMessage("error", "Por favor completa todos los campos requeridos.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage("error", "Por favor ingresa un email valido.");
        return;
      }

      // Build WhatsApp message
      const msg =
        "Hola, soy " +
        name +
        ". Tel: " +
        phone +
        ". Email: " +
        email +
        ". Me interesa: " +
        course +
        ". " +
        message;

      showFormMessage("success", "Redirigiendo a WhatsApp...");

      setTimeout(function () {
        window.open(
          "https://wa.me/56965692422?text=" + encodeURIComponent(msg),
          "_blank"
        );
      }, 500);
    });
  }

  function showFormMessage(type, text) {
    if (!formMessage) return;
    formMessage.className = "form-message " + type;
    formMessage.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      (type === "success"
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>') +
      "</svg>" +
      text;
    formMessage.style.display = "flex";

    setTimeout(function () {
      formMessage.style.display = "none";
    }, 4000);
  }

  // =========================================
  // 6. Smooth Scroll for Anchor Links
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
