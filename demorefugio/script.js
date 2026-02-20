/* ============================================
   Refugio Creativo - Landing Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar scroll effect ---
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // --- Mobile menu toggle ---
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Animated counters ---
  const counters = document.querySelectorAll(".counter-number");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10);
          let current = 0;
          const increment = Math.ceil(target / 60);

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = "+" + target;
              clearInterval(timer);
            } else {
              el.textContent = "+" + current;
            }
          }, 25);

          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // --- Scroll animations ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => scrollObserver.observe(el));

  // --- Testimonials slider ---
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".slider-dots button");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const nextBtn = document.querySelector(".slider-nav.next");
  let currentSlide = 0;
  let autoSlideInterval;

  function showSlide(index) {
    testimonialCards.forEach((card) => {
      card.classList.remove("active");
      card.classList.add("hidden");
    });
    dots.forEach((dot) => dot.classList.remove("active"));

    testimonialCards[index].classList.remove("hidden");
    testimonialCards[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % testimonialCards.length);
  }

  function prevSlide() {
    showSlide(
      (currentSlide - 1 + testimonialCards.length) % testimonialCards.length
    );
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      resetAutoSlide();
    });
  });

  if (testimonialCards.length > 0) {
    showSlide(0);
    startAutoSlide();
  }

  // --- Contact form submission via WhatsApp ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const telefono = document.getElementById("telefono").value;
      const curso = document.getElementById("curso").value;

      const message = `Hola! Mi nombre es ${nombre}. Me interesa el curso: ${curso}. Mi email es ${email} y mi telefono ${telefono}.`;
      window.open(
        `https://wa.me/5491100000000?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Show success feedback
      const btn = contactForm.querySelector(".btn-primary");
      const originalText = btn.textContent;
      btn.textContent = "Enviado!";
      btn.style.background = "#25D366";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
      }, 3000);
    });
  }
});
