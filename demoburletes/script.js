/* ============================================
   burletes_vyk — Landing Page Scripts
   ============================================ */

(function () {
  "use strict";

  /* ---- WHATSAPP CONFIG ---- */
  var WA_NUMBER = "5491100000000"; // Reemplaza con el numero real
  var WA_MSG = encodeURIComponent("Hola! Quiero info sobre los burletes");
  var WA_URL = "https://wa.me/" + WA_NUMBER + "?text=" + WA_MSG;

  /* ---- SCROLL REVEAL ---- */
  function initScrollReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- STICKY NAVBAR SHADOW ---- */
  function initNavbarScroll() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.12)";
      } else {
        navbar.style.boxShadow = "none";
      }
    }, { passive: true });
  }

  /* ---- SET ALL WHATSAPP LINKS ---- */
  function setWhatsAppLinks() {
    var links = document.querySelectorAll("[data-wa]");
    links.forEach(function (link) {
      link.href = WA_URL;
    });
  }

  /* ---- MOBILE URGENCY BAR MARQUEE EFFECT ---- */
  function isMobile() {
    return window.innerWidth < 600;
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el, target, duration) {
    var start = 0;
    var increment = target / (duration / 16);
    var timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start).toLocaleString("es-AR");
    }, 16);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute("data-counter"), 10);
            animateCounter(el, target, 1800);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          var offset = 72;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      });
    });
  }

  /* ---- COLOR CHIP SELECTOR ---- */
  function initColorSelector() {
    var chips = document.querySelectorAll(".color-chip-btn");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("selected"); });
        this.classList.add("selected");
      });
    });
  }

  /* ---- INIT ---- */
  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initNavbarScroll();
    setWhatsAppLinks();
    initCounters();
    initSmoothScroll();
    initColorSelector();
  });
})();
