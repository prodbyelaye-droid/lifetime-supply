/* unit L2: the stats dot map fills in once on screen. (R3: the footer profile tabs are gone, 22:41.) */
(() => {
  'use strict';
  document.documentElement.classList.add('l2-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dots = document.querySelector('#stats .l2-dots');
  if (dots) {
    if (reduced.matches || !('IntersectionObserver' in window)) dots.classList.add('is-in');
    else {
      const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { dots.classList.add('is-in'); io.disconnect(); } }, {threshold: 0.35});
      io.observe(dots);
    }
  }
})();
