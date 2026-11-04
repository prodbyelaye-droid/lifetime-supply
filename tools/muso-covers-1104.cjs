#!/usr/bin/env node
/* Muso cover float 1104 (Elaye, 4 Nov 15:59): album covers of his placements floating at different depths behind the
 * muso.ai proof in #founder, drifting with the pointer and the scroll. Covers come only from Elaye, into
 * assets/muso-covers-1104/ (.jpg, .jpeg, .webp or .png; about 600 px square is plenty). Then run:
 *   node tools/muso-covers-1104.cjs          writes the layer into index.html (or takes it out)
 *   node tools/muso-covers-1104.cjs --check  exits 1 if index.html is not what this script would write
 * The layer is written only when 6 or more covers are present (the first 12 by file name are used). With fewer,
 * #founder is left exactly as it was. Motion lives in js/muso-float-1104.js, placement in css/muso-float-1104.css. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');
const DIR = 'assets/muso-covers-1104';
const MIN = 6, MAX = 12;
// depth per slot (css/muso-float-1104.css places slots 1-12; 1-6 are spread over the whole section first)
const DEPTH = [1.3, 1.4, 1.0, 1.2, 0.9, 0.7, 0.5, 1.1, 0.6, 0.8, 0.4, 0.5];
const START = '<!-- muso-covers-1104:start -->', END = '<!-- muso-covers-1104:end -->';
const ANCHOR = '<section class="founder-selected wrap" id="founder" data-section="founder" aria-labelledby="founder-title">\n';
const CSS = '<link rel="stylesheet" href="css/muso-float-1104.css">', CSS_AFTER = '<link rel="stylesheet" href="css/blot-video-1104.css">';
const JS = '<script src="js/muso-float-1104.js" defer></script>', JS_AFTER = '<script src="js/blot-video-1104.js" defer></script>';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function covers() {
  const dir = path.join(ROOT, DIR);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith('.') && /\.(jpe?g|webp|png)$/i.test(f)).sort((a, b) => a.localeCompare(b, 'en'));
}
// the layer markup for a list of image URLs (also used by the capture tool with stand-in images)
function layer(urls) {
  const items = urls.slice(0, MAX).map((src, i) => `<span class="mf1104__item" data-slot="${i + 1}" data-depth="${DEPTH[i]}"><img src="${esc(src)}" alt="" width="300" height="300" loading="lazy" decoding="async"></span>`);
  return `<div class="mf1104" aria-hidden="true">${items.join('')}</div>`;
}
module.exports = {layer, MIN, MAX};
if (require.main === module) {
  const files = covers();
  for (const f of files) {
    const size = fs.statSync(path.join(ROOT, DIR, f)).size;
    if (size > 700 * 1024) console.warn(`warning: ${DIR}/${f} is ${Math.round(size / 1024)} KB; about 600 px square at 80% quality is plenty`);
  }
  const on = files.length >= MIN;
  const block = on ? `${START}\n${layer(files.map((f) => `${DIR}/${encodeURI(f)}`))}\n${END}\n` : '';
  const html = fs.readFileSync(HTML, 'utf8');
  if (html.split(ANCHOR).length !== 2) throw new Error('#founder anchor not found exactly once');
  let next = html;
  if (next.includes(START)) {
    const a = next.indexOf(START), b = next.indexOf(END, a);
    if (b < 0) throw new Error('end marker missing');
    let e = b + END.length; if (next[e] === '\n') e++;
    next = next.slice(0, a) + block + next.slice(e);
  } else if (on) next = next.replace(ANCHOR, ANCHOR + block);
  for (const [tag, after] of [[CSS, CSS_AFTER], [JS, JS_AFTER]]) {
    if (next.includes(tag)) continue;
    if (next.split(after).length !== 2) throw new Error('cannot place ' + tag);
    next = next.replace(after, after + '\n' + tag);
  }
  const note = on ? `layer on, ${Math.min(files.length, MAX)} covers` : `layer off (${files.length} of ${MIN} covers needed)`;
  if (process.argv.includes('--check')) {
    if (next !== html) { console.error('index.html is out of date: run node tools/muso-covers-1104.cjs'); process.exit(1); }
    console.log(`muso-covers-1104: up to date (${note})`);
  } else {
    if (next !== html) { fs.writeFileSync(HTML + '.tmp', next); fs.renameSync(HTML + '.tmp', HTML); }
    console.log(`muso-covers-1104: ${note}`);
  }
}
