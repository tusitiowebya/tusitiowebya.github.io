/* Fondo del hero: "el escudo de la cartera".
   El escudo partido de SegurOS recibe pólizas desde las 11 compañías conectadas;
   cada ciclo de sincronización emite un pulso y las pólizas de adentro quedan vigentes.
   API: const bg = ASHeroBG(canvas, {og}) → bg.start() · bg.stop() · bg.still() */
(function () {
  "use strict";

  var CIAS = ["ATM", "Sancor", "La Equidad", "El Norte", "BBVA", "Rivadavia", "Mercantil", "Zurich", "RUS", "San Cristóbal", "Equitativa"];
  var PULSE = 6; // segundos entre sincronizaciones visuales

  function shieldPath(c, x, y, w, h) {
    c.beginPath();
    c.moveTo(x + w * 0.5, y);
    c.lineTo(x + w, y + h * 0.14);
    c.lineTo(x + w, y + h * 0.5);
    c.bezierCurveTo(x + w, y + h * 0.78, x + w * 0.8, y + h * 0.92, x + w * 0.5, y + h);
    c.bezierCurveTo(x + w * 0.2, y + h * 0.92, x, y + h * 0.78, x, y + h * 0.5);
    c.lineTo(x, y + h * 0.14);
    c.closePath();
  }

  window.ASHeroBG = function (canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d");
    if (!ctx) return { start: function () {}, stop: function () {}, still: function () {} };

    var dpr = Math.min(window.devicePixelRatio || 1, opts.og ? 1 : 1.5);
    var layer = document.createElement("canvas"), lc = layer.getContext("2d");
    var W = 1, H = 1, S = {}, streams = [], parts = [], dots = [], mobile = false;
    var raf = 0, running = false, t0 = performance.now(), last = 0;
    var mx = 0, my = 0, px = 0, py = 0;

    // punto del borde visible en la dirección a; arriba se deja lugar para el menú fijo
    function edgePoint(a, m, top) {
      var dx = Math.cos(a), dy = Math.sin(a), t = 1e9;
      if (dx > 0.001) t = Math.min(t, (W - m - S.cx) / dx);
      if (dx < -0.001) t = Math.min(t, (m - S.cx) / dx);
      if (dy > 0.001) t = Math.min(t, (H - m - S.cy) / dy);
      if (dy < -0.001) t = Math.min(t, (top - S.cy) / dy);
      return [S.cx + dx * t, S.cy + dy * t];
    }

    function layout() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width || canvas.width); H = Math.max(1, r.height || canvas.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      layer.width = canvas.width; layer.height = canvas.height;
      mobile = W < 900 && !opts.og;

      var sh = opts.og ? H * 0.78 : mobile ? Math.min(H * 0.46, W * 0.95) : Math.min(H * 0.8, W * 0.44);
      var sw = sh * 0.86;
      var cx = opts.og ? W * 0.8 : mobile ? W * 0.5 : W * 0.71;
      var cy = opts.og ? H * 0.5 : mobile ? H * 0.28 : H * 0.53;
      S = { cx: cx, cy: cy, w: sw, h: sh, x: cx - sw / 2, y: cy - sh / 2 };

      // corrientes: una por compañía, repartidas alrededor del escudo
      streams = [];
      var n = CIAS.length, a0 = mobile ? -170 : -145, a1 = mobile ? 170 : 145;
      for (var i = 0; i < n; i++) {
        var a = (a0 + i * (a1 - a0) / (n - 1)) * Math.PI / 180;
        var o = edgePoint(a, mobile ? 14 : 34, opts.og ? 34 : mobile ? 70 : 104);
        var tx = cx + Math.cos(a) * sw * 0.44, ty = cy + Math.sin(a) * sh * 0.46;
        var mxp = (o[0] + tx) / 2, myp = (o[1] + ty) / 2;
        var len = Math.hypot(tx - o[0], ty - o[1]);
        var nx = -(ty - o[1]) / len, ny = (tx - o[0]) / len, bend = (i % 2 ? 1 : -1) * len * 0.16;
        streams.push({ a: a, ox: o[0], oy: o[1], cx: mxp + nx * bend, cy: myp + ny * bend, tx: tx, ty: ty, name: CIAS[i] });
      }

      // pólizas en viaje (se conservan al redimensionar)
      var per = opts.og ? 9 : mobile ? 6 : 12;
      if (parts.length !== n * per) {
        parts = [];
        for (var s = 0; s < n; s++) for (var k = 0; k < per; k++) parts.push({ s: s, t: Math.random(), v: 0.07 + Math.random() * 0.06 });
      }

      // cartera: grilla de pólizas adentro del escudo
      dots = [];
      var gap = mobile ? 12 : 15;
      lc.setTransform(1, 0, 0, 1, 0, 0);
      shieldPath(lc, S.x + sw * 0.1, S.y + sh * 0.1, sw * 0.8, sh * 0.8);
      for (var gx = S.x; gx < S.x + sw; gx += gap) {
        for (var gy = S.y; gy < S.y + sh; gy += gap) {
          if (lc.isPointInPath(gx, gy)) dots.push({ x: gx, y: gy, d: Math.random() * 0.35, left: gx < cx });
        }
      }
      paintLayer();
    }

    function paintLayer() {
      var c = lc;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, layer.width, layer.height);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      // corrientes
      c.setLineDash([2, 7]);
      c.lineWidth = 1;
      streams.forEach(function (st) {
        c.strokeStyle = "rgba(86,183,232,.13)";
        c.beginPath(); c.moveTo(st.ox, st.oy); c.quadraticCurveTo(st.cx, st.cy, st.tx, st.ty); c.stroke();
      });
      c.setLineDash([]);

      // nodos + nombres de compañías
      if (!mobile) {
        c.font = "500 11px 'Red Hat Mono', ui-monospace, monospace";
        c.textBaseline = "middle";
        streams.forEach(function (st) {
          c.fillStyle = "rgba(86,183,232,.75)";
          c.beginPath(); c.arc(st.ox, st.oy, 3, 0, Math.PI * 2); c.fill();
          var right = st.ox > W - 60, left = st.ox < 60;
          c.textAlign = right ? "right" : left ? "left" : "center";
          var lx = st.ox + (right ? -10 : left ? 10 : 0);
          var ly = st.oy + (right || left ? 0 : st.oy < S.cy ? 14 : -14);
          c.fillStyle = "rgba(160,200,228,.55)";
          c.fillText(st.name.toUpperCase(), lx, ly);
        });
      }

      // anillos de capas
      [1.42, 1.2].forEach(function (k, i) {
        var w = S.w * k, h = S.h * k;
        c.setLineDash([3, 9]);
        c.strokeStyle = i ? "rgba(143,211,245,.10)" : "rgba(143,211,245,.06)";
        shieldPath(c, S.cx - w / 2, S.cy - h / 2, w, h); c.stroke();
      });
      c.setLineDash([]);

      // escudo partido: mitad azul, mitad navy (el ícono de la app)
      c.save();
      shieldPath(c, S.x, S.y, S.w, S.h); c.clip();
      var g = c.createLinearGradient(0, S.y, 0, S.y + S.h);
      g.addColorStop(0, "rgba(42,111,219,.34)"); g.addColorStop(1, "rgba(42,111,219,.08)");
      c.fillStyle = g; c.fillRect(S.x, S.y, S.w / 2, S.h);
      var g2 = c.createLinearGradient(0, S.y, 0, S.y + S.h);
      g2.addColorStop(0, "rgba(16,43,69,.78)"); g2.addColorStop(1, "rgba(10,28,46,.45)");
      c.fillStyle = g2; c.fillRect(S.cx, S.y, S.w / 2, S.h);
      c.restore();

      c.save();
      c.shadowColor = "rgba(86,183,232,.8)"; c.shadowBlur = 28;
      c.strokeStyle = "rgba(86,183,232,.6)"; c.lineWidth = 2;
      shieldPath(c, S.x, S.y, S.w, S.h); c.stroke();
      c.restore();

      c.strokeStyle = "rgba(143,211,245,.14)"; c.lineWidth = 1;
      shieldPath(c, S.x + S.w * 0.07, S.y + S.h * 0.07, S.w * 0.86, S.h * 0.86); c.stroke();
      c.beginPath(); c.moveTo(S.cx, S.y + 2); c.lineTo(S.cx, S.y + S.h - 2); c.stroke();
    }

    function quad(st, t) {
      var u = 1 - t;
      return [u * u * st.ox + 2 * u * t * st.cx + t * t * st.tx, u * u * st.oy + 2 * u * t * st.cy + t * t * st.ty];
    }

    function draw(time, dt, still) {
      var c = ctx;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, canvas.width, canvas.height);
      px += (mx - px) * 0.05; py += (my - py) * 0.05;
      c.setTransform(dpr, 0, 0, dpr, px * dpr, py * dpr);
      c.drawImage(layer, 0, 0, W, H);

      var phase = still ? 0.6 : (time % PULSE) / PULSE;
      var flash = phase < 0.14 ? 1 - phase / 0.14 : 0;

      // cartera: pólizas que se encienden en verde con cada sync
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], on = still ? 0.5 : Math.max(0, 1 - Math.abs(phase - d.d) * 5);
        c.fillStyle = on > 0.05
          ? "rgba(31,169,126," + (0.18 + on * 0.62).toFixed(2) + ")"
          : (d.left ? "rgba(143,211,245,.13)" : "rgba(143,211,245,.08)");
        c.fillRect(d.x - 1.5, d.y - 1, 3, 2);
      }

      // pulso de sincronización
      if (!still && phase < 0.5) {
        var k = phase / 0.5, sc = 1 + k * 0.75, w = S.w * sc, h = S.h * sc;
        c.strokeStyle = "rgba(86,183,232," + ((1 - k) * 0.55).toFixed(3) + ")";
        c.lineWidth = 2;
        shieldPath(c, S.cx - w / 2, S.cy - h / 2, w, h); c.stroke();
      }

      // check del escudo (se dibuja al cargar)
      var p = still ? 1 : Math.min(1, (time - 0.3) / 1.4);
      if (p > 0) {
        p = 1 - Math.pow(1 - p, 3);
        var ax = S.x + S.w * 0.3, ay = S.y + S.h * 0.53, bx = S.x + S.w * 0.45, by = S.y + S.h * 0.67, ex = S.x + S.w * 0.72, ey = S.y + S.h * 0.39;
        var l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(ex - bx, ey - by), L = l1 + l2;
        c.lineCap = "round"; c.lineJoin = "round";
        c.setLineDash([L * p, L]);
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.lineTo(ex, ey);
        c.strokeStyle = "rgba(86,183,232," + (0.14 + flash * 0.2).toFixed(3) + ")"; c.lineWidth = S.w * 0.15; c.stroke();
        c.strokeStyle = "rgba(255,255,255," + (0.22 + flash * 0.4).toFixed(3) + ")"; c.lineWidth = S.w * 0.075; c.stroke();
        c.setLineDash([]);
      }

      // pólizas en viaje
      for (var j = 0; j < parts.length; j++) {
        var pt = parts[j], st = streams[pt.s];
        if (!still) { pt.t += pt.v * dt; if (pt.t >= 1) pt.t -= 1; }
        var q = quad(st, pt.t), a = 0.15 + pt.t * 0.7, s = 1 - pt.t * 0.45;
        c.fillStyle = flash > 0.3 && pt.t > 0.7 ? "rgba(91,224,176," + a.toFixed(2) + ")" : "rgba(143,211,245," + a.toFixed(2) + ")";
        c.fillRect(q[0] - 4 * s, q[1] - 2.5 * s, 8 * s, 5 * s);
      }
    }

    function loop(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      draw((now - t0) / 1000, dt, false);
      raf = requestAnimationFrame(loop);
    }

    function onMove(e) {
      if (mobile) return;
      mx = (e.clientX / window.innerWidth - 0.5) * -16;
      my = (e.clientY / window.innerHeight - 0.5) * -10;
    }

    var rt;
    function onResize() { clearTimeout(rt); rt = setTimeout(function () { layout(); if (!running) draw(9, 0, true); }, 150); }

    layout();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { paintLayer(); if (!running) draw(9, 0, true); });

    return {
      start: function () { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      still: function () { draw(9, 0, true); }
    };
  };
})();
