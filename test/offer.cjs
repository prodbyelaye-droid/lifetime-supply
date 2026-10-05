const assert = require('node:assert/strict');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const {getOffer, PRICE_CHANGE, DRAW_CLOSE, CHECKOUT_599} = require('../lib/offer');
const {render} = require('../api/landing');

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
assert(!after.includes(CHECKOUT_599));
assert(!after.includes('$599'));
assert(!waiting.includes(CHECKOUT_599));
assert.equal((waiting.match(/data-checkout[^>]*>DM for lifetime access/g) || []).length, 4);
assert(!waiting.includes('offer-refresh-at'));
console.log('Offer boundary, draw close, currency, schema, all CTA URLs and missing-link fallback: passed.');
