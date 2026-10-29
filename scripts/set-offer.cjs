#!/usr/bin/env node
/* Set the landing's offer (task 020): the launch week or the standard price, in one command.
 *   node scripts/set-offer.cjs --launch --link <stripe-url> [siteDir]     US$349 until Fri 6 Nov (midnight Sydney), then US$699
 *   node scripts/set-offer.cjs --standard --link <stripe-url> [siteDir]   US$699 (today: https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04)
 * It sets everything in GO-STEPS (c) at once: the four data-checkout hrefs, the JSON-LD offers.url, price and
 * priceValidUntil, the five visible prices and the launch-week lines, and the test constants that pin them (LIVE,
 * liveCheckout, the price assertions, check.cjs's link). Each place has a standard and a launch form; the script reads the
 * current state and link from the JSON-LD, and every edit must match exactly once, all in memory, before anything is
 * written. So --standard after --launch gives the original files back byte for byte. Wording: his 29 Oct terms, in the
 * research's safe form (no strikethrough, no "was", no percentage, no countdown). */
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const mode = args.includes('--launch') ? 'launch' : args.includes('--standard') ? 'standard' : null;
const link = args[args.indexOf('--link') + 1];
const site = path.resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--link') || path.join(__dirname, '..'));
if (!mode || args.includes('--launch') && args.includes('--standard') || !args.includes('--link')) {
  console.error('usage: node scripts/set-offer.cjs --launch|--standard --link https://buy.stripe.com/<id> [siteDir]'); process.exit(2);
}
if (!/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(link || '')) throw new Error(`--link must be a Stripe payment link (https://buy.stripe.com/<id>), got "${link}"`);

// [file, standard form, launch form, how many times it appears]; {L} is the checkout link
const SLOTS = [
  ['index.html', '      "price": "699.00",\n', '      "price": "349.00",\n      "priceValidUntil": "2026-11-06",\n', 1],
  ['index.html', '      "url": "{L}"\n    }', '      "url": "{L}"\n    }', 1],
  ['index.html', 'href="{L}" data-checkout', 'href="{L}" data-checkout', 4],
  ['index.html', '<p class="price-line">$699 USD. one payment, yours forever.</p>', '<p class="price-line">$349 USD this launch week, then $699. one payment, yours forever.</p>', 1],
  ['index.html', '<span class="mini-price">$699 <small>USD</small></span>', '<span class="mini-price">$349 <small>USD</small></span>', 1],
  ['index.html', '<span class="mini-note">one payment, in for life.</span>', '<span class="mini-note">this launch week, then $699. one payment, in for life.</span>', 1],
  ['index.html', '<div class="pixel" data-price="">$699 <span class="currency">USD</span></div>', '<div class="pixel" data-price="">$349 <span class="currency">USD</span></div>', 1],
  ['index.html', '<p class="price-sub">$699 USD. one payment, yours forever.</p>', '<p class="price-sub">launch week until fri 6 nov, midnight sydney. then $699. one payment, yours forever.</p>', 1],
  ['index.html', '<p>$699 USD. one payment, yours forever.</p><a class="close-cta"', '<p>$349 USD this launch week, then $699. one payment, yours forever.</p><a class="close-cta"', 1],
  ['test/offer-contract.cjs', "const LIVE = '{L}';", "const LIVE = '{L}';", 1],
  ['test/offer-contract.cjs', '  assert.equal(Number(schema.offers.price), 699);\n', "  assert.equal(Number(schema.offers.price), 349);\n  assert.equal(schema.offers.priceValidUntil, '2026-11-06');\n", 1],
  ['test/offer.cjs', "const liveCheckout = '{L}';", "const liveCheckout = '{L}';", 1],
  ['test/offer.cjs', '  assert.equal(Number(schema.offers.price), 699);\n', "  assert.equal(Number(schema.offers.price), 349);\n  assert.equal(schema.offers.priceValidUntil, '2026-11-06');\n", 1],
  ['test/offer.cjs', "  assert(html.includes('$699 USD. one payment, yours forever.'));", "  assert(html.includes('$349 USD this launch week, then $699. one payment, yours forever.'));", 1],
  ['test/landing.cjs', "const LIVE = '{L}';", "const LIVE = '{L}';", 1],
  ['scripts/check.cjs', "every(x=>x==='{L}')", "every(x=>x==='{L}')", 1],
];

const files = {};
const read = (f) => (files[f] ??= fs.readFileSync(path.join(site, f), 'utf8'));
// the current state and link, from the JSON-LD
const schema = JSON.parse(read('index.html').match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
const now = {'699.00': 'standard', '349.00': 'launch'}[schema.offers.price];
if (!now) throw new Error(`index.html: JSON-LD price is ${schema.offers.price}, neither 699.00 nor 349.00`);
const was = schema.offers.url;
const log = [], changed = new Set();
for (const [f, std, launch, n] of SLOTS) {
  const from = (now === 'launch' ? launch : std).replaceAll('{L}', was), to = (mode === 'launch' ? launch : std).replaceAll('{L}', link);
  const s = read(f), found = s.split(from).length - 1;
  if (found !== n) throw new Error(`${f}: expected ${n} × "${from.slice(0, 70)}", found ${found}; nothing written`);
  if (from !== to) { files[f] = s.split(from).join(to); changed.add(f); log.push(`${f}: ${n} × ${from.slice(0, 48).replace(/\n/g, ' ')}…`); }
}
for (const f of changed) fs.writeFileSync(path.join(site, f), files[f]);
console.log(`set-offer: ${site}\n  ${now} (${was}) -> ${mode} (${link})\n  edits (${log.length}):\n` + (log.map((l) => '    ' + l).join('\n') || '    none, already set'));
