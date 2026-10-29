#!/usr/bin/env node
/* Apply Elaye's picks to the landing (task 018).
 *   node scripts/apply-picks.cjs <picks.json> [siteDir]
 * siteDir defaults to the repo this script lives in. For every key in picks.json the pick becomes the default (set in
 * the markup where the page reads it), the ?switch is removed, and the unpicked option's markup, CSS, JS and assets are
 * deleted. Always: ?demo=window and the hero pixel glyphs are removed and ?how=191 is locked off; ?qa=1 stays (?deep=150
 * left the page in task 019).
 * A key missing from picks.json leaves that switch exactly as it is (the script says so).
 * Every edit is anchored: if an expected piece of code is not found exactly once, the script stops before writing
 * anything, so a later change to the page can never be half-applied. Copy picks (band text, footer lines) are not here. */
const fs = require('node:fs');
const path = require('node:path');

const OPTIONS = {flood: ['material', '183'], blot: ['original', 'lumps'], boxes: ['white', 'bloom'], vault: ['arch', 'bloom'], deep: ['183', 'sabo'],
  close: ['a', 'b', 'c', 'd'], pricetype: ['ink', 'white'], band: ['empty', 'text'], footblot: ['green', 'magenta'], links: ['film', 'hero'],
  downloads: ['hidden', 'shown']};

const [picksFile, siteArg] = process.argv.slice(2);
if (!picksFile) { console.error('usage: node scripts/apply-picks.cjs <picks.json> [siteDir]'); process.exit(2); }
const site = path.resolve(siteArg || path.join(__dirname, '..'));
const picks = JSON.parse(fs.readFileSync(picksFile, 'utf8'));
for (const [k, v] of Object.entries(picks)) {
  if (!OPTIONS[k]) throw new Error(`unknown key "${k}" (known: ${Object.keys(OPTIONS).join(', ')})`);
  if (!OPTIONS[k].includes(v)) throw new Error(`"${k}": "${v}" is not one of ${OPTIONS[k].join(' | ')}`);
}

// ---- files, held in memory until every edit has succeeded ----
const files = {}, removed = [], log = [];
const read = (f) => (files[f] ??= fs.readFileSync(path.join(site, f), 'utf8'));
function edit(f, from, to, why) {
  const s = read(f), n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`${f}: expected exactly one "${String(from).slice(0, 70)}", found ${n} (${why})`);
  files[f] = s.replace(from, () => to); log.push(`${f}: ${why}`);
}
function editRe(f, re, to, why) {
  const s = read(f), m = s.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')) || [];
  if (m.length !== 1) throw new Error(`${f}: expected exactly one match of ${re}, found ${m.length} (${why})`);
  files[f] = s.replace(re, to); log.push(`${f}: ${why}`);
}
function cut(f, start, end, why, keepEnd = true) { // remove from start up to end (end kept unless keepEnd is false)
  const s = read(f), a = s.indexOf(start), b = s.indexOf(end, a + 1);
  if (a < 0 || b < 0 || s.indexOf(start, a + 1) >= 0) throw new Error(`${f}: cannot find a single block "${start.slice(0, 50)}" … "${end.slice(0, 40)}" (${why})`);
  files[f] = s.slice(0, a) + s.slice(keepEnd ? b : b + end.length); log.push(`${f}: ${why}`);
}
const drop = (rel, why) => { if (fs.existsSync(path.join(site, rel))) removed.push([rel, why]); };

