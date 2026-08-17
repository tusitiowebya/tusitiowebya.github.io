/* ===========================================================
   IITI — Instituto Internacional de Terapias Integrales
   =========================================================== */

const WA = "5492216258553";

/* ---------- Año del footer ---------- */
document.getElementById("anio").textContent = new Date().getFullYear();

/* ---------- Nav: fondo al scrollear + menú mobile ---------- */
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");

const pintarNav = () => nav.classList.toggle("nav--fija", window.scrollY > 40);
pintarNav();
window.addEventListener("scroll", pintarNav, { passive: true });

burger.addEventListener("click", () => {
  const abierto = nav.classList.toggle("nav--abierto");
  burger.setAttribute("aria-expanded", String(abierto));
});
nav.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("nav--abierto");
    burger.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Espiral: generador de path (Arquímedes) ---------- */
function pathEspiral(cx, cy, r0, b, desde, hasta, paso = 0.06) {
  let d = "";
  for (let t = desde; t <= hasta; t += paso) {
    const r = r0 + b * t;
    const x = (cx + r * Math.cos(t)).toFixed(2);
    const y = (cy + r * Math.sin(t)).toFixed(2);
    d += (d ? " L" : "M") + x + " " + y;
  }
  return d;
}

/* Glifo chico del hero (guiño a la espiral del logo) */
const glifo = document.getElementById("espiralGlifo");
if (glifo) glifo.setAttribute("d", pathEspiral(60, 60, 3, 5.1, 0, 10.2));

/* ---------- SIGNATURE: el camino del terapeuta ---------- */
const ETAPAS = [
  {
    titulo: "Clase abierta",
    texto:
      "Antes de pagar nada venís a una clase de muestra: conocés al docente, ves el aula y las camillas, y preguntás todo lo que quieras. Si no es para vos, no pasa nada.",
    lista: [
      "Sin costo y sin compromiso de inscripción",
      "Charla de orientación: qué terapia te conviene",
      "También se hace por videollamada si estás lejos",
    ],
    duracion: "1 encuentro",
  },
  {
    titulo: "Fundamentos",
    texto:
      "El primer bloque nivela al grupo entero. Anatomía y fisiología en criollo, historia de la terapia que elegiste, marco ético y qué se puede y qué no se puede hacer con un consultante.",
    lista: [
      "Anatomía y fisiología aplicada",
      "Encuadre ético y límites del rol de terapeuta",
      "Apuntes digitales y bibliografía",
    ],
    duracion: "Primeras 4 semanas",
  },
  {
    titulo: "Manos a la obra",
    texto:
      "Acá empieza la práctica en serio: técnica sobre camilla, entre compañeros, con el docente corrigiendo postura, presión y ritmo. Es la etapa más larga y la más importante.",
    lista: [
      "Práctica supervisada en cada clase",
      "Corrección individual de técnica y postura",
      "Registro de tus prácticas en bitácora",
    ],
    duracion: "El corazón de la cursada",
  },
  {
    titulo: "Sesión completa",
    texto:
      "Ya sabés la técnica; ahora aprendés a sostener una sesión de punta a punta: cómo recibir, qué preguntar en la entrevista, cómo armar el plan y cómo cerrar sin dejar al consultante en el aire.",
    lista: [
      "Entrevista inicial y ficha del consultante",
      "Armado del plan de sesiones",
      "Contraindicaciones y derivación al médico",
    ],
    duracion: "Últimas semanas del nivel",
  },
  {
    titulo: "Evaluación y certificado",
    texto:
      "Se evalúa con una sesión real frente al docente, no con un multiple choice. Al aprobar recibís el certificado del instituto con contenidos, carga horaria y firma.",
    lista: [
      "Evaluación práctica de sesión completa",
      "Certificado con contenidos y carga horaria",
      "Habilitación para el nivel siguiente",
    ],
    duracion: "Cierre de cada nivel",
  },
  {
    titulo: "Tus primeros pacientes",
    texto:
      "No te soltamos ahí. Te acompañamos a definir honorarios, armar tu espacio y comunicar lo que hacés, y quedás dentro de la comunidad de egresados con supervisiones abiertas.",
    lista: [
      "Cómo poner precio y presentarte",
      "Supervisión de casos con docentes",
      "Red de egresados y reemplazos de consultorio",
    ],
    duracion: "Después de recibirte",
  },
];

