/* 272: state for css/landing-shiny-272.css (Magic UI Animated Shiny Text port; MIT, Copyright (c) Magic UI, notice
   in that file). Same lifecycle as the stats Aurora script, on its own element and attributes:
   data-shiny-272-run only while the phrase is on screen, the tab is visible and the page is shown;
   data-shiny-272-live last, once observation is set up. Reduced motion, forced colors and
   html[data-motion-paused] stay in the CSS. No frame loop, no scroll handling, no text or markup changes. */
(() => {
  'use strict';

  const text = document.querySelector('#flow [data-shiny-272]');
  // Without observation support the phrase keeps its current static ink.
  if (!text || !('IntersectionObserver' in window)) return;

  let intersecting = false;
  let activePage = true;
  const sync = () => {
    text.toggleAttribute('data-shiny-272-run', activePage && intersecting && !document.hidden);
  };
  const observer = new IntersectionObserver(entries => {
    if (!activePage) return;
    for (const entry of entries) {
      if (entry.target === text) intersecting = entry.isIntersecting && entry.intersectionRatio > 0;
    }
    sync();
  }, { threshold: [0, 0.01] });

  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => {
    activePage = false;
    intersecting = false;
    observer.disconnect();
    sync();
  });
  window.addEventListener('pageshow', () => {
    activePage = true;
    intersecting = false;
    observer.disconnect();
    observer.observe(text);
    sync();
  });
  observer.observe(text);
  sync();
  // Set last: any earlier failure leaves the current static ink.
  text.setAttribute('data-shiny-272-live', '');
})();
