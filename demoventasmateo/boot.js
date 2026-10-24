/* Antes del primer render: modo liviano y modo QA.
   .lite → sin video del hero (queda el póster), sin persiana animada ni marquee.
   .qa   → reveals visibles y hero de alto fijo, para capturas de página completa. */
(function () {
  var h = document.documentElement, q = location.search, lite = false;
  h.classList.add("js");
  try {
    var mem = navigator.deviceMemory, cores = navigator.hardwareConcurrency;
    var conn = navigator.connection || {};
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) lite = true;
    if ((mem && mem <= 2) || (cores && cores <= 2)) lite = true;
    if (conn.saveData || /2g/.test(conn.effectiveType || "")) lite = true;
    if (sessionStorage.getItem("vm-lite") === "1") lite = true;
  } catch (e) {}
  if (/[?&]lite\b/.test(q)) lite = true;
  if (/[?&]full\b/.test(q)) lite = false;
  if (lite) h.classList.add("lite");
  if (/[?&]qa\b/.test(q) || /HeadlessChrome/.test(navigator.userAgent)) h.classList.add("qa");
})();
