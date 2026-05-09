// ─── LOADER ───────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);
});

// ─── CUSTOM CURSOR (Free Fire arc crosshair) ──────────────
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const crosshair = document.getElementById('cursor-crosshair');

if (!isTouchDevice && crosshair) {
  let isHovering = false;

  function arcPath(cx, cy, r, startDeg) {
    const s = (startDeg * Math.PI) / 180;
    const e = ((startDeg + 80) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  }

  function buildCrosshairSVG(hover) {
    const size = hover ? 52 : 40;
    const cx = size / 2, cy = size / 2;
    const r = hover ? 16 : 12;
    const dotR = hover ? 2.5 : 1.8;
    const color = hover ? '#ff6600' : '#ff0000';
    const sw = hover ? 2.5 : 2;
    const arcs = [-130, -40, 50, 140].map(deg =>
      `<path d="${arcPath(cx, cy, r, deg)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" filter="url(#cg)"/>`
    ).join('');
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" overflow="visible">
      <defs><filter id="cg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter></defs>
      ${arcs}
      <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${color}" filter="url(#cg)"/>
    </svg>`;
  }

  crosshair.innerHTML = buildCrosshairSVG(false);

  document.addEventListener('mousemove', (e) => {
    const size = isHovering ? 52 : 40;
    crosshair.style.left = (e.clientX - size / 2) + 'px';
    crosshair.style.top = (e.clientY - size / 2) + 'px';
    const hovering = !!e.target.closest('a, button, [data-hover]');
    if (hovering !== isHovering) {
      isHovering = hovering;
      crosshair.innerHTML = buildCrosshairSVG(isHovering);
    }
  });
}

// ─── NAVBAR HIDE/SHOW ON SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (currentScroll > lastScroll && currentScroll > 120) {
      navbar.classList.add('hidden-nav');
    } else {
      navbar.classList.remove('hidden-nav');
    }
  }
  lastScroll = currentScroll;
}, { passive: true });

// ─── SMOOTH SCROLL NAV LINKS ──────────────────────────────
document.querySelectorAll('[data-scroll-to]').forEach(el => {
  el.addEventListener('click', () => {
    const target = document.getElementById(el.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── PARTICLE SYSTEM ──────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 0.5;
      this.vy = -(Math.random() * 1 + 0.4);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.color = Math.random() > 0.5 ? '0,210,255' : '168,85,247';
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      if (this.y < 0) { this.y = H; this.x = Math.random() * W; }
    }
    draw() {
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());
  }
  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  });
}

// ─── HERO ENTRANCE ANIMATION ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-title, .hero-sub, .hero-body, .hero-btns').forEach(el => {
      el.classList.add('visible');
    });
  }, 1700);
});

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '-80px' });

document.querySelectorAll('.service-card, .boosted-card').forEach((el, i) => {
  el.dataset.delay = i * 100;
  revealObserver.observe(el);
});

// ─── STAT COUNTER ANIMATION ───────────────────────────────
function animateCounter(el, target, prefix, suffix, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = prefix + Math.floor(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(statEl => {
        const raw = statEl.dataset.count;
        const prefix = raw.includes('+') ? '+' : '';
        const num = parseInt(raw.replace(/\D/g, ''));
        if (!isNaN(num) && num > 0) {
          animateCounter(statEl, num, prefix, '');
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const statsGrid = document.getElementById('stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);
