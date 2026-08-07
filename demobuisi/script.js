/* El Buisi Remolques — landing */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* header on scroll */
  var hdr = document.getElementById('hdr');
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile'), nmClose = document.getElementById('navMobileClose');
  function closeNav() { nm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nmClose.addEventListener('click', closeNav);
    nm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  /* hero carousel */
  var slides = document.querySelectorAll('#heroCarousel .hero__slide');
  if (slides.length > 1) {
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 5000);
  }

  /* lightbox */
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbClose = document.getElementById('lightboxClose');
  document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lbImg.src = btn.getAttribute('data-full');
      lbImg.alt = btn.querySelector('img').alt;
      lb.classList.add('open');
    });
  });
  function closeLb() { lb.classList.remove('open'); lbImg.src = ''; }
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* faq accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; }
      });
      item.classList.toggle('open', !open);
      a.style.maxHeight = !open ? a.scrollHeight + 'px' : null;
    });
  });

  /* animated stat counters */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur = 1200, start = null;
    var hasTextNode = el.firstChild && el.firstChild.nodeType === 3;
    function setVal(v) {
      if (hasTextNode) el.firstChild.nodeValue = v;
      else el.textContent = v;
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    }
    requestAnimationFrame(step);
  }

  /* reveal on scroll */
  var targets = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentElement ? el.parentElement.querySelectorAll('.rev') : [el];
        var i = Array.prototype.indexOf.call(sibs, el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 0.07 : 0) + 's';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });

    var statsGrid = document.querySelector('.stats__grid');
    if (statsGrid) {
      var statIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          statsGrid.querySelectorAll('[data-count]').forEach(animateCount);
          statIo.unobserve(statsGrid);
        });
      }, { threshold: 0.4 });
      statIo.observe(statsGrid);
    }
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }
})();
