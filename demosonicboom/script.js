/* ============================================================
   SonicBoom — landing interactivity
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Config ---------- */
  // Cambiá este número por el de WhatsApp real (formato internacional, sin "+" ni espacios).
  // Ej: Argentina con código de país 54 + 9 + área + número.
  var WA_NUMBER = "5491100000000";

  /* ---------- WhatsApp links ---------- */
  function buildWaLink(message) {
    var msg = encodeURIComponent(message || "Hola, quiero contratar un servicio de SonicBoom");
    return "https://wa.me/" + WA_NUMBER + "?text=" + msg;
  }

  function setupWhatsAppLinks() {
    var links = document.querySelectorAll(".js-wa");
    links.forEach(function (el) {
      var msg = el.getAttribute("data-msg") || "Hola, quiero contratar un servicio de SonicBoom";
      el.setAttribute("href", buildWaLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------- Scroll reveal ---------- */
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Header on scroll ---------- */
  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]:not(.js-wa)').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    setupWhatsAppLinks();
    setupReveal();
    setupHeader();
    setupSmoothAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
