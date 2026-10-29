// What's inside (landing task 004): row 10's soft multi-hue blend ("10: 100%"; 17:47 "We need it one-to-one for that
// reference on 10"), rebuilt from the original at full size: the colour half of base44's split card (04 / 04, from
// the 2000 px land-book rendition) sampled into a 12 × 15 grid of its own mean colours (its white UI card masked and
// filled from the neighbouring colour), then drawn back smooth with bicubic interpolation. It lives inside the split
// card's colour half only; the kits sit on white. It drifts slowly in code (no video).
const BLEND = {"w": 12, "h": 15, "aspect": 0.7703703703703704, "grid": [["#cbc1ca", "#cabfce", "#c9bdd4", "#c8bad7", "#cbb5d4", "#d6adc1", "#e6a4a3", "#f39c84", "#fb9a70", "#fba36f", "#f8b179", "#ebb887"], ["#cabcd2", "#c9bbd4", "#c8bad6", "#c8b9d9", "#cbb5d4", "#d6aec4", "#e5a5a6", "#f29c87", "#fa9a71", "#fba16e", "#f8af77", "#ecb887"], ["#ceb5cf", "#cbb7d4", "#c8b7d8", "#c8b7da", "#ccb3d4", "#d7adc1", "#e6a4a4", "#f29c86", "#f99970", "#fca16d", "#f8af77", "#ecb987"], ["#d9acbd", "#d3afc8", "#ceb2d1", "#ccb3d5", "#d0b1cf", "#dbabbb", "#e8a3a0", "#f39b83", "#fa996f", "#fba16d", "#f9b077", "#edba86"], ["#e5a3a5", "#dfa8b4", "#d8acc3", "#d5aecb", "#d7adc6", "#e0a8b3", "#eba199", "#f59a7d", "#fb986b", "#fca16c", "#f9b278", "#efbc86"], ["#ed9e91", "#e7a19f", "#e0a7b1", "#d9acc1", "#d9acc1", "#dfa9b5", "#e8a39f", "#f09d88", "#f79c77", "#f9a974", "#f8b67a", "#f1bf85"], ["#f19a86", "#eb9d92", "#e5a2a3", "#dea8b6", "#dcaabb", "#dfa8b4", "#e6a4a4", "#eda091", "#f3a181", "#f6ad7b", "#f6b97b", "#f3c283"], ["#f39881", "#ed9c8d", "#e89f9a", "#e1a5ac", "#dea8b4", "#e0a8b2", "#e4a5a7", "#eba397", "#f0a489", "#f4b17f", "#f6bb7d", "#f4c482"], ["#f3977e", "#ee9a8a", "#ea9d94", "#e4a2a3", "#e1a6ad", "#e1a7af", "#e4a5a8", "#e9a49c", "#eea78f", "#f3b383", "#f4bd7e", "#f2c582"], ["#f4957c", "#ee9986", "#e99d93", "#e5a09c", "#e5a19f", "#e79f99", "#ec9c8c", "#f09c81", "#f3a37b", "#f4b07c", "#f3bd7e", "#f2c481"], ["#f59479", "#ef9886", "#e79d95", "#e3a0a0", "#e49f9a", "#ed9985", "#f7916b", "#fa8b59", "#fa9e65", "#f6af73", "#f6bb7c", "#f2c37f"], ["#f49275", "#f19681", "#ea9c91", "#e69f9d", "#e79f99", "#ef9986", "#f9916c", "#fc8b58", "#fc9c63", "#f9ad71", "#f6b879", "#f3bf7b"], ["#f78f6f", "#f3947b", "#ed988a", "#e79d97", "#e79e97", "#ee9987", "#f7916e", "#fc8958", "#fd965e", "#fba86c", "#f8b475", "#f4bb78"], ["#f98b66", "#f68f71", "#f0947f", "#ea998d", "#e79b92", "#ec9887", "#f59172", "#fb895b", "#fc8e58", "#fba166", "#f9ae6f", "#f5b674"], ["#fb865c", "#f98963", "#f58e71", "#ed9480", "#e9988b", "#ea9688", "#f29177", "#fa8960", "#fc8652", "#fc995f", "#f9a86a", "#f6b16f"]], "src": "base44 split card 04/04 colour half, 2000px land-book rendition, card masked and filled from neighbours"};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function cubic(p0, p1, p2, p3, t) { return p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0))); }
export function drawBlend(canvas) {
  const W = 130; // a small bicubic image; the browser scales it up smoothly
  drawGrid(canvas, BLEND.grid, W, Math.round(W / BLEND.aspect));
}
// Any measured colour grid (rows of hex), drawn back smooth with bicubic interpolation (also the vault box, task 012).
export function drawGrid(canvas, grid, W, H) {
  const h = grid.length, w = grid[0].length, g = grid.map((r) => r.map(hex));
  const at = (x, y, k) => g[Math.max(0, Math.min(h - 1, y))][Math.max(0, Math.min(w - 1, x))][k];
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d'), img = ctx.createImageData(W, H);
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const gx = (px + 0.5) / W * w - 0.5, gy = (py + 0.5) / H * h - 0.5, x = Math.floor(gx), y = Math.floor(gy), tx = gx - x, ty = gy - y, o = (py * W + px) * 4;
    for (let k = 0; k < 3; k++) {
      const rows = [-1, 0, 1, 2].map((dy) => cubic(at(x - 1, y + dy, k), at(x, y + dy, k), at(x + 1, y + dy, k), at(x + 2, y + dy, k), tx));
      img.data[o + k] = Math.max(0, Math.min(255, cubic(rows[0], rows[1], rows[2], rows[3], ty)));
    }
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
export const blendSource = BLEND.src;
