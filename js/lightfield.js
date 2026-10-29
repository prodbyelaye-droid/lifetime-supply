// Pixel light for the feature boxes (landing task 004). The quality bar: colour built as shaped light, not a blurred
// photo, and 184 is his model for colour and minimalism ("This is the perfect example for what I mean about color and
// minimalism"): its colour is a field of crisp square cells stepping from white into deep colour, with ink over it.
// Each field here is a defined shape (a bloom from the bottom, a square glow with a white heart, an orb, a band, a
// corner, a ring), quantised into cells and tone steps, coloured from one ramp of sampled GRAD tones (light to deep).
// Motion is code: each field drifts and breathes on its own beat and steps like 184's pixels. No video, no blur.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const SHAPES = {
  // u, v in 0..1 over the panel; returns 0 (white) .. 1 (deepest)
  bloom: (u, v, t, s) => 1.25 - Math.hypot((u - 0.5 - 0.08 * Math.sin(t * 0.3 + s)) * 1.05, (v - 1.05) * 1.25) * (1 + 0.06 * Math.sin(t * 0.5 + s)),
  square: (u, v, t, s) => { const cx = 0.5 + 0.06 * Math.sin(t * 0.27 + s), cy = 0.52 + 0.05 * Math.cos(t * 0.31 + s), d = Math.max(Math.abs(u - cx) * 1.7, Math.abs(v - cy) * 1.15); return d < 0.12 ? 0.15 : 1.05 - d * 1.55; },
  orb: (u, v, t, s) => 1.1 - Math.hypot(u - 0.72 - 0.08 * Math.cos(t * 0.25 + s), (v - 0.35 - 0.07 * Math.sin(t * 0.33 + s)) * 0.75) * 2.3,
  band: (u, v, t, s) => 1 - Math.abs((u * 0.55 + v) - 0.95 - 0.12 * Math.sin(t * 0.22 + s)) * 2.6,
  corner: (u, v, t, s) => 1.12 - Math.hypot(u * (0.95 + 0.05 * Math.sin(t * 0.4 + s)), v * 1.25) * 1.25,
  ring: (u, v, t, s) => { const r = Math.hypot(u - 0.5, (v - 0.56) * 0.62), R = 0.24 + 0.03 * Math.sin(t * 0.35 + s); return 1 - Math.abs(r - R) * 6.5; },
  wave: (u, v, t, s) => 1 - Math.abs(v - 0.62 - 0.14 * Math.sin(u * 5.2 + t * 0.45 + s)) * 3.2,
};
const fields = new Set();
let raf = 0, paused = false, manual = false, last = 0;
const reduce = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};

class Field {
  constructor(canvas, {ramp, shape = 'bloom', seed = 0, cell = 12, steps}) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.ramp = ramp.map(hex); this.shape = SHAPES[shape] || SHAPES.bloom; this.seed = seed; this.cell = cell;
    this.steps = steps || ramp.length; this.visible = true; this.layout();
  }
  layout() {
    const r = this.c.getBoundingClientRect();
    this.cols = Math.max(1, Math.round(r.width / this.cell)); this.rows = Math.max(1, Math.round(r.height / this.cell));
    this.c.width = this.cols; this.c.height = this.rows; // one canvas pixel per cell; CSS scales it up crisp
    this.img = this.ctx.createImageData(this.cols, this.rows);
  }
  draw(t) {
    const {cols, rows, ramp, steps} = this, d = this.img.data;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      // crisp cells, smooth tone: each cell is one colour from the ramp (light to deep), rising out of the white
      const f = Math.round(clamp(this.shape((x + 0.5) / cols, (y + 0.5) / rows, t, this.seed), 0, 1) * 16) / 16, o = (y * cols + x) * 4;
      if (f <= 0) { d[o + 3] = 0; continue; }
      const q = f * (ramp.length - 1), i = Math.min(ramp.length - 2, Math.floor(q)), m = q - i, A = ramp[i], B = ramp[i + 1];
      d[o] = A[0] + (B[0] - A[0]) * m; d[o + 1] = A[1] + (B[1] - A[1]) * m; d[o + 2] = A[2] + (B[2] - A[2]) * m;
      d[o + 3] = 255 * Math.min(1, f * 3.2);
    }
    this.ctx.putImageData(this.img, 0, 0);
  }
}
const now = () => performance.now() / 1000;
function frame(ms) {
  raf = 0; if (paused || manual || reduce.matches || document.hidden) return;
  if (ms - last > 110) { last = ms; const t = now(); for (const f of fields) if (f.visible) f.draw(t); } // ~9 fps: the cells step, like 184's
  raf = requestAnimationFrame(frame);
}
const wake = () => { if (!raf && !paused && !manual) raf = requestAnimationFrame(frame); };
let io = null;
export function mountField(canvas, opts) {
  const f = new Field(canvas, opts); fields.add(f); f.draw(reduce.matches ? 2 : now());
  io ??= new IntersectionObserver((es) => { for (const e of es) { const x = [...fields].find((q) => q.c === e.target); if (x) x.visible = e.isIntersecting; } wake(); }, {rootMargin: '20% 0px'});
  io.observe(canvas); wake();
  return f;
}
addEventListener('resize', () => { for (const f of fields) { f.layout(); f.draw(now()); } });
export function setPaused(v) { paused = v; if (!v) wake(); }
export function renderAt(t) { manual = true; for (const f of fields) f.draw(t); }
export function resume() { manual = false; wake(); }
