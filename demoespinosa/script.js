/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── FADE-UP INTERSECTION ── */
const fuEls = document.querySelectorAll('.fu');
const fuObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.closest('.srv-grid, .remod-grid, .gal-grid, .bene-right, .steel-features, .equipo-grid')
                ? Array.from(el.parentElement.children).indexOf(el) * 80
                : 0;
            setTimeout(() => el.classList.add('vis'), delay);
            fuObserver.unobserve(el);
        }
    });
}, { threshold: 0.12 });
fuEls.forEach(el => fuObserver.observe(el));

/* ── STATS COUNTER ── */
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.closest('.stat-item')?.querySelector('.stat-label')?.textContent.includes('%') ? '+' : '+';
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + (target >= 100 ? '%' : '+');
            if (current >= target) {
                el.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            }
        }, 16);
        statObserver.unobserve(el);
    });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* ── LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const lbItems = Array.from(document.querySelectorAll('[data-lightbox] img'));
let lbIdx = 0;

function openLB(idx) {
    lbIdx = idx;
    lbImg.src = lbItems[idx].src;
    lbImg.alt = lbItems[idx].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLB() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
}
function navLB(dir) {
    lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
        lbImg.src = lbItems[lbIdx].src;
        lbImg.alt = lbItems[lbIdx].alt;
        lbImg.style.opacity = '1';
    }, 120);
}

document.querySelectorAll('[data-lightbox]').forEach((item, i) => {
    item.addEventListener('click', () => openLB(i));
});
lightbox.querySelector('.lb-close').addEventListener('click', closeLB);
lightbox.querySelector('.lb-prev').addEventListener('click', () => navLB(-1));
lightbox.querySelector('.lb-next').addEventListener('click', () => navLB(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft')  navLB(-1);
    if (e.key === 'ArrowRight') navLB(1);
});
lbImg.style.transition = 'opacity .12s';

/* ── SMOOTH ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── HERO PARALLAX (subtle) ── */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroVideo.style.transform = `scale(1.04) translateY(${scrollY * 0.18}px)`;
        }
    }, { passive: true });
}
