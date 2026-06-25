/* ============================================================
   OTSOBLACK™ — Coming Soon
   ============================================================ */
(function () {
  "use strict";

  var WA_NUMBER = "5493513084408"; // +54 9 351 308-4408

  function waLink(msg) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  /* ---- WhatsApp links (Contacto + iconos) ---- */
  document.querySelectorAll(".js-wa").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(
        waLink("Hola! Quiero más info sobre OTSOBLACK™ 🐻 ¿Cuándo es el lanzamiento?"),
        "_blank",
        "noopener"
      );
      closeMenu();
    });
  });

  /* ---- Email capture → WhatsApp ---- */
  var form = document.getElementById("signup");
  var email = document.getElementById("email");
  var hint = document.getElementById("hint");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (email.value || "").trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (!ok) {
        hint.textContent = "Ingresá un email válido para sumarte a la lista.";
        hint.style.color = "#d98b6a";
        email.focus();
        return;
      }
      hint.textContent = "¡Listo! Te llevamos a WhatsApp para confirmar tu lugar…";
      hint.style.color = "";
      window.open(
        waLink("Hola OTSOBLACK™! Quiero ser parte del lanzamiento. Mi email: " + val),
        "_blank",
        "noopener"
      );
      form.reset();
    });
  }

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var mobile = document.getElementById("mobile");

  function openMenu() {
    mobile.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!mobile) return;
    mobile.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger) {
    burger.addEventListener("click", function () {
      mobile.hidden ? openMenu() : closeMenu();
    });
  }
  document.querySelectorAll(".js-close").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Scroll reveal ---- */
  var targets = [
    ".eyebrow", ".display", ".claw", ".tagline",
    ".lede", ".features", ".signup"
  ];
  var els = [];
  targets.forEach(function (sel, i) {
    var n = document.querySelector(sel);
    if (n) { n.classList.add("reveal"); n.style.transitionDelay = (0.12 * i) + "s"; els.push(n); }
  });

  function reveal() {
    document.documentElement.classList.add("is-loaded");
    els.forEach(function (n) { n.classList.add("in"); });
  }

  if ("requestAnimationFrame" in window) {
    requestAnimationFrame(function () { setTimeout(reveal, 60); });
  } else {
    reveal();
  }
})();
