document.addEventListener('DOMContentLoaded', function () {
  // ===== Scroll Animation =====
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // ===== Staggered Card Animations =====
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  staggerContainers.forEach(function (container) {
    const cards = container.querySelectorAll('.animate-on-scroll');
    cards.forEach(function (card, index) {
      card.style.transitionDelay = (index * 150) + 'ms';
    });
  });

  // ===== Navbar Background on Scroll =====
  var navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
  });

  // ===== Smooth Scroll for Anchor Links =====
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Counter Animation for Stats =====
  var statNumbers = document.querySelectorAll('.stat-card .number');
  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          var text = entry.target.textContent;
          var match = text.match(/[\d.]+/);
          if (match) {
            var target = parseFloat(match[0]);
            var prefix = text.substring(0, text.indexOf(match[0]));
            var suffix = text.substring(text.indexOf(match[0]) + match[0].length);
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function animate(currentTime) {
              if (!startTime) startTime = currentTime;
              var progress = Math.min((currentTime - startTime) / duration, 1);
              var easeOut = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(easeOut * target);

              if (match[0].includes('.')) {
                current = (easeOut * target).toFixed(match[0].split('.')[1].length);
              }

              entry.target.textContent = prefix + current + suffix;

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                entry.target.textContent = text;
              }
            }

            requestAnimationFrame(animate);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (num) {
    statsObserver.observe(num);
  });
});
