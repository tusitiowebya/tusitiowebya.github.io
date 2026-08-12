/* ═══════════════════════════════════════════════
   ADRE Propiedades
   Buscador que arma la consulta y la manda por WhatsApp
   ═══════════════════════════════════════════════ */

const WA = '5491158783199';

const ZONAS = ['Caballito','Almagro','Villa Crespo','Palermo','Flores','Boedo',
  'Villa del Parque','Devoto','Belgrano','Núñez','Vicente López','San Martín',
  'Ramos Mejía','Lanús','Avellaneda','Otra zona'];

const TIPOS = ['Departamento','Casa','PH','Local comercial','Oficina','Terreno o lote','Cochera'];

const AMBIENTES = ['Monoambiente','2 ambientes','3 ambientes','4 ambientes','5 o más','No importa'];

const PRESUPUESTO_VENTA = ['Hasta USD 60.000','USD 60.000 a 90.000','USD 90.000 a 130.000',
  'USD 130.000 a 200.000','Más de USD 200.000','Lo definimos juntos'];

const PRESUPUESTO_ALQ = ['Hasta $400.000','$400.000 a $600.000','$600.000 a $850.000',
  '$850.000 a $1.200.000','Más de $1.200.000','Lo definimos juntos'];

const SUPERFICIE = ['Hasta 40 m²','40 a 60 m²','60 a 90 m²','90 a 130 m²','Más de 130 m²'];

/* campos según la operación elegida */
const FORMS = {
  comprar: [
    { id:'tipo',  label:'Qué buscás',   opts:TIPOS },
    { id:'zona',  label:'En qué zona',  opts:ZONAS },
    { id:'amb',   label:'Ambientes',    opts:AMBIENTES },
    { id:'pres',  label:'Presupuesto',  opts:PRESUPUESTO_VENTA }
  ],
  alquilar: [
    { id:'tipo',  label:'Qué buscás',   opts:TIPOS },
    { id:'zona',  label:'En qué zona',  opts:ZONAS },
    { id:'amb',   label:'Ambientes',    opts:AMBIENTES },
    { id:'pres',  label:'Alquiler mensual', opts:PRESUPUESTO_ALQ }
  ],
  tasar: [
    { id:'tipo',  label:'Qué tenés',    opts:TIPOS },
    { id:'zona',  label:'Dónde queda',  opts:ZONAS },
    { id:'amb',   label:'Ambientes',    opts:AMBIENTES },
    { id:'sup',   label:'Superficie',   opts:SUPERFICIE }
  ]
};

const TEXTOS = {
  comprar:  { cta:'Enviar mi búsqueda',  intro:'Hola ADRE! Estoy buscando para comprar:' },
  alquilar: { cta:'Enviar mi búsqueda',  intro:'Hola ADRE! Estoy buscando para alquilar:' },
  tasar:    { cta:'Pedir mi tasación',   intro:'Hola ADRE! Quería tasar mi propiedad:' }
};

(function finder(){
  const grid = document.getElementById('finderGrid');
  if(!grid) return;

  const tabs = document.querySelectorAll('.finder__tabs button');
  const go   = document.getElementById('finderGo');
  const goTx = document.getElementById('finderGoTxt');
  const hint = document.getElementById('finderHint');

  let op = 'comprar';
  const valores = {};

  function pintar(){
    grid.innerHTML = FORMS[op].map(f => `
      <div class="fld">
        <label for="f-${f.id}">${f.label}</label>
        <select id="f-${f.id}" data-k="${f.id}">
          ${f.opts.map((o,i) => `<option${i===0?' selected':''}>${o}</option>`).join('')}
        </select>
      </div>`).join('');

    // arranca con el primer valor de cada campo
    Object.keys(valores).forEach(k => delete valores[k]);
    grid.querySelectorAll('select').forEach(s => { valores[s.dataset.k] = s.value; });
    goTx.textContent = TEXTOS[op].cta;
    armar();
  }

  function armar(){
    const f = FORMS[op];
    const partes = f.map(c => `• ${c.label}: ${valores[c.id]}`).join('\n');
    const cierre = op === 'tasar'
      ? '\n\n¿Cuándo podrían pasar a verla?'
      : '\n\n¿Me pasan las opciones que tengan?';
    const txt = `${TEXTOS[op].intro}\n\n${partes}${cierre}`;
    go.href = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;

    const resumen = op === 'tasar'
      ? `${valores.tipo} en <b>${valores.zona}</b>, ${valores.sup}`
      : `${valores.tipo} en <b>${valores.zona}</b>, ${valores.amb}`;
    hint.innerHTML = resumen + ' — te respondemos por WhatsApp.';
  }

  grid.addEventListener('change', e => {
    const s = e.target.closest('select');
    if(!s) return;
    valores[s.dataset.k] = s.value;
    armar();
  });

  tabs.forEach(b => b.addEventListener('click', () => {
    op = b.dataset.op;
    tabs.forEach(x => x.classList.toggle('is-on', x === b));
    pintar();
  }));

  pintar();
})();

/* ═══════════ NAV ═══════════ */
(function nav(){
  const bar = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('navMobile');

  const scroll = () => bar.classList.toggle('is-stuck', window.scrollY > 30);
  scroll();
  window.addEventListener('scroll', scroll, { passive:true });

  burger.addEventListener('click', () => {
    const abierto = menu.classList.toggle('is-open');
    burger.classList.toggle('is-open', abierto);
    burger.setAttribute('aria-expanded', abierto);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', false);
  }));
})();

/* ═══════════ REVEAL ═══════════ */
(function reveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(i => i.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
      if(!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('is-in'), i * 85);
      io.unobserve(e.target);
    });
  }, { threshold:.14, rootMargin:'0px 0px -8% 0px' });
  items.forEach(i => io.observe(i));
})();

document.getElementById('yr').textContent = new Date().getFullYear();
