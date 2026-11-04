/* Row 11 (his TwelveLabs ref, 26 Oct): small tiles travel along the #flow curves behind "a day in my workflow."
   Calm and slow (one lap takes 80-110 s). SMIL motion, so no frame loop: the whole SVG timeline is paused while the
   section is off screen, while the tab is hidden and while the header "pause motion" is on. Under reduced motion the
   tiles rest at fixed points on the curves. No markup, no text; decorative (the svg is aria-hidden). */
(() => {
  'use strict';
  const svg = document.querySelector('#flow svg.curves');
  const group = svg && svg.querySelector('g.travellers');
  const tracks = svg ? [...svg.querySelectorAll('g.tracks path')] : [];
  if (!group || !tracks.length || group.childElementCount) return;
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // [track, start on the lap (0-1), lap seconds, tile tint class]
  const TILES = [[0, 0.02, 96, 'a'], [0, 0.46, 96, 'b'], [1, 0.18, 110, 'c'], [1, 0.66, 110, 'a'], [2, 0.31, 84, 'b'], [2, 0.8, 84, 'c']];
  tracks.forEach((path, i) => { if (!path.id) path.id = 'flow-track-' + i; });
  for (const [t, start, dur, tint] of TILES) {
    const tile = document.createElementNS(NS, 'rect');
    tile.setAttribute('class', 'flow-tile flow-tile--' + tint);
    tile.setAttribute('x', '-22'); tile.setAttribute('y', '-15');
    tile.setAttribute('width', '44'); tile.setAttribute('height', '30'); tile.setAttribute('rx', '8');
    if (reduced.matches) {
      const path = tracks[t], p = path.getPointAtLength(path.getTotalLength() * start);
      tile.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    } else {
      const motion = document.createElementNS(NS, 'animateMotion');
      motion.setAttribute('dur', dur + 's');
      motion.setAttribute('begin', (-start * dur).toFixed(1) + 's');
      motion.setAttribute('repeatCount', 'indefinite');
      motion.setAttribute('rotate', '0');
      const mpath = document.createElementNS(NS, 'mpath');
      mpath.setAttribute('href', '#' + tracks[t].id);
      mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + tracks[t].id);
      motion.append(mpath);
      tile.append(motion);
    }
    group.append(tile);
  }
  if (reduced.matches || typeof svg.pauseAnimations !== 'function') return;
  let onScreen = false;
  const sync = () => {
    const run = onScreen && !document.hidden && !document.documentElement.hasAttribute('data-motion-paused');
    if (run) svg.unpauseAnimations(); else svg.pauseAnimations();
  };
  svg.pauseAnimations();
  new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; sync(); }, {rootMargin: '120px 0px'}).observe(svg);
  new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['data-motion-paused']});
  document.addEventListener('visibilitychange', sync);
})();
