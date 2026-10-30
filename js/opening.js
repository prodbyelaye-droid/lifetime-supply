// The opening (Elaye 00:23, 23:56, 23:52; corrections in landing task 004): a minimalist centred heading on white;
// small cartoon blots around the page edges in many deep colours (no orange), never behind or touching the text, and
// interactive (180: "Just as long as it comes across as interactive"; 22:39: "The dot ... is just sitting there"):
// they lean away from the cursor, hop when it reaches them and drift at their own depth as you scroll. Then the
// film comes down onto the hero field, and side blobs carry on
// down the page edges (20:41: "just around the sides"). Nothing is pinned.
import {blotFor} from './blot2.js';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), smooth = (k) => k * k * (3 - 2 * k);
// 155's pixel symbols (the sparkle cross and the x-diamond, from the 2160 px original) and a pixel blot alluding to
// the blot. A variant behind LANDING.pixels, off by default; 'face' gives the pixel blot a mouth and no eyes
// (19:34 "I wouldn't want eyes and stuff"; 23:56 "like a little face. I don't know.").
const GLYPHS = {
  plus: ['.#.', '###', '.#.'],
  diamond: ['#...#', '..#..', '.###.', '..#..', '#...#'],
  blot: ['.###...', '#####..', '######.', '######.', '.####..', '.....#.'],
  face: ['.###...', '#####..', '######.', '##..##.', '.####..', '.....#.'],
};
function glyph(name, colour, px) {
  const rows = GLYPHS[name], w = rows[0].length, h = rows.length;
  let rects = '';
  rows.forEach((r, y) => [...r].forEach((c, x) => { if (c === '#') rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
  const el = document.createElement('i');
  el.className = `px px-${name}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w * px}" height="${h * px}" fill="${colour}" shape-rendering="crispEdges">${rects}</svg>`;
  return el;
}
// Side blobs down the page: [section, side, colourway, size]. 019: the price blob is 183's green (critic 015), not orange.
const SIDES = [['#inside', 'left', 'green', 170], ['#flow', 'right', 'magenta', 190], ['#stats', 'left', 'teal', 150], ['#features', 'right', 'violet', 200],
  ['#portal', 'left', 'rose', 160], ['#steps', 'right', 'sky', 170], ['#price', 'left', 'green', 180], ['.questions', 'right', 'pink', 150]];

export function createOpening(reduced, mode = 'off') {
  const opening = document.querySelector('.opening'), hero = opening.querySelector('.hero');
  const copy = opening.querySelector('.hero-copy'), film = opening.querySelector('.demo-film');
  const edges = [...opening.querySelectorAll('.ob')];
  const layer = opening.querySelector('.opening-blots');
  const pix = mode === 'off' ? [] : [glyph('plus', '#fff', 11), glyph('diamond', '#fff', 8), glyph(mode === 'face' ? 'face' : 'blot', '#fff', 7)];
  pix.forEach((p, i) => { p.style.animationDelay = `${-i * 0.9}s`; edges[[0, 2, 1][i]].append(p); });

  // the side layer spans the document; its blobs sit half off the page, in the margins only (desktop)
  const sideLayer = document.createElement('div');
  sideLayer.className = 'side-layer'; sideLayer.setAttribute('aria-hidden', 'true');
  document.body.append(sideLayer);
  const sides = SIDES.filter(([sel]) => !document.querySelector(sel)?.closest('[hidden]')).map(([sel, side, colour, size], i) => {
    const el = document.createElement('span');
    el.className = 'sb'; el.dataset.blot2 = 'side'; el.dataset.colour = colour; el.dataset.size = size; el.dataset.seed = (i * 1.37 + 0.5).toFixed(2);
    sideLayer.append(el);
    return {el, sel, side, size, off: {x: 0, y: 0}, hopAt: -9};
  });

  let geo = null;
  function measure() {
    const o = opening.getBoundingClientRect(), h = hero.getBoundingClientRect(), W = o.width;
    const kids = [...copy.children].map((k) => k.getBoundingClientRect());
    const text = {l: Math.min(...kids.map((k) => k.left)) - o.left, r: Math.max(...kids.map((k) => k.right)) - o.left, t: kids[0].top - o.top, b: kids[kids.length - 1].bottom - o.top};
    const h1el = copy.querySelector('h1'), rng = document.createRange(); rng.selectNodeContents(h1el);
    const lines = [...rng.getClientRects()], h1 = {left: Math.min(...lines.map((l) => l.left)), right: Math.max(...lines.map((l) => l.right)), top: h1el.getBoundingClientRect().top};
    const act = copy.querySelector('.actions').getBoundingClientRect();
    const phone = W < 700, H = h.height;
    // Edge spots [x, y, size, scroll depth]: out in the margins on desktop; above and below the copy on a phone.
    const spots = phone
      // 107 (critic 106 §1.9): no blot in the CTA's rows on a phone. One sits above each end of the headline, one low
      // in the left margin, clear of the price line by 40px.
      ? [[38, text.t - 32, 36, 0.18], [30, text.b + 58, 34, 0.1], [W - 42, text.t - 44, 38, 0.26], [-999, 0, 1, 0], [-999, 0, 1, 0]]
      : [[W * 0.075, H * 0.36, 72, 0.16], [W * 0.91, H * 0.58, 62, 0.28], [W * 0.87, H * 0.86, 86, 0.1], [W * 0.15, H * 0.82, 42, 0.32], [W * 0.035, H * 0.64, 40, 0.22]];
    const pxs = phone
      ? [[text.l + 74, text.t - 46], [text.r - 30, text.t - 40], [text.l + 8, text.b + 24]]
      : [[h1.left - o.left - 70, h1.top - o.top + 14], [h1.right - o.left + 26, h1.top - o.top - 6], [act.left - o.left - 96, act.top - o.top + 14]];
    const docH = document.documentElement.scrollHeight;
    sideLayer.style.height = docH + 'px';
    const showSides = innerWidth >= 1280;
    sides.forEach((s) => {
      const t = document.querySelector(s.sel); if (!t) return;
      const r = t.getBoundingClientRect();
      s.x = s.side === 'left' ? -0.56 * s.size : innerWidth - 0.44 * s.size;
      s.y = r.top + scrollY + Math.min(r.height * 0.35, 320) - s.size / 2;
      // 011 (critic 006): clear every card by at least 24 px, plus 10 px for the idle wobble; hide if little would show
      const cards = [...t.querySelectorAll('article,.split,.stats-shell,.portal-arch,.price-stage,.faq,.step-grid,.chat178,.contact-stage')].map((c) => c.getBoundingClientRect()).filter((c) => c.width);
      if (cards.length) s.x = s.side === 'left' ? Math.min(s.x, Math.min(...cards.map((c) => c.left)) - 34 - s.size) : Math.max(s.x, Math.max(...cards.map((c) => c.right)) + 34);
      const shown = s.side === 'left' ? s.x + s.size : innerWidth - s.x;
      s.el.style.display = showSides && shown > s.size * 0.3 ? '' : 'none';
    });
    geo = {W, H, top: o.top + scrollY, spots, pxs, textBottom: text.b, textLeft: text.l, textRight: text.r, offs: edges.map(() => ({x: 0, y: 0}))};
    edges.forEach((b, i) => { b.dataset.size = spots[i][2]; b.style.setProperty('--b2', spots[i][2] + 'px'); });
  }
  measure();
  // clanding 012: the rejected dot flood is retired, including its hidden WebGL work.
  // A has no separate flood. B is a static, opt-in V1 field (flood-choice.js/CSS).
  // New scroll swelling belongs to Opus; existing hero and film motion is preserved.

  const pointer = {x: -9999, y: -9999};
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY + scrollY; wake(); }, {passive: true});
  addEventListener('pointerleave', () => { pointer.x = pointer.y = -9999; });

  let time = 0, raf = 0, last = 0, paused = false, manual = false;
  // lean away from the cursor (springy), hop when it arrives; returns the eased offset
  function react(off, cx, cy, size, b, t, hopRef) {
    const dx = cx - pointer.x, dy = cy - pointer.y, d = Math.hypot(dx, dy), reach = 150 + size;
    const push = d < reach && !reduced.matches ? Math.pow(1 - d / reach, 2) * 38 : 0;
    off.x += ((d ? dx / d : 0) * push - off.x) * 0.14;
    off.y += ((d ? dy / d : 0) * push - off.y) * 0.14;
    if (b && d < size * 0.6 + 26 && t - hopRef.at > 1.4) { hopRef.at = t; b.hop(); }
    return off;
  }
  const hops = edges.map(() => ({at: -9}));
  function draw() {
    if (!geo) measure();
    const t = reduced.matches ? 0 : time, sy = scrollY;
    edges.forEach((el, i) => {
      const [x, y, s, depth] = geo.spots[i], b = blotFor(el);
      const bob = 0, sway = 0; // 011: the idle wobble lives in blot2 (6 to 10 px, 2 to 4 degrees, 6 to 9 s per blot)
      const par = reduced.matches ? 0 : -Math.min(sy, geo.H) * depth;
      const off = react(geo.offs[i], geo.top + x, geo.top + y + par, s, b, t, hops[i]);
      // 011 (critic 006: they faded through pastel ghosts): full colour throughout. Each swells a little and sinks toward
      // the colour rising below, then scales down to nothing while its own flood blot grows from the same spot.
      // Blots above the copy (on a phone) scale away in place, so none ever touches the heading.
      const below = y > geo.textBottom || x < geo.textLeft - s || x > geo.textRight + s;
      // 013: each reaches zero by 18% of a screen of scroll, before its flood blot starts (at 20%), so they never stack
      const hs = clamp((sy - geo.top) / (innerHeight * 0.18), 0, 1), g = 1 - smooth(hs), sink = below ? smooth(hs) * 60 : 0;
      el.style.transform = `translate(${(x - s / 2 + sway + off.x).toFixed(1)}px,${(y - s / 2 + bob + par + sink + off.y).toFixed(1)}px) scale(${g.toFixed(3)})`;
      el.style.visibility = g < 0.01 ? 'hidden' : '';
    });
    if (film) {
      const r = film.getBoundingClientRect(), f = smooth(clamp((innerHeight - r.top) / (innerHeight * 0.75), 0, 1));
      film.style.transform = `translateY(${((1 - f) * -110).toFixed(1)}px)`;
    } // task 010: full bleed at rest, no inset while it comes down
    const mid = sy + innerHeight / 2;
    sides.forEach((s, i) => {
      if (s.y === undefined) return;
      const drift = reduced.matches ? 0 : clamp((mid - s.y) * 0.14, -140, 140), sway = 0;
      const off = react(s.off, s.x + s.size / 2, s.y + s.size / 2 + drift, s.size, blotFor(s.el), t, s);
      s.el.style.transform = `translate(${(s.x + sway + off.x).toFixed(1)}px,${(s.y + drift + off.y).toFixed(1)}px)`;
    });
  }
  function frame(now) { raf = 0; if (manual) return; if (now - last > 16) { time += Math.min(0.1, (now - last) / 1000) || 0; last = now; draw(); } if (!paused && !reduced.matches && !document.hidden) raf = requestAnimationFrame(frame); }
  const wake = () => { if (!raf && !manual) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  addEventListener('scroll', () => { if (!manual) { draw(); wake(); } }, {passive: true});
  new ResizeObserver(() => { geo = null; draw(); }).observe(document.body);
  draw(); wake();
  return {
    setPaused(v) { paused = v; wake(); },
    renderAt(t) { manual = true; time = t; geo = null; draw(); },
    resume() { manual = false; wake(); },
  };
}
