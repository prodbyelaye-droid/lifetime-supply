(() => {
  'use strict';

  const text = document.querySelector('#stats-title [data-landing-aurora]');
  // Without observation support the heading keeps its static readable treatment.
  if (!text || !('IntersectionObserver' in window)) return;

  let intersecting = false;
  let activePage = true;
  const sync = () => {
    text.toggleAttribute('data-aurora-visible', activePage && intersecting && !document.hidden);
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
})();
