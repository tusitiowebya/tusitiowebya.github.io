/* ============================================================
   Microcosmos® — TuPaginaYa
   ============================================================ */
(function () {
  'use strict';

  /* modo QA para capturas headless: ?qa */
  if (location.search.indexOf('qa') > -1) document.documentElement.classList.add('qa');

  /* ---------- año ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      var el = e.target;
      setTimeout(function () { el.classList.add('in'); }, Math.min(i * 90, 320));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ============================================================
     MAPA ORBITAL — tu microcosmos
     ============================================================ */
  var DIM = {
    historia: {
      t: 'Historia',
      d: 'Lo que viviste no se borra, pero sí se puede resignificar. Miramos tu historia para entender qué aprendiste ahí y qué de eso todavía está decidiendo por vos.',
      q: '“¿Qué parte de tu historia seguís contando igual que hace diez años?”'
    },
    pensamientos: {
      t: 'Pensamientos',
      d: 'Las conversaciones internas que se repiten, las exigencias heredadas y las creencias que ya no te sirven. Ponerlas sobre la mesa es el primer paso para elegir otras.',
      q: '“¿Ese pensamiento es tuyo o lo venís repitiendo desde siempre?”'
    },
    emociones: {
      t: 'Emociones',
      d: 'Ninguna emoción está de más: todas informan algo. Trabajamos para reconocerlas, nombrarlas y darles un lugar, en vez de taparlas o dejar que manejen la escena.',
      q: '“¿Qué te está queriendo mostrar eso que sentís?”'
    },
    vinculos: {
      t: 'Vínculos',
      d: 'Con quién estás, cómo pedís, cómo ponés límites y qué lugar ocupás en tu familia, tu pareja y tu trabajo. Muchos cambios personales se juegan ahí.',
      q: '“¿Qué versión tuya aparece cuando estás con esa persona?”'
    },
    habitos: {
      t: 'Hábitos',
      d: 'Acá viven los microcambios. Acciones chicas, concretas y sostenibles que el cerebro pueda sostener en el tiempo, en lugar de propósitos gigantes que duran dos semanas.',
      q: '“¿Cuál es el paso más pequeño que sí podrías sostener?”'
    },
    cuerpo: {
      t: 'Cuerpo',
      d: 'Respiración, tensión, descanso, energía. El cuerpo avisa antes que la cabeza; cuando el proceso lo pide, sumamos aromaterapia, terapias manuales o reflexología.',
      q: '“¿Dónde se te aloja lo que no estás diciendo?”'
    },
    espiritu: {
      t: 'Espíritu',
      d: 'El sentido, la fe, el propósito, aquello que te sostiene cuando todo lo demás se mueve. En Microcosmos® la dimensión espiritual no queda afuera.',
      q: '“¿Para qué te levantás los días en que no tenés ganas?”'
    },
    mirada: {
      t: 'Tu mirada',
      d: 'La manera en que interpretás y vivís tu experiencia. Cambiar el observador que sos cambia lo que ves, y cambiar lo que ves cambia lo que podés hacer.',
      q: '“¿Y si eso mismo lo pudieras mirar de otra manera?”'
    }
  };

  var map = document.getElementById('orbitMap');
  var panel = document.getElementById('orbitPanel');

  if (map && panel) {
    var nodes = Array.prototype.slice.call(map.querySelectorAll('.node'));
    var elIdx = document.getElementById('orbitIdx');
    var elTitle = document.getElementById('orbitTitle');
    var elText = document.getElementById('orbitText');
    var elQ = document.getElementById('orbitQ');

    /* posicionar nodos sobre la órbita exterior */
    function place() {
      nodes.forEach(function (n) {
        var deg = parseFloat(n.dataset.deg) * Math.PI / 180;
        n.style.left = (50 + Math.cos(deg) * 38) + '%';
        n.style.top = (50 + Math.sin(deg) * 38) + '%';
      });
    }
    place();

    /* versión mobile: los mismos botones como chips arriba del panel */
    var chips = document.createElement('div');
    chips.className = 'orbit__chips';
    panel.parentNode.insertBefore(chips, panel);

    var mq = window.matchMedia('(max-width:480px)');
    function layout() {
      if (mq.matches) {
        nodes.forEach(function (n) { chips.appendChild(n); n.style.left = n.style.top = ''; });
      } else {
        nodes.forEach(function (n) { map.appendChild(n); });
        place();
      }
    }
    layout();
    (mq.addEventListener ? mq.addEventListener('change', layout) : mq.addListener(layout));

    function select(key, node) {
      var d = DIM[key];
      if (!d) return;
      nodes.forEach(function (n) { n.classList.toggle('on', n === node); });
      panel.classList.add('fade');
      setTimeout(function () {
        var i = Object.keys(DIM).indexOf(key) + 1;
        elIdx.textContent = ('0' + i).slice(-2) + ' / 08';
        elTitle.textContent = d.t;
        elText.textContent = d.d;
        elQ.textContent = d.q;
        panel.classList.remove('fade');
      }, 190);
    }

    nodes.forEach(function (n) {
      n.addEventListener('click', function () {
        auto = false;
        select(n.dataset.k, n);
      });
    });

    /* recorrido automático hasta la primera interacción */
    var auto = true, idx = 0;
    select('historia', nodes[0]);
    setInterval(function () {
      if (!auto) return;
      idx = (idx + 1) % nodes.length;
      select(nodes[idx].dataset.k, nodes[idx]);
    }, 5200);
  }

  /* ============================================================
     PAUSA — respiración guiada de 60"
     ============================================================ */
  var breath = document.getElementById('breath');
  var bBtn = document.getElementById('breathBtn');
  var bLabel = document.getElementById('breathLabel');
  var bTime = document.getElementById('breathTime');

  if (breath && bBtn) {
    var timer = null, phase = null, left = 60;

    function stop(msg) {
      clearInterval(timer); clearInterval(phase);
      timer = phase = null;
      breath.classList.remove('run');
      bBtn.textContent = 'Empezar la pausa';
      bLabel.textContent = msg || 'listo/a';
      bTime.textContent = '60"';
      left = 60;
    }

    function start() {
      breath.classList.add('run');
      bBtn.textContent = 'Cortar la pausa';
      var step = 0;
      bLabel.textContent = 'inhalá';
      phase = setInterval(function () {
        step = (step + 1) % 2;
        bLabel.textContent = step === 0 ? 'inhalá' : 'exhalá';
      }, 5000);
      timer = setInterval(function () {
        left--;
        bTime.textContent = left + '"';
        if (left <= 0) stop('un microcambio ✓');
      }, 1000);
    }

    bBtn.addEventListener('click', function () {
      if (timer) { stop(); } else { start(); }
    });
  }
})();
