/* DRA. MON — script de la landing */
(() => {
  const WA = '5491149609904';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const QA = /[?&]qa\b/.test(location.search);
  if (QA) document.documentElement.classList.add('qa');
  const waUrl = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  const setWa = (a) => { a.href = waUrl(a.dataset.wa); };

  /* ---------- links de WhatsApp ---------- */
  $$('[data-wa]').forEach(setWa);

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    links.classList.toggle('is-open', open);
  });
  $$('a', links).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  }));

  /* ---------- reveal ---------- */
  const reveals = $$('.reveal');
  if (QA || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const sibs = $$('.reveal', e.target.parentElement);
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 4) * 80}ms`;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- videos de las puertas: pausar fuera de pantalla ---------- */
  const vids = $$('.door-vid');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {});
        else e.target.pause();
      });
    }, { threshold: .1 });
    vids.forEach(v => vio.observe(v));
  }

  /* ---------- motivos (compartidos por tallímetro y recetario) ---------- */
  const MOTIVOS = {
    'Recién nacido': ['Control del recién nacido', 'Neonatología', 'Dermatología', 'Otra consulta'],
    'Bebé / niño': ['Control de niño sano', 'Consulta pediátrica', 'Certificado médico', 'Dermatología', 'Otra consulta'],
    'Adolescente': ['Consulta pediátrica', 'Certificado médico', 'Dermatología', 'Otra consulta'],
    'Adulto': ['Dermatología', 'Plasma rico en plaquetas capilar', 'Plasma rico en plaquetas facial', 'Mesoterapia capilar', 'Mesoterapia facial', 'Mesoterapia para celulitis', 'Otra consulta']
  };

  /* ---------- tallímetro ---------- */
  const STAGES = [
    { title: 'Recién nacido', age: 'Primeros días de vida', mark: 30, quien: 'Recién nacido',
      items: [['Control del recién nacido', 'Los primeros controles del bebé'], ['Neonatología', 'Consulta de los primeros días']],
      note: '' },
    { title: 'Bebés y niños', age: '1 mes a 12 años', mark: 110, quien: 'Bebé / niño',
      items: [['Control de niño sano', 'Peso, talla y desarrollo en cada etapa'], ['Consulta pediátrica', 'Cuando algo te preocupa'], ['Certificados', 'Para el colegio, el club o la actividad'], ['Dermatología', 'Consulta de la piel']],
      note: '' },
    { title: 'Adolescentes', age: '13 a 17 años', mark: 158, quien: 'Adolescente',
      items: [['Consulta pediátrica', 'Seguimiento en la adolescencia'], ['Certificados', 'Para el colegio, el club o la actividad'], ['Dermatología', 'Consulta de la piel']],
      note: '' },
    { title: 'Adultos', age: '18 años en adelante', mark: 172, quien: 'Adulto',
      items: [['Dermatología', 'Consulta de la piel'], ['Plasma rico en plaquetas', 'Capilar y facial', true], ['Mesoterapia', 'Capilar, facial y para celulitis', true]],
      note: 'Los tratamientos de Mesomed los realizan médicos y se indican después de una consulta.' }
  ];

  const wall = $('.tall-wall');
  const ticks = $('#tallTicks');
  for (let cm = 0; cm <= 190; cm += 10) {
    const i = document.createElement('i');
    i.style.bottom = `calc(${cm} * var(--pxcm))`;
    if (cm % 50 === 0) {
      i.className = 'l';
      if (cm > 0) {
        const b = document.createElement('b');
        b.textContent = cm;
        b.style.bottom = `calc(${cm} * var(--pxcm))`;
        ticks.appendChild(b);
      }
    }
    ticks.appendChild(i);
  }

  const range = $('#tallRange');
  const kids = $$('.kid');
  const card = $('#tallCard');
  let stage = 1;

  const renderStage = (n) => {
    stage = n;
    const s = STAGES[n];
    kids.forEach(k => k.classList.toggle('is-on', +k.dataset.stage === n));
    kids.forEach(k => k.setAttribute('aria-pressed', +k.dataset.stage === n));
    wall.style.setProperty('--mark', s.mark);
    $('#tallCm').textContent = s.age;
    $('#tallTitle').textContent = s.title;
    $('#tallAge').textContent = s.age;
    $('#tallList').innerHTML = s.items.map(([t, d, m]) =>
      `<li class="${m ? 'meso' : ''}"><div>${t}<small>${d}</small></div></li>`).join('');
    $('#tallNote').textContent = s.note;
    card.classList.toggle('is-adult', n === 3);
    range.value = n;
    range.setAttribute('aria-valuetext', s.title);
  };
  kids.forEach(k => k.addEventListener('click', () => renderStage(+k.dataset.stage)));
  range.addEventListener('input', () => renderStage(+range.value));

  // arrastrar la marca sobre la pared
  let dragging = false;
  const fromPointer = (e) => {
    const r = wall.getBoundingClientRect();
    const x = e.clientX - r.left - 58;
    const w = r.width - 68;
    renderStage(Math.max(0, Math.min(3, Math.floor((x / w) * 4))));
  };
  wall.addEventListener('pointerdown', (e) => { if (e.target === range) return; dragging = true; fromPointer(e); });
  window.addEventListener('pointermove', (e) => { if (dragging) fromPointer(e); });
  window.addEventListener('pointerup', () => { dragging = false; });
  renderStage(1);

  /* ---------- Mesomed: zonas ---------- */
  const ZONES = {
    cabello: { img: 'media/capilar.jpg', alt: 'Aplicación de tratamiento en el cuero cabelludo',
      quote: '“Frena la caída, estimula el crecimiento, fortalece el cabello.”',
      items: [['Plasma rico en plaquetas capilar', 'Se aplica en el cuero cabelludo, realizado por médicos.'],
              ['Mesoterapia capilar', 'Frena la caída, estimula el crecimiento y fortalece el cabello.']] },
    rostro: { img: 'media/facial.jpg', alt: 'Aplicación de un tratamiento facial',
      quote: '“Dale luz a tu rostro.”',
      items: [['Plasma rico en plaquetas facial', 'Tratamiento facial realizado por médicos.'],
              ['Mesoterapia facial', 'Para darle luz a tu rostro.']] },
    cuerpo: { img: 'media/celulitis.jpg', alt: 'Piernas, zona de tratamiento de celulitis',
      quote: '“Resultados visibles desde las primeras sesiones.”',
      items: [['Mesoterapia para celulitis', 'Resultados visibles desde las primeras sesiones.']] }
  };
  const zImg = $('#zoneImg');
  const zCta = $('#zoneCta');
  const renderZone = (key) => {
    const z = ZONES[key];
    $$('.zone').forEach(b => {
      const on = b.dataset.zone === key;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on);
    });
    zImg.classList.add('is-swap');
    setTimeout(() => { zImg.src = z.img; zImg.alt = z.alt; zImg.classList.remove('is-swap'); }, QA ? 0 : 220);
    $('#zoneQuote').textContent = z.quote;
    $('#zoneKicker').textContent = `Zona · ${key[0].toUpperCase()}${key.slice(1)}`;
    $('#zoneList').innerHTML = z.items.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('');
    zCta.dataset.wa = `Hola! Quería consultar por las promos de Mesomed para ${key}.`;
    setWa(zCta);
  };
  $$('.zone').forEach(b => b.addEventListener('click', () => renderZone(b.dataset.zone)));
  renderZone('cabello');

  /* ---------- recetario ---------- */
  const fQuien = $('#fQuien');
  const fMotivo = $('#fMotivo');
  const fNombre = $('#fNombre');
  const fOS = $('#fOS');
  const fNota = $('#fNota');
  const hand = $('#padHand');
  const stamp = $('#padStamp');
  const esc = (t) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const fillMotivos = (keep) => {
    const list = MOTIVOS[fQuien.value];
    fMotivo.innerHTML = list.map(m => `<option>${m}</option>`).join('');
    if (keep && list.includes(keep)) fMotivo.value = keep;
  };
  const horario = () => ($('input[name=horario]:checked') || {}).value || 'cualquier horario';

  const renderHand = () => {
    const nombre = fNombre.value.trim();
    const quien = fQuien.value.toLowerCase();
    hand.innerHTML = `Turno para <b>${nombre ? esc(nombre) : '…'}</b> (${esc(quien)}): ${esc(fMotivo.value.toLowerCase())}, ${esc(horario())}.`;
  };

  fQuien.addEventListener('change', () => { fillMotivos(fMotivo.value); renderHand(); });
  [fMotivo, fNombre, fOS, fNota].forEach(el => el.addEventListener('input', renderHand));
  $$('input[name=horario]').forEach(r => r.addEventListener('change', renderHand));
  fillMotivos();
  renderHand();

  $('#tallGo').addEventListener('click', () => {
    const s = STAGES[stage];
    fQuien.value = s.quien;
    fillMotivos();
    fMotivo.value = MOTIVOS[s.quien][0];
    renderHand();
    $('#turno').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => fNombre.focus({ preventScroll: true }), 700);
  });

  $('#pad').addEventListener('submit', (e) => {
    e.preventDefault();
    const lines = [
      'Hola Dra. Mon! Quería pedir un turno.',
      `• Paciente: ${fNombre.value.trim() || '(sin completar)'}`,
      `• Para: ${fQuien.value}`,
      `• Motivo: ${fMotivo.value}`,
      `• Horario: ${horario()}`
    ];
    if (fOS.value.trim()) lines.push(`• Obra social / prepaga: ${fOS.value.trim()}`);
    if (fNota.value.trim()) lines.push(`• Nota: ${fNota.value.trim()}`);
    lines.push('(Enviado desde la web)');
    window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
    stamp.classList.remove('is-stamped');
    void stamp.getBoundingClientRect();
    stamp.classList.add('is-stamped');
  });

  /* ---------- año ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
