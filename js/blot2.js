// blot2.js: the shared cartoon blot for the Lifetime landing and portal (replaces the PENS blot.js).
// Elaye 30 Oct 00:24: "the blobs can't be fucking hyper-realistic. We were closer with the fucking original ...
// they need to be like fucking cartoonish". So: the original flat blot (lobed body + a small satellite droplet),
// drawn flat with a soft clay-toy volume (a two-stop fill and a soft shade of its own deep colour), no light
// highlight (17:36: "the blot can't have white in it"), no specular, no gloss, no 3D.
// Shape and slow morph from R3 (Kate Keechook "Opal Blob"), never a perfect circle (154); a pet hop (148).
//
// Technique lifted from two CodePens Elaye sent (both public CodePen, MIT):
//   aaroniker, "AI Assistant Blob" (codepen.io/aaroniker/pen/YoqNRB): radius pushed out by simplex noise,
//   r = 1 + 0.3 * noise(p * spikes, time). Done here in 2D on a ring of points instead of a three.js sphere.
//   Mamboleoo, "Blobs" (codepen.io/Mamboleoo/pen/BWXeqR): gooey merging blobs. Done here with an SVG
//   blur + alpha-threshold filter so the droplet melts into the body when it drifts close.
// Simplex noise: Stefan Gustavson's public-domain 3D simplex, trimmed.
//
//   import {mountAll, mount, colourways} from './blot2.js';
//   mountAll();  // every [data-blot2]: stop | accent | edge | side | feature, with data-colour, data-size, data-seed
//   const b = mount(el, {kind: 'accent', colour: 'g150'}); b.hop();

// Every colour is a pixel sampled from a GRAD still Elaye liked (row @x,y in the 1400 px still). a, b: the body's
// two stops (deep first); c: the soft inner light. ink: the page's own text colour, for the small black full stops.
export const colourways = {
  // body / shade: one flat body tone and one deeper step of the same hue for the hard shadow crescent (critic 006:
  // "one body tone plus one hard-edged shadow shape", deep tones, no gold, no pastels). Deepened from the named GRAD
  // pixel where the still has no deep tone of that hue.
  ink:      {a: '#151517', b: '#000000', ref: 'page ink --ink (23:40 small black full stops)'},
  white:    {a: '#ffffff', b: '#e6e8ee', ref: 'the original flat white blot on colour (deep section, vault box)'},
  green:    {a: '#2f7d3a', b: '#1d5626', ref: '183 deep green (183 @1085,819 #138643 family), 5.1:1'},
  magenta:  {a: '#b601e1', b: '#8300a3', ref: '150 @147,2805, 5.2:1'},
  violet:   {a: '#6a00d8', b: '#4a0098', ref: '150 @343,2629 #7008eb, deepened'},
  teal:     {a: '#0f8f86', b: '#0a6660', ref: '044 @973,721 #66dad3, deepened'},
  sky:      {a: '#1b9fd8', b: '#13739e', ref: '183 @1071,364 #34d0fd, deepened'},
  rose:     {a: '#c0307e', b: '#8e1f5c', ref: '189 @1225,539 #d672a7, deepened'},
  coral:    {a: '#e2562c', b: '#a8391a', ref: '010 @903,1193 #fe8747, deepened (never in the hero)'},
  blue:     {a: '#0029d2', b: '#001a8c', ref: '150 @154,266'},
  pink:     {a: '#c32258', b: '#8f1640', ref: '155 @119,428 #ff8291, deepened'},
};
// older names used in markup map onto the deep set
for (const [k, v] of Object.entries({g145: 'sky', g150: 'magenta', g183: 'green', g044: 'teal', g189p: 'rose', g189sky: 'violet', g189: 'rose', g010: 'coral', g010l: 'rose'})) colourways[k] = colourways[v];

