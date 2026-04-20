/* =============================================
   FLETES LÓPEZ — script.js
   ============================================= */

/* ---- NAVBAR SCROLL EFFECT ---- */
(function () {
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ---- MOBILE MENU ---- */
function toggleMobileMenu() {
  var navLinks = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  var isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMobileMenu() {
  var navLinks = document.getElementById('navLinks');
  navLinks.classList.remove('open');
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      closeMobileMenu();
    }
  });
});

/* ---- SCROLL REVEAL ---- */
(function () {
  var reveals = document.querySelectorAll('.reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) { observer.observe(el); });
})();

/* ---- TESTIMONIAL CAROUSEL ---- */
(function () {
  var track = document.getElementById('testimonialTrack');
  if (!track) return;

  var cards = track.querySelectorAll('.testimonial-card');
  var total = cards.length;
  var current = 0;
  var visibleCount = getVisibleCount();
  var autoInterval;

  function getVisibleCount() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 24; // 24 = gap (1.5rem)
  }

  function goTo(index) {
    var maxIndex = total - visibleCount;
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
  }

  window.nextSlide = function () {
    goTo(current + 1);
    resetAuto();
  };

  window.prevSlide = function () {
    goTo(current - 1);
    resetAuto();
  };

  function startAuto() {
    autoInterval = setInterval(function () {
      goTo(current + 1);
    }, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  window.addEventListener('resize', function () {
    visibleCount = getVisibleCount();
    goTo(0);
  }, { passive: true });

  startAuto();
})();

/* ---- CONTACT FORM → WHATSAPP ---- */
function submitForm(event) {
  event.preventDefault();
  var form = event.target;
  var valid = true;

  function clearError(id) {
    var el = document.getElementById('error-' + id);
    var input = document.getElementById(id);
    if (el) el.textContent = '';
    if (input) input.classList.remove('error');
  }

  function setError(id, msg) {
    var el = document.getElementById('error-' + id);
    var input = document.getElementById(id);
    if (el) el.textContent = msg;
    if (input) input.classList.add('error');
    valid = false;
  }

  var fields = ['nombre', 'telefono', 'desde', 'hasta', 'servicio', 'mensaje'];
  fields.forEach(clearError);

  var nombre = document.getElementById('nombre').value.trim();
  var telefono = document.getElementById('telefono').value.trim();
  var desde = document.getElementById('desde').value.trim();
  var hasta = document.getElementById('hasta').value.trim();
  var servicio = document.getElementById('servicio').value.trim();
  var mensaje = document.getElementById('mensaje').value.trim();

  if (nombre.length < 2) setError('nombre', 'Ingresá tu nombre');
  if (telefono.length < 8) setError('telefono', 'Ingresá un teléfono válido');
  if (desde.length < 3) setError('desde', 'Ingresá la dirección o zona de origen');
  if (hasta.length < 3) setError('hasta', 'Ingresá la dirección o zona de destino');
  if (!servicio) setError('servicio', 'Seleccioná un tipo de servicio');
  if (mensaje.length < 10) setError('mensaje', 'Contanos brevemente qué necesitás trasladar');

  if (!valid) return;

  var btn = document.getElementById('submitBtn');
  btn.textContent = 'Abriendo WhatsApp...';
  btn.disabled = true;

  var text = encodeURIComponent(
    'Hola Fletes López! Necesito un presupuesto.\n\n' +
    '*Nombre:* ' + nombre + '\n' +
    '*Teléfono:* ' + telefono + '\n' +
    '*Servicio:* ' + servicio + '\n' +
    '*Origen:* ' + desde + '\n' +
    '*Destino:* ' + hasta + '\n' +
    '*Detalle:* ' + mensaje
  );

  setTimeout(function () {
    window.open('https://wa.me/5491155846870?text=' + text, '_blank');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar por WhatsApp';
    btn.disabled = false;
    form.reset();
  }, 500);
}
