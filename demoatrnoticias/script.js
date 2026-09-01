/* ═══════════════════════════════════════════════════════════════
   ATR NOTICIAS — Formosa · demo TuPaginaYa

   ┌─────────────────────────────────────────────────────────────┐
   │  TODO LO QUE SE EDITA A MANO ESTÁ EN ESTE BLOQUE "CONFIG".  │
   │  El clima, el dólar, el reloj y el contador de visitas son  │
   │  automáticos: no hay que tocar nada.                        │
   └─────────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── RADIO ────────────────────────────────────────────────────
     Cuando tengas el stream real de ATR Radio (Shoutcast / Icecast
     / Zeno / RadioBoss), pegá la URL acá y listo. Tiene que ser
     https, si no el navegador la bloquea.                       */
  radio: {
    stream: 'https://stream.radioparadise.com/mp3-128',      // ← stream de PRUEBA
    nombre: 'ATR Radio',
    dial:   'FM 101.5',
    // programación: se muestra sola según la hora de Formosa
    grilla: [
      { desde: 0,  hasta: 6,  nombre: 'La trasnoche de ATR' },
      { desde: 6,  hasta: 9,  nombre: 'Buen día Formosa' },
      { desde: 9,  hasta: 12, nombre: 'ATR Informa — primera edición' },
      { desde: 12, hasta: 14, nombre: 'El mediodía de la provincia' },
      { desde: 14, hasta: 18, nombre: 'La tarde ATR' },
      { desde: 18, hasta: 21, nombre: 'ATR Informa — segunda edición' },
      { desde: 21, hasta: 24, nombre: 'Noches de chamamé' }
    ]
  },

  /* ── CONTADOR DE VISITAS ──────────────────────────────────────
     Real, gratis y sin registro. El "espacio" es único de este
     sitio; si se cambia, el contador arranca de cero.           */
  visitas: {
    espacio: 'atrnoticias-formosa',
    clave:   'home'
  },

  /* ── CLIMA ────────────────────────────────────────────────────
     Coordenadas de la ciudad de Formosa. Datos en vivo.         */
  clima: { lat: -26.1849, lon: -58.1731, ciudad: 'Formosa' },

  /* ── ÚLTIMO MOMENTO (ticker rojo de arriba) ──────────────────*/
  ticker: [
    'Repavimentación de la Ruta 11: habrá desvíos en el acceso norte a la capital',
    'Control en la Ruta 81: secuestran mercadería a la altura de Ibarreta',
    'Regional Amateur: los tres equipos formoseños ya conocen sus rivales',
    'La Legislatura debate el presupuesto provincial en sesión extraordinaria',
    'Fibra óptica: la red llega a cinco localidades más del centro provincial',
    'Festival de la Costanera: se confirmaron las tres noches de chamamé'
  ],

  /* ── MINUTO A MINUTO (columna derecha de la portada) ─────────*/
  minuto: [
    { hora: '14:40', texto: 'Vialidad confirma el corte parcial de la Ruta 11 desde las 7' },
    { hora: '13:55', texto: 'El municipio publica el nuevo mapa de estacionamiento medido' },
    { hora: '12:20', texto: 'Clorinda: reabre el paso vecinal tras las obras de alumbrado' },
    { hora: '11:05', texto: 'Salud provincial amplía la campaña de vacunación en el interior' },
    { hora: '09:30', texto: 'Deportes: se confirmó el horario del clásico del sábado' },
    { hora: '08:10', texto: 'Pronóstico: jornada agradable y sin lluvias en toda la provincia' }
  ],

  /* ── QUINIELA Y TABLA: DATOS EN VIVO ──────────────────────────
     Ya NO se cargan a mano. Un recolector que corre en el servidor
     cada 15 minutos deja este JSON actualizado:

       quiniela → vivitusuerte.com  (Formosa, Nacional, Provincia,
                                     Chaco y Corrientes, los 5 turnos)
       tabla    → promiedos.com.ar  (Liga Profesional, las 2 zonas)

     Si el JSON no responde, los widgets muestran "no disponible".
     A propósito: en una quiniela, un número viejo o inventado es
     peor que no mostrar nada.                                   */
  datos: {
    url: 'https://tupaginaya.com.ar/atr/datos.json',

    // los 5 turnos del día, para poder mostrar también los que
    // todavía no se sortearon
    turnos: [
      { id: 'previa',     nombre: 'Previa',     hora: '10:15' },
      { id: 'primera',    nombre: 'Primera',    hora: '12:00' },
      { id: 'matutina',   nombre: 'Matutina',   hora: '15:00' },
      { id: 'vespertina', nombre: 'Vespertina', hora: '18:00' },
      { id: 'nocturna',   nombre: 'Nocturna',   hora: '21:00' }
    ],

    equiposVisibles: 8   // cuántos muestra la tabla antes de "ver completa"
  }
};

