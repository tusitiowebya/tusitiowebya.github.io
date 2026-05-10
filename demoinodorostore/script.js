// ===== STICKY HEADER =====
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  const open = mobileNav.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity  = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80 * i);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== WHATSAPP =====
const WA_NUMBER = '5491127774303';

function openWhatsApp(message) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

document.querySelector('.whatsapp-float').addEventListener('click', (e) => {
  e.preventDefault();
  openWhatsApp('Hola, me gustaría consultar sobre sus productos de baño.');
});

const waBigBtn = document.querySelector('.btn-whatsapp-big');
if (waBigBtn) waBigBtn.addEventListener('click', () => openWhatsApp('Hola, quiero enviarles un mensaje desde su página web.'));

const heroWaBtn = document.querySelector('.hero-wa');
if (heroWaBtn) heroWaBtn.addEventListener('click', () => openWhatsApp('Hola, vi su página y me gustaría saber más sobre sus productos.'));

// ===== CATALOG TOGGLE =====
const catalogToggle = document.querySelector('#catalogToggle');
const catalogCollapse = document.querySelector('#catalogCollapse');

if (catalogToggle && catalogCollapse) {
  catalogCollapse.style.maxHeight = '0';
  catalogCollapse.style.overflow = 'hidden';
  catalogCollapse.style.transition = 'max-height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease';
  catalogCollapse.style.opacity = '0';

  catalogToggle.addEventListener('click', () => {
    const isOpen = catalogToggle.classList.contains('open');
    if (isOpen) {
      catalogCollapse.style.maxHeight = '0';
      catalogCollapse.style.opacity = '0';
      catalogToggle.classList.remove('open');
      catalogToggle.querySelector('.chevron').style.transform = '';
    } else {
      catalogCollapse.style.maxHeight = catalogCollapse.scrollHeight + 200 + 'px';
      catalogCollapse.style.opacity = '1';
      catalogToggle.classList.add('open');
      catalogToggle.querySelector('.chevron').style.transform = 'rotate(180deg)';
      setTimeout(() => {
        window.scrollTo({ top: catalogToggle.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
      }, 100);
    }
  });
}

// ===== CATEGORY FILTER =====
const filterPills = document.querySelectorAll('.filter-pill');
const catalogItems = document.querySelectorAll('.catalog-item');
const catalogEmpty = document.querySelector('#catalogEmpty');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.getAttribute('data-filter');
    let visible = 0;

    catalogItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      const show = filter === 'todos' || cat === filter;
      item.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    if (catalogEmpty) catalogEmpty.classList.toggle('visible', visible === 0);

    // Recalculate max-height after filtering
    if (catalogCollapse && catalogCollapse.style.opacity === '1') {
      catalogCollapse.style.maxHeight = 'none';
      const h = catalogCollapse.scrollHeight;
      catalogCollapse.style.maxHeight = h + 'px';
    }
  });
});

// ===== CATALOG ITEM BUTTONS =====
document.querySelectorAll('.btn-interested').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openWhatsApp(`Hola, estoy interesado en ${btn.getAttribute('data-product')}`);
  });
});

document.querySelectorAll('.catalog-item').forEach(item => {
  item.addEventListener('click', () => {
    openWhatsApp(`Hola, estoy interesado en ${item.querySelector('h4').textContent}`);
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ===== HERO CTA =====
const heroCatalogBtn = document.querySelector('.hero-catalog');
if (heroCatalogBtn) {
  heroCatalogBtn.addEventListener('click', () => {
    const sec = document.querySelector('#catalogo');
    if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
}
