const BOOKING_URL = 'https://turnos.tusventas.com.ar/n/organizacion-premium';
const API_URL = 'https://turnos.tusventas.com.ar/api/proxy/turnos-publico/organizacion-premium';
const WHATSAPP = '5491152299827';

const areas = {
  auto: {
    index: 'EXPEDIENTE 01',
    title: 'Gestoría automotor',
    description: 'Para avanzar con los papeles de tu vehículo, empezá por contarnos qué necesitás resolver.',
    items: ['Transferencias', 'Informes de dominio e inhibiciones', 'Patentes: altas, bajas y consultas', 'Denuncias de venta, robo o extravío', 'Asesoramiento personalizado'],
    message: 'Hola Organización Premium, necesito consultar por un trámite automotor.'
  },
  inmuebles: {
    index: 'EXPEDIENTE 02',
    title: 'Gestoría inmobiliaria',
    description: 'Si estás por comprar, vender, alquilar o regularizar documentación, contanos en qué etapa estás.',
    items: ['Cesión de derechos y acciones posesorias', 'Boletos de compraventa', 'Informes de dominio', 'Contratos de alquiler', 'Escrituraciones'],
    message: 'Hola Organización Premium, necesito consultar por un trámite inmobiliario.'
  },
  seguros: {
    index: 'EXPEDIENTE 03',
    title: 'Seguros generales',
    description: 'Consultá por las alternativas de seguros que gestionan para personas y bienes. Te orientan según tu caso.',
    items: ['Seguros personales', 'Seguros patrimoniales', 'Consultas sobre coberturas', 'Asesoramiento sobre tu necesidad'],
    message: 'Hola Organización Premium, quiero consultar por seguros.'
  }
};

const tabs = [...document.querySelectorAll('.route-tab')];
const panel = document.getElementById('panel-route');
const panelIndex = document.getElementById('panelIndex');
const panelTitle = document.getElementById('panelTitle');
const panelDesc = document.getElementById('panelDesc');
const panelList = document.getElementById('panelList');
const panelWhatsApp = document.getElementById('panelWhatsApp');

function selectArea(key) {
  const data = areas[key];
  if (!data) return;
  tabs.forEach(tab => {
    const active = tab.dataset.area === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active) panel.setAttribute('aria-labelledby', tab.id);
  });
  panelIndex.textContent = data.index;
  panelTitle.textContent = data.title;
  panelDesc.textContent = data.description;
  panelList.replaceChildren(...data.items.map(item => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
  panelWhatsApp.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(data.message)}`;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectArea(tab.dataset.area));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectArea(tabs[next].dataset.area);
    tabs[next].focus();
  });
});

const menuButton = document.getElementById('menuButton');
const nav = document.getElementById('nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}));

const dialog = document.getElementById('lightbox');
const dialogImage = document.getElementById('lightboxImage');
document.querySelectorAll('.material').forEach(button => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.image;
  dialogImage.alt = button.dataset.alt;
  dialog.showModal();
}));
document.getElementById('lightboxClose').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => { dialogImage.removeAttribute('src'); });

async function fetchJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function argentineTodayUTC() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = type => Number(parts.find(p => p.type === type).value);
  return Date.UTC(get('year'), get('month') - 1, get('day'), 12);
}

function slotRow(slot) {
  const row = document.createElement('div');
  row.className = 'slot-row';
  const info = document.createElement('div');
  const day = document.createElement('strong');
  const who = document.createElement('small');
  const time = document.createElement('span');
  const instant = new Date(slot.inicio);
  day.textContent = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', day: 'numeric', month: 'long' }).format(instant);
  who.textContent = slot.profesionalNombre ? `Con ${slot.profesionalNombre}` : 'Horario disponible';
  time.className = 'slot-time';
  time.textContent = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false }).format(instant);
  info.append(day, who);
  row.append(info, time);
  return row;
}

async function loadAvailability() {
  const body = document.getElementById('availabilityBody');
  const status = document.getElementById('connectionStatus');
  const dot = document.getElementById('liveDot');
  try {
    const account = await fetchJSON(API_URL);
    if (!account.success || account.negocio?.slug !== 'organizacion-premium') throw new Error('Cuenta no disponible');
    dot.classList.add('on');
    status.textContent = 'Agenda conectada en vivo';
    const service = account.servicios?.find(item => item._id);
    if (!service) {
      body.innerHTML = '<p class="availability-status">La agenda todavía no tiene servicios publicados. Podés consultarnos por WhatsApp o volver a revisar más tarde.</p>';
      return;
    }
    const start = argentineTodayUTC();
    const dates = Array.from({ length: 7 }, (_, offset) => new Date(start + offset * 86400000).toISOString().slice(0, 10));
    const results = await Promise.allSettled(dates.map(date => fetchJSON(`${API_URL}/disponibilidad?servicioId=${encodeURIComponent(service._id)}&fecha=${date}`)));
    const good = results.filter(result => result.status === 'fulfilled' && Array.isArray(result.value.slots));
    if (!good.length) throw new Error('Disponibilidad no disponible');
    const seen = new Set();
    const slots = good.flatMap(result => result.value.slots).filter(slot => {
      if (!slot.inicio || new Date(slot.inicio).getTime() < Date.now()) return false;
      const key = slot.inicio;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => new Date(a.inicio) - new Date(b.inicio)).slice(0, 3);
    if (!slots.length) {
      body.innerHTML = '<p class="availability-status">No aparecen horarios libres en los próximos días. Abrí la agenda para revisar más fechas o consultanos por WhatsApp.</p>';
      return;
    }
    body.replaceChildren(...slots.map(slotRow));
  } catch (error) {
    status.textContent = 'Agenda disponible en TurnOS';
    body.innerHTML = '<p class="availability-status">No pudimos mostrar los horarios ahora. Podés abrir la agenda para ver la disponibilidad actual.</p>';
  }
}

loadAvailability();
