// ========== GMCOMEX - Script Principal ==========

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Navbar scroll effect ----------
  const navbar = document.getElementById("navbar");
  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleNavScroll);
  handleNavScroll();

  // ---------- Hamburger mobile menu ----------
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("open");
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("open");
      });
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ---------- Active nav link highlighting ----------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-links a");

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbar.offsetHeight - 20;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNav);
  highlightNav();

  // ---------- Scroll fade-up animations ----------
  const fadeElements = document.querySelectorAll(".fade-up");
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // ---------- Contact form handler ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const empresa = document.getElementById("empresa").value.trim();
      const email = document.getElementById("email").value.trim();
      const consulta = document.getElementById("consulta").value.trim();

      if (!nombre || !email || !consulta) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
      }

      // Build WhatsApp message
      let message = `Hola, soy ${nombre}`;
      if (empresa) message += ` de ${empresa}`;
      message += `.%0AMi email es: ${email}%0AConsulta: ${consulta}`;

      const whatsappUrl = `https://wa.me/5491162876476?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      // Show success feedback
      const submitBtn = contactForm.querySelector(".btn-submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Enviado por WhatsApp
      `;
      submitBtn.style.backgroundColor = "#16a34a";
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = "";
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ---------- Footer year ----------
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = `\u00A9 ${new Date().getFullYear()} GMCOMEX. Todos los derechos reservados.`;
  }

  // ---------- Scroll indicator hide on scroll ----------
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        scrollIndicator.style.opacity = "0";
      } else {
        scrollIndicator.style.opacity = "1";
      }
    });
  }
});
