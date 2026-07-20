/* ============================================================
   ARANDA JRA — script.js
   Modo full (Three.js embers ascendentes + Lenis) vs LITE. Decisión
   inicial en el <head> (.fx/.anim). Watchdog de FPS que degrada a
   LITE si el hardware no rinde.
   ============================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var FX = root.classList.contains('fx');
  var ANIM = root.classList.contains('anim');

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav ---- */
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
  var lenis = null, embers = null;

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
    document.querySelectorAll('.gas-grid,.serv-grid,.why-grid').forEach(function (grid) {
      var items = grid.querySelectorAll('[data-reveal="stagger"]');
      if (items.length) gsap.to(items, { opacity: 1, y: 0, duration: .65, ease: 'power2.out', stagger: .08, scrollTrigger: { trigger: grid, start: 'top 85%' } });
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

  /* ============ Three.js: embers (brasas) ascendentes sobre la llama ============ */
  if (FX && window.THREE) {
    try { embers = initEmbers(); } catch (e) { downgrade(); }
    if (embers) watchFPS();
  }

  function initEmbers() {
    var canvas = document.getElementById('embers');
    if (!canvas) return null;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
    camera.position.z = 480;

    var mobile = window.innerWidth < 768;
    var N = mobile ? 70 : 150;
    var SPX = 950, SPY = 640, SPZ = 460;
    var pos = new Float32Array(N * 3), phase = new Float32Array(N), rise = new Float32Array(N), amp = new Float32Array(N), sz = new Float32Array(N);
    function seed(i, randomY) {
      pos[i * 3] = (Math.random() - .5) * SPX;
      pos[i * 3 + 1] = randomY ? (Math.random() - .5) * SPY : -SPY / 2 - Math.random() * 80;
      pos[i * 3 + 2] = (Math.random() - .5) * SPZ;
      phase[i] = Math.random() * Math.PI * 2;
      rise[i] = .5 + Math.random() * 1.1;
      amp[i] = 10 + Math.random() * 26;
      sz[i] = mobile ? (6 + Math.random() * 8) : (8 + Math.random() * 12);
    }
    for (var i = 0; i < N; i++) seed(i, true);

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sz, 1));

    var tex = makeSprite();
    var mat = new THREE.PointsMaterial({ size: mobile ? 11 : 14, map: tex, color: 0xff7a1a, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    var pts = new THREE.Points(geo, mat); scene.add(pts);

    var tmx = 0, mx = 0;
    function onMove(e) { var t = e.touches ? e.touches[0] : e; tmx = (t.clientX / window.innerWidth - .5); }
    window.addEventListener('mousemove', onMove, { passive: true });

    function resize() { var h = window.innerHeight || document.documentElement.clientHeight, w = window.innerWidth; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', resize); resize();

    var raf = 0, running = true, t0 = performance.now();
    function frame() {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      var t = (performance.now() - t0) / 1000;
      var p = geo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        p[i * 3 + 1] += rise[i];
        p[i * 3] += Math.sin(t * .8 + phase[i]) * amp[i] * 0.013;
        if (p[i * 3 + 1] > SPY / 2 + 40) seed(i, false);
      }
      geo.attributes.position.needsUpdate = true;
      mx += (tmx - mx) * .04;
      pts.rotation.y = mx * .3;
      var sc = Math.min(window.scrollY || 0, 900);
      camera.position.z = 480 + sc * 0.12;
      mat.opacity = Math.max(0, .9 - sc / 800 * .9);
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
    grd.addColorStop(.3, 'rgba(255,200,120,.85)');
    grd.addColorStop(1, 'rgba(255,120,30,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  /* ============ watchdog de FPS ============ */
  function watchFPS() {
    var frames = 0, start = performance.now(), done = false;
    function tick() {
      if (done) return;
      frames++;
      var el = performance.now() - start;
      if (el >= 1500) { done = true; if (frames / (el / 1000) < 26) downgrade(); }
      else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function downgrade() {
    root.classList.remove('fx'); root.classList.remove('mode-full'); root.classList.add('mode-lite');
    FX = false;
    if (embers) { try { embers.destroy(); } catch (e) {} embers = null; }
    if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; }
    if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) {} }
  }
})();
