(() => {
  const WA = '5493541660401';
  if (new URLSearchParams(location.search).has('qa')) document.documentElement.classList.add('qa');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Header, menú y caudal de scroll */
  const top = $('#top');
  const flow = $('#flow');
  const dock = $('.dock');
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    top.classList.toggle('is-scrolled', y > 40);
    flow.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    dock.classList.toggle('show', y > innerHeight * .6);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  /* Perilla del calefón */
  const knob = $('.knob');
  knob.addEventListener('click', () => knob.classList.add('is-turned'));

  /* Reveal */
  const rv = $$('.flame__head, .flame__stage, .verdict, .services__head, .svc, .odor__head, .steps li, .why__list > div, .order__head, .ticket, .faq__list, .close__in');
  rv.forEach(el => el.classList.add('rv'));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...e.target.parentElement.children].filter(n => n.classList.contains('rv'));
    e.target.style.transitionDelay = `${Math.max(sibs.indexOf(e.target), 0) * 70}ms`;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
  rv.forEach(el => io.observe(el));
  const zone = $('.zone');
  new IntersectionObserver((en, o) => en.forEach(e => { if (e.isIntersecting) { zone.classList.add('in'); o.disconnect(); } }), { threshold: .3 }).observe(zone);

  /* Video de instalación: solo cuando se ve */
  $$('[data-lazy-video]').forEach(v => {
    new IntersectionObserver(en => en.forEach(e => {
      if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
    }), { threshold: .3 }).observe(v);
  });

  /* Chequeo de llama */
  const STATES = {
    azul: {
      tag: 'Todo en orden', cls: '',
      title: 'Llama azul: combustión correcta',
      body: 'Es lo que tiene que verse. Igual conviene revisar artefactos, conexiones y ventilaciones de vez en cuando, sobre todo antes del invierno.',
      cta: 'Pedir una revisión de rutina', tipo: 'Revisión',
      det: 'Quiero una revisión de rutina de mis artefactos a gas.'
    },
    amarilla: {
      tag: 'Revisalo pronto', cls: 'is-warn',
      title: 'Llama amarilla o anaranjada',
      body: 'Puede indicar mala combustión: quemador sucio, falta de aire o mala regulación. La mala combustión genera monóxido de carbono, que no se ve ni tiene olor. Ventilá el ambiente y pedí una revisión.',
      cta: 'Consultar por la llama amarilla', tipo: 'Reparación',
      det: 'La llama sale amarilla o anaranjada.'
    },
    apaga: {
      tag: 'Revisalo pronto', cls: 'is-warn',
      title: 'Se apaga sola o no prende',
      body: 'Puede ser el piloto, un componente de seguridad del artefacto o el suministro. No insistas encendiéndolo una y otra vez. Anotá marca y modelo del artefacto para la consulta.',
      cta: 'Consultar por el encendido', tipo: 'Reparación',
      det: 'El artefacto no prende o se apaga solo.'
    },
    hollin: {
      tag: 'No lo uses encerrado', cls: 'is-warn',
      title: 'Tizna o deja hollín',
      body: 'Las manchas negras en la pared, el techo o el artefacto suelen ser señal de mala combustión o de un conducto de evacuación con problemas. Evitá usarlo en ambientes cerrados hasta que lo revise un matriculado.',
      cta: 'Consultar por el hollín', tipo: 'Reparación',
      det: 'El artefacto tizna o deja hollín.'
    },
    olor: {
      tag: 'Urgente', cls: 'is-alert',
      title: 'Olor a gas: primero, seguridad',
      body: 'Cerrá la llave de paso, abrí puertas y ventanas y no toques interruptores ni enciendas fuego. Salí de la casa. Cuando estés a salvo, escribinos para revisar la instalación.',
      cta: 'Ver los 5 pasos', tipo: 'Reparación', href: '#olor',
      det: 'Tengo olor a gas. Ya cerré la llave de paso y ventilé.'
    }
  };
  const burner = $('#burner');
  const verdict = $('#verdict');
  const vTag = $('#v-tag'), vTitle = $('#v-title'), vBody = $('#v-body'), vCta = $('#v-cta');
  let current = 'azul';

  const setState = key => {
    const s = STATES[key];
    current = key;
    burner.setAttribute('class', `burner s-${key}`);
    verdict.className = `verdict ${s.cls}`;
    void verdict.offsetWidth;
    verdict.classList.add('swap');
    vTag.textContent = s.tag;
    vTitle.textContent = s.title;
    vBody.textContent = s.body;
    vCta.textContent = s.cta;
    vCta.setAttribute('href', s.href || '#consulta');
    chips.forEach(b => b.setAttribute('aria-checked', b.dataset.state === key));
  };
  const chips = $$('#chips button');
  chips.forEach((b, i) => {
    b.addEventListener('click', () => setState(b.dataset.state));
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = chips[(i + d + chips.length) % chips.length];
      n.focus(); n.click();
    });
  });

  /* Armador de consulta */
  const form = $('#ticket');
  const det = $('#f-det');
  const loc = $('#f-loc');
  const preview = $('#preview');
  const send = $('#send');
  const val = name => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || '';
  const setTipo = t => { const r = form.querySelector(`input[name="tipo"][value="${t}"]`); if (r) r.checked = true; };

  const build = () => {
    const tipo = val('tipo');
    const art = val('art');
    const lines = [`Hola Pereyra, necesito una ${tipo.toLowerCase()} de gas${art ? ` (${art})` : ''}.`];
    if (det.value.trim()) lines.push(`Qué pasa: ${det.value.trim()}`);
    if (loc.value.trim()) lines.push(`Zona: ${loc.value.trim()}`);
    lines.push(`Para: ${val('cuando')}.`);
    const msg = lines.join('\n');
    preview.textContent = msg;
    send.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  };
  form.addEventListener('input', build);
  form.addEventListener('change', build);
  form.addEventListener('submit', e => e.preventDefault());
  $$('[data-prefill-type]').forEach(a => a.addEventListener('click', () => { setTipo(a.dataset.prefillType); build(); }));

  vCta.addEventListener('click', () => {
    const s = STATES[current];
    if (s.href) return;
    setTipo(s.tipo);
    det.value = s.det;
    build();
  });
  build();

  /* Títulos que no deben cortarse con letra grande de Android */
  const fit = () => $$('.fit').forEach(el => {
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    let guard = 40;
    while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard--) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  });
  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  addEventListener('load', fit);
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 120); });
})();