/* ═══════════════════════════════════════════════════════════════
   A partir de acá es el motor de la página. No hace falta tocarlo.
   ═══════════════════════════════════════════════════════════════ */

const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

/* ─────────── TEMA CLARO / OSCURO ─────────── */
(function tema() {
  const KEY = 'atr-tema';
  const root = document.documentElement;
  let guardado = null;
  try { guardado = localStorage.getItem(KEY); } catch (e) {}

  if (guardado === 'dark' || guardado === 'light') {
    root.setAttribute('data-theme', guardado);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  const btn = $('#themeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const esOscuro = root.getAttribute('data-theme') === 'dark';
    const nuevo = esOscuro ? 'light' : 'dark';
    root.setAttribute('data-theme', nuevo);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', nuevo === 'dark' ? '#08090B' : '#101114');
    try { localStorage.setItem(KEY, nuevo); } catch (e) {}
  });
})();

/* ─────────── FECHA + RELOJ EN VIVO (hora de Formosa) ─────────── */
(function relojYFecha() {
  const DIAS  = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const TZ = 'America/Argentina/Buenos_Aires';   // Formosa usa la misma hora que el resto del país

  const fechaEl  = $('#fecha');
  const relojEl  = $('#relojTop');
  const dockEl   = $('#dockClock');
  const radioEl  = $('#radioHora');

  // partes de la fecha/hora en la zona horaria argentina, sin depender del reloj del visitante
  function partes() {
    const f = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'short'
    }).formatToParts(new Date());
    const o = {};
    f.forEach(p => { o[p.type] = p.value; });
    if (o.hour === '24') o.hour = '00';
    return o;
  }

  function tick() {
    const p = partes();
    const hhmmss = `${p.hour}:${p.minute}:${p.second}`;
    if (relojEl) relojEl.textContent = hhmmss;
    if (dockEl)  dockEl.textContent  = hhmmss;
    if (radioEl) radioEl.textContent = `${p.hour}:${p.minute}`;

    if (fechaEl) {
      const d = new Date(`${p.year}-${p.month}-${p.day}T12:00:00`);
      fechaEl.textContent = `${DIAS[d.getDay()]} ${Number(p.day)} de ${MESES[d.getMonth()]} de ${p.year}`;
    }
  }
  tick();
  setInterval(tick, 1000);

  // programa al aire según la hora argentina
  window.__horaAR = () => Number(partes().hour);
})();