// ---- simplex 3D (Gustavson, public domain) ----
const G3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const perm = new Uint8Array(512);
{ let s = 1337; const p = new Uint8Array(256).map((_, i) => i);
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
function noise3(x, y, z) {
  const F = 1 / 3, Gk = 1 / 6, s = (x + y + z) * F, i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
  const t = (i + j + k) * Gk, x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) { if (y0 >= z0) [i1,j1,k1,i2,j2,k2] = [1,0,0,1,1,0]; else if (x0 >= z0) [i1,j1,k1,i2,j2,k2] = [1,0,0,1,0,1]; else [i1,j1,k1,i2,j2,k2] = [0,0,1,1,0,1]; }
  else { if (y0 < z0) [i1,j1,k1,i2,j2,k2] = [0,0,1,0,1,1]; else if (x0 < z0) [i1,j1,k1,i2,j2,k2] = [0,1,0,0,1,1]; else [i1,j1,k1,i2,j2,k2] = [0,1,0,1,1,0]; }
  const c = [[x0, y0, z0, 0, 0, 0], [x0 - i1 + Gk, y0 - j1 + Gk, z0 - k1 + Gk, i1, j1, k1], [x0 - i2 + 2 * Gk, y0 - j2 + 2 * Gk, z0 - k2 + 2 * Gk, i2, j2, k2], [x0 - 1 + 3 * Gk, y0 - 1 + 3 * Gk, z0 - 1 + 3 * Gk, 1, 1, 1]];
  let n = 0;
  for (const [a, b, d, di, dj, dk] of c) {
    let q = 0.6 - a * a - b * b - d * d;
    if (q > 0) { const g = G3[perm[((i + di) & 255) + perm[((j + dj) & 255) + perm[(k + dk) & 255]]] % 12]; q *= q; n += q * q * (g[0] * a + g[1] * b + g[2] * d); }
  }
  return 32 * n;
}

const NS = 'http://www.w3.org/2000/svg';
const reduce = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
const R = 36, BOX = 60; // body radius and half the viewBox, in SVG units
const SIZES = {stop: 0.19, accent: 0.21, edge: 64, side: 220, feature: 140}; // stop/accent in em of the host font
const blots = new Set();
let raf = 0, manual = false, clockT = 0, paused = false, uid = 0, io = null;

function closedPath(pts) {
  const n = pts.length; let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + 'Z';
}
const SHAPES = [[0.13, 0.07, 0.03], [0.16, 0.05, 0.05], [0.09, 0.12, 0.02], [0.12, 0.09, 0.06]];
function blobPath(cx, cy, r, t, seed, amp, n = 24, lobes = null) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    // R3's outline: a slow lumpy push (noise) on a soft rounded-square base, never a circle.
    const L = lobes || [0, 0, 0], w = 0.4 * Math.sin(t * 0.17 + seed);
    const k = 1 + amp * noise3(ca * 0.75 + seed, sa * 0.75 - seed, t * 0.2) + L[0] * Math.cos(3 * a + seed + w) + L[1] * Math.cos(4 * a - seed * 1.3 - w) + L[2] * Math.cos(5 * a + seed * 2.1) + 0.03 * Math.cos(2 * a + seed);
    pts.push([cx + ca * r * k, cy + sa * r * k]);
  }
  return closedPath(pts);
}

