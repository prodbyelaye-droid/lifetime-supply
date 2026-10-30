// opus 076 · the hero cast: one character, the rest eyeless colour splats (pick 21 = B; eyes pick 32 A, opus 089).
// node design/hero-076-gen.cjs  → writes assets/hero-076/*.svg and js/hero-076-cast.js (data only).
// Sources:
//   the character's outline = the portal blot's clean outline (engine.ts OUTLINE, codex-design 27 blot-white.svg), so the
//   landing's one character is the same character members meet in the portal;
//   its eyes = opus 089 eyes.ts A, painted circles (eyePaths(): left 93 % of the right, 3/4/5-lobe rim wobble, tilt);
//   splat colours = cdesign 059 A accents with opus 069's two shifts (periwinkle → lilac #A99BF8, sea glass → mint #9BEFB0);
//   splat shapes = ours: a lopsided body, one short drip that hugs it and one notch (critic 066 #7, 069 SMALL_PATH rule).
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'assets/hero-076');
fs.mkdirSync(path.join(out, 'eyeless'), {recursive: true});

const OUTLINE = 'M 113.000 17.000 C 119.970 15.640 120.240 15.640 125.000 17.000 C 129.760 18.360 135.390 23.300 141.000 25.000 C 146.610 26.700 146.950 21.900 158.000 27.000 C 169.050 32.100 193.760 45.480 206.000 55.000 C 218.240 64.520 224.050 73.650 230.000 83.000 C 235.950 92.350 238.790 99.800 241.000 110.000 C 243.210 120.200 244.870 132.290 243.000 143.000 C 241.130 153.710 240.200 159.910 230.000 173.000 C 219.800 186.090 196.600 208.950 183.000 220.000 C 169.400 231.050 165.130 236.130 150.000 238.000 C 134.870 239.870 108.620 234.570 94.000 231.000 C 79.380 227.430 72.330 221.930 64.000 217.000 C 55.670 212.070 49.590 207.780 45.000 202.000 C 40.410 196.220 40.910 188.780 37.000 183.000 C 33.090 177.220 24.550 174.800 22.000 168.000 C 19.450 161.200 23.530 150.140 22.000 143.000 C 20.470 135.860 12.320 136.370 13.000 126.000 C 13.680 115.630 20.050 92.370 26.000 82.000 C 31.950 71.630 42.900 70.780 48.000 65.000 C 53.100 59.220 49.880 54.800 56.000 48.000 C 62.120 41.200 74.310 30.270 84.000 25.000 C 93.690 19.730 106.030 18.360 113.000 17.000 Z';

// ---- opus 089 eyes.ts, A (EYE_DEFAULT), ported 1:1 ----
const ER = 0.084, A = {x: 2 * ER, y: 0.262, R: ER, wob: 0.022, leftSize: 0.93, tilt: 0.05, leftTilt: 0.06};
const K = 256 / 1.4, bx = (x) => (x + 0.7) * K, by = (y) => (0.7 - y) * K;
const wobble = (w, a, ph) => 1 + w * (0.5 * Math.sin(3 * a + ph) + 0.3 * Math.sin(5 * a + 2.1 * ph) + 0.2 * Math.sin(4 * a - ph));
const f2 = (n) => n.toFixed(2);
// eye i in the 256 box at openness o (1 open … 0 shut). o = 1 is exactly eyePaths('A'). Closing follows the shader's
// roundF: the eye flattens to a hairline (R × 0.1) that sags 0.16 R into a lid, so it is never a flat dash.
function eyePts(i, o = 1, n = 40) {
  const side = i === 0 ? -1 : 1, r = A.R * (i === 0 ? A.leftSize : 1), ph = i === 0 ? 1.7 : 0.4;
  const ang = side * A.tilt + (i === 0 ? A.leftTilt : 0) * side, cx = side * A.x, cy = A.y, pts = [];
  const ry = r * 0.1 + (r - r * 0.1) * o;
  for (let j = 0; j < n; j++) {
    const a = (j / n) * Math.PI * 2, la = Math.atan2(Math.sin(a), side * Math.cos(a)), rr = wobble(A.wob, la, ph);
    const lx = Math.cos(a) * r * rr, xn = Math.max(-1, Math.min(1, lx / r));
    const ly = Math.sin(a) * ry * rr - (1 - o) * 0.16 * r * (1 - xn * xn); // y up in q; the sag goes down
    pts.push([bx(cx + Math.cos(ang) * lx - Math.sin(ang) * ly), by(cy + Math.sin(ang) * lx + Math.cos(ang) * ly)]);
  }
  return pts;
}
const poly = (pts) => 'M' + pts.map((p) => `${f2(p[0])} ${f2(p[1])}`).join('L') + 'Z';