/* ─────────── AÑO EN EL FOOTER ─────────── */
(function anio() {
  const el = $('#anio');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────── TICKER + MINUTO A MINUTO ─────────── */
(function contenidoDinamico() {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const tk = $('#tickerContent');
  if (tk) {
    // se duplica para que el loop no deje hueco
    const items = CONFIG.ticker.map(t => `<span>${esc(t)}</span>`).join('');
    tk.innerHTML = items + items;
  }

  const mm = $('#minutoList');
  if (mm) {
    mm.innerHTML = CONFIG.minuto.map((m, i) =>
      `<li class="${i === 0 ? 'is-new' : ''}"><time>${esc(m.hora)}</time><a href="#">${esc(m.texto)}</a></li>`
    ).join('');
  }
})();

/* ─────────── CLIMA EN VIVO (Open-Meteo, sin key) ─────────── */
(function clima() {
  const WMO = {
    0:  ['☀️','Despejado'],        1:  ['🌤️','Mayormente despejado'],
    2:  ['⛅','Parcialmente nublado'], 3:  ['☁️','Nublado'],
    45: ['🌫️','Niebla'],           48: ['🌫️','Niebla con escarcha'],
    51: ['🌦️','Llovizna leve'],     53: ['🌦️','Llovizna'],
    55: ['🌦️','Llovizna intensa'],  61: ['🌧️','Lluvia leve'],
    63: ['🌧️','Lluvia'],            65: ['🌧️','Lluvia fuerte'],
    71: ['🌨️','Nevadas'],           73: ['🌨️','Nevadas'],
    75: ['🌨️','Nevadas fuertes'],   80: ['🌦️','Chaparrones'],
    81: ['🌧️','Chaparrones'],       82: ['⛈️','Chaparrones fuertes'],
    95: ['⛈️','Tormenta'],          96: ['⛈️','Tormenta con granizo'],
    99: ['⛈️','Tormenta con granizo']
  };
  const dato = c => WMO[c] || ['🌡️','—'];
  const DIAS_C = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

  const { lat, lon } = CONFIG.clima;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
              `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
              `&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=5`;

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 8000);

  fetch(url, { signal: ctrl.signal })
    .then(r => r.json())
    .then(j => {
      if (!j || !j.current) throw new Error('sin datos');

      const [ico, desc] = dato(j.current.weather_code);
      const t = Math.round(j.current.temperature_2m);

      const set = (sel, val) => { const e = $(sel); if (e) e.textContent = val; };
      set('#climaIco', ico);
      set('#climaTemp', `${t}°`);
      set('#climaDesc', desc);
      set('#climaHum', `${j.current.relative_humidity_2m}%`);
      set('#climaViento', `${Math.round(j.current.wind_speed_10m)} km/h`);
      set('#climaTopIco', ico);
      set('#climaTopTemp', `${t}°`);
      set('#dockTemp', `${t}°`);

      const cont = $('#climaDias');
      if (cont && j.daily) {
        const html = [];
        // arranca en el día siguiente
        for (let i = 1; i < Math.min(5, j.daily.time.length); i++) {
          const d = new Date(j.daily.time[i] + 'T12:00:00');
          const [di] = dato(j.daily.weather_code[i]);
          html.push(
            `<div class="clima__dia">
               <span class="clima__dia-nom">${DIAS_C[d.getDay()]}</span>
               <span class="clima__dia-ico">${di}</span>
               <span class="clima__dia-t">${Math.round(j.daily.temperature_2m_max[i])}° <i>${Math.round(j.daily.temperature_2m_min[i])}°</i></span>
             </div>`
          );
        }
        cont.innerHTML = html.join('');
      }
    })
    .catch(() => {
      const e = $('#climaDesc');
      if (e) e.textContent = 'No disponible';
    })
    .finally(() => clearTimeout(to));
})();

/* ─────────── DÓLAR EN VIVO (dolarapi.com, sin key) ─────────── */
(function dolar() {
  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 8000);

  fetch('https://dolarapi.com/v1/dolares', { signal: ctrl.signal })
    .then(r => r.json())
    .then(lista => {
      if (!Array.isArray(lista)) throw new Error('sin datos');
      const pick = casa => lista.find(d => d.casa === casa);

      const of = pick('oficial'), bl = pick('blue'), mep = pick('bolsa'), tj = pick('tarjeta');

      const o = $('#dolarOficial'), b = $('#dolarBlue');
      if (o && of) o.textContent = fmt(of.venta);
      if (b && bl) b.textContent = fmt(bl.venta);

      const grid = $('#cotizaGrid');
      if (grid) {
        const filas = [
          ['Oficial', of], ['Blue', bl], ['MEP', mep], ['Tarjeta', tj]
        ].filter(([, d]) => d);
        if (filas.length) {
          grid.innerHTML = filas.map(([nom, d]) =>
            `<div class="cotiza__item"><span>${nom}</span><b>${fmt(d.venta)}</b></div>`
          ).join('');
        }
      }
    })
    .catch(() => {
      const o = $('#dolarOficial'), b = $('#dolarBlue');
      if (o) o.textContent = 'n/d';
      if (b) b.textContent = 'n/d';
    })
    .finally(() => clearTimeout(to));
})();

/* ─────────── CONTADOR DE VISITAS (real) ─────────── */
(function visitas() {
  const { espacio, clave } = CONFIG.visitas;
  const base = 'https://abacus.jasoncameron.dev';
  // suma 1 sola vez por sesión del navegador; el resto de las cargas solo lee
  let yaContado = false;
  try { yaContado = sessionStorage.getItem('atr-visita') === '1'; } catch (e) {}
  const url = `${base}/${yaContado ? 'get' : 'hit'}/${espacio}/${clave}`;

  const pintar = n => {
    const txt = Number(n).toLocaleString('es-AR');
    const a = $('#visitasTop'), b = $('#visitasFooter');
    if (a) a.textContent = txt;
    if (b) animarNumero(b, Number(n));
  };

  function animarNumero(el, destino) {
    if (!el) return;
    const dur = 900, t0 = performance.now();
    (function paso(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(destino * eased).toLocaleString('es-AR');
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
  }

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 8000);

  fetch(url, { signal: ctrl.signal })
    .then(r => r.json())
    .then(j => {
      if (j && typeof j.value === 'number') {
        pintar(j.value);
        try { sessionStorage.setItem('atr-visita', '1'); } catch (e) {}
      }
    })
    .catch(() => {
      const a = $('#visitasTop'), b = $('#visitasFooter');
      if (a) a.textContent = 'n/d';
      if (b) b.textContent = 'n/d';
    })
    .finally(() => clearTimeout(to));
})();

/* ─────────── RADIO ONLINE ─────────── */
(function radio() {
  const audio  = $('#radioAudio');
  if (!audio) return;

  const btns   = [$('#radioPlay'), $('#dockPlay')].filter(Boolean);
  const eqs    = [$('#radioEq'), $('#dockEq')].filter(Boolean);
  const vol    = $('#radioVol');
  const estado = $('#radioStatus');
  const topBtn = $('#radioTopBtn');
  const shows  = [$('#radioShow'), $('#dockShow')].filter(Boolean);

  audio.src = CONFIG.radio.stream;
  audio.volume = vol ? vol.value / 100 : 0.8;

  // programa al aire según la hora argentina
  function programa() {
    const h = (typeof window.__horaAR === 'function') ? window.__horaAR() : new Date().getHours();
    const p = CONFIG.radio.grilla.find(g => h >= g.desde && h < g.hasta);
    return p ? p.nombre : 'Programación musical';
  }
  function pintarPrograma() {
    const nom = programa();
    shows.forEach(s => { s.textContent = nom; });
  }
  pintarPrograma();
  setInterval(pintarPrograma, 60000);

  function marcar(clase, on) {
    btns.forEach(b => b.classList.toggle(clase, on));
  }
  function estadoTexto(t) { if (estado) estado.textContent = t; }

  function reproducir() {
    marcar('is-loading', true);
    estadoTexto('Conectando con el estudio…');
    // recargar la fuente evita quedarse pegado a un buffer viejo del stream
    if (audio.readyState === 0) audio.load();
    const p = audio.play();
    if (p && p.catch) {
      p.catch(() => {
        marcar('is-loading', false);
        marcar('is-playing', false);
        estadoTexto('No se pudo conectar. Probá de nuevo en unos segundos.');
      });
    }
  }

  function alternar() {
    if (audio.paused) reproducir();
    else audio.pause();
  }

  btns.forEach(b => b.addEventListener('click', alternar));
  if (topBtn) topBtn.addEventListener('click', () => {
    const w = $('#radio');
    if (w) w.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (audio.paused) reproducir();
  });

  audio.addEventListener('playing', () => {
    marcar('is-loading', false);
    marcar('is-playing', true);
    eqs.forEach(e => e.classList.add('is-on'));
    estadoTexto('En vivo — ' + programa());
    if (topBtn) topBtn.classList.add('is-playing');
  });
  audio.addEventListener('pause', () => {
    marcar('is-loading', false);
    marcar('is-playing', false);
    eqs.forEach(e => e.classList.remove('is-on'));
    estadoTexto('Pausado. Tocá play para volver al aire.');
    if (topBtn) topBtn.classList.remove('is-playing');
  });
  audio.addEventListener('waiting', () => marcar('is-loading', true));
  audio.addEventListener('error', () => {
    marcar('is-loading', false);
    marcar('is-playing', false);
    eqs.forEach(e => e.classList.remove('is-on'));
    estadoTexto('La transmisión no está disponible en este momento.');
  });

  if (vol) vol.addEventListener('input', () => { audio.volume = vol.value / 100; });
})();

/* ─────────── DATOS EN VIVO (quiniela + tabla) ───────────
   Una sola descarga que comparten los dos widgets. */
const DATOS = (function cargarDatos() {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 9000);
  return fetch(CONFIG.datos.url, { signal: ctrl.signal, cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(() => null)
    .finally(() => clearTimeout(to));
})();

/* "hace 12 minutos" a partir del sello ISO del recolector */
function desdeHace(iso) {
  if (!iso) return '';
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (!isFinite(min) || min < 0) return '';
  if (min < 1)  return 'recién actualizado';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

/* ─────────── QUINIELA ─────────── */
(function quiniela() {
  const lotEl    = $('#quinielaLoterias');
  const tabs     = $('#quinielaTabs');
  const grid     = $('#quinielaGrid');
  const cabeza   = $('#quinielaCabeza');
  const sorteoEl = $('#quinielaSorteo');
  const fechaEl  = $('#quinielaFecha');
  if (!tabs || !grid) return;

  const noDisponible = (msg) => {
    if (lotEl) lotEl.innerHTML = '';
    tabs.innerHTML = '';
    if (cabeza) cabeza.textContent = '----';
    grid.innerHTML = `<p class="widget__vacio">${msg}</p>`;
    if (sorteoEl) sorteoEl.textContent = '';
    if (fechaEl)  fechaEl.textContent  = '';
  };

  DATOS.then(d => {
    const q = d && d.quiniela;
    if (!q || !Array.isArray(q.loterias) || !q.loterias.length) {
      noDisponible('Resultados no disponibles en este momento.');
      return;
    }

    let lotActual = q.loterias[0].id;   // Formosa primero: es un diario formoseño
    let turnoActual = null;

    function pintar() {
      const lot = q.loterias.find(l => l.id === lotActual) || q.loterias[0];

      $$('.quiniela__lot', lotEl).forEach(b =>
        b.classList.toggle('is-active', b.dataset.id === lot.id));

      // los 5 turnos del día; los que aún no salieron van deshabilitados
      tabs.innerHTML = CONFIG.datos.turnos.map(t => {
        const hay = lot.sorteos.some(s => s.id === t.id);
        return `<button class="quiniela__tab${hay ? '' : ' is-pendiente'}" data-id="${t.id}"${hay ? '' : ' disabled'} title="${hay ? t.nombre + ' · ' + t.hora + ' hs' : 'Se sortea a las ' + t.hora}">${t.nombre}</button>`;
      }).join('');

      // si el turno elegido no existe en esta lotería, tomamos el último con datos
      let s = lot.sorteos.find(x => x.id === turnoActual);
      if (!s) s = lot.sorteos[lot.sorteos.length - 1];
      if (!s) { grid.innerHTML = `<p class="widget__vacio">Todavía no hay sorteos de hoy.</p>`; return; }
      turnoActual = s.id;

      $$('.quiniela__tab', tabs).forEach(b =>
        b.classList.toggle('is-active', b.dataset.id === s.id));

      if (cabeza) cabeza.textContent = s.cabeza || '----';
      grid.innerHTML = s.numeros.slice(1, 11).map((n, i) =>
        `<span class="quiniela__n"><i>${String(i + 2).padStart(2, '0')}</i><b>${n || '----'}</b></span>`
      ).join('');

      if (sorteoEl) sorteoEl.textContent = `${lot.nombre} · ${s.nombre} ${s.hora} hs`;
      if (fechaEl)  fechaEl.textContent  = desdeHace(d.generado);
    }

    lotEl.innerHTML = q.loterias.map(l =>
      `<button class="quiniela__lot" data-id="${l.id}">${l.nombre}</button>`
    ).join('');

    lotEl.addEventListener('click', e => {
      const b = e.target.closest('.quiniela__lot');
      if (b) { lotActual = b.dataset.id; pintar(); }
    });
    tabs.addEventListener('click', e => {
      const b = e.target.closest('.quiniela__tab');
      if (b && !b.disabled) { turnoActual = b.dataset.id; pintar(); }
    });

    pintar();
  });
})();

/* ─────────── TABLA DE POSICIONES ─────────── */
(function tabla() {
  const zonasEl = $('#tablaZonas');
  const body    = $('#tablaBody');
  const toggle  = $('#tablaToggle');
  const pie     = $('#tablaFecha');
  if (!body) return;

  const TOPE = CONFIG.datos.equiposVisibles;

  DATOS.then(d => {
    const t = d && d.tabla;
    if (!t || !Array.isArray(t.zonas) || !t.zonas.length) {
      body.innerHTML = `<tr><td colspan="5"><p class="widget__vacio">Tabla no disponible en este momento.</p></td></tr>`;
      if (toggle) toggle.hidden = true;
      if (pie) pie.textContent = '';
      return;
    }

    let iZona = 0;
    let abierta = false;

    function pintar() {
      const z = t.zonas[iZona];

      if (zonasEl) $$('.tabla__zona', zonasEl).forEach((b, i) =>
        b.classList.toggle('is-active', i === iZona));

      body.innerHTML = z.equipos.map((e, i) => {
        const oculta = (!abierta && i >= TOPE) ? ' class="is-hidden"' : '';
        // el color lo marca la fuente: son los que clasifican
        const clasifica = e.color ? ' tabla__pos--clasifica' : '';
        const dg = e.dg > 0 ? `+${e.dg}` : e.dg;
        return `<tr${oculta}>
          <td><span class="tabla__pos${clasifica}">${e.pos}</span></td>
          <td><span class="tabla__eq">${e.eq}</span>${e.racha.length ? `<span class="tabla__racha">${e.racha.map(r => `<i class="r-${r}">${r}</i>`).join('')}</span>` : ''}</td>
          <td>${e.pj}</td>
          <td>${dg}</td>
          <td class="tabla__pts">${e.pts}</td>
        </tr>`;
      }).join('');

      if (toggle) {
        toggle.hidden = z.equipos.length <= TOPE;
        toggle.textContent = abierta ? 'Ver menos' : 'Ver tabla completa';
      }
      if (pie) pie.textContent = `${t.torneo} · ${desdeHace(d.generado)}`;
    }

    if (zonasEl && t.zonas.length > 1) {
      zonasEl.innerHTML = t.zonas.map(z =>
        `<button class="tabla__zona">${z.nombre.replace(/^Grupo/, 'Zona')}</button>`
      ).join('');
      zonasEl.addEventListener('click', e => {
        const b = e.target.closest('.tabla__zona');
        if (!b) return;
        iZona = $$('.tabla__zona', zonasEl).indexOf(b);
        pintar();
      });
    }

    if (toggle) toggle.addEventListener('click', () => { abierta = !abierta; pintar(); });

    pintar();
  });
})();

/* ─────────── RIEL HORIZONTAL (espectáculos) ─────────── */
(function riel() {
  const rail = $('#rail');
  const prev = $('#railPrev');
  const next = $('#railNext');
  if (!rail || !prev || !next) return;

  const paso = () => {
    const card = rail.querySelector('.rail__card');
    return card ? card.offsetWidth + 22 : 280;
  };
  prev.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next.addEventListener('click', () => rail.scrollBy({ left:  paso(), behavior: 'smooth' }));
})();

/* ─────────── BARRA DE LECTURA ─────────── */
(function readbar() {
  const bar = $('#readbar');
  if (!bar) return;
  const pintar = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    bar.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', pintar, { passive: true });
  pintar();
})();

/* ─────────── MENÚ MOBILE ─────────── */
(function menu() {
  const burger = $('#navBurger');
  const list   = $('#navList');
  if (!burger || !list) return;

  burger.addEventListener('click', () => {
    const abierto = list.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(abierto));
  });
  $$('a', list).forEach(a => a.addEventListener('click', () => {
    list.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));
})();

/* ─────────── FADE-IN + NAV ACTIVO ─────────── */
(function scrollSpy() {
  const bloques = $$('.block');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.06 });
  bloques.forEach(b => io.observe(b));

  const links = $$('.nav__list a');
  const navIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.getAttribute('id');
      const match = links.find(l => l.getAttribute('href') === '#' + id);
      if (match) {
        links.forEach(l => l.classList.remove('active'));
        match.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  ['#inicio', ...bloques.map(b => '#' + b.id)].forEach(sel => {
    const el = sel && sel !== '#' ? $(sel) : null;
    if (el) navIo.observe(el);
  });
})();

/* ─────────── BUSCADOR (demo) ─────────── */
(function buscador() {
  const btn = $('#navSearch');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const q = prompt('Buscar en ATR Noticias:');
    if (q) alert(`Mostrando resultados para "${q}".\n\n(Demo: el buscador se conecta al panel de carga de notas.)`);
  });
})();

/* ─────────── DOCK: cerrar ─────────── */
(function dock() {
  const dk = $('#dockClose');
  const barra = $('#dock');
  if (!dk || !barra) return;
  dk.addEventListener('click', () => {
    barra.classList.add('is-hidden');
    document.body.classList.add('dock-off');
  });
})();
