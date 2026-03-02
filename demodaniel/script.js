/* ========================================
   Daniel Producciones - script.js
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ---- Navbar scroll effect ----
  const navbar = document.querySelector(".navbar");
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  // ---- Mobile menu toggle ----
  const toggleBtn = document.querySelector(".navbar-toggle");
  const mobileMenu = document.querySelector(".navbar-mobile");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  toggleBtn.addEventListener("click", function () {
    const isOpen = mobileMenu.classList.toggle("open");
    menuIcon.style.display = isOpen ? "none" : "block";
    closeIcon.style.display = isOpen ? "block" : "none";
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      menuIcon.style.display = "block";
      closeIcon.style.display = "none";
    });
  });

  // ---- Scroll animations (IntersectionObserver) ----
  const fadeElements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, parseInt(delay));
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // ---- Sparkle particles ----
  const sparkleContainer = document.querySelector(".hero-sparkles");
  if (sparkleContainer) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      dot.className = "sparkle-dot";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.top = Math.random() * 100 + "%";
      dot.style.opacity = Math.random() * 0.5 + 0.1;
      dot.style.animation =
        "sparkle " +
        (2 + Math.random() * 4) +
        "s ease-in-out infinite";
      dot.style.animationDelay = Math.random() * 3 + "s";
      sparkleContainer.appendChild(dot);
    }
  }

  // ---- Contact form -> WhatsApp ----
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value;
      const evento = document.getElementById("evento").value;
      const fecha = document.getElementById("fecha").value || "A definir";
      const mensaje = document.getElementById("mensaje").value;

      const text =
        "Hola! Soy " +
        nombre +
        ". Estoy interesado/a en organizar un evento de tipo: " +
        evento +
        ". Fecha estimada: " +
        fecha +
        ". " +
        mensaje;

      const url =
        "https://wa.me/5491100000000?text=" + encodeURIComponent(text);
      window.open(url, "_blank");
    });
  }
});