// ---- CSS: drop rules (or single selectors) that only serve an unpicked option, inside @media blocks too ----
const cssTests = [];
function splitSelectors(sel) { const out = []; let depth = 0, cur = ''; for (const ch of sel) { if ('([' .includes(ch)) depth++; if (')]'.includes(ch)) depth--; if (ch === ',' && !depth) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; }
function matchBrace(css, i) { let depth = 0, q = null; for (; i < css.length; i++) { const c = css[i]; if (q) { if (c === q && css[i - 1] !== '\\') q = null; continue; } if (c === '"' || c === "'") { q = c; continue; } if (css.startsWith('/*', i)) { i = css.indexOf('*/', i + 2) + 1; continue; } if (c === '{') depth++; else if (c === '}' && --depth === 0) return i; } throw new Error('unbalanced CSS'); }
function cssFilter(css, test) {
  let out = '', i = 0;
  while (i < css.length) {
    if (css.startsWith('/*', i)) { const e = css.indexOf('*/', i + 2) + 2; out += css.slice(i, e); i = e; continue; }
    const open = css.indexOf('{', i); if (open < 0) { out += css.slice(i); break; }
    const semi = css.indexOf(';', i);
    if (semi >= 0 && semi < open && css.slice(i, semi).trim().startsWith('@')) { out += css.slice(i, semi + 1); i = semi + 1; continue; }
    const prelude = css.slice(i, open), close = matchBrace(css, open), body = css.slice(open + 1, close), lead = prelude.match(/^\s*/)[0], head = prelude.trim();
    if (/^@(media|supports|container|layer)/.test(head)) { const inner = cssFilter(body, test); if (inner.replace(/\/\*[\s\S]*?\*\//g, '').trim()) out += lead + head + '{' + inner + '}'; else if (lead) out += lead; }
    else if (head.startsWith('@')) out += css.slice(i, close + 1);
    else { const keep = splitSelectors(head).filter((s) => !test(s.trim())); if (keep.length) out += lead + keep.map((s) => s.trim()).join(',') + '{' + body + '}'; else if (lead.includes('\n')) out += '\n'; }
    i = close + 1;
  }
  return out;
}
const dropCss = (why, ...needles) => cssTests.push({why, test: (sel) => needles.some((n) => sel.includes(n))});

// ================= always =================
// ?demo=window (the full-bleed film is approved)
edit('js/assembly.js', "// The film: full width by default; ?demo=window previews row 12's rounded glowing window.\nconst demo=createDemo(reduced,new URLSearchParams(location.search).get('demo')||'full');",
  "// The film: full width, not boxed (X13).\nconst demo=createDemo(reduced,'full');", 'remove the ?demo=window switch');
dropCss('?demo=window rules', '[data-variant="window"]');
// the hero pixel glyphs (155's symbols; off since task 004)
edit('js/assembly.js', "// 155's pixel symbols are a variant (task 004): LANDING.pixels, or ?pixels=on|face to preview.\nconst opening=createOpening(reduced,new URLSearchParams(location.search).get('pixels')||LANDING.pixels);",
  'const opening=createOpening(reduced);', 'remove the ?pixels switch');
cut('js/opening.js', "// 155's pixel symbols (the sparkle cross", '// Side blobs down the page', 'remove the pixel glyph code');
edit('js/opening.js', "export function createOpening(reduced, mode = 'off') {", 'export function createOpening(reduced) {', 'createOpening has no pixel mode');
cut('js/opening.js', "  const pix = mode === 'off' ? []", '\n\n', 'remove the pixel glyphs from the edge blots', true);
edit('js/landing-config.js', "/** @type {{hero: 'cloud' | 'full', pixels: 'off' | 'on' | 'face', features: 'family' | 'each'}} */\n// pixels: 155's little pixel symbols by the hero heading. A variant, off by default (task 004); ?pixels=on|face previews.\n// features: one gradient family across the boxes (default) or one liked gradient per box (task 004).\nexport const LANDING = {hero: 'cloud', pixels: 'off', features: 'family'};",
  "/** @type {{hero: 'cloud' | 'full'}} */\nexport const LANDING = {hero: 'cloud'};", 'drop the retired pixels and features settings');
dropCss('hero pixel glyph rules', '.ob .px');
// ?how=191 locked off (his "maybe"; the line can come back as copy)
editRe('index.html', /<span class="how-191">[^<]*<\/span>/, '', 'remove the ?how=191 line');
edit('js/assembly.js', "const sections=createSections(reduced,new URLSearchParams(location.search).get('how')||'off');", "const sections=createSections(reduced,'off');", 'lock ?how=191 off');
dropCss('?how=191 rules', '.how-191', '[data-how="191"]');

// ================= per pick =================
const said = [];
const pick = (k) => { if (!(k in picks)) { said.push(`${k}: not in picks.json, switch left as it is`); return null; } said.push(`${k}: ${picks[k]}`); return picks[k]; };

// flood: material | 183
const flood = pick('flood');
if (flood === '183') edit('js/flood.js', "mode183 = new URLSearchParams(location.search).get('flood') === '183'", 'mode183 = true', 'flood: GRADCODE 183 fill is the default');
if (flood === 'material') {
  cut('js/flood.js', '  // ?flood=183 (B): the same blot shapes', "\n  let geo = null", 'flood: remove the grad-183 fill path');
  edit('js/flood.js', "  gl.uniform1i(U('uProf'), 0);\n", "  gl.uniform1i(U('uProf'), 0);\n  gl.uniform1i(U('uGrad'), 1); gl.uniform1f(U('uMode'), 0);\n", 'flood: the texture slot stays unused');
  editRe('js/flood.js', /\n {4}if \(grad\) \{[^\n]*\}/, '', 'flood: no grad-183 upload per frame');
  edit('js/flood.js', '  if(uMode>.5){col=texture2D(uGrad,vec2(px.x/(uRes.x*uScale),(px.y-uMatTop)/uVh)).rgb;}\n  else if(px.y>uVis.x&&px.y<uVis.y){', '  if(px.y>uVis.x&&px.y<uVis.y){', 'flood: shader keeps only the material');
}
// blot: original | lumps
const blot = pick('blot');
if (blot === 'original') edit('js/assembly.js', " if(q.get('blot')==='lumps'){setShape('lumps');document.documentElement.dataset.blot='lumps';}\n", '', 'blot: the original edge is the only one');
if (blot === 'lumps') edit('js/assembly.js', " if(q.get('blot')==='lumps'){setShape('lumps');document.documentElement.dataset.blot='lumps';}", " setShape('lumps');document.documentElement.dataset.blot='lumps';", 'blot: the lumps are the default');
// boxes: white | bloom ; vault: arch | bloom
const boxes = pick('boxes'), vault = pick('vault');
if (boxes || vault) {
  const boxArg = boxes ? `'${boxes === 'bloom' ? 'bloom' : 'restraint'}'` : "new URLSearchParams(location.search).get('boxes')==='bloom'?'bloom':'restraint'";
  const vaultArg = vault ? `'${vault}'` : "new URLSearchParams(location.search).get('vault')==='bloom'?'bloom':'arch'";
  edit('js/assembly.js', "createFeatures(new URLSearchParams(location.search).get('boxes')==='bloom'?'bloom':'restraint',new URLSearchParams(location.search).get('vault')==='bloom'?'bloom':'arch');",
    `createFeatures(${boxArg},${vaultArg});`, `features: boxes ${boxes || '(switch kept)'}, vault ${vault || '(switch kept)'}`);
}
if (boxes === 'white') {
  for (const [name, mod] of [['g010', '010'], ['g044', '044'], ['g145', '145'], ['g037', '037']]) {
    edit('js/features.js', `import {mount as ${name}} from './gradcode/grad-${mod}.js';\n`, '', `boxes: drop the ${mod} bloom module`);
    drop(`js/gradcode/grad-${mod}.js`, 'boxes: white with ink (colour only in the vault)');
  }
  for (const [name, mod] of [['g183', '183'], ['g189', '189']])
    edit('js/features.js', `import {mount as ${name}} from './gradcode/grad-${mod}.js';\n`, '', `boxes: features no longer imports ${mod} (the module stays for its own section)`);
  edit('js/features.js', "const BOXES = [['f-how', 'how', g183, 'tr', 'green'], ['f-kit', 'kit', g044, 'tr'], ['f-board', 'board', g037, 'tr'], ['f-room', 'room', g189, 'tr'],\n  ['f-month', 'month', g010, 'tr'], ['f-forever', 'forever', g145, 'tr']];",
    "const BOXES = [['f-how', 'how', null, 'tr'], ['f-kit', 'kit', null, 'tr'], ['f-board', 'board', null, 'tr'], ['f-room', 'room', null, 'tr'],\n  ['f-month', 'month', null, 'tr'], ['f-forever', 'forever', null, 'tr']];", 'boxes: white with ink');
}
// deep: 183 | sabo
const deep = pick('deep');
if (deep) edit('js/assembly.js', "const deepMode=new URLSearchParams(location.search).get('deep');\nif(deepMode!=='sabo')document.querySelector('.deep-sabo')?.remove();", `const deepMode='${deep}';`, `deep: ${deep} is the default`);
if (deep === '183') {
  editRe('index.html', /<div class="deep-sabo"[^>]*><\/div>/, '', 'deep: remove the Sabo host');
  editRe('js/assembly.js', /\nif\(document\.querySelector\('\[data-material\]'\)\)import\('\.\/material\.js'\)[^\n]*/, '', 'deep: no material system to load');
  dropCss('deep: Sabo host and material fallback rules', '.deep-sabo', '[data-material]');
  for (const f of ['js/material.js', 'js/palettes.js', 'assets/assembly/three.core.js', 'assets/assembly/three.module.js', 'assets/assembly/THREE-LICENSE.txt', 'assets/assembly/material-still.jpg']) drop(f, 'deep: 183 (no Sabo material, no Three)');
}
if (deep === 'sabo') dropCss('deep: the 183 field offset (the tile is Sabo)', '.deep-field>.gc-183');
// close: a | b | c | d (d is 192 as it is, ?close=192)
const close = pick('close');
if (close) {
  edit('js/assembly.js', "{const v=new URLSearchParams(location.search).get('close');if(['a','b','c','d','192'].includes(v))document.querySelector('.close-call').dataset.variant=v==='192'?'d':v;if(v==='c')document.querySelector('.close-blot').dataset.colour='magenta';}\n", '', 'close: remove the switch');
  edit('index.html', 'class="close-call" id="close" data-section="close" data-variant="b"', `class="close-call" id="close" data-section="close" data-variant="${close}"`, `close: option ${close}`);
  editRe('index.html', /<svg class="close-b-art"[\s\S]*?<\/svg>/, '', 'close: remove the retired flat-circle art');
  dropCss('close: retired flat-circle art', '.close-b-art', '.cb-');
  for (const o of ['a', 'b', 'c', 'd'].filter((x) => x !== close)) dropCss(`close: option ${o} rules`, `.close-call[data-variant="${o}"]`);
  if (close !== 'a') { editRe('index.html', /<svg class="close-a-art"[\s\S]*?<\/svg>/, '', 'close: remove option a art'); dropCss('close: option a art', '.close-a-art', '.ca-'); }
  if (close === 'c') {
    edit('index.html', '<span class="close-blot" data-blot2="feature" data-colour="white"', '<span class="close-blot" data-blot2="feature" data-colour="magenta"', 'close: c keeps a coloured blot on its white card');
    edit('js/assembly.js', 'drawClose192(document.querySelector(\'.close-call\'));', '', 'close: c needs no 192 field');
  }
  if (close !== 'd') {
    edit('js/port012.js', "import {GRID192D} from './grid192d.js';\n", '', 'close: no 192 colours (option d) to import');
    drop('js/grid192d.js', `close: ${close} (192's own colours are option d)`);
    edit('js/port012.js', "section.dataset.variant === 'd' ? GRID192D : grid192()", 'grid192()', `close: ${close} draws the deep set`);
  } else {
    cut('js/port012.js', "// 015: 192's own variation on a 40 x 18 grid", "function rng(seed)", 'close: d needs no deep-set ranks (HUE192, LIT192, SET192)');
    edit('js/port012.js', "section.dataset.variant === 'd' ? GRID192D : grid192()", 'GRID192D', 'close: d draws 192 as it is');
  }
}
// downloads: hidden | shown (019; Codex 012: v1.0.0 has the cleanup bug and 1.0.1 fails Gatekeeper). The links stay.
const downloads = pick('downloads');
if (downloads) edit('js/assembly.js', "// 019: ?downloads=hidden hides the download section (Codex 012: the GitHub v1.0.0 build has the cleanup bug, and 1.0.1\n// fails Gatekeeper); the links stay as they are.\nif(new URLSearchParams(location.search).get('downloads')==='hidden')document.getElementById('portal').hidden=true;\n", '', 'downloads: remove the switch');
if (downloads === 'hidden') edit('index.html', '<section class="portal-section" id="portal" data-section="portal"', '<section class="portal-section" id="portal" data-section="portal" hidden', 'downloads: the section is hidden (links unchanged)');
// pricetype: ink | white
const pricetype = pick('pricetype');
if (pricetype) edit('js/assembly.js', "if(q.get('pricetype')==='white')document.documentElement.dataset.pricetype='white';", '', 'pricetype: remove the switch');
if (pricetype === 'ink') dropCss('pricetype: white-type rules', '[data-pricetype="white"]');
// band: empty | text
const band = pick('band');
if (band) edit('js/assembly.js', "if(q.get('band')==='text')document.documentElement.dataset.band='text';", '', 'band: remove the switch');
if (band === 'empty') { editRe('index.html', /<div class="band-text"[^>]*>[\s\S]*?<\/div>/, '', 'band: remove the band text'); dropCss('band: band-text rules', '.band-text', '[data-band="text"]'); }
// footblot: green | magenta
const footblot = pick('footblot');
if (footblot) edit('js/assembly.js', "if(q.get('footblot')==='magenta')document.querySelector('.footer-blob').dataset.colour='magenta';", '', 'footblot: remove the switch');
if (footblot === 'magenta') edit('index.html', '<span class="footer-blob" data-blot2="side" data-colour="green"', '<span class="footer-blob" data-blot2="side" data-colour="magenta"', 'footblot: magenta');
// links: film | hero
const links = pick('links');
if (links) edit('js/assembly.js', "\n if(q.get('links')!=='hero'){const m=document.querySelector('.hero-more'),d=document.querySelector('.demo');if(m&&d){m.classList.add('demo-links');d.append(m);}}", '', 'links: remove the switch');
if (links === 'film') {
  const html = read('index.html'), m = html.match(/<p class="hero-more">[\s\S]*?<\/p>/);
  if (!m) throw new Error('index.html: the hero links are missing (links)');
  edit('index.html', m[0], '', 'links: out of the hero');
  const moved = m[0].replace('<p class="hero-more">', '<p class="hero-more demo-links">');
  editRe('index.html', /(<section class="demo"[\s\S]*?)(<\/section>)/, (_, a, b) => a + moved + b, 'links: under the film');
}
// the html element carries the picked page-level options
const htmlAttrs = [pricetype === 'white' && 'data-pricetype="white"', band === 'text' && 'data-band="text"', blot === 'lumps' && 'data-blot="lumps"'].filter(Boolean);
if (htmlAttrs.length) edit('index.html', '<html lang="en">', `<html lang="en" ${htmlAttrs.join(' ')}>`, 'html: ' + htmlAttrs.join(' '));
// comments on the switch wiring follow the picks (module headers keep their history)
edit('js/assembly.js', "// Stats odometer, 34's liquid arch, and the How-it-works variant (?how=191).", "// Stats odometer and 34's liquid arch.", 'comment: ?how=191 is gone');
if (boxes && vault) edit('js/assembly.js', "// Features boxes (012): A, white with ink and colour only in the vault and one more (default); ?boxes=bloom gives each\n// box its own GRADCODE bloom from a corner.", `// Features (012): boxes ${boxes === 'bloom' ? 'each with a GRADCODE bloom' : 'white with ink'}, the vault ${vault === 'bloom' ? 'as a bloom into white' : 'with 155\'s arch'} (his picks).`, 'comment: features as picked');
if (close) edit('js/assembly.js', "// Closing call options (task 009, 019): ?close=a|b|c|192 (192 is option d), default b; read before its field is drawn.", `// The closing call is option ${close} (his pick, task 009).`, 'comment: closing as picked');
if (blot && links) edit('js/assembly.js', ` // 011: the original blot edge is the default; ?blot=lumps keeps 006's smooth lumps. The walkthrough links sit under the\n // film (his 19:34 "under the text in the walkthrough"); ?links=hero keeps them under the price.`, ` // 011: the ${blot === 'lumps' ? 'smooth lumps' : 'original blot edge'} and the walkthrough links ${links === 'film' ? 'under the film' : 'under the price'} (his picks).`, 'comment: blot and links as picked');
if (deep) {
  edit('js/assembly.js', "// 012: Deep is Codex's grad-183 by default; ?deep=sabo keeps 010's Sabo material (it must leave before the material\n// system collects its hosts).", `// Deep (012): ${deep === '183' ? "Codex's grad-183" : "010's Sabo material"} (his pick).`, 'comment: deep as picked');
  edit('js/assembly.js', "// 016: the Sabo material (and its 2 MB of Three) loads only when a host is on the page (?deep=sabo); the default page\n// has none. Until then, and without one, this stand-in answers every call.",
    deep === '183' ? '// No Sabo material on the page; this stand-in answers the page\'s material calls.' : '// 016: the Sabo material (and its 2 MB of Three) loads for the deep tile; until it has, this stand-in answers every call.', 'comment: material loading as picked');
}
// the parameter block's q goes once nothing reads it
if (!/q\.get\(/.test(read('js/assembly.js'))) edit('js/assembly.js', '{const q=new URLSearchParams(location.search);', '{', 'parameter block: nothing left to read');
// CSS
for (const f of ['css/assembly.css']) {
  if (!cssTests.length) break;
  const before = read(f);
  files[f] = cssFilter(before, (sel) => cssTests.some((t) => t.test(sel)));
  log.push(`${f}: dropped rules for ${cssTests.map((t) => t.why).join('; ')} (${before.length - files[f].length} bytes)`);
}

// ---- write, delete, report ----
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(site, f), s);
for (const [f] of removed) fs.rmSync(path.join(site, f));
const left = [];
const scan = ['js/assembly.js', 'js/flood.js', 'js/features.js', 'js/opening.js', 'js/demo.js', 'js/sections008.js'];
for (const f of scan) {
  if (!fs.existsSync(path.join(site, f))) continue;
  const code = fs.readFileSync(path.join(site, f), 'utf8').split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
  for (const m of code.matchAll(/get\('([a-z0-9]+)'\)/g)) if (m[1] !== 'qa' && m[1] !== 'data') left.push(`${f}: reads ?${m[1]}`);
}
console.log(`apply-picks: ${site}\n` + said.map((s) => '  ' + s).join('\n'));
console.log(`edits (${log.length}):\n` + log.map((s) => '  ' + s).join('\n'));
console.log(`removed files (${removed.length}):\n` + (removed.map(([f, w]) => `  ${f}  (${w})`).join('\n') || '  none'));
console.log(`switches still read by the page: ${left.length ? left.join('; ') : 'none apart from ?qa=1 (localhost only)'}`);
