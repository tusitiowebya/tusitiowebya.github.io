/* Balance Legal — interacción */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  if (/[?&]qa\b/.test(location.search)) root.classList.add('qa');

  const WA = '522292508113';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  /* ---------- WhatsApp por botón ---------- */
  const MSG = {
    hero: 'Hola, vengo de la página de Balance Legal. Quisiera una consulta confidencial sobre un asunto penal.',
    defensa: 'Hola, vengo de la página de Balance Legal. Quisiera consultar sobre una defensa penal.',
    amparo: 'Hola, vengo de la página de Balance Legal. Quisiera consultar sobre un juicio de amparo.',
    asesoria: 'Hola, vengo de la página de Balance Legal. Quisiera una asesoría jurídica penal.',
    contacto: 'Hola, vengo de la página de Balance Legal. Quisiera agendar una consulta.',
    fab: 'Hola, vengo de la página de Balance Legal. Quisiera una consulta confidencial.'
  };
  $$('[data-wa]').forEach((a) => { if (MSG[a.dataset.wa]) a.href = wa(MSG[a.dataset.wa]); });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  const hero = $('#inicio');
  const fab = $('#fab');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40);
    fab.classList.toggle('is-on', y > innerHeight * 0.7);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const closeMenu = () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('is-solid');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', closeMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- encendido del escudo ---------- */
  const lightOn = () => {
    if (reduce || root.classList.contains('qa')) { hero.classList.remove('is-dark'); return; }
    setTimeout(() => hero.classList.add('is-flicker'), 250);
    setTimeout(() => hero.classList.remove('is-dark'), 950);
  };
  const shield = $('.sign__shield');
  if (shield.complete) lightOn(); else { shield.addEventListener('load', lightOn); shield.addEventListener('error', lightOn); }
  setTimeout(() => hero.classList.remove('is-dark'), 2600); // red lenta: no dejar el muro a oscuras

  /* ---------- luz que sigue al puntero: sombras de las letras ---------- */
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    let raf = 0, tx = 0, ty = 0;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        hero.style.setProperty('--sx', `${(-tx * 26 + 4).toFixed(1)}px`);
        hero.style.setProperty('--sy', `${(-ty * 22 + 8).toFixed(1)}px`);
        hero.style.setProperty('--px', tx.toFixed(3));
        hero.style.setProperty('--py', ty.toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => {
      ['--sx', '--sy', '--px', '--py'].forEach((p) => hero.style.removeProperty(p));
    });
  }

  /* ---------- títulos que no deben cortarse (letra grande en Android) ---------- */
  const fit = () => {
    $$('.fit').forEach((el) => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      const max = el.parentElement.clientWidth;
      let guard = 40;
      while (el.scrollWidth > max + 1 && fs > 12 && guard--) {
        fs -= 1;
        el.style.fontSize = `${fs}px`;
      }
    });
  };
  window.__blFit = fit;
  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  addEventListener('load', fit);
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(fit, 120); });

  /* ---------- etapas del proceso penal ---------- */
  const STAGES = [
    {
      id: 'citatorio', tab: 'Me citaron a declarar', title: 'Investigación inicial',
      what: 'La Fiscalía (Ministerio Público) abrió una carpeta de investigación y puede citarle a una entrevista. Todavía no interviene un juez, pero lo que usted diga queda en la carpeta.',
      term: 'No hay un plazo que corra en su contra, pero la fecha del citatorio sí: revíselo con un abogado antes de presentarse. Tiene derecho a declarar o a guardar silencio.',
      have: ['El citatorio o una foto legible', 'Número de carpeta de investigación, si aparece', 'Fiscalía o agencia que cita, fecha y hora', 'Identificación oficial'],
      def: ['Revisar en qué calidad le citan', 'Acompañarle a la diligencia', 'Definir si conviene declarar o guardar silencio']
    },
    {
      id: 'detencion', tab: 'Hubo una detención', title: 'Detención y retención', clock: true,
      what: 'Si la detención fue en flagrancia o por caso urgente, el Ministerio Público solo puede retener a la persona hasta 48 horas (96 en delincuencia organizada); en ese plazo debe liberarla o ponerla a disposición de un juez.',
      term: 'Hasta 48 horas ante el Ministerio Público (art. 16 constitucional). Si la detención fue por orden de aprehensión, la persona debe ser presentada ante el juez sin demora.',
      have: ['Nombre completo de la persona detenida', 'Lugar y hora aproximada de la detención', 'Corporación que la detuvo, si se sabe', 'Agencia o Fiscalía a la que la trasladaron'],
      def: ['Localizar a la persona y entrevistarse con ella', 'Verificar la legalidad de la detención', 'Preparar la audiencia inicial']
    },
    {
      id: 'orden', tab: 'Hay una orden de aprehensión', title: 'Orden de aprehensión',
      what: 'Un juez puede librar una orden para que una persona sea presentada ante él. Según el caso, puede valorarse un juicio de amparo o una comparecencia voluntaria acompañada de su defensa.',
      term: 'Mientras la orden no se ejecute hay más margen para actuar: conviene revisarla de inmediato.',
      have: ['Juzgado y número de causa penal, si los conoce', 'Cualquier notificación o documento recibido', 'Identificación oficial'],
      def: ['Revisar la causa penal', 'Valorar un juicio de amparo', 'Planear la comparecencia con defensa']
    },
    {
      id: 'audiencia', tab: 'Audiencia inicial', title: 'Audiencia inicial',
      what: 'Ante el juez de control se revisa la legalidad de la detención, se formula la imputación y se discuten la vinculación a proceso y las medidas cautelares.',
      term: '72 horas para resolver la vinculación a proceso desde que la persona queda a disposición del juez; la defensa puede pedir que se amplíe a 144 horas para ofrecer datos de prueba (art. 19 constitucional).',
      have: ['Fecha, hora y sala de la audiencia', 'Datos de la carpeta o de la causa penal', 'Documentos que acrediten arraigo: domicilio, trabajo, familia'],
      def: ['Debatir la legalidad de la detención', 'Ofrecer datos de prueba en el plazo constitucional', 'Discutir medidas cautelares proporcionales']
    },
    {
      id: 'vinculado', tab: 'Me vincularon a proceso', title: 'Investigación complementaria',
      what: 'El juez fija un plazo para cerrar la investigación. Es el momento de construir la teoría del caso y de valorar salidas alternas, como el acuerdo reparatorio o la suspensión condicional del proceso.',
      term: 'Hasta 2 meses si la pena máxima no excede de 2 años de prisión, o hasta 6 meses si la excede (art. 321 del Código Nacional de Procedimientos Penales).',
      have: ['Auto de vinculación a proceso', 'Medidas cautelares impuestas', 'Fechas de las próximas audiencias'],
      def: ['Solicitar actos de investigación', 'Valorar salidas alternas o procedimiento abreviado', 'Revisar las medidas cautelares']
    },
    {
      id: 'intermedia', tab: 'Ya hay acusación', title: 'Etapa intermedia',
      what: 'La Fiscalía presenta su acusación. Las partes ofrecen y depuran pruebas, y el juez decide qué llega a juicio con el auto de apertura.',
      term: 'Los plazos corren desde que se notifica la acusación: conviene revisarla con su abogado de inmediato.',
      have: ['Escrito de acusación', 'Pruebas o documentos que tenga a su favor', 'Datos de posibles testigos'],
      def: ['Contestar la acusación', 'Pedir la exclusión de pruebas ilícitas', 'Preparar la estrategia de juicio']
    },
    {
      id: 'juicio', tab: 'Juicio o sentencia', title: 'Juicio oral y después',
      what: 'Ante el tribunal de enjuiciamiento se desahogan las pruebas y se dicta sentencia. Después pueden proceder recursos como la apelación y, en su caso, el amparo directo.',
      term: 'Los recursos tienen plazos cortos que corren desde la notificación de la sentencia.',
      have: ['Sentencia o resolución notificada', 'Fecha de notificación', 'Datos del tribunal y número de causa'],
      def: ['Litigar el juicio oral', 'Interponer apelación', 'Valorar el amparo directo']
    }
  ];

  const rail = $('#rail');
  const stageEl = $('#stage');
  const fill = document.createElement('span');
  fill.className = 'rail__fill';
  rail.appendChild(fill);
  STAGES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rail__btn';
    b.id = `tab-${s.id}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'stage');
    b.innerHTML = `<small>${String(i + 1).padStart(2, '0')}</small>${s.tab}`;
    b.addEventListener('click', () => select(i, true));
    rail.appendChild(b);
  });
  const tabs = $$('.rail__btn', rail);
  rail.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (n !== null) { e.preventDefault(); select(n, true); tabs[n].focus(); }
  });

  let current = 0;
  const list = (ul, items) => { ul.innerHTML = items.map((t) => `<li>${t}</li>`).join(''); };
  function select(i, user) {
    current = i;
    const s = STAGES[i];
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
      t.classList.toggle('is-past', k < i);
    });
    stageEl.setAttribute('aria-labelledby', tabs[i].id);
    const first = tabs[0].offsetLeft, cur = tabs[i];
    fill.style.left = `${first}px`;
    fill.style.width = `${cur.offsetLeft - first + 22}px`;
    $('#st-num').textContent = `Etapa ${String(i + 1).padStart(2, '0')} de ${STAGES.length}`;
    $('#st-title').textContent = s.title;
    $('#st-what').textContent = s.what;
    $('#st-term').textContent = s.term;
    list($('#st-have'), s.have);
    list($('#st-def'), s.def);
    $('#clock').hidden = !s.clock;
    if (user) {
      stageEl.classList.remove('is-swap');
      void stageEl.offsetWidth;
      stageEl.classList.add('is-swap');
      if (matchMedia('(max-width: 768px)').matches) cur.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    }
    if (s.clock) tick();
    buildMsg();
  }
  addEventListener('resize', () => select(current, false));

  /* ---------- reloj de la detención (48 h ante el MP) ---------- */
  const clockIn = $('#clock-in');
  const clockOut = $('#clock-out');
  const pad = (n) => String(n).padStart(2, '0');
  const toLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const fmt = (d) => d.toLocaleString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  clockIn.max = toLocal(new Date());
  $('#clock-now').addEventListener('click', () => { clockIn.value = toLocal(new Date()); tick(); });
  clockIn.addEventListener('input', tick);
  function tick() {
    if (!clockIn.value) {
      clockOut.innerHTML = '<div class="clock__line"><p>Indique fecha y hora aproximadas y le mostramos hasta cuándo puede durar la retención ante el Ministerio Público.</p></div>';
      return;
    }
    const start = new Date(clockIn.value);
    const end = new Date(start.getTime() + 48 * 3600e3);
    const left = end - Date.now();
    const h = Math.floor(Math.abs(left) / 3600e3);
    const m = Math.floor((Math.abs(left) % 3600e3) / 60e3);
    if (left > 0) {
      clockOut.innerHTML = `<div class="clock__line"><span class="clock__h">${h} h ${pad(m)} min</span><p>para que se cumplan las 48 horas: <b>${fmt(end).replace(/\.$/, '')}</b>.</p><small>Si la persona ya está ante un juez, corre el plazo de 72 horas para resolver la vinculación a proceso (ampliable a 144 a petición de la defensa).</small></div>`;
    } else {
      clockOut.innerHTML = `<div class="clock__line"><span class="clock__h is-over">+48 h</span><p>Ya pasaron las 48 horas desde la detención. Llame ahora para saber ante quién está la persona.</p></div>`;
    }
  }
  setInterval(() => { if (STAGES[current].clock) tick(); }, 30000);

  /* ---------- consulta confidencial ---------- */
  const form = $('#consulta');
  const preview = $('#c-preview');
  const send = $('#c-send');
  function buildMsg() {
    const para = $('input[name="para"]:checked', form).value;
    const via = $('input[name="via"]:checked', form).value;
    const ciudad = $('#c-ciudad').value.trim();
    const nombre = $('#c-nombre').value.trim();
    const s = STAGES[current];
    const lines = [
      `Hola${nombre ? `, soy ${nombre}` : ''}. Vengo de la página de Balance Legal y quiero una consulta confidencial.`,
      '',
      `• Etapa: ${s.title}`,
      `• Es ${para}`,
      ciudad ? `• Ciudad: ${ciudad}` : null,
      `• Prefiero que me contacten ${via}`
    ];
    if (s.clock && clockIn.value) lines.push(`• Hora aproximada de la detención: ${fmt(new Date(clockIn.value))}`);
    lines.push('', 'Los detalles del caso los platico directamente con el abogado.');
    const msg = lines.filter((l) => l !== null).join('\n');
    preview.textContent = msg;
    send.href = wa(msg);
  }
  form.addEventListener('input', buildMsg);
  form.addEventListener('change', buildMsg);
  form.addEventListener('submit', (e) => e.preventDefault());
  clockIn.addEventListener('change', buildMsg);
  select(0, false);

  /* ---------- aparición ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

  /* ---------- video de la banda: cargar al acercarse ---------- */
  const vera = $('.vera__video');
  if (vera && 'IntersectionObserver' in window) {
    const vo = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { vera.preload = 'auto'; vera.play().catch(() => {}); } else vera.pause();
      });
    }, { rootMargin: '200px 0px' });
    vo.observe(vera);
  }

  $('#year').textContent = new Date().getFullYear();
})();