// Landing task 011 (critic 006; Elaye 00:24 "We were closer with the fucking original"): the original blot's own edge,
// ported 1:1. ORIGINAL is the contour of the brand's watercolour blot (daybreak-2026-10-25/logo/harvest/blot/
// blot-orig-nodrop-640.png, BLOT-VERSIONS cell 01, the source of the 002 white blots in cells 13 and 14): its alpha
// traced at 0.35 as the radius from the centroid at 256 angles, mean radius 1. Its droplet (blot-orig-640.png) sits
// 1.20 radii out with a radius of 0.105, 9.9% of the body's width. Only colour, scale, rotation, position and timing
// change. Flat fill, no rim, no goo blur (it would round off the scallops). ?blot=lumps keeps the 006 lumps.
export const ORIGINAL = [1.016,1.029,1.040,1.059,1.068,1.074,1.071,1.065,1.056,1.048,1.040,1.025,1.011,1.012,1.017,1.034,1.033,1.029,1.022,1.002,.986,.983,.962,.950,.952,.964,.981,.987,.989,.981,.972,.969,.969,.969,.966,.966,.966,.964,.959,.955,.959,.971,.985,.992,.993,.991,.984,.996,1.006,1.007,1.009,1.008,1.007,1.021,1.025,1.026,1.028,1.027,1.029,1.022,1.012,1.007,1.002,.988,.964,.957,.955,.956,.972,.988,.991,.982,.979,.994,1.004,.993,.989,.986,.983,.982,.981,.980,.976,.980,.982,.983,.985,.996,.998,.996,1.006,1.006,1.005,1.003,.998,.996,.986,.983,1.025,1.028,1.016,1.025,1.025,1.002,.982,.946,.924,.977,1.013,1.024,1.030,1.030,1.038,1.039,1.034,1.032,1.023,1.006,.992,.994,.995,.987,.983,.973,.977,.992,1.015,1.045,1.054,1.058,1.066,1.061,1.049,1.028,1.021,1.028,1.026,1.017,1.006,.999,.999,1.003,1.029,1.039,1.034,1.023,1.023,1.020,1.011,.989,.979,.968,.957,.944,.944,.931,.938,.939,.946,.958,.973,.987,.993,.994,.995,.989,.994,1.004,1.011,1.017,1.020,1.017,1.017,1.022,1.021,1.025,1.032,1.031,1.038,1.036,1.039,1.039,1.039,1.033,1.027,1.026,1.028,1.035,1.033,1.031,1.026,1.025,1.021,1.008,.995,.962,.948,.950,.967,.971,.972,.977,.976,.975,.975,.968,.956,.943,.943,.957,.956,.953,.950,.959,.965,.967,.966,.961,.958,.960,.956,.949,.970,.978,.979,.978,.979,.987,.993,.997,.998,.989,.989,.981,.981,.975,.986,1.015,1.028,1.033,1.033,1.034,1.024,1.009,1.008,1.036,1.047,1.051,1.053,1.051,1.054,1.057,1.051,1.042,1.037,1.022];
const DROP = {dist: 1.2, r: 0.105};
// Full stops: the same contour low-passed to its first three harmonics, so at 18 px it reads as a stop, not a smudge.
const SIMPLE = (() => {
  const n = ORIGINAL.length, c = [0, 1, 2, 3].map((h) => ORIGINAL.reduce((acc, v, i) => { const a = (2 * Math.PI * h * i) / n; return [acc[0] + v * Math.cos(a), acc[1] + v * Math.sin(a)]; }, [0, 0]).map((x) => (x * (h ? 2 : 1)) / n));
  return ORIGINAL.map((_, i) => c.reduce((v, [re, im], h) => v + re * Math.cos((2 * Math.PI * h * i) / n) + im * Math.sin((2 * Math.PI * h * i) / n), 0));
})();
// Each blot's droplet at its own clock position (critic 006: every droplet sat at 4 to 6 o'clock).
const CLOCK = [4.5, 1, 7.5, 10, 2.5, 8.5, 5.5, 11, 3.5, 6.5, 0, 9];
let shape = 'original', clockN = 0;
export function setShape(name) { shape = name === 'lumps' ? 'lumps' : 'original'; }
function profAt(prof, a) { const n = prof.length, x = ((((a / (2 * Math.PI)) % 1) + 1) % 1) * n, i = Math.floor(x), f = x - i; return prof[i % n] * (1 - f) + prof[(i + 1) % n] * f; }
function origPath(cx, cy, r, prof, rot, sx, n) {
  let d = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = r * profAt(prof, a - rot); d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * k * sx).toFixed(2)} ${(cy + (Math.sin(a) * k) / sx).toFixed(2)}`; }
  return d + 'Z';
}

class Blot {
  constructor(host, opts) {
    this.host = host;
    this.kind = opts.kind || 'edge';
    this.colour = colourways[opts.colour] ? opts.colour : 'g145';
    this.seed = opts.seed ?? (uid * 1.618) % 10;
    this.size = opts.size;
    this.amp = this.kind === 'stop' ? 0.05 : 0.06;
    this.lobes = SHAPES[Math.floor(Math.abs(this.seed * 7.31)) % SHAPES.length];
    this.shape = shape;
    this.simple = this.kind === 'stop' || this.kind === 'accent';
    this.drop = opts.drop ?? !(this.shape === 'original' && this.simple);
    this.rot = (this.seed * 2.39) % (Math.PI * 2); this.aspect = 1 + 0.06 * Math.sin(this.seed * 3.1);
    this.clock = CLOCK[clockN++ % CLOCK.length];
    this.hopAt = -10; this.visible = true;
    const id = 'b2-' + uid++, c = colourways[this.colour];
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `${-BOX} ${-BOX} ${BOX * 2} ${BOX * 2}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'b2-svg');
    svg.innerHTML = `<defs>

      <filter id="${id}-goo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -9" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>
      <filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${this.kind === 'stop' ? 3 : 4.5}"/></filter>
      <clipPath id="${id}-clip"><path/></clipPath></defs>
      <g class="b2-pose"><g filter="url(#${id}-goo)"><path class="b2-body" fill="${c.a}"/><path class="b2-drop" fill="${c.a}"/></g>
      <g clip-path="url(#${id}-clip)"><rect x="-60" y="-60" width="120" height="120" fill="${c.b}"/><path class="b2-light" fill="${c.a}"/></g></g>`;
    this.svg = svg; this.pose = svg.querySelector('.b2-pose');
    this.body = svg.querySelector('.b2-body'); this.dropEl = svg.querySelector('.b2-drop');
    this.light = svg.querySelector('.b2-light'); this.clip = svg.querySelector('clipPath path');
    if (this.shape === 'original') svg.querySelector('g[filter]').removeAttribute('filter');
    if (this.kind === 'stop' || this.kind === 'accent') this.mountStop(); else this.mountBox();
    this.render(0);
  }
  // Full stop / accent: the period stays in the text (copy and screen readers unchanged), drawn transparent, and
  // the blot rests on the baseline where the dot was, sized to the type.
  mountStop() {
    const h = this.host;
    h.classList.add('b2-stop');
    this.anchor = document.createElement('i');
    this.anchor.className = 'b2-anchor';
    this.anchor.append(this.svg);
    h.append(this.anchor);
    this.layout();
  }
  mountBox() {
    this.host.classList.add('b2-box');
    this.host.append(this.svg);
    this.layout();
  }
  layout() {
    if (this.kind === 'stop' || this.kind === 'accent') {
      const fs = parseFloat(getComputedStyle(this.host).fontSize), d = fs * (this.size ?? SIZES[this.kind]);
      const box = d * BOX / R, dot = this.host.getBoundingClientRect().width;
      // 011: opened 0.05 em from the letter before it and seated on the baseline
      // (negative tracking pulls the period's box into the letter, so it is added back)
      const ls = parseFloat(getComputedStyle(this.host).letterSpacing) || 0;
      const gap = this.shape === 'original' ? 0.045 - Math.min(0, ls) / fs : 0.03, lift = this.shape === 'original' ? 0 : 0.012;
      Object.assign(this.svg.style, {width: box + 'px', height: box + 'px', left: (-dot + fs * gap + d / 2 - box / 2) + 'px', bottom: (-(box - d) / 2 + fs * lift) + 'px'});
    } else {
      const s = this.size ?? (this.host.getBoundingClientRect().width || SIZES[this.kind]), box = s * BOX / R;
      Object.assign(this.svg.style, {width: box + 'px', height: box + 'px'});
      this.host.style.setProperty('--b2', s + 'px'); this.px = s;
    }
  }
  hop() { if (!reduce.matches) this.hopAt = now(); }
  // The pet hop (148): anticipate (squash), spring up stretched, land and squash, settle. The droplet lags behind.
  hopPose(t) {
    const k = (t - this.hopAt) / 0.62;
    if (k < 0 || k > 1) return {y: 0, sx: 1, sy: 1, lag: 0};
    const ease = (a, b, x) => a + (b - a) * (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, x)))) / 2;
    if (k < 0.16) { const x = k / 0.16; return {y: 0, sx: ease(1, 1.16, x), sy: ease(1, 0.82, x), lag: 0}; }
    if (k < 0.62) { const x = (k - 0.16) / 0.46, arc = Math.sin(Math.PI * x); return {y: -R * 0.9 * arc, sx: x < 0.5 ? ease(1.16, 0.9, x * 2) : ease(0.9, 1, (x - 0.5) * 2), sy: x < 0.5 ? ease(0.82, 1.14, x * 2) : ease(1.14, 1, (x - 0.5) * 2), lag: arc}; }
    const x = (k - 0.62) / 0.38, wob = Math.sin(x * Math.PI * 2.2) * (1 - x);
    return {y: 0, sx: 1 + 0.14 * wob, sy: 1 - 0.16 * wob, lag: 0};
  }
  render(t) {
    if (this.shape === 'original') return this.renderOriginal(t);
    const tt = reduce.matches ? this.seed * 3 : t;
    const body = blobPath(0, 0, R, tt + this.seed * 7, this.seed, this.amp, 24, this.lobes);
    this.body.setAttribute('d', body); this.clip.setAttribute('d', body);
    // the soft inner light: a smaller blot pooled top-left, blurred, clipped to the body (clay toy, not a gloss)
    // the lit body: the same outline nudged toward the light (top left); what it leaves uncovered is the shadow crescent
    this.light.setAttribute('d', blobPath(-R * 0.12, -R * 0.15, R, tt + this.seed * 7, this.seed, this.amp, 24, this.lobes));
    const pose = this.hopPose(t);
    if (this.drop) {
      // the satellite droplet of the original blot: bottom right, breathing in and out so it melts into the body
      const a = 0.72 + 0.18 * Math.sin(tt * 0.31 + this.seed), dist = R * (1.16 + 0.16 * Math.sin(tt * 0.47 + this.seed * 2)) + pose.lag * R * 0.35;
      this.dropEl.setAttribute('d', blobPath(Math.cos(a) * dist, Math.sin(a) * dist, R * (this.kind === 'stop' || this.kind === 'accent' ? 0.27 : 0.19), tt * 1.3 + this.seed, this.seed + 5, 0.1, 8));
    } else this.dropEl.setAttribute('d', '');
    this.pose.setAttribute('transform', `translate(0 ${(pose.y + R * (1 - pose.sy)).toFixed(2)}) scale(${pose.sx.toFixed(3)} ${pose.sy.toFixed(3)})`);
  }
  // The original edge, flat. Idle life (011): edge and side blots wobble 6 to 10 px and 2 to 4 degrees over 6 to 9 s,
  // each on its own beat; the pause control stops it with everything else.
  renderOriginal(t) {
    const tt = reduce.matches ? this.seed * 3 : t, pose = this.hopPose(t);
    if (!this.drawn) {
      this.body.setAttribute('d', origPath(0, 0, R, this.simple ? SIMPLE : ORIGINAL, this.rot, this.aspect, this.simple ? 64 : 256));
      this.clip.setAttribute('d', 'M0 0Z'); this.light.setAttribute('d', ''); this.drawn = true;
    }
    if (this.drop) {
      const a = ((this.clock - 3) / 12) * Math.PI * 2, dist = R * (DROP.dist + pose.lag * 0.35);
      this.dropEl.setAttribute('d', origPath(Math.cos(a) * dist, Math.sin(a) * dist, R * DROP.r, SIMPLE, this.rot, 1, 24));
    } else this.dropEl.setAttribute('d', '');
    let wob = '';
    if (this.kind === 'edge' || this.kind === 'side') {
      const P = 6 + ((this.seed * 1.7) % 3), w = (2 * Math.PI * tt) / P, u = (2 * R) / (this.px || 64), amp = 6 + ((this.seed * 3.3) % 4);
      wob = ` translate(${(amp * Math.sin(w + this.seed) * u).toFixed(2)} ${(amp * 0.7 * Math.cos(w * 0.8 + this.seed * 1.3) * u).toFixed(2)}) rotate(${((2 + ((this.seed * 1.9) % 2)) * Math.sin(w + this.seed * 0.7)).toFixed(2)})`;
    }
    this.pose.setAttribute('transform', `translate(0 ${(pose.y + R * (1 - pose.sy)).toFixed(2)}) scale(${pose.sx.toFixed(3)} ${pose.sy.toFixed(3)})${wob}`);
  }
}

