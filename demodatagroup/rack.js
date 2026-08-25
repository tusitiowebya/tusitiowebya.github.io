/* ============================================================
   DATAGROUP — signature: "Armá tu infraestructura"
   Un rack de 14U que se va poblando con el equipamiento sugerido
   según el tamaño de la empresa, los dolores y quién lo administra.
   ============================================================ */
(function () {
  'use strict';

  var svg = document.getElementById('rackSvg');
  if (!svg) return;

  var legend = document.getElementById('rackLegend');
  var usoEl = document.getElementById('rackU');
  var waEl = document.getElementById('rackWA');
  var NS = 'http://www.w3.org/2000/svg';

  var TEL = '5491121906969';
  var US = 14;              // altura del rack en unidades
  var TOP = 34, BOT = 398;  // área útil del rack en el viewBox
  var UH = (BOT - TOP) / US;
  var X0 = 22, X1 = 168;

  /* ---------- estado ---------- */
  var estado = { tam: 'chica', nec: ['caidas'], admin: 'nadie' };

  /* ---------- catálogo de equipamiento ---------- */
  /* u = altura en unidades · color = color de frente · leds = cantidad de luces */
  var CATALOGO = [
    {
      id: 'ups', nombre: 'UPS on-line', u: 2, color: '#102843', led: '#4E86E8', leds: 2,
      marca: 'APC / Lyonn',
      desc: 'Autonomía para bajar los equipos como corresponde y protección contra picos de tensión.',
      cuando: function (e) { return e.nec.indexOf('luz') > -1 || e.nec.indexOf('caidas') > -1 || e.tam !== 'chica'; }
    },
    {
      id: 'srv2', nombre: 'Servidor secundario', u: 2, color: '#1B3A57', led: '#9FC2FA', leds: 4,
      marca: 'Dell / Lenovo',
      desc: 'Redundancia real: si el principal se cae, la operación sigue. Recomendado a partir de 50 puestos.',
      cuando: function (e) { return e.tam === 'grande'; }
    },
    {
      id: 'srv', nombre: 'Servidor principal', u: 2, color: '#1B3A57', led: '#9FC2FA', leds: 4,
      marca: 'Dell / Lenovo / HP',
      desc: 'Archivos, sistema de gestión, controlador de dominio y usuarios centralizados.',
      cuando: function (e) { return true; }
    },
    {
      id: 'nas', nombre: 'Storage / backup', u: 2, color: '#173251', led: '#6FA0F0', leds: 4,
      marca: 'Western Digital / Synology',
      desc: 'Copias automáticas con retención. Si mañana perdés un equipo, no perdés la información.',
      cuando: function (e) { return e.nec.indexOf('datos') > -1 || e.tam !== 'chica'; }
    },
    {
      id: 'nvr', nombre: 'Grabador NVR', u: 1, color: '#0F2338', led: '#C9DBFA', leds: 3,
      marca: 'Hikvision',
      desc: 'Grabación continua de las cámaras IP, con acceso remoto desde el celular.',
      cuando: function (e) { return e.nec.indexOf('camaras') > -1; }
    },
    {
      id: 'fw', nombre: 'Firewall / VPN', u: 1, color: '#0B2E5E', led: '#3F6FD8', leds: 2,
      marca: 'Cisco',
      desc: 'Acceso remoto seguro para que tu gente trabaje desde afuera sin exponer la red.',
      cuando: function (e) { return e.nec.indexOf('remoto') > -1 || e.tam === 'grande'; }
    },
    {
      id: 'sw', nombre: 'Switch administrable', u: 1, color: '#102843', led: '#8FB4F5', leds: 8,
      marca: 'Cisco',
      desc: 'El nudo de la red. Administrable para separar tráfico y aislar problemas sin cortar todo.',
      cuando: function (e) { return true; }
    },
    {
      id: 'sw2', nombre: 'Switch de acceso extra', u: 1, color: '#102843', led: '#8FB4F5', leds: 8,
      marca: 'Cisco',
      desc: 'Bocas adicionales para cubrir todos los puestos sin cascadear equipos hogareños.',
      cuando: function (e) { return e.tam === 'grande'; }
    },
    {
      id: 'wifi', nombre: 'Controladora WiFi + APs', u: 1, color: '#14314F', led: '#5F93EC', leds: 3,
      marca: 'Cisco / Ubiquiti',
      desc: 'Cobertura pareja en toda la planta, roaming entre antenas y red de invitados separada.',
      cuando: function (e) { return e.nec.indexOf('wifi') > -1; }
    },
    {
      id: 'patch', nombre: 'Patchera + cableado', u: 1, color: '#0B1B2D', led: '#7B8DA6', leds: 12,
      marca: 'Cableado estructurado',
      desc: 'Cableado certificado y ordenado. Es lo que hace que un problema se resuelva en minutos y no en horas.',
      cuando: function (e) { return true; }
    }
  ];

  /* extras que no ocupan U pero forman parte de la propuesta */
  var EXTRAS = [
    {
      id: 'abono', nombre: 'Abono de soporte gestionado', color: '#7BA6F5',
      desc: 'Si adentro no hay nadie que lo administre, lo administramos nosotros: monitoreo, backups y mesa de ayuda.',
      cuando: function (e) { return e.admin === 'nadie'; }
    },
    {
      id: 'coord', nombre: 'Coordinación con tu IT interno', color: '#4E86E8',
      desc: 'Trabajamos como refuerzo de tu equipo: nosotros ponemos el equipamiento y la segunda opinión técnica.',
      cuando: function (e) { return e.admin === 'interno' || e.admin === 'externo'; }
    },
    {
      id: 'licencias', nombre: 'Licenciamiento Microsoft', color: '#C9DBFA',
      desc: 'Sistemas operativos, Office y CALs en regla, con las renovaciones controladas por nosotros.',
      cuando: function (e) { return true; }
    }
  ];

  /* ---------- estructura fija del rack ---------- */
  function dibujarChasis() {
    svg.innerHTML = '';
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML =
      '<linearGradient id="rackBg" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#08192F"/><stop offset="1" stop-color="#050F1E"/></linearGradient>';
    svg.appendChild(defs);

    add('rect', { x: 8, y: 14, width: 174, height: BOT - 14 + 12, rx: 8, fill: 'url(#rackBg)', stroke: 'rgba(123,166,245,.3)', 'stroke-width': 1.4 });
    // rieles
    add('rect', { x: X0 - 8, y: TOP - 4, width: 6, height: BOT - TOP + 8, rx: 2, fill: 'rgba(123,166,245,.16)' });
    add('rect', { x: X1 + 2, y: TOP - 4, width: 6, height: BOT - TOP + 8, rx: 2, fill: 'rgba(123,166,245,.16)' });

    // marcas de U
    for (var i = 0; i < US; i++) {
      var y = TOP + i * UH;
      add('line', { x1: X0 - 8, y1: y, x2: X0 - 3, y2: y, stroke: 'rgba(255,255,255,.2)', 'stroke-width': 1 });
      add('text', {
        x: 6, y: y + UH / 2 + 3, fill: 'rgba(255,255,255,.28)',
        'font-size': 6.5, 'font-family': 'Azeret Mono, monospace', 'text-anchor': 'middle'
      }, (US - i) + '');
    }

    // ventilación superior
    add('rect', { x: 22, y: 20, width: 146, height: 8, rx: 3, fill: 'rgba(255,255,255,.05)' });
    add('text', {
      x: 95, y: 411, fill: 'rgba(255,255,255,.35)', 'font-size': 7,
      'font-family': 'Azeret Mono, monospace', 'text-anchor': 'middle', 'letter-spacing': '1.5'
    }, 'RACK 14U');
  }

  function add(tag, attrs, texto) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (texto !== undefined) el.textContent = texto;
    svg.appendChild(el);
    return el;
  }

  function grupoEquipo(eq, y) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'u-body off');
    var h = eq.u * UH - 3;

    var r = document.createElementNS(NS, 'rect');
    setAttrs(r, { x: X0, y: y + 1.5, width: X1 - X0, height: h, rx: 2.5, fill: eq.color, stroke: 'rgba(255,255,255,.16)', 'stroke-width': .9 });
    g.appendChild(r);

    // orejas de montaje
    [X0 + 3, X1 - 5].forEach(function (cx) {
      var c = document.createElementNS(NS, 'circle');
      setAttrs(c, { cx: cx + 1, cy: y + 1.5 + h / 2, r: 1.3, fill: 'rgba(255,255,255,.28)' });
      g.appendChild(c);
    });

    // leds
    for (var i = 0; i < eq.leds; i++) {
      var l = document.createElementNS(NS, 'rect');
      setAttrs(l, {
        x: X1 - 12 - i * 5.4, y: y + 1.5 + h / 2 - 1.6, width: 3, height: 3.2, rx: .8,
        fill: eq.led, opacity: (i % 3 === 0 ? .95 : .45)
      });
      g.appendChild(l);
    }

    // nombre
    var t = document.createElementNS(NS, 'text');
    setAttrs(t, {
      x: X0 + 9, y: y + 1.5 + h / 2 + 2.6, fill: 'rgba(255,255,255,.86)',
      'font-size': 6.6, 'font-family': 'Azeret Mono, monospace'
    });
    t.textContent = eq.nombre.length > 20 ? eq.nombre.slice(0, 19) + '…' : eq.nombre;
    g.appendChild(t);

    svg.appendChild(g);
    return g;
  }

  function setAttrs(el, a) { for (var k in a) el.setAttribute(k, a[k]); }

  /* ---------- render ---------- */
  function render() {
    dibujarChasis();

    var elegidos = CATALOGO.filter(function (eq) { return eq.cuando(estado); });

    // recorte por si se pasa de 14U (deja siempre lo esencial)
    var totalU = elegidos.reduce(function (s, e) { return s + e.u; }, 0);
    while (totalU > US) {
      var i = elegidos.length - 1;
      for (; i >= 0; i--) {
        if (['patch', 'sw', 'srv'].indexOf(elegidos[i].id) === -1) break;
      }
      if (i < 0) break;
      totalU -= elegidos[i].u;
      elegidos.splice(i, 1);
    }

    // se apila de abajo hacia arriba, en el orden del catálogo
    var y = BOT;
    var nodos = [];
    elegidos.forEach(function (eq) {
      y -= eq.u * UH;
      nodos.push(grupoEquipo(eq, y));
    });

    // aparecen escalonados
    requestAnimationFrame(function () {
      nodos.forEach(function (g, i) {
        setTimeout(function () { g.classList.remove('off'); }, 60 + i * 85);
      });
    });

    // leyenda
    legend.innerHTML = '';
    var extras = EXTRAS.filter(function (x) { return x.cuando(estado); });
    elegidos.concat(extras).forEach(function (eq, i) {
      var d = document.createElement('div');
      d.className = 'rack-item';
      d.style.animationDelay = (i * 60) + 'ms';
      var color = eq.led || eq.color;
      d.innerHTML =
        '<span class="rack-item__dot" style="background:' + color + '"></span>' +
        '<span><b>' + eq.nombre + (eq.u ? ' · ' + eq.u + 'U' : '') + '</b>' +
        '<span>' + eq.desc + (eq.marca ? ' <em style="opacity:.65;font-style:normal">— ' + eq.marca + '</em>' : '') + '</span></span>';
      legend.appendChild(d);
    });

    usoEl.textContent = totalU + 'U';

    // mensaje de WhatsApp
    var tamTxt = { chica: 'hasta 10 puestos', media: 'entre 10 y 50 puestos', grande: 'más de 50 puestos' }[estado.tam];
    var necTxt = {
      caidas: 'se me cae todo', datos: 'cuidar los datos', camaras: 'vigilancia del local',
      remoto: 'trabajo remoto', wifi: 'WiFi que no anda', luz: 'cortes de luz'
    };
    var adminTxt = { nadie: 'hoy no lo administra nadie', interno: 'lo administra alguien interno', externo: 'lo administra un externo' }[estado.admin];

    var msg = '¡Hola Datagroup! Armé una configuración en la web:\n\n' +
      '• Empresa: ' + tamTxt + '\n' +
      '• Qué necesito: ' + (estado.nec.length ? estado.nec.map(function (n) { return necTxt[n]; }).join(', ') : 'todavía no lo tengo claro') + '\n' +
      '• Administración: ' + adminTxt + '\n\n' +
      'Equipamiento sugerido (' + totalU + 'U):\n' +
      elegidos.map(function (e) { return '– ' + e.nombre + ' (' + e.u + 'U)'; }).join('\n') + '\n' +
      (extras.length ? '\nAdemás:\n' + extras.map(function (e) { return '– ' + e.nombre; }).join('\n') + '\n' : '') +
      '\n¿Me pasan una cotización?';

    waEl.href = 'https://api.whatsapp.com/send?phone=' + TEL + '&text=' + encodeURIComponent(msg);
  }

  /* ---------- interacción ---------- */
  function grupoSimple(id, campo) {
    var cont = document.getElementById(id);
    if (!cont) return;
    cont.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      cont.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      estado[campo] = b.dataset.v;
      render();
    });
  }

  grupoSimple('qTam', 'tam');
  grupoSimple('qAdmin', 'admin');

  var nec = document.getElementById('qNec');
  if (nec) {
    nec.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      var v = b.dataset.v;
      var on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (on) estado.nec = estado.nec.filter(function (x) { return x !== v; });
      else estado.nec.push(v);
      render();
    });
  }

  render();

  /* auto-demo: al entrar en viewport marca "cuidar los datos" para mostrar que reacciona */
  if ('IntersectionObserver' in window) {
    var demo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        demo.disconnect();
        setTimeout(function () {
          var b = document.querySelector('#qNec .chip[data-v="datos"]');
          if (b && b.getAttribute('aria-pressed') === 'false') b.click();
        }, 700);
      });
    }, { threshold: 0.35 });
    demo.observe(document.getElementById('rack'));
  }
})();
