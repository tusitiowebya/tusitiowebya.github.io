(() => {
  const WA = '5491176223328';
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const root = document.documentElement;
  if (/[?&]qa\b/.test(location.search)) root.classList.add('qa');

  requestAnimationFrame(() => document.body.classList.add('ready'));
  setTimeout(() => document.body.classList.add('ready'), 300);

  /* ---- nav sólida + botón WA después del hero ---- */
  const nav = document.getElementById('nav');
  const waFloat = document.getElementById('waFloat');
  const dock = document.getElementById('dialDock');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    waFloat.classList.toggle('on', y > innerHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- CTAs por rama ---- */
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(`Hola Melisa! Vi tu página y quiero consultar por: ${a.dataset.wa}`);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---- reveals ---- */
  const rvSel = '.index-head, .index-grid li, .rama-head, .g-retratos .ph, .card, .quince-main, .quince-side, .pola, .bod-stage, .bodegon .rama-copy, .pano-item, .rama-body--split, .rama-retratos .rama-copy, .bts-copy, .contact-sheet, .melisa-card, .melisa-grid > div, .shots li, .picker, .faq details';
  const rvEls = [...document.querySelectorAll(rvSel)];
  rvEls.forEach((el) => el.classList.add('rv'));
  if ('IntersectionObserver' in window && !root.classList.contains('qa')) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains('rv'));
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 70}ms`;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    rvEls.forEach((el) => io.observe(el));
  } else rvEls.forEach((el) => el.classList.add('in'));

  /* ---- dial de modos: gira con la rama visible ---- */
  const ramas = [...document.querySelectorAll('.rama')];
  const face = document.querySelector('.dial-face');
  const labelsG = document.querySelector('.dial-labels');
  const dialNum = document.getElementById('dialNum');
  const rail = document.getElementById('dialRail');
  const NS = 'http://www.w3.org/2000/svg';
  const step = 360 / ramas.length;
  const texts = [];
  ramas.forEach((r, i) => {
    const ang = i * step; // 0° = a la derecha (donde está el puntero)
    const rad = (ang * Math.PI) / 180;
    const t = document.createElementNS(NS, 'text');
    const x = 100 + Math.cos(rad) * 58, y = 100 + Math.sin(rad) * 58;
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('dominant-baseline', 'central');
    t.setAttribute('transform', `rotate(${ang} ${x} ${y})`);
    t.textContent = r.dataset.short;
    t.addEventListener('click', () => r.scrollIntoView({ behavior: 'smooth' }));
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 100 + Math.cos(rad) * 82); l.setAttribute('y1', 100 + Math.sin(rad) * 82);
    l.setAttribute('x2', 100 + Math.cos(rad) * 92); l.setAttribute('y2', 100 + Math.sin(rad) * 92);
    labelsG.append(l, t);
    texts.push(t);
    const a = document.createElement('a');
    a.href = `#${r.id}`;
    a.textContent = `${String(i + 1).padStart(2, '0')} ${r.dataset.label}`;
    rail.append(a);
  });
  const railLinks = [...rail.children];
  let current = -1;
  const setRama = (i) => {
    if (i === current) return;
    current = i;
    face.style.transform = `rotate(${-i * step}deg)`;
    texts.forEach((t, k) => t.classList.toggle('on', k === i));
    railLinks.forEach((a, k) => a.classList.toggle('on', k === i));
    dialNum.textContent = String(i + 1).padStart(2, '0');
    railLinks[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  };
  const narrow = matchMedia('(max-width:1100px)');
  const syncDockMode = () => dock.classList.toggle('rail', narrow.matches);
  narrow.addEventListener?.('change', syncDockMode);
  syncDockMode();
  const onDial = () => {
    const mid = innerHeight * 0.45;
    const first = ramas[0].getBoundingClientRect();
    const last = ramas[ramas.length - 1].getBoundingClientRect();
    dock.classList.toggle('on', first.top < mid && last.bottom > mid);
    let idx = 0;
    ramas.forEach((r, i) => { if (r.getBoundingClientRect().top < mid) idx = i; });
    setRama(idx);
  };
  addEventListener('scroll', onDial, { passive: true });
  addEventListener('resize', onDial);
  onDial();

  /* ---- bodegón: cambiar lámina ---- */
  const bodMain = document.getElementById('bodMain');
  document.querySelectorAll('.bod-thumbs button').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.bod-thumbs button').forEach((x) => x.classList.toggle('on', x === b));
      bodMain.classList.add('swap');
      setTimeout(() => {
        bodMain.src = b.dataset.src;
        bodMain.alt = b.dataset.alt;
        bodMain.onload = () => bodMain.classList.remove('swap');
        if (bodMain.complete) bodMain.classList.remove('swap');
      }, 250);
    });
  });

  /* ---- lightbox por rama ---- */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let group = [], gi = 0;
  const show = () => {
    const img = group[gi];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    const sec = img.closest('section');
    const label = sec?.querySelector('.rama-t')?.textContent || sec?.querySelector('.h2')?.textContent || '';
    lbCap.textContent = `${label.trim()} · ${gi + 1}/${group.length}`;
  };
  const open = (img) => {
    const sec = img.closest('section');
    group = [...sec.querySelectorAll('.ph img, .card img, .pola img, .pano-item img, .cs img')];
    gi = Math.max(0, group.indexOf(img));
    show();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  const move = (d) => { gi = (gi + d + group.length) % group.length; show(); };
  document.addEventListener('click', (e) => {
    const fig = e.target.closest('.ph, .card, .pola, .pano-item, .cs');
    if (fig && !e.target.closest('.bod-thumbs')) open(fig.querySelector('img'));
  });
  lb.querySelector('.lb-x').addEventListener('click', close);
  lb.querySelector('.lb-p').addEventListener('click', () => move(-1));
  lb.querySelector('.lb-n').addEventListener('click', () => move(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); });

  /* ---- armador de reserva ---- */
  const opts = ['Retratos y book', 'Sesión temática', '15 años / producción', 'Infancias y exteriores', 'Producto / bodegón', 'Naturaleza y ciudad'];
  const pickerOpts = document.getElementById('pickerOpts');
  const go = document.getElementById('pickerGo');
  const name = document.getElementById('pkName');
  const date = document.getElementById('pkDate');
  let chosen = opts[0];
  opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = o;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => {
      chosen = o;
      [...pickerOpts.children].forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      buildMsg();
    });
    pickerOpts.append(b);
  });
  const buildMsg = () => {
    let m = `Hola Melisa!${name.value.trim() ? ` Soy ${name.value.trim()}.` : ''} Quiero reservar una sesión de: ${chosen}.`;
    if (date.value.trim()) m += ` Fecha aproximada: ${date.value.trim()}.`;
    go.href = waLink(m);
  };
  name.addEventListener('input', buildMsg);
  date.addEventListener('input', buildMsg);
  buildMsg();

  /* ---- parallax suave del cierre ---- */
  const finalBg = document.querySelector('.final-bg');
  if (finalBg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addEventListener('scroll', () => {
      const r = finalBg.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      finalBg.style.setProperty('--py', `${(r.top / innerHeight) * -40}px`);
    }, { passive: true });
  }

  /* ---- títulos que no se corten con letra grande del sistema (Android) ---- */
  const fitSel = '.hero-title .ln, .rama-t, .final-t, .ix-t';
  const fitText = () => {
    document.querySelectorAll(fitSel).forEach((el) => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      let guard = 40;
      while (el.scrollWidth > el.clientWidth + 1 && fs > 14 && guard--) {
        fs *= 0.94;
        el.style.fontSize = `${fs}px`;
      }
    });
  };
  window.__mcFit = fitText;
  fitText();
  document.fonts?.ready.then(fitText);
  addEventListener('load', fitText);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fitText, 120); });
})();
