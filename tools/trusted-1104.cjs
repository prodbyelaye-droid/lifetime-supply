#!/usr/bin/env node
/* Trusted-by artist strip 1104: writes the #trusted section into index.html from the artist list below and the photos
 * present in assets/trusted-1104/. Drop <slug>.webp (or .jpg/.jpeg/.png) in there and run:  node tools/trusted-1104.cjs
 * A tile with a photo shows it (object-fit: cover) with the name under it; a tile without one shows the name in type.
 *   --list   prints the file name each artist's photo should have
 *   --check  exits 1 if index.html is not what this script would write
 * Order is Elaye's: his 26 (15:56), then the 7 he added with his photos (17:17); three rows of 11, alternating direction
 * (css/trusted-1104.css). The line under the rows and his meme thumbnail are his (16:18). */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');
const DIR = 'assets/trusted-1104';
// Elaye 15:58, exact: "trusted by hundreds of the biggest industry artists in the whole game." (two display lines)
const HEADING = ["artists i've produced for."]; // 5 Nov plan section 11 (4-0, away from the price; his 15:58 line is retired)
const ARTISTS = ['Lil Durk', 'Tory Lanez', 'Yung Bleu', 'Antonio Brown', 'Toosii', 'Yungeen Ace', 'Glokknine', 'Jim Jones',
  'YFN Lucci', 'D Savage', 'Smiley', 'Foolio', 'DC The Don', 'A-Reece', 'Nasty C', 'YK Osiris', 'Lil Poppa', 'CJ',
  'Too $hort', 'ONEFOUR', 'Jai Waetford', 'Moneyman', 'OMB Peezy', 'KCAMP', 'Omeretta', 'Ann Marie',
  'Derez Deshon', 'FCG Heem', 'K-Trap', 'Kidszn', 'Krispylife Kidd', 'Slatt Zy', 'SSG Splurge'];
const ROWS = 3;
const SLUG = {'Too $hort': 'too-short'}; // names whose spelling does not make a clean file name
const MORE = 'not counting the unreleased artists in the vault.'; // 5 Nov plan section 11: right of the heading
const MEME = {file: `assets/trusted-1104/unreleased-music-meme.webp`, alt: 'meme: me carrying a giant backpack labelled unreleased music', w: 128, h: 161};
const START = '<!-- trusted-1104:start -->', END = '<!-- trusted-1104:end -->';
// just above the founder block (#founder in its sticky reveal track). Not after it: on a phone #founder's content is taller
// than its sticky 100vh box and runs past the track's end, which would sit on this heading.
const ANCHOR = '<section class="producer-wall" id="why-producers-choose"'; // after why i built it (plan order 10 -> 11)
const CSS = '<link rel="stylesheet" href="css/trusted-1104.css">', CSS_AFTER = '<link rel="stylesheet" href="css/blot-video-1104.css">';
const JS = '<script src="js/trusted-1104.js" defer></script>', JS_AFTER = '<script src="js/blot-video-1104.js" defer></script>';
if (ARTISTS.some((a) => /ysn\s*fab/i.test(a))) throw new Error('never YSN Fab');
if (new Set(ARTISTS).size !== ARTISTS.length) throw new Error('duplicate artist');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => SLUG[s] || s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const photo = (s) => ['webp', 'jpg', 'jpeg', 'png'].map((x) => `${DIR}/${s}.${x}`).find((f) => fs.existsSync(path.join(ROOT, f)));
if (process.argv.includes('--list')) {
  for (const a of ARTISTS) console.log(`${DIR}/${slug(a)}.jpg${photo(slug(a)) ? '  (present)' : ''}   ${a}`);
  process.exit(0);
}
const tile = (name) => {
  const s = slug(name), file = photo(s);
  if (!file) return `<li class="tr1104__tile" data-artist="${s}"><span class="tr1104__slot"><span class="tr1104__type">${esc(name)}</span></span></li>`;
  return `<li class="tr1104__tile" data-artist="${s}"><span class="tr1104__slot tr1104__slot--photo"><img src="${file}" alt="" width="376" height="376" loading="lazy" decoding="async"></span><span class="tr1104__name">${esc(name)}</span></li>`;
};
const per = Math.ceil(ARTISTS.length / ROWS);
const rows = Array.from({length: ROWS}, (_, i) => ARTISTS.slice(i * per, (i + 1) * per));
// the second copy of each set exists only for the seamless loop: aria-hidden, so a screen reader hears each name once
const row = (list, i) => {
  const set = list.map(tile).join('');
  return `<div class="tr1104__row" data-dir="${i % 2 ? 'right' : 'left'}" tabindex="0" role="region" aria-label="artists, row ${i + 1} of ${ROWS}"><div class="tr1104__track"><ul class="tr1104__set">${set}</ul><ul class="tr1104__set" aria-hidden="true">${set}</ul></div></div>`;
};
const meme = fs.existsSync(path.join(ROOT, MEME.file)) ? `<img class="tr1104__meme" src="${MEME.file}" alt="${esc(MEME.alt)}" width="${MEME.w}" height="${MEME.h}" loading="lazy" decoding="async">` : '';
const more = `<p class="tr1104__more">${meme}<span>${esc(MORE)}</span></p>`;
const block = `${START}\n<section class="tr1104" id="trusted" aria-labelledby="trusted-title"><div class="tr1104__head wrap"><h2 id="trusted-title" class="ls-heading-b ls-heading-b--step">${HEADING.map((l) => `<span class="ls-heading-b__line">${esc(l)}</span>`).join(' ')}</h2>${more}</div><div class="tr1104__rows">${rows.map(row).join('')}</div></section>\n${END}`;
const html = fs.readFileSync(HTML, 'utf8');
let next = html;
if (next.includes(START)) { // take the old block out (wherever it is), then place it again
  const a = next.indexOf(START), b = next.indexOf(END, a);
  if (b < 0) throw new Error('end marker missing');
  let e = b + END.length; if (next[e] === '\n') e++;
  next = next.slice(0, a) + next.slice(e);
}
if (next.split(ANCHOR).length !== 2) throw new Error('founder anchor not found exactly once');
next = next.replace(ANCHOR, block + '\n' + ANCHOR);
for (const [tag, after] of [[CSS, CSS_AFTER], [JS, JS_AFTER]]) {
  if (next.includes(tag)) continue;
  if (next.split(after).length !== 2) throw new Error('cannot place ' + tag);
  next = next.replace(after, after + '\n' + tag);
}
const photos = ARTISTS.filter((a) => photo(slug(a))).length;
if (process.argv.includes('--check')) {
  if (next !== html) { console.error('index.html is out of date: run node tools/trusted-1104.cjs'); process.exit(1); }
  console.log(`trusted-1104: up to date (${ARTISTS.length} artists, ${photos} photos)`);
} else {
  if (next !== html) { fs.writeFileSync(HTML + '.tmp', next); fs.renameSync(HTML + '.tmp', HTML); }
  console.log(`trusted-1104: wrote ${ARTISTS.length} tiles (${photos} with photos, ${ARTISTS.length - photos} as type)`);
}
