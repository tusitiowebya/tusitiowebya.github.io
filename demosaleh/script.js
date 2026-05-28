/* ============================================================
   PROFESIONALES DEL SEGURO — script.js
   ============================================================ */

/* ---------- NAVBAR SCROLL + MOBILE TOGGLE ---------- */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', function () {
  const open = navMobile.classList.toggle('open');
  this.classList.toggle('open', open);
  const spans = this.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.addEventListener('click', e => {
  if (!navMobile.contains(e.target) && !navToggle.contains(e.target)) {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- FADE-UP ANIMATION ---------- */
const fuObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.closest(
      '.cob-grid, .proc-steps, '.concat(
        '.nos-inner, .caucion-inner, .sin-inner, ',
        '.contact-inner, .cta-band-inner, .sin-cards'
      )
    );
    const delay = parent
      ? Array.from(parent.children).indexOf(entry.target) * 80
      : 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    fuObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ---------- HERO VIDEO PARALLAX ---------- */
const heroVid = document.querySelector('.hero-video');
if (heroVid) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroVid.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });
}

/* ---------- CONTACT FORM → WHATSAPP ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();
    const email = document.getElementById('femail').value.trim();
    const tipo  = document.getElementById('ftipo').value;
    const msg   = document.getElementById('fmsg').value.trim();

    if (!name || !phone || !email) {
      alert('Por favor completá los campos obligatorios.');
      return;
    }

    let text = `Hola Deborah! Soy *${name}*.\n`;
    text += `📞 Teléfono: ${phone}\n`;
    text += `📧 Email: ${email}\n`;
    if (tipo) text += `🔍 Necesito cotizar: ${tipo}\n`;
    if (msg)  text += `💬 Mensaje: ${msg}`;

    window.open(
      `https://wa.me/5491166108066?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  });
}
