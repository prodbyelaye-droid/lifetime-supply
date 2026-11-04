// Everything, day one (landing task 012; critic 006 section 4). Port, don't invent.
// The vault: the box he liked (22:39 "See, I like that box with the gradient in it."; evidence/004/before-features.jpg,
// the GRAD 155 rebuild) ported back 1:1 as measured colour: its art panel sampled into a 10 x 6 grid of its own mean
// colours (lock tile and white blot masked, filled from neighbours), each colour stop deepened about 9 L* (capped at
// L* 65; the white bloom at the foot kept white), drawn back smooth with bicubic interpolation. On it, 155's own
// construction: fine grain, the white glitter arch rising from the foot, three crisp white pixel sparkles at 155's
// size, and the original ragged white blot (blot2). No MP4 (X28), no disc, no cartoon cloud.
// The other six boxes: no header strips. A (default, restraint): white with ink, colour only in the vault (019, critic
// 015: "how i did it" lost its 183 bloom, which repeated the deep tile). B (?boxes=bloom): each gets its own soft bloom of a different liked gradient (the GRADCODE modules,
// deep variant) rising from one corner and shading into white like 145, about 180 px, no hard edge.
// Glyphs: one custom set on 183's agent-symbol construction (solid, symmetric unions of circles: the six-petal
// flower, the hourglass, the gear with a hole, the ring), 60 px, in ink (white reaches only 2.8:1 on the vault).
import {drawGrid} from './blend10.js';
import {mount as g183} from './gradcode/grad-183.js';
import {mount as g189} from './gradcode/grad-189.js';
import {mount as g010} from './gradcode/grad-010.js';
import {mount as g044} from './gradcode/grad-044.js';
import {mount as g145} from './gradcode/grad-145.js';
import {mount as g037} from './gradcode/grad-037.js';

