/* JJREDES — arranque: marca que hay JS antes de pintar (para las entradas animadas).
   ?qa = capturas sin animaciones */
document.documentElement.classList.add('js');
if (/[?&]qa\b/.test(location.search)) document.documentElement.classList.add('qa', 'is-ready');
