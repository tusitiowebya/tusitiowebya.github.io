/* =========================================================
   GRUPO ARZUAGA — script.js
   1) Nav sólido al scrollear + FAB
   2) Reveal por IntersectionObserver
   3) Escarcha raspable en el hero (signature)
   4) Diagnóstico express -> mensaje de WhatsApp
   ========================================================= */

/* ---------- 1) Nav + FAB ---------- */
(function () {
  const nav = document.getElementById('nav');
  const fab = document.querySelector('.fab');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 60);
    fab.classList.toggle('show', y > 420);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ---------- 2) Reveal ---------- */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      const delay = Math.min(i * 90, 360);
      setTimeout(() => e.target.classList.add('in'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px' });
  items.forEach(el => io.observe(el));
})();

/* ---------- 3) Escarcha raspable ---------- */
(function () {
  const cv = document.getElementById('frost');
  const hint = document.getElementById('frostHint');
  if (!cv) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1;

  function crystal(x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.10 + Math.random() * 0.16) + ')';
    ctx.lineWidth = 0.9 + Math.random();
    ctx.lineCap = 'round';
    const arms = 6;
    for (let a = 0; a < arms; a++) {
      const ang = (Math.PI * 2 / arms) * a + Math.random() * 0.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      ctx.stroke();
      // ramitas
      for (let b = 0.35; b < 0.9; b += 0.28) {
        const bx = Math.cos(ang) * r * b, by = Math.sin(ang) * r * b;
        const len = r * 0.26;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(ang + 0.7) * len, by + Math.sin(ang + 0.7) * len);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(ang - 0.7) * len, by + Math.sin(ang - 0.7) * len);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function paint() {
    const rect = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // velo de hielo: más denso arriba y en los bordes
    const g = ctx.createLinearGradient(0, 0, w * 0.7, h);
    g.addColorStop(0, 'rgba(206,232,247,0.62)');
    g.addColorStop(0.55, 'rgba(186,222,244,0.48)');
    g.addColorStop(1, 'rgba(226,241,251,0.58)');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // grano / manchas de escarcha
    const blobs = Math.round((w * h) / 9000);
    for (let i = 0; i < blobs; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const r = 2 + Math.random() * 16;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.03 + Math.random() * 0.09) + ')';
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // cristales dibujados
    const crystals = Math.max(10, Math.round(w / 90));
    for (let i = 0; i < crystals; i++) {
      crystal(Math.random() * w, Math.random() * h, 14 + Math.random() * 34);
    }

    ctx.globalCompositeOperation = 'destination-out';
  }

  function scratch(x, y, r) {
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.55, 'rgba(0,0,0,0.75)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  let hinted = false;
  function pos(ev) {
    const r = cv.getBoundingClientRect();
    const p = ev.touches ? ev.touches[0] : ev;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }
  function onMove(ev) {
    const { x, y } = pos(ev);
    scratch(x, y, Math.max(58, Math.min(w, h) * 0.11));
    if (!hinted && hint) { hinted = true; hint.classList.add('hide'); }
  }

  paint();
  // despeje inicial: una pasada diagonal para que se entienda el gesto
  if (!reduce) {
    let t = 0;
    const auto = setInterval(() => {
      t += 0.035;
      if (t >= 1) { clearInterval(auto); return; }
      scratch(w * (0.10 + t * 0.55), h * (0.30 + Math.sin(t * 3.1) * 0.16), 70);
    }, 16);
  } else {
    for (let i = 0; i <= 20; i++) scratch(w * (i / 20), h * 0.5, 90);
  }

  cv.addEventListener('mousemove', onMove);
  cv.addEventListener('touchmove', onMove, { passive: true });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { paint(); for (let i = 0; i <= 16; i++) scratch(w * (i / 16), h * 0.45, 80); }, 200);
  });
})();

/* ---------- 4) Diagnóstico express ---------- */
(function () {
  const panel = document.querySelector('.diag__panel');
  if (!panel) return;

  const WA = '5493764899817';
  const fallas = {
    'una heladera': ['No enfría', 'Enfría poco', 'Hace mucha escarcha', 'Pierde agua', 'Hace ruido raro', 'No enciende'],
    'un freezer': ['No congela', 'Se escarcha todo', 'Pierde agua', 'No enciende', 'Hace ruido raro'],
    'un lavarropas': ['No centrifuga', 'No carga agua', 'No desagota', 'Pierde agua', 'Traba la puerta', 'Tira error en el display'],
    'un aire acondicionado': ['No enfría', 'Gotea adentro', 'Tira olor feo', 'Hace ruido', 'Necesito service y limpieza', 'Instalación o traslado'],
    'un lavavajillas': ['No desagota', 'No calienta el agua', 'Deja la vajilla sucia', 'Corta el ciclo', 'Pierde agua'],
    'un microondas': ['Gira pero no calienta', 'Hace chispas', 'No enciende', 'El teclado no responde'],
    'un horno / cocina': ['No levanta temperatura', 'No enciende', 'La puerta no cierra', 'El termostato falla', 'Las hornallas no prenden']
  };

  const steps = panel.querySelectorAll('.diag__step');
  const dots = panel.querySelectorAll('.diag__steps span');
  const chipsFalla = document.getElementById('chipsFalla');
  const msgBox = document.getElementById('diagMsg');
  const send = document.getElementById('diagSend');
  const state = { equipo: '', falla: '', zona: '' };

  function go(n) {
    steps.forEach(s => s.classList.toggle('is-active', +s.dataset.step === n));
    dots.forEach((d, i) => d.classList.toggle('on', i < Math.min(n, 3)));
  }

  function armar() {
    const txt = 'Hola Grupo Arzuaga, tengo ' + state.equipo + '. La falla: ' +
      state.falla.toLowerCase() + '. Estoy en ' + state.zona +
      '. ¿Me pasan disponibilidad y presupuesto?';
    msgBox.textContent = txt;
    send.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  }

  panel.addEventListener('click', (e) => {
    const back = e.target.closest('[data-back]');
    if (back) { go(+back.dataset.back); return; }

    const chip = e.target.closest('.chips button');
    if (!chip) return;
    const box = chip.parentElement.id;
    const v = chip.dataset.v || chip.textContent.trim();

    if (box === 'chipsEquipo') {
      state.equipo = v;
      chipsFalla.innerHTML = '';
      (fallas[v] || ['Otra falla']).forEach(f => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.v = f;
        b.textContent = f;
        chipsFalla.appendChild(b);
      });
      const otro = document.createElement('button');
      otro.type = 'button';
      otro.dataset.v = 'Otra falla (te cuento por chat)';
      otro.textContent = 'Otra cosa';
      chipsFalla.appendChild(otro);
      go(2);
    } else if (box === 'chipsFalla') {
      state.falla = v;
      go(3);
    } else if (box === 'chipsZona') {
      state.zona = v;
      armar();
      go(4);
    }
  });
})();