const svgEsp = document.getElementById("espiralSVG");
if (svgEsp) {
  const NS = "http://www.w3.org/2000/svg";
  const cx = 230, cy = 230;

  document
    .getElementById("espiralPath")
    .setAttribute("d", pathEspiral(cx, cy, 12, 15.8, 1.1, 13.4, 0.05));

  // los nodos van de afuera (etapa 01) hacia el centro (etapa 06)
  const angulos = [13.1, 10.9, 8.8, 6.8, 4.9, 3.1];
  const grupo = document.getElementById("espiralNodos");
  const nodos = [];

  angulos.forEach((t, i) => {
    const r = 12 + 15.8 * t;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "nodo");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", "Etapa " + (i + 1) + ": " + ETAPAS[i].titulo);

    const halo = document.createElementNS(NS, "circle");
    halo.setAttribute("class", "halo");
    halo.setAttribute("cx", x); halo.setAttribute("cy", y); halo.setAttribute("r", 26);

    const punto = document.createElementNS(NS, "circle");
    punto.setAttribute("class", "punto");
    punto.setAttribute("cx", x); punto.setAttribute("cy", y); punto.setAttribute("r", 17);

    const txt = document.createElementNS(NS, "text");
    txt.setAttribute("x", x); txt.setAttribute("y", y);
    txt.textContent = "0" + (i + 1);

    g.append(halo, punto, txt);
    grupo.appendChild(g);
    nodos.push(g);

    const activar = () => mostrarEtapa(i);
    g.addEventListener("click", activar);
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activar(); }
    });
  });

  const elPaso = document.getElementById("etapaPaso");
  const elTitulo = document.getElementById("etapaTitulo");
  const elTexto = document.getElementById("etapaTexto");
  const elLista = document.getElementById("etapaLista");
  const elDur = document.getElementById("etapaDuracion");
  const elWa = document.getElementById("etapaWa");

  function mostrarEtapa(i) {
    const e = ETAPAS[i];
    nodos.forEach((n, j) => n.classList.toggle("activo", j === i));
    elPaso.textContent = "Etapa 0" + (i + 1);
    elTitulo.textContent = e.titulo;
    elTexto.textContent = e.texto;
    elLista.innerHTML = e.lista.map((li) => "<li>" + li + "</li>").join("");
    elDur.textContent = e.duracion;
    elWa.href =
      "https://wa.me/" + WA + "?text=" +
      encodeURIComponent("Hola! Tengo una duda sobre la etapa \"" + e.titulo + "\" de la formación.");
  }

  mostrarEtapa(0);

  // dibujado de la espiral al entrar en viewport
  const cont = document.querySelector(".espiral");
  new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        cont.classList.add("espiral--dibujada");
        obs.disconnect();
      });
    },
    { threshold: 0.3 }
  ).observe(cont);
}

/* ---------- Reveal escalonado por sección ---------- */
const revelables = [
  ".hero__texto > *",
  ".pilar",
  ".sec-head",
  ".curso",
  ".cursos__nota",
  ".espiral",
  ".etapa",
  ".modo",
  ".instituto__texto",
  ".instituto__sello",
  ".voz",
  ".faq__head",
  ".faq__lista",
  ".cierre__in > *",
];

const obs = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("vis");
      obs.unobserve(en.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

revelables.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("rv");
    el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
    obs.observe(el);
  });
});

/* ---------- FAQ: se abre una a la vez ---------- */
const faqs = document.querySelectorAll("#faq details");
faqs.forEach((d) =>
  d.addEventListener("toggle", () => {
    if (!d.open) return;
    faqs.forEach((otra) => { if (otra !== d) otra.open = false; });
  })
);
