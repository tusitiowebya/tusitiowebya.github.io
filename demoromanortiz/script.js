// Roman Ortiz Construcciones — demo TuPaginaYa
document.getElementById('yr').textContent = new Date().getFullYear();

/* navbar scroll state */
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* reveal on scroll */
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* play/pause gallery videos when in view (saves battery, keeps them synced) */
const galleryVideos = document.querySelectorAll('.video-card video');
const vio = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const v = entry.target;
    if (entry.isIntersecting) v.play().catch(() => {});
    else v.pause();
  });
}, { threshold: 0.25 });
galleryVideos.forEach(v => vio.observe(v));

/* cotizador rápido -> arma mensaje de WhatsApp */
const cotRubro = document.getElementById('cotRubro');
const cotAlcance = document.getElementById('cotAlcance');
const cotZona = document.getElementById('cotZona');
const cotSubmit = document.getElementById('cotSubmit');
let rubroSel = '';
let alcanceSel = '';

function bindChips(group, onSelect) {
  group.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      onSelect(chip.dataset.val);
    });
  });
}
bindChips(cotRubro, (val) => { rubroSel = val; updateCotLink(); });
bindChips(cotAlcance, (val) => { alcanceSel = val; updateCotLink(); });
cotZona.addEventListener('input', updateCotLink);

function updateCotLink() {
  let msg = 'Hola Roman, quiero un presupuesto.';
  if (rubroSel) msg += ` Rubro: ${rubroSel}.`;
  if (alcanceSel) msg += ` Alcance: ${alcanceSel}.`;
  if (cotZona.value.trim()) msg += ` Zona: ${cotZona.value.trim()}.`;
  cotSubmit.href = `https://wa.me/5491159890772?text=${encodeURIComponent(msg)}`;
}
updateCotLink();

/* contact form -> WhatsApp */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('f-nombre').value.trim();
  const tel = document.getElementById('f-tel').value.trim();
  const rubro = document.getElementById('f-rubro').value;
  const mensaje = document.getElementById('f-msg').value.trim();
  let text = `Hola Roman, soy ${nombre || 'un cliente'}.`;
  if (rubro) text += ` Necesito ayuda con: ${rubro}.`;
  if (mensaje) text += ` ${mensaje}`;
  if (tel) text += ` Mi teléfono: ${tel}.`;
  window.open(`https://wa.me/5491159890772?text=${encodeURIComponent(text)}`, '_blank');
});
