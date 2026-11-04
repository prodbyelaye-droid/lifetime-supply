// Trusted-by artist strip 1104: two continuous marquee rows. Each row's duration comes from its own set width so both
// move at the same steady speed. The CSS pauses them off screen, on hover or focus, with the header "pause motion"
// (html.motion-paused / html[data-motion-paused]) and under reduced motion. Without this script the rows are static
// and scroll by hand.
(() => {
  const section = document.querySelector('#trusted');
  if (!section || !('IntersectionObserver' in window)) return;
  const SPEED = 30; // px per second
  const measure = () => {
    for (const row of section.querySelectorAll('.tr1104__row')) {
      const set = row.querySelector('.tr1104__set');
      const w = set ? set.getBoundingClientRect().width : 0;
      if (w) row.style.setProperty('--tr-duration', (w / SPEED).toFixed(1) + 's');
    }
  };
  measure();
  section.classList.add('tr1104--ready');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  addEventListener('resize', measure, {passive: true});
  new IntersectionObserver((entries) => section.classList.toggle('in-view', entries[0].isIntersecting), {rootMargin: '80px 0px'}).observe(section);
  // the photos are lazy for the no-script page; once the strip is near, load them all so tiles never pop in mid-row
  const lazy = [...section.querySelectorAll('img[loading="lazy"]')];
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    for (const img of lazy) img.loading = 'eager';
    io.disconnect();
  }, {rootMargin: '800px 0px'}).observe(section);
})();
