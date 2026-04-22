(function () {
  'use strict';

  // Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Animated speed counter in hero card
  var speedValue = document.getElementById('speedValue');
  var speedFill  = document.getElementById('speedFill');
  if (speedValue && speedFill) {
    var target = 987;
    var current = 0;
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      // ease-out
      var eased = 1 - Math.pow(1 - p, 3);
      current = Math.round(target * eased);
      speedValue.textContent = current.toLocaleString('es-AR');
      speedFill.style.width = (eased * 98) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    // Start when hero is roughly visible
    setTimeout(function () { requestAnimationFrame(step); }, 350);
  }

  // Smooth-scroll fallback for anchor links (older Safari)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
