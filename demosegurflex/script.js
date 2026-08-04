// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Quote form -> submit via fetch to FormSubmit, show success card without leaving the page
const form = document.getElementById('quote-form');
const successBox = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.hidden = true;
        successBox.hidden = false;
      } else {
        throw new Error('bad response');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Enviar y cotizar';
      alert('Hubo un problema al enviar. Probá de nuevo o escribinos directo por WhatsApp.');
    }
  });
}
