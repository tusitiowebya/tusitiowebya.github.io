// ── NAVBAR SCROLL ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ── FADE UP OBSERVER ──
const fuObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('vis'), i * 60);
            fuObs.unobserve(e.target);
        }
    });
}, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });
document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const suffix = '+';
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (current >= target ? suffix : '');
        if (current >= target) clearInterval(timer);
    }, 16);
}
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('[data-target]').forEach(animateCounter);
            counterObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.stats-bar').forEach(el => counterObs.observe(el));

// ── MODAL SYSTEM ──
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Open via card click or button
document.querySelectorAll('.fcard, .open-modal').forEach(el => {
    el.addEventListener('click', (e) => {
        // Don't open modal if WA button was clicked
        if (e.target.closest('.btn-wa-sm')) return;
        const id = el.dataset.modal;
        if (id) openModal(id);
    });
});

// Close via X button
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
});

// Close via overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => closeModal(overlay.closest('.modal')));
});

// Close via ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(closeModal);
    }
});

// ── VIDEO SLIDER ──
(function() {
    const slides = document.querySelectorAll('.sl-slide');
    const dotsContainer = document.querySelector('.sl-dots');
    const prevBtn = document.querySelector('.sl-prev');
    const nextBtn = document.querySelector('.sl-next');
    if (!slides.length) return;

    let current = 0;
    const total = slides.length;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'sl-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function getDots() { return dotsContainer.querySelectorAll('.sl-dot'); }

    function goTo(index) {
        // Pause any playing video in current slide
        const currentVideo = slides[current].querySelector('video');
        if (currentVideo) currentVideo.pause();

        slides[current].classList.remove('active');
        getDots()[current].classList.remove('active');
        current = (index + total) % total;
        slides[current].classList.add('active');
        getDots()[current].classList.add('active');

        // Update arrows
        if (prevBtn) prevBtn.disabled = total === 1;
        if (nextBtn) nextBtn.disabled = total === 1;
    }

    // Init first slide
    slides[0].classList.add('active');

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Disable arrows if only 1 slide
    if (total === 1) {
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
    }

    // Touch / swipe support
    let touchStartX = 0;
    const track = document.querySelector('.sl-track');
    if (track) {
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) goTo(current + 1);
                else          goTo(current - 1);
            }
        }, { passive: true });
    }
})();