const now = () => (manual ? clockT : performance.now() / 1000);
function frame() {
  raf = 0;
  if (manual || paused || reduce.matches || document.hidden) return;
  const t = now();
  for (const b of blots) {
    if (!b.visible) continue;
    if (b.autoHop && t > b.nextHop) { b.hop(); b.nextHop = t + 4.5 + ((b.seed * 7.3) % 3); }
    b.render(t);
  }
  raf = requestAnimationFrame(frame);
}
function wake() { if (!raf && !manual && !paused) raf = requestAnimationFrame(frame); }

function injectCSS() {
  if (document.getElementById('blot2-css')) return;
  const s = document.createElement('style');
  s.id = 'blot2-css';
  s.textContent = `.b2-stop{position:relative;color:transparent}
.b2-anchor{position:relative;display:inline-block;width:0;height:0;vertical-align:baseline}
.b2-stop .b2-svg{position:absolute;overflow:visible;pointer-events:none}
.b2-box{display:block;width:var(--b2);height:var(--b2);position:relative}
.b2-box .b2-svg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);overflow:visible;pointer-events:none}`;
  document.head.append(s);
}

export function mount(el, opts = {}) {
  injectCSS();
  const b = new Blot(el, opts);
  b.autoHop = !!opts.autoHop;
  b.nextHop = now() + 1.2 + (b.seed % 2);
  blots.add(b);
  if (typeof IntersectionObserver === 'function') {
    io ??= new IntersectionObserver((es) => { for (const e of es) { const x = [...blots].find((q) => q.host === e.target); if (x) x.visible = e.isIntersecting; } wake(); }, {rootMargin: '25% 0px'});
    io.observe(el);
  }
  if (opts.hopOnHover) el.addEventListener('pointerenter', () => { b.hop(); wake(); });
  wake();
  return b;
}
export function mountAll(root = document) {
  return [...root.querySelectorAll('[data-blot2]')].map((el) => {
    const d = el.dataset;
    return mount(el, {kind: d.blot2, colour: d.colour, size: d.size ? +d.size : undefined, seed: d.seed ? +d.seed : undefined,
      drop: d.drop ? d.drop !== 'false' : undefined, autoHop: 'hop' in d, hopOnHover: 'hop' in d});
  });
}
addEventListener('resize', () => { for (const b of blots) b.layout(); });
document.addEventListener('visibilitychange', wake);
reduce.addEventListener?.('change', () => { for (const b of blots) b.render(now()); wake(); });

export function setPaused(v) { paused = v; if (!v) wake(); }
// Capture hooks: freeze the clock and step it by hand.
export function manualClock(on = true) { manual = on; if (on && raf) { cancelAnimationFrame(raf); raf = 0; } if (!on) wake(); }
export function renderAt(t) { clockT = t; for (const b of blots) { if (b.autoHop && b.nextHop - t > 8) b.nextHop = t + 1 + (b.seed % 2); if (b.autoHop && t >= b.nextHop) { b.hopAt = t; b.nextHop = t + 4.5 + ((b.seed * 7.3) % 3); } b.render(t); } }
export const _blots = blots;
export const blotFor = (el) => [...blots].find((b) => b.host === el);
