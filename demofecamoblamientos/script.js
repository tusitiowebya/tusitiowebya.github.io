// ============================================================
// FEC AMOBLAMIENTOS · script.js
// ============================================================

// Año dinámico
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Nav scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú mobile
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const navClose = document.getElementById('navClose');
if (toggle && mobile) {
  const open = () => { mobile.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobile.classList.remove('open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', open);
  if (navClose) navClose.addEventListener('click', close);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) close();
  });
}

// ============================================================
// SWITCHER de ambientes (signature interactiva)
// ============================================================
const WORK = {
  cocina: {
    t: 'Cocinas a medida',
    d: 'Aprovechamos cada rincón: alacenas hasta el techo, bajo mesadas con cajones de extracción total y herrajes que cierran solos. Melaminas, lacas o madera real, a tu gusto.',
    cta: 'Consultar por cocinas',
    wa: 'una%20cocina%20a%20medida'
  },
  vestidor: {
    t: 'Placares & Vestidores',
    d: 'Desde un placard de dos puertas hasta un vestidor completo con iluminación, zapatero y cajoneras forradas. Orden hecho a tu medida y a tu ropa.',
    cta: 'Consultar por placares',
    wa: 'un%20placard%20o%20vestidor'
  },
  living: {
    t: 'Livings & Racks',
    d: 'Muebles de TV, bibliotecas y racks que organizan el living sin que sobre ni falte un centímetro. Pensados para tus equipos y tu pared.',
    cta: 'Consultar por livings',
    wa: 'un%20mueble%20de%20living%20o%20rack'
  },
  dormitorio: {
    t: 'Dormitorios',
    d: 'Placares, respaldos, mesas de luz y escritorios integrados que hacen rendir el cuarto. Una solución completa para descansar y guardar.',
    cta: 'Consultar por dormitorios',
    wa: 'un%20amoblamiento%20de%20dormitorio'
  },
  bano: {
    t: 'Baños & Vanitories',
    d: 'Vanitories suspendidos, muebles bajo mesada y guardado resistente a la humedad, con la terminación que combina con tu baño.',
    cta: 'Consultar por vanitories',
    wa: 'un%20vanitory%20a%20medida'
  }
};
const WA_NUM = '5493815509094';

const tabs = document.querySelectorAll('.wt');
const imgs = document.querySelectorAll('.wimg');
const wTitle = document.getElementById('workTitle');
const wDesc = document.getElementById('workDesc');
const wCta = document.getElementById('workCta');

function selectWork(k) {
  tabs.forEach(t => {
    const on = t.dataset.k === k;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  imgs.forEach(im => im.classList.toggle('is-active', im.dataset.k === k));
  const data = WORK[k];
  if (data && wTitle) {
    wTitle.textContent = data.t;
    wDesc.textContent = data.d;
    wCta.firstChild.textContent = data.cta + ' ';
    wCta.href = 'https://wa.me/' + WA_NUM + '?text=Hola%20FEC%2C%20quiero%20presupuestar%20' + data.wa + '.';
  }
}
tabs.forEach(t => {
  t.addEventListener('click', () => selectWork(t.dataset.k));
  t.addEventListener('mouseenter', () => selectWork(t.dataset.k));
});

// ============================================================
// MUESTRAS de terminación
// ============================================================
const swatches = document.querySelectorAll('.sw');
const matPreview = document.getElementById('matPreview');
const matName = document.getElementById('matName');
swatches.forEach(s => {
  const apply = () => {
    swatches.forEach(o => o.classList.remove('is-active'));
    s.classList.add('is-active');
    if (matPreview) matPreview.style.background = getComputedStyle(s).getPropertyValue('--c');
    if (matName) matName.textContent = s.dataset.name;
  };
  s.addEventListener('click', apply);
  s.addEventListener('mouseenter', apply);
});

// ============================================================
// Fade-up con stagger por hermanos
// ============================================================
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    const i = siblings.indexOf(el);
    el.style.transitionDelay = (i * 65) + 'ms';
    el.classList.add('vis');
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fu').forEach(el => io.observe(el));
