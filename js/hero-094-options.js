// GO-094: window A + gradient A. The alternatives remain review switches.
(() => {
  const q = new URLSearchParams(location.search);
  document.documentElement.dataset.heroFrame = q.get('frame') === 'laptop' ? 'laptop' : 'window';
  const headings = {a:'gradient',b:'brush',c:'script',gradient:'gradient',brush:'brush',script:'script'};
  document.documentElement.dataset.heroHeading = headings[q.get('heading')] || 'gradient';
})();
