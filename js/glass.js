/* ═══════════════════════════════════════════════════
   glass.js: depth for the sky-blue room
   Parallax on the rendered layers, poster-first lazy
   video, and a scroll-tracked floor glow.
   Runs after app.js. Every effect here is additive:
   if it never runs, the page still reads correctly.
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Poster-first lazy video ─────────────────────
     A <video poster> is fetched eagerly even with preload="none",
     so below-fold posters were competing with the hero for
     bandwidth. They live in data-poster and get attached on
     approach. Sources live in data-src for the same reason. */
  function showPoster(v) {
    if (v.dataset.poster && !v.getAttribute('poster')) {
      v.setAttribute('poster', v.dataset.poster);
    }
  }

  function loadVideo(v) {
    showPoster(v);
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.querySelectorAll('source[data-src]').forEach(function (s) {
      s.src = s.dataset.src;
    });
    v.load();
    if (!reduce) {
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused: poster stands in */ });
    }
  }

  /* ─── Lazy money texture ──────────────────────────
     A CSS background on an in-tree element is fetched eagerly, so
     the offer panels only get the class (and therefore the URL) once
     they are near the viewport. All three are below the fold, so this
     keeps the artwork out of the first-view budget entirely. */
  var moneyPanels = Array.prototype.slice.call(
    document.querySelectorAll('.value-reveal, .pricing-inner, .footer-sale'));
  if ('IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('money-tex-on');
        tio.unobserve(e.target);
      });
    }, { rootMargin: '300px 0px' });
    moneyPanels.forEach(function (el) { tio.observe(el); });
  } else {
    moneyPanels.forEach(function (el) { el.classList.add('money-tex-on'); });
  }

  var lazyVideos = Array.prototype.slice.call(document.querySelectorAll('video[data-lazy-video]'));

  if (reduce) {
    /* Reduced motion: never fetch the clips, but the poster still
       has to arrive, because the poster IS the final state here. */
    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          showPoster(e.target);
          pio.unobserve(e.target);
        });
      }, { rootMargin: '300px 0px' });
      lazyVideos.forEach(function (v) { v.removeAttribute('autoplay'); pio.observe(v); });
    } else {
      lazyVideos.forEach(showPoster);
    }
  } else if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) {
          if (e.target.dataset.loaded && !e.target.paused) e.target.pause();
          return;
        }
        loadVideo(e.target);
        if (e.target.dataset.loaded && e.target.paused) {
          var p = e.target.play();
          if (p && p.catch) p.catch(function () {});
        }
      });
    }, { rootMargin: '200px 0px' });
    lazyVideos.forEach(function (v) { vio.observe(v); });
  } else {
    lazyVideos.forEach(loadVideo);
  }

  /* The hero clip waits for load so it never competes with LCP.
     Until then its poster is what the visitor sees. */
  var hero = document.querySelector('.hero video[data-lazy-video]');
  if (hero && !reduce) {
    window.addEventListener('load', function () {
      (window.requestIdleCallback || function (f) { setTimeout(f, 240); })(function () {
        loadVideo(hero);
      });
    });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  /* ─── Parallax on the rendered layers ─────────────
     Each render drifts slower than the scroll, which is
     what sells the depth. Transform only, so it stays on
     the compositor and never triggers layout. */
  document.querySelectorAll('.sec-bg-media').forEach(function (el) {
    var depth = parseFloat(el.dataset.depth || '0.18');
    gsap.fromTo(el,
      { yPercent: -50 - depth * 100 },
      {
        yPercent: -50 + depth * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.sec-bg').parentNode,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  });

  /* ─── Content lifts through the room ──────────────
     A small counter-drift on the glass panels so content
     and backdrop separate in Z as you scroll. */
  document.querySelectorAll('[data-lift]').forEach(function (el) {
    gsap.fromTo(el,
      { y: 28 },
      {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  /* ─── Floor glow tracks scroll ────────────────────
     One custom property write per frame, rAF-throttled. */
  var sky = document.querySelector('.sky');
  if (sky) {
    var ticking = false;
    var setGlow = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      sky.style.setProperty('--glow-y', (24 + p * 52).toFixed(1) + '%');
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(setGlow); }
    }, { passive: true });
    setGlow();
  }
})();
