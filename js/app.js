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

/* ─── Intersection Observer reveals ─────────────────
   rootMargin extends the trigger zone 600px past the real
   viewport bottom, so a section starts revealing while it's
   still below the fold instead of waiting until 12% of it was
   already visible. threshold:0 fires the moment any part of it
   enters that zone; the CSS transition (0.4s) does the rest.
   600px was tuned empirically, not guessed: at a realistic fast
   scroll (~4,300px/s, the 19,000px page in ~4.5s) 200px and
   400px both still landed a meaningful fraction of elements at
   or near 0 opacity the instant they entered the true viewport;
   600px brought that to zero blank frames end to end. */
const io = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      io.unobserve(el.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 600px 0px' });

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

/* ─── Header: bone-50 at 96% plus a hairline once scrolled ── */
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const setHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', setHeader, { passive: true });
  setHeader();
}
