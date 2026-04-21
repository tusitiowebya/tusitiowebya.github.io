// AlquiSeason - Premium Seasonal Equipment Rental

// ============================================
// DATA
// ============================================

const products = [
  {
    id: '1',
    name: 'Esquís Alpine Pro',
    description: 'Esquís profesionales para todas las pistas. Perfectos para esquiadores intermedios y avanzados.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
    category: 'ski',
    season: 'winter',
    available: true,
  },
  {
    id: '2',
    name: 'Tabla Snowboard Freestyle',
    description: 'Tabla versátil ideal para park y freestyle. Construcción ligera y resistente.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1478700485868-972b69dc3fc4?w=600&h=400&fit=crop',
    category: 'snowboard',
    season: 'winter',
    available: true,
  },
  {
    id: '3',
    name: 'Botas de Esquí Confort',
    description: 'Botas térmicas con ajuste personalizado. Máximo confort durante todo el día.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=600&h=400&fit=crop',
    category: 'boots',
    season: 'winter',
    available: true,
  },
  {
    id: '4',
    name: 'Casco de Seguridad Premium',
    description: 'Casco certificado con ventilación ajustable y forro antibacteriano.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop',
    category: 'accessories',
    season: 'winter',
    available: true,
  },
  {
    id: '5',
    name: 'Carpa Camping 4 Personas',
    description: 'Carpa resistente al agua con doble capa. Perfecta para aventuras en familia.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
    category: 'camping',
    season: 'summer',
    available: true,
  },
  {
    id: '6',
    name: 'Kayak Individual Sport',
    description: 'Kayak estable y maniobrable. Incluye remo y chaleco salvavidas.',
    price: 40,
    image: 'https://devessport.es/wp-content/uploads/2020/07/que-es-un-kayak-1.jpg',
    category: 'water',
    season: 'summer',
    available: true,
  },
  {
    id: '7',
    name: 'Heladerita de Camping',
    description: 'Heladera Conservadora Termolar 32 Lts Portatil Camping',
    price: 30,
    image: 'https://http2.mlstatic.com/D_NQ_NP_739525-MLA107167827204_022026-O.webp',
    category: 'bike',
    season: 'summer',
    available: true,
  },
  {
    id: '8',
    name: 'Set Trekking Completo',
    description: 'Mochila 50L, bastones y botella térmica. Todo para tu aventura.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
    category: 'hiking',
    season: 'summer',
    available: true,
  },
];

const activities = [
  {
    id: '1',
    name: 'Clases de Esquí Grupales',
    description: 'Aprende a esquiar con instructores certificados. Grupos reducidos de máximo 6 personas para atención personalizada.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=600&h=400&fit=crop',
    season: 'winter',
    duration: '2 horas',
    difficulty: 'Principiante',
    groupSize: '6 personas máx.',
    includes: ['Instructor certificado', 'Equipo incluido', 'Seguro'],
  },
  {
    id: '2',
    name: 'Excursión Snowshoeing',
    description: 'Descubre paisajes nevados únicos caminando con raquetas de nieve. Una experiencia mágica en la montaña.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=600&h=400&fit=crop',
    season: 'winter',
    duration: '3 horas',
    difficulty: 'Moderado',
    groupSize: '10 personas máx.',
    includes: ['Guía experto', 'Raquetas de nieve', 'Bastones', 'Snack'],
  },
  {
    id: '3',
    name: 'Kayak al Atardecer',
    description: 'Navega por aguas cristalinas mientras disfrutas de un atardecer espectacular. Experiencia inolvidable.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&h=400&fit=crop',
    season: 'summer',
    duration: '2.5 horas',
    difficulty: 'Fácil',
    groupSize: '8 personas máx.',
    includes: ['Kayak doble', 'Chaleco', 'Guía', 'Fotos'],
  },
  {
    id: '4',
    name: 'Trekking Cumbres',
    description: 'Alcanza las cumbres más impresionantes con guías experimentados. Vistas panorámicas garantizadas.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
    season: 'summer',
    duration: '6 horas',
    difficulty: 'Avanzado',
    groupSize: '8 personas máx.',
    includes: ['Guía certificado', 'Almuerzo', 'Bastones', 'Primeros auxilios'],
  },
];

