/* ═══════════════════════════════════════════════════════
   app.js · The Lifetime Supply (White Room)
   Two jobs, no libraries:
   1. Section reveals. .reveal elements sit at opacity 0 only while
      html.js is set (see the inline class toggle in <head>), so with
      JS off the page is simply visible. The observer fires 320px
      before an element reaches the viewport bottom, so the 0.45s
      CSS transition has finished by the time it is on screen.
   2. Header. The sticky header is transparent over the hero and
      gains its bone-50 ground once the page has scrolled.
   Reduced motion: the CSS already renders everything settled, so
   the observer only marks elements visible for parity.
═══════════════════════════════════════════════════════ */
(function () {
  window.__reveals = true; /* read by the inline failsafe in index.html */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 320px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  var header = document.getElementById('siteHeader');
  if (header) {
    var scrolled = false;
    var onScroll = function () {
      var next = window.scrollY > 8;
      if (next !== scrolled) {
        scrolled = next;
        header.classList.toggle('is-scrolled', scrolled);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
