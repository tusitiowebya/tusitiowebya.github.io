// ─── Scroll-triggered animations via IntersectionObserver ──────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add("visible");
        revealObserver.unobserve(target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => {
  revealObserver.observe(el);
});

// ─── Sticky nav background ──────────────────────────────────────────────────
const nav = document.getElementById("nav");
const handleScroll = () => {
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", handleScroll, { passive: true });

// ─── Mobile menu ────────────────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
});

// Close mobile menu on link click
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

// ─── Smooth scroll for all internal anchors ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ─── Hero parallax (subtle) ──────────────────────────────────────────────────
const heroBg = document.querySelector(".hero-bg img");
if (heroBg) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroH = document.getElementById("hero").offsetHeight;
    if (scrolled < heroH) {
      heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

// ─── Contact form submit feedback ───────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".btn-submit");
    const original = btn.textContent;
    btn.textContent = "Mensaje enviado";
    btn.style.background = "#2d6a2d";
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = "";
      contactForm.reset();
    }, 3000);
  });
}
