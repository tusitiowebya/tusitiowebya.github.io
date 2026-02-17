/* ============================================
   FerreOnline 1365 - JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---------- Product Data ----------
  const productos = [
    {
      nombre: 'Aspiradora Industrial',
      precio: '$189.990',
      imagen: 'img/aspiradora.jpg',
      badge: 'Destacado',
    },
    {
      nombre: 'Taladro Inalámbrico',
      precio: '$74.990',
      imagen: 'img/taladro.jpg',
      badge: 'Popular',
    },
    {
      nombre: 'Hidrolavadora',
      precio: '$249.990',
      imagen: 'img/hidrolavadora.jpg',
      badge: 'Oferta',
    },
    {
      nombre: 'Bolso Porta Herramientas',
      precio: '$34.990',
      imagen: 'img/bolso.jpg',
      badge: 'Nuevo',
    },
  ];

  // ---------- Render Products ----------
  function renderProductos() {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;

    var html = '';
    productos.forEach(function (prod, i) {
      html +=
        '<div class="product-card scroll-reveal" style="transition-delay: ' +
        i * 0.1 +
        's">' +
        '  <div class="product-img-wrapper">' +
        '    <img src="' + prod.imagen + '" alt="' + prod.nombre + '" loading="lazy" />' +
        '    <span class="product-badge">' + prod.badge + '</span>' +
        '  </div>' +
        '  <div class="product-info">' +
        '    <h3>' + prod.nombre + '</h3>' +
        '    <span class="product-price">' + prod.precio + '</span>' +
        '    <button class="product-btn" onclick="window.open(\'https://wa.me/5493455000000?text=Hola! Me interesa el producto: ' + encodeURIComponent(prod.nombre) + '\', \'_blank\')">' +
        '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '      Consultar' +
        '    </button>' +
        '  </div>' +
        '</div>';
    });

    grid.innerHTML = html;
  }

  // ---------- Scroll Reveal Animation ----------
  function initScrollReveal() {
    var elements = document.querySelectorAll('.scroll-reveal');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---------- Navbar Scroll Effect ----------
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---------- Mobile Menu Toggle ----------
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });

    // Close menu when clicking a link
    var links = menu.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.getElementById('navbar').offsetHeight;
          var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ---------- Dynamic Footer Year ----------
  function setFooterYear() {
    var yearEl = document.getElementById('footerYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ---------- Active Nav Link on Scroll ----------
  function initActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.style.color = '';
            link.style.background = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = '#60a5fa';
            }
          });
        }
      });
    });
  }

  // ---------- Init Everything ----------
  document.addEventListener('DOMContentLoaded', function () {
    renderProductos();
    setFooterYear();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLink();

    // Delay scroll reveal slightly to allow products to render
    setTimeout(function () {
      initScrollReveal();
    }, 100);
  });
})();
