// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// IntersectionObserver - fade-up
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '-30px 0px' });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 75}ms`;
  observer.observe(el);
});

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      if (!el.classList.contains('counted')) {
        el.classList.add('counted');
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.num-val').forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Confetti canvas
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let W, H, confetti = [], animId;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#2563eb', '#ec4899', '#fbbf24', '#60a5fa', '#f472b6', '#34d399', '#a78bfa'];
const SHAPES = ['rect', 'circle'];

function random(a, b) { return Math.random() * (b - a) + a; }

class Confetto {
  constructor() {
    this.reset(true);
  }
  reset(initial) {
    this.x = random(0, W);
    this.y = initial ? random(-H, 0) : random(-H * 0.5, -20);
    this.w = random(4, 10);
    this.h = random(4, 8);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.vx = random(-0.8, 0.8);
    this.vy = random(1.5, 4);
    this.rot = random(0, Math.PI * 2);
    this.rotV = random(-0.05, 0.05);
    this.opacity = random(0.5, 1);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02;
    this.rot += this.rotV;
    if (this.y > H + 20) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

const NUM_CONFETTI = 80;
for (let i = 0; i < NUM_CONFETTI; i++) {
  confetti.push(new Confetto());
}

function animateConfetti() {
  ctx.clearRect(0, 0, W, H);
  confetti.forEach(c => { c.update(); c.draw(); });
  animId = requestAnimationFrame(animateConfetti);
}

animateConfetti();
