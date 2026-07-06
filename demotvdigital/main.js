(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  function initNav() {
    var burger = $("[data-nav-burger]");
    var mobile = $("[data-nav-mobile]");
    if (!burger || !mobile) return;
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", mobile).forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 92;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  function initReveals() {
    var targets = $$("[data-reveal]");
    if (!targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    targets.forEach(function (t) { io.observe(t); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  function initTilt() {
    if (!fineHover || reduced) return;
    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(700px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 6) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseout", function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = "";
      });
    });
  }

  function initMagnetic() {
    if (!fineHover || reduced) return;
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.25;
        var my = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = "translate(" + mx + "px," + my + "px)";
      });
      btn.addEventListener("mouseout", function () { btn.style.transform = ""; });
    });
  }

  function initNavShrink() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initFooterYear() {
    var el = $("[data-year]");
    if (!el) return;
    var brand = window.__BRAND__ || {};
    el.textContent = brand.year || new Date().getFullYear();
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initNavShrink, "initNavShrink");
    safe(setupSmoothScroll, "setupSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initFooterYear, "initFooterYear");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
