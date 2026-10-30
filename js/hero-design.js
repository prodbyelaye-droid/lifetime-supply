import {blotFor} from './blot2.js';
import {createHeroGradient} from './hero-gradient-203.js';

// cdesign 002: keep the original blot instances, placement, clocks and transforms.
// Task 007: 030 clean accent silhouettes; eye slits are 115% of round-1 dimensions.
// Colour, outline and source order are recorded in design/hero-v1-sources.json.
export function createHeroDesign(reduced) {
  const query = new URLSearchParams(location.search);
  const option = 'c';
  document.documentElement.dataset.heroHeight = query.get('heroHeight') === 'b' ? 'b' : 'a';
  document.documentElement.dataset.heroDesign = option;
  const sources = ['221', '150', '212', '223', '183'];
  document.querySelectorAll('.opening-blots .ob').forEach((host, i) => {
    const blot = blotFor(host);
    if (!blot) return;
    blot.drop = false;
    blot.dropEl.setAttribute('d', '');
    // Hide the old painted paths without changing the animation renderer.
    for (const child of blot.pose.children) child.style.display = 'none';
    const art = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    art.classList.add('hero-watercolour');
    art.innerHTML = `<image href="assets/hero-v1/accent-${sources[i]}.svg" x="-45" y="-45" width="90" height="90"/>`;
    blot.pose.append(art);
    host.dataset.gradientRow = sources[i];
  });
  const button = document.getElementById('motion-toggle');
  button.title = 'Pause motion';
  const gradient = option === 'c' ? createHeroGradient(document.querySelector('.opening'), reduced) : null;
  return {
    sync(stopped, userPaused) {
      const label = userPaused ? 'play motion' : 'pause motion';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18">${userPaused ? '<path d="M6 3.5 16 10 6 16.5Z" fill="currentColor"/>' : '<rect x="5" y="4" width="3" height="12" rx=".7" fill="currentColor"/><rect x="12" y="4" width="3" height="12" rx=".7" fill="currentColor"/>'}</svg><span>${label}</span>`;
      gradient?.setPaused(stopped);
    },
    renderAt(t) { gradient?.renderAt(t); },
    resume() { gradient?.resume(); },
    stats() { return {option, gradient: gradient?.stats() || null}; },
    dispose() { gradient?.dispose(); }
  };
}
