/* ============================================================
   SITRAF — app.js
   Modo full (3D + Lenis + glass) vs LITE. Decisión inicial en el
   <head> (clases .fx/.anim). Acá se inicializa y hay watchdog de FPS
   que degrada a LITE en caliente si el hardware no rinde.
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

  /* ---- marquee de sectores: duplicar para loop continuo ---- */
  var track = document.getElementById('secTrack');
  if (track) track.innerHTML = track.innerHTML + track.innerHTML;

  /* ============ GSAP reveals (full y lite; no en reduced-motion) ============ */
  var lenis = null, net = null;

  if (ANIM && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    setupReveals();
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  function setupReveals() {
    gsap.utils.toArray('[data-reveal="up"]').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });
    document.querySelectorAll('.pil-grid').forEach(function (grid) {
      gsap.to(grid.querySelectorAll('[data-reveal="pil"]'), { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'back.out(1.4)', stagger: .09, scrollTrigger: { trigger: grid, start: 'top 84%' } });
    });
    document.querySelectorAll('.mvv-grid').forEach(function (grid) {
      gsap.to(grid.querySelectorAll('[data-reveal="tilt"]'), { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: grid, start: 'top 82%' } });
    });
    ['.of-grid', '.sec-list', '.not-grid', '.afi-benes'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (c) {
        var items = c.querySelectorAll('[data-reveal="stagger"]');
        if (items.length) gsap.to(items, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', stagger: .06, scrollTrigger: { trigger: c, start: 'top 85%' } });
      });
    });
    gsap.utils.toArray('[data-reveal="bar"]').forEach(function (row) {
      var fill = row.querySelector('.esc-fill');
      var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%' } });
      tl.to(row, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' });
      if (fill) tl.to(fill, { scaleX: 1, duration: 1.05, ease: 'power3.out' }, '-=.2');
    });
    gsap.utils.toArray('[data-reveal="lines"]').forEach(function (el) {
      gsap.to(el, { opacity: 1, duration: 1.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  /* ============ Lenis (solo full, no touch) ============ */
  if (FX && window.Lenis && !window.matchMedia('(pointer:coarse)').matches) {
    try {
      lenis = new Lenis({ lerp: .1, smoothWheel: true, wheelMultiplier: 1 });
      lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      // anchors → scroll suave con Lenis
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href'); if (id.length < 2) return;
          var t = document.querySelector(id); if (!t) return;
          e.preventDefault(); lenis.scrollTo(t, { offset: -70 });
        });
      });
    } catch (e) { lenis = null; }
  }

  /* ============ Three.js: red de nodos (circuito financiero) ============ */
  if (FX && window.THREE) {
    try { net = initNet(); } catch (e) { downgrade(); }
    if (net) watchFPS();
  }

  function initNet() {
    var canvas = document.getElementById('net');
    if (!canvas) return null;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: window.devicePixelRatio < 2 });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 1, 3000);
    camera.position.z = 560;
    var group = new THREE.Group(); scene.add(group);

    var mobile = window.innerWidth < 768;
    var N = mobile ? 44 : 92;
    var SPX = 620, SPY = 460, SPZ = 320;
    var pos = new Float32Array(N * 3), vel = [];
    for (var i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * SPX;
      pos[i * 3 + 1] = (Math.random() - .5) * SPY;
      pos[i * 3 + 2] = (Math.random() - .5) * SPZ;
      vel.push([(Math.random() - .5) * .16, (Math.random() - .5) * .16, (Math.random() - .5) * .16]);
    }
    var pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var pmat = new THREE.PointsMaterial({ size: mobile ? 4.5 : 5.5, color: 0xf5a623, transparent: true, opacity: .92, sizeAttenuation: true });
    var points = new THREE.Points(pgeo, pmat); group.add(points);

    var maxSeg = N * 7;
    var lpos = new Float32Array(maxSeg * 2 * 3);
    var lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
    var lmat = new THREE.LineBasicMaterial({ color: 0x2196f3, transparent: true, opacity: .2 });
    var lines = new THREE.LineSegments(lgeo, lmat); group.add(lines);

    var DIST = mobile ? 130 : 150, DIST2 = DIST * DIST;
    var tmx = 0, tmy = 0, mx = 0, my = 0;
    function onMove(e) { var t = e.touches ? e.touches[0] : e; tmx = (t.clientX / window.innerWidth - .5); tmy = (t.clientY / window.innerHeight - .5); }
    window.addEventListener('mousemove', onMove, { passive: true });

    function resize() { var w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', resize); resize();

    var raf = 0, running = true;
    function frame() {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      var p = pgeo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        p[i * 3] += vel[i][0]; p[i * 3 + 1] += vel[i][1]; p[i * 3 + 2] += vel[i][2];
        if (p[i * 3] > SPX / 2 || p[i * 3] < -SPX / 2) vel[i][0] *= -1;
        if (p[i * 3 + 1] > SPY / 2 || p[i * 3 + 1] < -SPY / 2) vel[i][1] *= -1;
        if (p[i * 3 + 2] > SPZ / 2 || p[i * 3 + 2] < -SPZ / 2) vel[i][2] *= -1;
      }
      pgeo.attributes.position.needsUpdate = true;

      var v = 0, cap = maxSeg * 2;
      for (var a = 0; a < N && v < cap; a++) {
        for (var b = a + 1; b < N && v < cap; b++) {
          var dx = p[a * 3] - p[b * 3], dy = p[a * 3 + 1] - p[b * 3 + 1], dz = p[a * 3 + 2] - p[b * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < DIST2) {
            lpos[v * 3] = p[a * 3]; lpos[v * 3 + 1] = p[a * 3 + 1]; lpos[v * 3 + 2] = p[a * 3 + 2]; v++;
            lpos[v * 3] = p[b * 3]; lpos[v * 3 + 1] = p[b * 3 + 1]; lpos[v * 3 + 2] = p[b * 3 + 2]; v++;
          }
        }
      }
      lgeo.setDrawRange(0, v); lgeo.attributes.position.needsUpdate = true;

      mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      group.rotation.y = mx * .5 + performance.now() * 0.00003;
      group.rotation.x = my * .3;
      var sc = Math.min(window.scrollY || 0, 1000);
      group.position.y = sc * 0.16; camera.position.z = 560 + sc * 0.14;
      renderer.render(scene, camera);
    }
    frame();

    return {
      destroy: function () {
        running = false; cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize);
        try { pgeo.dispose(); pmat.dispose(); lgeo.dispose(); lmat.dispose(); renderer.dispose(); } catch (e) {}
        try { var gl = renderer.getContext(); var lc = gl && gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); } catch (e) {}
        if (canvas) canvas.style.display = 'none';
      }
    };
  }

  /* ============ watchdog de FPS: si rinde mal, degradar a LITE ============ */
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
    if (net) { try { net.destroy(); } catch (e) {} net = null; }
    if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; }
    if (window.ScrollTrigger) { try { ScrollTrigger.refresh(); } catch (e) {} }
  }
})();