const testimonials = [
  {
    id: '1',
    name: 'María González',
    location: 'Buenos Aires',
    rating: 5,
    comment: 'Excelente servicio! Los equipos estaban en perfecto estado y el proceso de alquiler fue muy sencillo. Volveré sin dudas.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    location: 'Córdoba',
    rating: 5,
    comment: 'Las clases de esquí fueron increíbles. El instructor muy profesional y paciente. Mis hijos aprendieron en un día!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Laura Martínez',
    location: 'Mendoza',
    rating: 5,
    comment: 'Alquilamos todo el equipo de camping y fue una experiencia genial. Todo llegó en perfectas condiciones.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

// ============================================
// STATE
// ============================================

let cart = [];
let currentFilter = 'all';

// ============================================
// DOM ELEMENTS
// ============================================

const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const equipmentGrid = document.getElementById('equipment-grid');
const activitiesGrid = document.getElementById('activities-grid');
const testimonialsGrid = document.getElementById('testimonials-grid');
const mobileMenu = document.getElementById('mobile-menu');
const toast = document.getElementById('toast');
const scrollTopBtn = document.getElementById('scroll-top');

// ============================================
// CART FUNCTIONS
// ============================================

// Date picker state
let datepickerItem = null;
let datepickerCurrentMonth = new Date();
let datepickerStartDate = null;
let datepickerEndDate = null;
let datepickerParticipants = 1;

function openDatePicker(item) {
  datepickerItem = item;
  datepickerStartDate = null;
  datepickerEndDate = null;
  datepickerParticipants = 1;
  datepickerCurrentMonth = new Date();
  
  // Update modal content
  document.getElementById('datepicker-subtitle').textContent = item.name;
  
  if (item.type === 'activity') {
    document.getElementById('datepicker-title').textContent = 'Seleccionar Fecha';
    document.getElementById('datepicker-participants').style.display = 'flex';
    document.getElementById('datepicker-end-date').parentElement.style.display = 'none';
    document.getElementById('datepicker-days-count').parentElement.style.display = 'none';
  } else {
    document.getElementById('datepicker-title').textContent = 'Seleccionar Fechas';
    document.getElementById('datepicker-participants').style.display = 'none';
    document.getElementById('datepicker-end-date').parentElement.style.display = 'flex';
    document.getElementById('datepicker-days-count').parentElement.style.display = 'flex';
  }
  
  renderCalendar();
  updateDatepickerSummary();
  
  document.getElementById('datepicker-overlay').classList.add('active');
  document.getElementById('datepicker-modal').classList.add('active');
}

function closeDatePicker() {
  document.getElementById('datepicker-overlay').classList.remove('active');
  document.getElementById('datepicker-modal').classList.remove('active');
  datepickerItem = null;
}

function renderCalendar() {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const year = datepickerCurrentMonth.getFullYear();
  const month = datepickerCurrentMonth.getMonth();
  
  document.getElementById('datepicker-month-year').textContent = 
    `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let html = '';
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    html += '<div></div>';
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < today;
    const isSelected = isDateSelected(date);
    const isInRange = isDateInRange(date);
    
    let classes = 'datepicker-day';
    if (isPast) classes += ' disabled';
    if (isSelected) classes += ' selected';
    if (isInRange && !isSelected) classes += ' in-range';
    
    html += `<button class="${classes}" ${isPast ? 'disabled' : ''} onclick="selectDate(${day})">${day}</button>`;
  }
  
  document.getElementById('datepicker-days').innerHTML = html;
}

function isDateSelected(date) {
  if (!datepickerStartDate && !datepickerEndDate) return false;
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  if (datepickerStartDate) {
    const start = new Date(datepickerStartDate);
    start.setHours(0, 0, 0, 0);
    if (d.getTime() === start.getTime()) return true;
  }
  
  if (datepickerEndDate) {
    const end = new Date(datepickerEndDate);
    end.setHours(0, 0, 0, 0);
    if (d.getTime() === end.getTime()) return true;
  }
  
  return false;
}

function isDateInRange(date) {
  if (!datepickerStartDate || !datepickerEndDate) return false;
  
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  return d > datepickerStartDate && d < datepickerEndDate;
}

function selectDate(day) {
  const date = new Date(datepickerCurrentMonth.getFullYear(), datepickerCurrentMonth.getMonth(), day);
  
  if (datepickerItem.type === 'activity') {
    datepickerStartDate = date;
    datepickerEndDate = date;
  } else {
    if (!datepickerStartDate || (datepickerStartDate && datepickerEndDate)) {
      datepickerStartDate = date;
      datepickerEndDate = null;
    } else {
      if (date < datepickerStartDate) {
        datepickerEndDate = datepickerStartDate;
        datepickerStartDate = date;
      } else {
        datepickerEndDate = date;
      }
    }
  }
  
  renderCalendar();
  updateDatepickerSummary();
}

function prevMonth() {
  datepickerCurrentMonth = new Date(datepickerCurrentMonth.getFullYear(), datepickerCurrentMonth.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  datepickerCurrentMonth = new Date(datepickerCurrentMonth.getFullYear(), datepickerCurrentMonth.getMonth() + 1);
  renderCalendar();
}

function formatDateShort(date) {
  if (!date) return '--';
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function calculateDays() {
  if (!datepickerStartDate || !datepickerEndDate) return 0;
  return Math.ceil((datepickerEndDate.getTime() - datepickerStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function calculateTotal() {
  if (!datepickerItem) return 0;
  
  if (datepickerItem.type === 'activity') {
    return datepickerItem.price * datepickerParticipants;
  } else {
    const days = calculateDays();
    return datepickerItem.price * days;
  }
}

function updateDatepickerSummary() {
  document.getElementById('datepicker-start-date').textContent = formatDateShort(datepickerStartDate);
  document.getElementById('datepicker-end-date').textContent = formatDateShort(datepickerEndDate);
  document.getElementById('datepicker-days-count').textContent = calculateDays() || '--';
  document.getElementById('datepicker-total').textContent = `$${calculateTotal().toLocaleString()}`;
  document.getElementById('participants-count').textContent = datepickerParticipants;
}

function increaseParticipants() {
  datepickerParticipants++;
  updateDatepickerSummary();
}

function decreaseParticipants() {
  if (datepickerParticipants > 1) {
    datepickerParticipants--;
    updateDatepickerSummary();
  }
}

function confirmDateSelection() {
  if (!datepickerStartDate) {
    showToast('Por favor selecciona una fecha');
    return;
  }
  
  const item = {
    ...datepickerItem,
    startDate: datepickerStartDate.toISOString(),
    endDate: datepickerEndDate ? datepickerEndDate.toISOString() : datepickerStartDate.toISOString(),
    price: calculateTotal(),
    quantity: datepickerItem.type === 'activity' ? datepickerParticipants : 1
  };
  
  addToCart(item);
  closeDatePicker();
  openCart();
}

function addToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
  
  if (!existingItem) {
    cart.push(item);
    updateCartUI();
    showToast(`${item.name} agregado al carrito`);
  } else {
    showToast('Este item ya está en el carrito');
  }
}

function removeFromCart(id, type) {
  cart = cart.filter(item => !(item.id === id && item.type === type));
  updateCartUI();
}

function updateCartUI() {
  // Update cart count
  cartCount.textContent = cart.length;
  cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
  
  // Update cart total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toLocaleString()}`;
  
  // Update cart items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        <p>Tu carrito está vacío</p>
        <span style="font-size: 0.875rem; margin-top: 0.5rem;">Agrega equipos o actividades para comenzar</span>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map(item => {
      const startDate = item.startDate ? formatDateForMessage(new Date(item.startDate)) : '--';
      const endDate = item.endDate ? formatDateForMessage(new Date(item.endDate)) : null;
      const dateText = endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
      
      return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="cart-item-type">${item.type === 'equipment' ? 'Equipo' : 'Actividad'}${item.quantity > 1 ? ` (${item.quantity} pers.)` : ''}</span>
          <span class="cart-item-date">${dateText}</span>
          <span class="cart-item-price">$${item.price.toLocaleString()}</span>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}', '${item.type}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `}).join('');
  }
}

function openCart() {
  cartOverlay.classList.add('active');
  cartSidebar.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('active');
  cartSidebar.classList.remove('active');
  document.body.style.overflow = '';
}

// Cambia este número por el tuyo (con código de país, sin + ni espacios)
const WHATSAPP_NUMBER = "5491123864671";

function formatDateForMessage(date) {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function sendToWhatsApp() {
  if (cart.length === 0) return;

  let message = "Hola! Me gustaría hacer la siguiente reserva:\n\n";
  message += "=== LISTA DE RESERVA ===\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Tipo: ${item.type === 'equipment' ? 'Equipo' : 'Actividad'}\n`;
    message += `   Fecha: ${formatDateForMessage(new Date(item.startDate))}`;
    if (item.endDate) {
      message += ` - ${formatDateForMessage(new Date(item.endDate))}`;
    }
    message += `\n`;
    if (item.type === 'activity' && item.quantity > 1) {
      message += `   Participantes: ${item.quantity}\n`;
    }
    message += `   Precio: $${item.price.toLocaleString()}\n\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  message += "========================\n";
  message += `*TOTAL: $${total.toLocaleString()}*\n\n`;
  message += "Por favor, confirmen disponibilidad. Gracias!";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderEquipment(filter = 'all') {
  currentFilter = filter;
  
  // Update filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  
  // Filter products
  let filtered = products;
  if (filter === 'winter') {
    filtered = products.filter(p => p.season === 'winter');
  } else if (filter === 'summer') {
    filtered = products.filter(p => p.season === 'summer');
  }
  
  // Render products
  equipmentGrid.innerHTML = filtered.map(product => `
    <div class="card equipment-card">
      <div class="equipment-card-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="equipment-card-badges">
          <span class="badge ${product.season === 'winter' ? 'badge-winter' : 'badge-summer'}">
            ${product.season === 'winter' ? 'Invierno' : 'Verano'}
          </span>
        </div>
      </div>
      <div class="equipment-card-content">
        <h3>${product.name}</h3>
        <p class="equipment-card-description">${product.description}</p>
        <div class="equipment-card-footer">
          <span class="equipment-price">$${product.price}<span>/día</span></span>
          <button class="btn btn-primary btn-sm" onclick='openDatePicker(${JSON.stringify({...product, type: "equipment"})})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            Reservar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderActivities() {
  activitiesGrid.innerHTML = activities.map(activity => `
    <div class="card activity-card">
      <div class="activity-card-image">
        <img src="${activity.image}" alt="${activity.name}">
        <div class="activity-card-badges">
          <span class="badge ${activity.season === 'winter' ? 'badge-winter' : 'badge-summer'}">
            ${activity.season === 'winter' ? 'Invierno' : 'Verano'}
          </span>
        </div>
      </div>
      <div class="activity-card-content">
        <h3>${activity.name}</h3>
        <p class="activity-card-description">${activity.description}</p>
        <div class="activity-card-details">
          <div class="activity-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${activity.duration}</span>
          </div>
          <div class="activity-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>${activity.groupSize}</span>
          </div>
          <div class="activity-detail">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>${activity.difficulty}</span>
          </div>
        </div>
        <div class="activity-card-footer">
          <span class="activity-price">$${activity.price}<span>/persona</span></span>
          <button class="btn btn-primary" onclick='openDatePicker(${JSON.stringify({...activity, type: "activity"})})'>
            Reservar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTestimonials() {
  testimonialsGrid.innerHTML = testimonials.map(testimonial => `
    <div class="card testimonial-card">
      <div class="testimonial-header">
        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
        <div class="testimonial-info">
          <h4>${testimonial.name}</h4>
          <span class="testimonial-location">${testimonial.location}</span>
        </div>
      </div>
      <div class="testimonial-rating">
        ${Array(5).fill(0).map((_, i) => `
          <svg class="star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        `).join('')}
      </div>
      <p class="testimonial-text">"${testimonial.comment}"</p>
    </div>
  `).join('');
}

// ============================================
// UI FUNCTIONS
// ============================================

function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  // Close mobile menu if open
  mobileMenu.classList.remove('active');
}

// ============================================
// EVENT LISTENERS
// ============================================

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  header.classList.toggle('scrolled', window.scrollY > 50);
  
  // Scroll to top button
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});

// Cart overlay click to close
cartOverlay.addEventListener('click', closeCart);

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderEquipment(tab.dataset.filter);
  });
});

// Contact form
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Mensaje enviado correctamente! Te contactaremos pronto.');
  e.target.reset();
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderEquipment();
  renderActivities();
  renderTestimonials();
  updateCartUI();
});
