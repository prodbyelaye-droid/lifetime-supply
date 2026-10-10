const assert = require('node:assert/strict');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const {getOffer, PRICE_CHANGE, DRAW_CLOSE, CHECKOUT_599} = require('../lib/offer');
const {render} = require('../api/landing');

assert.equal(PRICE_CHANGE - DRAW_CLOSE, 24 * 60 * 60 * 1000);
assert.equal(new Date(PRICE_CHANGE).toISOString(), '2026-10-11T09:00:00.000Z');
assert.equal(getOffer(PRICE_CHANGE - 1).price, 599);
assert.equal(getOffer(PRICE_CHANGE).price, 699);
assert.equal(getOffer(DRAW_CLOSE - 1).refreshAt, DRAW_CLOSE);
assert.equal(getOffer(DRAW_CLOSE).refreshAt, PRICE_CHANGE);
assert.match(getOffer(DRAW_CLOSE).giveawayLine, /closed/);
assert.equal(getOffer(PRICE_CHANGE, CHECKOUT_599).checkoutUrl, 'https://instagram.com/elxyee');
assert.equal(getOffer(PRICE_CHANGE, 'https://example.com').checkoutUrl, 'https://instagram.com/elxyee');
assert.equal(getOffer(PRICE_CHANGE, 'javascript:alert(1)').checkoutUrl, 'https://instagram.com/elxyee');
const next = 'https://buy.stripe.com/Verified699TestLink'; // fixture, never served
assert.equal(getOffer(PRICE_CHANGE, next).checkoutUrl, next);
const before = render(PRICE_CHANGE - 1);
const after = render(PRICE_CHANGE, next);
const waiting = render(PRICE_CHANGE);
for (const html of [before, after, waiting]) {
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.offers.priceCurrency, 'USD');
  assert(html.includes('$' + schema.offers.price.split('.')[0] + ' <span class="currency">USD'));
  const checkouts = [...html.matchAll(/href="([^"]+)" data-checkout/g)].map(x => x[1]);
  assert.equal(checkouts.length, 4);
  assert(checkouts.every(url => url === schema.offers.url));
}
const cardLine = html => html.match(/<p class="price-sub">([^<]*)<\/p>/)[1];
assert.equal(cardLine(before), 'until sunday 11 october 2026, 8 pm AEDT. then $699 USD.');
assert.equal(cardLine(after), '$699 USD. one payment, yours forever.');
assert.equal(cardLine(waiting), '$699 USD. one payment, yours forever. checkout is updating. DM me for access.');
assert.equal(before.split('$599 USD until sunday 11 october 2026 at 8 pm AEDT, then $699 USD').length - 1, 2, 'hero and FAQ keep their dated wording');
for (const html of [before, after, waiting]) {
  assert(html.includes('<details class="price-includes" open>'));
  assert.equal((html.match(/class="dm-line price-note"/g) || []).length, 1);
  for (const retired of ['all future updates', 'manual tracking', 'with you for the long run', 'placements are never guaranteed']) assert(!html.includes(retired), retired);
}
assert(!after.includes(CHECKOUT_599));
assert(!after.includes('$599'));
assert(!waiting.includes(CHECKOUT_599));
assert.equal((waiting.match(/data-checkout[^>]*>DM for lifetime access/g) || []).length, 4);
assert(!waiting.includes('offer-refresh-at'));
console.log('Offer boundary, draw close, currency, schema, all CTA URLs and missing-link fallback: passed.');
