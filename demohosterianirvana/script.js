// ============================================
// Hosteria Nirvana - Script
// ============================================

(function () {
  "use strict";

  // --- Mobile menu toggle ---
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("open");
      menuIcon.style.display = isOpen ? "none" : "block";
      closeIcon.style.display = isOpen ? "block" : "none";
      mobileToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menu" : "Abrir menu"
      );
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuIcon.style.display = "block";
        closeIcon.style.display = "none";
        mobileToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  // --- WhatsApp floating button (show after scroll) ---
  const whatsappFloat = document.getElementById("whatsappFloat");

  if (whatsappFloat) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 400) {
          whatsappFloat.classList.add("visible");
        } else {
          whatsappFloat.classList.remove("visible");
        }
      },
      { passive: true }
    );
  }

  // --- Contact form -> WhatsApp ---
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const telefono = document.getElementById("telefono").value;
      const email = document.getElementById("email").value;
      const fechaDesde = document.getElementById("fechaDesde").value;
      const fechaHasta = document.getElementById("fechaHasta").value;
      const adultos = document.getElementById("adultos").value;
      const ninos = document.getElementById("ninos").value;
      const consulta = document.getElementById("consulta").value;

      const message =
        "Hola, quisiera hacer una reserva:\n\n" +
        "Nombre: " + nombre + "\n" +
        "Telefono: " + telefono + "\n" +
        "Email: " + email + "\n" +
        "Fecha desde: " + fechaDesde + "\n" +
        "Fecha hasta: " + fechaHasta + "\n" +
        "Adultos: " + adultos + "\n" +
        "Ninos: " + ninos + "\n" +
        "Consulta: " + consulta;

      const encoded = encodeURIComponent(message);
      window.open("https://wa.me/5492255405324?text=" + encoded, "_blank");
    });
  }

  // --- Smooth scroll for anchor links (fallback for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