// ---- splats ----
function closedPath(pts) {
  const n = pts.length; let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f2(p1[0] + (p2[0] - p0[0]) / 6)} ${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)} ${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])} ${f2(p2[1])}`;
  }
  return d + 'Z';
}
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - (h * h * k) / 4; };
const smax = (a, b, k) => -smin(-a, -b, k);
const rad = (deg) => (deg * Math.PI) / 180; // screen angles: 0° = 3 o'clock, 90° = 6 o'clock (SVG y down)
// s: {R, a2, p2, a3, p3, a5, p5, drip: [deg, size], notch: [deg, size]}
function splat(s) {
  const C = 128, R = s.R;
  const rBody = (t) => R * (1 + s.a2 * Math.cos(2 * (t - rad(s.p2))) + s.a3 * Math.cos(3 * (t - rad(s.p3))) + s.a5 * Math.cos(5 * (t - rad(s.p5))));
  const dt = rad(s.drip[0]), nt = rad(s.notch[0]);
  const re = rBody(dt), dr = s.drip[1] * R, dc = [Math.cos(dt) * (re + dr * 0.25), Math.sin(dt) * (re + dr * 0.25)];
  const rn = rBody(nt), nr = s.notch[1] * R, nc = [Math.cos(nt) * (rn + nr * 0.55), Math.sin(nt) * (rn + nr * 0.55)];
  const field = (x, y) => {
    const t = Math.atan2(y, x), body = Math.hypot(x, y) - rBody(t);
    const drip = Math.hypot(x - dc[0], y - dc[1]) - dr;
    const notch = Math.hypot(x - nc[0], y - nc[1]) - nr;
    return smax(smin(body, drip, R * 0.16), -notch, R * 0.08);
  };
  const pts = [], n = 96;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t), si = Math.sin(t);
    // the last inside point along the ray (from outside in), refined by bisection
    let rho = 2 * R; while (rho > 0 && field(c * rho, si * rho) > 0) rho -= 0.25;
    let lo = rho, hi = rho + 0.25; for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; if (field(c * m, si * m) > 0) hi = m; else lo = m; }
    pts.push([C + c * lo, C + si * lo]);
  }
  return closedPath(pts);
}
// different shapes, each with one drip and one notch at its own clock position; drips run downward (paint), never
// up or sideways like a stem or tail (GO-069 fix 2)
const SPLATS = {
  a: {R: 84, a2: 0.15, p2: -18, a3: 0.06, p3: 40, a5: 0.025, p5: 10, drip: [62, 0.2], notch: [196, 0.26]},   // a wide bean, drip lower right
  b: {R: 86, a2: 0.07, p2: 30, a3: 0.11, p3: -90, a5: 0.03, p5: 70, drip: [118, 0.19], notch: [-52, 0.25]},  // a soft triangle, drip lower left
  c: {R: 82, a2: 0.17, p2: 64, a3: 0.05, p3: 160, a5: 0.02, p5: -30, drip: [35, 0.21], notch: [100, 0.22]},   // tall and leaning
  d: {R: 84, a2: 0.13, p2: 8, a3: 0.08, p3: 120, a5: 0.03, p5: 45, drip: [150, 0.2], notch: [-92, 0.28]},    // a kidney: the notch bites its long top
  // the feature cards' small blots (39 px): eyeless now, so each takes its own splat; none reads as an oval
  e: {R: 86, a2: 0.12, p2: -60, a3: 0.09, p3: 15, a5: 0.03, p5: 0, drip: [95, 0.2], notch: [-150, 0.26]},
  f: {R: 84, a2: 0.16, p2: 35, a3: 0.07, p3: -100, a5: 0.025, p5: 20, drip: [110, 0.19], notch: [140, 0.25]},
  g: {R: 86, a2: 0.09, p2: 80, a3: 0.12, p3: 30, a5: 0.03, p5: -40, drip: [40, 0.21], notch: [-120, 0.24]},
  h: {R: 84, a2: 0.15, p2: -5, a3: 0.06, p3: -60, a5: 0.03, p5: 30, drip: [140, 0.2], notch: [-30, 0.27]},
  i: {R: 86, a2: 0.11, p2: 120, a3: 0.1, p3: 70, a5: 0.025, p5: 10, drip: [55, 0.19], notch: [60, 0.25]},
  j: {R: 84, a2: 0.14, p2: 50, a3: 0.08, p3: -20, a5: 0.03, p5: 60, drip: [130, 0.21], notch: [-10, 0.24]},
  k: {R: 86, a2: 0.1, p2: -35, a3: 0.11, p3: 100, a5: 0.025, p5: -15, drip: [88, 0.2], notch: [210, 0.27]},
};
// cdesign 059 A + opus 069's two shifts (blot-colours.json on el/89-eyes-round). Never all six side by side.
const COL = {v1: '#11B1F8', pink: '#FC82CB', orchid: '#EB7BEF', sun: '#FCD16E', lilac: '#A99BF8', coral: '#FFBDA6', mint: '#9BEFB0'};
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${body}</svg>\n`;
const splatD = Object.fromEntries(Object.entries(SPLATS).map(([k, s]) => [k, splat(s)]));
for (const [k, d] of Object.entries(splatD)) fs.writeFileSync(path.join(out, `splat-${k}.svg`), svg(`<path fill="#7C8794" d="${d}"/>`));
const eyesOpen = [0, 1].map((i) => poly(eyePts(i, 1)));
for (const c of ['v1', 'lilac']) fs.writeFileSync(path.join(out, `face-${c}.svg`), svg(`<path fill="${COL[c]}" d="${OUTLINE}"/><g fill="#fff">${eyesOpen.map((d) => `<path d="${d}"/>`).join('')}</g>`));

