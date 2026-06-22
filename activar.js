/* ============================================================
   TuPaginaYa · Modal de activación (demo en espera de pago)
   La página real se sigue viendo. El modal no se puede cerrar:
   solo se minimiza a una píldora flotante para recorrer la demo,
   y siempre vuelve. Inyectar con UNA línea antes de </body>:
     <script src="/activar.js" data-ref="demoNOMBRE"></script>
   (el ref también se puede setear con window.__TPY_REF__)
   ============================================================ */
(function () {
  "use strict";
  if (window.__TPY_ACTIVAR__) return;            // evitar doble carga
  window.__TPY_ACTIVAR__ = true;

  var thisScript = document.currentScript;
  var WA = "5491126966153";                       // WhatsApp TuPaginaYa

  // ---- ref de la demo (data-ref > global > carpeta de la URL > dominio) ----
  function getRef() {
    var r = (thisScript && thisScript.getAttribute("data-ref")) || window.__TPY_REF__ || "";
    if (!r) {
      var seg = location.pathname.split("/").filter(Boolean);
      r = seg[0] || location.hostname.replace(/^www\./, "");
    }
    return r;
  }
  var REF = getRef();
  var waHref = "https://wa.me/" + WA +
    "?text=" + encodeURIComponent("¡Hola TuPaginaYa! Quiero activar mi página web. (Ref: " + REF + ")");

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- estilos ----
  var css = '\
  .tpy-root{position:fixed;inset:0;z-index:2147483600;font-family:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif}\
  .tpy-root *{box-sizing:border-box;margin:0}\
  .tpy-back{position:fixed;inset:0;background:rgba(8,8,24,.62);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .4s ease}\
  .tpy-root.open .tpy-back{opacity:1}\
  .tpy-root:not(.open) .tpy-back{pointer-events:none}\
  .tpy-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-46%);width:min(92vw,460px);\
    background:linear-gradient(180deg,#16163f,#0f0f2e);color:#eef0fb;border:1px solid rgba(123,47,247,.4);\
    border-radius:22px;padding:38px 32px 30px;text-align:center;\
    box-shadow:0 40px 110px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.04) inset;\
    opacity:0;visibility:hidden;transition:opacity .45s ease,transform .55s cubic-bezier(.23,1,.32,1),visibility .45s}\
  .tpy-root.open .tpy-modal{opacity:1;visibility:visible;transform:translate(-50%,-50%)}\
  .tpy-brand{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:16px;letter-spacing:-.01em;margin-bottom:22px}\
  .tpy-brand .d{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#7b2ff7,#4a6cf7);display:grid;place-items:center;color:#fff;font-size:14px}\
  .tpy-brand b{color:#fff}.tpy-brand i{color:#7aa2ff;font-style:normal}\
  .tpy-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.04em;\
    color:#dbe0ff;background:rgba(123,47,247,.16);border:1px solid rgba(123,47,247,.4);padding:7px 15px;border-radius:50px;margin-bottom:18px}\
  .tpy-badge .p{width:8px;height:8px;border-radius:50%;background:#7b2ff7;box-shadow:0 0 0 0 rgba(123,47,247,.6);animation:tpyp 2s infinite}\
  @keyframes tpyp{70%{box-shadow:0 0 0 8px rgba(123,47,247,0)}100%{box-shadow:0 0 0 0 rgba(123,47,247,0)}}\
  .tpy-modal h2{font-family:"Sora","Inter",sans-serif;font-weight:800;font-size:clamp(22px,4.6vw,28px);line-height:1.15;letter-spacing:-.02em;margin-bottom:12px}\
  .tpy-modal h2 .g{background:linear-gradient(100deg,#7b2ff7,#4a6cf7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}\
  .tpy-modal p{color:#a6abcf;font-size:15px;line-height:1.6;max-width:40ch;margin:0 auto 24px}\
  .tpy-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;width:100%;\
    padding:15px 22px;border-radius:13px;background:#25d366;color:#04210f;font-family:"Sora","Inter",sans-serif;font-weight:700;font-size:16px;\
    text-decoration:none;transition:transform .18s,box-shadow .25s;box-shadow:0 16px 36px -12px rgba(37,211,102,.6)}\
  .tpy-cta:hover{transform:translateY(-2px);box-shadow:0 22px 46px -14px rgba(37,211,102,.72)}\
  .tpy-cta svg{width:21px;height:21px}\
  .tpy-steps{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:24px 0 6px}\
  .tpy-steps div{display:flex;align-items:center;gap:7px;color:#9aa0c8;font-size:12.5px}\
  .tpy-steps b{color:#7aa2ff}\
  .tpy-see{display:inline-block;margin-top:20px;color:#aeb6ff;font-size:13.5px;font-weight:600;text-decoration:none;cursor:pointer;border:0;background:none;font-family:inherit}\
  .tpy-see:hover{color:#fff}\
  .tpy-foot{margin-top:18px;font-size:11.5px;color:#7e84ad}\
  /* píldora minimizada */\
  .tpy-pill{position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(120%);\
    display:flex;align-items:center;gap:12px;background:rgba(15,15,46,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);\
    color:#eef0fb;border:1px solid rgba(123,47,247,.45);border-radius:50px;padding:9px 9px 9px 18px;\
    box-shadow:0 20px 50px -16px rgba(0,0,0,.7);opacity:0;transition:transform .5s cubic-bezier(.23,1,.32,1),opacity .4s;cursor:pointer;max-width:calc(100vw - 24px)}\
  .tpy-root:not(.open) .tpy-pill{transform:translateX(-50%) translateY(0);opacity:1}\
  .tpy-pill .dot{width:9px;height:9px;border-radius:50%;background:#7b2ff7;flex:0 0 auto;box-shadow:0 0 0 0 rgba(123,47,247,.6);animation:tpyp 2s infinite}\
  .tpy-pill .lbl{font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
  .tpy-pill .lbl span{color:#aeb6ff}\
  .tpy-pill .go{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;background:#25d366;color:#04210f;\
    font-weight:700;font-size:13px;padding:9px 16px;border-radius:50px;text-decoration:none}\
  .tpy-pill .go svg{width:15px;height:15px}\
  @media (max-width:480px){.tpy-pill .lbl{display:none}.tpy-modal{padding:32px 22px 26px}.tpy-steps{gap:14px}}\
  @media (prefers-reduced-motion:reduce){.tpy-root *{transition:none!important;animation:none!important}}\
  ';

  var wa = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.36.66 4.66 1.92 6.66L4 29l7.5-1.96a12.05 12.05 0 0 0 4.54.88h.01c6.65 0 12.05-5.4 12.05-12.04C28.1 8.4 22.69 3 16.04 3zm0 21.86h-.01c-1.46 0-2.9-.39-4.16-1.13l-.3-.18-4.45 1.17 1.19-4.33-.2-.31a9.92 9.92 0 0 1-1.52-5.29c0-5.49 4.47-9.96 9.96-9.96 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 0 1 2.93 7.05c0 5.49-4.47 9.96-9.97 9.96z"/></svg>';

  var html = '\
  <div class="tpy-back" data-min="1"></div>\
  <div class="tpy-modal" role="dialog" aria-modal="true" aria-label="Activá tu página">\
    <span class="tpy-brand"><span class="d">✦</span><span><b>TuPagina</b><i>Ya</i></span></span>\
    <div><span class="tpy-badge"><span class="p"></span>Página en modo demo</span></div>\
    <h2>Tu página está lista,<br><span class="g">falta solo activarla.</span></h2>\
    <p>Esto es una demo real diseñada para vos. Activala y ponela online hoy mismo para que tus clientes te encuentren.</p>\
    <a class="tpy-cta" href="' + waHref + '" target="_blank" rel="noopener">' + wa + ' Activar mi página</a>\
    <div class="tpy-steps"><div><b>1.</b> Escribinos</div><div><b>2.</b> Confirmás</div><div><b>3.</b> Online en el día</div></div>\
    <button class="tpy-see" data-min="1" type="button">Ver la página primero →</button>\
    <div class="tpy-foot">Diseñado por TuPaginaYa · Ref: ' + REF + '</div>\
  </div>\
  <div class="tpy-pill" data-open="1" role="button" tabindex="0" aria-label="Volver a ver la activación">\
    <span class="dot"></span>\
    <span class="lbl">Estás viendo una <span>demo</span> · activala</span>\
    <a class="go" href="' + waHref + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">' + wa + ' Activar</a>\
  </div>';

  var root, styleEl;

  function build() {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-tpy", "1");
    styleEl.textContent = css;

    root = document.createElement("div");
    root.className = "tpy-root open";
    root.setAttribute("data-tpy-root", "1");
    root.innerHTML = html;

    (document.head || document.documentElement).appendChild(styleEl);
    document.body.appendChild(root);

    lock(true);

    // minimizar (ver la página)
    root.querySelectorAll("[data-min]").forEach(function (el) {
      el.addEventListener("click", minimize);
    });
    // re-abrir desde la píldora
    var pill = root.querySelector(".tpy-pill");
    pill.addEventListener("click", open);
    pill.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  }

  function lock(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    document.body.style.overflow = on ? "hidden" : "";
  }
  function minimize() { root.classList.remove("open"); lock(false); }
  function open() { root.classList.add("open"); lock(true); }

  // ---- imbloqueable: si lo borran del DOM, se reinyecta ----
  var guard = new MutationObserver(function () {
    if (!document.body) return;
    if (!document.body.contains(root)) {
      var wasOpen = root.classList.contains("open");
      document.body.appendChild(root);
      if (wasOpen) lock(true);
    }
    if (!document.documentElement.contains(styleEl)) {
      (document.head || document.documentElement).appendChild(styleEl);
    }
  });

  function init() {
    build();
    guard.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
