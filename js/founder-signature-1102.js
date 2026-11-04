/* HandwritingText adaptation: Moazzam / @davailospirasto, source labelled MIT.
 * Geometry: exact reviewed Shadows Into Light paths, Kimberly Geswein, SIL OFL1.1.
 * See assets/licenses/handwriting-text-MIT.txt and shadows-into-light-OFL.txt.
 * Fixed ELAYE word: no font/parser network dependency and no word cycling. */
(() => {
  'use strict';
  const geometry = {"source":"Live DOM of reviewed resolved-preview/index.html; original opentype.js1.3.4 default-font output, ELAYE atEM100, toPathData(2)","viewBox":"-8.77734375 10.265625 255.15234375 103.19921875","ratio":2.4724,"contours":["M7.03 97.46L7.03 97.46Q7.03 89.55 7.13 81.93Q7.23 74.32 7.03 66.80Q6.84 59.28 6.25 51.71Q5.66 44.14 4.49 36.33L4.49 36.33Q4.49 36.13 4.25 35.55Q4.00 34.96 3.81 34.33Q3.61 33.69 3.42 33.20Q3.22 32.71 3.22 32.52L3.22 32.52Q3.22 32.03 3.56 31.35Q3.91 30.66 4.44 30.03Q4.98 29.39 5.66 29.00Q6.35 28.61 7.03 28.71L7.03 28.71Q8.20 29.00 8.94 30.18Q9.67 31.35 10.06 32.76Q10.45 34.18 10.60 35.55Q10.74 36.91 10.74 37.50L10.74 37.50Q13.67 35.94 17.33 34.13Q21.00 32.32 24.85 30.81Q28.71 29.30 32.57 28.27Q36.43 27.25 39.84 27.25L39.84 27.25Q39.84 28.13 39.50 28.81Q39.16 29.49 38.18 29.98L38.18 29.98L10.74 43.75L10.74 47.56Q10.84 48.63 10.99 51.27Q11.13 53.91 11.33 56.88Q11.52 59.86 11.67 62.55Q11.82 65.23 11.91 66.21L11.91 66.21L32.03 54.98L32.52 54.39Q33.01 53.81 33.79 53.32Q34.57 52.83 35.40 52.78Q36.23 52.73 37.01 53.81L37.01 53.81Q37.01 55.57 35.25 57.23Q33.50 58.89 30.86 60.55Q28.22 62.21 25.15 63.77Q22.07 65.33 19.43 66.80Q16.80 68.26 15.04 69.73Q13.28 71.19 13.28 72.46L13.28 72.46L13.28 91.31Q14.55 91.80 16.85 90.87Q19.14 89.94 21.97 88.28Q24.80 86.62 27.83 84.42Q30.86 82.23 33.74 80.27Q36.62 78.32 39.11 76.76Q41.60 75.20 43.26 74.90L43.26 74.90Q44.24 74.90 45.02 75.29Q45.80 75.68 45.80 76.86L45.80 76.86Q45.80 78.03 44.43 78.71L44.43 78.71Q41.02 80.76 36.57 83.84Q32.13 86.91 27.54 89.99Q22.95 93.07 18.51 95.56Q14.06 98.05 10.84 98.83L10.84 98.83Q9.57 98.83 8.79 98.63Q8.01 98.44 7.03 97.46Z","M52.25 96.19L52.25 96.19Q52.05 83.79 51.81 74.95Q51.56 66.11 51.37 60.06Q51.17 54.00 50.93 50.44Q50.68 46.88 50.59 44.73Q50.49 42.58 50.39 41.65Q50.29 40.72 50.29 39.84L50.29 39.84Q50.29 38.18 51.27 37.74Q52.25 37.30 53.71 37.30L53.71 37.30Q55.37 37.30 56.30 37.94Q57.23 38.57 57.23 41.21L57.23 41.21L59.08 93.75Q59.18 93.75 60.06 93.55Q60.94 93.36 62.11 92.97Q63.28 92.58 64.55 92.14Q65.82 91.70 66.60 91.31L66.60 91.31Q67.77 90.82 70.12 89.75Q72.46 88.67 75.39 87.30Q78.32 85.94 81.59 84.42Q84.86 82.91 87.84 81.59Q90.82 80.27 93.12 79.15Q95.41 78.03 96.58 77.54L96.58 77.54L97.75 77.54Q98.34 77.54 98.93 77.64Q99.51 77.73 99.90 78.13Q100.29 78.52 100.39 79.30L100.39 79.30Q100.39 80.27 100.05 80.96Q99.71 81.64 99.12 82.52L99.12 82.52Q93.36 83.59 87.84 86.43Q82.32 89.26 76.90 92.29Q71.48 95.31 65.97 97.66Q60.45 100 54.69 100L54.69 100Q52.25 100 52.25 96.19Z","M108.69 97.46L103.71 97.46Q104.00 96.09 104.20 93.95Q104.39 91.80 104.74 88.28Q105.08 84.77 105.52 79.59Q105.96 74.41 106.74 66.99Q107.52 59.57 108.54 49.56Q109.57 39.55 111.23 26.27L111.23 26.27Q111.33 25.29 112.16 25.10Q112.99 24.90 113.67 24.90L113.67 24.90Q114.75 24.90 115.43 25.68Q116.11 26.46 116.65 27.44Q117.19 28.42 117.68 29.49Q118.16 30.57 118.75 31.25L118.75 31.25Q119.73 33.50 120.75 36.43Q121.78 39.36 122.95 42.68Q124.12 46.00 125.29 49.37Q126.46 52.73 127.64 55.91Q128.81 59.08 129.83 61.77Q130.86 64.45 131.74 66.21L131.74 66.21Q132.81 66.11 134.77 65.38Q136.72 64.65 138.96 63.96Q141.21 63.28 143.36 62.89Q145.51 62.50 146.97 62.84Q148.44 63.18 148.88 64.55Q149.32 65.92 148.14 68.85L148.14 68.85Q147.46 68.85 146.88 68.60Q146.29 68.36 145.70 68.12Q145.12 67.87 144.48 67.63Q143.85 67.38 143.07 67.38L143.07 67.38Q142.58 67.38 140.87 67.92Q139.16 68.46 137.21 69.09Q135.25 69.73 133.79 70.36Q132.32 71.00 132.32 71.29L132.32 71.29L139.06 97.75L136.52 101.46Q134.86 98.63 133.74 94.97Q132.62 91.31 131.64 87.65Q130.66 83.98 129.64 80.81Q128.61 77.64 127.05 75.49L127.05 75.49Q125 76.46 122.17 77.15Q119.34 77.83 116.70 78.86Q114.06 79.88 112.16 81.59Q110.25 83.30 109.86 86.23L109.86 86.23Q109.67 87.40 109.52 89.36Q109.38 91.31 109.18 93.07L109.18 93.07Q108.89 95.21 108.69 97.46L108.69 97.46Z","M114.94 39.94L114.94 39.94L114.75 41.60Q114.65 43.26 114.45 45.46Q114.26 47.66 114.01 49.95Q113.77 52.25 113.67 53.81L113.67 53.81Q113.18 59.28 112.65 64.60Q112.11 69.92 112.11 75.49L112.11 75.49Q113.96 75.49 116.06 75Q118.16 74.51 120.12 73.68Q122.07 72.85 123.68 71.63Q125.29 70.41 126.17 68.85L126.17 68.85Q125.39 65.43 124.46 61.77Q123.54 58.11 122.46 54.35Q121.39 50.59 120.12 46.97Q118.85 43.36 117.38 39.94L117.38 39.94Q117.29 39.84 116.70 39.50Q116.11 39.16 114.94 39.94Z","M158.98 97.56L158.98 97.56Q158.98 94.04 160.06 90.67Q161.13 87.30 162.40 83.89Q163.67 80.47 164.60 77.10Q165.53 73.73 165.23 70.02L165.23 70.02Q162.40 66.89 158.98 63.23Q155.57 59.57 152.25 55.62Q148.93 51.66 146.09 47.41Q143.26 43.16 141.50 38.77L141.50 38.77Q141.41 38.67 141.41 38.48L141.41 38.48L141.41 38.09Q141.41 36.91 142.29 36.52Q143.16 36.13 144.14 36.13L144.14 36.13Q146.68 39.16 149.56 43.02Q152.44 46.88 155.47 50.68Q158.50 54.49 161.62 57.96Q164.75 61.43 167.77 63.67L167.77 63.67L169.04 63.67Q169.43 62.99 170.41 60.30Q171.39 57.62 172.80 53.91Q174.22 50.20 175.78 45.70Q177.34 41.21 178.76 36.87Q180.18 32.52 181.20 28.71Q182.23 24.90 182.71 22.46L182.71 22.46Q182.81 22.27 183.30 22.27L183.30 22.27Q184.77 22.27 185.69 23.58Q186.62 24.90 186.43 26.27L186.43 26.27Q183.79 35.55 182.08 41.50Q180.37 47.46 179.25 51.22Q178.13 54.98 177.34 57.28Q176.56 59.57 175.73 61.62Q174.90 63.67 174.02 66.16Q173.14 68.65 171.68 72.80Q170.21 76.95 168.07 83.45Q165.92 89.94 162.70 100L162.70 100Q162.60 100 162.16 100.05Q161.72 100.10 161.52 100.10L161.52 100.10Q158.98 100.10 158.98 97.56Z","M195.61 97.46L195.61 97.46Q195.61 89.55 195.70 81.93Q195.80 74.32 195.61 66.80Q195.41 59.28 194.82 51.71Q194.24 44.14 193.07 36.33L193.07 36.33Q193.07 36.13 192.82 35.55Q192.58 34.96 192.38 34.33Q192.19 33.69 191.99 33.20Q191.80 32.71 191.80 32.52L191.80 32.52Q191.80 32.03 192.14 31.35Q192.48 30.66 193.02 30.03Q193.55 29.39 194.24 29.00Q194.92 28.61 195.61 28.71L195.61 28.71Q196.78 29.00 197.51 30.18Q198.24 31.35 198.63 32.76Q199.02 34.18 199.17 35.55Q199.32 36.91 199.32 37.50L199.32 37.50Q202.25 35.94 205.91 34.13Q209.57 32.32 213.43 30.81Q217.29 29.30 221.14 28.27Q225 27.25 228.42 27.25L228.42 27.25Q228.42 28.13 228.08 28.81Q227.73 29.49 226.76 29.98L226.76 29.98L199.32 43.75L199.32 47.56Q199.41 48.63 199.56 51.27Q199.71 53.91 199.90 56.88Q200.10 59.86 200.24 62.55Q200.39 65.23 200.49 66.21L200.49 66.21L220.61 54.98L221.09 54.39Q221.58 53.81 222.36 53.32Q223.14 52.83 223.97 52.78Q224.80 52.73 225.59 53.81L225.59 53.81Q225.59 55.57 223.83 57.23Q222.07 58.89 219.43 60.55Q216.80 62.21 213.72 63.77Q210.64 65.33 208.01 66.80Q205.37 68.26 203.61 69.73Q201.86 71.19 201.86 72.46L201.86 72.46L201.86 91.31Q203.13 91.80 205.42 90.87Q207.71 89.94 210.55 88.28Q213.38 86.62 216.41 84.42Q219.43 82.23 222.31 80.27Q225.20 78.32 227.69 76.76Q230.18 75.20 231.84 74.90L231.84 74.90Q232.81 74.90 233.59 75.29Q234.38 75.68 234.38 76.86L234.38 76.86Q234.38 78.03 233.01 78.71L233.01 78.71Q229.59 80.76 225.15 83.84Q220.70 86.91 216.11 89.99Q211.52 93.07 207.08 95.56Q202.64 98.05 199.41 98.83L199.41 98.83Q198.14 98.83 197.36 98.63Q196.58 98.44 195.61 97.46Z"]};
  const duration = 1.5, delay = 0.05, strokeWidth = 1.6;
  const host = document.querySelector('#founder [data-founder-signature]');
  if (!host || host.querySelector('svg')) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const paused = () => motion.matches || document.hidden || root.classList.contains('motion-paused') || root.hasAttribute('data-motion-paused');
  let svg, fill, strokes, observer, pauseObserver, frame1 = 0, frame2 = 0, started = false;
  const syncMotion = () => { if (paused()) finish(); };
  function path(d, attributes) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
    return el;
  }
  function finish() {
    started = true;
    cancelAnimationFrame(frame1);
    cancelAnimationFrame(frame2);
    observer?.disconnect();
    pauseObserver?.disconnect();
    motion.removeEventListener('change', syncMotion);
    document.removeEventListener('visibilitychange', syncMotion);
    fill.style.transition = 'none';
    fill.style.opacity = '1';
    strokes.forEach(el => { el.style.transition = 'none'; el.style.strokeDashoffset = '0'; });
    host.dataset.signatureState = 'complete';
  }
  function draw() {
    if (started) return;
    started = true;
    observer?.disconnect();
    if (paused()) { finish(); return; }
    try {
      const lengths = strokes.map(el => el.getTotalLength());
      fill.style.opacity = '0';
      fill.style.transition = 'none';
      strokes.forEach((el, i) => {
        el.style.strokeDasharray = lengths[i] || 1;
        el.style.strokeDashoffset = lengths[i] || 1;
        el.style.transition = 'none';
      });
      host.dataset.signatureState = 'drawing';
      frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => {
          if (paused()) { finish(); return; }
          fill.style.transition = `opacity 0.45s ease-out ${(delay + duration * 0.72).toFixed(3)}s`;
          fill.style.opacity = '1';
          const count = Math.max(1, strokes.length);
          strokes.forEach((el, i) => {
            const each = (duration / count) * 2.4;
            const start = delay + (i / count) * duration;
            el.style.transition = `stroke-dashoffset ${each.toFixed(3)}s ease-out ${start.toFixed(3)}s`;
            el.style.strokeDashoffset = '0';
          });
          strokes[strokes.length - 1]?.addEventListener('transitionend', event => {
            if (event.propertyName === 'stroke-dashoffset') host.dataset.signatureState = 'complete';
          }, {once: true});
        });
      });
    } catch { finish(); }
  }
  try {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', geometry.viewBox);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'ELAYE');
    svg.style.height = '1.15em';
    svg.style.width = `calc(1.15em * ${geometry.ratio.toFixed(4)})`;
    svg.style.overflow = 'visible';
    fill = path(geometry.contours.join(''), {fill: 'currentColor', stroke: 'none'});
    fill.dataset.inkFill = '';
    fill.style.opacity = '1';
    svg.append(fill);
    strokes = geometry.contours.map(d => {
      const el = path(d, {fill: 'none', stroke: 'currentColor', 'stroke-width': strokeWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
      el.dataset.inkStroke = '';
      svg.append(el);
      return el;
    });
    host.replaceChildren(svg);
    host.dataset.signatureState = 'ready';
    // Page pause, reduced motion, hidden document and missing observer settle once.
    if (paused() || !('IntersectionObserver' in window)) { finish(); return; }
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    pauseObserver = new MutationObserver(syncMotion);
    pauseObserver.observe(root, {attributes: true, attributeFilter: ['class', 'data-motion-paused']});
    // Deliberate integration adapter: draw once when the signature enters view.
    // The reviewed contour timings and geometry remain unchanged.
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) draw();
    }, {threshold: 0.1});
    observer.observe(host);
  } catch {
    // Setup failures retain legible ordinary text; this is not the handwriting artwork.
    host.textContent = 'ELAYE';
    host.dataset.signatureState = 'fallback';
  }
})();
