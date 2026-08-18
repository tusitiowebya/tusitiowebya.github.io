const WA_NUMBER = "5492994223819";

/* Nav scroll state */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* Mobile menu */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

/* Lazy-load hero video */
const heroVideo = document.querySelector('.hero__video');
if (heroVideo && heroVideo.dataset.src) {
  heroVideo.src = heroVideo.dataset.src;
}

/* Fade-up on scroll */
document.querySelectorAll('.section__head, .card, .checklist, .gallery__item, .wizard').forEach(el => el.setAttribute('data-fade', ''));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-fade]').forEach(el => io.observe(el));

/* Wizard: armador de travesía */
const state = { terreno: null, nivel: null, grupo: null, noches: null };

const TERRENO_LABEL = { nieve: 'Travesía de nieve/montaña', offroad: 'Salida off-road/barro', mixto: 'Recorrido mixto' };
const NIVEL_LABEL = { nunca: 'sin experiencia previa', basico: 'con nociones básicas', experimentado: 'con experiencia' };
const GRUPO_LABEL = { solo: 'para 1 persona', pareja: 'para 2 personas', grupo: 'para un grupo' };
const NOCHES_LABEL = { sin: 'solo la travesía, sin alojamiento', '1': '1 noche en el complejo', '2+': '2 noches o más en el complejo' };

function bindChips(containerId, key) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state[key] = chip.dataset[key];
      updateResult();
    });
  });
}
bindChips('chipsTerreno', 'terreno');
bindChips('chipsNivel', 'nivel');
bindChips('chipsGrupo', 'grupo');
bindChips('chipsNoches', 'noches');

function buildRecommendation() {
  const list = [];
  let title = 'Elegí las 4 opciones de la izquierda';
  let text = 'A medida que vayas eligiendo, arma acá la salida recomendada.';

  if (state.terreno) {
    title = TERRENO_LABEL[state.terreno];
    text = 'Propuesta armada según lo que elegiste. Se confirma fecha y detalle final por WhatsApp.';
  }

  if (state.terreno === 'nieve') list.push('Vehículo 4x4 con equipo para nieve');
  if (state.terreno === 'offroad') list.push('Recorrido de barro/montaña sin nieve');
  if (state.terreno === 'mixto') list.push('Combinación de tramos según estado del camino');

  if (state.nivel === 'nunca') list.push('Explicación previa de manejo antes de salir');
  if (state.nivel === 'basico') list.push('Repaso de reductora y tracción en el terreno');
  if (state.nivel === 'experimentado') list.push('Ritmo y tramos más exigentes');

  if (state.grupo) list.push(`Salida ${GRUPO_LABEL[state.grupo]}`);

  if (state.noches === 'sin') list.push('Sin alojamiento, solo la travesía');
  if (state.noches === '1') list.push('1 noche en la hostería con pensión completa');
  if (state.noches === '2+') list.push('2 noches o más en la hostería con pensión completa');

  return { title, text, list };
}

function updateResult() {
  const { title, text, list } = buildRecommendation();
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultText').textContent = text;

  const ul = document.getElementById('resultList');
  ul.innerHTML = '';
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });

  const waLink = document.getElementById('resultWa');
  if (state.terreno && state.nivel && state.grupo && state.noches) {
    const msg = `Hola! Quiero coordinar: ${TERRENO_LABEL[state.terreno]}, ${NIVEL_LABEL[state.nivel]}, ${GRUPO_LABEL[state.grupo]}, ${NOCHES_LABEL[state.noches]}.`;
    waLink.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    waLink.textContent = 'Coordinar por WhatsApp';
  } else {
    waLink.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Quiero consultar por una travesía 4x4 con alojamiento')}`;
    waLink.textContent = 'Elegí las 4 opciones y coordiná';
  }
}
updateResult();
