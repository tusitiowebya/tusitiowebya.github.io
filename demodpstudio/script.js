document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAV scroll state ---------- */
  const nav = document.getElementById('nav');
  const waFloat = document.getElementById('waFloat');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  burger.addEventListener('click', () => mnav.classList.toggle('open'));
  mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.classList.remove('open')));

  /* ---------- Fade-up on scroll ---------- */
  const fadeEls = document.querySelectorAll('[data-fade]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => io.observe(el));

  /* ---------- Armador de pedido ---------- */
  const state = { disciplina: 'Fútbol', 'para-quien': 'Club o equipo', cantidad: '1 a 5' };
  const labels = {
    'Club o equipo': 'Club / equipo',
    'Escuela o institución': 'Escuela / institución',
    'Evento o torneo': 'Evento / torneo',
    'Uso personal': 'Uso personal'
  };

  document.querySelectorAll('.chips').forEach(group => {
    const key = group.dataset.group;
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state[key] = chip.dataset.value;
        updateBuilder();
      });
    });
  });

  const bMsg = document.getElementById('bMsg');
  const bSend = document.getElementById('bSend');
  const jerseyNum = document.getElementById('jerseyNum');

  const jerseyNumbers = { 'Fútbol': '10', 'Básquet': '23', 'Vóley': '7', 'Handball': '9', 'Otro deporte': '1' };

  function updateBuilder() {
    const paraQuien = labels[state['para-quien']] || state['para-quien'];
    const text = `Hola DPSTUDIO! Quiero consultar por indumentaria para ${state.disciplina}, para ${paraQuien}, aprox. ${state.cantidad} personas.`;
    bMsg.textContent = text;
    bSend.href = `https://wa.me/5491130784813?text=${encodeURIComponent(text)}`;
    if (jerseyNum) jerseyNum.textContent = jerseyNumbers[state.disciplina] || '10';
  }
  updateBuilder();

});
