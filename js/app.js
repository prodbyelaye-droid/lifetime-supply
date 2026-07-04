/* ═══════════════════════════════════
   app.js — ELAYE Lifetime Supply
   Lenis smooth scroll + GSAP reveals
   + counter animations + marquee
═══════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* Honour reduced-motion: freeze smooth scroll, counters, marquee,
   and video; everything renders in its final state instantly. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Lenis smooth scroll ─────────── */
if (!reduceMotion) {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ─── Intersection Observer reveals ─ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      io.unobserve(el.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ─── Stat counters ────────────────── */
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseFloat(el.dataset.value);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  if (reduceMotion) {
    el.textContent = prefix + target.toLocaleString() + suffix;
    return;
  }

  gsap.fromTo(el,
    { textContent: 0 },
    {
      textContent: target,
      duration: 2.2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate() {
        const v = Math.round(parseFloat(el.textContent));
        el.textContent = prefix + v.toLocaleString() + suffix;
      },
      onComplete() {
        el.textContent = prefix + target.toLocaleString() + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );
});

/* ─── Marquee ────────────────────── */
const track = document.getElementById('marqueeTrack');
if (track && !reduceMotion) {
  gsap.to(track, {
    x: '-33.333%',
    duration: 22,
    ease: 'none',
    repeat: -1,
  });
}

/* ─── Reduced motion: hold videos on their poster frame ─ */
if (reduceMotion) {
  document.querySelectorAll('video').forEach(v => {
    v.removeAttribute('autoplay');
    v.pause();
  });
}

/* ─── Hero entrance (simple fade-up) */
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  if (reduceMotion) {
    heroReveals.forEach(el => { el.classList.add('visible'); io.unobserve(el); });
    return;
  }
  gsap.to(heroReveals, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.14,
    ease: 'power3.out',
    delay: 0.2,
    onStart() {
      heroReveals.forEach(el => io.unobserve(el));
    }
  });
});
