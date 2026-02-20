/* ================================================
   Suenos de Colores Anita - script.js
   ================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ---- Navbar scroll effect ----
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ---- Hamburger menu ----
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  // Close mobile menu when clicking a link
  var mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  // ---- Confetti canvas ----
  var canvas = document.getElementById("confetti-canvas");
  var ctx = canvas.getContext("2d");
  var colors = ["#FF1493", "#00CED1", "#FFD700", "#8A2BE2", "#87CEEB"];
  var confetti = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  for (var i = 0; i < 60; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.5,
      rot: Math.random() * 360,
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(function (c) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rot * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(-c.r / 2, -c.r, c.r, c.r * 2);
      ctx.restore();
      c.x += c.vx;
      c.y += c.vy;
      c.rot += 2;
      if (c.y > canvas.height + 20) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawConfetti);
  }
  drawConfetti();

  // ---- Products Grid ----
  var products = [
    {
      title: "Globos Personalizados",
      desc: "Arcos, bouquets y figuras con globos para cada tematica.",
      img: "images/globos.jpg",
    },
    {
      title: "Pinatas Tematicas",
      desc: "Pinatas artesanales de todos los personajes y formas.",
      img: "images/pinata.jpg",
    },
    {
      title: "Figuras en Goma Eva",
      desc: "Centros de mesa, carteleria y figuras decorativas hechas a mano.",
      img: "images/goma-eva.jpg",
    },
    {
      title: "Decoracion Completa",
      desc: "Ambientaciones integrales para el cumple perfecto.",
      img: "images/decoracion.jpg",
    },
    {
      title: "Banderines y Guirnaldas",
      desc: "Banderines, guirnaldas y carteleria personalizada.",
      img: "images/banderines.jpg",
    },
    {
      title: "Bengalas y Velas",
      desc: "Bengalas frias, velas de cumple y efectos especiales.",
      img: "images/bengalas.jpg",
    },
  ];

  var productsGrid = document.getElementById("products-grid");
  products.forEach(function (p, idx) {
    var card = document.createElement("div");
    card.className = "product-card";
    card.style.transitionDelay = idx * 100 + "ms";
    card.innerHTML =
      '<div class="product-card-img"><img src="' + p.img + '" alt="' + p.title + '" loading="lazy" /></div>' +
      '<div class="product-card-body">' +
      "<h3>" + p.title + "</h3>" +
      "<p>" + p.desc + "</p>" +
      '<a href="https://wa.me/5491126812615?text=Hola!%20Quiero%20consultar%20por%20' + encodeURIComponent(p.title) + '" target="_blank" rel="noopener noreferrer" class="btn-consultar">Consultar</a>' +
      "</div>";
    productsGrid.appendChild(card);
  });

  // ---- Why Us Grid ----
  var reasons = [
    {
      title: "Disenos Personalizados",
      desc: "Creamos cada detalle a medida para que tu fiesta sea unica e irrepetible.",
      color: "#FF1493",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>',
    },
    {
      title: "Atencion Directa",
      desc: "Hablanos por WhatsApp y te asesoramos al instante. Respuesta rapida garantizada.",
      color: "#00CED1",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    },
    {
      title: "Precios Accesibles",
      desc: "Opciones para todos los presupuestos sin resignar calidad ni creatividad.",
      color: "#FFD700",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    },
    {
      title: "Entregas en Ezeiza",
      desc: "Llevamos tu pedido a Ezeiza y alrededores. Tambien podes retirar por nuestro taller.",
      color: "#8A2BE2",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    },
  ];

  var whyUsGrid = document.getElementById("why-us-grid");
  reasons.forEach(function (r, idx) {
    var card = document.createElement("div");
    card.className = "why-card";
    card.style.transitionDelay = idx * 150 + "ms";
    card.style.borderTop = "4px solid " + r.color;
    card.innerHTML =
      '<div class="why-card-icon" style="background:' + r.color + '15;color:' + r.color + '">' + r.icon + "</div>" +
      "<h3>" + r.title + "</h3>" +
      "<p>" + r.desc + "</p>";
    whyUsGrid.appendChild(card);
  });

  // ---- Gallery Grid ----
  var galleryImages = [
    { src: "images/gallery1.jpg", alt: "Decoracion de cumpleanos con arco de globos" },
    { src: "images/gallery2.jpg", alt: "Mesa dulce tematica" },
    { src: "images/gallery3.jpg", alt: "Fiesta tematica unicornio" },
    { src: "images/gallery4.jpg", alt: "Decoracion de fiesta al aire libre" },
    { src: "images/globos.jpg", alt: "Bouquet de globos personalizados" },
    { src: "images/pinata.jpg", alt: "Pinata artesanal" },
  ];

  var galleryGrid = document.getElementById("gallery-grid");
  galleryImages.forEach(function (img, idx) {
    var item = document.createElement("div");
    item.className = "gallery-item";
    item.style.transitionDelay = idx * 100 + "ms";
    item.setAttribute("data-index", idx);
    item.innerHTML =
      '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy" />' +
      '<div class="gallery-item-overlay"><p>' + img.alt + "</p></div>";
    item.addEventListener("click", function () {
      openLightbox(idx);
    });
    galleryGrid.appendChild(item);
  });

  // ---- Lightbox ----
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = galleryImages[idx].src;
    lightboxImg.alt = galleryImages[idx].alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener("click", function (e) {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIdx].src;
    lightboxImg.alt = galleryImages[currentIdx].alt;
  });

  lightboxNext.addEventListener("click", function (e) {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIdx].src;
    lightboxImg.alt = galleryImages[currentIdx].alt;
  });

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev.click();
    if (e.key === "ArrowRight") lightboxNext.click();
  });

  // ---- Contact form -> WhatsApp ----
  var form = document.getElementById("contact-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = document.getElementById("nombre").value;
    var telefono = document.getElementById("telefono").value;
    var evento = document.getElementById("evento").value;
    var fecha = document.getElementById("fecha").value;
    var mensaje = document.getElementById("mensaje").value;
    var text =
      "Hola! Soy " + nombre +
      ".%0ATelefono: " + telefono +
      "%0AEvento: " + evento +
      "%0AFecha: " + fecha +
      "%0AMensaje: " + mensaje;
    window.open("https://wa.me/5491126812615?text=" + text, "_blank");
  });

  // ---- Scroll reveal animation (IntersectionObserver) ----
  var observerOptions = { threshold: 0.1 };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll(".product-card, .why-card, .gallery-item").forEach(function (el) {
    observer.observe(el);
  });
});
