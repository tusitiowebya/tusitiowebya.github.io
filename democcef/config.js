/* CCEF — configuración única del sitio.
   Cambiar SLUG por el slug real de CobrOS cuando el negocio tenga cuenta.
   Mientras SLUG esté vacío, la tienda corre con el catálogo de muestra
   (CATALOGO_DEMO) y avisa que todavía no está conectada. */
window.CCEF_CONFIG = {
  // ── CobrOS ────────────────────────────────────────────────────────────────
  SLUG: "",                       // ej. "ccef" — se lo da el alta en CobrOS
  API: "https://vps-5905394-x.dattaweb.com/cobros/api/cobros-publico",
  TIMEOUT: 8000,

  // ── Datos de contacto (reales del cliente) ────────────────────────────────
  WA: "5491158377120",
  WA_VISIBLE: "15 5837-7120",
  EMAIL: "creciendoconelfutbol@hotmail.com",
  IG: "https://instagram.com/ccef_argentina",
  YT: "https://youtube.com/@ccef_argentina",
  FB: "https://facebook.com/creciendoconelfutbol",
  TW: "https://twitter.com/creciconfutbol",
  RADIO: "Radio IRED · martes 21 hs",

  // ── Catálogo de muestra (se reemplaza solo cuando SLUG apunta a CobrOS) ────
  // Espeja el modelo de Producto de CobrOS: todos son tipo "digital".
  CATALOGO_DEMO: [
    { _id:"d1", nombre:"Planificación anual de Fútbol Base", categoria:"Entrenadores",
      descripcion:"Macrociclo completo por categoría (2007 a 2018) · Objetivos por trimestre · 40 páginas",
      precio:18900, formato:"PDF", peso:"12 MB", modos:["archivo"] },
    { _id:"d2", nombre:"120 ejercicios por categoría", categoria:"Entrenadores",
      descripcion:"Fichas con gráfico, variantes y consignas · Video explicativo de 12 ejercicios clave",
      precio:24500, formato:"PDF + video", peso:"340 MB", modos:["archivo","link"] },
    { _id:"d3", nombre:"Curso Entrenador de Fútbol Base — Módulo 1", categoria:"Cursos",
      descripcion:"6 clases grabadas + apuntes + evaluación · Acceso al aula por 12 meses",
      precio:32000, formato:"Video + PDF", peso:"Acceso online", modos:["link","credencial"] },
    { _id:"d4", nombre:"Manual del Directivo de club", categoria:"Directivos",
      descripcion:"Estructura, roles, protocolo institucional y gestión del club formativo",
      precio:15000, formato:"PDF", peso:"8 MB", modos:["archivo"] },
    { _id:"d5", nombre:"Guía de Educación Deportiva y Cívica", categoria:"Jugadores y familias",
      descripcion:"Antes que deportistas somos personas: 10 valores para trabajar en el vestuario",
      precio:0, formato:"PDF", peso:"4 MB", modos:["archivo"] },
    { _id:"d6", nombre:"Plantillas de sesión editables", categoria:"Entrenadores",
      descripcion:"Planilla de sesión, control de asistencia y evaluación individual · Editables",
      precio:9900, formato:"XLSX + DOCX", peso:"2 MB", modos:["archivo"] },
    { _id:"d7", nombre:"Charla: la comunicación con el jugador", categoria:"Cursos",
      descripcion:"90 minutos de charla teórica grabada + guía de aplicación en el campo",
      precio:12500, formato:"Video", peso:"Acceso online", modos:["link"] },
    { _id:"d8", nombre:"Protocolo para organizar un evento deportivo", categoria:"Directivos",
      descripcion:"Checklist, cronograma, seguros, arbitraje y comunicación · De 8 a 64 equipos",
      precio:16800, formato:"PDF + XLSX", peso:"6 MB", modos:["archivo"] },
  ],
}
