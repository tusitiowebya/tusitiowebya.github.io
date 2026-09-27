const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
  mainNav.classList.toggle('is-open', opening);
});

mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const audio = document.getElementById('radio-audio');
const playButtons = [...document.querySelectorAll('[data-play]')];
const player = document.querySelector('.player');
const playerStatus = document.getElementById('player-status');
const playIcon = document.querySelector('[data-play-icon]');
const volume = document.getElementById('volume');
audio.volume = Number(volume.value) / 100;

function setPlayerState(state, message) {
  player.dataset.state = state;
  player.classList.toggle('is-playing', state === 'playing');
  playerStatus.textContent = message;
  const active = state === 'playing';
  playButtons.forEach(button => {
    button.setAttribute('aria-label', active ? 'Pausar AMORI RADIO' : 'Reproducir AMORI RADIO');
    button.setAttribute('aria-pressed', String(active));
    button.querySelectorAll('[data-play-label]').forEach(label => {
      label.textContent = active ? 'Pausar radio' : 'Escuchar en vivo';
    });
  });
  playIcon.textContent = active ? 'Ⅱ' : '▶';
}

playButtons.forEach(button => button.addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  setPlayerState('loading', 'Conectando con la señal…');
  try {
    await audio.play();
  } catch (error) {
    setPlayerState('error', 'No se pudo abrir la señal. Probá en el sitio oficial.');
  }
}));

audio.addEventListener('playing', () => setPlayerState('playing', 'Sonando ahora · señal en vivo'));
audio.addEventListener('waiting', () => setPlayerState('loading', 'Reconectando con la señal…'));
audio.addEventListener('pause', () => setPlayerState('paused', 'Pausada · volvé cuando quieras'));
audio.addEventListener('error', () => setPlayerState('error', 'Señal no disponible. Probá en el sitio oficial.'));
volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });

const genreButtons = [...document.querySelectorAll('.genre-chip')];
const requestInputs = ['song', 'artist', 'dedication'].map(id => document.getElementById(id));
const messageText = document.getElementById('message-text');
const sendRequest = document.getElementById('send-request');
let selectedGenre = '';

function updateRequest() {
  const [song, artist, dedication] = requestInputs.map(input => input.value.trim());
  const details = [];
  if (selectedGenre) details.push(`Estilo: ${selectedGenre}.`);
  if (song) details.push(`Tema: ${song}.`);
  if (artist) details.push(`Artista: ${artist}.`);
  if (dedication) details.push(`Saludo o dedicatoria: ${dedication}.`);
  const message = `Hola AMORI RADIO, quiero pedir una canción para la radio.${details.length ? ' ' + details.join(' ') : ''}`;
  messageText.textContent = message;
  sendRequest.href = `https://wa.me/5492257412302?text=${encodeURIComponent(message)}`;
}

genreButtons.forEach(button => button.addEventListener('click', () => {
  selectedGenre = selectedGenre === button.dataset.genre ? '' : button.dataset.genre;
  genreButtons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.genre === selectedGenre)));
  updateRequest();
}));
requestInputs.forEach(input => input.addEventListener('input', updateRequest));
updateRequest();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll('.about-main, .request-copy, .request-panel, .social-head, .social-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    observer.observe(item);
  });
}
