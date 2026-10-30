import {blotFor} from './blot2.js';
import {createHeroGradient} from './hero-gradient-203.js';
import {OUTLINE, SPLATS, COLOURS, EYE} from './hero-076-cast.js';

const NS = 'http://www.w3.org/2000/svg';
// opus 089 eyes.ts A, in the outline's 256 box, at openness o (1 open, 0 shut). Open is exactly eyePaths('A'); closing
// follows the shader: the eye flattens to a hairline that sags 0.16 R into a lid, never a flat dash.
const wobble = (w, a, ph) => 1 + w * (0.5 * Math.sin(3 * a + ph) + 0.3 * Math.sin(5 * a + 2.1 * ph) + 0.2 * Math.sin(4 * a - ph));
function eyePath(i, o) {
  const side = i === 0 ? -1 : 1, r = EYE.R * (i === 0 ? EYE.leftSize : 1), ph = i === 0 ? 1.7 : 0.4;
  const ang = side * EYE.tilt + (i === 0 ? EYE.leftTilt : 0) * side, cx = side * EYE.x, cy = EYE.y, ry = r * (0.1 + 0.9 * o);
  let d = '';
  for (let j = 0; j < 40; j++) {
    const a = (j / 40) * Math.PI * 2, rr = wobble(EYE.wob, Math.atan2(Math.sin(a), side * Math.cos(a)), ph);
    const lx = Math.cos(a) * r * rr, xn = Math.max(-1, Math.min(1, lx / r));
    const ly = Math.sin(a) * ry * rr - (1 - o) * 0.16 * r * (1 - xn * xn);
    d += `${j ? 'L' : 'M'}${((cx + Math.cos(ang) * lx - Math.sin(ang) * ly + 0.7) * EYE.K).toFixed(2)} ${((0.7 - (cy + Math.sin(ang) * lx + Math.cos(ang) * ly)) * EYE.K).toFixed(2)}`;
  }
  return d + 'Z';
}
// the portal blot's blink (engine.ts T, from [Grok]): shut 67 ms, held 33 ms, open 67 ms, every 2.5 to 5.5 s. Fixed
// times, so any t draws the same frame.
const BLINKS = [];
for (let k = 0, t = 1.8; k < 400; k++) { BLINKS.push(t); t += 2.5 + 3 * ((((Math.sin(k * 12.9898 + 4.1) * 43758.5453) % 1) + 1) % 1); }
function openness(t) {
  let s = Infinity;
  for (const b of BLINKS) { if (b > t) break; s = t - b; }
  const shut = 0.067, held = 0.033, open = 0.067;
  if (s < shut) return Math.round((1 - s / shut) * 12) / 12;
  if (s < shut + held) return 0;
  if (s < shut + held + open) return Math.round(((s - shut - held) / open) * 12) / 12;
  return 1;
}

// cdesign 002: keep the original blot instances, placement, clocks and transforms.
// Task 007: 030 clean accent silhouettes; eye slits are 115% of round-1 dimensions.
// Colour, outline and source order are recorded in design/hero-v1-sources.json.
export function createHeroDesign(reduced) {
  const query = new URLSearchParams(location.search);
  const option = 'c';
  document.documentElement.dataset.heroHeight = query.get('heroHeight') === 'b' ? 'b' : 'a';
  document.documentElement.dataset.heroDesign = option;
  // opus 076 (pick 21 = B, his 21:38; critic 066 #4): exactly one blot has a face, the hero character, drawn with the
  // portal blot's own outline and opus 089's painted round eyes (pick 32 A). Every other hero blot is an eyeless colour
  // splat: lopsided, one drip, one notch (066 #7). Colours: 059 A with 069's shifts; never all six side by side.
  // Dev switch (not for production): ?hero-face=lilac draws the character in the periwinkle-to-lilac accent.
  const face = query.get('hero-face') === 'lilac' ? 'lilac' : 'v1';
  const cast = [
    {face: true, colour: face},
    {splat: 'b', colour: face === 'lilac' ? 'coral' : 'lilac'},
    {splat: 'a', colour: 'pink'},
    {splat: 'c', colour: 'sun'},
    {splat: 'd', colour: 'mint'},
  ];
  document.documentElement.dataset.heroFace = face;
  document.querySelectorAll('.opening-blots .ob').forEach((host, i) => {
    const blot = blotFor(host), part = cast[i];
    if (!blot || !part) return;
    blot.drop = false;
    blot.dropEl.setAttribute('d', '');
    // Hide the old painted paths without changing the animation renderer.
    for (const child of blot.pose.children) child.style.display = 'none';
    const art = document.createElementNS(NS, 'g');
    art.classList.add(part.face ? 'hero-face' : 'hero-splat');
    // the 256 box drawn into the same 90 units the 030 accents used
    art.setAttribute('transform', 'translate(-45 -45) scale(0.3515625)');
    art.innerHTML = part.face
      ? `<path fill="${COLOURS[part.colour]}" d="${OUTLINE}"/><g fill="#fff"><path class="hero-eye"/><path class="hero-eye"/></g>`
      : `<path fill="${COLOURS[part.colour]}" d="${SPLATS[part.splat]}"/>`;
    blot.pose.append(art);
    host.dataset.cast = part.face ? 'face' : 'splat';
    host.dataset.castColour = COLOURS[part.colour];
    if (!part.face) return;
    const eyes = [...art.querySelectorAll('.hero-eye')];
    let drawn = -1;
    const draw = (t) => {
      const o = reduced.matches ? 1 : openness(t);
      if (o === drawn) return;
      drawn = o;
      eyes.forEach((e, k) => e.setAttribute('d', eyePath(k, o)));
    };
    // the blink runs on blot2's clock, so a frame-stepped capture and the pause control both hold it
    const render = blot.render.bind(blot);
    blot.render = (t) => { render(t); draw(t); };
    draw(0);
  });
  const button = document.getElementById('motion-toggle');
  button.title = 'Pause motion';
  const gradient = option === 'c' ? createHeroGradient(document.querySelector('.opening'), reduced) : null;
  return {
    sync(stopped, userPaused) {
      const label = userPaused ? 'play motion' : 'pause motion';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18">${userPaused ? '<path d="M6 3.5 16 10 6 16.5Z" fill="currentColor"/>' : '<rect x="5" y="4" width="3" height="12" rx=".7" fill="currentColor"/><rect x="12" y="4" width="3" height="12" rx=".7" fill="currentColor"/>'}</svg><span>${userPaused ? 'play' : 'pause'}<span class="mt-long"> motion</span></span>`;
      gradient?.setPaused(stopped);
    },
    renderAt(t) { gradient?.renderAt(t); },
    resume() { gradient?.resume(); },
    stats() { return {option, gradient: gradient?.stats() || null}; },
    dispose() { gradient?.dispose(); }
  };
}
