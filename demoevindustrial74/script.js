const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mainNav.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mainNav.classList.toggle('open', open);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const form = document.getElementById('brief-form');
const pieceInput = document.getElementById('piece');
const selectedImage = document.getElementById('selected-image');
const selectedName = document.getElementById('selected-name');
const selectedSource = document.getElementById('selected-source');
const preview = document.getElementById('message-preview');
const workButtons = [...document.querySelectorAll('[data-piece]')];
const workByName = new Map(workButtons.map(button => [button.dataset.piece, button]));

function updateReference() {
  const name = pieceInput.value;
  const chosen = workByName.get(name);
  selectedName.textContent = name;
  selectedImage.src = chosen ? chosen.dataset.image : 'media/logo-perfil.webp';
  selectedImage.alt = chosen ? `Referencia elegida: ${name}` : 'Logo del perfil de EV Diseño Industrial';
  selectedSource.hidden = !chosen;
  if (chosen) selectedSource.href = chosen.dataset.source;
  workButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button === chosen));
    button.closest('.work-card').classList.toggle('chosen', button === chosen);
  });
}

function makeMessage() {
  const name = pieceInput.value;
  const chosen = workByName.get(name);
  const article = name.startsWith('Mesa') ? 'una ' : 'un ';
  const width = document.getElementById('width').value.trim();
  const depth = document.getElementById('depth').value.trim();
  const height = document.getElementById('height').value.trim();
  const place = document.getElementById('place').value.trim();
  const details = document.getElementById('details').value.trim();
  const lines = [
    'Hola EV, vi sus muebles de diseño industrial y quiero consultar por ' + (name === 'Otro mueble / idea propia' ? 'una idea propia.' : article + name.toLowerCase().replace('tv', 'TV') + '.'),
  ];
  if (chosen) lines.push('Referencia: ' + chosen.dataset.source);
  const measures = [width && `ancho ${width} cm`, depth && `profundidad ${depth} cm`, height && `alto ${height} cm`].filter(Boolean);
  if (measures.length) lines.push('Medidas aproximadas: ' + measures.join(' · ') + '.');
  if (place) lines.push('Localidad: ' + place + '.');
  if (details) lines.push('Detalles: ' + details);
  lines.push('¿Podemos conversar opciones y presupuesto?');
  return lines.join('\n');
}

function refreshBrief() {
  updateReference();
  preview.textContent = makeMessage();
}

workButtons.forEach(button => button.addEventListener('click', () => {
  pieceInput.value = button.dataset.piece;
  refreshBrief();
  document.getElementById('consulta').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  setTimeout(() => pieceInput.focus({preventScroll:true}), 400);
}));
form.addEventListener('input', refreshBrief);
form.addEventListener('change', refreshBrief);
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const url = 'https://wa.me/5492235494821?text=' + encodeURIComponent(makeMessage());
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.append(link);
  link.click();
  link.remove();
});

document.getElementById('year').textContent = new Date().getFullYear();
refreshBrief();
