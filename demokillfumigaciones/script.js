// ============================================================
// KILLFUMIGACIONES · script.js
// Nav · fade-up · ESCÁNER UV (signature) · watchdog de FPS
// ============================================================

const HTML = document.documentElement;
const isLite = () => HTML.classList.contains('lite');
const WA = '5491162152800';

// ---------- Año ----------
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// ---------- Video del hero (en LITE ni se pide el mp4) ----------
(function () {
  const v = document.querySelector('.hero-vid');
  if (!v || isLite()) return;
  const src = v.dataset.src;
  if (src) { v.src = src; v.load(); }
})();

// ---------- Nav ----------
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
const navClose = document.getElementById('navClose');
if (toggle && mobile) {
  const open = () => {
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    mobile.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', open);
  if (navClose) navClose.addEventListener('click', close);
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) close();
  });
}

// ---------- Fade-up con stagger ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const sib = Array.from(el.parentElement.children).filter(c => c.classList.contains('fu'));
    el.style.transitionDelay = (sib.indexOf(el) * 65) + 'ms';
    el.classList.add('vis');
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fu').forEach(el => io.observe(el));

// ============================================================
// ESCÁNER UV — "pasá la luz por la casa"
// ============================================================
(function () {
  const stage = document.getElementById('uvStage');
  if (!stage) return;

  const spotsBox = document.getElementById('uvSpots');
  const beam     = document.getElementById('uvBeam');
  const chips    = Array.from(document.querySelectorAll('.uv-chips .chip'));
  const elKick   = document.getElementById('uvKick');
  const elTitle  = document.getElementById('uvTitle');
  const elText   = document.getElementById('uvText');
  const elDo     = document.getElementById('uvDo');
  const elDoTxt  = document.getElementById('uvDoTxt');
  const elList   = document.getElementById('uvList');
  const elCta    = document.getElementById('uvCta');
  const elNote   = document.getElementById('uvNote');

  const DATA = {
    cucaracha: {
      nombre: 'Cucarachas',
      intro: 'Salen de noche, pero viven todo el día a menos de 5 metros de donde las viste. Buscamos calor, humedad y grasa: ahí está el nido.',
      senales: ['Manchitas oscuras en las uniones de la mesada', 'Olor dulzón y rancio en el mueble bajo pileta', 'Verlas de día = la colonia ya es grande'],
      spots: [
        { x: 352, y: 455, lab: 'Detrás de la heladera',
          t: 'Detrás de la heladera', w: 'El motor da calor constante y hay grasa acumulada: es el nido más común de toda la casa. Ahí crían, no sólo pasan.',
          d: 'Gel cebo en bisagras, motor y zócalo, más polvo seco en el hueco de atrás. El cebo se lo llevan al nido y cae la colonia entera.' },
        { x: 205, y: 495, lab: 'Bajo mesada',
          t: 'El mueble bajo mesada', w: 'Humedad del sifón, restos de comida y madera con juntas abiertas. El combo perfecto para las ootecas (los huevos).',
          d: 'Gel en uniones y cajones, tratamiento de zócalos y sellado de las juntas por donde entran y salen.' },
        { x: 700, y: 500, lab: 'Rejilla del baño',
          t: 'La rejilla del baño', w: 'Las cucarachas de cañería suben desde la cámara por el desagüe. No las trajiste vos: llegan por abajo.',
          d: 'Tratamiento de rejillas y bocas de desagüe con barrera residual, y recomendación de rejilla antiplaga donde haga falta.' },
        { x: 900, y: 560, lab: 'Cámara séptica',
          t: 'La cámara y las cañerías', w: 'Es la fábrica. Si sólo se trata el departamento, en tres semanas vuelven a subir desde acá.',
          d: 'Tratamiento del pozo y de las bocas de acceso. En edificios lo coordinamos con el consorcio para hacerlo completo.' },
        { x: 450, y: 522, lab: 'Juntas y contrapiso',
          t: 'Juntas del contrapiso', w: 'Grietas de piso y pases de caños: los pasillos internos por los que se mueven entre ambientes.',
          d: 'Barrera perimetral en grietas y pases de cañería, para cortar el tránsito entre ambientes y con los vecinos.' }
      ]
    },
    roedor: {
      nombre: 'Roedores',
      intro: 'Una rata pasa por un hueco del tamaño de una moneda y un ratón por el de un lápiz. El trabajo real es tapar por dónde entran.',
      senales: ['Excremento chico y oscuro contra las paredes', 'Ruido de corridas en el techo al anochecer', 'Bolsas de residuos o alimento mordidas'],
      spots: [
        { x: 110, y: 548, lab: 'Boca de cañería',
          t: 'Cañerías rotas o sin tapa', w: 'La vía de entrada número uno en casas antiguas: un caño viejo partido bajo el contrapiso.',
          d: 'Detección del tramo, cebaderas de seguridad en el recorrido y sellado mecánico del acceso con material que no puedan roer.' },
        { x: 250, y: 180, lab: 'Entretecho',
          t: 'El entretecho', w: 'Anidan en la aislación y el machimbre. Se los escucha a la nochecita, cuando arranca la actividad.',
          d: 'Inspección del entretecho, cebaderas fijas y cierre de los accesos del alero. Retiramos material de nido.' },
        { x: 820, y: 470, lab: 'Patio y cantero',
          t: 'Madrigueras del patio', w: 'Cuevas contra la medianera o bajo el cantero: viven afuera y entran sólo a comer.',
          d: 'Cebaderas exteriores protegidas, tapado de cuevas y control del perímetro. Es lo que evita que vuelvan.' },
        { x: 230, y: 425, lab: 'Reja de ventilación',
          t: 'Rejas de ventilación', w: 'Una reja con la malla vencida es una puerta abierta. Un centímetro alcanza para un ratón.',
          d: 'Reemplazo o refuerzo con malla metálica y revisión de todas las aberturas bajas del frente y contrafrente.' },
        { x: 903, y: 495, lab: 'Residuos y depósito',
          t: 'Residuos y depósito', w: 'Sin comida no hay plaga estable. Bolsas en el piso y mercadería sin tarima sostienen la población.',
          d: 'Ordenamiento del sector, cebaderas numeradas con registro y plan de monitoreo mensual para comercios y consorcios.' }
      ]
    },
    mosquito: {
      nombre: 'Mosquitos',
      intro: 'El adulto que te pica nació a menos de 100 metros. Sin sacar el agua estancada, fumigar sólo tapa el problema por unos días.',
      senales: ['Picaduras adentro con las ventanas cerradas', 'Larvas en el agua de baldes o floreros', 'Nube de mosquitos en el patio al atardecer'],
      spots: [
        { x: 643, y: 178, lab: 'Tanque sin tapa',
          t: 'El tanque de agua', w: 'Un tanque mal tapado es un criadero ideal: agua quieta, sombra y nadie que lo revise.',
          d: 'Cierre y sellado de la tapa, y limpieza + desinfección del tanque si ya hay larvas o sedimento.' },
        { x: 128, y: 220, lab: 'Canaletas',
          t: 'Canaletas tapadas', w: 'Hojas y barro dejan agua retenida arriba todo el año. Es el criadero que nadie mira.',
          d: 'Tratamiento larvicida de la canaleta y aviso de dónde hay que destapar para que no se repita.' },
        { x: 903, y: 495, lab: 'Baldes y macetas',
          t: 'Baldes, macetas y platitos', w: 'Con dos centímetros de agua alcanza. El platito de la maceta produce mosquitos toda la temporada.',
          d: 'Relevamiento de todos los recipientes, larvicida donde el agua no se puede tirar y una lista corta de qué vaciar cada semana.' },
        { x: 820, y: 452, lab: 'Patio con sombra',
          t: 'Vegetación y sombra', w: 'De día los adultos descansan en las plantas y contra la medianera fresca. De ahí salen al atardecer.',
          d: 'Barrera perimetral residual sobre follaje, muros y zócalos exteriores. Es la que te da patio usable de verdad.' },
        { x: 712, y: 418, lab: 'Ventana del baño',
          t: 'Ventanas y ventilaciones', w: 'Entran al anochecer por baños y cocinas, atraídos por la humedad y la luz.',
          d: 'Tratamiento de marcos y ventiluces, más recomendación de mosquiteros donde convenga.' }
      ]
    },
    murcielago: {
      nombre: 'Murciélagos',
      intro: 'Están protegidos: no se matan, se excluyen. Se los saca sin dañarlos y se cierra por donde entran, o vuelven la temporada que viene.',
      senales: ['Chillidos agudos en el techo al anochecer', 'Guano acumulado bajo el alero', 'Manchas grasosas alrededor de un hueco'],
      spots: [
        { x: 470, y: 140, lab: 'Cumbrera',
          t: 'La cumbrera del entretecho', w: 'El punto más alto y cálido: ahí se cuelga la colonia. El olor y el guano bajan por el cielorraso.',
          d: 'Exclusión con válvulas de una vía: salen a comer y no pueden volver. Después cerramos y desinfectamos el guano.' },
        { x: 280, y: 182, lab: 'Bajo las tejas',
          t: 'Bajo las tejas', w: 'Se meten por huecos de dos centímetros entre teja y muro. No hace falta un agujero grande.',
          d: 'Relevamiento de todo el faldón y cierre con materiales que no alteren el techo.' },
        { x: 812, y: 222, lab: 'Alero y canaleta',
          t: 'Alero y canaleta', w: 'El espacio entre canaleta y pared es un refugio de paso, sobre todo en grupos chicos.',
          d: 'Cierre del espacio y tratamiento repelente puntual, siempre después de que salieron.' },
        { x: 390, y: 268, lab: 'Ventilación del techo',
          t: 'Ventilaciones del techo', w: 'Sombreretes y ventiluces sin malla son la entrada directa al entretecho.',
          d: 'Colocación de malla y sellado, coordinado con la exclusión para no dejar ningún animal encerrado.' },
        { x: 643, y: 205, lab: 'Losa del tanque',
          t: 'Perímetro del tanque', w: 'El guano en la losa contamina el sector del tanque y es un riesgo sanitario concreto.',
          d: 'Retiro del guano con protección, desinfección de la losa y control del tanque si hubo contacto.' }
      ]
    },
    pulga: {
      nombre: 'Pulgas',
      intro: 'Sólo el 5% de la infestación son las pulgas que ves. El resto son huevos y larvas en textiles, alfombras y juntas del piso.',
      senales: ['Picaduras en tobillos, siempre en la misma zona', 'Puntitos negros en la cama de la mascota', 'Aparecieron después de una mudanza o un viaje'],
      spots: [
        { x: 490, y: 483, lab: 'Sillón y alfombras',
          t: 'Sillón, alfombras y textiles', w: 'Los huevos caen entre las fibras y eclosionan por semanas. Por eso "se van y vuelven".',
          d: 'Tratamiento de textiles con producto habilitado más regulador de crecimiento, que corta el ciclo de huevo a adulto.' },
        { x: 430, y: 300, lab: 'Zócalos del dormitorio',
          t: 'Zócalos del dormitorio', w: 'La junta entre zócalo y piso es donde se refugian las larvas, lejos de la luz.',
          d: 'Aplicación dirigida en zócalos y perímetro de los ambientes, que es donde realmente vive la plaga.' },
        { x: 830, y: 503, lab: 'Cucha de la mascota',
          t: 'La cucha y su recorrido', w: 'El foco casi siempre está donde la mascota duerme y en el camino que repite todos los días.',
          d: 'Tratamiento del sector y del recorrido, con indicaciones de lavado y de coordinar con la pipeta del veterinario.' },
        { x: 250, y: 505, lab: 'Bajo los muebles',
          t: 'Debajo de los muebles bajos', w: 'Zona oscura, sin tránsito y con pelusa: la guardería perfecta para las larvas.',
          d: 'Aplicación bajo muebles y detrás de zócalos, más pautas de aspirado para levantar huevos antes del tratamiento.' },
        { x: 560, y: 518, lab: 'Juntas del piso',
          t: 'Juntas del piso', w: 'En pisos de madera o cerámicos viejos las juntas guardan huevos por semanas.',
          d: 'Tratamiento de juntas con producto residual y una segunda pasada a los 15 días si el caso lo pide.' }
      ]
    }
  };

  // viewBox del plano: los focos se guardan en unidades del dibujo
  const VB = { x: 80, y: 70, w: 860, h: 533 };
  const px = v => ((v - VB.x) / VB.w) * 100;
  const py = v => ((v - VB.y) / VB.h) * 100;

  let actual = 'cucaracha';

  function waLink(txt) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  }

  function pintarPanel(p) {
    elKick.textContent = p.nombre;
    elTitle.textContent = 'Dónde la buscamos';
    elText.textContent = p.intro;
    elDo.hidden = true;
    elList.innerHTML = p.senales.map(s => '<li>' + s + '</li>').join('');
    elCta.href = waLink('Hola KillFumigaciones, tengo ' + p.nombre.toLowerCase() + '. ¿Me pasan un presupuesto?');
  }

  function pintarSpot(p, s) {
    elKick.textContent = p.nombre + ' · punto crítico';
    elTitle.textContent = s.t;
    elText.textContent = s.w;
    elDoTxt.textContent = s.d;
    elDo.hidden = false;
    elCta.href = waLink('Hola KillFumigaciones, tengo ' + p.nombre.toLowerCase() +
      '. Vi en la web el punto "' + s.t + '". ¿Me pasan un presupuesto?');
  }

  function render(key) {
    const p = DATA[key];
    actual = key;
    spotsBox.innerHTML = '';
    p.spots.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const L = px(s.x), T = py(s.y);
      b.className = 'spot' + (L > 66 ? ' flip' : '');
      b.style.left = L + '%';
      b.style.top = T + '%';
      b.style.animationDelay = (i * 70) + 'ms';
      b.setAttribute('aria-label', s.t);
      b.innerHTML = '<span class="spot-lab">' + s.lab + '</span>';
      b.addEventListener('click', () => {
        spotsBox.querySelectorAll('.spot').forEach(o => o.classList.remove('is-sel'));
        b.classList.add('is-sel');
        pintarSpot(p, s);
      });
      spotsBox.appendChild(b);
    });
    pintarPanel(p);
  }

  chips.forEach(c => {
    c.addEventListener('click', () => {
      chips.forEach(o => { o.classList.remove('is-on'); o.setAttribute('aria-selected', 'false'); });
      c.classList.add('is-on');
      c.setAttribute('aria-selected', 'true');
      render(c.dataset.plaga);
    });
  });

  // Linterna: sólo con puntero fino. En touch/LITE se muestran todos los focos.
  const finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  function revelarTodo() {
    stage.classList.add('reveal');
    if (elNote) elNote.textContent = 'Tocá un punto para ver el detalle';
  }

  if (finePointer && !isLite()) {
    let raf = null, mx = 0, my = 0;
    const move = e => {
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        stage.style.setProperty('--mx', mx + 'px');
        stage.style.setProperty('--my', my + 'px');
        raf = null;
      });
    };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerenter', () => stage.classList.add('lit'));
    stage.addEventListener('pointerleave', () => {
      stage.classList.remove('lit');
      stage.style.setProperty('--mx', '-500px');
      stage.style.setProperty('--my', '-500px');
    });
    // Si alguien llega por teclado, que no quede todo apagado
    stage.addEventListener('focusin', revelarTodo);
  } else {
    revelarTodo();
  }

  render('cucaracha');
})();

// ============================================================
// Watchdog de FPS — si el equipo no da, degradamos en caliente
// ============================================================
(function () {
  if (isLite() || HTML.classList.contains('full')) return;
  let frames = 0;
  const t0 = performance.now();
  function tick(t) {
    frames++;
    if (t - t0 < 2000) { requestAnimationFrame(tick); return; }
    const fps = frames / ((t - t0) / 1000);
    if (fps < 28) {
      HTML.classList.add('lite');
      try { sessionStorage.setItem('kf_lite', '1'); } catch (e) {}
      const stage = document.getElementById('uvStage');
      if (stage) stage.classList.add('reveal');
    }
  }
  requestAnimationFrame(tick);
})();