// the runtime data the hero reads (hero-design.js): outline, splats, colours, and the eye drawing as numbers so the blink
// can be drawn at any openness on the hero's own clock
const eyeSpec = {...A, K, box: 256};
fs.writeFileSync(path.join(root, 'js/hero-076-cast.js'), `// generated by design/hero-076-gen.cjs (opus 076). Do not edit by hand.
export const OUTLINE = ${JSON.stringify(OUTLINE)};
export const SPLATS = ${JSON.stringify(Object.fromEntries('abcd'.split('').map((k) => [k, splatD[k]])), null, 1)};
export const COLOURS = ${JSON.stringify(COL)};
export const EYE = ${JSON.stringify(eyeSpec)};
`);

// ---- one face per screen: eyeless copies of the page's other eyed blots (the white eye group removed, nothing else),
// with 069's two shifts applied where they use the old periwinkle or sea glass ----
const SHIFT = {'#7C85F5': COL.lilac, '#3CE7B9': COL.mint};
const strip = (src, dst) => {
  let s = fs.readFileSync(path.join(root, src), 'utf8');
  const before = s.length;
  s = s.replace(/<g fill="#fff">(?:<rect[^>]*\/>)+<\/g>/g, '');
  if (s.length === before) throw new Error('no eye group in ' + src);
  for (const [a, b] of Object.entries(SHIFT)) s = s.split(`fill="${a}"`).join(`fill="${b}"`);
  fs.writeFileSync(path.join(out, 'eyeless', dst), s);
};
strip('assets/flow-v1/deep-189.svg', 'deep-189.svg');
// the 39 px feature-card blots: the card's own colour (069 shifts applied), drawn as its own eyeless splat
const fill = (src) => { const c = fs.readFileSync(path.join(root, src), 'utf8').match(/fill="(#[0-9A-Fa-f]{6})"/)[1].toUpperCase(); return SHIFT[c] || c; };
const FEAT = [['assets/assembly/vault-blot-223.svg', 'vault-blot-223.svg', 'e'], ...[1, 2, 3, 4, 5, 6].map((i, k) => [`assets/features-r2/blot-${i}.svg`, `features-blot-${i}.svg`, 'fghijk'[k]])];
for (const [src, dst, k] of FEAT) fs.writeFileSync(path.join(out, 'eyeless', dst), svg(`<path fill="${fill(src)}" d="${splatD[k]}"/>`));
console.log('ok', Object.keys(splatD).map((k) => `${k}:${splatD[k].length}`).join(' '));
