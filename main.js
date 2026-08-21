// Shared site behavior: custom cursor, hover states, nav scroll state,
// scroll-reveal, stat counters, and the (demo) contact form handler.

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  if (!document.body.classList.contains('mouse-active')) {
    ringX = e.clientX; ringY = e.clientY;
    document.body.classList.add('mouse-active');
  }
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .skill-pill, .form-input, .form-textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Apple-style scroll rig: sticky nav compacts on scroll, hero drifts/fades
// with real scroll position (rAF-throttled to avoid layout thrash).
const heroLeft = document.querySelector('.hero-left');
const heroRight = document.querySelector('.hero-right');
const heroSection = document.getElementById('home');
let ticking = false;

function updateOnScroll() {
  const y = window.scrollY;
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.toggle('scrolled', y > 50);

  if (heroSection) {
    const h = heroSection.offsetHeight;
    const progress = Math.min(y / h, 1);
    if (heroLeft) {
      heroLeft.style.transform = `translateY(${progress * 60}px)`;
      heroLeft.style.opacity = 1 - progress * 1.1;
    }
    if (heroRight) {
      heroRight.style.transform = `translateY(${progress * 30}px)`;
    }
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}, { passive: true });

// Stagger sibling reveals within the same grid/section so groups cascade
// in like Apple's product tiles instead of popping in together.
document.querySelectorAll('.project-grid, .about-stats, .skills-marquee-wrapper').forEach(group => {
  group.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--stagger', `${i * 0.1}s`);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.querySelectorAll('[data-target]').length) {
        animateCounters(e.target);
      }
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function animateCounters(scope) {
  scope.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
    }, 30);
    el.removeAttribute('data-target');
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Message sent ✓';
  btn.style.background = 'var(--accent)';
  btn.style.color = 'var(--bg)';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.style.color = ''; }, 3000);
}
