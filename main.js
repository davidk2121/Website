/* ─────────────────────────────────────────────
   RENCO — main.js
   GSAP + Lenis + custom interactions
───────────────────────────────────────────── */

// ─── LENIS SMOOTH SCROLL ─────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync GSAP ScrollTrigger with Lenis + scroll progress bar
// (nav referenced here is declared in NAV SCROLL STATE section below — hoisted)
const scrollProgressBar = document.getElementById('scrollProgress');
const nav = document.getElementById('nav');

lenis.on('scroll', ({ scroll, limit }) => {
  nav.classList.toggle('scrolled', scroll > 60);
  if (scrollProgressBar) {
    scrollProgressBar.style.width = (scroll / limit * 100) + '%';
  }
  ScrollTrigger.update();
});

gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ─── NOISE CANVAS ────────────────────────────
(function () {
  const canvas = document.getElementById('noiseCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, imageData;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    imageData = ctx.createImageData(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  function drawNoise() {
    frame++;
    if (frame % 2 === 0) {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    requestAnimationFrame(drawNoise);
  }
  drawNoise();
})();

// ─── CUSTOM CURSOR ───────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (window.matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  (function animateCursor() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .service-card, .work-item, [data-slider]').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });
}

// ─── MAGNETIC BUTTONS ────────────────────────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.14}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

// ─── NAV SCROLL STATE ────────────────────────
// (nav declared above; scroll toggle is in lenis scroll handler)

// ─── MOBILE MENU ────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  burger.setAttribute('aria-expanded', menuOpen);
  burger.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
  burger.querySelector('span:first-child').style.transform = menuOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
  burger.querySelector('span:last-child').style.transform = menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    burger.querySelector('span:first-child').style.transform = '';
    burger.querySelector('span:last-child').style.transform = '';
  });
});

// ─── HERO ENTRANCE ANIMATION ─────────────────
gsap.registerPlugin(ScrollTrigger);

function startHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl
    .from('.eyebrow-line', { scaleX: 0, duration: 0.8, delay: 0.2 })
    .from('.eyebrow-text', { opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-word', {
      y: '110%', duration: 1.1, stagger: 0.12,
      ease: 'power4.out'
    }, '-=0.3')
    .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.card-1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
    .from('.card-2', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6');
}

// ─── PRELOADER ───────────────────────────────
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('leaving');
      setTimeout(() => {
        preloader.style.display = 'none';
        startHeroEntrance();
      }, 850);
    }, 1100);
  } else {
    startHeroEntrance();
  }
});

// ─── HERO PARALLAX ───────────────────────────
gsap.to('.hero-grid', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  }
});

gsap.to('.hero-gradient', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  }
});

// ─── SCROLL REVEAL (generic) ─────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  revealObserver.observe(el);
});

// ─── STATS COUNTER ───────────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = ts => {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const item = e.target;
    const counter = item.querySelector('.counter');
    const target = parseInt(item.dataset.count, 10);
    animateCounter(counter, target);
    statObserver.unobserve(item);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

// ─── SERVICES STAGGER ────────────────────────
gsap.from('.service-card', {
  opacity: 0, y: 40, scale: 0.97,
  duration: 0.7,
  stagger: 0.08,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 80%',
  }
});

// ─── PROCESS NUMBERS ─────────────────────────
gsap.from('.step-num', {
  scale: 0.5, opacity: 0,
  duration: 0.6,
  stagger: 0.15,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.process-steps',
    start: 'top 75%',
  }
});

// ─── BEFORE / AFTER SLIDERS (tabbed) ─────────
(function () {
  function initSlider(slider) {
    const handle = slider.querySelector('.ba-handle');
    const after = slider.querySelector('.ba-after');
    let dragging = false;

    function setPos(x) {
      const rect = slider.getBoundingClientRect();
      const pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
      handle.style.left = pct + '%';
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      slider.classList.add('dragged');
    }

    handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });

    handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend', () => { dragging = false; });
    window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });

    // Scroll-in animation (intro sweep)
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const proxy = { pct: 50 };
      gsap.to(proxy, {
        pct: 30, duration: 1.4, ease: 'power3.inOut',
        onUpdate: () => setPos(slider.getBoundingClientRect().left + (proxy.pct / 100) * slider.getBoundingClientRect().width),
        onComplete: () => {
          gsap.to(proxy, {
            pct: 50, duration: 0.9, ease: 'power2.out',
            onUpdate: () => setPos(slider.getBoundingClientRect().left + (proxy.pct / 100) * slider.getBoundingClientRect().width),
            onComplete: () => slider.classList.remove('dragged')
          });
        }
      });
      obs.unobserve(slider);
    }, { threshold: 0.35 });
    obs.observe(slider);
  }

  document.querySelectorAll('[data-slider]').forEach(initSlider);

  document.querySelectorAll('.ba-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const project = tab.dataset.project;
      document.querySelectorAll('.ba-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.ba-project').forEach(p => p.classList.remove('active'));
      const active = document.querySelector(`.ba-project[data-project="${project}"]`);
      active.classList.add('active');
      const slider = active.querySelector('[data-slider]');
      const handle = slider.querySelector('.ba-handle');
      const after = slider.querySelector('.ba-after');
      handle.style.left = '50%';
      after.style.clipPath = 'inset(0 50% 0 0)';
      slider.classList.remove('dragged');
    });
  });
})();

// ─── TESTIMONIALS CAROUSEL ───────────────────
(function () {
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const total = cards.length;
  let current = 0;
  let autoTimer;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    resetAuto();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  resetAuto();

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });
})();

// ─── WORK ITEMS PARALLAX ─────────────────────
document.querySelectorAll('.work-img').forEach(img => {
  gsap.to(img, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.work-item'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
});

// ─── SECTION TITLES REVEAL ───────────────────
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    opacity: 0, y: 30,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
    }
  });
});

// ─── SECTION LABELS REVEAL ───────────────────
gsap.utils.toArray('.section-label').forEach(label => {
  gsap.from(label, {
    opacity: 0, x: -20,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: label,
      start: 'top 88%',
    }
  });
});

// ─── CTA GLOW MOUSE PARALLAX ─────────────────
const ctaSection = document.querySelector('.cta-section');
if (ctaSection) {
  ctaSection.addEventListener('mousemove', e => {
    const rect = ctaSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to('.cta-glow-1', { x: x * 40, y: y * 40, duration: 1.5, ease: 'power2.out' });
    gsap.to('.cta-glow-2', { x: x * -30, y: y * -30, duration: 1.5, ease: 'power2.out' });
  });
}

// ─── FORM SUBMIT ─────────────────────────────
const form = document.getElementById('ctaForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const span = btn.querySelector('span');
    span.textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
      span.textContent = 'Request Sent ✓';
      btn.style.background = '#3a7a3a';
      btn.style.opacity = '1';
      setTimeout(() => {
        span.textContent = 'Request Free Estimate';
        btn.style.background = '';
        btn.style.opacity = '1';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });
}