const VAULT = [
  ['#e37e5c', '#e37f59', '#e3824d', '#e3844a', '#e38746', '#e18842', '#e18d48', '#d48e4f', '#b89875', '#a69b97'],
  ['#e37e6a', '#e37e5f', '#e38050', '#e38347', '#e38543', '#e38741', '#e18841', '#db9050', '#bb9775', '#a09d97'],
  ['#e38183', '#e37e6d', '#e37f57', '#e38147', '#e38242', '#e38641', '#e28740', '#e08f4e', '#c79a77', '#a49c97'],
  ['#e58995', '#e58d85', '#e48d6f', '#e38652', '#e6955f', '#ecb386', '#e6975a', '#e6a16c', '#d8b59b', '#b9acaa'],
  ['#eeacbd', '#f1c3c2', '#f1c6ba', '#edaf8f', '#f1cdb5', '#f5eae0', '#f1d0b6', '#f0dac6', '#eee8e2', '#dedadc'],
  ['#f6e4f0', '#f6ecf1', '#f6eded', '#f5e6df', '#f5efe9', '#f4f4ef', '#f5f3ec', '#f4f5f1', '#f2f6f6', '#f0f3f4'],
];
// 183's construction on a 24-unit grid: circles [x, y, r] merged by a goo filter, holes punched after.
const GLYPH = {
  vault: {c: [[12, 12, 3.3], ...[0, 1, 2, 3, 4, 5].map((i) => [12 + 6.4 * Math.cos(i * Math.PI / 3 + Math.PI / 6), 12 + 6.4 * Math.sin(i * Math.PI / 3 + Math.PI / 6), 3.7])]},
  how: {c: [[7.5, 6.5, 4.6], [16.5, 6.5, 4.6], [12, 5.5, 4.6], [7.5, 17.5, 4.6], [16.5, 17.5, 4.6], [12, 18.5, 4.6], [12, 12, 2.4]]},
  // 015: kit, room and month rebuilt on 183's mirrored, dotted construction (as the board is), no two alike
  kit: {c: [[12, 5.2, 3.7], [12, 12, 3.9], [12, 18.8, 3.7], [4, 12, 1.9], [20, 12, 1.9]]},
  board: {c: [[7.2, 8.6, 3.6], [16.8, 8.6, 3.6], [7.2, 15.4, 3.6], [16.8, 15.4, 3.6], [12, 12, 2.2], [12, 2.9, 1.9], [12, 21.1, 1.9]]},
  room: {c: [[7, 12, 4.7], [17, 12, 4.7], [3.6, 3.6, 1.8], [20.4, 3.6, 1.8], [3.6, 20.4, 1.8], [20.4, 20.4, 1.8]]},
  month: {c: [[12, 5.6, 3.2], [18.4, 12, 3.2], [12, 18.4, 3.2], [5.6, 12, 3.2], [12, 12, 2.4], [5.2, 5.2, 1.4], [18.8, 5.2, 1.4], [5.2, 18.8, 1.4], [18.8, 18.8, 1.4]]},
  forever: {c: [[7, 12, 5.3], [17, 12, 5.3], [12, 12, 2.2]], h: [[7, 12, 2], [17, 12, 2]]},
};
function glyph(id, name, colour) {
  const {c, h = []} = GLYPH[name];
  return `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true"><defs>
    <filter id="${id}-goo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9"/></filter>
    <mask id="${id}-m"><rect width="24" height="24" fill="#fff"/>${h.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000"/>`).join('')}</mask></defs>
    <g mask="url(#${id}-m)"><g filter="url(#${id}-goo)" fill="${colour}">${c.map(([x, y, r]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}"/>`).join('')}</g></g></svg>`;
}
// 155's pixel symbols (from the 2160 px original), at its size: 5 px blocks
const PIX = {plus: ['.#.', '###', '.#.'], x: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#']};
const pix = (name, x, y, s) => PIX[name].map((r, j) => [...r].map((c, i) => (c === '#' ? `<rect x="${x + i * s}" y="${y + j * s}" width="${s}" height="${s}"/>` : '')).join('')).join('');
// a fixed seed so every load (and every capture) shows the same glitter and grain
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function vaultArt(panel, arch = true) {
  const r = panel.getBoundingClientRect(), W = Math.round(r.width) || 800, H = Math.round(r.height) || 340;
  const field = document.createElement('canvas'); field.className = 'vault-field';
  drawGrid(field, VAULT, 200, Math.round(200 * H / W));
  // fine grain: 155's film grain, a static monochrome noise at low alpha
  const grain = document.createElement('canvas'); grain.className = 'vault-grain'; grain.width = W; grain.height = H;
  const gx = grain.getContext('2d'), img = gx.createImageData(W, H), rand = rng(155);
  for (let i = 0; i < img.data.length; i += 4) { const v = rand() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 16; }
  gx.putImageData(img, 0, 0);
  // the white glitter arch: a wide arc rising from the foot, white glitter thick at its edge and thinning inward,
  // settling into white at the bottom (155)
  // 015: 155's own geometry, wider than the panel with both feet off its sides and the crest in the lower third (it
  // reads as light rising, not a hill); ?vault=bloom drops the arch for the liked box's plain bloom into white
  const R = W * 1.15, cx = W * 0.5, top = H * 0.7, cy = top + R, dots = [], rand2 = rng(2160);
  for (let i = 0; i < (arch ? 900 : 0); i++) {
    const a = -Math.PI / 2 + (rand2() - 0.5) * 1.1, depth = Math.pow(rand2(), 2.2) * H * 0.3, rr = R - depth;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (x < 0 || x > W || y > H) continue;
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + rand2() * 1.6).toFixed(2)}" opacity="${(0.55 + rand2() * 0.45).toFixed(2)}"/>`);
  }
  const svg = `<svg class="vault-arch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs>
    <radialGradient id="va-g" cx="${cx}" cy="${cy}" r="${R}" gradientUnits="userSpaceOnUse"><stop offset=".72" stop-color="#fff"/><stop offset=".93" stop-color="#fff" stop-opacity=".78"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></radialGradient></defs>
    ${arch ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#va-g)"/>` : ''}<g fill="#fff">${dots.join('')}</g>
    <g fill="#fff" class="pix">${pix('plus', W * 0.7, H * 0.16, 5)}${pix('plus', W * 0.7 - 34, H * 0.16 + 26, 5)}${pix('x', W * 0.7 + 18, H * 0.16 + 34, 5)}</g></svg>`;
  panel.prepend(field, grain);
  panel.insertAdjacentHTML('beforeend', svg);
  panel.insertAdjacentHTML('beforeend', glyph('g-vault', 'vault', '#151517')); // ink: white tops out at 2.8:1 on the deepened field
}
// Each box: [class, glyph, bloom module, corner]
const BOXES = [['f-how', 'how', g183, 'tr', 'green'], ['f-kit', 'kit', g044, 'tr'], ['f-board', 'board', g037, 'tr'], ['f-room', 'room', g189, 'tr'],
  ['f-month', 'month', g010, 'tr'], ['f-forever', 'forever', g145, 'tr']];
// a GRADCODE field drawn once into a 2D canvas, then its WebGL context released (six blooms, no six live contexts)
// 015: a bloom never reaches the text: its radius stops 12 px short of the copy's nearest point from the corner.
// pick 'green' crops the module to its own deepest green (183's deep green for "how i did it": no brown).
function bloom(box, mod, corner, pick) {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-9999px;top:0;width:360px;height:360px';
  document.body.append(host);
  const g = mod(host, {manual: true, size: {width: 360, height: 360}, deep: 1.25});
  g.renderAt(g.source.duration ? 1.2 : 0);
  let sx = 0, sy = 0, sw = 360;
  if (pick === 'green') {
    const tmp = document.createElement('canvas'); tmp.width = tmp.height = 360; const tx = tmp.getContext('2d'); tx.drawImage(g.canvas, 0, 0);
    const px = tx.getImageData(0, 0, 360, 360).data; let best = -1e9;
    for (let y = 0; y <= 240; y += 12) for (let x = 0; x <= 240; x += 12) {
      let sc = 0; for (let j = 0; j < 120; j += 12) for (let i = 0; i < 120; i += 12) { const o = ((y + j) * 360 + x + i) * 4, r = px[o], gg = px[o + 1], b = px[o + 2]; sc += (gg - Math.max(r, b)) - 0.6 * (r + gg + b) / 3 - (r > gg ? 200 : 0); }
      if (sc > best) { best = sc; sx = x; sy = y; }
    }
    sw = 120;
  }
  const out = document.createElement('canvas'); out.className = `bloom bloom-${corner}`; out.width = out.height = 360; out.setAttribute('aria-hidden', 'true');
  out.getContext('2d').drawImage(g.canvas, sx, sy, sw, sw, 0, 0, 360, 360);
  g.pause(); g.canvas.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext(); host.remove();
  box.prepend(out);
  const fit = () => {
    const b = box.getBoundingClientRect(), copy = box.querySelector('.feature-copy'), rects = [...copy.children].map((e) => e.getBoundingClientRect()).filter((r) => r.width);
    const cx = corner === 'tr' ? b.right : b.right, cy = corner === 'tr' ? b.top : b.bottom;
    const d = Math.min(...rects.map((r) => Math.hypot(Math.max(0, r.left - cx, cx - r.right), Math.max(0, r.top - cy, cy - r.bottom))));
    const rad = Math.max(60, Math.min(180, d - 12)); out.style.width = out.style.height = rad * 2 + 'px';
    out.style[corner === 'tr' ? 'top' : 'bottom'] = -rad + 'px'; out.style.right = -rad + 'px';
  };
  fit(); new ResizeObserver(fit).observe(box);
}
export function createFeatures(variant = 'restraint', vault = 'arch') {
  const section = document.querySelector('.features');
  section.dataset.boxes = variant;
  vaultArt(section.querySelector('.f-vault .feature-art'), vault !== 'bloom');
  for (const [cls, name, mod, corner, pick] of BOXES) {
    const box = section.querySelector('.' + cls), panel = box.querySelector('.feature-art');
    panel.insertAdjacentHTML('afterbegin', glyph(`g-${name}`, name, '#151517'));
    if (variant === 'bloom') { box.classList.add('has-bloom'); bloom(box, mod, corner, pick); }
  }
}
