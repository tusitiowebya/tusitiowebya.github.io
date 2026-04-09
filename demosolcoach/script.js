/* ========================================
   SOL RAMÍREZ - COACH ONTOLÓGICA
   script.js
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- NAVBAR: Scroll behavior ---- */
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* ---- MOBILE MENU ---- */
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* ---- SCROLL REVEAL ANIMATIONS ---- */
  const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  function checkReveal() {
    reveals.forEach(function (el) {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 80;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkReveal);
  checkReveal(); // Run on load for elements already in view

  /* ---- STAGGERED ANIMATIONS ---- */
  function applyStagger(selector, delay) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      el.style.transitionDelay = (index * delay) + "s";
    });
  }

  applyStagger(".service-card.reveal", 0.15);
  applyStagger(".benefit-card.reveal", 0.1);
  applyStagger(".testimonial-card.reveal", 0.2);

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    });
  });

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || nombre.length < 2) {
        showError("nombre", "Por favor ingresa tu nombre.");
        return;
      }

      if (!mensaje || mensaje.length < 10) {
        showError("mensaje", "El mensaje debe ser más largo.");
        return;
      }

      clearErrors();

      // Simulated form submission
      contactForm.style.display = "none";
      if (formSuccess) {
        formSuccess.style.display = "block";
      }
    });
  }

  function showError(fieldId, message) {
    clearErrors();
    const field = document.getElementById(fieldId);
    const errorEl = document.createElement("p");
    errorEl.className = "form-error";
    errorEl.style.cssText = "color: #e05c5c; font-size: 0.8rem; margin-top: 0.35rem;";
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
  }

  function clearErrors() {
    document.querySelectorAll(".form-error").forEach(function (el) {
      el.remove();
    });
  }

  /* ---- ACTIVE NAV LINK on scroll ---- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-links a, .mobile-menu a");

  function highlightActiveNav() {
    let current = "";
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navbar.offsetHeight - 40;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.style.color = "";
      if (link.getAttribute("href") === "#" + current) {
        link.style.color = "#d4b896";
      }
    });
  }

  window.addEventListener("scroll", highlightActiveNav);

});
