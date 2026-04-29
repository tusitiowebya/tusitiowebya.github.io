/* =========================================================
   Mueblería Renacer — script.js
========================================================= */

(function () {
  'use strict';

  // ---- NAV scroll background ----
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (!nav) return;
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu toggle ----
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- Lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.removeAttribute('hidden');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightbox.setAttribute('hidden', '');
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  }

  // Event delegation: works for any child element clicked inside [data-img]
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-img]') : null;
    if (!trigger) return;
    e.preventDefault();
    var src = trigger.getAttribute('data-img');
    var img = trigger.querySelector('img');
    var alt = img ? img.getAttribute('alt') : '';
    openLightbox(src, alt);
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- Smooth anchor scroll with nav offset ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ---- Contact form -> WhatsApp ----
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  function showNote(message, kind) {
    if (!note) return;
    note.hidden = false;
    note.textContent = message;
    note.className = 'form-note ' + (kind || '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      if (!name || !phone || !message) {
        showNote('Completá todos los campos para continuar.', 'error');
        return;
      }

      var text =
        'Hola Mueblería Renacer! Soy ' +
        name +
        ' (Tel: ' +
        phone +
        ').\n\n' +
        message;
      var url = 'https://wa.me/5491156350158?text=' + encodeURIComponent(text);

      showNote('¡Listo! Te redirigimos a WhatsApp para enviar tu mensaje.', 'success');
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }
})();
