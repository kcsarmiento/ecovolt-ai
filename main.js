/* =============================================
   EcoVolt AI — main.js
   ============================================= */

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ---------- Hamburger / mobile menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ---------- Smooth-scroll helpers ----------
function scrollTo(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('heroGetStarted').addEventListener('click', () => scrollTo('features'));
document.getElementById('solutionCTA').addEventListener('click',   () => scrollTo('features'));

// ---------- Modal ----------
const overlay    = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const demoForm   = document.getElementById('demoForm');

function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose.focus(), 50);
}

function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

['heroDemo', 'ctaDemo', 'ctaStart'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openModal);
});

modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// ---------- Demo form submit ----------
demoForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameVal  = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();

    if (!nameVal || !emailVal) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }

    closeModal();
    showToast(`Thanks, ${nameVal}! We'll be in touch at ${emailVal}. 🎉`, 'success');
    demoForm.reset();
});

// ---------- Toast notification ----------
function showToast(message, type = 'success') {
    document.querySelector('.ev-toast')?.remove();

    const colors = {
        success: { bg: '#0f172a', border: '#22c55e', icon: '✅' },
        error:   { bg: '#0f172a', border: '#ef4444', icon: '⚠️' },
    };
    const c = colors[type] || colors.success;

    const toast = document.createElement('div');
    toast.className = 'ev-toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<span>${c.icon}</span><span>${message}</span>`;

    Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '2rem',
        right:        '2rem',
        background:   c.bg,
        color:        '#fff',
        padding:      '1rem 1.4rem',
        borderRadius: '12px',
        boxShadow:    '0 10px 40px rgba(0,0,0,0.22)',
        fontSize:     '0.9rem',
        fontWeight:   '500',
        fontFamily:   'Inter, system-ui, sans-serif',
        zIndex:       '2000',
        display:      'flex',
        alignItems:   'center',
        gap:          '0.6rem',
        maxWidth:     '340px',
        lineHeight:   '1.5',
        borderLeft:   `3px solid ${c.border}`,
        animation:    'evSlideIn 0.3s ease',
    });

    // Inject keyframe once
    if (!document.getElementById('ev-toast-style')) {
        const style = document.createElement('style');
        style.id = 'ev-toast-style';
        style.textContent = `
            @keyframes evSlideIn {
                from { transform: translateX(110%); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease';
        toast.style.opacity    = '0';
        setTimeout(() => toast.remove(), 320);
    }, 4500);
}

// ---------- Intersection Observer (scroll animations) ----------
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${i * 0.08}s`;
            entry.target.classList.add('visible');
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOpts);

document.querySelectorAll('.card-anim').forEach(el => cardObserver.observe(el));

// ---------- Chart bar entrance animation ----------
(function animateBars() {
    const bars = document.querySelectorAll('#chartBars .bar');
    bars.forEach(bar => {
        const target = bar.style.getPropertyValue('--h') || '50%';
        bar.style.setProperty('--h', '0%');
        setTimeout(() => {
            bar.style.transition = 'height 0.65s cubic-bezier(0.34,1.56,0.64,1)';
            bar.style.setProperty('--h', target);
        }, 600);
    });
})();

// ---------- Active nav highlight on scroll ----------
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--green-600)' : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
