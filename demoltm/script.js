/* ============================================
   LTM STORE — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ── */
  const loader = document.getElementById('loader')
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide')
      setTimeout(() => loader.remove(), 600)
    }, 1800)
  }

  /* ── CUSTOM CURSOR ── */
  const dot  = document.querySelector('.cursor-dot')
  const ring = document.querySelector('.cursor-ring')
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
    })
    ;(function animRing() {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      requestAnimationFrame(animRing)
    })()
    document.querySelectorAll('a, button, .product-card, .service-card, .acc-card, .why-card, .review-card, .step-card').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover') })
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover') })
    })
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar')
  const backTop = document.querySelector('.back-top')
  const onScroll = () => {
    if (navbar) {
      if (window.scrollY > 40) navbar.classList.add('scrolled')
      else navbar.classList.remove('scrolled')
    }
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('show')
      else backTop.classList.remove('show')
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ── HAMBURGER ── */
  const hamburger = document.querySelector('.hamburger')
  const mobileMenu = document.querySelector('.mobile-menu')
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open')
      mobileMenu.classList.toggle('open')
    })
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open')
        mobileMenu.classList.remove('open')
      })
    })
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal')
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target) } })
  }, { threshold: 0.08 })
  reveals.forEach(el => revealObs.observe(el))

  /* ── HERO CANVAS (particles) ── */
  const canvas = document.getElementById('hero-canvas')
  if (canvas) {
    const ctx = canvas.getContext('2d')
    let particles = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.5 + .3,
        a: Math.random() * .5 + .1,
      })
    }

    ;(function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255,255,255,${.055 * (1 - d/120)})`
            ctx.lineWidth = .5
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(draw)
    })()
  }

  /* ── PRODUCT CARD 3D TILT ── */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x  = e.clientX - rect.left
      const y  = e.clientY - rect.top
      const cx = rect.width  / 2
      const cy = rect.height / 2
      const rx = ((y - cy) / cy) * -7
      const ry = ((x - cx) / cx) *  7
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
    })
  })

  /* ── BACK TO TOP ── */
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

})
