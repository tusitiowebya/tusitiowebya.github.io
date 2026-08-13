// ══ NAVBAR SCROLL + MOBILE MENU ══
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ══ REVEAL ON SCROLL ══
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ══ ENCONTRÁ TU TRATAMIENTO (FINDER) ══
const finderData = {
  relax: {
    label: 'Para relajarte y desconectar',
    title: 'Masaje relajante + Limpieza facial profunda',
    text: 'Combinación ideal para bajar el estrés del cuerpo y renovar tu piel en una misma visita.',
    wa: 'Hola%2C%20quiero%20consultar%20por%20un%20masaje%20relajante%20y%20una%20limpieza%20facial%20profunda'
  },
  tension: {
    label: 'Para aliviar contracturas',
    title: 'Masaje descontracturante',
    text: 'Trabajamos zonas de tensión en espalda, cuello y hombros con presión profunda y localizada.',
    wa: 'Hola%2C%20quiero%20consultar%20por%20un%20masaje%20descontracturante'
  },
  piel: {
    label: 'Para cuidar tu piel',
    title: 'Peeling + Dermapen o Exosomas',
    text: 'Renovación celular y bioestimulación para una piel más pareja, firme y luminosa.',
    wa: 'Hola%2C%20quiero%20consultar%20por%20peeling%2C%20Dermapen%20y%20exosomas'
  },
  cuerpo: {
    label: 'Para modelar tu cuerpo',
    title: 'Masaje reductor + Drenaje linfático + Radiofrecuencia',
    text: 'Trío pensado para trabajar adiposidad localizada, retención de líquidos y firmeza de la piel.',
    wa: 'Hola%2C%20quiero%20consultar%20por%20masajes%20reductores%2C%20drenaje%20linf%C3%A1tico%20y%20radiofrecuencia'
  }
};

const finderOptions = document.getElementById('finderOptions');
const finderResult = document.getElementById('finderResult');

if (finderOptions) {
  finderOptions.querySelectorAll('.finder-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      finderOptions.querySelectorAll('.finder-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = finderData[btn.dataset.goal];
      finderResult.innerHTML = `
        <div class="finder-rec">
          <div class="finder-rec-copy">
            <span class="rec-label">${data.label}</span>
            <h4>${data.title}</h4>
            <p>${data.text}</p>
          </div>
          <a href="https://wa.me/5491100000000?text=${data.wa}" target="_blank" rel="noopener" class="btn btn-primary">Consultar por WhatsApp</a>
        </div>
      `;
    });
  });
}

// ══ FORM SUBMIT (AJAX to formsubmit.co) ══
const form = document.getElementById('reserva-form');
const formSuccess = document.getElementById('form-success');
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
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.hidden = true;
        formSuccess.hidden = false;
      } else {
        throw new Error('Error al enviar');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Enviar consulta';
      alert('No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.');
    }
  });
}
