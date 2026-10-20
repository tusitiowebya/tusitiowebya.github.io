/* CAF Multimedia Imagen Digital — demo TuPaginaYa */
(() => {
  'use strict';

  const WA = '5493515103319';
  const CLAVE = 'caf-evento-v1';
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- nav y menú ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const menu = $('#menu');
  const navSolida = () => nav.classList.toggle('is-solida', window.scrollY > 40);
  navSolida();
  window.addEventListener('scroll', navSolida, { passive: true });

  const cerrarMenu = () => {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  };
  burger.addEventListener('click', () => {
    const abrir = menu.hidden;
    menu.hidden = !abrir;
    burger.setAttribute('aria-expanded', String(abrir));
    burger.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    if (abrir) nav.classList.add('is-solida');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrarMenu(); burger.focus(); } });

  /* ---------- cartel LED: el texto va dos veces para que el loop no tenga hueco ---------- */
  const pista = $('#ledPista');
  if (pista) pista.textContent = pista.textContent.repeat(4);

  /* ---------- reveal ---------- */
  const rvSel = '.tit, .tarjeta, .mesa > *, .mezcla__txt, .paso, .faq__item, .cierre > *';
  $$(rvSel).forEach((el, i) => {
    el.classList.add('rv');
    const hermanos = el.parentElement ? Array.from(el.parentElement.children) : [];
    el.style.setProperty('--d', `${Math.min(hermanos.indexOf(el), 5) * 0.07}s`);
  });
  if ('IntersectionObserver' in window && !reducido) {
    const io = new IntersectionObserver(ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  } else {
    $$('.rv').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- pantalla RGB (WebGL) ----------
     Arranca como el logo: tres manchas, cada una muestra un solo canal del video.
     Las manchas crecen, se superponen y la suma de R + G + B da la imagen a color. */
  const pantalla = $('#pantalla');
  const video = $('#heroVideo');
  const canvas = $('#rgbCanvas');
  const canalesBtn = $$('.canal', pantalla);

  function iniciarGL() {
    let gl;
    try { gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false }); } catch (e) { gl = null; }
    if (!gl) return;

    const vs = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
    const fs = `precision mediump float;
      varying vec2 v;
      uniform sampler2D t;
      uniform vec2 res, tam;
      uniform float tiempo, crece;
      uniform vec3 on;
      uniform vec2 split;

      vec2 cubrir(vec2 uv){
        float ra = res.x / res.y, rv = tam.x / tam.y;
        vec2 s = ra > rv ? vec2(1., rv / ra) : vec2(ra / rv, 1.);
        return (uv - .5) * s + .5;
      }
      // mancha del logo: elipse inclinada con borde irregular
      float mancha(vec2 q, vec2 c, float k){
        vec2 d = q - c;
        float a = -.52;
        d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
        d /= vec2(.2, .3) * k;
        float ang = atan(d.y, d.x);
        float r = length(d) - (.06 * sin(ang * 3. + tiempo * .7 + c.x * 9.) + .04 * sin(ang * 5. - tiempo * .5));
        return 1. - smoothstep(.96, 1.02, r);
      }
      void main(){
        vec2 uv = vec2(v.x, 1. - v.y);
        vec2 q = (v - .5) * vec2(res.x / res.y, 1.);
        float esc = max(res.x / res.y, 1.) * .62;
        float k = mix(1., 9., crece);
        float mR = mancha(q, vec2(-.36, .0) * esc, k * esc / .62 * .62);
        float mG = mancha(q, vec2(.0, -.02) * esc, k * esc / .62 * .62);
        float mB = mancha(q, vec2(.36, .0) * esc, k * esc / .62 * .62);
        float sep = (1. - crece) * .035;
        vec2 oR = vec2(-sep, .004) + split;
        vec2 oB = vec2(sep, -.004) - split;
        float r = texture2D(t, cubrir(uv + oR)).r;
        float g = texture2D(t, cubrir(uv)).g;
        float b = texture2D(t, cubrir(uv + oB)).b;
        vec3 col = vec3(r * mR * on.r, g * mG * on.g, b * mB * on.b);
        // brillo leve del panel
        col += .015 * vec3(mR, mG, mB) * (1. - crece);
        gl_FragColor = vec4(col, 1.);
      }`;

    const comp = (tipo, src) => {
      const s = gl.createShader(tipo);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, comp(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, comp(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch (e) { return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const U = n => gl.getUniformLocation(prog, n);
    const u = { res: U('res'), tam: U('tam'), tiempo: U('tiempo'), crece: U('crece'), on: U('on'), split: U('split') };

    // si el video no arranca (ahorro de batería), la pantalla usa el póster
    const poster = new Image();
    poster.src = video.getAttribute('poster');

    const on = [1, 1, 1];
    let crece = reducido ? 1 : 0;
    let inicio = null;
    let visible = true;
    let raf = 0;
    let sx = 0, sy = 0, tx = 0, ty = 0, px = null, py = null;
    let fuenteOk = false;

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    };
    medir();
    window.addEventListener('resize', medir);

    pantalla.addEventListener('pointermove', e => {
      if (px !== null) { tx += (e.clientX - px) * 0.00025; ty += (e.clientY - py) * 0.00025; }
      px = e.clientX; py = e.clientY;
    });
    pantalla.addEventListener('pointerleave', () => { px = py = null; });

    canalesBtn.forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.canal;
      on[i] = on[i] ? 0 : 1;
      b.classList.toggle('is-on', !!on[i]);
      b.setAttribute('aria-pressed', String(!!on[i]));
    }));

    const ease = x => 1 - Math.pow(1 - x, 3);
    const cuadro = ahora => {
      raf = 0;
      if (!visible) return;
      let fuente = null;
      if (video.readyState >= 2) fuente = video;
      else if (poster.complete && poster.naturalWidth) fuente = poster;
      if (fuente) {
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, fuente);
          if (!fuenteOk) { fuenteOk = true; pantalla.classList.add('gl-ok'); }
        } catch (e) { fuente = null; }
      }
      if (fuenteOk) {
        if (inicio === null) inicio = ahora;
        if (!reducido) {
          const t = (ahora - inicio) / 1000;
          crece = t < 1.1 ? 0 : ease(Math.min((t - 1.1) / 2.2, 1));
        }
        tx *= 0.9; ty *= 0.9;
        sx += (tx - sx) * 0.2; sy += (ty - sy) * 0.2;
        const w = fuente === video ? video.videoWidth : poster.naturalWidth;
        const h = fuente === video ? video.videoHeight : poster.naturalHeight;
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform2f(u.tam, w || 16, h || 9);
        gl.uniform1f(u.tiempo, ahora / 1000);
        gl.uniform1f(u.crece, crece);
        gl.uniform3f(u.on, on[0], on[1], on[2]);
        gl.uniform2f(u.split, Math.max(-.02, Math.min(.02, sx)), Math.max(-.02, Math.min(.02, sy)));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(cuadro);
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible) {
          if (video.paused) video.play().catch(() => {});
          if (!raf) raf = requestAnimationFrame(cuadro);
        } else {
          video.pause();
        }
      }).observe(pantalla);
    }
    raf = requestAnimationFrame(cuadro);
  }

  if (!new URLSearchParams(location.search).has('lite')) iniciarGL();
  video.play().catch(() => {});

  /* ---------- consola: armá tu evento ---------- */
  const CANALES = [
    { id: 'foto', nombre: 'Foto', ch: 'var(--r)', niveles: [
      ['CLAVE', 'momentos clave'], ['FIESTA', 'toda la fiesta'], ['+PREVIA', 'toda la fiesta y los preparativos']] },
    { id: 'video', nombre: 'Video', ch: 'var(--g)', niveles: [
      ['RESUMEN', 'un resumen de la noche'], ['FIESTA', 'toda la fiesta'], ['+PREVIA', 'toda la fiesta y los preparativos']] },
    { id: 'pantalla', nombre: 'Pantalla', ch: 'var(--b)', niveles: [
      ['1 VIDEO', 'para pasar un video'], ['NOCHE', 'fotos y videos toda la noche'], ['CHARLAR', 'lo quiero charlar']] },
    { id: 'deco', nombre: 'Deco salón', ch: 'var(--y)', niveles: [
      ['DETALLES', 'algunos detalles'], ['COMPLETA', 'ambientación completa'], ['IDEA', 'tengo una idea y la quiero charlar']] },
    { id: 'sonido', nombre: 'Sonido', ch: 'var(--c)', niveles: [
      ['INGRESO', 'ceremonia o ingreso'], ['FIESTA', 'toda la fiesta'], ['TODO', 'ceremonia y fiesta']] }
  ];
  const POS = [7, 36, 64, 93]; // % desde abajo para OFF, 1, 2, 3
  const estado = { niveles: { foto: 0, video: 0, pantalla: 0, deco: 0, sonido: 0 }, tipo: '', fecha: '', invitados: '', lugar: '', nombre: '' };

  try {
    const g = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (g && g.niveles) Object.assign(estado, g, { niveles: Object.assign(estado.niveles, g.niveles) });
  } catch (e) { /* sin almacenamiento */ }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* nada */ } };

  const canalesEl = $('#canales');
  const strips = {};
  CANALES.forEach((c, i) => {
    const s = document.createElement('div');
    s.className = 'strip';
    s.style.setProperty('--ch', c.ch);
    s.innerHTML = `
      <div class="strip__lcd"><span class="strip__ch">CH ${i + 1}</span><span class="strip__nivel">OFF</span></div>
      <button type="button" class="strip__on" aria-pressed="false" aria-label="Prender ${c.nombre}">ON</button>
      <div class="strip__cuerpo">
        <div class="vu" aria-hidden="true">${'<i></i>'.repeat(12)}</div>
        <div class="fader" role="slider" tabindex="0" aria-label="${c.nombre}" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="Apagado">
          <div class="fader__riel"></div>
          ${POS.map(p => `<span class="fader__marca" style="bottom:calc(10px + (100% - 20px) * ${p / 100})"></span>`).join('')}
          <div class="fader__perilla"></div>
        </div>
      </div>
      <div class="strip__nombre">${c.nombre}</div>`;
    canalesEl.appendChild(s);
    strips[c.id] = { el: s, c, fader: $('.fader', s), perilla: $('.fader__perilla', s), lcd: $('.strip__nivel', s), on: $('.strip__on', s), vu: $$('.vu i', s) };
  });

  const setNivel = (id, n, opts = {}) => {
    n = Math.max(0, Math.min(3, n));
    estado.niveles[id] = n;
    const st = strips[id];
    st.el.classList.toggle('is-on', n > 0);
    st.perilla.style.bottom = `calc(10px + (100% - 20px) * ${POS[n] / 100})`;
    st.lcd.textContent = n ? st.c.niveles[n - 1][0] : 'OFF';
    st.on.setAttribute('aria-pressed', String(n > 0));
    st.on.setAttribute('aria-label', `${n ? 'Apagar' : 'Prender'} ${st.c.nombre}`);
    st.fader.setAttribute('aria-valuenow', String(n));
    st.fader.setAttribute('aria-valuetext', n ? `${st.c.nombre}: ${st.c.niveles[n - 1][1]}` : `${st.c.nombre}: apagado`);
    const b = $(`.tarjeta__sumar[data-sumar="${id}"]`);
    if (b) {
      b.classList.toggle('is-on', n > 0);
      b.innerHTML = n ? 'En tu evento <span aria-hidden="true">✓</span>' : 'Sumar a mi evento <span aria-hidden="true">+</span>';
    }
    if (!opts.silencio) { actualizar(); guardar(); }
  };

  Object.values(strips).forEach(st => {
    const id = st.c.id;
    st.on.addEventListener('click', () => setNivel(id, estado.niveles[id] ? 0 : 2));
    const desdePuntero = e => {
      const r = st.fader.getBoundingClientRect();
      const frac = (r.bottom - 10 - e.clientY) / (r.height - 20) * 100;
      let mejor = 0;
      POS.forEach((p, i) => { if (Math.abs(p - frac) < Math.abs(POS[mejor] - frac)) mejor = i; });
      if (mejor !== estado.niveles[id]) setNivel(id, mejor);
    };
    st.fader.addEventListener('pointerdown', e => {
      st.fader.setPointerCapture(e.pointerId);
      desdePuntero(e);
      const mover = ev => desdePuntero(ev);
      const soltar = () => {
        st.fader.removeEventListener('pointermove', mover);
        st.fader.removeEventListener('pointerup', soltar);
        st.fader.removeEventListener('pointercancel', soltar);
      };
      st.fader.addEventListener('pointermove', mover);
      st.fader.addEventListener('pointerup', soltar);
      st.fader.addEventListener('pointercancel', soltar);
    });
    st.fader.addEventListener('keydown', e => {
      const n = estado.niveles[id];
      const mapa = { ArrowUp: n + 1, ArrowRight: n + 1, ArrowDown: n - 1, ArrowLeft: n - 1, Home: 0, End: 3, PageUp: 3, PageDown: 0 };
      if (e.key in mapa) { e.preventDefault(); setNivel(id, mapa[e.key]); }
    });
  });

  $$('.tarjeta__sumar').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.sumar;
    setNivel(id, estado.niveles[id] ? 0 : 2);
  }));

  // vúmetros: solo se mueven si el canal está prendido y la consola se ve
  let vuVisible = false, vuUlt = 0;
  const vu = ahora => {
    if (ahora - vuUlt > 90) {
      vuUlt = ahora;
      Object.values(strips).forEach(st => {
        const n = estado.niveles[st.c.id];
        const base = n ? 3 + n * 2 : 0;
        const nivel = n ? Math.max(1, Math.min(12, Math.round(base + (Math.random() * 5 - 2)))) : 0;
        st.vu.forEach((i, k) => i.classList.toggle('is-lit', k < nivel));
      });
    }
    if (vuVisible && !reducido) requestAnimationFrame(vu);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      const antes = vuVisible;
      vuVisible = en.isIntersecting;
      if (vuVisible && !antes) requestAnimationFrame(vu);
    }).observe(canalesEl);
  }

  // campos del master
  const fecha = $('#fecha'), invitados = $('#invitados'), lugar = $('#lugar'), nombre = $('#nombre');
  const hoy = new Date();
  fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  const pintarCampos = () => {
    fecha.value = estado.fecha || '';
    invitados.value = estado.invitados || '';
    lugar.value = estado.lugar || '';
    nombre.value = estado.nombre || '';
    $$('input[name="tipo"]').forEach(r => { r.checked = r.value === estado.tipo; });
  };
  $$('input[name="tipo"]').forEach(r => r.addEventListener('change', () => { estado.tipo = r.value; actualizar(); guardar(); }));
  [[fecha, 'fecha'], [invitados, 'invitados'], [lugar, 'lugar'], [nombre, 'nombre']].forEach(([el, k]) => {
    el.addEventListener('input', () => { estado[k] = el.value.trim(); actualizar(); guardar(); });
  });

  const fechaLinda = v => {
    if (!v) return '';
    const d = new Date(`${v}T12:00:00`);
    if (isNaN(d)) return v;
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const preview = $('#preview');
  const dispCanales = $('#dispCanales');
  const errorEl = $('#mesaError');

  const mensaje = () => {
    const l = [];
    l.push(`Hola CAF Multimedia!${estado.nombre ? ` Soy ${estado.nombre}.` : ''} Quiero consultar por un evento:`);
    if (estado.tipo) l.push(`• Evento: ${estado.tipo}`);
    if (estado.fecha) l.push(`• Fecha: ${fechaLinda(estado.fecha)}`);
    if (estado.lugar) l.push(`• Salón o localidad: ${estado.lugar}`);
    if (estado.invitados) l.push(`• Invitados: aprox. ${estado.invitados}`);
    const on = CANALES.filter(c => estado.niveles[c.id] > 0);
    if (on.length) {
      l.push('');
      l.push('Me interesa:');
      on.forEach(c => l.push(`• ${c.nombre === 'Deco salón' ? 'Decoración de salón' : c.nombre}: ${c.niveles[estado.niveles[c.id] - 1][1]}`));
    }
    l.push('');
    l.push(estado.fecha ? '¿Tienen disponible esa fecha? ¿Cuánto saldría?' : '¿Me pasan precio y disponibilidad?');
    return l.join('\n');
  };

  function actualizar() {
    const n = CANALES.filter(c => estado.niveles[c.id] > 0).length;
    dispCanales.textContent = `${n}/5 canales`;
    preview.textContent = mensaje();
    if (n) errorEl.hidden = true;
  }

  $('#mesa').addEventListener('submit', e => {
    e.preventDefault();
    const n = CANALES.filter(c => estado.niveles[c.id] > 0).length;
    if (!n) {
      errorEl.textContent = 'Prendé al menos un canal (foto, video, pantalla, deco o sonido) para armar la consulta.';
      errorEl.hidden = false;
      canalesEl.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(mensaje())}`, '_blank', 'noopener');
  });

  $('#mesaReset').addEventListener('click', () => {
    CANALES.forEach(c => setNivel(c.id, 0, { silencio: true }));
    Object.assign(estado, { tipo: '', fecha: '', invitados: '', lugar: '', nombre: '' });
    pintarCampos();
    errorEl.hidden = true;
    actualizar(); guardar();
  });

  CANALES.forEach(c => setNivel(c.id, estado.niveles[c.id] || 0, { silencio: true }));
  pintarCampos();
  actualizar();

  /* ---------- mezcla RGB arrastrable ---------- */
  const escena = $('#escena');
  const centro = $('#centro');
  const luces = $$('.luz', escena);
  const pos = [[-0.3, -0.18], [0.3, -0.18], [0, 0.34]]; // en diámetros
  const ubicar = () => {
    const d = luces[0].offsetWidth || 200;
    const W = escena.clientWidth, H = escena.clientHeight;
    luces.forEach((l, i) => {
      let x = pos[i][0] * d, y = pos[i][1] * d;
      x = Math.max(-W / 2 + d * 0.3, Math.min(W / 2 - d * 0.3, x));
      y = Math.max(-H / 2 + d * 0.3, Math.min(H / 2 - d * 0.3, y));
      pos[i] = [x / d, y / d];
      l.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
    const cx = (pos[0][0] + pos[1][0] + pos[2][0]) / 3, cy = (pos[0][1] + pos[1][1] + pos[2][1]) / 3;
    const juntos = pos.every(p => Math.hypot(p[0] - cx, p[1] - cy) < 0.2);
    centro.classList.toggle('is-on', juntos);
    centro.style.left = `calc(50% + ${cx * d}px)`;
    centro.style.top = `calc(50% + ${cy * d}px)`;
  };
  luces.forEach((l, i) => {
    l.addEventListener('pointerdown', e => {
      e.preventDefault();
      l.setPointerCapture(e.pointerId);
      const d = l.offsetWidth;
      const x0 = e.clientX, y0 = e.clientY, p0 = pos[i].slice();
      const mover = ev => { pos[i] = [p0[0] + (ev.clientX - x0) / d, p0[1] + (ev.clientY - y0) / d]; ubicar(); };
      const soltar = () => { l.removeEventListener('pointermove', mover); l.removeEventListener('pointerup', soltar); l.removeEventListener('pointercancel', soltar); };
      l.addEventListener('pointermove', mover);
      l.addEventListener('pointerup', soltar);
      l.addEventListener('pointercancel', soltar);
    });
  });
  ubicar();
  window.addEventListener('resize', ubicar);

  /* ---------- FAB ---------- */
  const fab = $('#fab');
  const tapan = [$('.hero__fila'), $('.cierre')].filter(Boolean);
  if ('IntersectionObserver' in window) {
    const vis = new Set();
    new IntersectionObserver(ents => {
      ents.forEach(en => en.isIntersecting ? vis.add(en.target) : vis.delete(en.target));
      fab.classList.toggle('is-oculto', vis.size > 0);
    }).observe(tapan[0]);
    tapan.slice(1).forEach(t => new IntersectionObserver(ents => {
      ents.forEach(en => en.isIntersecting ? vis.add(en.target) : vis.delete(en.target));
      fab.classList.toggle('is-oculto', vis.size > 0);
    }).observe(t));
  }
})();
