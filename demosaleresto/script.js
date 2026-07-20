/* ============================================================
   SALE RESTO — script.js
   Modo full (Three.js polvo dorado + Lenis) vs LITE. La decisión
   inicial se toma en el <head> (clases .fx/.anim). Acá se inicializa
   y hay watchdog de FPS que degrada a LITE si el hardware no rinde.
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var FX = root.classList.contains('fx');
  var ANIM = root.classList.contains('anim');

  /* ---- año ---- */
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav: scrolled + burger ---- */
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', (window.scrollY || 0) > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = document.getElementById('burger'), nm = document.getElementById('navMobile');
  if (burger && nm) {
    burger.addEventListener('click', function () {
      var o = nm.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    nm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nm.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ============ GSAP reveals ============ */
  var lenis = null, dust = null;

  if (ANIM && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    setupReveals();
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  function setupReveals() {
    gsap.utils.toArray('[data-reveal="up"]').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    document.querySelectorAll('.notas-grid,.vino-grid,.resto-grid').forEach(function (grid) {
      var items = grid.querySelectorAll('[data-reveal="stagger"]');
      if (items.length) gsap.to(items, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .1, scrollTrigger: { trigger: grid, start: 'top 84%' } });
    });
  }

  /* ============ Lenis (solo full, no touch) ============ */
  if (FX && window.Lenis && !window.matchMedia('(pointer:coarse)').matches) {
    try {
      lenis = new Lenis({ lerp: .1, smoothWheel: true, wheelMultiplier: 1 });
      lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href'); if (id.length < 2) return;
          var t = document.querySelector(id); if (!t) return;
          e.preventDefault(); lenis.scrollTo(t, { offset: -70 });
        });
      });
    } catch (e) { lenis = null; }
  }

  /* ============ Three.js: polvo dorado flotando sobre el vino ============ */
  if (FX && window.THREE) {
    try { dust = initDust(); } catch (e) { downgrade(); }
    if (dust) watchFPS();
  }

  function initDust() {
    var canvas = document.getElementById('dust');
    if (!canvas) return null;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
    camera.position.z = 480;

    var mobile = window.innerWidth < 768;
    var N = mobile ? 90 : 180;
    var SPX = 900, SPY = 620, SPZ = 500;
    var pos = new Float32Array(N * 3), phase = new Float32Array(N), spd = new Float32Array(N), amp = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * SPX;
      pos[i * 3 + 1] = (Math.random() - .5) * SPY;
      pos[i * 3 + 2] = (Math.random() - .5) * SPZ;
      phase[i] = Math.random() * Math.PI * 2;
      spd[i] = .15 + Math.random() * .35;   // deriva vertical
      amp[i] = 8 + Math.random() * 22;      // vaivén lateral
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    // textura circular suave (mota de polvo) generada en canvas
    var tex = makeSprite();
    var mat = new THREE.PointsMaterial({
      size: mobile ? 10 : 13, map: tex, color: 0xe0b95c,
      transparent: true, opacity: .85, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    var pts = new THREE.Points(geo, mat); scene.add(pts);

    var tmx = 0, mx = 0;
    function onMove(e) { var t = e.touches ? e.touches[0] : e; tmx = (t.clientX / window.innerWidth - .5); }
    window.addEventListener('mousemove', onMove, { passive: true });

    function resize() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      var w = window.innerWidth;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    var raf = 0, running = true, t0 = performance.now();
    function frame() {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      var t = (performance.now() - t0) / 1000;
      var p = geo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        // deriva hacia arriba + reciclado, con vaivén lateral tipo mota en el aire
        p[i * 3 + 1] += spd[i];
        if (p[i * 3 + 1] > SPY / 2) p[i * 3 + 1] = -SPY / 2;
        p[i * 3] += Math.sin(t * .4 + phase[i]) * amp[i] * 0.012;
      }
      geo.attributes.position.needsUpdate = true;
      mx += (tmx - mx) * .04;
      pts.rotation.y = mx * .35 + t * 0.02;
      var sc = Math.min(window.scrollY || 0, 900);
      camera.position.z = 480 + sc * 0.12;
      mat.opacity = Math.max(0, .85 - sc / 900 * .85); // se desvanece al bajar
      renderer.render(scene, camera);
    }
    frame();

    return {
      destroy: function () {
        running = false; cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize);
        try { geo.dispose(); mat.dispose(); tex.dispose(); renderer.dispose(); } catch (e) {}
        try { var gl = renderer.getContext(); var lc = gl && gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); } catch (e) {}
        if (canvas) canvas.style.display = 'none';
      }
    };
  }

  function makeSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(.3, 'rgba(255,240,200,.8)');
    grd.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  /* ============ watchdog de FPS ============ */
  function watchFPS() {
    var frames = 0, start = performance.now(), done = false;
    function tick() {
      if (done) return;
      frames++;
      var el = performance.now() - start;
      if (el >= 1500) {
        done = true;
        var fps = frames / (el / 1000);
        if (fps < 26) downgrade();
      } else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function downgrade() {
    root.classList.remove('fx'); root.classList.remove('mode-full'); root.classList.add('mode-lite');
    FX = false;
    if (dust) { try { dust.destroy(); } catch (e) {} dust = null; }
    if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; }
    if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) {} }
  }
})();
