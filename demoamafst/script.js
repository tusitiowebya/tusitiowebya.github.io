// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav state
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Card spotlight follow
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// Contact form -> WhatsApp redirect
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const message = form.message.value.trim();
  if (!name || !message) {
    status.textContent = 'Por favor completá tu nombre y mensaje.';
    status.style.color = '#ff8a8a';
    return;
  }
  const text = `Hola, soy ${name}. ${message}`;
  const url = `https://api.whatsapp.com/send?phone=549XXXXXXXXXX&text=${encodeURIComponent(text)}`;
  status.textContent = 'Abriendo WhatsApp...';
  status.style.color = '';
  window.open(url, '_blank', 'noopener');
  form.reset();
});

// Subtle parallax on hero glows
const glow1 = document.querySelector('.glow-1');
const glow2 = document.querySelector('.glow-2');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
  if (glow2) glow2.style.transform = `translate(${-x}px, ${-y}px)`;
});
