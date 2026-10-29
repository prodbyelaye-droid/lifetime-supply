// Landing 012 (manager 03:26): Codex's GRADCODE ports replace the colour fields 010 had to leave out. Each module is a
// colour field measured from the original (GRADCODE/manifest.json: Gaussian colour stops, no image, video or blur),
// mounted in its deep variant (deep 1.25): price = grad-189 (189 original-01), deep = grad-183 (183 original.mp4;
// ?deep=sabo keeps 010's Sabo material for him to compare), footer = grad-005 (the 005 footer original; it replaces
// the MP4). They start still; 183 plays its measured clock for five seconds when it comes into view, as the module
// does. The pause control and the capture clock drive them too.
import {mount as m189} from './gradcode/grad-189.js';
import {mount as m183} from './gradcode/grad-183.js';
import {mount as m005} from './gradcode/grad-005.js';

export function mountGradcode(deepMode) {
  const out = [];
  const host = (parent, cls) => {
    const h = document.createElement('div');
    h.className = `gc ${cls}`; h.setAttribute('aria-hidden', 'true');
    parent.insertBefore(h, parent.firstChild);
    return h;
  };
  const stage = document.querySelector('.price-stage');
  if (stage) {
    out.push(m189(host(stage, 'gc-189'), {deep: 1.25}));
    // 015: 189's fine grain over its field (its hairlines and dot grid are the SVG in the markup), a fixed noise tile
    const n = document.createElement('canvas'); n.width = n.height = 192;
    const x = n.getContext('2d'), img = x.createImageData(192, 192);
    let seed = 189; const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < img.data.length; i += 4) { const v = rand() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 18; }
    x.putImageData(img, 0, 0);
    const grain = host(stage, 'pf-grain'); grain.style.backgroundImage = `url(${n.toDataURL()})`;
    stage.insertBefore(grain, stage.querySelector('.price-field'));
  }
  const field = document.querySelector('.deep-field');
  if (field && deepMode !== 'sabo') out.push(m183(host(field, 'gc-183'), {deep: 1.25}));
  const foot = document.querySelector('.footer-fluid');
  if (foot) { foot.querySelector('video')?.remove(); out.push(m005(host(foot, 'gc-005'), {deep: 1.25})); }
  return {
    renderAt(t) { for (const g of out) g.renderAt(t); },
    setPaused(v) { for (const g of out) v ? g.pause() : g.play(); },
  };
}
