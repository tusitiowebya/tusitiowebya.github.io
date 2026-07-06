(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* ---------------------------------------------------------
     Nav: solidify on scroll + mobile menu
  --------------------------------------------------------- */
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 60) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = $("[data-hamburger]");
    var mobile = $("[data-nav-mobile]");
    if (!burger || !mobile) return;
    var close = function () {
      burger.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      nav.classList.remove("force-solid");
      onScroll();
    };
    var open = function () {
      burger.setAttribute("aria-expanded", "true");
      mobile.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      nav.classList.add("force-solid");
    };
    burger.addEventListener("click", function () {
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) close(); else open();
    });
    $$("a", mobile).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------------------------------------------------
     Smooth anchor scrolling (native)
  --------------------------------------------------------- */
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 84;
      var top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------
     Tilt 3D + cursor halo on cards
  --------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".card, .course-item").forEach(function (card) {
      var MAX = 6;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength || "0.25");
      var inner = document.createElement("span");
      inner.className = "magnetic-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      el.classList.add("has-magnetic");
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) - r.width / 2) * strength;
        ty = ((e.clientY - r.top) - r.height / 2) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        inner.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------------------------------------------------------
     Marquee ticker
  --------------------------------------------------------- */
  function initMarquee() {
    $$("[data-marquee]").forEach(function (track) {
      var clone = track.cloneNode(true);
      clone.removeAttribute("data-marquee");
      clone.setAttribute("aria-hidden", "true");
      track.parentNode.appendChild(clone);
      var distance = track.scrollWidth;
      var speed = 42; // px/sec
      var duration = distance / speed;
      [track, clone].forEach(function (el, i) {
        el.style.animation = "marqueeScroll " + duration + "s linear infinite";
      });
      if (!document.getElementById("marquee-keyframes")) {
        var style = document.createElement("style");
        style.id = "marquee-keyframes";
        style.textContent = "@keyframes marqueeScroll { to { transform: translateX(-" + distance + "px); } }";
        document.head.appendChild(style);
      }
    });
  }

  /* ---------------------------------------------------------
     WhatsApp helpers
  --------------------------------------------------------- */
  function waLink(message) {
    var base = data.waBase || "https://wa.me/5491134981967";
    return base + "?text=" + encodeURIComponent(message);
  }

  function initServiceWhatsapp() {
    $$("[data-wa-service]").forEach(function (a) {
      var service = a.getAttribute("data-wa-service");
      a.href = waLink("Hola! Quiero consultar sobre " + service + ".");
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function initFloatingWhatsapp() {
    var el = $("[data-wa-float]");
    if (!el) return;
    el.href = waLink("Hola! Me gustaría recibir más información sobre la Escuela Argentina de Calidad de Vida.");
    el.target = "_blank";
    el.rel = "noopener";
  }

  /* ---------------------------------------------------------
     Contact form -> WhatsApp
  --------------------------------------------------------- */
  function setupContactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;
    var submitBtn = form.querySelector("[type=submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return;

      form.classList.add("is-sending");
      if (submitBtn) submitBtn.disabled = true;

      var name = form.elements.name.value.trim();
      var contact = form.elements.contact.value.trim();
      var service = form.elements.service.value;
      var message = form.elements.message.value.trim();

      var text = "Hola! Soy " + name + ".";
      if (service) text += " Me interesa: " + service + ".";
      if (message) text += " " + message;
      text += " (Contacto: " + contact + ")";

      setTimeout(function () {
        window.open(waLink(text), "_blank", "noopener");
        form.classList.remove("is-sending");
        if (submitBtn) submitBtn.disabled = false;
      }, 550);
    });
  }

  /* ---------------------------------------------------------
     Floating label state for <select>
  --------------------------------------------------------- */
  function initSelectLabels() {
    $$(".field select").forEach(function (sel) {
      var field = sel.closest(".field");
      var update = function () {
        if (sel.value) field.classList.add("has-value");
        else field.classList.remove("has-value");
      };
      update();
      sel.addEventListener("change", update);
    });
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initMarquee, "initMarquee");
    safe(initServiceWhatsapp, "initServiceWhatsapp");
    safe(initFloatingWhatsapp, "initFloatingWhatsapp");
    safe(setupContactForm, "setupContactForm");
    safe(initSelectLabels, "initSelectLabels");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
