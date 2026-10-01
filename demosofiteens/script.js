(() => {
  'use strict';

  const cfg = window.SOFITEENS || { whatsapp: '5491155281243', api: '', slug: '' };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const wa = text => 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(text);
  const params = new URLSearchParams(location.search);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (params.has('qa')) document.documentElement.classList.add('qa');

  /* ---------- Comunes ---------- */
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); });

  const nav = $('[data-nav]');
  const toggle = $('[data-menu]');
  const menu = $('#menu');
  if (toggle && menu) {
    const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); };
    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !document.documentElement.classList.contains('qa')) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = $$('.reveal', entry.target.parentElement);
        entry.target.style.transitionDelay = Math.min(siblings.indexOf(entry.target), 4) * 80 + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  // Títulos de una sola línea: achicar si la letra del sistema los desborda (Android).
  const fitText = () => {
    $$('[data-fit]').forEach(el => {
      el.style.fontSize = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      let guard = 40;
      while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard--) {
        size -= 2;
        el.style.fontSize = size + 'px';
      }
    });
  };
  window.__sofiFit = fitText;
  fitText();
  if (document.fonts) document.fonts.ready.then(fitText);
  addEventListener('load', fitText);
  let fitTimer;
  addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitText, 120); });

  if (document.body.dataset.page === 'home') initHome();
  if (document.body.dataset.page === 'tienda') initShop();

  /* =================== HOME =================== */
  function initHome() {
    /* Cinta: duplicar para el loop continuo */
    const ribbon = $('[data-ribbon]');
    if (ribbon) ribbon.innerHTML += ribbon.innerHTML;

    initStory();
    initBuilder();
  }

  /* ---------- Story del hero ---------- */
  function initStory() {
    const story = $('[data-story]');
    if (!story) return;
    const video = $('[data-story-video]', story);
    const bars = $$('.story__bars i', story);
    const stepEl = $('[data-story-step]', story);
    const labelEl = $('[data-story-label]', story);
    const caption = $('.story__caption', story);
    const zoneEl = $('[data-story-zone]', story);
    const reply = $('[data-story-reply]', story);

    // Tramos del montaje (segundos): sérum, crema, máscara capilar, cepillado.
    const steps = [
      { from: 0, to: 3.2, zone: 'Piel', label: 'Sérum' },
      { from: 3.2, to: 6.2, zone: 'Piel', label: 'Hidratación' },
      { from: 6.2, to: 9.2, zone: 'Pelo', label: 'Máscara' },
      { from: 9.2, to: 12.4, zone: 'Pelo', label: 'Peinado' }
    ];
    let current = -1;

    const setStep = i => {
      if (i === current) return;
      current = i;
      const s = steps[i];
      stepEl.textContent = 'Paso ' + (i + 1);
      labelEl.textContent = s.label;
      zoneEl.textContent = s.zone;
      zoneEl.classList.toggle('is-pelo', s.zone === 'Pelo');
      caption.classList.remove('is-changing');
      void caption.offsetWidth;
      caption.classList.add('is-changing');
      reply.href = wa('Hola Sofiteens! Vi la story de ' + s.label.toLowerCase() + ' (' + s.zone.toLowerCase() + '). ¿Qué productos tienen para ese paso?');
    };

    const paint = t => {
      let idx = steps.findIndex(s => t >= s.from && t < s.to);
      if (idx < 0) idx = steps.length - 1;
      bars.forEach((bar, i) => {
        const s = steps[i];
        const p = i < idx ? 1 : i > idx ? 0 : (t - s.from) / (s.to - s.from);
        bar.style.width = Math.max(0, Math.min(1, p)) * 100 + '%';
      });
      setStep(idx);
    };

    // Carga diferida del video (no se baja en modo LITE / ahorro de datos).
    const conn = navigator.connection;
    const lite = params.has('lite') || (conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
    const source = $('source', video);
    if (!lite && source) {
      source.src = source.dataset.src;
      video.load();
      if (!reduced) video.play().catch(() => {});
    }

    let raf = 0;
    const loop = () => { paint(video.currentTime || 0); raf = requestAnimationFrame(loop); };
    video.addEventListener('play', () => { cancelAnimationFrame(raf); loop(); });
    video.addEventListener('pause', () => cancelAnimationFrame(raf));
    video.addEventListener('timeupdate', () => { if (video.paused) paint(video.currentTime); });

    // Si el video no corre (LITE, reduced motion o autoplay bloqueado), la story avanza sola con el póster.
    let fallbackTimer = 0;
    const startFallback = () => {
      if (fallbackTimer || !video.paused) return;
      let i = 0;
      paint(0);
      fallbackTimer = setInterval(() => {
        if (!video.paused) { clearInterval(fallbackTimer); fallbackTimer = 0; return; }
        i = (i + 1) % steps.length;
        bars.forEach((bar, b) => { bar.style.width = b <= i ? '100%' : '0%'; });
        setStep(i);
      }, 3000);
    };
    setTimeout(startFallback, 2500);

    const jump = dir => {
      const next = (Math.max(current, 0) + dir + steps.length) % steps.length;
      if (video.currentSrc && video.readyState >= 1) {
        video.currentTime = steps[next].from + 0.05;
        paint(video.currentTime);
        if (video.paused && !reduced) video.play().catch(() => {});
      } else {
        bars.forEach((bar, b) => { bar.style.width = b <= next ? '100%' : '0%'; });
        setStep(next);
      }
    };
    $('[data-story-prev]', story).addEventListener('click', () => jump(-1));
    $('[data-story-next]', story).addEventListener('click', () => jump(1));

    // Pausar fuera de pantalla.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (!video.currentSrc || reduced) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }, { threshold: 0.15 }).observe(story);
    }

    paint(0);
  }

  /* ---------- Armador de rutina ---------- */
  function initBuilder() {
    const form = $('[data-builder]');
    if (!form) return;
    const tray = $('[data-tray]', form);
    const preview = $('[data-preview]', form);
    const send = $('[data-send]', form);
    const hint = $('[data-hint]', form);
    const extra = $('[data-extra]', form);

    const state = { focus: 'piel', pielTipo: '', pielQue: [], pielCuando: '', peloTipo: '', peloQue: [] };
    const off = new Set(); // pasos que la persona ya tiene

    const preset = params.get('rutina');
    if (preset === 'pelo' || preset === 'ambos') state.focus = preset;

    // Tabs
    const tabs = $$('[data-focus]', form);
    const setFocus = f => {
      state.focus = f;
      tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.focus === f)));
      $$('[data-group]', form).forEach(g => {
        g.hidden = !(f === 'ambos' || g.dataset.group === f);
      });
      render();
    };
    tabs.forEach(t => t.addEventListener('click', () => setFocus(t.dataset.focus)));

    // Chips de una sola opción
    $$('[data-single]', form).forEach(group => {
      const key = group.dataset.single;
      $$('button', group).forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          const on = state[key] !== btn.dataset.v;
          state[key] = on ? btn.dataset.v : '';
          $$('button', group).forEach(b => b.setAttribute('aria-pressed', String(on && b === btn)));
          render();
        });
      });
    });
    // Chips múltiples
    $$('[data-multi]', form).forEach(group => {
      const key = group.dataset.multi;
      $$('button', group).forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          const list = state[key];
          const i = list.indexOf(btn.dataset.v);
          if (i >= 0) list.splice(i, 1); else list.push(btn.dataset.v);
          btn.setAttribute('aria-pressed', String(i < 0));
          render();
        });
      });
    });
    extra.addEventListener('input', render);

    // Pasos básicos según lo elegido (guía general, sin productos inventados).
    const skinSteps = () => {
      const night = state.pielCuando === 'la noche';
      const list = [];
      if (night) list.push({ id: 'desmaquillar', zone: 'piel', label: 'Desmaqui­llante', cap: 'pump', c: '#E7DAFF', h: 92 });
      list.push({ id: 'limpieza', zone: 'piel', label: 'Limpieza', cap: 'pump', c: 'var(--mint)', h: 104 });
      if (state.pielQue.length) list.push({ id: 'serum', zone: 'piel', label: 'Sérum', cap: 'drop', c: 'var(--blush)', h: 78 });
      list.push({ id: 'hidratacion', zone: 'piel', label: 'Hidra­tación', cap: 'cap', c: '#FFE3A3', h: 70 });
      if (!night) list.push({ id: 'protector', zone: 'piel', label: 'Protector solar', cap: 'cap', c: '#FFD0A8', h: 98 });
      return list;
    };
    const hairSteps = () => {
      const tinted = state.peloTipo === 'teñido o decolorado';
      const list = [
        { id: 'shampoo', zone: 'pelo', label: 'Shampoo', cap: 'pump', c: 'var(--mint)', h: 112 },
        { id: 'acondicionador', zone: 'pelo', label: 'Acondicio­nador', cap: 'cap', c: 'var(--blush)', h: 106 },
        { id: 'mascara', zone: 'pelo', label: tinted ? 'Máscara para el color' : 'Máscara', cap: 'cap', c: '#FFE3A3', h: 64 }
      ];
      let finisher = null;
      if (state.peloTipo === 'con rulos' || state.peloTipo === 'ondulado') finisher = { label: 'Crema de peinar', c: '#E7DAFF' };
      if (state.peloQue.includes('frizz')) finisher = finisher || { label: 'Anti­frizz', c: '#E7DAFF' };
      if (state.peloQue.includes('puntas abiertas')) list.push({ id: 'puntas', zone: 'pelo', label: 'Sérum de puntas', cap: 'drop', c: '#FFD0A8', h: 76 });
      if (finisher) list.push({ id: 'peinado', zone: 'pelo', label: finisher.label, cap: 'pump', c: finisher.c, h: 96 });
      else list.push({ id: 'termo', zone: 'pelo', label: 'Termo­protector', cap: 'pump', c: '#E7DAFF', h: 96 });
      return list;
    };
    const currentSteps = () => {
      if (state.focus === 'piel') return skinSteps();
      if (state.focus === 'pelo') return hairSteps();
      return skinSteps().concat(hairSteps());
    };

    let lastIds = '';
    const renderTray = steps => {
      const ids = steps.map(s => s.id + s.label).join('|');
      if (ids === lastIds) {
        $$('.bottle', tray).forEach(b => {
          b.classList.toggle('is-off', off.has(b.dataset.id));
          b.setAttribute('aria-pressed', String(off.has(b.dataset.id)));
        });
        return;
      }
      lastIds = ids;
      tray.replaceChildren();
      steps.forEach((s, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'bottle' + (off.has(s.id) ? ' is-off' : '');
        b.dataset.id = s.id;
        b.style.setProperty('--c', s.c);
        b.style.setProperty('--h', s.h + 'px');
        b.style.animationDelay = i * 60 + 'ms';
        b.setAttribute('aria-pressed', String(off.has(s.id)));
        b.setAttribute('aria-label', s.label.replace(/­/g, '') + ' (' + s.zone + '): tocá si ya lo tenés');
        b.innerHTML = '<span class="bottle__cap' + (s.cap === 'pump' ? ' bottle__cap--pump' : s.cap === 'drop' ? ' bottle__cap--drop' : '') + '"></span>' +
          '<span class="bottle__body"><span class="bottle__label"></span></span><span class="bottle__n">' + (i + 1) + '</span>';
        $('.bottle__label', b).textContent = s.label;
        b.addEventListener('click', () => {
          if (off.has(s.id)) off.delete(s.id); else off.add(s.id);
          render();
        });
        li.append(b);
        tray.append(li);
      });
    };

    const clean = s => s.replace(/­/g, '').toLowerCase();
    const listJoin = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];

    const missing = () => {
      const m = [];
      if (state.focus !== 'pelo' && !state.pielTipo) m.push('tu tipo de piel');
      if (state.focus !== 'piel' && !state.peloTipo) m.push('tu tipo de pelo');
      return m;
    };

    const message = steps => {
      const lines = ['Hola Sofiteens! Quiero armar mi rutina.'];
      const part = zone => {
        const need = steps.filter(s => s.zone === zone && !off.has(s.id)).map(s => clean(s.label));
        const have = steps.filter(s => s.zone === zone && off.has(s.id)).map(s => clean(s.label));
        let txt;
        if (zone === 'piel') {
          txt = '• Piel: ' + (state.pielTipo || '(sin elegir)') + '.';
          if (state.pielQue.length) txt += ' Quiero mejorar: ' + listJoin(state.pielQue) + '.';
          if (state.pielCuando) txt += ' Rutina para ' + state.pielCuando + '.';
        } else {
          txt = '• Pelo: ' + (state.peloTipo || '(sin elegir)') + '.';
          if (state.peloQue.length) txt += ' Me molesta: ' + listJoin(state.peloQue) + '.';
        }
        if (need.length) txt += '\n  Me falta: ' + listJoin(need) + '.';
        if (have.length) txt += '\n  Ya tengo: ' + listJoin(have) + '.';
        return txt;
      };
      if (state.focus !== 'pelo') lines.push(part('piel'));
      if (state.focus !== 'piel') lines.push(part('pelo'));
      const note = extra.value.trim();
      if (note) lines.push('Te cuento: ' + note);
      lines.push('¿Qué productos me recomendás y qué precio tienen?');
      return lines.join('\n');
    };

    function render() {
      const steps = currentSteps();
      // limpiar pasos apagados que ya no existen
      const valid = new Set(steps.map(s => s.id));
      Array.from(off).forEach(id => { if (!valid.has(id)) off.delete(id); });
      renderTray(steps);
      const text = message(steps);
      preview.textContent = text;
      send.href = wa(text);
      const m = missing();
      hint.textContent = m.length ? 'Elegí ' + listJoin(m) + ' para que te puedan recomendar mejor.' : '';
      send.dataset.ready = m.length ? 'no' : 'si';
    }

    send.addEventListener('click', e => {
      if (send.dataset.ready === 'si') return;
      e.preventDefault();
      hint.textContent = 'Antes de enviar, elegí ' + listJoin(missing()) + '.';
      const firstGroup = $$('[data-single]', form).find(g => !g.closest('[hidden]') && !state[g.dataset.single]);
      if (firstGroup) $('button', firstGroup).focus();
    });
    form.addEventListener('submit', e => e.preventDefault());

    setFocus(state.focus);
  }

  /* =================== TIENDA (CobrOS) =================== */
  function initShop() {
    const grid = $('[data-products]');
    const status = $('[data-status]');
    const filters = $('[data-filters]');
    const count = $('[data-count]');
    const search = $('[data-search]');
    const sort = $('[data-sort]');
    const drawer = $('[data-cart-drawer]');
    const backdrop = $('[data-cart-backdrop]');
    const lines = $('[data-cart-lines]');
    const total = $('[data-cart-total]');
    const form = $('[data-order-form]');
    const orderStatus = $('[data-order-status]');
    const cartKey = 'sofiteens-cart-v1';
    const names = { todos: 'Todo', capilar: 'Capilar', 'skin-care': 'Skin care', otros: 'Otros' };
    const simplify = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
    const safeImage = v => {
      const s = String(v || '');
      return /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(s) || /^https:\/\//i.test(s) ? s : '';
    };
    const lineOf = text => {
      const t = simplify(text);
      if (/capilar|pelo|cabello|shampoo|acondicionador|mascara|rulos|keratina|tintura/.test(t)) return 'capilar';
      if (/skin|piel|facial|rostro|serum|crema|protector|limpiador|tonico|labial|corporal/.test(t)) return 'skin-care';
      return 'otros';
    };

    let products = [];
    let state = 'loading';
    let cart = {};
    let active = params.get('cat') || 'todos';
    if (!Object.prototype.hasOwnProperty.call(names, active)) active = 'todos';

    try {
      const stored = JSON.parse(localStorage.getItem(cartKey));
      if (stored && typeof stored === 'object' && !Array.isArray(stored)) cart = stored;
    } catch (e) { /* sin storage */ }
    const saveCart = () => { try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch (e) { /* sin storage */ } };

    const normalize = raw => ({
      id: String(raw._id || raw.id || ''),
      name: String(raw.nombre || '').trim(),
      description: String(raw.descripcion || ''),
      category: String(raw.categoria || 'Otros'),
      line: lineOf(String(raw.categoria || '') + ' ' + String(raw.nombre || '')),
      price: Number(raw.precio) || 0,
      image: safeImage(raw.foto),
      stock: Number(raw.stock),
      controlStock: Boolean(raw.controlaStock)
    });

    const clearStatus = () => { status.hidden = true; status.replaceChildren(); };
    const statusMessage = (title, body, retry) => {
      status.hidden = false;
      status.replaceChildren();
      const h = document.createElement('strong'); h.textContent = title;
      const p = document.createElement('p'); p.textContent = body;
      const a = document.createElement('a');
      a.href = wa('Hola Sofiteens! Quiero consultar por un producto.');
      a.target = '_blank'; a.rel = 'noopener'; a.className = 'btn btn--cherry';
      a.textContent = 'Consultar por WhatsApp';
      status.append(h, p, a);
      if (retry) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'btn btn--line'; b.textContent = 'Reintentar';
        b.addEventListener('click', load);
        status.append(b);
      }
    };

    async function load() {
      state = 'loading';
      grid.replaceChildren();
      statusMessage('Cargando productos…', 'Estamos buscando lo que Sofiteens tiene publicado.');
      if (!cfg.slug) { state = 'unavailable'; products = []; renderAll(); return; }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(cfg.api + '/catalogo/' + encodeURIComponent(cfg.slug), { signal: controller.signal });
        if (res.status === 404) { state = 'unavailable'; products = []; return; }
        if (!res.ok) throw new Error('catalogo');
        const data = await res.json();
        products = Array.isArray(data.productos)
          ? data.productos.filter(p => p && p.activo !== false).map(normalize).filter(p => p.id && p.name)
          : [];
        state = products.length ? 'ready' : 'empty';
      } catch (e) {
        state = 'error'; products = [];
      } finally {
        clearTimeout(timer);
        renderAll();
      }
    }

    const renderAll = () => { renderFilters(); renderProducts(); renderCart(); };

    function visible() {
      const q = simplify(search.value.trim());
      const list = products.filter(p => (active === 'todos' || p.line === active) && (!q || simplify(p.name + ' ' + p.description + ' ' + p.category).includes(q)));
      if (sort.value === 'price-up') list.sort((a, b) => a.price - b.price);
      else if (sort.value === 'price-down') list.sort((a, b) => b.price - a.price);
      else list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      return list;
    }

    function setLine(v) {
      active = v;
      const url = new URL(location.href);
      if (v === 'todos') url.searchParams.delete('cat'); else url.searchParams.set('cat', v);
      history.replaceState(null, '', url);
      renderFilters(); renderProducts();
    }

    function renderFilters() {
      filters.replaceChildren();
      const keys = ['todos', 'capilar', 'skin-care'];
      if (products.some(p => p.line === 'otros')) keys.push('otros');
      keys.forEach(k => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = names[k];
        b.setAttribute('aria-pressed', String(active === k));
        b.addEventListener('click', () => setLine(k));
        filters.append(b);
      });
    }

    function card(p) {
      const el = document.createElement('article');
      el.className = 'product';
      const vis = document.createElement('div');
      vis.className = 'product__img product__img--' + p.line;
      if (p.image) {
        const img = document.createElement('img');
        img.src = p.image; img.alt = p.name; img.loading = 'lazy';
        vis.append(img);
      } else {
        const m = document.createElement('span');
        m.textContent = p.line === 'capilar' ? 'pelo' : p.line === 'skin-care' ? 'piel' : 'sofi';
        vis.append(m);
      }
      const body = document.createElement('div');
      body.className = 'product__body';
      const cat = document.createElement('span'); cat.className = 'product__cat'; cat.textContent = p.category;
      const h = document.createElement('h2'); h.textContent = p.name;
      const d = document.createElement('p'); d.textContent = p.description || 'Consultá los detalles de este producto.';
      const foot = document.createElement('div'); foot.className = 'product__foot';
      const price = document.createElement('strong'); price.textContent = p.price > 0 ? money(p.price) : 'Consultar precio';
      const canAdd = p.price > 0 && (!p.controlStock || p.stock > 0);
      const act = document.createElement(canAdd ? 'button' : 'a');
      act.className = 'product__add';
      if (canAdd) {
        act.type = 'button'; act.textContent = 'Sumar +';
        act.addEventListener('click', () => {
          cart[p.id] = (Number(cart[p.id]) || 0) + 1;
          if (p.controlStock) cart[p.id] = Math.min(cart[p.id], p.stock);
          saveCart(); renderCart(); openCart();
        });
      } else {
        act.textContent = p.controlStock && p.stock <= 0 ? 'Consultar stock' : 'Consultar';
        act.href = wa('Hola Sofiteens! Quiero consultar por ' + p.name + '.');
        act.target = '_blank'; act.rel = 'noopener';
      }
      foot.append(price, act);
      body.append(cat, h, d, foot);
      el.append(vis, body);
      return el;
    }

    function renderProducts() {
      grid.replaceChildren();
      count.textContent = '';
      if (state === 'unavailable') { statusMessage('La tienda online se está preparando.', 'Muy pronto vas a ver acá los productos capilares y de skin care de Sofiteens, con precio y stock. Mientras tanto, consultá por WhatsApp.'); return; }
      if (state === 'empty') { statusMessage('Todavía no hay productos publicados.', 'Cuando Sofiteens cargue sus productos van a aparecer acá automáticamente.'); return; }
      if (state === 'error') { statusMessage('No pudimos cargar la tienda ahora.', 'Probá de nuevo en unos segundos o escribinos por WhatsApp.', true); return; }
      if (state === 'loading') return;
      const list = visible();
      if (!list.length) { statusMessage('No encontramos productos con ese filtro.', 'Probá otra búsqueda o consultá directamente.'); return; }
      clearStatus();
      count.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
      list.forEach(p => grid.append(card(p)));
    }

    const selected = () => Object.entries(cart)
      .map(([id, q]) => ({ product: products.find(p => p.id === id), quantity: Number(q) }))
      .filter(e => e.product && Number.isFinite(e.quantity) && e.quantity > 0 && e.product.price > 0);

    function renderCart() {
      lines.replaceChildren();
      const items = selected();
      if (!items.length) {
        const e = document.createElement('p'); e.className = 'cart__empty';
        e.textContent = 'Tu carrito está vacío. Sumá productos desde la tienda.';
        lines.append(e);
      }
      items.forEach(({ product, quantity }) => {
        const row = document.createElement('div'); row.className = 'cart__line';
        const n = document.createElement('strong'); n.textContent = product.name;
        const sub = document.createElement('small'); sub.textContent = money(product.price * quantity);
        const ctr = document.createElement('div'); ctr.className = 'cart__qty';
        const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−';
        minus.setAttribute('aria-label', 'Quitar una unidad de ' + product.name);
        minus.addEventListener('click', () => adjust(product, -1));
        const amt = document.createElement('span'); amt.textContent = String(quantity);
        const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+';
        plus.setAttribute('aria-label', 'Sumar una unidad de ' + product.name);
        plus.addEventListener('click', () => adjust(product, 1));
        ctr.append(minus, amt, plus);
        row.append(n, sub, ctr);
        lines.append(row);
      });
      total.textContent = money(items.reduce((s, e) => s + e.product.price * e.quantity, 0));
      $('[data-cart-count]').textContent = String(items.reduce((s, e) => s + e.quantity, 0));
      form.querySelector('button[type=submit]').disabled = !items.length;
    }

    function adjust(product, diff) {
      const next = (Number(cart[product.id]) || 0) + diff;
      if (next <= 0) delete cart[product.id];
      else cart[product.id] = product.controlStock ? Math.min(next, product.stock) : next;
      saveCart(); renderCart();
    }

    const openCart = () => { drawer.hidden = false; backdrop.hidden = false; document.body.classList.add('cart-open'); $('[data-close-cart]').focus(); };
    const closeCart = () => { drawer.hidden = true; backdrop.hidden = true; document.body.classList.remove('cart-open'); };
    $('[data-open-cart]').addEventListener('click', openCart);
    $('[data-close-cart]').addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeCart(); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const items = selected();
      if (!items.length || !cfg.slug) return;
      const v = new FormData(form);
      const payload = {
        nombre: String(v.get('nombre') || '').trim(),
        telefono: String(v.get('telefono') || '').trim(),
        email: String(v.get('email') || '').trim(),
        nota: String(v.get('nota') || '').trim(),
        items: items.map(i => ({ productoId: i.product.id, cantidad: i.quantity }))
      };
      if (!payload.nombre || !payload.telefono) { orderStatus.textContent = 'Completá tu nombre y tu WhatsApp.'; return; }
      const submit = form.querySelector('button[type=submit]');
      submit.disabled = true;
      orderStatus.textContent = 'Registrando pedido…';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const res = await fetch(cfg.api + '/catalogo/' + encodeURIComponent(cfg.slug) + '/pedido', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(String(result.error || result.message || 'No se pudo registrar el pedido.'));
        const summary = 'Hola Sofiteens! Hice un pedido en la tienda a nombre de ' + payload.nombre + ': ' +
          items.map(i => i.quantity + ' × ' + i.product.name).join(', ') + '. Mi WhatsApp: ' + payload.telefono + '.';
        cart = {}; saveCart(); renderCart();
        orderStatus.replaceChildren(document.createTextNode('¡Pedido registrado! '));
        const w = document.createElement('a'); w.href = wa(summary); w.target = '_blank'; w.rel = 'noopener'; w.textContent = 'Avisar por WhatsApp';
        orderStatus.append(w);
        if (typeof result.init_point === 'string' && /^https:\/\//i.test(result.init_point)) {
          const pay = document.createElement('a'); pay.href = result.init_point; pay.target = '_blank'; pay.rel = 'noopener'; pay.textContent = ' · Pagar online';
          orderStatus.append(pay);
        }
        form.reset();
      } catch (err) {
        orderStatus.textContent = 'No pudimos confirmar el pedido: ' + (err.name === 'AbortError' ? 'se agotó el tiempo de espera.' : err.message) + ' Revisá antes de reenviarlo o consultá por WhatsApp.';
      } finally {
        clearTimeout(timer);
        submit.disabled = !selected().length;
      }
    });

    search.addEventListener('input', renderProducts);
    sort.addEventListener('change', renderProducts);
    renderFilters(); renderCart(); load();
  }
})();
