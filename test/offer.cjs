const assert = require('node:assert/strict');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const {getOffer, PRICE_CHANGE, CHECKOUT_599} = require('../lib/offer');
const {render} = require('../api/landing');

assert.equal(new Date(PRICE_CHANGE).toISOString(), '2026-10-11T09:00:00.000Z');
assert.equal(getOffer(PRICE_CHANGE - 1).price, 599);
assert.equal(getOffer(PRICE_CHANGE).price, 699);
assert.equal(getOffer(PRICE_CHANGE - 1).refreshAt, PRICE_CHANGE);
assert.equal(getOffer(PRICE_CHANGE, CHECKOUT_599).checkoutUrl, 'https://instagram.com/elxyee');
assert.equal(getOffer(PRICE_CHANGE, 'https://example.com').checkoutUrl, 'https://instagram.com/elxyee');
assert.equal(getOffer(PRICE_CHANGE, 'javascript:alert(1)').checkoutUrl, 'https://instagram.com/elxyee');
const next = 'https://buy.stripe.com/Verified699TestLink'; // fixture, never served
assert.equal(getOffer(PRICE_CHANGE, next).checkoutUrl, next);
// The assembly embeds the verified current live offer. Legacy schedule helpers
// above remain tested, but cannot replace the assembled template's live links.
const fs = require('node:fs');
const template = fs.readFileSync('index.html', 'utf8');
const liveCheckout = 'https://buy.stripe.com/00w8wQdRa0NS5Ybbqa9AA04';
for (const now of [PRICE_CHANGE - 1, PRICE_CHANGE, Date.now()]) {
  const html = render(now, next);
  assert.equal(html, template, 'snapshot must survive historical transition logic');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.offers.priceCurrency, 'USD');
  assert.equal(Number(schema.offers.price), 699);
  assert.equal(schema.offers.url, liveCheckout);
  const checkouts = [...html.matchAll(/href="([^"]+)" data-checkout/g)].map(x => x[1]);
  assert.equal(checkouts.length, 3);
  assert(checkouts.every(url => url === liveCheckout));
  assert(html.includes('$699 usd. one payment. everything i add next is yours too.'));
  assert(html.includes('https://instagram.com/elxyee'));
  assert(!html.includes('$599'));
  assert(!html.includes('offer-refresh-at'));
}
const handler = require('../api/landing');
for (const method of ['GET', 'HEAD', 'POST']) {
  const result = {headers:{}};
  const res = {setHeader(k,v){result.headers[k]=v;},status(n){result.status=n;return this;},send(body){result.body=body;},end(){result.ended=true;}};
  handler({method},res);
  assert.equal(result.status, method==='POST'?405:200);
  if(method==='GET')assert.equal(result.body,template);
  if(method==='HEAD')assert.equal(result.body,'');
  if(method==='POST')assert.equal(result.headers.Allow,'GET, HEAD');
}
console.log('Legacy helper boundaries, assembled live offer, schema, three checkout CTAs and HTTP methods: passed.');
